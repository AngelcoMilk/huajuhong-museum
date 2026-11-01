import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router'
import { shopApi } from '../lib/shop/api'
import { toShopError } from '../lib/shop/errors'
import { dateTime, money, statusLabel } from '../lib/shop/format'
import { useSession } from '../lib/shop/session'
import type { Order, OrderStatus } from '../lib/shop/types'
import '../styles/shop.css'

type Tab = 'all' | OrderStatus

const TABS: { key: Tab; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'pending_payment', label: '待付款' },
  { key: 'paid', label: '已付款' },
  { key: 'cancelled', label: '已取消' },
]

export default function Orders() {
  const session = useSession()
  const user = session?.user
  const navigate = useNavigate()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [tab, setTab] = useState<Tab>('all')
  const [params] = useSearchParams()
  const { key } = useLocation()
  const wantedTab = params.get('tab')

  // 讲解员带来付款：/orders?tab=pending_payment
  useEffect(() => {
    const match = TABS.find((item) => item.key === wantedTab)
    if (match) setTab(match.key)
  }, [wantedTab, key])

  useEffect(() => {
    if (!user) return
    let alive = true
    setLoading(true)
    shopApi
      .listOrders(user.id)
      .then((list) => {
        if (alive) setOrders(list)
      })
      .catch((caught) => {
        if (alive) setError(toShopError(caught).message)
      })
      .finally(() => {
        if (alive) setLoading(false)
      })
    return () => {
      alive = false
    }
  }, [user])

  const list = useMemo(
    () => (tab === 'all' ? orders : orders.filter((order) => order.status === tab)),
    [orders, tab],
  )

  return (
    <div className="shop shop--orders">
      <header className="shop-head">
        <h1 className="shop-title">我的订单</h1>
      </header>

      <div className="orders-bar">
        <div className="orders-tabs" aria-label="订单筛选">
          {TABS.map((item) => (
            <button
              key={item.key}
              type="button"
              aria-pressed={tab === item.key}
              className={tab === item.key ? 'is-on' : ''}
              onClick={() => setTab(item.key)}
            >
              {item.label}
              <span>
                {item.key === 'all' ? orders.length : orders.filter((order) => order.status === item.key).length}
              </span>
            </button>
          ))}
        </div>
        <Link className="btn" to="/account">账户与地址簿</Link>
      </div>

      {loading ? (
        <div className="cart-loading" aria-busy="true"><span /><span /><span /></div>
      ) : error ? (
        <p className="shop-alert" role="alert">{error}</p>
      ) : list.length === 0 ? (
        <div className="shop-empty">
          <p>{tab === 'all' ? '还没有订单。' : '这个状态下没有订单。'}</p>
          <Link className="btn btn--solid" to="/products">去挑产品</Link>
        </div>
      ) : (
        <ul className="orders-list">
          {list.map((order) => (
            <li className={'order-card order-card--' + order.status} key={order.orderNo}>
              <header className="order-card__head">
                <div>
                  <p className="order-card__no">{order.orderNo}</p>
                  <p className="order-card__time">{dateTime(order.createdAt)} · {order.items.reduce((sum, item) => sum + item.qty, 0)} 件</p>
                </div>
                <span className="order-card__status">{statusLabel(order.status)}</span>
              </header>

              <div className="order-card__body">
                <Link className="order-card__thumbs" to={'/order/' + order.orderNo} aria-label="查看订单详情">
                  {order.items.slice(0, 4).map((item) =>
                    item.thumb ? (
                      <img key={item.skuId} src={item.thumb} alt={item.title} loading="lazy" />
                    ) : (
                      <span key={item.skuId} style={{ width: 56, height: 56 }} />
                    ),
                  )}
                  {order.items.length > 4 ? <span>+{order.items.length - 4}</span> : null}
                </Link>
                <div className="order-card__items">
                  {order.items.slice(0, 2).map((item) => (
                    <p key={item.skuId}>{item.title} · {item.variant} × {item.qty}</p>
                  ))}
                  {order.items.length > 2 ? <p className="order-card__more">等 {order.items.length} 种商品</p> : null}
                </div>
                <div className="order-card__side">
                  <p className="order-card__amount">¥{money(order.totalCents).slice(1)}</p>
                  <p className="order-card__ship">{order.shipping.name}{order.address.city ? ' · ' + order.address.city : ''}</p>
                </div>
              </div>

              <footer className="order-card__foot">
                <span>收件人 {order.address.name}</span>
                <div>
                  <Link className="btn btn--sm" to={'/order/' + order.orderNo}>查看详情</Link>
                  {order.status === 'pending_payment' ? (
                    <button type="button" className="btn btn--solid btn--sm" onClick={() => navigate('/pay/' + order.orderNo)}>
                      去付款
                    </button>
                  ) : null}
                </div>
              </footer>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
