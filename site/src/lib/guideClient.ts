/* AI 讲解员的流式客户端。
 * 后端接口：
 *   POST {base}/api/agent/session → { sessionId }，会话 id 由服务端签发
 *   POST {base}/api/agent/chat
 *   body { sessionId, message, page? }
 *   响应 text/event-stream，帧格式 event: <name>\ndata: <json>\n\n
 *   事件 token / citation / action / error / done
 * 注意：必须 fetch + response.body.getReader()，不能用 EventSource（只支持 GET）。
 */

export interface GuideCartLine {
  skuId: string
  title: string
  variant: string
  qty: number
}

export interface GuidePageContext {
  route?: string
  cart?: GuideCartLine[]
  signedIn?: boolean
  /** 未过期的待付款订单数；未登录或查询失败时不带 */
  pendingOrders?: number
}

export interface GuideCitation {
  id: string
  title: string
  source: string
  /** 原文出处（如《中国药典》1963年版一部）；为空表示只有知识库 */
  origin?: string
  url?: string
}

export type GuideActionType = 'goto_page' | 'cart_add' | 'cart_set' | 'cart_remove' | 'goto_checkout' | 'goto_pay'

export interface GuideAction {
  type: GuideActionType
  payload: unknown
}

export interface GuideUsage {
  inputTokens: number
  outputTokens: number
}

export type GuideServerEvent =
  | { event: 'token'; data: { text: string } }
  | { event: 'citation'; data: GuideCitation }
  | { event: 'action'; data: GuideAction }
  | { event: 'suggestions'; data: { items: string[] } }
  | { event: 'error'; data: { code: string; message: string } }
  | { event: 'done'; data: { sessionId: string; usage?: GuideUsage; finishReason?: string } }

export type GuideFetch = (url: string, init?: RequestInit) => Promise<Response>

/** 默认同源：开发期由 vite proxy 转发到 127.0.0.1:3000，生产由部署层反代 */
export const DEFAULT_GUIDE_BASE_URL = ''

const SESSION_KEY = 'hj-guide-session-id'

/** 后端地址：import.meta.env.VITE_GUIDE_API ?? http://localhost:3000 */
export function resolveGuideBaseUrl(): string {
  const meta = import.meta as ImportMeta & { env?: Record<string, string | undefined> }
  const raw = meta.env?.VITE_GUIDE_API
  const base = typeof raw === 'string' && raw.trim() ? raw.trim() : DEFAULT_GUIDE_BASE_URL
  return base.replace(/\/+$/, '')
}

function doFetch(options: { fetchImpl?: GuideFetch }): GuideFetch {
  if (options.fetchImpl) return options.fetchImpl
  return (url, init) => fetch(url, init)
}

export class GuideHttpError extends Error {
  readonly status: number
  /** 后端错误信封里的 code；非 JSON 错误体时为 http_error */
  readonly code: string

  constructor(status: number, message: string, code = 'http_error') {
    super(message)
    this.name = 'GuideHttpError'
    this.status = status
    this.code = code
  }
}

/** 后端会给出 { code, message }（如 too_long 2000 字上限），别只留一个 HTTP 状态码 */
async function httpError(response: Response, fallback: string): Promise<GuideHttpError> {
  try {
    const body = (await response.json()) as { code?: string; message?: string }
    return new GuideHttpError(
      response.status,
      typeof body?.message === 'string' && body.message ? body.message : fallback,
      typeof body?.code === 'string' && body.code ? body.code : undefined,
    )
  } catch {
    return new GuideHttpError(response.status, fallback) // 非 JSON 错误体
  }
}

/** 一帧 SSE：`event: <name>\ndata: <json>`（多行 data 会拼回一行 JSON） */
function parseFrame(frame: string): GuideServerEvent | null {
  let name = 'message'
  const dataLines: string[] = []
  for (const rawLine of frame.split(/\r?\n/)) {
    if (!rawLine || rawLine.startsWith(':')) continue // 注释行 / 心跳
    const colon = rawLine.indexOf(':')
    const field = colon === -1 ? rawLine : rawLine.slice(0, colon)
    let value = colon === -1 ? '' : rawLine.slice(colon + 1)
    if (value.startsWith(' ')) value = value.slice(1)
    if (field === 'event') name = value
    else if (field === 'data') dataLines.push(value)
  }
  if (dataLines.length === 0) return null
  const raw = dataLines.join('\n').trim()
  if (!raw) return null
  let data: unknown
  try {
    data = JSON.parse(raw)
  } catch {
    return null // 坏帧直接跳过，不打断本轮
  }
  switch (name) {
    case 'token':
    case 'citation':
    case 'action':
    case 'suggestions':
    case 'error':
    case 'done':
      return { event: name, data } as GuideServerEvent
    default:
      return null // 未知事件（如 ping）忽略
  }
}

