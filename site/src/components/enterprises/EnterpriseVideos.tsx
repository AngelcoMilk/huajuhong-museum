import { cnDigits } from '../exhibit/Exhibit'
import { useRef, useState } from 'react'
import '../../styles/enterprises-videos.css'

/** 企业官网有时给的是视频详情页而不是直链：只有这些扩展名才允许页内播放 */
const DIRECT_VIDEO_RE = /\.(mp4|webm|ogg|m4v|mov)(\?|#|$)/i

export interface EnterpriseVideoItem {
  url: string
  alt: string
}

interface EnterpriseVideosProps {
  videos: EnterpriseVideoItem[]
  name: string
}

function isDirectVideoUrl(url: string): boolean {
  return DIRECT_VIDEO_RE.test(url)
}

function hostOf(url: string): string {
  try {
    return new URL(url).host.replace(/^www\./, '')
  } catch {
    return url
  }
}

function labelOf(video: EnterpriseVideoItem, index: number): string {
  const alt = video.alt.trim()
  return alt.length > 0 ? alt : `企业视频 ${index + 1}`
}

/** 单条视频卡：能直放就放，放不了退成外链卡（不跳站，只给新页面兜底） */
function VideoCard({ video, index, name }: { video: EnterpriseVideoItem; index: number; name: string }) {
  const [failed, setFailed] = useState(false)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  /** 走浏览器原生全屏（Safari 用 webkitEnterFullscreen），不另外做一层假全屏 */
  function goFullscreen() {
    const el = videoRef.current
    if (!el) return
    const legacy = el as HTMLVideoElement & { webkitEnterFullscreen?: () => void }
    if (document.fullscreenElement === el) return
    if (typeof el.requestFullscreen === 'function') {
      void el.requestFullscreen().catch(() => {
        if (typeof legacy.webkitEnterFullscreen === 'function') legacy.webkitEnterFullscreen()
      })
      return
    }
    if (typeof legacy.webkitEnterFullscreen === 'function') legacy.webkitEnterFullscreen()
  }
  const direct = isDirectVideoUrl(video.url)
  const playable = direct && !failed
  const label = labelOf(video, index)
  const host = hostOf(video.url)
  const no = cnDigits(String(index + 1).padStart(2, '0'))

  return (
    <article className="ent-videos__card" data-state={playable ? 'playable' : 'external'}>
      <h4 className="ent-videos__title">
        <span className="ent-videos__no" aria-hidden="true">
          {no}
        </span>
        <span className="ent-videos__titletext">{label}</span>
      </h4>

      {playable ? (
        <>
          <div className="ent-videos__frame">
            <video
              className="ent-videos__player"
              ref={videoRef}
              src={video.url}
              controls
              preload="metadata"
              playsInline
              aria-label={`${name} ${label}（页内播放）`}
              onError={() => setFailed(true)}
              onDoubleClick={goFullscreen}
            />

          </div>
          <a
            className="ent-videos__link"
            href={video.url}
            target="_blank"
            rel="noreferrer"
            aria-label={`播放不了？在新页面打开 ${name} ${label}（${host}）`}
          >
            播放不了？在新页面打开
            <span className="ent-videos__host" aria-hidden="true">
              {host}
            </span>
          </a>
        </>
      ) : (
        <div className="ent-videos__fallback">
          {failed ? <p className="ent-videos__note">该视频无法在页内播放，请在新页面打开</p> : null}
          <a
            className="ent-videos__link"
            href={video.url}
            target="_blank"
            rel="noreferrer"
            aria-label={`播放不了？在新页面打开 ${name} ${label}（${host}）`}
          >
            播放不了？在新页面打开
            <span className="ent-videos__host" aria-hidden="true">
              {host}
            </span>
          </a>
        </div>
      )}
    </article>
  )
}

export default function EnterpriseVideos({ videos, name }: EnterpriseVideosProps) {
  if (videos.length === 0) return null

  return (
    <section className="ent-videos" aria-label={`${name} 企业视频`}>
      <h3 className="ent-videos__head">
        企业视频
        <span className="ent-videos__count" aria-hidden="true">
          共 {videos.length} 条 · 页内播放
        </span>
      </h3>
      <div className="ent-videos__list">
        {videos.map((video, index) => (
          <VideoCard key={`${index}-${video.url}`} video={video} index={index} name={name} />
        ))}
      </div>
    </section>
  )
}