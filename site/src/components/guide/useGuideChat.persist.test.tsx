import { act, renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { GUIDE_CHAT_KEY, GUIDE_IDLE_MS, resetGuideChat } from './guideStore'
import { useGuideChat } from './useGuideChat'
import type { GuideFetch } from '../../lib/guideClient'

const encoder = new TextEncoder()

function sse(body: string): Response {
  return new Response(
    new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(body))
        controller.close()
      },
    }),
    { status: 200, headers: { 'content-type': 'text/event-stream' } },
  )
}

const DONE = 'event: token\ndata: {"text":"好的。"}\n\nevent: done\ndata: {"sessionId":"s","finishReason":"stop"}\n\n'

function message(id: string, role: 'user' | 'assistant', text: string, extra: object = {}) {
  return { id, role, text, citations: [], actions: [], suggestions: [], state: 'done', ...extra }
}

function seed(lastActiveAt: number, messages: unknown[], sessionId = 'old-session') {
  window.localStorage.setItem(GUIDE_CHAT_KEY, JSON.stringify({ sessionId, lastActiveAt, messages }))
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } })
}

function fakeFetch() {
  const bodies: { sessionId: string; message: string }[] = []
  const fetchImpl = vi.fn(async (url: string, init?: RequestInit) => {
    if (url.endsWith('/api/agent/session')) return json({ sessionId: 'issued-1' })
    if (init?.body) bodies.push(JSON.parse(String(init.body)))
    return sse(DONE)
  })
  return { fetchImpl: fetchImpl as unknown as GuideFetch, bodies }
}

