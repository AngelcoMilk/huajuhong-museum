import { addCartItem, currentCartLines, refreshCart, removeCartItem, setCartQty } from '../../lib/shop/cart'
import { shopApi } from '../../lib/shop/api'
import { toShopError } from '../../lib/shop/errors'
import { money } from '../../lib/shop/format'
import { getSession } from '../../lib/shop/session'
import type { Order } from '../../lib/shop/types'
import type { GuideAction, GuidePageContext } from '../../lib/guideClient'
import type { GuideActionResult } from './useGuideChat'

// 讲解员的动作在访客自己的浏览器里执行，用访客自己的登录状态和购物车。
// 服务端校验过一遍；这里按同一份白名单再校验 route，不信任流里的任何地址。
// 提交订单和付款不在这里：那两步只能由访客在页面上点。

const ID = '[A-Za-z0-9_-]+'
const ROUTE = new RegExp(
  '^(?:' +
    [
      '/',
      '/park',
      `/park#yq-${ID}`,
      '/museum',
      `/museum\\?article=${ID}`,
      `/museum\\?scene=${ID}`,
      '/craft',
      '/craft#machines',
      '/craft#machine-(?:qizhua|qunang|yaguo|hongfang|qiepian)',
      '/enterprises',
      `/enterprises\\?id=${ID}`,
      '/vr',
      `/vr\\?scene=${ID}`,
      '/history',
      `/history/${ID}`,
      '/products',
      `/products/${ID}`,
      '/cart',
      '/orders',
      '/account',
    ].join('|') +
    ')$',
)

export function isGuideRoute(route: unknown): route is string {
  return typeof route === 'string' && ROUTE.test(route)
}

type Navigate = (to: string) => void
type Payload = Record<string, unknown>

const PENDING_ORDERS = '/orders?tab=pending_payment'

