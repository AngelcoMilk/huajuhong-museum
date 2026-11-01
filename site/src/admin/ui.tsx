// 后台通用 UI 小组件与格式化工具。
import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { useBlocker } from "react-router";
import { ChevronDown, ChevronLeft, ChevronRight, FolderOpen, PlugZap, TriangleAlert, X } from "lucide-react";
import { ApiError } from "./api";
import { forwardPointer, Glass, useSlidingThumb } from "./glass";

export function money(cents: number): string {
  return `¥${(cents / 100).toFixed(2)}`;
}

export function dateTime(ms: number | null | undefined): string {
  if (!ms) return "—";
  const d = new Date(ms);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function relative(ms: number | null | undefined): string {
  if (!ms) return "—";
  const diff = Date.now() - ms;
  if (diff < 60_000) return "刚刚";
  if (diff < 3600_000) return `${Math.floor(diff / 60_000)} 分钟前`;
  if (diff < 86400_000) return `${Math.floor(diff / 3600_000)} 小时前`;
  return `${Math.floor(diff / 86400_000)} 天前`;
}

export function compact(n: number): string {
  const trim = (value: number, digits: number) => value.toFixed(digits).replace(/\.0$/, "");
  if (n >= 100_000_000) return `${trim(n / 100_000_000, 1)}亿`;
  if (n >= 10000) return `${trim(n / 10000, n >= 1_000_000 ? 0 : 1)}万`;
  return n.toLocaleString("en-US");
}

/* ── 数据加载 ───────────────────────────────────────── */
export /** 会话的 page 字段有的是路径，有的是埋点存的 JSON（{"route":"/park"}） */
function pageLabel(page: string | null): string {
  if (!page) return "未知页面";
  try {
    const parsed = JSON.parse(page);
    if (typeof parsed?.route === "string") return parsed.route;
  } catch {
    /* 不是 JSON，就是路径本身 */
  }
  return page;
}

export interface AsyncState<T> {
  data: T | null;
  error: string | null;
  /** 后端路由还不存在（并行开发中）：显示「接口未就绪」，不算真错误 */
  notReady: boolean;
  loading: boolean;
  reload: () => void;
  /** 就地改缓存，不触发加载态（批量操作后用） */
  mutate: (fn: (prev: T) => T) => void;
}

export function useAsync<T>(loader: () => Promise<T>, deps: unknown[] = []): AsyncState<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notReady, setNotReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tick, setTick] = useState(0);
  const alive = useRef(true);
  // 边输边筛时响应可能乱序：只认最后一次请求
  const latest = useRef(0);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  useEffect(() => {
    const ticket = ++latest.current;
    const current = () => alive.current && ticket === latest.current;
    setLoading(true);
    loader()
      .then((value) => {
        if (!current()) return;
        setData(value);
        setError(null);
        setNotReady(false);
      })
      .catch((err: Error) => {
        if (!current()) return;
        setError(err.message);
        setNotReady(err instanceof ApiError && (err.status === 404 || err.status === 501));
      })
      .finally(() => {
        if (current()) setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick]);

  const reload = useCallback(() => setTick((n) => n + 1), []);
  const mutate = useCallback((fn: (prev: T) => T) => setData((prev) => (prev === null ? prev : fn(prev))), []);
  return { data, error, notReady, loading, reload, mutate };
}

/* ── Toast（可带撤销） ──────────────────────────────── */
interface ToastOptions {
  action?: { label: string; run: () => void };
  /** 毫秒；带操作的默认 5 秒，普通 2.8 秒 */
  duration?: number;
}
type ToastListener = (message: string, options: ToastOptions) => void;
const toastListeners = new Set<ToastListener>();

export function toast(message: string, options: ToastOptions = {}) {
  toastListeners.forEach((fn) => fn(message, options));
}

export function Toaster() {
  const [queue, setQueue] = useState<Array<{ id: number; text: string; action?: ToastOptions["action"] }>>([]);
  useEffect(() => {
    const listener: ToastListener = (text, options) => {
      const id = Date.now() + Math.random();
      // 同屏最多 3 条，玻璃层不能无限堆
      setQueue((prev) => [...prev.slice(-2), { id, text, action: options.action }]);
      setTimeout(() => setQueue((prev) => prev.filter((t) => t.id !== id)), options.duration ?? (options.action ? 5000 : 2800));
    };
    toastListeners.add(listener);
    return () => {
      toastListeners.delete(listener);
    };
  }, []);
  if (queue.length === 0) return null;
  return (
    <div className="toasts">
      {queue.map((t) => (
        <Glass className="toast" key={t.id} role="status" reading>
          <span>{t.text}</span>
          {t.action && (
            <>
              <span className="toast__sep" aria-hidden="true">·</span>
              <button
                type="button"
                onClick={() => {
                  setQueue((prev) => prev.filter((other) => other.id !== t.id));
                  t.action?.run();
                }}
              >
                {t.action.label}
              </button>
            </>
          )}
        </Glass>
      ))}
    </div>
  );
}

/* ── 结构组件 ───────────────────────────────────────── */
export function Card({
  title,
  icon,
  actions,
  children,
  flush,
  className,
}: {
  title?: ReactNode;
  icon?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  flush?: boolean;
  className?: string;
}) {
  return (
    <section className={["card", flush && "flush", className].filter(Boolean).join(" ")}>
      {(title || actions) && (
        <div className="card-head">
          {title && (
            <div className="card-head__title">
              {icon && <span className="icon-badge">{icon}</span>}
              <h2>{title}</h2>
            </div>
          )}
          {actions && <div className="actions">{actions}</div>}
        </div>
      )}
      {children}
    </section>
  );
}

export function Stat({ label, value, unit, accent }: { label: string; value: ReactNode; unit?: string; accent?: boolean }) {
  return (
    <div className={accent ? "stat accent" : "stat"}>
      <div className="k">{label}</div>
      <div className="v">
        {value}
        {unit && <small>{unit}</small>}
      </div>
    </div>
  );
}

/** 空状态：插画式图标 + 一句话 + 主操作 */
export function Empty({ children, icon, action, compact: small }: { children: ReactNode; icon?: ReactNode; action?: ReactNode; compact?: boolean }) {
  return (
    <div className={small ? "state state--compact" : "state"}>
      <div className="state__art">{icon ?? <FolderOpen size={small ? 28 : 40} strokeWidth={1.5} aria-hidden />}</div>
      <div className="state__text">{children}</div>
      {action}
    </div>
  );
}

/** 出错：说清楚 + 重试 */
export function ErrorState({ message, onRetry, compact: small }: { message: string; onRetry?: () => void; compact?: boolean }) {
  return (
    <div className={small ? "state state--bad state--compact" : "state state--bad"} role="alert">
      <div className="state__art">
        <TriangleAlert size={small ? 28 : 40} strokeWidth={1.5} aria-hidden />
      </div>
      <div className="state__text">{message}</div>
      {onRetry && (
        <button type="button" className="btn btn-sm" onClick={onRetry}>
          重试
        </button>
      )}
    </div>
  );
}

/** 后端接口还没上线时的占位：绝不写假数据 */
export function NotReady({ onRetry, compact: small }: { onRetry?: () => void; compact?: boolean }) {
  return (
    <Empty
      compact={small}
      icon={<PlugZap size={small ? 28 : 40} strokeWidth={1.5} aria-hidden />}
      action={
        onRetry && (
          <button type="button" className="btn btn-sm" onClick={onRetry}>
            重试
          </button>
        )
      }
    >
      暂时无法使用
    </Empty>
  );
}

/** 单个区块的加载/未就绪/出错分支：返回 null 表示可以渲染数据 */
export function asyncGate<T>(state: AsyncState<T>, options: { compact?: boolean; skeleton?: ReactNode } = {}): ReactNode | null {
  if (state.notReady) return <NotReady onRetry={state.reload} compact={options.compact} />;
  if (state.error) return <ErrorState message={state.error} onRetry={state.reload} compact={options.compact} />;
  if (!state.data) return options.skeleton ?? <Skeleton rows={3} />;
  return null;
}

export function Skeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div style={{ display: "grid", gap: 12 }} aria-busy="true">
      {Array.from({ length: rows }).map((_, i) => (
        <span className="skeleton" key={i} style={{ width: `${92 - i * 14}%` }} />
      ))}
    </div>
  );
}

