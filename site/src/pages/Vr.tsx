import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'
import { HallOpen, LoadState, NextHall } from '../components/exhibit/Exhibit'
import VrStage from '../components/hall/VrStage'
import VrWall from '../components/hall/VrWall'
import { useVrGroups, type VrGroupView } from '../lib/hallContent'
import { trackItem } from '../lib/track'
import type { VrScene } from '../types/hall'
import '../styles/vr.css'

const ALL = '全部'

/** 两页的未分组场景同名，这一页同时列出，要标明属于哪一页 */
function nameOf(group: VrGroupView) {
  if (!group.id.startsWith('ungrouped-')) return group.name
  return (group.page === 'park' ? '园区' : '博物馆') + ' · ' + group.name
}

export default function Vr() {
  const groups = useVrGroups()
  const [groupId, setGroupId] = useState(ALL)
  const [scene, setScene] = useState<VrScene | null>(null)
  const [params, setParams] = useSearchParams()
  const sceneId = params.get('scene')

  useEffect(() => {
    if (scene) trackItem(scene.id)
  }, [scene])

  // 讲解员带到某个场景：/vr?scene=…。合上时参数一起去掉
  useEffect(() => {
    if (!sceneId) return
    const target = groups.flatMap((group) => group.scenes).find((entry) => entry.id === sceneId)
    if (target) setScene((prev) => (prev?.id === target.id ? prev : target))
  }, [sceneId, groups])

  const total = groups.reduce((sum, group) => sum + group.scenes.length, 0)
  const shown = groups.filter((group) => groupId === ALL || group.id === groupId)

  return (
    <div className="vr">
      <HallOpen img="/img/board-vr.jpg" title="VR 全景" lead={total > 0 ? '共 ' + total + ' 个全景场景。' : undefined} />

      <div className="vr__body">
        {groups.length === 0 ? (
          <LoadState state="empty" title="还没有场景" />
        ) : (
          <>
            <div className="vr__tabs" role="group" aria-label="场景分组">
              {[{ id: ALL, name: ALL, count: total }, ...groups.map((group) => ({ id: group.id, name: nameOf(group), count: group.scenes.length }))].map((item) => (
                <button
                  type="button"
                  key={item.id}
                  className={groupId === item.id ? 'is-on' : ''}
                  aria-pressed={groupId === item.id}
                  onClick={() => setGroupId(item.id)}
                >
                  {item.name} <span>{item.count}</span>
                </button>
              ))}
            </div>

            {shown.length === 0 ? <LoadState state="empty" title="这一组还没有场景" /> : null}
            {shown.map((group) => (
              <section className="vr__group" key={group.id} aria-label={nameOf(group)}>
                {groupId === ALL ? (
                  <h2 className="vr__name">
                    {nameOf(group)}
                    <span>{group.scenes.length} 处</span>
                  </h2>
                ) : null}
                {group.scenes.length === 0 ? (
                  <LoadState state="empty" title="这一组还没有场景" />
                ) : (
                  <VrWall group={group} listClass="vr__wall" itemClass="vr__cell" reveal={false} onOpen={setScene} />
                )}
              </section>
            ))}
          </>
        )}
      </div>

      <NextHall to="/park" name="园区展示" note="图文栏目与全景基地" cover="/img/board-park.jpg" label="相关展厅" />

      <VrStage
        open={scene !== null}
        scene={scene}
        onClose={() => {
          setScene(null)
          if (sceneId) setParams({}, { replace: true })
        }}
      />
    </div>
  )
}
