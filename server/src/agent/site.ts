// 网站内容层：讲解员查站点（实时读库）+ route 规则/白名单 + 商品与规格校验。
// 约定：
// - 只读已发布内容（Item.status = published），从不读 draftJson；
// - route 规则必须和前端路由表一致（园区栏目锚点同 site/src/data/park.ts 的 parkAnchorOf）；
// - 后台改完内容立即生效——这里每次都直接查库，不做缓存。
import { prisma } from "../db.ts";
import type { Citation } from "../contract.ts";

/** 板块：search_site 的 board 取值与 citation 的 origin 都用这一份 */
export const BOARD_NAMES: Record<string, string> = {
  park: "园区",
  museum: "博物馆",
  history: "史料",
  product: "商品",
  enterprise: "企业",
  vr: "VR全景",
};

export const SEARCH_BOARDS = Object.keys(BOARD_NAMES);

/** 园区栏目锚点：'yq-' + 去掉 YQ- 前缀的小写 id（同 site/src/data/park.ts:29） */
export function parkAnchorOf(id: string): string {
  return "yq-" + id.replace(/^YQ-/i, "").toLowerCase();
}

/**
 * 单条内容的 route（与前端路由表一一对应）。
 * groupPage 只对 board=vr 有意义：所在 VR 分组属于博物馆页时，场景挂在 /museum 上（前端按 /api/content/vr 的 VR-xxx 找场景）。
 */
export function routeOfItem(
  item: { id: string; board: string; type: string; parentId?: string | null },
  groupPage?: string,
): string {
  switch (item.board) {
    case "park":
      if (item.type === "column") return `/park#${parkAnchorOf(item.id)}`;
      if (item.type === "VR场景") return "/park";
      return item.parentId ? `/park#${parkAnchorOf(item.parentId)}` : "/park";
    case "museum":
      return item.type === "VR场景" ? `/museum?scene=${item.id}` : `/museum?article=${item.id}`;
    case "enterprise":
      return `/enterprises?id=${item.id}`;
    case "vr":
      return groupPage === "museum" ? `/museum?scene=${item.id}` : `/vr?scene=${item.id}`;
    case "history":
      return `/history/${item.id}`;
    case "product":
      return `/products/${item.id}`;
    default:
      return "/";
  }
}

const pageBody = (...lines: string[]) => lines.join("\n");

export interface StaticPage {
  /** Item 里没有这些页面，用固定 id 参与检索与 citation */
  id: string;
  board: string;
  title: string;
  route: string;
  note: string;
  keywords: string[];
  /** 页面上显示的正文，照抄 site/ 源码；页面上没有正文的留空 */
  body: string;
  /** 页头存在 Setting page.<board> 时，读取正文时实时拼进来（后台一改就生效） */
  headBoard?: "park" | "museum" | "history";
  /** 后台没有页头时，页面上显示的默认页头 */
  headFallback?: string;
}

