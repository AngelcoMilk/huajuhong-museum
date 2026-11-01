export class ShopError extends Error {
  readonly code: string
  readonly field?: string

  constructor(code: string, message: string, field?: string) {
    super(message)
    this.name = 'ShopError'
    this.code = code
    this.field = field
  }
}

export const ERROR_TEXT: Record<string, string> = {
  INVALID_PHONE: '请填写 11 位手机号。',
  INVALID_NAME: '请填写 2–16 个字的称呼。',
  WEAK_PASSWORD: '密码至少 8 位，且同时包含字母和数字。',
  PASSWORD_MISMATCH: '两次输入的密码不一致。',
  PHONE_TAKEN: '这个手机号已经注册过，直接登录即可。',
  BAD_CREDENTIALS: '手机号或密码不对，请再试一次。',
  UNAUTHORIZED: '登录状态已失效，请重新登录。',
  ADDRESS_INVALID: '收货信息不完整，请检查姓名、手机号、省市区和详细地址。',
  POSTCODE_INVALID: '邮编应为 6 位数字，或留空。',
  CART_EMPTY: '购物车是空的。',
  SKU_NOT_FOUND: '这件商品已下架或规格不存在。',
  NOT_PURCHASABLE: '药品类商品不在线销售。',
  OUT_OF_STOCK: '库存不足，请减少数量。',
  ORDER_NOT_FOUND: '没有找到这个订单。',
  ORDER_EXPIRED: '订单已超过 30 分钟支付时限，请回购物车重新下单。',
  PAYMENT_FAILED: '支付没有完成，请重试。',
  NETWORK: '请求没有送达，请稍后再试。',
}

export function toShopError(error: unknown): ShopError {
  if (error instanceof ShopError) return error
  if (error instanceof Error) return new ShopError('NETWORK', error.message)
  return new ShopError('NETWORK', ERROR_TEXT.NETWORK)
}
