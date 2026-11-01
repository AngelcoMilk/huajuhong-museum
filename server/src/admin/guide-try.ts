// 讲解员测试场：用「草稿」或「发布」配置（或指定某一版）跑一轮对话。
// 两种形态：一次性 JSON（/config/try）与 SSE（/config/try/stream，事件格式与 /api/agent/chat 一致）。
// 测试场产生的会话打 isTest 标记：不进统计，也不出现在默认会话列表里。
import type { Context } from "hono";
import { prisma } from "../db.ts";
import { audit } from "./audit.ts";
import { RUN_TIMEOUT_MS } from "../contract.ts";
import type { AgentEvent } from "../contract.ts";
import { encodeEvent, SSE_HEADERS } from "../sse.ts";
import { recordAssistantMessage, recordUserMessage } from "./record.ts";
import { withOverride } from "../runtime/config.ts";
import { modelSelectable, normaliseModels } from "./providers.ts";

const MAX_HISTORY = 20;
const MAX_HISTORY_CHARS = 2000;
/** 右边试聊可以用「左边正在编辑、还没保存」的内容，提示词上限按这个来 */
const MAX_DRAFT_PROMPT_CHARS = 100_000;

interface TryHistoryTurn {
  role: "user" | "assistant";
  content: string;
}

/** 未保存的表单内容：优先于 useDraft / versionId */
interface TryDraft {
  system: string;
  provider: string;
  model: string;
}

interface TryInput {
  question: string;
  useDraft: boolean;
  versionId: string;
  history: TryHistoryTurn[];
  draft: TryDraft | null;
}

function fail(c: Context, status: 400 | 404 | 409, code: string, message: string, field?: string) {
  return c.json({ error: { code, message, ...(field ? { field } : {}) } }, status);
}

type ReadResult = { ok: true; input: TryInput } | { ok: false; code: "BAD_REQUEST" | "BAD_HISTORY"; message: string; field: string };

/** 请求体校验：问题必填，history ≤ 20 条、单条 ≤ 2000 字、role 只能是 user/assistant */
function readInput(body: any): ReadResult {
  // 只认字符串：JSON 里塞对象/数组不该被 String() 成 "[object Object]" 后真跑一轮模型
  const question = typeof body?.question === "string" ? body.question.trim() : "";
  if (!question) {
    return { ok: false, code: "BAD_REQUEST", message: "请输入要试问的问题。", field: "question" };
  }
  const rawHistory = Array.isArray(body?.history) ? body.history : [];
  const badHistory = {
    ok: false as const,
    code: "BAD_HISTORY" as const,
    message: `history 最多 ${MAX_HISTORY} 条、单条 ${MAX_HISTORY_CHARS} 字，role 只能是 user/assistant。`,
    field: "history",
  };
  if (rawHistory.length > MAX_HISTORY) return badHistory;
  const history: TryHistoryTurn[] = [];
  for (const turn of rawHistory) {
    const role = turn?.role === "assistant" ? "assistant" : turn?.role === "user" ? "user" : null;
    if (!role || typeof turn?.content !== "string" || turn.content.length > MAX_HISTORY_CHARS) return badHistory;
    const content = turn.content;
    history.push({ role, content });
  }

  // draft = 左边正在编辑、还没保存的内容；形状不对直接挡住，别把半成品喂给模型
  const rawDraft = body?.draft;
  let draft: TryDraft | null = null;
  if (rawDraft !== undefined && rawDraft !== null) {
    const badDraft = {
      ok: false as const,
      code: "BAD_REQUEST" as const,
      message: "draft 需要 { prompt: { system }, model: { provider, model } }，提示词不能为空。",
      field: "draft",
    };
    if (typeof rawDraft !== "object" || Array.isArray(rawDraft)) return badDraft;
    const system = rawDraft?.prompt?.system;
    const provider = rawDraft?.model?.provider;
    const modelId = rawDraft?.model?.model;
    if (typeof system !== "string" || !system.trim()) return badDraft;
    if (typeof provider !== "string" || !provider.trim()) return badDraft;
    if (typeof modelId !== "string" || !modelId.trim()) return badDraft;
    if (system.length > MAX_DRAFT_PROMPT_CHARS) {
      return { ...badDraft, message: `提示词最多 ${MAX_DRAFT_PROMPT_CHARS} 字。` };
    }
    draft = { system, provider: provider.trim(), model: modelId.trim() };
  }

  return {
    ok: true,
    input: {
      question,
      useDraft: body?.useDraft !== false,
      versionId: String(body?.versionId ?? "").trim(),
      history,
      draft,
    },
  };
}

