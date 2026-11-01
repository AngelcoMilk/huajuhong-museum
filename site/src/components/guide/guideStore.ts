import type { GuideActionCard, GuideChatMessage, GuideMessageState } from './useGuideChat'

// 讲解员的对话存在浏览器里：跳转、刷新、关掉标签页再打开，半小时内都接着。
// 超过半小时没对话就换新会话。服务端同样空闲 30 分钟丢弃会话（server/src/contract.ts）。

export const GUIDE_IDLE_MS = 30 * 60 * 1000
export const GUIDE_CHAT_KEY = 'hj-guide-chat'
/** 退出登录时发出：在跑的讲解员要换新会话 */
export const GUIDE_RESET_EVENT = 'hj-guide-reset'

const MAX_MESSAGES = 40
const MESSAGE_STATES: GuideMessageState[] = ['pending', 'streaming', 'done', 'stopped', 'error']

export interface SavedChat {
  sessionId: string
  lastActiveAt: number
  messages: GuideChatMessage[]
}

function storage(): Storage | null {
  try {
    return window.localStorage
  } catch {
    return null
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function restoreCard(raw: unknown): GuideActionCard | null {
  if (!isRecord(raw) || typeof raw.id !== 'string' || typeof raw.type !== 'string' || typeof raw.text !== 'string') {
    return null
  }
  const card = { id: raw.id, type: raw.type, text: raw.text, canUndo: false }
  // 恢复出来的卡片只显示结果：不能再撤销，没做完的也绝不重新执行
  if (raw.state === 'running') return { ...card, state: 'failed', text: '这一步被中断了，结果请看页面。' }
  if (raw.state === 'failed' || raw.state === 'undone') return { ...card, state: raw.state }
  return { ...card, state: 'ok' }
}

function restoreMessage(raw: unknown): GuideChatMessage | null {
  if (!isRecord(raw) || typeof raw.id !== 'string' || typeof raw.text !== 'string') return null
  if (raw.role !== 'user' && raw.role !== 'assistant') return null
  const state = MESSAGE_STATES.find((item) => item === raw.state) ?? 'done'
  const actions = Array.isArray(raw.actions) ? raw.actions.map(restoreCard) : []
  // 刷新会掐断请求，有时比离开事件还早，存下来的就是网络错误：和回答到一半被打断同样处理
  const cutOff = isRecord(raw.error) && raw.error.code === 'network_error'
  return {
    id: raw.id,
    role: raw.role,
    text: raw.text,
    citations: Array.isArray(raw.citations) ? raw.citations : [],
    actions: actions.filter((card): card is GuideActionCard => card !== null),
    suggestions: Array.isArray(raw.suggestions) ? raw.suggestions.filter((item) => typeof item === 'string') : [],
    // 回答到一半被打断的，留下已有的文字
    state: state === 'pending' || state === 'streaming' || (state === 'error' && cutOff) ? 'stopped' : state,
    error: isRecord(raw.error) && !cutOff ? (raw.error as unknown as GuideChatMessage['error']) : undefined,
  }
}

export function isGuideIdle(lastActiveAt: number, now = Date.now()): boolean {
  return now - lastActiveAt >= GUIDE_IDLE_MS
}

/** 读回对话；没有、读不懂或已经超过半小时都返回 null，超时的顺手删掉 */
export function loadChat(now = Date.now()): SavedChat | null {
  const store = storage()
  if (!store) return null
  try {
    const raw = store.getItem(GUIDE_CHAT_KEY)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    if (
      isRecord(parsed) &&
      typeof parsed.sessionId === 'string' &&
      typeof parsed.lastActiveAt === 'number' &&
      Array.isArray(parsed.messages) &&
      !isGuideIdle(parsed.lastActiveAt, now)
    ) {
      const messages = parsed.messages.map(restoreMessage)
      return {
        sessionId: parsed.sessionId,
        lastActiveAt: parsed.lastActiveAt,
        messages: messages.filter((message): message is GuideChatMessage => message !== null),
      }
    }
  } catch {
    // 内容坏了就当没有
  }
  store.removeItem(GUIDE_CHAT_KEY)
  return null
}

export function saveChat(chat: SavedChat): void {
  try {
    storage()?.setItem(GUIDE_CHAT_KEY, JSON.stringify({ ...chat, messages: chat.messages.slice(-MAX_MESSAGES) }))
  } catch {
    // 存不下就只保留当前页面里的
  }
}

export function clearChat(): void {
  try {
    storage()?.removeItem(GUIDE_CHAT_KEY)
  } catch {
    // 隐私模式下忽略
  }
}

/** 退出登录：公用电脑上下一个人不该看到这段对话 */
export function resetGuideChat(): void {
  clearChat()
  window.dispatchEvent(new Event(GUIDE_RESET_EVENT))
}
