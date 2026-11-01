// 后台鉴权：JWT + 每次请求从库里读角色与状态（不信 token 里的 role）。
// 鉴权 = 认证（token、tokenVersion、disabled）+ 授权（默认拒绝，运营走 permissions.ts 的白名单）。
// 登录态优先读 Cookie、初始口令未改时只放行三个接口（严格）、登录限流。
import type { Context, MiddlewareHandler } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { prisma } from "../db.ts";
import { clientIp } from "../lib/clientIp.ts";
import {
  ScryptBusyError,
  hashPassword,
  needsUpgrade,
  verifyDummy,
  verifyPassword,
} from "../lib/password.ts";
import { withKeyLock } from "../lib/keyLock.ts";
import { createLimiter } from "../lib/rateLimit.ts";
import { audit } from "./audit.ts";
import { bearer, issueToken, readToken, type AdminClaims } from "./jwt.ts";
import { allowed, isAdminRole, normaliseAdminPath, permissionsFor, type AdminRole } from "./permissions.ts";

/** 登录态放在 HttpOnly Cookie 里，前端不再碰 token */
export const ADMIN_COOKIE = "hjh_admin";
/** 项目自己的口令下限（accounts.ts 用同一个数） */
export const PASSWORD_MIN = 10;

/** 登录后挂在 c 上的身份：JWT 里的声明 + 这一次从库里读到的角色 */
export type AdminIdentity = AdminClaims & { role: AdminRole };
export type AdminEnv = { Variables: { admin: AdminIdentity } };

/**
 * 库里 role 只会是 admin|operator（接口和默认值都卡住）。真被手工写坏时按最小权限处理：
 * 认不出的角色当运营，宁可挡住也不当管理员。
 */
export function normaliseRole(value: unknown): AdminRole {
  return isAdminRole(value) ? value : "operator";
}

/* ── 登录限流：只记失败，窗口与封禁都是 15 分钟 ─────────── */
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
/** 同一 IP + 同一用户名 */
const pairLimiter = createLimiter({ windowMs: LOGIN_WINDOW_MS, max: 5 });
/** 同一 IP */
const ipLimiter = createLimiter({ windowMs: LOGIN_WINDOW_MS, max: 10 });
/** 同一用户名（跨 IP） */
const userLimiter = createLimiter({ windowMs: LOGIN_WINDOW_MS, max: 20 });

function rateLimited(retryAfterSec: number) {
  return {
    ok: false as const,
    status: 429 as const,
    code: "LOGIN_RATE_LIMITED",
    message: `尝试次数过多，请 ${Math.ceil(retryAfterSec / 60)} 分钟后再试。`,
    retryAfterSec,
  };
}

/** 三条规则里封得最久的那个；都没封返回 null */
function blockedFor(pairKey: string, ipKey: string, userKey: string): number | null {
  let worst = 0;
  for (const [limiter, key] of [
    [pairLimiter, pairKey],
    [ipLimiter, ipKey],
    [userLimiter, userKey],
  ] as const) {
    const state = limiter.check(key);
    if (!state.ok) worst = Math.max(worst, state.retryAfterSec);
  }
  return worst > 0 ? worst : null;
}

function isPasswordChangeExempt(method: string, path: string): boolean {
  const relative = normaliseAdminPath(path);
  if (!relative) return false;
  const verb = method.toUpperCase();
  if (verb === "GET" && relative === "/auth/me") return true;
  return verb === "POST" && (relative === "/auth/password" || relative === "/auth/logout");
}

