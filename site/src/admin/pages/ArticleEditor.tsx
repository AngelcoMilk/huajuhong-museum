// 阅读编辑器（园区、博物馆、史料共用）：全屏，左边编辑，右边是前台真实效果。
// 预览放在 iframe 里：前台样式不和后台互相影响，手机宽度下媒体查询也按真实宽度生效。
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate, useParams, useSearchParams } from "react-router";
import { ArrowLeft, Eye, Monitor, PencilLine, Smartphone } from "lucide-react";
import HallBlocks from "../../components/hall/HallBlocks";
import { api, ApiError, type Block, type ItemContent, type ItemDetail } from "../api";
import { BlocksEditor, blockProblem, cleanBlocks, ImageInput, toEditBlocks, type EditBlock } from "../blocks";
import { Glass } from "../glass";
import { StatusPill } from "../list";
import { Advanced, Confirm, dateTime, ErrorBar, Field, LeaveGuard, Segmented, Skeleton, toast, useAsync, useIsNarrow } from "../ui";

const BOARD_LABEL: Record<string, string> = { park: "园区", museum: "博物馆", history: "史料" };
const MUSEUM_SECTION = "博览馆文章";

type Meta = Omit<ItemContent, "blocks">;

function emptyMeta(section = "", parentId: string | null = null): Meta {
  return { title: "", subtitle: "", summary: "", author: "", sourceName: "", coverUrl: "", date: "", sourceUrl: "", section, parentId };
}

/** 文本框里都是字符串；提交空串就是清空 */
function metaOf(item: ItemDetail): { meta: Meta; blocks: Block[] } {
  const source = { ...item, ...(item.draft ?? {}) };
  return {
    meta: {
      title: source.title ?? "",
      subtitle: source.subtitle ?? "",
      summary: source.summary ?? "",
      author: source.author ?? "",
      sourceName: source.sourceName ?? "",
      coverUrl: source.coverUrl ?? "",
      date: source.date ?? "",
      sourceUrl: source.sourceUrl ?? "",
      section: source.section ?? "",
      parentId: source.parentId ?? null,
    },
    blocks: source.blocks ?? [],
  };
}

const fingerprint = (meta: Meta, list: EditBlock[]) => JSON.stringify([meta, cleanBlocks(list).blocks]);

export default function ArticleEditor() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const [version, setVersion] = useState(0);
  const item = useAsync(() => (id ? api.item(id) : Promise.resolve(null)), [id, version]);

  if (id) {
    if (item.error) {
      return (
        <div className="editor-full">
          <div className="editor-empty">
            <ErrorBar message={item.error} onRetry={item.reload} />
            <Link className="btn" to="/admin/content">
              回到展项管理
            </Link>
          </div>
        </div>
      );
    }
    if (!item.data || item.loading) {
      return (
        <div className="editor-full">
          <div className="editor-empty">
            <Skeleton rows={8} />
          </div>
        </div>
      );
    }
    return <Editor key={`${id}:${version}`} item={item.data} board={item.data.board} type={item.data.type} onReload={() => setVersion((n) => n + 1)} />;
  }

  const board = params.get("board") ?? "park";
  const type = params.get("type") ?? "article";
  return <Editor key="new" item={null} board={board} type={type} section={params.get("section") ?? ""} parentId={params.get("parentId")} onReload={() => setVersion((n) => n + 1)} />;
}

