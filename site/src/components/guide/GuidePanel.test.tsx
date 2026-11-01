import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { GuideAction, GuideFetch } from '../../lib/guideClient'
import { GuidePanel } from './GuidePanel'
import { useGuideChat } from './useGuideChat'

interface ControlledStream {
  response: Response
  push: (chunk: string) => void
  close: () => void
}

const encoder = new TextEncoder()

/** 手动控制分块到达的假流，用来观察增量渲染 */
function controlledStream(): ControlledStream {
  type ReadResult = { done: boolean; value?: Uint8Array }
  const queue: ReadResult[] = []
  let pending: ((result: ReadResult) => void) | null = null

  const settle = (result: ReadResult) => {
    if (pending) {
      const resolve = pending
      pending = null
      resolve(result)
    } else {
      queue.push(result)
    }
  }

  const response = {
    ok: true,
    status: 200,
    body: {
      getReader() {
        return {
          read: () =>
            new Promise<ReadResult>((resolve) => {
              if (queue.length > 0) {
                resolve(queue.shift() as ReadResult)
              } else {
                pending = resolve
              }
            }),
          releaseLock() {},
        }
      },
    },
  } as unknown as Response

  return {
    response,
    push: (chunk: string) => settle({ done: false, value: encoder.encode(chunk) }),
    close: () => settle({ done: true }),
  }
}

function Harness({
  fetchImpl,
  onAction,
}: {
  fetchImpl: GuideFetch
  onAction?: (action: GuideAction) => void
}) {
  const chat = useGuideChat({ fetchImpl, baseUrl: 'http://guide.test', onAction })
  return <GuidePanel chat={chat} onClose={() => {}} />
}

function setup(fetchImpl: GuideFetch, onAction?: (action: GuideAction) => void) {
  render(<Harness fetchImpl={fetchImpl} onAction={onAction} />)
  return screen.getByLabelText('向讲解员提问') as HTMLTextAreaElement
}

// 已经有服务端签发的会话，这里的用例不关心要 id 那一步
beforeEach(() => {
  window.sessionStorage.setItem('hj-guide-session-id', 's-test')
})

