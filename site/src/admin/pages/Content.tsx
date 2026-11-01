// 展项管理：园区栏目树、博物馆文章卡片、史料表格。编辑统一进全屏阅读编辑器（ArticleEditor）。
// VR、商品、企业各有自己的页面，这里看不到它们。
import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router";
import {
  Archive,
  ArchiveRestore,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ChevronRight,
  CircleArrowDown,
  CircleArrowUp,
  ExternalLink,
  FolderCog,
  Globe,
  GripVertical,
  Image as ImageIcon,
  Landmark,
  Library,
  Pencil,
  Plus,
  Trash2,
  Trees,
  X,
} from "lucide-react";
import { api, ApiError, type HistorySection, type ItemRow, type PageHead } from "../api";
import { ImageInput } from "../blocks";
import { BatchBar, batchActions, DataList, FilterTags, ITEM_STATUSES as STATUSES, PagedBody, SearchBox, StatusPill, useBatch, useListQuery, useSelection, type Column } from "../list";
import { moveInList, stepInList, useDragSort } from "../sortable";
import { applyApiError, Card, Confirm, dateTime, Drawer, Empty, ErrorBar, ErrorState, Field, PageHeadExtra, Segmented, Skeleton, toast, useAsync } from "../ui";

const TABS = [
  { value: "park", label: "园区", icon: <Trees size={16} strokeWidth={1.75} aria-hidden /> },
  { value: "museum", label: "博物馆", icon: <Landmark size={16} strokeWidth={1.75} aria-hidden /> },
  { value: "history", label: "史料", icon: <Library size={16} strokeWidth={1.75} aria-hidden /> },
];
const TAB_KEYS = TABS.map((t) => t.value);
const STATUS_KEYS = STATUSES.map((s) => s.key);
const SORTABLE = ["sort", "updatedAt", "title", "id", "date", "status"] as const;

const editUrl = (id: string) => `/admin/content/edit/${encodeURIComponent(id)}`;

/** 前台能看到这一条的地址 */
function frontUrl(row: Pick<ItemRow, "id" | "board">): string {
  if (row.board === "park") return `/park#${row.id.toLowerCase()}`;
  if (row.board === "museum") return "/museum";
  return `/history/${encodeURIComponent(row.id)}`;
}

export default function Content() {
  const [params] = useSearchParams();
  const board = params.get("board");
  // 产品归「商品与库存」管，旧链接转过去
  if (board === "product") return <Navigate to="/admin/products" replace />;
  // 旧的板块筛选换成页内切换
  if (board && TAB_KEYS.includes(board)) {
    const next = new URLSearchParams(params);
    next.delete("board");
    next.set("tab", board);
    return <Navigate to={`/admin/content?${next}`} replace />;
  }
  // 从仪表板、全局搜索带条件进来，还没选板块：转到有结果的那一块
  if (!params.get("tab") && (params.get("status") || params.get("q"))) return <FindTab />;
  return <ContentTabs />;
}

function FindTab() {
  const [params] = useSearchParams();
  const status = params.get("status") ?? undefined;
  const q = params.get("q") ?? undefined;
  const found = useAsync(async () => {
    for (const board of TAB_KEYS) {
      const page = await api.items({ board, status, q, pageSize: 1 });
      if (page.total > 0) return board;
    }
    return "park";
  }, [status, q]);
  if (found.error) return <ErrorState message={found.error} onRetry={found.reload} />;
  if (!found.data) return <Skeleton rows={6} />;
  const next = new URLSearchParams(params);
  next.set("tab", found.data);
  return <Navigate to={`/admin/content?${next}`} replace />;
}

function ContentTabs() {
  const query = useListQuery(SORTABLE);
  const tab = query.pick("tab", TAB_KEYS) ?? "park";
  return (
    <>
      <PageHeadExtra>
        <Segmented
          value={tab}
          onChange={(next) => query.update({ tab: next === "park" ? null : next, q: null, status: null, section: null, sort: null, order: null })}
          options={TABS}
          label="展项板块"
          size="md"
        />
      </PageHeadExtra>
      {tab === "park" && <ParkTab />}
      {tab === "museum" && <MuseumTab />}
      {tab === "history" && <HistoryTab />}
    </>
  );
}

/* ── 页面头：常驻摘要，编辑进抽屉 ─────────────────── */