/** 选配置：指定 versionId 就用它（任意状态，含已归档）；否则用草稿，草稿没有再回发布版 */
async function resolveVersion(input: TryInput) {
  if (input.versionId) {
    const version = await prisma.configVersion.findUnique({ where: { id: input.versionId } });
    return version ? { version, source: version.status === "draft" ? "draft" : version.status === "published" ? "published" : "version" } : null;
  }
  const [draft, published] = await Promise.all([
    prisma.configVersion.findFirst({ where: { status: "draft" }, orderBy: { createdAt: "desc" } }),
    prisma.configVersion.findFirst({ where: { status: "published" }, orderBy: { publishedAt: "desc" } }),
  ]);
  const target = input.useDraft ? (draft ?? published) : published;
  if (!target) return null;
  return { version: target, source: input.useDraft && draft ? "draft" : "published" };
}

/** 这一轮到底用哪份配置：draft（表单未保存）优先，其次 versionId / 草稿 / 发布版 */
interface TryConfig {
  systemPrompt: string | undefined;
  model: { provider?: string; model?: string };
  used: { source: string; versionNo: number | null; provider: string | null; model: string | null };
  targetId: string;
}

async function resolveTryConfig(input: TryInput): Promise<TryConfig | null> {
  if (input.draft) {
    return {
      systemPrompt: input.draft.system,
      model: { provider: input.draft.provider, model: input.draft.model },
      // 用表单内容试聊不落库，所以没有版本号
      used: { source: "form", versionNo: null, provider: input.draft.provider, model: input.draft.model },
      targetId: "form",
    };
  }
  const picked = await resolveVersion(input);
  if (!picked) return null;
  const prompt = JSON.parse(picked.version.promptJson) as { system?: string };
  const model = JSON.parse(picked.version.modelJson) as { provider?: string; model?: string };
  return {
    systemPrompt: prompt.system,
    model,
    used: {
      source: picked.source,
      versionNo: picked.version.versionNo,
      provider: model.provider ?? null,
      model: model.model ?? null,
    },
    targetId: picked.version.id,
  };
}

/**
 * 开跑前把「这份配置到底能不能真的解析到模型」查清楚：停用 / 缺 Key / 模型名不在列表里 /
 * 内置供应商名或模型名拼错，运行时都会静默回退到内置默认模型——测试场不能这样骗人
 * （否则 used 写着 hjh-xxx、回答其实是内置模型给的），一律报错让配置问题暴露出来。
 * 返回 null 表示没问题。
 */
async function providerProblem(model: { provider?: string; model?: string }): Promise<string | null> {
  const name = String(model.provider ?? "").trim();
  const modelId = String(model.model ?? "").trim();
  if (!name) return null;

  const row = await prisma.provider.findUnique({ where: { name } });
  if (row) {
    if (!row.enabled) return `供应商 ${name} 已停用，先在「模型供应商」里启用。`;
    // modelsJson 只由 create/patch 写入，正常不会坏；脏数据时回落空数组，别让查配置变成 500
    let modelsJson: unknown = [];
    try {
      modelsJson = JSON.parse(row.modelsJson || "[]");
    } catch {
      modelsJson = [];
    }
    const models = normaliseModels(modelsJson);
    if (models.length === 0) return `供应商 ${name} 没配模型，先在「模型供应商」里补一个。`;
    if (modelId && !models.some((one) => one.id === modelId)) {
      const options = models.slice(0, 5).map((one) => one.id).join("、");
      return `供应商 ${name} 下没有模型 ${modelId}（可选：${options}）。`;
    }
    const active = await withOverride({ provider: name, model: modelId });
    if (!active.providerConfig) return `供应商 ${name} 不可用：Key 环境变量为空，先在「模型供应商」里补齐。`;
    return null;
  }

  // 不在库里：按内置 pi 供应商查模型表（名字/模型名拼错也要报出来，不能静默回退）
  const byId = await prisma.provider.findUnique({ where: { id: name } });
  if (byId) return `model.provider 要填供应商 name（如 ${byId.name}），不是 id。`;
  try {
    const { AuthStorage, ModelRegistry, getAgentDir } = await import("@mariozechner/pi-coding-agent");
    const { join } = await import("node:path");
    const agentDir = getAgentDir();
    const registry = ModelRegistry.create(
      AuthStorage.create(join(agentDir, "auth.json")),
      join(agentDir, "models.json"),
    );
    const found = registry.find(name, modelId);
    if (!found) return `模型表里没有 ${name}/${modelId}，检查供应商名与模型名是否拼错。`;
    if (!registry.hasConfiguredAuth(found)) {
      return `内置供应商 ${name} 未配置凭证，讲解员会不可用（可在「模型供应商」里改用自定义供应商）。`;
    }
  } catch (error) {
    console.error("[admin] 试跑前查模型表失败:", error);
  }
  return null;
}

