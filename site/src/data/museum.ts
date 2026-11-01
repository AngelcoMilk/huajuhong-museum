// 博物馆展示的数据入口：后台内容接口读不到时用这份静态数据。
// 馆内 8 个场景 + 配套车间 3 个场景 + 4 篇关于博览馆的官网文章。

import type { HallArticle, Stat, VrGroup } from '../types/hall'
import raw from './museum.json'

type MuseumData = {
  groups: VrGroup[]
  articles: HallArticle[]
  stats: Stat[]
}

const data = raw as MuseumData

export const MUSEUM_SCENE_GROUPS: VrGroup[] = data.groups
export const MUSEUM_ARTICLES: HallArticle[] = data.articles
export const MUSEUM_STATS: Stat[] = data.stats

/** 馆内场景（不含车间）与车间场景分开取，页面按参观动线排 */
export const MUSEUM_HALL_SCENES = MUSEUM_SCENE_GROUPS.find((group) => group.key === 'hall')?.scenes ?? []
export const MUSEUM_WORKSHOP_SCENES = MUSEUM_SCENE_GROUPS.find((group) => group.key === 'workshop')?.scenes ?? []
