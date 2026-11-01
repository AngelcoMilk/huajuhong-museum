// 园区、博物馆、史料、VR 的内容层。
// 接口成功就完全按接口显示，包括增、删、排序和空数组；失败、超时、结构不对才用 data/ 里的 JSON。
import { useEffect, useSyncExternalStore } from 'react'
import { ARCHIVE } from '../data/home'
import { MUSEUM_ARTICLES, MUSEUM_SCENE_GROUPS } from '../data/museum'
import { PARK_ADVANTAGES, PARK_SCENE_GROUPS, PARK_SECTIONS } from '../data/park'
import { safeSrc } from './safeSrc'
import type { Block, MediaImage, Stat, TextBlock, VrGroup, VrScene } from '../types/hall'

export type ContentItem = {
  id: string
  title: string
  subtitle: string
  section: string
  date: string
  summary: string
  author: string
  sourceName: string
  coverUrl: string
  parentId: string
  blocks: Array<Block | TextBlock>
  /** 只有回落内容才有：正文块之外的插图 */
  images?: MediaImage[]
  /** 正文和上级栏目完全相同 */
  sameAsParent?: boolean
  /** 只有回落内容才有：官网镜像只抓到节选 */
  truncated?: boolean
}

export type ParkColumn = ContentItem & { children: ContentItem[] }
export type PageHead = { title: string; intro: string; heroImage: string; stats: Stat[] }
export type HallPage<T> = { items: T[]; head: PageHead | null }

export type VrPage = 'park' | 'museum'
export type VrGroupView = {
  id: string
  page: string
  name: string
  layout: 'grid' | 'feature'
  scenes: VrScene[]
}

export type HistoryRow = Pick<ContentItem, 'id' | 'title' | 'subtitle' | 'section' | 'date' | 'summary' | 'coverUrl'>
export type HistorySection = { name: string; count: number }
export type HistoryList = { rows: HistoryRow[]; sections: HistorySection[]; head: PageHead | null }

const REQUEST_TIMEOUT = 8000

type Fetched = { ok: true; status: number; data: unknown } | { ok: false; status: number }

async function getJson(url: string): Promise<Fetched> {
  const controller = new AbortController()
  const timer = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT)
  try {
    const response = await fetch(url, { signal: controller.signal, cache: 'no-store' })
    if (!response.ok) return { ok: false, status: response.status }
    return { ok: true, status: response.status, data: await response.json() }
  } catch {
    return { ok: false, status: 0 }
  } finally {
    window.clearTimeout(timer)
  }
}

