// 购物接口：账号 / 购物车 / 地址簿 / 订单 / 模拟付款。
// 路径、字段、错误码与前端约定逐字对齐。
import { Hono } from "hono";
import type { Context } from "hono";
import { getCookie, setCookie, deleteCookie } from "hono/cookie";
import { randomUUID } from "node:crypto";
import { sign, verify } from "hono/jwt";
import QRCode from "qrcode";
import { prisma } from "../db.ts";
import { ScryptBusyError, hashPassword, needsUpgrade, verifyDummy, verifyPassword } from "../lib/password.ts";
import { clientIp } from "../lib/clientIp.ts";
import { withKeyLock } from "../lib/keyLock.ts";
import { createLimiter } from "../lib/rateLimit.ts";
import { audit } from "../admin/audit.ts";

const CART_COOKIE = "hjh_cart";
const TOKEN_DAYS = 7;
const PAYMENT_METHODS = ["wechat", "alipay", "unionpay"];
const PAYMENT_METHOD_LABEL: Record<string, string> = {
  wechat: "微信支付（模拟）",
  alipay: "支付宝（模拟）",
  unionpay: "云闪付（模拟）",
};
const SHIPPING: Record<string, { key: string; name: string; desc: string; feeCents: number }> = {
  standard: { key: "standard", name: "普通快递", desc: "包邮", feeCents: 0 },
  express: { key: "express", name: "顺丰速运", desc: "¥12.00", feeCents: 1200 },
};

const CAT_KEY: Array<[RegExp, string, string]> = [
  [/干果/, "dried", "干果"],
  [/成药/, "patent", "成药"],
  [/制剂/, "preparation", "制剂"],
  [/饮品/, "drink", "饮品"],
  [/食品/, "food", "食品"],
  [/工艺品/, "craft", "工艺品"],
];

function secret(): string {
  const raw = process.env.SHOP_JWT_SECRET ?? process.env.ADMIN_JWT_SECRET;
  if (!raw || raw.length < 16) throw new Error("SHOP_JWT_SECRET / ADMIN_JWT_SECRET 未配置");
  return `shop:${raw}`;
}

type Env = { Variables: { user: { id: string; name: string; phone: string } | null } };

/* ── 购物端登录/注册限流（与后台同一套规则，独立实例） ── */
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const pairLimiter = createLimiter({ windowMs: LOGIN_WINDOW_MS, max: 5 });
const ipLimiter = createLimiter({ windowMs: LOGIN_WINDOW_MS, max: 10 });
const phoneLimiter = createLimiter({ windowMs: LOGIN_WINDOW_MS, max: 20 });
/** 注册：同一 IP 每小时 10 次 */
const registerLimiter = createLimiter({ windowMs: 60 * 60 * 1000, max: 10 });
/** 登录/注册请求体上限 8KB */
const AUTH_BODY_LIMIT = 8 * 1024;

function declaredTooLarge(c: Context, limit: number): boolean {
  const raw = c.req.header("content-length");
  if (!raw) return false;
  const size = Number(raw);
  return Number.isFinite(size) && size > limit;
}

/** 读一次 body 并按实际字节数判上限；超限返回 null（chunked 请求没有 content-length，只能读了再判） */
async function readBodyWithin(c: Context, limit: number): Promise<string | null> {
  if (declaredTooLarge(c, limit)) return null;
  const raw = await c.req.text().catch(() => "");
  if (Buffer.byteLength(raw, "utf8") > limit) return null;
  return raw;
}

function tooMany(retryAfterSec: number) {
  return {
    status: 429,
    code: "RATE_LIMITED",
    message: `尝试次数过多，请 ${Math.ceil(Math.max(retryAfterSec, 1) / 60)} 分钟后再试。`,
    retryAfterSec,
  };
}

function blockedFor(pairKey: string, ipKey: string, phoneKey: string): number | null {
  let worst = 0;
  for (const [limiter, key] of [
    [pairLimiter, pairKey],
    [ipLimiter, ipKey],
    [phoneLimiter, phoneKey],
  ] as const) {
    const state = limiter.check(key);
    if (!state.ok) worst = Math.max(worst, state.retryAfterSec);
  }
  return worst > 0 ? worst : null;
}

const SHOP_AUDIENCE = "shop";

function fail(c: Context, status: number, code: string, message: string, field?: string) {
  return c.json({ error: { code, message, ...(field ? { field } : {}) } }, status as any);
}

const PHONE_RE = /^1[3-9]\d{9}$/;

function pickBody(raw: any) {
  return raw && typeof raw === "object" ? raw : {};
}

/* ── 序列化（毫秒整数、分） ─────────────────────────── */
const userView = (u: { id: string; name: string; phone: string; createdAt: Date }) => ({
  id: u.id,
  name: u.name,
  phone: u.phone,
  createdAt: u.createdAt.getTime(),
});

const addressView = (a: any) => ({
  id: a.id,
  name: a.name,
  phone: a.phone,
  province: a.province,
  city: a.city,
  district: a.district,
  detail: a.detail,
  postcode: a.postcode,
  tag: a.tag,
  isDefault: a.isDefault,
});

const skuView = (s: any) => ({ sku: s.id, name: s.variantName, priceCents: s.priceCents, stock: s.stock });

