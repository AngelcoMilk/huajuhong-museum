// 后台接口封装：统一错误信封、401 失效处理。登录态在 HttpOnly Cookie 里，页面脚本碰不到。
import type { Block } from "../types/hall";
export interface ApiEnvelope {
  error?: { code: string; message: string; field?: string };
}

// 旧版把 token 存在这里，升级后清掉
try {
  localStorage.removeItem("hjh-admin-token");
} catch {
  /* 隐私模式忽略 */
}

export class ApiError extends Error {
  code: string;
  status: number;
  field?: string;
  /** 接口带回来的结构化说明（如 INVALID_BLOCKS 的第几块） */
  details?: any;
  constructor(status: number, code: string, message: string, field?: string, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.field = field;
    this.details = details;
  }
}

let onUnauthorized: (() => void) | null = null;
export function setUnauthorizedHandler(fn: (() => void) | null) {
  onUnauthorized = fn;
}

let onMustChangePassword: (() => void) | null = null;
export function setMustChangePasswordHandler(fn: (() => void) | null) {
  onMustChangePassword = fn;
}

/** 登录页要显示的一次性提示 */
export const LOGIN_NOTICE_KEY = "admin-login-notice";

/** 登录后去哪：next 只接受后台内的地址 */
export function afterLoginPath(next: string | null): string {
  return next && next.startsWith("/admin/") ? next : "/admin";
}

/** 主动退回登录页（改密码成功后旧登录态已作废） */
export function forceRelogin() {
  onUnauthorized?.();
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (!headers.has("content-type") && init.body) headers.set("content-type", "application/json");

  let response: Response;
  try {
    response = await fetch(`/api/admin${path}`, { ...init, headers });
  } catch {
    throw new ApiError(0, "NETWORK", "请求没有送达，请稍后再试。");
  }

  if (response.status === 204) return undefined as T;

  const text = await response.text();
  let body: any = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = null;
  }

  if (!response.ok) {
    const envelope = body?.error;
    if (response.status === 401 && path !== "/auth/login") onUnauthorized?.();
    if (response.status === 403 && envelope?.code === "MUST_CHANGE_PASSWORD") onMustChangePassword?.();
    throw new ApiError(
      response.status,
      envelope?.code ?? "NETWORK",
      envelope?.message ?? `请求失败（HTTP ${response.status}）`,
      envelope?.field,
      envelope?.details,
    );
  }
  return body as T;
}

const get = <T>(path: string) => request<T>(path);
const send = <T>(path: string, method: string, body?: unknown) =>
  request<T>(path, { method, body: body === undefined ? undefined : JSON.stringify(body) });
const qs = (params: Record<string, string | number | undefined>) => {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "" && value !== "all") search.set(key, String(value));
  }
  const out = search.toString();
  return out ? `?${out}` : "";
};

export interface Page<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export type { Block } from "../types/hall";

export type ProductStatus = "draft" | "on_sale" | "off" | "sold_out";
export type ProductStage = "draft" | "on_sale" | "has_orders";

export interface ProductRow {
  id: string;
  title: string;
  category: string;
  status: ProductStatus;
  thumbUrl: string | null;
  skuCount: number;
  priceMinCents: number | null;
  priceMaxCents: number | null;
  totalStock: number;
  soldQty: number;
  pendingShip: number;
  stage: ProductStage;
  lowStock: boolean;
  purchasable: boolean;
  updatedAt: number;
}
export type ProductPage = Page<ProductRow> & { lowStockThreshold: number };

export interface ProductBasics {
  title: string;
  category: string;
  summary?: string;
  body?: string;
}

export interface ProductDetail {
  id: string;
  title: string;
  category: string;
  summary: string;
  body: string;
  status: ProductStatus;
  stage: ProductStage;
  itemStatus: string;
  thumbUrl: string | null;
  soldQty: number;
  pendingShip: number;
  totalStock: number;
  lowStock: boolean;
  lowStockThreshold: number;
  media: MediaRow[];
  updatedAt: number;
}

