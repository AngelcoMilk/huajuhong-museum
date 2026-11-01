// 操作留痕：谁在什么时候动了什么。写失败不影响主流程。
// actor 去控制字符并截到 64 字；写库失败时追加到 server/logs/audit-fallback.log。
import { appendFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { prisma } from "../db.ts";

export interface AuditInput {
  actor: string;
  action: string;
  target: string;
  detail?: unknown;
}

/** detailJson 上限：SQLite 里不必存大块，但**绝不能切出半截 JSON**（读侧会解析失败） */
const MAX_DETAIL_CHARS = 4000;
/** actor 上限：请求体里的用户名是外部输入，可能超长或带控制字符 */
const MAX_ACTOR_CHARS = 64;

const SERVER_ROOT = join(import.meta.dirname, "..", "..");
const FALLBACK_DIR = join(SERVER_ROOT, "logs");
const FALLBACK_FILE = join(FALLBACK_DIR, "audit-fallback.log");

/** 超长时改存摘要：数组记条数 + 前几条，字符串截短，其余原样 */
function summarise(detail: unknown): unknown {
  if (Array.isArray(detail)) {
    return { truncated: true, type: "array", count: detail.length, sample: detail.slice(0, 5) };
  }
  if (detail && typeof detail === "object") {
    const out: Record<string, unknown> = { truncated: true, type: "object" };
    for (const [key, value] of Object.entries(detail as Record<string, unknown>)) {
      if (Array.isArray(value)) out[key] = { count: value.length, sample: value.slice(0, 5) };
      else if (typeof value === "string") out[key] = value.length > 120 ? `${value.slice(0, 120)}…` : value;
      else out[key] = value;
    }
    return out;
  }
  return { truncated: true, preview: String(detail).slice(0, 200) };
}

/** 序列化 detail：优先原文，超长改摘要，摘要仍超长就只留说明——结果永远是合法 JSON */
function serialiseDetail(detail: unknown): string | null {
  if (detail === undefined || detail === null) return null;
  const full = JSON.stringify(detail);
  if (full.length <= MAX_DETAIL_CHARS) return full;
  const summary = JSON.stringify(summarise(detail));
  if (summary.length <= MAX_DETAIL_CHARS) return summary;
  return JSON.stringify({ truncated: true, note: "detail 过大，已丢弃", originalChars: full.length });
}

/** actor 来自请求体，可能是任意 JSON 字符串：去掉控制字符、截到 64 字 */
function cleanActor(value: unknown): string {
  const text = typeof value === "string" ? value : value === undefined || value === null ? "" : String(value);
  const cleaned = text.replace(/[\u0000-\u001f\u007f-\u009f]/g, "").trim();
  return cleaned ? cleaned.slice(0, MAX_ACTOR_CHARS) : "unknown";
}

/** 写库失败时落到本地文件，别再抛错影响主流程；这里只写动作与目标，不写口令/哈希 */
function fallbackToFile(input: AuditInput, error: unknown): void {
  const line = `${JSON.stringify({
    at: new Date().toISOString(),
    action: input.action,
    actor: cleanActor(input.actor),
    target: input.target.slice(0, 500),
    error: String((error as { message?: string })?.message ?? error),
  })}\n`;
  void mkdir(FALLBACK_DIR, { recursive: true })
    .then(() => appendFile(FALLBACK_FILE, line))
    .catch((nested) => console.error("[audit] 兜底日志也写不了:", nested));
}

export function audit(input: AuditInput): void {
  void prisma.auditLog
    .create({
      data: {
        actor: cleanActor(input.actor),
        action: input.action,
        target: input.target.slice(0, 500),
        detailJson: serialiseDetail(input.detail),
      },
    })
    .catch((error) => {
      console.error("[audit] 写日志失败:", error);
      fallbackToFile(input, error);
    });
}
