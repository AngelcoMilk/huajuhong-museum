import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { EnterpriseImage, MappedEnterprise } from '../../types/enterprise'
import EnterpriseVideos from './EnterpriseVideos'
import RichText from './RichText'

interface EnterprisePanelProps {
  item: MappedEnterprise
  closing: boolean
  onClose: () => void
}

/** 官网图常见几 MB，面板只列前 8 张，其余给链接 */
const GALLERY_LIMIT = 8

function paragraphsOf(text: string): string[] {
  return text
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0)
}

function telHref(tel: string): string {
  return `tel:${tel.replace(/[^\d+]/g, '')}`
}

function isHttpUrl(url: string): boolean {
  return /^https?:\/\//i.test(url)
}

function hostOf(url: string): string {
  try {
    return new URL(url).host.replace(/^www\./, '')
  } catch {
    return url
  }
}

/** 官网图可能 404 或防盗链：失败就退成占位框，不留破图 */
function Thumb({ image, index, onOpen }: { image: EnterpriseImage; index: number; onOpen: () => void }) {
  const [state, setState] = useState<'loading' | 'ok' | 'failed'>('loading')

  return (
    <button
      type="button"
      className="ent-figure"
      data-state={state}
      onClick={onOpen}
      aria-label={image.alt || `放大第 ${index + 1} 张图片`}
    >
      {state === 'failed' ? (
        <span className="ent-figure__ph" aria-hidden="true">
          图 {index + 1}
        </span>
      ) : (
        <img
          className="ent-figure__img"
          src={image.url}
          alt={image.alt || `企业图片 ${index + 1}`}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onLoad={() => setState('ok')}
          onError={() => setState('failed')}
        />
      )}
      <span className="ent-figure__zoom" aria-hidden="true">
        放大
      </span>
    </button>
  )
}

/** 图集大图查看：左右翻、Esc 关、点背景关 */
function FigureViewer({ images, index, onClose, onMove }: { images: EnterpriseImage[]; index: number; onClose: () => void; onMove: (next: number) => void }) {
  const total = images.length
  const current = images[index]

  const move = useCallback(
    (delta: number) => onMove((index + delta + total) % total),
    [index, total, onMove],
  )

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        onClose()
      } else if (event.key === 'ArrowLeft') move(-1)
      else if (event.key === 'ArrowRight') move(1)
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [move, onClose])

  if (!current) return null

  return (
    <div className="ent-viewer" role="dialog" aria-modal="true" aria-label="大图" onClick={onClose}>
      <img
        className="ent-viewer__img"
        src={current.url}
        alt={current.alt || `图片 ${index + 1}`}
        referrerPolicy="no-referrer"
        onClick={(event) => event.stopPropagation()}
      />
      <button type="button" className="ent-viewer__close" onClick={onClose} aria-label="关闭大图">
        ×
      </button>
      {total > 1 ? (
        <>
          <button
            type="button"
            className="ent-viewer__nav ent-viewer__nav--prev"
            onClick={(event) => {
              event.stopPropagation()
              move(-1)
            }}
            aria-label="上一张"
          >
            ‹
          </button>
          <button
            type="button"
            className="ent-viewer__nav ent-viewer__nav--next"
            onClick={(event) => {
              event.stopPropagation()
              move(1)
            }}
            aria-label="下一张"
          >
            ›
          </button>
          <span className="ent-viewer__count">
            {index + 1} / {total}
          </span>
        </>
      ) : null}
    </div>
  )
}

