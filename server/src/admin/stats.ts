// 仪表板统计：访问 / 讲解 / 成交 / 待办，外加日趋势与热门条目。
//
// 口径（写死在这里，对拍按这几条算）：
// - 时区 Asia/Shanghai（UTC+8，无夏令时）；"今天"从当地 00:00 起。
// - PV = TrackEvent 里 kind='page_view' 的事件数；UV = 同一口径下按 visitorId 去重。
// - 近 7 天 = [now-7d, now)；上一周 = [now-14d, now-7d)；近 30 天 = [now-30d, now)。
// - 讲解：一轮 = 一条 role='assistant' 的 AgentMessage；errorCode 为空算成功，否则算失败；
//   词元从 usageJson 的 inputTokens/outputTokens 累加；测试场会话（isTest=true）整体排除。
// - 成交：status ∈ paid/shipped/completed 且 paidAt 落在窗口内的订单，金额取 totalCents。
// - 热门条目：一条 page_view 算哪个条目的浏览——先看 targetId；targetId 为空时从 route 解析，
//   规则：取 route 里最后一个形如 XX-001 的路径段（去掉 ?query 与 #hash），形如 /products/CP-002。
//   解析出来的编号必须能在 Item 里查到才算数；板块以 Item.board 为准，不按路由前缀猜。
//   /park、/products、/craft、/ 这类板块页解析不出编号，不计入条目排行。
//   share 的分母 = 同一 board 口径下命中已发布条目的浏览总数（1 位小数）。
// - todo.itemsDraft 只算 park/museum/history 三个内容板块的 status='draft' 条目，
//   商品（改走 /products）、企业与 VR 的草稿不计入。
// - todo.lowStock = 已发布商品里存在「已上架、可购买、库存 ≤ 阈值」规格的商品数。
import type { Context } from "hono";
import { prisma } from "../db.ts";
import { PAID_STATUSES, countLowStockProducts } from "./products.ts";

const SHANGHAI_OFFSET_MS = 8 * 3600_000;
const DAY_MS = 864e5;

const RANGES = ["day", "week", "month", "all"] as const;
type Range = (typeof RANGES)[number];

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

/** 上海时区当天 00:00 对应的时刻 */
function shanghaiMidnight(now: Date): Date {
  const shifted = new Date(now.getTime() + SHANGHAI_OFFSET_MS);
  const startUtc = Date.UTC(shifted.getUTCFullYear(), shifted.getUTCMonth(), shifted.getUTCDate());
  return new Date(startUtc - SHANGHAI_OFFSET_MS);
}

/** 上海时区的 YYYY-MM-DD */
export function shanghaiDayKey(date: Date): string {
  return new Date(date.getTime() + SHANGHAI_OFFSET_MS).toISOString().slice(0, 10);
}

function rangeStart(range: Range, now: Date): Date | null {
  if (range === "all") return null;
  if (range === "day") return shanghaiMidnight(now);
  if (range === "month") return new Date(now.getTime() - 30 * DAY_MS);
  return new Date(now.getTime() - 7 * DAY_MS);
}

/** 路径段里的条目编号：XX-001（大写字母开头，字母数字） */
const ITEM_ID_SEGMENT = /^[A-Z]{2}-[A-Z0-9]+$/;

/**
 * 一条 page_view 算哪个条目：targetId 是条目编号就用它；
 * 否则从 route 里取最后一个形如 XX-001 的路径段（/products/CP-002 → CP-002）。
 * 拿不到的（/park、/products、/craft、/）返回 null，不计入条目排行。
 */
function itemIdOf(targetId: string | null | undefined, route: string): string | null {
  const direct = String(targetId ?? "").trim();
  if (direct && ITEM_ID_SEGMENT.test(direct)) return direct;
  const path = String(route ?? "").split("?")[0].split("#")[0];
  const segments = path.split("/").filter(Boolean);
  for (let i = segments.length - 1; i >= 0; i -= 1) {
    // route 由访客端随意上报（如 /a/%），畸形百分号编码不能把统计接口带崩
    let segment = segments[i];
    try {
      segment = decodeURIComponent(segment);
    } catch {
      /* 解不开就按原样用 */
    }
    if (ITEM_ID_SEGMENT.test(segment.trim())) return segment.trim();
  }
  return null;
}

function readRange(c: Context): Range {
  const raw = (c.req.query("range") ?? "").trim().toLowerCase();
  return (RANGES as readonly string[]).includes(raw) ? (raw as Range) : "week";
}