/** 写死的页面清单：Item 里没有，但要能被 search_site 搜到 */
export const STATIC_PAGES: StaticPage[] = [
  {
    id: "page:/",
    board: "序厅",
    title: "序厅",
    route: "/",
    note: "展馆首页，方志引文与总述。",
    keywords: ["序厅", "首页", "主页", "入口"],
    body: pageBody(
      "中国 · 广东 · 化州",
      "化州橘红 博览馆",
      "化橘红，取化州长绒毛柚的幼果外层果皮制成。",
      "相传南朝宋时，罗辨仙人在州署一带种橘，救治病人。",
      "",
      "来历｜明万历年间，方志首次记载",
      "「化州橘红为化州独有」 明万历（约 1600）《高州府志》",
      "「灵奇珍异」 清康熙十四年（1675）《广东通志》",
      "「惟橘红最为佳品」 清乾隆十三年（1748）《化州志》",
      "",
      "清光绪十四年（1888），彭以孙《化州志》",
      "化州橘红，治痰症如神，每片真者值一金，每年结实，循例报明上官，至期采摘批制，即官斯土者亦不易得。",
      "周、潘、李、苏、赖五大橘红园都在化州城内。清代中叶，面积三百余亩。",
      "",
      "1949 年 三十余亩",
      "战乱，加上当局只顾索取、不问生产，园圃退为残株。",
      "",
      "恢复｜从三十余亩到 14.3 万亩",
      "1950 年代政府拨款复苏旧园。1962 年成立县橘红生产办公室，委托药材公司统管。",
      "1949 30 余亩",
      "1970 年代初 3000 余亩",
      "1985 8500 亩",
      "2005 前后 3 万余亩",
      "2026 14.3 万亩（年产鲜果 7.6 万吨）",
      "柱高按对数示意",
      "",
      "2006 国家地理标志产品",
      "2012 广东省省级非遗",
      "2024 食药物质目录",
      "2026 中国重要农业文化遗产",
      "",
      "入馆｜参观路线：五个展厅",
      "壹 园区 6 栏图文 · 36 个全景",
      "贰 博物馆 馆内 8 场景 · 车间 3 场景",
      "叁 工艺 4 种古法做法 · 5 台机器",
      "肆 企业地图 12 个镇街 · 34 家企业",
      "伍 产品中心 六类产品",
      "",
      "一果多形",
      "毛橘红 果面密被绒毛",
      "七爪橘红 割七刀，压制成形",
      "橘红胎 幼果整果干燥",
      "陈年橘红 存放三年以上",
    ),
  },
  {
    id: "page:/park",
    board: "园区",
    title: "园区",
    route: "/park",
    note: "产业园区总览与各栏目。",
    keywords: ["园区", "产业园", "产业园区"],
    body: "",
    headBoard: "park",
    headFallback: pageBody(
      "园区展示",
      "化橘红产业园，2022 年园内种植面积 10.2 万亩，占全市 90.2% 以上。",
      "10.2 万亩 园区种植面积 · 2022",
      "79.29 亿元 园区化橘红总产值 · 2022",
      "30 万人 直接带动种植的农民",
      "36 个 园区全景场景 · 五处基地",
    ),
  },
  {
    id: "page:/museum",
    board: "博物馆",
    title: "博物馆",
    route: "/museum",
    note: "博物馆全景与采风文章。",
    keywords: ["博物馆", "展馆", "展陈"],
    body: pageBody(
      "2024 年获评茂名市社会科学普及基地。2026 年 10 月，化州化橘红博览馆文化旅游景区获批国家 3A 级。",
    ),
    headBoard: "museum",
    headFallback: pageBody(
      "博物馆",
      "正门大堂、博物馆 1 到 6、橘香体验馆，共 8 个全景场景。",
      "8 个 馆内全景场景",
      "3 个 配套生产车间场景",
      "4 篇 博览馆相关文章",
      "3A 级 国家旅游景区 · 2026 年获批",
    ),
  },
  {
    id: "page:/craft",
    board: "工艺",
    title: "工艺",
    route: "/craft",
    note: "古法炮制与现代机器工艺。",
    keywords: ["工艺", "古法", "炮制", "制作"],
    body: pageBody(
      "4 种 古法做法",
      "5 台 现代机器",
      "13 道 现代工序",
      "100 → 约 4 斤 鲜果 → 七爪干皮",
      "",
      "七爪橘红 · 一句古法，从青果到成品",
      "割七瓣、刮白瓤、晒干，润透后整片对折压平，再焙，十片一扎。",
      "柚类橘红系将未成熟的果实，先投入沸水中，即捞出，将果皮割成7瓣，出去果瓤及内面部分白色的中果皮后晒干或焙干，再以水润透，对折以木板压平，再焙干即得。",
      "——《中国药典》1963 年版一部\"橘红\"",
      "其一 · 青果",
      "其二 · 烫果",
      "其三 · 割皮去瓤",
      "其四 · 晒干",
      "其五 · 润、折、压",
      "其六 · 再焙",
      "十片一扎 十片一扎，红头绳捆好。",
      "",
      "大五爪 · 五瓣的橘红：瓣尖折回、对折压平",
      "割五瓣、刮白瓤、晒干，润透后瓣尖折回一点再对折压平，十片一扎。",
      "柚类橘红系将未成熟的果实，先投入沸水中，即捞出，将果皮割成7瓣，出去果瓤及内面部分白色的中果皮后晒干或焙干，再以水润透，对折以木板压平，再焙干即得。",
      "——《中国药典》1963 年版一部\"橘红\"",
      "其一 · 青果",
      "其二 · 烫果",
      "其三 · 割皮去瓤",
      "其四 · 晒干",
      "其五 · 润、折、压",
      "其六 · 再焙",
      "十片一扎 十片一扎，红头绳捆好，叫大五爪。",
      "",
      "压果片 · 整果压扁、入筒、切片",
      "整果烘软，压成椭圆，套进竹筒烘干，切成圆片，装瓶。",
      "夏季采摘未成熟的果实，置沸水中略烫后，焙干，压制成形，干燥。每片真者可值一金。置阴凉干燥处，防潮及虫蛀。",
      "——集《中国药典》《岭南杂记》句",
      "其一 · 青果 挑四两半以上的大果。",
      "其二 · 烫果 大果整个烫过。",
      "其三 · 初烘 小火烘软，缩小一大半。",
      "其四 · 压果 木压果器压成椭圆。",
      "其五 · 入筒烘干 套进竹筒定型，上焙炉烘干。",
      "其六 · 切片 切成两到四毫米的圆片。",
      "装瓶 一簸箕圆片，倒进瓶里。",
      "",
      "橘红胎 · 小果整个烘，不割不压",
      "疏下来的小果，不割不压，一半烫过、一半直接，整个烘干。",
      "正毛橘红胎呈圆球形或近似圆球柱形，直径约1～5厘米，表面青褐色或黄棕色，披白色密绒毛，果蒂明显，顶部稍凹，质地干燥坚实，不易剖开。系整果不割不压，经沸水烫后烘干或直接烘干即得。",
      "——《化州县志》第六篇",
      "其一 · 青果",
      "其二 · 烫果 一半烫过再烘，一半直接烘。",
      "其三 · 连烘几天 表面青褐色或黄棕色，披白色密绒毛，果蒂明显，顶部稍凹，质地干燥坚实，不易剖开。",
      "一罐橘红胎 不割、不压，整个烘干就成了。",
    ),
  },
  {
    id: "page:/craft#machines",
    board: "工艺",
    title: "现代机器",
    route: "/craft#machines",
    note: "现代加工机器一栏。",
    keywords: ["现代机器", "机器", "设备", "机械"],
    body: pageBody(
      "五台现代机器",
      "割瓣 · 七爪等分切瓣机",
      "单刀，果每转 1/7 圈切一刀，七次成七爪。现场割瓣仍是 8–10 人围桌手工。",
      "去瓤 · 旋挖去囊机",
      "旋转刀杆带两把弹性刀片，挖去果瓤。尚未商品化，只有样机与专利。",
      "压果 · 化橘红压果机",
      "垂直缸把圆果压扁，水平缸推入后模，压成圆柱。",
      "烘干 · 智能烘房",
      "七爪果皮 45→70℃ 分段烘干，约 22 小时。整果约 4 天一批。",
      "切片 · 压果切片机",
      "气缸压料，单把旋刀切片。",
    ),
  },
  {
    id: "page:/craft#machine-qizhua",
    board: "工艺",
    title: "七爪等分切瓣机",
    route: "/craft#machine-qizhua",
    note: "割瓣 · 单刀，果每转 1/7 圈切一刀，七次成七爪。现场割瓣仍是 8–10 人围桌手工。",
    keywords: ["七爪机", "切瓣机", "七爪等分切瓣机", "割瓣"],
    body: "单刀，果每转 1/7 圈切一刀，七次成七爪。现场割瓣仍是 8–10 人围桌手工。",
  },
  {
    id: "page:/craft#machine-qunang",
    board: "工艺",
    title: "旋挖去囊机",
    route: "/craft#machine-qunang",
    note: "去瓤 · 旋转刀杆带两把弹性刀片，挖去果瓤。尚未商品化，只有样机与专利。",
    keywords: ["旋挖去囊机", "去囊机", "去瓤"],
    body: "旋转刀杆带两把弹性刀片，挖去果瓤。尚未商品化，只有样机与专利。",
  },
  {
    id: "page:/craft#machine-yaguo",
    board: "工艺",
    title: "化橘红压果机",
    route: "/craft#machine-yaguo",
    note: "压果 · 垂直缸把圆果压扁，水平缸推入后模，压成圆柱。",
    keywords: ["压果机", "化橘红压果机", "压果"],
    body: "垂直缸把圆果压扁，水平缸推入后模，压成圆柱。",
  },
  {
    id: "page:/craft#machine-hongfang",
    board: "工艺",
    title: "智能烘房",
    route: "/craft#machine-hongfang",
    note: "烘干 · 七爪果皮 45→70℃ 分段烘干，约 22 小时。整果约 4 天一批。",
    keywords: ["智能烘房", "烘房", "烘干房", "烘干"],
    body: "七爪果皮 45→70℃ 分段烘干，约 22 小时。整果约 4 天一批。",
  },
  {
    id: "page:/craft#machine-qiepian",
    board: "工艺",
    title: "压果切片机",
    route: "/craft#machine-qiepian",
    note: "切片 · 气缸压料，单把旋刀切片。",
    keywords: ["切片机", "压果切片机", "切片"],
    body: "气缸压料，单把旋刀切片。",
  },
  {
    id: "page:/enterprises",
    board: "企业",
    title: "企业地图",
    route: "/enterprises",
    note: "化橘红企业地图。",
    keywords: ["企业", "厂家", "公司", "地图"],
    body: "",
  },
  {
    id: "page:/vr",
    board: "VR全景",
    title: "VR 全景",
    route: "/vr",
    note: "园区与博物馆的 VR 全景。",
    keywords: ["VR", "vr", "全景", "三维", "虚拟"],
    body: "",
  },
  {
    id: "page:/history",
    board: "史料",
    title: "史料区",
    route: "/history",
    note: "化橘红史料与文献。",
    keywords: ["史料", "文献", "资料", "历史资料"],
    body: "",
    headBoard: "history",
  },
  {
    id: "page:/products",
    board: "商品",
    title: "产品中心",
    route: "/products",
    note: "在售商品列表。",
    keywords: ["产品", "商品", "选购", "怎么买", "购买", "买", "下单"],
    body: pageBody(
      "产品中心",
      "干果、成药、制剂、饮品、食品、工艺品，六类 21 件。",
      "成药与制剂按药品管理，不在线销售。",
    ),
  },
  { id: "page:/cart", board: "商品", title: "购物车", route: "/cart", note: "购物车页面，可改数量、去结算。", keywords: ["购物车", "加购", "结算"], body: "" },
  { id: "page:/orders", board: "商品", title: "我的订单", route: "/orders", note: "订单列表与待付款订单。", keywords: ["订单", "待付款", "我的订单"], body: "" },
  { id: "page:/account", board: "商品", title: "账户", route: "/account", note: "账户与收货地址。", keywords: ["账户", "账号", "个人中心", "地址"], body: "" },
];

