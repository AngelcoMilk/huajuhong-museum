// 商品与库存：后台按「商品」聚合规格、库存、销售与上下架。
// 状态/库存/销售口径集中在这里，列表、详情、统计共用。
// 注意：商品就是 board=product 的 Item，规格在 ProductSku，销售来自 OrderItem；本文件不改 schema。
import type { Context } from "hono";
import { prisma } from "../db.ts";
import { audit } from "./audit.ts";
import { withConfigLock } from "./config-lock.ts";
import { paging, sortSpec } from "./lists.ts";

/** 已付款及之后的状态：售出 / 销售额 / 待发货的统计口径（stats.ts 复用） */
export const PAID_STATUSES = ["paid", "shipped", "completed"];

/** S2：现有六个商品分类（同时写 Item.section 和 ProductProfile.category） */
export const PRODUCT_CATEGORIES = [
  "化橘红干果",
  "化橘红成药",
  "化橘红制剂",
  "化橘红饮品",
  "化橘红食品",
  "化橘红工艺品",
] as const;

export const LOW_STOCK_SETTING_KEY = "shop.lowStockThreshold";
export const DEFAULT_LOW_STOCK_THRESHOLD = 5;
const MAX_LOW_STOCK_THRESHOLD = 9999;

/** 列表/详情计算出的商品状态 */
export const PRODUCT_STATUSES = ["draft", "on_sale", "off", "sold_out"] as const;
type ProductStatus = (typeof PRODUCT_STATUSES)[number];

const PRODUCT_SORTS = ["updatedAt", "title", "totalStock", "soldQty", "pendingShip"] as const;

const MAX_TITLE = 80;
const MAX_SUMMARY = 200;
const MAX_BODY = 20000;
const MAX_SKU_NAME = 40;
const MAX_PRICE_CENTS = 100_000_000;
const MAX_STOCK = 1_000_000;

function fail(c: Context, status: 400 | 404 | 409, code: string, message: string, field?: string) {
  return c.json({ error: { code, message, ...(field ? { field } : {}) } }, status);
}

function failWithDetails(c: Context, code: string, message: string, details: unknown) {
  return c.json({ error: { code, message, details } }, 409);
}

// ── 阈值与状态口径 ─────────────────────────────────────

/** Setting 里的低库存阈值：缺失/非法按默认 5，PUT /settings 会拦住非法值 */
export async function lowStockThreshold(): Promise<number> {
  const row = await prisma.setting.findUnique({ where: { key: LOW_STOCK_SETTING_KEY } });
  const value = row ? Number(row.value) : Number.NaN;
  if (!Number.isInteger(value) || value < 0 || value > MAX_LOW_STOCK_THRESHOLD) return DEFAULT_LOW_STOCK_THRESHOLD;
  return value;
}

export interface SkuLike {
  status: string;
  purchasable: boolean;
  priceCents: number;
  stock: number;
}

/** S2 状态：draft→草稿；archived→下架；published 时按规格算（无 on 规格=下架，可售规格全 0=售罄） */
export function productStatus(itemStatus: string, skus: SkuLike[]): ProductStatus {
  if (itemStatus === "draft") return "draft";
  if (itemStatus === "archived") return "off";
  const on = skus.filter((sku) => sku.status === "on");
  if (on.length === 0) return "off";
  const buyable = on.filter((sku) => sku.purchasable);
  if (buyable.length > 0 && buyable.every((sku) => sku.stock === 0)) return "sold_out";
  return "on_sale";
}

/** draft → 草稿；有已付款及之后订单 → 已有订单；下架且没有订单退回第一步，不算在售；其余 → 在售 */
export function productStage(status: ProductStatus, hasPaidOrders: boolean): "draft" | "has_orders" | "on_sale" {
  if (status === "draft") return "draft";
  if (hasPaidOrders) return "has_orders";
  return status === "off" ? "draft" : "on_sale";
}

export function isLowStock(itemStatus: string, skus: SkuLike[], threshold: number): boolean {
  return itemStatus === "published" && skus.some((sku) => sku.status === "on" && sku.purchasable && sku.stock <= threshold);
}

