import { useState } from 'react'
import { safeSrc } from '../../lib/safeSrc'
import '../../styles/hall-blocks.css'
import type { Block, BlockAlign, TextBlock } from '../../types/hall'

/** 正文里个别句子带 **加粗**，这里只把它变成强调，不改字词 */
function emphasis(text: unknown) {
  const pieces = String(text ?? '').split(/\*\*(.+?)\*\*/g)
  return pieces.map((piece, index) =>
    index % 2 === 1 ? <strong key={index}>{piece}</strong> : <span key={index}>{piece}</span>,
  )
}

function alignClass(align?: BlockAlign) {
  if (align === 'center') return ' is-center'
  if (align === 'right') return ' is-right'
  return ''
}

function RemoteImage({ src, alt, width, onBroken }: { src: string; alt: string; width?: number; onBroken: () => void }) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      referrerPolicy="no-referrer"
      style={width ? { width: width + '%' } : undefined}
      onError={onBroken}
    />
  )
}

/** 外链图可能失效（官网图床），破了就整块不显示，别留个破图标 */
function BlockImage({ block }: { block: Extract<Block, { kind: 'img' }> }) {
  const [broken, setBroken] = useState(false)
  const src = safeSrc(block.src)
  if (broken || !src) return null
  const width = Number(block.width)
  const figureClass = 'hall-blocks__fig' + (block.align === 'left' ? ' is-left' : alignClass(block.align))
  return (
    <figure className={figureClass}>
      <RemoteImage
        src={src}
        alt={block.alt ?? ''}
        width={width >= 1 && width <= 100 ? width : undefined}
        onBroken={() => setBroken(true)}
      />
      {block.caption ? <figcaption>{block.caption}</figcaption> : null}
    </figure>
  )
}

function BlockImageRow({ block }: { block: Extract<Block, { kind: 'imgrow' }> }) {
  const [broken, setBroken] = useState<string[]>([])
  const images = (Array.isArray(block.images) ? block.images : []).filter((image) => {
    const src = safeSrc(image?.src)
    return src && !broken.includes(src)
  })
  if (images.length === 0) return null
  return (
    <figure className="hall-blocks__row">
      <div className="hall-blocks__rowin">
        {images.map((image, index) => {
          const src = safeSrc(image.src)
          return (
            <RemoteImage
              key={src + index}
              src={src}
              alt={image.alt ?? ''}
              onBroken={() => setBroken((current) => [...current, src])}
            />
          )
        })}
      </div>
      {block.caption ? <figcaption>{block.caption}</figcaption> : null}
    </figure>
  )
}

function BlockMedia({ block }: { block: Extract<Block, { kind: 'video' | 'audio' }> }) {
  const [broken, setBroken] = useState(false)
  const src = safeSrc(block.src)
  if (!src) return null
  const name = block.kind === 'video' ? '视频' : '音频'
  return (
    <figure className="hall-blocks__media">
      {broken ? (
        <p className="hall-blocks__miss">这段{name}打不开</p>
      ) : block.kind === 'video' ? (
        <video
          src={src}
          poster={safeSrc(block.poster) || undefined}
          controls
          playsInline
          preload="metadata"
          onError={() => setBroken(true)}
        />
      ) : (
        <audio src={src} controls preload="metadata" onError={() => setBroken(true)} />
      )}
      {block.caption ? <figcaption>{block.caption}</figcaption> : null}
    </figure>
  )
}

function BlockTable({ block }: { block: Extract<Block, { kind: 'table' }> }) {
  const rows = (Array.isArray(block.rows) ? block.rows : []).filter(Array.isArray)
  if (rows.length === 0) return null
  const head = block.header ? rows[0] : null
  const body = block.header ? rows.slice(1) : rows
  return (
    <div className="hall-blocks__tablewrap" tabIndex={0} role="group" aria-label="表格">
      <table className="hall-blocks__table">
        {head ? (
          <thead>
            <tr>
              {head.map((cell, index) => (
                <th scope="col" key={index}>{emphasis(cell)}</th>
              ))}
            </tr>
          </thead>
        ) : null}
        <tbody>
          {body.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>{emphasis(cell)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function renderBlock(block: Block | TextBlock, index: number) {
  switch (block?.kind) {
    case 'p':
      return (
        <p className={'hall-blocks__p' + alignClass('align' in block ? block.align : undefined)} key={index}>
          {emphasis(block.text)}
        </p>
      )
    case 'h2':
      return (
        <h2 className={'hall-blocks__h2' + alignClass(block.align)} key={index}>
          {emphasis(block.text)}
        </h2>
      )
    case 'h3':
      return (
        <h3 className={'hall-blocks__h3' + alignClass('align' in block ? block.align : undefined)} key={index}>
          {emphasis(block.text)}
        </h3>
      )
    case 'img':
      return <BlockImage key={index} block={block as Extract<Block, { kind: 'img' }>} />
    case 'imgrow':
      return <BlockImageRow key={index} block={block} />
    case 'quote':
      return (
        <blockquote className="hall-blocks__quote" key={index}>
          {emphasis(block.text)}
        </blockquote>
      )
    case 'list': {
      const List = block.ordered ? 'ol' : 'ul'
      return (
        <List className="hall-blocks__list" key={index}>
          {(Array.isArray(block.items) ? block.items : []).map((item, itemIndex) => (
            <li key={itemIndex}>{emphasis(item)}</li>
          ))}
        </List>
      )
    }
    case 'table':
      return <BlockTable key={index} block={block} />
    case 'video':
    case 'audio':
      return <BlockMedia key={index} block={block} />
    case 'note':
      return (
        <p className="hall-blocks__note" key={index}>
          {emphasis(block.text)}
        </p>
      )
    case 'hr':
      return <hr className="hall-blocks__hr" key={index} />
    default:
      return null
  }
}

/** 正文块只在这里渲染，前台各页和后台预览共用 */
export default function HallBlocks({ blocks }: { blocks: Array<Block | TextBlock> }) {
  return <div className="hall-blocks">{(Array.isArray(blocks) ? blocks : []).map(renderBlock)}</div>
}
