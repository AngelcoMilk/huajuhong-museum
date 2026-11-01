// Hono 应用工厂。createRunner 是注入点：测试传 MockRunner，生产传 PiRunner。
import { Hono } from "hono";
import type { AgentEvent, ChatRequest } from "./contract.ts";
import { MAX_MESSAGE_CHARS, RUN_TIMEOUT_MS } from "./contract.ts";
import type { KnowledgeProvider } from "./knowledge/provider.ts";
import type { Emit, RunnerFactory } from "./agent/runner.ts";
import { SessionStore } from "./sessions.ts";
import { encodeEvent, SSE_HEADERS } from "./sse.ts";
import type { Context } from "hono";
import { closeSession, recordAssistantMessage, recordUserMessage } from "./admin/record.ts";
import { isGuideEnabled } from "./runtime/config.ts";
import { clientIp } from "./lib/clientIp.ts";
import { issueSessionId, verifySessionId } from "./guideSession.ts";
import {
  checkQuota,
  checkSessionCreate,
  enterConcurrency,
  forgetSession,
  noteMessage,
  noteSessionCreated,
  noteTokens,
  type Rejection,
} from "./guideLimits.ts";

export interface AppDeps {
  createRunner: RunnerFactory;
  knowledge: KnowledgeProvider;
  modelInfo: { provider: string; model: string };
  sessionTtlMs?: number;
  /** 允许跨域的前端来源；不传则用本地开发默认值 + GUIDE_ALLOWED_ORIGINS */
  allowedOrigins?: string[];
}

const DEFAULT_ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5174",
  "http://localhost:4173",
  "http://127.0.0.1:4173",
];

export function resolveAllowedOrigins(explicit?: string[]): Set<string> {
  const fromEnv = (process.env.GUIDE_ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  return new Set(explicit ?? [...DEFAULT_ALLOWED_ORIGINS, ...fromEnv]);
}

/** /api/agent/* 与 /api/track 的请求体上限 */
const BODY_LIMIT_BYTES = 64 * 1024;

function sameHost(origin: string, host: string | undefined): boolean {
  if (!host) return false;
  try {
    return new URL(origin).host.toLowerCase() === host.trim().toLowerCase();
  } catch {
    return false;
  }
}

/** 讲解员的错误信封是顶层 {code,message}，限流类再加 retryAfter + Retry-After */
function reject(c: Context, rejection: Rejection) {
  if (typeof rejection.retryAfterSec === "number") {
    c.header("Retry-After", String(rejection.retryAfterSec));
    return c.json(
      { code: rejection.code, message: rejection.message, retryAfter: rejection.retryAfterSec },
      rejection.status as any,
    );
  }
  return c.json({ code: rejection.code, message: rejection.message }, rejection.status as any);
}

/** 回一个只有单个事件的 SSE 流（开关关闭等） */
function sseOnce(c: Context, event: AgentEvent) {
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(new TextEncoder().encode(encodeEvent(event)));
      try {
        controller.close();
      } catch {
        /* 已关闭 */
      }
    },
  });
  return c.body(stream, 200, SSE_HEADERS);
}

export interface AppBundle {
  app: Hono;
  sessions: SessionStore;
}

