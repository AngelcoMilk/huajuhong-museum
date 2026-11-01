// 购物模块的领域类型。前端 mock 与将来的 HTTP 后端共用这一份。
// 金额一律用「分」的整数，时间戳用毫秒数；HTTP 传输时再换 ISO 字符串。

export type ArticleBlockType = 'p' | 'h' | 'note'

export type ArticleBlock = {
  type: ArticleBlockType
  text: string
}

export type ProductImage = {
  src: string
  alt: string
  originalUrl: string
  sourcePage: string
}

export type ImageSource = {
  label: string
  url: string
}

export type ProductSku = {
  sku: string
  name: string
  priceCents: number
  stock: number
}

export type Fact = {
  k: string
  v: string
}

export type ShopCandidate = {
  name: string
  url: string
  type: string
  basis: string
}

export type Product = {
  id: string
  title: string
  cat: string
  catKey: string
  catShort: string
  summary: string
  purchasable: boolean
  blockReason: string | null
  date: string | null
  sourceUrl: string
  sourceLabel: string
  blocks: ArticleBlock[]
  images: ProductImage[]
  imageSources: ImageSource[]
  thumb: string
  skus: ProductSku[]
  facts: Fact[]
  tags: string[]
  usage: string
  storage: string
  caution: string
  editorNote: string | null
  shopCandidates: ShopCandidate[]
  demo: boolean
}

export type ShopCategory = {
  key: string
  name: string
  short: string
  numeral: string
  note: string
  blurb: string
  usage: string
  storage: string
  caution: string
  count: number
}

export type ShippingMethod = {
  key: string
  name: string
  desc: string
  feeCents: number
}

export type PaymentMethod = {
  key: string
  name: string
  desc: string
}

export type ShopData = {
  updated: string
  count: number
  shopName: string
  notice: string
  disclosure: string
  categories: ShopCategory[]
  featured: string[]
  shipping: ShippingMethod[]
  paymentMethods: PaymentMethod[]
  items: Product[]
}

export type User = {
  id: string
  name: string
  phone: string
  createdAt: number
}

export type Session = {
  token: string
  user: User
}

export type AuthResult = {
  token: string
  user: User
}

export type LoginInput = {
  phone: string
  password: string
}

export type RegisterInput = {
  name: string
  phone: string
  password: string
}

export type CartLine = {
  skuId: string
  productId: string
  title: string
  variant: string
  thumb: string
  priceCents: number
  qty: number
  stock: number
  purchasable: boolean
}

export type Cart = {
  lines: CartLine[]
  updatedAt: number
}

export type Address = {
  id: string
  name: string
  phone: string
  province: string
  city: string
  district: string
  detail: string
  postcode: string
  tag: string
  isDefault: boolean
}

export type AddressInput = Omit<Address, 'id' | 'isDefault'> & {
  isDefault?: boolean
}

export type OrderItem = {
  skuId: string
  productId: string
  title: string
  variant: string
  thumb: string
  priceCents: number
  qty: number
}

export type OrderStatus = 'pending_payment' | 'paid' | 'cancelled'

export type Order = {
  orderNo: string
  userId: string
  status: OrderStatus
  items: OrderItem[]
  address: Address
  note: string
  shipping: ShippingMethod
  paymentMethod: string
  subtotalCents: number
  shippingFeeCents: number
  totalCents: number
  createdAt: number
  paidAt: number | null
  expiresAt: number
}

export type PayCode = {
  orderNo: string
  status: OrderStatus
  totalCents: number
  method: string
  methodName: string
  payload: string
  qr: { format: 'svg'; data: string }
  expiresAt: number
  expiresInSec: number
  tips: string[]
}

export type CreateOrderInput = {
  address: AddressInput
  shippingKey: string
  paymentMethod: string
  note?: string
}

export type ProductQuery = {
  category?: string
  keyword?: string
  sort?: 'default' | 'price-asc' | 'price-desc'
}

export type ProductListResult = {
  items: Product[]
  total: number
}
