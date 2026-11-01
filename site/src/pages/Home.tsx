import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { Link, useLocation } from 'react-router'
import { CardWall, ExhibitCard, Figure, SectionHead } from '../components/exhibit/Exhibit'
import { HALLS, HONORS, RECORDS, SHAPES, STEPS } from '../data/home'
import { useHistorySections, useParkContent, useVrGroups } from '../lib/hallContent'
import { useReveal } from '../lib/useReveal'
import '../styles/home.css'

// 300 个点灭到 30 个。97 与 300 互质，取出来的 30 个位置不重复
const DOTS = Array.from({ length: 300 })
const SURVIVORS = new Set(Array.from({ length: 30 }, (_, k) => (k * 97 + 13) % 300))

function FallingDots() {
  const ref = useRef<HTMLDivElement>(null)
  const [fallen, setFallen] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node || !('IntersectionObserver' in window)) {
      setFallen(true)
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setFallen(true)
          observer.disconnect()
        }
      },
      { threshold: 0.6 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={'hm-dots' + (fallen ? ' is-fallen' : '')}
      role="img"
      aria-label="三百个点，三十个亮着：清代中叶三百余亩，1949 年三十余亩"
    >
      {DOTS.map((_, index) => (
        <span
          key={index}
          className={SURVIVORS.has(index) ? 'hm-dot hm-dot--on' : 'hm-dot'}
          style={{ '--d': `${(index * 53) % 300}` } as CSSProperties}
        />
      ))}
    </div>
  )
}

const STEP_TOP = Math.log10(STEPS[STEPS.length - 1].mu)

