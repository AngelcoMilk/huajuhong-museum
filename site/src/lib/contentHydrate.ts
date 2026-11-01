// 内容水合：商品、企业仍以构建期 JSON 为骨架，把「可编辑字段」用后端内容覆盖一次；
// 园区、博物馆、VR 走 hallContent，完全按接口显示。接口不可用时静默退回静态数据。
import type { TextBlock } from '../types/hall'
import { loadHallContent } from './hallContent'
import { categories, products } from '../lib/shop/data'
import { enterprises } from '../data/enterprises'
import type { MappedEnterprise } from '../types/enterprise'
import type { ArticleBlock, Product, ShopCategory } from '../lib/shop/types'
import type { Enterprise } from '../types/enterprise'

export type ApiContentItem = {
  id: string
  board: string
  section: string
  type: string
  title: string
  date: string | null
  sourceUrl: string | null
  body: string
  label: { usage?: string; caution?: string; copyright?: string } | null
  media: Array<{ kind: string; url: string; alt: string | null; usage: string | null }>
  product?: { thumb?: string | null; category?: string | null } | null
  enterprise?: { town?: string | null; address?: string | null; tel?: string | null } | null
}

export type HydrationReport = { boards: number; patched: number; pricePatched: number; source: 'api' | 'static' }

export type ApiShopProduct = {
  id: string
  title: string
  thumb: string
  purchasable: boolean
  blockReason: string | null
  skus: Array<{ sku: string; name: string; priceCents: number; stock: number }>
  cat?: string
  catKey?: string
  catShort?: string
  summary?: string
  date?: string | null
  sourceUrl?: string
  sourceLabel?: string
  blocks?: ArticleBlock[]
}

/** 新商品没有任何图时用的占位图，详情页要求至少有一张 */
const FALLBACK_PRODUCT_IMAGE = '/img/board-products.jpg'

/** 正文按空行切段；段落里的「小标题」在后台是普通行，这里统一当段落渲染 */
export function toBlocks(body: string): TextBlock[] {
  return body
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean)
    .map((text) => ({ kind: 'p', text }) as TextBlock)
}

/**
 * 价格与可售性：以购物接口为准。
 * 后台改价/改库存后，前台读的静态目录会被覆盖成服务端的值。
 */
export function patchCommerce(list: Product[], apiProducts: ApiShopProduct[]): number {
  let patched = 0
  const byId = new Map(apiProducts.map((item) => [item.id, item]))
  for (const product of list) {
    const remote = byId.get(product.id)
    if (!remote) continue
    let changed = false
    if (product.purchasable !== remote.purchasable) changed = true
    product.purchasable = remote.purchasable
    if (remote.blockReason !== undefined) product.blockReason = remote.blockReason
    if (remote.thumb && remote.thumb !== product.thumb) {
      product.thumb = remote.thumb
      changed = true
    }
    const bySku = new Map(remote.skus.map((sku) => [sku.sku, sku]))
    product.skus = product.skus.map((sku) => {
      const next = bySku.get(sku.sku)
      if (!next) return sku
      if (next.priceCents !== sku.priceCents || next.stock !== sku.stock) changed = true
      return { ...sku, name: next.name || sku.name, priceCents: next.priceCents, stock: next.stock }
    })
    if (changed) patched += 1
  }
  return patched
}

/** 同一张图可能在 media 里出现两次（缩略图与原图同址），按 src 去重，避免 React key 冲突 */
function productImages(item: ApiContentItem): Product['images'] {
  const seen = new Set<string>()
  return item.media
    .filter((m) => m.kind === 'image')
    .map((m) => ({ src: m.url, alt: m.alt ?? '', originalUrl: m.url, sourcePage: item.sourceUrl ?? '' }))
    .filter((image) => {
      if (seen.has(image.src)) return false
      seen.add(image.src)
      return true
    })
}

