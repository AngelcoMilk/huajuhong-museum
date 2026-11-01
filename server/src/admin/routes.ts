// 后台路由。/api/admin/* 全部需要管理员 JWT（登录接口除外）。
import { Hono } from "hono";
import type { Context } from "hono";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { prisma } from "../db.ts";
import { encryptSecret } from "../lib/secrets.ts";
import { clearAdminCookie, login, me, requireAdmin, setAdminCookie, type AdminEnv } from "./auth.ts";
import { clientIp } from "../lib/clientIp.ts";
import { resolveAllowedOrigins } from "../app.ts";
import { invalidateConfigCache, loadActiveConfig } from "../runtime/config.ts";
import { audit } from "./audit.ts";
import { looksLikeHuazhou, parseCoord, toPointEntry } from "./coord.ts";
import { registerKbExtra } from "./kb-extra.ts";
import { registerVr } from "./vr.ts";
import { analyzeOneSession, estimateAnalysis, latestSessionReport, runGlobalAnalysis } from "../analysis/run.ts";
import {
  fetchModelList,
  currentPublishedModel,
  modelSelectable,
  normaliseModels,
  parseModelsJson,
  providerReady,
  publicView,
  recordTest,
  testProvider,
  validateApi,
  validateBaseUrl,
  validateDisplayName,
  validateEnvName,
  validateLiteralKey,
  validateModels,
  validateProviderName,
} from "./providers.ts";
import { registerPiProviders } from "./providers-pi.ts";
import { multi, paging, sortSpec, sortToOrderBy, timeQuery } from "./lists.ts";
import { registerStats } from "./stats.ts";
import { registerBatch } from "./batch.ts";
import { registerGuideTry } from "./guide-try.ts";
import { publishIssues, publishIssueMessage, readSkuFields, registerProducts } from "./products.ts";
import { registerConfigVersions } from "./config-versions.ts";
import { withConfigLock } from "./config-lock.ts";
import { registerAccounts } from "./accounts.ts";
import { blocksToText, isSafeSrc, parseBlocks, validateBlocks } from "./blocks.ts";
import { registerContentPages } from "./content-pages.ts";

/** Prisma P2025：要更新的记录不存在（避免「改不存在的 id」变成 500） */
function isMissingRecord(error: unknown): boolean {
  return (error as { code?: string } | null)?.code === "P2025";
}

// ── 展项（park/museum/history）共用的校验、草稿与原子写入 ──────────
const EXHIBIT_BOARDS = ["park", "museum", "history"] as const;

/** 是不是展项管理覆盖的板块 */
export function isExhibitBoard(board: string | undefined | null): boolean {
  return !!board && (EXHIBIT_BOARDS as readonly string[]).includes(board);
}

/** 展项文本字段限长 */
const EXHIBIT_LIMITS: Record<string, number> = {
  subtitle: 200,
  author: 200,
  sourceName: 200,
  summary: 1000,
  date: 40,
  section: 40,
};

interface FieldError {
  field: string;
  code: string;
  message: string;
}

/**
 * 展项字段：先判类型再取用，不认识或不合法的键报错（不静默丢弃）。
 * title 在 POST 时必填（requireTitle），在 PATCH 时可以不给。
 */
function readExhibitFields(
  body: any,
  opts: { requireTitle?: boolean } = {},
): { ok: true; data: any } | { ok: false; error: FieldError } {
  const data: any = {};
  if (body?.title !== undefined) {
    if (typeof body.title !== "string") {
      return { ok: false, error: { field: "title", code: "INVALID_TITLE", message: "标题必须是文字。" } };
    }
    const title = body.title.trim();
    if (!title || title.length > 200) {
      return { ok: false, error: { field: "title", code: "INVALID_TITLE", message: "标题要在 1–200 字之间。" } };
    }
    data.title = title;
  } else if (opts.requireTitle) {
    return { ok: false, error: { field: "title", code: "INVALID_TITLE", message: "标题不能为空。" } };
  }
  for (const [key, max] of Object.entries(EXHIBIT_LIMITS)) {
    if (body?.[key] === undefined) continue;
    const raw = body[key];
    if (typeof raw !== "string") {
      return { ok: false, error: { field: key, code: "INVALID_FIELD", message: `${key} 必须是文字。` } };
    }
    const text = raw.trim();
    if (text.length > max) {
      return { ok: false, error: { field: key, code: "INVALID_FIELD", message: `${key} 不能超过 ${max} 字。` } };
    }
    data[key] = text;
  }
  if (body?.type !== undefined) {
    if (typeof body.type !== "string" || !body.type.trim()) {
      return { ok: false, error: { field: "type", code: "INVALID_TYPE", message: "类型不能为空。" } };
    }
    data.type = body.type.trim();
  }
  if (body?.coverUrl !== undefined) {
    // 空串、纯空白都当没有封面
    const coverUrl = typeof body.coverUrl === "string" ? body.coverUrl.trim() : body.coverUrl;
    if (coverUrl === null || coverUrl === "") data.coverUrl = null;
    else if (isSafeSrc(coverUrl)) data.coverUrl = coverUrl;
    else return { ok: false, error: { field: "coverUrl", code: "INVALID_URL", message: "封面地址要在 http(s) 或站内 / 开头。" } };
  }
  if (body?.sourceUrl !== undefined) {
    if (body.sourceUrl === null || body.sourceUrl === "") data.sourceUrl = null;
    else if (typeof body.sourceUrl === "string" && /^https?:\/\//.test(body.sourceUrl.trim())) {
      data.sourceUrl = body.sourceUrl.trim();
    } else {
      return { ok: false, error: { field: "sourceUrl", code: "INVALID_URL", message: "来源地址只收 http(s) 链接。" } };
    }
  }
  if (typeof body?.labelJson === "string") data.labelJson = body.labelJson;
  return { ok: true, data };
}