// 序厅：来历 → 值一金 → 1949 → 恢复 → 入馆。故事靠数字对比和画面，不写旁白。
export default function Home() {
  useReveal()
  const { hash } = useLocation()
  const archive = useHistorySections()
  const { items: parkColumns } = useParkContent()
  const vrGroups = useVrGroups()
  const sceneCount = (page: string) =>
    vrGroups.filter((group) => group.page === page).reduce((sum, group) => sum + group.scenes.length, 0)
  const sceneTotal = vrGroups.reduce((sum, group) => sum + group.scenes.length, 0)
  const hallMeta: Record<string, string> = {
    '/park': parkColumns.length + ' 栏图文 · ' + sceneCount('park') + ' 个全景',
    '/museum': vrGroups
      .filter((group) => group.page === 'museum')
      .map((group) => group.name + ' ' + group.scenes.length + ' 处')
      .join(' · '),
  }

  useEffect(() => {
    if (!hash) return
    const el = document.querySelector(hash)
    if (el) window.requestAnimationFrame(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }, [hash])

  return (
    <div className="home">
      <header className="hero">
        <div className="hero__media">
          <img src="/img/hero.jpg" alt="枝头的化橘红青果，果面密被绒毛" fetchPriority="high" />
        </div>
        <div className="hero__veil" aria-hidden="true" />
        <div className="hero__in" data-reveal="ink">
          <p className="hero__kicker">中国 · 广东 · 化州</p>
          <h1 className="hero__title">
            化州橘红
            <br />
            博览馆
          </h1>
          <p className="hero__lead">
            化橘红，取化州长绒毛柚的幼果外层果皮制成。
            <span className="hero__sign" aria-hidden="true">
              <span className="zhu">橘</span>
            </span>
          </p>
        </div>
      </header>

      {/* 来历：传说与方志 */}
      <section className="hm-origin">
        <Figure
          src="/img/ch1-luobian.jpg"
          alt="相传罗辨仙翁骑白牛、在橘林间行医的画卷"
          ratio="4 / 3"
          position="30% center"
          caption="相传南朝宋时，罗辨仙人在州署一带种橘，救治病人。"
        />
        <div className="hm-origin__text">
          <SectionHead kicker="来历" title="明万历年间，方志首次记载" />
          <ol className="hm-records" data-reveal="rise" data-stagger>
            {RECORDS.map((record) => (
              <li key={record.book}>
                <p className="hm-records__text">「{record.text}」</p>
                <p className="hm-records__from">{record.when} {record.book}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 值一金：引文与城内园圃 */}
      <section className="hm-gold">
        <div className="hm-gold__in">
          <div className="hm-gold__text" data-reveal="ink">
            <h2 className="hm-gold__from">清光绪十四年（1888），彭以孙《化州志》</h2>
            <blockquote className="hm-gold__quote">
              化州橘红，治痰症如神，<em>每片真者值一金</em>，每年结实，循例报明上官，至期采摘批制，即官斯土者亦不易得。
            </blockquote>
          </div>
          <div className="hm-gold__garden">
            <Figure src="/img/tl-minju.jpg" alt="化州老宅青砖门楼" ratio="16 / 10" />
            <p data-reveal="rise">
              周、潘、李、苏、赖五大橘红园都在化州城内。清代中叶，面积<b>三百余亩</b>。
            </p>
          </div>
        </div>
      </section>

      {/* 1949：全页最暗 */}
      <section className="hm-fall" data-tone="dark">
        <div className="hm-fall__in">
          <FallingDots />
          <h2 className="hm-fall__title" data-reveal="ink">
            <span>1949 年</span>
            <b>三十余亩</b>
          </h2>
          <p className="hm-fall__note" data-reveal="rise">战乱，加上当局只顾索取、不问生产，园圃退为残株。</p>
        </div>
      </section>

      {/* 恢复：柱状图压在航拍上 */}
      <section className="hm-today" data-tone="dark">
        <img src="/img/tl-guoyuan.jpg" alt="航拍化橘红果园" loading="lazy" />
        <div className="hm-today__veil" aria-hidden="true" />
        <div className="hm-today__in">
          <SectionHead
            kicker="恢复"
            title="从三十余亩到 14.3 万亩"
            lead="1950 年代政府拨款复苏旧园。1962 年成立县橘红生产办公室，委托药材公司统管。"
          />
          <ol className="hm-stairs" data-reveal="rise" data-stagger>
            {STEPS.map((step, index) => {
              const height = ((Math.log10(step.mu) - 1) / (STEP_TOP - 1)) * 100
              return (
                <li className="hm-stair" key={step.when} style={{ '--h': height, '--i': index } as CSSProperties}>
                  <p className="hm-stair__num">
                    <b>{step.value}</b>
                    <span>{step.unit}</span>
                    {step.note ? <em>{step.note}</em> : null}
                  </p>
                  <span className="hm-stair__bar" aria-hidden="true" />
                  <p className="hm-stair__when">{step.when}</p>
                </li>
              )
            })}
          </ol>
          <ul className="hm-honors">
            {HONORS.map((honor) => (
              <li key={honor.when}>
                <span>{honor.when}</span> {honor.title}
              </li>
            ))}
          </ul>
          <p className="hm-stairs__note">柱高按对数示意</p>
        </div>
      </section>

      {/* 入馆：五厅与资料台 */}
      <section className="hm-enter" id="route">
        <SectionHead kicker="入馆" title="参观路线：五个展厅" />
        <div className="hm-route">
          <CardWall cols={5}>
            {HALLS.map((hall) => (
              <ExhibitCard key={hall.route} to={hall.route} img={hall.cover} no={hall.no} title={hall.name} meta={hallMeta[hall.route] ?? hall.meta} ratio="4 / 3" />
            ))}
          </CardWall>
        </div>

        <div className="hm-desk" id="archive">
          <div className="hm-desk__block">
            <h3 className="hm-desk__h">一果多形</h3>
            <ul className="hm-shapes">
              {SHAPES.map((shape) => (
                <li key={shape.name}>
                  <img src={shape.img} alt={shape.name} loading="lazy" />
                  <b>{shape.name}</b>
                  <span>{shape.note}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="hm-desk__block">
            <h3 className="hm-desk__h">
              <Link to="/history">史料 {archive.reduce((sum, sub) => sum + sub.count, 0)} 篇</Link>
            </h3>
            <ul className="hm-archive">
              {archive.map((sub) => (
                <li key={sub.name}>
                  <Link to={'/history?section=' + encodeURIComponent(sub.name)}>
                    <span>{sub.name}</span>
                    <b>{sub.count}</b>
                  </Link>
                </li>
              ))}
            </ul>
            <p className="hm-desk__more">
              <Link className="btn" to="/vr">VR 全景 {sceneTotal} 个场景</Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
