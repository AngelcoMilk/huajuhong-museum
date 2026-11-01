import { useCallback, useEffect, useRef, useState } from 'react'
import {
  GuideHttpError,
  loadSessionId,
  requestSessionId,
  resetSession,
  saveSessionId,
  streamChat,
} from '../../lib/guideClient'
import type {
  GuideAction,
  GuideCitation,
  GuidePageContext,
  GuideServerEvent,
  GuideFetch,
} from '../../lib/guideClient'
import { GUIDE_CHAT_KEY, GUIDE_RESET_EVENT, clearChat, isGuideIdle, loadChat, saveChat } from './guideStore'

export type GuideStatus = 'idle' | 'thinking' | 'streaming'

export type GuideMessageState = 'pending' | 'streaming' | 'done' | 'stopped' | 'error'

export interface GuideChatError {
  code: string
  message: string
}

/** 对话里的一张操作卡片：讲解员替访客做了什么、结果如何 */
export interface GuideActionCard {
  id: string
  type: string
  state: 'running' | 'ok' | 'failed' | 'undoing' | 'undone'
  text: string
  canUndo: boolean
  undoError?: string
}

/** 宿主页面执行动作后的结果 */
export interface GuideActionResult {
  ok: boolean
  text: string
  /** 能撤销的动作才有：成功返回卡片的新文字，失败抛错 */
  undo?: () => Promise<string>
}

export interface GuideChatMessage {
  id: string
  role: 'user' | 'assistant'
  text: string
  citations: GuideCitation[]
  actions: GuideActionCard[]
  /** 本轮回答后给出的候选追问 */
  suggestions: string[]
  state: GuideMessageState
  error?: GuideChatError
}

export interface GuideChatController {
  sessionId: string
  messages: GuideChatMessage[]
  /** 待机 / 思考中（已发出请求、还没首个 token）/ 输出中（流式） */
  status: GuideStatus
  error: GuideChatError | null
  send: (text: string) => Promise<void>
  stop: () => void
  newSession: () => Promise<void>
  undoAction: (messageId: string, cardId: string) => void
  /** 超过半小时没对话就换新会话（只在 persist 时生效） */
  refreshIfIdle: () => void
  /** 去掉所有撤销按钮：登录会合并购物车，旧数量已经不可靠 */
  dropUndo: () => void
}

export interface UseGuideChatOptions {
  page?: GuidePageContext
  /** 发送时才取的页面上下文（如最新购物车）；传了就不用 page */
  getPage?: () => GuidePageContext | Promise<GuidePageContext>
  baseUrl?: string
  fetchImpl?: GuideFetch
  /** 讲解员发来的前端动作（跳转、操作购物车）；返回的结果显示成卡片 */
  onAction?: (action: GuideAction) => GuideActionResult | Promise<GuideActionResult> | void
  /** 把对话存进浏览器，半小时内接着聊；只在第一次渲染时读取 */
  persist?: boolean
}

/** 宿主页面没有接动作时，卡片只写收到了什么 */
const ACTION_LABELS: Record<string, string> = {
  goto_page: '打开页面',
  cart_add: '加入购物车',
  cart_set: '修改数量',
  cart_remove: '移出购物车',
  goto_checkout: '去结算',
  goto_pay: '去付款',
}

// 带上这次页面加载的标记：恢复出来的旧消息也有 id，不能撞车
const messageBase = Date.now().toString(36)
let messageSeq = 0
function nextMessageId(prefix: string): string {
  messageSeq += 1
  return `${prefix}-${messageBase}-${messageSeq}`
}

function isAbortError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false
  const name = (error as { name?: string }).name
  return name === 'AbortError'
}

function describeError(error: unknown): GuideChatError {
  if (error instanceof GuideHttpError) return { code: error.code, message: error.message }
  // fetch 失败抛的是 TypeError，英文原文不给访客看
  if (error instanceof Error && !(error instanceof TypeError)) return { code: 'network_error', message: error.message }
  return { code: 'network_error', message: '讲解服务暂时不可用，请稍后再试。' }
}

