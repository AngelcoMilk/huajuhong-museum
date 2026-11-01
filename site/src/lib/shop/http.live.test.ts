// 前端 HTTP 适配器 × 真实后端的联调测试。
// 默认跳过；起好后端后运行：SHOP_LIVE=1 npx vitest run src/lib/shop/http.live.test.ts
import { beforeAll, describe, expect, it, vi } from "vitest";
import { createHttpApi } from "./http";
import { setSession } from "./session";

// 用 globalThis 取环境变量：浏览器侧 tsconfig 不含 node 类型
const env = (globalThis as any).process?.env ?? {};
const LIVE = env.SHOP_LIVE === "1";
const base = env.SHOP_API_BASE ?? "http://127.0.0.1:3000/api";

// 浏览器会自动带 cookie；Node 的 fetch 不会。这里加一层最小 cookie 罐，
// 让匿名购物车的 hjh_cart cookie 在请求之间保持，和真实浏览器一致。
let cookie = "";
beforeAll(() => {
  if (!LIVE) return;
  try {
    localStorage.clear();
  } catch {
    /* 忽略 */
  }
  const realFetch = globalThis.fetch.bind(globalThis);
  vi.stubGlobal("fetch", async (input: any, init: RequestInit = {}) => {
    const headers = new Headers(init.headers);
    if (cookie) headers.set("cookie", cookie);
    const response = await realFetch(input, { ...init, headers });
    const raw = (response.headers as any).getSetCookie?.() ?? [];
    for (const one of raw) {
      const pair = String(one).split(";")[0];
      if (!pair.includes("=")) continue;
      const [key, value] = pair.split("=");
      if (!value || /max-age=0/i.test(one)) cookie = "";
      else cookie = `${key.trim()}=${value.trim()}`;
    }
    return response;
  });
});

describe.skipIf(!LIVE)("shop HTTP adapter × live server", () => {
  const api = createHttpApi(base);
  const phone = "139" + String(Date.now()).slice(-8);
  const userId = "ignored";

  it("产品列表与详情", async () => {
    const list = await api.listProducts({ category: "dried" });
    expect(list.total).toBeGreaterThan(0);
    expect(list.items[0].skus.length).toBeGreaterThan(0);
    const detail = await api.getProduct(list.items[0].id);
    expect(detail.id).toBe(list.items[0].id);
  });

  it("注册 → 登录态 → 匿名车并入账号车", async () => {
    const sku = (await api.listProducts({ category: "dried" })).items[0].skus[0].sku;
    const anonCart = await api.addToCart(sku, 2);
    expect(anonCart.lines[0].qty).toBe(2);

    const auth = await api.register({ name: "联调用户", phone, password: "hjh12345" });
    setSession({ token: auth.token, user: auth.user });
    expect((await api.login({ phone, password: "hjh12345" })).user.phone).toBe(phone);

    const merged = await api.getCart();
    expect(merged.lines.length).toBe(1);
    expect(merged.lines[0].qty).toBe(2);
  });

  it("地址 → 下单 → 付款 → 订单列表", async () => {
    const address = await api.saveAddress(userId, {
      name: "联调用户",
      phone,
      province: "广东省",
      city: "茂名市",
      district: "化州市",
      detail: "橘城中路 1 号 联调用户",
      postcode: "525100",
      tag: "家",
    } as any);
    expect(address.id).toBeTruthy();

    const order = await api.createOrder(userId, {
      address: {
        name: "联调用户",
        phone,
        province: "广东省",
        city: "茂名市",
        district: "化州市",
        detail: "橘城中路 1 号 联调用户",
        postcode: "525100",
        tag: "家",
      },
      shippingKey: "standard",
      paymentMethod: "wechat",
      note: "联调用户",
    } as any);
    expect(order.status).toBe("pending_payment");
    expect(order.totalCents).toBeGreaterThan(0);
    expect(typeof order.createdAt).toBe("number");
    expect((await api.getCart()).lines.length).toBe(0);

    const paid = await api.payOrder(userId, order.orderNo, "wechat");
    expect(paid.status).toBe("paid");
    expect(typeof paid.paidAt).toBe("number");

    const again = await api.payOrder(userId, order.orderNo, "wechat");
    expect(again.paidAt).toBe(paid.paidAt);

    const orders = await api.listOrders(userId);
    expect(orders.some((o) => o.orderNo === order.orderNo)).toBe(true);
    expect((await api.getOrder(userId, order.orderNo)).orderNo).toBe(order.orderNo);
  });
});