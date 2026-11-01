import { useCallback, useEffect, useRef, useState } from 'react'
import type { KeyboardEvent, PointerEvent as ReactPointerEvent, ReactNode } from 'react'
import type { GuideChatController, GuideChatMessage } from './useGuideChat'
import type { GuideCitation } from '../../lib/guideClient'

export interface PanelDragHandlers {
  onPointerDown: (event: ReactPointerEvent<HTMLElement>) => void
  onPointerMove: (event: ReactPointerEvent<HTMLElement>) => void
  onPointerUp: (event: ReactPointerEvent<HTMLElement>) => void
  onPointerCancel: (event: ReactPointerEvent<HTMLElement>) => void
}

export interface GuidePanelProps {
  chat: GuideChatController
  onClose: () => void
  /** 窗口拖动：挂在头部整条与消息区空白处；不传则面板固定 */
  dragHandlers?: PanelDragHandlers
  /** 打开时聚焦输入框。刷新或登录回来时恢复的面板不抢焦点，手机上不弹键盘 */
  autoFocus?: boolean
}

const SUGGESTIONS = ['化橘红为什么叫“南方人参”？', '古法炮制有哪几道工序？', '馆里最值得看的展品是哪件？']

/** 只放行 http(s)，避免知识库里出现 javascript:/data: 链接被直接点开 */
function safeHref(raw: string): string | null {
  return /^https?:\/\//i.test(raw) ? raw : null
}

