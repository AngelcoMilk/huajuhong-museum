type Props = {
  value: number
  onChange: (next: number) => void
  min?: number
  max?: number
  disabled?: boolean
  label?: string
}

export default function QtyStepper({ value, onChange, min = 1, max = 99, disabled = false, label = '数量' }: Props) {
  const clamp = (next: number) => Math.max(min, Math.min(max, next))

  return (
    <div className="qty" role="group" aria-label={label}>
      <button
        type="button"
        className="qty__btn"
        onClick={() => onChange(clamp(value - 1))}
        disabled={disabled || value <= min}
        aria-label="减一"
      >
        −
      </button>
      <output className="qty__num" aria-live="polite">{value}</output>
      <button
        type="button"
        className="qty__btn"
        onClick={() => onChange(clamp(value + 1))}
        disabled={disabled || value >= max}
        aria-label="加一"
      >
        +
      </button>
    </div>
  )
}
