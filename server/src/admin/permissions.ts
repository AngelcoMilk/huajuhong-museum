// 后台权限：固定两种角色，**默认拒绝**。
// 所有 /api/admin/* 默认只有管理员能进；运营（operator）只能走下面这张表里的
// 方法 + 路径模式，表里没有的自动不开放——以后新增路由不用改任何地方，运营默认进不去。
// 角色与状态每次请求从库里读，这里只放规则，不缓存身份。

export type AdminRole = "admin" | "operator";

/** 前端按这个决定侧栏和页面：管理员全开，运营只放三类 */
export const ADMIN_PERMISSIONS = ["*"];
export const OPERATOR_PERMISSIONS = ["stats", "orders", "account.self"];

export function permissionsFor(role: AdminRole): string[] {
  return role === "admin" ? [...ADMIN_PERMISSIONS] : [...OPERATOR_PERMISSIONS];
}

export function isAdminRole(value: unknown): value is AdminRole {
  return value === "admin" || value === "operator";
}

type HttpMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

interface OperatorRule {
  method: HttpMethod;
  /** 相对 /api/admin 的路径（不含挂载前缀），整段匹配，不做前缀放行 */
  pattern: RegExp;
  /** 为什么给运营：交回时贴给 coder 的那句话 */
  reason: string;
}

/**
 * 运营白名单（①仪表板和统计只读 ②订单全部操作 ③改自己的密码）。
 * 注意：/customers、/users、/search、/sessions、/analysis、/items、/products、
 * /providers、/config、/settings、/audit、/accounts、/enterprises、/kb、/vr-scenes
 * 都不在表里——运营默认 403，实现里也不加例外分支。
 */
export const OPERATOR_RULES: OperatorRule[] = [
  // ① 仪表板和统计：只读，所以只放 GET（/analytics/aggregate 是写，不给）
  { method: "GET", pattern: /^\/stats\/dashboard$/, reason: "仪表板主数据；运营版另把 todo 收窄成订单项（stats.ts）" },
  { method: "GET", pattern: /^\/stats\/daily$/, reason: "日趋势，聚合计数" },
  { method: "GET", pattern: /^\/stats\/orders-trend$/, reason: "订单趋势，属于订单统计" },
  { method: "GET", pattern: /^\/stats\/board-dwell$/, reason: "板块停留统计，聚合计数，不含会话内容" },
  { method: "GET", pattern: /^\/stats\/top-items$/, reason: "热门展项统计（标题 + 浏览量），属于「统计」且在仪表板首屏" },

  // ② 订单全部操作：查看、发货、撤回、完成、改地址、备注
  { method: "GET", pattern: /^\/orders$/, reason: "订单列表（含顾客名、电话，发货必需）" },
  { method: "GET", pattern: /^\/orders\/[A-Za-z0-9_-]+$/, reason: "订单详情（发货、改地址要用）" },
  { method: "PATCH", pattern: /^\/orders\/[A-Za-z0-9_-]+\/address$/, reason: "改收货地址" },
  { method: "PATCH", pattern: /^\/orders\/[A-Za-z0-9_-]+\/remark$/, reason: "改备注" },
  { method: "POST", pattern: /^\/orders\/[A-Za-z0-9_-]+\/ship$/, reason: "发货" },
  { method: "POST", pattern: /^\/orders\/[A-Za-z0-9_-]+\/complete$/, reason: "标记完成" },
  { method: "POST", pattern: /^\/orders\/[A-Za-z0-9_-]+\/unship$/, reason: "撤销发货" },

  // ③ 自己的账号：只碰当前登录账号本身（改别人的在 /accounts，运营没有）
  { method: "GET", pattern: /^\/auth\/me$/, reason: "前端拿角色和权限，运营也要" },
  { method: "POST", pattern: /^\/auth\/password$/, reason: "只能改自己的密码（处理函数里就用 token 里的 sub）" },
  { method: "POST", pattern: /^\/auth\/logout$/, reason: "退出登录" },
];

/**
 * 把 Hono 里的完整路径规范成相对路径：/api/admin/orders/1 → /orders/1。
 * 带 `..`、反斜杠、编码斜杠的一律当作不匹配（返回 null），不让它绕过整段匹配。
 */
export function normaliseAdminPath(path: string): string | null {
  let value = path.split("?")[0].split("#")[0];
  if (value.startsWith("/api/admin")) value = value.slice("/api/admin".length);
  if (!value.startsWith("/")) value = `/${value}`;
  value = value.replace(/\/{2,}/g, "/");
  if (value.length > 1 && value.endsWith("/")) value = value.slice(0, -1);
  if (value.includes("..") || value.includes("\\") || /%2f|%5c/i.test(value)) return null;
  return value;
}

/** 运营能不能打这个方法 + 路径；匹配不到就是不能（默认拒绝） */
export function operatorAllowed(method: string, path: string): boolean {
  const relative = normaliseAdminPath(path);
  if (!relative) return false;
  return OPERATOR_RULES.some((rule) => rule.method === method.toUpperCase() && rule.pattern.test(relative));
}

/** 中间件用的判定：管理员全开，运营查表，其他角色一律拒绝 */
export function allowed(role: AdminRole, method: string, path: string): boolean {
  return role === "admin" ? true : operatorAllowed(method, path);
}
