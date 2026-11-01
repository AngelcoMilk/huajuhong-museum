import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router'
import { shopApi } from '../lib/shop/api'
import { shopData } from '../lib/shop/data'
import { toShopError } from '../lib/shop/errors'
import { countdown, dateTime, money } from '../lib/shop/format'
import { useSession } from '../lib/shop/session'
import type { Order, PayCode } from '../lib/shop/types'
import '../styles/shop.css'

/** 只接受后端下发的纯 SVG；带脚本 / 事件属性 / foreignObject 的一律拒掉 */
function safeQrSvg(svg: unknown): string | null {
  if (typeof svg !== 'string') return null
  if (!/^\s*<svg[\s>]/i.test(svg)) return null
  if (/<script|on[a-z]+\s*=|foreignobject|<iframe|<style/i.test(svg)) return null
  return svg
}

type Stage = 'idle' | 'qrcode' | 'processing' | 'done'

export default function Pay() {
  const { orderNo } = useParams<{ orderNo: string }>()
  const session = useSession()
  const user = session?.user

  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [stage, setStage] = useState<Stage>('idle')
  const [payCode, setPayCode] = useState<PayCode | null>(null)
  const [fetching, setFetching] = useState(false)
  const [method, setMethod] = useState(shopData.paymentMethods[0]?.key ?? 'wechat')
  const [now, setNow] = useState(() => Date.now())
  const confirmRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    if (!user || !orderNo) {
      setLoading(false)
      return
    }
    let alive = true
    setLoading(true)
    shopApi
      .getOrder(user.id, orderNo)
      .then((found) => {
        if (!alive) return
        setOrder(found)
        setMethod(found.paymentMethod)
        if (found.status === 'paid') setStage('done')
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

  useEffect(() => {
    if (stage !== 'qrcode' && stage !== 'processing') return
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    if (stage === 'qrcode') confirmRef.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && stage === 'qrcode') setStage('idle')
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = originalOverflow
      previous?.focus()
    }
  }, [stage])

  /** 向服务端要一张收款码：二维码由后端现场生成，前端只负责展示 */
  const openPayCode = async () => {
    if (!user || !order) return
    setError('')
    setFetching(true)
    try {
      const code = await shopApi.getPayCode(user.id, order.orderNo, method)
      setPayCode(code)
      setStage('qrcode')
    } catch (caught) {
      setError(toShopError(caught).message)
    } finally {
      setFetching(false)
    }
  }

  const confirm = async () => {
    if (!user || !order) return
    setStage('processing')
    setError('')
    try {
      const paid = await shopApi.payOrder(user.id, order.orderNo, method)
      setOrder(paid)
      setStage('done')
    } catch (caught) {
      setError(toShopError(caught).message)
      setStage('idle')
    }
  }

  const qrSvg = useMemo(() => safeQrSvg(payCode?.qr.data), [payCode])

  if (loading) {
    return <div className="shop shop--pay"><div className="cart-loading" aria-busy="true"><span /><span /><span /></div></div>
  }

  if (!order) {
    return (
      <div className="shop shop--pay">
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

  if (order.status === 'cancelled') {
    return (
      <div className="shop shop--pay">
        <div className="shop-empty">
          <span className="seal zhu" aria-hidden="true">止</span>
          <p>这一单已经取消，不能再付款。</p>
          <p className="shop-empty__note">超过支付时限或主动取消后会停在这里；回购物车重新下一单即可。</p>
          <div className="shop-empty__acts">
            <Link className="btn btn--solid" to="/cart">回购物车</Link>
            <Link className="btn" to="/orders">我的订单</Link>
          </div>
        </div>
      </div>
    )
  }

  const methodName = shopData.paymentMethods.find((item) => item.key === order.paymentMethod)?.name ?? '在线支付'
  const selectedMethodName = shopData.paymentMethods.find((item) => item.key === method)?.name ?? '在线支付'
  const remaining = order.expiresAt - now
  const paid = order.status === 'paid' || stage === 'done'
  const expired = !paid && remaining <= 0

  return (
    <div className="shop shop--pay">
      <header className="shop-head pay__head">
        <h1 className="shop-title">{paid ? '付款完成' : '确认支付'}</h1>
      </header>

      {paid ? (
        <section className="pay-done" aria-live="polite">
          <span className="pay-done__seal zhu zhu--lg zhu--two" aria-hidden="true">付讫</span>
          <div className="pay-done__body">
            <p className="pay-done__k">订单 {order.orderNo}</p>
            <p className="pay-done__amount">¥{money(order.totalCents).slice(1)}</p>
            <p className="pay-done__meta">
              {methodName} · 付款于 {dateTime(order.paidAt)}
            </p>
            <div className="pay-done__acts">
              <Link className="btn btn--solid" to={'/order/' + order.orderNo}>查看订单</Link>
              <Link className="btn" to="/products">继续选购</Link>
              <Link className="btn" to="/orders">全部订单</Link>
            </div>
          </div>
        </section>
      ) : (
        <div className="pay__grid">
          <section className="pay-order" aria-label="订单信息">
            <div className="pay-order__top">
              <div>
                <p className="kicker">订单号</p>
                <h2>{order.orderNo}</h2>
              </div>
              <span className="pay-status">待付款</span>
            </div>

            <ul className="pay-items">
              {order.items.map((item) => (
                <li key={item.skuId}>
                  {item.thumb ? (
                    <img src={item.thumb} alt="" loading="lazy" />
                  ) : (
                    <span aria-hidden="true" style={{ display: 'block', width: '100%', aspectRatio: '1', background: 'var(--paper-3)' }} />
                  )}
                  <span>
                    <b>{item.title}</b>
                    <em>{item.variant} × {item.qty}</em>
                  </span>
                  <i>¥{money(item.priceCents * item.qty).slice(1)}</i>
                </li>
              ))}
            </ul>

            <dl className="sum-rows">
              <div><dt>商品合计</dt><dd>¥{money(order.subtotalCents).slice(1)}</dd></div>
              <div><dt>运费 · {order.shipping.name}</dt><dd>¥{money(order.shippingFeeCents).slice(1)}</dd></div>
              <div className="sum-rows__total"><dt>应付</dt><dd>¥{money(order.totalCents).slice(1)}</dd></div>
            </dl>

            <div className="pay-addr">
              <p className="pay-addr__k">收件信息</p>
              <p>
                <b>{order.address.name}</b> · {order.address.phone}
              </p>
              <p>
                {order.address.province} {order.address.city} {order.address.district} {order.address.detail}
                {order.address.postcode ? ' · ' + order.address.postcode : ''}
              </p>
              {order.note ? <p className="pay-addr__note">留言：{order.note}</p> : null}
            </div>

            <p className="pay-order__time">下单于 {dateTime(order.createdAt)}</p>
          </section>

          <section className="pay-card" aria-label="付款">
            <p className="pay-card__k">应付金额</p>
            <p className="pay-card__amount"><small>¥</small>{money(order.totalCents).slice(1)}</p>
            <p className="pay-card__countdown">
              支付时限 <b>{countdown(remaining)}</b>
            </p>

            <div className="pay-methods" role="radiogroup" aria-label="付款方式">
              {shopData.paymentMethods.map((item) => (
                <label className={'pay-method' + (method === item.key ? ' is-on' : '')} key={item.key}>
                  <input
                    type="radio"
                    name="pay-method"
                    value={item.key}
                    checked={method === item.key}
                    onChange={() => setMethod(item.key)}
                  />
                  <span>
                    <b>{item.name}</b>
                    <em>{item.desc}</em>
                  </span>
                  <i aria-hidden="true">{method === item.key ? '●' : '○'}</i>
                </label>
              ))}
            </div>

            {error ? <p className="checkout__error" role="alert">{error}</p> : null}
            {expired ? (
              <p className="pay-card__expired" role="alert">
                支付时限已过。请<Link to="/cart">回购物车</Link>重新下单，这一单不会再进入付款。
              </p>
            ) : null}
            <button
              type="button"
              className="btn btn--solid btn--wide pay-card__go"
              onClick={() => void openPayCode()}
              disabled={expired || fetching}
            >
              {fetching ? '正在取码…' : '确认支付'}
            </button>

            <ol className="pay-steps" aria-label="付款步骤">
              <li className="is-done">提交订单</li>
              <li className="is-now">确认支付</li>
              <li>扫码付款</li>
              <li>完成</li>
            </ol>
            <p className="pay-card__link"><Link to="/cart">← 回购物车</Link></p>
          </section>
        </div>
      )}

      {stage === 'qrcode' || stage === 'processing' ? (
        <div className="pay-sheet">
          <div
            className="pay-sheet__veil"
            aria-hidden="true"
            onClick={() => stage === 'qrcode' && setStage('idle')}
          />
          <div className="pay-sheet__panel" role="dialog" aria-modal="true" aria-labelledby="pay-sheet-title">
            {stage === 'processing' ? (
              <div className="pay-processing" aria-live="polite">
                <span className="pay-processing__ring" aria-hidden="true" />
                <h2 id="pay-sheet-title">正在确认付款…</h2>
              </div>
            ) : (
              <>
                <p className="kicker">扫码付款</p>
                <h2 id="pay-sheet-title">应付 ¥{money(order.totalCents).slice(1)}</h2>
                <div className="pay-qr">
                  {qrSvg ? (
                    <div className="pay-qr__img" dangerouslySetInnerHTML={{ __html: qrSvg }} />
                  ) : payCode ? (
                    <p className="pay-sheet__note" role="alert">收款码生成异常，请返回重试。</p>
                  ) : (
                    <div className="pay-qr__loading" aria-busy="true" />
                  )}
                </div>
                <dl className="pay-sheet__rows">
                  <div><dt>订单号</dt><dd>{order.orderNo}</dd></div>
                  <div><dt>付款方式</dt><dd>{selectedMethodName}</dd></div>
                  <div><dt>收款方</dt><dd>化州橘红博览馆</dd></div>
                </dl>
                <div className="pay-sheet__acts">
                  <button type="button" className="btn" onClick={() => setStage('idle')}>返回</button>
                  <button ref={confirmRef} type="button" className="btn btn--solid" onClick={() => void confirm()}>完成付款</button>
                </div>
              </>
            )}
          </div>
        </div>
      ) : null}
    </div>
  )
}
