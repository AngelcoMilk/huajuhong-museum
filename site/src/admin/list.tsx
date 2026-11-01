// 数据行列表全家桶：URL 查询状态、搜索框、筛选胶囊、分栏数据行、批量条、选择状态。
// 列表页都走这一套，所以规则（B1–B4、B9）只在这里实现一次。
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useSearchParams } from "react-router";
import { ArrowDown, ArrowUp, ArrowUpDown, Search, X } from "lucide-react";
import { ApiError, type BatchAction, type BatchResult, type Page } from "./api";
import { Glass } from "./glass";
import { ErrorState, NotReady, PAGE_SIZES, Pager, toast, type AsyncState } from "./ui";

/* ── URL 查询状态 ───────────────────────────────────── */
export type Order = "asc" | "desc";

export interface ListQuery {
  params: URLSearchParams;
  q: string;
  page: number;
  pageSize: number;
  sort?: string;
  order?: Order;
  /** 只认白名单里的值；手改 URL 的脏值当没写 */
  pick: <T extends string>(key: string, allowed: readonly T[]) => T | undefined;
  /** 改查询串。除非 patch 里带 page，否则回到第一页 */
  update: (patch: Record<string, string | number | null | undefined>, options?: { replace?: boolean }) => void;
}

export function useListQuery(sortable: readonly string[]): ListQuery {
  const [params, setParams] = useSearchParams();

  const update = useCallback<ListQuery["update"]>(
    (patch, options) => {
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          for (const [key, value] of Object.entries(patch)) {
            if (value === null || value === undefined || value === "") next.delete(key);
            else next.set(key, String(value));
          }
          if (!("page" in patch) || Number(patch.page) <= 1) next.delete("page");
          return next;
        },
        { replace: options?.replace },
      );
    },
    [setParams],
  );

  const page = Math.max(1, Number.parseInt(params.get("page") ?? "", 10) || 1);
  const size = Number.parseInt(params.get("pageSize") ?? "", 10);
  const rawSort = params.get("sort") ?? undefined;
  const sort = rawSort && sortable.includes(rawSort) ? rawSort : undefined;
  const rawOrder = params.get("order");

  return {
    params,
    q: params.get("q") ?? "",
    page,
    pageSize: PAGE_SIZES.includes(size) ? size : PAGE_SIZES[0],
    sort,
    order: sort ? (rawOrder === "asc" ? "asc" : "desc") : undefined,
    pick: (key, allowed) => {
      const value = params.get(key);
      return value && (allowed as readonly string[]).includes(value) ? (value as (typeof allowed)[number]) : undefined;
    },
    update,
  };
}

/* ── 搜索框：边输边筛，300ms 防抖，没有搜索按钮 ─────── */
export function SearchBox({ value, onChange, placeholder }: { value: string; onChange: (value: string) => void; placeholder: string }) {
  const [text, setText] = useState(value);
  const composing = useRef(false);
  const timer = useRef<number | undefined>(undefined);
  const latest = useRef(onChange);
  latest.current = onChange;

  // URL 变了（后退、清除胶囊）才同步回输入框；自己提交引起的不动，免得吃掉结尾空格
  useEffect(() => {
    setText((current) => (current.trim() === value ? current : value));
  }, [value]);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  function schedule(next: string) {
    window.clearTimeout(timer.current);
    // 拼音输入途中不提交，等选完字
    if (composing.current) return;
    timer.current = window.setTimeout(() => latest.current(next.trim()), 300);
  }

  return (
    <div className="searchbox" role="search">
      <Search size={16} strokeWidth={1.75} aria-hidden />
      <input
        className="input"
        type="text"
        aria-label={placeholder}
        placeholder={placeholder}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          schedule(e.target.value);
        }}
        onCompositionStart={() => {
          composing.current = true;
        }}
        onCompositionEnd={(e) => {
          composing.current = false;
          schedule(e.currentTarget.value);
        }}
      />
      {text && (
        <button
          type="button"
          aria-label="清空搜索"
          onClick={() => {
            window.clearTimeout(timer.current);
            setText("");
            latest.current("");
          }}
        >
          <X size={16} strokeWidth={1.75} />
        </button>
      )}
    </div>
  );
}

