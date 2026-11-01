// VR 全景：场景列表（增删改查、批量）+ 页面布局（分组顺序、场景顺序、大图或网格）。
// 对接 /api/admin/vr-scenes、/vr-groups、/vr/layout；公开只读在 /api/content/vr。
import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, CircleArrowDown, CircleArrowUp, Eye, EyeOff, ExternalLink, FolderInput, GripVertical, Image as ImageIcon, LayoutGrid, List, Pencil, Plus, Star, Trash2 } from "lucide-react";
import { api, ApiError, type VrGroup, type VrLayout, type VrPage, type VrScene } from "../api";
import { ImageInput } from "../blocks";
import { BatchBar, batchActions, DataList, FilterTags, ITEM_STATUSES as STATUSES, PagedBody, SearchBox, StatusPill, useBatch, useListQuery, useSelection, type Column } from "../list";
import { moveInList, stepInList, useDragSort } from "../sortable";
import { Advanced, applyApiError, Card, Confirm, Drawer, Empty, ErrorBar, ErrorState, Field, Menu, PageHeadExtra, Segmented, Skeleton, toast, useAsync, useFormState } from "../ui";

const PAGES = [
  { value: "park" as const, label: "园区" },
  { value: "museum" as const, label: "博物馆" },
];
const PAGE_KEYS = PAGES.map((p) => p.value);
const PAGE_OF_GROUP: Record<string, VrPage> = { 园区: "park", 博物馆: "museum" };
const GROUP_OF_PAGE: Record<VrPage, string> = { park: "园区", museum: "博物馆" };
const STATUS_KEYS = STATUSES.map((s) => s.key);
const SORTABLE = ["sort", "id", "title"] as const;
const TABS = [
  { value: "scenes", label: "场景", icon: <List size={16} strokeWidth={1.75} aria-hidden /> },
  { value: "layout", label: "页面布局", icon: <LayoutGrid size={16} strokeWidth={1.75} aria-hidden /> },
];
const TAB_KEYS = TABS.map((t) => t.value);

function Thumb({ scene, className = "dl-thumb" }: { scene: Pick<VrScene, "thumb">; className?: string }) {
  const [broken, setBroken] = useState(false);
  if (!scene.thumb || broken) {
    return (
      <span className={className} aria-hidden="true">
        <ImageIcon size={18} strokeWidth={1.5} />
      </span>
    );
  }
  return <img className={className} src={scene.thumb} alt="" loading="lazy" referrerPolicy="no-referrer" onError={() => setBroken(true)} />;
}

export default function VrScenes() {
  const query = useListQuery(SORTABLE);
  const tab = query.pick("tab", TAB_KEYS) ?? "scenes";
  return (
    <>
      <PageHeadExtra>
        <Segmented value={tab} onChange={(next) => query.update({ tab: next === "scenes" ? null : next, q: null, group: null, status: null, groupId: null, sort: null, order: null })} options={TABS} label="VR 视图" size="md" />
      </PageHeadExtra>
      {tab === "scenes" ? <ScenesTab /> : <LayoutTab />}
    </>
  );
}

/* ── 场景列表 ─────────────────────────────────────── */