describe('GuidePanel', () => {
  it('打开即聚焦输入框', () => {
    const input = setup(vi.fn() as unknown as GuideFetch)
    expect(input).toHaveFocus()
    expect(screen.getByRole('dialog', { name: '橘红讲解员' })).toBeInTheDocument()
  })

  it('输入内容按 Enter 发送，Shift+Enter 只换行', async () => {
    const stream = controlledStream()
    const fetchMock = vi.fn(async (_url: string, _init?: RequestInit) => stream.response)
    const input = setup(fetchMock as unknown as GuideFetch)

    fireEvent.change(input, { target: { value: '换行测试' } })
    fireEvent.keyDown(input, { key: 'Enter', shiftKey: true })
    expect(fetchMock).not.toHaveBeenCalled()

    fireEvent.change(input, { target: { value: '讲讲炮制工艺' } })
    fireEvent.keyDown(input, { key: 'Enter' })

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1))
    expect(screen.getByText('讲讲炮制工艺')).toBeInTheDocument()
    expect((input as HTMLTextAreaElement).value).toBe('')

    const init = fetchMock.mock.calls[0][1]
    const body = JSON.parse(String(init?.body))
    expect(body.message).toBe('讲讲炮制工艺')
    expect(typeof body.sessionId).toBe('string')

    // 请求已发出但还没有 token：状态是「思考中」，按钮切成停止
    expect(screen.getByRole('button', { name: '停止回答' })).toBeInTheDocument()

    await act(async () => {
      stream.close()
    })
  })

  it('token 增量渲染，citation 与 action 挂在助手消息下', async () => {
    const stream = controlledStream()
    const fetchMock = vi.fn(async (_url: string, _init?: RequestInit) => stream.response)
    const input = setup(fetchMock as unknown as GuideFetch)

    fireEvent.change(input, { target: { value: '讲讲古法炮制' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1))

    await act(async () => {
      stream.push('event: token\ndata: {"text":"古法"}\n\n')
    })
    expect(await screen.findByText('古法')).toBeInTheDocument()

    await act(async () => {
      stream.push('event: token\ndata: {"text":"炮制分七道工序"}\n\n')
    })
    await waitFor(() => expect(screen.getByText('古法炮制分七道工序')).toBeInTheDocument())

    await act(async () => {
      stream.push(
        'event: citation\ndata: {"id":"c1","title":"内部条目名","source":"知识库","origin":"《化橘红志》","url":"https://example.com/zhi"}\n\n',
      )
    })
    // 展示的是原文出处，不是内部条目标题
    const citation = await screen.findByText('《化橘红志》')
    expect(citation.closest('a')).toHaveAttribute('href', 'https://example.com/zhi')
    expect(screen.queryByText('内部条目名')).toBeNull()
    expect(screen.getByText('引用自')).toBeInTheDocument()

    // 没有具体典籍出处时，只显示「知识库」
    await act(async () => {
      stream.push('event: citation\ndata: {"id":"c2","title":"某知识库文件.md","source":"wiki"}\n\n')
    })
    expect(await screen.findByText('知识库')).toBeInTheDocument()
    expect(screen.queryByText('某知识库文件.md')).toBeNull()

    await act(async () => {
      stream.push('event: action\ndata: {"type":"goto_page","payload":{"route":"/craft","label":"工艺"}}\n\n')
    })
    expect(await screen.findByText('打开页面')).toBeInTheDocument()

    await act(async () => {
      stream.push('event: done\ndata: {"sessionId":"s1","usage":{"inputTokens":3,"outputTokens":9},"finishReason":"stop"}\n\n')
    })
    await waitFor(() => expect(screen.getByRole('button', { name: '发送消息' })).toBeInTheDocument())
    expect(screen.getByText('古法炮制分七道工序')).toBeInTheDocument()

    await act(async () => {
      stream.close()
    })
  })

  it('停止按钮 abort 请求并回到待机', async () => {
    const stream = controlledStream()
    let signal: AbortSignal | undefined
    const fetchMock = vi.fn(async (_url: string, init?: RequestInit) => {
      signal = init?.signal ?? undefined
      return stream.response
    })
    const input = setup(fetchMock as unknown as GuideFetch)

    fireEvent.change(input, { target: { value: '慢慢讲' } })
    fireEvent.keyDown(input, { key: 'Enter' })

    const stopButton = await screen.findByRole('button', { name: '停止回答' })
    expect(signal?.aborted).toBe(false)

    await act(async () => {
      fireEvent.click(stopButton)
    })

    expect(signal?.aborted).toBe(true)
    await waitFor(() => expect(screen.getByRole('button', { name: '发送消息' })).toBeInTheDocument())
    expect(screen.getByText('已停止本轮回答。')).toBeInTheDocument()

    await act(async () => {
      stream.close()
    })
  })

  it('后端 error 事件渲染成错误条', async () => {
    const stream = controlledStream()
    const fetchMock = vi.fn(async (_url: string, _init?: RequestInit) => stream.response)
    const input = setup(fetchMock as unknown as GuideFetch)

    fireEvent.change(input, { target: { value: '在吗' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1))

    await act(async () => {
      stream.push('event: error\ndata: {"code":"rate_limited","message":"请求太频繁"}\n\n')
    })

    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent('请求太频繁')
    await waitFor(() => expect(screen.getByRole('button', { name: '发送消息' })).toBeInTheDocument())

    await act(async () => {
      stream.close()
    })
  })

  it('suggestions 渲染成候选 chips，点一下直接提问', async () => {
    const stream = controlledStream()
    const fetchMock = vi.fn(async (_url: string, _init?: RequestInit) => stream.response)
    const input = setup(fetchMock as unknown as GuideFetch)

    fireEvent.change(input, { target: { value: '七爪是什么' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1))

    await act(async () => {
      stream.push('event: token\ndata: {"text":"七爪是割七刀的做法"}\n\n')
      stream.push('event: suggestions\ndata: {"items":["想看割刀工序","和五爪有什么区别"]}\n\n')
      stream.push('event: done\ndata: {"sessionId":"s1","finishReason":"stop"}\n\n')
    })

    const chip = await screen.findByRole('button', { name: '想看割刀工序' })
    expect(screen.getByRole('button', { name: '和五爪有什么区别' })).toBeInTheDocument()

    await act(async () => {
      fireEvent.click(chip)
    })
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2))
    const second = JSON.parse(String(fetchMock.mock.calls[1][1]?.body))
    expect(second.message).toBe('想看割刀工序')

    await act(async () => {
      stream.close()
    })
  })
})

