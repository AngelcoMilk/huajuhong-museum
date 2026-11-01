// G1 防盗刷：讲解员的限流、配额、并发闸。全部在模型调用和写库之前判定。
// 只有放行的请求才计数；并发额度一定在 finally 里释放，断连/超时/报错都不能漏。
import { prisma } from "./db.ts";
import { createLimiter, type LimiterCheck, type Limiter } from "./lib/rateLimit.ts";

/** 会话与 IP 的窗口类限制统一 10 分钟 */
const WINDOW_MS = 10 * 60 * 1000;

function num(name: string, fallback: number): number {
  const raw = (process.env[name] ?? "").trim();
  if (!raw) return fallback;
  const value = Number(raw);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

/** 硬说明里的默认值，都能用环境变量改（名字同步写进 .env.example） */
export const GUIDE_LIMITS = {
  perSessionWindow: num("GUIDE_SESSION_MSG_LIMIT", 20),
  perSessionTotal: num("GUIDE_SESSION_TOTAL_LIMIT", 60),
  perIpWindow: num("GUIDE_IP_MSG_LIMIT", 40),
  perIpDaily: num("GUIDE_IP_DAILY_LIMIT", 300),
  perIpSessions: num("GUIDE_IP_SESSION_LIMIT", 10),
  siteDailyMessages: num("GUIDE_DAILY_MESSAGE_LIMIT", 3000),
  siteDailyTokens: num("GUIDE_DAILY_TOKEN_LIMIT", 5_000_000),
  sessionConcurrency: num("GUIDE_SESSION_CONCURRENCY", 1),
  ipConcurrency: num("GUIDE_IP_CONCURRENCY", 2),
  siteConcurrency: num("GUIDE_SITE_CONCURRENCY", 8),
} as const;

export interface Rejection {
  status: number;
  code: string;
  message: string;
  /** 限流类才带：还要等多少秒 */
  retryAfterSec?: number;
}

const MESSAGES = {
  rateLimited: "提问有点频繁，请过一会儿再问。",
  sessionFull: "这段对话已经很长了，请开始新对话。",
  quotaExhausted: "讲解员今天的接待已满，请明天再来。",
  sessionBusy: "上一个问题还在回答，请稍等。",
  busy: "讲解员正忙，请稍后再试。",
} as const;

/** 天按 Asia/Shanghai 算 */
const DAY_FMT = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Shanghai" });

export function dayKey(now = new Date()): string {
  return DAY_FMT.format(now);
}

/** 当天 00:00（上海）对应的 UTC 时刻，用于从库里回捞当天数据 */
function startOfDay(now = new Date()): Date {
  const [year, month, day] = dayKey(now).split("-").map(Number);
  // 上海固定 UTC+8，没有夏令时
  return new Date(Date.UTC(year, month - 1, day, 0, 0, 0) - 8 * 60 * 60 * 1000);
}

const sessionLimiter: Limiter = createLimiter({ windowMs: WINDOW_MS, max: GUIDE_LIMITS.perSessionWindow });
const ipLimiter: Limiter = createLimiter({ windowMs: WINDOW_MS, max: GUIDE_LIMITS.perIpWindow });
const ipSessionLimiter: Limiter = createLimiter({ windowMs: WINDOW_MS, max: GUIDE_LIMITS.perIpSessions });

/** 每会话累计条数（会话消失后由 reset 清掉） */
const sessionTotals = new Map<string, number>();
/** 每 IP 当天条数 */
const ipDaily = new Map<string, number>();

/** 全站当天：这两个数重启后不清零，启动时从 AgentMessage 回捞 */
const siteDaily = { day: dayKey(), messages: 0, tokens: 0 };

function ensureSiteDay(): void {
  const today = dayKey();
  if (siteDaily.day !== today) {
    siteDaily.day = today;
    siteDaily.messages = 0;
    siteDaily.tokens = 0;
    ipDaily.clear();
  }
}

/** 启动时调用一次：把当天的消息数与 token 数从库里补回来 */
export async function hydrateDailyCounters(): Promise<void> {
  ensureSiteDay();
  try {
    const since = startOfDay();
    const users = await prisma.agentMessage.count({
      where: { role: "user", createdAt: { gte: since }, session: { isTest: false } },
    });
    const assistants = await prisma.agentMessage.findMany({
      where: { role: "assistant", createdAt: { gte: since }, usageJson: { not: null }, session: { isTest: false } },
      select: { usageJson: true },
    });
    let tokens = 0;
    for (const row of assistants) {
      try {
        const usage = JSON.parse(row.usageJson ?? "{}") as { inputTokens?: number; outputTokens?: number };
        tokens += (Number(usage.inputTokens) || 0) + (Number(usage.outputTokens) || 0);
      } catch {
        /* 单条坏了就跳过，别让启动失败 */
      }
    }
    siteDaily.messages = users;
    siteDaily.tokens = tokens;
  } catch (error) {
    console.error("[guide] 回捞当天配额失败，从 0 开始:", error);
  }
}

/** 每会话累计条数清零（/reset 和淘汰时调用） */
export function forgetSession(key: string): void {
  sessionTotals.delete(key);
}

function rejectRate(state: LimiterCheck): Rejection {
  return {
    status: 429,
    code: "guide_rate_limited",
    message: MESSAGES.rateLimited,
    retryAfterSec: state.retryAfterSec,
  };
}

/** 限流 + 配额：只判不计数。放行后由 noteMessage 记账。 */
export function checkQuota(ip: string, sessionKey: string): Rejection | null {
  ensureSiteDay();

  if ((sessionTotals.get(sessionKey) ?? 0) >= GUIDE_LIMITS.perSessionTotal) {
    return { status: 429, code: "guide_session_full", message: MESSAGES.sessionFull };
  }
  const perSession = sessionLimiter.check(sessionKey);
  if (!perSession.ok) return rejectRate(perSession);

  const perIp = ipLimiter.check(ip);
  if (!perIp.ok) return rejectRate(perIp);

  if ((ipDaily.get(ip) ?? 0) >= GUIDE_LIMITS.perIpDaily) {
    return { status: 429, code: "guide_rate_limited", message: MESSAGES.rateLimited, retryAfterSec: 60 };
  }
  if (siteDaily.messages >= GUIDE_LIMITS.siteDailyMessages || siteDaily.tokens >= GUIDE_LIMITS.siteDailyTokens) {
    return { status: 429, code: "guide_quota_exhausted", message: MESSAGES.quotaExhausted };
  }
  return null;
}

/** 建会话的每 IP 限额：只在真正要新建时判 */
export function checkSessionCreate(ip: string): Rejection | null {
  const state = ipSessionLimiter.check(ip);
  return state.ok ? null : { status: 429, code: "guide_rate_limited", message: MESSAGES.rateLimited, retryAfterSec: state.retryAfterSec };
}

export function noteSessionCreated(ip: string): void {
  ipSessionLimiter.hit(ip);
}

/** 放行后记账：三个窗口 + 每 IP 当天 + 全站当天 */
export function noteMessage(ip: string, sessionKey: string, tokens: number): void {
  ensureSiteDay();
  sessionLimiter.hit(sessionKey);
  ipLimiter.hit(ip);
  sessionTotals.set(sessionKey, (sessionTotals.get(sessionKey) ?? 0) + 1);
  ipDaily.set(ip, (ipDaily.get(ip) ?? 0) + 1);
  siteDaily.messages += 1;
  siteDaily.tokens += Math.max(0, Math.round(tokens));
}

/** 一轮结束后补记 token 数（全站每天的量） */
export function noteTokens(tokens: number): void {
  ensureSiteDay();
  siteDaily.tokens += Math.max(0, Math.round(tokens));
}

/* ── 并发闸 ─────────────────────────────────────────── */

let siteInFlight = 0;
const sessionInFlight = new Map<string, number>();
const ipInFlight = new Map<string, number>();

function bump(map: Map<string, number>, key: string, delta: number): void {
  const next = (map.get(key) ?? 0) + delta;
  if (next <= 0) map.delete(key);
  else map.set(key, next);
}

export interface ConcurrencyLease {
  leave: () => void;
}

/** 并发额度；拿不到就返回拒绝原因。leave() 必须放在 finally 里调用。 */
export function enterConcurrency(ip: string, sessionKey: string): ConcurrencyLease | Rejection {
  if ((sessionInFlight.get(sessionKey) ?? 0) >= GUIDE_LIMITS.sessionConcurrency) {
    return { status: 409, code: "guide_session_busy", message: MESSAGES.sessionBusy };
  }
  if ((ipInFlight.get(ip) ?? 0) >= GUIDE_LIMITS.ipConcurrency) {
    return { status: 503, code: "guide_busy", message: MESSAGES.busy };
  }
  if (siteInFlight >= GUIDE_LIMITS.siteConcurrency) {
    return { status: 503, code: "guide_busy", message: MESSAGES.busy };
  }
  siteInFlight += 1;
  bump(sessionInFlight, sessionKey, 1);
  bump(ipInFlight, ip, 1);
  let released = false;
  return {
    leave() {
      // 幂等：断连与正常结束可能都会走到
      if (released) return;
      released = true;
      siteInFlight = Math.max(0, siteInFlight - 1);
      bump(sessionInFlight, sessionKey, -1);
      bump(ipInFlight, ip, -1);
    },
  };
}

/** 会话是否还有进行中的回答（会话淘汰要跳过这些） */
export function isSessionBusy(sessionKey: string): boolean {
  return (sessionInFlight.get(sessionKey) ?? 0) > 0;
}