/* ── 已生效的筛选：每个都能单独清除 ─────────────────── */
export function FilterTags({ tags, onClearAll }: { tags: Array<{ key: string; label: string; onClear: () => void }>; onClearAll?: () => void }) {
  if (tags.length === 0) return null;
  return (
    <div className="filter-bar" aria-label="已生效的筛选">
      {tags.map((tag) => (
        <span className="filter-tag" key={tag.key}>
          {tag.label}
          <button type="button" aria-label={`清除 ${tag.label}`} onClick={tag.onClear}>
            <X size={14} strokeWidth={2} />
          </button>
        </span>
      ))}
      {onClearAll && tags.length > 1 && (
        <button type="button" className="btn btn-text btn-sm" onClick={onClearAll}>
          清除全部
        </button>
      )}
    </div>
  );
}

/* ── 选择状态：查询变了就清空，防止批量操作打到看不见的行 ── */
export function useSelection(resetKey: string) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  useEffect(() => setSelected(new Set()), [resetKey]);
  return useMemo(
    () => ({
      selected,
      toggle(id: string) {
        setSelected((prev) => {
          const next = new Set(prev);
          if (next.has(id)) next.delete(id);
          else next.add(id);
          return next;
        });
      },
      setAll(ids: string[], on: boolean) {
        setSelected((prev) => {
          const next = new Set(prev);
          ids.forEach((id) => (on ? next.add(id) : next.delete(id)));
          return next;
        });
      },
      set(ids: string[]) {
        setSelected(new Set(ids));
      },
      clear() {
        setSelected(new Set());
      },
    }),
    [selected],
  );
}

/* ── 数据行 ─────────────────────────────────────────── */
export interface Column<T> {
  key: string;
  label: string;
  /** CSS grid 轨道宽度 */
  width: string;
  /** 能排序时给后端字段名 */
  sortKey?: string;
  /** 第一次点这一列时的方向，默认升序 */
  firstOrder?: Order;
  align?: "end";
  /** 手机宽度：hide 藏起、grow 占满余下宽度 */
  mobile?: "hide" | "grow";
  render: (row: T) => ReactNode;
}

