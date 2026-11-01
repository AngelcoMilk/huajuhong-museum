import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router'
import { LoadState, NextHall, SectionHead, StatBar } from '../components/exhibit/Exhibit'
import { useReveal } from '../lib/useReveal'
import '../styles/craft.css'

// 3D 动画用本地构建：cd process-3d && npx vite build --base /craft-3d/ --outDir ../site/public/craft-3d --emptyOutDir
// 改了 process-3d/src 要重跑。?embed：铺满容器、不占外层页面的后退记录、接受暂停、回报状态（process-3d/src/app.ts）
const STAGE_URL = '/craft-3d/index.html?embed'

// iframe 载完后这么久还没画出第一帧，就当失败
const STAGE_TIMEOUT = 45000

const STATS = [
  { value: '4', unit: '种', label: '古法做法' },
  { value: '5', unit: '台', label: '现代机器' },
  { value: '13', unit: '道', label: '现代工序' },
  { value: '100 → 约 4', unit: '斤', label: '鲜果 → 七爪干皮' },
]

type Machine = {
  id: string
  hand: string
  name: string
  note: string
}

const MACHINES: Machine[] = [
  { id: 'qizhua', hand: '割瓣', name: '七爪等分切瓣机', note: '单刀，果每转 1/7 圈切一刀，七次成七爪。现场割瓣仍是 8–10 人围桌手工。' },
  { id: 'qunang', hand: '去瓤', name: '旋挖去囊机', note: '旋转刀杆带两把弹性刀片，挖去果瓤。尚未商品化，只有样机与专利。' },
  { id: 'yaguo', hand: '压果', name: '化橘红压果机', note: '垂直缸把圆果压扁，水平缸推入后模，压成圆柱。' },
  { id: 'hongfang', hand: '烘干', name: '智能烘房', note: '七爪果皮 45→70℃ 分段烘干，约 22 小时。整果约 4 天一批。' },
  { id: 'qiepian', hand: '切片', name: '压果切片机', note: '气缸压料，单把旋刀切片。' },
]

// 机器图里低于这个字号的文字一律抬上来
const PLATE_MIN_FONT = 13
// 机器图再宽也不超过视口这个比例的高度，一屏能看全
const PLATE_SVG_HEIGHT = 0.62
// 机器图量出高度之前先用它撑住，免得切换时整块塌下去
const PLATE_PLACEHOLDER = 480
// 箭头按钮高 52，对准机器图中心要减掉一半
const ARROW_HALF = 26
// 窄屏两侧箭头回到顶部一行，不再跟图居中
const NARROW_MAX = 860

function hasWebGL() {
  try {
    const canvas = document.createElement('canvas')
    return !!(canvas.getContext('webgl2') ?? canvas.getContext('webgl'))
  } catch {
    return false
  }
}

