// SSE 帧编码。约定：event 名表示类型，data 就是载荷本体（不再包一层 {type}）。
// 这样与前端解析器、以及 SSE 的常规用法一致：
//   event: token    data: {"text":"..."}
//   event: citation data: {"id","title","source","url?"}
//   event: action   data: {"type":"goto_page","payload":{...}}
//   event: error    data: {"code","message"}
//   event: done     data: {"sessionId","usage","finishReason"}
import type { AgentActionType, AgentEvent } from "./contract.ts";

export const SSE_HEADERS = {
  "Content-Type": "text/event-stream; charset=utf-8",
  "Cache-Control": "no-cache, no-transform",
  Connection: "keep-alive",
  "X-Accel-Buffering": "no",
} as const;

/** 内部事件 → 线上 data 载荷 */
export function toPayload(event: AgentEvent): Record<string, unknown> {
  switch (event.type) {
    case "token":
      return { text: event.text };
    case "citation":
      return { ...event.citation };
    case "action":
      return { ...event.action };
    case "suggestions":
      return { items: event.items };
    case "error":
      return { code: event.code, message: event.message };
    case "done":
      return {
        sessionId: event.sessionId,
        usage: event.usage,
        finishReason: event.finishReason,
        ...(event.used ? { used: event.used } : {}),
      };
  }
}

export function encodeEvent(event: AgentEvent): string {
  return `event: ${event.type}\ndata: ${JSON.stringify(toPayload(event))}\n\n`;
}

/** 线上 data 载荷 → 内部事件（测试与调试用）；未知事件返回 null */
export function fromPayload(name: string, data: Record<string, unknown>): AgentEvent | null {
  switch (name) {
    case "token":
      return typeof data.text === "string" ? { type: "token", text: data.text } : null;
    case "citation":
      return typeof data.id === "string"
        ? {
            type: "citation",
            citation: {
              id: data.id,
              title: String(data.title ?? ""),
              source: String(data.source ?? ""),
              ...(typeof data.origin === "string" && data.origin ? { origin: data.origin } : {}),
              ...(typeof data.url === "string" ? { url: data.url } : {}),
            },
          }
        : null;
    case "action":
      return typeof data.type === "string"
        ? {
            type: "action",
            action: {
              type: data.type as AgentActionType,
              payload: (data.payload ?? {}) as Record<string, unknown>,
            },
          }
        : null;
    case "suggestions":
      return {
        type: "suggestions",
        items: Array.isArray(data.items) ? data.items.filter((x): x is string => typeof x === "string") : [],
      };
    case "error":
      return { type: "error", code: String(data.code ?? "unknown"), message: String(data.message ?? "") };
    case "done":
      return {
        type: "done",
        sessionId: String(data.sessionId ?? ""),
        usage: (data.usage ?? { inputTokens: 0, outputTokens: 0 }) as {
          inputTokens: number;
          outputTokens: number;
        },
        finishReason: String(data.finishReason ?? "stop"),
      };
    default:
      return null;
  }
}

/** 把整段 SSE 文本解析回事件数组（测试与调试用） */
export function parseEvents(raw: string): AgentEvent[] {
  const out: AgentEvent[] = [];
  for (const block of raw.split("\n\n")) {
    if (!block.trim()) continue;
    const lines = block.split("\n");
    const nameLine = lines.find((l) => l.startsWith("event:"));
    const dataLine = lines.find((l) => l.startsWith("data:"));
    if (!nameLine || !dataLine) continue;
    const name = nameLine.slice(6).trim();
    try {
      const data = JSON.parse(dataLine.slice(5).trim()) as Record<string, unknown>;
      const event = fromPayload(name, data);
      if (event) out.push(event);
    } catch {
      /* 忽略坏帧 */
    }
  }
  return out;
}