export function Loading({ rows = 3 }: { rows?: number }) {
  return (
    <div className="card" aria-busy="true">
      <Skeleton rows={rows} />
    </div>
  );
}

export function ErrorBar({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="banner bad" role="alert">
      <span>{message}</span>
      {onRetry && (
        <button className="btn btn-sm" style={{ marginLeft: "auto" }} onClick={onRetry}>
          重试
        </button>
      )}
    </div>
  );
}

/** 表单项：标签在上；说明 12px 灰字、校验错误都在字段下面 */
export function Field({ label, hint, error, children }: { label: string; hint?: string; error?: string | null; children: ReactNode }) {
  const id = useId();
  const only = Children.count(children) === 1 && isValidElement(children) ? (children as ReactElement<Record<string, unknown>>) : null;
  const native = only && typeof only.type === "string";
  return (
    <div className="field">
      <label htmlFor={native ? id : undefined}>{label}</label>
      {native ? cloneElement(only, { id, "aria-invalid": error ? true : only.props["aria-invalid"] }) : children}
      {hint && <span className="field__hint">{hint}</span>}
      {error && (
        <span className="field__error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}

export const PageHeadSlot = createContext<HTMLElement | null>(null);

/** 放到页面标题同一行，比如页面的分段切换 */
export function PageHeadExtra({ children }: { children: ReactNode }) {
  const slot = useContext(PageHeadSlot);
  return slot ? createPortal(children, slot) : null;
}

/** 分段控件：滑块是一块着色玻璃，高光跟指针 */
export function Segmented<T extends string>({
  value,
  onChange,
  options,
  size = "sm",
  label,
}: {
  value: T;
  onChange: (value: T) => void;
  options: Array<{ value: T; label: string; icon?: ReactNode }>;
  size?: "sm" | "md";
  label: string;
}) {
  const track = useRef<HTMLDivElement | null>(null);
  const thumb = useRef<HTMLSpanElement | null>(null);
  useSlidingThumb(track, thumb, '[aria-checked="true"]', [value, options.length]);

  function onKeyDown(event: ReactKeyboardEvent) {
    const step = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    const at = options.findIndex((o) => o.value === value);
    const next = options[(at + step + options.length) % options.length];
    onChange(next.value);
    requestAnimationFrame(() => track.current?.querySelector<HTMLElement>('[aria-checked="true"]')?.focus());
  }

  return (
    <div
      ref={track}
      className={size === "md" ? "segmented segmented--md" : "segmented"}
      role="radiogroup"
      aria-label={label}
      onPointerMove={(e) => forwardPointer(e, thumb.current)}
      onKeyDown={onKeyDown}
    >
      <span ref={thumb} className="glass-thumb segmented__thumb" aria-hidden="true" />
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={option.value === value}
          tabIndex={option.value === value ? 0 : -1}
          onClick={() => onChange(option.value)}
        >
          {option.icon}
          {option.label}
        </button>
      ))}
    </div>
  );
}

/** 焦点陷阱：抽屉/弹层打开时把 Tab 圈在里面，关闭后焦点回到触发元素 */
function useFocusTrap(active: boolean, ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!active || !ref.current) return;
    const node = ref.current;
    const previous = document.activeElement as HTMLElement | null;
    const focusables = () =>
      Array.from(
        node.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => el.offsetParent !== null);
    focusables()[0]?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const list = focusables();
      if (list.length === 0) return;
      const first = list[0];
      const last = list[list.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    node.addEventListener("keydown", onKey);
    return () => {
      node.removeEventListener("keydown", onKey);
      previous?.focus?.();
    };
  }, [active, ref]);
}

