// 列表接口的统一参数：分页、排序白名单、逗号多值筛选。
// 排序字段一律走白名单，不在白名单里的 sort 由调用方回 400 BAD_SORT。
import type { Context } from "hono";

export const MAX_PAGE_SIZE = 100;

/** 只认有限数：page=Infinity / 1e309 / abc 一律回落到默认值（Infinity 进 Prisma 会 500） */
function finite(value: string | undefined): number | null {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

export function paging(c: Context) {
  const page = Math.max(1, finite(c.req.query("page")) || 1);
  const pageSize = Math.min(MAX_PAGE_SIZE, Math.max(1, finite(c.req.query("pageSize")) || 20));
  return { page, pageSize, skip: (page - 1) * pageSize, take: pageSize };
}

export interface SortSpec {
  /** null 表示没传 sort，用各接口原来的默认排序 */
  field: string | null;
  order: "asc" | "desc";
}

/** sort=<字段>&order=asc|desc；字段不在白名单 → null（调用方回 BAD_SORT）。没传 order 时按 desc。 */
export function sortSpec(c: Context, allowed: readonly string[]): SortSpec | null {
  const raw = (c.req.query("sort") ?? "").trim();
  if (!raw) return { field: null, order: "desc" };
  if (!allowed.includes(raw)) return null;
  return { field: raw, order: (c.req.query("order") ?? "").trim().toLowerCase() === "asc" ? "asc" : "desc" };
}

/** 把 SortSpec 换成 Prisma orderBy；没传 sort 时用 fallback（保持旧排序）。 */
export function sortToOrderBy(spec: SortSpec, fallback: any): any {
  return spec.field ? { [spec.field]: spec.order } : fallback;
}

/** status=published,draft → ["published","draft"]；空、all 或只有逗号 → null（表示不过滤）。 */
export function multi(query: string | undefined): string[] | null {
  if (!query) return null;
  const parts = query
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  if (parts.length === 0 || parts.includes("all")) return null;
  return [...new Set(parts)];
}

/**
 * 毫秒时间戳参数：不传或非法返回 null（调用方决定要不要报错）。
 * 上界必须夹住：Prisma/SQLite 的 DATETIME 最大到 9999-12-31 23:59:59.999（=253402300799999），
 * 再大就会抛 validation error 变成 500。超出上界按「不设边界」处理。
 */
const MAX_TIMESTAMP_MS = 253402300799999;

export function timeQuery(value: string | undefined): Date | null {
  if (!value || !value.trim()) return null;
  const ms = Number(value);
  if (!Number.isFinite(ms) || ms <= 0 || ms > MAX_TIMESTAMP_MS) return null;
  return new Date(ms);
}