export const requireAdmin: MiddlewareHandler<AdminEnv> = async (c, next) => {
  // 先读 Cookie（浏览器），再读 Authorization: Bearer（脚本与服务端测试）
  const token = getCookie(c, ADMIN_COOKIE) || bearer(c.req.header("authorization"));
  const claims = token ? await readToken(token) : null;
  if (!claims) {
    return c.json({ error: { code: "UNAUTHORIZED", message: "登录状态已失效，请重新登录。" } }, 401);
  }
  // 角色、停用状态、初始口令标记每个请求都从库里读：改角色下一个请求就生效，停用立刻踢下线
  const user = await prisma.adminUser.findUnique({
    where: { id: claims.sub },
    select: { tokenVersion: true, role: true, disabled: true, mustChangePassword: true },
  });
  if (!user) {
    return c.json({ error: { code: "UNAUTHORIZED", message: "登录状态已失效，请重新登录。" } }, 401);
  }
  if (user.disabled) {
    return c.json({ error: { code: "TOKEN_REVOKED", message: "账号已停用，请联系管理员。" } }, 401);
  }
  // 改密/重置密码会让 tokenVersion +1：老 token 签名仍然有效，但版本对不上，按已吊销处理
  if ((claims.ver ?? 0) !== user.tokenVersion) {
    return c.json({ error: { code: "TOKEN_REVOKED", message: "密码已修改，请重新登录。" } }, 401);
  }
  // 还在用初始口令的账号，除改密/查自己/退出外一律挡住
  if (user.mustChangePassword && !isPasswordChangeExempt(c.req.method, c.req.path)) {
    return c.json({ error: { code: "MUST_CHANGE_PASSWORD", message: "请先修改初始密码。" } }, 403);
  }
  const role = normaliseRole(user.role);
  // 授权在路由处理之前：不通过就到此为止，处理函数不会跑，也不会写库
  if (!allowed(role, c.req.method, c.req.path)) {
    return c.json({ error: { code: "FORBIDDEN", message: "没有权限执行这个操作。" } }, 403);
  }
  c.set("admin", { ...claims, role });
  await next();
};

export interface LoginOk {
  ok: true;
  token: string;
  user: {
    id: string;
    username: string;
    role: AdminRole;
    permissions: string[];
    mustChangePassword: boolean;
  };
}

export type LoginResult =
  | LoginOk
  | { ok: false; status: 400 | 401 | 429 | 503; code: string; message: string; retryAfterSec?: number };

/**
 * 账号密码登录。ip 由调用方用 clientIp() 取（TRUST_PROXY_HOPS=0 时伪造 XFF 无效）。
 * 顺序：限流判定 → 同一 (IP+用户名) 串行 → scrypt → 失败才计数、成功清「IP+用户名」。
 */
