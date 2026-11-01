// 公开接口：内容读取（只出已发布）+ 埋点上报。
// 这两个不经过管理员鉴权，属于访客面。
import { Hono } from "hono";
import { prisma } from "./db.ts";
import { parseBlocks } from "./admin/blocks.ts";
import { clientIp } from "./lib/clientIp.ts";
import { createLimiter } from "./lib/rateLimit.ts";

/** G4：/api/track 每 IP 30 次/分钟、5000 行/天，超限回 accepted:0 且不写库 */
const TRACK_PER_MINUTE = 30;
const TRACK_DAILY_MAX = 5000;
const trackLimiter = createLimiter({ windowMs: 60_000, max: TRACK_PER_MINUTE });
const TRACK_DAY_FMT = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Shanghai" });
const trackDaily = new Map<string, { day: string; rows: number }>();

function trackRowsToday(ip: string): { day: string; rows: number } {
  const day = TRACK_DAY_FMT.format(new Date());
  const hit = trackDaily.get(ip);
  if (!hit || hit.day !== day) {
    // 换天就重来，顺手把别处过期的键清掉，别让 Map 无限长
    if (trackDaily.size > 5000) trackDaily.clear();
    const fresh = { day, rows: 0 };
    trackDaily.set(ip, fresh);
    return fresh;
  }
  return hit;
}