/* ── 弹层层级：Esc 只关最上面那一层 ─────────────────── */
// 三层弹层（Drawer / Sheet / Confirm）都会监听 document 的 keydown，
// 不加栈的话一次 Esc 会同时关掉全部，编辑中的内容直接丢。
const dialogLayers: symbol[] = [];

function useDialogLayer(active = true): symbol {
  const [id] = useState(() => Symbol("layer"));
  useEffect(() => {
    if (!active) return;
    dialogLayers.push(id);
    return () => {
      const at = dialogLayers.lastIndexOf(id);
      if (at >= 0) dialogLayers.splice(at, 1);
    };
  }, [active, id]);
  return id;
}

function isTopDialog(id: symbol): boolean {
  return dialogLayers[dialogLayers.length - 1] === id;
}

/** 确认对话框（alert 形态）：危险操作先问一句 */
export function Confirm({
  open,
  title,
  desc,
  confirmText = "确认",
  danger,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  desc?: string;
  confirmText?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const layer = useDialogLayer(open);
  useFocusTrap(open, ref);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || !isTopDialog(layer)) return;
      onCancel();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;
  const host = document.querySelector(".admin-root") ?? document.body;
  return createPortal(
    <>
      <div className="scrim" style={{ zIndex: 70 }} onClick={onCancel} />
      <div className="dialog-wrap">
        <Glass className="dialog" reading refract role="alertdialog" aria-modal="true" aria-label={title} ref={ref}>
          <h3>{title}</h3>
          {desc && <p>{desc}</p>}
          <div className="dialog__actions">
            <button type="button" className="btn" onClick={onCancel}>
              取消
            </button>
            <button type="button" className={danger ? "btn btn-danger-filled" : "btn btn-filled"} onClick={onConfirm}>
              {confirmText}
            </button>
          </div>
        </Glass>
      </div>
    </>,
    host,
  );
}

