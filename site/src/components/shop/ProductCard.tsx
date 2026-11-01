import { Link } from 'react-router'
import { lowestPrice } from '../../lib/shop/data'
import { amount } from '../../lib/shop/format'
import type { Product } from '../../lib/shop/types'

type Props = {
  product: Product
}

export default function ProductCard({ product }: Props) {
  const from = lowestPrice(product)

  return (
    <Link className="pcard" to={'/products/' + product.id}>
      <figure className="pcard__fig">
        {product.thumb ? (
          <img src={product.thumb} alt={product.title + ' 产品图'} loading="lazy" />
        ) : (
          <span className="pcard__blank" aria-hidden="true" />
        )}
        {!product.purchasable ? <span className="pcard__flag">药品</span> : null}
      </figure>
      <div className="pcard__body">
        <p className="pcard__cat">{product.catShort}</p>
        <h3 className="pcard__title">{product.title}</h3>
        {product.summary ? <p className="pcard__sum">{product.summary}</p> : null}
        <div className="pcard__foot">
          {product.purchasable && from ? (
            <span className="pcard__price">
              <small>¥</small>{amount(from.priceCents)}<em>起</em>
            </span>
          ) : (
            <span className="pcard__only">{product.purchasable ? '—' : '药品类'}</span>
          )}
          <span className="pcard__more" aria-hidden="true">详情</span>
        </div>
      </div>
    </Link>
  )
}
