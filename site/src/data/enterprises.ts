// 企业数据的站内入口：基础档案（enterprises.json）+ 地图点位（map/enterprise-points.json）。
// 点位缺失时不让页面挂掉：退到化州市中心、标「未定位」。

import type { Enterprise, GeoPoint, MappedEnterprise } from '../types/enterprise'
import raw from './enterprises.json'
import points from './map/enterprise-points.json'

const base = (raw as { items: Enterprise[] }).items
const pointMap = points as Record<string, GeoPoint>

/** 化州市中心（DataV 行政区划 center），仅作未定位兜底 */
const CITY_CENTER = { lng: 110.63839, lat: 21.654953 }

export const enterprises: MappedEnterprise[] = base.map((item) => {
  const p = pointMap[item.id]
  return {
    ...item,
    ...(p ?? { ...CITY_CENTER, coordSource: '未定位', verified: false }),
  }
})

export const byId = new Map(enterprises.map((e) => [e.id, e]))

/** 镇街筛选项（按条目数降序，「待核」永远排最后） */
export function townFacets(items: MappedEnterprise[] = enterprises): { town: string; count: number }[] {
  const counts = new Map<string, number>()
  for (const item of items) counts.set(item.town, (counts.get(item.town) ?? 0) + 1)
  return [...counts.entries()]
    .map(([town, count]) => ({ town, count }))
    .sort((a, b) => {
      if (a.town === '待核') return 1
      if (b.town === '待核') return -1
      return b.count - a.count || a.town.localeCompare(b.town, 'zh-Hans-CN')
    })
}
