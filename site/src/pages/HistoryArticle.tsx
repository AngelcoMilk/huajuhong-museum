import { useCallback, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router'
import { LoadState } from '../components/exhibit/Exhibit'
import ArticleMeta from '../components/hall/ArticleMeta'
import HallBlocks from '../components/hall/HallBlocks'
import { fetchContentItem, useHistoryList, type HistoryRow, type ItemResult } from '../lib/hallContent'
import { trackItem } from '../lib/track'
import '../styles/history.css'

function sectionPath(section: string) {
  return '/history' + (section ? '?section=' + encodeURIComponent(section) : '')
}

function articlePath(id: string) {
  return '/history/' + encodeURIComponent(id)
}

/** 弹层、输入框、全屏视频各自要用 Esc，这时不退出阅读页 */
function escapeBelongsElsewhere(event: KeyboardEvent) {
  const target = event.target as HTMLElement | null
  if (target?.closest?.('input, textarea, select, [contenteditable="true"]')) return true
  if (document.fullscreenElement) return true
  return document.querySelector('[role="dialog"]') !== null
}

export default function HistoryArticle() {
  const { id = '' } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { list } = useHistoryList()
  const [result, setResult] = useState<ItemResult | null>(null)
  const [attempt, setAttempt] = useState(0)

  const fromList = Boolean((location.state as { fromList?: boolean } | null)?.fromList)
  const item = result?.state === 'ok' && result.item.id === id ? result.item : null
  const section = item?.section ?? list?.rows.find((row) => row.id === id)?.section ?? ''

  useEffect(() => {
    let alive = true
    setResult(null)
    void fetchContentItem(id).then((next) => {
      if (alive) setResult(next)
    })
    return () => {
      alive = false
    }
  }, [id, attempt])

  useEffect(() => {
    if (item) {
      trackItem(item.id)
      document.title = item.title + ' · 史料区'
    }
  }, [item])

  // 从列表进来就退回那一条历史，分类和滚动位置都在；直接打开的地址没有上一页，去所属分类
  const leave = useCallback(() => {
    if (fromList) navigate(-1)
    else navigate(sectionPath(section), { replace: true })
  }, [fromList, navigate, section])

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key !== 'Escape' || event.defaultPrevented || escapeBelongsElsewhere(event)) return
      leave()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [leave])

  const siblings: HistoryRow[] = item && list ? list.rows.filter((row) => row.section === item.section) : []
  const index = siblings.findIndex((row) => row.id === id)
  const prev = index > 0 ? siblings[index - 1] : null
  const next = index >= 0 && index < siblings.length - 1 ? siblings[index + 1] : null

  return (
    <div className="hsr">
      <div className="hsr-bar">
        <button type="button" className="hsr-back" onClick={leave}>
          <span aria-hidden="true">←</span> {section || '史料区'}
        </button>
      </div>

      {result === null ? (
        <LoadState state="loading" title="正在取文章" />
      ) : result.state === 'missing' ? (
        <LoadState
          state="empty"
          title="这篇文章不在了"
          action={
            <Link className="btn" to="/history" replace>
              史料区
            </Link>
          }
        />
      ) : result.state === 'failed' || !item ? (
        <LoadState
          state="error"
          title="这篇打不开"
          action={
            <button type="button" className="btn" onClick={() => setAttempt((count) => count + 1)}>
              重试
            </button>
          }
        />
      ) : (
        <article className="hsr-article">
          <header className="hsr-head">
            <h1>{item.title}</h1>
            {item.subtitle ? <p className="hsr-sub">{item.subtitle}</p> : null}
            <ArticleMeta className="hsr-meta" date={item.date} author={item.author} sourceName={item.sourceName} />
          </header>

          <HallBlocks blocks={item.blocks} />

          {prev || next ? (
            <nav className="hsr-pager" aria-label={item.section + '的上一篇和下一篇'}>
              {prev ? (
                <Link to={articlePath(prev.id)} replace state={location.state} className="hsr-pager__prev">
                  <span>上一篇</span>
                  <b>{prev.title}</b>
                </Link>
              ) : (
                <i />
              )}
              {next ? (
                <Link to={articlePath(next.id)} replace state={location.state} className="hsr-pager__next">
                  <span>下一篇</span>
                  <b>{next.title}</b>
                </Link>
              ) : (
                <i />
              )}
            </nav>
          ) : null}
        </article>
      )}
    </div>
  )
}
