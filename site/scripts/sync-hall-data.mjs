// 从 materials/01-园区展示.json、02-博物馆展示.json、06-VR全景.json 生成园区与博物馆的数据。
// 原文很长（园区 14 篇共 3 万字），这里只做「排版」层面的清洗：分段、认出小标题/图注/图片，
// 不改一个字词；VR 场景按 06 的官方编号（VR-001～047）对齐，场景图存本地路径，失败再退回外链。
// 用法：node site/scripts/sync-hall-data.mjs（或 npm --prefix site run sync:hall）

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const repo = join(here, '..', '..')
const dataDir = join(here, '..', 'src', 'data')
const publicVr = join(here, '..', 'public', 'img', 'vr')

const readJson = (p) => JSON.parse(readFileSync(p, 'utf8'))
const park = readJson(join(repo, 'materials', '01-园区展示.json'))
const museum = readJson(join(repo, 'materials', '02-博物馆展示.json'))
const vr = readJson(join(repo, 'materials', '06-VR全景.json'))

// ———— 正文排版清洗：只切分，不改写 ————
const normalize = (text) =>
  (text ?? '')
    .replace(/\r\n?/g, '\n')
    .replace(/[\u200b-\u200f\u2060\ufeff]/g, '')
    .replace(/\u3000/g, ' ')
    .replace(/[ \t]+/g, ' ')
    .replace(/ *\n */g, '\n')
    .trim()

const IMG_LINE = /^!\[([^\]]*)\]\(([^)]+)\)$/
const BOLD_LINE = /^\*\*(.+?)\*\*[：:]?$/
const SUBHEAD = /^(?:（[一二三四五六七八九十\d]+）|\(\d+\)|\d+[.、]\s*\S)/
const CAPTION_LINE = /^[\u4e00-\u9fa5（）()·—\-\s]{2,12}图$/

/** 一段原文切到 240 字以内，只在句末断，绝不切断句子 */
function splitLong(text) {
  const out = []
  let rest = text
  while (rest.length > 240) {
    let cut = rest.lastIndexOf('。', 236)
    if (cut < 80) cut = rest.lastIndexOf('；', 236)
    if (cut < 80) cut = rest.lastIndexOf('，', 236)
    if (cut < 80) cut = 236
    out.push(rest.slice(0, cut + 1).trim())
    rest = rest.slice(cut + 1).trim()
  }
  if (rest) out.push(rest)
  return out
}

/**
 * 把原文切成"行"（还不是段落）：
 * 官网有的页把一个自然段硬换行成十几行（每行 20 来字），直接按行渲染会碎成一句一段。
 * 判据：块内（空行之间）平均行长不足 50 字 = 网页硬换行，把这些行接回去；
 * 小标题行（「（1）…」「1. …」）不参与合并，单独成段。
 */
function toLines(text) {
  const chunks = normalize(text).split(/\n\s*\n/)
  const lines = []
  for (const chunk of chunks) {
    const inner = chunk.split('\n').map((line) => line.trim()).filter(Boolean)
    if (inner.length === 0) continue
    if (inner.length === 1) {
      lines.push(inner[0])
      continue
    }
    const avg = inner.reduce((sum, line) => sum + line.length, 0) / inner.length
    if (avg >= 50) {
      lines.push(...inner)
      continue
    }
    let buffer = ''
    const flush = () => {
      if (buffer) {
        lines.push(buffer)
        buffer = ''
      }
    }
    for (const line of inner) {
      if ((SUBHEAD.test(line) || BOLD_LINE.test(line) || IMG_LINE.test(line)) && line.length <= 46) {
        flush()
        lines.push(line)
        continue
      }
      buffer += line
    }
    flush()
  }
  // 网页还会把「4. 区域经济平稳发展」拆成两行（数字一行、点号一行），补回去
  const merged = []
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i]
    const next = lines[i + 1]
    if (next && /^\d+$/.test(line) && /^[.．、]/.test(next)) {
      merged.push(line + next)
      i += 1
      continue
    }
    merged.push(line)
  }
  return merged
}

