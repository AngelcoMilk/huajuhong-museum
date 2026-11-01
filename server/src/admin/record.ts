// 讲解员会话入库：fire-and-forget，绝不影响对话本身。
// 没有 DATABASE_URL 时（例如只跑接口的测试）整体跳过。
import { prisma } from "../db.ts";

function enabled(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

async function safe(task: () => Promise<unknown>) {
  if (!enabled()) return;
  try {
    await task();
  } catch (error) {
    console.error("[record] 会话入库失败（不影响对话）:", error);
  }
}

export function recordUserMessage(input: {
  sessionId: string;
  message: string;
  page?: unknown;
  /** 讲解员测试场产生的会话：打标记，不进统计与默认会话列表 */
  isTest?: boolean;
}): void {
  void safe(async () => {
    await prisma.agentSession.upsert({
      where: { id: input.sessionId },
      create: {
        id: input.sessionId,
        visitorId: input.sessionId,
        page: input.page ? JSON.stringify(input.page) : null,
        endedReason: "open",
        isTest: Boolean(input.isTest),
      },
      update: {},
    });
    await prisma.agentMessage.create({
      data: { sessionId: input.sessionId, role: "user", content: input.message.slice(0, 4000) },
    });
    await prisma.agentSession.update({
      where: { id: input.sessionId },
      data: { turnCount: { increment: 1 } },
    });
  });
}

export function recordAssistantMessage(input: {
  sessionId: string;
  content: string;
  citations?: unknown[];
  suggestions?: string[];
  toolJson?: string | null;
  usage?: { inputTokens: number; outputTokens: number };
  latencyMs?: number;
  errorCode?: string | null;
  finishReason?: string;
  /** 讲解员测试场会话：随这一轮一起补上标记 */
  isTest?: boolean;
}): void {
  void safe(async () => {
    await prisma.agentMessage.create({
      data: {
        sessionId: input.sessionId,
        role: "assistant",
        content: input.content.slice(0, 20000),
        citationsJson: input.citations?.length ? JSON.stringify(input.citations) : null,
        suggestionsJson: input.suggestions?.length ? JSON.stringify(input.suggestions) : null,
        toolJson: input.toolJson ?? null,
        usageJson: input.usage ? JSON.stringify(input.usage) : null,
        latencyMs: input.latencyMs ?? null,
        errorCode: input.errorCode ?? null,
      },
    });
    await prisma.agentSession.update({
      where: { id: input.sessionId },
      data: {
        inputTokens: { increment: input.usage?.inputTokens ?? 0 },
        outputTokens: { increment: input.usage?.outputTokens ?? 0 },
        finishReason: input.finishReason ?? null,
        ...(input.isTest ? { isTest: true } : {}),
      },
    });
  });
}

export function closeSession(sessionId: string, reason: "reset" | "ttl" | "idle"): void {
  void safe(async () => {
    await prisma.agentSession.updateMany({
      where: { id: sessionId, endedAt: null },
      data: { endedAt: new Date(), endedReason: reason },
    });
  });
}