/** 缓冲区切帧：

 分隔；chunk 切断事件时残片留在 buffer 里等下一块。 */
export function createSseParser(onEvent: (event: GuideServerEvent) => void) {
  let buffer = ''

  const emit = (frame: string) => {
    const parsed = parseFrame(frame)
    if (parsed) onEvent(parsed)
  }

  return {
    push(chunk: string) {
      buffer += chunk
      const frames = buffer.split(/\r?\n\r?\n/)
      buffer = frames.pop() ?? ''
      for (const frame of frames) emit(frame)
    },
    /** 流结束时冲掉末尾残留帧（服务端可能没有以空行收尾） */
    flush() {
      const rest = buffer
      buffer = ''
      if (rest.trim()) emit(rest)
    },
  }
}

export interface StreamChatOptions {
  sessionId: string
  message: string
  page?: GuidePageContext
  signal?: AbortSignal
  onEvent: (event: GuideServerEvent) => void
  baseUrl?: string
  fetchImpl?: GuideFetch
}

/** 发起一轮对话；事件随流到达时回调。HTTP 非 200 抛 GuideHttpError。 */
export async function streamChat(options: StreamChatOptions): Promise<void> {
  const base = options.baseUrl ?? resolveGuideBaseUrl()
  const request = doFetch(options)
  const body: Record<string, unknown> = { sessionId: options.sessionId, message: options.message }
  if (options.page) body.page = options.page

  const response = await request(`${base}/api/agent/chat`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', accept: 'text/event-stream' },
    body: JSON.stringify(body),
    signal: options.signal,
  })

  if (!response.ok) throw await httpError(response, `讲解服务返回 HTTP ${response.status}`)
  if (!response.body) {
    throw new Error('当前浏览器不支持流式响应')
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  const parser = createSseParser(options.onEvent)

  try {
    for (;;) {
      const { done, value } = await reader.read()
      if (done) break
      parser.push(decoder.decode(value, { stream: true }))
    }
    parser.push(decoder.decode())
    parser.flush()
  } finally {
    try {
      reader.releaseLock()
    } catch {
      // 已被 abort，忽略
    }
  }
}

/** 向服务端要一个签发好的会话 id：访客第一次提问时才调用。 */
export async function requestSessionId(
  options: { baseUrl?: string; fetchImpl?: GuideFetch; signal?: AbortSignal } = {},
): Promise<string> {
  const base = options.baseUrl ?? resolveGuideBaseUrl()
  const request = doFetch(options)
  const response = await request(`${base}/api/agent/session`, { method: 'POST', signal: options.signal })
  if (!response.ok) throw await httpError(response, `讲解服务返回 HTTP ${response.status}`)
  const body = (await response.json()) as { sessionId?: unknown }
  if (typeof body?.sessionId !== 'string' || !body.sessionId) {
    throw new GuideHttpError(response.status, '讲解服务暂时不可用，请稍后再试。')
  }
  return body.sessionId
}

/** 新会话时通知后端丢弃上下文；失败不阻塞前端换 id。 */
export async function resetSession(
  sessionId: string,
  options: { baseUrl?: string; fetchImpl?: GuideFetch } = {},
): Promise<void> {
  const base = options.baseUrl ?? resolveGuideBaseUrl()
  const request = doFetch(options)
  const response = await request(`${base}/api/agent/reset`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ sessionId }),
  })
  if (!response.ok) {
    throw new GuideHttpError(response.status, `重置会话失败 HTTP ${response.status}`)
  }
}

/** 健康检查：后端没起时返回 false。 */
export async function checkGuideHealth(
  options: { baseUrl?: string; fetchImpl?: GuideFetch } = {},
): Promise<boolean> {
  const base = options.baseUrl ?? resolveGuideBaseUrl()
  const request = doFetch(options)
  try {
    const response = await request(`${base}/api/health`)
    return response.ok
  } catch {
    return false
  }
}

function safeSessionStorage(): Storage | null {
  try {
    return typeof window !== 'undefined' ? window.sessionStorage : null
  } catch {
    return null
  }
}

/** sessionStorage 里沿用上次的 id；没有时返回空串，第一次提问再向服务端要。 */
export function loadSessionId(): string {
  return safeSessionStorage()?.getItem(SESSION_KEY) ?? ''
}

export function saveSessionId(sessionId: string): void {
  const storage = safeSessionStorage()
  if (sessionId) storage?.setItem(SESSION_KEY, sessionId)
  else storage?.removeItem(SESSION_KEY)
}
