// 真模型 Runner：用 pi 的 AgentSession 跑讲解员。
//
// 两条踩过的坑，改之前请先读：
// 1) 必须把 ResourceLoader 的 agentDir 指向隔离空目录。用真实 ~/.pi/agent 会让它读
//    settings.json 里声明的 pi 包并触发 `npm install -g`，服务直接起不来。
//    凭证仍从真实目录取（AuthStorage / ModelRegistry 显式传路径）。
// 2) 同一会话并发 prompt 会抛错，所以用 queue 把同 sessionId 的请求串起来。
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import {
  AuthStorage,
  createAgentSession,
  DefaultResourceLoader,
  getAgentDir,
  ModelRegistry,
  SessionManager,
} from "@mariozechner/pi-coding-agent";
import type { PageContext } from "../contract.ts";
import type { KnowledgeProvider } from "../knowledge/provider.ts";
import { resolveModelFrom } from "./model.ts";
import { loadActiveConfig, projectModel, withOverride, type ActiveConfig } from "../runtime/config.ts";
import type { Emit, RunInput, Runner } from "./runner.ts";
import { GUIDE_SITE_RULES } from "./prompts.ts";
import { createEmitBox, createGuideTools, type EmitBox } from "./tools.ts";

const SERVER_ROOT = join(import.meta.dirname, "..", "..");

/** 提示词里约定的候选追问分隔标记 */
const SUGGESTION_MARKER = "<<候选>>";
const ISOLATED_AGENT_DIR = join(SERVER_ROOT, ".agentdir");

/** 进提示词前的清洗：去掉换行与方括号并截断，body 里的文字不能伪造出新的一行 [当前页面] 或规则 */
function clean(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value
    .replace(/[\r\n\t]+/g, " ")
    .replace(/[\[\]【】]/g, "")
    .trim()
    .slice(0, max);
}

/** 当前购物车：最多 20 行；qty 不是 1~999 的整数就丢掉该行；类型不对就当没有 */
function cartLines(page: PageContext): string[] {
  if (!Array.isArray(page.cart)) return [];
  const lines: string[] = [];
  for (const row of page.cart.slice(0, 20)) {
    if (!row || typeof row !== "object") continue;
    const one = row as { skuId?: unknown; title?: unknown; variant?: unknown; qty?: unknown };
    const qty = one.qty;
    if (typeof qty !== "number" || !Number.isInteger(qty) || qty < 1 || qty > 999) continue;
    const skuId = clean(one.skuId, 60);
    const title = clean(one.title, 60);
    const variant = clean(one.variant, 60);
    if (!skuId && !title && !variant) continue;
    lines.push(`- ${title || variant || skuId}（${variant || "无规格"}）×${qty} skuId=${skuId || "未知"}`);
  }
  return lines;
}
/** 待付款订单数：只有 0~999 的整数才照写，其余（字符串、负数、小数、超界、对象等）一律写「未知」，绝不把原值拼进提示词 */
function pendingOrdersText(value: unknown): string {
  const ok = typeof value === "number" && Number.isInteger(value) && value >= 0 && value <= 999;
  return ok ? `${value} 笔` : "未知";
}

/** [当前页面] → [当前购物车] → [登录状态] →（已登录才加）[待付款订单]，再拼用户这句话；购物车为空也要写明 */
export function promptWithPage(input: RunInput): string {
  const page: PageContext | undefined = input.page;
  if (!page) return input.message;
  const bits = [
    page.route ? `route=${clean(page.route, 200)}` : "",
    page.exhibitId ? `exhibitId=${clean(page.exhibitId, 60)}` : "",
    page.actId ? `actId=${clean(page.actId, 60)}` : "",
  ].filter(Boolean);
  const cart = cartLines(page);
  const blocks = [
    `[当前页面] ${bits.length > 0 ? bits.join(" ") : "未提供"}`,
    cart.length > 0 ? `[当前购物车]\n${cart.join("\n")}` : "[当前购物车] 空",
    `[登录状态] ${page.signedIn === true ? "已登录" : "未登录"}`,
  ];
  // 未登录时前端不会带 pendingOrders，这一行也不出现；值不可信，只按白名单转述
  if (page.signedIn === true) blocks.push(`[待付款订单] ${pendingOrdersText(page.pendingOrders)}`);
  return `${blocks.join("\n")}\n\n${input.message}`;
}