export const PAGE_SIZES = [20, 50, 100];

/** 分页：共 N 条 + 每页条数 + 页码跳转。旧页面不传 onPageSize 时只显示翻页 */
export function Pager({
  page,
  totalPages,
  total,
  pageSize,
  onChange,
  onPageSize,
}: {
  page: number;
  totalPages: number;
  total?: number;
  pageSize?: number;
  onChange: (page: number) => void;
  onPageSize?: (size: number) => void;
}) {
  const [jump, setJump] = useState(String(page));
  useEffect(() => setJump(String(page)), [page]);

  function commitJump() {
    const target = Number.parseInt(jump, 10);
    if (!Number.isFinite(target)) {
      setJump(String(page));
      return;
    }
    const clamped = Math.min(Math.max(1, target), totalPages);
    setJump(String(clamped));
    if (clamped !== page) onChange(clamped);
  }

  return (
    <div className="pager">
      {total !== undefined && (
        <span>
          共 <b className="mono">{total}</b> 条
        </span>
      )}
      {onPageSize && (
        <select className="select" aria-label="每页条数" value={pageSize} onChange={(e) => onPageSize(Number(e.target.value))}>
          {PAGE_SIZES.map((size) => (
            <option key={size} value={size}>
              {size} 条/页
            </option>
          ))}
        </select>
      )}
      <div className="pager__right">
        <button type="button" className="icon-btn" aria-label="上一页" disabled={page <= 1} onClick={() => onChange(page - 1)}>
          <ChevronLeft size={20} strokeWidth={1.75} />
        </button>
        <input
          className="input pager__jump"
          aria-label="跳到页码"
          inputMode="numeric"
          value={jump}
          onChange={(e) => setJump(e.target.value.replace(/\D/g, ""))}
          onBlur={commitJump}
          onKeyDown={(e) => e.key === "Enter" && commitJump()}
        />
        <span className="mono">/ {totalPages}</span>
        <button type="button" className="icon-btn" aria-label="下一页" disabled={page >= totalPages} onClick={() => onChange(page + 1)}>
          <ChevronRight size={20} strokeWidth={1.75} />
        </button>
      </div>
    </div>
  );
}

/** 编辑抽屉：桌面右侧滑出（宽 560），手机宽度变底部 sheet（CSS 切换）。
    传 onSave 时自带底部「取消 / 保存」和 ⌘S；dirty 时关闭要二次确认。 */