function textOf(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

function qtyOfPayload(value: unknown): number | null {
  return typeof value === 'number' && Number.isInteger(value) && value >= 1 && value <= 10 ? value : null
}

function nameOf(title: string, variant: string): string {
  const name = title || '这件商品'
  return variant ? `${name}（${variant}）` : name
}

function failed(lead: string, error: unknown): GuideActionResult {
  return { ok: false, text: `${lead}：${toShopError(error).message}` }
}

function qtyInCart(skuId: string): number {
  return currentCartLines().find((line) => line.skuId === skuId)?.qty ?? 0
}

/** 撤销：把这件商品恢复成动作之前的数量。按当时的购物车算，连撤两次也不会出错 */
async function restoreQty(skuId: string, qty: number, name: string): Promise<string> {
  await refreshCart()
  const current = qtyInCart(skuId)
  try {
    if (qty === 0 && current > 0) await removeCartItem(skuId)
    else if (qty > 0 && current === 0) await addCartItem(skuId, qty)
    else if (qty !== current) await setCartQty(skuId, qty)
  } catch (error) {
    throw new Error(`撤销没有成功：${toShopError(error).message}`)
  }
  const now = qtyInCart(skuId)
  return now === 0 ? `已撤销：${name} 不在购物车里了。` : `已撤销：${name} 恢复为 ${now} 件。`
}

async function cartAdd(payload: Payload): Promise<GuideActionResult> {
  const skuId = textOf(payload.skuId)
  const qty = qtyOfPayload(payload.qty ?? 1)
  if (!skuId || qty === null) return { ok: false, text: '没能加入购物车：商品或数量不对。' }
  await refreshCart()
  const before = qtyInCart(skuId)
  try {
    const cart = await addCartItem(skuId, qty)
    const line = cart.lines.find((item) => item.skuId === skuId)
    const name = nameOf(line?.title ?? textOf(payload.title), line?.variant ?? textOf(payload.variant))
    // 服务端会按库存封顶，卡片写真实加上的数量
    const added = (line?.qty ?? 0) - before
    if (!line || added <= 0) return { ok: false, text: `没能加入购物车：${name} 库存不足。` }
    const short = added < qty ? `（库存不足，只加了 ${added} 件）` : ''
    return {
      ok: true,
      text: `已加入购物车：${name} × ${added}，${money(line.priceCents * added)}${short}`,
      undo: () => restoreQty(skuId, before, name),
    }
  } catch (error) {
    return failed('没能加入购物车', error)
  }
}

async function cartSet(payload: Payload): Promise<GuideActionResult> {
  const skuId = textOf(payload.skuId)
  const qty = qtyOfPayload(payload.qty)
  if (!skuId || qty === null) return { ok: false, text: '没能改数量：商品或数量不对。' }
  await refreshCart()
  const before = qtyInCart(skuId)
  try {
    const cart = before > 0 ? await setCartQty(skuId, qty) : await addCartItem(skuId, qty)
    const line = cart.lines.find((item) => item.skuId === skuId)
    const name = nameOf(line?.title ?? textOf(payload.title), line?.variant ?? textOf(payload.variant))
    const now = line?.qty ?? 0
    if (now <= 0) return { ok: false, text: `没能改数量：${name} 库存不足。` }
    const short = now < qty ? `（库存只有 ${now} 件）` : ''
    return {
      ok: true,
      text: `已改数量：${name} × ${now}${short}`,
      undo: () => restoreQty(skuId, before, name),
    }
  } catch (error) {
    return failed('没能改数量', error)
  }
}

async function cartRemove(payload: Payload): Promise<GuideActionResult> {
  const skuId = textOf(payload.skuId)
  if (!skuId) return { ok: false, text: '没能移除：商品不对。' }
  await refreshCart()
  const line = currentCartLines().find((item) => item.skuId === skuId)
  const name = nameOf(line?.title ?? textOf(payload.title), line?.variant ?? textOf(payload.variant))
  if (!line) return { ok: false, text: `购物车里没有 ${name}。` }
  const before = line.qty
  try {
    await removeCartItem(skuId)
    return {
      ok: true,
      text: `已移除：${name}`,
      undo: () => restoreQty(skuId, before, name),
    }
  } catch (error) {
    return failed('没能移除', error)
  }
}

async function gotoCheckout(navigate: Navigate): Promise<GuideActionResult> {
  await refreshCart()
  if (currentCartLines().length === 0) return { ok: false, text: '购物车是空的，还不能结算。' }
  // 没登录时 RequireAuth 会先去登录，登录后回到结算页
  navigate('/checkout')
  return { ok: true, text: '已打开结算页。订单要在页面上提交。' }
}

function payableOrders(orders: Order[]): Order[] {
  const now = Date.now()
  return orders.filter((order) => order.status === 'pending_payment' && order.expiresAt > now)
}

async function gotoPay(navigate: Navigate): Promise<GuideActionResult> {
  const session = getSession()
  if (!session) {
    navigate(PENDING_ORDERS)
    return { ok: true, text: '请先登录，登录后到待付款订单。' }
  }
  let orders
  try {
    orders = await shopApi.listOrders(session.user.id)
  } catch (error) {
    return failed('没能查到订单', error)
  }
  const pending = payableOrders(orders)
  if (pending.length === 1) {
    navigate('/pay/' + encodeURIComponent(pending[0].orderNo))
    return { ok: true, text: `已打开付款页：订单 ${pending[0].orderNo}。付款要在页面上完成。` }
  }
  if (pending.length > 1) {
    navigate(PENDING_ORDERS)
    return { ok: true, text: `有 ${pending.length} 笔待付款订单，已打开订单列表。` }
  }
  await refreshCart()
  if (currentCartLines().length > 0) {
    navigate('/checkout')
    return { ok: true, text: '还没有下单，已打开结算页。提交订单后就能付款。' }
  }
  return { ok: false, text: '还没有下单，购物车也是空的。' }
}

export async function runGuideAction(action: GuideAction, navigate: Navigate): Promise<GuideActionResult> {
  const payload: Payload = action.payload && typeof action.payload === 'object' ? (action.payload as Payload) : {}
  switch (action.type) {
    case 'goto_page': {
      if (!isGuideRoute(payload.route)) return { ok: false, text: '这个地址打不开。' }
      navigate(payload.route)
      return { ok: true, text: `已打开：${textOf(payload.label) || payload.route}` }
    }
    case 'cart_add':
      return cartAdd(payload)
    case 'cart_set':
      return cartSet(payload)
    case 'cart_remove':
      return cartRemove(payload)
    case 'goto_checkout':
      return gotoCheckout(navigate)
    case 'goto_pay':
      return gotoPay(navigate)
    default:
      return { ok: false, text: '这一步现在做不了。' }
  }
}

async function countPendingOrders(): Promise<number | undefined> {
  const session = getSession()
  if (!session) return undefined
  try {
    return payableOrders(await shopApi.listOrders(session.user.id)).length
  } catch {
    return undefined
  }
}

/** 发消息时才取：当前页面、最新购物车、是否登录、待付款订单数。接口慢也不能卡住提问 */
export async function readGuidePage(route: string): Promise<GuidePageContext> {
  const deadline = new Promise<undefined>((resolve) => setTimeout(resolve, 1500))
  const [pendingOrders] = await Promise.all([
    Promise.race([countPendingOrders(), deadline]),
    Promise.race([refreshCart(), deadline]),
  ])
  return {
    route,
    cart: currentCartLines().map(({ skuId, title, variant, qty }) => ({ skuId, title, variant, qty })),
    signedIn: getSession() !== null,
    pendingOrders,
  }
}