const STATIC_BY_ROUTE = new Map(STATIC_PAGES.map((page) => [page.route, page]));

/* ── 读网站正文 ───────────────────────────────────────── */

/** 正文一次最多返回的字数；更长的用 offset 接着读 */
const READ_CHUNK = 3000;

interface PageHeadView {
  title: string;
  intro: string;
  stats: { value: string; unit: string; label: string }[];
}

/** 后台可改的页头：Setting page.<board>，坏数据当没有 */
async function readPageHead(board: string): Promise<PageHeadView | null> {
  const row = await prisma.setting.findUnique({ where: { key: `page.${board}` } });
  if (!row) return null;
  try {
    const value = JSON.parse(row.value) as any;
    if (!value || typeof value !== "object" || typeof value.title !== "string" || !value.title.trim()) return null;
    const stats = Array.isArray(value.stats)
      ? value.stats
          .filter((one: any) => one && typeof one === "object")
          .map((one: any) => ({
            value: typeof one.value === "string" ? one.value : "",
            unit: typeof one.unit === "string" ? one.unit : "",
            label: typeof one.label === "string" ? one.label : "",
          }))
      : [];
    return { title: value.title, intro: typeof value.intro === "string" ? value.intro : "", stats };
  } catch {
    return null;
  }
}

function headText(head: PageHeadView): string {
  return [
    head.title,
    head.intro,
    ...head.stats.map((one) => [[one.value, one.unit].filter(Boolean).join(" "), one.label].filter(Boolean).join(" ")),
  ]
    .filter((one) => one.trim())
    .join("\n");
}

