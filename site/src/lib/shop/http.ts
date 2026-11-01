import { ERROR_TEXT, ShopError } from './errors'
import { sessionToken } from './session'
import type {
  Address,
  AddressInput,
  AuthResult,
  Cart,
  CreateOrderInput,
  LoginInput,
  Order,
  PayCode,
  Product,
  ProductListResult,
  ProductQuery,
  RegisterInput,
  User,
} from './types'
import type { ShopApi } from './api'

// HTTP 适配器：默认启用。
// 设 VITE_SHOP_API=mock 退回 localStorage 演示；VITE_SHOP_API_BASE 默认 /api。
// 成功响应直接返回资源 JSON；失败响应为 { error: { code, message, field? } }。

type ErrorEnvelope = { error?: { code?: string; message?: string; field?: string } }

async function request<T>(base: string, path: string, init: RequestInit = {}): Promise<T> {
  const token = sessionToken()
  const headers = new Headers(init.headers)
  headers.set('Accept', 'application/json')
  if (init.body) headers.set('Content-Type', 'application/json')
  if (token) headers.set('Authorization', 'Bearer ' + token)

  let response: Response
  try {
    // 8 秒超时：后端连上却不回时别让页面永久转圈
    response = await fetch(base + path, { ...init, headers, signal: AbortSignal.timeout(8000) })
  } catch {
    throw new ShopError('NETWORK', '网络请求失败，请稍后再试。')
  }
  const text = await response.text()
  let payload: unknown = null
  if (text) {
    try {
      payload = JSON.parse(text)
    } catch {
      payload = null
    }
  }
  if (!response.ok) {
    const error = (payload as ErrorEnvelope | null)?.error
    throw new ShopError(
      error?.code ?? 'NETWORK',
      (error?.message && !/演示|模拟/.test(error.message) ? error.message : ERROR_TEXT[error?.code ?? '']) ?? '请求失败（HTTP ' + response.status + '）。',
      error?.field,
    )
  }
  return payload as T
}

function query(path: string, params: Record<string, string | undefined>): string {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value) search.set(key, value)
  }
  const suffix = search.toString()
  return suffix ? path + '?' + suffix : path
}

export function createHttpApi(baseUrl = '/api'): ShopApi {
  const base = baseUrl.replace(/\/$/, '')

  return {
    listProducts(queryParams: ProductQuery = {}) {
      return request<ProductListResult>(
        base,
        query('/shop/products', {
          category: queryParams.category,
          keyword: queryParams.keyword,
          sort: queryParams.sort,
        }),
      )
    },

    getProduct(id: string) {
      return request<Product>(base, '/shop/products/' + encodeURIComponent(id))
    },

    register(input: RegisterInput) {
      return request<AuthResult>(base, '/auth/register', { method: 'POST', body: JSON.stringify(input) })
    },

    login(input: LoginInput) {
      return request<AuthResult>(base, '/auth/login', { method: 'POST', body: JSON.stringify(input) })
    },

    me() {
      return request<User | null>(base, '/auth/me')
    },

    logout() {
      return request<void>(base, '/auth/logout', { method: 'POST' })
    },

    getCart() {
      return request<Cart>(base, '/shop/cart')
    },

    addToCart(skuId: string, qty = 1) {
      return request<Cart>(base, '/shop/cart/items', {
        method: 'POST',
        body: JSON.stringify({ skuId, qty }),
      })
    },

    setCartQty(skuId: string, qty: number) {
      return request<Cart>(base, '/shop/cart/items/' + encodeURIComponent(skuId), {
        method: 'PATCH',
        body: JSON.stringify({ qty }),
      })
    },

    removeCartItem(skuId: string) {
      return request<Cart>(base, '/shop/cart/items/' + encodeURIComponent(skuId), { method: 'DELETE' })
    },

    clearCart() {
      return request<Cart>(base, '/shop/cart', { method: 'DELETE' })
    },

    listAddresses() {
      return request<Address[]>(base, '/shop/addresses')
    },

    saveAddress(_userId: string, input: AddressInput & { id?: string }) {
      const path = input.id ? '/shop/addresses/' + encodeURIComponent(input.id) : '/shop/addresses'
      return request<Address>(base, path, {
        method: input.id ? 'PUT' : 'POST',
        body: JSON.stringify(input),
      })
    },

    deleteAddress(_userId: string, id: string) {
      return request<void>(base, '/shop/addresses/' + encodeURIComponent(id), { method: 'DELETE' })
    },

    createOrder(_userId: string, input: CreateOrderInput) {
      return request<Order>(base, '/shop/orders', { method: 'POST', body: JSON.stringify(input) })
    },

    listOrders() {
      return request<Order[]>(base, '/shop/orders')
    },

    getOrder(_userId: string, orderNo: string) {
      return request<Order>(base, '/shop/orders/' + encodeURIComponent(orderNo))
    },

    payOrder(_userId: string, orderNo: string, paymentMethod: string) {
      return request<Order>(base, '/shop/orders/' + encodeURIComponent(orderNo) + '/pay', {
        method: 'POST',
        body: JSON.stringify({ paymentMethod }),
      })
    },

    getPayCode(_userId: string, orderNo: string, method?: string) {
      return request<PayCode>(
        base,
        query('/shop/orders/' + encodeURIComponent(orderNo) + '/pay-code', { method }),
      )
    },
  }
}