function PageHeadCard({ board }: { board: string }) {
  const state = useAsync(() => api.contentPage(board), [board]);
  const [editing, setEditing] = useState(false);
  const head = state.data;
  return (
    <Card
      title="页面头"
      actions={
        <button type="button" className="btn btn-sm" disabled={state.loading || Boolean(state.error)} onClick={() => setEditing(true)}>
          <Pencil size={14} strokeWidth={1.75} aria-hidden />
          编辑
        </button>
      }
    >
      {state.error ? (
        <ErrorBar message={state.error} onRetry={state.reload} />
      ) : state.loading && !head ? (
        <Skeleton rows={2} />
      ) : head ? (
        <div className="page-head-sum">
          {head.heroImage && <img className="page-head-sum__fig" src={head.heroImage} alt="" loading="lazy" referrerPolicy="no-referrer" />}
          <div className="page-head-sum__text">
            <b>{head.title}</b>
            {head.intro && <p className="muted">{head.intro}</p>}
            {head.stats.length > 0 && (
              <ul className="page-head-sum__stats">
                {head.stats.map((stat, index) => (
                  <li key={index}>
                    <b>{stat.value}</b> <small>{stat.unit}</small>
                    <span className="muted">{stat.label}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ) : (
        <p className="muted">还没有设置，前台显示默认页面头。</p>
      )}
      {editing && (
        <PageHeadDrawer
          board={board}
          head={head}
          onClose={() => setEditing(false)}
          onSaved={() => {
            setEditing(false);
            state.reload();
          }}
        />
      )}
    </Card>
  );
}

function PageHeadDrawer({ board, head, onClose, onSaved }: { board: string; head: PageHead | null; onClose: () => void; onSaved: () => void }) {
  const [initial] = useState<PageHead>(() => ({ title: head?.title ?? "", intro: head?.intro ?? "", heroImage: head?.heroImage ?? "", stats: head?.stats ?? [] }));
  const [form, setForm] = useState<PageHead>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const dirty = JSON.stringify(form) !== JSON.stringify(initial);

  const setStat = (index: number, key: "value" | "unit" | "label", value: string) =>
    setForm((prev) => ({ ...prev, stats: prev.stats.map((stat, at) => (at === index ? { ...stat, [key]: value } : stat)) }));

  async function save() {
    if (!form.title.trim()) {
      setErrors({ title: "标题不能为空" });
      return;
    }
    setBusy(true);
    setError(null);
    setErrors({});
    try {
      await api.saveContentPage(board, { ...form, title: form.title.trim(), intro: form.intro.trim(), heroImage: form.heroImage.trim() });
      toast("页面头已保存");
      onSaved();
    } catch (err) {
      setError(applyApiError(err, setErrors, "保存失败"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Drawer title="编辑页面头" onClose={onClose} onSave={save} saving={busy} dirty={dirty}>
      {error && <ErrorBar message={error} />}
      <Field label="标题" error={errors.title}>
        <input className="input" value={form.title} aria-invalid={Boolean(errors.title) || undefined} onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))} />
      </Field>
      <Field label="简介" error={errors.intro}>
        <textarea className="textarea" value={form.intro} onChange={(e) => setForm((prev) => ({ ...prev, intro: e.target.value }))} />
      </Field>
      <Field label="头图" error={errors.heroImage}>
        <ImageInput label="头图地址" value={form.heroImage} invalid={Boolean(errors.heroImage)} onChange={(heroImage) => setForm((prev) => ({ ...prev, heroImage }))} />
      </Field>
      <Field label="数据带" error={errors.stats}>
        <div className="stat-edit">
          {form.stats.map((stat, index) => (
            <div className="stat-edit__row" key={index}>
              <input className="input" aria-label={`第 ${index + 1} 项数值`} placeholder="数值" value={stat.value} onChange={(e) => setStat(index, "value", e.target.value)} />
              <input className="input" aria-label={`第 ${index + 1} 项单位`} placeholder="单位" value={stat.unit} onChange={(e) => setStat(index, "unit", e.target.value)} />
              <input className="input" aria-label={`第 ${index + 1} 项说明`} placeholder="说明" value={stat.label} onChange={(e) => setStat(index, "label", e.target.value)} />
              <button type="button" className="icon-btn" title="删除" aria-label={`删除第 ${index + 1} 项`} onClick={() => setForm((prev) => ({ ...prev, stats: prev.stats.filter((_, at) => at !== index) }))}>
                <X size={16} strokeWidth={1.75} aria-hidden />
              </button>
            </div>
          ))}
          <button type="button" className="btn btn-sm" disabled={form.stats.length >= 12} style={{ justifySelf: "start" }} onClick={() => setForm((prev) => ({ ...prev, stats: [...prev.stats, { value: "", unit: "", label: "" }] }))}>
            <Plus size={15} strokeWidth={1.75} aria-hidden />
            加一项
          </button>
        </div>
      </Field>
    </Drawer>
  );
}

/* ── 共用：行上的发布、归档、删除 ─────────────────── */

function useRowActions(reload: () => void) {
  const [removing, setRemoving] = useState<ItemRow | null>(null);
  const [busy, setBusy] = useState(false);

  async function run(action: () => Promise<unknown>, done: string, fallback: string) {
    setBusy(true);
    try {
      await action();
      toast(done);
    } catch (err) {
      toast(err instanceof ApiError ? err.message : fallback);
    } finally {
      setBusy(false);
      reload();
    }
  }

  const togglePublish = (row: ItemRow) => {
    const live = row.status === "published";
    void run(() => api.itemsBatch([row.id], live ? "unpublish" : "publish"), live ? "已下架" : "已发布", "操作失败");
  };
  const toggleArchive = (row: ItemRow) => {
    const archived = row.status === "archived";
    void run(() => api.itemsBatch([row.id], archived ? "unpublish" : "archive"), archived ? "已恢复为草稿" : "已归档", "操作失败");
  };

  const confirm = (
    <Confirm
      open={removing !== null}
      danger
      title={`永久删除「${removing?.title ?? ""}」？`}
      desc="删除后不能恢复。只想让前台看不到，用归档就够了。"
      confirmText="永久删除"
      onCancel={() => setRemoving(null)}
      onConfirm={() => {
        const row = removing;
        setRemoving(null);
        if (row) void run(() => api.deleteItem(row.id), "已删除", "删除失败");
      }}
    />
  );

  return { busy, togglePublish, toggleArchive, askRemove: setRemoving, confirm };
}

function RowIcons({ row, actions, extra }: { row: ItemRow; actions: ReturnType<typeof useRowActions>; extra?: React.ReactNode }) {
  const live = row.status === "published";
  const archived = row.status === "archived";
  return (
    <>
      {extra}
      {!archived && (
        <button type="button" className="icon-btn" title={live ? "下架" : "发布"} aria-label={`${live ? "下架" : "发布"} ${row.title}`} disabled={actions.busy} onClick={() => actions.togglePublish(row)}>
          {live ? <CircleArrowDown size={18} strokeWidth={1.75} /> : <CircleArrowUp size={18} strokeWidth={1.75} />}
        </button>
      )}
      {live && (
        <a className="icon-btn" href={frontUrl(row)} target="_blank" rel="noopener noreferrer" title="在前台查看" aria-label={`在前台查看 ${row.title}`}>
          <ExternalLink size={18} strokeWidth={1.75} />
        </a>
      )}
      <button type="button" className="icon-btn" title={archived ? "恢复" : "归档"} aria-label={`${archived ? "恢复" : "归档"} ${row.title}`} disabled={actions.busy} onClick={() => actions.toggleArchive(row)}>
        {archived ? <ArchiveRestore size={18} strokeWidth={1.75} /> : <Archive size={18} strokeWidth={1.75} />}
      </button>
      <button type="button" className="icon-btn icon-btn--danger" title="永久删除" aria-label={`永久删除 ${row.title}`} disabled={actions.busy} onClick={() => actions.askRemove(row)}>
        <Trash2 size={18} strokeWidth={1.75} />
      </button>
    </>
  );
}

function RowState({ row }: { row: ItemRow }) {
  return (
    <span className="row-state">
      {row.hasDraft && <span className="pill pill--warn">有未发布的修改</span>}
      <StatusPill status={row.status} />
    </span>
  );
}

/** 列表型板块用的数据：一次取全（园区、博物馆都只有几十条），排序就地改 */
function useBoardRows(board: string) {
  const state = useAsync(() => api.items({ board, pageSize: 100 }), [board]);
  async function saveOrder(next: string[], parentId?: string | null) {
    const rank = new Map(next.map((id, index) => [id, index]));
    // 先在界面上挪过去，失败再拉回来
    state.mutate((prev) => ({
      ...prev,
      items: prev.items
        .map((row) => (rank.has(row.id) ? { ...row, sort: rank.get(row.id) as number, parentId: parentId === undefined ? row.parentId : parentId } : row))
        .sort((a, b) => a.sort - b.sort),
    }));
    try {
      await api.reorderItems(next, parentId);
    } catch (err) {
      toast(err instanceof ApiError ? err.message : "排序没有保存");
      state.reload();
    }
  }
  return { state, rows: state.data?.items ?? [], saveOrder };
}

/** 从仪表板、全局搜索带条件进来时的筛选。筛选中只看到一部分，不能排序 */
function useRowFilter() {
  const query = useListQuery(SORTABLE);
  const status = query.pick("status", STATUS_KEYS);
  const q = query.q.trim();
  const matches = (row: ItemRow) => (!status || row.status === status) && (!q || row.title.includes(q) || row.id.includes(q));
  const filtering = Boolean(status || q);
  const tags = [
    status && { key: "status", label: `状态：${STATUSES.find((s) => s.key === status)?.label}`, onClear: () => query.update({ status: null }) },
    q && { key: "q", label: `搜索：${q}`, onClear: () => query.update({ q: null }) },
  ].filter(Boolean) as Array<{ key: string; label: string; onClear: () => void }>;
  return { status, matches, filtering, tags, clear: () => query.update({ status: null, q: null }) };
}

/* ── 园区：栏目树 ─────────────────────────────────── */

function ParkTab() {
  const { state, rows, saveOrder } = useBoardRows("park");
  const [showArchived, setShowArchived] = useState(false);
  const [open, setOpen] = useState<Set<string>>(new Set());
  const actions = useRowActions(state.reload);
  const navigate = useNavigate();

  const filter = useRowFilter();
  const shown = (row: ItemRow) => (showArchived || filter.status === "archived" || row.status !== "archived") && filter.matches(row);
  const visible = rows.filter((row) => shown(row) || rows.some((child) => child.parentId === row.id && shown(child)));
  const archivedCount = rows.filter((row) => row.status === "archived").length;
  const topLevel = visible.filter((row) => !row.parentId);
  const childrenOf = (id: string) => visible.filter((row) => row.parentId === id);
  const topIds = topLevel.map((row) => row.id);

  // 前台序号只数已发布的栏目
  const numbers = new Map<string, number>();
  topLevel.filter((row) => row.status === "published").forEach((row, index) => numbers.set(row.id, index + 1));

  const dragTop = useDragSort((id, _from, spot) => {
    const next = moveInList(topIds, id, spot);
    if (next) void saveOrder(next);
  });
  // 子文章可以在栏目之间拖：容器就是父栏目 id
  const dragChild = useDragSort((id, from, spot) => {
    const siblings = childrenOf(spot.container).map((row) => row.id);
    const next = moveInList(siblings, id, spot);
    if (next) void saveOrder(next, from === spot.container ? undefined : spot.container);
  });

  const toggle = (id: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  if (state.error) return <ErrorState message={state.error} onRetry={state.reload} />;

  return (
    <>
      <PageHeadCard board="park" />
      <Card
        title="栏目"
        actions={
          <>
            {archivedCount > 0 && (
              <button type="button" className={showArchived ? "chip on" : "chip"} aria-pressed={showArchived} onClick={() => setShowArchived(!showArchived)}>
                已归档 {archivedCount}
              </button>
            )}
            <Link className="btn btn-filled btn-sm" to="/admin/content/new?board=park&type=column">
              <Plus size={16} strokeWidth={1.75} aria-hidden />
              新建栏目
            </Link>
          </>
        }
      >
        <FilterTags tags={filter.tags} onClearAll={filter.clear} />
        {state.loading && rows.length === 0 ? (
          <Skeleton rows={6} />
        ) : topLevel.length === 0 ? (
          <Empty>{filter.filtering ? "没有符合条件的栏目。" : "还没有栏目。"}</Empty>
        ) : (
          <ol className="tree">
            {topLevel.map((row, index) => {
              const children = childrenOf(row.id);
              const expanded = open.has(row.id) || (filter.filtering && children.length > 0);
              const no = numbers.get(row.id);
              return (
                <li key={row.id} className={["tree-node", dragTop.rowClass(row.id)].filter(Boolean).join(" ")} {...dragTop.row(row.id, "top")}>
                  <div className="tree-row">
                    {!filter.filtering && (
                      <span className="drag-handle" title="拖动排序" aria-hidden {...dragTop.handle(row.id, "top")}>
                        <GripVertical size={16} strokeWidth={1.75} />
                      </span>
                    )}
                    <span className="tree-row__no mono">{no ? String(no).padStart(2, "0") : "—"}</span>
                    <button type="button" className="icon-btn icon-btn--sm tree-row__toggle" disabled={children.length === 0} aria-expanded={expanded} title={expanded ? "收起" : "展开子文章"} aria-label={`${expanded ? "收起" : "展开"} ${row.title} 的子文章`} onClick={() => toggle(row.id)}>
                      <ChevronRight size={16} strokeWidth={1.75} aria-hidden style={{ transform: expanded ? "rotate(90deg)" : undefined }} />
                    </button>
                    <Link className="tree-row__main" to={editUrl(row.id)}>
                      <b className="dl-ellipsis">{row.title}</b>
                      <span className="muted dl-ellipsis">{row.summary || (children.length > 0 ? `${children.length} 篇子文章` : row.id)}</span>
                    </Link>
                    <RowState row={row} />
                    <span className="tree-row__actions">
                      <button type="button" className="icon-btn" title="上移" aria-label={`上移 ${row.title}`} disabled={filter.filtering || index === 0} onClick={() => { const next = stepInList(topIds, row.id, -1); if (next) void saveOrder(next); }}>
                        <ArrowUp size={18} strokeWidth={1.75} />
                      </button>
                      <button type="button" className="icon-btn" title="下移" aria-label={`下移 ${row.title}`} disabled={filter.filtering || index === topLevel.length - 1} onClick={() => { const next = stepInList(topIds, row.id, 1); if (next) void saveOrder(next); }}>
                        <ArrowDown size={18} strokeWidth={1.75} />
                      </button>
                      <RowIcons
                        row={row}
                        actions={actions}
                        extra={
                          <button type="button" className="icon-btn" title="加子文章" aria-label={`给 ${row.title} 加子文章`} onClick={() => navigate(`/admin/content/new?board=park&type=article&parentId=${encodeURIComponent(row.id)}`)}>
                            <Plus size={18} strokeWidth={1.75} />
                          </button>
                        }
                      />
                    </span>
                  </div>
                  {expanded && (
                    <ol className={["tree-children", dragChild.zoneClass(row.id)].filter(Boolean).join(" ")} {...dragChild.zone(row.id)}>
                      {children.map((child, at) => {
                        const siblingIds = children.map((c) => c.id);
                        return (
                          <li key={child.id} className={["tree-row tree-row--child", dragChild.rowClass(child.id)].filter(Boolean).join(" ")} {...dragChild.row(child.id, row.id)}>
                            {!filter.filtering && (
                              <span className="drag-handle" title="拖动排序" aria-hidden {...dragChild.handle(child.id, row.id)}>
                                <GripVertical size={16} strokeWidth={1.75} />
                              </span>
                            )}
                            <Link className="tree-row__main" to={editUrl(child.id)}>
                              <b className="dl-ellipsis">{child.title}</b>
                              <span className="muted dl-ellipsis">{child.summary || child.id}</span>
                            </Link>
                            <RowState row={child} />
                            <span className="tree-row__actions">
                              <button type="button" className="icon-btn" title="上移" aria-label={`上移 ${child.title}`} disabled={filter.filtering || at === 0} onClick={() => { const next = stepInList(siblingIds, child.id, -1); if (next) void saveOrder(next); }}>
                                <ArrowUp size={18} strokeWidth={1.75} />
                              </button>
                              <button type="button" className="icon-btn" title="下移" aria-label={`下移 ${child.title}`} disabled={filter.filtering || at === children.length - 1} onClick={() => { const next = stepInList(siblingIds, child.id, 1); if (next) void saveOrder(next); }}>
                                <ArrowDown size={18} strokeWidth={1.75} />
                              </button>
                              <RowIcons row={child} actions={actions} />
                            </span>
                          </li>
                        );
                      })}
                    </ol>
                  )}
                </li>
              );
            })}
            <li className="tree-row tree-row--link">
              <span className="tree-row__no" aria-hidden>
                <Globe size={16} strokeWidth={1.75} />
              </span>
              <Link className="tree-row__main" to="/admin/vr?tab=layout&page=park">
                <b>全景漫游</b>
                <span className="muted">不是栏目，在 VR 全景页安排</span>
              </Link>
              <ChevronRight size={16} strokeWidth={1.75} aria-hidden className="muted" />
            </li>
          </ol>
        )}
      </Card>
      {actions.confirm}
    </>
  );
}

/* ── 博物馆：文章卡片 ─────────────────────────────── */

function MuseumTab() {
  const { state, rows, saveOrder } = useBoardRows("museum");
  const [showArchived, setShowArchived] = useState(false);
  const actions = useRowActions(state.reload);
  const filter = useRowFilter();
  const visible = rows.filter((row) => (showArchived || filter.status === "archived" || row.status !== "archived") && filter.matches(row));
  const archivedCount = rows.filter((row) => row.status === "archived").length;
  const ids = visible.map((row) => row.id);
  const drag = useDragSort((id, _from, spot) => {
    const next = moveInList(ids, id, spot);
    if (next) void saveOrder(next);
  }, "x");

  if (state.error) return <ErrorState message={state.error} onRetry={state.reload} />;

  return (
    <>
      <PageHeadCard board="museum" />
      <Card
        title="文章"
        actions={
          <>
            {archivedCount > 0 && (
              <button type="button" className={showArchived ? "chip on" : "chip"} aria-pressed={showArchived} onClick={() => setShowArchived(!showArchived)}>
                已归档 {archivedCount}
              </button>
            )}
            <Link className="btn btn-filled btn-sm" to="/admin/content/new?board=museum">
              <Plus size={16} strokeWidth={1.75} aria-hidden />
              新建文章
            </Link>
          </>
        }
      >
        <FilterTags tags={filter.tags} onClearAll={filter.clear} />
        {state.loading && rows.length === 0 ? (
          <Skeleton rows={4} />
        ) : visible.length === 0 ? (
          <Empty>{filter.filtering ? "没有符合条件的文章。" : "还没有文章。"}</Empty>
        ) : (
          <ul className="article-cards">
            {visible.map((row, index) => (
              <li key={row.id} className={["article-card", drag.rowClass(row.id)].filter(Boolean).join(" ")} {...drag.row(row.id, "cards")}>
                <Link className="article-card__fig" to={editUrl(row.id)} aria-label={`编辑 ${row.title}`} tabIndex={-1}>
                  {row.coverUrl || row.thumbUrl ? <img src={row.coverUrl ?? row.thumbUrl ?? ""} alt="" loading="lazy" referrerPolicy="no-referrer" /> : <ImageIcon size={24} strokeWidth={1.5} aria-hidden />}
                </Link>
                <div className="article-card__body">
                  <Link className="article-card__title" to={editUrl(row.id)}>
                    {row.title}
                  </Link>
                  {row.subtitle && <span className="muted dl-ellipsis">{row.subtitle}</span>}
                  <span className="muted article-card__meta">{[row.date, row.author, row.sourceName].filter(Boolean).join(" · ") || row.id}</span>
                  {row.summary && <p className="muted article-card__summary">{row.summary}</p>}
                </div>
                <div className="article-card__foot">
                  {!filter.filtering && (
                    <span className="drag-handle" title="拖动排序" aria-hidden {...drag.handle(row.id, "cards")}>
                      <GripVertical size={16} strokeWidth={1.75} />
                    </span>
                  )}
                  <RowState row={row} />
                  <span className="tree-row__actions">
                    <button type="button" className="icon-btn" title="前移" aria-label={`前移 ${row.title}`} disabled={filter.filtering || index === 0} onClick={() => { const next = stepInList(ids, row.id, -1); if (next) void saveOrder(next); }}>
                      <ArrowLeft size={18} strokeWidth={1.75} />
                    </button>
                    <button type="button" className="icon-btn" title="后移" aria-label={`后移 ${row.title}`} disabled={filter.filtering || index === visible.length - 1} onClick={() => { const next = stepInList(ids, row.id, 1); if (next) void saveOrder(next); }}>
                      <ArrowRight size={18} strokeWidth={1.75} />
                    </button>
                    <RowIcons row={row} actions={actions} />
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
      {actions.confirm}
    </>
  );
}

/* ── 史料：表格 ───────────────────────────────────── */

function HistoryTab() {
  const query = useListQuery(SORTABLE);
  const status = query.pick("status", STATUS_KEYS);
  const section = query.params.get("section") ?? undefined;
  const { q, page, pageSize, sort, order } = query;
  const navigate = useNavigate();

  const sections = useAsync(() => api.historySections(), []);
  const list = useAsync(() => api.items({ board: "history", section, status, q, page, pageSize, sort, order }), [section, status, q, page, pageSize, sort, order]);
  const rows = list.data?.items ?? [];
  const selection = useSelection([section, status, q, page, pageSize, sort, order].join("|"));
  const reloadAll = () => {
    list.reload();
    sections.reload();
  };
  const { busy, run } = useBatch<ItemRow>(api.itemsBatch, { mutate: list.mutate, reload: reloadAll }, selection);
  const actions = useRowActions(reloadAll);
  const selectedRows = rows.filter((row) => selection.selected.has(row.id));

  const [managing, setManaging] = useState(false);
  const [moving, setMoving] = useState(false);

  const allCount = (sections.data?.items ?? []).reduce((sum, row) => sum + row.count, 0);

  const columns: Column<ItemRow>[] = [
    {
      key: "title",
      label: "标题 / 编号",
      width: "minmax(0, 1fr)",
      sortKey: "title",
      mobile: "grow",
      render: (row) => (
        <span className="dl-title">
          <b title={row.title}>{row.title}</b>
          <small>{row.id}</small>
        </span>
      ),
    },
    { key: "section", label: "分类", width: "96px", mobile: "hide", render: (row) => <span className="muted dl-ellipsis">{row.section || "—"}</span> },
    { key: "date", label: "日期", width: "104px", sortKey: "date", mobile: "hide", render: (row) => <span className="muted dl-ellipsis" title={row.date ?? undefined}>{row.date?.slice(0, 10) || "—"}</span> },
    { key: "status", label: "状态", width: "88px", sortKey: "status", render: (row) => <StatusPill status={row.status} /> },
    { key: "updatedAt", label: "更新时间", width: "136px", sortKey: "updatedAt", firstOrder: "desc", mobile: "hide", render: (row) => <span className="dl-time">{dateTime(row.updatedAt)}</span> },
  ];

  const tags = [
    status && { key: "status", label: `状态：${STATUSES.find((s) => s.key === status)?.label}`, onClear: () => query.update({ status: null }) },
    q && { key: "q", label: `搜索：${q}`, onClear: () => query.update({ q: null }) },
  ].filter(Boolean) as Array<{ key: string; label: string; onClear: () => void }>;
  const clearAll = () => query.update({ section: null, status: null, q: null });
  const newUrl = `/admin/content/new?board=history${section ? `&section=${encodeURIComponent(section)}` : ""}`;

  return (
    <>
      <PageHeadCard board="history" />
      <Card
        title="史料"
        actions={
          <>
            <SearchBox value={q} placeholder="搜索标题或编号" onChange={(next) => query.update({ q: next }, { replace: Boolean(q) && Boolean(next) })} />
            <button type="button" className="btn btn-sm" onClick={() => setManaging(true)}>
              <FolderCog size={15} strokeWidth={1.75} aria-hidden />
              管理分类
            </button>
            <Link className="btn btn-filled btn-sm" to={newUrl}>
              <Plus size={16} strokeWidth={1.75} aria-hidden />
              新建
            </Link>
          </>
        }
      >
        <div className="filter-bar" role="group" aria-label="按分类筛选">
          <button type="button" className={!section ? "chip on" : "chip"} aria-pressed={!section} onClick={() => query.update({ section: null })}>
            全部 <span className="chip__count">{allCount}</span>
          </button>
          {(sections.data?.items ?? []).map((row) => (
            <button key={row.name} type="button" className={section === row.name ? "chip on" : "chip"} aria-pressed={section === row.name} onClick={() => query.update({ section: section === row.name ? null : row.name })}>
              {row.name} <span className="chip__count">{row.count}</span>
            </button>
          ))}
        </div>
        <div className="filter-bar" role="group" aria-label="按状态筛选">
          {STATUSES.map((s) => (
            <button key={s.key} type="button" className={status === s.key ? "chip on" : "chip"} aria-pressed={status === s.key} onClick={() => query.update({ status: status === s.key ? null : s.key })}>
              {s.label}
            </button>
          ))}
        </div>
        <FilterTags tags={tags} onClearAll={clearAll} />

        <PagedBody
          state={list}
          query={query}
          empty={
            tags.length > 0 || section ? (
              <Empty
                action={
                  <button type="button" className="btn btn-sm" onClick={clearAll}>
                    清除筛选
                  </button>
                }
              >
                没有符合条件的史料。
              </Empty>
            ) : (
              <Empty>还没有史料。</Empty>
            )
          }
        >
          {(items) => (
            <DataList
              label="史料"
              columns={columns}
              rows={items}
              rowKey={(row) => row.id}
              query={query}
              selection={selection}
              onRowClick={(row) => navigate(editUrl(row.id))}
              actions={(row) => <RowIcons row={row} actions={actions} />}
            />
          )}
        </PagedBody>
      </Card>

      <BatchBar
        count={selectedRows.length}
        busy={busy}
        onClear={selection.clear}
        actions={[{ key: "section", label: "批量改分类", onClick: () => setMoving(true) }, ...batchActions(selectedRows, (targets, action) => void run(targets, action))]}
      />
      {actions.confirm}

      {managing && <SectionsDrawer sections={sections.data?.items ?? []} onClose={() => setManaging(false)} onChanged={reloadAll} />}
      {moving && (
        <MoveSectionDrawer
          count={selectedRows.length}
          sections={sections.data?.items ?? []}
          onClose={() => setMoving(false)}
          onMove={async (name) => {
            const result = await api.setItemsSection(selectedRows.map((row) => row.id), name);
            toast(result.failed.length > 0 ? `已改 ${result.ok.length} 条，失败 ${result.failed.length} 条：${result.failed[0].message}` : `已改 ${result.ok.length} 条`);
            selection.clear();
            setMoving(false);
            reloadAll();
          }}
        />
      )}
    </>
  );
}

function MoveSectionDrawer({ count, sections, onClose, onMove }: { count: number; sections: HistorySection[]; onClose: () => void; onMove: (name: string) => Promise<void> }) {
  const [name, setName] = useState(sections[0]?.name ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    if (!name) return;
    setBusy(true);
    setError(null);
    try {
      await onMove(name);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "没有改成");
      setBusy(false);
    }
  }

  return (
    <Drawer variant="dialog" title={`把 ${count} 条改到`} onClose={onClose} onSave={submit} saving={busy} saveText="改分类">
      {error && <ErrorBar message={error} />}
      <Field label="分类">
        <select className="select" value={name} onChange={(e) => setName(e.target.value)}>
          {sections.map((row) => (
            <option key={row.name} value={row.name}>
              {row.name}
            </option>
          ))}
        </select>
      </Field>
    </Drawer>
  );
}

/** 分类的改名和顺序：每次操作立刻写库 */
function SectionsDrawer({ sections, onClose, onChanged }: { sections: HistorySection[]; onClose: () => void; onChanged: () => void }) {
  const [rows, setRows] = useState(sections);
  const [editing, setEditing] = useState<{ from: string; to: string } | null>(null);
  const [adding, setAdding] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const names = rows.map((row) => row.name);

  useEffect(() => setRows(sections), [sections]);

  async function apply(body: { order?: string[]; rename?: { from: string; to: string } }) {
    setBusy(true);
    setError(null);
    try {
      await api.patchHistorySections(body);
      // 接口只回确认，先按这次操作改好，下一次点击才不会基于旧顺序；篇数等 onChanged 重新拉取
      setRows((prev) => {
        const { order, rename } = body;
        const renamed = rename ? prev.map((row) => (row.name === rename.from ? { ...row, name: rename.to } : row)) : prev;
        if (!order) return renamed;
        const byName = new Map(renamed.map((row) => [row.name, row]));
        return order.map((name) => byName.get(name) ?? { name, count: 0, published: 0 });
      });
      onChanged();
      return true;
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "没有保存");
      return false;
    } finally {
      setBusy(false);
    }
  }

  const drag = useDragSort((id, _from, spot) => {
    const next = moveInList(names, id, spot);
    if (next) void apply({ order: next });
  });

  async function rename() {
    if (!editing) return;
    const to = editing.to.trim();
    if (!to || to === editing.from) {
      setEditing(null);
      return;
    }
    if (await apply({ rename: { from: editing.from, to } })) {
      toast("已改名，这个分类下的文章同步改了");
      setEditing(null);
    }
  }

  async function add() {
    const name = adding.trim();
    if (!name) return;
    if (names.includes(name)) {
      setError("已经有这个分类了");
      return;
    }
    if (await apply({ order: [...names, name] })) setAdding("");
  }

  return (
    <Drawer title="管理分类" onClose={onClose}>
      {error && <ErrorBar message={error} />}
      <ul className="section-list">
        {rows.map((row, index) => (
          <li key={row.name} className={["section-row", drag.rowClass(row.name)].filter(Boolean).join(" ")} {...drag.row(row.name, "sections")}>
            <span className="drag-handle" title="拖动排序" aria-hidden {...drag.handle(row.name, "sections")}>
              <GripVertical size={16} strokeWidth={1.75} />
            </span>
            {editing?.from === row.name ? (
              <input
                className="input input--grow"
                aria-label={`${row.name} 的新名字`}
                autoFocus
                value={editing.to}
                onChange={(e) => setEditing({ from: row.name, to: e.target.value })}
                onBlur={() => void rename()}
                onKeyDown={(e) => {
                  if (e.key === "Enter") void rename();
                  if (e.key === "Escape") {
                    e.stopPropagation();
                    setEditing(null);
                  }
                }}
              />
            ) : (
              <span className="section-row__name">
                <b className="dl-ellipsis">{row.name}</b>
                <span className="muted">
                  {row.count} 篇，已发布 {row.published}
                </span>
              </span>
            )}
            <button type="button" className="icon-btn" title="改名" aria-label={`改名 ${row.name}`} disabled={busy} onClick={() => setEditing({ from: row.name, to: row.name })}>
              <Pencil size={16} strokeWidth={1.75} />
            </button>
            <button type="button" className="icon-btn" title="上移" aria-label={`上移 ${row.name}`} disabled={busy || index === 0} onClick={() => { const next = stepInList(names, row.name, -1); if (next) void apply({ order: next }); }}>
              <ArrowUp size={16} strokeWidth={1.75} />
            </button>
            <button type="button" className="icon-btn" title="下移" aria-label={`下移 ${row.name}`} disabled={busy || index === rows.length - 1} onClick={() => { const next = stepInList(names, row.name, 1); if (next) void apply({ order: next }); }}>
              <ArrowDown size={16} strokeWidth={1.75} />
            </button>
          </li>
        ))}
      </ul>
      <div className="section-add">
        <input
          className="input input--grow"
          aria-label="新分类名称"
          placeholder="新分类名称"
          value={adding}
          onChange={(e) => setAdding(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") void add();
          }}
        />
        <button type="button" className="btn" disabled={busy || !adding.trim()} onClick={() => void add()}>
          <Plus size={15} strokeWidth={1.75} aria-hidden />
          添加
        </button>
      </div>
    </Drawer>
  );
}
