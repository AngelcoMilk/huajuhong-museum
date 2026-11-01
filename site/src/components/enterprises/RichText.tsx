import type { ReactNode } from 'react'

/** 企业自述里值得抬眼一看的东西：数字、荣誉称号、产地与工艺术语、年份 */
const TOKENS: { pattern: string; className: string }[] = [
  { pattern: '“[^”]{2,40}”', className: 'em-honor' },
  {
    pattern:
      '\\d[\\d,.]*(?:\\s*[至~－—-]\\s*\\d[\\d,.]*)?\\s*(?:余)?\\s*(?:万)?\\s*(?:亩|吨|平方米|平方|平米|㎡|m2|项|人|家|条|种|倍|亿元|万元|亿|万|年|%|％)',
    className: 'em-num',
  },
  {
    pattern: '[一二三四五六七八九十百千万两]+\\s*(?:多)?\\s*(?:亩|吨|人|家|项|条|种|倍)',
    className: 'em-num',
  },
  {
    pattern:
      '(?:化橘红|橘红胎|橘红片|橘红|七爪|大五爪|压果片|古法|炮制|焙|蒸|烘焙|正毛|副毛|胎果|胎片|礞石|陈化)',
    className: 'em-term',
  },
  {
    pattern:
      '(?:非物质文化遗产|非遗|地理标志保护产品|地理标志|地理保护标志|药典|道地药材|道地|GMP|GAP|FDA|HACCP|SC|QS|专利|国家发明专利|老字号|龙头企业|示范|基地|产业园|合作社|溯源|赋码|炮制技艺|饮片|红珠胶囊|药品生产许可证|食品生产许可证|出口资质|有机产品认证|质量管理体系认证|食品安全管理体系认证|湾区认证|高新技术企业)',
    className: 'em-cert',
  },
]

const PATTERN = new RegExp(TOKENS.map((token) => '(' + token.pattern + ')').join('|'), 'g')

type Piece = { text: string; className?: string }

/** 把一段原文切成「普通文字 / 强调片段」两类，不动原文一个字 */
function segment(text: string): Piece[] {
  const pieces: Piece[] = []
  let cursor = 0
  for (const match of text.matchAll(PATTERN)) {
    const start = match.index ?? 0
    if (start > cursor) pieces.push({ text: text.slice(cursor, start) })
    const groupIndex = match.slice(1).findIndex((group) => group !== undefined)
    pieces.push({ text: match[0], className: TOKENS[groupIndex]?.className })
    cursor = start + match[0].length
  }
  if (cursor < text.length) pieces.push({ text: text.slice(cursor) })
  return pieces
}

export default function RichText({ text }: { text: string }) {
  const nodes: ReactNode[] = segment(text).map((piece, index) =>
    piece.className ? (
      <span key={index} className={piece.className}>
        {piece.text}
      </span>
    ) : (
      <span key={index}>{piece.text}</span>
    ),
  )
  return <>{nodes}</>
}