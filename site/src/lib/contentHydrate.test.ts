import { describe, expect, it } from "vitest";
import { hydrateContent, patchCommerce, patchEnterprises, patchProducts, toBlocks, type ApiContentItem } from "./contentHydrate";
import { PARK_SECTIONS } from "../data/park";
import { products } from "./shop/data";

const item = (over: Partial<ApiContentItem>): ApiContentItem => ({
  id: "YQ-002",
  board: "park",
  section: "基础情况",
  type: "图文栏目",
  title: "基础情况",
  date: null,
  sourceUrl: null,
  body: "",
  label: null,
  media: [],
  ...over,
});

describe("内容水合", () => {
  it("正文按空行切段", () => {
    expect(toBlocks("第一段\n\n第二段\n\n\n第三段").map((b) => b.text)).toEqual(["第一段", "第二段", "第三段"]);
  });
});
describe("产品与企业水合", () => {
  const product = () => ({
    id: "CP-007",
    title: "旧标题",
    summary: "旧摘要",
    blocks: [{ type: "p" as const, text: "旧正文" }],
    thumb: "",
    images: [],
    sourceUrl: "",
  }) as any;

  it("产品覆盖标题、正文、摘要与主图", () => {
    const target = product();
    patchProducts(
      [target],
      new Map([
        [
          "CP-007",
          item({
            id: "CP-007",
            board: "product",
            title: "七爪化橘红（后台改）",
            body: "第一段新文案\n\n第二段",
            media: [{ kind: "image", url: "https://x/a.jpg", alt: "图", usage: "thumb" }],
          }),
        ],
      ]),
    );
    expect(target.title).toBe("七爪化橘红（后台改）");
    expect(target.blocks.map((b: any) => b.text)).toEqual(["第一段新文案", "第二段"]);
    expect(target.summary).toBe("第一段新文案");
    expect(target.thumb).toBe("https://x/a.jpg");
  });

  it("企业覆盖档案字段", () => {
    const target = {
      id: "QY-001",
      name: "旧名",
      town: "待核",
      address: "旧地址",
      tel: "",
      email: "",
      site: "",
      shops: [],
      text: "",
      date: "",
      sourceUrl: "",
      images: [],
      imageTotal: 0,
      videos: [],
      articleCount: 0,
    } as any;
    patchEnterprises(
      [target],
      new Map([
        [
          "QY-001",
          item({
            id: "QY-001",
            board: "enterprise",
            title: "新公司名",
            body: "新的企业简介",
            enterprise: { town: "河西街道", address: "广东省化州市", tel: "17322930316", shopsJson: JSON.stringify([{ label: "天猫", url: "https://t" }]) } as any,
          }),
        ],
      ]),
    );
    expect(target.name).toBe("新公司名");
    expect(target.town).toBe("河西街道");
    expect(target.address).toBe("广东省化州市");
    expect(target.tel).toBe("17322930316");
    expect(target.shops.length).toBe(1);
    expect(target.text).toBe("新的企业简介");
  });
});
describe("价格与库存水合", () => {
  it("以购物接口为准覆盖 SKU 价格、库存与可售性", () => {
    const product = {
      id: "CP-007",
      title: "七爪化橘红",
      purchasable: true,
      blockReason: null as string | null,
      thumb: "",
      skus: [
        { sku: "CP-007-01", name: "七爪化橘红", priceCents: 12900, stock: 54 },
        { sku: "CP-007-02", name: "礼盒装", priceCents: 19900, stock: 10 },
      ],
    } as any;
    const patched = patchCommerce(
      [product],
      [
        {
          id: "CP-007",
          title: "七爪化橘红",
          thumb: "https://x/thumb.jpg",
          purchasable: false,
          blockReason: "临时下架",
          skus: [{ sku: "CP-007-01", name: "七爪化橘红", priceCents: 9900, stock: 3 }],
        },
      ],
    );
    expect(patched).toBe(1);
    expect(product.skus[0].priceCents).toBe(9900);
    expect(product.skus[0].stock).toBe(3);
    expect(product.skus[1].priceCents).toBe(19900); // 接口没给的 SKU 保持原值
    expect(product.purchasable).toBe(false);
    expect(product.blockReason).toBe("临时下架");
    expect(product.thumb).toBe("https://x/thumb.jpg");
  });
});
describe("水合编排（模拟接口）", () => {
  it("一次水合覆盖价格，园区走内容层不改静态数据，接口缺失时保持原样", async () => {
    const section = PARK_SECTIONS.find((s) => s.id === "YQ-002")!;
    const originalTitle = section.title;
    const product = products.find((p) => p.id === "CP-007")!;
    const originalPrice = product.skus[0].priceCents;

    const payloads: Record<string, any> = {
      "/api/content/board/park": [
        item({ id: "YQ-002", title: "水合测试标题", body: "水合测试正文" }),
      ],
      "/api/content/board/museum": [],
      "/api/content/board/product": [],
      "/api/content/board/enterprise": [],
      "/api/shop/products": {
        items: [
          {
            id: "CP-007",
            title: product.title,
            thumb: product.thumb,
            purchasable: product.purchasable,
            blockReason: null,
            skus: [{ sku: product.skus[0].sku, name: product.skus[0].name, priceCents: 777, stock: 1 }],
          },
        ],
      },
    };

    const realFetch = globalThis.fetch;
    globalThis.fetch = (async (url: any) => {
      const key = String(url);
      if (key in payloads) return new Response(JSON.stringify(payloads[key]), { status: 200 });
      return new Response("{}", { status: 404 });
    }) as any;

    try {
      const report = await hydrateContent(300);
      expect(report.source).toBe("api");
      expect(report.boards).toBe(2);
      expect(section.title).toBe(originalTitle);
      expect(product.skus[0].priceCents).toBe(777);
    } finally {
      globalThis.fetch = realFetch;
      product.skus[0].priceCents = originalPrice;
    }
  });
});
