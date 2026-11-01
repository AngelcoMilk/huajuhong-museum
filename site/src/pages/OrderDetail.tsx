import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { shopApi } from '../lib/shop/api'
import { toShopError } from '../lib/shop/errors'
import { dateTime, money, statusLabel } from '../lib/shop/format'
import { useSession } from '../lib/shop/session'
import type { Order } from '../lib/shop/types'
import '../styles/shop.css'

export default function OrderDetail() {
  const { orderNo } = useParams<{ orderNo: string }>()
  const session = useSession()
  const user = session?.user
  const navigate = useNavigate()

  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!user || !orderNo) return
    let alive = true
    setLoading(true)
    shopApi
      .getOrder(user.id, orderNo)
      .then((found) => {
        if (alive) setOrder(found)
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
  }, [user, orderNo])

  const copy = async () => {
    if (!order) return
    try {
      await navigator.clipboard.writeText(order.orderNo)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  if (loading) {
    return <div className="shop shop--order"><div className="cart-loading" aria-busy="true"><span /><span /><span /></div></div>
  }

  if (!order) {
    return (
      <div className="shop shop--order">
        <div className="shop-empty">
          <span className="seal zhu" aria-hidden="true">无</span>
          <p>{error || '没有找到这个订单。'}</p>
          <div className="shop-empty__acts">
            <Link className="btn btn--solid" to="/orders">我的订单</Link>
            <Link className="btn" to="/products">回产品中心</Link>
          </div>
        </div>
      </div>
    )
  }

  const paid = order.status === 'paid'
  const pending = order.status === 'pending_payment'
  const methodName =
    order.paymentMethod === 'wechat' ? '微信支付' : order.paymentMethod === 'alipay' ? '支付宝' : '云闪付'

  return (
    <div className="shop shop--order">
      <nav className="crumbs" aria-label="面包屑">
        <Link to="/orders">我的订单</Link>
        <span aria-hidden="true">/</span>
        <b>{order.orderNo}</b>
      </nav>

      <header className="order-head">
        <div>
          <p className="kicker">订单详情</p>
          <h1 className="shop-title">{statusLabel(order.status)}</h1>
          <p className="order-head__no">
            {order.orderNo}
            <button type="button" className="order-head__copy" onClick={() => void copy()}>
              {copied ? '已复制' : '复制'}
            </button>
          </p>
        </div>
        <span className={'order-stamp zhu-line order-stamp--' + order.status} aria-hidden="true">
          {paid ? '付讫' : order.status === 'cancelled' ? '已取' : '待付'}
        </span>
      </header>

      <div className="order-layout">
        <div className="order-main">
          <section className="order-panel">
            <header className="order-panel__head">
              <h2>商品</h2>
              <span>{order.items.reduce((sum, item) => sum + item.qty, 0)} 件</span>
            </header>
            <ul className="order-items">
              {order.items.map((item) => (
                <li key={item.skuId}>
                  <Link to={'/products/' + item.productId}>
                    {item.thumb ? (
                      <img src={item.thumb} alt={item.title} loading="lazy" />
                    ) : (
                      <span aria-hidden="true" style={{ display: 'inline-block', width: '100%', aspectRatio: '1', background: 'var(--paper-3)' }} />
                    )}
                  </Link>
                  <div>
                    <Link to={'/products/' + item.productId}><b>{item.title}</b></Link>
                    <span>{item.variant} · ¥{money(item.priceCents).slice(1)} × {item.qty}</span>
                  </div>
                  <em>¥{money(item.priceCents * item.qty).slice(1)}</em>
                </li>
              ))}
            </ul>
          </section>

          <section className="order-panel">
            <header className="order-panel__head">
              <h2>收件信息</h2>
            </header>
            <div className="order-addr">
              <p>
                <b>{order.address.name}</b>
                <span>{order.address.phone}</span>
              </p>
              <p>
                {order.address.province} {order.address.city} {order.address.district}
              </p>
              <p>{order.address.detail}</p>
              <p className="order-addr__meta">
                邮编 {order.address.postcode || '未填'} · {order.address.tag || '未标签'} · {order.shipping.name}
              </p>
              {order.note ? <p className="order-addr__note">留言：{order.note}</p> : null}
            </div>
          </section>

          <section className="order-panel">
            <header className="order-panel__head">
              <h2>进度</h2>
            </header>
            <ol className="order-timeline">
              <li className="is-done">
                <b>订单已提交</b>
                <span>{dateTime(order.createdAt)}</span>
              </li>
              <li className={paid ? 'is-done' : 'is-now'}>
                <b>{paid ? '付款完成' : pending ? '等待付款' : '订单已取消'}</b>
                <span>{paid ? dateTime(order.paidAt) : pending ? '待付款' : '—'}</span>
              </li>
              <li>
                <b>{paid ? '等待发货' : '发货'}</b>
              </li>
            </ol>
          </section>
        </div>

        <aside className="order-side">
          <div className="order-sum">
            <p className="order-sum__k">金额</p>
            <dl className="sum-rows">
              <div><dt>商品合计</dt><dd>¥{money(order.subtotalCents).slice(1)}</dd></div>
              <div><dt>运费 · {order.shipping.name}</dt><dd>¥{money(order.shippingFeeCents).slice(1)}</dd></div>
              <div className="sum-rows__total"><dt>合计</dt><dd>¥{money(order.totalCents).slice(1)}</dd></div>
            </dl>
            <dl className="order-meta">
              <div><dt>付款方式</dt><dd>{methodName}</dd></div>
              <div><dt>下单时间</dt><dd>{dateTime(order.createdAt)}</dd></div>
              {paid ? <div><dt>付款时间</dt><dd>{dateTime(order.paidAt)}</dd></div> : null}
            </dl>

            {pending ? (
              <button type="button" className="btn btn--solid btn--wide" onClick={() => navigate('/pay/' + order.orderNo)}>
                去付款
              </button>
            ) : null}
          </div>
        </aside>
      </div>

      <p className="order-back"><Link to="/orders">回我的订单</Link><Link to="/products">继续选购</Link></p>
    </div>
  )
}
