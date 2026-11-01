import type { ReactNode } from 'react'
import '../../styles/hall.css'
import type { VrGroupView } from '../../lib/hallContent'
import type { VrScene } from '../../types/hall'
import VrSceneCard from './VrSceneCard'

type Props = {
  group: VrGroupView
  onOpen: (scene: VrScene) => void
  listClass: string
  itemClass: string
  tone?: 'paper' | 'dark'
  size?: 'md' | 'sm'
  reveal?: boolean
  /** 卡片上方的站牌，序号是版面上的顺序 */
  tag?: (index: number) => ReactNode
}

/**
 * 一个分组的场景墙。
 * feature：featured 的场景（都没有就取第一个）提到最前，占满一行；其余网格。
 * grid：等大网格，featured 的场景占两列两行。
 */
export default function VrWall({ group, onOpen, listClass, itemClass, tone, size, reveal = true, tag }: Props) {
  const anyFeatured = group.scenes.some((scene) => scene.featured)
  const isLead = (scene: VrScene) =>
    group.layout === 'feature' && (anyFeatured ? scene.featured === true : scene === group.scenes[0])
  const scenes = [...group.scenes.filter(isLead), ...group.scenes.filter((scene) => !isLead(scene))]

  return (
    <ul
      className={listClass + ' vr-wall'}
      data-reveal={reveal ? 'rise' : undefined}
      data-stagger={reveal ? '' : undefined}
    >
      {scenes.map((scene, index) => {
        const bigClass = isLead(scene)
          ? ' vr-wall__lead'
          : group.layout === 'grid' && scene.featured
            ? ' vr-wall__big'
            : ''
        return (
          <li className={itemClass + bigClass} key={scene.id}>
            {tag ? tag(index) : null}
            <VrSceneCard scene={scene} no={scene.id} tone={tone} size={bigClass ? 'md' : size} onOpen={onOpen} />
          </li>
        )
      })}
    </ul>
  )
}
