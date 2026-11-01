import { useState } from 'react'
import '../../styles/hall.css'
import type { VrScene } from '../../types/hall'

type Props = {
  scene: VrScene
  /** 素材编号，如 VR-001 */
  no: string
  onOpen: (scene: VrScene) => void
  /** 暗厅里用 dark，纸色底用 paper（默认） */
  tone?: 'paper' | 'dark'
  /** 配套车间这类次要场面用 sm，密度低一档 */
  size?: 'md' | 'sm'
}

/**
 * 一个全景场景的卡片。
 * 封面先取后台的缩略图，打不开退回本地同名图（public/img/vr/<sceneId>.jpg）；
 * 再打不开就是"编号 + 场面名"的文字卡，不留破图。
 */
export default function VrSceneCard({ scene, no, onOpen, tone = 'paper', size = 'md' }: Props) {
  const local = scene.sceneId ? '/img/vr/' + scene.sceneId + '.jpg' : ''
  const candidates = [scene.thumbLocal, local].filter((src, index, list) => src && list.indexOf(src) === index)
  const [failed, setFailed] = useState(0)
  const src = candidates[failed]

  return (
    <button
      type="button"
      className={'hall-vr hall-vr--' + size + (src ? '' : ' hall-vr--textual')}
      data-tone={tone}
      onClick={() => onOpen(scene)}
      aria-label={'进入全景：' + scene.title}
    >
      <span className="hall-vr__frame">
        {src ? (
          <img src={src} alt="" loading="lazy" onError={() => setFailed((count) => count + 1)} />
        ) : (
          <span className="hall-vr__blank" aria-hidden="true">
            {no.replace('VR-', '')}
          </span>
        )}
        <span className="hall-vr__cue" aria-hidden="true">
          全景
        </span>
      </span>
      <span className="hall-vr__body">
        <b>{scene.title}</b>
        {scene.description ? <span className="hall-vr__desc">{scene.description}</span> : null}
      </span>
    </button>
  )
}
