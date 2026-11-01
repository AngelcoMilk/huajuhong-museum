import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import ProductCard from '../components/shop/ProductCard'
import QtyStepper from '../components/shop/QtyStepper'
import { addCartItem } from '../lib/shop/cart'
import { findProduct, relatedProducts } from '../lib/shop/data'
import { toShopError } from '../lib/shop/errors'
import { amount } from '../lib/shop/format'
import type { ProductSku } from '../lib/shop/types'
import '../styles/shop.css'

type Status = 'idle' | 'adding' | 'added' | 'error'

// 产品信息表只留对买家有用的项；旧数据里的编号、发布日期、下单状态不显示
const HIDDEN_FACTS = /素材|官网|下单|来源/

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const product = findProduct(id)
  const navigate = useNavigate()

  const [sku, setSku] = useState<ProductSku | null>(product?.skus[0] ?? null)
  const [qty, setQty] = useState(1)
  const [gallery, setGallery] = useState(0)
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')

  useEffect(() => {
    setSku(product?.skus[0] ?? null)
    setQty(1)
    setGallery(0)
    setStatus('idle')
    setError('')
  }, [product])

  // 换规格时把数量收回 1，避免上一个规格的数量超过新规格库存。
  useEffect(() => {
    setQty(1)
  }, [sku?.sku])

  if (!product) {
    return (
      <div className="shop shop--missing">
        <div className="shop-empty">
          <p>没有找到这件产品。它可能已经下架，或编号写错了。</p>
          <Link className="btn btn--solid" to="/products">回产品中心</Link>
        </div>
      </div>
    )
  }

  // 后台新上架的商品可能没有图、没有简介
  const images = product.images ?? []
  const current = images[gallery] ?? images[0]
  const tags = product.tags ?? []
  const facts = (product.facts ?? []).filter((fact) => !HIDDEN_FACTS.test(fact.k))
  const related = relatedProducts(product)
  // 后台水合的正文可能带来源行，这里不显示
  const blocks = (product.blocks ?? []).filter((block) => !/^(来源|参考资料)[：:]/.test(block.text))

  const add = async (mode: 'cart' | 'buy') => {
    if (!sku || !product.purchasable) return
    setStatus('adding')
    setError('')
    try {
      await addCartItem(sku.sku, qty)
      if (mode === 'buy') {
        navigate('/checkout')
        return
      }
      setStatus('added')
      window.setTimeout(() => setStatus((now) => (now === 'added' ? 'idle' : now)), 3200)
    } catch (caught) {
      setStatus('error')
      setError(toShopError(caught).message)
    }
  }

  return (
    <div className="shop shop--detail">
      <nav className="crumbs" aria-label="面包屑">
        <Link to="/products">产品中心</Link>
        <span aria-hidden="true">/</span>
        <Link to={'/products?cat=' + product.catKey}>{product.cat}</Link>
        <span aria-hidden="true">/</span>
        <b>{product.title}</b>
      </nav>

      <article className="pd">
        <div className="pd__gallery">
          <figure className="pd__stage">
            {current ? <img src={current.src} alt={product.title + ' 产品图'} /> : <span className="pd__blank" aria-hidden="true" />}
          </figure>
          {images.length > 1 ? (
            <div className="pd__thumbs" role="group" aria-label="产品图">
              {images.map((image, index) => (
                <button
                  type="button"
                  key={image.src}
                  className={index === gallery ? 'is-on' : ''}
                  onClick={() => setGallery(index)}
                  aria-pressed={index === gallery}
                  aria-label={'第 ' + (index + 1) + ' 张产品图'}
                >
                  <img src={image.src} alt="" loading="lazy" />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="pd__info">
          <h1>{product.title}</h1>
          {tags.length > 0 ? (
            <div className="pd__tags">
              {tags.map((tag) => <span key={tag}>{tag}</span>)}
            </div>
          ) : null}

          {product.purchasable ? (
            <>
              <div className="pd__price">
                <span className="pd__yen">¥</span>
                <b>{sku ? amount(sku.priceCents) : '—'}</b>
              </div>

              {product.skus.length > 1 || product.skus[0]?.name !== product.title ? <div className="pd__field">
                <p className="pd__label">规格</p>
                <div className="chips" role="group" aria-label="选择规格">
                  {product.skus.map((item) => (
                    <button
                      type="button"
                      key={item.sku}
                      className={sku?.sku === item.sku ? 'is-on' : ''}
                      onClick={() => setSku(item)}
                      aria-pressed={sku?.sku === item.sku}
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              </div> : null}

              <div className="pd__field pd__buyrow">
                <p className="pd__label">数量</p>
                <QtyStepper value={qty} onChange={setQty} max={Math.min(sku?.stock ?? 99, 99)} />
                <span className="pd__stock">库存 {sku?.stock ?? 0} 件</span>
              </div>

              <div className="pd__acts">
                <button
                  type="button"
                  className="btn btn--solid"
                  onClick={() => void add('cart')}
                  disabled={status === 'adding'}
                >
                  {status === 'adding' ? '正在加入…' : '加入购物车'}
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={() => void add('buy')}
                  disabled={status === 'adding'}
                >
                  立即购买
                </button>
              </div>

              <p className="pd__ok" role="status">
                {status === 'added' ? <>已加入 · <Link to="/cart">去购物车</Link></> : null}
              </p>
            </>
          ) : (
            <p className="pd__blocked">药品类商品不在线销售。</p>
          )}
          {error ? <p className="pd__err" role="alert">{error}</p> : null}
        </div>
      </article>

      {blocks.length > 0 || product.caution || facts.length > 0 ? (
        <section className="pd__body">
          <div className="pd__article">
            {blocks.length > 0 ? <h2>产品详情</h2> : null}
            <div className="article">
              {blocks.map((block, index) => {
                if (block.type === 'h') {
                  return <h3 className="article__h" key={index}>{block.text}</h3>
                }
                if (block.type === 'note') {
                  return <p className="article__note" key={index}>{block.text}</p>
                }
                return <p className="article__p" key={index}>{block.text}</p>
              })}
            </div>
            {product.caution ? <p className="article__disclaimer">{product.caution}</p> : null}
          </div>

          {facts.length > 0 ? (
            <aside className="pd__aside">
              <h2>产品信息</h2>
              <dl className="facts">
                {facts.map((fact) => (
                  <div key={fact.k}>
                    <dt>{fact.k}</dt>
                    <dd>{fact.v}</dd>
                  </div>
                ))}
              </dl>
            </aside>
          ) : null}
        </section>
      ) : null}

      {related.length > 0 ? (
        <section className="pd__related">
          <h2>同类产品</h2>
          <ul className="shop-grid">
            {related.map((item) => (
              <li key={item.id}>
                <ProductCard product={item} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  )
}
