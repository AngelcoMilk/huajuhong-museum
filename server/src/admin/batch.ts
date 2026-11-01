// 批量上下架：内容（企业也是 Item）与 VR 场景。
// 一次 1–200 条、去重；逐条报告失败（部分失败照样 200）；整批写一条 AuditLog。
import type { Context } from "hono";
import { prisma } from "../db.ts";
import { audit } from "./audit.ts";
import { withConfigLock } from "./config-lock.ts";
import { publishIssues, publishIssueMessage } from "./products.ts";

const MAX_BATCH = 200;

/** action → 目标状态：publish=已发布、unpublish（下架）=草稿、archive=归档 */
const ACTIONS: Record<string, string> = {
  publish: "published",
  unpublish: "draft",
  archive: "archived",
};

function fail(c: Context, status: 400, code: string, message: string, field?: string) {
  return c.json({ error: { code, message, ...(field ? { field } : {}) } }, status);
}

interface BatchInput {
  ids: string[];
  action: string;
  status: string;
}

/** 只认字符串与基本类型的标量：对象/数组/函数一律当空值，避免 String() 抛错变成 500 */
function scalar(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return "";
}

/** 解析并校验批量请求；不合法时返回错误响应 */
function readBatch(c: Context, body: any): BatchInput | Response {
  const action = scalar(body?.action);
  if (!ACTIONS[action]) {
    return fail(c, 400, "BAD_ACTION", "action 只能是 publish / unpublish / archive。", "action");
  }
  const rawIds = Array.isArray(body?.ids) ? body.ids : [];
  const ids = [...new Set(rawIds.map(scalar).filter(Boolean))];
  if (ids.length < 1 || ids.length > MAX_BATCH) {
    return fail(c, 400, "BATCH_TOO_LARGE", `一次只能改 1–${MAX_BATCH} 条。`, "ids");
  }
  return { ids, action, status: ACTIONS[action] };
}

export function registerBatch(app: any) {
  /**
   * 批量改分类：只限史料（history）。其他板块逐条报 INVALID_BOARD，不拖累同批的史料。
   */
  async function setSection(c: Context, body: any): Promise<Response> {
    const rawIds = Array.isArray(body?.ids) ? body.ids : [];
    const ids: string[] = [...new Set<string>(rawIds.map((value: unknown) => scalar(value)).filter(Boolean))];
    if (ids.length < 1 || ids.length > MAX_BATCH) {
      return fail(c, 400, "BATCH_TOO_LARGE", `一次只能改 1–${MAX_BATCH} 条。`, "ids");
    }
    const section = scalar(body?.section);
    if (!section || section.length > 40) {
      return fail(c, 400, "INVALID_SECTION", "分类名要在 1–40 字之间。", "section");
    }

    const existing = await prisma.item.findMany({ where: { id: { in: ids } }, select: { id: true, board: true } });
    const found = new Map(existing.map((row) => [row.id, row.board]));
    const ok: string[] = [];
    const failed: { id: string; code: string; message: string }[] = [];
    for (const id of ids) {
      const board = found.get(id);
      if (!board) {
        failed.push({ id, code: "ITEM_NOT_FOUND", message: "没有找到这条内容。" });
        continue;
      }
      if (board !== "history") {
        failed.push({ id, code: "INVALID_BOARD", message: "只有史料能改分类。" });
        continue;
      }
      ok.push(id);
    }
    if (ok.length > 0) {
      await prisma.item.updateMany({ where: { id: { in: ok } }, data: { section } });
    }
    audit({
      actor: c.get("admin").username,
      action: "item.batch.set-section",
      target: ok.length > 0 ? ok.join(",").slice(0, 500) : "batch",
      detail: { section, ids: ids.length, ok: ok.length, failed: failed.map((row) => row.id) },
    });
    return c.json({ ok, failed });
  }

  // ── 内容批量（园区/展馆/历史/产品/企业/VR 内容条目都是 Item）──
  app.post("/items/batch", async (c) => {
    const raw = await c.req.json().catch(() => null);
    if (scalar((raw as any)?.action) === "set-section") return setSection(c, raw);
    const parsed = readBatch(c, raw);
    if (parsed instanceof Response) return parsed;

    const existing = await prisma.item.findMany({
      where: { id: { in: parsed.ids } },
      select: { id: true, board: true },
    });
    const found = new Map(existing.map((row) => [row.id, row.board]));
    const ok: string[] = [];
    const failed: { id: string; code: string; message: string }[] = parsed.ids
      .filter((id) => !found.has(id))
      .map((id) => ({ id, code: "ITEM_NOT_FOUND", message: "没有找到这条内容。" }));
    // 商品上架走和 /products/:id/publish 同一套校验（同一把锁）；不满足的逐条报告，不拖累其他条目
    await withConfigLock(async () => {
      for (const id of parsed.ids) {
        const board = found.get(id);
        if (!board) continue;
        if (parsed.action === "publish" && board === "product") {
          const issues = await publishIssues(id);
          if (issues.length > 0) {
            failed.push({ id, code: "PRODUCT_NOT_READY", message: publishIssueMessage(issues) });
            continue;
          }
        }
        ok.push(id);
      }

      if (ok.length > 0) {
        await prisma.item.updateMany({ where: { id: { in: ok } }, data: { status: parsed.status } });
      }
    });
    audit({
      actor: c.get("admin").username,
      action: `item.batch.${parsed.action}`,
      target: ok.length > 0 ? ok.join(",").slice(0, 500) : "batch",
      detail: { action: parsed.action, ids: parsed.ids, ok: ok.length, failed: failed.map((row) => row.id) },
    });
    return c.json({ ok, failed });
  });

  // ── VR 场景批量 ─────────────────────────────────────
  app.post("/vr-scenes/batch", async (c) => {
    const parsed = readBatch(c, await c.req.json().catch(() => null));
    if (parsed instanceof Response) return parsed;

    const existing = await prisma.vrScene.findMany({
      where: { id: { in: parsed.ids } },
      select: { id: true, iframe: true },
    });
    const found = new Map(existing.map((row) => [row.id, row.iframe]));
    const ok: string[] = [];
    const failed: { id: string; code: string; message: string }[] = [];
    for (const id of parsed.ids) {
      if (!found.has(id)) {
        failed.push({ id, code: "VR_NOT_FOUND", message: "没有找到这个 VR 场景。" });
        continue;
      }
      // 上架必须有嵌入地址（和单条 PATCH 同一套判定）
      if (parsed.action === "publish" && !found.get(id)) {
        failed.push({ id, code: "IFRAME_REQUIRED", message: "上架的场景要填嵌入地址。" });
        continue;
      }
      ok.push(id);
    }
    if (ok.length > 0) {
      await prisma.vrScene.updateMany({ where: { id: { in: ok } }, data: { status: parsed.status } });
    }
    audit({
      actor: c.get("admin").username,
      action: `vr.batch.${parsed.action}`,
      target: ok.length > 0 ? ok.join(",").slice(0, 500) : "batch",
      detail: { action: parsed.action, ids: parsed.ids, ok: ok.length, failed: failed.map((row) => row.id) },
    });
    return c.json({ ok, failed });
  });
}
