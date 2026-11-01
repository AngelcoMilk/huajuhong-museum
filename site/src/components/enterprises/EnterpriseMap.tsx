import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import type { GeoJsonObject } from 'geojson'
import type { EnterpriseMapProps, TownPoint } from '../../types/enterprise'
import boundaryRaw from '../../data/map/huazhou.geo.json'
import townsRaw from '../../data/map/towns.json'
import { wgs84ToGcj02 } from '../../lib/gcj02'
import 'leaflet/dist/leaflet.css'
import './enterprise-map.css'

// 真实底图（Leaflet，可缩放拖动）。三方坐标系必须一致：
//   高德瓦片 = GCJ-02；DataV 行政区划来自高德，也是 GCJ-02；OSM / Nominatim 的点是 WGS-84。
// 点位渲染时做一次 WGS-84 → GCJ-02 换算（src/lib/gcj02.ts）。换 OSM 底图：改 SOURCE 即可。

const TILE_SOURCES = {
  amap: {
    url: 'https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
    options: { subdomains: '1234', maxZoom: 18, attribution: '底图 © 高德地图' },
    needsGcj: true,
  },
  osm: {
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    options: { maxZoom: 19, attribution: '底图 © OpenStreetMap contributors' },
    needsGcj: false,
  },
} as const

const SOURCE = TILE_SOURCES.amap
const TOWNS = (townsRaw as { towns: TownPoint[] }).towns
const CLUSTER_PX = 56 // 两个点/块中心少于这个像素就一定合并，保证任何尺度下互不遮挡
const TOWN_ZOOM = 10.6 // 小于这个尺度：只画「每个镇街一个大点 + 家数」，不露小点
const FOCUS_ZOOM = 14.5 // 点开档案时飞到的小区级特写

interface MapNode {
  pos: L.Point
  items: EnterpriseMapProps['items']
}

/** 反复合并「中心距离小于 minDist」的两组，直到没有任何一组会互相压住 */
function mergeNodes(nodes: MapNode[], minDist: number): MapNode[] {
  const groups = nodes.map((node) => ({ pos: node.pos.clone(), items: [...node.items] }))
  let merged = true
  while (merged) {
    merged = false
    outer: for (let i = 0; i < groups.length; i += 1) {
      for (let j = i + 1; j < groups.length; j += 1) {
        const a = groups[i]
        const b = groups[j]
        if (a.pos.distanceTo(b.pos) >= minDist) continue
        const total = a.items.length + b.items.length
        a.pos = L.point(
          (a.pos.x * a.items.length + b.pos.x * b.items.length) / total,
          (a.pos.y * a.items.length + b.pos.y * b.items.length) / total,
        )
        a.items = a.items.concat(b.items)
        groups.splice(j, 1)
        merged = true
        break outer
      }
    }
  }
  return groups
}

function toLatLng(lng: number, lat: number): [number, number] {
  if (!SOURCE.needsGcj) return [lat, lng]
  const [gcjLng, gcjLat] = wgs84ToGcj02(lng, lat)
  return [gcjLat, gcjLng]
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (ch) => {
    switch (ch) {
      case '&':
        return '&amp;'
      case '<':
        return '&lt;'
      case '>':
        return '&gt;'
      case '"':
        return '&quot;'
      default:
        return '&#39;'
    }
  })
}

/** 化州县界（GCJ-02），用于「县外压纸色」的洞 */
const COUNTY_RINGS: [number, number][][] = (() => {
  const feature = (boundaryRaw as unknown as { features: { geometry: { type: string; coordinates: unknown } }[] }).features[0]
  const g = feature.geometry
  const polys: number[][][][] =
    g.type === 'Polygon' ? [g.coordinates as number[][][]] : (g.coordinates as number[][][][])
  const rings: [number, number][][] = []
  for (const poly of polys) for (const ring of poly) rings.push(ring.map(([lng, lat]) => [lat, lng] as [number, number]))
  return rings
})()