/** 正文 -> { blocks: [{kind,text|src,alt}], images }；title 用来去掉重复的首行标题 */
function toBlocks(text, title, mediaImages = []) {
  const blocks = []
  const images = []
  const lines = toLines(text)
  let first = true

  for (const line of lines) {
    const image = line.match(IMG_LINE)
    if (image) {
      images.push({ url: image[2], alt: image[1] })
      blocks.push({ kind: 'img', src: image[2], alt: image[1] })
      first = false
      continue
    }
    const bold = line.match(BOLD_LINE)
    if (bold) {
      blocks.push({ kind: 'h3', text: bold[1].replace(/[：:]$/, '').trim() })
      first = false
      continue
    }
    // 首行常是栏目名/页面标题，和 title 重复，丢掉这一行
    if (first && (line === title || line.startsWith(title) || line.endsWith(title) || title.startsWith(line))) {
      first = false
      continue
    }
    first = false
    if (SUBHEAD.test(line) && line.length <= 40) {
      blocks.push({ kind: 'h3', text: line.replace(/\*\*/g, '') })
      continue
    }
    if (CAPTION_LINE.test(line)) {
      blocks.push({ kind: 'note', text: line })
      continue
    }
    // 短、且不带句读的独立行，是原文的提纲小标题（如「具体目标」），别当正文段落
    if (line.length <= 12 && !/[。！？；：，、）》」』”’）]$/.test(line) && !/^\d/.test(line)) {
      blocks.push({ kind: 'h3', text: line })
      continue
    }
    // 一对 ** 若正好跨在切点上，切完两块会各剩半个标记露在正文里；
    // 所以逐块数一遍：标记数不是偶数（不成对）就整块降级成纯文本
    for (const piece of splitLong(line)) {
      const marks = piece.split('**').length - 1
      blocks.push({ kind: 'p', text: marks % 2 === 0 ? piece : piece.replace(/\*\*/g, '') })
    }
  }

  // 原文自带 <img> 的（media.images）补进正文末尾的图集
  const urls = new Set(images.map((im) => im.url))
  for (const im of mediaImages) {
    if (im.url && !urls.has(im.url)) images.push({ url: im.url, alt: im.alt ?? '' })
  }
  return { blocks, images }
}

const DATE = '2022-02-25'

function sectionOf(item) {
  const mediaImages = item.media?.images ?? []
  const { blocks, images } = toBlocks(item.text, item.title, mediaImages)
  return {
    id: item.id,
    title: item.title,
    sub: item.sub,
    date: item.date || DATE,
    sourceUrl: item.source_url ?? '',
    blocks,
    images,
    usage: item.label?.usage ?? '',
    caution: item.label?.caution ?? '',
    copyright: item.label?.copyright ?? '',
  }
}

// 园区：6 个有正文的顶层栏目 + 「园区优势」下 7 个分项（VR展示 只有全景，不进正文列表）
const PARK_TOP = ['基础情况', '发展定位', '园区优势', '创建目标', '园区布局', '支持政策']
const ADVANTAGES = ['产业特色优势明显', '规划布局科学合理', '建设水平区域领先', '绿色发展成效突出', '带动农户作用明显', '政策支持措施有力', '组织管理健全完善']

const bySub = new Map(park.items.map((item) => [item.sub, item]))
if (bySub.size !== park.items.length) {
  throw new Error('园区条目 sub 有重复，按栏目取条目会串：' + park.items.map((it) => it.sub).join(' / '))
}
const parkSections = PARK_TOP.map((sub) => {
  const item = bySub.get(sub)
  if (!item) throw new Error('园区栏目缺条目：' + sub)
  return sectionOf(item)
})
const parkAdvantages = ADVANTAGES.map((sub) => {
  const item = bySub.get(sub)
  if (!item) throw new Error('园区优势分项缺条目：' + sub)
  return sectionOf(item)
})

// 官网「园区优势」总述页（h-col-123）与「带动农户作用明显」分项页（h-col-144）是同一篇正文，
// 只差网页硬换行；这里按正文指纹标出来，页面上不再把同一篇贴两遍。
const fingerprint = (section) => section.blocks.map((block) => block.text ?? block.src ?? '').join('').replace(/\s+/g, '')
const overview = parkSections.find((section) => section.id === 'YQ-004')
if (overview) {
  const base = fingerprint(overview)
  for (const advantage of parkAdvantages) {
    if (fingerprint(advantage) === base) advantage.duplicateOf = 'YQ-004'
  }
}

// ———— VR 场景：以 06-VR全景.json 为准（带官方 VR 编号），按 gid 分组 ————
const SCENE_GROUPS = [
  { gid: '91983', key: 'hongfeng', name: '红峰农场' },
  { gid: '91985', key: 'meihua', name: '广东美华化橘红产业园' },
  { gid: '91986', key: 'daling', name: '中华化橘红第一村（大岭村）' },
  { gid: '91987', key: 'nongken', name: '农垦农业公园' },
  { gid: '91988', key: 'xintang', name: '新塘村—山鸡塘村' },
]

/**
 * 单场景全景页：酷雷曼给每场面都留了 yun_preview（pano.html?tileserver=...），
 * 直接开就是这一场；外层入口 kuleiman.com/147899 不认 #场景名，所以深链只能走这个。
 * 原文里带 &amp; 实体，这里还原成 &。
 */