function Stage() {
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const frameRef = useRef<HTMLIFrameElement | null>(null)
  const [webgl] = useState(hasWebGL)
  const [src, setSrc] = useState<string | undefined>()
  const [frameLoaded, setFrameLoaded] = useState(false)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)
  const [home, setHome] = useState(true)
  const [immersive, setImmersive] = useState(false)

  // 3D 建场景会占住主线程：等加载态画出来再开始
  useEffect(() => {
    if (!webgl) return
    const id = window.requestAnimationFrame(() => window.setTimeout(() => setSrc(STAGE_URL), 0))
    return () => window.cancelAnimationFrame(id)
  }, [webgl])

  // 第一帧画好才揭开；之后它会报告是否在入口页
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== frameRef.current?.contentWindow) return
      if (event.data?.type !== 'craft-3d') return
      setReady(true)
      setHome(!!event.data.home)
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  useEffect(() => {
    if (!frameLoaded || ready) return
    const id = window.setTimeout(() => setFailed(true), STAGE_TIMEOUT)
    return () => window.clearTimeout(id)
  }, [frameLoaded, ready])

  // 滚出视口就停渲染和声音
  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap || !ready || !('IntersectionObserver' in window)) return
    const observer = new IntersectionObserver((entries) => {
      const visible = entries[entries.length - 1].isIntersecting
      frameRef.current?.contentWindow?.postMessage(visible ? 'craft-3d:resume' : 'craft-3d:pause', window.location.origin)
    })
    observer.observe(wrap)
    return () => observer.disconnect()
  }, [ready])

  useEffect(() => {
    if (!immersive) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setImmersive(false)
    }
    window.addEventListener('keydown', onKey)
    document.documentElement.classList.add('craft-locked')
    return () => {
      window.removeEventListener('keydown', onKey)
      document.documentElement.classList.remove('craft-locked')
    }
  }, [immersive])

  // 焦点进了 iframe，外层就收不到按键：Esc（退出全屏）和左右键（切机器）转出来
  const onFrameLoad = () => {
    if (!src) return
    setFrameLoaded(true)
    try {
      frameRef.current?.contentWindow?.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' || event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
          window.dispatchEvent(new KeyboardEvent('keydown', { key: event.key }))
        }
      })
    } catch {
      // 资源没取到时 iframe 是浏览器错误页，算跨域；由 STAGE_TIMEOUT 走失败态
    }
  }

  const scrollDown = () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    document.getElementById('craft-data')?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' })
  }

  if (!webgl || failed) {
    return (
      <div className="craft-stage">
        <div className="craft-stage__view craft-stage__state">
          {webgl ? (
            <LoadState
              state="error"
              title="3D 动画没有载入"
              action={<button type="button" className="btn" onClick={() => window.location.reload()}>重新载入</button>}
            />
          ) : (
            <LoadState state="error" title="这台设备无法显示 3D 动画" hint="需要浏览器开启 WebGL。" />
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={'craft-stage' + (immersive ? ' is-immersive' : '') + (ready ? ' is-ready' : '')} ref={wrapRef}>
      <div className="craft-stage__view">
        <iframe ref={frameRef} src={src} title="化橘红四种古法做法 · 3D 动画" allow="autoplay; fullscreen" onLoad={onFrameLoad} />
        <div className="craft-loader" aria-hidden={ready}>
          <span className="craft-loader__seal zhu zhu--lg" aria-hidden="true">橘</span>
          <span className="craft-loader__line" aria-hidden="true" />
          <LoadState state="loading" title="正在载入" />
        </div>
        {ready && home && !immersive ? (
          <button type="button" className="craft-stage__down" aria-label="看下一部分" onClick={scrollDown}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 9l7 7 7-7" /></svg>
          </button>
        ) : null}
        {immersive ? (
          <button type="button" className="craft-stage__exit" onClick={() => setImmersive(false)}>退出全屏</button>
        ) : null}
      </div>
      {!immersive ? (
        <button type="button" className="btn craft-stage__enter" onClick={() => setImmersive(true)}>全屏观看</button>
      ) : null}
    </div>
  )
}

/** 一台机器图：自包含的本地页，去掉页边、页脚和操作提示，高度跟内容走，不出内层滚动条 */
function MachineLayer({ machine, active, height, onHeight, onReady }: {
  machine: Machine
  active: boolean
  height?: number
  onHeight: (id: string, value: number) => void
  onReady: (id: string) => void
}) {
  const observerRef = useRef<ResizeObserver | null>(null)

  useEffect(() => () => observerRef.current?.disconnect(), [])

  const onLoad = (event: React.SyntheticEvent<HTMLIFrameElement>) => {
    const doc = event.currentTarget.contentDocument
    const win = event.currentTarget.contentWindow
    if (!doc || !win) return
    const style = doc.createElement('style')
    const paper = getComputedStyle(document.documentElement).getPropertyValue('--paper-hi')
    style.textContent = `html,body{overflow:hidden;background:${paper}}.iso-page{width:100%;margin:0}.iso-figure{margin:0}.iso-plate{box-shadow:none}.iso-figure>figcaption,.series-note,.series-foot,.iso-plate-corner[data-corner="fig"],.iso-plate-corner[data-corner="hint"]{display:none}.iso-svg{max-height:${Math.round(window.innerHeight * PLATE_SVG_HEIGHT)}px}@media (max-width:560px){.iso-plate-corner[data-corner="readout"]{left:12px;right:12px;text-align:right;white-space:normal;letter-spacing:0}}`
    doc.body.append(style) // 放在 body 末尾：机器图自己的样式写在 main 里，要排在它后面才盖得住
    doc.querySelectorAll<HTMLElement>('.iso-plate *').forEach((node) => {
      if (node.closest('svg')) return
      if (parseFloat(win.getComputedStyle(node).fontSize) < PLATE_MIN_FONT) node.style.fontSize = PLATE_MIN_FONT + 'px'
    })
    const page = doc.querySelector('.iso-page') ?? doc.body
    const report = () => onHeight(machine.id, Math.ceil(page.getBoundingClientRect().height))
    observerRef.current?.disconnect()
    observerRef.current = new ResizeObserver(report)
    observerRef.current.observe(page)
    report()
    onReady(machine.id)
  }

  return (
    <div
      className={'craft-layer' + (active ? ' is-active' : '')}
      id={'machine-' + machine.id}
      role="tabpanel"
      aria-labelledby={'craft-tab-' + machine.id}
      aria-hidden={!active}
      inert={!active}
    >
      <iframe src={'/machines/' + machine.id + '.html'} title={machine.name + ' · 等轴测交互图'} style={{ height }} onLoad={onLoad} />
    </div>
  )
}

function Machines() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const plateRef = useRef<HTMLDivElement | null>(null)
  const tabsRef = useRef<HTMLDivElement | null>(null)
  const indicatorRef = useRef<HTMLSpanElement | null>(null)

  // 讲解员深链 /craft#machine-yaguo：首屏就落在目标台，别先亮第 1 台
  const { hash, key } = useLocation()
  const initialIndex = Math.max(0, MACHINES.findIndex((item) => '#machine-' + item.id === hash))
  const firstId = MACHINES[initialIndex].id

  const [active, setActive] = useState(initialIndex)
  // shown 是「画面上正在显示哪一台」：没加载过的台先沿用旧图，载完再换，不留白
  const [shown, setShown] = useState(initialIndex)
  const [mounted, setMounted] = useState<string[]>([firstId])
  const [heights, setHeights] = useState<Record<string, number>>({})
  const [ready, setReady] = useState<Record<string, boolean>>({})
  const [indicatorLeft, setIndicatorLeft] = useState(0)
  const [narrow, setNarrow] = useState(() => window.matchMedia('(max-width: ' + NARROW_MAX + 'px)').matches)

  const count = MACHINES.length
  const machine = MACHINES[active]
  const shownMachine = MACHINES[shown]
  const shownHeight = heights[shownMachine.id]

  const onHeight = useCallback((id: string, value: number) => {
    setHeights((prev) => (prev[id] === value ? prev : { ...prev, [id]: value }))
  }, [])

  const onReady = useCallback((id: string) => {
    setReady((prev) => (prev[id] ? prev : { ...prev, [id]: true }))
  }, [])

  const goTo = useCallback((index: number) => {
    const target = MACHINES[index]
    setActive(index)
    setMounted((prev) => (prev.includes(target.id) ? prev : [...prev, target.id]))
    // 焦点在标签栏里时，切完把焦点一起带过去，读屏和焦点环才跟得上
    const focus = document.activeElement
    if (focus instanceof HTMLElement && focus.closest('.craft-tabs')) {
      document.getElementById('craft-tab-' + target.id)?.focus()
    }
  }, [])

  const step = useCallback((delta: number) => {
    goTo((active + delta + count) % count)
  }, [active, count, goTo])

  // 目标台载好了才换画面；已加载的台就是一步到位
  useEffect(() => {
    if (ready[machine.id]) setShown(active)
  }, [active, machine.id, ready])

  // 第一台先挂上，其余等机器区快进视口再逐台预加载：省流量，也别跟 3D 建场景抢主线程
  useEffect(() => {
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    if (connection?.saveData) return // 省流量模式只加载当前这台
    const rest = MACHINES.map((item) => item.id).filter((id) => id !== firstId)
    // 窄屏只预热下一台，别一口气拉四个文档
    const queue = window.matchMedia('(max-width: ' + NARROW_MAX + 'px)').matches ? rest.slice(0, 1) : rest
    let index = 0
    let timer = 0
    let cancelled = false
    const tick = () => {
      if (cancelled || index >= queue.length) return
      const id = queue[index]
      index += 1
      setMounted((prev) => (prev.includes(id) ? prev : [...prev, id]))
      timer = window.setTimeout(tick, 420)
    }
    const start = () => { timer = window.setTimeout(tick, 200) }
    let observer: IntersectionObserver | undefined
    const section = sectionRef.current
    if (section && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver((entries) => {
        if (!entries[entries.length - 1].isIntersecting) return
        observer?.disconnect()
        observer = undefined
        start()
      }, { rootMargin: '400px 0px' })
      observer.observe(section)
    } else {
      start()
    }
    return () => {
      cancelled = true
      observer?.disconnect()
      window.clearTimeout(timer)
    }
  }, [firstId])

  // 讲解员带到某一台：/craft#machine-qizhua，选中并滚到机器区
  useEffect(() => {
    const index = MACHINES.findIndex((item) => '#machine-' + item.id === hash)
    if (index < 0) return
    goTo(index)
    // html 上有 scroll-behavior: smooth，3D 占着主线程时平滑滚动会停在半路，这里直接到位
    sectionRef.current?.scrollIntoView({ behavior: 'instant' })
  }, [hash, key, goTo])

  // 左右键：机器区在视口里、焦点不在输入框时切换。焦点在机器图里时，方向键归机器图自己
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return
      const focus = document.activeElement
      if (focus instanceof HTMLElement && (focus.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(focus.tagName))) return
      const rect = sectionRef.current?.getBoundingClientRect()
      if (!rect || rect.top > window.innerHeight * 0.6 || rect.bottom < window.innerHeight * 0.4) return
      event.preventDefault()
      step(event.key === 'ArrowRight' ? 1 : -1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [step])

  // 选中三角跟着标签滑动，不再瞬跳
  const moveIndicator = useCallback(() => {
    const host = tabsRef.current
    const tab = host?.querySelector<HTMLButtonElement>('#craft-tab-' + MACHINES[active].id)
    if (!host || !tab) return
    const hostRect = host.getBoundingClientRect()
    const tabRect = tab.getBoundingClientRect()
    setIndicatorLeft(Math.round(tabRect.left - hostRect.left + tabRect.width / 2 - 8))
  }, [active])

  useLayoutEffect(() => {
    moveIndicator()
    const onResize = () => moveIndicator()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [moveIndicator])

  // 窄屏两侧箭头回到顶部那一行
  useEffect(() => {
    const query = window.matchMedia('(max-width: ' + NARROW_MAX + 'px)')
    const update = () => setNarrow(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  const toggleFullscreen = useCallback(() => {
    const panel = plateRef.current
    if (!panel) return
    if (document.fullscreenElement) {
      void document.exitFullscreen()
      return
    }
    void panel.requestFullscreen?.()
  }, [])

  // 箭头对准机器图垂直中心；图高变了就跟着走，和高度过渡同一个时长
  const arrowTop = narrow ? 0 : Math.max(0, Math.round((shownHeight ?? PLATE_PLACEHOLDER) / 2 - ARROW_HALF))

  return (
    <section className="craft-machines" id="machines" ref={sectionRef}>
      <SectionHead title="五台现代机器" />
      <div className="craft-tabs" role="tablist" aria-label="五台现代机器" ref={tabsRef}>
        <span
          className="craft-tabs__indicator"
          aria-hidden="true"
          ref={indicatorRef}
          style={{ transform: 'translate3d(' + indicatorLeft + 'px, 0, 0) rotate(45deg)' }}
        />
        {MACHINES.map((item, index) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            id={'craft-tab-' + item.id}
            aria-selected={index === active}
            aria-controls={'machine-' + item.id}
            className={'craft-tab' + (index === active ? ' is-on' : '')}
            onClick={() => goTo(index)}
          >
            <img src={'/img/machines/' + item.id + '.png'} alt="" width="276" height="206" />
            <span className="craft-tab__hand">{item.hand}</span>
            <b className="craft-tab__name">{item.name}</b>
          </button>
        ))}
      </div>
      <div className="craft-viewer">
        <button
          type="button"
          className="craft-arrow craft-arrow--prev"
          aria-label="上一台"
          style={{ marginTop: arrowTop }}
          onClick={() => step(-1)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
        </button>
        <div className="craft-plate" id="craft-plate" ref={plateRef}>
          <div className="craft-plate__figure" aria-busy={!ready[machine.id]}>
            <div className="craft-layers" style={shownHeight ? { height: shownHeight } : undefined}>
              {mounted.map((id) => {
                const item = MACHINES.find((entry) => entry.id === id)
                if (!item) return null
                return (
                  <MachineLayer
                    key={id}
                    machine={item}
                    active={item.id === shownMachine.id}
                    height={heights[id]}
                    onHeight={onHeight}
                    onReady={onReady}
                  />
                )
              })}
            </div>
            <div className={'craft-plate__state' + (ready[machine.id] ? ' is-off' : '')} aria-hidden={!!ready[machine.id]}>
              <LoadState state="loading" title="正在载入机器图" />
            </div>
          </div>
          <div className="craft-plate__bar">
            <p><b>{shownMachine.name}</b>{shownMachine.note}</p>
            <button type="button" className="btn" onClick={toggleFullscreen}>全屏</button>
          </div>
        </div>
        <div className="craft-viewer__next" style={{ marginTop: arrowTop }}>
          <button type="button" className="craft-arrow" aria-label="下一台" onClick={() => step(1)}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
          </button>
          <span className="craft-viewer__count" aria-live="polite">{shown + 1} / {count}</span>
        </div>
      </div>
    </section>
  )
}

// 工艺厅：3D 动画 → 数据带 → 五台机器 → 下一展厅
export default function Craft() {
  useReveal()
  const { hash, key } = useLocation()

  // 讲解员带到机器区：/craft#machines
  useEffect(() => {
    if (hash === '#machines') document.getElementById('machines')?.scrollIntoView({ behavior: 'instant' })
  }, [hash, key])

  return (
    <div className="craft">
      <Stage />
      <h1 className="sr-only">工艺</h1>
      <div className="craft-band" id="craft-data">
        <StatBar items={STATS} />
      </div>
      <Machines />
      <NextHall to="/enterprises" name="企业地图" note="12 个镇街 · 34 家企业" cover="/img/board-ent.jpg" />
    </div>
  )
}
