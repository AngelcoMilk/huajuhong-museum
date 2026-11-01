import { useCallback } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router'
import type { GuideAction } from '../../lib/guideClient'
import { useSession } from '../../lib/shop/session'
import { GuideDock } from './GuideDock'
import { readGuidePage, runGuideAction } from './guideActions'

// 登录、注册页不显示讲解员
const NO_DOCK = new Set(['/login', '/register'])

// 讲解员挂在展示区最外层，把登录、注册页也包进来：
// 中途去登录再回来，对话和正在输出的回答都不会断。
export default function GuideHost() {
  const { pathname, search, hash } = useLocation()
  const navigate = useNavigate()
  const session = useSession()

  const onAction = useCallback((action: GuideAction) => runGuideAction(action, navigate), [navigate])
  const getPage = useCallback(() => readGuidePage(pathname + search + hash), [pathname, search, hash])

  return (
    <>
      <Outlet />
      <GuideDock
        persist
        hidden={NO_DOCK.has(pathname)}
        identity={session?.user.id ?? null}
        getPage={getPage}
        onAction={onAction}
      />
    </>
  )
}
