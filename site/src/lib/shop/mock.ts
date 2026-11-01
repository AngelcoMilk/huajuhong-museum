import { findSku, products } from './data'
import { ShopError } from './errors'
import type {
  Address,
  AddressInput,
  AuthResult,
  Cart,
  CartLine,
  CreateOrderInput,
  LoginInput,
  Order,
  OrderItem,
  PayCode,
  Product,
  ProductQuery,
  ProductListResult,
  RegisterInput,
  User,
} from './types'
import { shopData } from './data'

// 纯前端演示后端：账号、购物车、地址、订单全部落在 localStorage。
// 接口形状与后端 HTTP 接口一致，换成 HTTP 时页面不用动。

const NS = 'hjh-shop'
const USERS_KEY = NS + ':users'
const SESSIONS_KEY = NS + ':sessions'
const CART_KEY = NS + ':cart'
const ORDERS_KEY = NS + ':orders'
const ADDR_PREFIX = NS + ':addresses:'

const DEMO = { phone: '13800138000', password: 'hjh12345', name: '阿橘' }

const LATENCY = import.meta.env.MODE === 'test' ? 0 : 180

function wait(ms = LATENCY): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

type StoredUser = User & { salt: string; passwordHash: string }
type StoredSession = { token: string; userId: string; createdAt: number }
type StoredLine = { skuId: string; qty: number }
type StoredAddress = Address & { createdAt: number }

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function writeJson(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    throw new ShopError('NETWORK', '浏览器没有可用的本地存储，无法保存。')
  }
}

function randomId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

async function hashPassword(password: string, salt: string): Promise<string> {
  const input = new TextEncoder().encode(salt + ':' + password)
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const digest = await crypto.subtle.digest('SHA-256', input)
    return Array.from(new Uint8Array(digest))
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join('')
  }
  // 仅用于 jsdom / 非安全上下文的演示兜底；真实后端用 bcrypt/argon2。
  let hash = 2166136261
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input[i]
    hash = Math.imul(hash, 16777619)
  }
  return 'fnv-' + (hash >>> 0).toString(16)
}

const PHONE = /^1[3-9]\d{9}$/

function normalizeName(value: string): string {
  return value.trim().replace(/\s+/g, ' ')
}

function assertName(value: string): string {
  const name = normalizeName(value)
  if (name.length < 2 || name.length > 16) {
    throw new ShopError('INVALID_NAME', '请填写 2–16 个字的称呼。', 'name')
  }
  return name
}

function assertPhone(value: string): string {
  const phone = value.trim()
  if (!PHONE.test(phone)) {
    throw new ShopError('INVALID_PHONE', '请填写 11 位手机号。', 'phone')
  }
  return phone
}

function assertPassword(value: string): string {
  if (value.length < 8 || !/[A-Za-z]/.test(value) || !/\d/.test(value)) {
    throw new ShopError('WEAK_PASSWORD', '密码至少 8 位，且同时包含字母和数字。', 'password')
  }
  return value
}

function publicUser(user: StoredUser): User {
  return { id: user.id, name: user.name, phone: user.phone, createdAt: user.createdAt }
}

function readUsers(): StoredUser[] {
  return readJson<StoredUser[]>(USERS_KEY, [])
}

function writeUsers(users: StoredUser[]) {
  writeJson(USERS_KEY, users)
}

function readSessions(): StoredSession[] {
  return readJson<StoredSession[]>(SESSIONS_KEY, [])
}

function writeSessions(sessions: StoredSession[]) {
  writeJson(SESSIONS_KEY, sessions)
}

async function ensureDemoUser() {
  const users = readUsers()
  if (users.some((user) => user.phone === DEMO.phone)) return
  const salt = randomId()
  users.push({
    id: 'u-' + randomId(),
    name: DEMO.name,
    phone: DEMO.phone,
    createdAt: Date.now(),
    salt,
    passwordHash: await hashPassword(DEMO.password, salt),
  })
  writeUsers(users)
}

function createSession(userId: string): string {
  const token = 'tk-' + randomId()
  const sessions = readSessions().filter((item) => Date.now() - item.createdAt < 7 * 24 * 3600 * 1000)
  sessions.push({ token, userId, createdAt: Date.now() })
  writeSessions(sessions)
  return token
}