function toProduct(remote: ApiShopProduct, item?: ApiContentItem): Product {
  const images = item ? productImages(item) : []
  const thumb = remote.thumb || images[0]?.src || FALLBACK_PRODUCT_IMAGE
  return {
    id: remote.id,
    title: remote.title,
    cat: remote.cat ?? '',
    catKey: remote.catKey ?? '',
    catShort: remote.catShort ?? '',
    summary: remote.summary ?? '',
    purchasable: remote.purchasable,
    blockReason: remote.blockReason,
    date: remote.date ?? null,
    sourceUrl: remote.sourceUrl ?? '',
    sourceLabel: remote.sourceLabel ?? '',
    blocks: remote.blocks ?? [],
    images: images.length > 0 ? images : [{ src: thumb, alt: '', originalUrl: thumb, sourcePage: '' }],
    imageSources: [],
    thumb,
    skus: remote.skus,
    facts: [],
    tags: [],
    usage: '',
    storage: '',
    caution: '',
    editorNote: null,
    shopCandidates: [],
    demo: true,
  }
}

/**
 * 商品目录以购物接口为准：接口没有的（已下架、规格全下架）从前台去掉，接口有而静态目录没有的（后台新建）补进去。
 * 只在接口成功且格式正确时调用；接口失败时静态目录保持原样。
 */
export function syncCatalog(list: Product[], apiProducts: ApiShopProduct[], items: Map<string, ApiContentItem> = new Map()): number {
  const selling = new Map(apiProducts.filter((remote) => remote.skus.length > 0).map((remote) => [remote.id, remote]))
  let changed = 0
  for (let index = list.length - 1; index >= 0; index -= 1) {
    if (selling.has(list[index].id)) continue
    list.splice(index, 1)
    changed += 1
  }
  const known = new Map(list.map((product) => [product.id, product]))
  for (const remote of selling.values()) {
    const product = known.get(remote.id)
    if (product) {
      product.skus = remote.skus
    } else {
      list.push(toProduct(remote, items.get(remote.id)))
      changed += 1
    }
  }
  return changed
}

/** 产品中心分类标签上的件数，跟着目录走 */
function recountCategories(list: Product[], cats: ShopCategory[]) {
  for (const cat of cats) cat.count = list.filter((product) => product.catKey === cat.key).length
}

/** 产品：只覆盖文案与主图，价格/库存仍由购物接口负责 */
export function patchProducts(list: Product[], items: Map<string, ApiContentItem>): number {
  let patched = 0
  for (const product of list) {
    const item = items.get(product.id)
    if (!item) continue
    if (item.title !== product.title) patched += 1
    product.title = item.title
    const blocks = toBlocks(item.body)
    if (blocks.length > 0) {
      product.blocks = blocks.map((block) => ({ type: 'p' as const, text: block.text ?? '' }))
      product.summary = (blocks[0].text ?? '').slice(0, 80)
    }
    const thumb = item.product?.thumb ?? item.media.find((m) => m.usage === 'thumb')?.url
    if (thumb) product.thumb = thumb
    if (item.sourceUrl) product.sourceUrl = item.sourceUrl
    if (item.media.length > 0) {
      const images = productImages(item)
      if (images.length > 0) product.images = images
    }
  }
  return patched
}

/** 地图点位：后台补录/新建后，前台水合就能定位到新点（只改数据，不改版式） */
export function patchEnterprisePoints(list: MappedEnterprise[], points: Record<string, { lng: number; lat: number; coordSource?: string; verified?: boolean }>): number {
  let patched = 0
  for (const enterprise of list) {
    const point = points[enterprise.id]
    if (!point) continue
    if (enterprise.lng === point.lng && enterprise.lat === point.lat) continue
    enterprise.lng = point.lng
    enterprise.lat = point.lat
    enterprise.coordSource = point.coordSource ?? '后台录入'
    enterprise.verified = Boolean(point.verified)
    patched += 1
  }
  return patched
}

