import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'
import { NextHall, StatBar } from '../components/exhibit/Exhibit'
import ArticleMeta from '../components/hall/ArticleMeta'
import ArticleSheet from '../components/hall/ArticleSheet'
import CoverThumb from '../components/hall/CoverThumb'
import VrStage from '../components/hall/VrStage'
import VrWall from '../components/hall/VrWall'
import { MUSEUM_HALL_SCENES, MUSEUM_STATS } from '../data/museum'
import { useMuseumContent, useVrGroups, type ContentItem } from '../lib/hallContent'
import { trackItem } from '../lib/track'
import { useReveal } from '../lib/useReveal'
import type { VrScene } from '../types/hall'
import '../styles/museum-hall.css'

const CN_NUM = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二']

// 博物馆厅 = 暗厅：数据带与场景带落在黛青上，文章区回到纸色。
export default function Museum() {
  useReveal()

  const { items: articles, head } = useMuseumContent()
  const allGroups = useVrGroups()
  const groups = allGroups.filter((group) => group.page === 'museum')
  const [scene, setScene] = useState<VrScene | null>(null)
  const [article, setArticle] = useState<ContentItem | null>(null)
  const [params, setParams] = useSearchParams()
  const articleId = params.get('article')
  const sceneId = params.get('scene')

  useEffect(() => {
    if (scene) trackItem(scene.id)
  }, [scene])
  useEffect(() => {
    if (article) trackItem(article.id)
  }, [article])

  // 讲解员带到某篇文章或某个场景：/museum?article=…、/museum?scene=…。合上时参数一起去掉
  useEffect(() => {
    if (articleId) {
      const target = articles.find((entry) => entry.id === articleId)
      if (!target) return
      setScene(null)
      setArticle((prev) => (prev?.id === target.id ? prev : target))
    } else if (sceneId) {
      const target = allGroups
        .filter((group) => group.page === 'museum')
        .flatMap((group) => group.scenes)
        .find((entry) => entry.id === sceneId)
      if (!target) return
      setArticle(null)
      setScene((prev) => (prev?.id === target.id ? prev : target))
    }
  }, [articleId, sceneId, articles, allGroups])

  const clearTarget = () => {
    if (articleId || sceneId) setParams({}, { replace: true })
  }

  const lead = head ? head.intro : '正门大堂、博物馆 1 到 6、橘香体验馆，共 ' + MUSEUM_HALL_SCENES.length + ' 个全景场景。'
  const stats = head ? head.stats : MUSEUM_STATS

  return (
    <div className="mh">
      <section className="mh-dark" data-tone="dark">
        <div className="mh-hui" aria-hidden="true" />

        {/* 一 · 开场 */}
        <header className="mh-wrap mh-head">
          <div className="mh-head__row">
            <div>
              <h1 className="mh-title">{head?.title || '博物馆'}</h1>
              {lead ? <p className="mh-lead">{lead}</p> : null}
            </div>
            <span className="mh-seal zhu zhu--lg" aria-hidden="true">馆</span>
          </div>
        </header>

        {stats.length > 0 ? (
          <div className="mh-wrap mh-band">
            <StatBar items={stats} />
          </div>
        ) : null}

        {/* 二 · 场景：后台的分组顺序；第一组是参观动线，带站牌 */}
        {groups.length === 0 ? (
          <div className="mh-wrap mh-route" id="mh-route">
            <p className="mh-empty">暂无场景。</p>
          </div>
        ) : null}
        {groups.map((group, groupIndex) => (
          <div
            className={'mh-wrap ' + (groupIndex === 0 ? 'mh-route' : 'mh-workshop')}
            id={groupIndex === 0 ? 'mh-route' : undefined}
            key={group.id}
          >
            <header className="mh-sechead" data-reveal="rise">
              <h2 className="mh-h2">
                {group.name} · {group.scenes.length} 个场景
              </h2>
            </header>

            {group.scenes.length === 0 ? (
              <p className="mh-empty">暂无场景。</p>
            ) : groupIndex === 0 ? (
              <VrWall
                group={group}
                listClass="mh-stops"
                itemClass="mh-stop"
                tone="dark"
                onOpen={setScene}
                tag={(index) => <span className="mh-stop__tag">第{CN_NUM[index] ?? index + 1}站</span>}
              />
            ) : (
              <VrWall group={group} listClass="mh-shops" itemClass="mh-shop" tone="dark" size="sm" onOpen={setScene} />
            )}
          </div>
        ))}

        <div className="mh-hui" aria-hidden="true" />
      </section>

      {/* 四 · 回到纸色：四篇文章 */}
      <section className="mh-wrap mh-articles" id="mh-articles">
        <header className="mh-artshead" data-reveal="rise">
          <h2 className="mh-h2 mh-h2--paper">博览馆文章</h2>
        </header>

        <p className="mh-artsintro">
          2024 年获评茂名市社会科学普及基地。2026 年 10 月，化州化橘红博览馆文化旅游景区获批国家 3A 级。
        </p>

        {articles.length === 0 ? (
          <p className="mh-artsempty">暂无文章。</p>
        ) : (
          <ul className="mh-arts" data-reveal="rise" data-stagger>
            {articles.map((entry) => (
              <li className="mh-art" key={entry.id}>
                <div className="mh-art__body">
                  <CoverThumb src={entry.coverUrl} className="mh-art__cover" />
                  <h3 className="mh-art__title">{entry.title}</h3>
                  {entry.subtitle && entry.subtitle !== entry.section ? <p className="mh-art__sub">{entry.subtitle}</p> : null}
                  <ArticleMeta className="mh-art__meta" date={entry.date} author={entry.author} sourceName={entry.sourceName} />
                  {entry.summary ? <p className="mh-art__ex">{entry.summary}</p> : null}
                </div>
                <button
                  type="button"
                  className="mh-read"
                  aria-label={'阅读：' + entry.title}
                  onClick={() => setArticle(entry)}
                >
                  阅读
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <NextHall to="/craft" name="工艺" note="3D 动画与五台机器" cover="/img/tl-geban.jpg" />

      <VrStage
        open={scene !== null}
        scene={scene}
        onClose={() => {
          setScene(null)
          clearTarget()
        }}
      />
      <ArticleSheet
        article={article}
        onClose={() => {
          setArticle(null)
          clearTarget()
        }}
      />
    </div>
  )
}