function productView(item: any, profile: any, skus: any[], media: any[] = []) {
  const cat = (profile?.category ?? item.section ?? "") as string;
  const match = CAT_KEY.find(([re]) => re.test(cat)) ?? [/,/, "dried", "干果"];
  const blocks = String(item.body ?? "")
    .split(/\n{2,}/)
    .map((t: string) => t.trim())
    .filter(Boolean)
    .map((text: string) => ({ type: "p", text }));
  // 后台可在 labelJson.summary 里单独填摘要；没有时维持原来的正文首段口径
  let storedSummary: string | null = null;
  if (item.labelJson) {
    try {
      const parsed = JSON.parse(item.labelJson);
      if (parsed && typeof parsed === "object" && typeof parsed.summary === "string") storedSummary = parsed.summary;
    } catch {
      /* 旧数据可能不是合法 JSON */
    }
  }
  const summary = storedSummary && storedSummary.trim() ? storedSummary : blocks[0]?.text?.slice(0, 80) ?? "";
  const cover = media.find((one) => one.kind === "image") ?? media[0];
  // 前台只列能选的规格：下架的不列；同一商品有可下单的规格时，不可下单的也不列
  const onShelf = skus.filter((s) => s.status === "on");
  const selling = onShelf.filter((s) => s.purchasable);
  const purchasable = selling.length > 0;
  return {
    id: item.id,
    title: item.title,
    cat,
    catKey: match[1],
    catShort: match[2],
    summary,
    purchasable,
    blockReason: purchasable ? null : "药品类商品仅作展陈，不参与演示下单。",
    date: item.date,
    sourceUrl: item.sourceUrl ?? "",
    sourceLabel: "官网原文",
    blocks,
    images: [],
    imageSources: [],
    thumb: String(profile?.thumb ?? "").trim() || cover?.url || "",
    skus: (purchasable ? selling : onShelf).map(skuView),
    facts: [],
    tags: [],
    usage: "",
    storage: "",
    caution: "",
    editorNote: null,
    shopCandidates: profile?.shopCandidatesJson ? JSON.parse(profile.shopCandidatesJson) : [],
    demo: true,
  };
}
/** 封面口径同 productView：profile.thumb 优先，否则第一张图片；一次批量取 */
async function thumbsByProduct(itemIds: string[]) {
  const ids = [...new Set(itemIds.filter(Boolean))];
  if (ids.length === 0) return new Map<string, string>();
  const [profiles, images] = await Promise.all([
    prisma.productProfile.findMany({ where: { itemId: { in: ids } } }),
    prisma.itemMedia.findMany({ where: { itemId: { in: ids }, kind: "image" }, orderBy: { sort: "asc" } }),
  ]);
  const profileById = new Map(profiles.map((p) => [p.itemId, p]));
  const coverById = new Map<string, string>();
  for (const image of images) if (!coverById.has(image.itemId)) coverById.set(image.itemId, image.url);
  const thumbs = new Map<string, string>();
  for (const id of ids) {
    const thumb = String(profileById.get(id)?.thumb ?? "").trim() || coverById.get(id) || "";
    if (thumb) thumbs.set(id, thumb);
  }
  return thumbs;
}

function cartView(cart: any, lines: any[]) {
  return {
    lines: lines.map((line) => ({
      skuId: line.skuId,
      productId: line.sku.itemId,
      title: line.sku.titleCache ?? line.sku.itemId,
      variant: line.sku.variantName,
      thumb: line.sku.thumbCache ?? "",
      priceCents: line.sku.priceCents,
      qty: line.qty,
      stock: line.sku.stock,
      purchasable: line.sku.purchasable && line.sku.status === "on" && line.sku.itemPublished,
    })),
    updatedAt: cart ? cart.updatedAt.getTime() : 0,
  };
}

/* ── 会话 token ─────────────────────────────────────── */
async function issueUserToken(userId: string): Promise<string> {
  const token = randomUUID().replace(/-/g, "") + randomUUID().replace(/-/g, "");
  await prisma.shopSession.create({
    data: {
      token,
      userId,
      expiresAt: new Date(Date.now() + TOKEN_DAYS * 864e5),
    },
  });
  // 同时签一个 JWT 便于无状态校验的备用路径（前端只认 token 字段）
  const now = Math.floor(Date.now() / 1000);
  // 带 aud="shop" 与 iat；后台 token（aud=admin）在这里一律不认
  return sign({ sub: userId, sid: token, aud: SHOP_AUDIENCE, iat: now, exp: now + TOKEN_DAYS * 86400 }, secret());
}

async function resolveUser(c: Context) {
  const header = c.req.header("authorization");
  const match = header ? /^Bearer\s+(.+)$/i.exec(header.trim()) : null;
  if (!match) return null;
  let payload: any;
  try {
    payload = await verify(match[1], secret(), "HS256");
  } catch {
    return null;
  }
  if (payload?.aud !== SHOP_AUDIENCE) return null;
  const session = await prisma.shopSession.findUnique({ where: { token: payload.sid }, include: { user: true } });
  if (!session || session.revokedAt || session.expiresAt.getTime() < Date.now()) return null;
  return session.user;
}

/* ── 购物车取用 ─────────────────────────────────────── */
async function getOrCreateCart(c: Context, userId: string | null) {
  if (userId) {
    const existing = await prisma.cart.findFirst({ where: { userId }, orderBy: { updatedAt: "desc" } });
    if (existing) return { cart: existing, created: false };
    return { cart: await prisma.cart.create({ data: { userId } }), created: true };
  }
  const anonKey = getCookie(c, CART_COOKIE);
  if (anonKey) {
    const existing = await prisma.cart.findUnique({ where: { anonKey } });
    if (existing) return { cart: existing, created: false };
  }
  const key = randomUUID();
  const cart = await prisma.cart.create({ data: { anonKey: key } });
  setCookie(c, CART_COOKIE, key, { httpOnly: true, sameSite: "Lax", path: "/", maxAge: 365 * 86400 });
  return { cart, created: true };
}

