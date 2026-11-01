import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { cnNumber } from '../components/exhibit/Exhibit'
import AddressFields from '../components/shop/AddressFields'
import { shopApi } from '../lib/shop/api'
import { initCart, refreshCart, useCart } from '../lib/shop/cart'
import { shopData } from '../lib/shop/data'
import { toShopError } from '../lib/shop/errors'
import { maskPhone, money } from '../lib/shop/format'
import { useSession } from '../lib/shop/session'
import type { Address, AddressInput } from '../lib/shop/types'
import '../styles/shop.css'

function validate(value: AddressInput): Record<string, string> {
  const errors: Record<string, string> = {}
  if (value.name.trim().length < 1) errors.name = '请填写收货人姓名。'
  if (!/^1[3-9]\d{9}$/.test(value.phone)) errors.phone = '请填写 11 位手机号。'
  if (!value.province || !value.city || !value.district) errors.region = '请选择省、市、区县。'
  if (value.detail.trim().length < 4) errors.detail = '详细地址至少 4 个字。'
  if (value.postcode && !/^\d{6}$/.test(value.postcode)) errors.postcode = '邮编应为 6 位数字，或留空。'
  return errors
}

export default function Checkout() {
  const session = useSession()
  const user = session?.user
  const navigate = useNavigate()
  const { lines, ready } = useCart()

  const [addresses, setAddresses] = useState<Address[]>([])
  const [bookLoading, setBookLoading] = useState(true)
  const [selected, setSelected] = useState<string | null>(null)
  const [saveBook, setSaveBook] = useState(true)
  const [address, setAddress] = useState<AddressInput>({
    name: user?.name ?? '',
    phone: user?.phone ?? '',
    province: '',
    city: '',
    district: '',
    detail: '',
    postcode: '',
    tag: '家',
    isDefault: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [shippingKey, setShippingKey] = useState(shopData.shipping[0]?.key ?? 'standard')
  const [paymentMethod, setPaymentMethod] = useState(shopData.paymentMethods[0]?.key ?? 'wechat')
  const [note, setNote] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    initCart()
  }, [])

  useEffect(() => {
    if (!user) return
    let alive = true
    setBookLoading(true)
    shopApi
      .listAddresses(user.id)
      .then((list) => {
        if (!alive) return
        setAddresses(list)
        const preferred = list.find((item) => item.isDefault) ?? list[0]
        if (preferred) {
          setSelected(preferred.id)
          setSaveBook(false)
          setAddress({
            name: preferred.name,
            phone: preferred.phone,
            province: preferred.province,
            city: preferred.city,
            district: preferred.district,
            detail: preferred.detail,
            postcode: preferred.postcode,
            tag: preferred.tag,
            isDefault: preferred.isDefault,
          })
        }
      })
      .catch(() => {
        if (alive) setAddresses([])
      })
      .finally(() => {
        if (alive) setBookLoading(false)
      })
    return () => {
      alive = false
    }
  }, [user])

  const shipping = shopData.shipping.find((item) => item.key === shippingKey) ?? shopData.shipping[0]
  const subtotal = lines.reduce((sum, line) => sum + line.priceCents * line.qty, 0)
  const total = subtotal + (shipping?.feeCents ?? 0)

  const patchAddress = (patch: Partial<AddressInput>) => {
    setAddress((current) => ({ ...current, ...patch }))
    setSelected(null)
    setSaveBook(true)
  }

  const pickAddress = (item: Address) => {
    setSelected(item.id)
    setSaveBook(false)
    setAddress({
      name: item.name,
      phone: item.phone,
      province: item.province,
      city: item.city,
      district: item.district,
      detail: item.detail,
      postcode: item.postcode,
      tag: item.tag,
      isDefault: item.isDefault,
    })
    setErrors({})
  }

  const useNewAddress = () => {
    setSelected(null)
    setSaveBook(true)
    setAddress({
      name: user?.name ?? '',
      phone: user?.phone ?? '',
      province: '',
      city: '',
      district: '',
      detail: '',
      postcode: '',
      tag: '家',
      isDefault: false,
    })
  }

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (submitting) return
    setError('')
    if (!user) return
    const nextErrors = validate(address)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      setError('收货信息还有几处要补，请看标红的地方。')
      const first = Object.keys(nextErrors)[0]
      const map: Record<string, string> = { name: 'addr-name', phone: 'addr-phone', region: 'addr-province', detail: 'addr-detail', postcode: 'addr-postcode' }
      const target = document.getElementById(map[first] ?? 'addr-name')
      target?.focus()
      target?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    if (!shipping) {
      setError('请选择配送方式。')
      return
    }

    setSubmitting(true)
    try {
      // 选中的是地址簿里的旧地址时不再重复写入；新地址/改过的地址才保存。
      if (saveBook && selected === null) {
        await shopApi.saveAddress(user.id, { ...address, isDefault: addresses.length === 0 })
      }
      const order = await shopApi.createOrder(user.id, {
        address,
        shippingKey: shipping.key,
        paymentMethod,
        note,
      })
      // 不在跳转前等购物车刷新：订单已经生成，顶栏数量让 store 自己去同步。
      void refreshCart()
      navigate('/pay/' + order.orderNo, { replace: true })
    } catch (caught) {
      setError(toShopError(caught).message)
    } finally {
      setSubmitting(false)
    }
  }

  if (!ready) {
    return <div className="shop shop--checkout"><div className="cart-loading" aria-busy="true"><span /><span /><span /></div></div>
  }

  if (lines.length === 0) {
    return (
      <div className="shop shop--checkout">
        <div className="shop-empty">
          <span className="seal zhu" aria-hidden="true">空</span>
          <p>购物车是空的，结算无从谈起。</p>
          <Link className="btn btn--solid" to="/products">去产品中心</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="shop shop--checkout">
      <header className="shop-head">
        <h1 className="shop-title">结算</h1>
      </header>

      <form className="checkout" onSubmit={(event) => void submit(event)} noValidate>
        <div className="checkout__main">
          <section className="step">
            <header className="step__head">
              <span className="step__no">{cnNumber(1)}</span>
              <div>
                <h2>收货地址</h2>
                <p>从地址簿选择，或填写新地址。</p>
              </div>
            </header>

            {bookLoading ? (
              <p className="addr-loading">正在读地址簿…</p>
            ) : addresses.length > 0 ? (
              <div className="addr-book" role="radiogroup" aria-label="地址簿">
                {addresses.map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    role="radio"
                    aria-checked={selected === item.id}
                    className={'addr-card' + (selected === item.id ? ' is-on' : '')}
                    onClick={() => pickAddress(item)}
                  >
                    <span className="addr-card__top">
                      <b>{item.name}</b>
                      <span>{maskPhone(item.phone)}</span>
                      {item.tag ? <em>{item.tag}</em> : null}
                      {item.isDefault ? <i>默认</i> : null}
                    </span>
                    <span className="addr-card__line">
                      {item.province} {item.city} {item.district} {item.detail}
                    </span>
                    <span className="addr-card__post">{item.postcode || '未填邮编'}</span>
                  </button>
                ))}
                <button
                  type="button"
                  role="radio"
                  aria-checked={selected === null}
                  className={'addr-card addr-card--new' + (selected === null ? ' is-on' : '')}
                  onClick={useNewAddress}
                >
                  <span className="addr-card__plus" aria-hidden="true">+</span>
                  <b>使用新地址</b>
                </button>
              </div>
            ) : null}

            <div className="addr-form">
              <AddressFields value={address} onChange={patchAddress} errors={errors} />
            </div>

            <label className="check">
              <input type="checkbox" checked={saveBook} onChange={(event) => setSaveBook(event.target.checked)} />
              <span>存入地址簿</span>
            </label>
          </section>

          <section className="step">
            <header className="step__head">
              <span className="step__no">{cnNumber(2)}</span>
              <div>
                <h2>配送方式</h2>
                <p>标准快递包邮，顺丰加 ¥12.00。</p>
              </div>
            </header>
            <div className="opt-list" role="radiogroup" aria-label="配送方式">
              {shopData.shipping.map((method) => (
                <label className={'opt' + (shippingKey === method.key ? ' is-on' : '')} key={method.key}>
                  <input
                    type="radio"
                    name="shipping"
                    value={method.key}
                    checked={shippingKey === method.key}
                    onChange={() => setShippingKey(method.key)}
                  />
                  <span className="opt__body">
                    <b>{method.name}</b>
                    <span>{method.desc}</span>
                  </span>
                  <em>{method.feeCents === 0 ? '包邮' : '¥' + money(method.feeCents).slice(1)}</em>
                </label>
              ))}
            </div>
          </section>

          <section className="step">
            <header className="step__head">
              <span className="step__no">{cnNumber(3)}</span>
              <div>
                <h2>付款方式</h2>
              </div>
            </header>
            <div className="opt-list opt-list--pay" role="radiogroup" aria-label="付款方式">
              {shopData.paymentMethods.map((method) => (
                <label className={'opt' + (paymentMethod === method.key ? ' is-on' : '')} key={method.key}>
                  <input
                    type="radio"
                    name="payment"
                    value={method.key}
                    checked={paymentMethod === method.key}
                    onChange={() => setPaymentMethod(method.key)}
                  />
                  <span className="opt__body">
                    <b>{method.name}</b>
                    <span>{method.desc}</span>
                  </span>
                </label>
              ))}
            </div>
          </section>

          <section className="step">
            <header className="step__head">
              <span className="step__no">{cnNumber(4)}</span>
              <div>
                <h2>买家留言 <em>选填</em></h2>
                <p>最多 120 字。</p>
              </div>
            </header>
            <textarea
              className="textarea"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              rows={3}
              maxLength={120}
              placeholder="例如：请用礼盒包装"
            />
          </section>
        </div>

        <aside className="checkout__aside">
          <div className="checkout__sum">
            <p className="checkout__sum-k">这一单</p>
            <ul className="order-lines">
              {lines.map((line) => (
                <li key={line.skuId}>
                  {line.thumb ? (
                    <img src={line.thumb} alt="" loading="lazy" />
                  ) : (
                    <span aria-hidden="true" style={{ display: 'block', width: '100%', aspectRatio: '1', background: 'var(--paper-3)' }} />
                  )}
                  <span>
                    <b>{line.title}</b>
                    <em>{line.variant} × {line.qty}</em>
                  </span>
                  <i>¥{money(line.priceCents * line.qty).slice(1)}</i>
                </li>
              ))}
            </ul>
            <dl className="sum-rows">
              <div><dt>商品合计</dt><dd>¥{money(subtotal).slice(1)}</dd></div>
              <div><dt>运费 · {shipping?.name}</dt><dd>¥{money(shipping?.feeCents ?? 0).slice(1)}</dd></div>
              <div className="sum-rows__total"><dt>应付</dt><dd>¥{money(total).slice(1)}</dd></div>
            </dl>
            {error ? <p className="checkout__error" role="alert">{error}</p> : null}
            <button type="submit" className="btn btn--solid btn--wide" disabled={submitting}>
              {submitting ? '正在生成订单…' : '提交订单，去付款'}
            </button>
          </div>
        </aside>
      </form>
    </div>
  )
}
