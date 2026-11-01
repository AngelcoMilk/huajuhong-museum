import { dayOf } from '../../lib/hallContent'

type Props = {
  date?: string
  author?: string
  sourceName?: string
  className?: string
}

/** 日期、作者、出处：哪项为空就不显示哪项，全空不占位 */
export default function ArticleMeta({ date, author, sourceName, className }: Props) {
  const parts = [date ? dayOf(date) : '', author ?? '', sourceName ?? ''].filter(Boolean)
  if (parts.length === 0) return null
  return (
    <p className={className}>
      {parts.map((part, index) => (
        <span key={index}>{part}</span>
      ))}
    </p>
  )
}
