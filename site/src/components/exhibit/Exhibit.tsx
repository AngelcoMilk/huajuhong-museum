import type { ReactNode } from 'react'
import { Link } from 'react-router'
import '../../styles/exhibit.css'

const CN_DIGITS = ['〇', '一', '二', '三', '四', '五', '六', '七', '八', '九']

/** 序号写成汉字：3 → 三，12 → 十二。统计数据、价格、日期不走这里。 */
export function cnNumber(n: number) {
  if (n <= 10) return n === 10 ? '十' : CN_DIGITS[n]
  const tens = Math.floor(n / 10)
  return (tens > 1 ? CN_DIGITS[tens] : '') + '十' + (n % 10 ? CN_DIGITS[n % 10] : '')
}

/** 流水号逐位写成汉字：001 → 〇〇一。 */
export function cnDigits(digits: string) {
  return digits.replace(/\d/g, (digit) => CN_DIGITS[Number(digit)])
}

// 展厅公共件：各厅的章节头、引文、图文段、数据条、时间轴、卡片墙、导引和三态都从这里取，
// 同类内容在不同板块长得一样。暗厅里在外层写 data-tone="dark"，颜色自己翻过来。

type HallOpenProps = { img: string; title: string; lead?: ReactNode; position?: string }

/** 展厅开场：大图 + 标题 + 一句导语，一屏之内。 */
export function HallOpen({ img, title, lead, position }: HallOpenProps) {
  return (
    <header className="ex-open">
      <img src={img} alt="" style={{ objectPosition: position }} />
      <span className="ex-open__veil" aria-hidden="true" />
      <div className="ex-open__in">
        <h1>{title}</h1>
        {lead ? <p>{lead}</p> : null}
      </div>
    </header>
  )
}

type SectionHeadProps = {
  no?: string
  kicker?: string
  title: ReactNode
  lead?: ReactNode
  level?: 1 | 2 | 3
}

export function SectionHead({ no, kicker, title, lead, level = 2 }: SectionHeadProps) {
  const Title = `h${level}` as 'h1' | 'h2' | 'h3'
  return (
    <header className="ex-head" data-reveal="rise">
      {kicker ? (
        <p className="ex-head__kicker">
          {no ? <span className="ex-head__no">{no}</span> : null}
          {kicker}
        </p>
      ) : null}
      <Title className="ex-head__title">{title}</Title>
      {lead ? <p className="ex-head__lead">{lead}</p> : null}
    </header>
  )
}

type QuoteProps = { children: ReactNode; cite?: string; vertical?: boolean }

export function Quote({ children, cite, vertical }: QuoteProps) {
  return (
    <blockquote className={'ex-quote' + (vertical ? ' ex-quote--v' : '')}>
      <p>{children}</p>
      {cite ? <cite>{cite}</cite> : null}
    </blockquote>
  )
}

type FigureProps = {
  src: string
  alt: string
  caption?: string
  ratio?: string
  position?: string
  eager?: boolean
}

export function Figure({ src, alt, caption, ratio, position, eager }: FigureProps) {
  return (
    <figure className="ex-figure" data-reveal="unroll">
      <img
        src={src}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        style={{ aspectRatio: ratio, objectPosition: position }}
      />
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  )
}

/** 图文段：flip 时图在右。连着用的时候左右交替 */
export function SplitBlock({ figure, children, flip }: { figure: ReactNode; children: ReactNode; flip?: boolean }) {
  return (
    <div className={'ex-split' + (flip ? ' ex-split--flip' : '')}>
      <div className="ex-split__fig">{figure}</div>
      <div className="ex-split__text" data-reveal="ink">{children}</div>
    </div>
  )
}

export type Stat = { value: string; unit?: string; label: string }

export function StatBar({ items }: { items: Stat[] }) {
  return (
    <ul className="ex-stats">
      {items.map((item) => (
        <li key={item.label}>
          <span className="ex-stats__label">{item.label}</span>
          <span className="ex-stats__value">
            <b>{item.value}</b>
            {item.unit ? <span>{item.unit}</span> : null}
          </span>
        </li>
      ))}
    </ul>
  )
}

export type TimelineItem = { when: string; title: string; note?: string; on?: boolean }

export function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <ol className="ex-timeline" data-reveal="rise" data-stagger>
      {items.map((item) => (
        <li key={item.when} className={item.on ? 'is-on' : undefined}>
          <span className="ex-timeline__when">{item.when}</span>
          <b>{item.title}</b>
          {item.note ? <span className="ex-timeline__note">{item.note}</span> : null}
        </li>
      ))}
    </ol>
  )
}

export function CardWall({ children, cols = 4 }: { children: ReactNode; cols?: 2 | 3 | 4 | 5 }) {
  return (
    <div className="ex-wall" data-cols={cols} data-reveal="rise" data-stagger>
      {children}
    </div>
  )
}

type ExhibitCardProps = {
  to?: string
  img: string
  alt?: string
  no?: string
  title: string
  note?: string
  meta?: string
  ratio?: string
}

export function ExhibitCard({ to, img, alt = '', no, title, note, meta, ratio }: ExhibitCardProps) {
  const body = (
    <>
      <span className="ex-card__frame">
        <img src={img} alt={alt} loading="lazy" style={{ aspectRatio: ratio }} />
        {no ? <span className="ex-card__no">{no}</span> : null}
      </span>
      <span className="ex-card__body">
        <b>{title}</b>
        {note ? <span className="ex-card__note">{note}</span> : null}
        {meta ? <span className="ex-card__meta">{meta}</span> : null}
      </span>
    </>
  )
  return to ? (
    <Link className="ex-card ex-card--link" to={to}>{body}</Link>
  ) : (
    <div className="ex-card">{body}</div>
  )
}

type NextHallProps = { to: string; name: string; note: string; cover?: string; label?: string }

export function NextHall({ to, name, note, cover, label = '下一展厅' }: NextHallProps) {
  return (
    <nav className="ex-next" aria-label={label}>
      <Link to={to} className="ex-next__link">
        {cover ? <img src={cover} alt="" loading="lazy" /> : null}
        <span className="ex-next__veil" aria-hidden="true" />
        <span className="ex-next__in">
          <span className="ex-next__label">{label}</span>
          <b>{name}</b>
          <span className="ex-next__note">{note}</span>
          <span className="ex-next__go zhu" aria-hidden="true">入</span>
        </span>
      </Link>
    </nav>
  )
}

type LoadStateProps = {
  state: 'loading' | 'empty' | 'error'
  title?: string
  hint?: ReactNode
  action?: ReactNode
}

const LOAD_TITLE = { loading: '正在取展品…', empty: '这里还没有内容', error: '没取到内容' }

export function LoadState({ state, title, hint, action }: LoadStateProps) {
  return (
    <div className="ex-load" data-state={state} role={state === 'error' ? 'alert' : 'status'}>
      <b>{title ?? LOAD_TITLE[state]}</b>
      {hint ? <p>{hint}</p> : null}
      {action ? <div className="ex-load__act">{action}</div> : null}
    </div>
  )
}
