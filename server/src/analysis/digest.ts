// 把会话整理成"给模型看的摘要"：只放提问、回答开头、工具命中，
// 不放全文——分析要的是模式，不是原文。
import { prisma } from "../db.ts";

export interface SessionDigest {
  id: string;
  turns: number;
  endedReason: string | null;
  finishReason: string | null;
  startedAt: number;
  lines: string[];
  chars: number;
}

function clip(text: string, max: number): string {
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length > max ? `${clean.slice(0, max)}…` : clean;
}

export async function buildDigests(options: { since?: Date; limit?: number; sessionId?: string }) {
  const sessions = await prisma.agentSession.findMany({
    where: options.sessionId
      ? { id: options.sessionId }
      : options.since
        ? { startedAt: { gte: options.since } }
        : undefined,
    orderBy: { startedAt: "desc" },
    take: options.sessionId ? 1 : (options.limit ?? 60),
    include: { messages: { orderBy: { createdAt: "asc" } } },
  });

  const digests: SessionDigest[] = [];
  for (const [index, session] of sessions.entries()) {
    const lines: string[] = [
      `会话 ${index + 1}（${session.turnCount} 轮，结束：${session.endedReason ?? "open"}，tokens ${session.inputTokens}/${session.outputTokens}）`,
    ];
    for (const message of session.messages) {
      if (message.role === "user") {
        lines.push(`  问：${clip(message.content, 120)}`);
      } else if (message.role === "assistant") {
        const tool = message.toolJson ? ` 〔工具 ${clip(message.toolJson, 120)}〕` : "";
        lines.push(`  答：${clip(message.content, 100)}${tool}`);
        if (message.errorCode) lines.push(`  ⚠ 错误：${message.errorCode}`);
      }
    }
    const text = lines.join("\n");
    digests.push({
      id: session.id,
      turns: session.turnCount,
      endedReason: session.endedReason,
      finishReason: session.finishReason,
      startedAt: session.startedAt.getTime(),
      lines,
      chars: text.length,
    });
  }
  return digests;
}

export function renderDigest(digests: SessionDigest[], maxChars = 12000): string {
  const parts: string[] = [];
  let used = 0;
  for (const digest of digests) {
    const block = digest.lines.join("\n");
    if (used + block.length > maxChars) break;
    parts.push(block);
    used += block.length + 2;
  }
  return parts.join("\n\n");
}
