// 由官网产品素材生成购物板块数据。
// 输入：materials/04-产品中心.json（官网镜像整理，含原文、日期、原图直链）
// 输出：site/src/data/products.json
// 价格、库存、行号均为演示数据；同一 SKU 每次生成结果固定。
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, '../..')
const source = JSON.parse(readFileSync(resolve(root, 'materials/04-产品中心.json'), 'utf8'))
const outFile = resolve(root, 'site/src/data/products.json')

const UPDATED = '2026-10-29'

const CATEGORIES = [
  {
    key: 'dried',
    name: '化橘红干果',
    short: '干果',
    numeral: '壹',
    note: '8 件 · 果 / 皮 / 花 / 切片 / 七爪 / 陈年',
    blurb:
      '未熟果、外皮、花、切片与陈年形制。',
    usage: '取 5–10 克，开水冲泡 10–15 分钟，可反复冲泡至无味；果硬可先蒸软再切。',
    storage: '干燥处密封保存；潮湿天气适时取出晾晒。',
    caution:
      '功效表述不作为医学结论；食品、饮品不能替代药品。',
  },
  {
    key: 'patent',
    name: '化橘红成药',
    short: '成药',
    numeral: '贰',
    note: '1 件 · 药品，仅展示',
    blurb:
      '中成药，现有橘红颗粒一件。按药品管理，不在线销售。',
    usage: '遵医嘱，或按药品说明书使用。',
    storage: '密封，置阴凉干燥处保存。',
    caution:
      '内容不构成用药建议；实际使用以药品说明书与医嘱为准。',
  },
  {
    key: 'preparation',
    name: '化橘红制剂',
    short: '制剂',
    numeral: '叁',
    note: '1 件 · 药品，仅展示',
    blurb:
      '口服液制剂，现有化橘红口服液一件。按药品管理，不在线销售。',
    usage: '遵医嘱，或按药品说明书使用。',
    storage: '密封，置阴凉干燥处保存。',
    caution:
      '内容不构成用药建议；实际使用以药品说明书与医嘱为准。',
  },
  {
    key: 'drink',
    name: '化橘红饮品',
    short: '饮品',
    numeral: '肆',
    note: '5 件 · 单方茶与拼配茶',
    blurb:
      '单方化橘红茶，加青果、栀子、普洱、莓茶的四款拼配。',
    usage: '取适量，开水冲泡 3–5 分钟；每日两三杯即可。',
    storage: '密封、避光、防潮；开封后尽快饮用。',
    caution:
      '功效表述不作为医学结论；食品、饮品不能替代药品。',
  },
  {
    key: 'food',
    name: '化橘红食品',
    short: '食品',
    numeral: '伍',
    note: '2 件 · 膏滋与糖果',
    blurb:
      '膏与糖两类。膏九道工序熬制，糖柴火熬制 18 小时。',
    usage: '含服，或取适量温水冲饮；日常适量。',
    storage: '阴凉干燥处密封保存，开封后冷藏更佳。',
    caution:
      '功效表述不作为医学结论；食品、饮品不能替代药品。',
  },
  {
    key: 'craft',
    name: '化橘红工艺品',
    short: '工艺品',
    numeral: '陆',
    note: '4 件 · 手作与陈设',
    blurb:
      '茶叶罐、手链、烟盅、烟斗。',
    usage: '收藏、陈设或日常使用；避免潮湿与暴晒。',
    storage: '干燥处存放，避免挤压与潮湿。',
    caution: '',
  },
]

const CAT_MAP = Object.fromEntries(CATEGORIES.map((cat) => [cat.name, cat]))

const PRICE_POINTS = {
  化橘红干果: [3900, 4900, 5900, 7900, 9900, 12900],
  化橘红成药: [5900, 6900, 7900, 8900],
  化橘红制剂: [4900, 5900, 6900],
  化橘红饮品: [2900, 3900, 4900, 5900, 6900],
  化橘红食品: [1900, 2900, 3900, 4900],
  化橘红工艺品: [2900, 4900, 6900, 9900, 14900],
}