export async function login(raw: unknown, ip: string): Promise<LoginResult> {
  const body = (raw ?? {}) as { username?: unknown; password?: unknown };
  // 只认字符串：JSON 里塞对象/数组时 String() 会抛 TypeError，变成 500
  const username = typeof body.username === "string" ? body.username.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";
  // 用户名缺失的 400 不计数
  if (!username || !password) {
    return { ok: false, status: 400, code: "BAD_REQUEST", message: "请输入账号和密码。" };
  }

  const pairKey = `${ip}|${username}`;
  const blocked = blockedFor(pairKey, ip, username);
  if (blocked !== null) return rateLimited(blocked);

  // 三个维度都按 key 串行（顺序固定：用户名 → IP），原因有两条：
  // ① 并发下的正确口令不会被「正在处理的失败」误判成超限（成功不计数，前面的人成功就清了）；
  // ② 并发的暴力尝试不会冲穿上限：排队后第 max+1 个进门就 429。
  // pair 维度由 username + ip 两把锁覆盖（同一 pair 必然同 IP 同用户名），不再单独加锁。
  return withKeyLock(`u:${username}`, () =>
    withKeyLock(`ip:${ip}`, async (): Promise<LoginResult> => {
      // 排队期间别人可能已经把这条打到上限
      const recheck = blockedFor(pairKey, ip, username);
      if (recheck !== null) return rateLimited(recheck);

      const failed = (): LoginResult => {
        // 只记失败：成功时不会走到这里，登录成功只清「IP + 用户名」
        pairLimiter.hit(pairKey);
        ipLimiter.hit(ip);
        userLimiter.hit(username);
        // 已封禁的请求在进门处就返回、不写审计；触发封禁的那一次改写 auth.login_locked
        const nowBlocked = blockedFor(pairKey, ip, username);
        if (nowBlocked !== null) {
          audit({ actor: username, action: "auth.login_locked", target: "login", detail: { ip } });
        } else {
          audit({ actor: username, action: "admin.login.failed", target: "login" });
        }
        return { ok: false, status: 401, code: "BAD_CREDENTIALS", message: "账号或密码不正确。" };
      };

      // 超长输入直接按失败处理：不跑 scrypt，但照样计数
      if (username.length > 64 || password.length > 1024) return failed();

      const user = await prisma.adminUser.findUnique({ where: { username } });
      let passwordOk = false;
      try {
        if (user) {
          passwordOk = await verifyPassword(password, user.passwordHash);
          // 旧参数的哈希校验完再多跑一次假哈希：新旧账号耗时一致，不暴露账号是否存在
          if (needsUpgrade(user.passwordHash)) await verifyDummy(password);
        } else {
          await verifyDummy(password);
        }
      } catch (error) {
        // 队列满：不算失败、不计审计，让客户端稍后重试
        if (error instanceof ScryptBusyError) {
          return { ok: false, status: 503, code: "BUSY", message: "系统繁忙，请稍后再试。" };
        }
        throw error;
      }

      // 用户不存在、停用、密码错误：同一个错误码和文案
      if (!user || !passwordOk || user.disabled) return failed();

      // 用不到下限的密码登录成功 → 标记为必须改密（真实库里还在用默认口令的账号下次登录就被要求改）
      const data: { lastLoginAt: Date; mustChangePassword?: boolean; passwordHash?: string } = {
        lastLoginAt: new Date(),
      };
      if (!user.mustChangePassword && password.length < PASSWORD_MIN) data.mustChangePassword = true;
      // 旧参数的哈希透明升级为新参数，不动 tokenVersion（旧浏览器标签页不会被迫下线）
      if (needsUpgrade(user.passwordHash)) {
        try {
          data.passwordHash = await hashPassword(password);
        } catch (error) {
          if (!(error instanceof ScryptBusyError)) throw error;
          // 队列满就这次不升级，登录照常成功
        }
      }
      await prisma.adminUser.update({ where: { id: user.id }, data });

      // 登录成功只清「IP + 用户名」这一条
      pairLimiter.reset(pairKey);
      audit({ actor: user.username, action: "admin.login", target: user.username });

      const role = normaliseRole(user.role);
      const token = await issueToken({ id: user.id, username: user.username, tokenVersion: user.tokenVersion });
      return {
        ok: true,
        token,
        user: {
          id: user.id,
          username: user.username,
          role,
          permissions: permissionsFor(role),
          mustChangePassword: user.mustChangePassword || password.length < PASSWORD_MIN,
        },
      };
    }),
  );
}

export async function me(claims: AdminClaims) {
  const user = await prisma.adminUser.findUnique({ where: { id: claims.sub } });
  if (!user || user.disabled) return null;
  const role = normaliseRole(user.role);
  return {
    id: user.id,
    username: user.username,
    createdAt: user.createdAt.getTime(),
    role,
    permissions: permissionsFor(role),
    mustChangePassword: user.mustChangePassword,
  };
}

/* ── Cookie：属性集中在这里，签发与清除必须一致 ─────────── */
const COOKIE_MAX_AGE = 12 * 60 * 60;

/** Secure：NODE_ENV=production 默认带；COOKIE_SECURE=0 关、=1 强制开 */
function cookieSecure(): boolean {
  const flag = (process.env.COOKIE_SECURE ?? "").trim();
  if (flag === "1") return true;
  if (flag === "0") return false;
  return process.env.NODE_ENV === "production";
}

function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: "Strict" as const,
    path: "/api/admin",
    secure: cookieSecure(),
  };
}

export function setAdminCookie(c: Context, token: string): void {
  setCookie(c, ADMIN_COOKIE, token, { ...cookieOptions(), maxAge: COOKIE_MAX_AGE });
}

/** 退出与改密成功时清掉；属性要跟签发时一致，浏览器才认这条删除 */
export function clearAdminCookie(c: Context): void {
  setCookie(c, ADMIN_COOKIE, "", { ...cookieOptions(), maxAge: 0 });
}
