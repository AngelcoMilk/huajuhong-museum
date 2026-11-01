import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router'
import EnterpriseCard from '../components/enterprises/EnterpriseCard'
import EnterprisePanel from '../components/enterprises/EnterprisePanel'
import EnterpriseFilters from '../components/enterprises/EnterpriseFilters'
import EnterpriseMap from '../components/enterprises/EnterpriseMap'
import { NextHall } from '../components/exhibit/Exhibit'
import { enterprises, townFacets } from '../data/enterprises'
import { trackItem } from '../lib/track'
import '../styles/enterprises.css'

const FACETS = townFacets()

export default function Enterprises() {
  const [query, setQuery] = useState('')
  const [town, setTown] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [isDesktop, setIsDesktop] = useState(() => window.matchMedia('(min-width: 1001px)').matches)
  const [closing, setClosing] = useState(false)
  const [params, setParams] = useSearchParams()
  const targetId = params.get('id')
  // 地图飞到哪一家：和面板分离，切换时地图立刻飞新点，面板这边再慢慢收/展
  const [mapFocusId, setMapFocusId] = useState<string | null>(null)
  const listRef = useRef<HTMLDivElement | null>(null)
  const savedScroll = useRef(0)
  const savedPageScroll = useRef(0)
  const closeTimer = useRef<number | null>(null)
  const lastCardId = useRef<string | null>(null)

  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase()
    return enterprises.filter((item) => {
      if (town !== null && item.town !== town) return false
      if (keyword === '') return true
      const haystack = [item.name, item.town, item.address, item.text, ...item.shops.map((shop) => shop.label)]
      return haystack.some((value) => value.toLowerCase().includes(keyword))
    })
  }, [query, town])

  const mapped = useMemo(() => filtered.filter((item) => item.town !== '待核'), [filtered])
  const expandedItem = useMemo(() => enterprises.find((item) => item.id === expandedId) ?? null, [expandedId])

  // 从地图或「待核」名单点选时，把对应卡片带到眼前（卡片已在视口内就不动）
  useEffect(() => {
    if (selectedId === null) return
    trackItem(selectedId)
    const card = document.querySelector<HTMLElement>(`[data-ent-id="${selectedId}"]`)
    card?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [selectedId])

  function clearFilters() {
    setQuery('')
    setTown(null)
  }

  /** 从这张卡的位置往下展开档案：记住滚动位置，展开时列表会被锁住 */
  function expand(id: string) {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current)
      closeTimer.current = null
      setClosing(false)
    }
    savedScroll.current = listRef.current?.scrollTop ?? 0
    savedPageScroll.current = window.scrollY
    lastCardId.current = id
    setSelectedId(id)
    setExpandedId(id)
    if (isDesktop) setMapFocusId(id)
    if (!isDesktop) document.body.style.overflow = 'hidden'
  }

  /** 合上：向上收回原位，恢复列表滚动与焦点，地图也回到展开前的视野 */
  function collapse() {
    if (expandedId === null || closing) return
    setClosing(true)
    if (params.has('id')) setParams({}, { replace: true })
    closeTimer.current = window.setTimeout(() => {
      setExpandedId(null)
      setClosing(false)
      closeTimer.current = null
      setMapFocusId(null)
      const id = lastCardId.current
      const card = id ? document.querySelector<HTMLElement>('[data-ent-id="' + id + '"]') : null
      if (isDesktop) {
        requestAnimationFrame(() => {
          if (listRef.current) listRef.current.scrollTop = savedScroll.current
          card?.querySelector<HTMLElement>('.ent-card__hit')?.focus({ preventScroll: true })
        })
      } else {
        // 手机：页面锁滚过，直接把页面滚回点击时的位置（不碰地图缩放）
        document.body.style.overflow = ''
        const restore = () => window.scrollTo({ top: savedPageScroll.current })
        requestAnimationFrame(restore)
        window.setTimeout(restore, 60)
        card?.querySelector<HTMLElement>('.ent-card__hit')?.focus({ preventScroll: true })
      }
    }, 300)
  }

  /** 点地图上的另一家：先收起当前档案，再把列表定位到新企业的卡片并展开 */
  function openFromMap(id: string) {
    if (expandedId === null) {
      expand(id)
      return
    }
    if (expandedId === id) return
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
    setClosing(true)
    if (isDesktop) setMapFocusId(id)
    closeTimer.current = window.setTimeout(() => {
      closeTimer.current = null
      setClosing(false)
      setExpandedId(null)
      requestAnimationFrame(() => {
        const card = document.querySelector<HTMLElement>('[data-ent-id="' + id + '"]')
        const list = listRef.current
        if (card && list) {
          const top = card.getBoundingClientRect().top - list.getBoundingClientRect().top + list.scrollTop
          list.scrollTop = Math.max(top - 12, 0)
        }
        expand(id)
      })
    }, 280)
  }

  // 桌面才让地图跟着飞；手机上面板是全屏的，地图在后面，收起来应当回到那张卡
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1001px)')
    const update = () => setIsDesktop(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  // 讲解员带到某一家：/enterprises?id=…。筛选可能把它藏起来，先清掉
  useEffect(() => {
    if (!targetId || !enterprises.some((item) => item.id === targetId)) return
    clearFilters()
    openFromMap(targetId)
  }, [targetId])

  // 手机上展开时锁了页面滚动；讲解员可能在展开时带去别的页面，离开要解锁
  useEffect(
    () => () => {
      document.body.style.overflow = ''
    },
    [],
  )

  // 展开时按 Esc 等于「合上」
  useEffect(() => {
    if (expandedId === null) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        collapse()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [expandedId, closing])

  return (
    <>
    <div className="ent-page">
      <h1 className="sr-only">企业地图</h1>

      <section className="ent-bar" aria-label="检索与筛选">
        <div className="ent-bar__inner">
          <EnterpriseFilters
            query={query}
            town={town}
            facets={FACETS}
            total={enterprises.length}
            onQuery={setQuery}
            onTown={setTown}
          />
        </div>
      </section>

      <div className="ent-main">
        <div className="ent-mapcol">
          <div className="ent-mapstage">
            <span className="ent-mapstage__slip" aria-hidden="true">
              化州 · 企业分布
            </span>
            <EnterpriseMap
              items={mapped}
              selectedId={selectedId}
              hoveredId={hoveredId}
              focusId={isDesktop ? mapFocusId : null}
              activeTown={town}
              total={enterprises.length}
              onOpen={openFromMap}
              onSelect={setSelectedId}
              onHover={setHoveredId}
            />
          </div>

          <p className="ent-mapnote__credit">地图 © 高德 · © OpenStreetMap</p>
        </div>

        <div className="ent-listcol" id="ent-list" ref={listRef} data-expanded={expandedItem ? 'true' : undefined}>
          {expandedItem ? (
            <EnterprisePanel item={expandedItem} closing={closing} onClose={collapse} />
          ) : null}

          <div className="ent-listhead">
            <h2 className="ent-listhead__title">企业档案</h2>
            <span className="ent-listhead__count" aria-live="polite">
              共 {filtered.length} 家
            </span>
            {query !== '' || town !== null ? (
              <button type="button" className="ent-listhead__clear" onClick={clearFilters}>
                清除筛选
              </button>
            ) : null}
          </div>

          {filtered.length === 0 ? (
            <div className="ent-empty">
              <p className="ent-empty__text">没找到符合条件的企业。</p>
              <p className="ent-empty__hint">换个关键词，或按镇街重新挑一遍。</p>
              <button type="button" className="ent-empty__clear" onClick={clearFilters}>
                清除筛选
              </button>
            </div>
          ) : (
            <ul className="ent-cards">
              {filtered.map((item, index) => (
                <EnterpriseCard
                  key={item.id}
                  item={item}
                  index={index}
                  selected={selectedId === item.id}
                  hovered={hoveredId === item.id}
                  onSelect={setSelectedId}
                  onHover={setHoveredId}
                  onOpen={expand}
                />
              ))}
            </ul>
          )}

        </div>
      </div>


    </div>
    <NextHall to="/products" name="产品中心" note="六类产品" cover="/img/board-products.jpg" />
    </>
  )
}