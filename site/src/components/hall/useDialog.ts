import { useEffect, useRef } from 'react'

/**
 * 弹层的共用行为：锁住页面滚动、按 Esc 关闭、关掉后焦点回到打开它的元素。
 * 返回关闭按钮的 ref，挂上之后弹层一开就聚焦它（键盘用户不用先摸一遍）。
 */
export function useDialog(open: boolean, onClose: () => void) {
  const closeRef = useRef<HTMLButtonElement | null>(null)
  const handler = useRef(onClose)

  useEffect(() => {
    handler.current = onClose
  }, [onClose])

  useEffect(() => {
    if (!open) return
    const previous = document.activeElement as HTMLElement | null
    const body = document.body
    const oldOverflow = body.style.overflow
    body.style.overflow = 'hidden'

    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        handler.current()
      }
    }
    window.addEventListener('keydown', onKey)
    const timer = window.setTimeout(() => closeRef.current?.focus(), 40)

    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('keydown', onKey)
      body.style.overflow = oldOverflow
      previous?.focus?.({ preventScroll: true })
    }
  }, [open])

  return closeRef
}
