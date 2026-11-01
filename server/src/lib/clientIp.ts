// 客户端 IP（公共件）：默认只信 socket 地址，完全不看 X-Forwarded-For / X-Real-IP。
// 只有显式配置 TRUST_PROXY_HOPS=N（N≥1，前面确实有反向代理）时，才取 XFF 从右数第 N 个。
import { getConnInfo } from "@hono/node-server/conninfo";
import type { Context } from "hono";

/** 代理层数：默认 0（不信任何转发头）；非法值按 0 处理 */
function trustProxyHops(): number {
  const raw = (process.env.TRUST_PROXY_HOPS ?? "").trim();
  const value = Number(raw);
  return Number.isInteger(value) && value > 0 ? value : 0;
}

/** socket 地址；app.request() 这类内存调用没有 socket，返回 "unknown"（不抛错） */
function socketAddress(c: Context): string {
  try {
    const info = getConnInfo(c);
    const address = info?.remote?.address;
    return typeof address === "string" && address ? address : "unknown";
  } catch {
    return "unknown";
  }
}

/**
 * 取客户端 IP。hops=0：只用 socket 地址，伪造 XFF 无效。
 * hops=N≥1：XFF 从右数第 N 个（最右边是我方最后一跳写入的），取不到就回落到 socket 地址。
 */
export function clientIp(c: Context): string {
  const hops = trustProxyHops();
  if (hops > 0) {
    const header = c.req.header("x-forwarded-for");
    if (header) {
      const parts = header
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
      const picked = parts[parts.length - hops];
      if (picked) return picked;
    }
  }
  return socketAddress(c);
}
