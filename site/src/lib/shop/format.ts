const numberFormat = new Intl.NumberFormat('zh-CN', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

/** 分 → ¥69.00 */
export function money(cents: number): string {
  return '¥' + numberFormat.format(cents / 100)
}

/** 分 → 69.00（不带符号，配合大号 ¥ 排版） */
export function amount(cents: number): string {
  return numberFormat.format(cents / 100)
}

export function dateTime(ts: number | null): string {
  if (!ts) return '—'
  return new Date(ts).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

export function dateShort(ts: number): string {
  return new Date(ts).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

export function maskPhone(phone: string): string {
  if (!/^\d{11}$/.test(phone)) return phone
  return phone.slice(0, 3) + '****' + phone.slice(7)
}

export function statusLabel(status: 'pending_payment' | 'paid' | 'cancelled'): string {
  if (status === 'paid') return '已付款'
  if (status === 'cancelled') return '已取消'
  return '待付款'
}

export function countdown(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000))
  const minutes = String(Math.floor(total / 60)).padStart(2, '0')
  const seconds = String(total % 60).padStart(2, '0')
  return minutes + ':' + seconds
}