export function Drawer({
  title,
  status,
  onClose,
  children,
  footer,
  footerExtra,
  onSave,
  saving,
  saveText = "保存",
  dirty,
  variant = "drawer",
}: {
  variant?: "drawer" | "dialog";
  title: ReactNode;
  status?: ReactNode;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  footerExtra?: ReactNode;
  onSave?: () => void;
  saving?: boolean;
  saveText?: string;
  dirty?: boolean;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const layer = useDialogLayer();
  const [closing, setClosing] = useState(false);
  const [asking, setAsking] = useState(false);
  useFocusTrap(true, ref);

  const reduced = () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const leave = useCallback(() => {
    setAsking(false);
    if (reduced()) {
      onClose();
      return;
    }
    setClosing(true);
    window.setTimeout(onClose, 200);
  }, [onClose]);
  const requestClose = useCallback(() => {
    if (dirty) setAsking(true);
    else leave();
  }, [dirty, leave]);

  const latest = useRef({ requestClose, onSave, saving });
  latest.current = { requestClose, onSave, saving };
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!isTopDialog(layer)) return;
      if (e.key === "Escape") latest.current.requestClose();
      if ((e.metaKey || e.ctrlKey) && !e.altKey && e.key.toLowerCase() === "s" && latest.current.onSave) {
        e.preventDefault();
        if (!latest.current.saving) latest.current.onSave();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [layer]);

  // 有未保存改动时，刷新/关标签页也提醒
  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  const content = (
    <>
      <div className={closing ? "scrim is-closing" : "scrim"} onClick={requestClose} />
      <Glass
        as="aside"
        className={["drawer", variant === "dialog" && "drawer--dialog", closing && "is-closing"].filter(Boolean).join(" ")}
        reading
        refract
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === "string" ? title : undefined}
        ref={ref}
      >
        <div className="drawer-head">
          <h2>{title}</h2>
          {status}
          <button type="button" className="icon-btn" aria-label="关闭" onClick={requestClose}>
            <X size={20} strokeWidth={1.75} />
          </button>
        </div>
        <div className="drawer-body">{children}</div>
        {(footer || onSave) && (
          <div className="drawer-foot">
            {footer}
            {onSave && (
              <>
                {footerExtra && <span className="spacer">{footerExtra}</span>}
                <button type="button" className="btn" onClick={requestClose}>
                  取消
                </button>
                <button type="button" className="btn btn-filled" onClick={onSave} disabled={saving}>
                  {saving ? "保存中…" : saveText}
                </button>
              </>
            )}
          </div>
        )}
      </Glass>
      <Confirm
        open={asking}
        danger
        title="放弃未保存的改动？"
        desc="关闭后，这次编辑的内容不会保留。"
        confirmText="放弃改动"
        onCancel={() => setAsking(false)}
        onConfirm={leave}
      />
    </>
  );
  const host = document.querySelector(".admin-root") ?? document.body;
  return createPortal(content, host);
}

/** 把 Drawer 的放弃确认、⌘S 给表单用：比较初值与当前值 */
export function useFormState<T extends Record<string, unknown>>(init: T) {
  const [initial, setInitial] = useState(init);
  const [form, setForm] = useState(init);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const dirty = Object.keys(form).some((key) => form[key] !== initial[key]);
  const set = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key as string]) return prev;
      const { [key as string]: _removed, ...rest } = prev;
      return rest;
    });
  }, []);
  const bind = (key: keyof T) => ({
    value: form[key] as string,
    onChange: (event: { target: { value: string } }) => set(key, event.target.value as T[keyof T]),
  });
  const reset = useCallback((next: T) => {
    setInitial(next);
    setForm(next);
    setErrors({});
  }, []);
  return { form, dirty, errors, setErrors, set, bind, reset };
}

/** 少用的设置收在这里。里面有校验错误时一直展开，不让错误藏起来；错误改掉后保持展开，不在输入时收起 */
export function Advanced({ open: forceOpen, children }: { open?: boolean; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (forceOpen) setOpen(true);
  }, [forceOpen]);
  const shown = open || Boolean(forceOpen);
  return (
    <div className="advanced" data-open={shown}>
      <button type="button" className="btn btn-text btn-sm advanced__toggle" aria-expanded={shown} onClick={() => setOpen(forceOpen ? true : !open)}>
        高级
        <ChevronDown size={14} strokeWidth={1.75} aria-hidden />
      </button>
      <div className="advanced__body" hidden={!shown}>
        {children}
      </div>
    </div>
  );
}