export function registerStats(app: any) {
  // ── 仪表板 ──────────────────────────────────────
  app.get("/stats/dashboard", async (c) => {
    const now = new Date();
    const range = readRange(c);
    const since = rangeStart(range, now);
    const today = shanghaiMidnight(now);
    const weekAgo = new Date(now.getTime() - 7 * DAY_MS);
    const twoWeeksAgo = new Date(now.getTime() - 14 * DAY_MS);
    const monthAgo = new Date(now.getTime() - 30 * DAY_MS);

    const pv = (from: Date, to?: Date) => ({
      kind: "page_view",
      ts: to ? { gte: from, lt: to } : { gte: from },
    });

    const [totalPv, todayPv, weekPv, lastWeekPv, monthPv] = await Promise.all([
      prisma.trackEvent.count({ where: { kind: "page_view" } }),
      prisma.trackEvent.count({ where: pv(today) }),
      prisma.trackEvent.count({ where: pv(weekAgo) }),
      prisma.trackEvent.count({ where: pv(twoWeeksAgo, weekAgo) }),
      prisma.trackEvent.count({ where: pv(monthAgo) }),
    ]);
    const [totalUvRows, todayUvRows] = await Promise.all([
      prisma.trackEvent.groupBy({ by: ["visitorId"], where: { kind: "page_view" } }),
      prisma.trackEvent.groupBy({ by: ["visitorId"], where: pv(today) }),
    ]);

    // 讲解：只算真实访客会话，测试场（isTest）不进统计
    const guideWhere: any = { role: "assistant", session: { isTest: false } };
    if (since) guideWhere.createdAt = { gte: since };
    const [sessions, messages] = await Promise.all([
      prisma.agentSession.count({
        where: { isTest: false, ...(since ? { startedAt: { gte: since } } : {}) },
      }),
      prisma.agentMessage.findMany({ where: guideWhere, select: { errorCode: true, usageJson: true } }),
    ]);
    let failed = 0;
    let inputTokens = 0;
    let outputTokens = 0;
    for (const message of messages) {
      if (message.errorCode) failed += 1;
      if (message.usageJson) {
        try {
          const usage = JSON.parse(message.usageJson) as { inputTokens?: number; outputTokens?: number };
          inputTokens += Number(usage?.inputTokens) || 0;
          outputTokens += Number(usage?.outputTokens) || 0;
        } catch {
          /* 坏 JSON 不计入词元，但仍算一轮 */
        }
      }
    }
    const turns = messages.length;
    const success = turns - failed;

    const paidOrders = await prisma.order.findMany({
      where: { status: { in: PAID_STATUSES }, ...(since ? { paidAt: { gte: since } } : {}) },
      select: { totalCents: true },
    });

    const [ordersToShip, gapsPending, enterprisesUnplaced, itemsDraft, lowStock] = await Promise.all([
      prisma.order.count({ where: { status: "paid" } }),
      prisma.kbGap.count({ where: { status: "pending" } }),
      prisma.item.count({
        where: {
          board: "enterprise",
          OR: [{ enterprise: null }, { enterprise: { OR: [{ lng: null }, { lat: null }] } }],
        },
      }),
      // 商品走 /products 管理，不再算进内容草稿；企业与 VR 的草稿也不计入（同一口径）
      prisma.item.count({ where: { status: "draft", board: { in: ["park", "museum", "history"] } } }),
      countLowStockProducts(),
    ]);

    // 运营的仪表板只给订单相关待办。角色取自本次请求从库里读到的身份（requireAdmin 挂的 role）
    const isOperator = c.get("admin")?.role === "operator";
    return c.json({
      generatedAt: now.getTime(),
      visits: {
        totalPv,
        totalUv: totalUvRows.length,
        todayPv,
        todayUv: todayUvRows.length,
        weekPv,
        monthPv,
        lastWeekPv,
        weekChangePct: lastWeekPv === 0 ? null : round1(((weekPv - lastWeekPv) / lastWeekPv) * 100),
      },
      guide: {
        range,
        sessions,
        turns,
        success,
        failed,
        successRate: turns === 0 ? null : round1((success / turns) * 100),
        inputTokens,
        outputTokens,
      },
      sales: {
        range,
        paidOrders: paidOrders.length,
        amountCents: paidOrders.reduce((sum, order) => sum + order.totalCents, 0),
      },
      // 运营的待办只留订单项——内容草稿、企业坐标、知识库缺口、低库存都不给运营（不是返回 0，是不返回）
      todo: isOperator
        ? { ordersToShip }
        : { ordersToShip, gapsPending, enterprisesUnplaced, itemsDraft, lowStock },
    });
  });

  // ── 日趋势：按上海时区补零，长度恰好 days ──────────
  app.get("/stats/daily", async (c) => {
    const raw = Number(c.req.query("days") ?? 30);
    const days = Number.isFinite(raw) ? Math.min(90, Math.max(1, Math.round(raw))) : 30;
    const today = shanghaiMidnight(new Date());
    const first = new Date(today.getTime() - (days - 1) * DAY_MS);

    type Bucket = { day: string; pv: number; visitors: Set<string>; guideTurns: number; amountCents: number };
    const buckets = new Map<string, Bucket>();
    for (let i = 0; i < days; i += 1) {
      const key = shanghaiDayKey(new Date(first.getTime() + i * DAY_MS));
      buckets.set(key, { day: key, pv: 0, visitors: new Set<string>(), guideTurns: 0, amountCents: 0 });
    }

    const [events, messages, orders] = await Promise.all([
      prisma.trackEvent.findMany({
        where: { kind: "page_view", ts: { gte: first } },
        select: { ts: true, visitorId: true },
      }),
      prisma.agentMessage.findMany({
        where: { role: "assistant", createdAt: { gte: first }, session: { isTest: false } },
        select: { createdAt: true },
      }),
      prisma.order.findMany({
        where: { status: { in: PAID_STATUSES }, paidAt: { gte: first } },
        select: { paidAt: true, totalCents: true },
      }),
    ]);

    for (const event of events) {
      const bucket = buckets.get(shanghaiDayKey(event.ts));
      if (!bucket) continue;
      bucket.pv += 1;
      bucket.visitors.add(event.visitorId);
    }
    for (const message of messages) {
      const bucket = buckets.get(shanghaiDayKey(message.createdAt));
      if (bucket) bucket.guideTurns += 1;
    }
    for (const order of orders) {
      if (!order.paidAt) continue;
      const bucket = buckets.get(shanghaiDayKey(order.paidAt));
      if (bucket) bucket.amountCents += order.totalCents;
    }

    return c.json({
      days,
      series: [...buckets.values()]
        .sort((a, b) => (a.day < b.day ? -1 : a.day > b.day ? 1 : 0))
        .map((bucket) => ({
          day: bucket.day,
          pv: bucket.pv,
          uv: bucket.visitors.size,
          guideTurns: bucket.guideTurns,
          amountCents: bucket.amountCents,
        })),
    });
  });

  // ── 热门条目：targetId 优先，没有 targetId 就从 route 解析编号 ──
  app.get("/stats/top-items", async (c) => {
    const board = (c.req.query("board") ?? "all").trim();
    const rawDays = Number(c.req.query("days") ?? 30);
    const days = Number.isFinite(rawDays) ? Math.min(365, Math.max(1, Math.round(rawDays))) : 30;
    const rawLimit = Number(c.req.query("limit") ?? 10);
    const limit = Number.isFinite(rawLimit) ? Math.min(50, Math.max(1, Math.round(rawLimit))) : 10;

    const events = await prisma.trackEvent.findMany({
      where: { kind: "page_view", ts: { gte: new Date(Date.now() - days * DAY_MS) } },
      select: { targetId: true, route: true },
    });
    const views = new Map<string, number>();
    for (const event of events) {
      const id = itemIdOf(event.targetId, event.route);
      if (!id) continue;
      views.set(id, (views.get(id) ?? 0) + 1);
    }
    if (views.size === 0) return c.json({ items: [] });

    const where: any = { id: { in: [...views.keys()] }, status: "published" };
    if (board && board !== "all") where.board = board;
    const rows = await prisma.item.findMany({ where, select: { id: true, title: true, board: true } });

    const totalViews = rows.reduce((sum, row) => sum + (views.get(row.id) ?? 0), 0);
    const items = rows
      .map((row) => {
        const count = views.get(row.id) ?? 0;
        return {
          id: row.id,
          title: row.title,
          board: row.board,
          views: count,
          share: totalViews === 0 ? 0 : round1((count / totalViews) * 100),
        };
      })
      .sort((a, b) => b.views - a.views || a.id.localeCompare(b.id))
      .slice(0, limit);

    return c.json({ items });
  });
}

