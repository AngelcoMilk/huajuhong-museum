// G2：会话 id 由服务端签发并签名，客户端不能自己编。
// 形如 "<uuid>.<过期时间36进制>.<HMAC>"。这串本身就是凭证：
// **不要写进日志、不要整串入库**，入库和内存表都只用 uuid 段。
import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";

/** 会话凭证有效期 24 小时 */
const TTL_MS = 24 * 60 * 60 * 1000;

/** 没配 GUIDE_SESSION_SECRET 就回落 ADMIN_JWT_SECRET；都没有就用进程内随机（重启失效） */
let fallback: string | null = null;
function secret(): string {
  const configured = process.env.GUIDE_SESSION_SECRET || process.env.ADMIN_JWT_SECRET;
  if (configured) return configured;
  if (!fallback) fallback = randomUUID().replace(/-/g, "") + randomUUID().replace(/-/g, "");
  return fallback;
}

function sign(body: string): string {
  return createHmac("sha256", secret()).update(body).digest("hex");
}

/** 签一个新会话 id */
export function issueSessionId(now = Date.now()): string {
  const uuid = randomUUID();
  const exp = Math.floor((now + TTL_MS) / 1000).toString(36);
  const body = `${uuid}.${exp}`;
  return `${body}.${sign(body)}`;
}

export interface VerifiedSession {
  /** 内存表与数据库用的键：只是 uuid 那一段 */
  key: string;
}

function splitOnce(value: string): string[] {
  return value.split(".");
}

/**
 * 校验会话 id：必须是三段、签名对得上、没过期，否则 null。
 * 不带点号（旧前端/手编的 id）一律拒绝——阶段二已不再有兼容分支。
 */
export function verifySessionId(raw: string, now = Date.now()): VerifiedSession | null {
  const value = raw.trim();
  if (!value) return null;
  if (!value.includes(".")) return null;
  const parts = splitOnce(value);
  if (parts.length !== 3) return null;
  const [uuid, exp36, mac] = parts;
  if (!uuid || !exp36 || !mac) return null;

  const expected = Buffer.from(sign(`${uuid}.${exp36}`), "hex");
  const actual = Buffer.from(mac, "hex");
  if (expected.length !== actual.length) return null;
  if (!timingSafeEqual(expected, actual)) return null;

  const expSec = Number.parseInt(exp36, 36);
  if (!Number.isFinite(expSec) || expSec * 1000 <= now) return null;
  return { key: uuid };
}

/** 给 done 事件原样回传用：校验通过就把客户端那串还回去，不再重新签发 */
export function echoRaw(raw: string): string {
  return raw.trim();
}
