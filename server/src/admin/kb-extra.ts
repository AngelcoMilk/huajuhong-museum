// 后台知识库补充接口：wiki 页面列表/详情 + 切片增删改。
// 挂载由 admin/routes.ts 统一完成（调用方已挂 JWT 鉴权），本文件只导出注册函数。
import type { Context } from "hono";
import { randomBytes } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { prisma } from "../db.ts";
import { audit } from "./audit.ts";

// 本文件位于 server/src/admin/，向上三级即项目根。
const PROJECT_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
const WIKI_DIR = join(PROJECT_ROOT, "knowledge", "wiki");

// ── 通用工具 ──────────────────────────────────────────

function fail(c: Context, status: 400 | 404 | 500, code: string, message: string, field?: string) {
  return c.json({ error: { code, message, ...(field ? { field } : {}) } }, status);
}

/** 操作日志的 actor：鉴权中间件已把管理员放进 context。 */
function actorOf(c: Context): string {
  const admin = c.get("admin" as any) as { username?: string } | undefined;
  return admin?.username ?? "admin";
}

/**
 * 生成 cuid 形态的切片 id。
 * 注意：schema.prisma 里 KbSlice.id 是 String @id，没有 @default(cuid())，
 * 所以必须由服务端给值，格式沿用 cuid v1 的「c + 时间戳 + 序号 + 随机」。
 */
let cuidSeq = Math.floor(Math.random() * 0xffff);
function nextCuid(): string {
  cuidSeq = (cuidSeq + 1) % 1679616; // 36^4，保持 4 位 base36 序号
  const time = Date.now().toString(36).padStart(8, "0").slice(-8);
  const seq = cuidSeq.toString(36).padStart(4, "0");
  const rand = randomBytes(6).toString("hex").slice(0, 8);
  return `c${time}${seq}${rand}`;
}

// ── wiki 页面 ─────────────────────────────────────────

interface WikiRow {
  slug: string;
  title: string;
  source: string | null;
  updated: string | null;
  chars: number;
}

/**
 * 校验单段页面标识（slug）。
 * knowledge/wiki 下的真实文件名是中文（如「是什么.md」），所以不能只放行 [a-z0-9-]；
 * 这里改为「拒绝一切路径成分」：分隔符、点号、百分号、控制字符、反斜杠一律不给。
 * 真正的穿越防护由 wikiFile() 里的 resolve 包含性校验兜底。
 */