export interface ProductSku {
  id: string;
  itemId: string;
  variantName: string;
  priceCents: number;
  stock: number;
  purchasable: boolean;
  status: string;
  sort: number;
  orderCount: number;
}
export interface SkuInput {
  variantName: string;
  priceCents: number;
  stock: number;
  status: string;
  purchasable: boolean;
}

export interface ProductSales {
  soldQty: number;
  amountCents: number;
  pendingShip: number;
  recentOrders: Array<{ orderNo: string; status: string; qty: number; amountCents: number; createdAt: number }>;
}

export type AdminRole = "admin" | "operator";

export interface AdminUser {
  id: string;
  username: string;
  createdAt: number;
  role: AdminRole;
  /** 管理员 ["*"]，运营 ["stats","orders","account.self"] */
  permissions: string[];
  /** 还在用初始密码：改完才能进管理中心 */
  mustChangePassword?: boolean;
}

export interface AdminAccount {
  id: string;
  username: string;
  role: AdminRole;
  disabled: boolean;
  createdAt: number;
  lastLoginAt: number | null;
  mustChangePassword?: boolean;
}

export interface Overview {
  orders: { total: number; paid: number; pending: number; paidAmountCents: number };
  contents: { total: number; published: number; draft: number; skus: number };
  guide: { sessions: number; turns: number; inputTokens: number; outputTokens: number; gaps: number };
  traffic: { events7d: number };
  providers: { enabled: number };
}

export interface ItemRow {
  id: string;
  board: string;
  section: string;
  type: string;
  title: string;
  date: string | null;
  status: string;
  sort: number;
  mediaCount: number;
  updatedAt: number;
  thumbUrl?: string | null;
  subtitle?: string | null;
  summary?: string | null;
  author?: string | null;
  sourceName?: string | null;
  coverUrl?: string | null;
  parentId?: string | null;
  hasDraft?: boolean;
}

/** 展项的可编辑内容：存草稿和发布提交的是同一份 */
export interface ItemContent {
  title: string;
  subtitle: string | null;
  summary: string | null;
  author: string | null;
  sourceName: string | null;
  coverUrl: string | null;
  date: string | null;
  sourceUrl: string | null;
  section: string;
  parentId: string | null;
  blocks: Block[];
}

export interface MediaRow {
  id: string;
  kind: string;
  url: string;
  alt: string | null;
  usage: string | null;
  sort: number;
}

export interface ItemDetail extends ItemRow {
  body: string | null;
  sourceUrl: string | null;
  labelJson: string | null;
  media: MediaRow[];
  enterprise: { town?: string | null; address?: string | null; tel?: string | null; lng?: number | null; lat?: number | null } | null;
  product: { thumb?: string | null; category?: string | null } | null;
  blocks?: Block[];
  /** 已发布条目上还没发布的修改 */
  draft?: (Partial<ItemContent> & { draftSavedAt?: number }) | null;
}

export interface PageHead {
  title: string;
  intro: string;
  heroImage: string;
  stats: Array<{ value: string; unit: string; label: string }>;
}

export interface HistorySection {
  name: string;
  count: number;
  published: number;
}

export type VrPage = "park" | "museum";

export interface VrGroup {
  id: string;
  page: VrPage;
  name: string;
  sort: number;
  layout: "grid" | "feature";
  visible: boolean;
  sceneCount?: number;
}

export interface VrLayout {
  groups: Array<VrGroup & { scenes: VrScene[] }>;
  ungrouped: VrScene[];
}

export interface EnterpriseRow {
  id: string;
  title: string;
  status: string;
  town: string;
  address: string;
  tel: string;
  email: string;
  site: string;
  lng: number | null;
  lat: number | null;
  coordSource: string | null;
  verified: boolean;
}

export interface VrScene {
  id: string;
  group: string;
  gid: string | null;
  sceneId: string | null;
  title: string;
  thumb: string | null;
  preview: string | null;
  iframe: string | null;
  status: string;
  groupId?: string | null;
  sort?: number;
  featured?: boolean;
  description?: string | null;
}