describe('讲解员对话的保留', () => {
  beforeEach(() => {
    window.localStorage.clear()
    window.sessionStorage.clear()
  })
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('半小时内重新进入：记录和会话都接着，动作不重新执行，也不能再撤销', () => {
    const onAction = vi.fn()
    seed(Date.now() - GUIDE_IDLE_MS + 60_000, [
      message('u1', 'user', '加一件'),
      message('a1', 'assistant', '好的', {
        state: 'streaming',
        actions: [
          { id: 'c1', type: 'cart_add', state: 'ok', text: '已加入购物车', canUndo: true },
          { id: 'c2', type: 'goto_checkout', state: 'running', text: '处理中…', canUndo: false },
        ],
      }),
    ])

    const { result } = renderHook(() => useGuideChat({ persist: true, onAction }))

    expect(result.current.sessionId).toBe('old-session')
    expect(result.current.messages).toHaveLength(2)
    const assistant = result.current.messages[1]
    expect(assistant.state).toBe('stopped')
    expect(assistant.actions[0]).toMatchObject({ state: 'ok', canUndo: false })
    expect(assistant.actions[1]).toMatchObject({ state: 'failed', canUndo: false })
    expect(onAction).not.toHaveBeenCalled()
  })

  it('刷新掐断请求留下的网络错误算被打断；服务端报的错照常显示', () => {
    seed(Date.now() - 1000, [
      message('a1', 'assistant', '先', { state: 'error', error: { code: 'network_error', message: 'x' } }),
      message('a2', 'assistant', '', { state: 'error', error: { code: 'rate_limited', message: '太快了' } }),
    ])

    const { result } = renderHook(() => useGuideChat({ persist: true }))

    expect(result.current.messages[0]).toMatchObject({ state: 'stopped', text: '先' })
    expect(result.current.messages[0].error).toBeUndefined()
    expect(result.current.messages[1]).toMatchObject({ state: 'error', error: { code: 'rate_limited' } })
  })

  it('超过半小时再进入：清空记录，换新会话', () => {
    seed(Date.now() - GUIDE_IDLE_MS - 1, [message('u1', 'user', '旧问题')])

    const { result } = renderHook(() => useGuideChat({ persist: true }))

    expect(result.current.messages).toHaveLength(0)
    expect(result.current.sessionId).not.toBe('old-session')
    expect(window.localStorage.getItem(GUIDE_CHAT_KEY)).toBeNull()
  })

  it('内容坏了不报错，当没有记录', () => {
    window.localStorage.setItem(GUIDE_CHAT_KEY, '{不是 JSON')
    const { result } = renderHook(() => useGuideChat({ persist: true }))
    expect(result.current.messages).toHaveLength(0)
    expect(window.localStorage.getItem(GUIDE_CHAT_KEY)).toBeNull()
  })

  it('停在页面上超过半小时：记录不自己消失，下一句才换新会话', async () => {
    const start = Date.now()
    seed(start - 1000, [message('u1', 'user', '旧问题')])
    const { fetchImpl, bodies } = fakeFetch()
    const { result } = renderHook(() => useGuideChat({ persist: true, fetchImpl, baseUrl: 'http://guide.test' }))
    expect(result.current.messages).toHaveLength(1)

    const later = start + GUIDE_IDLE_MS + 5000
    vi.spyOn(Date, 'now').mockReturnValue(later)
    expect(result.current.messages).toHaveLength(1)

    await act(async () => {
      await result.current.send('新问题')
    })

    const chat = bodies.find((body) => body.message === '新问题')
    expect(chat?.sessionId).toBeTruthy()
    expect(chat?.sessionId).not.toBe('old-session')
    expect(result.current.messages.map((item) => item.text)).toEqual(['新问题', '好的。'])
  })

  it('半小时内发消息还是原来的会话，结束后写进浏览器', async () => {
    seed(Date.now() - 1000, [message('u1', 'user', '旧问题')])
    const { fetchImpl, bodies } = fakeFetch()
    const { result } = renderHook(() => useGuideChat({ persist: true, fetchImpl, baseUrl: 'http://guide.test' }))

    await act(async () => {
      await result.current.send('接着问')
    })

    expect(bodies[0].sessionId).toBe('old-session')
    await waitFor(() => {
      const saved = JSON.parse(window.localStorage.getItem(GUIDE_CHAT_KEY) ?? '{}')
      expect(saved.messages?.map((item: { text: string }) => item.text)).toEqual(['旧问题', '接着问', '好的。'])
    })
  })

  it('退出登录：记录清空，换新会话', async () => {
    seed(Date.now() - 1000, [message('u1', 'user', '旧问题')])
    const { fetchImpl } = fakeFetch()
    const { result } = renderHook(() => useGuideChat({ persist: true, fetchImpl, baseUrl: 'http://guide.test' }))

    await act(async () => {
      resetGuideChat()
    })

    expect(result.current.messages).toHaveLength(0)
    expect(result.current.sessionId).not.toBe('old-session')
    expect(window.localStorage.getItem(GUIDE_CHAT_KEY)).toBeNull()
  })

  it('第一次提问才向服务端要会话 id，之后一直沿用', async () => {
    const { fetchImpl, bodies } = fakeFetch()
    const { result } = renderHook(() => useGuideChat({ persist: true, fetchImpl, baseUrl: 'http://guide.test' }))
    expect(fetchImpl).not.toHaveBeenCalled()
    expect(result.current.sessionId).toBe('')

    await act(async () => {
      await result.current.send('第一句')
    })
    await act(async () => {
      await result.current.send('第二句')
    })

    const issued = vi.mocked(fetchImpl).mock.calls.filter(([url]) => url.endsWith('/api/agent/session'))
    expect(issued).toHaveLength(1)
    expect(bodies.map((body) => body.sessionId)).toEqual(['issued-1', 'issued-1'])
    expect(result.current.sessionId).toBe('issued-1')
  })

  it('会话过期或是旧版的 id：换一个重发这一句，访客看不到错误', async () => {
    seed(Date.now() - 1000, [message('u1', 'user', '旧问题')], 'old-unsigned-id')
    const sent: string[] = []
    const fetchImpl = (async (url: string, init?: RequestInit) => {
      if (url.endsWith('/api/agent/session')) return json({ sessionId: 'issued-2' })
      const body = JSON.parse(String(init?.body))
      sent.push(body.sessionId)
      return body.sessionId === 'old-unsigned-id'
        ? json({ code: 'guide_session_invalid', message: '对话已过期，请重新提问。' }, 401)
        : sse(DONE)
    }) as GuideFetch
    const { result } = renderHook(() => useGuideChat({ persist: true, fetchImpl, baseUrl: 'http://guide.test' }))

    await act(async () => {
      await result.current.send('新问题')
    })

    expect(sent).toEqual(['old-unsigned-id', 'issued-2'])
    expect(result.current.error).toBeNull()
    expect(result.current.messages.at(-1)?.text).toBe('好的。')
  })

  it('换了 id 还是被拒：只重发一次，显示错误', async () => {
    let chats = 0
    const fetchImpl = (async (url: string) => {
      if (url.endsWith('/api/agent/session')) return json({ sessionId: 'issued-3' })
      chats += 1
      return json({ code: 'guide_session_invalid', message: '对话已过期，请重新提问。' }, 401)
    }) as GuideFetch
    const { result } = renderHook(() => useGuideChat({ persist: true, fetchImpl, baseUrl: 'http://guide.test' }))

    await act(async () => {
      await result.current.send('你好')
    })

    expect(chats).toBe(2)
    expect(result.current.error?.message).toBe('对话已过期，请重新提问。')
  })

  it('被限流：显示服务端的文案，不重发', async () => {
    let chats = 0
    const fetchImpl = (async (url: string) => {
      if (url.endsWith('/api/agent/session')) return json({ sessionId: 'issued-4' })
      chats += 1
      return json({ code: 'guide_rate_limited', message: '提问有点频繁，请过一会儿再问。', retryAfter: 60 }, 429)
    }) as GuideFetch
    const { result } = renderHook(() => useGuideChat({ persist: true, fetchImpl, baseUrl: 'http://guide.test' }))

    await act(async () => {
      await result.current.send('你好')
    })

    expect(chats).toBe(1)
    expect(result.current.error).toEqual({ code: 'guide_rate_limited', message: '提问有点频繁，请过一会儿再问。' })
  })

  it('要会话 id 时就被挡住：显示服务端的文案', async () => {
    const fetchImpl = (async () =>
      json({ code: 'guide_disabled', message: '讲解员暂时停用，请稍后再来。' }, 403)) as GuideFetch
    const { result } = renderHook(() => useGuideChat({ persist: true, fetchImpl, baseUrl: 'http://guide.test' }))

    await act(async () => {
      await result.current.send('你好')
    })

    expect(result.current.error?.code).toBe('guide_disabled')
    expect(result.current.sessionId).toBe('')
  })

  it('登录后旧卡片不能再撤销', async () => {
    const undo = vi.fn(async () => '已撤销')
    const { fetchImpl } = fakeFetch()
    const body =
      'event: action\ndata: {"type":"cart_add","payload":{"skuId":"s1","qty":1}}\n\n' +
      'event: done\ndata: {"sessionId":"s","finishReason":"stop"}\n\n'
    const { result } = renderHook(() =>
      useGuideChat({
        persist: true,
        baseUrl: 'http://guide.test',
        fetchImpl: (async (url: string, init?: RequestInit) =>
          url.endsWith('/api/agent/chat') ? sse(body) : fetchImpl(url, init)) as GuideFetch,
        onAction: async () => ({ ok: true, text: '已加入购物车', undo }),
      }),
    )

    await act(async () => {
      await result.current.send('加一件')
    })
    await waitFor(() => expect(result.current.messages[1].actions[0]?.canUndo).toBe(true))

    act(() => result.current.dropUndo())

    const card = result.current.messages[1].actions[0]
    expect(card.canUndo).toBe(false)
    act(() => result.current.undoAction(result.current.messages[1].id, card.id))
    expect(undo).not.toHaveBeenCalled()
  })

  it('不开 persist（后台测试场、demo）：什么都不写', async () => {
    const { fetchImpl } = fakeFetch()
    const { result } = renderHook(() => useGuideChat({ fetchImpl, baseUrl: 'http://guide.test' }))
    await act(async () => {
      await result.current.send('你好')
    })
    await new Promise((resolve) => setTimeout(resolve, 350))
    expect(window.localStorage.getItem(GUIDE_CHAT_KEY)).toBeNull()
  })
})
