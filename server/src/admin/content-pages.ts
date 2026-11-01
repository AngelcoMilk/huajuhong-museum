// 展项管理的两块「单例」配置：
//   · 页面头：园区 / 博物馆 / 史料 的标题、简介、头图、数据带，存 Setting page.<board>
//   · 史料分类：分类清单与顺序，存 Setting history.sections，改名要同步所有史料行
// 只有管理员能进（运营白名单里没有这两条路径）。
import { prisma } from "../db.ts";
import { audit } from "./audit.ts";
import { isSafeSrc } from "./blocks.ts";

/** 页面头只认这三个板块 */
const PAGE_BOARDS = ["park", "museum", "history"] as const;

const MAX_STATS = 12;
const MAX_STAT_FIELD = 60;

function fail(c: any, status: 400 | 404 | 409, code: string, message: string, field?: string) {
  return c.json({ error: { code, message, ...(field ? { field } : {}) } }, status);
}

function actorOf(c: any): string {
  return c.get("admin")?.username ?? "unknown";
}

/** Setting 读一个键；不存在或坏 JSON 都回 null */
async function readSetting(key: string): Promise<unknown> {
  const row = await prisma.setting.findUnique({ where: { key } });
  if (!row) return null;
  try {
    return JSON.parse(row.value);
  } catch {
    return null;
  }
}

async function writeSetting(key: string, value: unknown) {
  const text = JSON.stringify(value);
  await prisma.setting.upsert({ where: { key }, create: { key, value: text }, update: { value: text } });
}

/** 页面头字段校验：多给的键直接丢掉，值不合法报错 */
function readPageHead(body: any): { ok: true; value: any } | { ok: false; field: string; code: string; message: string } {
  const title = typeof body?.title === "string" ? body.title.trim() : "";
  if (!title || title.length > 100) {
    return { ok: false, field: "title", code: "INVALID_TITLE", message: "标题要在 1–100 字之间。" };
  }
  const value: any = { title };

  if (body?.intro !== undefined && body.intro !== null) {
    if (typeof body.intro !== "string" || body.intro.length > 2000) {
      return { ok: false, field: "intro", code: "INVALID_INTRO", message: "简介不能超过 2000 字。" };
    }
    value.intro = body.intro;
  } else {
    value.intro = "";
  }

  // 空串、纯空白都当没有图（前端清空输入框时不该报错）
  const heroImage = typeof body?.heroImage === "string" ? body.heroImage.trim() : body?.heroImage;
  if (heroImage === undefined || heroImage === null || heroImage === "") {
    value.heroImage = null;
  } else if (isSafeSrc(heroImage)) {
    value.heroImage = heroImage;
  } else {
    return { ok: false, field: "heroImage", code: "INVALID_URL", message: "头图地址要在 http(s) 或站内 / 开头。" };
  }

  const stats: { value: string; unit: string; label: string }[] = [];
  if (body?.stats !== undefined) {
    if (!Array.isArray(body.stats)) return { ok: false, field: "stats", code: "INVALID_STATS", message: "数据带要是数组。" };
    if (body.stats.length > MAX_STATS) {
      return { ok: false, field: "stats", code: "INVALID_STATS", message: `数据带最多 ${MAX_STATS} 条。` };
    }
    for (const raw of body.stats) {
      if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
        return { ok: false, field: "stats", code: "INVALID_STATS", message: "数据带每一条都要是对象。" };
      }
      const one = { value: "", unit: "", label: "" };
      for (const key of ["value", "unit", "label"] as const) {
        const field = (raw as any)[key];
        if (field === undefined || field === null) continue;
        if (typeof field !== "string" || field.length > MAX_STAT_FIELD) {
          return { ok: false, field: "stats", code: "INVALID_STATS", message: `数据带里的 ${key} 要是 ${MAX_STAT_FIELD} 字以内的文字。` };
        }
        one[key] = field;
      }
      stats.push(one);
    }
  }
  value.stats = stats;
  return { ok: true, value };
}

/** history.sections 是个字符串数组；坏数据当空表 */
function sectionOrder(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((item): item is string => typeof item === "string" && !!item.trim()).map((item) => item.trim());
}