export interface OrderTimelineEntry {
  status: "created" | "paid" | "shipped" | "completed";
  at: number;
}

export interface ConfigVersion {
  id: string;
  versionNo: number;
  status: string;
  note: string | null;
  createdAt: number;
  publishedAt: number | null;
  publishedBy?: string | null;
  prompt?: { system?: string };
  model?: { provider?: string; model?: string };
}

export interface ProviderModel {
  id: string;
  name?: string;
  contextWindow?: number;
  maxTokens?: number;
  reasoning?: boolean;
  input?: Array<"text" | "image">;
  compat?: Record<string, unknown>;
}

export interface ProviderRow {
  id: string;
  name: string;
  displayName: string | null;
  baseUrl: string;
  api: string;
  keyMode: "env" | "literal";
  apiKeyEnv: string | null;
  hasKey: boolean;
  ready: boolean;
  models: ProviderModel[];
  enabled: boolean;
  lastTestAt: number | null;
  lastTestOk: boolean | null;
  lastTestError: string | null;
}

/** 还没保存的表单：带 id 时，留空的 Key 用库里已保存的 */
export interface ProviderDraft {
  id?: string;
  baseUrl: string;
  api: string;
  keyMode: "env" | "literal";
  apiKeyEnv?: string;
  apiKey?: string;
  models?: ProviderModel[];
}

export interface PiProvider {
  name: string;
  displayName: string | null;
  baseUrl: string | null;
  api: string;
  modelCount: number;
  hasKey: boolean;
  keyKind: "env" | "literal" | "none";
  exists: boolean;
}

export interface ModelOptions {
  providers: Array<{ name: string; displayName: string | null; enabled: boolean; ready: boolean; models: Array<{ id: string; name: string }> }>;
  /** published=false：库里还没有发布版本，供应商/模型都还是待配置 */
  current: { provider: string; model: string; inList: boolean; published: boolean };
}

export interface TryResult {
  answer: string;
  citations: Array<{ title?: string; origin?: string; url?: string }>;
  suggestions: string[];
  usage: { inputTokens: number; outputTokens: number };
  latencyMs: number;
  errorCode: string | null;
  used: { source: string; versionNo: number | null; provider: string | null; model: string | null };
}

export interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

export type DashboardRange = "day" | "week" | "month" | "all";

export interface DashboardStats {
  generatedAt: number;
  visits: { totalPv: number; totalUv: number; todayPv: number; todayUv: number; weekPv: number; monthPv: number; lastWeekPv: number; weekChangePct: number | null };
  guide: { range: DashboardRange; sessions: number; turns: number; success: number; failed: number; successRate: number | null; inputTokens: number; outputTokens: number };
  sales: { range: DashboardRange; paidOrders: number; amountCents: number };
  todo: { ordersToShip: number; gapsPending: number; enterprisesUnplaced: number; itemsDraft: number; lowStock: number };
}

export interface DailyPoint {
  day: string;
  pv: number;
  uv: number;
  guideTurns: number;
  amountCents: number;
}

export interface TopItem {
  id: string;
  title: string;
  board: string;
  views: number;
  share: number;
}

export type BatchAction = "publish" | "unpublish" | "archive";

export interface BatchResult {
  ok: string[];
  failed: Array<{ id: string; code: string; message: string }>;
}

