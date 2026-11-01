import { beforeEach, describe, expect, it } from 'vitest'
import { loadRegions } from '../regions'
import { products } from './data'
import { money, maskPhone } from './format'
import { mockApi } from './mock'
import type { AddressInput } from './types'

const ADDRESS: AddressInput = {
  name: '测试用户',
  phone: '13900001111',
  province: '广东省',
  city: '茂名市',
  district: '化州市',
  detail: '橘城路 1 号 2 栋 301',
  postcode: '525100',
  tag: '家',
  isDefault: false,
}

const PASSWORD = 'abc12345'

describe('购物数据', () => {
  it('21 件商品都有 SKU、原文与本地图片，药品类不可下单', () => {
    expect(products).toHaveLength(21)
    for (const product of products) {
      expect(product.skus.length, product.id).toBeGreaterThan(0)
      expect(product.blocks.length, product.id).toBeGreaterThan(0)
      expect(product.sourceUrl).toMatch(/^https:\/\/www\.hzhjh\.com\.cn\//)
      expect(product.thumb).toMatch(/^\/img\/products\/CP-\d{3}\.jpg$/)
      expect(product.imageSources.length).toBeGreaterThan(0)
    }
    expect(products.filter((item) => !item.purchasable).map((item) => item.id)).toEqual(['CP-009', 'CP-010'])
  })

  it('演示价固定：同一 SKU 两次读取价格一致', () => {
    const product = products.find((item) => item.id === 'CP-002')
    expect(product?.skus.map((sku) => sku.priceCents)).toEqual([6900, 8900, 12900, 10900])
    expect(money(12345)).toBe('¥123.45')
    expect(maskPhone('13800138000')).toBe('138****8000')
  })

  it('行政区划：34 个省级单位，广东省茂名市化州市存在', async () => {
    const regions = await loadRegions()
    expect(regions).toHaveLength(34)
    const gd = regions.find((item) => item.n === '广东省')
    const mm = gd?.c.find((item) => item.n === '茂名市')
    expect(mm?.d).toContain('化州市')
    const bj = regions.find((item) => item.n === '北京市')
    expect(bj?.c[0].d).toContain('东城区')
  })
})

describe('账号', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('注册 → 查询当前用户 → 重复手机号被拒', async () => {
    const auth = await mockApi.register({ name: '测试用户', phone: ADDRESS.phone, password: PASSWORD })
    expect(auth.user.name).toBe('测试用户')
    expect(await mockApi.me(auth.token)).toMatchObject({ phone: ADDRESS.phone })
    await expect(
      mockApi.register({ name: '另一个人', phone: ADDRESS.phone, password: PASSWORD }),
    ).rejects.toMatchObject({ code: 'PHONE_TAKEN' })
  })

  it('密码规则、登录成功与失败', async () => {
    await expect(
      mockApi.register({ name: '测试用户', phone: ADDRESS.phone, password: '12345678' }),
    ).rejects.toMatchObject({ code: 'WEAK_PASSWORD' })

    await mockApi.register({ name: '测试用户', phone: ADDRESS.phone, password: PASSWORD })
    const login = await mockApi.login({ phone: ADDRESS.phone, password: PASSWORD })
    expect(login.token).toMatch(/^tk-/)
    await expect(mockApi.login({ phone: ADDRESS.phone, password: 'wrong123' })).rejects.toMatchObject({
      code: 'BAD_CREDENTIALS',
    })
  })

  it('内置演示账号可登录', async () => {
    const demo = await mockApi.login({ phone: '13800138000', password: 'hjh12345' })
    expect(demo.user.name).toBe('阿橘')
  })

  it('退出登录后 token 失效', async () => {
    const auth = await mockApi.register({ name: '测试用户', phone: ADDRESS.phone, password: PASSWORD })
    await mockApi.logout(auth.token)
    expect(await mockApi.me(auth.token)).toBeNull()
  })
})

