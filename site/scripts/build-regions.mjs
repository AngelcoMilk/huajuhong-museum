// 生成 site/src/data/regions.json：购物结算 / 地址簿用的「省 → 市 → 区县」三级区划。
//
// 数据源（modood/Administrative-divisions-of-China 的 dist 静态文件，一次生成、产物进仓库）：
//   pcas-code.json  省/市/区县/街道 四级，含 31 个省级单位
//   HK-MO-TW.json   港澳台三个省级单位（省 → 市/片区 → 区县）
// 只保留到区县级；顺序与源一致，不重排、不排序。
//
// 产物结构：
//   [{ n: '广东省', c: [{ n: '茂名市', d: ['茂南区', '电白区', ...] }] }]
//
// 约定：
//   直辖市（北京/天津/上海/重庆）源里分成「市辖区」「县」两层，合并成一个与省同名的市，
//   避免页面出现「市辖区 / 县」这种选项。
//   直筒子市（东莞/中山/嘉峪关/儋州）源里没有区县级，退化为其下辖镇街。
//
// 用法：node site/scripts/build-regions.mjs
//   首次会下载数据源并缓存到系统临时目录，之后直接读缓存；缓存存在时不联网即可复现。

import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const outFile = join(here, '..', 'src', 'data', 'regions.json')

const BASE =
  'https://raw.githubusercontent.com/modood/Administrative-divisions-of-China/master/dist'
const SOURCES = [
  { file: 'pcas-code.json', url: `${BASE}/pcas-code.json` },
  { file: 'HK-MO-TW.json', url: `${BASE}/HK-MO-TW.json` },
]

// 港澳台不在 pcas-code.json 里，按行政区划代码顺序补在最后（台湾 71、香港 81、澳门 82）
const APPENDED = ['台湾省', '香港特别行政区', '澳门特别行政区']
const MUNICIPALITIES = new Set(['北京市', '天津市', '上海市', '重庆市'])

async function readSource({ file, url }) {
  const dir = tmpdir()
  const cached = join(dir, file)
  if (existsSync(cached)) return JSON.parse(readFileSync(cached, 'utf8'))
  const res = await fetch(url)
  if (!res.ok) throw new Error(`下载 ${url} 失败：HTTP ${res.status}`)
  const text = await res.text()
  mkdirSync(dir, { recursive: true }) // TMPDIR 可能还没建
  writeFileSync(cached, text) // 只写临时目录，不落仓库
  return JSON.parse(text)
}

/** 去重且保留首次出现顺序 */
function unique(list) {
  const seen = new Set()
  const out = []
  for (const v of list) {
    if (!v || seen.has(v)) continue
    seen.add(v)
    out.push(v)
  }
  return out
}

/** 一个市下辖的区县名；直筒子市（唯一同名子节点）退化为其下辖镇街 */
function districtsOf(city) {
  const kids = city.children ?? []
  if (kids.length === 1 && kids[0].name === city.name) {
    return unique((kids[0].children ?? []).map((k) => k.name))
  }
  return unique(kids.map((k) => k.name))
}

const [pcas, hkMoTw] = await Promise.all(SOURCES.map(readSource))

const provinces = []
for (const prov of pcas) {
  if (MUNICIPALITIES.has(prov.name)) {
    // 「市辖区」+「县」合并到与直辖市同名的市下
    const districts = unique(
      (prov.children ?? []).flatMap((sub) => (sub.children ?? []).map((k) => k.name)),
    )
    provinces.push({ n: prov.name, c: [{ n: prov.name, d: districts }] })
    continue
  }
  provinces.push({
    n: prov.name,
    c: (prov.children ?? []).map((city) => ({ n: city.name, d: districtsOf(city) })),
  })
}

for (const name of APPENDED) {
  const body = hkMoTw[name]
  if (!body) continue
  provinces.push({
    n: name,
    c: Object.entries(body).map(([city, districts]) => ({ n: city, d: unique(districts) })),
  })
}

writeFileSync(outFile, `${JSON.stringify(provinces, null, 2)}\n`, 'utf8')

const cities = provinces.reduce((sum, p) => sum + p.c.length, 0)
const districts = provinces.reduce((sum, p) => sum + p.c.reduce((s, c) => s + c.d.length, 0), 0)
console.log(`省级 ${provinces.length} / 市级 ${cities} / 区县级 ${districts}`)
console.log(`写入 ${outFile}（${statSync(outFile).size} 字节）`)
