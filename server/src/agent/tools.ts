// 讲解员的 11 个自定义工具：知识库 2 个（search_knowledge / read_source）、
// 网站 3 个（search_site / read_site_item / get_product）、动作 6 个（goto_page / cart_add / cart_set /
// cart_remove / goto_checkout / goto_pay）。
// pi 的内置工具用 noTools: "builtin" 关闭（不是 tools: []，那是白名单，空数组会把自定义工具一起过滤掉）。
// 权限设计：只读工具访问知识库与网站数据；动作类工具**只产 SSE 事件**，真正的页面动效由浏览器执行——
// 服务端不改购物车、不建订单、不付款。
import { defineTool } from "@mariozechner/pi-coding-agent";
import { Type } from "typebox";
import type { Citation } from "../contract.ts";
import type { KnowledgeProvider } from "../knowledge/provider.ts";
import type { Emit } from "./runner.ts";
import { checkSku, getProduct, readSiteItem, resolveRoute, searchSite, skuForRemove, stockReason } from "./site.ts";

/** 一次 run 的出口与当场计数；piRunner 每轮 run 开始时替换 emit 并把计数清零 */
export interface EmitBox {
  emit: Emit;
  /** 本轮已发出的动作次数：购物车动作最多 5 次，页面跳转合计最多 1 次 */
  counts: { cart: number; nav: number; total: number };
}

export function createEmitBox(): EmitBox {
  return { emit: () => {}, counts: { cart: 0, nav: 0, total: 0 } };
}

export interface ToolDeps {
  knowledge: KnowledgeProvider;
  box: EmitBox;
}

/** 每轮对话的上限：超了就不发事件，只回一句能转述给访客的原因 */
export const MAX_CART_ACTIONS = 5;
export const MAX_NAV_ACTIONS = 1;

/** G1：单轮所有工具调用合计不超过 12 次；第 13 次起工具不执行，只回一句 */
export const MAX_TOOL_CALLS_PER_TURN = 12;

function toolLimitText(): string {
  return "本轮查询次数已用完，请根据已有内容回答。";
}

function text(value: string) {
  return { content: [{ type: "text" as const, text: value }], details: {} };
}

function yuan(cents: number): string {
  return `${(cents / 100).toFixed(2)} 元`;
}

/**
 * qty 必须真的是数字：pi 在 execute 之前会按 schema 做类型转换（"2"→2、true→1、"1e1"→10），
 * 所以这里在转换之前看原始类型，非数字一律换成 -1，交给 execute 返回中文原因（不发事件）。
 */
function prepareQty(args: unknown): { skuId: string; qty: number } {
  const raw = { ...((args && typeof args === "object" ? args : {}) as Record<string, unknown>) };
  if ("qty" in raw && typeof raw.qty !== "number") raw.qty = -1;
  // cart_add 的 qty 可以不传（运行时按默认 1 处理），这里按 cart_set 的形状断言以同时满足两个 schema
  return raw as unknown as { skuId: string; qty: number };
}

function cartLimitText(): string {
  return `这一轮已经操作过购物车 ${MAX_CART_ACTIONS} 次了，请让访客说清楚还要改哪一件。`;
}

function navLimitText(): string {
  return "一轮对话里最多只能带访客跳转一次，先看看眼前这一页吧。";
}