export function DataList<T>({
  columns,
  rows,
  rowKey,
  query,
  selection,
  actions,
  actionsWidth = "132px",
  onRowClick,
  activeKey,
  label,
}: {
  /** 当前聚焦的行（列表 + 地图联动时用） */
  activeKey?: string | null;
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  query: Pick<ListQuery, "sort" | "order" | "update">;
  selection?: ReturnType<typeof useSelection>;
  actions?: (row: T) => ReactNode;
  actionsWidth?: string;
  onRowClick?: (row: T) => void;
  label: string;
}) {
  const ids = rows.map(rowKey);
  const checkedCount = selection ? ids.filter((id) => selection.selected.has(id)).length : 0;
  const allChecked = ids.length > 0 && checkedCount === ids.length;
  const headCheck = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (headCheck.current) headCheck.current.indeterminate = checkedCount > 0 && !allChecked;
  }, [checkedCount, allChecked]);

  const tracks = [selection ? "20px" : null, ...columns.map((c) => c.width), actions ? actionsWidth : null].filter(Boolean).join(" ");

  function clickSort(column: Column<T>) {
    if (!column.sortKey) return;
    const active = query.sort === column.sortKey;
    const next: Order = active ? (query.order === "asc" ? "desc" : "asc") : (column.firstOrder ?? "asc");
    query.update({ sort: column.sortKey, order: next });
  }

  return (
    <div className="dl" role="table" aria-label={label} style={{ "--dl-cols": tracks } as React.CSSProperties}>
      <div className="dl-head" role="row">
        {selection && (
          <span role="columnheader" aria-label="全选">
            <input
              ref={headCheck}
              className="check"
              type="checkbox"
              aria-label="全选当前页"
              checked={allChecked}
              onChange={(e) => selection.setAll(ids, e.target.checked)}
            />
          </span>
        )}
        {columns.map((column) => {
          const active = Boolean(column.sortKey) && query.sort === column.sortKey;
          return (
            <span
              key={column.key}
              role="columnheader"
              aria-sort={active ? (query.order === "asc" ? "ascending" : "descending") : undefined}
              className={column.align === "end" ? "dl-cell--end" : undefined}
            >
              {column.sortKey ? (
                <button type="button" className="dl-sort" data-active={active} onClick={() => clickSort(column)}>
                  {column.label}
                  {active ? (
                    query.order === "asc" ? (
                      <ArrowUp size={14} strokeWidth={2} aria-hidden />
                    ) : (
                      <ArrowDown size={14} strokeWidth={2} aria-hidden />
                    )
                  ) : (
                    <ArrowUpDown size={14} strokeWidth={1.75} aria-hidden />
                  )}
                </button>
              ) : (
                column.label
              )}
            </span>
          );
        })}
        {actions && <span role="columnheader" aria-label="操作" />}
      </div>
      {rows.map((row) => {
        const id = rowKey(row);
        const checked = selection?.selected.has(id) ?? false;
        return (
          <div className="dl-row" role="row" key={id} data-selected={checked} data-active={activeKey === id || undefined} onClick={onRowClick ? () => onRowClick(row) : undefined}>
            {selection && (
              <span role="cell" onClick={(e) => e.stopPropagation()} style={{ display: "inline-flex" }}>
                <input className="check" type="checkbox" aria-label={`选择 ${id}`} checked={checked} onChange={() => selection.toggle(id)} />
              </span>
            )}
            {columns.map((column) => (
              <div
                key={column.key}
                role="cell"
                className={[
                  "dl-cell",
                  column.align === "end" && "dl-cell--end",
                  column.mobile === "hide" && "dl-cell--m-hide",
                  column.mobile === "grow" && "dl-cell--m-grow",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {column.render(row)}
              </div>
            ))}
            {actions && (
              <div role="cell" className="dl-cell dl-cell--m-full" onClick={(e) => e.stopPropagation()}>
                <div className="dl-actions">{actions(row)}</div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── 底部玻璃批量条 ─────────────────────────────────── */
export function BatchBar({
  count,
  actions,
  onClear,
  busy,
}: {
  count: number;
  actions: Array<{ key: string; label: string; onClick: () => void; danger?: boolean }>;
  onClear: () => void;
  busy?: boolean;
}) {
  if (count === 0) return null;
  return (
    <Glass className="batch-bar" role="toolbar" aria-label="批量操作">
      <span className="batch-bar__count">
        已选 <b className="mono">{count}</b> 条
      </span>
      {actions.map((action) => (
        <button key={action.key} type="button" className={action.danger ? "btn btn-sm btn-danger" : "btn btn-sm btn-tonal"} disabled={busy} onClick={action.onClick}>
          {action.label}
        </button>
      ))}
      <button type="button" className="btn btn-sm btn-text" disabled={busy} onClick={onClear}>
        取消选择
      </button>
    </Glass>
  );
}

/** 列表的骨架：与真实行同形，加载完不跳 */
export function ListSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div style={{ display: "grid" }} aria-busy="true">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, minHeight: 64, padding: "0 12px" }}>
          <span className="skeleton" style={{ width: 44, height: 44, borderRadius: 12 }} />
          <span style={{ flex: 1, display: "grid", gap: 8 }}>
            <span className="skeleton" style={{ width: `${60 - (i % 4) * 8}%` }} />
            <span className="skeleton" style={{ width: 72, height: 10 }} />
          </span>
          <span className="skeleton" style={{ width: 64, height: 22, borderRadius: 999 }} />
        </div>
      ))}
    </div>
  );
}

/** 列表区块的统一分支：未就绪 / 出错 / 骨架 / 空 / 数据 + 分页。页码超界时自动回到末页 */
export function PagedBody<T>({
  state,
  query,
  empty,
  children,
}: {
  state: AsyncState<Page<T>>;
  query: ListQuery;
  empty: ReactNode;
  children: (rows: T[]) => ReactNode;
}) {
  const total = state.data?.total ?? 0;
  const totalPages = state.data ? Math.max(1, Math.ceil(total / state.data.pageSize)) : 1;
  const { page, update } = query;
  useEffect(() => {
    if (state.data && page > totalPages) update({ page: totalPages }, { replace: true });
  }, [state.data, page, totalPages, update]);

  if (state.notReady) return <NotReady onRetry={state.reload} />;
  if (state.error) return <ErrorState message={state.error} onRetry={state.reload} />;
  if (!state.data) return <ListSkeleton />;
  if (state.data.items.length === 0) return <>{empty}</>;
  return (
    <>
      {children(state.data.items)}
      <Pager
        page={page}
        totalPages={totalPages}
        total={total}
        pageSize={query.pageSize}
        onChange={(next) => update({ page: next })}
        onPageSize={(next) => update({ pageSize: next === PAGE_SIZES[0] ? null : next })}
      />
    </>
  );
}

/** 发布 / 下架 / 归档：走批量接口，就地更新、toast 带撤销。撤销 = 按原状态分组改回去 */
const ACTION_TARGET: Record<BatchAction, string> = { publish: "published", unpublish: "draft", archive: "archived" };
const ACTION_DONE: Record<BatchAction, string> = { publish: "已发布", unpublish: "已下架", archive: "已归档" };
const STATUS_TO_ACTION: Record<string, BatchAction> = { published: "publish", draft: "unpublish", archived: "archive" };

export function useBatch<T extends { id: string; status: string }>(
  send: (ids: string[], action: BatchAction) => Promise<BatchResult>,
  list: Pick<AsyncState<Page<T>>, "mutate" | "reload">,
  selection?: ReturnType<typeof useSelection>,
) {
  const [busy, setBusy] = useState(false);

  async function undo(before: Array<{ id: string; status: string }>) {
    const groups = new Map<BatchAction, string[]>();
    for (const row of before) {
      const action = STATUS_TO_ACTION[row.status];
      if (action) groups.set(action, [...(groups.get(action) ?? []), row.id]);
    }
    try {
      await Promise.all([...groups].map(([action, ids]) => send(ids, action)));
      toast("已撤销");
    } catch (error) {
      toast(error instanceof ApiError ? `撤销失败：${error.message}` : "撤销失败");
    }
    list.reload();
  }

  async function run(targets: T[], action: BatchAction) {
    if (targets.length === 0) return;
    const before = targets.map((row) => ({ id: row.id, status: row.status }));
    setBusy(true);
    try {
      const result = await send(targets.map((row) => row.id), action);
      const okIds = new Set(result.ok);
      const next = ACTION_TARGET[action];
      list.mutate((prev) => ({ ...prev, items: prev.items.map((row) => (okIds.has(row.id) ? { ...row, status: next, updatedAt: Date.now() } : row)) }));
      const reverted = before.filter((row) => okIds.has(row.id) && row.status !== next);
      const undoAction = reverted.length > 0 ? { label: "撤销", run: () => void undo(reverted) } : undefined;
      if (result.failed.length > 0) {
        selection?.set(result.failed.map((f) => f.id));
        toast(`${ACTION_DONE[action]} ${result.ok.length} 条，失败 ${result.failed.length} 条：${result.failed[0].message}`, { action: undoAction });
      } else {
        selection?.clear();
        toast(targets.length === 1 ? ACTION_DONE[action] : `${ACTION_DONE[action]} ${result.ok.length} 条`, { action: undoAction });
      }
      list.reload();
    } catch (error) {
      const notReady = error instanceof ApiError && error.status === 404;
      toast(notReady ? "暂时无法批量操作" : error instanceof ApiError ? error.message : "操作失败");
    } finally {
      setBusy(false);
    }
  }

  return { busy, run };
}

/** 三个批量动作的按钮定义 */
export function batchActions<T extends { id: string; status: string }>(rows: T[], run: (targets: T[], action: BatchAction) => void) {
  return [
    { key: "publish", label: "批量发布", onClick: () => run(rows, "publish") },
    { key: "unpublish", label: "批量下架", onClick: () => run(rows, "unpublish") },
    { key: "archive", label: "批量归档", onClick: () => run(rows, "archive") },
  ];
}

/** 内容类条目共用的状态胶囊 */
export const ITEM_STATUSES = [
  { key: "published", label: "已发布", tone: "pill pill--ok" },
  { key: "draft", label: "草稿", tone: "pill pill--warn" },
  { key: "archived", label: "已归档", tone: "pill" },
] as const;

export function StatusPill({ status }: { status: string }) {
  const meta = ITEM_STATUSES.find((s) => s.key === status);
  return <span className={meta?.tone ?? "pill"}>{meta?.label ?? status}</span>;
}