export function registerContentPages(app: any) {
  // ── 页面头（园区 / 博物馆 / 史料） ────────────────────
  app.get("/content-pages/:board", async (c: any) => {
    const board = c.req.param("board");
    if (!(PAGE_BOARDS as readonly string[]).includes(board)) return fail(c, 404, "BOARD_NOT_FOUND", "没有这个板块。");
    return c.json(await readSetting(`page.${board}`));
  });

  app.put("/content-pages/:board", async (c: any) => {
    const board = c.req.param("board");
    if (!(PAGE_BOARDS as readonly string[]).includes(board)) return fail(c, 404, "BOARD_NOT_FOUND", "没有这个板块。");
    const body = (await c.req.json().catch(() => ({}))) as any;
    const read = readPageHead(body);
    if (!read.ok) return fail(c, 400, read.code, read.message, read.field);
    await writeSetting(`page.${board}`, read.value);
    audit({ actor: actorOf(c), action: "page.update", target: `page.${board}`, detail: { board } });
    return c.json(read.value);
  });

  // ── 史料分类 ────────────────────────────────────────
  // 顺序：先按 Setting history.sections 里的顺序，没列到的按名字排在后面；
  // Setting 里列了但一篇都没有的也列出来（count 0）。count 不算 archived。
  app.get("/history-sections", async (c: any) => {
    const rows = await prisma.item.findMany({
      where: { board: "history" },
      select: { section: true, status: true },
    });
    const counts = new Map<string, { count: number; published: number }>();
    for (const row of rows) {
      const name = (row.section ?? "").trim();
      if (!name) continue;
      const bucket = counts.get(name) ?? { count: 0, published: 0 };
      if (row.status !== "archived") bucket.count += 1;
      if (row.status === "published") bucket.published += 1;
      counts.set(name, bucket);
    }
    const order = sectionOrder(await readSetting("history.sections"));
    const names = [...order, ...[...counts.keys()].filter((name) => !order.includes(name)).sort()];
    const items = names.map((name) => ({
      name,
      count: counts.get(name)?.count ?? 0,
      published: counts.get(name)?.published ?? 0,
    }));
    return c.json({ items });
  });

  app.patch("/history-sections", async (c: any) => {
    const body = (await c.req.json().catch(() => ({}))) as any;
    const hasOrder = body?.order !== undefined;
    const rename = body?.rename;
    if (!hasOrder && rename === undefined) return fail(c, 400, "NO_CHANGES", "没有要改的分类。");

    let order: string[] | null = null;
    if (hasOrder) {
      if (!Array.isArray(body.order)) return fail(c, 400, "INVALID_ORDER", "顺序要是数组。", "order");
      const list: string[] = [];
      for (const raw of body.order) {
        if (typeof raw !== "string") return fail(c, 400, "INVALID_ORDER", "每个分类名都要是文字。", "order");
        const name = raw.trim();
        if (!name || name.length > 40) return fail(c, 400, "INVALID_ORDER", "分类名要在 1–40 字之间。", "order");
        list.push(name);
      }
      if (new Set(list).size !== list.length) return fail(c, 400, "INVALID_ORDER", "分类名不能重复。", "order");
      order = list;
    }

    const current = sectionOrder(await readSetting("history.sections"));
    const rows = await prisma.item.findMany({ where: { board: "history" }, select: { section: true } });
    const existing = new Set<string>(current);
    for (const row of rows) {
      const name = (row.section ?? "").trim();
      if (name) existing.add(name);
    }

    let renamed: { from: string; to: string } | null = null;
    if (rename !== undefined) {
      if (typeof rename !== "object" || rename === null || Array.isArray(rename)) {
        return fail(c, 400, "INVALID_RENAME", "改名要写 from 和 to。", "rename");
      }
      const from = typeof (rename as any).from === "string" ? (rename as any).from.trim() : "";
      const to = typeof (rename as any).to === "string" ? (rename as any).to.trim() : "";
      if (!from || !to || from.length > 40 || to.length > 40) {
        return fail(c, 400, "INVALID_RENAME", "分类名要在 1–40 字之间。", "rename");
      }
      if (!existing.has(from)) return fail(c, 404, "SECTION_NOT_FOUND", "没有这个分类。", "rename");
      if (to !== from && existing.has(to)) return fail(c, 409, "SECTION_EXISTS", "已经有同名分类了。", "rename");
      renamed = { from, to };
    }

    await prisma.$transaction(async (tx) => {
      if (renamed) {
        // 改名同步所有史料行（含 archived）和顺序表
        await tx.item.updateMany({ where: { board: "history", section: renamed.from }, data: { section: renamed.to } });
      }
      if (order) {
        const next = renamed ? order.map((name) => (name === renamed.from ? renamed.to : name)) : order;
        await tx.setting.upsert({
          where: { key: "history.sections" },
          create: { key: "history.sections", value: JSON.stringify(next) },
          update: { value: JSON.stringify(next) },
        });
      } else if (renamed) {
        const next = current.map((name) => (name === renamed.from ? renamed.to : name));
        if (!next.includes(renamed.to)) next.push(renamed.to);
        await tx.setting.upsert({
          where: { key: "history.sections" },
          create: { key: "history.sections", value: JSON.stringify(next) },
          update: { value: JSON.stringify(next) },
        });
      }
    });

    audit({
      actor: actorOf(c),
      action: renamed ? "history.section.rename" : "history.section.order",
      target: "history.sections",
      detail: { ...(renamed ? { rename: renamed } : {}), ...(order ? { order } : {}) },
    });
    return c.json({ ok: true, ...(renamed ? { rename: renamed } : {}), ...(order ? { order } : {}) });
  });
}
