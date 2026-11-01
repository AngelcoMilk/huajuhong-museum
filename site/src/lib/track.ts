// 前台埋点：page_view / page_leave / click，批量节流上报。
// 只上报匿名 id 与路由；IP 由服务端从连接信息脱敏后记录。
const KEY = "hjh-visitor-id";
const ENDPOINT = "/api/track";
const FLUSH_MS = 5000;

type TrackEvent = {
  visitorId: string;
  kind: "page_view" | "page_leave" | "click";
  route: string;
  targetId?: string;
  durationMs?: number;
};

let queue: TrackEvent[] = [];
let timer: ReturnType<typeof setTimeout> | null = null;

function visitorId(): string {
  try {
    const existing = localStorage.getItem(KEY);
    if (existing) return existing;
    const id = (crypto as any).randomUUID?.() ?? `v-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    localStorage.setItem(KEY, id);
    return id;
  } catch {
    return "anonymous";
  }
}

function flush(useBeacon = false) {
  if (queue.length === 0) return;
  const events = queue.slice(0, 50);
  queue = queue.slice(events.length);
  const body = JSON.stringify({ events });
  try {
    if (useBeacon && navigator.sendBeacon) {
      navigator.sendBeacon(ENDPOINT, new Blob([body], { type: "application/json" }));
      return;
    }
    void fetch(ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* 埋点失败不影响页面 */
  }
}

function schedule() {
  if (timer) return;
  timer = setTimeout(() => {
    timer = null;
    flush();
  }, FLUSH_MS);
}

function push(event: Omit<TrackEvent, "visitorId">) {
  queue.push({ ...event, visitorId: visitorId() });
  if (queue.length >= 20) flush();
  else schedule();
}

/** 页面级：进入记录开始时间，离开时补一条带时长的 page_leave */
export function trackPageView(route: string, targetId?: string): () => void {
  if (route.startsWith("/admin")) return () => {};
  const startedAt = Date.now();
  push(targetId ? { kind: "page_view", route, targetId } : { kind: "page_view", route });

  const leave = () => {
    push({ kind: "page_leave", route, durationMs: Date.now() - startedAt });
    flush(true);
  };
  const onHide = () => {
    if (document.visibilityState === "hidden") leave();
  };
  window.addEventListener("pagehide", leave);
  document.addEventListener("visibilitychange", onHide);
  return () => {
    window.removeEventListener("pagehide", leave);
    document.removeEventListener("visibilitychange", onHide);
    leave();
  };
}

/** 条目级：看了哪一件展品（产品详情、藏品弹层、园区栏目、企业），后台「展项热度」按它统计 */
export function trackItem(targetId: string) {
  push({ kind: "page_view", route: location.pathname, targetId });
}

/** 元素级：给带 data-track 的元素挂点击上报 */
export function initClickTracking(): () => void {
  const onClick = (event: MouseEvent) => {
    const target = (event.target as HTMLElement | null)?.closest("[data-track]") as HTMLElement | null;
    if (!target) return;
    push({ kind: "click", route: location.pathname, targetId: target.dataset.track || "" });
  };
  document.addEventListener("click", onClick, true);
  return () => document.removeEventListener("click", onClick, true);
}

export function flushTracking() {
  flush(true);
}
