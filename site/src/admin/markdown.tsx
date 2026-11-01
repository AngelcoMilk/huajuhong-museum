// 讲解员回答的 Markdown 显示。规则和前台讲解员面板（components/guide/GuidePanel.tsx）一致，
// 那边的函数没有导出，样式也绑着前台的纸面配色，所以后台单放一份，配 admin.css 的 .md-*。
import type { ReactNode } from "react";

/** 只放行 http(s)，避免知识库里出现 javascript:/data: 链接被直接点开 */
function safeHref(raw: string): string | null {
  return /^https?:\/\//i.test(raw) ? raw : null
}

/** 行内格式：**强调色**、==高亮==、*斜体*、`行内代码`、[文字](链接)，换行转 <br> */
function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = []
  const lines = text.split("\n")
  lines.forEach((line, lineIndex) => {
    if (lineIndex > 0) nodes.push(<br key={`${keyPrefix}-br-${lineIndex}`} />)
    const pattern = /(\*\*[^*]+\*\*|==[^=]+==|\*[^*\s][^*]*\*|`[^`]+`|\[[^\]]+\]\([^)\s]+\))/g
    let cursor = 0
    let match: RegExpExecArray | null
    let index = 0
    while ((match = pattern.exec(line)) !== null) {
      if (match.index > cursor) nodes.push(line.slice(cursor, match.index))
      const token = match[0]
      const key = `${keyPrefix}-i-${lineIndex}-${index}`
      if (token.startsWith("**")) {
        // 允许 **==重点==** 这类嵌套：内层再走一次行内解析
        nodes.push(<strong key={key}>{renderInline(token.slice(2, -2), `${key}-s`)}</strong>)
      } else if (token.startsWith("==")) {
        nodes.push(<mark key={key}>{renderInline(token.slice(2, -2), `${key}-m`)}</mark>)
      } else if (token.startsWith("`")) {
        nodes.push(<code key={key}>{token.slice(1, -1)}</code>)
      } else if (token.startsWith("[")) {
        const link = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(token)
        const href = link ? safeHref(link[2]) : null
        nodes.push(
          href ? (
            <a key={key} href={href} target="_blank" rel="noreferrer noopener">
              {link ? link[1] : token}
            </a>
          ) : (
            <span key={key}>{link ? link[1] : token}</span>
          ),
        )
      } else {
        nodes.push(<em key={key}>{token.slice(1, -1)}</em>)
      }
      cursor = match.index + token.length
      index += 1
    }
    if (cursor < line.length) nodes.push(line.slice(cursor))
  })
  return nodes
}

const LIST_ITEM = /^\s*(?:[-*+]|\d+[.)])\s+/
const HEADING = /^\s*(#{1,6})\s+(.*)$/
const QUOTE = /^\s*>\s?/
const RULE = /^\s*(-{3,}|\*{3,}|_{3,})\s*$/

/** Markdown：段落、标题、引用、分割线、列表、代码块 + 行内样式 */
export function renderMarkdown(text: string): ReactNode[] {
  const lines = text.split("\n")
  const blocks: ReactNode[] = []
  let cursor = 0
  let blockKey = 0

  while (cursor < lines.length) {
    const line = lines[cursor]

    if (line.trimStart().startsWith("```")) {
      const lang = line.trim().slice(3).trim()
      cursor += 1
      const body: string[] = []
      while (cursor < lines.length && !lines[cursor].trimStart().startsWith("```")) {
        body.push(lines[cursor])
        cursor += 1
      }
      if (cursor < lines.length) cursor += 1
      blocks.push(
        <pre key={`pre-${blockKey}`} className="md-pre">
          <code className={lang ? `language-${lang}` : undefined}>{body.join("\n")}</code>
        </pre>,
      )
      blockKey += 1
      continue
    }

    if (!line.trim()) {
      cursor += 1
      continue
    }

    if (RULE.test(line)) {
      blocks.push(<hr key={`hr-${blockKey}`} className="md-hr" />)
      blockKey += 1
      cursor += 1
      continue
    }

    const heading = HEADING.exec(line)
    if (heading) {
      const level = Math.min(heading[1].length, 4)
      // ### 及以内用 h3，#### 降一档；面板里不需要真正的 h1/h2
      const Tag = level <= 3 ? "h3" : "h4"
      blocks.push(
        <Tag key={`h-${blockKey}`} className="md-h" data-level={level}>
          {renderInline(heading[2], `h-${blockKey}`)}
        </Tag>,
      )
      blockKey += 1
      cursor += 1
      continue
    }

    if (QUOTE.test(line)) {
      const quote: string[] = []
      while (cursor < lines.length && QUOTE.test(lines[cursor])) {
        quote.push(lines[cursor].replace(QUOTE, ""))
        cursor += 1
      }
      blocks.push(
        <blockquote key={`q-${blockKey}`} className="md-quote">
          {renderInline(quote.join("\n"), `q-${blockKey}`)}
        </blockquote>,
      )
      blockKey += 1
      continue
    }

    if (LIST_ITEM.test(line)) {
      const ordered = /^\s*\d/.test(line)
      const items: ReactNode[] = []
      let itemIndex = 0
      while (cursor < lines.length && LIST_ITEM.test(lines[cursor])) {
        const itemText = lines[cursor].replace(LIST_ITEM, "")
        items.push(<li key={`li-${blockKey}-${itemIndex}`}>{renderInline(itemText, `li-${blockKey}-${itemIndex}`)}</li>)
        cursor += 1
        itemIndex += 1
      }
      const ListTag = ordered ? "ol" : "ul"
      blocks.push(
        <ListTag key={`list-${blockKey}`} className="md-list">
          {items}
        </ListTag>,
      )
      blockKey += 1
      continue
    }

    const paragraph: string[] = []
    while (
      cursor < lines.length &&
      lines[cursor].trim() &&
      !LIST_ITEM.test(lines[cursor]) &&
      !HEADING.test(lines[cursor]) &&
      !QUOTE.test(lines[cursor]) &&
      !RULE.test(lines[cursor]) &&
      !lines[cursor].trimStart().startsWith("```")
    ) {
      paragraph.push(lines[cursor])
      cursor += 1
    }
    blocks.push(
      <p key={`p-${blockKey}`} className="md-p">
        {renderInline(paragraph.join("\n"), `p-${blockKey}`)}
      </p>,
    )
    blockKey += 1
  }

  return blocks
}