// 少数多包装 / 有代表性的单品给固定价，避免同一件商品各包装价格倒挂。
const PRICE_OVERRIDE = {
  'CP-002|化橘红果': 6900,
  'CP-002|盒装化橘红果': 8900,
  'CP-002|竹篮装化橘红果': 12900,
  'CP-002|桶装化橘红果': 10900,
  'CP-007|七爪化橘红': 12900,
  'CP-013|橘红普洱茶': 8900,
  'CP-019|化橘红手链': 9900,
  'CP-020|化橘红烟盅': 12900,
  'CP-021|化橘红烟斗': 14900,
}

const TAG_MAP = {
  'CP-002': ['多包装', '原果'],
  'CP-003': ['花茶'],
  'CP-004': ['切片'],
  'CP-005': ['陈年'],
  'CP-006': ['陈年', '南方人参'],
  'CP-007': ['贡品形制', '七爪'],
  'CP-008': ['原料'],
  'CP-009': ['中成药', '祛痰剂'],
  'CP-010': ['非处方药'],
  'CP-011': ['单方茶'],
  'CP-012': ['六味拼配'],
  'CP-013': ['普洱', '可收藏'],
  'CP-014': ['栀子', '五味精配'],
  'CP-015': ['青果', '五味'],
  'CP-016': ['膏滋', '古法熬制'],
  'CP-017': ['土红糖', '柴火 18 小时'],
  'CP-018': ['手作', '茶叶罐'],
  'CP-019': ['手作', '手链'],
  'CP-020': ['手作', '烟盅'],
  'CP-021': ['手作', '烟斗'],
}

const CAT_TAGS = {
  化橘红干果: ['药食同源'],
  化橘红成药: ['药品'],
  化橘红制剂: ['药品'],
  化橘红饮品: ['代用茶'],
  化橘红食品: ['古法食品'],
  化橘红工艺品: ['收藏'],
}

