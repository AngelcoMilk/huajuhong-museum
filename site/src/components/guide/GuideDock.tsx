import { useCallback, useEffect, useRef, useState } from 'react'
import type { CSSProperties, PointerEvent as ReactPointerEvent } from 'react'
// 样式跟着组件走：接入任何页面都不用再单独 import
import './guide.css'
import { GuidePanel } from './GuidePanel'
import { useGuideChat } from './useGuideChat'
import type { UseGuideChatOptions } from './useGuideChat'
import type { GuidePageContext } from '../../lib/guideClient'

export interface GuideDockProps {
  /** 可选：当前页面上下文，交给后端做检索锚点 */
  page?: GuidePageContext
  /** 发送时才取的页面上下文（如最新购物车） */
  getPage?: UseGuideChatOptions['getPage']
  /** 仅 demo 用：首屏就展开面板（?open=1） */
  defaultOpen?: boolean
  /** 讲解员要求页面做动作时回调，返回的结果显示成卡片 */
  onAction?: UseGuideChatOptions['onAction']
  /** 对话和面板开合存进浏览器（站点用） */
  persist?: boolean
  /** 不显示但继续运行：登录页不要讲解员，对话和正在输出的回答不能断 */
  hidden?: boolean
  /** 当前登录账号；变了说明登录或退出过，旧卡片不能再撤销 */
  identity?: string | null
}

const OPEN_KEY = 'hj-guide-open'

function loadOpen(): boolean {
  try {
    return window.sessionStorage.getItem(OPEN_KEY) === '1'
  } catch {
    return false
  }
}

function saveOpen(open: boolean) {
  try {
    window.sessionStorage.setItem(OPEN_KEY, open ? '1' : '0')
  } catch {
    /* 隐私模式下忽略 */
  }
}

const STATUS_LABEL: Record<string, string> = {
  idle: '待机',
  thinking: '思考中',
  streaming: '输出中',
}

const POS_KEY = 'hj-guide-pos'
const BALL = 56
const GAP = 12
const DRAG_THRESHOLD = 5
/** 球本身距视口的最小距离（要比面板边距大，否则球贴边时面板就没地方了） */
const EDGE = 16

interface Position {
  x: number
  y: number
}

/**
 * 球的记录：贴哪两条边、离多远。
 * 窗口缩小时只夹显示位置、不改记录，放大回来才能回到原处。
 */
interface Anchor {
  right: boolean
  bottom: boolean
  dx: number
  dy: number
}

interface Layout {
  side: 'left' | 'right'
  vertical: 'up' | 'down'
  panelMax: number
}

function clampPosition(x: number, y: number): Position {
  const maxX = Math.max(EDGE, window.innerWidth - BALL - EDGE)
  const maxY = Math.max(EDGE, window.innerHeight - BALL - EDGE)
  return {
    x: Math.min(Math.max(EDGE, x), maxX),
    y: Math.min(Math.max(EDGE, y), maxY),
  }
}

function toAnchor(pos: Position, vw: number, vh: number): Anchor {
  const right = pos.x + BALL / 2 >= vw / 2
  const bottom = pos.y + BALL / 2 >= vh / 2
  return {
    right,
    bottom,
    dx: right ? vw - BALL - pos.x : pos.x,
    dy: bottom ? vh - BALL - pos.y : pos.y,
  }
}

function fromAnchor(anchor: Anchor, vw: number, vh: number): Position {
  return clampPosition(
    anchor.right ? vw - BALL - anchor.dx : anchor.dx,
    anchor.bottom ? vh - BALL - anchor.dy : anchor.dy,
  )
}

/** 面板距视口至少要留这么多，避免框贴着屏幕边 */
const PANEL_MARGIN = 14

/** 给定球的位置，推算面板会落在哪（与 CSS 的方位/缩高规则保持一致） */
function panelBox(pos: Position, vw: number, vh: number) {
  const side = pos.x + BALL / 2 < vw / 2 ? 'left' : 'right'
  const spaceUp = pos.y - GAP - EDGE
  const spaceDown = vh - (pos.y + BALL) - GAP - EDGE
  const vertical = spaceUp >= spaceDown ? 'up' : 'down'
  const panelMax = Math.min(560, Math.max(160, Math.max(spaceUp, spaceDown)))
  const panelW = Math.min(380, vw - 32)
  const left = side === 'left' ? pos.x : pos.x + BALL - panelW
  const top = vertical === 'up' ? pos.y - GAP - panelMax : pos.y + BALL + GAP
  return { left, top, right: left + panelW, bottom: top + panelMax }
}