/** 行内格式：**强调色**、==高亮==、*斜体*、`行内代码`、[文字](链接)，换行转 <br> */
function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = []
  const lines = text.split('\n')
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
      if (token.startsWith('**')) {
        // 允许 **==重点==** 这类嵌套：内层再走一次行内解析
        nodes.push(<strong key={key}>{renderInline(token.slice(2, -2), `${key}-s`)}</strong>)
      } else if (token.startsWith('==')) {
        nodes.push(<mark key={key}>{renderInline(token.slice(2, -2), `${key}-m`)}</mark>)
      } else if (token.startsWith('`')) {
        nodes.push(<code key={key}>{token.slice(1, -1)}</code>)
      } else if (token.startsWith('[')) {
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
function renderMarkdown(text: string): ReactNode[] {
  const lines = text.split('\n')
  const blocks: ReactNode[] = []
  let cursor = 0
  let blockKey = 0

  while (cursor < lines.length) {
    const line = lines[cursor]

    if (line.trimStart().startsWith('```')) {
      const lang = line.trim().slice(3).trim()
      cursor += 1
      const body: string[] = []
      while (cursor < lines.length && !lines[cursor].trimStart().startsWith('```')) {
        body.push(lines[cursor])
        cursor += 1
      }
      if (cursor < lines.length) cursor += 1
      blocks.push(
        <pre key={`pre-${blockKey}`} className="hj-guide-pre">
          <code className={lang ? `language-${lang}` : undefined}>{body.join('\n')}</code>
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
      blocks.push(<hr key={`hr-${blockKey}`} className="hj-guide-hr" />)
      blockKey += 1
      cursor += 1
      continue
    }

    const heading = HEADING.exec(line)
    if (heading) {
      const level = Math.min(heading[1].length, 4)
      // ### 及以内用 h3，#### 降一档；面板里不需要真正的 h1/h2
      const Tag = level <= 3 ? 'h3' : 'h4'
      blocks.push(
        <Tag key={`h-${blockKey}`} className="hj-guide-h" data-level={level}>
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
        quote.push(lines[cursor].replace(QUOTE, ''))
        cursor += 1
      }
      blocks.push(
        <blockquote key={`q-${blockKey}`} className="hj-guide-quote">
          {renderInline(quote.join('\n'), `q-${blockKey}`)}
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
        const itemText = lines[cursor].replace(LIST_ITEM, '')
        items.push(<li key={`li-${blockKey}-${itemIndex}`}>{renderInline(itemText, `li-${blockKey}-${itemIndex}`)}</li>)
        cursor += 1
        itemIndex += 1
      }
      const ListTag = ordered ? 'ol' : 'ul'
      blocks.push(
        <ListTag key={`list-${blockKey}`} className="hj-guide-list">
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
      !lines[cursor].trimStart().startsWith('```')
    ) {
      paragraph.push(lines[cursor])
      cursor += 1
    }
    blocks.push(
      <p key={`p-${blockKey}`} className="hj-guide-p">
        {renderInline(paragraph.join('\n'), `p-${blockKey}`)}
      </p>,
    )
    blockKey += 1
  }

  return blocks
}

/**
 * 引用小字的文案规则：
 * - 有原文出处（典籍/记载名）就显示它，例如「引用自 《中国药典》1963年版一部」
 * - 没有具体出处、只是知识库内容，就只显示「引用自 知识库」
 * - 任何时候都不展示知识库文件名或内部条目名
 */
function citationOrigin(citation: GuideCitation): string {
  return (citation.origin ?? '').trim() || '知识库'
}

function CitationList({ citations }: { citations: GuideCitation[] }) {
  if (citations.length === 0) return null
  return (
    <div className="hj-guide-citations" aria-label="引用出处">
      {citations.map((citation) => {
        const label = citationOrigin(citation)
        return (
          <div className="hj-guide-citation" key={citation.id}>
            <span className="hj-guide-citation__lead">引用自</span>
            {citation.url ? (
              <a className="hj-guide-citation__origin" href={citation.url} target="_blank" rel="noreferrer">
                {label}
              </a>
            ) : (
              <span className="hj-guide-citation__origin">{label}</span>
            )}
          </div>
        )
      })}
    </div>
  )
}

function ActionCards({ message, onUndo }: { message: GuideChatMessage; onUndo: (messageId: string, cardId: string) => void }) {
  if (message.actions.length === 0) return null
  return (
    <ul className="hj-guide-cards">
      {message.actions.map((card) => (
        <li className="hj-guide-card" key={card.id} data-action={card.type} data-state={card.state}>
          <span className="hj-guide-card__text" role="status">
            {card.text}
          </span>
          {card.canUndo && (card.state === 'ok' || card.state === 'undoing') ? (
            <button
              type="button"
              className="hj-guide-card__undo"
              disabled={card.state === 'undoing'}
              onClick={() => onUndo(message.id, card.id)}
            >
              {card.state === 'undoing' ? '撤销中…' : '撤销'}
            </button>
          ) : null}
          {card.undoError ? (
            <span className="hj-guide-card__err" role="alert">
              {card.undoError}
            </span>
          ) : null}
        </li>
      ))}
    </ul>
  )
}

function SuggestionChips({
  items,
  onPick,
  disabled,
}: {
  items: string[]
  onPick: (text: string) => void
  disabled: boolean
}) {
  if (items.length === 0) return null
  return (
    <div className="hj-guide-chips" aria-label="候选追问">
      {items.map((item) => (
        <button
          type="button"
          className="hj-guide-chip"
          key={item}
          onClick={() => onPick(item)}
          disabled={disabled}
        >
          {item}
        </button>
      ))}
    </div>
  )
}

function MessageBubble({
  message,
  onSuggest,
  onUndo,
  busy,
  withSeal = false,
}: {
  message: GuideChatMessage
  onSuggest: (text: string) => void
  onUndo: (messageId: string, cardId: string) => void
  busy: boolean
  /** 只在最新一条回答上盖落款印 */
  withSeal?: boolean
}) {
  const isUser = message.role === 'user'
  return (
    <div
      className={`hj-guide-msg hj-guide-msg--${isUser ? 'user' : 'assistant'}`}
      data-state={message.state}
      data-seal={!isUser && withSeal ? 'true' : undefined}
    >
      <div className="hj-guide-msg__bubble">
        {isUser ? (
          <p className="hj-guide-p hj-guide-p--plain">{message.text}</p>
        ) : message.text ? (
          renderMarkdown(message.text)
        ) : message.state === 'pending' ? (
          <span className="hj-guide-typing" aria-label="讲解员正在思考">
            <i />
            <i />
            <i />
          </span>
        ) : null}
        {!isUser && message.state === 'streaming' ? <span className="hj-guide-caret" aria-hidden="true" /> : null}
        {!isUser && message.state === 'stopped' && !message.text ? (
          <p className="hj-guide-p hj-guide-p--muted">已停止本轮回答。</p>
        ) : null}
      </div>
      {!isUser ? <CitationList citations={message.citations} /> : null}
      {!isUser ? <ActionCards message={message} onUndo={onUndo} /> : null}
      {!isUser ? (
        <SuggestionChips items={message.suggestions} onPick={onSuggest} disabled={busy} />
      ) : null}
    </div>
  )
}

export function GuidePanel({ chat, onClose, dragHandlers, autoFocus = true }: GuidePanelProps) {
  const [input, setInput] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const busy = chat.status !== 'idle'

  useEffect(() => {
    if (autoFocus) textareaRef.current?.focus()
    // 只在面板出现时聚焦一次
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        onClose()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  useEffect(() => {
    const node = scrollRef.current
    if (node) node.scrollTop = node.scrollHeight
  }, [chat.messages])

  const resize = useCallback(() => {
    const node = textareaRef.current
    if (!node) return
    node.style.height = 'auto'
    node.style.height = `${Math.min(node.scrollHeight, 132)}px`
  }, [])

  const submit = useCallback(async () => {
    const value = input.trim()
    if (!value || chat.status !== 'idle') return
    setInput('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
    await chat.send(value)
  }, [chat, input])

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== 'Enter') return
    if (event.shiftKey) return
    // keyCode 229 兜住 Safari「组字结束后紧跟的 Enter」漏判
    if (event.nativeEvent.isComposing || event.keyCode === 229) return
    event.preventDefault()
    void submit()
  }

  const sendSuggestion = (text: string) => {
    if (chat.status !== 'idle') return
    void chat.send(text)
  }

  return (
    <section
      className="hj-guide-panel"
      id="hj-guide-panel"
      role="dialog"
      aria-label="橘红讲解员"
      aria-modal="false"
    >
      <header className="hj-guide-head" {...(dragHandlers ?? {})}>
        <div className="hj-guide-head__title">
          <span className="hj-guide-seal" aria-hidden="true">
            橘
          </span>
          <span className="hj-guide-head__text">
            <strong>橘红讲解员</strong>
          </span>
        </div>
        <div className="hj-guide-head__ops">
          <button
            type="button"
            className="hj-guide-op"
            aria-label="开始新会话"
            onClick={() => void chat.newSession()}
          >
            新会话
          </button>
          <button type="button" className="hj-guide-op hj-guide-op--icon" aria-label="关闭讲解员" onClick={onClose}>
            ×
          </button>
        </div>
      </header>

      <div
        className="hj-guide-scroll"
        ref={scrollRef}
        // 只有点在空白背景上才拖动窗口；落在气泡/文案上留给选中文字
        onPointerDown={(event) => {
          if (!dragHandlers) return
          if (event.target !== event.currentTarget) return
          dragHandlers.onPointerDown(event)
        }}
        onPointerMove={dragHandlers?.onPointerMove}
        onPointerUp={dragHandlers?.onPointerUp}
        onPointerCancel={dragHandlers?.onPointerCancel}
      >
        {chat.messages.length === 0 ? (
          <div className="hj-guide-welcome">
            <p className="hj-guide-welcome__lead">
              你好，我是橘红讲解员。关于<strong>化橘红</strong>的历史、工艺、展品与馆内动线，都可以问我。
            </p>
            <div className="hj-guide-chips">
              {SUGGESTIONS.map((item) => (
                <button
                  type="button"
                  className="hj-guide-chip"
                  key={item}
                  onClick={() => sendSuggestion(item)}
                  disabled={busy}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        ) : (
          chat.messages.map((message, index) => (
            <MessageBubble
              key={message.id}
              message={message}
              onSuggest={sendSuggestion}
              onUndo={chat.undoAction}
              busy={busy}
              withSeal={index === chat.messages.length - 1}
            />
          ))
        )}
      </div>

      {chat.error ? (
        <div className="hj-guide-error" role="alert">
          {chat.error.message}
        </div>
      ) : null}

      <footer className="hj-guide-composer">
        <div className="hj-guide-composer__row">
          <textarea
            ref={textareaRef}
            className="hj-guide-input"
            rows={1}
            value={input}
            placeholder="问点什么…"
            aria-label="向讲解员提问"
            onChange={(event) => {
              setInput(event.target.value)
              resize()
            }}
            onKeyDown={handleKeyDown}
          />
          {busy ? (
            <button type="button" className="hj-guide-send hj-guide-send--stop" onClick={chat.stop} aria-label="停止回答">
              停止
            </button>
          ) : (
            <button
              type="button"
              className="hj-guide-send"
              onClick={() => void submit()}
              disabled={!input.trim()}
              aria-label="发送消息"
            >
              发送
            </button>
          )}
        </div>
      </footer>
    </section>
  )
}
