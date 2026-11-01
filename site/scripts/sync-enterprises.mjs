// 从 materials/05-企业展示.json 生成本站用的企业数据。
// 原文 286 KB、字段里有一半本站用不上：这里只留页面要用的，图片截到 12 张（卡片 + 详情够用）。
// 用法：node site/scripts/sync-enterprises.mjs（或 npm --prefix site run sync:enterprises）

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const repo = join(here, '..', '..')
const src = join(repo, 'materials', '05-企业展示.json')
const outDir = join(here, '..', 'src', 'data')
const out = join(outDir, 'enterprises.json')

// ———— 原文排版清洗 ————
// 官网抓下来的正文有排版毛病：整段一坨、句子里夹 (1)(2) 列表、重复标点、引号不成对、
// 中文里混半角标点、数字两侧多空格。这里只做「排版」层面整理，不改一个字词。
const MIN_PARA = 92
const MAX_PARA = 200

function pairQuotes(text) {
  let out = ''
  let open = false
  for (const ch of text) {
    if (ch === '“') {
      if (open) out += '”'
      out += ch
      open = true
    } else if (ch === '”') {
      if (open) {
        out += ch
        open = false
      }
    } else if (ch === '。' && open) {
      out += '。”'
      open = false
    } else {
      out += ch
    }
  }
  if (open) out += '”'
  return out
}

function normalize(text) {
  let t = text.replace(/\r\n?/g, '\n')
  t = t.replace(/\u3000/g, ' ')
  t = t.replace(/[ \t]+/g, ' ')
  t = t.replace(/ *\n */g, '\n')
  t = t.replace(/\s+([，。；：、！？）】》”’])/g, '$1')
  t = t.replace(/([（【《“‘])\s+/g, '$1')
  t = t.replace(/([\u4e00-\u9fa5])\s+(?=\d)/g, '$1')
  t = t.replace(/(\d)\s+(?=[\u4e00-\u9fa5])/g, '$1')
  t = t.replace(/,+\s*(?=[\u4e00-\u9fa5])/g, '，')
  t = t.replace(/=+(?=[\u4e00-\u9fa5])/g, '，')
  t = t.replace(/[，,]{2,}/g, '，')
  t = t.replace(/[。.]{2,}/g, '。')
  t = t.replace(/[；;]{2,}/g, '；')
  t = t.replace(/([，。；：])\1+/g, '$1')
  return pairQuotes(t.trim())
}

function paragraphsOf(text) {
  const blocks = normalize(text).split(/\n+/).filter((line) => line.trim())
  const out = []
  for (const block of blocks) {
    // 句子里夹着 (1)(2)(3) 的，先把列表拆成独立小段
    const pieces = block.split(/(?=（\d+）|\(\d+\))/).filter((part) => part.trim())
    for (const piece of pieces) {
      const trimmed = piece.trim()
      if (/^（\d+）|^\(\d+\)/.test(trimmed)) {
        out.push(trimmed)
        continue
      }
      const sentences = trimmed.match(/[^。！？!?]+[。！？!?]?/g) ?? []
      let current = ''
      for (const sentence of sentences) {
        const next = current + sentence
        if (current && next.length > MAX_PARA) {
          out.push(current.trim())
          current = sentence
        } else if (current && next.length >= MIN_PARA && /[。！？!?]$/.test(sentence)) {
          out.push(next.trim())
          current = ''
        } else {
          current = next
        }
      }
      if (current.trim()) out.push(current.trim())
    }
  }
  return finalizeParagraphs(out.flatMap(splitLongParagraph))
}

/** 收尾：**小标题** 转成 "## 标题"、清掉残留星号、把过短的碎段并回上一段 */
function finalizeParagraphs(paragraphs) {
  const out = []
  for (const raw of paragraphs) {
    const heading = raw.match(/^\*\*(.+?)\*\*[：:]?$/)
    if (heading) {
      out.push('## ' + heading[1].replace(/[：:]$/, '').trim())
      continue
    }
    const text = raw.replace(/\*\*/g, '').trim()
    if (!text) continue
    const previous = out[out.length - 1]
    if (
      text.length < 26 &&
      !/^（\d+）|^\(\d+\)/.test(text) &&
      previous &&
      !previous.startsWith('## ')
    ) {
      out[out.length - 1] = previous + text
      continue
    }
    out.push(text)
  }
  // 残留的星号一律清掉（原文里夹着零散的 markdown 加粗）
  return out.map((paragraph) => paragraph.replace(/\*\*/g, '').trim()).filter(Boolean)
}

/** 有的原文整段只用逗号，没有句号，只能在逗号处硬断，避免一屏 400 多字 */
function splitLongParagraph(paragraph) {
  const out = []
  let rest = paragraph.trim()
  while (rest.length > 240) {
    let cut = rest.lastIndexOf('，', 220)
    if (cut < 80) cut = rest.lastIndexOf('；', 220)
    if (cut < 80) cut = rest.lastIndexOf('。', 220)
    if (cut < 80) cut = 200
    out.push(rest.slice(0, cut + 1).trim())
    rest = rest.slice(cut + 1).trim()
  }
  if (rest) out.push(rest)
  return out
}

const polishText = (text) => paragraphsOf(text ?? '').join('\n')

const MAX_IMAGES = 12
const raw = JSON.parse(readFileSync(src, 'utf8'))

const items = raw.items.map((it) => {
  const images = (it.media?.images ?? [])
    .map((im) => ({ url: im.url, alt: im.alt ?? '' }))
    .filter((im) => im.url)
  // videos 在原文里是纯 URL 字符串（不是对象），这里两种形态都接住
  const videos = (it.media?.videos ?? [])
    .map((v) => (typeof v === 'string' ? { url: v, alt: '' } : { url: v.url ?? '', alt: v.alt ?? '' }))
    .filter((v) => v.url)

  return {
    id: it.id,
    name: it.title,
    town: it.town || '待核',
    address: it.address || '',
    tel: it.tel || '',
    email: it.email || '',
    site: it.site || '',
    shops: (it.shops ?? []).map((s) => ({ label: s.label, url: s.url })),
    text: polishText(it.text),
    date: it.date ?? '',
    sourceUrl: it.source_url ?? '',
    images: images.slice(0, MAX_IMAGES),
    imageTotal: images.length,
    videos,
    articleCount: (it.related_articles ?? []).length,
  }
})

mkdirSync(outDir, { recursive: true })
writeFileSync(
  out,
  JSON.stringify({ generatedFrom: 'materials/05-企业展示.json', count: items.length, items }, null, 2) + '\n',
)
console.log(`wrote ${items.length} enterprises -> ${out}`)