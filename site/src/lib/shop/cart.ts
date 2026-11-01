import { useSyncExternalStore } from 'react'
import { shopApi } from './api'
import type { Cart, CartLine } from './types'

// 购物车状态：localStorage 是数据源，这里只做一层订阅缓存。
// 金额一律从单价 × 数量现算，不把合计存在浏览器里。

export type CartState = {
  lines: CartLine[]
  ready: boolean
  busy: boolean
}

let state: CartState = { lines: [], ready: false, busy: false }
let pending: Promise<void> | null = null
let generation = 0
const listeners = new Set<() => void>()

function setState(next: CartState) {
  state = next
  for (const listener of listeners) listener()
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getSnapshot(): CartState {
  return state
}

async function load(force = false): Promise<void> {
  if (!force && (state.ready || pending)) {
    if (pending) await pending
    return
  }
  if (pending) await pending
  const ticket = ++generation
  pending = shopApi
    .getCart()
    .then((cart) => {
      if (ticket !== generation) return
      setState({ lines: cart.lines, ready: true, busy: state.busy })
    })
    .catch(() => {
      if (ticket === generation) setState({ ...state, ready: true })
    })
    .finally(() => {
      pending = null
    })
  await pending
}

async function mutate(request: Promise<Cart>): Promise<Cart> {
  // 让在途的 getCart 结果作废，避免旧快照盖掉刚加的数量。
  generation += 1
  setState({ ...state, busy: true })
  try {
    const cart = await request
    setState({ lines: cart.lines, ready: true, busy: false })
    return cart
  } catch (error) {
    setState({ ...state, busy: false })
    throw error
  }
}

export function initCart(): void {
  if (!state.ready) void load()
}

export function refreshCart(): Promise<void> {
  return load(true)
}

export function useCart(): CartState {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}

/** 组件外读当前购物车（讲解员的动作要用） */
export function currentCartLines(): CartLine[] {
  return state.lines
}

export function addCartItem(skuId: string, qty = 1): Promise<Cart> {
  return mutate(shopApi.addToCart(skuId, qty))
}

export function setCartQty(skuId: string, qty: number): Promise<Cart> {
  return mutate(shopApi.setCartQty(skuId, qty))
}

export function removeCartItem(skuId: string): Promise<Cart> {
  return mutate(shopApi.removeCartItem(skuId))
}

export function clearCartLines(): Promise<Cart> {
  return mutate(shopApi.clearCart())
}

export function cartCount(lines: CartLine[]): number {
  return lines.reduce((sum, line) => sum + line.qty, 0)
}

export function cartSubtotal(lines: CartLine[]): number {
  return lines.reduce((sum, line) => sum + line.priceCents * line.qty, 0)
}

// 跨标签页同步：storage 只会在「别的标签」触发；同标签里 mock 写的
// hjh-shop-cart 也接上，这样下单清空后顶栏数量会立刻归零。
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key === 'hjh-shop:cart') void load(true)
  })
  window.addEventListener('hjh-shop-cart', () => {
    void load(true)
  })
}
