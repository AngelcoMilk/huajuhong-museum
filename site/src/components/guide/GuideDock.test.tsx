import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { GuideDock } from './GuideDock'

describe('GuideDock', () => {
  it('默认收起：悬浮球有 aria-label 与 aria-expanded=false', () => {
    render(<GuideDock />)

    const ball = screen.getByRole('button', { name: '打开橘红讲解员' })
    expect(ball).toHaveAttribute('aria-expanded', 'false')
    expect(ball).toHaveAttribute('aria-controls', 'hj-guide-panel')
    expect(ball).toHaveAttribute('aria-haspopup', 'dialog')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('点击悬浮球打开面板，焦点进输入框', () => {
    render(<GuideDock />)

    fireEvent.click(screen.getByRole('button', { name: '打开橘红讲解员' }))

    expect(screen.getByRole('dialog', { name: '橘红讲解员' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '收起橘红讲解员' })).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByLabelText('向讲解员提问')).toHaveFocus()
  })

  it('再次点击关闭面板，aria-expanded 回到 false', () => {
    render(<GuideDock />)

    fireEvent.click(screen.getByRole('button', { name: '打开橘红讲解员' }))
    fireEvent.click(screen.getByRole('button', { name: '收起橘红讲解员' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: '打开橘红讲解员' })).toHaveAttribute('aria-expanded', 'false')
  })

  it('面板内按 Esc 关闭', () => {
    render(<GuideDock />)

    fireEvent.click(screen.getByRole('button', { name: '打开橘红讲解员' }))
    fireEvent.keyDown(document, { key: 'Escape' })

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: '打开橘红讲解员' })).toHaveAttribute('aria-expanded', 'false')
  })
})

describe('窗口缩放时球的位置', () => {
  const POS_KEY = 'hj-guide-pos'
  const initial = { w: window.innerWidth, h: window.innerHeight }

  function setViewport(w: number, h: number) {
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: w })
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: h })
  }

  function resize(w: number, h: number) {
    act(() => {
      setViewport(w, h)
      window.dispatchEvent(new Event('resize'))
    })
  }

  function renderDock() {
    const { container } = render(<GuideDock />)
    return container.querySelector<HTMLElement>('.hj-guide-dock')!
  }

  afterEach(() => {
    setViewport(initial.w, initial.h)
    window.localStorage.clear()
  })

  it('缩小后夹在窗口内，恢复后回到原处，记录不变', () => {
    setViewport(1280, 800)
    window.localStorage.setItem(POS_KEY, JSON.stringify({ right: true, bottom: true, dx: 74, dy: 244 }))
    const dock = renderDock()
    expect(dock.style.left).toBe('1150px')
    expect(dock.style.top).toBe('500px')

    resize(300, 200)
    expect(dock.style.left).toBe('170px')
    expect(dock.style.top).toBe('16px')

    resize(1280, 800)
    expect(dock.style.left).toBe('1150px')
    expect(dock.style.top).toBe('500px')
    expect(JSON.parse(window.localStorage.getItem(POS_KEY)!)).toEqual({ right: true, bottom: true, dx: 74, dy: 244 })
  })

  it('旧格式的记录能接上：放大窗口时离右下的距离不变', () => {
    setViewport(1280, 800)
    window.localStorage.setItem(POS_KEY, JSON.stringify({ x: 1150, y: 500 }))
    const dock = renderDock()
    expect(dock.style.left).toBe('1150px')

    resize(1600, 1000)
    expect(dock.style.left).toBe('1470px')
    expect(dock.style.top).toBe('700px')
  })

  it('没拖过的球不写记录，走样式表的默认位置', () => {
    const dock = renderDock()
    resize(500, 700)
    expect(dock.style.left).toBe('')
    expect(window.localStorage.getItem(POS_KEY)).toBeNull()
  })
})