/** 序厅页面上的两组实时数字（页面上由接口数据算出，抄死会跟页面漂开） */
async function homeLiveText(): Promise<string> {
  const [archiveCount, sceneCount] = await Promise.all([
    prisma.item.count({ where: { board: "history", status: { not: "archived" } } }),
    prisma.vrScene.count(),
  ]);
  return pageBody(`史料 ${archiveCount} 篇`, `VR 全景 ${sceneCount} 个场景`);
}

/** 写死页面的正文：静态原文 + 后台页头（有就用后台的，没有用页面默认的） */
async function staticPageContent(page: StaticPage): Promise<string> {
  const head = page.headBoard ? await readPageHead(page.headBoard) : null;
  const live = page.id === "page:/" ? await homeLiveText() : "";
  return [page.body, live, head ? headText(head) : (page.headFallback ?? "")]
    .filter((one) => one.trim())
    .join("\n\n");
}

export interface SiteReadOk {
  ok: true;
  id: string;
  board: string;
  title: string;
  route: string;
  /** 本次返回的正文片段 */
  body: string;
  /** 全文总字数 */
  total: number;
  /** 本次片段的起始位置 */
  offset: number;
  /** 还有下文时给出下一次的 offset */
  nextOffset?: number;
  /** 正文为空时给模型的说明（图片/视频、全景场景等） */
  emptyHint?: string;
  citation: Citation;
}

export interface SiteReadFail {
  ok: false;
  reason: string;
}

export type SiteReadResult = SiteReadOk | SiteReadFail;

function missingReading(id: string): SiteReadFail {
  const shown = id.length > 60 ? `${id.slice(0, 60)}…` : id;
  return { ok: false, reason: `本馆网站上没有 id 为「${shown}」的内容（可能不存在或还没发布）。id 请用 search_site 返回的值。` };
}

function chunkReading(input: {
  id: string;
  board: string;
  title: string;
  route: string;
  body: string;
  offset: number;
  emptyHint: string;
}): SiteReadOk {
  const total = input.body.length;
  const start = Math.min(input.offset, total);
  const slice = input.body.slice(start, start + READ_CHUNK);
  const nextOffset = start + READ_CHUNK < total ? start + READ_CHUNK : undefined;
  return {
    ok: true,
    id: input.id,
    board: input.board,
    title: input.title,
    route: input.route,
    body: slice,
    total,
    offset: start,
    nextOffset,
    emptyHint: total === 0 ? input.emptyHint : undefined,
    citation: { id: input.id, title: input.title, source: "本馆网站", origin: `本馆网站·${input.board}` },
  };
}

/**
 * 按 search_site 的 id 读正文：Item 只读已发布、不是旧副本的条目，从不读 draftJson；
 * page: 开头的是写死页面，页头每次从 Setting 现读，后台改完立即生效。
 */
export async function readSiteItem(rawId: unknown, rawOffset?: unknown): Promise<SiteReadResult> {
  const id = typeof rawId === "string" ? rawId.trim() : "";
  if (!id) return { ok: false, reason: "请给出 search_site 返回的 id（页面 id 以 page: 开头）。" };
  const offset =
    typeof rawOffset === "number" && Number.isFinite(rawOffset) && rawOffset > 0 ? Math.floor(rawOffset) : 0;

  const page = STATIC_PAGES.find((one) => one.id === id);
  if (page) {
    return chunkReading({
      id: page.id,
      board: page.board,
      title: page.title,
      route: page.route,
      body: await staticPageContent(page),
      offset,
      emptyHint: "这一页没有可读的正文文字。",
    });
  }

  if (id.length > 200) return missingReading(id);
  const item = await prisma.item.findUnique({
    where: { id },
    select: { id: true, board: true, type: true, status: true, title: true, body: true },
  });
  if (!item || !SEARCH_BOARDS.includes(item.board)) return missingReading(id);
  if (item.status !== "published" || isLegacyScene(item)) return missingReading(id);

  const groupPage = item.board === "vr" ? (await vrGroupPages()).get(item.id) : undefined;
  const scene = item.board === "vr" || item.type === "VR场景";
  return chunkReading({
    id: item.id,
    board: boardNameOf(item, groupPage),
    title: item.title,
    route: routeOfItem(item, groupPage),
    body: item.body ?? "",
    offset,
    emptyHint: scene ? "这是全景场景，没有文字介绍。" : "这一篇只有图片或视频，没有文字正文。",
  });
}