/**
 * AI 讲解员的会话状态机。
 * 状态迁移：idle --send--> thinking --首个 token--> streaming --done/error/stop--> idle
 */
export function useGuideChat(options: UseGuideChatOptions = {}): GuideChatController {
  const optionsRef = useRef(options)
  useEffect(() => {
    optionsRef.current = options
  })

  const [restored] = useState(() => (options.persist ? loadChat() : null))
  const [sessionId, setSessionId] = useState<string>(
    () => restored?.sessionId ?? (options.persist ? '' : loadSessionId()),
  )
  const [messages, setMessages] = useState<GuideChatMessage[]>(restored?.messages ?? [])
  const [status, setStatus] = useState<GuideStatus>('idle')
  const [error, setError] = useState<GuideChatError | null>(null)

  const abortRef = useRef<AbortController | null>(null)
  const statusRef = useRef<GuideStatus>('idle')
  const activeRef = useRef<{ runId: number; assistantId: string } | null>(null)
  const runIdRef = useRef(0)
  /** 已进入终止态（done/error）的 runId，之后到达的帧一律丢弃 */
  const terminalRunRef = useRef(-1)
  /** sessionId 的同步副本：newSession 需要拿到"切换前"的 id 去服务端释放 */
  const sessionIdRef = useRef(sessionId)
  useEffect(() => {
    sessionIdRef.current = sessionId
  })
  /** 动作和撤销排队一个一个做：「加购再去结算」要等加购落库 */
  const actionQueueRef = useRef<Promise<void>>(Promise.resolve())
  const undoRef = useRef(new Map<string, () => Promise<string>>())
  /** 最后一次发送或回答结束的时间，半小时规则从这里算；0 表示还没聊过 */
  const lastActiveRef = useRef(restored?.lastActiveAt ?? 0)
  const latestRef = useRef({ sessionId, messages })
  /** 从别的标签页读来的消息不用再写回去，否则两边会来回覆盖 */
  const adoptedRef = useRef<GuideChatMessage[] | null>(null)
  const saveTimerRef = useRef<number | null>(null)

  const flushChat = useCallback(() => {
    if (!optionsRef.current.persist) return
    const latest = latestRef.current
    if (latest.messages.length === 0) return
    saveChat({ sessionId: latest.sessionId, lastActiveAt: lastActiveRef.current, messages: latest.messages })
  }, [])

  // 流式输出时 token 很密，最多 300ms 写一次；离开页面时补写最后一段
  useEffect(() => {
    latestRef.current = { sessionId, messages }
    if (!optionsRef.current.persist || messages.length === 0 || messages === adoptedRef.current) return
    if (saveTimerRef.current !== null) return
    saveTimerRef.current = window.setTimeout(() => {
      saveTimerRef.current = null
      flushChat()
    }, 300)
  }, [flushChat, messages, sessionId])

  useEffect(() => {
    if (!options.persist) return
    window.addEventListener('pagehide', flushChat)
    return () => {
      window.removeEventListener('pagehide', flushChat)
      if (saveTimerRef.current !== null) {
        window.clearTimeout(saveTimerRef.current)
        saveTimerRef.current = null
      }
      flushChat()
    }
  }, [flushChat, options.persist])

  const applyStatus = useCallback((next: GuideStatus) => {
    statusRef.current = next
    setStatus(next)
  }, [])

  const patchMessage = useCallback((id: string, patch: (message: GuideChatMessage) => GuideChatMessage) => {
    setMessages((prev) => prev.map((message) => (message.id === id ? patch(message) : message)))
  }, [])

  const patchCard = useCallback(
    (messageId: string, cardId: string, patch: Partial<GuideActionCard>) => {
      patchMessage(messageId, (message) => ({
        ...message,
        actions: message.actions.map((card) => (card.id === cardId ? { ...card, ...patch } : card)),
      }))
    },
    [patchMessage],
  )

  const runAction = useCallback(
    async (runId: number, messageId: string, cardId: string, action: GuideAction) => {
      // 访客点了停止或开了新一轮：还没轮到的动作不再执行
      if (runIdRef.current !== runId) {
        patchCard(messageId, cardId, { state: 'failed', text: '已取消。' })
        return
      }
      try {
        const result = await optionsRef.current.onAction?.(action)
        if (!result || typeof result !== 'object') {
          patchCard(messageId, cardId, { state: 'ok', text: ACTION_LABELS[action.type] ?? action.type })
          return
        }
        if (result.undo) undoRef.current.set(cardId, result.undo)
        patchCard(messageId, cardId, {
          state: result.ok ? 'ok' : 'failed',
          text: result.text,
          canUndo: Boolean(result.undo),
        })
      } catch (error) {
        console.warn('[guide] onAction 执行失败', error)
        patchCard(messageId, cardId, { state: 'failed', text: '这一步没有做成。' })
      }
    },
    [patchCard],
  )

  const undoAction = useCallback(
    (messageId: string, cardId: string) => {
      const undo = undoRef.current.get(cardId)
      if (!undo) return // 连点只算一次
      undoRef.current.delete(cardId)
      patchCard(messageId, cardId, { state: 'undoing', undoError: undefined })
      actionQueueRef.current = actionQueueRef.current.then(async () => {
        try {
          const text = await undo()
          patchCard(messageId, cardId, { state: 'undone', text, canUndo: false })
        } catch (error) {
          undoRef.current.set(cardId, undo) // 失败了可以再点
          patchCard(messageId, cardId, {
            state: 'ok',
            undoError: error instanceof Error ? error.message : '撤销没有成功。',
          })
        }
      })
    },
    [patchCard],
  )

  useEffect(() => {
    return () => {
      // 让在飞的回调全部失效，避免卸载后继续 setState
      runIdRef.current += 1
      abortRef.current?.abort()
      abortRef.current = null
    }
  }, [])

  const handleEvent = useCallback(
    (runId: number, assistantId: string, event: GuideServerEvent) => {
      if (runIdRef.current !== runId) return
      // done/error 之后服务端不该再发帧；万一发了也不能把状态翻回 streaming
      if (terminalRunRef.current === runId) return
      switch (event.event) {
        case 'token': {
          const text = typeof event.data?.text === 'string' ? event.data.text : ''
          if (!text) return
          if (statusRef.current !== 'streaming') applyStatus('streaming')
          patchMessage(assistantId, (message) => ({ ...message, state: 'streaming', text: message.text + text }))
          return
        }
        case 'citation': {
          const citation = event.data
          if (!citation || typeof citation.id !== 'string') return
          // 去重键用「出处」而不是 id：同一篇文章切成多片时 id 不同、出处相同，
          // 按 id 去重会让界面重复显示两条一模一样的"引用自 …"。
          // 去重键 = 界面上真正显示的那行文字：没有出处的统一归到"知识库"，
          // 否则多个无出处条目会并排显示好几条一模一样的"引用自 知识库"。
          const key = citation.origin || citation.url || '知识库'
          patchMessage(assistantId, (message) =>
            message.citations.some((item) => (item.origin || item.url || '知识库') === key)
              ? message
              : { ...message, citations: [...message.citations, citation] },
          )
          return
        }
        case 'action': {
          const action = event.data
          if (!action || typeof action.type !== 'string') return
          const cardId = nextMessageId('action')
          patchMessage(assistantId, (message) => ({
            ...message,
            actions: [...message.actions, { id: cardId, type: action.type, state: 'running', text: '处理中…', canUndo: false }],
          }))
          // 交给宿主页面真正执行，结果写回卡片
          actionQueueRef.current = actionQueueRef.current.then(() => runAction(runId, assistantId, cardId, action))
          return
        }
        case 'suggestions': {
          const items = Array.isArray(event.data?.items) ? event.data.items.filter((x) => typeof x === 'string') : []
          if (items.length === 0) return
          patchMessage(assistantId, (message) => ({ ...message, suggestions: items }))
          return
        }
        case 'error': {
          const payload = event.data ?? { code: 'unknown', message: '讲解服务出错' }
          setError({ code: payload.code ?? 'unknown', message: payload.message ?? '讲解服务出错' })
          patchMessage(assistantId, (message) => ({ ...message, state: 'error', error: payload }))
          terminalRunRef.current = runId
          activeRef.current = null
          lastActiveRef.current = Date.now()
          applyStatus('idle')
          abortRef.current?.abort()
          return
        }
        case 'done': {
          // 超时/中止来的 done 不是正常完成，必须区分出来，否则用户会把半截答案当成品
          const aborted = event.data?.finishReason === 'aborted'
          patchMessage(assistantId, (message) => ({ ...message, state: aborted ? 'stopped' : 'done' }))
          terminalRunRef.current = runId
          activeRef.current = null
          lastActiveRef.current = Date.now()
          applyStatus('idle')
          return
        }
        default:
          return
      }
    },
    [applyStatus, patchMessage, runAction],
  )

  const newSession = useCallback(async () => {
    // 新 id 等下一次提问才要；要释放的是切换前的旧会话
    const oldId = sessionIdRef.current
    runIdRef.current += 1
    abortRef.current?.abort()
    abortRef.current = null
    activeRef.current = null
    saveSessionId('')
    sessionIdRef.current = ''
    setSessionId('')
    setMessages([])
    latestRef.current = { sessionId: '', messages: [] }
    lastActiveRef.current = 0
    undoRef.current.clear()
    if (optionsRef.current.persist) clearChat()
    setError(null)
    applyStatus('idle')
    if (oldId) {
      try {
        await resetSession(oldId, {
          baseUrl: optionsRef.current.baseUrl,
          fetchImpl: optionsRef.current.fetchImpl,
        })
      } catch {
        // 后端不在线也允许本地开新会话
      }
    }
  }, [applyStatus])

  const refreshIfIdle = useCallback(() => {
    if (!optionsRef.current.persist || statusRef.current !== 'idle') return
    if (lastActiveRef.current > 0 && isGuideIdle(lastActiveRef.current)) void newSession()
  }, [newSession])

  const dropUndo = useCallback(() => {
    undoRef.current.clear()
    setMessages((prev) =>
      prev.map((message) =>
        message.actions.some((card) => card.canUndo || card.undoError)
          ? {
              ...message,
              actions: message.actions.map((card) => ({ ...card, canUndo: false, undoError: undefined })),
            }
          : message,
      ),
    )
  }, [])

  // 退出登录时换新会话；别的标签页改了对话就跟上（清空了也跟着清空）
  useEffect(() => {
    if (!options.persist) return
    const onReset = () => void newSession()
    const onStorage = (event: StorageEvent) => {
      if (event.key !== GUIDE_CHAT_KEY && event.key !== null) return
      if (statusRef.current !== 'idle') return
      const saved = loadChat()
      if (!saved) {
        if (latestRef.current.messages.length > 0) void newSession()
        return
      }
      adoptedRef.current = saved.messages
      undoRef.current.clear()
      sessionIdRef.current = saved.sessionId
      lastActiveRef.current = saved.lastActiveAt
      setSessionId(saved.sessionId)
      setMessages(saved.messages)
    }
    window.addEventListener(GUIDE_RESET_EVENT, onReset)
    window.addEventListener('storage', onStorage)
    return () => {
      window.removeEventListener(GUIDE_RESET_EVENT, onReset)
      window.removeEventListener('storage', onStorage)
    }
  }, [newSession, options.persist])

  const send = useCallback(
    async (raw: string) => {
      const text = raw.trim()
      if (!text || statusRef.current !== 'idle') return

      // 停在页面上超过半小时：这一句算新会话，旧记录现在才清
      refreshIfIdle()
      lastActiveRef.current = Date.now()

      const runId = runIdRef.current + 1
      runIdRef.current = runId
      const assistantId = nextMessageId('assistant')
      activeRef.current = { runId, assistantId }
      setError(null)

      const userMessage: GuideChatMessage = {
        id: nextMessageId('user'),
        role: 'user',
        text,
        citations: [],
        actions: [],
        suggestions: [],
        state: 'done',
      }
      setMessages((prev) => [
        ...prev,
        userMessage,
        {
          id: assistantId,
          role: 'assistant',
          text: '',
          citations: [],
          actions: [],
          suggestions: [],
          state: 'pending',
        },
      ])
      applyStatus('thinking')

      const controller = new AbortController()
      abortRef.current = controller

      try {
        let page = optionsRef.current.page
        const getPage = optionsRef.current.getPage
        if (getPage) {
          try {
            page = await getPage()
          } catch {
            // 取不到就不带，不影响提问
          }
          if (runIdRef.current !== runId) return // 等的时候被停止了
        }
        const ask = async () => {
          if (!sessionIdRef.current) {
            const issued = await requestSessionId({
              baseUrl: optionsRef.current.baseUrl,
              fetchImpl: optionsRef.current.fetchImpl,
              signal: controller.signal,
            })
            if (runIdRef.current !== runId) return
            sessionIdRef.current = issued
            setSessionId(issued)
            if (!optionsRef.current.persist) saveSessionId(issued)
          }
          await streamChat({
            sessionId: sessionIdRef.current,
            message: text,
            page,
            signal: controller.signal,
            baseUrl: optionsRef.current.baseUrl,
            fetchImpl: optionsRef.current.fetchImpl,
            onEvent: (event) => handleEvent(runId, assistantId, event),
          })
        }
        try {
          await ask()
        } catch (caught) {
          // 会话过期或是旧版留下的 id：换一个重发这一句，访客不用知道
          if (!(caught instanceof GuideHttpError) || caught.code !== 'guide_session_invalid' || runIdRef.current !== runId) {
            throw caught
          }
          sessionIdRef.current = ''
          await ask()
        }
        if (runIdRef.current === runId && activeRef.current) {
          // 服务端没发 done 就断流：按完成处理，保留已渲染的文本
          patchMessage(assistantId, (message) => ({ ...message, state: 'done' }))
          activeRef.current = null
          lastActiveRef.current = Date.now()
          applyStatus('idle')
        }
      } catch (caught) {
        if (runIdRef.current !== runId) return // 本轮已被 stop 或新会话取消
        if (isAbortError(caught)) {
          patchMessage(assistantId, (message) => ({ ...message, state: 'stopped' }))
        } else {
          const failure = describeError(caught)
          setError(failure)
          patchMessage(assistantId, (message) => ({ ...message, state: 'error', error: failure }))
        }
        activeRef.current = null
        lastActiveRef.current = Date.now()
        applyStatus('idle')
      } finally {
        if (abortRef.current === controller) abortRef.current = null
      }
    },
    [applyStatus, handleEvent, patchMessage, refreshIfIdle],
  )

  const stop = useCallback(() => {
    const active = activeRef.current
    runIdRef.current += 1 // 让旧流的回调全部失效
    abortRef.current?.abort()
    abortRef.current = null
    activeRef.current = null
    lastActiveRef.current = Date.now()
    applyStatus('idle')
    if (active) {
      patchMessage(active.assistantId, (message) => ({
        ...message,
        state: 'stopped',
        error: undefined,
      }))
    }
  }, [applyStatus, patchMessage])

  return { sessionId, messages, status, error, send, stop, newSession, undoAction, refreshIfIdle, dropUndo }
}