/** 展开状态下，这个球位会不会让面板顶出视口 */
function panelFits(pos: Position, vw: number, vh: number): boolean {
  const box = panelBox(pos, vw, vh)
  return (
    box.left >= PANEL_MARGIN &&
    box.right <= vw - PANEL_MARGIN &&
    box.top >= PANEL_MARGIN &&
    box.bottom <= vh - PANEL_MARGIN
  )
}

function loadAnchor(): Anchor | null {
  try {
    const raw = window.localStorage.getItem(POS_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<Anchor & Position>
    if (typeof parsed.dx === 'number' && typeof parsed.dy === 'number') {
      return { right: parsed.right === true, bottom: parsed.bottom === true, dx: parsed.dx, dy: parsed.dy }
    }
    // 旧记录是距左上角的像素
    if (typeof parsed.x !== 'number' || typeof parsed.y !== 'number') return null
    return toAnchor(clampPosition(parsed.x, parsed.y), window.innerWidth, window.innerHeight)
  } catch {
    return null
  }
}

interface DragState {
  pointerId: number
  startX: number
  startY: number
  originX: number
  originY: number
  moved: boolean
  fromBall: boolean
}

/**
 * 可拖动的悬浮球 + 竖长对话面板。
 * 两个拖动入口：球本身，以及面板的头部/消息区空白处（像窗口标题栏）。
 * 面板拖动时整块 dock 一起移动，相对关系保持不变；拖动过程中冻结方位，
 * 否则高度会跟着可用空间来回抖。
 */
export function GuideDock({
  page,
  getPage,
  defaultOpen = false,
  onAction,
  persist = false,
  hidden = false,
  identity = null,
}: GuideDockProps) {
  const [open, setOpen] = useState(() => defaultOpen || (persist && loadOpen()))
  const [anchor, setAnchor] = useState<Anchor | null>(() =>
    typeof window === 'undefined' ? null : loadAnchor(),
  )
  const [dragging, setDragging] = useState(false)
  const [viewport, setViewport] = useState(() =>
    typeof window === 'undefined' ? { w: 1280, h: 800 } : { w: window.innerWidth, h: window.innerHeight },
  )
  const position = anchor ? fromAnchor(anchor, viewport.w, viewport.h) : null

  const chat = useGuideChat({ page, getPage, onAction, persist })
  const { refreshIfIdle, dropUndo } = chat
  const dockRef = useRef<HTMLDivElement | null>(null)
  const ballRef = useRef<HTMLButtonElement | null>(null)
  const dragRef = useRef<DragState | null>(null)
  const frozenLayoutRef = useRef<Layout | null>(null)
  const wasOpen = useRef(false)
  const openedByUser = useRef(defaultOpen)
  const identityRef = useRef(identity)

  const close = useCallback(() => setOpen(false), [])
  const toggle = useCallback(() => {
    openedByUser.current = true
    setOpen((value) => !value)
  }, [])

  useEffect(() => {
    if (wasOpen.current && !open) ballRef.current?.focus()
    wasOpen.current = open
    if (persist) saveOpen(open)
  }, [open, persist])

  // 展开面板、从登录页回来时检查半小时规则
  useEffect(() => {
    if (hidden) {
      openedByUser.current = false
      return
    }
    if (open) refreshIfIdle()
  }, [hidden, open, refreshIfIdle])

  useEffect(() => {
    if (identityRef.current === identity) return
    identityRef.current = identity
    dropUndo()
  }, [dropUndo, identity])

  useEffect(() => {
    const sync = () => setViewport({ w: window.innerWidth, h: window.innerHeight })
    sync()
    window.addEventListener('resize', sync)
    window.addEventListener('orientationchange', sync)
    return () => {
      window.removeEventListener('resize', sync)
      window.removeEventListener('orientationchange', sync)
    }
  }, [])

  useEffect(() => {
    if (!anchor || dragging) return
    try {
      window.localStorage.setItem(POS_KEY, JSON.stringify(anchor))
    } catch {
      /* 隐私模式下忽略 */
    }
  }, [anchor, dragging])

  // —— 布局：球靠哪边、面板朝哪边、面板最多多高 ——
  const side = position && position.x + BALL / 2 < viewport.w / 2 ? 'left' : 'right'
  const spaceUp = position ? position.y - GAP - EDGE : null
  const spaceDown = position ? viewport.h - (position.y + BALL) - GAP - EDGE : null
  const vertical = spaceUp !== null && spaceDown !== null ? (spaceUp >= spaceDown ? 'up' : 'down') : 'up'
  // 未拖动时用默认高度；拖动后按上下剩余空间收缩。
  // 注意不能返回 0，否则开始拖动就会把面板压扁（曾被冻进 frozenLayout）；
  // 也不能硬抬到 240，否则球贴边时面板仍会顶出视口。
  const panelMax =
    spaceUp !== null && spaceDown !== null
      ? Math.min(640, Math.max(160, Math.max(spaceUp, spaceDown)))
      : Math.min(640, viewport.h - 96)

  const frozen = frozenLayoutRef.current
  const appliedSide = frozen ? frozen.side : side
  const appliedVertical = frozen ? frozen.vertical : vertical
  const appliedPanelMax = frozen ? frozen.panelMax : panelMax

  const beginDrag = (
    event: ReactPointerEvent<HTMLElement>,
    origin: { x: number; y: number },
    fromBall: boolean,
  ) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    // 头部有「新会话 / 关闭」按钮，落在按钮上不开始拖动
    if (!fromBall && (event.target as HTMLElement).closest('button')) return
    frozenLayoutRef.current = { side: appliedSide, vertical: appliedVertical, panelMax: appliedPanelMax }
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: origin.x,
      originY: origin.y,
      moved: false,
      fromBall,
    }
    try {
      event.currentTarget.setPointerCapture(event.pointerId)
    } catch {
      /* 某些环境不支持捕获 */
    }
  }

  const moveDrag = (event: ReactPointerEvent<HTMLElement>) => {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return
    const dx = event.clientX - drag.startX
    const dy = event.clientY - drag.startY
    if (!drag.moved) {
      if (Math.hypot(dx, dy) < DRAG_THRESHOLD) return
      drag.moved = true
      setDragging(true)
    }

    const target = clampPosition(drag.originX + dx, drag.originY + dy)
    // 面板展开时按轴分别设限：某一轴碰到边界就只停这一轴，
    // 另一轴还能继续滑，避免整块直接卡死。
    let next = target
    if (open) {
      const base = position ?? { x: drag.originX, y: drag.originY }
      const { w, h } = viewport
      if (!panelFits({ x: target.x, y: base.y }, w, h)) next = { ...next, x: base.x }
      if (!panelFits({ x: next.x, y: target.y }, w, h)) next = { ...next, y: base.y }
    }
    setAnchor(toAnchor(next, viewport.w, viewport.h))
    event.preventDefault()
  }

  const endDrag = (event: ReactPointerEvent<HTMLElement>) => {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return
    dragRef.current = null
    frozenLayoutRef.current = null
    try {
      event.currentTarget.releasePointerCapture(event.pointerId)
    } catch {
      /* 已释放 */
    }
    setDragging(false)
    // 球上没拖动 = 点击开合；面板头上没拖动就什么都不做
    if (!drag.moved && drag.fromBall) toggle()
  }

  const ballDragStart = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    beginDrag(event, { x: rect.left, y: rect.top }, true)
  }

  const panelDragStart = (event: ReactPointerEvent<HTMLElement>) => {
    const rect = dockRef.current?.getBoundingClientRect()
    if (!rect) return
    beginDrag(event, { x: rect.left, y: rect.top }, false)
  }

  if (hidden) return null

  const status = chat.status
  const ariaLabel = open ? '收起橘红讲解员' : '打开橘红讲解员'

  const style = position
    ? ({
        left: `${position.x}px`,
        top: `${position.y}px`,
        right: 'auto',
        bottom: 'auto',
        '--hj-panel-max': `${appliedPanelMax}px`,
      } as CSSProperties)
    : undefined

  return (
    <div
      ref={dockRef}
      className="hj-guide-dock"
      data-status={status}
      data-dragging={dragging ? 'true' : 'false'}
      data-side={appliedSide}
      data-vertical={appliedVertical}
      data-moved={position ? 'true' : 'false'}
      style={style}
    >
      <button
        ref={ballRef}
        type="button"
        className={`hj-guide-ball hj-guide-ball--${status}`}
        aria-label={ariaLabel}
        aria-expanded={open}
        aria-controls="hj-guide-panel"
        aria-haspopup="dialog"
        title={`AI 讲解员 · ${STATUS_LABEL[status] ?? '待机'}`}
        onPointerDown={ballDragStart}
        onPointerMove={moveDrag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClick={(event) => {
          // 键盘触发时 detail 为 0；鼠标/触摸已在 pointerup 里处理
          if (event.detail === 0) toggle()
        }}
      >
        <span className="hj-guide-ball__ring" aria-hidden="true" />
        <span className="hj-guide-ball__mark" aria-hidden="true">
          橘
        </span>
        <span className="hj-guide-ball__dot" aria-hidden="true" />
      </button>
      {open ? (
        <GuidePanel
          chat={chat}
          onClose={close}
          autoFocus={openedByUser.current}
          dragHandlers={{
            onPointerDown: panelDragStart,
            onPointerMove: moveDrag,
            onPointerUp: endDrag,
            onPointerCancel: endDrag,
          }}
        />
      ) : null}
    </div>
  )
}
