// 后台会话：Hono 内置的 jwt 实现 + 极小的封装。
// 不引第三方库；密钥来自 ADMIN_JWT_SECRET，缺省时启动即报错（不允许静默使用弱密钥）。
// token 带 aud="admin" 与 iat，校验时强制 aud——购物端的 token 在这里一律不认。
import { sign, verify } from "hono/jwt";

export const ADMIN_AUDIENCE = "admin";

export interface AdminClaims {
  sub: string;
  username: string;
  /** token 版本号：与库里 AdminUser.tokenVersion 不一致即失效（改密后旧 token 全废） */
  ver: number;
  /** 签发时间（秒） */
  iat: number;
  /** 只接受后台签发的 token */
  aud: string;
  exp: number;
}

/** 有效期从 24 小时改成 12 小时，不做刷新 */
const HOUR = 60 * 60;
const TTL_SECONDS = 12 * HOUR;

function secret(): string {
  const value = process.env.ADMIN_JWT_SECRET;
  if (!value || value.length < 16) {
    throw new Error("ADMIN_JWT_SECRET 未配置或过短（至少 16 字符）");
  }
  return value;
}

export async function issueToken(user: { id: string; username: string; tokenVersion?: number }): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const payload: AdminClaims = {
    sub: user.id,
    username: user.username,
    ver: user.tokenVersion ?? 0,
    iat: now,
    aud: ADMIN_AUDIENCE,
    exp: now + TTL_SECONDS,
  };
  // Hono 的 JWTPayload 是索引签名，结构体要先过一层（既有写法，行为不变）
  return sign(payload as unknown as Record<string, unknown>, secret());
}

export async function readToken(token: string): Promise<AdminClaims | null> {
  try {
    const payload = (await verify(token, secret(), "HS256")) as unknown as AdminClaims;
    // 老 token 没有 aud：一律不认，重新登录一次即可
    if (!payload?.username || payload.aud !== ADMIN_AUDIENCE) return null;
    // 老 token 没有 ver 字段，按 0 处理（与库里默认值一致，不会被强制下线）
    return { ...payload, ver: Number(payload.ver ?? 0), iat: Number(payload.iat ?? 0) };
  } catch {
    return null;
  }
}

export function bearer(header: string | undefined): string | null {
  if (!header) return null;
  const match = /^Bearer\s+(.+)$/i.exec(header.trim());
  return match ? match[1] : null;
}