export function makeApp(deps: AppDeps): AppBundle {
  const app = new Hono();
  const sessions = new SessionStore(deps.sessionTtlMs);

  const allowedOrigins = resolveAllowedOrigins(deps.allowedOrigins);

  app.use("*", async (c, next) => {
    const origin = c.req.header("origin");
    // 只对白名单来源回显 ACAO；不认识的来源一律不给跨域许可
    if (origin && allowedOrigins.has(origin)) {
      c.header("Access-Control-Allow-Origin", origin);
      c.header("Vary", "Origin");
      c.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
      c.header("Access-Control-Allow-Headers", "Content-Type");
      c.header("Access-Control-Max-Age", "86400");
    }
    if (c.req.method === "OPTIONS") return c.body(null, 204);
    await next();
  });

  // G1：/api/agent/* 带 Origin 却既不在白名单、host 也不等于 Host → 403（含 /session、/chat、/reset）
  app.use("/api/agent/*", async (c, next) => {
    const origin = c.req.header("origin");
    if (!origin) return next();
    if (allowedOrigins.has(origin) || sameHost(origin, c.req.header("host"))) return next();
    return c.json({ code: "guide_origin_denied", message: "请求来源不被允许。" }, 403);
  });

  // G1：请求体上限 64KB（/api/agent/* 与 /api/track）
  app.use("*", async (c, next) => {
    const path = c.req.path;
    const guarded = path.startsWith("/api/agent/") || path === "/api/track";
    if (!guarded || c.req.method === "GET" || c.req.method === "HEAD") return next();
    // 声明了长度的先早退，免得把超大包整个读进内存
    const declared = Number(c.req.header("content-length") ?? "");
    if (Number.isFinite(declared) && declared > BODY_LIMIT_BYTES) {
      return c.json({ code: "too_long", message: "请求体过大" }, 413);
    }
    // chunked（没有 content-length）拿声明长度判不出来，按实际字节数再判一次。
    // Hono 会缓存原文，所以下面处理函数里的 c.req.json() 不受影响。
    const raw = await c.req.text();
    if (new TextEncoder().encode(raw).length > BODY_LIMIT_BYTES) {
      return c.json({ code: "too_long", message: "请求体过大" }, 413);
    }
    await next();
  });

  // G4：不泄露 provider / model / 知识库模式 / 会话数
  app.get("/api/health", (c) => c.json({ ok: true }));

  // G2：会话由服务端签发（无请求体）
  app.post("/api/agent/session", async (c) => {
    if (!(await isGuideEnabled())) {
      return c.json({ code: "guide_disabled", message: "讲解员暂时停用，请稍后再来。" }, 403);
    }
    const ip = clientIp(c);
    const blocked = checkSessionCreate(ip);
    if (blocked) return reject(c, blocked);
    noteSessionCreated(ip);
    return c.json({ sessionId: issueSessionId() });
  });

  app.post("/api/agent/chat", async (c) => {
    // 顺序（全在模型调用与写库之前）：Origin（中间件）→ 请求体 → 签名 → 开关 → 限流配额 → 并发 → 取会话
    let body: ChatRequest | null = null;
    try {
      body = (await c.req.json()) as ChatRequest;
    } catch {
      body = null;
    }

    const rawId = body && typeof body.sessionId === "string" ? body.sessionId.trim() : "";
    if (!rawId) {
      return c.json({ code: "bad_request", message: "sessionId 必填" }, 400);
    }
    const message = body && typeof body.message === "string" ? body.message.trim() : "";
    if (!message) {
      return c.json({ code: "bad_request", message: "message 不能为空" }, 400);
    }
    if (message.length > MAX_MESSAGE_CHARS) {
      return c.json(
        { code: "too_long", message: `message 超过 ${MAX_MESSAGE_CHARS} 字上限` },
        413,
      );
    }

    // G2：无签名 / 改过签名 / 过期 —— 401，且绝不建会话
    const verified = verifySessionId(rawId);
    if (!verified) {
      return c.json({ code: "guide_session_invalid", message: "对话已过期，请重新提问。" }, 401);
    }
    // 入库和内存表只用 uuid 段，签名串不落库
    const sessionId = verified.key;
    const page = body?.page;

    // 开关关闭：SSE 事件、不建会话、不消耗额度
    if (!(await isGuideEnabled())) {
      return sseOnce(c, { type: "error", code: "guide_disabled", message: "讲解员暂时停用，请稍后再来。" });
    }

    // G1：限流与配额（只判不记）
    const ip = clientIp(c);
    const blocked = checkQuota(ip, sessionId);
    if (blocked) return reject(c, blocked);

    // G1：并发闸（同一会话 1 / 每 IP 2 / 全站 8）
    const lease = enterConcurrency(ip, sessionId);
    if (!("leave" in lease)) return reject(c, lease);

    const runner = sessions.getOrCreate(sessionId, deps.createRunner);
    if (!runner) {
      // G3：会话全在忙，腾不出位置
      lease.leave();
      return reject(c, { status: 503, code: "guide_busy", message: "讲解员正忙，请稍后再试。" });
    }

    // 到这里才记账：只有放行的请求计数
    noteMessage(ip, sessionId, 0);

    const abort = new AbortController();
    let terminal = false;

    const startedAt = Date.now();
    let answer = "";
    let citations: unknown[] = [];
    let suggestions: string[] = [];
    let lastUsage = { inputTokens: 0, outputTokens: 0 };
    let lastError: string | null = null;

    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        const encoder = new TextEncoder();
        const emit: Emit = (event: AgentEvent) => {
          let out: AgentEvent = event;
          // 顺手记一份用于会话入库（不影响下发）
          if (event.type === "token" && typeof event.text === "string") answer += event.text;
          else if (event.type === "citation") citations.push(event);
          else if (event.type === "suggestions") suggestions = event.items ?? [];
          else if (event.type === "error") lastError = event.code ?? "error";
          else if (event.type === "done" && event.usage) lastUsage = event.usage;
          // 模型调用失败时，runner 可能只发 done(finishReason=error)、既没有 error 事件也没吐字，
          // 前台会把它当正常完成渲染成空回答气泡。这里补一条对外可读的 error，再照常下发 done；
          // 已经吐过字、正常结束或 aborted 的一律不动。
          if (out.type === "done" && out.finishReason === "error" && answer === "" && !lastError) {
            lastError = "internal_error";
            console.error("[guide] 模型调用失败（finishReason=error 且无输出文本），已补发 error 事件");
            try {
              controller.enqueue(
                encoder.encode(
                  encodeEvent({ type: "error", code: "internal_error", message: "讲解服务暂时不可用，请稍后再试" }),
                ),
              );
            } catch {
              /* 客户端已断开 */
            }
          }
          if (out.type === "done") {
            terminal = true;
            // G2：把客户端拿到的完整串原样还回去，不要换成 uuid 段
            out = { ...out, sessionId: rawId };
          } else if (out.type === "error") {
            terminal = true;
          }
          try {
            controller.enqueue(encoder.encode(encodeEvent(out)));
          } catch {
            /* 客户端已断开 */
          }
        };

        recordUserMessage({ sessionId, message, page });
        const timer = setTimeout(() => abort.abort(new Error("run timeout")), RUN_TIMEOUT_MS);
        try {
          await runner.run({ message, page }, emit, abort.signal);
          if (!terminal) {
            emit({
              type: "done",
              sessionId,
              usage: { inputTokens: 0, outputTokens: 0 },
              finishReason: abort.signal.aborted ? "aborted" : "stop",
            });
          }
        } catch (error) {
          // 原始错误只进服务端日志；对外固定文案，避免泄露凭证/路径/provider 细节
          console.error("[guide] run failed:", error);
          if (!terminal) {
            emit({
              type: "error",
              code: "internal_error",
              message: "讲解服务暂时不可用，请稍后再试",
            });
          }
        } finally {
          clearTimeout(timer);
          // G1：并发额度一定释放（报错、超时、断连都要走到这里）；leave 是幂等的
          lease.leave();
          noteTokens(lastUsage.inputTokens + lastUsage.outputTokens);
          recordAssistantMessage({
            sessionId,
            content: answer,
            citations,
            suggestions,
            usage: lastUsage,
            latencyMs: Date.now() - startedAt,
            errorCode: lastError,
            finishReason: abort.signal.aborted ? "aborted" : "stop",
          });
          try {
            controller.close();
          } catch {
            /* 已关闭 */
          }
        }
      },
      cancel() {
        // 客户端断开：额度立刻还回去，不能等 finally
        lease.leave();
        abort.abort(new Error("client disconnected"));
      },
    });

    return c.body(stream, 200, SSE_HEADERS);
  });

  app.post("/api/agent/reset", async (c) => {
    let body: { sessionId?: string } | null = null;
    try {
      body = (await c.req.json()) as { sessionId?: string };
    } catch {
      body = null;
    }
    const rawId = body?.sessionId?.trim();
    if (!rawId) return c.json({ code: "bad_request", message: "sessionId 必填" }, 400);
    // G2：凭签名才能销毁会话，匿名拿别人的 id 打不动
    const verified = verifySessionId(rawId);
    if (!verified) {
      return c.json({ code: "guide_session_invalid", message: "对话已过期，请重新提问。" }, 401);
    }
    const sessionId = verified.key;
    const existed = sessions.reset(sessionId);
    if (existed) {
      closeSession(sessionId, "reset");
      forgetSession(sessionId);
    }
    return c.json({ ok: true, existed });
  });

  app.notFound((c) => c.json({ code: "not_found", message: "无此接口" }, 404));

  return { app, sessions };
}