export function useIsNarrow(maxWidth = 980) {
  const [narrow, setNarrow] = useState(() => window.matchMedia(`(max-width: ${maxWidth}px)`).matches);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${maxWidth}px)`);
    const onChange = () => setNarrow(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [maxWidth]);
  return narrow;
}

/** 页面级表单：有未保存改动时，站内跳转要确认，刷新/关标签页也提醒 */
export function LeaveGuard({ when }: { when: boolean }) {
  const blocker = useBlocker(({ currentLocation, nextLocation }) => when && currentLocation.pathname !== nextLocation.pathname);
  useEffect(() => {
    if (!when) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [when]);
  return (
    <Confirm
      open={blocker.state === "blocked"}
      danger
      title="放弃未保存的改动？"
      desc="离开后，这次编辑的内容不会保留。"
      confirmText="放弃改动"
      onCancel={() => blocker.reset?.()}
      onConfirm={() => blocker.proceed?.()}
    />
  );
}

/** 把接口的字段错误落到字段下，其余错误返回给表单顶部 */
export function applyApiError(err: unknown, setErrors: (errors: Record<string, string>) => void, fallback: string): string | null {
  if (err instanceof ApiError && err.field) {
    setErrors({ [err.field]: err.message });
    return null;
  }
  return err instanceof ApiError ? err.message : fallback;
}

/** 小弹层（行内发货等）：锚定在按钮旁，Esc、点外面都能关 */
export function Popover({ anchor, onClose, children, label }: { anchor: HTMLElement; onClose: () => void; children: ReactNode; label: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const layer = useDialogLayer();
  const [position, setPosition] = useState<{ left: number; top: number } | null>(null);
  useFocusTrap(true, ref);

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;
    const a = anchor.getBoundingClientRect();
    const m = node.getBoundingClientRect();
    const gap = 8;
    const top = a.bottom + gap + m.height <= window.innerHeight ? a.bottom + gap : Math.max(gap, a.top - gap - m.height);
    const left = Math.min(Math.max(gap, a.right - m.width), window.innerWidth - m.width - gap);
    setPosition({ left, top });
  }, [anchor]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isTopDialog(layer)) onClose();
    };
    const onDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (ref.current?.contains(target) || anchor.contains(target)) return;
      onClose();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [anchor, layer, onClose]);

  const host = document.querySelector(".admin-root") ?? document.body;
  return createPortal(
    <Glass className="popover" reading role="dialog" aria-label={label} ref={ref} style={position ?? { left: 0, top: 0, visibility: "hidden" }}>
      {children}
    </Glass>,
    host,
  );
}

/** 锚定菜单（头像菜单等）：挂到 .admin-root 下，这样它自己的玻璃才能透到页面 */
export function Menu({ anchor, onClose, children, label }: { anchor: HTMLElement; onClose: () => void; children: ReactNode; label: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const layer = useDialogLayer();
  const [position, setPosition] = useState<{ left: number; top: number } | null>(null);

  useLayoutEffect(() => {
    const menu = ref.current;
    if (!menu) return;
    const a = anchor.getBoundingClientRect();
    const m = menu.getBoundingClientRect();
    const gap = 8;
    // 下方放不下就往上开（侧栏底部的头像卡）
    const top = a.bottom + gap + m.height <= window.innerHeight ? a.bottom + gap : Math.max(gap, a.top - gap - m.height);
    const left = Math.min(Math.max(gap, a.left), window.innerWidth - m.width - gap);
    setPosition({ left, top });
  }, [anchor]);

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const items = () => Array.from(ref.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? []);
    items()[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (!isTopDialog(layer)) return;
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
      e.preventDefault();
      const list = items();
      const at = list.indexOf(document.activeElement as HTMLElement);
      list[(at + (e.key === "ArrowDown" ? 1 : -1) + list.length) % list.length]?.focus();
    };
    const onDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (ref.current?.contains(target) || anchor.contains(target)) return;
      onClose();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    window.addEventListener("resize", onClose);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
      window.removeEventListener("resize", onClose);
      previous?.focus?.();
    };
  }, [anchor, layer, onClose]);

  const host = document.querySelector(".admin-root") ?? document.body;
  return createPortal(
    <Glass
      className="menu"
      reading
      refract
      role="menu"
      aria-label={label}
      ref={ref}
      style={position ? position : { left: 0, top: 0, visibility: "hidden" }}
    >
      {children}
    </Glass>,
    host,
  );
}
