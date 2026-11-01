// 会话表：sessionId → Runner。内存态，进程重启即失效（当前阶段够用）。
// G3：上限 256（可配），淘汰与 TTL 清理只动**空闲**会话；全都在忙时新会话拿不到位置，由调用方回 503。
import type { Runner, RunnerFactory } from "./agent/runner.ts";
import { MAX_SESSIONS, SESSION_TTL_MS } from "./contract.ts";
import { isSessionBusy } from "./guideLimits.ts";

interface Entry {
  runner: Runner;
  lastUsed: number;
}

export class SessionStore {
  private readonly map = new Map<string, Entry>();

  private readonly ttlMs: number;
  private readonly max: number;

  constructor(ttlMs: number = SESSION_TTL_MS, max: number = MAX_SESSIONS) {
    this.ttlMs = ttlMs;
    // MAX_SESSIONS 环境变量优先，方便按内存预算调
    const fromEnv = Number((process.env.MAX_SESSIONS ?? "").trim());
    this.max = Number.isFinite(fromEnv) && fromEnv > 0 ? Math.floor(fromEnv) : max;
  }

  get size(): number {
    return this.map.size;
  }

  has(id: string): boolean {
    return this.map.has(id);
  }

  /** 已有会话直接复用；没有就新建。腾不出位置（全在忙）时返回 null */
  getOrCreate(id: string, factory: RunnerFactory): Runner | null {
    this.sweep();
    const hit = this.map.get(id);
    if (hit) {
      hit.lastUsed = Date.now();
      return hit.runner;
    }
    if (this.map.size >= this.max && !this.evictOldest()) return null;
    const runner = factory(id);
    this.map.set(id, { runner, lastUsed: Date.now() });
    return runner;
  }

  /** 结束并丢弃会话；返回是否真的存在过 */
  reset(id: string): boolean {
    const hit = this.map.get(id);
    if (!hit) return false;
    hit.runner.dispose();
    this.map.delete(id);
    return true;
  }

  disposeAll(): void {
    for (const { runner } of this.map.values()) {
      try {
        runner.dispose();
      } catch {
        /* 忽略清理异常 */
      }
    }
    this.map.clear();
  }

  /** TTL 清理：进行中的回答不动，免得把正在说话的人踢下线 */
  private sweep(): void {
    const now = Date.now();
    for (const [id, entry] of this.map) {
      if (now - entry.lastUsed <= this.ttlMs) continue;
      if (isSessionBusy(id)) continue;
      entry.runner.dispose();
      this.map.delete(id);
    }
  }

  /** 淘汰最久没用的空闲会话；一个都不空闲就返回 false（新会话拿 503） */
  private evictOldest(): boolean {
    let oldestId: string | undefined;
    let oldest = Infinity;
    for (const [id, entry] of this.map) {
      if (isSessionBusy(id)) continue;
      if (entry.lastUsed < oldest) {
        oldest = entry.lastUsed;
        oldestId = id;
      }
    }
    if (oldestId === undefined) return false;
    this.map.get(oldestId)?.runner.dispose();
    this.map.delete(oldestId);
    return true;
  }
}
