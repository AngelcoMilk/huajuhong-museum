import { useEffect } from 'react'
import { Link, Outlet, useLocation } from 'react-router'
import { cartCount, initCart, useCart } from '../../lib/shop/cart'
import { useSession } from '../../lib/shop/session'
import { useSessionCheck } from '../../lib/shop/useSessionCheck'
import '../../styles/shop.css'

/** 结算、付款要一条路走完，不放工具栏 */
const NO_TOOLS = /^\/(checkout|pay)(\/|$)/

const icon = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.4,
  'aria-hidden': true,
} as const

/** 产品中心这一层的工具栏：购物车、订单、账户只在这里出现，其他展厅不打扰。 */
export default function ShopLayout() {
  const { pathname, search } = useLocation()
  const { lines } = useCart()
  const session = useSession()
  const count = cartCount(lines)

  useEffect(() => {
    initCart()
  }, [])

  useSessionCheck()

  // 登录后回到原页面。
  const loginHref = '/login?next=' + encodeURIComponent(pathname + search)
  const hasTools = !NO_TOOLS.test(pathname)
  const onOrders = pathname === '/orders' || pathname.startsWith('/order/')
  // 列表和详情本来就在产品中心（详情有面包屑），只有点进其他板块才要回去的路
  const showBack = !pathname.startsWith('/products')

  return (
    <div className={hasTools ? 'shoplayer' : undefined}>
      <Outlet />
      {hasTools ? (
        <nav className="shoptools" aria-label="购物车、订单与账户">
          {showBack ? (
            <Link className="shoptools__cell shoptools__back" to="/products" aria-label="返回产品中心">
              <svg {...icon}><path d="M11 5l-7 7 7 7M4 12h16" /></svg>
              <span className="shoptools__back-lead">返回</span>
              <span>产品中心</span>
            </Link>
          ) : null}
          <div className="shoptools__group">
          <Link
            className="shoptools__cell shoptools__cell--cart"
            to="/cart"
            aria-current={pathname === '/cart' ? 'page' : undefined}
            aria-label={'购物车，共 ' + count + ' 件'}
          >
            <span className="shoptools__icon">
              <svg {...icon}><path d="M2.5 4H5.5L8 15.5H18.5L21 7.5H6.3" /><circle cx="9.5" cy="19.5" r="1.5" /><circle cx="17" cy="19.5" r="1.5" /></svg>
              {count > 0 ? <em aria-hidden="true">{count > 99 ? '99+' : count}</em> : null}
            </span>
            <span>购物车</span>
          </Link>
          <Link
            className="shoptools__cell"
            to={session ? '/orders' : loginHref}
            aria-current={onOrders ? 'page' : undefined}
          >
            <svg {...icon}><path d="M6 3.5h12v17H6z" /><path d="M9 8.5h6M9 12.5h6M9 16.5h3.5" /></svg>
            <span>订单</span>
          </Link>
          <Link
            className="shoptools__cell"
            to={session ? '/account' : loginHref}
            aria-current={pathname === '/account' ? 'page' : undefined}
          >
            <svg {...icon}><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" /><path d="M4.5 20.5c.8-4 3.7-6 7.5-6s6.7 2 7.5 6" /></svg>
            <span>{session ? '我的' : '登录'}</span>
          </Link>
          </div>
        </nav>
      ) : null}
    </div>
  )
}