function readUsage(message: unknown): { inputTokens: number; outputTokens: number } {
  const m = message as { role?: string; usage?: Record<string, number> } | undefined;
  if (!m || m.role !== "assistant" || !m.usage) return { inputTokens: 0, outputTokens: 0 };
  const u = m.usage;
  return {
    inputTokens: u.input ?? u.inputTokens ?? 0,
    outputTokens: u.output ?? u.outputTokens ?? 0,
  };
}

export class PiRunner implements Runner {
  private session: Awaited<ReturnType<typeof createAgentSession>>["session"] | null = null;
  private creating: Promise<unknown> | null = null;
  private queue: Promise<void> = Promise.resolve();
  private disposed = false;
  private readonly box: EmitBox = createEmitBox();

  private readonly opts: {
    sessionId: string;
    knowledge: KnowledgeProvider;
    override?: { systemPrompt?: string; provider?: string; model?: string };
  };
  private active: ActiveConfig | null = null;

  constructor(opts: {
    sessionId: string;
    knowledge: KnowledgeProvider;
    override?: { systemPrompt?: string; provider?: string; model?: string };
  }) {
    this.opts = opts;
  }

  private async ensureSession() {
    if (this.session) return this.session;
    if (this.creating) {
      await this.creating;
      return this.session!;
    }
    this.creating = (async () => {
      mkdirSync(ISOLATED_AGENT_DIR, { recursive: true });
      const realAgentDir = getAgentDir();
      const authStorage = AuthStorage.create(join(realAgentDir, "auth.json"));
      const modelRegistry = ModelRegistry.create(authStorage, join(realAgentDir, "models.json"));

      this.active = await withOverride(this.opts.override);
      const active = this.active;

      const loader = new DefaultResourceLoader({
        cwd: SERVER_ROOT,
        agentDir: ISOLATED_AGENT_DIR,
        // 不管提示词来自 DB 发布配置、测试场 override 还是代码常量，网站导览与购物规则都追加到最后
        systemPromptOverride: () => `${active.systemPrompt}\n\n${GUIDE_SITE_RULES}`,
        noExtensions: true,
        noSkills: true,
        noPromptTemplates: true,
        noThemes: true,
        noContextFiles: true,
      });
      await loader.reload();

      const customTools = createGuideTools({ knowledge: this.opts.knowledge, box: this.box });
      const { session } = await createAgentSession({
        // cwd/agentDir 必须显式给隔离值：否则 createAgentSession 内部会另建
        // SettingsManager(process.cwd(), ~/.pi/agent)，真实全局设置仍会影响运行行为。
        cwd: SERVER_ROOT,
        agentDir: ISOLATED_AGENT_DIR,
        model: (await projectModel(modelRegistry, active)) ?? resolveModelFrom(modelRegistry),
        sessionManager: SessionManager.inMemory(),
        authStorage,
        modelRegistry,
        resourceLoader: loader,
        // 注意：这里不能用 tools: []。tools 是白名单，空数组会把 customTools 一起过滤掉；
        // noTools: "builtin" 只关内置工具（read/bash/edit/write），保留自定义工具。
        noTools: "builtin",
        customTools,
      });
      this.session = session;
    })();
    try {
      await this.creating;
    } finally {
      this.creating = null;
    }
    return this.session!;
  }

  async run(input: RunInput, emit: Emit, signal: AbortSignal): Promise<void> {
    if (this.disposed) {
      emit({ type: "error", code: "session_disposed", message: "会话已结束，请新建会话" });
      return;
    }
    const task = this.queue.then(() => this.doRun(input, emit, signal));
    this.queue = task.then(
      () => {},
      () => {},
    );
    return task;
  }

