import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import ProductCard from '../components/shop/ProductCard'
import { NextHall } from '../components/exhibit/Exhibit'
import LineArt from '../components/exhibit/LineArt'
import { categories, featuredProducts, lowestPrice, products } from '../lib/shop/data'
import { amount } from '../lib/shop/format'
import '../styles/shop.css'

type Sort = 'default' | 'price-asc' | 'price-desc'

const SORTS: { key: Sort; label: string }[] = [
  { key: 'default', label: '按类目' },
  { key: 'price-asc', label: '价低优先' },
  { key: 'price-desc', label: '价高优先' },
]

export default function Products() {
  const [params, setParams] = useSearchParams()
  const [cat, setCat] = useState(() => {
    const initial = params.get('cat') ?? 'all'
    return categories.some((item) => item.key === initial) ? initial : 'all'
  })
  const [keyword, setKeyword] = useState('')
  const [sort, setSort] = useState<Sort>('default')

  useEffect(() => {
    const next = params.get('cat') ?? 'all'
    setCat(categories.some((item) => item.key === next) ? next : 'all')
  }, [params])

  const chooseCat = (key: string) => {
    setCat(key)
    setParams(key === 'all' ? {} : { cat: key }, { replace: true })
  }

  const featured = useMemo(() => featuredProducts(), [])

  const list = useMemo(() => {
    const key = keyword.trim().toLowerCase()
    let items = products
    if (cat !== 'all') items = items.filter((item) => item.catKey === cat)
    if (key) {
      items = items.filter((item) => {
        const haystack = [item.title, item.cat, item.summary, ...(item.tags ?? [])].join(' ').toLowerCase()
        return haystack.includes(key)
      })
    }
    if (sort === 'price-asc' || sort === 'price-desc') {
      items = [...items].sort((a, b) => {
        const pa = lowestPrice(a).priceCents
        const pb = lowestPrice(b).priceCents
        return sort === 'price-asc' ? pa - pb : pb - pa
      })
    }
    return items
  }, [cat, keyword, sort])

  const activeCategory = cat === 'all' ? null : categories.find((item) => item.key === cat)

  return (
    <>
    <div className="shop shop--catalog">
      <LineArt name="qizhua" className="shop-art" />
      <header className="shop-head">
        <h1 className="shop-title">产品中心</h1>
        <p className="shop-lead">干果、成药、制剂、饮品、食品、工艺品，六类 {products.length} 件。</p>
        <p className="shop-note">成药与制剂按药品管理，不在线销售。</p>
      </header>

      <section className="shop-feature" id="featured" aria-label="推荐产品">
        <p className="shop-feature__label">推荐</p>
        <div className="shop-feature__grid">
          {featured.slice(0, 3).map((item, index) => (
            <Link className={'feat' + (index === 0 ? ' feat--lead' : '')} to={'/products/' + item.id} key={item.id}>
              {item.thumb ? <img src={item.thumb} alt={item.title + ' 产品图'} loading={index === 0 ? 'eager' : 'lazy'} /> : null}
              <div className="feat__in">
                <p className="feat__meta">
                  {item.catShort}
                  {item.tags?.[0] ? ' · ' + item.tags[0] : ''}
                </p>
                <b>{item.title}</b>
                <span>{item.summary}</span>
                <em>
                  {item.purchasable ? '¥' + amount(lowestPrice(item).priceCents) + ' 起' : '药品类'}
                </em>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="shop-filter" aria-label="筛选商品">
        <div className="shop-cats" role="group" aria-label="产品类目">
          <button
            type="button"
            className={cat === 'all' ? 'is-on' : ''}
            onClick={() => chooseCat('all')}
            aria-pressed={cat === 'all'}
          >
            全部 <span>{products.length}</span>
          </button>
          {categories.map((item) => (
            <button
              type="button"
              key={item.key}
              className={cat === item.key ? 'is-on' : ''}
              onClick={() => chooseCat(item.key)}
              aria-pressed={cat === item.key}
            >
              {item.short} <span>{item.count}</span>
            </button>
          ))}
        </div>

        <div className="shop-tools">
          <label className="shop-search">
            <span className="sr-only">搜索商品</span>
            <input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="搜名称、类目或标签"
              type="search"
            />
          </label>
          <label className="shop-sort">
            <span className="sr-only">排序</span>
            <select value={sort} onChange={(event) => setSort(event.target.value as Sort)}>
              {SORTS.map((item) => (
                <option key={item.key} value={item.key}>{item.label}</option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <div className="shop-result">
        <p>
          <b>{activeCategory ? activeCategory.short : '全部'}</b>
          <span>{list.length} 件{activeCategory ? ' · ' + activeCategory.note : ''}</span>
        </p>
        {activeCategory ? <p className="shop-result__blurb">{activeCategory.blurb}</p> : null}
      </div>

      {list.length === 0 ? (
        <div className="shop-empty">
          <p>没有找到对应的产品。</p>
          <button type="button" className="btn" onClick={() => { setKeyword(''); chooseCat('all') }}>
            清空筛选
          </button>
        </div>
      ) : (
        <ul className="shop-grid">
          {list.map((item) => (
            <li key={item.id}>
              <ProductCard product={item} />
            </li>
          ))}
        </ul>
      )}

    </div>
    <NextHall to="/" name="序厅" note="回到参观动线起点" cover="/img/hero.jpg" label="展线结束" />
    </>
  )
}