// 与旧购物页一致的稳定哈希：同一 SKU 每次取到同一个演示价。
function hash(input) {
  let h = 2166136261
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function priceFor(cat, id, variant) {
  const override = PRICE_OVERRIDE[id + '|' + variant]
  if (override) return override
  const points = PRICE_POINTS[cat] ?? PRICE_POINTS['化橘红干果']
  return points[hash(id + '|' + variant) % points.length]
}

function splitBlocks(text) {
  const raw = String(text || '')
    .replace(/\r\n/g, '\n')
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter(Boolean)

  const lines = raw.map((part) => part.replace(/^#{1,6}\s*/, '').replace(/\s+$/g, ''))
  return lines.filter((line) => !/^(来源|参考资料)[：:]/.test(line)).map((line) => {
    const headingLike =
      line.length <= 20 &&
      /[：:]$/.test(line) === false &&
      !/[。！？；，、,.!?;]/.test(line) &&
      !line.startsWith('【') &&
      !line.startsWith('来源')
    if (headingLike) {
      return { type: 'h', text: line.replace(/[：:]$/, '') }
    }
    if (/^注[：:]/.test(line)) {
      return { type: 'note', text: line }
    }
    return { type: 'p', text: line }
  })
}

function makeSummary(blocks) {
  const first = blocks.find((block) => block.type === 'p')
  if (!first) return ''
  const text = first.text.replace(/\s+/g, ' ')
  return text.length > 62 ? text.slice(0, 62) + '…' : text
}

function toSku(item, cat, variant, index) {
  const id = item.id
  const sku = id + '-' + String(index + 1).padStart(2, '0')
  const priceCents = priceFor(cat.name, id, variant)
  const stock = 18 + (hash(sku + '|stock') % 60)
  return { sku, name: variant, priceCents, stock }
}

const EXTRA_IMAGES = {
  'CP-005': [
    {
      src: '/img/products/CP-005-b.jpg',
      alt: '陈年化橘红皮 · 切皮形态',
      originalUrl: 'https://28760148.s21i.faiusr.com/2/ABUIABACGAAgtsirkQYoyIT8jgEwoAY4gAQ.jpg',
    },
  ],
}

const CAT_SHOPS = source.shop_candidates ?? {}

const items = source.items.map((item) => {
  const cat = CAT_MAP[item.sub] ?? CATEGORIES[0]
  const purchasable = cat.key !== 'patent' && cat.key !== 'preparation'
  const blocks = splitBlocks(item.text)
  const variants = item.variants?.length ? item.variants : [item.title]
  const skus = variants.map((variant, index) => toSku(item, cat, variant, index))

  const imageSources = []
  const seen = new Set()
  const pushImage = (label, url) => {
    if (!url || seen.has(url)) return
    seen.add(url)
    imageSources.push({ label, url })
  }
  pushImage('列表缩略图', item.media?.thumb)
  ;(item.media?.images ?? []).forEach((image, index) => {
    pushImage(image.alt || '产品图 ' + (index + 1), image.url)
  })

  const images = [
    {
      src: '/img/products/' + item.id + '.jpg',
      alt: item.title + ' 产品图',
      originalUrl: item.media?.thumb || imageSources[0]?.url || '',
      sourcePage: item.source_url,
    },
    ...(EXTRA_IMAGES[item.id] ?? []).map((image) => ({
      ...image,
      sourcePage: item.source_url,
    })),
  ]

  const shops = (CAT_SHOPS[cat.name] ?? [])
    .filter((shop) => shop.entry)
    .slice(0, 4)
    .map((shop) => ({ name: shop.company, url: shop.entry, type: shop.entry_type, basis: shop.basis }))

  const facts = [
    { k: '品类', v: cat.name },
    { k: '形态', v: variants.join(' / ') },
    { k: '参考用法', v: cat.usage },
    { k: '保存', v: cat.storage },
  ]

  return {
    id: item.id,
    title: item.title,
    cat: cat.name,
    catKey: cat.key,
    catShort: cat.short,
    summary: makeSummary(blocks),
    purchasable,
    blockReason: purchasable ? null : '药品类商品不在线销售。',
    date: item.date || null,
    sourceUrl: item.source_url,
    sourceLabel: '官网产品页',
    blocks,
    images,
    imageSources,
    thumb: '/img/products/' + item.id + '.jpg',
    skus,
    facts,
    tags: Array.from(new Set([...(CAT_TAGS[cat.name] ?? []), ...(TAG_MAP[item.id] ?? [])])),
    usage: cat.usage,
    storage: cat.storage,
    caution: cat.caution,
    editorNote: null,
    shopCandidates: shops,
    demo: true,
  }
})

const categoryCounts = Object.fromEntries(CATEGORIES.map((cat) => [cat.name, 0]))
for (const item of items) categoryCounts[item.cat] += 1

const payload = {
  updated: UPDATED,
  count: items.length,
  shopName: '化橘红博览馆 · 产品志',
  notice: '',
  disclosure: '',
  categories: CATEGORIES.map((cat) => ({
    key: cat.key,
    name: cat.name,
    short: cat.short,
    numeral: cat.numeral,
    note: cat.note,
    blurb: cat.blurb,
    usage: cat.usage,
    storage: cat.storage,
    caution: cat.caution,
    count: categoryCounts[cat.name],
  })),
  featured: ['CP-007', 'CP-002', 'CP-017', 'CP-011'],
  shipping: [
    {
      key: 'standard',
      name: '标准快递',
      desc: '预计 3–5 天送达',
      feeCents: 0,
    },
    {
      key: 'express',
      name: '顺丰速运',
      desc: '预计 1–2 天送达',
      feeCents: 1200,
    },
  ],
  paymentMethods: [
    { key: 'wechat', name: '微信支付', desc: '扫码付款' },
    { key: 'alipay', name: '支付宝', desc: '扫码付款' },
    { key: 'unionpay', name: '云闪付', desc: '扫码付款' },
  ],
  items,
}

writeFileSync(outFile, JSON.stringify(payload, null, 2) + '\n', 'utf8')
console.log('written', outFile)
console.log('items', items.length, 'skus', items.reduce((n, item) => n + item.skus.length, 0))
for (const cat of payload.categories) console.log(cat.name, cat.count)
console.log('bytes', Buffer.byteLength(JSON.stringify(payload)))