function Editor({ item, board, type, section, parentId, onReload }: { item: ItemDetail | null; board: string; type: string; section?: string; parentId?: string | null; onReload: () => void }) {
  const navigate = useNavigate();
  const narrow = useIsNarrow(1099);
  const initial = useMemo(() => {
    if (item) {
      const { meta, blocks } = metaOf(item);
      return { meta, list: toEditBlocks(blocks) };
    }
    return { meta: emptyMeta(section ?? (board === "museum" ? MUSEUM_SECTION : ""), parentId ?? null), list: [] as EditBlock[] };
  }, [item, board, section, parentId]);

  const [meta, setMeta] = useState<Meta>(initial.meta);
  const [list, setList] = useState<EditBlock[]>(initial.list);
  const [saved, setSaved] = useState(() => fingerprint(initial.meta, initial.list));
  const [baseUpdatedAt, setBaseUpdatedAt] = useState<number | undefined>(item?.updatedAt);
  const [status, setStatus] = useState(item?.status ?? "draft");
  const [hasDraft, setHasDraft] = useState(Boolean(item?.draft));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [blockError, setBlockError] = useState<{ key: string; text: string } | null>(null);
  const [conflict, setConflict] = useState<"draft" | "publish" | null>(null);
  const [busy, setBusy] = useState(false);
  const [discarding, setDiscarding] = useState(false);
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [pane, setPane] = useState<"edit" | "preview">("edit");
  const backTo = `/admin/content?tab=${board}`;

  const dirty = fingerprint(meta, list) !== saved;
  const columns = useAsync(() => (board === "park" && type !== "column" ? api.items({ board: "park", pageSize: 100 }) : Promise.resolve(null)), [board, type]);
  const parents = (columns.data?.items ?? []).filter((row) => row.type === "column" && row.id !== item?.id);
  const sections = useAsync(() => (board === "history" ? api.historySections() : Promise.resolve(null)), [board]);

  const set = (key: keyof Meta) => (value: string) => {
    setMeta((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const { [key]: _removed, ...rest } = prev;
      return rest;
    });
  };

  const latestSave = useRef<(mode: "draft" | "publish") => void>(() => {});
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && !event.altKey && event.key.toLowerCase() === "s") {
        event.preventDefault();
        latestSave.current("draft");
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  function showBlockError(key: string, text: string) {
    setBlockError({ key, text });
    requestAnimationFrame(() => document.getElementById(`block-${key}`)?.scrollIntoView({ block: "center", behavior: "smooth" }));
  }

  async function save(mode: "draft" | "publish", force = false) {
    if (busy) return;
    setError(null);
    setErrors({});
    setBlockError(null);
    setConflict(null);
    if (!meta.title.trim()) {
      setErrors({ title: "标题不能为空" });
      return;
    }
    if (board === "history" && !meta.section.trim()) {
      setErrors({ section: "请选择分类" });
      return;
    }
    const { blocks, origin } = cleanBlocks(list);
    for (let at = 0; at < blocks.length; at += 1) {
      const problem = blockProblem(blocks[at]);
      if (problem) {
        showBlockError(list[origin[at]].key, problem);
        return;
      }
    }

    const body: Record<string, unknown> = {
      title: meta.title.trim(),
      subtitle: meta.subtitle?.trim() ?? "",
      summary: meta.summary?.trim() ?? "",
      author: meta.author?.trim() ?? "",
      sourceName: meta.sourceName?.trim() ?? "",
      coverUrl: meta.coverUrl?.trim() ?? "",
      date: meta.date?.trim() ?? "",
      sourceUrl: meta.sourceUrl?.trim() ?? "",
      section: meta.section.trim() || (board === "park" ? meta.title.trim() : ""),
      blocks,
    };
    if (board === "park") body.parentId = meta.parentId;
    if (item && !force && baseUpdatedAt !== undefined) body.baseUpdatedAt = baseUpdatedAt;

    setBusy(true);
    try {
      if (!item) {
        const created = await api.createItem({ ...body, board, type, status: mode === "publish" ? "published" : "draft" });
        setSaved(fingerprint(meta, list));
        toast(mode === "publish" ? "已发布" : "草稿已保存");
        // 等 dirty 清掉再跳，不让离开提示拦住
        requestAnimationFrame(() => navigate(`/admin/content/edit/${encodeURIComponent(created.id)}`, { replace: true }));
        return;
      }
      if (mode === "publish") {
        const result = await api.patchItem(item.id, { ...body, status: "published" });
        setBaseUpdatedAt(result.updatedAt);
        setStatus("published");
        setHasDraft(false);
        toast("已发布");
      } else {
        const result = await api.saveItemDraft(item.id, body);
        setBaseUpdatedAt(result.updatedAt);
        setHasDraft(status === "published");
        toast(status === "published" ? "草稿已保存，线上内容没变" : "草稿已保存");
      }
      setSaved(fingerprint(meta, list));
    } catch (err) {
      if (err instanceof ApiError && err.code === "ITEM_CHANGED") {
        setConflict(mode);
      } else if (err instanceof ApiError && err.code === "INVALID_BLOCKS") {
        const index = typeof err.details?.index === "number" ? origin[err.details.index] : undefined;
        if (index !== undefined) showBlockError(list[index].key, err.details?.reason ?? err.message);
        else setError(err.message);
      } else if (err instanceof ApiError && err.field && err.field in meta) {
        setErrors({ [err.field]: err.message });
      } else {
        setError(err instanceof ApiError ? err.message : "保存失败");
      }
    } finally {
      setBusy(false);
    }
  }
  latestSave.current = (mode) => void save(mode);

  async function discardDraft() {
    if (!item) return;
    setDiscarding(false);
    setBusy(true);
    try {
      await api.discardItemDraft(item.id);
      toast("草稿已丢弃");
      setSaved(fingerprint(meta, list)); // 马上重新载入，不提示未保存
      requestAnimationFrame(onReload);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "丢弃失败");
    } finally {
      setBusy(false);
    }
  }

  const { blocks: previewBlocks } = cleanBlocks(list);
  const metaLine = [meta.date, meta.author, meta.sourceName].map((value) => value?.trim()).filter(Boolean) as string[];
  const showEdit = !narrow || pane === "edit";
  const showPreview = !narrow || pane === "preview";

  return (
    <div className="editor-full">
      <LeaveGuard when={dirty} />
      <Glass className="editor-bar" reading>
        <Link className="icon-btn" to={backTo} title="返回展项管理" aria-label="返回展项管理">
          <ArrowLeft size={18} strokeWidth={1.75} aria-hidden />
        </Link>
        <div className="editor-bar__title">
          <b className="dl-ellipsis">{meta.title.trim() || (item ? item.id : `新建${BOARD_LABEL[board] ?? ""}${type === "column" ? "栏目" : "文章"}`)}</b>
          <span className="editor-bar__state">
            <StatusPill status={status} />
            {hasDraft && <span className="pill pill--warn">有未发布的修改</span>}
            {dirty ? <span className="editor-bar__dirty">未保存</span> : item && <span className="muted">{dateTime(baseUpdatedAt)} 保存</span>}
          </span>
        </div>
        <div className="editor-bar__actions">
          {narrow && <Segmented size="sm" label="编辑或预览" value={pane} onChange={setPane} options={[{ value: "edit", label: "编辑", icon: <PencilLine size={14} strokeWidth={1.75} aria-hidden /> }, { value: "preview", label: "预览", icon: <Eye size={14} strokeWidth={1.75} aria-hidden /> }]} />}
          {hasDraft && (
            <button type="button" className="btn btn-text" disabled={busy} onClick={() => setDiscarding(true)}>
              丢弃草稿
            </button>
          )}
          <button type="button" className="btn" disabled={busy} onClick={() => void save("draft")}>
            存草稿
          </button>
          <button type="button" className="btn btn-filled" disabled={busy} onClick={() => void save("publish")}>
            {status === "published" ? "发布更新" : "发布"}
          </button>
        </div>
      </Glass>

      <div className="editor-split" data-narrow={narrow || undefined}>
        {showEdit && (
          <div className="editor-form">
            {error && <ErrorBar message={error} />}
            {conflict && (
              <div className="editor-conflict" role="alert">
                <p>这篇在别的窗口或设备上改过了，你的内容还在这里没有丢。</p>
                <div>
                  <button type="button" className="btn btn-sm" onClick={onReload}>
                    载入对方的版本
                  </button>
                  <button type="button" className="btn btn-sm btn-danger" onClick={() => void save(conflict, true)}>
                    用我的内容覆盖
                  </button>
                </div>
              </div>
            )}

            <section className="editor-section">
              <Field label="标题" error={errors.title}>
                <input className="input" value={meta.title} onChange={(e) => set("title")(e.target.value)} aria-invalid={Boolean(errors.title) || undefined} />
              </Field>
              <div className="form-grid">
                <Field label="副标题" error={errors.subtitle}>
                  <input className="input" value={meta.subtitle ?? ""} onChange={(e) => set("subtitle")(e.target.value)} />
                </Field>
                <Field label="日期" error={errors.date}>
                  <input className="input" value={meta.date ?? ""} placeholder="2024-05-20" onChange={(e) => set("date")(e.target.value)} />
                </Field>
                <Field label="作者" error={errors.author}>
                  <input className="input" value={meta.author ?? ""} onChange={(e) => set("author")(e.target.value)} />
                </Field>
                <Field label="来源" error={errors.sourceName}>
                  <input className="input" value={meta.sourceName ?? ""} onChange={(e) => set("sourceName")(e.target.value)} />
                </Field>
                {board === "history" && (
                  <Field label="分类" error={errors.section}>
                    <select className="select" value={meta.section} onChange={(e) => set("section")(e.target.value)} aria-invalid={Boolean(errors.section) || undefined}>
                      <option value="">选择分类</option>
                      {(sections.data?.items ?? []).map((row) => (
                        <option key={row.name} value={row.name}>
                          {row.name}
                        </option>
                      ))}
                      {meta.section && !(sections.data?.items ?? []).some((row) => row.name === meta.section) && <option value={meta.section}>{meta.section}</option>}
                    </select>
                  </Field>
                )}
                {board === "park" && type !== "column" && (
                  <Field label="所属栏目" error={errors.parentId}>
                    <select className="select" value={meta.parentId ?? ""} onChange={(e) => setMeta((prev) => ({ ...prev, parentId: e.target.value || null }))}>
                      <option value="">不挂在栏目下</option>
                      {parents.map((row) => (
                        <option key={row.id} value={row.id}>
                          {row.title}
                        </option>
                      ))}
                    </select>
                  </Field>
                )}
              </div>
              <Field label="介绍" hint="列表和折叠时显示" error={errors.summary}>
                <textarea className="textarea" style={{ minHeight: 72 }} value={meta.summary ?? ""} onChange={(e) => set("summary")(e.target.value)} />
              </Field>
              {/* 园区前台不显示封面；旧地址被接口拒绝时仍要露出来才改得了 */}
              {(board !== "park" || errors.coverUrl) && (
                <Field label="封面" error={errors.coverUrl}>
                  <ImageInput label="封面地址" value={meta.coverUrl ?? ""} invalid={Boolean(errors.coverUrl)} onChange={set("coverUrl")} />
                </Field>
              )}
              <Advanced open={Boolean(errors.sourceUrl)}>
                <Field label="原文链接" hint="只在后台显示" error={errors.sourceUrl}>
                  <input className="input" value={meta.sourceUrl ?? ""} placeholder="https://…" onChange={(e) => set("sourceUrl")(e.target.value)} />
                </Field>
              </Advanced>
            </section>

            <section className="editor-section">
              <h2 className="editor-section__title">正文</h2>
              <BlocksEditor
                value={list}
                onChange={(next) => {
                  setList(next);
                  setBlockError(null);
                }}
                errorKey={blockError?.key}
                errorText={blockError?.text}
              />
            </section>
          </div>
        )}

        {showPreview && (
          <div className="editor-preview">
            <div className="editor-preview__bar">
              <span className="muted">前台效果</span>
              <Segmented
                size="sm"
                label="预览宽度"
                value={device}
                onChange={setDevice}
                options={[
                  { value: "desktop", label: "桌面", icon: <Monitor size={14} strokeWidth={1.75} aria-hidden /> },
                  { value: "mobile", label: "手机", icon: <Smartphone size={14} strokeWidth={1.75} aria-hidden /> },
                ]}
              />
            </div>
            <div className="editor-preview__stage">
              <FrontFrame device={device}>
                <article className="preview-article">
                  {meta.subtitle?.trim() && <p className="preview-article__kicker">{meta.subtitle.trim()}</p>}
                  <h2 className="preview-article__title">{meta.title.trim() || "未命名"}</h2>
                  {metaLine.length > 0 && (
                    <p className="preview-article__meta">
                      {metaLine.map((text) => (
                        <span key={text}>{text}</span>
                      ))}
                    </p>
                  )}
                  <HallBlocks blocks={previewBlocks} />
                </article>
              </FrontFrame>
            </div>
          </div>
        )}
      </div>

      <Confirm open={discarding} danger title="丢弃这份草稿？" desc="线上内容不变，草稿里的修改会丢掉。" confirmText="丢弃" onCancel={() => setDiscarding(false)} onConfirm={() => void discardDraft()} />
    </div>
  );
}