export default function EnterprisePanel({ item, closing, onClose }: EnterprisePanelProps) {
  const closeRef = useRef<HTMLButtonElement | null>(null)
  const panelRef = useRef<HTMLElement | null>(null)
  const [viewer, setViewer] = useState<number | null>(null)
  const images = item.images.slice(0, GALLERY_LIMIT)

  useEffect(() => {
    // 打开时把焦点交给面板本身，避免「合上」按钮一出现就带一圈焦点环
    panelRef.current?.focus({ preventScroll: true })
  }, [item.id])

  // 展开：高度从 0 长到整列高度（真正「往下展开」，不是淡入）
  useLayoutEffect(() => {
    const el = panelRef.current
    if (!el) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const target = el.parentElement?.clientHeight ?? el.offsetHeight
    if (reduced) {
      el.style.height = '100%'
      return
    }
    el.style.height = '0px'
    el.style.opacity = '0'
    el.style.willChange = 'height'
    void el.offsetHeight
    const frame = requestAnimationFrame(() => {
      el.style.transition = 'height 0.34s cubic-bezier(0.22, 0.61, 0.36, 1), opacity 0.22s ease-out'
      el.style.height = target + 'px'
      el.style.opacity = '1'
    })
    const done = () => {
      el.style.transition = ''
      el.style.height = '100%'
      el.style.willChange = 'auto'
    }
    el.addEventListener('transitionend', done, { once: true })
    return () => {
      cancelAnimationFrame(frame)
      el.removeEventListener('transitionend', done)
    }
  }, [])

  // 收起：高度缩回 0，页面那边 300ms 后才卸载
  useEffect(() => {
    if (!closing) return
    const el = panelRef.current
    if (!el) return
    const currentHeight = el.getBoundingClientRect().height
    el.style.transition = 'none'
    el.style.height = currentHeight + 'px'
    void el.offsetHeight
    el.style.transition = 'height 0.24s cubic-bezier(0.55, 0, 1, 0.45), opacity 0.2s ease-in'
    el.style.height = '0px'
    el.style.opacity = '0'
  }, [closing])

  const paragraphs = paragraphsOf(item.text)

  return (
    <div className="ent-panelwrap" data-closing={closing ? 'true' : undefined}>
      <article className="ent-panel" ref={panelRef} tabIndex={-1} aria-labelledby="ent-panel-title">
        <header className="ent-panel__head">
          <div className="ent-panel__text">
            <p className="ent-panel__kicker">
              {item.town}
            </p>
            <h2 className="ent-panel__name" id="ent-panel-title">
              {item.name}
            </h2>
          </div>
          <button type="button" className="ent-panel__close" onClick={onClose} ref={closeRef}>
            <span aria-hidden="true">↑</span>
            合上
          </button>
        </header>

        <div className="ent-panel__scroll">
          <dl className="ent-facts">
            <div className="ent-facts__row">
              <dt>地址</dt>
              <dd>{item.address || '—'}</dd>
            </div>
            <div className="ent-facts__row">
              <dt>电话</dt>
              <dd>{item.tel ? <a href={telHref(item.tel)}>{item.tel}</a> : '—'}</dd>
            </div>
            {item.email ? (
              <div className="ent-facts__row">
                <dt>邮箱</dt>
                <dd>
                  <a href={`mailto:${item.email}`}>{item.email}</a>
                </dd>
              </div>
            ) : null}
            {item.site ? (
              <div className="ent-facts__row">
                <dt>网站</dt>
                <dd>
                  <a href={item.site} target="_blank" rel="noreferrer">
                    {hostOf(item.site)}
                  </a>
                </dd>
              </div>
            ) : null}
            {item.shops.length > 0 ? (
              <div className="ent-facts__row">
                <dt>网店</dt>
                <dd className="ent-facts__shops">
                  {item.shops.map((shop) =>
                    isHttpUrl(shop.url) ? (
                      <a key={`${item.id}-${shop.label}`} href={shop.url} target="_blank" rel="noreferrer">
                        {shop.label}
                      </a>
                    ) : (
                      <span key={`${item.id}-${shop.label}`} className="ent-facts__inert" >
                        {shop.label}（App 内打开）
                      </span>
                    ),
                  )}
                </dd>
              </div>
            ) : null}
          </dl>

          <section className="ent-prose" aria-label="企业简介">
            <p className="ent-prose__label">企业简介</p>
            {paragraphs.map((paragraph, index) => {
              if (paragraph.startsWith('## ')) {
                return (
                  <h3 key={index} className="ent-prose__head">
                    {paragraph.slice(3)}
                  </h3>
                )
              }
              const isItem = /^（\d+）|^\(\d+\)/.test(paragraph)
              const isLead = index === paragraphs.findIndex((entry) => !entry.startsWith('## '))
              const className = isItem ? 'ent-prose__item' : isLead ? 'ent-prose__lead' : undefined
              return (
                <p key={index} className={className}>
                  <RichText text={paragraph} />
                </p>
              )
            })}
          </section>

          {images.length > 0 ? (
            <section className="ent-dialog__gallery" aria-label="企业图片">
              <h3 className="ent-dialog__subhead">
                企业图片
              </h3>
              <div className="ent-gallery">
                {images.map((image, index) => (
                  <Thumb key={`${item.id}-${index}`} image={image} index={index} onOpen={() => setViewer(index)} />
                ))}
              </div>
            </section>
          ) : null}

          {item.videos.length > 0 ? <EnterpriseVideos videos={item.videos} name={item.name} /> : null}

          <footer className="ent-dialog__foot">
            <button type="button" className="ent-dialog__done" onClick={onClose}>
              合上，回到企业档案
            </button>
          </footer>
        </div>
      </article>

      {viewer !== null ? (
        <FigureViewer
          images={images}
          index={viewer}
          onClose={() => setViewer(null)}
          onMove={setViewer}
        />
      ) : null}
    </div>
  )
}