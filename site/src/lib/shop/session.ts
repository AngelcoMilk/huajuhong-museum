import { useSyncExternalStore } from 'react'
import type { Session, User } from './types'

// 演示登录态：token + 用户快照存在 localStorage。
// 真实后端只需要把 token 换成 httpOnly cookie / JWT，页面不用改。

const KEY = 'hjh-shop-session'

let cached: Session | null | undefined
const listeners = new Set<() => void>()

function isSession(value: unknown): value is Session {
  if (!value || typeof value !== 'object') return false
  const item = value as Partial<Session>
  return typeof item.token === 'string' && Boolean(item.user) && typeof item.user?.phone === 'string'
}

function read(): Session | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    return isSession(parsed) ? parsed : null
  } catch {
    return null
  }
}

function emit() {
  for (const listener of listeners) listener()
}

export function getSession(): Session | null {
  if (cached === undefined) cached = read()
  return cached
}

export function subscribeSession(listener: () => void): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function setSession(session: Session) {
  cached = session
  try {
    localStorage.setItem(KEY, JSON.stringify(session))
  } catch {
    // 隐私模式下写不进去：仍然保留内存态，别让登录按钮白点
  }
  emit()
}

export function clearSession() {
  cached = null
  try {
    localStorage.removeItem(KEY)
  } catch {
    // 忽略
  }
  emit()
}

export function patchSessionUser(user: User) {
  const current = getSession()
  if (!current) return
  setSession({ ...current, user })
}

export function sessionToken(): string | null {
  return getSession()?.token ?? null
}

export function useSession(): Session | null {
  return useSyncExternalStore(subscribeSession, getSession, getSession)
}

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key !== KEY) return
    cached = read()
    emit()
  })
}