/* ── 检索 ─────────────────────────────────────────────── */

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[\s，。？！、；：,.!?;:~～"'“”‘’()（）【】\[\]《》<>·—\-_/\\|]/g, "");
}

/** 同一套去标点规则的单字符版，用来在原文里定位命中位置 */
const DROP_ONE = /[\s，。？！、；：,.!?;:~～"'“”‘’()（）【】\[\]《》<>·—\-_/\\|]/;

/** 正文归一化之后 full 第一次出现的位置，映射回原文下标；找不到返回 -1 */
function normalizedIndexOf(text: string, full: string): number {
  let normalized = "";
  const positions: number[] = [];
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i].toLowerCase();
    if (DROP_ONE.test(ch)) continue;
    normalized += ch;
    positions.push(i);
  }
  const at = normalized.indexOf(full);
  return at < 0 ? -1 : positions[at];
}

/** 命中在正文里且离开头超过 120 字时，取命中词附近的一段（≤120 字） */
function bodySnippet(body: string | null | undefined, full: string): string | null {
  if (!body || full.length < 2) return null;
  const text = body.replace(/\s+/g, " ").trim();
  const index = normalizedIndexOf(text, full);
  if (index < 120) return null;
  const start = Math.max(0, index - 40);
  const lead = start > 0 ? "…" : "";
  const tail = start + 120 < text.length ? "…" : "";
  const out = text.slice(start, start + 120 - lead.length - tail.length);
  return `${lead}${out}${tail}`;
}

/** 中文无分词：完整片段 + 二字/三字词元（同 jsonProvider 的检索思路） */
function termsOf(query: string): { full: string; grams: string[] } {
  const full = normalize(query);
  const grams = new Set<string>();
  for (let i = 0; i < full.length - 1; i += 1) {
    grams.add(full.slice(i, i + 2));
    if (i < full.length - 2) grams.add(full.slice(i, i + 3));
  }
  return { full, grams: [...grams] };
}

interface FieldWeights {
  full: number;
  gram: number;
}

function fieldScore(text: string | null | undefined, full: string, grams: string[], weight: FieldWeights): number {
  if (!text) return 0;
  const t = normalize(text);
  if (!t) return 0;
  let score = 0;
  if (full.length >= 2 && t.includes(full)) score += weight.full;
  for (const gram of grams) if (t.includes(gram)) score += weight.gram;
  return score;
}

/** 查询片段是否原样出现在字段里（>=2 字才算，单字靠关键词规则） */
function hasFull(text: string | null | undefined, full: string): boolean {
  if (full.length < 2 || !text) return false;
  return normalize(text).includes(full);
}

const PRICE_HINT = /多少|价格|价钱|价位|元|贵|便宜|买|购|库存|有货|下单|结算|付款|支付/;

