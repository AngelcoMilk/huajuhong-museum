import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import AddressFields from '../components/shop/AddressFields'
import { shopApi } from '../lib/shop/api'
import { toShopError } from '../lib/shop/errors'
import { dateShort, dateTime, maskPhone, money, statusLabel } from '../lib/shop/format'
import { resetGuideChat } from '../components/guide/guideStore'
import { clearSession, useSession } from '../lib/shop/session'
import type { Address, AddressInput, Order } from '../lib/shop/types'
import '../styles/shop.css'

function emptyAddress(): AddressInput {
  return {
    name: '',
    phone: '',
    province: '',
    city: '',
    district: '',
    detail: '',
    postcode: '',
    tag: '家',
    isDefault: false,
  }
}

function validate(value: AddressInput): Record<string, string> {
  const errors: Record<string, string> = {}
  if (value.name.trim().length < 1) errors.name = '请填写收货人姓名。'
  if (!/^1[3-9]\d{9}$/.test(value.phone)) errors.phone = '请填写 11 位手机号。'
  if (!value.province || !value.city || !value.district) errors.region = '请选择省、市、区县。'
  if (value.detail.trim().length < 4) errors.detail = '详细地址至少 4 个字。'
  if (value.postcode && !/^\d{6}$/.test(value.postcode)) errors.postcode = '邮编应为 6 位数字，或留空。'
  return errors
}

