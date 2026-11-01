import { LINE_ART, type LineArtName } from './lineArtData'

/** 白描：纯装饰，线色走令牌，位置和宽度由各页给（绝对定位，不占位）。 */
export default function LineArt({ name, className }: { name: LineArtName; className?: string }) {
  return (
    <svg className={'line-art' + (className ? ' ' + className : '')} viewBox="0 0 200 170" aria-hidden="true">
      {LINE_ART[name].map((stroke, index) => (
        <path
          key={index}
          d={stroke.d}
          strokeWidth={stroke.w}
          className={stroke.tone ? 'line-art__' + stroke.tone : undefined}
        />
      ))}
    </svg>
  )
}