/** 企业：覆盖档案字段与简介，图片与点位保持原样 */
export function patchEnterprises(list: Enterprise[], items: Map<string, ApiContentItem>): number {
  let patched = 0
  for (const enterprise of list) {
    const item = items.get(enterprise.id)
    if (!item) continue
    if (item.title !== enterprise.name) patched += 1
    enterprise.name = item.title
    const profile = item.enterprise as any
    if (profile) {
      if (profile.town) enterprise.town = profile.town
      if (profile.address) enterprise.address = profile.address
      if (profile.tel) enterprise.tel = profile.tel
      if (profile.email) enterprise.email = profile.email
      if (profile.site) enterprise.site = profile.site
      if (profile.shopsJson) {
        try {
          const shops = JSON.parse(profile.shopsJson)
          if (Array.isArray(shops) && shops.length > 0) enterprise.shops = shops
        } catch {
          /* 忽略坏 JSON */
        }
      }
    }
    if (item.body.trim()) enterprise.text = item.body
    if (item.date) enterprise.date = item.date
    if (item.sourceUrl) enterprise.sourceUrl = item.sourceUrl
  }
  return patched
}

async function fetchEnterprisePoints(timeoutMs: number): Promise<Record<string, { lng: number; lat: number; coordSource?: string; verified?: boolean }> | null> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const response = await fetch('/api/content/enterprise-points', { signal: controller.signal })
    if (!response.ok) return null
    const payload = (await response.json()) as { points?: Record<string, any> }
    return payload.points ?? null
  } catch {
    return null
  } finally {
    clearTimeout(timer)
  }
}

function isShopProduct(value: any): value is ApiShopProduct {
  return (
    Boolean(value) &&
    typeof value.id === 'string' &&
    value.id !== '' &&
    typeof value.title === 'string' &&
    Array.isArray(value.skus) &&
    value.skus.every((sku: any) => Boolean(sku) && typeof sku.sku === 'string' && typeof sku.name === 'string' && Number.isFinite(sku.priceCents) && Number.isFinite(sku.stock))
  )
}

async function fetchShopProducts(timeoutMs: number): Promise<ApiShopProduct[] | null> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const response = await fetch('/api/shop/products', { signal: controller.signal })
    if (!response.ok) return null
    const payload = (await response.json()) as { items?: unknown }
    // 这份结果会用来增删前台商品，有一条格式不对就整份不用
    return Array.isArray(payload.items) && payload.items.every(isShopProduct) ? payload.items : null
  } catch {
    return null
  } finally {
    clearTimeout(timer)
  }
}

async function fetchBoard(board: string, timeoutMs: number): Promise<ApiContentItem[] | null> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const response = await fetch(`/api/content/board/${board}`, { signal: controller.signal })
    if (!response.ok) return null
    return (await response.json()) as ApiContentItem[]
  } catch {
    return null
  } finally {
    clearTimeout(timer)
  }
}

/** 园区、博物馆、VR 最多等这么久，慢了就先用回落内容，接口回来后页面自己换 */
function waitForHall(timeoutMs: number): Promise<unknown> {
  return Promise.race([
    loadHallContent(),
    new Promise((resolve) => setTimeout(resolve, timeoutMs)),
  ])
}

/**
 * 拉一次内容并就地覆盖静态数据。
 * 只覆盖「文案类」字段；布局、锚点、图片墙仍以静态结构为准。
 */
export async function hydrateContent(timeoutMs = 1000): Promise<HydrationReport> {
  const [product, enterprise, shop, points] = await Promise.all([
    fetchBoard('product', timeoutMs),
    fetchBoard('enterprise', timeoutMs),
    fetchShopProducts(timeoutMs),
    fetchEnterprisePoints(timeoutMs),
    waitForHall(timeoutMs),
  ])
  if (!product && !enterprise && !shop && !points) {
    return { boards: 0, patched: 0, pricePatched: 0, source: 'static' }
  }

  let patched = 0
  let boards = 0
  const productItems = new Map((product ?? []).map((item) => [item.id, item]))
  if (product) {
    patched += patchProducts(products, productItems)
    boards += 1
  }
  if (enterprise) {
    const items = new Map(enterprise.map((item) => [item.id, item]))
    patched += patchEnterprises(enterprises, items)
    boards += 1
  }
  const pricePatched = shop ? patchCommerce(products, shop) : 0
  if (shop) {
    patched += syncCatalog(products, shop, productItems)
    recountCategories(products, categories)
  }
  if (points) {
    patched += patchEnterprisePoints(enterprises, points)
    boards += 1
  }
  return { boards, patched, pricePatched, source: 'api' }
}