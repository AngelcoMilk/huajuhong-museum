import { describe, expect, it, vi } from 'vitest'
import { isGuideRoute, runGuideAction } from './guideActions'

describe('讲解员跳转白名单', () => {
  it.each([
    '/',
    '/park',
    '/park#yq-002',
    '/museum?article=BW-001',
    '/museum?scene=VR-006',
    '/craft#machines',
    '/craft#machine-qiepian',
    '/enterprises?id=QY-001',
    '/vr?scene=VR-006',
    '/history/SL-001',
    '/products/CP-001',
    '/cart',
    '/orders',
    '/account',
  ])('放行 %s', (route) => {
    expect(isGuideRoute(route)).toBe(true)
  })

  it.each([
    '/admin',
    '/admin/orders',
    '/checkout',
    '/pay/HJH1',
    'https://example.com',
    '//example.com',
    '/history/../admin',
    '/products/CP-001?x=1',
    '/craft#machine-unknown',
    '/museum?other=1',
    '/cart\n',
    '',
    null,
    42,
  ])('拒绝 %j', (route) => {
    expect(isGuideRoute(route)).toBe(false)
  })

  it('地址不在白名单时不跳转，卡片写失败', async () => {
    const navigate = vi.fn()
    const result = await runGuideAction({ type: 'goto_page', payload: { route: '/admin', label: '后台' } }, navigate)
    expect(result.ok).toBe(false)
    expect(navigate).not.toHaveBeenCalled()
  })

  it('白名单内的地址才跳转', async () => {
    const navigate = vi.fn()
    const result = await runGuideAction({ type: 'goto_page', payload: { route: '/craft#machines', label: '现代机器' } }, navigate)
    expect(result).toEqual({ ok: true, text: '已打开：现代机器' })
    expect(navigate).toHaveBeenCalledWith('/craft#machines')
  })
})
