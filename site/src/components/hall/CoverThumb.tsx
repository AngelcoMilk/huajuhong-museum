import { useState } from 'react'

/** 列表里的小封面：外链图打不开就不占位 */
export default function CoverThumb({ src, className }: { src: string; className: string }) {
  const [broken, setBroken] = useState(false)
  if (!src || broken) return null
  return (
    <span className={className}>
      <img src={src} alt="" loading="lazy" referrerPolicy="no-referrer" onError={() => setBroken(true)} />
    </span>
  )
}