export function createGuideTools({ knowledge, box }: ToolDeps) {
  const searchKnowledge = defineTool({
    name: "search_knowledge",
    label: "搜索知识库",
    description:
      "在博览馆知识库中检索与化橘红、橘红炮制工艺、化州产地、展陈相关的资料片段。" +
      "仅在访客询问这些文化知识时才调用；网站上的内容、价格、库存、正文用 search_site / read_site_item / get_product。",
    parameters: Type.Object({
      query: Type.String({
        description: "检索词：只放用户问题里的核心名词或短语，例如「烘干周期」「七爪」，不要堆砌同义词或拼长串",
      }),
      limit: Type.Optional(Type.Number({ description: "返回条数，默认 3，最多 5" })),
    }),
    execute: async (_id: string, params: { query: string; limit?: number }) => {
      const limit = Math.min(Math.max(params.limit ?? 3, 1), 5);
      const hits = await knowledge.search(params.query, limit);
      if (hits.length === 0) {
        return text("知识库中没有检索到相关内容（当前知识库尚未接入）。");
      }
      const seenOrigins = new Set<string>();
      for (const hit of hits) {
        // 去重键必须与界面显示一致：没有出处的条目都显示成"知识库"，
        // 若按 id 去重就会重复显示好几条"引用自 知识库"。
        const key = hit.citation.origin ?? hit.citation.url ?? "知识库";
        if (seenOrigins.has(key)) continue;
        seenOrigins.add(key);
        box.emit({ type: "citation", citation: hit.citation });
      }
      // 用 origin 优先：模型看到的出处与访客看到的一致，title 只做内部标识
      // 必须把真实 id 一起交给模型：否则它会拿 [1][2] 的序号去调 read_source，全部查不到
      return text(
        hits
          .map(
            (h, i) =>
              `[${i + 1}] ${h.citation.origin ?? h.citation.title}（id: ${h.citation.id}）\n${h.snippet}`,
          )
          .join("\n\n"),
      );
    },
  });

  const readSource = defineTool({
    name: "read_source",
    label: "读取来源全文",
    description: "按引用 id 读取知识库某条来源的全文。",
    parameters: Type.Object({
      id: Type.String({ description: "search_knowledge 返回的引用 id" }),
    }),
    execute: async (_id: string, params: { id: string }) => {
      const doc = await knowledge.read(params.id);
      if (!doc) {
        return text(`找不到 id 为「${params.id}」的条目。id 请用 search_knowledge 结果里标注的 id，不要用序号。`);
      }
      box.emit({ type: "citation", citation: doc.citation });
      return text(`${doc.citation.origin ?? doc.citation.title}\n${doc.content}`);
    },
  });

  const searchSiteTool = defineTool({
    name: "search_site",
    label: "查网站内容",
    description:
      "在本馆网站上检索已发布的内容（园区、博物馆、史料、企业、全景、商品）与固定页面，" +
      "返回板块、标题、摘要和 route。访客问到网站上的内容、价格、库存、去哪看时用它；" +
      "跳转只能用它返回的 route。",
    parameters: Type.Object({
      query: Type.String({ description: "检索词：用户问题里的核心名词，例如「七爪化橘红」「怎么买」「企业地图」" }),
      board: Type.Optional(
        Type.String({ description: "只查某个板块：park / museum / history / product / enterprise / vr，不填查全部" }),
      ),
      limit: Type.Optional(Type.Number({ description: "返回条数，默认 5，最多 8" })),
    }),
    execute: async (_id: string, params: { query: string; board?: string; limit?: number }) => {
      const { hits, citations } = await searchSite(params);
      if (hits.length === 0) {
        return text(
          `本馆网站上没有检索到「${params.query}」相关的内容（可能还没发布）。可以换个说法，或用 search_knowledge 问化橘红的文化知识。`,
        );
      }
      for (const citation of citations) box.emit({ type: "citation", citation });
      return text(
        hits
          .map((hit, i) => {
            const extra =
              hit.priceCents === undefined
                ? ""
                : `；最低价 ${yuan(hit.priceCents)}，${hit.selling ? "在线销售中" : "不在线销售"}`;
            return `[${i + 1}] ${hit.boardName}｜${hit.title}（id: ${hit.id}）\nroute: ${hit.route}${extra}\n${hit.summary || "（无摘要）"}`;
          })
          .join("\n\n") +
          "\n\n需要正文时用 read_site_item 读全文（id 用上面的 id）。",
      );
    },
  });

  const getProductTool = defineTool({
    name: "get_product",
    label: "查商品详情",
    description:
      "按商品 id 查本馆网站上的商品：分类、简介、是否可买、不可买的原因，以及 status=on 的规格" +
      "（skuId、规格名、价格、库存）。加购前先用它拿 skuId；商品问题先 search_site 拿 id。",
    parameters: Type.Object({
      productId: Type.String({ description: "search_site 返回的商品 id，例如 CP-007" }),
    }),
    execute: async (_id: string, params: { productId: string }) => {
      const product = await getProduct(String(params.productId ?? ""));
      if (!product) {
        return text(
          `本馆网站上没有 id 为「${params.productId}」的商品（可能还没发布或已下架）。id 请用 search_site 返回的值。`,
        );
      }
      const lines = [
        `${product.title}（id: ${product.id}，分类：${product.category || "未分类"}）`,
        product.summary,
        product.purchasable ? "在线销售中，可以加入购物车。" : `不在线销售：${product.blockReason ?? "暂不可购买"}`,
        ...product.skus.map((sku) => `- ${sku.name}：${yuan(sku.priceCents)}，库存 ${sku.stock} 件，skuId=${sku.skuId}`),
      ];
      if (product.skus.length === 0) lines.push("当前没有在售规格。");
      return text(lines.filter(Boolean).join("\n"));
    },
  });
  const readSiteItemTool = defineTool({
    name: "read_site_item",
    label: "读网站正文",
    description:
      "按 search_site 返回的 id 读取本馆网站内容的正文（园区、博物馆、史料、企业、全景、商品与固定页面）。" +
      "正文一次最多 3000 字，长文用 offset 接着读。访客问具体内容、数字、人名、年份前先用它读全文。",
    parameters: Type.Object({
      id: Type.String({ description: "search_site 返回的 id：Item id 或 page: 开头的页面 id" }),
      offset: Type.Optional(
        Type.Number({ description: "正文起始字符位置，默认 0；上一段返回 nextOffset 时用它接着读" }),
      ),
    }),
    execute: async (_id: string, params: { id: string; offset?: number }) => {
      const reading = await readSiteItem(params.id, params.offset);
      if (!reading.ok) return text(reading.reason);
      box.emit({ type: "citation", citation: reading.citation });
      const head = `板块：${reading.board}\n标题：${reading.title}\nroute：${reading.route}`;
      if (reading.total === 0) {
        return text(`${head}\n\n${reading.emptyHint ?? "这一篇没有文字正文。"}`);
      }
      if (!reading.body) {
        return text(`${head}\n\n已经读到最后了（全文 ${reading.total} 字）。`);
      }
      const range = `第 ${reading.offset + 1}–${reading.offset + reading.body.length} 字，共 ${reading.total} 字`;
      const tail = reading.nextOffset === undefined ? "" : `\n\n要接着读，用 offset=${reading.nextOffset}。`;
      return text(`${head}\n正文（${range}）：\n\n${reading.body}${tail}`);
    },
  });

  const gotoPage = defineTool({
    // 同一条消息里的多个 tool_call 默认并行执行：动作类必须串行，否则上限计数与事件顺序都会失效
    executionMode: "sequential",
    name: "goto_page",
    label: "带访客跳转",
    description:
      "带访客跳到本馆网站上的某个页面或某条内容。route 必须来自 search_site 的返回，不能自己编。" +
      "一轮对话只能跳一次；跳转后不要重复调用。",
    parameters: Type.Object({
      route: Type.String({ description: "search_site 返回的 route，例如 /products/CP-007、/museum?article=BO-A01" }),
    }),
    execute: async (_id: string, params: { route: string }) => {
      if (box.counts.nav >= MAX_NAV_ACTIONS) return text(navLimitText());
      const resolved = await resolveRoute(String(params.route ?? ""));
      if (!resolved.ok) return text(resolved.reason);
      box.counts.nav += 1;
      box.emit({
        type: "action",
        action: { type: "goto_page", payload: { route: resolved.route, label: resolved.label } },
      });
      return text(`已请页面跳到《${resolved.label}》（route: ${resolved.route}），结果由页面显示。`);
    },
  });

  const cartAdd = defineTool({
    // 同一条消息里的多个 tool_call 默认并行执行：动作类必须串行，否则上限计数与事件顺序都会失效
    executionMode: "sequential",
    name: "cart_add",
    label: "加入购物车",
    description:
      "把某个规格加入访客的购物车。只在访客这一句话明确要求加购时用；你推荐商品时不要顺手加购。" +
      "skuId 只能来自 get_product 或 [当前购物车]。数量默认 1，只能是 1~10 的整数。",
    parameters: Type.Object({
      skuId: Type.String({ description: "get_product 返回的 skuId" }),
      qty: Type.Optional(Type.Number({ description: "数量，1~10 的整数，默认 1" })),
    }),
    prepareArguments: prepareQty,
    execute: async (_id: string, params: { skuId: string; qty?: number }) => {
      if (box.counts.cart >= MAX_CART_ACTIONS) return text(cartLimitText());
      const qty = params.qty ?? 1;
      if (!Number.isInteger(qty) || qty < 1 || qty > 10) return text("数量只能是 1 到 10 的整数。");
      const checked = await checkSku(String(params.skuId ?? ""));
      if (!checked.ok) return text(checked.reason);
      if (checked.stock < qty) return text(stockReason(checked.variant, checked.stock));
      box.counts.cart += 1;
      box.emit({
        type: "action",
        action: {
          type: "cart_add",
          payload: {
            skuId: checked.skuId,
            qty,
            title: checked.title,
            variant: checked.variant,
            priceCents: checked.priceCents,
          },
        },
      });
      return text(`已请页面把「${checked.title}·${checked.variant}」加入购物车 ${qty} 件，结果由页面显示。`);
    },
  });

  const cartSet = defineTool({
    // 同一条消息里的多个 tool_call 默认并行执行：动作类必须串行，否则上限计数与事件顺序都会失效
    executionMode: "sequential",
    name: "cart_set",
    label: "改购物车数量",
    description:
      "把购物车里某个规格的数量改成指定值。只在访客明确要求改数量时用（如「改成三件」）。" +
      "skuId 只能来自 get_product 或 [当前购物车]。数量只能是 1~10 的整数。",
    parameters: Type.Object({
      skuId: Type.String({ description: "get_product 或 [当前购物车] 里的 skuId" }),
      qty: Type.Number({ description: "改成几件，1~10 的整数" }),
    }),
    prepareArguments: prepareQty,
    execute: async (_id: string, params: { skuId: string; qty: number }) => {
      if (box.counts.cart >= MAX_CART_ACTIONS) return text(cartLimitText());
      const qty = params.qty;
      if (!Number.isInteger(qty) || qty < 1 || qty > 10) return text("数量只能是 1 到 10 的整数。");
      const checked = await checkSku(String(params.skuId ?? ""));
      if (!checked.ok) return text(checked.reason);
      if (checked.stock < qty) return text(stockReason(checked.variant, checked.stock));
      box.counts.cart += 1;
      box.emit({
        type: "action",
        action: {
          type: "cart_set",
          payload: { skuId: checked.skuId, qty, title: checked.title, variant: checked.variant },
        },
      });
      return text(`已请页面把「${checked.title}·${checked.variant}」的数量改成 ${qty} 件，结果由页面显示。`);
    },
  });

  const cartRemove = defineTool({
    // 同一条消息里的多个 tool_call 默认并行执行：动作类必须串行，否则上限计数与事件顺序都会失效
    executionMode: "sequential",
    name: "cart_remove",
    label: "移除购物车商品",
    description:
      "把购物车里的某个规格移出去。只在访客明确要求删除时用。skuId 只能来自 get_product 或 [当前购物车]。",
    parameters: Type.Object({
      skuId: Type.String({ description: "get_product 或 [当前购物车] 里的 skuId" }),
    }),
    execute: async (_id: string, params: { skuId: string }) => {
      if (box.counts.cart >= MAX_CART_ACTIONS) return text(cartLimitText());
      const found = await skuForRemove(String(params.skuId ?? ""));
      if (!found.ok) return text(found.reason);
      box.counts.cart += 1;
      box.emit({
        type: "action",
        action: { type: "cart_remove", payload: { skuId: found.skuId, title: found.title, variant: found.variant } },
      });
      return text(`已请页面把「${found.title}·${found.variant}」从购物车里移除，结果由页面显示。`);
    },
  });

  const gotoCheckout = defineTool({
    // 同一条消息里的多个 tool_call 默认并行执行：动作类必须串行，否则上限计数与事件顺序都会失效
    executionMode: "sequential",
    name: "goto_checkout",
    label: "去结算",
    description: "带访客去结算页确认订单。订单要访客自己在页面上提交，你不能替他提交。",
    parameters: Type.Object({}),
    execute: async () => {
      if (box.counts.nav >= MAX_NAV_ACTIONS) return text(navLimitText());
      box.counts.nav += 1;
      box.emit({ type: "action", action: { type: "goto_checkout", payload: {} } });
      return text("已请页面打开结算页，结果由页面显示；购物车是空的时页面会提示。订单要由访客自己确认提交。");
    },
  });

  const gotoPay = defineTool({
    // 同一条消息里的多个 tool_call 默认并行执行：动作类必须串行，否则上限计数与事件顺序都会失效
    executionMode: "sequential",
    name: "goto_pay",
    label: "去付款",
    description:
      "带访客去付款页。只在访客要付款、且 [待付款订单] 有 1 笔以上（或 [待付款订单] 未知）时用；" +
      "购物车有商品但还没有订单时先用 goto_checkout，让访客在结算页提交订单。付款要访客自己点，你不能替他付。",
    parameters: Type.Object({}),
    execute: async () => {
      if (box.counts.nav >= MAX_NAV_ACTIONS) return text(navLimitText());
      box.counts.nav += 1;
      box.emit({ type: "action", action: { type: "goto_pay", payload: {} } });
      return text(
        "已请页面处理。有一笔待付款订单会打开付款页，有多笔会打开订单列表，没有订单会打开结算页或提示访客。" +
          "你不知道实际去了哪一页，不要说已经到了；付款要由访客自己点。",
      );
    },
  });

  const tools = [
    searchKnowledge,
    readSource,
    searchSiteTool,
    readSiteItemTool,
    getProductTool,
    gotoPage,
    cartAdd,
    cartSet,
    cartRemove,
    gotoCheckout,
    gotoPay,
  ];

  // G1：单轮工具调用总量封顶。包里每个工具自己的上限（购物车 5 / 跳转 1）不动，
  // 这里只在总数上再加一道闸：第 13 次起一律不执行。
  return tools.map((tool) => ({
    ...tool,
    execute: async (...args: unknown[]) => {
      box.counts.total += 1;
      if (box.counts.total > MAX_TOOL_CALLS_PER_TURN) return text(toolLimitText());
      return (tool.execute as (...inner: unknown[]) => unknown)(...args);
    },
  })) as typeof tools;
}

export type { Citation };