/** 摘要：去掉 markdown 记号后取正文前 80 字 */
function summaryOf(body: string | null | undefined): string {
  const text = String(body ?? "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/^\s{0,3}#{1,6}\s*/gm, "")
    .replace(/[*_`~>|-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text.slice(0, 80);
}

function paging(c: any) {
  const page = Math.max(1, Number(c.req.query("page") ?? 1) || 1);
  const pageSize = Math.min(100, Math.max(1, Number(c.req.query("pageSize") ?? 20) || 20));
  return { page, pageSize, skip: (page - 1) * pageSize, take: pageSize };
}

export function makeContentApp() {
  const app = new Hono();

  app.get("/items", async (c) => {
    const { page, pageSize, skip, take } = paging(c);
    const board = c.req.query("board");
    const section = c.req.query("section");
    const q = c.req.query("q")?.trim();
    const where: any = { status: "published" };
    if (board && board !== "all") where.board = board;
    if (section) where.section = section;
    if (q) where.OR = [{ title: { contains: q } }, { body: { contains: q } }, { id: { contains: q } }];

    const [total, rows] = await Promise.all([
      prisma.item.count({ where }),
      prisma.item.findMany({
        where,
        skip,
        take,
        orderBy: [{ board: "asc" }, { sort: "asc" }],
        select: {
          id: true,
          board: true,
          section: true,
          type: true,
          title: true,
          date: true,
          sourceUrl: true,
          _count: { select: { media: true } },
        },
      }),
    ]);
    return c.json({
      items: rows.map((r) => ({ ...r, mediaCount: r._count.media })),
      total,
      page,
      pageSize,
    });
  });

  app.get("/items/:id", async (c) => {
    const item = await prisma.item.findUnique({
      where: { id: c.req.param("id") },
      include: {
        media: { where: { status: "published" }, orderBy: { sort: "asc" } },
        enterprise: true,
        product: true,
      },
    });
    if (!item || item.status !== "published") {
      return c.json({ error: { code: "ITEM_NOT_FOUND", message: "没有找到这条内容。" } }, 404);
    }
    // 后台草稿（draftJson）绝不能从公开接口出去：已发布的文章可能带着未发布的改动
    const { draftJson: _draft, ...rest } = item;
    return c.json(rest);
  });

  /** 展项管理覆盖的三个板块 */
  const EXHIBIT_BOARDS = ["park", "museum", "history"];

  /** labelJson 是历史数据，坏了也不能让整个板块 500 */
  function safeLabel(raw: string | null): unknown {
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  /** Setting 里的 JSON 值；没有或坏了都回 null */
  async function pageSetting(key: string): Promise<unknown> {
    const row = await prisma.setting.findUnique({ where: { key } });
    if (!row) return null;
    try {
      return JSON.parse(row.value);
    } catch {
      return null;
    }
  }

  // 整板块一次取全（含正文与媒体）：前台页面在启动时拉一次，用于"后台改完即变"
  app.get("/board/:board", async (c) => {
    const board = c.req.param("board");
    const isHall = board === "park" || board === "museum";
    const items = await prisma.item.findMany({
      where: isHall ? { board, status: "published", type: { not: "VR场景" } } : { board, status: "published" },
      orderBy: isHall ? [{ sort: "asc" }, { id: "asc" }] : { sort: "asc" },
      include: { media: { orderBy: { sort: "asc" } }, enterprise: true, product: true },
    });

    // 史料只给列表字段（正文走 /item/:id），其他板块保持原样
    if (board === "history") {
      return c.json(
        items.map((item) => ({
          id: item.id,
          title: item.title,
          subtitle: item.subtitle,
          section: item.section,
          date: item.date,
          summary: item.summary,
          coverUrl: item.coverUrl,
        })),
      );
    }

    // 园区：父级没发布的子文章不下发
    const published = new Set(items.map((item) => item.id));
    const visible = isHall ? items.filter((item) => !item.parentId || published.has(item.parentId)) : items;

    return c.json(
      visible.map((item) => ({
        id: item.id,
        board: item.board,
        section: item.section,
        type: item.type,
        title: item.title,
        subtitle: item.subtitle,
        summary: item.summary,
        author: item.author,
        sourceName: item.sourceName,
        coverUrl: item.coverUrl,
        parentId: item.parentId,
        sort: item.sort,
        date: item.date,
        sourceUrl: item.sourceUrl,
        body: item.body ?? "",
        blocks: parseBlocks(item),
        label: safeLabel(item.labelJson),
        media: item.media.map((m) => ({ kind: m.kind, url: m.url, alt: m.alt, usage: m.usage })),
        enterprise: item.enterprise,
        product: item.product,
      })),
    );
  });

  // 单篇正文（含 blocks）：只有展项板块的已发布内容能读，父级没发布的子文章 404
  app.get("/item/:id", async (c) => {
    const item = await prisma.item.findUnique({
      where: { id: c.req.param("id") },
      include: { media: { where: { status: "published" }, orderBy: { sort: "asc" } } },
    });
    const notFound = () => c.json({ error: { code: "ITEM_NOT_FOUND", message: "没有找到这条内容。" } }, 404);
    if (!item || item.status !== "published") return notFound();
    if (!EXHIBIT_BOARDS.includes(item.board)) return notFound();
    if (item.type === "VR场景") return notFound();
    if (item.parentId) {
      const parent = await prisma.item.findUnique({ where: { id: item.parentId }, select: { status: true } });
      if (parent?.status !== "published") return notFound();
    }
    return c.json({
      id: item.id,
      board: item.board,
      section: item.section,
      type: item.type,
      title: item.title,
      subtitle: item.subtitle,
      summary: item.summary,
      author: item.author,
      sourceName: item.sourceName,
      coverUrl: item.coverUrl,
      parentId: item.parentId,
      sort: item.sort,
      date: item.date,
      blocks: parseBlocks(item),
      media: item.media.map((m) => ({ kind: m.kind, url: m.url, alt: m.alt, usage: m.usage })),
    });
  });

  // 页面头（园区 / 博物馆 / 史料）：没有就回 null
  app.get("/page/:board", async (c) => {
    const board = c.req.param("board");
    if (!EXHIBIT_BOARDS.includes(board)) {
      return c.json({ error: { code: "BOARD_NOT_FOUND", message: "没有这个板块。" } }, 404);
    }
    return c.json(await pageSetting(`page.${board}`));
  });

  // 史料分类：只算已发布，count 为 0 的不出现，顺序按后台存的那份
  app.get("/history/sections", async (c) => {
    const order = await pageSetting("history.sections");
    const rows = await prisma.item.findMany({ where: { board: "history", status: "published" }, select: { section: true } });
    const counts = new Map<string, number>();
    for (const row of rows) {
      const name = (row.section ?? "").trim();
      if (!name) continue;
      counts.set(name, (counts.get(name) ?? 0) + 1);
    }
    const listed = Array.isArray(order) ? order.filter((name): name is string => typeof name === "string" && !!name.trim()).map((name) => name.trim()) : [];
    const names = [...listed, ...[...counts.keys()].filter((name) => !listed.includes(name)).sort()];
    return c.json(names.filter((name) => (counts.get(name) ?? 0) > 0).map((name) => ({ name, count: counts.get(name) ?? 0 })));
  });

  // 地图点位（公开读）：后台新建/补录的企业坐标，前台水合后直接落到地图上
  app.get("/enterprise-points", async (c) => {
    const rows = await prisma.enterpriseProfile.findMany({
      where: { lng: { not: null }, lat: { not: null } },
    });
    const points: Record<string, { lng: number; lat: number; coordSource: string; verified: boolean }> = {};
    for (const row of rows) {
      points[row.itemId] = {
        lng: row.lng as number,
        lat: row.lat as number,
        coordSource: row.coordSource ?? "后台录入",
        verified: row.verified,
      };
    }
    return c.json({ count: rows.length, points });
  });

  // ── 跨板块检索：前台 /search 用，只返回已发布内容 ──────────
  // q 必填 1–50 字；limit = 每个板块最多几条（默认 5，上限 20）。
  app.get("/search", async (c) => {
    const q = (c.req.query("q") ?? "").trim();
    if (!q || q.length > 50) {
      return c.json({ error: { code: "BAD_QUERY", message: "请输入 1–50 字的检索词。" } }, 400);
    }
    const rawLimit = Number(c.req.query("limit") ?? 5);
    const limit = Number.isFinite(rawLimit) ? Math.min(20, Math.max(1, Math.round(rawLimit))) : 5;

    const rows = await prisma.item.findMany({
      where: {
        status: "published",
        OR: [{ title: { contains: q } }, { body: { contains: q } }],
      },
      orderBy: [{ board: "asc" }, { sort: "asc" }],
      select: {
        id: true,
        board: true,
        section: true,
        title: true,
        body: true,
        media: { where: { kind: "image" }, orderBy: { sort: "asc" }, take: 1, select: { url: true } },
      },
    });

    // 按板块分组，板块顺序沿用 Item.board 的枚举顺序
    const BOARD_ORDER = ["park", "museum", "history", "product", "enterprise", "vr"];
    const groups = new Map<string, any[]>();
    for (const row of rows) {
      const list = groups.get(row.board) ?? [];
      if (list.length >= limit) continue;
      list.push({
        id: row.id,
        title: row.title,
        summary: summaryOf(row.body),
        section: row.section,
        thumbUrl: row.media[0]?.url ?? null,
      });
      groups.set(row.board, list);
    }

    return c.json({
      q,
      total: rows.length,
      groups: [...groups.entries()]
        .sort((a, b) => {
          const ai = BOARD_ORDER.indexOf(a[0]);
          const bi = BOARD_ORDER.indexOf(b[0]);
          return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
        })
        .map(([board, items]) => ({ board, items })),
    });
  });

  app.get("/vr-scenes", async (c) => {
    const rows = await prisma.vrScene.findMany({
      where: { status: "published" },
      orderBy: [{ sort: "asc" }, { id: "asc" }],
    });
    return c.json(rows);
  });

  // 前台 VR 页：只含 visible 分组和已发布场景；?page=park|museum 只看一页
  app.get("/vr", async (c) => {
    const page = c.req.query("page");
    if (page !== undefined && page !== "park" && page !== "museum") {
      return c.json({ error: { code: "INVALID_PAGE", message: "page 只能是 park 或 museum。" } }, 400);
    }
    const [groups, scenes] = await Promise.all([
      prisma.vrGroup.findMany({
        where: { visible: true, ...(page ? { page } : {}) },
        orderBy: [{ sort: "asc" }, { id: "asc" }],
      }),
      prisma.vrScene.findMany({ where: { status: "published" }, orderBy: [{ sort: "asc" }, { id: "asc" }] }),
    ]);
    const byGroup = new Map<string, any[]>(groups.map((group) => [group.id, []]));
    const ungrouped: any[] = [];
    for (const scene of scenes) {
      if (scene.groupId) {
        // 有分组归属的只出现在那个分组里；分组被隐藏（或属于别的页）就整个不下发
        const bucket = byGroup.get(scene.groupId);
        if (bucket) bucket.push(scene);
        continue;
      }
      // 只有真正没分组的场景才进 ungrouped
      if (!page || scene.group === (page === "park" ? "园区" : "博物馆")) ungrouped.push(scene);
    }
    return c.json({
      groups: groups.map((group) => ({ ...group, scenes: byGroup.get(group.id) ?? [] })),
      ungrouped,
    });
  });

  // 前台可读的系统设置（白名单）：站点标题 / 公告 / 演示价开关。
  // 后台改完即时生效，前端用它在首屏替换写死的品牌名与公告。
  app.get("/settings", async (c) => {
    const PUBLIC_KEYS = ["site.title", "site.notice", "shop.demoPriceEnabled"];
    const rows = await prisma.setting.findMany({ where: { key: { in: PUBLIC_KEYS } } });
    const values: Record<string, string> = {};
    for (const row of rows) values[row.key] = row.value;
    return c.json({ values });
  });

  app.notFound((c) => c.json({ error: { code: "NOT_FOUND", message: "无此接口" } }, 404));
  return app;
}

export function makeTrackApp() {
  const app = new Hono();

  app.post("/track", async (c) => {
    // G4：先判限流，超限直接 accepted:0（前端不关心，库不能被打）
    const ip = clientIp(c);
    const bucket = trackRowsToday(ip);
    if (!trackLimiter.check(ip).ok || bucket.rows >= TRACK_DAILY_MAX) {
      return c.json({ ok: true, accepted: 0 });
    }
    let body: any = null;
    try {
      body = await c.req.json();
    } catch {
      body = null;
    }
    const list = Array.isArray(body?.events) ? body.events.slice(0, 50) : [];
    if (list.length === 0) return c.json({ ok: true, accepted: 0 });

    // IP 只留脱敏网段：IPv4 末段置 0，IPv6 只保留前 4 组。
    // G4：来源用 clientIp，不再直接信 XFF（hops=0 时伪造 XFF 不影响计数）

    let netPrefix: string | null = null;
    if (ip.includes(".")) {
      const parts = ip.split(".");
      if (parts.length === 4) netPrefix = `${parts[0]}.${parts[1]}.${parts[2]}.0`;
    } else if (ip.includes(":")) {
      netPrefix = `${ip.split(":").slice(0, 4).join(":")}::`;
    }

    const ua = c.req.header("user-agent")?.slice(0, 200) ?? null;
    // 只认字符串/数字：埋点是公开接口，对象/数组字段不能让 String() 抛错变成 500
    const text = (value: unknown): string => {
      if (typeof value === "string") return value;
      if (typeof value === "number" && Number.isFinite(value)) return String(value);
      return "";
    };
    const rows = list
      .map((e: any) => ({
        visitorId: text(e?.visitorId).slice(0, 64),
        kind: text(e?.kind),
        route: text(e?.route).slice(0, 200),
        targetId: text(e?.targetId).slice(0, 120) || null,
        durationMs: Number.isFinite(e?.durationMs) ? Math.round(Number(e.durationMs)) : null,
        netPrefix,
        ua,
      }))
      .filter((e: any) => e.visitorId && ["page_view", "page_leave", "click"].includes(e.kind) && e.route);

    if (rows.length === 0) return c.json({ ok: true, accepted: 0 });
    await prisma.trackEvent.createMany({ data: rows });
    // 放行并写库后才记账（行数算当天的额度）
    trackLimiter.hit(ip);
    bucket.rows += rows.length;
    return c.json({ ok: true, accepted: rows.length });
  });

  return app;
}