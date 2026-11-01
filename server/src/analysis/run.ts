// 会话分析：把对话摘要交给模型，产出主题、高频问题、知识缺口与质量画像。
// 分析是"主动触发"的批处理，不参与访客对话。
import { completeSimple } from "@mariozechner/pi-ai";
import { prisma } from "../db.ts";
import { buildDigests, renderDigest } from "./digest.ts";
import { resolveAnalysisTarget } from "./model.ts";

const GLOBAL_SYSTEM = `你是博物馆数字展馆的运营分析助手。输入是访客与 AI 讲解员的对话摘要（访客提问 + 回答开头 + 工具调用）。
任务：归纳主题、找出高频问题、识别"知识缺口"（讲解员答不上来或检索不到的问题）、评估对话质量。
严格要求：
1. 只输出一个 JSON 对象，不要 markdown 代码块，不要任何解释文字。
2. 只依据输入内容，不要编造问题或数字。
3. gaps 只收录"确实答不上来"的问题：回答里出现"暂时没有资料/不知道"，或工具命中为 0，或访客追问同一个点。
4. count 用出现次数，找不到依据就写 1。
JSON 结构：
{"topics":[{"name":"","count":0,"examples":[""]}],"topQuestions":[{"question":"","count":0}],"gaps":[{"question":"","reason":""}],"quality":{"avgTurns":0,"abortedRate":0,"notes":""}}`;

const SINGLE_SYSTEM = `你是对话质检助手。输入是一次访客与 AI 讲解员的完整对话摘要。
要求：只输出一个 JSON 对象，不要 markdown，不要解释。
JSON 结构：
{"summary":"两三句话概括访客想了解什么、答得如何","questions":["访客问到的关键问题"],"gaps":[{"question":"","reason":""}],"quality":{"answered":true,"notes":""},"shouldImprove":["下次可以怎么答得更好"]}`;

function extractJson(text: string): any | null {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const raw = fenced ? fenced[1] : text;
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  try {
    return JSON.parse(raw.slice(start, end + 1));
  } catch {
    return null;
  }
}

function answerText(message: any): string {
  return (message?.content ?? [])
    .filter((part: any) => part?.type === "text")
    .map((part: any) => part.text)
    .join("\n")
    .trim();
}

/**
 * 调模型。注意：有些模型（如 mercury-3）默认把预算全花在思考上，
 * 推出来的 content 只有 thinking、没有 text，表现为"回答是空的"。
 * 所以这里固定 reasoning=low，并在空答复时提高预算重试一次。
 */
async function ask(systemPrompt: string, userText: string) {
  const target = await resolveAnalysisTarget();
  if (!target) {
    throw Object.assign(new Error("没有可用的分析模型，请先在后台配置供应商或在 Setting 里设置 analysis.provider / analysis.model"), {
      code: "NO_ANALYSIS_MODEL",
    });
  }
  const baseOptions = { apiKey: target.apiKey, headers: target.headers } as any;
  let message = await completeSimple(
    target.model as any,
    { systemPrompt, messages: [{ role: "user", content: userText, timestamp: Date.now() } as any] },
    { ...baseOptions, maxTokens: 2400, reasoning: "low" } as any,
  );
  let text = answerText(message);
  if (!text) {
    message = await completeSimple(
      target.model as any,
      { systemPrompt, messages: [{ role: "user", content: userText, timestamp: Date.now() } as any] },
      { ...baseOptions, maxTokens: 4096, reasoning: "minimal" } as any,
    );
    text = answerText(message);
  }
  return { text, parsed: normaliseParsed(extractJson(text)), model: target.label, usage: message.usage };
}

/** 模型经常把对象写成字符串数组，这里统一形状，避免下游崩 */
function normaliseParsed(parsed: any): any {
  if (!parsed || typeof parsed !== "object") return parsed;
  const asList = (value: any): any[] => (Array.isArray(value) ? value : value ? [value] : []);
  const topicOf = (item: any) =>
    typeof item === "string"
      ? { name: item, count: 1, examples: [] as string[] }
      : { name: String(item?.name ?? item?.topic ?? ""), count: Number(item?.count ?? 1) || 1, examples: asList(item?.examples).map(String) };
  const gapOf = (item: any) =>
    typeof item === "string"
      ? { question: item, reason: "" }
      : { question: String(item?.question ?? item?.q ?? ""), reason: String(item?.reason ?? "") };
  const questionOf = (item: any) =>
    typeof item === "string" ? { question: item, count: 1 } : { question: String(item?.question ?? ""), count: Number(item?.count ?? 1) || 1 };

  const topics = asList(parsed.topics).map(topicOf).filter((t) => t.name);
  const topQuestions = asList(parsed.topQuestions ?? parsed.questions).map(questionOf).filter((q) => q.question);
  const gaps = asList(parsed.gaps).map(gapOf).filter((g) => g.question);
  return {
    ...parsed,
    topics,
    topQuestions,
    gaps,
    quality: parsed.quality && typeof parsed.quality === "object" ? parsed.quality : {},
  };
}

