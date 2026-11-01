// 确定性 Runner：不发任何网络请求，用于契约测试、前端联调与离线开发。
import type { AgentEvent } from "../contract.ts";
import type { Emit, RunInput, Runner } from "./runner.ts";

export interface MockScript {
  /** 逐段吐出的文本 */
  tokens: string[];
  citations?: Extract<AgentEvent, { type: "citation" }>["citation"][];
  actions?: Extract<AgentEvent, { type: "action" }>["action"][];
  /** 抛出以模拟模型失败 */
  fail?: { code: string; message: string };
  /** 每段之间的延迟，测试里传 0 */
  delayMs?: number;
}

export function defaultScript(input: RunInput): MockScript {
  const q = input.message.trim();
  if (q.includes("报错")) {
    return { tokens: [], fail: { code: "mock_failure", message: "模拟的模型故障" } };
  }
  return {
    tokens: [`收到你的问题：「${q}」。`, "这是 mock 回答，", "用于验证流式链路。"],
    citations: [{ id: "mock-1", title: "mock 知识条目", source: "知识库", origin: "《化橘红志》" }],
    actions: [{ type: "goto_page", payload: { route: "/products/CP-007", label: "七爪化橘红" } }],
    delayMs: 5,
  };
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export class MockRunner implements Runner {
  private readonly script: (input: RunInput) => MockScript;

  constructor(script: (input: RunInput) => MockScript = defaultScript) {
    this.script = script;
  }

  async run(input: RunInput, emit: Emit, signal: AbortSignal): Promise<void> {
    const script = this.script(input);
    const delay = script.delayMs ?? 0;

    for (const text of script.tokens) {
      if (signal.aborted) return;
      if (delay) await sleep(delay);
      emit({ type: "token", text });
    }

    if (script.fail) {
      emit({ type: "error", ...script.fail });
      return;
    }

    for (const citation of script.citations ?? []) emit({ type: "citation", citation });
    for (const action of script.actions ?? []) emit({ type: "action", action });

    emit({
      type: "done",
      sessionId: "",
      usage: { inputTokens: input.message.length, outputTokens: script.tokens.join("").length },
      finishReason: "stop",
    });
  }

  dispose(): void {}
}