const FRAME_STYLE = `
  html, body { margin: 0; background: var(--paper); color: var(--ink); }
  body { padding: clamp(20px, 5vw, 48px) clamp(16px, 5vw, 56px); }
  .preview-article { max-width: 760px; margin: 0 auto; }
  .preview-article__kicker { margin: 0 0 8px; font-size: var(--fs-micro); letter-spacing: 0.18em; color: var(--ink-3); }
  .preview-article__title { margin: 0 0 12px; font-size: var(--fs-h2); font-weight: 600; line-height: 1.5; letter-spacing: 0.03em; }
  .preview-article__meta { display: flex; flex-wrap: wrap; gap: 6px 16px; margin: 0 0 24px; font-size: var(--fs-micro); color: var(--ink-3); letter-spacing: 0.06em; }
`;

/** 把页面已加载的样式带进 iframe：前台令牌和 HallBlocks 样式都在里面 */
function FrontFrame({ device, children }: { device: "desktop" | "mobile"; children: ReactNode }) {
  const ref = useRef<HTMLIFrameElement | null>(null);
  const [body, setBody] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const doc = ref.current?.contentDocument;
    if (!doc) return;
    doc.open();
    doc.write('<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body></body></html>');
    doc.close();
    const copy = (node: Node) => {
      if (node instanceof HTMLStyleElement || (node instanceof HTMLLinkElement && node.rel === "stylesheet")) doc.head.appendChild(node.cloneNode(true));
    };
    document.head.querySelectorAll("style, link[rel=stylesheet]").forEach(copy);
    const own = doc.createElement("style");
    own.textContent = FRAME_STYLE;
    doc.head.appendChild(own);
    setBody(doc.body);
    // 懒加载的样式后到，也带进去
    const observer = new MutationObserver((records) => {
      for (const record of records) record.addedNodes.forEach(copy);
      doc.head.appendChild(own);
    });
    observer.observe(document.head, { childList: true });
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <iframe ref={ref} className="editor-frame" data-device={device} title="前台效果预览" />
      {body && createPortal(children, body)}
    </>
  );
}