async function upsertGaps(items: Array<{ question?: string; reason?: string }> | undefined) {
  let created = 0;
  let bumped = 0;
  for (const item of items ?? []) {
    const question = String(item?.question ?? "").trim();
    if (question.length < 2) continue;
    const existing = await prisma.kbGap.findFirst({ where: { question } });
    if (existing) {
      await prisma.kbGap.update({
        where: { id: existing.id },
        data: { count: { increment: 1 }, lastSeenAt: new Date() },
      });
      bumped += 1;
    } else {
      await prisma.kbGap.create({
        data: { question, note: item?.reason ?? null, lastSeenAt: new Date() },
      });
      created += 1;
    }
  }
  return { created, bumped };
}

export interface RunOptions {
  mode: "incremental" | "full";
  limit?: number;
}

export async function estimateAnalysis(options: RunOptions) {
  const last = await prisma.analysisReport.findFirst({
    where: { kind: "session", scope: { in: ["incremental", "full"] } },
    orderBy: { createdAt: "desc" },
  });
  const since = options.mode === "incremental" ? last?.createdAt : undefined;
  const digests = await buildDigests({ since, limit: options.limit ?? 60 });
  const chars = digests.reduce((sum, d) => sum + d.chars, 0);
  return {
    mode: options.mode,
    sessionCount: digests.length,
    chars,
    estimatedTokens: Math.ceil(chars / 1.6),
    since: since?.getTime() ?? null,
    lastReportAt: last?.createdAt.getTime() ?? null,
  };
}

export async function runGlobalAnalysis(options: RunOptions) {
  const last = await prisma.analysisReport.findFirst({
    where: { kind: "session", scope: { in: ["incremental", "full"] } },
    orderBy: { createdAt: "desc" },
  });
  const since = options.mode === "incremental" ? (last?.createdAt ?? undefined) : undefined;
  const digests = await buildDigests({ since, limit: options.limit ?? 60 });
  if (digests.length === 0) {
    return { skipped: true as const, reason: options.mode === "incremental" ? "上次分析之后没有新的会话" : "还没有任何会话" };
  }
  const digestText = renderDigest(digests);
  const result = await ask(GLOBAL_SYSTEM, digestText);
  const gaps = await upsertGaps(result.parsed?.gaps);

  const report = await prisma.analysisReport.create({
    data: {
      kind: "session",
      scope: options.mode,
      sessionCount: digests.length,
      resultJson: JSON.stringify({ parsed: result.parsed, raw: result.parsed ? null : result.text }),
      model: result.model,
      tokens: (result.usage?.input ?? 0) + (result.usage?.output ?? 0),
    },
  });

  return {
    skipped: false as const,
    reportId: report.id,
    sessionCount: digests.length,
    parsed: result.parsed,
    raw: result.parsed ? null : result.text,
    model: result.model,
    usage: result.usage,
    gaps,
  };
}

export async function analyzeOneSession(sessionId: string) {
  const digests = await buildDigests({ sessionId });
  if (digests.length === 0) throw Object.assign(new Error("没有这次会话的记录"), { code: "SESSION_NOT_FOUND" });
  const result = await ask(SINGLE_SYSTEM, digests[0].lines.join("\n"));
  const gaps = await upsertGaps(result.parsed?.gaps);

  const report = await prisma.analysisReport.create({
    data: {
      kind: "session",
      scope: `session:${sessionId}`,
      sessionCount: 1,
      resultJson: JSON.stringify({ parsed: result.parsed, raw: result.parsed ? null : result.text }),
      model: result.model,
      tokens: (result.usage?.input ?? 0) + (result.usage?.output ?? 0),
    },
  });
  return { reportId: report.id, parsed: result.parsed, raw: result.parsed ? null : result.text, model: result.model, gaps };
}

export async function latestSessionReport(sessionId: string) {
  const row = await prisma.analysisReport.findFirst({
    where: { kind: "session", scope: `session:${sessionId}` },
    orderBy: { createdAt: "desc" },
  });
  if (!row) return null;
  return { id: row.id, createdAt: row.createdAt.getTime(), model: row.model, ...JSON.parse(row.resultJson) };
}