async function cartPayload(cartId: string) {
  const cart = await prisma.cart.findUnique({ where: { id: cartId } });
  const lines = await prisma.cartItem.findMany({ where: { cartId } });
  const skuIds = lines.map((l) => l.skuId);
  const skus = await prisma.productSku.findMany({ where: { id: { in: skuIds } } });
  const items = await prisma.item.findMany({ where: { id: { in: skus.map((s) => s.itemId) } } });
  const bySku = new Map(skus.map((s) => [s.id, s]));
  const itemById = new Map(items.map((i) => [i.id, i]));
  const thumbById = await thumbsByProduct(skus.map((s) => s.itemId));
  const enriched = lines.map((l) => {
    const sku = bySku.get(l.skuId)!;
    const item = itemById.get(sku.itemId);
    return {
      ...l,
      sku: { ...sku, titleCache: item?.title ?? sku.itemId, thumbCache: thumbById.get(sku.itemId) ?? "", itemPublished: item?.status === "published" },
    };
  });
  return { cart, view: cartView(cart, enriched) };
}

/** 登录后把匿名车并进账号车：同 SKU 数量相加并按库存截断 */
async function mergeAnonCart(c: Context, userId: string) {
  const anonKey = getCookie(c, CART_COOKIE);
  if (!anonKey) return;
  const anon = await prisma.cart.findUnique({ where: { anonKey }, include: { items: true } });
  deleteCookie(c, CART_COOKIE, { path: "/" });
  if (!anon) return;
  const target =
    (await prisma.cart.findFirst({ where: { userId } })) ?? (await prisma.cart.create({ data: { userId } }));
  for (const item of anon.items) {
    const sku = await prisma.productSku.findUnique({ where: { id: item.skuId } });
    if (!sku) continue;
    // 已下架/草稿商品不随登录合并进账号车（不阻塞登录，静默丢掉这一行）
    const owner = await prisma.item.findUnique({ where: { id: sku.itemId }, select: { status: true } });
    if (!owner || owner.status !== "published") continue;
    const existing = await prisma.cartItem.findUnique({ where: { cartId_skuId: { cartId: target.id, skuId: item.skuId } } });
    const cap = Math.max(0, Math.min(sku.stock, 99));
    const qty = Math.min(cap, (existing?.qty ?? 0) + item.qty);
    if (qty <= 0) continue;
    if (existing) await prisma.cartItem.update({ where: { id: existing.id }, data: { qty } });
    else await prisma.cartItem.create({ data: { cartId: target.id, skuId: item.skuId, qty } });
  }
  await prisma.cart.delete({ where: { id: anon.id } }).catch(() => {});
}

function orderView(order: any, thumbs?: Map<string, string>) {
  // 对访客只暴露"付没付"；发货/完成属于后台履约状态，放在 fulfillment 里单独给
  const consumerStatus = ["shipped", "completed"].includes(order.status) ? "paid" : order.status;
  return {
    orderNo: order.orderNo,
    userId: order.userId,
    status: consumerStatus,
    fulfillment: {
      status: order.status,
      carrier: order.carrier ?? null,
      trackingNo: order.trackingNo ?? null,
      shippedAt: order.shippedAt?.getTime() ?? null,
      completedAt: order.completedAt?.getTime() ?? null,
    },
    items: order.items.map((i: any) => ({
      skuId: i.skuId,
      productId: i.productId,
      title: i.title,
      variant: i.variant,
      thumb: i.thumb || thumbs?.get(i.productId) || "",
      priceCents: i.priceCents,
      qty: i.qty,
    })),
    address: JSON.parse(order.addressJson),
    note: order.note,
    shipping: JSON.parse(order.shippingJson),
    paymentMethod: order.paymentMethod,
    subtotalCents: order.subtotalCents,
    shippingFeeCents: order.shippingFeeCents,
    totalCents: order.totalCents,
    createdAt: order.createdAt.getTime(),
    paidAt: order.paidAt?.getTime() ?? null,
    expiresAt: order.expiresAt.getTime(),
  };
}

/** 历史订单的 thumb 为空时按商品回查封面；只改输出，不写库 */
async function orderViews(orders: any[]) {
  const missing = orders.flatMap((order) => order.items.filter((i: any) => !i.thumb).map((i: any) => i.productId));
  const thumbs = missing.length > 0 ? await thumbsByProduct(missing) : new Map<string, string>();
  return orders.map((order) => orderView(order, thumbs));
}

/** 单个订单：补封面后出视图 */
async function orderViewFor(order: any) {
  const [view] = await orderViews([order]);
  return view;
}
async function requireUser(c: Context) {
  const user = c.get("user");
  if (!user) return null;
  return user as { id: string; name: string; phone: string };
}

