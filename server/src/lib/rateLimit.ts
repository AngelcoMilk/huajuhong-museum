// 滑动窗口限流（公共件）：纯内存、零依赖，key 数有上界。
// check 只看不计数，hit 计一次，reset 立刻清掉一个 key（登录成功时用）。
export interface LimiterOptions {
  windowMs: number;
  max: number;
  /** key 的数量上限，超了淘汰最久没被用到的（默认 10000） */
  maxKeys?: number;
}

export interface LimiterCheck {
  ok: boolean;
  /** 还要等多少秒；ok=true 时为 0 */
  retryAfterSec: number;
}

export interface Limiter {
  check(key: string): LimiterCheck;
  hit(key: string): void;
  reset(key: string): void;
}

const DEFAULT_MAX_KEYS = 10000;

export function createLimiter({ windowMs, max, maxKeys = DEFAULT_MAX_KEYS }: LimiterOptions): Limiter {
  /** key → 窗口内的命中时间戳（毫秒，升序） */
  const hits = new Map<string, number[]>();
  const limit = Math.max(1, Math.floor(max));
  const cap = Math.max(1, Math.floor(maxKeys));

  function prune(stamps: number[], now: number): number[] {
    const from = now - windowMs;
    let index = 0;
    while (index < stamps.length && stamps[index] <= from) index += 1;
    if (index > 0) stamps.splice(0, index);
    return stamps;
  }

  /** 读一个 key 并把它标成「最近用过」：Map 的插入顺序就是淘汰顺序 */
  function touch(key: string): number[] | undefined {
    const stamps = hits.get(key);
    if (stamps === undefined) return undefined;
    hits.delete(key);
    hits.set(key, stamps);
    return stamps;
  }

  function ensureRoom(): void {
    while (hits.size >= cap) {
      const oldest = hits.keys().next();
      if (oldest.done) break;
      hits.delete(oldest.value);
    }
  }

  return {
    check(key: string): LimiterCheck {
      const now = Date.now();
      const stamps = touch(key);
      if (!stamps || stamps.length === 0) return { ok: true, retryAfterSec: 0 };
      prune(stamps, now);
      if (stamps.length < limit) return { ok: true, retryAfterSec: 0 };
      // 最早那一条滑出窗口后就重新放行
      const waitMs = stamps[0] + windowMs - now;
      return { ok: false, retryAfterSec: Math.max(1, Math.ceil(waitMs / 1000)) };
    },
    hit(key: string): void {
      const now = Date.now();
      let stamps = touch(key);
      if (!stamps) {
        ensureRoom();
        stamps = [];
        hits.set(key, stamps);
      }
      prune(stamps, now);
      stamps.push(now);
    },
    reset(key: string): void {
      hits.delete(key);
    },
  };
}