export const api = {
  login: (username: string, password: string) =>
    send<{ user: AdminUser }>("/auth/login", "POST", { username, password }),
  me: () => get<AdminUser>("/auth/me"),
  overview: () => get<Overview>("/stats/overview"),
  ordersTrend: (days = 30) => get<Array<{ day: string; count: number; amountCents: number }>>(`/stats/orders-trend${qs({ days })}`),
  boardDwell: (days = 7) => get<Array<{ board: string; pv: number; clicks: number; avgDwellMs: number }>>(`/stats/board-dwell${qs({ days })}`),
  dashboard: (range: DashboardRange) => get<DashboardStats>(`/stats/dashboard?range=${range}`),
  daily: (days: number) => get<{ days: number; series: DailyPoint[] }>(`/stats/daily?days=${days}`),
  topItems: (board: string, days = 30, limit = 10) =>
    get<{ items: TopItem[] }>(`/stats/top-items?board=${encodeURIComponent(board)}&days=${days}&limit=${limit}`),
  itemsBatch: (ids: string[], action: BatchAction) => send<BatchResult>("/items/batch", "POST", { ids, action }),
  vrBatch: (ids: string[], action: BatchAction) => send<BatchResult>("/vr-scenes/batch", "POST", { ids, action }),
  items: (params: Record<string, string | number | undefined>) => get<Page<ItemRow>>(`/items${qs(params)}`),
  item: (id: string) => get<ItemDetail>(`/items/${encodeURIComponent(id)}`),
  createItem: (body: Record<string, unknown>) =>
    send<{ id: string; board: string; status: string }>("/items", "POST", body),
  archiveItem: (id: string) => send<{ id: string; status: string }>(`/items/${encodeURIComponent(id)}`, "DELETE"),
  addMedia: (id: string, body: { url: string; kind?: string; alt?: string; usage?: string }) =>
    send<{ id: string; url: string }>(`/items/${encodeURIComponent(id)}/media`, "POST", body),
  deleteMedia: (mediaId: string) => request<void>(`/media/${encodeURIComponent(mediaId)}`, { method: "DELETE" }),
  audit: (params: Record<string, string | number | undefined>) => get<Page<{ id: string; actor: string; action: string; target: string; detail: any; createdAt: number }>>(`/audit${qs(params)}`),
  upload: async (file: File) => {
    const form = new FormData();
    form.append("file", file);
    const response = await fetch("/api/admin/uploads", { method: "POST", body: form });
    const text = await response.text();
    const payload = text ? JSON.parse(text) : null;
    if (!response.ok) {
      throw new ApiError(response.status, payload?.error?.code ?? "UPLOAD_FAILED", payload?.error?.message ?? "上传失败");
    }
    return payload as { url: string; size: number; type: string };
  },
  patchItem: (id: string, patch: Record<string, unknown>) => send<{ id: string; status?: string; updatedAt: number }>(`/items/${encodeURIComponent(id)}`, "PATCH", patch),
  saveItemDraft: (id: string, body: Record<string, unknown>) =>
    send<{ id: string; status: string; updatedAt: number }>(`/items/${encodeURIComponent(id)}/draft`, "PUT", body),
  discardItemDraft: (id: string) => send<{ id: string; updatedAt: number }>(`/items/${encodeURIComponent(id)}/draft`, "DELETE"),
  reorderItems: (ids: string[], parentId?: string | null) => send<{ ok: boolean }>("/items/reorder", "POST", parentId === undefined ? { ids } : { ids, parentId }),
  deleteItem: (id: string) => send<void>(`/items/${encodeURIComponent(id)}?hard=1`, "DELETE"),
  setItemsSection: (ids: string[], section: string) => send<BatchResult>("/items/batch", "POST", { ids, action: "set-section", section }),
  contentPage: (board: string) => get<PageHead | null>(`/content-pages/${encodeURIComponent(board)}`),
  saveContentPage: (board: string, body: PageHead) => send<PageHead>(`/content-pages/${encodeURIComponent(board)}`, "PUT", body),
  historySections: () => get<{ items: HistorySection[] }>("/history-sections"),
  patchHistorySections: (body: { order?: string[]; rename?: { from: string; to: string } }) => send<{ ok: boolean }>("/history-sections", "PATCH", body),
  publishItem: (id: string, published: boolean) => send<{ id: string; status: string }>(`/items/${encodeURIComponent(id)}/publish`, "POST", { published }),
  kbSlices: (params: Record<string, string | number | undefined>) => get<Page<{ id: string; title: string; origin: string | null; url: string | null; source: string; updatedAt: number }>>(`/kb/slices${qs(params)}`),
  kbSlice: (id: string) => get<{ id: string; title: string; origin: string | null; content: string; url: string | null; source: string }>(`/kb/slices/${encodeURIComponent(id)}`),
  kbSearch: (query: string) =>
    send<{
      query: string;
      hits: Array<{ id: string; title: string; origin: string | null; url: string | null; score: number; source: string; content: string; terms: string[] }>;
    }>("/kb/search-test", "POST", { query }),
  kbWiki: () => get<Array<{ slug: string; title: string; source: string | null; updated: string | null; chars: number }>>("/kb/wiki"),
  kbWikiPage: (slug: string) => get<{ slug: string; markdown: string }>(`/kb/wiki/${encodeURIComponent(slug)}`),
  aggregate: (days = 7) => send<{ days: number; events: number; buckets: number }>(`/analytics/aggregate?days=${days}`, "POST", {}),
  gaps: (params: Record<string, string | number | undefined>) => get<Page<{ id: string; question: string; status: string; count: number; lastSeenAt: number; note?: string | null }>>(`/kb/gaps${qs(params)}`),
  patchGap: (id: string, status: string) => send<{ id: string; status: string }>(`/kb/gaps/${id}`, "PATCH", { status }),
  sessions: (params: Record<string, string | number | undefined>) => get<Page<{ id: string; visitorId: string; page: string | null; startedAt: number; endedAt: number | null; endedReason: string | null; turnCount: number; inputTokens: number; outputTokens: number; finishReason: string | null; messageCount: number }>>(`/sessions${qs(params)}`),
  session: (id: string) => get<{ id: string; visitorId: string; startedAt: number; endedAt: number | null; endedReason: string | null; turnCount: number; inputTokens: number; outputTokens: number; messages: Array<{ id: string; role: string; content: string; citationsJson: string | null; suggestionsJson: string | null; toolJson: string | null; usageJson: string | null; latencyMs: number | null; errorCode: string | null; createdAt: number }> }>(`/sessions/${encodeURIComponent(id)}`),
  settings: () => get<{ values: Record<string, string>; allowedKeys: string[] }>("/settings"),
  saveSettings: (settings: Record<string, string>) =>
    send<{ updated: number; values: Record<string, string> }>("/settings", "PUT", { settings }),
  logout: () => send<void>("/auth/logout", "POST"),
  accounts: () => get<{ items: AdminAccount[] }>("/accounts"),
  createAccount: (body: { username: string; role: AdminRole; password?: string; currentPassword?: string }) => send<{ account: AdminAccount; initialPassword?: string }>("/accounts", "POST", body),
  patchAccount: (id: string, patch: { role?: AdminRole; disabled?: boolean; currentPassword?: string }) => send<{ account: AdminAccount }>(`/accounts/${encodeURIComponent(id)}`, "PATCH", patch),
  resetAccountPassword: (id: string, body: { password?: string; currentPassword: string }) => send<{ initialPassword?: string }>(`/accounts/${encodeURIComponent(id)}/reset-password`, "POST", body),
  deleteAccount: (id: string) => send<unknown>(`/accounts/${encodeURIComponent(id)}`, "DELETE"),
  changePassword: (current: string, next: string) => send<{ ok: true }>("/auth/password", "POST", { current, next }),
  analysisEstimate: (mode: "incremental" | "full") => send<{ mode: string; sessionCount: number; chars: number; estimatedTokens: number; since: number | null; lastReportAt: number | null }>("/analysis/estimate", "POST", { mode }),
  analysisRun: (mode: "incremental" | "full") =>
    send<{ skipped: boolean; reason?: string; sessionCount?: number; parsed?: any; raw?: string | null; model?: string; gaps?: { created: number; bumped: number } }>("/analysis/run", "POST", { mode }),
  analysisReports: () =>
    get<Array<{ id: string; kind: string; scope: string; sessionCount: number; model: string | null; tokens: number; createdAt: number; parsed: any }>>("/analysis/reports"),
  analyzeSession: (id: string) => send<{ reportId: string; parsed: any; raw: string | null; model: string; gaps: { created: number; bumped: number } }>(`/sessions/${encodeURIComponent(id)}/analyze`, "POST", {}),
  sessionAnalysis: (id: string) => get<{ id: string; createdAt: number; model: string | null; parsed?: any; raw?: string | null } | null>(`/sessions/${encodeURIComponent(id)}/analysis`),
  configCurrent: () => get<{ draft: any; published: any; hasPendingDraft: boolean }>("/config/current"),
  saveDraft: (prompt: { system: string }, model: { provider: string; model: string }, note?: string) => send<{ id: string; versionNo: number }>("/config/draft", "PUT", { prompt, model, note }),
  publishConfig: (versionId?: string) => send<{ id: string; versionNo: number; note: string }>("/config/publish", "POST", { versionId }),
  versions: () => get<ConfigVersion[]>("/config/versions"),
  version: (id: string) => get<ConfigVersion>(`/config/versions/${encodeURIComponent(id)}`),
  /** 测试场流式试聊：SSE 帧格式与 /api/agent/chat 一致，由调用方解析 */
  tryStream: async (
    body: { question: string; useDraft?: boolean; versionId?: string; draft?: { prompt: { system: string }; model: { provider: string; model: string } }; history?: ChatTurn[] },
    signal: AbortSignal,
  ) => {
    const headers = new Headers({ "content-type": "application/json", accept: "text/event-stream" });
    let response: Response;
    try {
      response = await fetch("/api/admin/config/try/stream", { method: "POST", headers, body: JSON.stringify(body), signal });
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") throw err;
      throw new ApiError(0, "NETWORK", "请求没有送达，请稍后再试。");
    }
    if (!response.ok) {
      const text = await response.text();
      let envelope: any = null;
      try {
        envelope = JSON.parse(text)?.error;
      } catch {
        /* 不是 JSON */
      }
      if (response.status === 401) forceRelogin();
      throw new ApiError(response.status, envelope?.code ?? "NETWORK", envelope?.message ?? `请求失败（HTTP ${response.status}）`, envelope?.field);
    }
    return response;
  },
  modelOptions: () => get<ModelOptions>("/config/model-options"),
  providers: () => get<ProviderRow[]>("/providers"),
  createProvider: (body: unknown) => send<ProviderRow>("/providers", "POST", body),
  patchProvider: (id: string, body: unknown) => send<ProviderRow>(`/providers/${id}`, "PATCH", body),
  piConfig: () => get<{ path: string; found: boolean; providers: PiProvider[] }>("/providers/pi-config"),
  importPi: (names: string[], onConflict: "skip" | "overwrite") =>
    send<{ imported: string[]; skipped: string[]; needKey: string[] }>("/providers/import-pi", "POST", { names, onConflict }),
  testProviderDraft: (body: ProviderDraft) => send<{ ok: boolean; latencyMs: number; message: string }>("/providers/test", "POST", body),
  deleteProvider: (id: string) => request<void>(`/providers/${encodeURIComponent(id)}`, { method: "DELETE" }),
  testProvider: (id: string, model?: string) => send<{ ok: boolean; latencyMs: number; message: string; model?: string }>(`/providers/${id}/test`, "POST", { model }),
  fetchProviderModels: (id: string) =>
    send<{ ok: boolean; models: string[]; message?: string }>(`/providers/${encodeURIComponent(id)}/models:fetch`, "POST", {}),
  fetchProviderModelsDraft: (body: ProviderDraft) => send<{ ok: boolean; models: string[]; message?: string }>("/providers/models:fetch", "POST", body),

  // ── VR 场景 ─────────────────────────────────────────
  vrScenes: (params: Record<string, string | number | undefined>) =>
    get<Page<VrScene>>(`/vr-scenes${qs(params)}`),
  createVrScene: (body: Record<string, unknown>) =>
    send<{ id: string; title: string; status: string }>("/vr-scenes", "POST", body),
  patchVrScene: (id: string, body: Record<string, unknown>) =>
    send<{ id: string; title: string; status: string }>(`/vr-scenes/${encodeURIComponent(id)}`, "PATCH", body),
  deleteVrScene: (id: string) => send<void>(`/vr-scenes/${encodeURIComponent(id)}?hard=1`, "DELETE"),
  checkVrUrl: (url: string) => send<{ ok: boolean; reason?: string }>("/vr-scenes/check-url", "POST", { url }),
  vrLayout: (page: VrPage) => get<VrLayout>(`/vr/layout${qs({ page })}`),
  vrGroups: (page?: VrPage) => get<{ items: VrGroup[] }>(`/vr-groups${qs({ page })}`),
  createVrGroup: (body: { page: VrPage; name: string; layout?: string; visible?: boolean }) => send<VrGroup>("/vr-groups", "POST", body),
  patchVrGroup: (id: string, body: { name?: string; layout?: string; visible?: boolean }) => send<VrGroup>(`/vr-groups/${encodeURIComponent(id)}`, "PATCH", body),
  deleteVrGroup: (id: string) => send<void>(`/vr-groups/${encodeURIComponent(id)}`, "DELETE"),
  reorderVr: (body: { page: VrPage; groupIds?: string[]; groups?: Array<{ id: string; sceneIds: string[] }>; ungrouped?: string[] }) => send<{ ok: boolean }>("/vr/reorder", "POST", body),

  // ── 知识切片写入 ────────────────────────────────────
  createKbSlice: (body: { title: string; source: string; content: string; origin?: string | null; url?: string | null }) =>
    send<{ id: string; title: string; source: string; updatedAt: number }>("/kb/slices", "POST", body),
  patchKbSlice: (id: string, body: Record<string, unknown>) =>
    send<{ id: string; title: string; updatedAt: number }>(`/kb/slices/${encodeURIComponent(id)}`, "PATCH", body),
  deleteKbSlice: (id: string) => request<void>(`/kb/slices/${encodeURIComponent(id)}`, { method: "DELETE" }),
  // ── 订单履约 ───────────────────────────────────────
  updateOrderAddress: (orderNo: string, address: Record<string, string>, saveToBook = false) =>
    send<{ orderNo: string; address: Record<string, string> }>(`/orders/${encodeURIComponent(orderNo)}/address`, "PATCH", { address, saveToBook }),
  unshipOrder: (orderNo: string) => send<{ orderNo: string; status: string }>(`/orders/${encodeURIComponent(orderNo)}/unship`, "POST", {}),
  shipOrder: (orderNo: string, body: { carrier: string; trackingNo: string; remark?: string }) =>
    send<{ orderNo: string; status: string; carrier?: string; trackingNo?: string | null; shippedAt?: number | null; already?: boolean }>(`/orders/${encodeURIComponent(orderNo)}/ship`, "POST", body),
  completeOrder: (orderNo: string) =>
    send<{ orderNo: string; status: string; completedAt?: number | null; already?: boolean }>(`/orders/${encodeURIComponent(orderNo)}/complete`, "POST", {}),
  remarkOrder: (orderNo: string, remark: string) =>
    send<{ orderNo: string; remark: string }>(`/orders/${encodeURIComponent(orderNo)}/remark`, "PATCH", { remark }),

  // ── 客户 ───────────────────────────────────────────
  customers: (params: Record<string, string | number | undefined>) =>
    get<Page<{ id: string; name: string; phone: string; remark: string; createdAt: number; orders: number; paidAmountCents: number; lastOrderAt: number | null }>>(`/customers${qs(params)}`),
  customer: (id: string) =>
    get<{
      id: string;
      name: string;
      phone: string;
      remark: string;
      createdAt: number;
      addresses: Array<Record<string, any>>;
      orders: Array<{ orderNo: string; status: string; totalCents: number; itemCount: number; createdAt: number; address: Record<string, any> }>;
    }>(`/customers/${encodeURIComponent(id)}`),
  patchCustomer: (id: string, body: { name?: string; remark?: string }) =>
    send<{ id: string; name: string; remark: string }>(`/customers/${encodeURIComponent(id)}`, "PATCH", body),
  addCustomerAddress: (id: string, body: Record<string, string>) =>
    send<Record<string, any>>(`/customers/${encodeURIComponent(id)}/addresses`, "POST", body),
  deleteCustomerAddress: (id: string, addressId: string) =>
    request<void>(`/customers/${encodeURIComponent(id)}/addresses/${encodeURIComponent(addressId)}`, { method: "DELETE" }),

  // ── 企业地图坐标 ───────────────────────────────────
  enterprises: (params: Record<string, string | number | undefined>) => get<Page<EnterpriseRow>>(`/enterprises${qs(params)}`),
  createEnterprise: (body: Record<string, unknown>) =>
    send<{ id: string; title: string; coord: { lng: number; lat: number; huazhou: boolean } | null }>("/enterprises", "POST", body),
  patchEnterprise: (id: string, body: Record<string, unknown>) =>
    send<{ id: string; lng: number | null; lat: number | null; coordSource: string | null }>(`/enterprises/${encodeURIComponent(id)}`, "PATCH", body),
  setEnterpriseCoord: (id: string, coord: unknown, coordSource?: string) =>
    send<{ id: string; lng: number; lat: number; swapped: boolean; inHuazhou: boolean }>(`/enterprises/${encodeURIComponent(id)}/coord`, "PATCH", { coord, coordSource }),
  exportEnterprisePoints: () => get<{ count: number; points: Record<string, unknown> }>("/enterprises/export-points"),
  adminSearch: (q: string) =>
    get<{ customers: Array<{ id: string; name: string; phone: string }>; orders: Array<{ orderNo: string; status: string; totalCents: number }>; items: Array<{ id: string; title: string; board: string }> }>(`/search${qs({ q })}`),

  orders: (params: Record<string, string | number | undefined>) => get<Page<{ orderNo: string; status: string; totalCents: number; itemCount: number; user: string; phone: string; carrier?: string | null; trackingNo?: string | null; createdAt: number; paidAt: number | null; shippedAt?: number | null; completedAt?: number | null }>>(`/orders${qs(params)}`),
  order: (orderNo: string) => get<any>(`/orders/${encodeURIComponent(orderNo)}`),
  products: (params: Record<string, string | number | undefined>) => get<ProductPage>(`/products${qs(params)}`),
  product: (id: string) => get<ProductDetail>(`/products/${encodeURIComponent(id)}`),
  createProduct: (body: ProductBasics) => send<ProductDetail>("/products", "POST", body),
  patchProduct: (id: string, patch: Partial<ProductBasics>) => send<ProductDetail>(`/products/${encodeURIComponent(id)}`, "PATCH", patch),
  setProductCover: (id: string, mediaId: string) => send<ProductDetail>(`/products/${encodeURIComponent(id)}/cover`, "POST", { mediaId }),
  publishProduct: (id: string) => send<ProductDetail>(`/products/${encodeURIComponent(id)}/publish`, "POST"),
  unpublishProduct: (id: string) => send<ProductDetail>(`/products/${encodeURIComponent(id)}/unpublish`, "POST"),
  productSkus: (id: string) => get<ProductSku[]>(`/products/${encodeURIComponent(id)}/skus`),
  createSku: (id: string, body: SkuInput) => send<ProductSku>(`/products/${encodeURIComponent(id)}/skus`, "POST", body),
  patchSku: (id: string, patch: Partial<SkuInput>) => send<ProductSku>(`/skus/${encodeURIComponent(id)}`, "PATCH", patch),
  deleteSku: (id: string) => request<void>(`/skus/${encodeURIComponent(id)}`, { method: "DELETE" }),
  productSales: (id: string) => get<ProductSales>(`/products/${encodeURIComponent(id)}/sales`),
  users: (q?: string) => get<Array<{ id: string; name: string; phone: string; createdAt: number }>>(`/users${qs({ q })}`),
};