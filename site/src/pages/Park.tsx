import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router'
import { cnNumber, HallOpen, NextHall, StatBar } from '../components/exhibit/Exhibit'
import ArticleMeta from '../components/hall/ArticleMeta'
import HallBlocks from '../components/hall/HallBlocks'
import VrStage from '../components/hall/VrStage'
import VrWall from '../components/hall/VrWall'
import { PARK_STATS, parkAnchorOf } from '../data/park'
import { useParkContent, useVrGroups, type ContentItem, type ParkColumn } from '../lib/hallContent'
import type { VrScene } from '../types/hall'
import { trackItem } from '../lib/track'
import { useReveal } from '../lib/useReveal'
import '../styles/park.css'

// 回落内容的数据条：种植面积逐年在变，写明口径年份
const FALLBACK_STATS = PARK_STATS.map((stat) => (stat.value === '10.2' ? { ...stat, label: '园区种植面积 · 2022' } : stat))
const FALLBACK_LEAD = '化橘红产业园，2022 年园内种植面积 10.2 万亩，占全市 90.2% 以上。'

// 全景场景墙自己的一节，id 与其余栏目同一套锚点规则。
const SCENES = 'scenes'

const CN_NUM = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十']

/** 正文块里已经出现过的插图，图集里就不再重复摆一遍（只有回落内容有 images） */
function unusedImages(section: ContentItem) {
  const used = new Set(section.blocks.map((block) => (block.kind === 'img' ? block.src : null)))
  return (section.images ?? []).filter((image) => !used.has(image.url))
}