/** 缩略图：ProductProfile.thumb 优先，否则首张 image 媒体（按 sort），都没有就 null */
export function resolveThumbUrl(
  profile: { thumb?: string | null } | null | undefined,
  media: { kind: string; url: string; sort: number }[],
): string | null {
  const own = String(profile?.thumb ?? "").trim();
  if (own) return own;
  const image = media.filter((one) => one.kind === "image").sort((a, b) => a.sort - b.sort)[0];
  return image?.url ?? null;
}

/** summary 存在 Item.labelJson 的 summary 键里；解析不了就当没有 */
export function labelSummary(labelJson: string | null | undefined): string | null {
  if (!labelJson) return null;
  try {
    const parsed = JSON.parse(labelJson) as unknown;
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      const value = (parsed as Record<string, unknown>).summary;
      if (typeof value === "string") return value;
    }
  } catch {
    // 旧数据可能不是合法 JSON
  }
  return null;
}

/** 写回 labelJson 的 summary 键，其它键原样保留 */
function withLabelSummary(labelJson: string | null | undefined, summary: string): string {
  let base: Record<string, unknown> = {};
  if (labelJson) {
    try {
      const parsed = JSON.parse(labelJson) as unknown;
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) base = { ...(parsed as Record<string, unknown>) };
    } catch {
      base = {};
    }
  }
  base.summary = summary;
  return JSON.stringify(base);
}

// ── 销售聚合 ───────────────────────────────────────────

async function paidTotals(productId: string): Promise<{ soldQty: number; amountCents: number }> {
  const rows = await prisma.orderItem.findMany({
    where: { productId, order: { status: { in: PAID_STATUSES } } },
    select: { qty: true, priceCents: true },
  });
  return {
    soldQty: rows.reduce((sum, row) => sum + row.qty, 0),
    amountCents: rows.reduce((sum, row) => sum + row.priceCents * row.qty, 0),
  };
}

async function pendingShipCount(productId: string): Promise<number> {
  return prisma.order.count({ where: { status: "paid", items: { some: { productId } } } });
}

async function hasPaidOrders(productId: string): Promise<boolean> {
  const count = await prisma.order.count({
    where: { status: { in: PAID_STATUSES }, items: { some: { productId } } },
  });
  return count > 0;
}

// ── 校验 ───────────────────────────────────────────────

interface ProductFields {
  title?: string;
  category?: string;
  summary?: string | null;
  body?: string;
}

type ParseResult = { ok: true; value: ProductFields } | { ok: false; code: string; message: string; field: string };

/** POST / PATCH 共用；partial=true 时只收显式传了的字段 */
export function readProductFields(body: any, partial: boolean): ParseResult {
  const value: ProductFields = {};

  if (!partial || body?.title !== undefined) {
    if (typeof body?.title !== "string") {
      return { ok: false, code: "INVALID_TITLE", message: `商品名称需要 1–${MAX_TITLE} 个字。`, field: "title" };
    }
    const title = body.title.trim();
    if (title.length < 1 || title.length > MAX_TITLE) {
      return { ok: false, code: "INVALID_TITLE", message: `商品名称需要 1–${MAX_TITLE} 个字。`, field: "title" };
    }
    value.title = title;
  }

  if (!partial || body?.category !== undefined) {
    if (typeof body?.category !== "string" || !(PRODUCT_CATEGORIES as readonly string[]).includes(body.category)) {
      return {
        ok: false,
        code: "INVALID_CATEGORY",
        message: `分类只能是：${PRODUCT_CATEGORIES.join("、")}。`,
        field: "category",
      };
    }
    value.category = body.category;
  }

  if (body?.summary !== undefined) {
    if (typeof body.summary !== "string" || body.summary.length > MAX_SUMMARY) {
      return { ok: false, code: "INVALID_FIELD", message: `摘要不能超过 ${MAX_SUMMARY} 字。`, field: "summary" };
    }
    value.summary = body.summary;
  }

  if (body?.body !== undefined) {
    if (typeof body.body !== "string" || body.body.length > MAX_BODY) {
      return { ok: false, code: "INVALID_FIELD", message: `正文不能超过 ${MAX_BODY} 字。`, field: "body" };
    }
    value.body = body.body;
  }

  return { ok: true, value };
}