function validateAddress(body: any): { ok: true; value: any } | { ok: false; field: string; code: string; message: string } {
  const name = String(body?.name ?? "").trim();
  if (name.length < 1 || name.length > 20) return { ok: false, field: "name", code: "ADDRESS_INVALID", message: "收货信息不完整，请检查姓名、手机号、省市区和详细地址。" };
  const phone = String(body?.phone ?? "").trim();
  if (!PHONE_RE.test(phone)) return { ok: false, field: "phone", code: "INVALID_PHONE", message: "请填写 11 位手机号。" };
  const province = String(body?.province ?? "").trim();
  const city = String(body?.city ?? "").trim();
  const district = String(body?.district ?? "").trim();
  if (!province || !city || !district) return { ok: false, field: "region", code: "ADDRESS_INVALID", message: "收货信息不完整，请检查姓名、手机号、省市区和详细地址。" };
  const detail = String(body?.detail ?? "").trim();
  if (detail.length < 4 || detail.length > 80) return { ok: false, field: "detail", code: "ADDRESS_INVALID", message: "收货信息不完整，请检查姓名、手机号、省市区和详细地址。" };
  const postcode = String(body?.postcode ?? "").trim();
  if (postcode && !/^\d{6}$/.test(postcode)) return { ok: false, field: "postcode", code: "POSTCODE_INVALID", message: "邮编应为 6 位数字，或留空。" };
  return {
    ok: true,
    value: { name, phone, province, city, district, detail, postcode, tag: String(body?.tag ?? "家").trim() || "家", isDefault: Boolean(body?.isDefault) },
  };
}

