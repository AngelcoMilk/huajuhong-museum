import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import QtyStepper from '../components/shop/QtyStepper'
import { cartCount, cartSubtotal, clearCartLines, initCart, removeCartItem, setCartQty, useCart } from '../lib/shop/cart'
import { toShopError } from '../lib/shop/errors'
import { money } from '../lib/shop/format'
import '../styles/shop.css'

export default function CartPage() {
  const { lines, ready, busy } = useCart()
  const navigate = useNavigate()
  const [error, setError] = useState('')

  useEffect(() => {
    initCart()
  }, [])

  const subtotal = cartSubtotal(lines)
  const count = cartCount(lines)

  const update = async (skuId: string, qty: number) => {
    setError('')
    try {
      await setCartQty(skuId, qty)
    } catch (caught) {
      setError(toShopError(caught).message)
    }
  }

  const remove = async (skuId: string) => {
    setError('')
    try {
      await removeCartItem(skuId)
    } catch (caught) {
      setError(toShopError(caught).message)
    }
  }

  const clearAll = async () => {
    if (!window.confirm('清空购物车里的 ' + count + ' 件商品？')) return
    setError('')
    try {
      await clearCartLines()
    } catch (caught) {
      setError(toShopError(caught).message)
    }
  }

  return (
    <div className="shop shop--cart">
      <header className="shop-head">
        <h1 className="shop-title">购物车</h1>
      </header>

      {!ready ? (
        <div className="cart-loading" aria-busy="true">
          <span />
          <span />
          <span />
        </div>
      ) : lines.length === 0 ? (
        <div className="shop-empty shop-empty--cart">
          <p>购物车是空的。</p>
          <div className="shop-empty__acts">
            <Link className="btn btn--solid" to="/products">去产品中心</Link>
          </div>
        </div>
      ) : (
        <div className="cart-layout">
          <section className="cart-main" aria-label="购物车商品">
            <div className="cart-tablehead" aria-hidden="true">
              <span>商品</span>
              <span>单价</span>
              <span>数量</span>
              <span>小计</span>
            </div>
            <ul className="cart-list">
              {lines.map((line) => (
                <li key={line.skuId}>
                  <Link className="cart-line__fig" to={'/products/' + line.productId}>
                    {line.thumb ? (
                      <img src={line.thumb} alt={line.title} loading="lazy" />
                    ) : (
                      <span aria-hidden="true" style={{ display: 'block', width: '100%', aspectRatio: '1', background: 'var(--paper-3)' }} />
                    )}
                  </Link>
                  <div className="cart-line__main">
                    <Link to={'/products/' + line.productId}><b>{line.title}</b></Link>
                    <span className="cart-line__variant">{line.variant}</span>
                    <span className="cart-line__stock">库存 {line.stock}</span>
                  </div>
                  <span className="cart-line__unit">¥{money(line.priceCents).slice(1)}</span>
                  <div className="cart-line__qty">
                    <QtyStepper
                      value={line.qty}
                      onChange={(next) => void update(line.skuId, next)}
                      max={Math.min(line.stock, 99)}
                      disabled={busy}
                      label={line.title + ' 数量'}
                    />
                  </div>
                  <div className="cart-line__sum">
                    <b>¥{money(line.priceCents * line.qty).slice(1)}</b>
                    <button type="button" onClick={() => void remove(line.skuId)} disabled={busy}>
                      移除
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="cart-continue">
              <Link to="/products">← 继续选购</Link>
              <div>
                <button type="button" className="cart-clear" onClick={() => void clearAll()} disabled={busy}>
                  清空购物车
                </button>
                <span>{count} 件商品</span>
              </div>
            </div>
          </section>

          <aside className="cart-side" aria-label="结算摘要">
            <p className="cart-side__kicker">结算摘要</p>
            <dl>
              <div><dt>商品件数</dt><dd>{count} 件</dd></div>
              <div><dt>商品合计</dt><dd>¥{money(subtotal).slice(1)}</dd></div>
              <div><dt>运费</dt><dd>结算时选择</dd></div>
            </dl>
            <p className="cart-side__total">
              <span>合计</span>
              <b>¥{money(subtotal).slice(1)}</b>
            </p>
            <p className="cart-side__note">运费按配送方式计算。</p>
            <button
              type="button"
              className="btn btn--solid btn--wide"
              onClick={() => navigate('/checkout')}
              disabled={busy}
            >
              去结算
            </button>
          </aside>
        </div>
      )}

      {error ? <p className="shop-alert" role="alert">{error}</p> : null}

    </div>
  )
}