export default function Account() {
  const session = useSession()
  const user = session?.user
  const navigate = useNavigate()

  const [addresses, setAddresses] = useState<Address[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState<Address | 'new' | null>(null)
  const [draft, setDraft] = useState<AddressInput>(emptyAddress)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [busy, setBusy] = useState(false)

  const load = async (userId: string) => {
    setLoading(true)
    try {
      const [addr, list] = await Promise.all([shopApi.listAddresses(userId), shopApi.listOrders(userId)])
      setAddresses(addr)
      setOrders(list)
    } catch (caught) {
      setError(toShopError(caught).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!user) return
    let alive = true
    setLoading(true)
    Promise.all([shopApi.listAddresses(user.id), shopApi.listOrders(user.id)])
      .then(([addr, list]) => {
        if (!alive) return
        setAddresses(addr)
        setOrders(list)
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

  const startNew = () => {
    setEditing('new')
    setDraft({ ...emptyAddress(), name: user?.name ?? '', phone: user?.phone ?? '' })
    setErrors({})
    setError('')
  }

  const startEdit = (item: Address) => {
    setEditing(item)
    setDraft({
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
    setError('')
  }

  const save = async () => {
    if (!user) return
    const nextErrors = validate(draft)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return
    setBusy(true)
    try {
      await shopApi.saveAddress(user.id, {
        ...draft,
        id: editing && editing !== 'new' ? editing.id : undefined,
      })
      setEditing(null)
      await load(user.id)
    } catch (caught) {
      setError(toShopError(caught).message)
    } finally {
      setBusy(false)
    }
  }

  const makeDefault = async (item: Address) => {
    if (!user) return
    setBusy(true)
    try {
      await shopApi.saveAddress(user.id, { ...item, isDefault: true, id: item.id })
      await load(user.id)
    } catch (caught) {
      setError(toShopError(caught).message)
    } finally {
      setBusy(false)
    }
  }

  const remove = async (item: Address) => {
    if (!user) return
    if (!window.confirm('从地址簿移除「' + item.name + ' · ' + item.district + '」？')) return
    setBusy(true)
    try {
      await shopApi.deleteAddress(user.id, item.id)
      await load(user.id)
    } catch (caught) {
      setError(toShopError(caught).message)
    } finally {
      setBusy(false)
    }
  }

  const logout = async () => {
    if (!session) return
    await shopApi.logout(session.token)
    clearSession()
    resetGuideChat()
    navigate('/products')
  }

  if (!user) return null

  return (
    <div className="shop shop--account">
      <header className="shop-head">
        <h1 className="shop-title">账户</h1>
      </header>

      <section className="acct-hero">
        <div className="acct-hero__main">
          <h2>{user.name}</h2>
          <p>{maskPhone(user.phone)} · 注册于 {dateShort(user.createdAt)}</p>
        </div>
        <div className="acct-hero__stats">
          <p><b>{orders.length}</b><span>订单</span></p>
          <p><b>{addresses.length}</b><span>地址</span></p>
        </div>
        <div className="acct-hero__acts">
          <Link className="btn btn--sm" to="/orders">我的订单</Link>
          <button type="button" className="btn btn--sm" onClick={() => void logout()}>退出登录</button>
        </div>
      </section>

      {error ? <p className="shop-alert" role="alert">{error}</p> : null}

      <div className="acct-grid">
        <section className="acct-block acct-block--addr">
          <header className="acct-block__head">
            <div>
              <p className="kicker">地址簿</p>
              <h2>收件地址</h2>
            </div>
            <button type="button" className="btn btn--sm" onClick={startNew}>新增地址</button>
          </header>

          {loading ? (
            <p className="addr-loading">正在读地址簿…</p>
          ) : addresses.length === 0 && !editing ? (
            <div className="acct-empty">
              <p>还没有保存的地址。结算时勾选「存入地址簿」，或现在新增一个。</p>
              <button type="button" className="btn btn--solid btn--sm" onClick={startNew}>新增第一个地址</button>
            </div>
          ) : (
            <ul className="acct-addresses">
              {addresses.map((item) => (
                <li key={item.id}>
                  <div className="acct-address__top">
                    <b>{item.name}</b>
                    <span>{maskPhone(item.phone)}</span>
                    {item.isDefault ? <em>默认</em> : null}
                    {item.tag ? <i>{item.tag}</i> : null}
                  </div>
                  <p className="acct-address__line">
                    {item.province} {item.city} {item.district} {item.detail}
                  </p>
                  <p className="acct-address__meta">邮编 {item.postcode || '未填'}</p>
                  <div className="acct-address__acts">
                    <button type="button" onClick={() => startEdit(item)} disabled={busy}>编辑</button>
                    {!item.isDefault ? (
                      <button type="button" onClick={() => void makeDefault(item)} disabled={busy}>设为默认</button>
                    ) : null}
                    <button type="button" className="is-danger" onClick={() => void remove(item)} disabled={busy}>移除</button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {editing ? (
            <div className="acct-editor">
              <header className="acct-editor__head">
                <h3>{editing === 'new' ? '新增地址' : '编辑地址'}</h3>
                <button type="button" className="auth__textbtn" onClick={() => setEditing(null)}>收起</button>
              </header>
              <AddressFields value={draft} onChange={(patch) => setDraft((current) => ({ ...current, ...patch }))} errors={errors} idPrefix="acct" />
              <label className="check">
                <input
                  type="checkbox"
                  checked={Boolean(draft.isDefault)}
                  onChange={(event) => setDraft((current) => ({ ...current, isDefault: event.target.checked }))}
                />
                <span>设为默认地址</span>
              </label>
              <div className="acct-editor__acts">
                <button type="button" className="btn" onClick={() => setEditing(null)}>取消</button>
                <button type="button" className="btn btn--solid" onClick={() => void save()} disabled={busy}>
                  {busy ? '保存中…' : '保存地址'}
                </button>
              </div>
            </div>
          ) : null}
        </section>

        <section className="acct-block acct-block--orders">
          <header className="acct-block__head">
            <div>
              <p className="kicker">最近订单</p>
              <h2>下过的单</h2>
            </div>
            <Link className="btn btn--sm" to="/orders">全部</Link>
          </header>

          {orders.length === 0 ? (
            <div className="acct-empty">
              <p>还没有订单。</p>
              <Link className="btn btn--sm" to="/products">去挑产品</Link>
            </div>
          ) : (
            <ul className="acct-orders">
              {orders.slice(0, 3).map((order) => (
                <li key={order.orderNo}>
                  <Link to={'/order/' + order.orderNo}>
                    <span className="acct-order__top">
                      <b>{order.orderNo}</b>
                      <em className={'is-' + order.status}>{statusLabel(order.status)}</em>
                    </span>
                    <span className="acct-order__meta">
                      {dateTime(order.createdAt)} · {order.items.reduce((sum, item) => sum + item.qty, 0)} 件
                    </span>
                    <span className="acct-order__amount">¥{money(order.totalCents).slice(1)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

    </div>
  )
}
