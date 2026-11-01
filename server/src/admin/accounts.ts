// 账号与权限：/accounts 全套（管理员专用，运营进不来——permissions.ts 里没有这两条路径）。
// 保护规则：不能停用/删除/降级自己，系统至少保留一个启用的管理员；
// 校验和写库都在 withConfigLock 里，并发下不会降到 0 个管理员。
import type { Context } from "hono";
import type { Hono } from "hono";
import { randomBytes } from "node:crypto";
import { prisma } from "../db.ts";
import { ScryptBusyError, hashPassword, verifyPassword } from "../lib/password.ts";
import { createLimiter } from "../lib/rateLimit.ts";
import { audit } from "./audit.ts";
import { withConfigLock } from "./config-lock.ts";
import { PASSWORD_MIN, normaliseRole } from "./auth.ts";
import { isAdminRole, type AdminRole } from "./permissions.ts";

const USERNAME_RE = /^[a-z0-9][a-z0-9._-]{2,31}$/;

function fail(
  c: Context,
  status: 400 | 401 | 403 | 404 | 409 | 429 | 500 | 503,
  code: string,
  message: string,
  field?: string,
) {
  return c.json({ error: { code, message, ...(field ? { field } : {}) } }, status);
}

/** 只认字符串：JSON 里塞对象/数组时 String() 会抛错变 500 */
function text(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

interface AccountRow {
  id: string;
  username: string;
  role: string;
  disabled: boolean;
  createdAt: Date;
  lastLoginAt: Date | null;
  mustChangePassword: boolean;
}

/** 对外形状：不返回 passwordHash，一个字段都不带 */
function accountView(row: AccountRow) {
  return {
    id: row.id,
    username: row.username,
    role: normaliseRole(row.role),
    disabled: row.disabled,
    createdAt: row.createdAt.getTime(),
    lastLoginAt: row.lastLoginAt ? row.lastLoginAt.getTime() : null,
    mustChangePassword: row.mustChangePassword,
  };
}

function validateUsername(value: unknown): { ok: true; value: string } | { ok: false; message: string } {
  const raw = text(value);
  const username = raw ? raw.trim() : "";
  if (!username) return { ok: false, message: "用户名不能为空。" };
  if (!USERNAME_RE.test(username)) {
    return { ok: false, message: "用户名 3–32 位，只用小写字母、数字、点、下划线、连字符，且以字母或数字开头。" };
  }
  return { ok: true, value: username };
}

/** 密码规则沿用 /auth/password：至少 10 位 */
function validatePassword(value: unknown): { ok: true; value: string } | { ok: false; message: string } {
  const password = text(value);
  if (password === null) return { ok: false, message: "密码格式不对。" };
  if (password.length < PASSWORD_MIN) return { ok: false, message: `密码至少 ${PASSWORD_MIN} 位。` };
  return { ok: true, value: password };
}

function generatePassword(): string {
  return randomBytes(12).toString("base64url");
}

/** 现在库里还有几个启用的管理员（role=admin 且没停用） */
function countEnabledAdmins(excludeId?: string): Promise<number> {
  return prisma.adminUser.count({
    where: { role: "admin", disabled: false, ...(excludeId ? { NOT: { id: excludeId } } : {}) },
  });
}

/* ── 高危操作再验证：要操作者自己的当前口令 ─────────────── */
const REAUTH_WINDOW_MS = 15 * 60 * 1000;
const reauthLimiter = createLimiter({ windowMs: REAUTH_WINDOW_MS, max: 5, maxKeys: 1000 });

type ReauthResult = { ok: true } | { ok: false; status: 400 | 401 | 403 | 429 | 503; code: string; message: string; field?: string };

/**
 * 严格模式必带 currentPassword；非严格时带了就校验、没带放行。
 * 校验在任何写入之前，失败不产生副作用；同一操作者 15 分钟错 5 次后 429。
 */
async function verifyCurrentPassword(c: Context, body: Record<string, unknown>): Promise<ReauthResult> {
  const actorId = c.get("admin").sub as string;
  if (!reauthLimiter.check(actorId).ok) {
    return { ok: false, status: 429, code: "REAUTH_RATE_LIMITED", message: "尝试次数过多，请稍后再试。" };
  }
  const provided = typeof body?.currentPassword === "string" ? (body.currentPassword as string) : "";
  if (!provided) {
    return { ok: false, status: 400, code: "REAUTH_REQUIRED", message: "请输入当前密码。", field: "currentPassword" };
  }
  const actor = await prisma.adminUser.findUnique({ where: { id: actorId }, select: { passwordHash: true } });
  if (!actor) return { ok: false, status: 401, code: "UNAUTHORIZED", message: "登录状态已失效，请重新登录。" };
  let matched = false;
  try {
    matched = await verifyPassword(provided, actor.passwordHash);
  } catch (error) {
    if (error instanceof ScryptBusyError) {
      return { ok: false, status: 503, code: "BUSY", message: "系统繁忙，请稍后再试。" };
    }
    throw error;
  }
  if (!matched) {
    reauthLimiter.hit(actorId);
    return { ok: false, status: 403, code: "REAUTH_FAILED", message: "当前密码不正确。", field: "currentPassword" };
  }
  return { ok: true };
}

export function registerAccounts(app: Hono<any>) {
  // ── 列表 ─────────────────────────────────────────────
  app.get("/accounts", async (c: Context) => {
    const rows = await prisma.adminUser.findMany({
      select: {
        id: true,
        username: true,
        role: true,
        disabled: true,
        createdAt: true,
        lastLoginAt: true,
        mustChangePassword: true,
      },
      orderBy: [{ createdAt: "asc" }, { id: "asc" }],
    });
    return c.json({ items: rows.map(accountView) });
  });

  // ── 新建：初始密码自己填或由服务端生成，生成的只在这次响应里出现 ──
  app.post("/accounts", async (c: Context) => {
    const body = (await c.req.json().catch(() => ({}))) as Record<string, unknown>;
    const usernameR = validateUsername(body?.username);
    if (!usernameR.ok) return fail(c, 400, "INVALID_NAME", usernameR.message, "username");
    if (!isAdminRole(body?.role)) return fail(c, 400, "INVALID_ROLE", "角色只能是 admin 或 operator。", "role");

    const role = body.role as AdminRole;
    // 造管理员要先验证操作者自己的口令（严格模式必填）
    if (role === "admin") {
      const reauth = await verifyCurrentPassword(c, body);
      if (!reauth.ok) return fail(c, reauth.status, reauth.code, reauth.message, reauth.field);
    }

    let initialPassword: string | undefined;
    let passwordHash: string;
    if (body?.password === undefined || body?.password === null || body?.password === "") {
      initialPassword = generatePassword();
      passwordHash = await hashPassword(initialPassword);
    } else {
      const passwordR = validatePassword(body.password);
      if (!passwordR.ok) return fail(c, 400, "WEAK_PASSWORD", passwordR.message, "password");
      passwordHash = await hashPassword(passwordR.value);
    }

    let created: AccountRow;
    try {
      created = await prisma.adminUser.create({
        // 新建的账号一律要求首次登录后改密
        data: { username: usernameR.value, role, passwordHash, mustChangePassword: true },
        select: {
          id: true,
          username: true,
          role: true,
          disabled: true,
          createdAt: true,
          lastLoginAt: true,
          mustChangePassword: true,
        },
      });
    } catch (error) {
      // 并发建同一个名字：Prisma P2002，别让唯一约束变成 500
      if ((error as { code?: string }).code === "P2002") {
        return fail(c, 409, "USERNAME_EXISTS", "这个用户名已经存在了。", "username");
      }
      throw error;
    }
    // 审计里只有用户名和角色，**不写密码、不写哈希**
    audit({
      actor: c.get("admin").username,
      action: "account.create",
      target: created.username,
      detail: { role, generated: Boolean(initialPassword) },
    });
    return c.json({ account: accountView(created), ...(initialPassword ? { initialPassword } : {}) }, 201);
  });

  // ── 改角色 / 停用启用（改完下一个请求就按新角色） ──
  app.patch("/accounts/:id", async (c: Context) => {
    const id = c.req.param("id");
    const body = (await c.req.json().catch(() => ({}))) as Record<string, unknown>;

    if (body?.role !== undefined && !isAdminRole(body.role)) {
      return fail(c, 400, "INVALID_ROLE", "角色只能是 admin 或 operator。", "role");
    }
    if (body?.disabled !== undefined && typeof body.disabled !== "boolean") {
      return fail(c, 400, "BAD_REQUEST", "disabled 只能是 true 或 false。", "disabled");
    }
    const nextRole = isAdminRole(body?.role) ? (body.role as AdminRole) : undefined;
    const nextDisabled = typeof body?.disabled === "boolean" ? body.disabled : undefined;
    if (nextRole === undefined && nextDisabled === undefined) {
      return fail(c, 400, "NO_CHANGES", "没有可更新的字段。");
    }
    // 操作自己一律拒绝：不允许停用、降级自己
    if (id === c.get("admin").sub) {
      return fail(c, 409, "CANNOT_MODIFY_SELF", "不能修改自己的角色或状态，请用其他管理员账号操作。");
    }
    // 把别人提成管理员之前，先验证操作者自己的口令
    if (nextRole === "admin") {
      const reauth = await verifyCurrentPassword(c, body);
      if (!reauth.ok) return fail(c, reauth.status, reauth.code, reauth.message, reauth.field);
    }

    let result: { status: number; body: unknown } | null = null;
    await withConfigLock(async () => {
      const target = await prisma.adminUser.findUnique({ where: { id } });
      if (!target) {
        result = { status: 404, body: { error: { code: "ACCOUNT_NOT_FOUND", message: "没有找到这个账号。" } } };
        return;
      }
      const data: { role?: string; disabled?: boolean } = {};
      if (nextRole !== undefined && nextRole !== target.role) data.role = nextRole;
      if (nextDisabled !== undefined && nextDisabled !== target.disabled) data.disabled = nextDisabled;

      // 这次改动会不会让「启用的管理员」少一个：降级或停用都算
      const losesAdmin =
        target.role === "admin" &&
        !target.disabled &&
        ((data.role !== undefined && data.role !== "admin") || data.disabled === true);
      if (losesAdmin) {
        const remaining = await countEnabledAdmins(target.id);
        if (remaining === 0) {
          result = {
            status: 409,
            body: { error: { code: "LAST_ADMIN", message: "系统至少要保留一个启用的管理员。" } },
          };
          return;
        }
      }

      if (Object.keys(data).length === 0) {
        result = { status: 200, body: { account: accountView(target) } };
        return;
      }
      const updated = await prisma.adminUser.update({
        where: { id },
        // 停用时吊销已签发的 token，重新启用后旧 token 也不会复活
        data: data.disabled ? { ...data, tokenVersion: { increment: 1 } } : data,
        select: {
          id: true,
          username: true,
          role: true,
          disabled: true,
          createdAt: true,
          lastLoginAt: true,
          mustChangePassword: true,
        },
      });
      // 改角色、停用启用各写一条——一个请求同时改两件就记两条事件
      if (data.role !== undefined) {
        audit({
          actor: c.get("admin").username,
          action: "account.role",
          target: updated.username,
          detail: { role: data.role, previousRole: normaliseRole(target.role) },
        });
      }
      if (data.disabled !== undefined) {
        audit({
          actor: c.get("admin").username,
          action: data.disabled ? "account.disable" : "account.enable",
          target: updated.username,
          detail: { disabled: data.disabled },
        });
      }
      result = { status: 200, body: { account: accountView(updated) } };
    });
    const done = result as { status: number; body: unknown } | null;
    if (!done) return fail(c, 500, "INTERNAL", "账号更新失败，请重试。");
    return c.json(done.body as any, done.status as any);
  });

  // ── 重置密码：旧 token 立刻失效（tokenVersion +1） ──
  app.post("/accounts/:id/reset-password", async (c: Context) => {
    const id = c.req.param("id");
    // 重置不用验目标账号的旧密码，但不能用在自己身上：改自己的密码走 /auth/password
    if (id === c.get("admin").sub) return fail(c, 409, "CANNOT_MODIFY_SELF", "不能重置自己的密码，请在「我的账号」里修改。");
    const body = (await c.req.json().catch(() => ({}))) as Record<string, unknown>;
    // 重置别人之前先验证操作者自己的口令，校验不通过不产生任何写入
    const reauth = await verifyCurrentPassword(c, body);
    if (!reauth.ok) return fail(c, reauth.status, reauth.code, reauth.message, reauth.field);

    let initialPassword: string | undefined;
    let passwordHash: string;
    if (body?.password === undefined || body?.password === null || body?.password === "") {
      initialPassword = generatePassword();
      passwordHash = await hashPassword(initialPassword);
    } else {
      const passwordR = validatePassword(body.password);
      if (!passwordR.ok) return fail(c, 400, "WEAK_PASSWORD", passwordR.message, "password");
      passwordHash = await hashPassword(passwordR.value);
    }

    const target = await prisma.adminUser.findUnique({ where: { id } });
    if (!target) return fail(c, 404, "ACCOUNT_NOT_FOUND", "没有找到这个账号。");
    await prisma.adminUser.update({
      where: { id },
      // 重置后目标账号必须先改密才能用其它接口
      data: { passwordHash, tokenVersion: { increment: 1 }, mustChangePassword: true },
    });
    // 审计不含密码与哈希
    audit({
      actor: c.get("admin").username,
      action: "account.reset_password",
      target: target.username,
      detail: { generated: Boolean(initialPassword) },
    });
    return c.json(initialPassword ? { initialPassword } : {});
  });

  // ── 删除（不能删自己，也不能删掉最后一个启用的管理员） ──
  app.delete("/accounts/:id", async (c: Context) => {
    const id = c.req.param("id");
    if (id === c.get("admin").sub) {
      return fail(c, 409, "CANNOT_MODIFY_SELF", "不能删除当前登录的账号。");
    }

    let result: { status: number; body?: unknown } | null = null;
    await withConfigLock(async () => {
      const target = await prisma.adminUser.findUnique({ where: { id } });
      if (!target) {
        result = { status: 404, body: { error: { code: "ACCOUNT_NOT_FOUND", message: "没有找到这个账号。" } } };
        return;
      }
      if (target.role === "admin" && !target.disabled) {
        const remaining = await countEnabledAdmins(target.id);
        if (remaining === 0) {
          result = {
            status: 409,
            body: { error: { code: "LAST_ADMIN", message: "系统至少要保留一个启用的管理员。" } },
          };
          return;
        }
      }
      await prisma.adminUser.delete({ where: { id } });
      // AuditLog 没有指向 AdminUser 的外键，账号删了历史记录仍然在
      audit({
        actor: c.get("admin").username,
        action: "account.delete",
        target: target.username,
        detail: { role: normaliseRole(target.role) },
      });
      result = { status: 204 };
    });
    const done = result as { status: number; body?: unknown } | null;
    if (!done) return fail(c, 500, "INTERNAL", "账号删除失败，请重试。");
    if (done.status === 204) return c.body(null, 204);
    return c.json(done.body as any, done.status as any);
  });
}