/** 历史对话拼进本轮提问：模型只看得到文本，所以按固定格式前置 */
function promptWithHistory(input: TryInput): string {
  if (input.history.length === 0) return input.question;
  const transcript = input.history
    .map((turn) => `${turn.role === "user" ? "访客" : "讲解员"}：${turn.content}`)
    .join("\n");
  return `[此前对话]\n${transcript}\n\n[本轮提问]\n${input.question}`;
}

export function registerGuideTry(app: any) {
  // ── 一次性试跑（旧接口，行为与字段保持不变）────────────
  app.post("/config/try", async (c) => {
    const body = (await c.req.json().catch(() => ({}))) as any;
    const parsed = readInput(body);
    if (!parsed.ok) return fail(c, 400, parsed.code, parsed.message, parsed.field);
    const input = parsed.input;

    const config = await resolveTryConfig(input);
    if (!config) return fail(c, 404, "VERSION_NOT_FOUND", "还没有可用的配置版本。");
    const model = config.model;
    // 表单内容也要过和 PUT /config/draft 同一套可选性校验，别让「能试不能存」的组合蒙混进来
    if (input.draft && !(await modelSelectable(model))) {
      return fail(c, 409, "PROVIDER_NOT_CONFIGURED", "这个模型不在已配置且启用的供应商列表里，先在「模型供应商」里添加并填入 Key。", "model");
    }
    const problem = await providerProblem(model);
    if (problem) return fail(c, 409, "PROVIDER_NOT_CONFIGURED", problem, "model");

    const { PiRunner } = await import("../agent/piRunner.ts");
    const { resolveKnowledge } = await import("../knowledge/provider.ts");
    const knowledge = await resolveKnowledge();
    const sessionId = `try-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const runner = new PiRunner({
      sessionId,
      knowledge,
      override: { systemPrompt: config.systemPrompt, provider: model.provider, model: model.model },
    });

    const started = Date.now();
    let answer = "";
    const citations: unknown[] = [];
    let suggestions: string[] = [];
    let usage = { inputTokens: 0, outputTokens: 0 };
    let errorCode: string | null = null;
    const abort = new AbortController();
    const timer = setTimeout(() => abort.abort(new Error("try timeout")), RUN_TIMEOUT_MS);

    recordUserMessage({ sessionId, message: input.question, page: { route: "/admin/config", try: true }, isTest: true });
    try {
      await runner.run(
        { message: promptWithHistory(input) },
        (event: any) => {
          if (event.type === "token") answer += event.text;
          else if (event.type === "citation") citations.push(event);
          else if (event.type === "suggestions") suggestions = event.items ?? [];
          else if (event.type === "done" && event.usage) usage = event.usage;
          else if (event.type === "error") errorCode = event.code ?? "error";
        },
        abort.signal,
      );
    } catch (error) {
      errorCode = "INTERNAL_ERROR";
      console.error("[admin] 试跑失败:", error);
    } finally {
      clearTimeout(timer);
      runner.dispose();
      // 供应商不可达时模型往往「正常结束但一个字都没有」：不伪装成成功，给个明确标记
      if (!errorCode && !answer.trim()) errorCode = "EMPTY_ANSWER";
      recordAssistantMessage({
        sessionId,
        content: answer,
        citations,
        suggestions,
        usage,
        latencyMs: Date.now() - started,
        errorCode,
        finishReason: abort.signal.aborted ? "aborted" : "stop",
        isTest: true,
      });
    }

    audit({
      actor: c.get("admin").username,
      action: "config.try",
      target: config.targetId,
      detail: { versionNo: config.used.versionNo, source: config.used.source, history: input.history.length },
    });
    return c.json({
      answer,
      citations,
      suggestions,
      usage,
      latencyMs: Date.now() - started,
      errorCode,
      used: config.used,
    });
  });
  // ── SSE 流式试跑：事件名/载荷与 /api/agent/chat 完全一致 ──
  app.post("/config/try/stream", async (c) => {
    const body = (await c.req.json().catch(() => ({}))) as any;
    const parsed = readInput(body);
    if (!parsed.ok) return fail(c, 400, parsed.code, parsed.message, parsed.field);
    const input = parsed.input;

    const config = await resolveTryConfig(input);
    if (!config) return fail(c, 404, "VERSION_NOT_FOUND", "还没有可用的配置版本。");
    const model = config.model;
    // 同上：表单内容必须和 PUT /config/draft 一样可选
    if (input.draft && !(await modelSelectable(model))) {
      return fail(c, 409, "PROVIDER_NOT_CONFIGURED", "这个模型不在已配置且启用的供应商列表里，先在「模型供应商」里添加并填入 Key。", "model");
    }
    const problem = await providerProblem(model);
    if (problem) return fail(c, 409, "PROVIDER_NOT_CONFIGURED", problem, "model");
    const used = config.used;

    const { PiRunner } = await import("../agent/piRunner.ts");
    const { resolveKnowledge } = await import("../knowledge/provider.ts");
    const knowledge = await resolveKnowledge();
    const sessionId = `try-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    const abort = new AbortController();
    // 只有客户端断开才算「用户中止」；90s 超时也用 abort，但不属于用户中止，仍要补 error 给前端
    let clientGone = false;
    let answer = "";
    let citations: unknown[] = [];
    let suggestions: string[] = [];
    let usage = { inputTokens: 0, outputTokens: 0 };
    let lastError: string | null = null;
    const startedAt = Date.now();

    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        const encoder = new TextEncoder();
        let terminal = false;
        const send = (event: AgentEvent) => {
          try {
            controller.enqueue(encoder.encode(encodeEvent(event)));
          } catch {
            /* 客户端已断开 */
          }
        };
        const emit = (event: AgentEvent) => {
          if (event.type === "token") answer += event.text;
          else if (event.type === "citation") citations.push(event);
          else if (event.type === "suggestions") suggestions = event.items ?? [];
          else if (event.type === "done") usage = event.usage ?? usage;
          else if (event.type === "error") lastError = event.code ?? "error";
          if (event.type === "done") {
            terminal = true;
            // 供应商不可达/中途出错时 runner 仍以 done 收尾：先补一条 error，前端才会显示文案和供应商链接。
            // 不重复发：runner 自己发过 error 时 lastError 已有值；客户端断开时不补。
            const content = answer.trim();
            if (!clientGone && !lastError && (!content || event.finishReason === "error")) {
              const code = content ? "UPSTREAM_ERROR" : "EMPTY_ANSWER";
              lastError = code;
              emit({
                type: "error",
                code,
                message: content ? "模型中途出错，回答可能不完整。" : "模型没有返回内容，请检查供应商的地址、Key 和模型。",
              });
            }
            // 用表单内容试聊没有版本号（versionNo 为 null），AgentEvent 的类型只写了 number，这里放宽
            send({ ...event, used } as AgentEvent);
            return;
          }
          if (event.type === "error") terminal = true;
          send(event);
        };

        const runner = new PiRunner({
          sessionId,
          knowledge,
          override: { systemPrompt: config.systemPrompt, provider: model.provider, model: model.model },
        });
        recordUserMessage({ sessionId, message: input.question, page: { route: "/admin/config", try: true }, isTest: true });
        const timer = setTimeout(() => abort.abort(new Error("try timeout")), RUN_TIMEOUT_MS);
        try {
          await runner.run({ message: promptWithHistory(input) }, emit, abort.signal);
          if (!terminal) {
            emit({
              type: "done",
              sessionId,
              usage,
              finishReason: abort.signal.aborted ? "aborted" : "stop",
            });
          }
        } catch (error) {
          console.error("[admin] 试跑流式失败:", error);
          if (!terminal) {
            emit({ type: "error", code: "internal_error", message: "试跑失败，请稍后再试" });
          }
        } finally {
          clearTimeout(timer);
          runner.dispose();
          if (!lastError && !answer.trim()) lastError = "EMPTY_ANSWER";
          recordAssistantMessage({
            sessionId,
            content: answer,
            citations,
            suggestions,
            usage,
            latencyMs: Date.now() - startedAt,
            errorCode: lastError,
            finishReason: abort.signal.aborted ? "aborted" : "stop",
            isTest: true,
          });
          try {
            controller.close();
          } catch {
            /* 已关闭 */
          }
        }
      },
      cancel() {
        clientGone = true;
        abort.abort(new Error("client disconnected"));
      },
    });

    return c.body(stream, 200, SSE_HEADERS);
  });
}