export interface SkuPatch {
  variantName?: string;
  priceCents?: number;
  stock?: number;
  status?: "on" | "off";
  purchasable?: boolean;
}

type SkuParse = { ok: true; data: SkuPatch } | { ok: false; code: string; message: string; field: string };

/** POST /products/:id/skus 与 PATCH /skus/:id 共用；partial=true 时只收显式传了的字段 */
export function readSkuFields(body: any, partial: boolean): SkuParse {
  const data: SkuPatch = {};

  if (!partial || body?.variantName !== undefined) {
    const name = typeof body?.variantName === "string" ? body.variantName.trim() : "";
    if (name.length < 1 || name.length > MAX_SKU_NAME) {
      return { ok: false, code: "INVALID_NAME", message: `规格名称需要 1–${MAX_SKU_NAME} 个字。`, field: "variantName" };
    }
    data.variantName = name;
  }

  if (!partial || body?.priceCents !== undefined) {
    const price = body?.priceCents;
    if (typeof price !== "number" || !Number.isInteger(price) || price < 1 || price > MAX_PRICE_CENTS) {
      return {
        ok: false,
        code: "INVALID_PRICE",
        message: `价格必须是 1–${MAX_PRICE_CENTS} 的整数（分）。`,
        field: "priceCents",
      };
    }
    data.priceCents = price;
  }

  if (!partial || body?.stock !== undefined) {
    const stock = body?.stock;
    if (typeof stock !== "number" || !Number.isInteger(stock) || stock < 0 || stock > MAX_STOCK) {
      return { ok: false, code: "INVALID_STOCK", message: `库存必须是 0–${MAX_STOCK} 的整数。`, field: "stock" };
    }
    data.stock = stock;
  }

  if (body?.status !== undefined) {
    if (body.status !== "on" && body.status !== "off") {
      return { ok: false, code: "INVALID_STATUS", message: "规格状态只能是 on 或 off。", field: "status" };
    }
    data.status = body.status;
  } else if (!partial) {
    data.status = "on";
  }

  if (body?.purchasable !== undefined) {
    if (typeof body.purchasable !== "boolean") {
      return { ok: false, code: "INVALID_FIELD", message: "是否可购买必须是布尔值。", field: "purchasable" };
    }
    data.purchasable = body.purchasable;
  } else if (!partial) {
    data.purchasable = true;
  }

  return { ok: true, data };
}

// ── 上架校验 ───────────────────────────────────────────

export interface PublishIssue {
  field: "cover" | "sku";
  message: string;
}

/** S3：有封面图，且至少一个已上架、价格大于 0 的规格 */
export async function publishIssues(itemId: string): Promise<PublishIssue[]> {
  const item = await prisma.item.findUnique({
    where: { id: itemId },
    include: { product: true, media: { orderBy: { sort: "asc" } } },
  });
  if (!item) return [];
  const skus = await prisma.productSku.findMany({ where: { itemId }, select: { status: true, priceCents: true } });
  const issues: PublishIssue[] = [];
  if (!resolveThumbUrl(item.product, item.media)) issues.push({ field: "cover", message: "缺封面图" });
  if (!skus.some((sku) => sku.status === "on" && sku.priceCents > 0)) {
    issues.push({ field: "sku", message: "至少要有一个已上架、价格大于 0 的规格" });
  }
  return issues;
}

export function publishIssueMessage(issues: PublishIssue[]): string {
  return `还不能上架：${issues.map((one) => one.message).join("；")}`;
}