function requireUser(token: string | null): StoredUser {
  if (!token) throw new ShopError('UNAUTHORIZED', '请先登录。')
  const session = readSessions().find((item) => item.token === token)
  if (!session) throw new ShopError('UNAUTHORIZED', '登录状态已失效，请重新登录。')
  const user = readUsers().find((item) => item.id === session.userId)
  if (!user) throw new ShopError('UNAUTHORIZED', '登录状态已失效，请重新登录。')
  return user
}

function readCartEntries(): StoredLine[] {
  return readJson<StoredLine[]>(CART_KEY, []).filter(
    (line) => typeof line.skuId === 'string' && Number.isFinite(line.qty) && line.qty > 0,
  )
}

function notifyCart() {
  if (typeof window !== 'undefined') window.dispatchEvent(new Event('hjh-shop-cart'))
}

function writeCartEntries(lines: StoredLine[]) {
  writeJson(CART_KEY, lines)
  notifyCart()
}

function buildCart(): Cart {
  const lines: CartLine[] = []
  for (const entry of readCartEntries()) {
    const found = findSku(entry.skuId)
    if (!found) continue
    const { product, sku } = found
    lines.push({
      skuId: sku.sku,
      productId: product.id,
      title: product.title,
      variant: sku.name,
      thumb: product.thumb,
      priceCents: sku.priceCents,
      qty: Math.min(entry.qty, sku.stock, 99),
      stock: sku.stock,
      purchasable: product.purchasable,
    })
  }
  return { lines, updatedAt: Date.now() }
}

function sortProducts(items: Product[], sort: ProductQuery['sort']): Product[] {
  if (sort === 'price-asc' || sort === 'price-desc') {
    const price = (item: Product) => Math.min(...item.skus.map((sku) => sku.priceCents))
    return [...items].sort((a, b) => (sort === 'price-asc' ? price(a) - price(b) : price(b) - price(a)))
  }
  return items
}

function validateAddress(input: AddressInput): AddressInput {
  const name = normalizeName(input.name)
  const detail = input.detail.trim()
  const postcode = input.postcode.trim()
  if (name.length < 1 || name.length > 20) {
    throw new ShopError('ADDRESS_INVALID', '请填写收货人姓名。', 'name')
  }
  assertPhone(input.phone)
  if (!input.province || !input.city || !input.district) {
    throw new ShopError('ADDRESS_INVALID', '请选择省 / 市 / 区县。', 'region')
  }
  if (detail.length < 4 || detail.length > 80) {
    throw new ShopError('ADDRESS_INVALID', '详细地址请填写 4–80 个字。', 'detail')
  }
  if (postcode && !/^\d{6}$/.test(postcode)) {
    throw new ShopError('POSTCODE_INVALID', '邮编应为 6 位数字，或留空。', 'postcode')
  }
  return {
    name,
    phone: input.phone.trim(),
    province: input.province,
    city: input.city,
    district: input.district,
    detail,
    postcode,
    tag: input.tag || '家',
    isDefault: input.isDefault ?? false,
  }
}

function addressKey(userId: string): string {
  return ADDR_PREFIX + userId
}

function readAddresses(userId: string): StoredAddress[] {
  return readJson<StoredAddress[]>(addressKey(userId), [])
}

function writeAddresses(userId: string, addresses: StoredAddress[]) {
  writeJson(addressKey(userId), addresses)
}

function makeOrderNo(existing: Order[]): string {
  const now = new Date()
  const stamp =
    String(now.getFullYear()) +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0')
  for (let attempt = 0; attempt < 30; attempt += 1) {
    const suffix = String(Math.floor(Math.random() * 9000) + 1000)
    const no = 'HJH' + stamp + suffix
    if (!existing.some((order) => order.orderNo === no)) return no
  }
  return 'HJH' + stamp + String(Date.now()).slice(-4)
}

function readOrders(): Order[] {
  return readJson<Order[]>(ORDERS_KEY, [])
}

function writeOrders(orders: Order[]) {
  writeJson(ORDERS_KEY, orders)
}