export function makeShopApp() {
  const app = new Hono<Env>();

  app.use("*", async (c, next) => {
    const user = await resolveUser(c);
    c.set("user", user);
    await next();
  });

  /* ── 账号 ───────────────────────────────────────── */
  app.post("/auth/register", async (c) => {
    const rawBody = await readBodyWithin(c, AUTH_BODY_LIMIT);
    if (rawBody === null) return fail(c, 413, "PAYLOAD_TOO_LARGE", "请求体过大。");
    // 同一 IP 每小时 10 次（成功也计数：注册本身就是一次消耗）
    const ip = clientIp(c);
    const gate = registerLimiter.check(ip);
    if (!gate.ok) {
      const info = tooMany(gate.retryAfterSec);
      c.header("Retry-After", String(Math.ceil(info.retryAfterSec)));
      return fail(c, info.status, info.code, info.message);
    }
    registerLimiter.hit(ip);
    let parsedReg: unknown = null;
    try {
      parsedReg = rawBody ? JSON.parse(rawBody) : null;
    } catch {
      parsedReg = null;
    }
    const body = pickBody(parsedReg);
    const name = String(body.name ?? "").replace(/\s+/g, " ").trim();
    if (name.length < 2 || name.length > 16) return fail(c, 400, "INVALID_NAME", "请填写 2–16 个字的称呼。", "name");
    const phone = String(body.phone ?? "").trim();
    if (!PHONE_RE.test(phone)) return fail(c, 400, "INVALID_PHONE", "请填写 11 位手机号。", "phone");
    const password = String(body.password ?? "");
    if (password.length < 8 || !/[a-zA-Z]/.test(password) || !/\d/.test(password)) {
      return fail(c, 400, "WEAK_PASSWORD", "密码至少 8 位，且同时包含字母和数字。", "password");
    }
    const exists = await prisma.user.findUnique({ where: { phone } });
    if (exists) return fail(c, 409, "PHONE_TAKEN", "这个手机号已经注册过，直接登录即可。", "phone");
    let passwordHash: string;
    try {
      passwordHash = await hashPassword(password);
    } catch (error) {
      if (error instanceof ScryptBusyError) return fail(c, 503, "BUSY", "系统繁忙，请稍后再试。");
      throw error;
    }
    const user = await prisma.user.create({ data: { name, phone, passwordHash } });
    await mergeAnonCart(c, user.id);
    const token = await issueUserToken(user.id);
    return c.json({ token, user: userView(user) }, 201);
  });

  app.post("/auth/login", async (c) => {
    const rawBody = await readBodyWithin(c, AUTH_BODY_LIMIT);
    if (rawBody === null) return fail(c, 413, "PAYLOAD_TOO_LARGE", "请求体过大。");
    let parsedLogin: unknown = null;
    try {
      parsedLogin = rawBody ? JSON.parse(rawBody) : null;
    } catch {
      parsedLogin = null;
    }
    const body = pickBody(parsedLogin);
    const phone = String(body.phone ?? "").trim();
    const password = String(body.password ?? "");
    if (!phone || !password) return fail(c, 400, "BAD_REQUEST", "请输入手机号和密码。");

    const ip = clientIp(c);
    const pairKey = `${ip}|${phone}`;
    const blocked = blockedFor(pairKey, ip, phone);
    if (blocked !== null) {
      const info = tooMany(blocked);
      c.header("Retry-After", String(Math.ceil(info.retryAfterSec)));
      return fail(c, info.status, info.code, info.message);
    }

    // 三个维度都按 key 串行（顺序固定：手机号 → IP）：正确口令不会被误判成超限，
    // 并发暴力尝试也冲不穿上限（第 max+1 个进门就 429）；pair 维度被这两把锁覆盖。
    return withKeyLock(`u:${phone}`, () =>
      withKeyLock(`ip:${ip}`, async () => {
        const recheck = blockedFor(pairKey, ip, phone);
        if (recheck !== null) {
          const info = tooMany(recheck);
          c.header("Retry-After", String(Math.ceil(info.retryAfterSec)));
          return fail(c, info.status, info.code, info.message);
        }

        const failed = () => {
          // 只记失败：成功时不会走到这里
          pairLimiter.hit(pairKey);
          ipLimiter.hit(ip);
          phoneLimiter.hit(phone);
          if (blockedFor(pairKey, ip, phone) !== null) {
            audit({ actor: phone, action: "auth.login_locked", target: "shop.login", detail: { ip } });
          }
          return fail(c, 401, "BAD_CREDENTIALS", "手机号或密码不对，请再试一次。");
        };

        if (phone.length > 64 || password.length > 1024) return failed();

        const user = await prisma.user.findUnique({ where: { phone } });
        let matched = false;
        try {
          if (user) {
            matched = await verifyPassword(password, user.passwordHash);
            // 旧参数哈希校验完再跑一次假哈希：新旧账号耗时一致
            if (needsUpgrade(user.passwordHash)) await verifyDummy(password);
          } else {
            await verifyDummy(password);
          }
        } catch (error) {
          if (error instanceof ScryptBusyError) return fail(c, 503, "BUSY", "系统繁忙，请稍后再试。");
          throw error;
        }
        if (!user || !matched) return failed();

        // 旧参数哈希透明升级（不动会话）
        if (needsUpgrade(user.passwordHash)) {
          try {
            await prisma.user.update({ where: { id: user.id }, data: { passwordHash: await hashPassword(password) } });
          } catch (error) {
            if (!(error instanceof ScryptBusyError)) throw error;
          }
        }
        // 登录成功只清「IP + 手机号」这一条
        pairLimiter.reset(pairKey);
        await mergeAnonCart(c, user.id);
        const token = await issueUserToken(user.id);
        return c.json({ token, user: userView(user) });
      }),
    );
  });

  app.get("/auth/me", async (c) => {
    const user = c.get("user");
    return c.json(user ? userView(user as any) : null);
  });

  app.post("/auth/logout", async (c) => {
    const header = c.req.header("authorization");
    const match = header ? /^Bearer\s+(.+)$/i.exec(header.trim()) : null;
    if (match) {
      try {
        const payload: any = await verify(match[1], secret(), "HS256");
        if (payload?.aud !== SHOP_AUDIENCE) throw new Error("wrong audience");
        await prisma.shopSession.update({ where: { token: payload.sid }, data: { revokedAt: new Date() } }).catch(() => {});
      } catch {
        /* token 已坏，静默成功 */
      }
    }
    return c.body(null, 204);
  });

  /* ── 商品 ───────────────────────────────────────── */
  app.get("/shop/products", async (c) => {
    const category = c.req.query("category");
    const keyword = c.req.query("keyword")?.trim().toLowerCase();
    const sort = c.req.query("sort") ?? "default";

    const items = await prisma.item.findMany({
      where: { board: "product", status: "published" },
      include: { product: true, media: { where: { kind: "image" }, orderBy: { sort: "asc" }, take: 1 } },
      orderBy: { sort: "asc" },
    });
    const skus = await prisma.productSku.findMany({ where: { itemId: { in: items.map((i) => i.id) } } });
    const byItem = new Map<string, any[]>();
    for (const sku of skus) {
      const list = byItem.get(sku.itemId) ?? [];
      list.push(sku);
      byItem.set(sku.itemId, list);
    }
    let products = items.map((item) => productView(item, item.product, byItem.get(item.id) ?? [], item.media));
    if (category && category !== "all") {
      products = products.filter((p) => p.catKey === category || p.cat === category);
    }
    if (keyword) {
      products = products.filter((p) =>
        [p.title, p.cat, p.summary].join(" ").toLowerCase().includes(keyword),
      );
    }
    if (sort === "price-asc" || sort === "price-desc") {
      products.sort((a, b) => {
        const pa = Math.min(...a.skus.map((s) => s.priceCents));
        const pb = Math.min(...b.skus.map((s) => s.priceCents));
        return sort === "price-asc" ? pa - pb : pb - pa;
      });
    }
    return c.json({ items: products, total: products.length });
  });

  app.get("/shop/products/:id", async (c) => {
    const item = await prisma.item.findUnique({
      where: { id: c.req.param("id") },
      include: { product: true, media: { orderBy: { sort: "asc" } } },
    });
    if (!item || item.board !== "product" || item.status !== "published") {
      return fail(c, 404, "SKU_NOT_FOUND", "没有找到这件产品。");
    }
    const skus = await prisma.productSku.findMany({ where: { itemId: item.id }, orderBy: { sort: "asc" } });
    const view = productView(item, item.product, skus, item.media);
    view.images = item.media.map((m) => ({ src: m.url, alt: m.alt ?? "", originalUrl: m.url, sourcePage: item.sourceUrl ?? "" }));
    return c.json(view);
  });

  /* ── 购物车 ─────────────────────────────────────── */
  app.get("/shop/cart", async (c) => {
    const user = c.get("user");
    const { cart } = await getOrCreateCart(c, user?.id ?? null);
    const payload = await cartPayload(cart.id);
    return c.json(payload.view);
  });

  app.post("/shop/cart/items", async (c) => {
    const user = c.get("user");
    const body = pickBody(await c.req.json().catch(() => ({})));
    const skuId = String(body.skuId ?? "");
    const qty = Math.max(1, Math.min(99, Number(body.qty ?? 1) || 1));
    const sku = await prisma.productSku.findUnique({ where: { id: skuId } });
    if (!sku) return fail(c, 404, "SKU_NOT_FOUND", "这件商品已下架或规格不存在。");
    // S1：商品本身已下架/还是草稿时不能加车，和规格可购买状态是两道独立的门
    const owner = await prisma.item.findUnique({ where: { id: sku.itemId }, select: { status: true } });
    if (!owner || owner.status !== "published") return fail(c, 409, "NOT_PURCHASABLE", "这件商品已下架。");
    if (!sku.purchasable || sku.status !== "on") return fail(c, 409, "NOT_PURCHASABLE", "药品类商品不参与演示下单。");
    const { cart } = await getOrCreateCart(c, user?.id ?? null);
    const cap = Math.max(0, Math.min(sku.stock, 99));
    if (cap === 0) return fail(c, 409, "OUT_OF_STOCK", "库存不足，请减少数量。", "qty");
    const existing = await prisma.cartItem.findUnique({ where: { cartId_skuId: { cartId: cart.id, skuId } } });
    const next = Math.min(cap, (existing?.qty ?? 0) + qty);
    if (existing) await prisma.cartItem.update({ where: { id: existing.id }, data: { qty: next } });
    else await prisma.cartItem.create({ data: { cartId: cart.id, skuId, qty: next } });
    await prisma.cart.update({ where: { id: cart.id }, data: { updatedAt: new Date() } });
    const payload = await cartPayload(cart.id);
    return c.json(payload.view);
  });

  app.patch("/shop/cart/items/:skuId", async (c) => {
    const user = c.get("user");
    const skuId = c.req.param("skuId");
    const body = pickBody(await c.req.json().catch(() => ({})));
    const sku = await prisma.productSku.findUnique({ where: { id: skuId } });
    if (!sku) return fail(c, 404, "SKU_NOT_FOUND", "这件商品已下架或规格不存在。");
    const { cart } = await getOrCreateCart(c, user?.id ?? null);
    const qty = Number(body.qty ?? 0) || 0;
    if (qty <= 0) {
      await prisma.cartItem.deleteMany({ where: { cartId: cart.id, skuId } });
    } else {
      const owner = await prisma.item.findUnique({ where: { id: sku.itemId }, select: { status: true } });
      if (!owner || owner.status !== "published") return fail(c, 409, "NOT_PURCHASABLE", "这件商品已下架。");
      const next = Math.min(Math.max(0, Math.min(sku.stock, 99)), Math.round(qty));
      await prisma.cartItem.upsert({
        where: { cartId_skuId: { cartId: cart.id, skuId } },
        create: { cartId: cart.id, skuId, qty: next },
        update: { qty: next },
      });
    }
    const payload = await cartPayload(cart.id);
    return c.json(payload.view);
  });

  app.delete("/shop/cart/items/:skuId", async (c) => {
    const user = c.get("user");
    const { cart } = await getOrCreateCart(c, user?.id ?? null);
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id, skuId: c.req.param("skuId") } });
    const payload = await cartPayload(cart.id);
    return c.json(payload.view);
  });

  app.delete("/shop/cart", async (c) => {
    const user = c.get("user");
    const { cart } = await getOrCreateCart(c, user?.id ?? null);
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    const payload = await cartPayload(cart.id);
    return c.json(payload.view);
  });

  /* ── 地址簿 ─────────────────────────────────────── */
  app.get("/shop/addresses", async (c) => {
    const user = await requireUser(c);
    if (!user) return fail(c, 401, "UNAUTHORIZED", "登录状态已失效，请重新登录。");
    const rows = await prisma.address.findMany({ where: { userId: user.id } });
    rows.sort((a, b) => Number(b.isDefault) - Number(a.isDefault) || b.createdAt.getTime() - a.createdAt.getTime());
    return c.json(rows.map(addressView));
  });

  app.post("/shop/addresses", async (c) => {
    const user = await requireUser(c);
    if (!user) return fail(c, 401, "UNAUTHORIZED", "登录状态已失效，请重新登录。");
    const parsed = validateAddress(await c.req.json().catch(() => ({})));
    if (!parsed.ok) return fail(c, 400, parsed.code, parsed.message, parsed.field);
    const count = await prisma.address.count({ where: { userId: user.id } });
    const isDefault = parsed.value.isDefault || count === 0;
    if (isDefault) await prisma.address.updateMany({ where: { userId: user.id }, data: { isDefault: false } });
    const created = await prisma.address.create({ data: { ...parsed.value, isDefault, userId: user.id } });
    return c.json(addressView(created), 201);
  });

  app.put("/shop/addresses/:id", async (c) => {
    const user = await requireUser(c);
    if (!user) return fail(c, 401, "UNAUTHORIZED", "登录状态已失效，请重新登录。");
    const id = c.req.param("id");
    const existing = await prisma.address.findFirst({ where: { id, userId: user.id } });
    if (!existing) return fail(c, 404, "ORDER_NOT_FOUND", "没有找到这个地址。");
    const parsed = validateAddress(await c.req.json().catch(() => ({})));
    if (!parsed.ok) return fail(c, 400, parsed.code, parsed.message, parsed.field);
    const isDefault = parsed.value.isDefault || existing.isDefault;
    if (isDefault) await prisma.address.updateMany({ where: { userId: user.id }, data: { isDefault: false } });
    const updated = await prisma.address.update({ where: { id }, data: { ...parsed.value, isDefault } });
    return c.json(addressView(updated));
  });

  app.delete("/shop/addresses/:id", async (c) => {
    const user = await requireUser(c);
    if (!user) return fail(c, 401, "UNAUTHORIZED", "登录状态已失效，请重新登录。");
    const id = c.req.param("id");
    const existing = await prisma.address.findFirst({ where: { id, userId: user.id } });
    if (!existing) return c.body(null, 204);
    await prisma.address.delete({ where: { id } });
    if (existing.isDefault) {
      const next = await prisma.address.findFirst({ where: { userId: user.id }, orderBy: { createdAt: "desc" } });
      if (next) await prisma.address.update({ where: { id: next.id }, data: { isDefault: true } });
    }
    return c.body(null, 204);
  });

  /* ── 订单 ───────────────────────────────────────── */
  app.post("/shop/orders", async (c) => {
    const user = await requireUser(c);
    if (!user) return fail(c, 401, "UNAUTHORIZED", "登录状态已失效，请重新登录。");
    const body = pickBody(await c.req.json().catch(() => ({})));

    const cart = await prisma.cart.findFirst({ where: { userId: user.id }, orderBy: { updatedAt: "desc" } });
    const lines = cart ? await prisma.cartItem.findMany({ where: { cartId: cart.id } }) : [];
    if (!cart || lines.length === 0) return fail(c, 409, "CART_EMPTY", "购物车是空的。");

    const skus = await prisma.productSku.findMany({ where: { id: { in: lines.map((l) => l.skuId) } } });
    const items = await prisma.item.findMany({ where: { id: { in: skus.map((s) => s.itemId) } } });
    const skuById = new Map(skus.map((s) => [s.id, s]));
    const titleById = new Map(items.map((i) => [i.id, i.title]));
    const statusById = new Map(items.map((i) => [i.id, i.status]));
    const thumbById = await thumbsByProduct(skus.map((s) => s.itemId));

    const orderItems: any[] = [];
    let subtotal = 0;
    for (const line of lines) {
      const sku = skuById.get(line.skuId);
      if (!sku) return fail(c, 404, "SKU_NOT_FOUND", "这件商品已下架或规格不存在。");
      if (statusById.get(sku.itemId) !== "published") return fail(c, 409, "NOT_PURCHASABLE", "这件商品已下架。");
      if (!sku.purchasable || sku.status !== "on") return fail(c, 409, "NOT_PURCHASABLE", "药品类商品不参与演示下单。");
      if (line.qty > sku.stock) return fail(c, 409, "OUT_OF_STOCK", "库存不足，请减少数量。", "qty");
      subtotal += sku.priceCents * line.qty;
      orderItems.push({
        skuId: sku.id,
        productId: sku.itemId,
        title: titleById.get(sku.itemId) ?? sku.itemId,
        variant: sku.variantName,
        thumb: thumbById.get(sku.itemId) ?? "",
        priceCents: sku.priceCents,
        qty: line.qty,
      });
    }

    const addressParsed = validateAddress(body?.address ?? {});
    if (!addressParsed.ok) return fail(c, 400, addressParsed.code, addressParsed.message, addressParsed.field);

    const shipping = SHIPPING[String(body?.shippingKey ?? "standard")];
    if (!shipping) return fail(c, 400, "INVALID_SHIPPING", "配送方式不可用。", "shippingKey");
    const paymentMethod = String(body?.paymentMethod ?? "");
    if (!PAYMENT_METHODS.includes(paymentMethod)) {
      return fail(c, 400, "PAYMENT_FAILED", "模拟支付没有完成，请重试。", "paymentMethod");
    }

    const note = String(body?.note ?? "").trim().slice(0, 120);
    const total = subtotal + shipping.feeCents;
    const addressSnapshot = { id: "snapshot", ...addressParsed.value, isDefault: false };
    const now = new Date();
    const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;

    let created: any = null;
    for (let attempt = 0; attempt < 30 && !created; attempt += 1) {
      const orderNo = `HJH${stamp}${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}`;
      try {
        created = await prisma.$transaction(async (tx) => {
          for (const item of orderItems) {
            const updated = await tx.productSku.updateMany({
              where: { id: item.skuId, stock: { gte: item.qty } },
              data: { stock: { decrement: item.qty } },
            });
            if (updated.count === 0) throw new Error("OUT_OF_STOCK");
          }
          const order = await tx.order.create({
            data: {
              orderNo,
              userId: user.id,
              status: "pending_payment",
              subtotalCents: subtotal,
              shippingFeeCents: shipping.feeCents,
              totalCents: total,
              paymentMethod,
              addressJson: JSON.stringify(addressSnapshot),
              shippingJson: JSON.stringify(shipping),
              note,
              expiresAt: new Date(Date.now() + 30 * 60_000),
              items: { create: orderItems },
            },
            include: { items: true },
          });
          await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
          return order;
        });
      } catch (error) {
        if (error instanceof Error && error.message === "OUT_OF_STOCK") {
          return fail(c, 409, "OUT_OF_STOCK", "库存不足，请减少数量。", "qty");
        }
        created = null; // 订单号冲突，重试
      }
    }
    if (!created) return fail(c, 500, "NETWORK", "订单创建失败，请重试。");
    return c.json(await orderViewFor(created), 201);
  });

  app.get("/shop/orders", async (c) => {
    const user = await requireUser(c);
    if (!user) return fail(c, 401, "UNAUTHORIZED", "登录状态已失效，请重新登录。");
    await expireOrders(user.id);
    const rows = await prisma.order.findMany({
      where: { userId: user.id },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });
    return c.json(await orderViews(rows));
  });

  app.get("/shop/orders/:orderNo", async (c) => {
    const user = await requireUser(c);
    if (!user) return fail(c, 401, "UNAUTHORIZED", "登录状态已失效，请重新登录。");
    await expireOrders(user.id);
    const order = await prisma.order.findFirst({
      where: { orderNo: c.req.param("orderNo"), userId: user.id },
      include: { items: true },
    });
    if (!order) return fail(c, 404, "ORDER_NOT_FOUND", "没有找到这个订单。");
    return c.json(await orderViewFor(order));
  });

  /**
   * 收银台二维码：服务端现场生成 SVG，前端内联展示。
   * 二维码只编码「订单号 + 金额 + 付款方式」，演示用，不连任何真实支付通道。
   */
  app.get("/shop/orders/:orderNo/pay-code", async (c) => {
    const user = await requireUser(c);
    if (!user) return fail(c, 401, "UNAUTHORIZED", "登录状态已失效，请重新登录。");
    await expireOrders(user.id);

    const order = await prisma.order.findFirst({
      where: { orderNo: c.req.param("orderNo"), userId: user.id },
    });
    if (!order) return fail(c, 404, "ORDER_NOT_FOUND", "没有找到这个订单。");
    if (order.status === "cancelled")
      return fail(c, 409, "ORDER_EXPIRED", "订单已取消或超过支付时限，请回购物车重新下单。");
    // 已付 / 已发货 / 已完成：不再下发新收款码
    if (["paid", "shipped", "completed"].includes(order.status))
      return fail(c, 409, "ORDER_ALREADY_PAID", "这一单已经付过了，不用再出示收款码。");

    const requested = String(c.req.query("method") ?? "");
    const method = PAYMENT_METHODS.includes(requested) ? requested : order.paymentMethod;
    const payload = `hjh-pay://order/${order.orderNo}?amount=${order.totalCents}&method=${method}`;
    const svg = await QRCode.toString(payload, {
      type: "svg",
      margin: 1,
      width: 220,
      errorCorrectionLevel: "M",
      color: { dark: "#1f2a30", light: "#ffffff" },
    });

    // 收款码属一次性凭据，不让中间层缓存
    c.header("Cache-Control", "no-store");
    return c.json({
      orderNo: order.orderNo,
      status: order.status === "shipped" || order.status === "completed" ? "paid" : order.status,
      totalCents: order.totalCents,
      method,
      methodName: PAYMENT_METHOD_LABEL[method] ?? "模拟支付",
      payload,
      qr: { format: "svg", data: svg },
      expiresAt: order.expiresAt.getTime(),
      expiresInSec: Math.max(0, Math.floor((order.expiresAt.getTime() - Date.now()) / 1000)),
      tips: [
        "这是毕业设计的模拟收银台，二维码只编码订单号与金额。",
        "扫不扫都行：直接点「下一步」即视为完成付款。",
      ],
    });
  });

  app.post("/shop/orders/:orderNo/pay", async (c) => {
    const user = await requireUser(c);
    if (!user) return fail(c, 401, "UNAUTHORIZED", "登录状态已失效，请重新登录。");
    const body = pickBody(await c.req.json().catch(() => ({})));
    const paymentMethod = String(body.paymentMethod ?? "");
    if (!PAYMENT_METHODS.includes(paymentMethod)) return fail(c, 400, "PAYMENT_FAILED", "模拟支付没有完成，请重试。");

    const order = await prisma.order.findFirst({
      where: { orderNo: c.req.param("orderNo"), userId: user.id },
      include: { items: true },
    });
    if (!order) return fail(c, 404, "ORDER_NOT_FOUND", "没有找到这个订单。");
    // 已付或已进入履约（shipped/completed）都直接回当前视图，避免把履约态打回 paid
    if (["paid", "shipped", "completed"].includes(order.status)) return c.json(await orderViewFor(order));
    if (order.status === "cancelled") return fail(c, 409, "PAYMENT_FAILED", "订单已取消。");

    if (order.expiresAt.getTime() < Date.now()) {
      await cancelOrder(order.id);
      return fail(c, 409, "ORDER_EXPIRED", "订单已超过 30 分钟支付时限，请回购物车重新下单。");
    }

    // 条件更新：只有仍是 pending_payment 才落 paid。
    // 否则可能与超时取消并发，出现「付了钱订单却被取消并回补库存」。
    const claimed = await prisma.order.updateMany({
      where: { id: order.id, status: "pending_payment" },
      data: { status: "paid", paidAt: new Date(), paymentMethod },
    });
    if (claimed.count !== 1) {
      const latest = await prisma.order.findUnique({ where: { id: order.id }, include: { items: true } });
      if (!latest) return fail(c, 404, "ORDER_NOT_FOUND", "没有找到这个订单。");
      // 并发下被超时取消：明确告诉前端这一单不能付了
      if (latest.status === "cancelled")
        return fail(c, 409, "PAYMENT_FAILED", "这一单已超时取消，请回购物车重新下单。");
      return c.json(await orderViewFor(latest));
    }
    const paid = await prisma.order.findUnique({ where: { id: order.id }, include: { items: true } });
    if (!paid) return fail(c, 404, "ORDER_NOT_FOUND", "没有找到这个订单。");
    await prisma.payment
      .create({
        data: {
          orderId: paid.id,
          provider: "mock",
          amountCents: paid.totalCents,
          status: "succeeded",
          payloadJson: JSON.stringify({ paymentMethod }),
        },
      })
      .catch(() => {});
    return c.json(await orderViewFor(paid));
  });

  /* 过期未付订单：惰性取消并归还库存 */
  async function cancelOrder(orderId: string) {
    const order = await prisma.order.findUnique({ where: { id: orderId }, include: { items: true } });
    if (!order || order.status !== "pending_payment") return;
    await prisma.$transaction(async (tx) => {
      // 条件取消：只有仍是 pending_payment 才改状态并回补库存，避免两个请求同时清理时加两次库存
      const hit = await tx.order.updateMany({
        where: { id: orderId, status: "pending_payment" },
        data: { status: "cancelled" },
      });
      if (hit.count !== 1) return;
      for (const item of order.items) {
        await tx.productSku.update({ where: { id: item.skuId }, data: { stock: { increment: item.qty } } }).catch(() => {});
      }
    });
  }

  async function expireOrders(userId: string) {
    const overdue = await prisma.order.findMany({
      where: { userId, status: "pending_payment", expiresAt: { lt: new Date() } },
      select: { id: true },
    });
    for (const order of overdue) await cancelOrder(order.id);
  }

  app.notFound((c) => fail(c, 404, "NOT_FOUND", "无此接口"));
  return app;
}