/** 待办里的「低库存商品」数量（口径与列表 lowStock 一致） */
export async function countLowStockProducts(): Promise<number> {
  const threshold = await lowStockThreshold();
  const items = await prisma.item.findMany({ where: { board: "product", status: "published" }, select: { id: true } });
  if (items.length === 0) return 0;
  const skus = await prisma.productSku.findMany({
    where: { itemId: { in: items.map((one) => one.id) } },
    select: { itemId: true, status: true, purchasable: true, stock: true, priceCents: true },
  });
  const byItem = new Map<string, SkuLike[]>();
  for (const sku of skus) {
    const list = byItem.get(sku.itemId) ?? [];
    list.push(sku);
    byItem.set(sku.itemId, list);
  }
  return items.filter((item) => isLowStock("published", byItem.get(item.id) ?? [], threshold)).length;
}

// ── 读模型 ─────────────────────────────────────────────

function categoryOf(item: any): string {
  return String(item.product?.category ?? item.section ?? "").trim();
}

async function productExists(id: string) {
  const item = await prisma.item.findUnique({
    where: { id },
    include: { product: true, media: { orderBy: { sort: "asc" } } },
  });
  if (!item || item.board !== "product") return null;
  return item;
}

async function buildDetail(item: any) {
  const skus = await prisma.productSku.findMany({ where: { itemId: item.id }, orderBy: { sort: "asc" } });
  const threshold = await lowStockThreshold();
  const totals = await paidTotals(item.id);
  const pendingShip = await pendingShipCount(item.id);
  const paid = await hasPaidOrders(item.id);
  return {
    id: item.id,
    title: item.title,
    category: categoryOf(item),
    summary: labelSummary(item.labelJson) ?? "",
    body: item.body ?? "",
    status: productStatus(item.status, skus),
    stage: productStage(productStatus(item.status, skus), paid),
    itemStatus: item.status,
    thumbUrl: resolveThumbUrl(item.product, item.media),
    soldQty: totals.soldQty,
    pendingShip,
    totalStock: skus.reduce((sum, sku) => sum + sku.stock, 0),
    lowStock: isLowStock(item.status, skus, threshold),
    lowStockThreshold: threshold,
    media: item.media.map((media: any) => ({
      id: media.id,
      url: media.url,
      kind: media.kind,
      alt: media.alt,
      usage: media.usage,
      sort: media.sort,
    })),
    updatedAt: item.updatedAt.getTime(),
  };
}

// ── 路由 ───────────────────────────────────────────────

/** 商品编号 CP-001 递增；并发创建撞 P2002 时重算重试 */
async function nextProductId(): Promise<string> {
  const rows = await prisma.item.findMany({ where: { board: "product" }, select: { id: true } });
  let max = 0;
  for (const row of rows) {
    const num = Number(String(row.id).replace(/^[A-Z]+-/, ""));
    if (Number.isFinite(num) && num > max) max = num;
  }
  return `CP-${String(max + 1).padStart(3, "0")}`;
}

function isUniqueViolation(error: unknown): boolean {
  return (error as { code?: string }).code === "P2002";
}

const MAX_ID_ATTEMPTS = 10;