/** 读订单时顺手把已过支付时限的单置为取消，列表与详情看到的状态才一致。 */
function expireOrderIfNeeded(order: Order): boolean {
  if (order.status !== 'pending_payment' || Date.now() <= order.expiresAt) return false
  order.status = 'cancelled'
  return true
}

export const mockApi = {
  async listProducts(query: ProductQuery = {}): Promise<ProductListResult> {
    await wait(80)
    const keyword = (query.keyword ?? '').trim().toLowerCase()
    let items = products
    if (query.category && query.category !== 'all') {
      items = items.filter((item) => item.catKey === query.category || item.cat === query.category)
    }
    if (keyword) {
      items = items.filter((item) => {
        const haystack = [item.title, item.cat, item.summary, ...item.tags].join(' ')
        return haystack.toLowerCase().includes(keyword)
      })
    }
    items = sortProducts(items, query.sort)
    return { items, total: items.length }
  },

  async getProduct(id: string): Promise<Product> {
    await wait(60)
    const product = products.find((item) => item.id === id)
    if (!product) throw new ShopError('SKU_NOT_FOUND', '没有找到这件产品。')
    return product
  },

  async register(input: RegisterInput): Promise<AuthResult> {
    await wait()
    await ensureDemoUser()
    const name = assertName(input.name)
    const phone = assertPhone(input.phone)
    const password = assertPassword(input.password)
    const users = readUsers()
    if (users.some((user) => user.phone === phone)) {
      throw new ShopError('PHONE_TAKEN', '这个手机号已经注册过，直接登录即可。', 'phone')
    }
    const salt = randomId()
    const user: StoredUser = {
      id: 'u-' + randomId(),
      name,
      phone,
      createdAt: Date.now(),
      salt,
      passwordHash: await hashPassword(password, salt),
    }
    users.push(user)
    writeUsers(users)
    return { token: createSession(user.id), user: publicUser(user) }
  },

  async login(input: LoginInput): Promise<AuthResult> {
    await wait()
    await ensureDemoUser()
    const phone = input.phone.trim()
    const user = readUsers().find((item) => item.phone === phone)
    if (!user) throw new ShopError('BAD_CREDENTIALS', '手机号或密码不对，请再试一次。')
    if (input.password.length === 0) {
      throw new ShopError('BAD_CREDENTIALS', '手机号或密码不对，请再试一次。')
    }
    const hash = await hashPassword(input.password, user.salt)
    if (hash !== user.passwordHash) {
      throw new ShopError('BAD_CREDENTIALS', '手机号或密码不对，请再试一次。')
    }
    return { token: createSession(user.id), user: publicUser(user) }
  },

  async me(token: string | null): Promise<User | null> {
    await wait(40)
    if (!token) return null
    try {
      return publicUser(requireUser(token))
    } catch {
      return null
    }
  },

  async logout(token: string | null): Promise<void> {
    await wait(40)
    if (!token) return
    writeSessions(readSessions().filter((item) => item.token !== token))
  },

  async getCart(): Promise<Cart> {
    await wait(60)
    return buildCart()
  },

  async addToCart(skuId: string, qty = 1): Promise<Cart> {
    await wait(90)
    const found = findSku(skuId)
    if (!found) throw new ShopError('SKU_NOT_FOUND', '这件商品已下架。')
    if (!found.product.purchasable) {
      throw new ShopError('NOT_PURCHASABLE', '药品类商品不在线销售。')
    }
    const safeQty = Math.max(1, Math.min(Math.floor(qty) || 1, 99))
    const entries = readCartEntries()
    const existing = entries.find((line) => line.skuId === skuId)
    if (existing) {
      existing.qty = Math.min(existing.qty + safeQty, found.sku.stock, 99)
    } else {
      entries.push({ skuId, qty: Math.min(safeQty, found.sku.stock, 99) })
    }
    writeCartEntries(entries)
    return buildCart()
  },

  async setCartQty(skuId: string, qty: number): Promise<Cart> {
    await wait(60)
    const found = findSku(skuId)
    if (!found) throw new ShopError('SKU_NOT_FOUND', '这件商品已下架。')
    const entries = readCartEntries()
      .map((line) =>
        line.skuId === skuId
          ? { ...line, qty: Math.max(1, Math.min(Math.floor(qty) || 1, found.sku.stock, 99)) }
          : line,
      )
      .filter((line) => line.qty > 0)
    writeCartEntries(entries)
    return buildCart()
  },

  async removeCartItem(skuId: string): Promise<Cart> {
    await wait(60)
    writeCartEntries(readCartEntries().filter((line) => line.skuId !== skuId))
    return buildCart()
  },

  async clearCart(): Promise<Cart> {
    await wait(40)
    writeCartEntries([])
    return buildCart()
  },

  async listAddresses(userId: string): Promise<Address[]> {
    await wait(70)
    return readAddresses(userId)
      .slice()
      .sort((a, b) => Number(b.isDefault) - Number(a.isDefault) || b.createdAt - a.createdAt)
  },

  async saveAddress(userId: string, input: AddressInput & { id?: string }): Promise<Address> {
    await wait(90)
    const clean = validateAddress(input)
    const addresses = readAddresses(userId)
    const index = input.id ? addresses.findIndex((item) => item.id === input.id) : -1
    const isFirst = addresses.length === 0
    const shouldDefault =
      index >= 0 ? Boolean(input.isDefault) || addresses[index].isDefault : Boolean(input.isDefault) || isFirst
    if (shouldDefault) {
      for (const address of addresses) address.isDefault = false
    }
    if (index >= 0) {
      const updated: StoredAddress = {
        ...addresses[index],
        ...clean,
        isDefault: shouldDefault ? true : addresses[index].isDefault,
      }
      addresses[index] = updated
    } else {
      addresses.push({
        ...clean,
        id: 'ad-' + randomId(),
        isDefault: shouldDefault,
        createdAt: Date.now(),
      })
    }
    if (addresses.length > 0 && !addresses.some((address) => address.isDefault)) {
      addresses[0].isDefault = true
    }
    writeAddresses(userId, addresses)
    const saved = input.id ? addresses.find((item) => item.id === input.id) : addresses[addresses.length - 1]
    if (!saved) throw new ShopError('ADDRESS_INVALID', '地址没有保存成功。')
    return saved
  },

  async deleteAddress(userId: string, id: string): Promise<void> {
    await wait(70)
    const addresses = readAddresses(userId).filter((item) => item.id !== id)
    if (addresses.length > 0 && !addresses.some((item) => item.isDefault)) {
      addresses[0].isDefault = true
    }
    writeAddresses(userId, addresses)
  },

  async createOrder(userId: string, input: CreateOrderInput): Promise<Order> {
    await wait(260)
    const cart = buildCart()
    if (cart.lines.length === 0) throw new ShopError('CART_EMPTY', '购物车是空的。')
    for (const line of cart.lines) {
      if (!line.purchasable) throw new ShopError('NOT_PURCHASABLE', '药品类商品不在线销售。')
      if (line.qty > line.stock) throw new ShopError('OUT_OF_STOCK', '库存不足，请减少数量。')
    }
    const address = validateAddress(input.address)
    const shipping = shopData.shipping.find((item) => item.key === input.shippingKey) ?? shopData.shipping[0]
    const payment = shopData.paymentMethods.find((item) => item.key === input.paymentMethod)
    if (!payment) throw new ShopError('PAYMENT_FAILED', '请选择一种支付方式。')
    const items: OrderItem[] = cart.lines.map((line) => ({
      skuId: line.skuId,
      productId: line.productId,
      title: line.title,
      variant: line.variant,
      thumb: line.thumb,
      priceCents: line.priceCents,
      qty: line.qty,
    }))
    const subtotalCents = items.reduce((sum, item) => sum + item.priceCents * item.qty, 0)
    const orders = readOrders()
    const now = Date.now()
    const order: Order = {
      orderNo: makeOrderNo(orders),
      userId,
      status: 'pending_payment',
      items,
      address: {
        ...address,
        id: 'ad-' + randomId(),
        isDefault: false,
      },
      note: (input.note ?? '').trim().slice(0, 120),
      shipping,
      paymentMethod: payment.key,
      subtotalCents,
      shippingFeeCents: shipping.feeCents,
      totalCents: subtotalCents + shipping.feeCents,
      createdAt: now,
      paidAt: null,
      expiresAt: now + 30 * 60 * 1000,
    }
    orders.push(order)
    writeOrders(orders)
    writeCartEntries([])
    return order
  },

  async listOrders(userId: string): Promise<Order[]> {
    await wait(120)
    const all = readOrders()
    let changed = false
    for (const order of all) {
      if (order.userId === userId && expireOrderIfNeeded(order)) changed = true
    }
    if (changed) writeOrders(all)
    return all
      .filter((order) => order.userId === userId)
      .sort((a, b) => b.createdAt - a.createdAt)
  },

  async getOrder(userId: string, orderNo: string): Promise<Order> {
    await wait(90)
    const all = readOrders()
    const order = all.find((item) => item.orderNo === orderNo && item.userId === userId)
    if (!order) throw new ShopError('ORDER_NOT_FOUND', '没有找到这个订单。')
    if (expireOrderIfNeeded(order)) writeOrders(all)
    return order
  },

  async payOrder(userId: string, orderNo: string, paymentMethod: string): Promise<Order> {
    await wait(900)
    const orders = readOrders()
    const index = orders.findIndex((item) => item.orderNo === orderNo && item.userId === userId)
    if (index < 0) throw new ShopError('ORDER_NOT_FOUND', '没有找到这个订单。')
    const order = orders[index]
    if (order.status === 'paid') return order
    if (order.status === 'cancelled') throw new ShopError('PAYMENT_FAILED', '订单已取消。')
    if (Date.now() > order.expiresAt) {
      orders[index] = { ...order, status: 'cancelled' }
      writeOrders(orders)
      throw new ShopError('ORDER_EXPIRED', '订单已超过 30 分钟支付时限，请回购物车重新下单。')
    }
    const payment = shopData.paymentMethods.find((item) => item.key === paymentMethod)
    if (!payment) throw new ShopError('PAYMENT_FAILED', '请选择一种支付方式。')
    const paid: Order = {
      ...order,
      status: 'paid',
      paidAt: Date.now(),
      paymentMethod: payment.key,
    }
    orders[index] = paid
    writeOrders(orders)
    return paid
  },

  async getPayCode(userId: string, orderNo: string, method?: string): Promise<PayCode> {
    await wait()
    const all = readOrders()
    const order = all.find((item) => item.orderNo === orderNo && item.userId === userId)
    if (!order) throw new ShopError('ORDER_NOT_FOUND', '没有找到这个订单。')
    if (expireOrderIfNeeded(order)) writeOrders(all)
    if (order.status === 'cancelled')
      throw new ShopError('ORDER_EXPIRED', '订单已取消或超过支付时限，请回购物车重新下单。')
    const key =
      method && shopData.paymentMethods.some((item) => item.key === method) ? method : order.paymentMethod
    const label = shopData.paymentMethods.find((item) => item.key === key)?.name ?? '在线支付'
    const payload = 'hjh-pay://order/' + order.orderNo + '?amount=' + order.totalCents + '&method=' + key
    // mock 模式没有服务端：给一张同尺寸的示意码，保证页面结构一致
    const amount = (order.totalCents / 100).toFixed(2)
    const data =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 220" width="220" height="220">' +
      '<rect width="220" height="220" fill="#ffffff"/>' +
      '<rect x="14" y="14" width="192" height="192" fill="none" stroke="#cfd8dc" stroke-dasharray="4 4"/>' +
      '<text x="110" y="100" text-anchor="middle" font-size="14" fill="#1f2a30">收款码</text>' +
      '<text x="110" y="124" text-anchor="middle" font-size="11" fill="#5a6a73">' +
      order.orderNo +
      '</text>' +
      '<text x="110" y="146" text-anchor="middle" font-size="11" fill="#5a6a73">¥' +
      amount +
      '</text></svg>'
    return {
      orderNo: order.orderNo,
      status: order.status,
      totalCents: order.totalCents,
      method: key,
      methodName: label,
      payload,
      qr: { format: 'svg', data },
      expiresAt: order.expiresAt,
      expiresInSec: Math.max(0, Math.floor((order.expiresAt - Date.now()) / 1000)),
      tips: [],
    }
  },
}
