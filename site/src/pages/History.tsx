import { useEffect, useLayoutEffect, useRef } from 'react'
import { Link, useLocation, useNavigationType, useSearchParams } from 'react-router'
import LineArt from '../components/exhibit/LineArt'
import { LoadState, StatBar } from '../components/exhibit/Exhibit'
import CoverThumb from '../components/hall/CoverThumb'
import { dayOf, useHistoryList, type HistoryRow } from '../lib/hallContent'
import '../styles/history.css'

const ALL = '全部'
const SCROLL_KEY = 'history-scroll:'

function saveScroll(key: string) {
  try {
    sessionStorage.setItem(SCROLL_KEY + key, String(window.scrollY))
  } catch {
    /* 隐私模式下存不了，回列表就停在顶部 */
  }
}

function readScroll(key: string): number | null {
  try {
    const value = sessionStorage.getItem(SCROLL_KEY + key)
    return value === null ? null : Number(value)
  } catch {
    return null
  }
}

export default function History() {
  const { list, failed, reload } = useHistoryList()
  const [params] = useSearchParams()
  const location = useLocation()
  const navigationType = useNavigationType()
  const section = params.get('section') ?? ''
  const restored = useRef(false)

  // 从阅读页回来（后退）才恢复位置；数据到了、列表排好之后再滚
  useLayoutEffect(() => {
    if (restored.current || !list) return
    restored.current = true
    if (navigationType !== 'POP') return
    const top = readScroll(location.key)
    if (top === null) return
    const root = document.documentElement
    const previous = root.style.scrollBehavior
    root.style.scrollBehavior = 'auto'
    window.scrollTo(0, top)
    root.style.scrollBehavior = previous
  }, [list, location.key, navigationType])

  useEffect(() => {
    if (list?.head?.title) document.title = list.head.title
  }, [list?.head?.title])

  const title = list?.head?.title || '史料区'
  const rows: HistoryRow[] = (list?.rows ?? []).filter((row) => !section || row.section === section)
  const stats = list?.head?.stats ?? []

  return (
    <div className="hs">
      <header className={'hs-head' + (list?.head?.heroImage ? ' hs-head--img' : '')}>
        {list?.head?.heroImage ? <img src={list.head.heroImage} alt="" /> : null}
        <div className="hs-head__in">
          <LineArt name="taiguo" className="hs-art" />
          <h1>{title}</h1>
          {list?.head?.intro ? <p>{list.head.intro}</p> : null}
        </div>
      </header>

      <div className="hs-body">
        {list && stats.length > 0 ? <StatBar items={stats} /> : null}

        {failed ? (
          <LoadState
            state="error"
            title="史料打不开"
            action={
              <button type="button" className="btn" onClick={reload}>
                重试
              </button>
            }
          />
        ) : !list ? (
          <LoadState state="loading" title="正在取史料" />
        ) : (
          <>
            <nav className="hs-tabs" aria-label="史料分类">
              {[{ name: ALL, count: list.rows.length }, ...list.sections].map((item) => {
                const on = item.name === ALL ? !section : section === item.name
                const search = item.name === ALL ? '' : '?section=' + encodeURIComponent(item.name)
                return (
                  <Link
                    key={item.name}
                    to={'/history' + search}
                    replace
                    className={on ? 'is-on' : ''}
                    aria-current={on ? 'true' : undefined}
                  >
                    {item.name}
                    <span>{item.count}</span>
                  </Link>
                )
              })}
            </nav>

            {rows.length === 0 ? (
              <LoadState state="empty" title="这一类还没有文章" />
            ) : (
              <ol className="hs-list">
                {rows.map((row) => (
                  <li key={row.id}>
                    <Link
                      className="hs-row"
                      to={'/history/' + encodeURIComponent(row.id)}
                      state={{ fromList: true }}
                      onClick={() => saveScroll(location.key)}
                    >
                      <span className="hs-row__body">
                        <b className="hs-row__title">{row.title}</b>
                        {row.subtitle ? <span className="hs-row__sub">{row.subtitle}</span> : null}
                        {row.summary ? <span className="hs-row__summary">{row.summary}</span> : null}
                        <span className="hs-row__meta">
                          {!section && row.section ? <span>{row.section}</span> : null}
                          {row.date ? <time>{dayOf(row.date)}</time> : null}
                        </span>
                      </span>
                      <CoverThumb src={row.coverUrl} className="hs-row__thumb" />
                    </Link>
                  </li>
                ))}
              </ol>
            )}
          </>
        )}
      </div>
    </div>
  )
}
