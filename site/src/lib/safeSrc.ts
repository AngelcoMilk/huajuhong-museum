/** 只放行 http(s) 和站内路径；官网旧数据里的 //host/x 按 https 补全 */
export function safeSrc(src: unknown): string {
  if (typeof src !== 'string') return ''
  const value = src.trim()
  if (value.startsWith('//')) return 'https:' + value
  if (value.startsWith('/') || /^https?:\/\//i.test(value)) return value
  return ''
}
