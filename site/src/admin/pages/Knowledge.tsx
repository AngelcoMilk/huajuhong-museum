// 知识库：切片 / 检索测试 / 知识缺口 / Wiki 四个 Tab，当前 Tab 写进 URL。
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { BookOpen, CircleHelp, Copy, Layers, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { api, ApiError } from "../api";
import { DataList, FilterTags, PagedBody, SearchBox, useListQuery, type Column } from "../list";
import { Advanced, applyApiError, Card, Confirm, dateTime, Drawer, Empty, ErrorBar, Field, PageHeadExtra, Segmented, Skeleton, toast, useAsync, useIsNarrow, useFormState } from "../ui";

const TABS = [
  { value: "slices", label: "知识切片", icon: <Layers size={16} strokeWidth={1.75} aria-hidden /> },
  { value: "search", label: "检索测试", icon: <Search size={16} strokeWidth={1.75} aria-hidden /> },
  { value: "gaps", label: "知识缺口", icon: <CircleHelp size={16} strokeWidth={1.75} aria-hidden /> },
  { value: "wiki", label: "Wiki", icon: <BookOpen size={16} strokeWidth={1.75} aria-hidden /> },
];
const TAB_KEYS = TABS.map((t) => t.value);

export default function Knowledge() {
  const query = useListQuery([]);
  const tab = query.pick("tab", TAB_KEYS) ?? "slices";
  return (
    <>
      <PageHeadExtra>
        <Segmented
          value={tab}
          // 切 Tab 时各 Tab 自己的筛选不带过去
          onChange={(next) => query.update({ tab: next === "slices" ? null : next, q: null, status: null, sort: null, order: null, slug: null, pageSize: null })}
          options={TABS}
          label="知识库视图"
          size="md"
        />
      </PageHeadExtra>
      {tab === "slices" && <Slices />}
      {tab === "search" && <SearchTest />}
      {tab === "gaps" && <Gaps />}
      {tab === "wiki" && <Wiki />}
    </>
  );
}

type SliceRow = Awaited<ReturnType<typeof api.kbSlices>>["items"][number];

function Slices() {
  const query = useListQuery(["id", "title", "source"]);
  const { q, page, pageSize, sort, order } = query;
  const list = useAsync(() => api.kbSlices({ q, page, pageSize, sort, order }), [q, page, pageSize, sort, order]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [removing, setRemoving] = useState<SliceRow | null>(null);

  async function remove() {
    if (!removing) return;
    try {
      await api.deleteKbSlice(removing.id);
      toast("切片已删除");
      list.reload();
    } catch (err) {
      toast(err instanceof ApiError ? err.message : "删除失败");
    } finally {
      setRemoving(null);
    }
  }

  const tags = q ? [{ key: "q", label: `搜索：${q}`, onClear: () => query.update({ q: null }) }] : [];

  const columns: Column<SliceRow>[] = [
    {
      key: "title",
      label: "标题 / 编号",
      width: "minmax(0, 1fr)",
      sortKey: "title",
      mobile: "grow",
      render: (row) => (
        <>
          <span className="dl-title dl-ellipsis">{row.title}</span>
          <span className="muted mono dl-ellipsis">{row.id}</span>
        </>
      ),
    },
    { key: "origin", label: "出处", width: "minmax(0, 160px)", mobile: "hide", render: (row) => <span className="muted dl-ellipsis">{row.origin ?? "馆内整理资料"}</span> },
    { key: "source", label: "来源", width: "minmax(0, 160px)", sortKey: "source", mobile: "hide", render: (row) => <span className="muted dl-ellipsis">{row.source || "未标来源"}</span> },
    { key: "updated", label: "更新时间", width: "128px", mobile: "hide", render: (row) => <span className="dl-time">{row.updatedAt ? dateTime(row.updatedAt) : "—"}</span> },
  ];

  return (
    <>
      <Card
        actions={
          <button type="button" className="btn btn-filled btn-sm" onClick={() => setCreating(true)}>
            <Plus size={16} strokeWidth={1.75} aria-hidden />
            新建切片
          </button>
        }
      >
        <div className="filter-bar">
          <SearchBox value={q} onChange={(next) => query.update({ q: next || null }, { replace: true })} placeholder="搜索标题或正文" />
        </div>
        <FilterTags tags={tags} onClearAll={() => query.update({ q: null })} />
        <PagedBody
          state={list}
          query={query}
          empty={
            q ? (
              <Empty
                action={
                  <button type="button" className="btn btn-sm" onClick={() => query.update({ q: null })}>
                    清除筛选
                  </button>
                }
              >
                没有匹配的切片。
              </Empty>
            ) : (
              <Empty
                action={
                  <button type="button" className="btn btn-filled btn-sm" onClick={() => setCreating(true)}>
                    新建切片
                  </button>
                }
              >
                还没有知识切片，讲解员现在没有资料可查。
              </Empty>
            )
          }
        >
          {(items) => (
            <DataList
              label="知识切片"
              columns={columns}
              rows={items}
              rowKey={(row) => row.id}
              query={query}
              onRowClick={(row) => setOpenId(row.id)}
              actionsWidth="84px"
              actions={(row) => (
                <>
                  <button type="button" className="icon-btn" title="编辑" aria-label={`编辑 ${row.title}`} onClick={() => setEditingId(row.id)}>
                    <Pencil size={18} strokeWidth={1.75} />
                  </button>
                  <button type="button" className="icon-btn" title="删除" aria-label={`删除 ${row.title}`} onClick={() => setRemoving(row)}>
                    <Trash2 size={18} strokeWidth={1.75} />
                  </button>
                </>
              )}
            />
          )}
        </PagedBody>
      </Card>

      {openId && <SliceReader key={openId} id={openId} onClose={() => setOpenId(null)} onEdit={() => setEditingId(openId)} />}
      {editingId && <SliceLoader key={editingId} id={editingId} onClose={() => setEditingId(null)} onSaved={list.reload} />}
      {creating && <SliceEditor onClose={() => setCreating(false)} onSaved={list.reload} />}

      <Confirm
        open={Boolean(removing)}
        title="删除这片切片？"
        desc="删除后无法恢复，讲解员将检索不到这段资料。"
        confirmText="删除"
        danger
        onConfirm={() => void remove()}
        onCancel={() => setRemoving(null)}
      />
    </>
  );
}

function SliceReader({ id, onClose, onEdit }: { id: string; onClose: () => void; onEdit: () => void }) {
  const slice = useAsync(() => api.kbSlice(id), [id]);

  async function copy() {
    if (!slice.data) return;
    const text = `${slice.data.content}\n\n—— 出处：${slice.data.origin ?? "知识库"}${slice.data.url ? ` ${slice.data.url}` : ""}`;
    try {
      await navigator.clipboard.writeText(text);
      toast("已复制正文与出处");
    } catch {
      toast("复制失败，请手动选择文本");
    }
  }

  return (
    <Drawer
      title="阅读切片"
      onClose={onClose}
      footer={
        <>
          <button type="button" className="btn btn-outline" onClick={() => void copy()} disabled={!slice.data}>
            <Copy size={16} strokeWidth={1.75} aria-hidden />
            复制正文与出处
          </button>
          <button type="button" className="btn btn-filled" onClick={onEdit} disabled={!slice.data}>
            编辑
          </button>
        </>
      }
    >
      {slice.loading && !slice.data && <Skeleton rows={6} />}
      {slice.error && <ErrorBar message={slice.error} onRetry={slice.reload} />}
      {slice.data && (
        <article className="reader">
          <h1>{slice.data.title}</h1>
          <div className="meta">
            出处：{slice.data.origin ?? "知识库"}
            {slice.data.url && (
              <>
                {" · "}
                <a href={slice.data.url} target="_blank" rel="noreferrer">
                  原文
                </a>
              </>
            )}
          </div>
          <p>{slice.data.content}</p>
        </article>
      )}
    </Drawer>
  );
}

/** 列表行没有正文，编辑前先取完整切片 */
function SliceLoader({ id, onClose, onSaved }: { id: string; onClose: () => void; onSaved: () => void }) {
  const slice = useAsync(() => api.kbSlice(id), [id]);
  if (!slice.data) {
    return (
      <Drawer title="读取中…" onClose={onClose}>
        {slice.error ? <ErrorBar message={slice.error} onRetry={slice.reload} /> : <Skeleton rows={6} />}
      </Drawer>
    );
  }
  return <SliceEditor initial={{ ...slice.data, id }} onClose={onClose} onSaved={onSaved} />;
}

function SliceEditor({
  initial,
  onClose,
  onSaved,
}: {
  initial?: { id: string; title: string; source: string; content: string; origin: string | null; url: string | null };
  onClose: () => void;
  onSaved: () => void;
}) {
  const { form, dirty, errors, setErrors, bind } = useFormState({
    title: initial?.title ?? "",
    source: initial?.source ?? "",
    content: initial?.content ?? "",
    origin: initial?.origin ?? "",
    url: initial?.url ?? "",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    const title = form.title.trim();
    const source = form.source.trim();
    const content = form.content.trim();
    const next: Record<string, string> = {};
    if (!title) next.title = "标题不能为空";
    if (!source) next.source = "来源不能为空";
    if (!content) next.content = "正文不能为空";
    if (Object.keys(next).length > 0) {
      setErrors(next);
      return;
    }
    setBusy(true);
    setError(null);
    const body = { title, source, content, origin: form.origin.trim() || null, url: form.url.trim() || null };
    try {
      if (initial) await api.patchKbSlice(initial.id, body);
      else await api.createKbSlice(body);
      toast(initial ? "切片已保存" : "切片已新建");
      onSaved();
      onClose();
    } catch (err) {
      setError(applyApiError(err, setErrors, "保存失败"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Drawer title={initial ? "编辑切片" : "新建切片"} onClose={onClose} onSave={save} saving={busy} saveText={initial ? "保存" : "创建"} dirty={dirty}>
      {error && <ErrorBar message={error} />}
      <Field label="标题" hint="讲解员检索命中后先给访客看这一句" error={errors.title}>
        <input className="input" {...bind("title")} placeholder="例如：七爪的割取方法" />
      </Field>
      <Field label="来源" hint="这段资料从哪来" error={errors.source}>
        <input className="input" {...bind("source")} placeholder="馆内整理资料" />
      </Field>
      <Field label="正文" hint="讲解员照着这段回答，写完整句子，别写关键词堆" error={errors.content}>
        <textarea className="textarea" rows={10} {...bind("content")} placeholder="把这片资料完整写下来…" />
      </Field>
      <Advanced open={Boolean(errors.origin || errors.url)}>
        <Field label="出处" hint="显示在阅读器顶部" error={errors.origin}>
          <input className="input" {...bind("origin")} placeholder="例如：博物馆展签" />
        </Field>
        <Field label="原文链接" hint="填了阅读器里会给出「原文」入口" error={errors.url}>
          <input className="input" {...bind("url")} placeholder="https://…" inputMode="url" />
        </Field>
      </Advanced>
    </Drawer>
  );
}

function SearchTest() {
  const query = useListQuery([]);
  const applied = query.q;
  const [draft, setDraft] = useState(applied);
  const result = useAsync(() => (applied ? api.kbSearch(applied) : Promise.resolve(null)), [applied]);

  function run(event: React.FormEvent) {
    event.preventDefault();
    const value = draft.trim();
    if (value === applied) result.reload();
    else query.update({ q: value || null });
  }

  return (
    <Card actions={<span className="muted">和讲解员同一套检索</span>}>
      <form className="inline-form" onSubmit={run}>
        <input className="input" placeholder="输入访客可能问的问题，例如：七爪怎么割" aria-label="检索内容" value={draft} onChange={(e) => setDraft(e.target.value)} />
        <button type="submit" className="btn btn-filled" disabled={result.loading}>
          {result.loading ? "检索中…" : "检索"}
        </button>
      </form>
      {result.error && <ErrorBar message={result.error} onRetry={result.reload} />}
      {result.loading && !result.data && applied && <Skeleton rows={4} />}
      {!applied && <Empty compact>输入一句话，看讲解员能检索到哪些切片。</Empty>}
      {result.data && result.data.hits.length === 0 && <Empty compact>没有命中任何切片，这正是「知识缺口」该记下来的情形。</Empty>}
      {result.data && result.data.hits.length > 0 && (
        <div className="mini-list">
          {result.data.hits.map((hit, index) => (
            <div className="kv" key={hit.id}>
              <span className="muted mono kv__rank">{index + 1}</span>
              <span className="kv__main">
                <span className="dl-ellipsis">{hit.title}</span>
                <span className="muted dl-ellipsis">{hit.origin ?? "馆内整理资料"}</span>
              </span>
              <span className="muted mono">{hit.score.toFixed(1)}</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

const GAP_STATUS = [
  { key: "pending", label: "待处理", tone: "pill pill--warn" },
  { key: "filled", label: "已补", tone: "pill pill--ok" },
  { key: "ignored", label: "已忽略", tone: "pill" },
] as const;
const GAP_KEYS = GAP_STATUS.map((s) => s.key);

type GapRow = Awaited<ReturnType<typeof api.gaps>>["items"][number];

function Gaps() {
  const query = useListQuery(["count", "lastSeenAt"]);
  const status = query.pick("status", GAP_KEYS);
  const { page, pageSize, sort, order } = query;
  const list = useAsync(() => api.gaps({ status, page, pageSize, sort, order }), [status, page, pageSize, sort, order]);

  async function setStatus(row: GapRow, next: string) {
    const label = GAP_STATUS.find((s) => s.key === next)?.label ?? next;
    try {
      await api.patchGap(row.id, next);
      list.reload();
      toast(`已标记为${label}`, {
        action: {
          label: "撤销",
          run: () =>
            void api
              .patchGap(row.id, row.status)
              .then(() => {
                toast("已撤销");
                list.reload();
              })
              .catch((err) => toast(err instanceof ApiError ? `撤销失败：${err.message}` : "撤销失败")),
        },
      });
    } catch (err) {
      toast(err instanceof ApiError ? err.message : "操作失败");
    }
  }

  const tags = status ? [{ key: "status", label: `状态：${GAP_STATUS.find((s) => s.key === status)?.label}`, onClear: () => query.update({ status: null }) }] : [];

  const columns: Column<GapRow>[] = [
    { key: "question", label: "访客问题", width: "minmax(0, 1fr)", mobile: "grow", render: (row) => <span className="dl-title dl-ellipsis">{row.question}</span> },
    { key: "count", label: "次数", width: "64px", sortKey: "count", firstOrder: "desc", align: "end", render: (row) => <span className="mono">{row.count}</span> },
    { key: "seen", label: "最近出现", width: "128px", sortKey: "lastSeenAt", firstOrder: "desc", mobile: "hide", render: (row) => <span className="dl-time">{dateTime(row.lastSeenAt)}</span> },
    { key: "status", label: "状态", width: "84px", render: (row) => <span className={GAP_STATUS.find((s) => s.key === row.status)?.tone ?? "pill"}>{GAP_STATUS.find((s) => s.key === row.status)?.label ?? row.status}</span> },
  ];

  return (
    <Card>
      <div className="filter-bar">
        <div className="chip-group" role="group" aria-label="状态">
          {GAP_STATUS.map((s) => (
            <button key={s.key} type="button" className={status === s.key ? "chip on" : "chip"} onClick={() => query.update({ status: status === s.key ? null : s.key })}>
              {s.label}
            </button>
          ))}
        </div>
      </div>
      <FilterTags tags={tags} onClearAll={() => query.update({ status: null })} />
      <PagedBody
        state={list}
        query={query}
        empty={
          status ? (
            <Empty
              action={
                <button type="button" className="btn btn-sm" onClick={() => query.update({ status: null })}>
                  清除筛选
                </button>
              }
            >
              这个状态下没有缺口。
            </Empty>
          ) : (
            <Empty>暂无知识缺口。讲解员答不上来的问题会记在这里。</Empty>
          )
        }
      >
        {(items) => (
          <DataList
            label="知识缺口"
            columns={columns}
            rows={items}
            rowKey={(row) => row.id}
            query={query}
            actionsWidth="136px"
            actions={(row) =>
              row.status === "pending" ? (
                <>
                  <button type="button" className="btn btn-outline btn-sm" onClick={() => void setStatus(row, "filled")}>
                    已补
                  </button>
                  <button type="button" className="btn btn-text btn-sm" onClick={() => void setStatus(row, "ignored")}>
                    忽略
                  </button>
                </>
              ) : (
                <button type="button" className="btn btn-text btn-sm" onClick={() => void setStatus(row, "pending")}>
                  恢复待处理
                </button>
              )
            }
          />
        )}
      </PagedBody>
    </Card>
  );
}

function Wiki() {
  const query = useListQuery([]);
  const slug = query.params.get("slug");
  const narrow = useIsNarrow();
  const pages = useAsync(() => api.kbWiki(), []);
  const keyword = query.q.trim();
  const filtered = (pages.data ?? []).filter((p) => !keyword || p.title.includes(keyword));
  // 宽屏默认读第一页；窄屏不自动弹抽屉
  const active = slug ?? (narrow ? null : (filtered[0]?.slug ?? null));

  return (
    <div className="wiki-layout">
      <Card className="wiki-list">
        <SearchBox value={query.q} onChange={(next) => query.update({ q: next || null }, { replace: true })} placeholder="按标题筛选" />
        {pages.loading && !pages.data && <Skeleton rows={6} />}
        {pages.error && <ErrorBar message={pages.error} onRetry={pages.reload} />}
        {pages.data && filtered.length === 0 && <Empty compact>没有匹配的主题页。</Empty>}
        <div className="mini-list">
          {filtered.map((page) => (
            <button key={page.slug} type="button" className="kv kv--link" aria-current={active === page.slug ? "true" : undefined} onClick={() => query.update({ slug: page.slug })}>
              <span className="kv__main">
                <span className="dl-ellipsis">{page.title}</span>
                <span className="muted">
                  {page.updated ? `更新于 ${page.updated}` : "—"} · {Math.round(page.chars / 100) / 10}k 字
                </span>
              </span>
            </button>
          ))}
        </div>
      </Card>

      {!narrow && <Card className="wiki-pane">{active ? <WikiArticle key={active} slug={active} /> : <Empty compact>左边选一页开始读。</Empty>}</Card>}

      {narrow && slug && (
        <Drawer title="Wiki 阅读" onClose={() => query.update({ slug: null })}>
          <WikiArticle key={slug} slug={slug} />
        </Drawer>
      )}
    </div>
  );
}

function WikiArticle({ slug }: { slug: string }) {
  const page = useAsync(() => api.kbWikiPage(slug), [slug]);
  const body = (page.data?.markdown ?? "").replace(/^---\n[\s\S]*?\n---\n?/, "");
  if (page.loading && !page.data) return <Skeleton rows={8} />;
  if (page.error) return <ErrorBar message={page.error} onRetry={page.reload} />;
  return (
    <article className="reader md-body">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
    </article>
  );
}
