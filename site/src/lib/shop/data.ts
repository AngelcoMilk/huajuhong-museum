import raw from '../../data/products.json'
import type { Product, ProductSku, ShopCategory, ShopData } from './types'

// products.json 是商品目录的静态回落数据，价格与库存都是演示值。
export const shopData = raw as unknown as ShopData
export const products: Product[] = shopData.items

export const categories: ShopCategory[] = shopData.categories

export function findProduct(id: string | undefined): Product | undefined {
  if (!id) return undefined
  return products.find((item) => item.id === id)
}

export function findCategory(key: string | undefined): ShopCategory | undefined {
  if (!key) return undefined
  return categories.find((cat) => cat.key === key || cat.name === key)
}

export function findSku(skuId: string): { product: Product; sku: ProductSku } | null {
  for (const product of products) {
    const sku = product.skus.find((item) => item.sku === skuId)
    if (sku) return { product, sku }
  }
  return null
}

export function lowestPrice(product: Product): ProductSku {
  return product.skus.reduce((low, sku) => (sku.priceCents < low.priceCents ? sku : low), product.skus[0])
}

export function featuredProducts(): Product[] {
  return shopData.featured
    .map((id) => products.find((item) => item.id === id))
    .filter((item): item is Product => Boolean(item))
}

export function relatedProducts(product: Product, limit = 4): Product[] {
  return products
    .filter((item) => item.cat === product.cat && item.id !== product.id)
    .slice(0, limit)
}
