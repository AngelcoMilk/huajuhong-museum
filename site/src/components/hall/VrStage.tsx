import { useEffect, useRef, useState } from 'react'
import '../../styles/hall.css'
import type { VrScene } from '../../types/hall'
import { useDialog } from './useDialog'

/** 超过这个时间 iframe 还没载完，就给出重试 */
const SLOW_AFTER = 20000
/** iframe 载完后全景还要画第一帧，遮罩多留一会儿，免得露出黑屏 */
const SETTLE = 1200

type Props = {
  open: boolean
  scene?: VrScene | null
  onClose: () => void
}

/**
 * 全景弹层：站内 iframe 嵌官网委托第三方（酷雷曼）制作的全景导览。
 * 不爬切片、不落全景数据——iframe 嵌入原站播放页，不爬取。
 * 每个场景只开自己的单场页（pano.html?tileserver=…）；没有地址就说打不开，不退回总入口。
 */
export default function VrStage({ open, scene, onClose }: Props) {
  const closeRef = useDialog(open, onClose)
  const boxRef = useRef<HTMLDivElement | null>(null)
  const [phase, setPhase] = useState<'loading' | 'settling' | 'ready' | 'slow'>('loading')
  const [attempt, setAttempt] = useState(0)
  const src = scene?.panoUrl ?? ''

  useEffect(() => {
    if (!open || !src) return
    setPhase('loading')
    const timer = window.setTimeout(() => setPhase((current) => (current === 'loading' ? 'slow' : current)), SLOW_AFTER)
    return () => window.clearTimeout(timer)
  }, [open, src, attempt])

  useEffect(() => {
    if (phase !== 'settling') return
    const timer = window.setTimeout(() => setPhase('ready'), SETTLE)
    return () => window.clearTimeout(timer)
  }, [phase])

  // 跨域 iframe 拿到焦点后，按键到不了外层，Esc 就失效了：点过画面就把焦点收回弹层，拖动不受影响
  useEffect(() => {
    if (!open) return
    function onBlur() {
      window.setTimeout(() => {
        if (document.activeElement?.tagName === 'IFRAME') boxRef.current?.focus({ preventScroll: true })
      }, 0)
    }
    window.addEventListener('blur', onBlur)
    return () => window.removeEventListener('blur', onBlur)
  }, [open])

  if (!open) return null

  const heading = scene?.title ?? '全景'

  return (
    <div className="hall-stage" role="dialog" aria-modal="true" aria-labelledby="hall-stage-title">
      <div className="hall-stage__box" ref={boxRef} tabIndex={-1}>
        <header className="hall-stage__head">
          <h2 className="hall-stage__title" id="hall-stage-title">
            {heading}
          </h2>
          <button type="button" className="hall-stage__close" ref={closeRef} onClick={onClose}>
            关闭
          </button>
        </header>

        <div className="hall-stage__frame">
          {src ? (
            <iframe
              key={src + attempt}
              src={src}
              title={heading + ' · 全景'}
              allow="fullscreen; accelerometer; gyroscope; xr-spatial-tracking"
              allowFullScreen
              referrerPolicy="origin"
              onLoad={() => setPhase('settling')}
            />
          ) : null}

          {!src ? (
            <div className="hall-stage__veil" role="alert">
              <b>这个全景打不开</b>
            </div>
          ) : phase !== 'ready' ? (
            <div
              className={'hall-stage__veil' + (phase === 'settling' ? ' is-through' : '')}
              role={phase === 'slow' ? 'alert' : 'status'}
            >
              {scene?.thumbLocal ? <img src={scene.thumbLocal} alt="" aria-hidden="true" /> : null}
              <b>{phase === 'slow' ? '全景还没打开' : '正在载入全景'}</b>
              {phase === 'slow' ? (
                <button type="button" className="hall-stage__retry" onClick={() => setAttempt((count) => count + 1)}>
                  重试
                </button>
              ) : (
                <span className="hall-stage__spin" aria-hidden="true" />
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