function panoUrlOf(media) {
  const raw = media?.yun_preview ?? ''
  if (!raw) return ''
  const url = raw.replace(/&amp;/g, '&').trim()
  return url.startsWith('//') ? 'https:' + url : url
}

// 06 是全量场景表，02 只有缩略/预览两栏；单场地址一律从 06 按 scene_id 补
const vrBySceneId = new Map(vr.items.map((entry) => [entry.scene_id, entry]))

function sceneOf(item) {
  const local = join(publicVr, item.scene_id + '.jpg')
  const media = item.media ?? {}
  const master = vrBySceneId.get(item.scene_id)
  return {
    id: item.id,
    title: item.title,
    gid: item.gid,
    sceneId: item.scene_id,
    slices: item.slices ?? 0,
    thumb: media.thumb ?? '',
    preview: media.preview ?? '',
    panoUrl: panoUrlOf(media) || panoUrlOf(master?.media ?? {}),
    thumbLocal: existsSync(local) ? '/img/vr/' + item.scene_id + '.jpg' : '',
    group: item.media?.gid ?? '',
  }
}

const vrItems = vr.items.map(sceneOf)
const parkGroups = SCENE_GROUPS.map((group) => ({
  ...group,
  scenes: vrItems.filter((scene) => scene.gid === group.gid),
}))

// 博物馆：馆内 8（gid 91984 里除去生产车间）+ 配套车间 3
const MUSEUM_SCENES = museum.items.map(sceneOf)
const museumGroups = [
  { key: 'hall', name: '馆内场景', scenes: MUSEUM_SCENES.filter((s) => s.title.indexOf('生产车间') !== 0) },
  { key: 'workshop', name: '配套车间', scenes: MUSEUM_SCENES.filter((s) => s.title.indexOf('生产车间') === 0) },
]
for (const group of museumGroups) {
  for (const scene of group.scenes) {
    scene.group = group.key
  }
}

const museumArticles = museum.articles.map((article) => {
  const { blocks } = toBlocks(article.text, article.title)
  const plain = normalize(article.text).trim()
  // 镜像抓到的常常是在半句上截断的，页面上要照实说明，不能写「读全文」
  const truncated = !/[。！？…”』」）]$/.test(plain)
  return {
    truncated,
    id: article.id,
    title: article.title.replace(/\s*\|\|\s*/g, ' · '),
    sub: article.sub ?? '博览馆文章',
    date: article.date ?? '',
    sourceUrl: article.source_url ?? '',
    text: normalize(article.text),
    blocks,
    usage: article.label?.usage ?? '',
    caution: article.label?.caution ?? '',
    copyright: article.label?.copyright ?? '',
  }
})

// 概览数字：取自原文与 docs/17、18 的定稿口径（不是估算，改数字先改文档）
const parkStats = [
  { value: '10.2', unit: '万亩', label: '园区化橘红种植面积 · 占全市 90.2%' },
  { value: '79.29', unit: '亿元', label: '园区化橘红总产值 · 2022' },
  { value: '30', unit: '万人', label: '直接带动种植的农民' },
  { value: '36', unit: '个', label: '园区全景场景 · 五处基地' },
]
const museumStats = [
  { value: '8', unit: '个', label: '馆内全景场景' },
  { value: '3', unit: '个', label: '配套生产车间场景' },
  { value: '4', unit: '篇', label: '博览馆相关文章' },
  { value: '3A', unit: '级', label: '国家旅游景区 · 2026 年获批' },
]

mkdirSync(dataDir, { recursive: true })
writeFileSync(
  join(dataDir, 'park.json'),
  JSON.stringify({ generatedFrom: 'materials/01-园区展示.json + 06-VR全景.json', sections: parkSections, advantages: parkAdvantages, groups: parkGroups, stats: parkStats }, null, 2) + '\n',
)
writeFileSync(
  join(dataDir, 'museum.json'),
  JSON.stringify({ generatedFrom: 'materials/02-博物馆展示.json + 06-VR全景.json', groups: museumGroups, articles: museumArticles, stats: museumStats }, null, 2) + '\n',
)

const sceneCount = parkGroups.reduce((sum, group) => sum + group.scenes.length, 0)
console.log('园区：' + parkSections.length + ' 栏目 + ' + parkAdvantages.length + ' 分项 + ' + sceneCount + ' 场景（' + parkGroups.length + ' 组）')
console.log('博物馆：' + museumGroups.reduce((sum, g) => sum + g.scenes.length, 0) + ' 场景 + ' + museumArticles.length + ' 文章')