  private async doRun(input: RunInput, emit: Emit, signal: AbortSignal): Promise<void> {
    const finishAborted = () => {
      emit({
        type: "done",
        sessionId: this.opts.sessionId,
        usage: { inputTokens: 0, outputTokens: 0 },
        finishReason: "aborted",
      });
    };
    // 排队期间客户端可能已经断开/超时：此时绝不能再启动一轮模型调用
    if (this.disposed || signal.aborted) {
      finishAborted();
      return;
    }

    const session = await this.ensureSession();
    if (this.disposed || signal.aborted) {
      finishAborted();
      return;
    }
    // 每轮 run 重新绑定出口，并把「购物车 5 次 / 跳转 1 次 / 工具合计 12 次」的计数清零（不跨轮累计）
    this.box.emit = emit;
    this.box.counts.cart = 0;
    this.box.counts.nav = 0;
    this.box.counts.total = 0;

    const usage = { inputTokens: 0, outputTokens: 0 };
    let stopReason = "stop";

    // 候选追问以 SUGGESTION_MARKER 收尾。流式时这段不能直接吐给用户（会露出生硬的标记），
    // 所以先在缓冲区里找标记：标记之前正常推 token，标记之后单独解析成 suggestions 事件。
    // 缓冲要留足 marker 长度，避免标记被 chunk 边界切断导致误推。
    let raw = "";
    let emitted = 0;
    let markerAt = -1;
    const suggestions: string[] = [];

    const pushText = (text: string) => {
      if (text) emit({ type: "token", text });
    };

    const onDelta = (delta: string) => {
      raw += delta;
      if (markerAt >= 0) return; // 已经进入候选区，正文不再外发
      const idx = raw.indexOf(SUGGESTION_MARKER);
      if (idx >= 0) {
        pushText(raw.slice(emitted, idx));
        emitted = idx;
        markerAt = idx;
        return;
      }
      const safe = Math.max(0, raw.length - SUGGESTION_MARKER.length);
      if (safe > emitted) {
        pushText(raw.slice(emitted, safe));
        emitted = safe;
      }
    };

    const flushTail = () => {
      if (markerAt < 0) {
        pushText(raw.slice(emitted));
        emitted = raw.length;
        return;
      }
      const block = raw.slice(markerAt + SUGGESTION_MARKER.length);
      for (const line of block.split("\n")) {
        const item = line.replace(/^[-*\d.、)\s]+/, "").trim();
        if (item) suggestions.push(item);
      }
      if (suggestions.length > 0) {
        emit({ type: "suggestions", items: suggestions.slice(0, 4) });
      }
    };

    const unsub = session.subscribe((event: any) => {
      if (event.type === "message_update" && event.assistantMessageEvent?.type === "text_delta") {
        onDelta(event.assistantMessageEvent.delta);
      } else if (event.type === "message_end") {
        const u = readUsage(event.message);
        usage.inputTokens += u.inputTokens;
        usage.outputTokens += u.outputTokens;
        if (event.message?.role === "assistant" && typeof event.message.stopReason === "string") {
          stopReason = event.message.stopReason;
        }
      }
    });

    const onAbort = () => {
      session.abort().catch(() => {});
    };
    signal.addEventListener("abort", onAbort, { once: true });

    try {
      await session.prompt(promptWithPage(input));
      flushTail();
      emit({
        type: "done",
        sessionId: this.opts.sessionId,
        usage,
        finishReason: signal.aborted ? "aborted" : stopReason,
      });
    } catch (error) {
      if (this.disposed || signal.aborted) {
        emit({ type: "done", sessionId: this.opts.sessionId, usage, finishReason: "aborted" });
        return;
      }
      throw error;
    } finally {
      signal.removeEventListener("abort", onAbort);
      this.box.emit = () => {};
      try {
        unsub();
      } catch {
        /* 忽略 */
      }
    }
  }

  dispose(): void {
    this.disposed = true;
    this.box.emit = () => {};
    try {
      this.session?.dispose();
    } catch {
      /* 忽略 */
    }
    this.session = null;
  }
}