export function registerProducts(app: any) {
  // ── 商品列表 ────────────────────────────────────────
  app.get("/products", async (c: Context) => {
    const { page, pageSize, skip, take } = paging(c);
    const q = (c.req.query("q") ?? "").trim().toLowerCase();
    const status = (c.req.query("status") ?? "").trim();
    const stock = (c.req.query("stock") ?? "").trim();
    const category = (c.req.query("category") ?? "").trim();
    const sort = sortSpec(c, PRODUCT_SORTS);
    if (!sort) return fail(c, 400, "BAD_SORT", "排序字段不支持。", "sort");
    if (status && !(PRODUCT_STATUSES as readonly string[]).includes(status)) {
      return fail(c, 400, "BAD_REQUEST", "status 只能是 draft / on_sale / off / sold_out。", "status");
    }
    if (stock && stock !== "low" && stock !== "out") {
      return fail(c, 400, "BAD_REQUEST", "stock 只能是 low 或 out。", "stock");
    }
    if (category && !(PRODUCT_CATEGORIES as readonly string[]).includes(category)) {
      return fail(c, 400, "BAD_REQUEST", "category 不在现有六个分类里。", "category");
    }

    const threshold = await lowStockThreshold();
    const items = await prisma.item.findMany({
      where: { board: "product" },
      include: { product: true, media: { orderBy: { sort: "asc" } } },
      orderBy: { sort: "asc" },
    });
    const ids = items.map((item) => item.id);
    const skus = ids.length
      ? await prisma.productSku.findMany({ where: { itemId: { in: ids } }, orderBy: { sort: "asc" } })
      : [];
    const paidLines = ids.length
      ? await prisma.orderItem.findMany({
          where: { productId: { in: ids }, order: { status: { in: PAID_STATUSES } } },
          select: { productId: true, qty: true, priceCents: true },
        })
      : [];
    const paidOrders = ids.length
      ? await prisma.order.findMany({
          where: { status: { in: PAID_STATUSES }, items: { some: { productId: { in: ids } } } },
          select: { items: { select: { productId: true } } },
        })
      : [];
    const shipOrders = ids.length
      ? await prisma.order.findMany({
          where: { status: "paid", items: { some: { productId: { in: ids } } } },
          select: { items: { select: { productId: true } } },
        })
      : [];

    const skusByItem = new Map<string, any[]>();
    for (const sku of skus) {
      const list = skusByItem.get(sku.itemId) ?? [];
      list.push(sku);
      skusByItem.set(sku.itemId, list);
    }
    const soldByItem = new Map<string, { soldQty: number; amountCents: number }>();
    for (const line of paidLines) {
      const prev = soldByItem.get(line.productId) ?? { soldQty: 0, amountCents: 0 };
      prev.soldQty += line.qty;
      prev.amountCents += line.priceCents * line.qty;
      soldByItem.set(line.productId, prev);
    }
    const hasPaidByItem = new Set<string>();
    for (const order of paidOrders) for (const line of order.items) hasPaidByItem.add(line.productId);
    const shipByItem = new Map<string, number>();
    for (const order of shipOrders) {
      for (const productId of new Set(order.items.map((line: any) => line.productId))) {
        shipByItem.set(productId, (shipByItem.get(productId) ?? 0) + 1);
      }
    }

    let rows = items.map((item) => {
      const itemSkus = (skusByItem.get(item.id) ?? []) as any[];
      const onPrices = itemSkus.filter((sku) => sku.status === "on").map((sku) => sku.priceCents);
      const totals = soldByItem.get(item.id) ?? { soldQty: 0, amountCents: 0 };
      return {
        id: item.id,
        title: item.title,
        category: categoryOf(item),
        status: productStatus(item.status, itemSkus),
        thumbUrl: resolveThumbUrl(item.product, item.media),
        skuCount: itemSkus.length,
        priceMinCents: onPrices.length ? Math.min(...onPrices) : null,
        priceMaxCents: onPrices.length ? Math.max(...onPrices) : null,
        totalStock: itemSkus.reduce((sum, sku) => sum + sku.stock, 0),
        soldQty: totals.soldQty,
        pendingShip: shipByItem.get(item.id) ?? 0,
        stage: productStage(productStatus(item.status, itemSkus), hasPaidByItem.has(item.id)),
        lowStock: isLowStock(item.status, itemSkus, threshold),
        purchasable: itemSkus.some((sku) => sku.purchasable === true),
        updatedAt: item.updatedAt.getTime(),
      };
    });

    if (q) rows = rows.filter((row) => row.title.toLowerCase().includes(q) || row.id.toLowerCase().includes(q));
    if (status) rows = rows.filter((row) => row.status === status);
    if (category) rows = rows.filter((row) => row.category === category);
    if (stock === "low") rows = rows.filter((row) => row.lowStock);
    if (stock === "out") rows = rows.filter((row) => row.status === "sold_out");

    const field = sort.field;
    if (field) {
      const direction = sort.order === "asc" ? 1 : -1;
      rows.sort((a: any, b: any) => {
        const left = a[field];
        const right = b[field];
        let result: number;
        if (typeof left === "string" || typeof right === "string") {
          result = String(left).localeCompare(String(right), "zh-Hans-CN");
        } else {
          result = Number(left) - Number(right);
        }
        return result !== 0 ? result * direction : a.id.localeCompare(b.id);
      });
    } else {
      rows.sort((a, b) => b.updatedAt - a.updatedAt || a.id.localeCompare(b.id));
    }

    const total = rows.length;
    return c.json({
      items: rows.slice(skip, skip + take),
      total,
      page,
      pageSize,
      lowStockThreshold: threshold,
    });
  });

  // ── 新建商品 ────────────────────────────────────────
  app.post("/products", async (c: Context) => {
    const body = (await c.req.json().catch(() => ({}))) as any;
    const parsed = readProductFields(body, false);
    if (!parsed.ok) return fail(c, 400, parsed.code, parsed.message, parsed.field);
    const fields = parsed.value;

    const maxSort = await prisma.item.aggregate({ where: { board: "product" }, _max: { sort: true } });
    for (let attempt = 0; attempt < MAX_ID_ATTEMPTS; attempt += 1) {
      const id = await nextProductId();
      try {
        await prisma.item.create({
          data: {
            id,
            board: "product",
            section: fields.category!,
            type: "产品",
            title: fields.title!,
            body: fields.body ?? "",
            status: "draft",
            sort: (maxSort._max.sort ?? 0) + 1,
            labelJson: fields.summary !== undefined ? withLabelSummary(null, fields.summary ?? "") : null,
            product: { create: { category: fields.category! } },
          },
        });
        audit({
          actor: c.get("admin").username,
          action: "product.create",
          target: id,
          detail: { title: fields.title, category: fields.category },
        });
        const created = await productExists(id);
        return c.json(await buildDetail(created), 201);
      } catch (error) {
        if (isUniqueViolation(error)) continue;
        throw error;
      }
    }
    return c.json({ error: { code: "ID_CONFLICT", message: "商品编号生成冲突，请重试。" } }, 409);
  });

  // ── 商品详情 ────────────────────────────────────────
  app.get("/products/:id", async (c: Context) => {
    const item = await productExists((c.req.param("id") ?? ""));
    if (!item) return fail(c, 404, "PRODUCT_NOT_FOUND", "没有找到这件商品。");
    return c.json(await buildDetail(item));
  });

  // ── 基本信息 ────────────────────────────────────────
  app.patch("/products/:id", async (c: Context) => {
    const id = (c.req.param("id") ?? "");
    const item = await productExists(id);
    if (!item) return fail(c, 404, "PRODUCT_NOT_FOUND", "没有找到这件商品。");
    const body = (await c.req.json().catch(() => ({}))) as any;
    const parsed = readProductFields(body, true);
    if (!parsed.ok) return fail(c, 400, parsed.code, parsed.message, parsed.field);
    const fields = parsed.value;
    if (Object.keys(fields).length === 0) return fail(c, 400, "NO_CHANGES", "没有可更新的字段。");

    const data: any = {};
    if (fields.title !== undefined) data.title = fields.title;
    if (fields.body !== undefined) data.body = fields.body;
    if (fields.category !== undefined) data.section = fields.category;
    if (fields.summary !== undefined) data.labelJson = withLabelSummary(item.labelJson, fields.summary ?? "");

    await prisma.$transaction(async (tx) => {
      await tx.item.update({ where: { id }, data });
      if (fields.category !== undefined) {
        await tx.productProfile.upsert({
          where: { itemId: id },
          create: { itemId: id, category: fields.category },
          update: { category: fields.category },
        });
      }
    });
    audit({
      actor: c.get("admin").username,
      action: "product.update",
      target: id,
      detail: { fields: Object.keys(fields) },
    });
    return c.json(await buildDetail((await productExists(id))!));
  });

  // ── 上架 / 下架 ─────────────────────────────────────
  app.post("/products/:id/publish", async (c: Context) => {
    const id = (c.req.param("id") ?? "");
    const item = await productExists(id);
    if (!item) return fail(c, 404, "PRODUCT_NOT_FOUND", "没有找到这件商品。");
    // 校验和上架在同一把锁里：规格和图片的改动都排这把锁，不能在校验之后把商品改到不满足
    return withConfigLock(async () => {
      const issues = await publishIssues(id);
      if (issues.length > 0) return failWithDetails(c, "PRODUCT_NOT_READY", publishIssueMessage(issues), issues);
      await prisma.item.update({ where: { id }, data: { status: "published" } });
      audit({ actor: c.get("admin").username, action: "product.publish", target: id, detail: { title: item.title } });
      return c.json(await buildDetail((await productExists(id))!));
    });
  });

  // 换封面：写 ProductProfile.thumb，这张图排到第一。老封面不在媒体里时补进去，免得换完回不去
  app.post("/products/:id/cover", async (c: Context) => {
    const id = (c.req.param("id") ?? "");
    const body = (await c.req.json().catch(() => ({}))) as any;
    const mediaId = String(body?.mediaId ?? "");
    return withConfigLock(async () => {
      const item = await productExists(id);
      if (!item) return fail(c, 404, "PRODUCT_NOT_FOUND", "没有找到这件商品。");
      const target = item.media.find((one: any) => one.id === mediaId);
      if (!target || target.kind !== "image") return fail(c, 404, "MEDIA_NOT_FOUND", "没有找到这张图片。", "mediaId");
      const previous = String(item.product?.thumb ?? "").trim();
      const others = item.media.filter((one: any) => one.id !== target.id);
      await prisma.$transaction(async (tx) => {
        await tx.itemMedia.update({ where: { id: target.id }, data: { sort: 0 } });
        for (const [index, one] of others.entries()) {
          await tx.itemMedia.update({ where: { id: one.id }, data: { sort: index + 1 } });
        }
        if (previous && !item.media.some((one: any) => one.url === previous)) {
          await tx.itemMedia.create({ data: { itemId: id, kind: "image", url: previous, sort: others.length + 1 } });
        }
        await tx.productProfile.upsert({
          where: { itemId: id },
          create: { itemId: id, category: categoryOf(item), thumb: target.url },
          update: { thumb: target.url },
        });
      });
      audit({ actor: c.get("admin").username, action: "product.cover", target: id, detail: { url: target.url, previous: previous || null } });
      return c.json(await buildDetail((await productExists(id))!));
    });
  });

  app.post("/products/:id/unpublish", async (c: Context) => {
    const id = (c.req.param("id") ?? "");
    const item = await productExists(id);
    if (!item) return fail(c, 404, "PRODUCT_NOT_FOUND", "没有找到这件商品。");
    await prisma.item.update({ where: { id }, data: { status: "archived" } });
    audit({ actor: c.get("admin").username, action: "product.unpublish", target: id, detail: { title: item.title } });
    return c.json(await buildDetail((await productExists(id))!));
  });

  // ── 规格与库存 ──────────────────────────────────────
  app.get("/products/:id/skus", async (c: Context) => {
    const id = (c.req.param("id") ?? "");
    const item = await productExists(id);
    if (!item) return fail(c, 404, "PRODUCT_NOT_FOUND", "没有找到这件商品。");
    const skus = await prisma.productSku.findMany({ where: { itemId: id }, orderBy: { sort: "asc" } });
    const lines = skus.length
      ? await prisma.orderItem.findMany({ where: { skuId: { in: skus.map((sku) => sku.id) } }, select: { skuId: true } })
      : [];
    const counts = new Map<string, number>();
    for (const line of lines) counts.set(line.skuId, (counts.get(line.skuId) ?? 0) + 1);
    return c.json(
      skus.map((sku) => ({
        id: sku.id,
        itemId: sku.itemId,
        variantName: sku.variantName,
        priceCents: sku.priceCents,
        stock: sku.stock,
        purchasable: sku.purchasable,
        status: sku.status,
        sort: sku.sort,
        orderCount: counts.get(sku.id) ?? 0,
      })),
    );
  });

  app.post("/products/:id/skus", async (c: Context) => {
    const id = (c.req.param("id") ?? "");
    const item = await productExists(id);
    if (!item) return fail(c, 404, "PRODUCT_NOT_FOUND", "没有找到这件商品。");
    const body = (await c.req.json().catch(() => ({}))) as any;
    const parsed = readSkuFields(body, false);
    if (!parsed.ok) return fail(c, 400, parsed.code, parsed.message, parsed.field);
    const fields = parsed.data;

    // 查同名 + 写库要在同一把锁里：schema 没有 (itemId, variantName) 唯一约束，并发下会写出同名规格
    return withConfigLock(async () => {
      const conflict = await prisma.productSku.findFirst({
        where: { itemId: id, variantName: fields.variantName! },
        select: { id: true },
      });
      if (conflict) return fail(c, 409, "SKU_EXISTS", "同一商品下已有同名规格。", "variantName");

      const maxSort = await prisma.productSku.aggregate({ where: { itemId: id }, _max: { sort: true } });
      const sku = await prisma.productSku.create({
        data: {
          itemId: id,
          variantName: fields.variantName!,
          priceCents: fields.priceCents!,
          stock: fields.stock!,
          purchasable: fields.purchasable!,
          status: fields.status!,
          sort: (maxSort._max.sort ?? 0) + 1,
        },
      });
      audit({
        actor: c.get("admin").username,
        action: "sku.create",
        target: sku.id,
        detail: {
          itemId: id,
          variantName: sku.variantName,
          priceCents: sku.priceCents,
          stock: sku.stock,
          status: sku.status,
          purchasable: sku.purchasable,
        },
      });
      return c.json(
        {
          id: sku.id,
          itemId: sku.itemId,
          variantName: sku.variantName,
          priceCents: sku.priceCents,
          stock: sku.stock,
          purchasable: sku.purchasable,
          status: sku.status,
          sort: sku.sort,
          orderCount: 0,
        },
        201,
      );
    });
  });

  // DELETE /skus/:id 与 PATCH /skus/:id（routes.ts）同属规格管理
  app.delete("/skus/:id", async (c: Context) => {
    const id = (c.req.param("id") ?? "");
    const sku = await prisma.productSku.findUnique({ where: { id } });
    if (!sku) return fail(c, 404, "SKU_NOT_FOUND", "没有找到这个规格。");
    const orderCount = await prisma.orderItem.count({ where: { skuId: id } });
    if (orderCount > 0) {
      return fail(c, 409, "SKU_HAS_ORDERS", "这个规格有订单记录，不能删除，只能下架。");
    }
    return withConfigLock(async () => {
      await prisma.$transaction([
        prisma.cartItem.deleteMany({ where: { skuId: id } }),
        prisma.productSku.deleteMany({ where: { id } }),
      ]);
      audit({
        actor: c.get("admin").username,
        action: "sku.delete",
        target: id,
        detail: { itemId: sku.itemId, variantName: sku.variantName },
      });
      return c.body(null, 204);
    });
  });

  // ── 销售 ───────────────────────────────────────────
  app.get("/products/:id/sales", async (c: Context) => {
    const id = (c.req.param("id") ?? "");
    const item = await productExists(id);
    if (!item) return fail(c, 404, "PRODUCT_NOT_FOUND", "没有找到这件商品。");
    const totals = await paidTotals(id);
    const pendingShip = await pendingShipCount(id);
    const orders = await prisma.order.findMany({
      where: { items: { some: { productId: id } } },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { items: { where: { productId: id } } },
    });
    return c.json({
      soldQty: totals.soldQty,
      amountCents: totals.amountCents,
      pendingShip,
      recentOrders: orders.map((order) => ({
        orderNo: order.orderNo,
        status: order.status,
        qty: order.items.reduce((sum, line) => sum + line.qty, 0),
        amountCents: order.items.reduce((sum, line) => sum + line.priceCents * line.qty, 0),
        createdAt: order.createdAt.getTime(),
      })),
    });
  });
}
