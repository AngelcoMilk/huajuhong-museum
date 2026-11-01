import { describe, expect, it, vi } from 'vitest'
import { GuideHttpError, resetSession, streamChat } from './guideClient'
import type { GuideFetch, GuideServerEvent } from './guideClient'

const BASE = 'http://guide.test'
const CHAT_URL = BASE + '/api/agent/chat'
const encoder = new TextEncoder()

function streamResponse(chunks: string[]): Response {
  const queue = chunks.map((chunk) => encoder.encode(chunk))
  let index = 0
  return {
    ok: true,
    status: 200,
    body: {
      getReader() {
        return {
          read: async () => {
            if (index < queue.length) {
              const value = queue[index]
              index += 1
              return { done: false, value }
            }
            return { done: true, value: undefined }
          },
          releaseLock() {},
        }
      },
    },
  } as unknown as Response
}

function statusResponse(status: number): Response {
  return { ok: status >= 200 && status < 300, status, body: null } as unknown as Response
}

function makeFetch(response: Response) {
  const fetchMock = vi.fn(async (_url: string, _init?: RequestInit) => response)
  return { fetchMock, fetchImpl: fetchMock as unknown as GuideFetch }
}

function collect() {
  const events: GuideServerEvent[] = []
  return { events, onEvent: (event: GuideServerEvent) => events.push(event) }
}

describe('streamChat', () => {
  it('一个 chunk 里解析出多个事件（token / citation / action / done）', async () => {
    const payload =
      'event: token\ndata: {"text":"你好"}\n\n' +
      'event: token\ndata: {"text":"，我是讲解员"}\n\n' +
      'event: citation\ndata: {"id":"c1","title":"化橘红志","source":"馆藏资料","url":"https://example.com/c1"}\n\n' +
      'event: action\ndata: {"type":"goto_page","payload":{"route":"/craft","label":"工艺"}}\n\n' +
      'event: done\ndata: {"sessionId":"s1","usage":{"inputTokens":12,"outputTokens":34},"finishReason":"stop"}\n\n'

    const { fetchMock, fetchImpl } = makeFetch(streamResponse([payload]))
    const { events, onEvent } = collect()

    await streamChat({ sessionId: 's1', message: '介绍一下', baseUrl: BASE, fetchImpl, onEvent })

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(events.map((event) => event.event)).toEqual(['token', 'token', 'citation', 'action', 'done'])

    const [first, second, citation, action, done] = events
    expect(first.event === 'token' && first.data.text).toBe('你好')
    expect(second.event === 'token' && second.data.text).toBe('，我是讲解员')
    expect(citation.event === 'citation' && citation.data.title).toBe('化橘红志')
    expect(action.event === 'action' && action.data.type).toBe('goto_page')
    expect(done.event === 'done' && done.data.finishReason).toBe('stop')
    expect(done.event === 'done' && done.data.usage?.outputTokens).toBe(34)
  })

  it('跨 chunk 断帧不丢事件，末尾残留帧也会被冲掉', async () => {
    const chunks = [
      // 事件名与 data 在 chunk 中间被切断
      'event: tok',
      'en\ndata: {"text":"化橘',
      // 这里接着把 JSON 与分隔符切断：\n 与 \n 分属两个 chunk
      '红"}\n\nevent: token\ndata: {"text":"很香"}\n',
      // 末尾没有空行收尾，靠 flush 处理
      '\nevent: done\ndata: {"sessionId":"s2","finishReason":"stop"}',
    ]

    const { fetchImpl } = makeFetch(streamResponse(chunks))
    const { events, onEvent } = collect()

    await streamChat({ sessionId: 's2', message: '味道', baseUrl: BASE, fetchImpl, onEvent })

    const tokens = events.filter((event) => event.event === 'token').map((event) => event.data.text)
    expect(tokens).toEqual(['化橘红', '很香'])
    expect(events.at(-1)?.event).toBe('done')
    expect(events).toHaveLength(3)
  })

  it('error 事件与随后的 done 都能收到', async () => {
    const payload =
      'event: token\ndata: {"text":"说到一半"}\n\n' +
      'event: error\ndata: {"code":"rate_limited","message":"请求太频繁，请稍后再问"}\n\n' +
      'event: done\ndata: {"sessionId":"s3","finishReason":"error"}\n\n'

    const { fetchImpl } = makeFetch(streamResponse([payload]))
    const { events, onEvent } = collect()

    await streamChat({ sessionId: 's3', message: '继续', baseUrl: BASE, fetchImpl, onEvent })

    const error = events.find((event) => event.event === 'error')
    expect(error?.event === 'error' && error.data.code).toBe('rate_limited')
    expect(error?.event === 'error' && error.data.message).toContain('请求太频繁')
    expect(events.at(-1)?.event).toBe('done')
  })

  it('坏帧（非 JSON data）被跳过，不影响后面的帧', async () => {
    const payload =
      'event: token\ndata: 这不是 JSON\n\n' +
      'event: ping\ndata: {}\n\n' +
      'event: token\ndata: {"text":"继续"}\n\n'

    const { fetchImpl } = makeFetch(streamResponse([payload]))
    const { events, onEvent } = collect()

    await streamChat({ sessionId: 's4', message: 'x', baseUrl: BASE, fetchImpl, onEvent })

    expect(events).toHaveLength(1)
    expect(events[0].event === 'token' && events[0].data.text).toBe('继续')
  })

  it('HTTP 非 200 抛 GuideHttpError，不产生事件', async () => {
    const { fetchImpl } = makeFetch(statusResponse(503))
    const { events, onEvent } = collect()

    await expect(
      streamChat({ sessionId: 's5', message: 'x', baseUrl: BASE, fetchImpl, onEvent }),
    ).rejects.toBeInstanceOf(GuideHttpError)

    expect(events).toHaveLength(0)
  })

  it('请求体带上 sessionId / message / page', async () => {
    const { fetchMock, fetchImpl } = makeFetch(streamResponse(['event: done\ndata: {"sessionId":"s6"}\n\n']))

    await streamChat({
      sessionId: 's6',
      message: '看看这件展品',
      page: { route: '/craft', signedIn: false, cart: [{ skuId: 'CP-001-01', title: '化橘红皮', variant: '', qty: 1 }] },
      baseUrl: BASE,
      fetchImpl,
      onEvent: () => {},
    })

    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe(CHAT_URL)
    expect(init?.method).toBe('POST')
    expect(JSON.parse(String(init?.body))).toEqual({
      sessionId: 's6',
      message: '看看这件展品',
      page: { route: '/craft', signedIn: false, cart: [{ skuId: 'CP-001-01', title: '化橘红皮', variant: '', qty: 1 }] },
    })
  })
})

describe('resetSession', () => {
  it('POST /api/agent/reset 并带上 sessionId', async () => {
    const { fetchMock, fetchImpl } = makeFetch(statusResponse(200))

    await resetSession('s7', { baseUrl: BASE, fetchImpl })

    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe(BASE + '/api/agent/reset')
    expect(init?.method).toBe('POST')
    expect(JSON.parse(String(init?.body))).toEqual({ sessionId: 's7' })
  })

  it('非 200 抛 GuideHttpError', async () => {
    const { fetchImpl } = makeFetch(statusResponse(500))
    await expect(resetSession('s8', { baseUrl: BASE, fetchImpl })).rejects.toBeInstanceOf(GuideHttpError)
  })
})