function ScenesTab() {
  const query = useListQuery(SORTABLE);
  const group = query.pick("group", ["园区", "博物馆"] as const);
  const status = query.pick("status", STATUS_KEYS);
  const groupId = query.params.get("groupId") ?? undefined;
  const { q, page, pageSize, sort, order } = query;

  const groups = useAsync(() => api.vrGroups(), []);
  const list = useAsync(() => api.vrScenes({ q, group, status, groupId, page, pageSize, sort, order }), [q, group, status, groupId, page, pageSize, sort, order]);
  const rows = list.data?.items ?? [];
  const selection = useSelection([q, group, status, groupId, page, pageSize, sort, order].join("|"));
  const { busy, run } = useBatch<VrScene>(api.vrBatch, list, selection);
  const selectedRows = rows.filter((row) => selection.selected.has(row.id));

  const [editing, setEditing] = useState<VrScene | null>(null);
  const [creating, setCreating] = useState(false);

  const allGroups = groups.data?.items ?? [];
  const groupName = new Map(allGroups.map((g) => [g.id, g.name]));
  const pageGroups = group ? allGroups.filter((g) => g.page === PAGE_OF_GROUP[group]) : allGroups;

  const tags = [
    group && { key: "group", label: `页面：${group}`, onClear: () => query.update({ group: null, groupId: null }) },
    groupId && { key: "groupId", label: `分组：${groupName.get(groupId) ?? groupId}`, onClear: () => query.update({ groupId: null }) },
    status && { key: "status", label: `状态：${STATUSES.find((s) => s.key === status)?.label}`, onClear: () => query.update({ status: null }) },
    q && { key: "q", label: `搜索：${q}`, onClear: () => query.update({ q: null }) },
  ].filter(Boolean) as Array<{ key: string; label: string; onClear: () => void }>;
  const clearAll = () => query.update({ group: null, groupId: null, status: null, q: null });

  const columns: Column<VrScene>[] = [
    { key: "thumb", label: "", width: "44px", mobile: "hide", render: (row) => <Thumb key={row.thumb ?? ""} scene={row} /> },
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
    {
      key: "group",
      label: "分组",
      width: "minmax(0, 200px)",
      render: (row) => {
        const text = [row.group, row.groupId ? groupName.get(row.groupId) : null].filter(Boolean).join(" · ");
        return (
          <span className="muted dl-ellipsis" title={text}>
            {text}
          </span>
        );
      },
    },
    { key: "iframe", label: "嵌入地址", width: "88px", mobile: "hide", render: (row) => (row.iframe ? <span className="pill pill--ok">已配置</span> : <span className="pill pill--warn">缺失</span>) },
    { key: "status", label: "状态", width: "88px", render: (row) => <StatusPill status={row.status} /> },
  ];

  return (
    <>
      <Card
        title="场景列表"
        actions={
          <button type="button" className="btn btn-filled btn-sm" onClick={() => setCreating(true)}>
            <Plus size={16} strokeWidth={1.75} aria-hidden />
            新建场景
          </button>
        }
      >
        <div className="filter-bar">
          <SearchBox value={q} onChange={(next) => query.update({ q: next || null }, { replace: true })} placeholder="搜索标题或编号" />
          <div className="chip-group" role="group" aria-label="页面">
            {PAGES.map((p) => {
              const key = GROUP_OF_PAGE[p.value] as "园区" | "博物馆";
              return (
                <button key={key} type="button" className={group === key ? "chip on" : "chip"} onClick={() => query.update({ group: group === key ? null : key, groupId: null })}>
                  {key}
                </button>
              );
            })}
          </div>
          <select className="select select--sm" aria-label="分组" value={groupId ?? ""} onChange={(e) => query.update({ groupId: e.target.value || null })}>
            <option value="">全部分组</option>
            {pageGroups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
          <div className="chip-group" role="group" aria-label="状态">
            {STATUSES.map((s) => (
              <button key={s.key} type="button" className={status === s.key ? "chip on" : "chip"} onClick={() => query.update({ status: status === s.key ? null : s.key })}>
                {s.label}
              </button>
            ))}
          </div>
        </div>
        <FilterTags tags={tags} onClearAll={clearAll} />

        <PagedBody
          state={list}
          query={query}
          empty={
            tags.length > 0 ? (
              <Empty
                action={
                  <button type="button" className="btn btn-sm" onClick={clearAll}>
                    清除筛选
                  </button>
                }
              >
                没有符合条件的场景。
              </Empty>
            ) : (
              <Empty
                action={
                  <button type="button" className="btn btn-filled btn-sm" onClick={() => setCreating(true)}>
                    新建场景
                  </button>
                }
              >
                还没有 VR 场景，新建第一个吧。
              </Empty>
            )
          }
        >
          {(items) => (
            <DataList
              label="VR 场景"
              columns={columns}
              rows={items}
              rowKey={(row) => row.id}
              query={query}
              selection={selection}
              onRowClick={setEditing}
              actions={(row) => {
                const live = row.status === "published";
                return (
                  <>
                    <button type="button" className="icon-btn" title={live ? "下架" : "发布"} aria-label={`${live ? "下架" : "发布"} ${row.title}`} disabled={busy} onClick={() => void run([row], live ? "unpublish" : "publish")}>
                      {live ? <CircleArrowDown size={18} strokeWidth={1.75} /> : <CircleArrowUp size={18} strokeWidth={1.75} />}
                    </button>
                    <button type="button" className="icon-btn" title="编辑" aria-label={`编辑 ${row.title}`} onClick={() => setEditing(row)}>
                      <Pencil size={18} strokeWidth={1.75} />
                    </button>
                    {row.iframe ? (
                      <a className="icon-btn" href={row.iframe} target="_blank" rel="noopener noreferrer" referrerPolicy="no-referrer" title="打开全景" aria-label={`打开全景 ${row.title}`}>
                        <ExternalLink size={18} strokeWidth={1.75} />
                      </a>
                    ) : (
                      <span className="icon-btn" role="link" aria-disabled="true" title="还没有嵌入地址">
                        <ExternalLink size={18} strokeWidth={1.75} />
                      </span>
                    )}
                  </>
                );
              }}
            />
          )}
        </PagedBody>
      </Card>

      <BatchBar count={selectedRows.length} busy={busy} onClear={selection.clear} actions={batchActions(selectedRows, (targets, action) => void run(targets, action))} />

      {(creating || editing) && (
        <VrEditor
          key={editing?.id ?? "new"}
          row={editing}
          groups={allGroups}
          defaultPage={group ? PAGE_OF_GROUP[group] : "park"}
          defaultGroupId={groupId}
          onClose={() => {
            setCreating(false);
            setEditing(null);
          }}
          onSaved={list.reload}
        />
      )}
    </>
  );
}

/* ── 场景编辑抽屉 ─────────────────────────────────── */

const CHECK_TEXT: Record<string, string> = {
  blocked: "这个地址不能用，请换一个公开的全景地址。",
  timeout: "这个地址打开超时了，请确认它能正常访问。",
  unreachable: "这个地址打不开，请确认填得对不对。",
  http_error: "这个地址打不开，请确认填得对不对。",
  pano_missing: "这个全景的内容找不到了，前台会放不出来。",
};

/** 嵌入地址就地检查：填完就知道能不能打开 */
function useUrlCheck(url: string) {
  const [state, setState] = useState<{ url: string; status: "checking" | "ok" | "bad"; text?: string } | null>(null);
  const latest = useRef(url);
  latest.current = url;

  async function check(target: string) {
    const value = target.trim();
    if (!/^https:\/\//i.test(value)) {
      setState(null);
      return;
    }
    setState({ url: value, status: "checking" });
    try {
      const result = await api.checkVrUrl(value);
      if (latest.current.trim() !== value) return;
      setState(result.ok ? { url: value, status: "ok" } : { url: value, status: "bad", text: CHECK_TEXT[result.reason ?? "unreachable"] ?? CHECK_TEXT.unreachable });
    } catch {
      // 检查本身失败不算地址有问题，不打扰
      if (latest.current.trim() === value) setState(null);
    }
  }

  return { state: state?.url === url.trim() ? state : null, check };
}

function VrEditor({ row, groups, defaultPage, defaultGroupId, onClose, onSaved }: { row: VrScene | null; groups: VrGroup[]; defaultPage: VrPage; defaultGroupId?: string; onClose: () => void; onSaved: () => void }) {
  const { form, dirty, errors, setErrors, set, bind } = useFormState({
    page: (row ? PAGE_OF_GROUP[row.group] : defaultPage) ?? "park",
    groupId: row?.groupId ?? defaultGroupId ?? "",
    title: row?.title ?? "",
    description: row?.description ?? "",
    gid: row?.gid ?? "",
    sceneId: row?.sceneId ?? "",
    thumb: row?.thumb ?? "",
    preview: row?.preview ?? "",
    iframe: row?.iframe ?? "",
    status: row?.status ?? "published",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const { state: urlState, check } = useUrlCheck(form.iframe);
  const pageGroups = groups.filter((g) => g.page === form.page);

  useEffect(() => {
    if (form.iframe) void check(form.iframe);
    // 只在打开时查一次，之后失焦才查
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function save() {
    const next: Record<string, string> = {};
    if (!form.title.trim()) next.title = "标题不能为空";
    if (form.status === "published" && !form.iframe.trim()) next.iframe = "发布的场景要有嵌入地址";
    if (form.iframe.trim() && !/^https:\/\//i.test(form.iframe.trim())) next.iframe = "嵌入地址要以 https:// 开头";
    if (Object.keys(next).length > 0) {
      setErrors(next);
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const body = {
        group: GROUP_OF_PAGE[form.page],
        groupId: form.groupId || null,
        title: form.title.trim(),
        description: form.description.trim() || null,
        gid: form.gid.trim() || null,
        sceneId: form.sceneId.trim() || null,
        thumb: form.thumb.trim() || null,
        preview: form.preview.trim() || null,
        iframe: form.iframe.trim() || null,
        status: form.status,
      };
      if (row) await api.patchVrScene(row.id, body);
      else await api.createVrScene(body);
      toast(row ? "场景已更新" : "场景已创建");
      onSaved();
      onClose();
    } catch (err) {
      setError(applyApiError(err, setErrors, "保存失败"));
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!row) return;
    setBusy(true);
    try {
      await api.deleteVrScene(row.id);
      toast("场景已删除");
      onSaved();
      onClose();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "删除失败");
    } finally {
      setBusy(false);
      setConfirming(false);
    }
  }

  return (
    <Drawer
      title={row ? row.title : "新建 VR 场景"}
      status={<StatusPill status={form.status} />}
      onClose={onClose}
      onSave={save}
      saving={busy}
      saveText={row ? "保存" : "创建"}
      dirty={dirty}
      footerExtra={
        row && (
          <button type="button" className="btn btn-danger" onClick={() => setConfirming(true)} disabled={busy}>
            删除场景
          </button>
        )
      }
    >
      {error && <ErrorBar message={error} />}
      <Field label="状态">
        <Segmented size="md" value={form.status} onChange={(next) => set("status", next)} options={STATUSES.map((s) => ({ value: s.key, label: s.label }))} label="状态" />
      </Field>
      <Field label="标题" error={errors.title}>
        <input className="input" {...bind("title")} placeholder="场景名称" aria-invalid={Boolean(errors.title) || undefined} />
      </Field>
      <div className="form-grid">
        <Field label="页面" error={errors.group}>
          <Segmented
            value={form.page}
            onChange={(next) => {
              set("page", next);
              set("groupId", "");
            }}
            options={PAGES}
            label="页面"
          />
        </Field>
        <Field label="分组" error={errors.groupId}>
          <select className="select" {...bind("groupId")}>
            <option value="">不分组（排在「其他场景」）</option>
            {pageGroups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <Field label="嵌入地址" error={errors.iframe}>
        <input className="input" {...bind("iframe")} placeholder="https://…" aria-invalid={Boolean(errors.iframe) || undefined} onBlur={() => void check(form.iframe)} />
        {urlState?.status === "checking" && <p className="field__hint">正在检查…</p>}
        {urlState?.status === "ok" && <p className="field__hint">地址可以打开。</p>}
        {urlState?.status === "bad" && <p className="field__error">{urlState.text}</p>}
        {/^https:\/\//i.test(form.iframe.trim()) && (
          <button type="button" className="btn btn-text btn-sm" style={{ justifySelf: "start" }} onClick={() => setPreviewing(!previewing)}>
            {previewing ? "收起全景" : "看一下全景"}
          </button>
        )}
        {previewing && /^https:\/\//i.test(form.iframe.trim()) && <iframe className="vr-preview" src={form.iframe.trim()} title="全景预览" referrerPolicy="no-referrer" sandbox="allow-scripts allow-same-origin" loading="lazy" />}
      </Field>
      <Field label="缩略图" error={errors.thumb}>
        <ImageInput label="缩略图地址" value={form.thumb} invalid={Boolean(errors.thumb)} placeholder="/img/vr/xxx.jpg、完整地址，或上传" onChange={(next) => set("thumb", next)} />
      </Field>
      <Field label="描述" error={errors.description}>
        <textarea className="textarea" style={{ minHeight: 72 }} {...bind("description")} />
      </Field>
      <Advanced open={Boolean(errors.preview)}>
        <div className="form-grid">
          <Field label="场景编号">
            <input className="input mono" {...bind("sceneId")} placeholder="全景平台的场景编号" />
          </Field>
          <Field label="分组编号">
            <input className="input mono" {...bind("gid")} placeholder="可留空" />
          </Field>
        </div>
        <Field label="预览地址" error={errors.preview}>
          <input className="input" {...bind("preview")} placeholder="全景预览地址，可留空" />
        </Field>
      </Advanced>

      <Confirm open={confirming} title="永久删除这个场景？" desc="删除后不能恢复。只想让前台看不到，把状态改成已归档就够了。" confirmText="永久删除" danger onConfirm={remove} onCancel={() => setConfirming(false)} />
    </Drawer>
  );
}

/* ── 页面布局：按前台版式摆 ───────────────────────── */

type LayoutGroup = VrLayout["groups"][number];
const UNGROUPED = "ungrouped";

/** 和前台 VrWall 同一规则：大图版式里 featured（都没有就第一个）提到最前 */
function isLead(scene: VrScene, list: VrScene[], layout?: string) {
  return layout === "feature" && (list.some((s) => s.featured) ? Boolean(scene.featured) : scene === list[0]);
}
function arrange(list: VrScene[], layout?: string) {
  return [...list.filter((s) => isLead(s, list, layout)), ...list.filter((s) => !isLead(s, list, layout))];
}

function LayoutTab() {
  const query = useListQuery(SORTABLE);
  const page = query.pick("page", PAGE_KEYS) ?? "park";
  const state = useAsync(() => api.vrLayout(page), [page]);
  const allGroups = useAsync(() => api.vrGroups(), []);
  const [editing, setEditing] = useState<VrScene | null>(null);
  const [creatingIn, setCreatingIn] = useState<string | null>(null);
  const [renaming, setRenaming] = useState<{ id: string; name: string } | null>(null);
  const [removing, setRemoving] = useState<LayoutGroup | null>(null);
  const [moving, setMoving] = useState<{ anchor: HTMLElement; id: string; from: string } | null>(null);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");

  const groups = state.data?.groups ?? [];
  const ungrouped = state.data?.ungrouped ?? [];
  const groupIds = groups.map((g) => g.id);

  const scenesOf = (container: string) => {
    if (container === UNGROUPED) return ungrouped;
    const group = groups.find((g) => g.id === container);
    return group ? arrange(group.scenes, group.layout) : [];
  };

  async function write(action: () => Promise<unknown>, failText = "没有保存") {
    try {
      await action();
    } catch (err) {
      toast(err instanceof ApiError ? err.message : failText);
    }
    state.reload();
  }

  /** 先在界面上挪过去再写库，失败时 reload 拉回 */
  function moveScene(id: string, from: string, to: string, nextIds: string[]) {
    state.mutate((prev) => {
      const all = [...prev.ungrouped, ...prev.groups.flatMap((g) => g.scenes)];
      const byId = new Map(all.map((scene) => [scene.id, scene]));
      const pick = (ids: string[]) => ids.map((value) => byId.get(value) as VrScene);
      const without = (list: VrScene[]) => list.filter((scene) => scene.id !== id);
      return {
        groups: prev.groups.map((g) => ({ ...g, scenes: g.id === to ? pick(nextIds) : g.id === from ? without(g.scenes) : g.scenes })),
        ungrouped: to === UNGROUPED ? pick(nextIds) : from === UNGROUPED ? without(prev.ungrouped) : prev.ungrouped,
      };
    });
    const body: Parameters<typeof api.reorderVr>[0] = { page };
    const touched = new Set([from, to]);
    const groupsBody: Array<{ id: string; sceneIds: string[] }> = [];
    for (const container of touched) {
      const ids = container === to ? nextIds : scenesOf(container).filter((scene) => scene.id !== id).map((scene) => scene.id);
      if (container === UNGROUPED) body.ungrouped = ids;
      else groupsBody.push({ id: container, sceneIds: ids });
    }
    if (groupsBody.length > 0) body.groups = groupsBody;
    void write(() => api.reorderVr(body));
  }

  const dragScene = useDragSort((id, from, spot) => {
    const ids = scenesOf(spot.container).map((scene) => scene.id);
    const next = moveInList(ids, id, spot);
    if (next) moveScene(id, from, spot.container, next);
  }, "x");

  const saveGroupOrder = (next: string[]) => {
    state.mutate((prev) => {
      const byId = new Map(prev.groups.map((g) => [g.id, g]));
      return { ...prev, groups: next.map((id) => byId.get(id) as LayoutGroup) };
    });
    void write(() => api.reorderVr({ page, groupIds: next }));
  };
  const dragGroup = useDragSort((id, _from, spot) => {
    const next = moveInList(groupIds, id, spot);
    if (next) saveGroupOrder(next);
  });

  const patchGroup = (id: string, body: { name?: string; layout?: string; visible?: boolean }) => {
    state.mutate((prev) => ({ ...prev, groups: prev.groups.map((g) => (g.id === id ? ({ ...g, ...body } as LayoutGroup) : g)) }));
    void write(() => api.patchVrGroup(id, body));
  };

  async function addGroup() {
    const name = newName.trim();
    if (!name) return;
    setNewName("");
    setAdding(false);
    await write(() => api.createVrGroup({ page, name }));
    allGroups.reload();
  }

  function renderScene(scene: VrScene, container: string, list: VrScene[], index: number, group: LayoutGroup | null) {
    const lead = isLead(scene, list, group?.layout);
    const big = !lead && group?.layout !== "feature" && Boolean(scene.featured);
    // 选定的大图总在最前，它和紧跟它的那一处不能互换
    const pinned = group?.layout === "feature" && list.some((s) => s.featured);
    const ids = list.map((s) => s.id);
    return (
      <li key={scene.id} className={["vr-tile", lead && "vr-tile--lead", big && "vr-tile--big", scene.status !== "published" && "is-off", dragScene.rowClass(scene.id)].filter(Boolean).join(" ")} {...dragScene.row(scene.id, container)}>
        <div className="vr-tile__media">
          <button type="button" className="vr-tile__fig" aria-label={`编辑 ${scene.title}`} onClick={() => setEditing(scene)}>
            <Thumb key={scene.thumb ?? ""} scene={scene} className="vr-tile__img" />
            {scene.status !== "published" && (
              <span className="vr-tile__state">
                <StatusPill status={scene.status} />
              </span>
            )}
          </button>
          <div className="vr-tile__tools">
            <span className="drag-handle" title="拖动，可以拖到别的分组" aria-hidden {...dragScene.handle(scene.id, container)}>
              <GripVertical size={15} strokeWidth={1.75} />
            </span>
            <button type="button" className="icon-btn icon-btn--sm" title="前移" aria-label={`前移 ${scene.title}`} disabled={index === 0 || (pinned && index === 1)} onClick={() => { const next = stepInList(ids, scene.id, -1); if (next) moveScene(scene.id, container, container, next); }}>
              <ArrowLeft size={15} strokeWidth={1.75} />
            </button>
            <button type="button" className="icon-btn icon-btn--sm" title="后移" aria-label={`后移 ${scene.title}`} disabled={index === list.length - 1 || (pinned && index === 0)} onClick={() => { const next = stepInList(ids, scene.id, 1); if (next) moveScene(scene.id, container, container, next); }}>
              <ArrowRight size={15} strokeWidth={1.75} />
            </button>
            <button type="button" className={scene.featured ? "icon-btn icon-btn--sm is-on" : "icon-btn icon-btn--sm"} title={scene.featured ? "取消大图" : "做大图"} aria-label={`${scene.featured ? "取消大图" : "做大图"} ${scene.title}`} aria-pressed={Boolean(scene.featured)} onClick={() => void write(() => api.patchVrScene(scene.id, { featured: !scene.featured }))}>
              <Star size={15} strokeWidth={1.75} />
            </button>
            <button type="button" className="icon-btn icon-btn--sm" title="移到其他分组" aria-label={`把 ${scene.title} 移到其他分组`} aria-haspopup="menu" onClick={(e) => setMoving({ anchor: e.currentTarget, id: scene.id, from: container })}>
              <FolderInput size={15} strokeWidth={1.75} />
            </button>
          </div>
        </div>
        <span className="vr-tile__title dl-ellipsis" title={scene.title}>
          {scene.title}
        </span>
        {lead && scene.description && <span className="vr-tile__desc">{scene.description}</span>}
      </li>
    );
  }

  if (state.error) return <ErrorState message={state.error} onRetry={state.reload} />;

  return (
    <>
      <Card
        title="前台全景区版式"
        actions={
          <>
            <Segmented size="md" label="哪个页面" value={page} onChange={(next) => query.update({ page: next === "park" ? null : next })} options={PAGES} />
            <button type="button" className="btn btn-filled btn-sm" onClick={() => setAdding(true)}>
              <Plus size={16} strokeWidth={1.75} aria-hidden />
              新建分组
            </button>
          </>
        }
      >
        {adding && (
          <div className="section-add">
            <input
              className="input input--grow"
              aria-label="新分组名称"
              placeholder="新分组名称"
              autoFocus
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") void addGroup();
                if (e.key === "Escape") setAdding(false);
              }}
            />
            <button type="button" className="btn" disabled={!newName.trim()} onClick={() => void addGroup()}>
              添加
            </button>
            <button type="button" className="btn btn-text" onClick={() => setAdding(false)}>
              取消
            </button>
          </div>
        )}
        {state.loading && !state.data ? (
          <Skeleton rows={8} />
        ) : groups.length === 0 && ungrouped.length === 0 ? (
          <Empty>这个页面还没有分组。</Empty>
        ) : (
          <div className="vr-canvas">
            {groups.map((group, index) => (
              <section key={group.id} className={["vr-group", !group.visible && "is-hidden", dragGroup.rowClass(group.id)].filter(Boolean).join(" ")} {...dragGroup.row(group.id, "groups")}>
                <header className="vr-group__head">
                  <span className="drag-handle" title="拖动分组" aria-hidden {...dragGroup.handle(group.id, "groups")}>
                    <GripVertical size={16} strokeWidth={1.75} />
                  </span>
                  <span className="vr-group__no mono">{String(index + 1).padStart(2, "0")}</span>
                  {renaming?.id === group.id ? (
                    <input
                      className="input vr-group__name-input"
                      aria-label={`${group.name} 的新名字`}
                      autoFocus
                      maxLength={40}
                      value={renaming.name}
                      onChange={(e) => setRenaming({ id: group.id, name: e.target.value })}
                      onBlur={() => {
                        const name = renaming.name.trim();
                        setRenaming(null);
                        if (name && name !== group.name) patchGroup(group.id, { name });
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") e.currentTarget.blur();
                        if (e.key === "Escape") setRenaming(null);
                      }}
                    />
                  ) : (
                    <button type="button" className="vr-group__name" title="改名" onClick={() => setRenaming({ id: group.id, name: group.name })}>
                      {group.name}
                    </button>
                  )}
                  <span className="muted">{group.scenes.length} 处</span>
                  {!group.visible && <span className="pill">前台隐藏</span>}
                  <span className="vr-group__tools">
                    <Segmented size="sm" label={`${group.name} 的版式`} value={group.layout} onChange={(layout) => patchGroup(group.id, { layout })} options={[{ value: "grid", label: "网格" }, { value: "feature", label: "大图" }]} />
                    <button type="button" className="icon-btn" title={group.visible ? "在前台隐藏" : "在前台显示"} aria-label={`${group.visible ? "隐藏" : "显示"} ${group.name}`} aria-pressed={!group.visible} onClick={() => patchGroup(group.id, { visible: !group.visible })}>
                      {group.visible ? <Eye size={18} strokeWidth={1.75} /> : <EyeOff size={18} strokeWidth={1.75} />}
                    </button>
                    <button type="button" className="icon-btn" title="上移分组" aria-label={`上移 ${group.name}`} disabled={index === 0} onClick={() => { const next = stepInList(groupIds, group.id, -1); if (next) saveGroupOrder(next); }}>
                      <ArrowUp size={18} strokeWidth={1.75} />
                    </button>
                    <button type="button" className="icon-btn" title="下移分组" aria-label={`下移 ${group.name}`} disabled={index === groups.length - 1} onClick={() => { const next = stepInList(groupIds, group.id, 1); if (next) saveGroupOrder(next); }}>
                      <ArrowDown size={18} strokeWidth={1.75} />
                    </button>
                    <button type="button" className="icon-btn" title="在这组新建场景" aria-label={`在 ${group.name} 新建场景`} onClick={() => setCreatingIn(group.id)}>
                      <Plus size={18} strokeWidth={1.75} />
                    </button>
                    <button type="button" className="icon-btn icon-btn--danger" title={group.scenes.length > 0 ? "先把场景移走才能删" : "删除分组"} aria-label={`删除 ${group.name}`} disabled={group.scenes.length > 0} onClick={() => setRemoving(group)}>
                      <Trash2 size={18} strokeWidth={1.75} />
                    </button>
                  </span>
                </header>
                <ul className={["vr-wall", dragScene.zoneClass(group.id)].filter(Boolean).join(" ")} {...dragScene.zone(group.id)}>
                  {arrange(group.scenes, group.layout).map((scene, at, list) => renderScene(scene, group.id, list, at, group))}
                  {group.scenes.length === 0 && <li className="vr-wall__empty muted">把场景拖到这里</li>}
                </ul>
              </section>
            ))}
            {ungrouped.length > 0 && (
              <section className="vr-group">
                <header className="vr-group__head">
                  <span className="vr-group__no mono">{String(groups.length + 1).padStart(2, "0")}</span>
                  <b>其他场景</b>
                  <span className="muted">{ungrouped.length} 处，排在分组后面，网格显示</span>
                </header>
                <ul className={["vr-wall", dragScene.zoneClass(UNGROUPED)].filter(Boolean).join(" ")} {...dragScene.zone(UNGROUPED)}>
                  {ungrouped.map((scene, at) => renderScene(scene, UNGROUPED, ungrouped, at, null))}
                </ul>
              </section>
            )}
          </div>
        )}
      </Card>

      {(editing || creatingIn) && (
        <VrEditor
          key={editing?.id ?? `new-${creatingIn}`}
          row={editing}
          groups={allGroups.data?.items ?? []}
          defaultPage={page}
          defaultGroupId={creatingIn ?? undefined}
          onClose={() => {
            setEditing(null);
            setCreatingIn(null);
          }}
          onSaved={state.reload}
        />
      )}
      {moving && (
        <Menu anchor={moving.anchor} onClose={() => setMoving(null)} label="移到其他分组">
          {[...groups.map((g) => ({ id: g.id, name: g.name })), { id: UNGROUPED, name: "其他场景" }]
            .filter((target) => target.id !== moving.from)
            .map((target) => (
              <button
                key={target.id}
                type="button"
                className="menu-item"
                role="menuitem"
                onClick={() => {
                  const { id, from } = moving;
                  setMoving(null);
                  moveScene(id, from, target.id, [...scenesOf(target.id).map((scene) => scene.id), id]);
                }}
              >
                {target.name}
              </button>
            ))}
        </Menu>
      )}
      <Confirm
        open={removing !== null}
        danger
        title={`删除分组「${removing?.name ?? ""}」？`}
        desc="这个分组已经没有场景了。"
        confirmText="删除"
        onCancel={() => setRemoving(null)}
        onConfirm={() => {
          const group = removing;
          setRemoving(null);
          if (group)
            void write(async () => {
              await api.deleteVrGroup(group.id);
              allGroups.reload();
            }, "删除失败");
        }}
      />
    </>
  );
}