describe('助手消息的 Markdown 渲染', () => {
  it('段落、加粗、无序列表、行内代码与代码块', async () => {
    const stream = controlledStream()
    const fetchMock = vi.fn(async (_url: string, _init?: RequestInit) => stream.response)
    const view = render(<Harness fetchImpl={fetchMock as unknown as GuideFetch} />)
    const input = screen.getByLabelText('向讲解员提问')

    fireEvent.change(input, { target: { value: '排版测试' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1))

    const markdown = [
      '第一段 **重点** 内容',
      '',
      '- 甲',
      '- 乙',
      '',
      '这里有 `inline` 代码',
      '',
      '```ts',
      'const a = 1',
      '```',
    ].join('\n')

    await act(async () => {
      stream.push('event: token\ndata: ' + JSON.stringify({ text: markdown }) + '\n\n')
    })

    const bubble = () => view.container.querySelector('.hj-guide-msg--assistant .hj-guide-msg__bubble')
    await waitFor(() => expect(bubble()?.querySelector('strong')?.textContent).toBe('重点'))

    const rendered = bubble() as HTMLElement
    expect(rendered.querySelectorAll('li')).toHaveLength(2)
    expect(rendered.querySelector('ul')).toBeInTheDocument()
    expect(rendered.querySelector('p code')?.textContent).toBe('inline')
    expect(rendered.querySelector('pre code')?.textContent).toBe('const a = 1')
    expect(rendered.querySelector('pre code')?.className).toBe('language-ts')

    await act(async () => {
      stream.close()
    })
  })

  it('标题、引用、分割线、高亮与安全链接', async () => {
    const stream = controlledStream()
    const fetchMock = vi.fn(async (_url: string, _init?: RequestInit) => stream.response)
    const view = render(<Harness fetchImpl={fetchMock as unknown as GuideFetch} />)
    const input = screen.getByLabelText('向讲解员提问')

    fireEvent.change(input, { target: { value: '富文本测试' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1))

    const markdown = [
      '### 七爪工序',
      '',
      '核心是 **割七刀**，成品 ==十片一扎==。',
      '',
      '嵌套：==**七爪**才是关键==，别记错。',
      '',
      '> 摘自《化橘红志》',
      '',
      '---',
      '',
      '参考 [馆藏资料](https://example.com/doc)，以及 [危险链接](javascript:alert(1))。',
    ].join('\n')

    await act(async () => {
      stream.push('event: token\ndata: ' + JSON.stringify({ text: markdown }) + '\n\n')
      stream.push('event: done\ndata: {"sessionId":"s","finishReason":"stop"}\n\n')
    })

    const bubble = () =>
      view.container.querySelector('.hj-guide-msg--assistant .hj-guide-msg__bubble') as HTMLElement
    await waitFor(() => expect(bubble()?.querySelector('h3')?.textContent).toBe('七爪工序'))

    const rendered = bubble()
    expect(rendered.querySelector('mark')?.textContent).toContain('十片一扎')
    // 高亮里嵌的粗体也要渲染出来，不能当字面量
    const nested = rendered.querySelector('mark strong')
    expect(nested?.textContent).toBe('七爪')
    expect(rendered.querySelector('strong')?.textContent).toBe('割七刀')
    expect(rendered.querySelector('blockquote')?.textContent).toContain('化橘红志')
    expect(rendered.querySelector('hr')).toBeInTheDocument()

    // 只放行 http(s)：javascript: 链接必须降级成纯文本
    const links = rendered.querySelectorAll('a')
    expect(links).toHaveLength(1)
    expect(links[0]).toHaveAttribute('href', 'https://example.com/doc')
    expect(rendered.textContent).toContain('危险链接')

    await act(async () => {
      stream.close()
    })
  })

  it('action 事件会回调给宿主页面，让页面真去执行', async () => {
    const stream = controlledStream()
    const seen: GuideAction[] = []
    const fetchMock = vi.fn(async (_url: string, _init?: RequestInit) => stream.response)
    const input = setup(fetchMock as unknown as GuideFetch, (action) => {
      seen.push(action)
    })

    fireEvent.change(input, { target: { value: '带我看看七爪' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1))

    await act(async () => {
      stream.push('event: action\ndata: {"type":"goto_page","payload":{"route":"/craft#machine-qizhua","label":"七爪"}}\n\n')
      stream.push('event: done\ndata: {"sessionId":"s","finishReason":"stop"}\n\n')
    })

    await waitFor(() => expect(seen).toHaveLength(1))
    expect(seen[0].type).toBe('goto_page')
    expect(seen[0].payload).toEqual({ route: '/craft#machine-qizhua', label: '七爪' })

    await act(async () => {
      stream.close()
    })
  })

  it('动作结果显示成卡片：失败如实写，撤销连点只执行一次，失败可再点', async () => {
    const stream = controlledStream()
    const fetchMock = vi.fn(async (_url: string, _init?: RequestInit) => stream.response)
    const undo = vi
      .fn<() => Promise<string>>()
      .mockRejectedValueOnce(new Error('撤销没有成功：库存不足。'))
      .mockResolvedValueOnce('已撤销：化橘红皮 不在购物车里了。')
    const input = setup(fetchMock as unknown as GuideFetch, async (action) =>
      action.type === 'cart_add'
        ? { ok: true, text: '已加入购物车：化橘红皮 × 1，¥59.00', undo }
        : { ok: false, text: '购物车是空的，还不能结算。' },
    )

    fireEvent.change(input, { target: { value: '加一件然后结算' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1))

    await act(async () => {
      stream.push('event: action\ndata: {"type":"cart_add","payload":{"skuId":"s1","qty":1}}\n\n')
      stream.push('event: action\ndata: {"type":"goto_checkout","payload":{}}\n\n')
      stream.push('event: done\ndata: {"sessionId":"s","finishReason":"stop"}\n\n')
    })

    expect(await screen.findByText('已加入购物车：化橘红皮 × 1，¥59.00')).toBeInTheDocument()
    expect(await screen.findByText('购物车是空的，还不能结算。')).toBeInTheDocument()
    // 失败的卡片没有撤销
    expect(screen.getAllByRole('button', { name: '撤销' })).toHaveLength(1)

    fireEvent.click(screen.getByRole('button', { name: '撤销' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('撤销没有成功：库存不足。')
    expect(undo).toHaveBeenCalledTimes(1)

    const again = await screen.findByRole('button', { name: '撤销' })
    fireEvent.click(again)
    fireEvent.click(again)
    expect(await screen.findByText('已撤销：化橘红皮 不在购物车里了。')).toBeInTheDocument()
    expect(undo).toHaveBeenCalledTimes(2)
    expect(screen.queryByRole('button', { name: '撤销' })).toBeNull()

    await act(async () => {
      stream.close()
    })
  })
})