export default function Park() {
  useReveal()
  const { hash, key } = useLocation()
  const { items: columns, head } = useParkContent()
  const allGroups = useVrGroups()
  const groups = allGroups.filter((group) => group.page === 'park')
  const museumGroups = allGroups.filter((group) => group.page === 'museum')
  // 栏目导读：编号跟着后台排序走，末了固定一处全景漫游，不占栏目编号。
  const nav = useMemo(
    () => [
      ...columns.map((column, index) => ({
        id: column.id,
        label: column.title,
        no: cnNumber(index + 1),
      })),
      { id: SCENES, label: '全景漫游', no: '◎' },
    ],
    [columns],
  )
  const navKey = nav.map((item) => item.id).join(' ')
  // 同一时间只展开一栏：页面高度稳定，滚起来不至于是十几屏。
  const [openId, setOpenId] = useState<string | null>(null)
  const [activeId, setActiveId] = useState<string>(nav[0]?.id ?? '')
  const [scene, setScene] = useState<VrScene | null>(null)

  useEffect(() => {
    if (openId) trackItem(openId)
  }, [openId])
  useEffect(() => {
    if (scene) trackItem(scene.id)
  }, [scene])

  // 栏目高亮：展开哪栏就点亮哪栏；都收起时跟着滚动位置走。
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return
    const ids = navKey.split(' ')
    const nodes = ids.map((id) => document.getElementById(parkAnchorOf(id))).filter(
      (node): node is HTMLElement => node !== null,
    )
    if (nodes.length === 0) return

    const seen = new Set<string>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = (entry.target as HTMLElement).dataset.parkId
          if (!id) continue
          if (entry.isIntersecting) seen.add(id)
          else seen.delete(id)
        }
        const current = ids.find((id) => seen.has(id))
        if (current) setActiveId(current)
      },
      { rootMargin: '-18% 0px -46% 0px', threshold: 0 },
    )

    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [navKey])

  // 带 #yq-xxx 进来时直接落到对应节：命中某一栏就顺手展开它，
  // 否则滚过去只看到一行收起的摘要。非法 hash（如 #%）不算错误，直接忽略。
  useEffect(() => {
    if (!hash) return
    const raw = hash.slice(1)
    if (!raw) return
    let anchor = raw
    try {
      anchor = decodeURIComponent(raw)
    } catch {
      anchor = raw
    }
    const target = document.getElementById(anchor)
    if (!target) return
    const matched = navKey.split(' ').find((id) => id !== SCENES && parkAnchorOf(id) === anchor)
    if (matched) setOpenId(matched)
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }))
    })
  }, [hash, key, navKey])

  /** 等展开/收起写进 DOM、布局落定后再回调（两帧，够 React 提交和新高度生效） */
  function afterLayout(run: () => void) {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(run)
    })
  }

  // 栏目签：点一下就展开这一栏并滚过去（收起别栏，只留一栏开）。
  // 全景那一项不展开任何栏，高亮交回滚动观察，免得钉死在「全景漫游」上。
  function goTo(id: string) {
    setOpenId(id === SCENES ? null : id)
    setActiveId(id)
    const node = document.getElementById(parkAnchorOf(id))
    if (!node) return
    afterLayout(() => node.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }

  /**
   * 手风琴开合。
   * 上方某栏展开时点下方栏：上方内容瞬间收起、文档变短而 scrollTop 没变，
   * 刚点的那栏会被顶到视口上方（可能上千像素）。所以切换前先量它在视口里的位置，
   * 布局落定后按差值补偿滚动，让标题留在原地。
   */
  function toggleSection(id: string) {
    const anchor = parkAnchorOf(id)
    const node = document.getElementById(anchor)
    const before = node ? node.getBoundingClientRect().top : null
    const willOpen = openId !== id

    setOpenId(willOpen ? id : null)
    setActiveId(id)

    if (before === null) return
    afterLayout(() => {
      const current = document.getElementById(anchor)
      if (!current) return
      const delta = current.getBoundingClientRect().top - before
      if (Math.abs(delta) <= 2) return
      // html 上有 scroll-behavior: smooth，直接调滚动 API 会变成动画，
      // 补偿还没落定布局又变了，所以这一下临时关掉平滑，落点才是准的。
      const root = document.documentElement
      const previous = root.style.scrollBehavior
      root.style.scrollBehavior = 'auto'
      window.scrollTo(0, window.scrollY + delta)
      root.style.scrollBehavior = previous
    })
  }

  // 「回到栏目」不整页上滚，只把光标交还给这节对应的那枚栏目签。
  function backToNav(id: string) {
    const link = document.getElementById('park-nav-link-' + id)
    if (!(link instanceof HTMLElement)) return
    link.scrollIntoView({ block: 'nearest', inline: 'center' })
    link.focus({ preventScroll: true })
  }

  const currentId = openId ?? activeId
  const stats = head ? head.stats : FALLBACK_STATS
  const sceneTotal = groups.reduce((sum, group) => sum + group.scenes.length, 0)
  const museumNote = museumGroups.map((group) => group.name + ' ' + group.scenes.length + ' 处').join('、')

  return (
    <div className="park-page">
      {/* 一 · 开场 */}
      <HallOpen
        img={head?.heroImage || '/img/board-park.jpg'}
        title={head?.title || '园区展示'}
        lead={head ? head.intro : FALLBACK_LEAD}
      />
      {stats.length > 0 ? (
        <div className="park-band">
          <StatBar items={stats} />
        </div>
      ) : null}

      {/* 二 · 栏目导读：点了展开该栏并滚过去，展开态与高亮一致 */}
      <div className="park-navwrap">
        <nav className="park-nav" aria-label="园区栏目">
          <span className="park-nav__label" aria-hidden="true">
            栏目
          </span>
          <ul className="park-nav__list">
            {nav.map((item) => (
              <li key={item.id}>
                <a
                  id={'park-nav-link-' + item.id}
                  className={'park-nav__link' + (currentId === item.id ? ' is-active' : '')}
                  href={'#' + parkAnchorOf(item.id)}
                  aria-current={currentId === item.id ? 'location' : undefined}
                  onClick={(event) => {
                    event.preventDefault()
                    goTo(item.id)
                  }}
                >
                  <span className="park-nav__no" aria-hidden="true">
                    {item.no}
                  </span>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* 三 · 正文栏目：收起时只留一行提要，一次只开一栏 */}
      <div className="park-sections" id="park-sections">
        {columns.map((section, index) => {
          const isOpen = openId === section.id
          const isAdvantages = section.children.length > 0
          const extraImages = isOpen ? unusedImages(section) : []
          return (
            <section
              className={
                'park-sec' + (isOpen ? ' is-open' : '') + (isAdvantages ? ' park-sec--adv' : '')
              }
              id={parkAnchorOf(section.id)}
              data-park-id={section.id}
              key={section.id}
              aria-labelledby={'park-sec-title-' + section.id}
            >
              <div className="park-sec__side">
                <span className="park-sec__no" aria-hidden="true">
                  其{cnNumber(index + 1)}
                </span>
                {isOpen ? (
                  <button type="button" className="park-sec__back" onClick={() => backToNav(section.id)}>
                    回到栏目
                  </button>
                ) : null}
              </div>

              <div className="park-sec__main">
                <header className="park-sec__head">
                  <h2 className="park-sec__title" id={'park-sec-title-' + section.id}>
                    <button
                      type="button"
                      className="park-sec__toggle"
                      aria-expanded={isOpen}
                      onClick={() => toggleSection(section.id)}
                    >
                      <span className="park-sec__toggle-text">{section.title}</span>
                      <span className="park-sec__chev" aria-hidden="true" />
                    </button>
                  </h2>
                  {!isOpen && section.summary ? <p className="park-sec__excerpt">{section.summary}</p> : null}
                </header>

                {isOpen ? (
                  <div className="park-sec__panel">
                    {section.subtitle ? <p className="park-sec__sub">{section.subtitle}</p> : null}
                    <ArticleMeta
                      className="park-sec__meta"
                      date={section.date}
                      author={section.author}
                      sourceName={section.sourceName}
                    />
                    <div className="park-prose">
                      <HallBlocks blocks={section.blocks} />
                    </div>

                    {/* 正文块里没摆过的插图，补一个图集 */}
                    {extraImages.length > 0 ? (
                      <div className="park-sec__gal">
                        {extraImages.slice(0, 3).map((image, imageIndex) => (
                          <figure className="park-sec__fig" key={image.url + imageIndex}>
                            <img
                              src={image.url}
                              alt={image.alt}
                              loading="lazy"
                              onError={(event) => {
                                const figure = event.currentTarget.closest('figure')
                                if (figure instanceof HTMLElement) figure.hidden = true
                              }}
                            />
                          </figure>
                        ))}
                      </div>
                    ) : null}

                    {isAdvantages ? <Advantages column={section} /> : null}
                  </div>
                ) : null}
              </div>
            </section>
          )
        })}
      </div>

      {/* 四 · 全景场景墙：常驻在最下面，不折叠 */}
      <section
        className="park-scenes"
        id={parkAnchorOf(SCENES)}
        data-park-id={SCENES}
        aria-labelledby="park-scenes-title"
      >
        <header className="park-scenes__head">
          <h2 id="park-scenes-title">全景场景</h2>
          {sceneTotal > 0 ? (
            <p className="park-scenes__note">{groups.length} 处基地，共 {sceneTotal} 处。</p>
          ) : (
            <p className="park-scenes__note">暂无场景。</p>
          )}
        </header>

        {groups.map((group, groupIndex) => {
          return (
            <div className="park-group" key={group.id}>
              <div className="park-group__head">
                <h3 className="park-group__name">
                  <span className="park-group__no" aria-hidden="true">
                    {cnNumber(groupIndex + 1)}
                  </span>
                  {group.name}
                </h3>
                <p className="park-group__count">
                  {group.scenes.length} 处
                </p>
              </div>
              <VrWall group={group} listClass="park-scene-grid" itemClass="park-scene" onOpen={setScene} />
            </div>
          )
        })}
      </section>

      <NextHall to="/museum" name="博物馆" note={museumNote} cover="/img/board-museum.jpg" />

      <VrStage open={scene !== null} scene={scene} onClose={() => setScene(null)} />
    </div>
  )
}

/** 栏目下挂的子文章（「园区优势」下七个分项）：与正文是两套内容，展开后仍逐条折叠。 */
function Advantages({ column }: { column: ParkColumn }) {
  const count = column.children.length
  return (
    <div className="park-advs">
      <div className="park-advs__head">
        <p className="park-advs__kicker">{column.title} · {CN_NUM[count - 1] ?? count} 个分项</p>
      </div>
      {column.children.map((advantage, index) => (
        <details className="park-adv" key={advantage.id}>
          <summary className="park-adv__sum">
            <span className="park-adv__no" aria-hidden="true">
              {cnNumber(index + 1)}
            </span>
            <span className="park-adv__title">{advantage.title}</span>
            <span className="park-adv__cue" aria-hidden="true" />
          </summary>
          <div className="park-adv__body">
            {advantage.sameAsParent ? (
              <p className="park-adv__same">
                内容见上方「{column.title}」总述。
              </p>
            ) : (
              <HallBlocks blocks={advantage.blocks} />
            )}
          </div>
        </details>
      ))}
    </div>
  )
}
