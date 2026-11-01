import { useState } from 'react'
interface EnterpriseFiltersProps {
  query: string
  town: string | null
  facets: { town: string; count: number }[]
  total: number
  onQuery: (value: string) => void
  onTown: (town: string | null) => void
}

export default function EnterpriseFilters({ query, town, facets, total, onQuery, onTown }: EnterpriseFiltersProps) {
  // 手机上镇街多，默认只露前几个，「更多」再展开；桌面端由 CSS 直接铺满
  const [open, setOpen] = useState(false)

  return (
    <div className="ent-tools">
      <div className="ent-search">
        <label className="ent-search__label" htmlFor="ent-query">
          检索
        </label>
        <input
          id="ent-query"
          className="ent-search__input"
          type="search"
          value={query}
          placeholder="企业名、镇街或地址"
          onChange={(event) => onQuery(event.target.value)}
        />
        {query !== '' ? (
          <button type="button" className="ent-search__clear" onClick={() => onQuery('')} aria-label="清除检索">
            ×
          </button>
        ) : null}
      </div>

      <div className={open ? "ent-towns is-open" : "ent-towns"} role="group" aria-label="按镇街筛选">
        <button
          type="button"
          className="ent-chip"
          data-active={town === null ? 'true' : undefined}
          aria-pressed={town === null}
          onClick={() => onTown(null)}
        >
          全部 <b>{total}</b>
        </button>
        {facets.map((facet) => (
          <button
            key={facet.town}
            type="button"
            className="ent-chip"
            data-active={town === facet.town ? 'true' : undefined}
            aria-pressed={town === facet.town}
            onClick={() => onTown(town === facet.town ? null : facet.town)}
          >
            {facet.town} <b>{facet.count}</b>
          </button>
        ))}
      </div>

      <button
        type="button"
        className="ent-more"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? '收起镇街' : `更多镇街（${facets.length}）`}
      </button>
    </div>
  )
}