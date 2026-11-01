// 园区展示的数据入口：后台内容接口读不到时用这份静态数据。
// 6 个有正文的栏目 + 「园区优势」下 7 个分项 + 5 处基地的 36 个全景场景。

import type { HallSection, Stat, VrGroup } from '../types/hall'
import raw from './park.json'

type ParkData = {
  sections: HallSection[]
  advantages: HallSection[]
  groups: VrGroup[]
  stats: Stat[]
}

const data = raw as ParkData

export const PARK_SECTIONS: HallSection[] = data.sections
export const PARK_ADVANTAGES: HallSection[] = data.advantages
export const PARK_SCENE_GROUPS: VrGroup[] = data.groups
export const PARK_STATS: Stat[] = data.stats

/** 36 个园区场景里，切片数最多的那一场（2658）用来讲全景的分量 */
export const PARK_SCENE_TOTAL: number = PARK_SCENE_GROUPS.reduce((sum, group) => sum + group.scenes.length, 0)
export const PARK_SLICE_TOTAL: number = PARK_SCENE_GROUPS.reduce(
  (sum, group) => sum + group.scenes.reduce((n, scene) => n + scene.slices, 0),
  0,
)

/** 栏目锚点：页面滚动定位与目录链接共用一套 id */
export function parkAnchorOf(id: string): string {
  return 'yq-' + id.replace(/^YQ-/, '').toLowerCase()
}