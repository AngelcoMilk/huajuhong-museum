import { createHttpApi } from './http'
import { mockApi } from './mock'
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

// 页面只依赖这个接口。默认连后端 HTTP 适配器（server/ 已实现全部购物接口），
// 设 VITE_SHOP_API=mock 时退回 localStorage 演示，无后端也能跑。
// 路径与字段见后端 server/src/shop/routes.ts。
export interface ShopApi {
  listProducts(query?: ProductQuery): Promise<ProductListResult>
  getProduct(id: string): Promise<Product>
  register(input: RegisterInput): Promise<AuthResult>
  login(input: LoginInput): Promise<AuthResult>
  me(token: string | null): Promise<User | null>
  logout(token: string | null): Promise<void>
  getCart(): Promise<Cart>
  addToCart(skuId: string, qty?: number): Promise<Cart>
  setCartQty(skuId: string, qty: number): Promise<Cart>
  removeCartItem(skuId: string): Promise<Cart>
  clearCart(): Promise<Cart>
  listAddresses(userId: string): Promise<Address[]>
  saveAddress(userId: string, input: AddressInput & { id?: string }): Promise<Address>
  deleteAddress(userId: string, id: string): Promise<void>
  createOrder(userId: string, input: CreateOrderInput): Promise<Order>
  listOrders(userId: string): Promise<Order[]>
  getOrder(userId: string, orderNo: string): Promise<Order>
  payOrder(userId: string, orderNo: string, paymentMethod: string): Promise<Order>
  /** 收银台二维码：由服务端生成 SVG（mock 模式给示意码） */
  getPayCode(userId: string, orderNo: string, method?: string): Promise<PayCode>
}

const base = (import.meta.env.VITE_SHOP_API_BASE as string | undefined) ?? '/api'
const shopMode = import.meta.env.VITE_SHOP_API
if (shopMode && shopMode !== 'http' && shopMode !== 'mock') {
  console.warn('[shop] 未知的 VITE_SHOP_API 取值，按 http 处理：', shopMode)
}
const remote = shopMode !== 'mock'

export const apiMode: 'mock' | 'http' = remote ? 'http' : 'mock'

export const shopApi: ShopApi = remote ? createHttpApi(base) : mockApi