/** draftJson → 草稿对象；坏数据、空、非对象都回 null，永不抛 */
function readDraft(raw: string | null | undefined): any {
  if (typeof raw !== "string" || !raw.trim()) return null;
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/** baseUpdatedAt（毫秒）：不传回 null；非法值当没传 */
function readBaseUpdatedAt(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : null;
}

/** 正文块：不合法时回 400 用的信息（details.index 是 0 起的块序号） */
function invalidBlocks(c: Context, index: number, reason: string) {
  const prefix = index >= 0 ? `第 ${index + 1} 块不合法：` : "";
  return c.json(
    { error: { code: "INVALID_BLOCKS", message: `${prefix}${reason}`, field: "blocks", details: { index, reason } } },
    400,
  );
}

/** baseUpdatedAt 对不上：409，details 里给库里的当前值，前端拿去刷新 */
function itemChanged(c: Context, currentUpdatedAt: number | null) {
  return c.json(
    { error: { code: "ITEM_CHANGED", message: "这条内容在别处被改过了，请刷新后再改。", details: { updatedAt: currentUpdatedAt } } },
    409,
  );
}

/**
 * 展项写库。给了 baseUpdatedAt 就走 updateMany + where，一条 SQL 里比对 updatedAt，
 * 不是先读后写；对不上回 409 用的当前值。
 */
async function writeExhibit(
  id: string,
  data: any,
  baseUpdatedAt: number | null,
): Promise<{ ok: true; status: string; updatedAt: number } | { ok: false; currentUpdatedAt: number | null }> {
  if (baseUpdatedAt !== null) {
    const result = await prisma.item.updateMany({ where: { id, updatedAt: new Date(baseUpdatedAt) }, data });
    if (result.count === 0) {
      const now = await prisma.item.findUnique({ where: { id }, select: { updatedAt: true } });
      return { ok: false, currentUpdatedAt: now?.updatedAt.getTime() ?? null };
    }
  } else {
    await prisma.item.update({ where: { id }, data });
  }
  const item = await prisma.item.findUnique({ where: { id }, select: { status: true, updatedAt: true } });
  return { ok: true, status: item?.status ?? "", updatedAt: item?.updatedAt.getTime() ?? 0 };
}

function fail(c: Context, status: number, code: string, message: string, field?: string) {
  return c.json({ error: { code, message, ...(field ? { field } : {}) } }, status as any);
}

const SERVER_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

// 列表排序白名单：不在白名单里的 sort 一律 400 BAD_SORT
export const ITEM_SORTS = ["updatedAt", "title", "id", "date", "status", "sort"] as const;
export const ENTERPRISE_SORTS = ["id", "title"] as const;
export const ORDER_SORTS = ["createdAt", "totalCents", "paidAt"] as const;
export const CUSTOMER_SORTS = ["createdAt"] as const;
export const SLICE_SORTS = ["id", "title", "source"] as const;
export const SESSION_SORTS = ["startedAt", "turnCount"] as const;
export const GAP_SORTS = ["count", "lastSeenAt"] as const;
export const AUDIT_SORTS = ["createdAt"] as const;

/**
 * 把 TrackEvent 明细按「日 + 板块」聚合成 DailyBoardStat。
 * 幂等：同一天重复跑是覆盖写入，不会翻倍。
 */
async function aggregateDaily(days: number) {
  const since = new Date(Date.now() - days * 864e5);
  const events = await prisma.trackEvent.findMany({
    where: { ts: { gte: since } },
    select: { ts: true, kind: true, route: true, visitorId: true, durationMs: true },
  });
  type Bucket = { pv: number; clicks: number; dwellSum: number; dwellN: number; visitors: Set<string> };
  const buckets = new Map<string, Bucket>();
  const key = (day: string, board: string) => `${day}|${board}`;
  for (const event of events) {
    const day = dayKey(event.ts);
    const board = event.route.split("/")[1] || "home";
    const id = key(day, board);
    const bucket = buckets.get(id) ?? { pv: 0, clicks: 0, dwellSum: 0, dwellN: 0, visitors: new Set<string>() };
    bucket.visitors.add(event.visitorId);
    if (event.kind === "page_view") bucket.pv += 1;
    else if (event.kind === "click") bucket.clicks += 1;
    else if (event.kind === "page_leave") {
      if (event.durationMs) {
        bucket.dwellSum += event.durationMs;
        bucket.dwellN += 1;
      }
    }
    buckets.set(id, bucket);
  }
  let written = 0;
  for (const [id, bucket] of buckets) {
    const [day, board] = id.split("|");
    const avgDwellMs = bucket.dwellN ? Math.round(bucket.dwellSum / bucket.dwellN) : 0;
    await prisma.dailyBoardStat.upsert({
      where: { day_board: { day, board } },
      create: { day, board, pv: bucket.pv, uv: bucket.visitors.size, clicks: bucket.clicks, avgDwellMs },
      update: { pv: bucket.pv, uv: bucket.visitors.size, clicks: bucket.clicks, avgDwellMs },
    });
    written += 1;
  }
  return { days, events: events.length, buckets: written };
}

function dayKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** 中文无分词：二字词元 + 整段匹配，和讲解员检索同一思路 */
function scoreSlice(query: string, slice: { title: string; content: string }): number {
  const q = query.trim().toLowerCase();
  if (!q) return 0;
  let score = 0;
  if (slice.title.toLowerCase().includes(q)) score += 8;
  if (slice.content.toLowerCase().includes(q)) score += 4;
  const grams = new Set<string>();
  for (let i = 0; i < q.length - 1; i += 1) grams.add(q.slice(i, i + 2));
  for (const gram of grams) {
    if (slice.title.toLowerCase().includes(gram)) score += 2.5;
    if (slice.content.toLowerCase().includes(gram)) score += 1;
  }
  return score;
}

/** G2（登录部分）：登录请求体上限 8KB */
const LOGIN_BODY_LIMIT = 8 * 1024;

/** 声明的长度超限就不用读；没有 content-length（chunked）的请求读出来按实际字节数判 */
function declaredTooLarge(c: Context, limit: number): boolean {
  const raw = c.req.header("content-length");
  if (!raw) return false;
  const size = Number(raw);
  return Number.isFinite(size) && size > limit;
}

/** 读一次 body 并返回原文；超过 limit 返回 null（Hono 会缓存原文，后续不必再读） */
async function readBodyWithin(c: Context, limit: number): Promise<string | null> {
  if (declaredTooLarge(c, limit)) return null;
  const raw = await c.req.text().catch(() => "");
  if (Buffer.byteLength(raw, "utf8") > limit) return null;
  return raw;
}

export function makeAdminApp() {
  const app = new Hono<AdminEnv>();
  const allowedOrigins = resolveAllowedOrigins();

  // CSRF：非 GET/HEAD 且带了 Origin 时，只放行白名单来源或与 Host 同源；没带 Origin 放行
  //（浏览器跨站 POST 一定带 Origin；vite 代理 changeOrigin:false 时 Host 与 Origin 一致）
  app.use("*", async (c, next) => {
    const method = c.req.method.toUpperCase();
    if (method === "GET" || method === "HEAD") return next();
    const origin = c.req.header("origin");
    if (origin && !allowedOrigins.has(origin)) {
      let sameHost = false;
      try {
        sameHost = new URL(origin).host === (c.req.header("host") ?? "");
      } catch {
        sameHost = false;
      }
      if (!sameHost) return c.json({ error: { code: "CSRF_ORIGIN", message: "请求来源不被允许。" } }, 403);
    }
    await next();
  });

  // ── 公开：登录 ───────────────────────────────────────
  app.post("/auth/login", async (c) => {
    const raw = await readBodyWithin(c, LOGIN_BODY_LIMIT);
    if (raw === null) return fail(c, 413, "PAYLOAD_TOO_LARGE", "请求体过大。");
    let body: unknown = null;
    try {
      body = raw ? JSON.parse(raw) : null;
    } catch {
      body = null;
    }
    // 限流判定与失败审计都在 login() 里：只有触发封禁的那一次写 auth.login_locked
    const result = await login(body, clientIp(c));
    if (!result.ok) {
      if (result.retryAfterSec) c.header("Retry-After", String(Math.ceil(result.retryAfterSec)));
      return fail(c, result.status, result.code, result.message);
    }
    // 登录态只写进 HttpOnly Cookie，响应里不再出现 token
    setAdminCookie(c, result.token);
    return c.json({ user: result.user });
  });

  // ── 以下全部需要登录 + 有权限（requireAdmin 里一并做授权：默认拒绝，运营走 permissions.ts 白名单） ──
  const p = new Hono<AdminEnv>();
  p.use("*", requireAdmin);

  p.get("/auth/me", async (c) => {
    const user = await me(c.get("admin"));
    if (!user) return fail(c, 401, "UNAUTHORIZED", "登录状态已失效，请重新登录。");
    return c.json(user);
  });

  // 退出登录真正吊销：tokenVersion +1，这个账号在所有设备上的旧 token 立刻失效（同一套机制）
  p.post("/auth/logout", async (c) => {
    const claims = c.get("admin");
    // updateMany：账号可能刚好被别的管理员删了，那时行数为 0，按已退出处理，不能 500
    const revoked = await prisma.adminUser.updateMany({
      where: { id: claims.sub },
      data: { tokenVersion: { increment: 1 } },
    });
    // 行没变就不写审计（账号已不存在）；审计只记谁退出，不记 token
    if (revoked.count > 0) {
      audit({ actor: claims.username, action: "admin.logout", target: claims.username });
    }
    clearAdminCookie(c);
    return c.body(null, 204);
  });

  // ── 数据面板 ────────────────────────────────────────
  p.get("/stats/overview", async (c) => {
    const [orderTotal, orderPaid, orderPending, paidSum, items, sessions] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: "paid" } }),
      prisma.order.count({ where: { status: "pending_payment" } }),
      prisma.order.aggregate({ _sum: { totalCents: true }, where: { status: "paid" } }),
      prisma.item.groupBy({ by: ["status"], _count: { _all: true } }),
      prisma.agentSession.aggregate({
        _count: { _all: true },
        _sum: { turnCount: true, inputTokens: true, outputTokens: true },
      }),
    ]);
    const [gapPending, trackRecent, skuCount, providerEnabled] = await Promise.all([
      prisma.kbGap.count({ where: { status: "pending" } }),
      prisma.trackEvent.count({ where: { ts: { gte: new Date(Date.now() - 7 * 864e5) } } }),
      prisma.productSku.count(),
      prisma.provider.count({ where: { enabled: true } }),
    ]);
    const itemCount = (status: string) => items.find((i) => i.status === status)?._count._all ?? 0;
    return c.json({
      orders: {
        total: orderTotal,
        paid: orderPaid,
        pending: orderPending,
        paidAmountCents: paidSum._sum.totalCents ?? 0,
      },
      contents: {
        total: items.reduce((sum, i) => sum + i._count._all, 0),
        published: itemCount("published"),
        draft: itemCount("draft") + itemCount("archived"),
        skus: skuCount,
      },
      guide: {
        sessions: sessions._count._all ?? 0,
        turns: sessions._sum.turnCount ?? 0,
        inputTokens: sessions._sum.inputTokens ?? 0,
        outputTokens: sessions._sum.outputTokens ?? 0,
        gaps: gapPending,
      },
      traffic: { events7d: trackRecent },
      providers: { enabled: providerEnabled },
    });
  });

  p.get("/stats/orders-trend", async (c) => {
    const days = Math.min(90, Math.max(1, Number(c.req.query("days") ?? 30) || 30));
    const since = new Date(Date.now() - days * 864e5);
    const orders = await prisma.order.findMany({
      where: { createdAt: { gte: since } },
      select: { createdAt: true, totalCents: true, status: true },
    });
    const buckets = new Map<string, { day: string; count: number; amountCents: number }>();
    for (let i = days - 1; i >= 0; i -= 1) {
      const key = dayKey(new Date(Date.now() - i * 864e5));
      buckets.set(key, { day: key, count: 0, amountCents: 0 });
    }
    for (const order of orders) {
      const key = dayKey(order.createdAt);
      const bucket = buckets.get(key);
      if (!bucket) continue;
      bucket.count += 1;
      if (order.status === "paid") bucket.amountCents += order.totalCents;
    }
    return c.json([...buckets.values()]);
  });

  p.get("/stats/board-dwell", async (c) => {
    const days = Math.min(90, Math.max(1, Number(c.req.query("days") ?? 7) || 7));
    await aggregateDaily(days).catch(() => {});
    const rows = await prisma.dailyBoardStat.groupBy({
      by: ["board"],
      _sum: { pv: true, clicks: true, avgDwellMs: true },
      _count: { _all: true },
      where: { day: { gte: new Date(Date.now() - days * 864e5).toISOString().slice(0, 10) } },
    });
    if (rows.length > 0) {
      return c.json(
        rows.map((r) => ({
          board: r.board,
          pv: r._sum.pv ?? 0,
          clicks: r._sum.clicks ?? 0,
          avgDwellMs: r._count._all ? Math.round((r._sum.avgDwellMs ?? 0) / r._count._all) : 0,
        })),
      );
    }
    // 明细还没聚合成日表时，直接算明细
    const since = new Date(Date.now() - days * 864e5);
    const events = await prisma.trackEvent.findMany({
      where: { ts: { gte: since }, kind: { in: ["page_leave", "click"] } },
      select: { kind: true, route: true, durationMs: true },
    });
    const map = new Map<string, { board: string; pv: number; clicks: number; dwellSum: number; dwellN: number }>();
    for (const e of events) {
      const board = e.route.split("/")[1] || "home";
      const row = map.get(board) ?? { board, pv: 0, clicks: 0, dwellSum: 0, dwellN: 0 };
      if (e.kind === "page_leave") {
        row.pv += 1;
        if (e.durationMs) {
          row.dwellSum += e.durationMs;
          row.dwellN += 1;
        }
      } else {
        row.clicks += 1;
      }
      map.set(board, row);
    }
    return c.json(
      [...map.values()].map((r) => ({
        board: r.board,
        pv: r.pv,
        clicks: r.clicks,
        avgDwellMs: r.dwellN ? Math.round(r.dwellSum / r.dwellN) : 0,
      })),
    );
  });

  // ── 内容 ────────────────────────────────────────────
  p.get("/items", async (c) => {
    const { page, pageSize, skip, take } = paging(c);
    const boards = multi(c.req.query("board"));
    const section = c.req.query("section");
    const statuses = multi(c.req.query("status"));
    const q = c.req.query("q")?.trim();
    const sort = sortSpec(c, ITEM_SORTS);
    if (!sort) return fail(c, 400, "BAD_SORT", "排序字段不支持。", "sort");
    const where: any = {};
    if (boards) where.board = { in: boards };
    if (section) where.section = section;
    if (statuses) where.status = { in: statuses };
    if (q) where.OR = [{ title: { contains: q } }, { id: { contains: q } }];
    // 展项管理只看 park/museum/history：单选这三块时把 VR 行（type='VR场景'）挡掉
    if (boards && boards.length === 1 && isExhibitBoard(boards[0])) where.type = { not: "VR场景" };

    const [total, rows] = await Promise.all([
      prisma.item.count({ where }),
      prisma.item.findMany({
        where,
        skip,
        take,
        orderBy: sortToOrderBy(sort, [{ board: "asc" }, { sort: "asc" }, { id: "asc" }]),
        select: {
          id: true,
          board: true,
          section: true,
          type: true,
          title: true,
          subtitle: true,
          summary: true,
          author: true,
          sourceName: true,
          coverUrl: true,
          parentId: true,
          date: true,
          status: true,
          sort: true,
          draftJson: true,
          updatedAt: true,
          _count: { select: { media: true } },
          // 缩略图：首张 image 媒体（按 sort 升序），有封面时优先用封面
          media: { where: { kind: "image" }, orderBy: { sort: "asc" }, take: 1, select: { url: true } },
        },
      }),
    ]);
    return c.json({
      items: rows.map((r) => ({
        id: r.id,
        board: r.board,
        section: r.section,
        type: r.type,
        title: r.title,
        subtitle: r.subtitle,
        summary: r.summary,
        author: r.author,
        sourceName: r.sourceName,
        coverUrl: r.coverUrl,
        parentId: r.parentId,
        date: r.date,
        status: r.status,
        sort: r.sort,
        mediaCount: r._count.media,
        thumbUrl: r.coverUrl ?? r.media[0]?.url ?? null,
        hasDraft: r.draftJson !== null,
        updatedAt: r.updatedAt.getTime(),
      })),
      total,
      page,
      pageSize,
    });
  });

  p.get("/items/:id", async (c) => {
    const id = c.req.param("id");
    const item = await prisma.item.findUnique({
      where: { id },
      include: { media: { orderBy: { sort: "asc" } }, enterprise: true, product: true },
    });
    if (!item) return fail(c, 404, "ITEM_NOT_FOUND", "没有找到这条内容。");
    const { blocksJson, draftJson, ...rest } = item;
    return c.json({
      ...rest,
      // 正文只给解析好的块，原始 JSON 不外露
      blocks: parseBlocks(item),
      draft: readDraft(draftJson),
      hasDraft: draftJson !== null,
      createdAt: item.createdAt.getTime(),
      updatedAt: item.updatedAt.getTime(),
      media: item.media.map((m) => ({ ...m })),
    });
  });

  /**
   * 目标父级本身的合法性：必须是园区栏目、自身没有父级（只有一层）。
   * 不含「不能是自己」「自己有子项」这两条要按条目算的判断——批量 reorder 一次判一批。
   */
  async function checkParentTarget(
    board: string,
    raw: unknown,
  ): Promise<{ ok: true; value: string | null } | { ok: false; code: string; message: string }> {
    if (board !== "park") return { ok: false, code: "INVALID_PARENT", message: "只有园区栏目可以挂父级。" };
    if (raw === null || raw === undefined || raw === "") return { ok: true, value: null };
    if (typeof raw !== "string") return { ok: false, code: "INVALID_PARENT", message: "父级编号必须是文字。" };
    const parentId = raw.trim();
    if (!parentId) return { ok: true, value: null };
    const parent = await prisma.item.findUnique({
      where: { id: parentId },
      select: { board: true, type: true, parentId: true },
    });
    if (!parent || parent.board !== "park") return { ok: false, code: "INVALID_PARENT", message: "父级栏目不存在。" };
    if (parent.type !== "column") return { ok: false, code: "INVALID_PARENT", message: "父级必须是园区栏目。" };
    if (parent.parentId) return { ok: false, code: "INVALID_PARENT", message: "只能挂一层，父级本身也不能有父级。" };
    return { ok: true, value: parentId };
  }

  /**
   * 单条 parentId 校验（只有园区栏目有父级）：在目标合法性之外，
   * 再判「不能是自己」「自己有子项时不能再挂到别人下面」。null / 空串表示移到顶层。
   */
  async function checkParent(
    board: string,
    id: string,
    raw: unknown,
  ): Promise<{ ok: true; value: string | null } | { ok: false; code: string; message: string }> {
    const target = await checkParentTarget(board, raw);
    if (!target.ok) return target;
    if (target.value === null) return { ok: true, value: null };
    if (target.value === id) return { ok: false, code: "INVALID_PARENT", message: "不能把自己设成父级。" };
    const children = await prisma.item.count({ where: { parentId: id } });
    if (children > 0) return { ok: false, code: "INVALID_PARENT", message: "这条下面还有子文章，不能再挂到别的栏目下。" };
    return { ok: true, value: target.value };
  }

  /** 展项 PATCH 与 PUT /draft 共用：校验字段、块、父级、状态，拼出要写的数据 */
  async function buildExhibitData(
    c: Context,
    id: string,
    board: string,
    body: any,
    opts: { requireTitle?: boolean } = {},
  ): Promise<{ ok: true; data: any; blocks: any[] | null; status?: string } | { ok: false; response: Response }> {
    const read = readExhibitFields(body, opts);
    if (!read.ok) return { ok: false, response: fail(c, 400, read.error.code, read.error.message, read.error.field) };
    const data = read.data;
    let status: string | undefined;
    if (body?.status !== undefined) {
      if (body.status !== "draft" && body.status !== "published" && body.status !== "archived") {
        return { ok: false, response: fail(c, 400, "INVALID_STATUS", "状态只能是 draft / published / archived。", "status") };
      }
      status = body.status;
      data.status = status;
    }
    let blocks: any[] | null = null;
    if (body?.blocks !== undefined) {
      const checked = validateBlocks(body.blocks);
      if (!checked.ok) return { ok: false, response: invalidBlocks(c, checked.index, checked.reason) };
      blocks = checked.blocks;
      // 展项不接受手写正文：blocksJson 是权威，body 由块生成（给检索用）
      data.blocksJson = JSON.stringify(checked.blocks);
      data.body = blocksToText(checked.blocks);
    }
    if (body?.parentId !== undefined) {
      const parent = await checkParent(board, id, body.parentId);
      if (!parent.ok) return { ok: false, response: fail(c, 400, parent.code, parent.message, "parentId") };
      data.parentId = parent.value;
    }
    if (typeof body?.sort === "number" && Number.isInteger(body.sort)) data.sort = body.sort;
    return { ok: true, data, blocks, ...(status ? { status } : {}) };
  }

  p.patch("/items/:id", async (c) => {
    const id = c.req.param("id");
    const exists = await prisma.item.findUnique({ where: { id } });
    if (!exists) return fail(c, 404, "ITEM_NOT_FOUND", "没有找到这条内容。");
    // 商品的字段/上下架/audit 统一走 /products，内容接口不再允许改商品（媒体接口不受影响）
    if (exists.board === "product") return fail(c, 400, "INVALID_BOARD", "商品请到商品与库存修改。", "board");
    const body = (await c.req.json().catch(() => ({}))) as any;

    // 企业、VR 等其他板块：行为和以前一模一样
    if (!isExhibitBoard(exists.board)) {
      const data: any = {};
      for (const key of ["title", "section", "type", "date", "sourceUrl", "body", "status"] as const) {
        if (typeof body[key] === "string") data[key] = body[key];
      }
      if (typeof body.sort === "number") data.sort = body.sort;
      if (typeof body.labelJson === "string") data.labelJson = body.labelJson;
      if (Object.keys(data).length === 0) return fail(c, 400, "NO_CHANGES", "没有可更新的字段。");
      const item = await prisma.item.update({ where: { id }, data });
      return c.json({ id: item.id, updatedAt: item.updatedAt.getTime() });
    }

    const built = await buildExhibitData(c, id, exists.board, body);
    if (!built.ok) return built.response;
    const data = built.data;
    // 发布即清草稿：线上内容已经是这份了
    if (built.status === "published") data.draftJson = null;
    if (Object.keys(data).length === 0) return fail(c, 400, "NO_CHANGES", "没有可更新的字段。");
    const written = await writeExhibit(id, data, readBaseUpdatedAt(body?.baseUpdatedAt));
    if (!written.ok) return itemChanged(c, written.currentUpdatedAt);
    audit({
      actor: c.get("admin").username,
      action: "item.update",
      target: id,
      detail: { board: exists.board, fields: Object.keys(data) },
    });
    return c.json({ id, status: written.status, updatedAt: written.updatedAt });
  });

  // 存草稿：published 行只写 draftJson（线上一个字段都不动，也不改 updatedAt）；
  // 草稿/归档行没有「线上版本」这回事，直接写列。
  p.put("/items/:id/draft", async (c) => {
    const id = c.req.param("id");
    const exists = await prisma.item.findUnique({ where: { id } });
    if (!exists) return fail(c, 404, "ITEM_NOT_FOUND", "没有找到这条内容。");
    if (exists.board === "product") return fail(c, 400, "INVALID_BOARD", "商品请到商品与库存修改。", "board");
    if (!isExhibitBoard(exists.board)) return fail(c, 400, "INVALID_BOARD", "只有展项可以存草稿。", "board");
    const body = (await c.req.json().catch(() => ({}))) as any;
    const built = await buildExhibitData(c, id, exists.board, body);
    if (!built.ok) return built.response;
    const baseUpdatedAt = readBaseUpdatedAt(body?.baseUpdatedAt);

    if (exists.status === "published") {
      // 草稿存整篇合并后的内容，前端可以直接拿来预览
      const draft = {
        title: built.data.title ?? exists.title,
        section: built.data.section ?? exists.section,
        type: built.data.type ?? exists.type,
        subtitle: built.data.subtitle !== undefined ? built.data.subtitle : exists.subtitle,
        summary: built.data.summary !== undefined ? built.data.summary : exists.summary,
        author: built.data.author !== undefined ? built.data.author : exists.author,
        sourceName: built.data.sourceName !== undefined ? built.data.sourceName : exists.sourceName,
        coverUrl: built.data.coverUrl !== undefined ? built.data.coverUrl : exists.coverUrl,
        date: built.data.date !== undefined ? built.data.date : exists.date,
        sourceUrl: built.data.sourceUrl !== undefined ? built.data.sourceUrl : exists.sourceUrl,
        parentId: built.data.parentId !== undefined ? built.data.parentId : exists.parentId,
        blocks: built.blocks ?? parseBlocks(exists),
        draftSavedAt: Date.now(),
      };
      // 存草稿也算改了这个条目：updatedAt 照旧往前走（E4：两个窗口同时存草稿，后存的会被 409 拦下）
      const guard = baseUpdatedAt ?? exists.updatedAt.getTime();
      const result = await prisma.item.updateMany({
        where: { id, updatedAt: new Date(guard) },
        data: { draftJson: JSON.stringify(draft) },
      });
      if (result.count === 0) {
        const now = await prisma.item.findUnique({ where: { id }, select: { updatedAt: true } });
        return itemChanged(c, now?.updatedAt.getTime() ?? null);
      }
      const saved = await prisma.item.findUnique({ where: { id }, select: { updatedAt: true } });
      audit({ actor: c.get("admin").username, action: "item.draft", target: id, detail: { board: exists.board } });
      return c.json({
        id,
        status: exists.status,
        hasDraft: true,
        draftSavedAt: draft.draftSavedAt,
        updatedAt: saved?.updatedAt.getTime() ?? exists.updatedAt.getTime(),
      });
    }

    const data = built.data;
    if (Object.keys(data).length === 0) return fail(c, 400, "NO_CHANGES", "没有可保存的字段。");
    const written = await writeExhibit(id, data, baseUpdatedAt);
    if (!written.ok) return itemChanged(c, written.currentUpdatedAt);
    audit({ actor: c.get("admin").username, action: "item.draft", target: id, detail: { board: exists.board, fields: Object.keys(data) } });
    return c.json({ id, status: written.status, hasDraft: false, updatedAt: written.updatedAt });
  });

  p.delete("/items/:id/draft", async (c) => {
    const id = c.req.param("id");
    const exists = await prisma.item.findUnique({ where: { id }, select: { id: true, board: true, draftJson: true } });
    if (!exists) return fail(c, 404, "ITEM_NOT_FOUND", "没有找到这条内容。");
    if (!isExhibitBoard(exists.board)) return fail(c, 400, "INVALID_BOARD", "只有展项有草稿。", "board");
    if (exists.draftJson !== null) {
      await prisma.item.update({ where: { id }, data: { draftJson: null } });
      audit({ actor: c.get("admin").username, action: "item.draft.discard", target: id, detail: { board: exists.board } });
    }
    return c.json({ id, hasDraft: false });
  });

  /**
   * 拖动排序：一批 id 的下标就是新的 sort。整批一个事务，任一 id 不存在 / 重复 / 跨板块就什么都不写。
   * 不给 parentId 就不动父级；给了 null 表示移到顶层。reorder 不改 updatedAt。
   */
  p.post("/items/reorder", async (c) => {
    const body = (await c.req.json().catch(() => ({}))) as any;
    const rawIds = Array.isArray(body?.ids) ? body.ids : null;
    if (!rawIds) return fail(c, 400, "INVALID_IDS", "ids 要是数组。", "ids");
    if (rawIds.length < 1 || rawIds.length > 500) return fail(c, 400, "INVALID_IDS", "一次只能排 1–500 条。", "ids");
    const ids: string[] = [];
    for (const raw of rawIds) {
      if (typeof raw !== "string" || !raw.trim()) return fail(c, 400, "INVALID_IDS", "每一行都要是内容编号。", "ids");
      ids.push(raw.trim());
    }
    if (new Set(ids).size !== ids.length) return fail(c, 400, "INVALID_IDS", "同一批里不能有重复编号。", "ids");

    const rows = await prisma.item.findMany({ where: { id: { in: ids } }, select: { id: true, board: true, updatedAt: true } });
    if (rows.length !== ids.length) return fail(c, 404, "ITEM_NOT_FOUND", "有编号找不到对应的内容。", "ids");
    const board = rows[0].board;
    if (!isExhibitBoard(board) || rows.some((row) => row.board !== board)) {
      return fail(c, 400, "INVALID_BOARD", "一批里只能是同一个展项板块的内容。", "ids");
    }
    const hasParent = body?.parentId !== undefined;
    let parentId: string | null = null;
    if (hasParent) {
      // 目标父级本身先判一次（存不存在、是不是栏目、够不够一格）
      const target = await checkParentTarget(board, body.parentId);
      if (!target.ok) return fail(c, 400, target.code, target.message, "parentId");
      parentId = target.value;
      if (parentId !== null) {
        // 「不能是自己」按整批判：父级不能在这批里
        if (ids.includes(parentId)) return fail(c, 400, "INVALID_PARENT", "父级不能和要排序的条目是同一批。", "parentId");
        // 「自己有子项时不能再挂别人」按整批判：这批里任何一条带子项都不行
        const withChildren = await prisma.item.count({ where: { parentId: { in: ids } } });
        if (withChildren > 0) {
          return fail(c, 400, "INVALID_PARENT", "这批里有条目下面还挂着文章，不能再挂到别的栏目下。", "parentId");
        }
      }
    }

    await prisma.$transaction(
      ids.map((id, index) => {
        const row = rows.find((r) => r.id === id)!;
        return prisma.item.update({
          where: { id },
          data: { sort: index, ...(hasParent ? { parentId } : {}), updatedAt: row.updatedAt },
        });
      }),
    );
    audit({
      actor: c.get("admin").username,
      action: "item.reorder",
      target: ids.join(",").slice(0, 500),
      detail: { board, count: ids.length, ...(hasParent ? { parentId } : {}) },
    });
    return c.json({ ok: ids, board, ...(hasParent ? { parentId } : {}) });
  });

  p.post("/items/:id/publish", async (c) => {
    const id = c.req.param("id");
    const body = (await c.req.json().catch(() => ({}))) as any;
    const next = body?.published === false ? "archived" : "published";
    const exists = await prisma.item.findUnique({ where: { id }, select: { status: true, board: true } });
    if (!exists) return fail(c, 404, "ITEM_NOT_FOUND", "没有找到这条内容。");
    return withConfigLock(async () => {
      // 商品上架校验：缺封面或缺可售规格时 409，details 说明缺什么
      if (next === "published" && exists.board === "product") {
        const issues = await publishIssues(id);
        if (issues.length > 0) {
          return c.json({ error: { code: "PRODUCT_NOT_READY", message: publishIssueMessage(issues), details: issues } }, 409);
        }
      }
      const item = await prisma.item.update({ where: { id }, data: { status: next } });
      audit({ actor: c.get("admin").username, action: "item.publish", target: id, detail: { status: next } });
      return c.json({ id: item.id, status: item.status });
    });
  });


  // ── 内容：新建 / 删除 / 媒体 ────────────────────────
  const BOARD_PREFIX: Record<string, string> = {
    park: "YQ",
    museum: "BO",
    history: "LS",
    product: "CP",
    enterprise: "QY",
    vr: "VR",
  };

  async function nextItemId(board: string): Promise<string> {
    const prefix = BOARD_PREFIX[board];
    const rows = await prisma.item.findMany({ where: { board }, select: { id: true } });
    // 博物馆文章是 BO-A01 这种编号（BO-001~011 是 VR 场景，不参与），
    // 旧的 `数字部分` 算法对 BO-A01 会算成 NaN，新建会撞上 BO-001
    if (board === "museum") {
      let maxArticle = 0;
      for (const row of rows) {
        const matched = /^BO-A(\d+)$/.exec(String(row.id));
        if (!matched) continue;
        const num = Number(matched[1]);
        if (Number.isFinite(num) && num > maxArticle) maxArticle = num;
      }
      return `BO-A${String(maxArticle + 1).padStart(2, "0")}`;
    }
    let max = 0;
    for (const row of rows) {
      const num = Number(String(row.id).replace(/^[A-Z]+-/, ""));
      if (Number.isFinite(num) && num > max) max = num;
    }
    return `${prefix}-${String(max + 1).padStart(3, "0")}`;
  }

  p.post("/items", async (c) => {
    const body = (await c.req.json().catch(() => ({}))) as any;
    const board = String(body?.board ?? "");
    if (!BOARD_PREFIX[board]) return fail(c, 400, "INVALID_BOARD", "板块只能是 park/museum/history/product/enterprise/vr。", "board");
    // S1：商品不再从内容入口新建（要走 /products，否则商品没有 ProductProfile）
    if (board === "product") return fail(c, 400, "INVALID_BOARD", "商品请到商品与库存新建。", "board");
    const exhibit = isExhibitBoard(board);
    let fields: any = {};
    if (exhibit) {
      const read = readExhibitFields(body, { requireTitle: true });
      if (!read.ok) return fail(c, 400, read.error.code, read.error.message, read.error.field);
      fields = read.data;
    } else {
      const title = String(body?.title ?? "").trim();
      if (!title) return fail(c, 400, "INVALID_TITLE", "标题不能为空。", "title");
      fields.title = title;
    }
    const title = fields.title as string;

    const id = String(body?.id ?? "").trim() || (await nextItemId(board));
    if (!/^[A-Z]{2}-[A-Z0-9]+$/.test(id)) return fail(c, 400, "INVALID_ID", "编号格式应形如 YQ-015。", "id");
    const exists = await prisma.item.findUnique({ where: { id }, select: { id: true } });
    if (exists) return fail(c, 409, "ITEM_EXISTS", "这个编号已经被占用了。", "id");

    // 园区栏目树：只有 park 认 parentId（别的一律拒绝，不静默忽略）
    let parentId: string | null = null;
    if (body?.parentId !== undefined) {
      const parent = await checkParent(board, id, body.parentId);
      if (!parent.ok) return fail(c, 400, parent.code, parent.message, "parentId");
      parentId = parent.value;
    }

    // 正文块：展项只认 blocks，手写 body 忽略
    let blocksJson: string | null = null;
    let generatedBody: string | null = null;
    if (exhibit && body?.blocks !== undefined) {
      const checked = validateBlocks(body.blocks);
      if (!checked.ok) return invalidBlocks(c, checked.index, checked.reason);
      blocksJson = JSON.stringify(checked.blocks);
      generatedBody = blocksToText(checked.blocks);
    }

    // sort 取同级最大 +1：园区按同 parentId，史料/博物馆按整个板块
    const sortScope = board === "park" ? { board, parentId } : { board };
    const maxSort = await prisma.item.aggregate({ where: sortScope, _max: { sort: true } });
    const item = await prisma.item.create({
      data: {
        id,
        board,
        section: typeof fields.section === "string" ? fields.section : String(body?.section ?? ""),
        type: typeof fields.type === "string" ? fields.type : String(body?.type ?? "article"),
        title,
        subtitle: exhibit ? (fields.subtitle ?? null) : null,
        summary: exhibit ? (fields.summary ?? null) : null,
        author: exhibit ? (fields.author ?? null) : null,
        sourceName: exhibit ? (fields.sourceName ?? null) : null,
        coverUrl: exhibit ? (fields.coverUrl ?? null) : null,
        parentId: exhibit ? parentId : null,
        blocksJson,
        date: exhibit ? (fields.date ?? null) : body?.date ? String(body.date) : null,
        sourceUrl: exhibit ? (fields.sourceUrl ?? null) : body?.sourceUrl ? String(body.sourceUrl) : null,
        body: exhibit ? (generatedBody ?? "") : String(body?.body ?? ""),
        labelJson: exhibit && typeof fields.labelJson === "string" ? fields.labelJson : null,
        status: body?.status === "draft" ? "draft" : "published",
        sort: (maxSort._max.sort ?? 0) + 1,
      },
    });
    audit({ actor: c.get("admin").username, action: "item.create", target: item.id, detail: { board, title, ...(parentId ? { parentId } : {}) } });
    return c.json({ id: item.id, board: item.board, status: item.status, sort: item.sort }, 201);
  });

  p.delete("/items/:id", async (c) => {
    const id = c.req.param("id");
    const exists = await prisma.item.findUnique({ where: { id }, select: { id: true, title: true, board: true } });
    if (!exists) return fail(c, 404, "ITEM_NOT_FOUND", "没有找到这条内容。");
    // 商品归档也走 /products/:id/unpublish，内容接口不提供商品删除
    if (exists.board === "product") return fail(c, 400, "INVALID_BOARD", "商品请到商品与库存修改。", "board");
    // 默认仍是软删：只把状态改成 archived
    if (c.req.query("hard") !== "1") {
      const item = await prisma.item.update({ where: { id }, data: { status: "archived" } });
      audit({ actor: c.get("admin").username, action: "item.archive", target: id, detail: { title: exists.title } });
      return c.json({ id: item.id, status: item.status });
    }
    // ?hard=1 彻底删除：只限展项；有子文章先处理；媒体与扩展行跟着级联删
    if (!isExhibitBoard(exists.board)) return fail(c, 400, "INVALID_BOARD", "只有展项可以彻底删除。", "board");
    const children = await prisma.item.count({ where: { parentId: id } });
    if (children > 0) {
      return c.json(
        { error: { code: "HAS_CHILDREN", message: `这条下面还有 ${children} 篇子文章，先处理掉再删。`, details: { children } } },
        409,
      );
    }
    await prisma.item.delete({ where: { id } });
    audit({
      actor: c.get("admin").username,
      action: "item.delete",
      target: id,
      detail: { title: exists.title, board: exists.board },
    });
    return c.json({ id, deleted: true });
  });

  p.get("/items/:id/media", async (c) => {
    const rows = await prisma.itemMedia.findMany({ where: { itemId: c.req.param("id") }, orderBy: { sort: "asc" } });
    return c.json(rows);
  });

  p.post("/items/:id/media", async (c) => {
    const itemId = c.req.param("id");
    const exists = await prisma.item.findUnique({ where: { id: itemId }, select: { id: true } });
    if (!exists) return fail(c, 404, "ITEM_NOT_FOUND", "没有找到这条内容。");
    const body = (await c.req.json().catch(() => ({}))) as any;
    const url = String(body?.url ?? "").trim();
    // 后台上传返回的是 /api/uploads/...（前台开发服务只代理 /api）；老的 /uploads/ 也认
    if (!/^(https?:\/\/|\/(api\/)?uploads\/)/.test(url)) {
      return fail(c, 400, "INVALID_URL", "媒体地址必须是 http(s) 链接或 /api/uploads/ 路径。", "url");
    }
    const kind = body?.kind === "video" ? "video" : "image";
    const count = await prisma.itemMedia.count({ where: { itemId } });
    const media = await prisma.itemMedia.create({
      data: {
        itemId,
        kind,
        url,
        alt: body?.alt ? String(body.alt).slice(0, 200) : null,
        usage: body?.usage ? String(body.usage).slice(0, 40) : null,
        sort: count,
      },
    });
    audit({ actor: c.get("admin").username, action: "media.add", target: itemId, detail: { url, kind } });
    return c.json(media, 201);
  });

  p.delete("/media/:mediaId", async (c) => {
    const media = await prisma.itemMedia.findUnique({ where: { id: c.req.param("mediaId") } });
    if (!media) return fail(c, 404, "MEDIA_NOT_FOUND", "没有找到这条媒体。");
    return withConfigLock(async () => {
      await prisma.itemMedia.deleteMany({ where: { id: media.id } });
      // 删的是封面就清掉，回到用第一张图
      await prisma.productProfile.updateMany({ where: { itemId: media.itemId, thumb: media.url }, data: { thumb: null } });
      audit({ actor: c.get("admin").username, action: "media.remove", target: media.itemId, detail: { url: media.url } });
      return c.body(null, 204);
    });
  });

  // ── 文件上传（图片/短视频，落到 server/uploads，返回站内 URL） ──
  p.post("/uploads", async (c) => {
    const { mkdir, writeFile } = await import("node:fs/promises");
    const { join } = await import("node:path");
    const { randomUUID } = await import("node:crypto");
    let form: FormData;
    try {
      form = await c.req.formData();
    } catch {
      return fail(c, 400, "BAD_UPLOAD", "请用 multipart/form-data 上传文件。");
    }
    const file = form.get("file");
    if (!(file instanceof File)) return fail(c, 400, "BAD_UPLOAD", "缺少 file 字段。");
    if (file.size > 8 * 1024 * 1024) return fail(c, 413, "FILE_TOO_LARGE", "文件不能超过 8 MB。", "file");
    const allowed: Record<string, string> = {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
      "image/avif": "avif",
      "video/mp4": "mp4",
    };
    const ext = allowed[file.type];
    if (!ext) return fail(c, 400, "BAD_TYPE", "只支持 jpg / png / webp / avif / mp4。", "file");

    const name = `${Date.now().toString(36)}-${randomUUID().slice(0, 8)}.${ext}`;
    const dir = join(SERVER_ROOT, "uploads");
    await mkdir(dir, { recursive: true });
    await writeFile(join(dir, name), Buffer.from(await file.arrayBuffer()));
    audit({ actor: c.get("admin").username, action: "upload.create", target: name, detail: { size: file.size, type: file.type } });
    // 返回 /api/uploads/...：前台开发服务只代理 /api，老的 /uploads/ 仍然可读（已有数据不受影响）
    return c.json({ url: `/api/uploads/${name}`, size: file.size, type: file.type }, 201);
  });

  // ── 操作日志 ────────────────────────────────────────
  p.get("/audit", async (c) => {
    const action = c.req.query("action")?.trim();
    const q = c.req.query("q")?.trim();
    const sort = sortSpec(c, AUDIT_SORTS);
    if (!sort) return fail(c, 400, "BAD_SORT", "排序字段不支持。", "sort");
    const where: any = {};
    if (action) where.action = { contains: action };
    if (q) {
      where.OR = [{ actor: { contains: q } }, { action: { contains: q } }, { target: { contains: q } }];
    }
    const orderBy = sortToOrderBy(sort, { createdAt: "desc" });
    // 历史坏行（旧代码把 detailJson 按字符切半截）不能让整个列表 500
    const readDetail = (raw: string | null): unknown => {
      if (!raw) return null;
      try {
        return JSON.parse(raw);
      } catch {
        return { invalid: true, preview: raw.slice(0, 200) };
      }
    };
    const view = (r: any) => ({
      id: r.id,
      actor: r.actor,
      action: r.action,
      target: r.target,
      detail: readDetail(r.detailJson),
      createdAt: r.createdAt.getTime(),
    });
    // 带 page 参数返回列表信封；不带 page 保持旧前端的裸数组
    if (c.req.query("page") !== undefined) {
      const { page, pageSize, skip, take } = paging(c);
      const [total, rows] = await Promise.all([
        prisma.auditLog.count({ where }),
        prisma.auditLog.findMany({ where, orderBy, skip, take }),
      ]);
      return c.json({ items: rows.map(view), total, page, pageSize });
    }
    const limit = Math.min(200, Math.max(1, Number(c.req.query("limit") ?? 50) || 50));
    const rows = await prisma.auditLog.findMany({ where, orderBy, take: limit });
    return c.json(rows.map(view));
  });

  // ── 知识库 ──────────────────────────────────────────
  p.get("/kb/slices", async (c) => {
    const { page, pageSize, skip, take } = paging(c);
    const q = c.req.query("q")?.trim();
    const source = c.req.query("source");
    const sort = sortSpec(c, SLICE_SORTS);
    if (!sort) return fail(c, 400, "BAD_SORT", "排序字段不支持。", "sort");
    const where: any = {};
    if (source) where.source = source;
    if (q) where.OR = [{ title: { contains: q } }, { content: { contains: q } }, { id: { contains: q } }];
    const [total, rows] = await Promise.all([
      prisma.kbSlice.count({ where }),
      prisma.kbSlice.findMany({
        where,
        skip,
        take,
        orderBy: sortToOrderBy(sort, [{ source: "asc" }, { id: "asc" }]),
        select: { id: true, title: true, origin: true, url: true, source: true, updatedAt: true },
      }),
    ]);
    return c.json({
      items: rows.map((r) => ({ ...r, updatedAt: r.updatedAt.getTime() })),
      total,
      page,
      pageSize,
    });
  });

  p.get("/kb/slices/:id", async (c) => {
    const slice = await prisma.kbSlice.findUnique({ where: { id: c.req.param("id") } });
    if (!slice) return fail(c, 404, "SLICE_NOT_FOUND", "没有找到这一片资料。");
    return c.json({ ...slice, updatedAt: slice.updatedAt.getTime() });
  });

  p.post("/kb/search-test", async (c) => {
    const body = (await c.req.json().catch(() => ({}))) as any;
    const query = String(body?.query ?? "").trim();
    if (!query) return fail(c, 400, "BAD_REQUEST", "请输入要检索的问题。");
    const slices = await prisma.kbSlice.findMany();
    const hits = slices
      .map((s) => ({ id: s.id, title: s.title, origin: s.origin, url: s.url, source: s.source, score: scoreSlice(query, s) }))
      .filter((h) => h.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
    return c.json({ query, hits });
  });

  p.get("/kb/gaps", async (c) => {
    const statuses = multi(c.req.query("status"));
    const sort = sortSpec(c, GAP_SORTS);
    if (!sort) return fail(c, 400, "BAD_SORT", "排序字段不支持。", "sort");
    const where: any = statuses ? { status: { in: statuses } } : {};
    const orderBy = sortToOrderBy(sort, [{ count: "desc" }, { lastSeenAt: "desc" }]);
    const view = (r: any) => ({
      ...r,
      firstSeenAt: r.firstSeenAt.getTime(),
      lastSeenAt: r.lastSeenAt.getTime(),
    });
    // 带 page 参数返回列表信封；不带 page 保持旧前端的裸数组
    if (c.req.query("page") !== undefined) {
      const { page, pageSize, skip, take } = paging(c);
      const [total, rows] = await Promise.all([
        prisma.kbGap.count({ where }),
        prisma.kbGap.findMany({ where, orderBy, skip, take }),
      ]);
      return c.json({ items: rows.map(view), total, page, pageSize });
    }
    const rows = await prisma.kbGap.findMany({ where, orderBy, take: 200 });
    return c.json(rows.map(view));
  });

  p.patch("/kb/gaps/:id", async (c) => {
    const body = (await c.req.json().catch(() => ({}))) as any;
    const status = String(body?.status ?? "");
    if (!["pending", "filled", "ignored"].includes(status)) {
      return fail(c, 400, "BAD_REQUEST", "状态只能是 pending / filled / ignored。");
    }
    let gap;
    try {
      gap = await prisma.kbGap.update({
        where: { id: c.req.param("id") },
        data: { status, note: typeof body?.note === "string" ? body.note : undefined },
      });
    } catch (error) {
      if (isMissingRecord(error)) return fail(c, 404, "GAP_NOT_FOUND", "没有找到这条知识缺口。");
      throw error;
    }
    return c.json({ id: gap.id, status: gap.status });
  });

  // ── 讲解员会话 ──────────────────────────────────────
  p.get("/sessions", async (c) => {
    const { page, pageSize, skip, take } = paging(c);
    const q = c.req.query("q")?.trim();
    const from = timeQuery(c.req.query("from"));
    const to = timeQuery(c.req.query("to"));
    const sort = sortSpec(c, SESSION_SORTS);
    if (!sort) return fail(c, 400, "BAD_SORT", "排序字段不支持。", "sort");
    // test=0（默认）隐藏讲解员测试场会话，test=1 只看测试场
    const where: any = { isTest: (c.req.query("test") ?? "0").trim() === "1" };
    if (from || to) {
      where.startedAt = { ...(from ? { gte: from } : {}), ...(to ? { lte: to } : {}) };
    }
    if (q) {
      where.OR = [{ visitorId: { contains: q } }, { messages: { some: { content: { contains: q } } } }];
    }
    const [total, rows] = await Promise.all([
      prisma.agentSession.count({ where }),
      prisma.agentSession.findMany({
        where,
        skip,
        take,
        orderBy: sortToOrderBy(sort, { startedAt: "desc" }),
        select: {
          id: true,
          visitorId: true,
          page: true,
          startedAt: true,
          endedAt: true,
          endedReason: true,
          turnCount: true,
          inputTokens: true,
          outputTokens: true,
          finishReason: true,
          _count: { select: { messages: true } },
        },
      }),
    ]);
    return c.json({
      items: rows.map((r) => ({
        ...r,
        startedAt: r.startedAt.getTime(),
        endedAt: r.endedAt?.getTime() ?? null,
        messageCount: r._count.messages,
      })),
      total,
      page,
      pageSize,
    });
  });

  p.get("/sessions/:id", async (c) => {
    const session = await prisma.agentSession.findUnique({
      where: { id: c.req.param("id") },
      include: { messages: { orderBy: { createdAt: "asc" } } },
    });
    if (!session) return fail(c, 404, "SESSION_NOT_FOUND", "没有找到这次对话。");
    return c.json({
      ...session,
      startedAt: session.startedAt.getTime(),
      endedAt: session.endedAt?.getTime() ?? null,
      messages: session.messages.map((m) => ({ ...m, createdAt: m.createdAt.getTime() })),
    });
  });




  // ── 订单履约：地址回填 / 发货 / 完成 ─────────────────
  const ADDRESS_FIELDS = ["name", "phone", "province", "city", "district", "detail", "postcode", "tag"] as const;

  function readAddress(body: any) {
    const value: Record<string, string> = {};
    for (const key of ADDRESS_FIELDS) value[key] = String(body?.[key] ?? "").trim();
    const errors: Array<[string, string]> = [];
    if (value.name.length < 1 || value.name.length > 20) errors.push(["name", "收货人姓名需 1–20 字"]);
    if (!/^1[3-9]\d{9}$/.test(value.phone)) errors.push(["phone", "手机号格式不对"]);
    if (!value.province || !value.city || !value.district) errors.push(["region", "省/市/区必填"]);
    if (value.detail.length < 4 || value.detail.length > 80) errors.push(["detail", "详细地址需 4–80 字"]);
    if (value.postcode && !/^\d{6}$/.test(value.postcode)) errors.push(["postcode", "邮编应为 6 位数字或留空"]);
    value.tag = value.tag || "家";
    return { value, errors };
  }

  p.patch("/orders/:orderNo/address", async (c) => {
    const order = await prisma.order.findUnique({ where: { orderNo: c.req.param("orderNo") } });
    if (!order) return fail(c, 404, "ORDER_NOT_FOUND", "没有找到这个订单。");
    if (!["pending_payment", "paid"].includes(order.status)) {
      return fail(c, 409, "ORDER_LOCKED", "订单已发货或已完成，地址不能再改。");
    }
    const body = (await c.req.json().catch(() => ({}))) as any;
    const { value, errors } = readAddress(body?.address ?? body);
    if (errors.length > 0) return fail(c, 400, "ADDRESS_INVALID", errors[0][1], errors[0][0]);

    const address = { ...JSON.parse(order.addressJson), ...value, isDefault: false };
    const updated = await prisma.order.update({ where: { id: order.id }, data: { addressJson: JSON.stringify(address) } });

    // 客户把新地址发过来时，顺手存进他的地址簿（可选）
    if (body?.saveToBook) {
      const existing = await prisma.address.findFirst({ where: { userId: order.userId, detail: value.detail, phone: value.phone } });
      if (!existing) {
        const count = await prisma.address.count({ where: { userId: order.userId } });
        await prisma.address.create({ data: { ...value, userId: order.userId, isDefault: count === 0 } });
      }
    }
    audit({ actor: c.get("admin").username, action: "order.address", target: order.orderNo, detail: { ...value } });
    return c.json({ orderNo: updated.orderNo, address });
  });

  p.post("/orders/:orderNo/ship", async (c) => {
    const order = await prisma.order.findUnique({ where: { orderNo: c.req.param("orderNo") }, include: { items: true } });
    if (!order) return fail(c, 404, "ORDER_NOT_FOUND", "没有找到这个订单。");
    if (order.status === "shipped" || order.status === "completed") {
      return c.json({ orderNo: order.orderNo, status: order.status, already: true });
    }
    if (order.status !== "paid") return fail(c, 409, "ORDER_NOT_PAID", "只有已付款的订单可以发货。");

    const body = (await c.req.json().catch(() => ({}))) as any;
    const carrier = String(body?.carrier ?? "").trim();
    const trackingNo = String(body?.trackingNo ?? "").trim();
    if (!carrier) return fail(c, 400, "INVALID_CARRIER", "请选择或填写承运商。", "carrier");
    // 单号必填：6–30 位字母数字
    if (!/^[A-Za-z0-9]{6,30}$/.test(trackingNo)) {
      return fail(c, 400, "INVALID_TRACKING", "运单号必填，且为 6–30 位字母或数字。", "trackingNo");
    }

    const updated = await prisma.order.update({
      where: { id: order.id },
      data: {
        status: "shipped",
        carrier,
        trackingNo,
        shippedAt: new Date(),
        remark: typeof body?.remark === "string" ? body.remark.slice(0, 200) : order.remark,
      },
    });
    audit({ actor: c.get("admin").username, action: "order.ship", target: order.orderNo, detail: { carrier, trackingNo } });
    return c.json({ orderNo: updated.orderNo, status: updated.status, carrier: updated.carrier, trackingNo: updated.trackingNo, shippedAt: updated.shippedAt?.getTime() ?? null });
  });

  p.post("/orders/:orderNo/complete", async (c) => {
    const order = await prisma.order.findUnique({ where: { orderNo: c.req.param("orderNo") } });
    if (!order) return fail(c, 404, "ORDER_NOT_FOUND", "没有找到这个订单。");
    if (order.status === "completed") return c.json({ orderNo: order.orderNo, status: "completed", already: true });
    if (order.status !== "shipped") return fail(c, 409, "ORDER_NOT_SHIPPED", "只有已发货的订单可以标记完成。");
    const updated = await prisma.order.update({ where: { id: order.id }, data: { status: "completed", completedAt: new Date() } });
    audit({ actor: c.get("admin").username, action: "order.complete", target: order.orderNo });
    return c.json({ orderNo: updated.orderNo, status: updated.status, completedAt: updated.completedAt?.getTime() ?? null });
  });

  // 撤销发货：仅「已发货且未完成」可退回已付款，清空承运商/单号/发货时间
  p.post("/orders/:orderNo/unship", async (c) => {
    const order = await prisma.order.findUnique({ where: { orderNo: c.req.param("orderNo") } });
    if (!order) return fail(c, 404, "ORDER_NOT_FOUND", "没有找到这个订单。");
    if (order.status !== "shipped" || order.completedAt) {
      return fail(c, 409, "ORDER_LOCKED", "只有已发货且未完成的订单可以撤销发货。");
    }
    const updated = await prisma.order.update({
      where: { id: order.id },
      data: { status: "paid", carrier: null, trackingNo: null, shippedAt: null },
    });
    audit({
      actor: c.get("admin").username,
      action: "order.unship",
      target: order.orderNo,
      detail: { carrier: order.carrier, trackingNo: order.trackingNo },
    });
    return c.json({
      orderNo: updated.orderNo,
      status: updated.status,
      carrier: updated.carrier,
      trackingNo: updated.trackingNo,
      shippedAt: updated.shippedAt?.getTime() ?? null,
    });
  });

  p.patch("/orders/:orderNo/remark", async (c) => {
    const body = (await c.req.json().catch(() => ({}))) as any;
    const remark = String(body?.remark ?? "").slice(0, 200);
    let order;
    try {
      order = await prisma.order.update({ where: { orderNo: c.req.param("orderNo") }, data: { remark } });
    } catch (error) {
      if (isMissingRecord(error)) return fail(c, 404, "ORDER_NOT_FOUND", "没有找到这个订单。");
      throw error;
    }
    audit({ actor: c.get("admin").username, action: "order.remark", target: order.orderNo });
    return c.json({ orderNo: order.orderNo, remark: order.remark });
  });

  // ── 客户（购物账号） ────────────────────────────────
  p.get("/customers", async (c) => {
    const { page, pageSize, skip, take } = paging(c);
    const q = c.req.query("q")?.trim();
    const sort = sortSpec(c, CUSTOMER_SORTS);
    if (!sort) return fail(c, 400, "BAD_SORT", "排序字段不支持。", "sort");
    const where: any = q
      ? {
          OR: [
            { name: { contains: q } },
            { phone: { contains: q } },
            { addresses: { some: { OR: [{ detail: { contains: q } }, { name: { contains: q } }, { phone: { contains: q } }] } } },
          ],
        }
      : {};
    const [total, rows] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({ where, skip, take, orderBy: sortToOrderBy(sort, { createdAt: "desc" }) }),
    ]);
    const ids = rows.map((u) => u.id);
    const orders = ids.length
      ? await prisma.order.groupBy({ by: ["userId", "status"], where: { userId: { in: ids } }, _count: { _all: true }, _sum: { totalCents: true } })
      : [];
    const stats = new Map<string, { orders: number; paidAmountCents: number; lastOrderAt: number | null }>();
    for (const row of orders) {
      const entry = stats.get(row.userId) ?? { orders: 0, paidAmountCents: 0, lastOrderAt: null };
      entry.orders += row._count._all;
      if (row.status !== "cancelled") entry.paidAmountCents += row._sum.totalCents ?? 0;
      stats.set(row.userId, entry);
    }
    const lastOrders = ids.length
      ? await prisma.order.findMany({ where: { userId: { in: ids } }, orderBy: { createdAt: "desc" }, select: { userId: true, createdAt: true } })
      : [];
    for (const order of lastOrders) {
      const entry = stats.get(order.userId);
      if (entry && entry.lastOrderAt === null) entry.lastOrderAt = order.createdAt.getTime();
    }
    return c.json({
      items: rows.map((u) => ({
        id: u.id,
        name: u.name,
        phone: u.phone,
        remark: u.remark,
        createdAt: u.createdAt.getTime(),
        orders: stats.get(u.id)?.orders ?? 0,
        paidAmountCents: stats.get(u.id)?.paidAmountCents ?? 0,
        lastOrderAt: stats.get(u.id)?.lastOrderAt ?? null,
      })),
      total,
      page,
      pageSize,
    });
  });

  p.get("/customers/:id", async (c) => {
    const id = c.req.param("id");
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        addresses: true,
        orders: { orderBy: { createdAt: "desc" }, take: 30, include: { items: true } },
      },
    });
    if (!user) return fail(c, 404, "CUSTOMER_NOT_FOUND", "没有找到这个客户。");
    return c.json({
      id: user.id,
      name: user.name,
      phone: user.phone,
      remark: user.remark,
      createdAt: user.createdAt.getTime(),
      addresses: user.addresses.map((a) => ({ ...a, createdAt: a.createdAt.getTime() })),
      orders: user.orders.map((o) => ({
        orderNo: o.orderNo,
        status: o.status,
        totalCents: o.totalCents,
        itemCount: o.items.reduce((sum, line) => sum + line.qty, 0),
        createdAt: o.createdAt.getTime(),
        address: JSON.parse(o.addressJson),
      })),
    });
  });

  p.patch("/customers/:id", async (c) => {
    const body = (await c.req.json().catch(() => ({}))) as any;
    const data: any = {};
    if (typeof body?.name === "string") {
      const name = body.name.replace(/\s+/g, " ").trim();
      if (name.length < 2 || name.length > 16) return fail(c, 400, "INVALID_NAME", "称呼需 2–16 字。", "name");
      data.name = name;
    }
    if (typeof body?.remark === "string") data.remark = body.remark.slice(0, 200);
    if (Object.keys(data).length === 0) return fail(c, 400, "NO_CHANGES", "没有可更新的字段。");
    let user;
    try {
      user = await prisma.user.update({ where: { id: c.req.param("id") }, data });
    } catch (error) {
      if (isMissingRecord(error)) return fail(c, 404, "CUSTOMER_NOT_FOUND", "没有找到这个客户。");
      throw error;
    }
    audit({ actor: c.get("admin").username, action: "customer.update", target: user.id, detail: data });
    return c.json({ id: user.id, name: user.name, remark: user.remark });
  });

  p.post("/customers/:id/addresses", async (c) => {
    const userId = c.req.param("id");
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return fail(c, 404, "CUSTOMER_NOT_FOUND", "没有找到这个客户。");
    const { value, errors } = readAddress(await c.req.json().catch(() => ({})));
    if (errors.length > 0) return fail(c, 400, "ADDRESS_INVALID", errors[0][1], errors[0][0]);
    const count = await prisma.address.count({ where: { userId } });
    const created = await prisma.address.create({ data: { ...value, userId, isDefault: count === 0 } });
    audit({ actor: c.get("admin").username, action: "customer.address.add", target: userId });
    return c.json({ ...created, createdAt: created.createdAt.getTime() }, 201);
  });

  p.delete("/customers/:id/addresses/:addressId", async (c) => {
    const userId = c.req.param("id");
    const addressId = c.req.param("addressId");
    const existing = await prisma.address.findFirst({ where: { id: addressId, userId } });
    if (!existing) return c.body(null, 204);
    await prisma.address.delete({ where: { id: addressId } });
    if (existing.isDefault) {
      const next = await prisma.address.findFirst({ where: { userId }, orderBy: { createdAt: "desc" } });
      if (next) await prisma.address.update({ where: { id: next.id }, data: { isDefault: true } });
    }
    audit({ actor: c.get("admin").username, action: "customer.address.remove", target: userId, detail: { addressId } });
    return c.body(null, 204);
  });

  // ── 企业档案与地图坐标 ──────────────────────────────
  async function enterpriseRows(where: any, skip: number, take: number, orderBy: any = { id: "asc" }) {
    const items = await prisma.item.findMany({
      where,
      skip,
      take,
      orderBy,
      include: { enterprise: true },
    });
    return items.map((item) => ({
      id: item.id,
      title: item.title,
      status: item.status,
      section: item.section,
      town: item.enterprise?.town ?? "",
      address: item.enterprise?.address ?? "",
      tel: item.enterprise?.tel ?? "",
      email: item.enterprise?.email ?? "",
      site: item.enterprise?.site ?? "",
      lng: item.enterprise?.lng ?? null,
      lat: item.enterprise?.lat ?? null,
      coordSource: item.enterprise?.coordSource ?? null,
      verified: item.enterprise?.verified ?? false,
    }));
  }

  p.get("/enterprises", async (c) => {
    const { page, pageSize, skip, take } = paging(c);
    const q = c.req.query("q")?.trim();
    const placed = c.req.query("placed");
    const statuses = multi(c.req.query("status"));
    const sort = sortSpec(c, ENTERPRISE_SORTS);
    if (!sort) return fail(c, 400, "BAD_SORT", "排序字段不支持。", "sort");
    const where: any = { board: "enterprise" };
    const and: any[] = [];
    if (q) and.push({ OR: [{ title: { contains: q } }, { id: { contains: q } }] });
    if (statuses) and.push({ status: { in: statuses } });
    // placed=no 在库里过滤（含没有档案行的企业），total 才是过滤后的真实数量
    if (placed === "yes") and.push({ enterprise: { lng: { not: null }, lat: { not: null } } });
    if (placed === "no") {
      and.push({ OR: [{ enterprise: null }, { enterprise: { OR: [{ lng: null }, { lat: null }] } }] });
    }
    if (and.length > 0) where.AND = and;
    const [total, items] = await Promise.all([
      prisma.item.count({ where }),
      enterpriseRows(where, skip, take, sortToOrderBy(sort, { id: "asc" })),
    ]);
    return c.json({ items, total, page, pageSize });
  });

  p.post("/enterprises", async (c) => {
    const body = (await c.req.json().catch(() => ({}))) as any;
    const title = String(body?.title ?? "").trim();
    if (!title) return fail(c, 400, "INVALID_TITLE", "企业名称不能为空。", "title");

    let coord: { lng: number; lat: number } | null = null;
    if (body?.coord !== undefined && body?.coord !== null && body?.coord !== "") {
      const parsed = parseCoord(body.coord);
      if (!parsed.ok) return fail(c, 400, "INVALID_COORD", parsed.message ?? "坐标格式不对", "coord");
      coord = parsed.coord!;
    }

    const id = String(body?.id ?? "").trim() || (await nextItemId("enterprise"));
    const exists = await prisma.item.findUnique({ where: { id } });
    if (exists) return fail(c, 409, "ITEM_EXISTS", "这个编号已经被占用了。", "id");

    const item = await prisma.item.create({
      data: {
        id,
        board: "enterprise",
        section: String(body?.section ?? "企业档案"),
        type: "企业",
        title,
        sourceUrl: body?.sourceUrl ? String(body.sourceUrl) : null,
        body: String(body?.body ?? ""),
        status: body?.status === "draft" ? "draft" : "published",
        enterprise: {
          create: {
            town: body?.town ? String(body.town) : null,
            address: body?.address ? String(body.address) : null,
            tel: body?.tel ? String(body.tel) : null,
            email: body?.email ? String(body.email) : null,
            site: body?.site ? String(body.site) : null,
            lng: coord?.lng ?? null,
            lat: coord?.lat ?? null,
            coordSource: coord ? (String(body?.coordSource ?? "后台录入")) : null,
            verified: Boolean(coord),
          },
        },
      },
      include: { enterprise: true },
    });
    audit({ actor: c.get("admin").username, action: "enterprise.create", target: id, detail: { title, coord } });
    return c.json({
      id: item.id,
      title: item.title,
      coord: coord ? { ...coord, huazhou: looksLikeHuazhou(coord) } : null,
    }, 201);
  });

  p.patch("/enterprises/:id", async (c) => {
    const id = c.req.param("id");
    const body = (await c.req.json().catch(() => ({}))) as any;
    const item = await prisma.item.findUnique({ where: { id }, include: { enterprise: true } });
    if (!item || item.board !== "enterprise") return fail(c, 404, "ITEM_NOT_FOUND", "没有找到这家企业。");

    const itemData: any = {};
    if (typeof body?.title === "string" && body.title.trim()) itemData.title = body.title.trim();
    if (typeof body?.body === "string") itemData.body = body.body;
    if (typeof body?.status === "string") itemData.status = body.status;
    if (Object.keys(itemData).length > 0) await prisma.item.update({ where: { id }, data: itemData });

    const profile: any = {};
    for (const key of ["town", "address", "tel", "email", "site"] as const) {
      if (typeof body?.[key] === "string") profile[key] = body[key];
    }
    if (body?.coord !== undefined) {
      if (body.coord === null || body.coord === "") {
        profile.lng = null;
        profile.lat = null;
        profile.coordSource = null;
        profile.verified = false;
      } else {
        const parsed = parseCoord(body.coord);
        if (!parsed.ok) return fail(c, 400, "INVALID_COORD", parsed.message ?? "坐标格式不对", "coord");
        profile.lng = parsed.coord!.lng;
        profile.lat = parsed.coord!.lat;
        profile.coordSource = String(body?.coordSource ?? "后台录入");
        profile.verified = true;
      }
    }
    if (Object.keys(profile).length > 0) {
      await prisma.enterpriseProfile.upsert({
        where: { itemId: id },
        create: { itemId: id, ...profile },
        update: profile,
      });
    }
    const updated = await prisma.enterpriseProfile.findUnique({ where: { itemId: id } });
    audit({ actor: c.get("admin").username, action: "enterprise.update", target: id, detail: profile });
    return c.json({ id, lng: updated?.lng ?? null, lat: updated?.lat ?? null, coordSource: updated?.coordSource ?? null });
  });

  p.patch("/enterprises/:id/coord", async (c) => {
    const id = c.req.param("id");
    const body = (await c.req.json().catch(() => ({}))) as any;
    const parsed = parseCoord(body?.coord ?? body);
    if (!parsed.ok) return fail(c, 400, "INVALID_COORD", parsed.message ?? "坐标格式不对", "coord");
    const item = await prisma.item.findUnique({ where: { id } });
    if (!item || item.board !== "enterprise") return fail(c, 404, "ITEM_NOT_FOUND", "没有找到这家企业。");
    const profile = await prisma.enterpriseProfile.upsert({
      where: { itemId: id },
      create: {
        itemId: id,
        lng: parsed.coord!.lng,
        lat: parsed.coord!.lat,
        coordSource: String(body?.coordSource ?? "后台录入"),
        verified: true,
      },
      update: {
        lng: parsed.coord!.lng,
        lat: parsed.coord!.lat,
        coordSource: String(body?.coordSource ?? "后台录入"),
        verified: true,
      },
    });
    audit({ actor: c.get("admin").username, action: "enterprise.coord", target: id, detail: parsed.coord });
    return c.json({
      id,
      lng: profile.lng,
      lat: profile.lat,
      swapped: Boolean(parsed.swapped),
      inHuazhou: looksLikeHuazhou({ lng: profile.lng!, lat: profile.lat! }),
    });
  });

  // 给前端的 enterprise-points.json 直接可用：{ "QY-001": { lng, lat, coordSource, verified } }
  p.get("/enterprises/export-points", async (c) => {
    const rows = await prisma.enterpriseProfile.findMany({
      where: { lng: { not: null }, lat: { not: null } },
    });
    const points: Record<string, unknown> = {};
    for (const row of rows) {
      points[row.itemId] = toPointEntry(
        { lng: row.lng!, lat: row.lat! },
        row.coordSource ?? "后台录入",
        row.verified,
      );
    }
    return c.json({ count: rows.length, points });
  });

  // ── 后台全局检索：客户 / 订单 / 内容 ─────────────────
  p.get("/search", async (c) => {
    const q = c.req.query("q")?.trim();
    if (!q) return c.json({ customers: [], orders: [], items: [] });
    const [customers, orders, items] = await Promise.all([
      prisma.user.findMany({ where: { OR: [{ name: { contains: q } }, { phone: { contains: q } }] }, take: 5 }),
      prisma.order.findMany({ where: { orderNo: { contains: q } }, take: 5 }),
      prisma.item.findMany({ where: { OR: [{ title: { contains: q } }, { id: { contains: q } }] }, take: 5, select: { id: true, title: true, board: true } }),
    ]);
    return c.json({
      customers: customers.map((u) => ({ id: u.id, name: u.name, phone: u.phone })),
      orders: orders.map((o) => ({ orderNo: o.orderNo, status: o.status, totalCents: o.totalCents })),
      items,
    });
  });

  // ── 系统设置 ────────────────────────────────────────
  const SETTING_KEYS = [
    "site.title",
    "site.notice",
    "shop.demoPriceEnabled",
    "guide.enabled",
    "analysis.provider",
    "analysis.model",
    "shop.lowStockThreshold",
  ] as const;

  p.get("/settings", async (c) => {
    const rows = await prisma.setting.findMany();
    const map: Record<string, string> = {};
    for (const row of rows) map[row.key] = row.value;
    return c.json({
      values: map,
      allowedKeys: SETTING_KEYS,
    });
  });

  p.put("/settings", async (c) => {
    const body = (await c.req.json().catch(() => ({}))) as any;
    const incoming = body?.settings && typeof body.settings === "object" ? body.settings : {};
    // 低库存阈值只收 0–9999 的整数；有非法值就整批不写库
    if ("shop.lowStockThreshold" in incoming) {
      const raw = incoming["shop.lowStockThreshold"];
      const text = typeof raw === "number" ? String(raw) : typeof raw === "string" ? raw.trim() : "";
      const threshold = Number(text);
      if (!text || !Number.isInteger(threshold) || threshold < 0 || threshold > 9999) {
        return fail(c, 400, "INVALID_SETTING", "低库存阈值必须是 0–9999 的整数。", "shop.lowStockThreshold");
      }
    }
    const invalidateAnalysis = false;
    let updated = 0;
    for (const key of SETTING_KEYS) {
      if (!(key in incoming)) continue;
      const value = String(incoming[key] ?? "").slice(0, 2000);
      await prisma.setting.upsert({ where: { key }, create: { key, value }, update: { value } });
      updated += 1;
    }
    if (updated === 0) return fail(c, 400, "NO_CHANGES", "没有可更新的设置项。");
    invalidateConfigCache();
    audit({ actor: c.get("admin").username, action: "settings.update", target: "settings", detail: incoming });
    const rows = await prisma.setting.findMany();
    const map: Record<string, string> = {};
    for (const row of rows) map[row.key] = row.value;
    return c.json({ updated, values: map });
  });

  // 管理员改密：需要旧密码；新密码 ≥10 位且不能与旧密码相同。
  // 成功后 tokenVersion +1，该管理员此前签发的 token 全部失效（再请求回 401 TOKEN_REVOKED）。
  p.post("/auth/password", async (c) => {
    const claims = c.get("admin");
    const body = (await c.req.json().catch(() => ({}))) as any;
    const current = String(body?.current ?? "");
    const next = String(body?.next ?? "");
    // 先判「和旧密码一样」：真实账号口令可能比新口令下限还短，顺序反了会让 SAME_PASSWORD 永远走不到
    if (next === current) return fail(c, 400, "SAME_PASSWORD", "新密码不能与当前密码相同。", "next");
    if (next.length < 10) return fail(c, 400, "WEAK_PASSWORD", "新密码至少 10 位。", "next");
    const user = await prisma.adminUser.findUnique({ where: { id: claims.sub } });
    if (!user) return fail(c, 401, "UNAUTHORIZED", "登录状态已失效，请重新登录。");
    const { ScryptBusyError, hashPassword, verifyPassword } = await import("../lib/password.ts");
    try {
      if (!(await verifyPassword(current, user.passwordHash))) {
        return fail(c, 400, "BAD_CREDENTIALS", "当前密码不正确。", "current");
      }
      await prisma.adminUser.update({
        where: { id: user.id },
        // 改密成功清掉「必须改密」标记，tokenVersion 照旧 +1（旧 token 与 Cookie 全部失效）
        data: { passwordHash: await hashPassword(next), tokenVersion: { increment: 1 }, mustChangePassword: false },
      });
    } catch (error) {
      if (error instanceof ScryptBusyError) return fail(c, 503, "BUSY", "系统繁忙，请稍后再试。");
      throw error;
    }
    audit({ actor: user.username, action: "admin.password", target: user.username });
    // 当前这条 Cookie 也作废，前端要重新登录
    clearAdminCookie(c);
    return c.json({ ok: true });
  });

  // ── 会话分析 ────────────────────────────────────────
  // 埋点日聚合：把近 N 天明细汇总进 DailyBoardStat（幂等，可重复调用）
  p.post("/analytics/aggregate", async (c) => {
    const raw = Number(c.req.query("days") ?? 7);
    const days = Math.min(90, Math.max(1, Number.isFinite(raw) ? raw : 7));
    const result = await aggregateDaily(days);
    audit({ actor: c.get("admin").username, action: "analytics.aggregate", target: "daily", detail: result });
    return c.json(result);
  });

  p.post("/analysis/estimate", async (c) => {
    const body = (await c.req.json().catch(() => ({}))) as any;
    const mode = body?.mode === "full" ? "full" : "incremental";
    return c.json(await estimateAnalysis({ mode, limit: Number(body?.limit) || undefined }));
  });

  p.post("/analysis/run", async (c) => {
    const body = (await c.req.json().catch(() => ({}))) as any;
    const mode = body?.mode === "full" ? "full" : "incremental";
    try {
      return c.json(await runGlobalAnalysis({ mode, limit: Number(body?.limit) || undefined }));
    } catch (error: any) {
      if (error?.code === "NO_ANALYSIS_MODEL") {
        return fail(c, 409, "NO_ANALYSIS_MODEL", error.message);
      }
      console.error("[admin] 会话分析失败:", error);
      return fail(c, 500, "ANALYSIS_FAILED", "分析失败，请检查模型配置后重试。");
    }
  });

  p.get("/analysis/reports", async (c) => {
    const rows = await prisma.analysisReport.findMany({ orderBy: { createdAt: "desc" }, take: 30 });
    return c.json(
      rows.map((r) => ({
        id: r.id,
        kind: r.kind,
        scope: r.scope,
        sessionCount: r.sessionCount,
        model: r.model,
        tokens: r.tokens,
        createdAt: r.createdAt.getTime(),
        parsed: JSON.parse(r.resultJson).parsed ?? null,
      })),
    );
  });

  p.get("/analysis/reports/:id", async (c) => {
    const row = await prisma.analysisReport.findUnique({ where: { id: c.req.param("id") } });
    if (!row) return fail(c, 404, "REPORT_NOT_FOUND", "没有找到这份分析。");
    return c.json({
      id: row.id,
      kind: row.kind,
      scope: row.scope,
      sessionCount: row.sessionCount,
      model: row.model,
      tokens: row.tokens,
      createdAt: row.createdAt.getTime(),
      ...JSON.parse(row.resultJson),
    });
  });

  p.post("/sessions/:id/analyze", async (c) => {
    try {
      return c.json(await analyzeOneSession(c.req.param("id")));
    } catch (error: any) {
      if (error?.code === "SESSION_NOT_FOUND") return fail(c, 404, "SESSION_NOT_FOUND", error.message);
      if (error?.code === "NO_ANALYSIS_MODEL") return fail(c, 409, "NO_ANALYSIS_MODEL", error.message);
      console.error("[admin] 单会话分析失败:", error);
      return fail(c, 500, "ANALYSIS_FAILED", "分析失败，请稍后重试。");
    }
  });

  p.get("/sessions/:id/analysis", async (c) => {
    const report = await latestSessionReport(c.req.param("id"));
    return c.json(report);
  });

  // ── 讲解员配置 ──────────────────────────────────────
  p.get("/config/current", async (c) => {
    const [draft, published] = await Promise.all([
      prisma.configVersion.findFirst({ where: { status: "draft" }, orderBy: { createdAt: "desc" } }),
      prisma.configVersion.findFirst({ where: { status: "published" }, orderBy: { publishedAt: "desc" } }),
    ]);
    const view = (v: typeof draft) =>
      v
        ? {
            id: v.id,
            versionNo: v.versionNo,
            prompt: JSON.parse(v.promptJson),
            model: JSON.parse(v.modelJson),
            status: v.status,
            note: v.note,
            createdAt: v.createdAt.getTime(),
            publishedAt: v.publishedAt?.getTime() ?? null,
          }
        : null;
    return c.json({ draft: view(draft), published: view(published), hasPendingDraft: Boolean(draft) });
  });

  // 讲解员可选模型（供应商 + 模型两级下拉），current 取线上生效的配置
  p.get("/config/model-options", async (c) => {
    const rows = await prisma.provider.findMany({ orderBy: { createdAt: "asc" } });
    const active = await loadActiveConfig();
    const providers = rows.map((row) => ({
      name: row.name,
      displayName: row.displayName ?? row.name,
      enabled: row.enabled,
      ready: providerReady(row),
      models: normaliseModels(parseModelsJson(row.modelsJson)).map((one) => ({ id: one.id, name: one.name })),
    }));
    const inList = providers.some(
      (one) => one.enabled && one.name === active.provider && one.models.some((m) => m.id === active.model),
    );
    return c.json({
      providers,
      current: { provider: active.provider, model: active.model, inList },
    });
  });

  p.put("/config/draft", async (c) => {
    const body = (await c.req.json().catch(() => ({}))) as any;
    const prompt = body?.prompt;
    const model = body?.model;
    if (!prompt?.system || typeof prompt.system !== "string") {
      return fail(c, 400, "INVALID_PROMPT", "提示词不能为空。", "prompt");
    }
    if (!model?.provider || !model?.model) {
      return fail(c, 400, "INVALID_MODEL", "请选择供应商与模型。", "model");
    }
    return withConfigLock(async () => {
      // 模型必须能真的被选中——库内已启用的供应商 + 它的模型列表里，
      // 或者和线上版本的 provider/model 完全相同（内置 pi 供应商保持原值时不被阻塞）。
      const selectable = await modelSelectable({ provider: model.provider, model: model.model });
      if (!selectable) {
        // 顺手挡一个常见错法：把库里的 cuid id 当成供应商名传进来
        const byId = typeof model.provider === "string" ? await prisma.provider.findUnique({ where: { id: model.provider } }) : null;
        const message = byId
          ? `model.provider 要填供应商 name（如 ${byId.name}），不是 id。`
          : "这个模型不在已配置的供应商列表里，先在「模型供应商」里添加。";
        return fail(c, 400, "MODEL_NOT_SELECTABLE", message, "model");
      }
      const latest = await prisma.configVersion.findFirst({ orderBy: { versionNo: "desc" } });
      const draft = await prisma.configVersion.findFirst({ where: { status: "draft" } });
      const data = {
        promptJson: JSON.stringify(prompt),
        modelJson: JSON.stringify(model),
        note: typeof body?.note === "string" ? body.note : null,
      };
      const saved = draft
        ? await prisma.configVersion.update({ where: { id: draft.id }, data })
        : await prisma.configVersion.create({
            data: { ...data, versionNo: (latest?.versionNo ?? 0) + 1, status: "draft" },
          });
      return c.json({ id: saved.id, versionNo: saved.versionNo, status: saved.status });
    });
  });




  // ── 模型供应商 ──────────────────────────────────────
  p.get("/providers", async (c) => {
    const rows = await prisma.provider.findMany({ orderBy: { createdAt: "asc" } });
    return c.json(rows.map(publicView));
  });

  /** 供应商被哪些「线上 / 草稿」配置引用（旧草稿里可能存的是 cuid id，两个都算） */
  async function referencingVersions(provider: { id: string; name: string }) {
    const versions = await prisma.configVersion.findMany({
      where: { status: { in: ["published", "draft"] } },
      select: { status: true, modelJson: true },
    });
    return versions.filter((version) => {
      try {
        const ref = (JSON.parse(version.modelJson) as { provider?: string })?.provider;
        return ref === provider.name || ref === provider.id;
      } catch {
        return false;
      }
    });
  }

  /** 表单里的供应商（可能还没保存）：/providers/test 与 /providers/models:fetch 共用。
   *  Key 只在内存里用一次，不落库也不回显。 */
  async function readFormProvider(body: any, opts: { requireModels: boolean }) {
    const urlR = validateBaseUrl(body?.baseUrl);
    if (!urlR.ok) return { ok: false as const, code: urlR.code, message: urlR.message, field: urlR.field };
    const apiR = validateApi(body?.api);
    if (!apiR.ok) return { ok: false as const, code: apiR.code, message: apiR.message, field: apiR.field };

    // 带 id 时用库里已存的 Key / 模型（表单改了地址也能测）
    const existing =
      typeof body?.id === "string" && body.id ? await prisma.provider.findUnique({ where: { id: body.id } }) : null;

    let models: any[] = [];
    if (body?.models !== undefined) {
      const modelsR = validateModels(body.models);
      if (!modelsR.ok) return { ok: false as const, code: modelsR.code, message: modelsR.message, field: modelsR.field };
      models = modelsR.value;
    } else if (existing) {
      models = normaliseModels(parseModelsJson(existing.modelsJson));
    } else if (opts.requireModels) {
      return { ok: false as const, code: "INVALID_MODELS", message: "至少配置一个模型。", field: "models" };
    } else {
      models = [];
    }

    const keyMode = body?.keyMode === "env" ? "env" : "literal";
    const rawKey = typeof body?.apiKey === "string" ? body.apiKey.trim() : "";
    if (keyMode === "env") {
      const envR = validateEnvName(body?.apiKeyEnv);
      if (!envR.ok) return { ok: false as const, code: envR.code, message: envR.message, field: envR.field };
    } else if (rawKey) {
      const keyR = validateLiteralKey(rawKey);
      if (!keyR.ok) return { ok: false as const, code: keyR.code, message: keyR.message, field: keyR.field };
    } else if (!existing?.apiKeyEnc) {
      return { ok: false as const, code: "INVALID_KEY", message: "literal 模式必须填入 Key。", field: "apiKey" };
    }

    const transient = {
      id: existing?.id ?? "draft",
      name: existing?.name ?? "draft",
      displayName: existing?.displayName ?? null,
      baseUrl: urlR.value,
      api: apiR.value,
      keyMode,
      apiKeyEnv: keyMode === "env" ? String(body?.apiKeyEnv ?? "").trim() : null,
      apiKeyEnc: keyMode === "literal" ? (existing?.apiKeyEnc ?? null) : null,
      modelsJson: JSON.stringify(models),
      enabled: true,
      lastTestAt: null,
      lastTestOk: null,
      lastTestError: null,
      createdAt: new Date(),
    } as any;
    return { ok: true as const, provider: transient, explicitKey: keyMode === "literal" && rawKey ? rawKey : undefined };
  }

  p.post("/providers", async (c) => {
    const body = (await c.req.json().catch(() => ({}))) as any;

    const nameR = validateProviderName(body?.name);
    if (!nameR.ok) return fail(c, 400, nameR.code, nameR.message, nameR.field);
    const urlR = validateBaseUrl(body?.baseUrl);
    if (!urlR.ok) return fail(c, 400, urlR.code, urlR.message, urlR.field);
    const apiR = validateApi(body?.api);
    if (!apiR.ok) return fail(c, 400, apiR.code, apiR.message, apiR.field);
    const displayR = validateDisplayName(body?.displayName);
    if (!displayR.ok) return fail(c, 400, displayR.code, displayR.message, displayR.field);
    const modelsR = validateModels(body?.models);
    if (!modelsR.ok) return fail(c, 400, modelsR.code, modelsR.message, modelsR.field);
    if (modelsR.value.length === 0) return fail(c, 400, "INVALID_MODELS", "至少配置一个模型。", "models");

    // P3：Key 默认「直接填写」并加密保存，环境变量是备选；两种都不回显
    const keyMode = body?.keyMode === "env" ? "env" : "literal";
    let apiKeyEnv: string | null = null;
    let apiKeyEnc: string | null = null;
    if (keyMode === "env") {
      const envR = validateEnvName(body?.apiKeyEnv);
      if (!envR.ok) return fail(c, 400, envR.code, envR.message, envR.field);
      apiKeyEnv = envR.value;
    } else {
      const keyR = validateLiteralKey(body?.apiKey);
      if (!keyR.ok) return fail(c, 400, keyR.code, keyR.message, keyR.field);
      apiKeyEnc = encryptSecret(keyR.value);
    }

    let created;
    try {
      created = await prisma.provider.create({
        data: {
          name: nameR.value,
          displayName: displayR.value,
          baseUrl: urlR.value,
          api: apiR.value,
          keyMode,
          apiKeyEnv,
          apiKeyEnc,
          modelsJson: JSON.stringify(modelsR.value),
        },
      });
    } catch (error) {
      // 并发/重名：Prisma P2002，别让唯一约束变成 500
      if ((error as { code?: string }).code === "P2002") {
        return fail(c, 409, "PROVIDER_EXISTS", "这个供应商名已经被占用了。", "name");
      }
      throw error;
    }
    invalidateConfigCache();
    audit({
      actor: c.get("admin").username,
      action: "provider.create",
      target: created.name,
      detail: { baseUrl: created.baseUrl, api: created.api, keyMode, models: modelsR.value.length },
    });
    return c.json(publicView(created), 201);
  });

  p.patch("/providers/:id", async (c) => {
    const id = c.req.param("id");
    const body = (await c.req.json().catch(() => ({}))) as any;
    // 引用检查和写库要连着做，否则停用可能插进发布的校验之后
    return withConfigLock(async () => {
    const provider = await prisma.provider.findUnique({ where: { id } });
    if (!provider) return fail(c, 404, "PROVIDER_NOT_FOUND", "没有找到这个供应商。");

    // 线上配置不能因为改供应商而坏掉：改名、停用、删模型都要先看谁在用
    const refs = await referencingVersions(provider);
    const usedByPublished = refs.some((version) => version.status === "published");
    const current = await currentPublishedModel();

    const data: any = {};
    const changed: string[] = [];

    if (body?.name !== undefined) {
      const nameR = validateProviderName(body.name);
      if (!nameR.ok) return fail(c, 400, nameR.code, nameR.message, nameR.field);
      if (nameR.value !== provider.name) {
        if (refs.length > 0) {
          return fail(c, 409, "PROVIDER_IN_USE", "这个供应商正被线上或草稿配置引用，先换掉再改名。", "name");
        }
        data.name = nameR.value;
        changed.push("name");
      }
    }
    if (body?.displayName !== undefined) {
      const displayR = validateDisplayName(body.displayName);
      if (!displayR.ok) return fail(c, 400, displayR.code, displayR.message, displayR.field);
      data.displayName = displayR.value;
      changed.push("displayName");
    }
    if (body?.baseUrl !== undefined) {
      const urlR = validateBaseUrl(body.baseUrl);
      if (!urlR.ok) return fail(c, 400, urlR.code, urlR.message, urlR.field);
      data.baseUrl = urlR.value;
      changed.push("baseUrl");
    }
    if (body?.api !== undefined) {
      const apiR = validateApi(body.api);
      if (!apiR.ok) return fail(c, 400, apiR.code, apiR.message, apiR.field);
      data.api = apiR.value;
      changed.push("api");
    }
    if (body?.models !== undefined) {
      const modelsR = validateModels(body.models);
      if (!modelsR.ok) return fail(c, 400, modelsR.code, modelsR.message, modelsR.field);
      if (modelsR.value.length === 0) return fail(c, 400, "INVALID_MODELS", "至少配置一个模型。", "models");
      // 线上正在用的模型不许被悄悄拿掉
      // 老数据里 model.provider 可能存的是 cuid id，两个都算「线上在用」
      const onlineUsesThis = current?.provider === provider.name || current?.provider === provider.id;
      if (usedByPublished && onlineUsesThis) {
        const stillThere = modelsR.value.some((one) => one.id === current.model);
        const wasThere = normaliseModels(parseModelsJson(provider.modelsJson)).some((one) => one.id === current.model);
        if (wasThere && !stillThere) {
          return fail(c, 409, "PROVIDER_IN_USE", `线上配置正在使用模型 ${current.model}，不能从列表里删掉。`, "models");
        }
      }
      data.modelsJson = JSON.stringify(modelsR.value);
      changed.push("models");
    }
    if (typeof body?.enabled === "boolean") {
      if (!body.enabled && usedByPublished) {
        return fail(c, 409, "PROVIDER_IN_USE", "线上配置正在使用这个供应商，不能停用。", "enabled");
      }
      data.enabled = body.enabled;
      changed.push("enabled");
    }

    // Key：literal 模式下留空表示「不改已存 Key」
    const rawKey = typeof body?.apiKey === "string" ? body.apiKey.trim() : "";
    const rawEnv = typeof body?.apiKeyEnv === "string" ? body.apiKeyEnv.trim() : "";
    let keyModeIn: "env" | "literal" | undefined;
    if (body?.keyMode === "env" || body?.keyMode === "literal") keyModeIn = body.keyMode;
    else if (body?.keyMode !== undefined) return fail(c, 400, "INVALID_KEY", "keyMode 只能是 env 或 literal。", "keyMode");
    else if (rawEnv) keyModeIn = "env";
    else if (rawKey) keyModeIn = "literal";

    let keyChanged = false;
    if (keyModeIn === "env") {
      const envR = validateEnvName(rawEnv || provider.apiKeyEnv || "");
      if (!envR.ok) return fail(c, 400, envR.code, envR.message, envR.field);
      data.keyMode = "env";
      data.apiKeyEnv = envR.value;
      data.apiKeyEnc = null;
      keyChanged = true;
    } else if (keyModeIn === "literal") {
      if (rawKey) {
        const keyR = validateLiteralKey(rawKey);
        if (!keyR.ok) return fail(c, 400, keyR.code, keyR.message, keyR.field);
        data.keyMode = "literal";
        data.apiKeyEnc = encryptSecret(keyR.value);
        data.apiKeyEnv = null;
        keyChanged = true;
      } else if (provider.keyMode !== "literal" || !provider.apiKeyEnc) {
        return fail(c, 400, "INVALID_KEY", "切到「直接填写」需要填入 Key。", "apiKey");
      }
    }

    if (Object.keys(data).length === 0) return fail(c, 400, "NO_CHANGES", "没有可更新的字段。");
    let updated;
    try {
      updated = await prisma.provider.update({ where: { id }, data });
    } catch (error) {
      if (isMissingRecord(error)) return fail(c, 404, "PROVIDER_NOT_FOUND", "没有找到这个供应商。");
      if ((error as { code?: string }).code === "P2002") {
        return fail(c, 409, "PROVIDER_EXISTS", "这个供应商名已经被占用了。", "name");
      }
      throw error;
    }
    // Key / baseUrl / 启停都可能影响讲解员，别让运行时缓存继续用旧值（默认缓存 10 秒）
    invalidateConfigCache();
    audit({
      actor: c.get("admin").username,
      action: "provider.update",
      target: updated.name,
      detail: { fields: changed, keyChanged },
    });
    return c.json(publicView(updated));
    });
  });

  p.post("/providers/:id/test", async (c) => {
    const provider = await prisma.provider.findUnique({ where: { id: c.req.param("id") } });
    if (!provider) return fail(c, 404, "PROVIDER_NOT_FOUND", "没有找到这个供应商。");
    const body = (await c.req.json().catch(() => ({}))) as any;
    const result = await testProvider(provider, typeof body?.model === "string" ? body.model : undefined);
    await recordTest(provider.id, result);
    return c.json(result);
  });

  p.post("/providers/:id/models:fetch", async (c) => {
    const provider = await prisma.provider.findUnique({ where: { id: c.req.param("id") } });
    if (!provider) return fail(c, 404, "PROVIDER_NOT_FOUND", "没有找到这个供应商。");
    const result = await fetchModelList(provider);
    return c.json(result);
  });

  // 删供应商。被「已发布配置」或「草稿配置」引用时拒绝，避免讲解员指向不存在的供应商。
  p.delete("/providers/:id", async (c) => {
    const id = c.req.param("id");
    return withConfigLock(async () => {
    const provider = await prisma.provider.findUnique({ where: { id } });
    if (!provider) return fail(c, 404, "PROVIDER_NOT_FOUND", "没有找到这个供应商。");
    const refs = await referencingVersions(provider);
    const usedBy = refs.find((version) => version.status === "published") ?? refs[0];
    if (usedBy) {
      const where = usedBy.status === "published" ? "已发布配置" : "草稿配置";
      return fail(c, 409, "PROVIDER_IN_USE", `这个供应商正被${where}使用，先在配置里换掉再删。`);
    }
    await prisma.provider.delete({ where: { id } });
    invalidateConfigCache();
    audit({ actor: c.get("admin").username, action: "provider.delete", target: provider.name });
    return c.body(null, 204);
    });
  });

  // 表单还没保存时测连接——请求体同新建供应商，Key 只在内存里用一次，不落库也不回显。
  p.post("/providers/test", async (c) => {
    const body = (await c.req.json().catch(() => ({}))) as any;
    const form = await readFormProvider(body, { requireModels: true });
    if (!form.ok) return fail(c, 400, form.code, form.message, form.field);
    const result = await testProvider(form.provider, typeof body?.model === "string" ? body.model : undefined, form.explicitKey);
    return c.json({
      ok: result.ok,
      latencyMs: result.latencyMs,
      message: result.message,
      model: result.model ?? null,
      httpStatus: result.httpStatus ?? null,
    });
  });

  // 「新增时先拉模型再保存」：不要求 models，其余同 /providers/test
  p.post("/providers/models:fetch", async (c) => {
    const body = (await c.req.json().catch(() => ({}))) as any;
    const form = await readFormProvider(body, { requireModels: false });
    if (!form.ok) return fail(c, 400, form.code, form.message, form.field);
    const result = await fetchModelList(form.provider, form.explicitKey);
    return c.json(result);
  });

  // ── 购物管理 ────────────────────────────────────────
  p.get("/orders", async (c) => {
    const { page, pageSize, skip, take } = paging(c);
    const statuses = multi(c.req.query("status"));
    const q = c.req.query("q")?.trim();
    const productId = c.req.query("productId")?.trim();
    const sort = sortSpec(c, ORDER_SORTS);
    if (!sort) return fail(c, 400, "BAD_SORT", "排序字段不支持。", "sort");
    const where: any = {};
    if (statuses) where.status = { in: statuses };
    // S5：商品页的「待发货」跳到筛好的订单页
    if (productId) where.items = { some: { productId } };
    if (q) where.OR = [{ orderNo: { contains: q } }, { user: { phone: { contains: q } } }, { user: { name: { contains: q } } }];
    const [total, rows] = await Promise.all([
      prisma.order.count({ where }),
      prisma.order.findMany({
        where,
        skip,
        take,
        orderBy: sortToOrderBy(sort, { createdAt: "desc" }),
        include: { user: { select: { name: true, phone: true } }, items: { select: { qty: true } } },
      }),
    ]);
    return c.json({
      items: rows.map((o) => ({
        orderNo: o.orderNo,
        status: o.status,
        totalCents: o.totalCents,
        itemCount: o.items.reduce((sum, line) => sum + line.qty, 0),
        user: o.user.name,
        phone: o.user.phone,
        carrier: o.carrier,
        trackingNo: o.trackingNo,
        createdAt: o.createdAt.getTime(),
        paidAt: o.paidAt?.getTime() ?? null,
        shippedAt: o.shippedAt?.getTime() ?? null,
        completedAt: o.completedAt?.getTime() ?? null,
      })),
      total,
      page,
      pageSize,
    });
  });

  p.get("/orders/:orderNo", async (c) => {
    const order = await prisma.order.findUnique({
      where: { orderNo: c.req.param("orderNo") },
      include: { items: true, payment: true, user: { select: { id: true, name: true, phone: true } } },
    });
    if (!order) return fail(c, 404, "ORDER_NOT_FOUND", "没有找到这个订单。");
    return c.json({
      ...order,
      createdAt: order.createdAt.getTime(),
      updatedAt: order.updatedAt.getTime(),
      paidAt: order.paidAt?.getTime() ?? null,
      shippedAt: order.shippedAt?.getTime() ?? null,
      completedAt: order.completedAt?.getTime() ?? null,
      expiresAt: order.expiresAt.getTime(),
      address: JSON.parse(order.addressJson),
      shipping: JSON.parse(order.shippingJson),
      payment: order.payment ? { ...order.payment, paidAt: order.payment.paidAt.getTime() } : null,
      // 只列已经发生过的状态节点，按时间升序
      timeline: [
        { status: "created", at: order.createdAt.getTime() },
        ...(order.paidAt ? [{ status: "paid", at: order.paidAt.getTime() }] : []),
        ...(order.shippedAt ? [{ status: "shipped", at: order.shippedAt.getTime() }] : []),
        ...(order.completedAt ? [{ status: "completed", at: order.completedAt.getTime() }] : []),
      ].sort((a, b) => a.at - b.at),
    });
  });

  p.patch("/skus/:id", async (c) => {
    const id = c.req.param("id");
    const body = (await c.req.json().catch(() => ({}))) as any;
    // 查同名 + 写库在同一把锁里：schema 没有 (itemId, variantName) 唯一约束
    return withConfigLock(async () => {
      const existing = await prisma.productSku.findUnique({ where: { id } });
      if (!existing) return fail(c, 404, "SKU_NOT_FOUND", "没有找到这个 SKU。");
      const parsed = readSkuFields(body, true);
      if (!parsed.ok) return fail(c, 400, parsed.code, parsed.message, parsed.field);
      const data = parsed.data;
      if (Object.keys(data).length === 0) return fail(c, 400, "NO_CHANGES", "没有可更新的字段。");
      if (data.variantName && data.variantName !== existing.variantName) {
        const conflict = await prisma.productSku.findFirst({
          where: { itemId: existing.itemId, variantName: data.variantName, NOT: { id } },
          select: { id: true },
        });
        if (conflict) return fail(c, 409, "SKU_EXISTS", "同一商品下已有同名规格。", "variantName");
      }
      const sku = await prisma.productSku.update({ where: { id }, data });
      audit({
        actor: c.get("admin").username,
        action: "sku.update",
        target: id,
        detail: { fields: Object.keys(data), values: data },
      });
      return c.json(sku);
    });
  });

  p.get("/skus", async (c) => {
    const rows = await prisma.productSku.findMany({ orderBy: [{ itemId: "asc" }, { sort: "asc" }] });
    return c.json(rows);
  });

  p.get("/users", async (c) => {
    const q = c.req.query("q")?.trim();
    const rows = await prisma.user.findMany({
      where: q ? { OR: [{ name: { contains: q } }, { phone: { contains: q } }] } : undefined,
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    return c.json(
      rows.map((u) => ({ id: u.id, name: u.name, phone: u.phone, createdAt: u.createdAt.getTime() })),
    );
  });

  // 仪表板统计、批量上下架、讲解员测试场、配置版本
  registerStats(p);
  // 账号与权限（/accounts 只有管理员能进：运营白名单里没有这两条路径）
  registerAccounts(p);
  registerBatch(p);
  // 展项管理：页面头（page.park/museum/history）与史料分类
  registerContentPages(p);
  registerGuideTry(p);
  // 商品与库存（board=product 的 Item + ProductSku + 销售聚合）
  registerProducts(p);
  registerConfigVersions(p);
  // pi models.json 读取与导入（只读 pi 文件，绝不回传 Key）
  registerPiProviders(p);

  // 知识库补充（wiki 阅读 + 切片增删改）与 VR 场景管理
  registerKbExtra(p);
  registerVr(p);

  app.route("/", p);
  app.notFound((c) => fail(c, 404, "NOT_FOUND", "无此接口"));
  return app;
}