function boundsOf(rings: [number, number][][]): L.LatLngBounds {
  return L.latLngBounds(rings.flat().map(([lat, lng]) => L.latLng(lat, lng)))
}

interface DrawnMarker {
  marker: L.Marker
  ids: string[]
  town: string
  kind: 'single' | 'group'
}

export default function EnterpriseMap({
  items,
  selectedId,
  hoveredId,
  focusId,
  activeTown,
  total,
  onOpen,
  onSelect,
  onHover,
}: EnterpriseMapProps) {
  const holderRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<L.Map | null>(null)
  const layerRef = useRef<L.LayerGroup | null>(null)
  const drawnRef = useRef<DrawnMarker[]>([])
  const stateRef = useRef({ selectedId, hoveredId, activeTown })
  stateRef.current = { selectedId, hoveredId, activeTown }
  const applyStateRef = useRef<() => void>(() => {})
  const resetViewRef = useRef<() => void>(() => {})
  const handlersRef = useRef({ onSelect, onHover, onOpen, selectedId, hoveredId, activeTown })
  handlersRef.current = { onSelect, onHover, onOpen, selectedId, hoveredId, activeTown }
  const previousSelected = useRef<string | null>(null)
  const savedViewRef = useRef<{ center: L.LatLng; zoom: number } | null>(null)
  const [offline, setOffline] = useState(false)

  // 建图：只做一次
  useEffect(() => {
    const holder = holderRef.current
    if (!holder || mapRef.current) return
    const map = L.map(holder, {
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: false,
      minZoom: 8,
      maxZoom: 17,
      zoomSnap: 0.1,
      zoomDelta: 0.5,
      zoomAnimation: !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      fadeAnimation: !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    })
    mapRef.current = map
    L.control.attribution({ position: 'bottomright', prefix: false }).addTo(map)

    let tileErrors = 0
    L.tileLayer(SOURCE.url, SOURCE.options)
      .on('tileerror', () => {
        tileErrors += 1
        if (tileErrors >= 6) setOffline(true)
      })
      .on('tileload', () => {
        if (tileErrors > 0) {
          tileErrors = 0
          setOffline(false)
        }
      })
      .addTo(map)

    // 县域之外压一层纸色：让化州从周边市县里跳出来
    const bounds = boundsOf(COUNTY_RINGS)
    const pad = 2.5
    const outer: [number, number][] = [
      [bounds.getSouth() - pad, bounds.getWest() - pad],
      [bounds.getNorth() + pad, bounds.getWest() - pad],
      [bounds.getNorth() + pad, bounds.getEast() + pad],
      [bounds.getSouth() - pad, bounds.getEast() + pad],
    ]
    L.polygon([outer, ...COUNTY_RINGS] as L.LatLngExpression[][], {
      stroke: false,
      fillColor: '#f4ecdc',
      fillOpacity: 0.62,
      interactive: false,
      className: 'ent-map__veil',
    }).addTo(map)

    const boundary = L.geoJSON(boundaryRaw as unknown as GeoJsonObject, {
      style: () => ({ color: '#5b4436', weight: 1.3, opacity: 0.72, fill: true, fillColor: '#b3321f', fillOpacity: 0.04 }),
    }).addTo(map)

    let userMoved = false
    map.on('zoomstart', () => { userMoved = true })
    map.on('dragstart', () => { userMoved = true })
    const fit = () => map.fitBounds(boundary.getBounds(), { padding: [6, 6] })
    fit()
    resetViewRef.current = fit

    L.control.zoom({ position: 'topright' }).addTo(map)
    L.control.scale({ position: 'bottomleft', imperial: false, maxWidth: 120 }).addTo(map)

    map.on('click', () => map.scrollWheelZoom.enable())
    map.on('mouseout', () => map.scrollWheelZoom.disable())

    // 容器尺寸变了（比如列表改成独立滚动后左右分栏）：重算，用户没动过就重新贴合县界
    const observer = new ResizeObserver(() => {
      map.invalidateSize()
      if (!userMoved) fit()
    })
    observer.observe(holder)

    const layer = L.layerGroup().addTo(map)
    layerRef.current = layer

    return () => {
      observer.disconnect()
      map.remove()
      mapRef.current = null
      layerRef.current = null
      drawnRef.current = []
    }
  }, [])

  // 画点：随数据 / 缩放重建（低尺度只画镇街大点）
  useEffect(() => {
    const map = mapRef.current
    const layer = layerRef.current
    if (!map || !layer) return

    const draw = () => {
      layer.clearLayers()
      drawnRef.current = []
      const zoom = map.getZoom()
      const townMode = zoom < TOWN_ZOOM

      const nodes: MapNode[] = townMode
        ? (() => {
            const byTown = new Map<string, EnterpriseMapProps['items']>()
            for (const item of items) {
              const list = byTown.get(item.town) ?? []
              list.push(item)
              byTown.set(item.town, list)
            }
            return [...byTown.entries()].map(([townName, group]) => {
              const town = TOWNS.find((entry) => entry.name === townName)
              const center = town ? toLatLng(town.lng, town.lat) : toLatLng(group[0].lng, group[0].lat)
              return { pos: map.latLngToContainerPoint(L.latLng(center[0], center[1])), items: group }
            })
          })()
        : items.map((item) => {
            const point = toLatLng(item.lng, item.lat)
            return { pos: map.latLngToContainerPoint(L.latLng(point[0], point[1])), items: [item] }
          })

      // 任何尺度下都不让两块互相压住：中心距离小于 CLUSTER_PX 就合并，直到没有重叠
      const groups = mergeNodes(nodes, CLUSTER_PX)

      for (const group of groups) {
        const center = map.containerPointToLatLng(group.pos)
        const towns = [...new Set(group.items.map((item) => item.town))]
        const place = towns.length === 1 ? towns[0].replace(/(镇|街道)$/u, '') : ''

        if (!townMode && group.items.length === 1) {
          const item = group.items[0]
          const marker = L.marker(center, {
            icon: L.divIcon({ className: 'ent-marker', html: '<i></i>', iconSize: [44, 44], iconAnchor: [22, 22] }),
            keyboard: true,
            riseOnHover: true,
            title: item.name,
            alt: item.name,
          })
          marker.bindTooltip(
            '<strong>' + escapeHtml(item.name) + '</strong><em>' + escapeHtml(item.town) + ' · ' + escapeHtml(item.id) + '</em>',
            { className: 'ent-tip', direction: 'top', offset: [0, -14], opacity: 1 },
          )
          marker.on('click', () => {
            const open = handlersRef.current.onOpen
            if (open) open(item.id)
            else handlersRef.current.onSelect(item.id)
          })
          marker.on('mouseover', () => handlersRef.current.onHover(item.id))
          marker.on('mouseout', () => handlersRef.current.onHover(null))
          marker.addTo(layer)
          drawnRef.current.push({ marker, ids: [item.id], town: item.town, kind: 'single' })
        } else {
          const allSuburb = towns.every((name) => name.endsWith('街道'))
          const label = place || (towns.length > 1 && allSuburb ? '城区' : '')
          const tipTitle =
            towns.length === 1 ? towns[0] : allSuburb ? '城区一带' : '多个镇街'
          const marker = L.marker(center, {
            icon: L.divIcon({
              className: 'ent-cluster',
              html: '<i>' + group.items.length + '</i>' + (label ? '<b>' + escapeHtml(label) + '</b>' : ''),
              // 点按区 44×44，红点 28×28 居中；红点中心仍落在坐标上
              iconSize: [44, 44],
              iconAnchor: [22, 22],
            }),
            keyboard: true,
            title: (towns.length === 1 ? towns[0] + ' ' : '') + group.items.length + ' 家',
            alt: (towns.length === 1 ? towns[0] + ' ' : '') + group.items.length + ' 家',
          })
          marker.bindTooltip(
            '<strong>' + escapeHtml(tipTitle) + '</strong><em>' + group.items.length + ' 家</em>',
            { className: 'ent-tip', direction: 'top', offset: [0, -16], opacity: 1 },
          )
          marker.on('click', () => map.flyTo(center, Math.min(map.getZoom() + 1.6, 15), { duration: 0.6 }))
          marker.addTo(layer)
          drawnRef.current.push({ marker, ids: group.items.map((item) => item.id), town: towns[0], kind: 'group' })
        }
      }
    }
    const redraw = () => {
      draw()
      // 画完立刻把选中/悬停/筛选状态贴回去，否则飞行缩放后高亮会掉
      applyStateRef.current?.()
    }

    redraw()
    map.on('zoomend moveend', redraw)
    return () => {
      map.off('zoomend moveend', redraw)
    }
  }, [items])

  // 外观状态（选中 / 悬停 / 镇街筛选）：抽成函数，地图重画一遍之后要重新贴上去
  applyStateRef.current = () => {
    for (const drawn of drawnRef.current) {
      const element = drawn.marker.getElement()
      if (!element) continue
      const selected = selectedId !== null && drawn.ids.includes(selectedId)
      if (selected) element.dataset.selected = 'true'
      else delete element.dataset.selected
      if (hoveredId !== null && drawn.ids.includes(hoveredId)) element.dataset.hover = 'true'
      else delete element.dataset.hover
      if (activeTown !== null && drawn.town !== activeTown) element.dataset.dim = 'true'
      else delete element.dataset.dim
    }

    const previous = previousSelected.current
    if (previous !== null && previous !== selectedId) {
      const stale = drawnRef.current.find((drawn) => drawn.ids.includes(previous) && drawn.kind === 'single')
      const element = stale?.marker.getElement()
      if (element && hoveredId !== previous) stale?.marker.closeTooltip()
    }
    if (selectedId !== null) {
      const hit = drawnRef.current.find((drawn) => drawn.ids.includes(selectedId) && drawn.kind === 'single')
      hit?.marker.openTooltip()
    }
    previousSelected.current = selectedId
  }

  useEffect(() => {
    applyStateRef.current?.()
  }, [selectedId, hoveredId, activeTown, items])

  // 点开档案：飞到街道级特写；合上（focusId 变 null）时回到展开前的视野
  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    if (focusId) {
      const item = items.find((entry) => entry.id === focusId)
      if (!item) return
      if (!savedViewRef.current) savedViewRef.current = { center: map.getCenter(), zoom: map.getZoom() }
      map.flyTo(toLatLng(item.lng, item.lat), Math.max(map.getZoom(), FOCUS_ZOOM), { duration: 0.8 })
    } else if (savedViewRef.current) {
      const view = savedViewRef.current
      savedViewRef.current = null
      map.flyTo(view.center, view.zoom, { duration: 0.6 })
    }
  }, [focusId, items])

  const showAll = () => resetViewRef.current()

  return (
    <figure className="ent-map">
      <div className="ent-map__head">
        <span className="ent-map__title">企业分布</span>
        <div className="ent-map__tools">
          <span className="ent-map__count">
            {total !== undefined && total !== items.length ? `${items.length} 家 / 共 ${total} 家` : `${items.length} 家`}
          </span>
          <button type="button" className="ent-map__reset" onClick={showAll}>
            全图
          </button>
        </div>
      </div>

      <div className="ent-map__frame">
        <div className="ent-map__canvas">
          <div
            className="ent-map__leaflet"
            ref={holderRef}
            role="application"
            aria-label="化州市企业分布地图"
          />
          {items.length === 0 ? (
            <p className="ent-map__empty">这一筛选下没有企业。</p>
          ) : null}
          {offline ? <p className="ent-map__offline">底图未加载，点位按镇街显示。</p> : null}
        </div>
      </div>
    </figure>
  )
}