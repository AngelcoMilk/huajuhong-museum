import type { MappedEnterprise } from '../../types/enterprise'
import { cnDigits } from '../exhibit/Exhibit'

interface EnterpriseCardProps {
  item: MappedEnterprise
  index: number
  selected: boolean
  hovered: boolean
  onSelect: (id: string) => void
  onHover: (id: string | null) => void
  onOpen: (id: string) => void
}

/** 摘要取企业自述里第一段正文：跳过 "## 小标题" 和 "（1）…" 这种条目行 */
function summaryOf(text: string): string {
  const first = text
    .split('\n')
    .map((line) => line.trim())
    .find(
      (line) =>
        line.length > 0 &&
        !line.startsWith('## ') &&
        !/^（\d+）|^\(\d+\)/.test(line),
    )
  return first ?? ''
}

/** tel: 链接只保留数字与开头的加号 */
function telHref(tel: string): string {
  return `tel:${tel.replace(/[^\d+]/g, '')}`
}

export default function EnterpriseCard({
  item,
  index,
  selected,
  hovered,
  onSelect,
  onHover,
  onOpen,
}: EnterpriseCardProps) {
  const number = cnDigits(item.id.slice(3))
  const summary = summaryOf(item.text)
  const shopCount = item.shops.length

  return (
    <li
      className="ent-card"
      data-ent-id={item.id}
      data-selected={selected ? 'true' : undefined}
      data-hover={hovered ? 'true' : undefined}
      onMouseEnter={() => onHover(item.id)}
      onMouseLeave={() => onHover(null)}
    >
      <span className="ent-card__no" aria-hidden="true">
        {number}
      </span>

      <div className="ent-card__body">
        <p className="ent-card__kicker">
          <span className="ent-card__town">{item.town}</span>
          {shopCount > 0 ? <span className="ent-card__dot" aria-hidden="true">·</span> : null}
          {shopCount > 0 ? <span>{shopCount} 家网店</span> : null}
        </p>

        <h3 className="ent-card__name">
          <button
            type="button"
            className="ent-card__hit"
            onClick={() => {
              onSelect(item.id)
              onOpen(item.id)
            }}
            onFocus={() => onHover(item.id)}
            onBlur={() => onHover(null)}
            aria-label={`第 ${index + 1} 家：${item.name}，打开企业档案`}
          >
            {item.name}
          </button>
        </h3>

        {summary ? <p className="ent-card__summary">{summary}</p> : null}

        <span className="ent-card__more" aria-hidden="true">
          读档案
        </span>

        <div className="ent-card__facts">
          <span className="ent-card__fact ent-card__fact--addr" title={item.address}>
            {item.address || '—'}
          </span>
          {item.tel ? (
            <a className="ent-card__fact ent-card__tel" href={telHref(item.tel)}>
              {item.tel}
            </a>
          ) : null}
        </div>
      </div>
    </li>
  )
}