import { useEffect } from 'react'
import { shopApi } from './api'
import { clearSession, patchSessionUser, useSession } from './session'

/**
 * 会话只有 token 在前端，刷新后找后端校准一次；失效就退回游客态，
 * 避免页面显示已登录、点哪里都报「登录状态已失效」。
 */
export function useSessionCheck(): void {
  const session = useSession()
  const token = session?.token
  useEffect(() => {
    if (!token) return
    let alive = true
    shopApi
      .me(token)
      .then((user) => {
        if (!alive) return
        if (user) patchSessionUser(user)
        else clearSession()
      })
      .catch(() => {
        // 网络失败时保留本地会话。
      })
    return () => {
      alive = false
    }
  }, [token])
}