/** 摘要：优先 Item.summary / labelJson.summary，其次正文首段；统一截到 120 字 */
function summaryOf(item: { summary?: string | null; body?: string | null; labelJson?: string | null }): string {
  let text = (item.summary ?? "").trim();
  if (!text && item.labelJson) {
    try {
      const parsed = JSON.parse(item.labelJson) as { summary?: unknown };
      if (typeof parsed?.summary === "string") text = parsed.summary.trim();
    } catch {
      /* 旧数据可能不是合法 JSON */
    }
  }
  if (!text && item.body) {
    text = (item.body.split(/\n{2,}/).map((one) => one.trim()).find(Boolean) ?? "")
      .replace(/^[#>\-*\s`]+/, "")
      .replace(/\s+/g, " ")
      .trim();
  }
  return text.length > 120 ? `${text.slice(0, 120)}…` : text;
}

function firstParagraph(text: string | null | undefined): string {
  if (!text) return "";
  return (
    text
      .split(/\n{2,}/)
      .map((one) => one.trim())
      .find(Boolean) ?? ""
  )
    .replace(/^[#>\-*\s`]+/, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * VR 场景 → 所在分组的 page（museum / park）。读法与 /api/content/vr 一致：
 * VrScene.groupId → VrGroup.page；没有分组归属的返回 undefined（按园区侧处理）。
 */
async function vrGroupPages(): Promise<Map<string, string>> {
  const [groups, scenes] = await Promise.all([
    prisma.vrGroup.findMany({ select: { id: true, page: true } }),
    prisma.vrScene.findMany({ select: { id: true, groupId: true } }),
  ]);
  const pageById = new Map(groups.map((group) => [group.id, group.page]));
  const out = new Map<string, string>();
  for (const scene of scenes) {
    const page = scene.groupId ? pageById.get(scene.groupId) : undefined;
    if (page) out.set(scene.id, page);
  }
  return out;
}

/** board=museum / park 里的 VR场景 是旧副本（页面只用 /api/content/vr 的 VR-xxx），任何检索都不返回 */
function isLegacyScene(item: { board: string; type: string }): boolean {
  return (item.board === "museum" || item.board === "park") && item.type === "VR场景";
}

/** VR 场景在 search_site 里算哪个板块：分组属于博物馆页就算博物馆，其余算 VR 全景 */
function boardNameOf(item: { board: string }, groupPage?: string): string {
  if (item.board === "vr" && groupPage === "museum") return BOARD_NAMES.museum;
  return BOARD_NAMES[item.board] ?? item.board;
}

/** board 参数到的板块是否包含这条内容（VR 场景按分组归属算板块） */
function inBoard(item: { board: string; type: string }, board: string | undefined, groupPage?: string): boolean {
  if (!board) return true;
  if (board === "museum") {
    return item.board === "museum" || (item.board === "vr" && groupPage === "museum");
  }
  if (board === "vr") {
    return item.board === "vr" && groupPage !== "museum";
  }
  return item.board === board;
}

export interface SiteHit {
  id: string;
  board: string;
  boardName: string;
  title: string;
  summary: string;
  route: string;
  /** 商品才有：最低价（分）与是否在线销售 */
  priceCents?: number;
  selling?: boolean;
}

export interface SearchSiteResult {
  hits: SiteHit[];
  citations: Citation[];
}

/** 命中门槛：至少一个二字/三字词元落在标题里，或整段查询原样出现——避免无关问题被正文碎片拉到 */
const MIN_SCORE = 2.5;

const ITEM_SELECT = {
  id: true,
  board: true,
  type: true,
  title: true,
  subtitle: true,
  section: true,
  summary: true,
  body: true,
  labelJson: true,
  parentId: true,
} as const;

/**
 * 商品板块的最低在线价与是否在售：一次批量取，避免逐条查库。
 * 口径与前台 productView 一致：可下单规格优先，没有可下单规格时用 status=on 的规格算最低价。
 */
async function productFacts(ids: string[]): Promise<Map<string, { priceCents: number; selling: boolean }>> {
  const out = new Map<string, { priceCents: number; selling: boolean }>();
  if (ids.length === 0) return out;
  const skus = await prisma.productSku.findMany({ where: { itemId: { in: ids } } });
  const byItem = new Map<string, typeof skus>();
  for (const sku of skus) {
    const list = byItem.get(sku.itemId) ?? [];
    list.push(sku);
    byItem.set(sku.itemId, list);
  }
  for (const [itemId, list] of byItem) {
    const onShelf = list.filter((sku) => sku.status === "on");
    const selling = onShelf.filter((sku) => sku.purchasable);
    const priced = selling.length > 0 ? selling : onShelf;
    if (priced.length === 0) continue;
    out.set(itemId, {
      priceCents: Math.min(...priced.map((sku) => sku.priceCents)),
      selling: selling.length > 0,
    });
  }
  return out;
}

export async function searchSite(input: { query: string; board?: string; limit?: number }): Promise<SearchSiteResult> {
  const query = (input.query ?? "").trim();
  const limit = Math.min(Math.max(Math.trunc(input.limit ?? 5) || 5, 1), 8);
  const board = input.board && SEARCH_BOARDS.includes(input.board) ? input.board : undefined;
  if (!query) return { hits: [], citations: [] };

  const { full, grams } = termsOf(query);
  // museum 板块要连同「分组属于博物馆页的 VR 场景」一起查（它们存在 board=vr 里）
  const dbBoards = board === "museum" ? ["museum", "vr"] : board ? [board] : undefined;
  const rows = await prisma.item.findMany({
    where: { status: "published", ...(dbBoards ? { board: { in: dbBoards } } : {}) },
    select: ITEM_SELECT,
  });
  const groupPages = await vrGroupPages();
  const items = rows.filter(
    (item) => !isLegacyScene(item) && inBoard(item, board, groupPages.get(item.id)),
  );

  const productIds = items.filter((item) => item.board === "product").map((item) => item.id);
  const facts = await productFacts(productIds);

  const priceHint = PRICE_HINT.test(query);
  const scored: { score: number; hit: SiteHit }[] = [];

  for (const item of items) {
    const groupPage = groupPages.get(item.id);
    const boardName = boardNameOf(item, groupPage);
    let score =
      fieldScore(item.title, full, grams, { full: 10, gram: 2.5 }) +
      fieldScore(item.subtitle, full, grams, { full: 5, gram: 1.5 }) +
      fieldScore(item.section, full, grams, { full: 5, gram: 1.5 }) +
      fieldScore(item.summary, full, grams, { full: 5, gram: 1.5 }) +
      fieldScore(item.body, full, grams, { full: 2, gram: 0.5 });
    // 问价格/库存这类只可能是商品的话题时，给商品一点权重，别被同名的文章压过去
    if (priceHint && item.board === "product") score += 3;
    score += fieldScore(item.id, full, grams, { full: 2, gram: 0.5 });
    const fullIn = [item.title, item.subtitle, item.section, item.summary, item.body].some((one) => hasFull(one, full));
    if (score < MIN_SCORE && !fullIn) continue;
    const snippet = bodySnippet(item.body, full);
    const hit: SiteHit = {
      id: item.id,
      board: item.board,
      boardName,
      title: item.title,
      summary: snippet && !hasFull(item.summary, full) ? snippet : summaryOf(item),
      route: routeOfItem(item, groupPage),
    };
    if (item.board === "product") {
      const fact = facts.get(item.id);
      if (fact) {
        hit.priceCents = fact.priceCents;
        hit.selling = fact.selling;
      }
    }
    scored.push({ score, hit });
  }

  for (const page of STATIC_PAGES) {
    if (board && page.board !== BOARD_NAMES[board]) continue;
    let score =
      fieldScore(page.title, full, grams, { full: 10, gram: 2.5 }) +
      fieldScore(page.note, full, grams, { full: 5, gram: 1.5 }) +
      fieldScore(page.body, full, grams, { full: 2, gram: 0.5 });
    for (const keyword of page.keywords) if (full.length > 0 && full.includes(normalize(keyword))) score += 6;
    if (priceHint && (page.route === "/products" || page.route === "/cart")) score += 3;
    const fullIn = hasFull(page.title, full) || hasFull(page.note, full) || hasFull(page.body, full);
    if (score < MIN_SCORE && !fullIn) continue;
    scored.push({
      score,
      hit: {
        id: page.id,
        board: page.board,
        boardName: page.board,
        title: page.title,
        summary: bodySnippet(page.body, full) ?? page.note,
        route: page.route,
      },
    });
  }

  scored.sort((a, b) => b.score - a.score || a.hit.title.localeCompare(b.hit.title, "zh"));
  const hits = scored.slice(0, limit).map((one) => one.hit);
  const citations: Citation[] = hits.map((hit) => ({
    id: hit.id,
    title: hit.title,
    source: "本馆网站",
    origin: `本馆网站·${hit.boardName}`,
  }));
  return { hits, citations };
}

/* ── 商品 ─────────────────────────────────────────────── */

export interface SkuView {
  skuId: string;
  name: string;
  priceCents: number;
  stock: number;
}

export interface ProductDetail {
  id: string;
  title: string;
  category: string;
  summary: string;
  purchasable: boolean;
  blockReason: string | null;
  skus: SkuView[];
  route: string;
}

/** 商品详情：不存在或未发布返回 null；规格只给 status=on 的 */
export async function getProduct(productId: string): Promise<ProductDetail | null> {
  const item = await prisma.item.findUnique({ where: { id: productId }, include: { product: true } });
  if (!item || item.board !== "product" || item.status !== "published") return null;
  const skus = await prisma.productSku.findMany({ where: { itemId: item.id }, orderBy: { sort: "asc" } });
  const onShelf = skus.filter((sku) => sku.status === "on");
  const selling = onShelf.filter((sku) => sku.purchasable);
  const purchasable = selling.length > 0;
  return {
    id: item.id,
    title: item.title,
    category: item.product?.category ?? item.section ?? "",
    summary: summaryOf(item) || firstParagraph(item.body),
    purchasable,
    blockReason: purchasable ? null : "药品类商品仅作展陈，不在线销售。",
    skus: onShelf.map((sku) => ({ skuId: sku.id, name: sku.variantName, priceCents: sku.priceCents, stock: sku.stock })),
    route: routeOfItem(item),
  };
}

export interface SkuCheckOk {
  ok: true;
  skuId: string;
  variant: string;
  title: string;
  priceCents: number;
  stock: number;
}
export interface SkuCheckFail {
  ok: false;
  reason: string;
}

/** 购物车动作的规格校验：存在 → 商品已发布 → 规格在售 → 可购买 */
export async function checkSku(skuId: string): Promise<SkuCheckOk | SkuCheckFail> {
  const sku = await prisma.productSku.findUnique({ where: { id: skuId } });
  if (!sku) return { ok: false, reason: "这件规格不存在，请用 get_product 查到的 skuId。" };
  const owner = await prisma.item.findUnique({ where: { id: sku.itemId }, select: { status: true, title: true } });
  if (!owner || owner.status !== "published") return { ok: false, reason: "这件商品已下架，暂时不能加入购物车。" };
  if (sku.status !== "on") return { ok: false, reason: "这个规格已下架，暂时不能加入购物车。" };
  if (!sku.purchasable) return { ok: false, reason: "药品类商品仅作展陈，不在线销售。" };
  return {
    ok: true,
    skuId: sku.id,
    variant: sku.variantName,
    title: owner.title,
    priceCents: sku.priceCents,
    stock: sku.stock,
  };
}

/** 库存不足时的中文原因（能直接转述给访客） */
export function stockReason(variant: string, stock: number): string {
  if (stock <= 0) return `「${variant}」已经卖完了。`;
  return `「${variant}」库存只剩 ${stock} 件，最多只能要 ${stock} 件。`;
}
/** 移除购物车行只需要「SKU 存在」这一条校验（下架商品也要能删掉） */
export interface RemoveCheck {
  ok: boolean;
  skuId: string;
  variant: string;
  title: string;
  reason: string;
}

export async function skuForRemove(skuId: string): Promise<RemoveCheck> {
  const sku = await prisma.productSku.findUnique({ where: { id: skuId } });
  if (!sku) return { ok: false, skuId, variant: "", title: "", reason: "这件规格不存在，请用 [当前购物车] 里的 skuId。" };
  const owner = await prisma.item.findUnique({ where: { id: sku.itemId }, select: { title: true } });
  return { ok: true, skuId: sku.id, variant: sku.variantName, title: owner?.title ?? sku.variantName, reason: "" };
}

/* ── route 白名单 ─────────────────────────────────────── */

const ID = "[A-Za-z0-9_-]+";
const EXACT_ROUTES = new Set([
  "/",
  "/park",
  "/museum",
  "/craft",
  "/craft#machines",
  "/enterprises",
  "/vr",
  "/history",
  "/products",
  "/cart",
  "/orders",
  "/account",
]);

type RouteKind =
  | "park-anchor"
  | "museum-article"
  | "museum-scene"
  | "enterprise-id"
  | "vr-scene"
  | "history-id"
  | "product-id";

const ROUTE_PATTERNS: [RegExp, RouteKind][] = [
  [new RegExp(`^/park#(yq-${ID})$`), "park-anchor"],
  [new RegExp(`^/museum\\?article=(${ID})$`), "museum-article"],
  [new RegExp(`^/museum\\?scene=(${ID})$`), "museum-scene"],
  [new RegExp(`^/enterprises\\?id=(${ID})$`), "enterprise-id"],
  [new RegExp(`^/vr\\?scene=(${ID})$`), "vr-scene"],
  [new RegExp(`^/history/(${ID})$`), "history-id"],
  [new RegExp(`^/products/(${ID})$`), "product-id"],
];

export interface RouteOk {
  ok: true;
  route: string;
  label: string;
}
export interface RouteFail {
  ok: false;
  reason: string;
}

type RouteMatch = { kind: RouteKind; match: RegExpExecArray };

function matchRoute(raw: string): RouteMatch | null {
  for (const [re, kind] of ROUTE_PATTERNS) {
    const match = re.exec(raw);
    if (match) return { kind, match };
  }
  return null;
}

/**
 * goto_page 白名单：整串匹配；带 id 的 route 还要确认内容存在且已发布。
 * 明确拒绝 /admin、/checkout、/pay/…、外部地址、//x 与带 .. 的路径。
 */
export async function resolveRoute(route: string): Promise<RouteOk | RouteFail> {
  const raw = (route ?? "").trim();
  if (!raw) return { ok: false, reason: "没有给出要去的页面地址。" };
  if (raw.includes("..")) return { ok: false, reason: "这个地址不合法，我不能带访客过去。" };

  if (EXACT_ROUTES.has(raw)) {
    const page = STATIC_BY_ROUTE.get(raw);
    return { ok: true, route: raw, label: page?.title ?? raw };
  }

  const machine = STATIC_BY_ROUTE.get(raw);
  if (machine && /^\/craft#machine-/.test(raw)) return { ok: true, route: raw, label: machine.title };

  const hit = matchRoute(raw);
  if (!hit) return { ok: false, reason: "这个地址不在网站上，我不能带访客过去。" };

  const param = hit.match[1] ?? "";
  const missing = { ok: false as const, reason: "网站上没有这条内容，可能还没发布或已经下架。" };

  if (hit.kind === "park-anchor") {
    const items = await prisma.item.findMany({
      where: { board: "park", status: "published" },
      select: { id: true, title: true },
    });
    const found = items.find((item) => parkAnchorOf(item.id) === param);
    return found ? { ok: true, route: raw, label: found.title } : missing;
  }

  if (hit.kind === "museum-scene" || hit.kind === "vr-scene") {
    // 场景只认 board=vr 的已发布条目（/museum?scene= 还要求它所在分组属于博物馆页）；
    // board=museum / park 里的 VR场景 是旧副本，前端按 VR-xxx 找场景，放行它们只会停在首屏。
    const scene = await prisma.item.findFirst({
      where: { id: param, board: "vr", status: "published" } as never,
      select: { title: true },
    });
    if (!scene) return missing;
    if (hit.kind === "museum-scene") {
      const groupPages = await vrGroupPages();
      if (groupPages.get(param) !== "museum") {
        return { ok: false, reason: "这个场景不在博物馆页上，我不能带访客过去。" };
      }
    }
    return { ok: true, route: raw, label: scene.title };
  }

  const where: Record<string, unknown> = { id: param, status: "published" };
  switch (hit.kind) {
    case "museum-article":
      where.board = "museum";
      where.type = { not: "VR场景" };
      break;
    case "enterprise-id":
      where.board = "enterprise";
      break;
    case "history-id":
      where.board = "history";
      break;
    case "product-id":
      where.board = "product";
      break;
  }
  const item = await prisma.item.findFirst({ where: where as never, select: { title: true } });
  return item ? { ok: true, route: raw, label: item.title } : missing;
}

/** 页面/内容的中文名，给 goto_page 的 label 兜底用（找不到返回路由本身） */
export async function labelOfRoute(route: string): Promise<string> {
  const page = STATIC_BY_ROUTE.get(route);
  if (page) return page.title;
  const resolved = await resolveRoute(route);
  return resolved.ok ? resolved.label : route;
}