const UNSAFE_SLUG = /[\\/\u0000-\u001f.:*?"<>|%]/;

function safeSlug(raw: string): string | null {
  const slug = raw.trim();
  if (!slug || slug.length > 120) return null;
  if (slug.includes("..")) return null;
  if (UNSAFE_SLUG.test(slug)) return null;
  return slug;
}

/** slug → 磁盘绝对路径；任何越界或非法标识都返回 null。 */
function wikiFile(rawSlug: string): string | null {
  const slug = safeSlug(rawSlug);
  if (!slug) return null;
  const target = resolve(WIKI_DIR, `${slug}.md`);
  // 解析后必须仍然直接落在 wiki 目录里，杜绝 ../ 绕行。
  if (dirname(target) !== resolve(WIKI_DIR)) return null;
  return target;
}

interface SplitPage {
  meta: Record<string, string>;
  body: string;
}

/** 拆 YAML front-matter（只取首层 key: value）与正文。 */
function splitFrontMatter(text: string): SplitPage {
  const normalized = text.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
  if (!normalized.startsWith("---\n")) return { meta: {}, body: normalized };
  const end = normalized.indexOf("\n---", 3);
  if (end < 0) return { meta: {}, body: normalized };
  const meta: Record<string, string> = {};
  for (const line of normalized.slice(4, end).split("\n")) {
    const at = line.indexOf(":");
    if (at <= 0) continue;
    const key = line.slice(0, at).trim();
    const value = line.slice(at + 1).trim().replace(/^["']|["']$/g, "");
    if (key && value) meta[key] = value;
  }
  const rest = normalized.slice(end + 4);
  return { meta, body: rest.startsWith("\n") ? rest.slice(1) : rest };
}

/** 没有 front-matter 时的兜底：正文首个一级标题。 */
function firstHeading(body: string): string | null {
  const hit = body.match(/^#\s+(.+)$/m);
  return hit ? hit[1].trim() : null;
}

/** 读整个 wiki 目录；目录不存在返回空数组，不抛错。 */
async function readWikiIndex(): Promise<WikiRow[]> {
  let names: string[];
  try {
    names = await readdir(WIKI_DIR);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }

  const rows: WikiRow[] = [];
  for (const name of names) {
    if (!name.toLowerCase().endsWith(".md")) continue;
    const slug = name.slice(0, -3);
    if (!safeSlug(slug)) continue;
    try {
      const text = await readFile(join(WIKI_DIR, name), "utf8");
      const { meta, body } = splitFrontMatter(text);
      rows.push({
        slug,
        title: (meta.title ?? firstHeading(body) ?? slug).trim(),
        source: meta.source ?? null,
        updated: meta.updated ?? null,
        // 正文字数（去空白），与 index.md 的「体量」口径一致。
        chars: body.replace(/\s+/g, "").length,
      });
    } catch (error) {
      // 单篇坏文件不影响整张列表。
      console.warn(`[kb-extra] 读取 wiki 页面失败：${name}`, (error as Error).message);
    }
  }

  rows.sort((a, b) => {
    if (a.updated !== b.updated) {
      if (!a.updated) return 1;
      if (!b.updated) return -1;
      return a.updated < b.updated ? 1 : -1;
    }
    return a.slug < b.slug ? -1 : 1;
  });
  return rows;
}

// ── 切片字段校验 ──────────────────────────────────────

const LIMIT = { title: 200, origin: 200, source: 200, url: 500, content: 20000 } as const;

interface SliceData {
  title?: string;
  origin?: string | null;
  content?: string;
  url?: string | null;
  source?: string;
}

type Checked = { data: SliceData } | { error: [string, string] };

/**
 * 校验并归一化切片字段。
 * mode=create 时 title/source/content 必填；mode=patch 时只校验实际传了的字段。
 */
function validateSlice(body: Record<string, unknown>, mode: "create" | "patch"): Checked {
  const data: SliceData = {};
  const touched = (key: string) => mode === "create" || Object.prototype.hasOwnProperty.call(body, key);

  if (touched("title")) {
    const value = body.title;
    if (typeof value !== "string" || !value.trim()) return { error: ["title", "标题不能为空。"] };
    const title = value.trim();
    if (title.length > LIMIT.title) return { error: ["title", `标题最多 ${LIMIT.title} 个字。`] };
    data.title = title;
  }

  if (touched("source")) {
    const value = body.source;
    if (typeof value !== "string" || !value.trim()) return { error: ["source", "来源不能为空。"] };
    const source = value.trim();
    if (source.length > LIMIT.source) return { error: ["source", `来源最多 ${LIMIT.source} 个字。`] };
    data.source = source;
  }

  if (touched("content")) {
    const value = body.content;
    if (typeof value !== "string" || !value.trim()) return { error: ["content", "正文不能为空。"] };
    if (value.length > LIMIT.content) {
      return { error: ["content", `正文最多 ${LIMIT.content} 个字。`] };
    }
    data.content = value;
  }

  if (touched("origin")) {
    const value = body.origin;
    if (value === null || value === undefined) {
      data.origin = null;
    } else if (typeof value !== "string") {
      return { error: ["origin", "出处必须是文本。"] };
    } else {
      const origin = value.trim();
      if (origin.length > LIMIT.origin) return { error: ["origin", `出处最多 ${LIMIT.origin} 个字。`] };
      data.origin = origin || null;
    }
  }

  if (touched("url")) {
    const value = body.url;
    if (value === null || value === undefined) {
      data.url = null;
    } else if (typeof value !== "string") {
      return { error: ["url", "链接必须是文本。"] };
    } else {
      const url = value.trim();
      if (url.length > LIMIT.url) return { error: ["url", `链接最多 ${LIMIT.url} 个字。`] };
      data.url = url || null;
    }
  }

  return { data };
}

interface SliceRecord {
  id: string;
  title: string;
  origin: string | null;
  content: string;
  url: string | null;
  source: string;
  updatedAt: Date;
}

/** 出参统一把 Date 转成毫秒整数。 */
function sliceView(slice: SliceRecord) {
  return { ...slice, updatedAt: slice.updatedAt.getTime() };
}

// ── 注册 ─────────────────────────────────────────────

export function registerKbExtra(app: any) {
  // ① wiki 页面列表
  app.get("/kb/wiki", async (c: Context) => {
    try {
      return c.json(await readWikiIndex());
    } catch (error) {
      console.error("[kb-extra] 读取 wiki 目录失败:", error);
      return fail(c, 500, "WIKI_READ_FAILED", "读取知识库页面失败，请稍后重试。");
    }
  });

  // ② wiki 页面详情（markdown 原文，已去掉 front-matter）
  app.get("/kb/wiki/:slug", async (c: Context) => {
    const target = wikiFile(c.req.param("slug") ?? "");
    if (!target) return fail(c, 400, "BAD_REQUEST", "页面标识不合法。", "slug");

    let text: string;
    try {
      text = await readFile(target, "utf8");
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        return fail(c, 404, "WIKI_NOT_FOUND", "没有找到这篇知识库页面。", "slug");
      }
      console.error("[kb-extra] 读取 wiki 页面失败:", error);
      return fail(c, 500, "WIKI_READ_FAILED", "读取知识库页面失败，请稍后重试。");
    }

    return c.json({ slug: safeSlug(c.req.param("slug") ?? "") ?? "", markdown: splitFrontMatter(text).body });
  });

  // ③ 新建切片
  app.post("/kb/slices", async (c: Context) => {
    const body = (await c.req.json().catch(() => ({}))) as Record<string, unknown>;
    const checked = validateSlice(body ?? {}, "create");
    if ("error" in checked) return fail(c, 400, "BAD_REQUEST", checked.error[1], checked.error[0]);

    const slice = await prisma.kbSlice.create({
      data: {
        id: nextCuid(),
        title: checked.data.title!,
        content: checked.data.content!,
        source: checked.data.source!,
        origin: checked.data.origin ?? null,
        url: checked.data.url ?? null,
      },
    });
    audit({ actor: actorOf(c), action: "kb.slice.create", target: slice.id, detail: { title: slice.title, source: slice.source } });
    return c.json(sliceView(slice), 201);
  });

  // ④ 局部更新切片
  app.patch("/kb/slices/:id", async (c: Context) => {
    const id = c.req.param("id");
    const body = (await c.req.json().catch(() => ({}))) as Record<string, unknown>;
    const checked = validateSlice(body ?? {}, "patch");
    if ("error" in checked) return fail(c, 400, "BAD_REQUEST", checked.error[1], checked.error[0]);

    const existing = await prisma.kbSlice.findUnique({ where: { id }, select: { id: true } });
    if (!existing) return fail(c, 404, "SLICE_NOT_FOUND", "没有找到这一片资料。", "id");

    const slice = await prisma.kbSlice.update({ where: { id }, data: checked.data });
    audit({ actor: actorOf(c), action: "kb.slice.update", target: id, detail: { fields: Object.keys(checked.data) } });
    return c.json(sliceView(slice));
  });

  // ⑤ 物理删除切片
  app.delete("/kb/slices/:id", async (c: Context) => {
    const id = c.req.param("id");

    const existing = await prisma.kbSlice.findUnique({ where: { id }, select: { id: true, title: true } });
    if (!existing) return fail(c, 404, "SLICE_NOT_FOUND", "没有找到这一片资料。", "id");

    try {
      await prisma.kbSlice.delete({ where: { id } });
    } catch (error) {
      // 并发下被别人抢先删掉：Prisma P2025。
      if ((error as { code?: string }).code === "P2025") {
        return fail(c, 404, "SLICE_NOT_FOUND", "没有找到这一片资料。", "id");
      }
      throw error;
    }

    audit({ actor: actorOf(c), action: "kb.slice.delete", target: id, detail: { title: existing.title } });
    return c.body(null, 204);
  });
}
