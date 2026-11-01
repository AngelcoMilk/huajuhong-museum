import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router'
import { useSession } from '../../lib/shop/session'

// 只有购物流程需要登录：结算、付款、订单、账户。
// 产品浏览与购物车保持访客可用。
export default function RequireAuth({ children }: { children: ReactNode }) {
  const session = useSession()
  const location = useLocation()

  if (!session) {
    const next = location.pathname + location.search
    return <Navigate to={'/login?next=' + encodeURIComponent(next)} replace />
  }

  return <>{children}</>
}
