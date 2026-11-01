import type { ContentItem } from '../../lib/hallContent'
import '../../styles/hall.css'
import ArticleMeta from './ArticleMeta'
import HallBlocks from './HallBlocks'
import { useDialog } from './useDialog'

type Props = {
  article: ContentItem | null
  onClose: () => void
}

/**
 * 文章阅读层：纸色面板，正文用 HallBlocks 排。
 * 回落内容多数在半句上截断（truncated 标了），末尾只留省略号，不补写。
 * 「合上」单独放在吸顶的窄栏里，长文滚到一半也关得掉，标题可以滚走。
 */
export default function ArticleSheet({ article, onClose }: Props) {
  const closeRef = useDialog(article !== null, onClose)
  if (!article) return null

  const coverInBody = article.blocks.some((block) => block.kind === 'img' && block.src === article.coverUrl)

  return (
    <div className="hall-sheet" role="dialog" aria-modal="true" aria-labelledby="hall-sheet-title">
      <article className="hall-sheet__box">
        <div className="hall-sheet__bar">
          <button type="button" className="hall-sheet__close" ref={closeRef} onClick={onClose}>
            合上
          </button>
        </div>
        <header className="hall-sheet__head">
          {article.subtitle ? <p className="hall-sheet__kicker">{article.subtitle}</p> : null}
          <h2 className="hall-sheet__title" id="hall-sheet-title">
            {article.title}
          </h2>
          <ArticleMeta
            className="hall-sheet__meta"
            date={article.date}
            author={article.author}
            sourceName={article.sourceName}
          />
        </header>

        {article.coverUrl && !coverInBody ? (
          <HallBlocks blocks={[{ kind: 'img', src: article.coverUrl }]} />
        ) : null}
        <HallBlocks blocks={article.blocks} />

        {article.truncated ? <p className="hall-sheet__cut" aria-hidden="true">……</p> : null}
      </article>
    </div>
  )
}