function text(value: unknown): string {
  if (typeof value === 'string') return value
  return typeof value === 'number' ? String(value) : ''
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function hasIdTitle(value: unknown): value is Record<string, unknown> {
  return isRecord(value) && typeof value.id === 'string' && value.id !== '' && typeof value.title === 'string'
}

/** 介绍是原文截取，停在逗号这类标点上时换成省略号，看得出后面还有 */
function summaryOf(value: unknown): string {
  return text(value).trim().replace(/[，,、；;：:]+$/, '……')
}

/** 日期只留年月日（原文带时分） */
export function dayOf(date: string): string {
  return /^\d{4}-\d{2}-\d{2}/.exec(date)?.[0] ?? date
}

/** blocks 键缺失算结构不对（旧接口没有这一项），null 算空正文 */
function toItem(raw: unknown): ContentItem | null {
  if (!hasIdTitle(raw) || !('blocks' in raw)) return null
  if (raw.blocks !== null && !Array.isArray(raw.blocks)) return null
  return {
    id: raw.id as string,
    title: raw.title as string,
    subtitle: text(raw.subtitle),
    section: text(raw.section),
    date: text(raw.date),
    summary: summaryOf(raw.summary),
    author: text(raw.author),
    sourceName: text(raw.sourceName),
    coverUrl: safeSrc(raw.coverUrl),
    parentId: text(raw.parentId),
    blocks: (raw.blocks ?? []) as Block[],
  }
}

/** 有一条结构不对就整份不用 */
function toItems(payload: unknown): ContentItem[] | null {
  if (!Array.isArray(payload)) return null
  const items = payload.map(toItem)
  return items.every((item): item is ContentItem => item !== null) ? items : null
}

function toHead(payload: unknown): PageHead | null {
  if (!isRecord(payload) || typeof payload.title !== 'string') return null
  const stats = Array.isArray(payload.stats) ? payload.stats.filter(isRecord) : []
  return {
    title: payload.title,
    intro: text(payload.intro),
    heroImage: safeSrc(payload.heroImage),
    stats: stats.map((stat) => ({ value: text(stat.value), unit: text(stat.unit), label: text(stat.label) })),
  }
}

function plainOf(blocks: Array<Block | TextBlock>): string {
  return blocks
    .map((block) => ('text' in block ? (block.text ?? '') : ''))
    .join('')
    .replace(/\s+/g, '')
}

/** 栏目树：没有上级或上级不在本板块的是栏目；多层子文章都挂到最上层栏目，成环的各自算栏目 */
export function toColumns(items: ContentItem[]): ParkColumn[] {
  const byId = new Map(items.map((item) => [item.id, item]))
  const rootOf = (item: ContentItem) => {
    const seen = new Set([item.id])
    let current = item
    while (current.parentId && byId.has(current.parentId)) {
      if (seen.has(current.parentId)) return item
      seen.add(current.parentId)
      current = byId.get(current.parentId) as ContentItem
    }
    return current
  }
  const columns = new Map<string, ParkColumn>()
  for (const item of items) if (rootOf(item) === item) columns.set(item.id, { ...item, children: [] })
  for (const item of items) {
    const root = rootOf(item)
    if (root === item) continue
    const column = columns.get(root.id) as ParkColumn
    const sameAsParent = plainOf(item.blocks) !== '' && plainOf(item.blocks) === plainOf(column.blocks)
    column.children.push({ ...item, sameAsParent })
  }
  return Array.from(columns.values())
}

/** 回落内容没有 summary：取第一段真正的正文，短标题不算；在标点处收口，只截取不改写 */
function excerptOf(blocks: Array<Block | TextBlock>, max = 80): string {
  const first = blocks
    .filter((block) => block.kind === 'p')
    .map((block) => (('text' in block ? block.text : '') ?? '').replace(/\s+/g, ' ').trim())
    .find((value) => value.length > 24 || /[。！？；]$/.test(value))
  if (!first) return ''
  if (first.length <= max) return first
  const cut = first.slice(0, max)
  const stop = Math.max(cut.lastIndexOf('。'), cut.lastIndexOf('；'), cut.lastIndexOf('，'), cut.lastIndexOf('、'))
  const head = (stop >= max * 0.55 ? cut.slice(0, stop) : cut).replace(/[，,、；;：:。]+$/, '')
  return head + '……'
}

function parkFallback(): ParkColumn[] {
  const toFallback = (section: (typeof PARK_SECTIONS)[number]): ContentItem => ({
    id: section.id,
    title: section.title,
    subtitle: '',
    section: section.sub,
    date: '',
    summary: excerptOf(section.blocks),
    author: '',
    sourceName: '',
    coverUrl: '',
    parentId: '',
    blocks: section.blocks,
    images: section.images,
    sameAsParent: Boolean(section.duplicateOf),
  })
  const advantageId = PARK_SECTIONS.find((section) => section.title.includes('优势'))?.id
  return PARK_SECTIONS.map((section) => ({
    ...toFallback(section),
    children: section.id === advantageId ? PARK_ADVANTAGES.map(toFallback) : [],
  }))
}

function museumFallback(): ContentItem[] {
  return MUSEUM_ARTICLES.map((article) => ({
    id: article.id,
    title: article.title,
    subtitle: article.sub,
    section: article.sub,
    date: article.date,
    summary: excerptOf([{ kind: 'p', text: article.text }]),
    author: '',
    sourceName: '',
    coverUrl: '',
    parentId: '',
    blocks: article.blocks,
    truncated: article.truncated,
  }))
}

function vrFallback(): VrGroupView[] {
  const pick = (page: VrPage, groups: VrGroup[]) =>
    groups.map((group) => ({
      id: page + '-' + group.key,
      page,
      name: group.name,
      layout: 'grid' as const,
      scenes: group.scenes.map((scene) => ({ ...scene, group: group.name })),
    }))
  return [...pick('park', PARK_SCENE_GROUPS), ...pick('museum', MUSEUM_SCENE_GROUPS)]
}

function toScene(raw: unknown, groupName: string): VrScene | null {
  if (!hasIdTitle(raw)) return null
  const sceneId = text(raw.sceneId)
  const iframe = text(raw.iframe)
  return {
    id: raw.id as string,
    title: raw.title as string,
    gid: text(raw.gid),
    sceneId,
    slices: typeof raw.slices === 'number' ? raw.slices : 0,
    thumb: safeSrc(raw.thumb),
    preview: text(raw.preview),
    // 只嵌 https，其他协议（javascript: 之类）一律当没有地址
    panoUrl: /^https:\/\//i.test(iframe.trim()) ? iframe.trim() : '',
    thumbLocal: safeSrc(raw.thumb) || (sceneId ? '/img/vr/' + sceneId + '.jpg' : ''),
    group: groupName,
    featured: raw.featured === true,
    description: text(raw.description),
  }
}

function toVrGroups(payload: unknown): VrGroupView[] | null {
  if (!isRecord(payload) || !Array.isArray(payload.groups)) return null
  const groups: VrGroupView[] = []
  for (const raw of payload.groups) {
    if (!isRecord(raw) || typeof raw.name !== 'string' || !Array.isArray(raw.scenes)) return null
    const scenes = raw.scenes.map((scene) => toScene(scene, raw.name as string))
    if (!scenes.every((scene): scene is VrScene => scene !== null)) return null
    groups.push({
      id: text(raw.id) || raw.name,
      page: text(raw.page),
      name: raw.name,
      layout: raw.layout === 'feature' ? 'feature' : 'grid',
      scenes,
    })
  }
  // 没分组的已发布场景：接在所属页面最后一个分组后面，后台新建了不至于前台看不到
  for (const [page, column] of [['park', '园区'], ['museum', '博物馆']]) {
    const raw = Array.isArray(payload.ungrouped) ? payload.ungrouped : []
    const name = '其他场景'
    const scenes = raw
      .filter((scene) => isRecord(scene) && scene.group === column)
      .map((scene) => toScene(scene, name))
      .filter((scene): scene is VrScene => scene !== null)
    if (scenes.length === 0) continue
    const last = groups.map((group) => group.page).lastIndexOf(page)
    const at = last >= 0 ? last + 1 : page === 'park' ? 0 : groups.length
    groups.splice(at, 0, { id: 'ungrouped-' + page, page, name, layout: 'grid', scenes })
  }
  return groups
}

function toSections(payload: unknown): HistorySection[] | null {
  if (!Array.isArray(payload)) return null
  const valid = payload.every((row) => isRecord(row) && typeof row.name === 'string' && Number.isFinite(row.count))
  return valid ? (payload as HistorySection[]) : null
}

function toHistoryRows(payload: unknown): HistoryRow[] | null {
  if (!Array.isArray(payload) || !payload.every(hasIdTitle)) return null
  return payload.map((raw) => ({
    id: raw.id as string,
    title: raw.title as string,
    subtitle: text(raw.subtitle),
    section: text(raw.section),
    date: text(raw.date),
    summary: summaryOf(raw.summary),
    coverUrl: safeSrc(raw.coverUrl),
  }))
}

/** 一份内容的共享状态：先用回落内容，接口回来再换。之后的失败不会把已拿到的接口内容换回去 */
function createSlot<T>(initial: T, fetcher: (current: T) => Promise<T | null>) {
  let data = initial
  let inflight: Promise<void> | null = null
  let loadedAt = 0
  const listeners = new Set<() => void>()

  return {
    get: () => data,
    subscribe(listener: () => void) {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
    load(): Promise<void> {
      if (inflight) return inflight
      if (Date.now() - loadedAt < 3000) return Promise.resolve()
      inflight = fetcher(data)
        .then((next) => {
          loadedAt = Date.now()
          if (next === null || JSON.stringify(next) === JSON.stringify(data)) return
          data = next
          listeners.forEach((listener) => listener())
        })
        .finally(() => {
          inflight = null
        })
      return inflight
    },
  }
}

type Slot<T> = ReturnType<typeof createSlot<T>>

function useSlot<T>(slot: Slot<T>): T {
  useEffect(() => {
    void slot.load()
  }, [slot])
  return useSyncExternalStore(slot.subscribe, slot.get)
}

async function fetchHead(board: string): Promise<{ ok: boolean; head: PageHead | null }> {
  const result = await getJson('/api/content/page/' + board)
  if (!result.ok) return { ok: false, head: null }
  return { ok: true, head: toHead(result.data) }
}

const parkSlot = createSlot<HallPage<ParkColumn>>({ items: parkFallback(), head: null }, async (current) => {
  const [board, page] = await Promise.all([getJson('/api/content/board/park'), fetchHead('park')])
  const items = board.ok ? toItems(board.data) : null
  return { items: items ? toColumns(items) : current.items, head: page.ok ? page.head : current.head }
})

const museumSlot = createSlot<HallPage<ContentItem>>({ items: museumFallback(), head: null }, async (current) => {
  const [board, page] = await Promise.all([getJson('/api/content/board/museum'), fetchHead('museum')])
  const items = board.ok ? toItems(board.data) : null
  return { items: items ?? current.items, head: page.ok ? page.head : current.head }
})

const vrSlot = createSlot<VrGroupView[]>(vrFallback(), async () => {
  const result = await getJson('/api/content/vr')
  return result.ok ? toVrGroups(result.data) : null
})

const sectionsSlot = createSlot<HistorySection[]>(ARCHIVE, async () => {
  const result = await getJson('/api/content/history/sections')
  return result.ok ? toSections(result.data) : null
})

export const useParkContent = () => useSlot(parkSlot)
export const useMuseumContent = () => useSlot(museumSlot)
export const useVrGroups = () => useSlot(vrSlot)
export const useHistorySections = () => useSlot(sectionsSlot)

/** 首屏前调用，三份内容一起取；调用方自己决定最多等多久 */
export function loadHallContent(): Promise<unknown> {
  return Promise.all([parkSlot.load(), museumSlot.load(), vrSlot.load()])
}

// —— 史料：没有写死的回落内容，取不到就显示打不开 ——

export type HistoryState = { list: HistoryList | null; failed: boolean }

let historyState: HistoryState = { list: null, failed: false }
let historyInflight: Promise<void> | null = null
const historyListeners = new Set<() => void>()

function setHistoryState(next: HistoryState) {
  historyState = next
  historyListeners.forEach((listener) => listener())
}

export function loadHistoryList(): Promise<void> {
  if (historyInflight) return historyInflight
  if (historyState.failed) setHistoryState({ list: null, failed: false })
  historyInflight = (async () => {
    const [board, sections, page] = await Promise.all([
      getJson('/api/content/board/history'),
      getJson('/api/content/history/sections'),
      fetchHead('history'),
    ])
    const rows = board.ok ? toHistoryRows(board.data) : null
    if (!rows) {
      // 已经拿到过列表就继续显示，只有第一次取不到才算打不开
      if (!historyState.list) setHistoryState({ list: null, failed: true })
      return
    }
    const counted = new Map<string, number>()
    for (const row of rows) if (row.section) counted.set(row.section, (counted.get(row.section) ?? 0) + 1)
    const next: HistoryList = {
      rows,
      sections:
        (sections.ok ? toSections(sections.data) : null) ??
        Array.from(counted, ([name, count]) => ({ name, count })),
      head: page.ok ? page.head : (historyState.list?.head ?? null),
    }
    if (JSON.stringify(next) !== JSON.stringify(historyState.list)) setHistoryState({ list: next, failed: false })
  })().finally(() => {
    historyInflight = null
  })
  return historyInflight
}

export function useHistoryList(): HistoryState & { reload: () => void } {
  useEffect(() => {
    void loadHistoryList()
  }, [])
  const state = useSyncExternalStore(
    (listener) => {
      historyListeners.add(listener)
      return () => {
        historyListeners.delete(listener)
      }
    },
    () => historyState,
  )
  return { ...state, reload: () => void loadHistoryList() }
}

export type ItemResult = { state: 'ok'; item: ContentItem } | { state: 'missing' } | { state: 'failed' }

export async function fetchContentItem(id: string): Promise<ItemResult> {
  const result = await getJson('/api/content/item/' + encodeURIComponent(id))
  if (!result.ok) return result.status === 404 ? { state: 'missing' } : { state: 'failed' }
  const item = toItem(result.data)
  return item ? { state: 'ok', item } : { state: 'failed' }
}
