// 生成 /enterprises 用的地理数据（一次生成，产物进仓库，页面不联网）。
//
// 产物：
//   src/data/map/huazhou.geo.json       化州市轮廓，阿里云 DataV 行政区划 440982（静态下载，勿改）
//   src/data/map/towns.json             12 个镇街中心点，© OpenStreetMap contributors（ODbL 1.0）
//   src/data/map/enterprise-points.json 27 家企业点位 = 镇街中心 + 确定性偏移 + 互斥松弛（镇街级近似，非门牌）
//
// 「待核」8 家官网未标镇街，不出现在点位上，由页面单独列出。
// 用法：node site/scripts/build-map-data.mjs

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const site = join(here, '..')
const outDir = join(site, 'src', 'data', 'map')

if (!existsSync(join(outDir, 'huazhou.geo.json'))) {
  console.error('缺少 src/data/map/huazhou.geo.json，先下载：')
  console.error('  curl -sS -o site/src/data/map/huazhou.geo.json https://geo.datav.aliyun.com/areas_v3/bound/440982.json')
  process.exit(1)
}

// 镇街中心与标注方位（方位是排版权用，避免名字互相压住）
const TOWNS = [
  ['平定镇', 110.4101254, 22.0265016, 'town', 'left'],
  ['那务镇', 110.587403, 22.00389, 'town', 'right'],
  ['江湖镇', 110.5997224, 21.8715698, 'town', 'right'],
  ['中垌镇', 110.4716358, 21.8400226, 'town', 'left'],
  ['官桥镇', 110.4995456, 21.7356899, 'town', 'left'],
  ['石湾街道', 110.538415, 21.661196, 'town', 'left'],
  ['鉴江街道', 110.649662, 21.664767, 'suburb', 'above-right'],
  ['河西街道', 110.6264397, 21.6565373, 'suburb', 'left'],
  ['东山街道', 110.6403501, 21.6558133, 'suburb', 'right'],
  ['下郭街道', 110.6334293, 21.6399173, 'suburb', 'below'],
  ['新安镇', 110.423083, 21.652974, 'town', 'left'],
  ['同庆镇', 110.691233, 21.5951296, 'town', 'right'],
]

const MIN_DIST = 0.006 // 同镇街点位最小间距（约 0.7 公里）
const MAX_DRIFT = 0.012 // 离镇街中心最远（约 1.3 公里：同镇街内部错开即可）
const COS = Math.cos((21.8 * Math.PI) / 180)

const raw = JSON.parse(readFileSync(join(site, 'src', 'data', 'enterprises.json'), 'utf8'))
const items = raw.items

/** FNV-1a 的 0~1 值：同一个 id 每次跑出来一样，偏移才可复现 */
function hash01(text) {
  let h = 2166136261
  for (const ch of text) {
    h ^= ch.codePointAt(0) ?? 0
    h = Math.imul(h, 16777619)
  }
  return (h >>> 0) / 4294967296
}

const towns = TOWNS.map(([name, lng, lat, kind, side]) => ({ name, lng, lat, kind, side }))
const townIndex = new Map(towns.map((t) => [t.name, t]))

const groups = new Map()
for (const item of items) {
  if (!townIndex.has(item.town)) continue // 待核 不上图
  if (!groups.has(item.town)) groups.set(item.town, [])
  groups.get(item.town).push(item)
}

/** 初值：镇街中心附近的小环 */
const nodes = []
for (const [townName, group] of groups) {
  const town = townIndex.get(townName)
  const n = group.length
  const ring = 0.004 + 0.0011 * (n - 1)
  const base = hash01(townName) * Math.PI * 2
  group
    .slice()
    .sort((a, b) => a.id.localeCompare(b.id))
    .forEach((item, i) => {
      const angle = base + (i / n) * Math.PI * 2
      const radius = ring * (0.82 + 0.36 * hash01(item.id))
      nodes.push({
        id: item.id,
        town: townName,
        baseLng: town.lng,
        baseLat: town.lat,
        x: town.lng + (Math.cos(angle) * radius) / COS, // x 已按经度缩过
        y: town.lat + Math.sin(angle) * radius,
      })
    })
}

/** 互斥松弛：城区十个点挤在 3 公里内，不推开会叠成一团 */
for (let iter = 0; iter < 240; iter += 1) {
  let moved = false
  for (let i = 0; i < nodes.length; i += 1) {
    for (let j = i + 1; j < nodes.length; j += 1) {
      const a = nodes[i]
      const b = nodes[j]
      const dx = (a.x - b.x) * COS
      const dy = a.y - b.y
      const dist = Math.hypot(dx, dy)
      if (dist >= MIN_DIST || dist === 0) continue
      const push = (MIN_DIST - dist) / 2
      const ux = dist === 0 ? 1 : dx / dist
      const uy = dist === 0 ? 0 : dy / dist
      a.x += (ux * push) / COS
      a.y += uy * push
      b.x -= (ux * push) / COS
      b.y -= uy * push
      moved = true
    }
  }
  // 拉回镇街中心附近
  for (const n of nodes) {
    const dx = (n.x - n.baseLng) * COS
    const dy = n.y - n.baseLat
    const d = Math.hypot(dx, dy)
    if (d > MAX_DRIFT) {
      n.x = n.baseLng + (dx / d) * MAX_DRIFT / COS
      n.y = n.baseLat + (dy / d) * MAX_DRIFT
    }
  }
  if (!moved) break
}

let minPair = Infinity
for (let i = 0; i < nodes.length; i += 1) {
  for (let j = i + 1; j < nodes.length; j += 1) {
    const d = Math.hypot((nodes[i].x - nodes[j].x) * COS, nodes[i].y - nodes[j].y)
    minPair = Math.min(minPair, d)
  }
}

/** @type {Record<string, {lng:number,lat:number,coordSource:string,verified:boolean}>} */
const points = {}
for (const n of nodes) {
  const count = groups.get(n.town).length
  points[n.id] = {
    lng: Number(n.x.toFixed(6)),
    lat: Number(n.y.toFixed(6)),
    coordSource: count === 1 ? '镇街中心近似' : '镇街中心 + 偏移',
    verified: false,
  }
}

const knownTowns = new Set(towns.map((t) => t.name))
const unmatched = [...new Set(items.map((item) => item.town).filter((town) => !knownTowns.has(town)))]
if (unmatched.length > 0) console.log('未匹配到镇街（不上图）：' + unmatched.join('、'))

const mapped = Object.keys(points).length
mkdirSync(outDir, { recursive: true })
writeFileSync(
  join(outDir, 'towns.json'),
  JSON.stringify({ source: '© OpenStreetMap contributors（ODbL 1.0）', towns }, null, 2) + '\n',
)
writeFileSync(join(outDir, 'enterprise-points.json'), JSON.stringify(points, null, 2) + '\n')
console.log(`towns ${towns.length} 个；点位 ${mapped} 家；待核 ${items.length - mapped} 家不上图；最近两点 ${minPair.toFixed(4)}°（约 ${Math.round(minPair * 111)} 公里）`)