describe('购物车与订单', () => {
  let userId = ''

  beforeEach(async () => {
    localStorage.clear()
    const auth = await mockApi.register({ name: '测试用户', phone: ADDRESS.phone, password: PASSWORD })
    userId = auth.user.id
  })

  it('加购、改数量、算小计、移除', async () => {
    await mockApi.addToCart('CP-002-02', 2)
    await mockApi.addToCart('CP-017-01', 1)
    let cart = await mockApi.getCart()
    expect(cart.lines).toHaveLength(2)
    expect(cart.lines.reduce((sum, line) => sum + line.priceCents * line.qty, 0)).toBe(8900 * 2 + 4900)

    cart = await mockApi.setCartQty('CP-002-02', 3)
    expect(cart.lines.find((line) => line.skuId === 'CP-002-02')?.qty).toBe(3)

    cart = await mockApi.removeCartItem('CP-017-01')
    expect(cart.lines).toHaveLength(1)

    cart = await mockApi.clearCart()
    expect(cart.lines).toHaveLength(0)
  })

  it('药品类不能加购，未知 SKU 报错', async () => {
    await expect(mockApi.addToCart('CP-009-01', 1)).rejects.toMatchObject({ code: 'NOT_PURCHASABLE' })
    await expect(mockApi.addToCart('CP-999-01', 1)).rejects.toMatchObject({ code: 'SKU_NOT_FOUND' })
  })

  it('下单会清空购物车并按服务端单价重算，付款幂等', async () => {
    await mockApi.addToCart('CP-002-02', 2)
    await mockApi.addToCart('CP-017-01', 1)
    const order = await mockApi.createOrder(userId, {
      address: ADDRESS,
      shippingKey: 'standard',
      paymentMethod: 'wechat',
      note: '演示留言',
    })

    expect(order.orderNo).toMatch(/^HJH\d{8}\d{4}$/)
    expect(order.status).toBe('pending_payment')
    expect(order.subtotalCents).toBe(22700)
    expect(order.shippingFeeCents).toBe(0)
    expect(order.totalCents).toBe(22700)
    expect((await mockApi.getCart()).lines).toHaveLength(0)

    const paid = await mockApi.payOrder(userId, order.orderNo, 'alipay')
    expect(paid.status).toBe('paid')
    expect(paid.paidAt).not.toBeNull()
    const paidAgain = await mockApi.payOrder(userId, order.orderNo, 'wechat')
    expect(paidAgain.paidAt).toBe(paid.paidAt)
    expect(paidAgain.paymentMethod).toBe('alipay')

    const list = await mockApi.listOrders(userId)
    expect(list).toHaveLength(1)
    expect(await mockApi.getOrder(userId, order.orderNo)).toMatchObject({ status: 'paid' })
  })

  it('顺丰运费进入总额；空购物车不能下单', async () => {
    await mockApi.addToCart('CP-011-01', 1)
    const order = await mockApi.createOrder(userId, {
      address: ADDRESS,
      shippingKey: 'express',
      paymentMethod: 'unionpay',
    })
    expect(order.shippingFeeCents).toBe(1200)
    expect(order.totalCents).toBe(order.subtotalCents + 1200)

    await expect(
      mockApi.createOrder(userId, { address: ADDRESS, shippingKey: 'standard', paymentMethod: 'wechat' }),
    ).rejects.toMatchObject({ code: 'CART_EMPTY' })
  })

  it('收货信息校验：缺区县、邮编格式、手机号', async () => {
    await mockApi.addToCart('CP-011-01', 1)
    await expect(
      mockApi.createOrder(userId, {
        address: { ...ADDRESS, district: '' },
        shippingKey: 'standard',
        paymentMethod: 'wechat',
      }),
    ).rejects.toMatchObject({ code: 'ADDRESS_INVALID' })

    await expect(
      mockApi.createOrder(userId, {
        address: { ...ADDRESS, postcode: '123' },
        shippingKey: 'standard',
        paymentMethod: 'wechat',
      }),
    ).rejects.toMatchObject({ code: 'POSTCODE_INVALID' })

    await expect(
      mockApi.createOrder(userId, {
        address: { ...ADDRESS, phone: '12345' },
        shippingKey: 'standard',
        paymentMethod: 'wechat',
      }),
    ).rejects.toMatchObject({ code: 'INVALID_PHONE' })
  })

  it('超过支付时限后付款被拒，订单转为已取消', async () => {
    await mockApi.addToCart('CP-011-01', 1)
    const order = await mockApi.createOrder(userId, {
      address: ADDRESS,
      shippingKey: 'standard',
      paymentMethod: 'wechat',
    })
    const stored = JSON.parse(localStorage.getItem('hjh-shop:orders') ?? '[]') as Array<{
      orderNo: string
      expiresAt: number
    }>
    const target = stored.find((item) => item.orderNo === order.orderNo)
    if (!target) throw new Error('order not stored')
    target.expiresAt = Date.now() - 1000
    localStorage.setItem('hjh-shop:orders', JSON.stringify(stored))

    await expect(mockApi.payOrder(userId, order.orderNo, 'wechat')).rejects.toMatchObject({
      code: 'ORDER_EXPIRED',
    })
    expect((await mockApi.getOrder(userId, order.orderNo)).status).toBe('cancelled')
  })

  it('地址簿：首条默认、可改默认、可移除', async () => {
    const first = await mockApi.saveAddress(userId, ADDRESS)
    expect(first.isDefault).toBe(true)
    const second = await mockApi.saveAddress(userId, { ...ADDRESS, district: '茂南区', isDefault: false })
    expect(second.isDefault).toBe(false)

    await mockApi.saveAddress(userId, { ...second, isDefault: true, id: second.id })
    const list = await mockApi.listAddresses(userId)
    expect(list.filter((item) => item.isDefault)).toHaveLength(1)
    expect(list.find((item) => item.isDefault)?.id).toBe(second.id)

    await mockApi.deleteAddress(userId, second.id)
    const rest = await mockApi.listAddresses(userId)
    expect(rest).toHaveLength(1)
    expect(rest[0].isDefault).toBe(true)
  })
})
