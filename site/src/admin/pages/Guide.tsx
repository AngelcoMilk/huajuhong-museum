// 讲解员：左边编辑提示词和模型（草稿 → 发布），右边试聊（默认用左边还没保存的内容）。
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Eraser, FlaskConical, GitCompareArrows, History, Send, Square } from "lucide-react";
import { Link } from "react-router";
import { createSseParser } from "../../lib/guideClient";
import { api, ApiError, type ChatTurn, type ConfigVersion, type ModelOptions } from "../api";
import { Glass } from "../glass";
import { renderMarkdown } from "../markdown";
import { DataList, useListQuery, type Column } from "../list";
import { asyncGate, Card, Confirm, dateTime, Drawer, Empty, ErrorBar, Field, LeaveGuard, NotReady, Segmented, Skeleton, toast, useAsync, useFormState } from "../ui";

const HISTORY_LIMIT = 20;
const CONTENT_LIMIT = 2000;
const KEEP_CURRENT = "__current__";
const PROVIDERS_URL = "/admin/settings/providers";

const VERSION_STATUS: Record<string, { label: string; tone: string }> = {
  published: { label: "线上", tone: "pill pill--ok" },
  draft: { label: "草稿", tone: "pill pill--warn" },
  archived: { label: "历史", tone: "pill" },
};

function VersionStatus({ status }: { status: string }) {
  const meta = VERSION_STATUS[status];
  return <span className={meta?.tone ?? "pill"}>{meta?.label ?? status}</span>;
}

/** 已发布的撤销 = 再发布一次原来的线上版本 */
function publishWithUndo(result: { versionNo: number }, previousId: string | undefined, reload: () => void) {
  toast(`已发布 v${result.versionNo}`, {
    action: previousId
      ? {
          label: "撤销",
          run: () =>
            void api
              .publishConfig(previousId)
              .then(() => {
                toast("已撤销，线上回到原版本");
                reload();
              })
              .catch((err) => toast(err instanceof ApiError ? `撤销失败：${err.message}` : "撤销失败")),
        }
      : undefined,
  });
}

export default function Guide() {
  const current = useAsync(() => api.configCurrent(), []);
  const options = useAsync(() => api.modelOptions(), []);
  const versions = useAsync(() => api.versions(), []);

  const { form, dirty, errors, setErrors, set, bind, reset } = useFormState({ system: "", provider: "", model: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [promptOpen, setPromptOpen] = useState(true);

  // 配置变了（首次加载、发布、回滚）就回填；正在写的内容不能被刷新盖掉
  const dirtyRef = useRef(dirty);
  dirtyRef.current = dirty;
  // 回滚后要回填新线上内容，放弃表单里没保存的改动
  const forceFill = useRef(false);
  const loaded = Boolean(current.data);
  useEffect(() => {
    if (!current.data || (dirtyRef.current && !forceFill.current)) return;
    forceFill.current = false;
    const source = current.data.draft ?? current.data.published;
    if (source) reset({ system: source.prompt?.system ?? "", provider: source.model?.provider ?? "", model: source.model?.model ?? "" });
  }, [current.data, reset]);

  function refresh() {
    current.reload();
    versions.reload();
    options.reload();
  }

  const published = current.data?.published;
  const live = options.data?.current;
  const selectable = isSelectable(options.data, form.provider, form.model);
  const modelProblem = !loaded || !options.data ? null : !form.provider || !form.model ? "请选择供应商和模型" : selectable ? null : `${form.provider}/${form.model} 已不可选，请重新选择`;
  const formProblem = modelProblem ?? (!form.system.trim() ? "提示词不能为空" : null);

  function fieldError(err: unknown, fallback: string) {
    if (err instanceof ApiError && err.field === "model") setErrors({ model: err.message });
    else setError(err instanceof ApiError ? err.message : fallback);
  }

  async function saveDraft(): Promise<boolean> {
    if (formProblem) {
      setErrors(modelProblem ? { model: modelProblem } : { system: formProblem });
      return false;
    }
    try {
      await api.saveDraft({ system: form.system }, { provider: form.provider, model: form.model });
      reset(form);
      return true;
    } catch (err) {
      fieldError(err, "保存失败");
      return false;
    }
  }

  async function onSaveDraft() {
    setBusy(true);
    setError(null);
    if (await saveDraft()) {
      toast("草稿已保存");
      refresh();
    }
    setBusy(false);
  }

  async function publish() {
    setBusy(true);
    setError(null);
    try {
      // 表单有改动时先落草稿，否则发布出去的是上一份草稿
      if (dirty && !(await saveDraft())) return;
      const previousId = published?.id;
      const result = await api.publishConfig();
      publishWithUndo(result, previousId, refresh);
      refresh();
    } catch (err) {
      fieldError(err, "发布失败");
    } finally {
      setBusy(false);
    }
  }

  const saveRef = useRef(onSaveDraft);
  saveRef.current = onSaveDraft;
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && !e.altKey && e.key.toLowerCase() === "s") {
        e.preventDefault();
        if (dirtyRef.current) void saveRef.current();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const hasPendingDraft = current.data?.hasPendingDraft ?? false;
  const gate = asyncGate(current);

  return (
    <div className="guide">
      <Glass className="guide-bar" reading>
        <div className="guide-bar__status">
          <span className="guide-bar__item">
            <span className="muted">线上</span>
            <b className="mono">{published?.versionNo ? `v${published.versionNo}` : "—"}</b>
            {published?.model && (
              <span className="muted mono dl-ellipsis">
                {published.model.provider}/{published.model.model}
              </span>
            )}
          </span>
          <span className={dirty ? "pill pill--bad" : hasPendingDraft ? "pill pill--warn" : "pill"}>{dirty ? "有未保存的改动" : hasPendingDraft ? `草稿 v${current.data?.draft?.versionNo} 未发布` : "没有草稿"}</span>
        </div>
        <div className="guide-bar__actions">
          <button type="button" className="btn btn-text btn-sm" onClick={() => setHistoryOpen(true)}>
            <History size={16} strokeWidth={1.75} aria-hidden />
            版本记录
          </button>
          <button type="button" className="btn btn-outline btn-sm" onClick={() => void onSaveDraft()} disabled={busy || !dirty || !loaded}>
            保存草稿
          </button>
          <button type="button" className="btn btn-filled btn-sm" onClick={() => void publish()} disabled={busy || !loaded || (!dirty && !hasPendingDraft)}>
            {busy ? "处理中…" : "发布"}
          </button>
        </div>
      </Glass>

      {error && <ErrorBar message={error} />}

      <div className="guide-grid">
        <div className="stack guide-edit">
          <Card title="模型">
            {gate ??
              asyncGate(options, { compact: true }) ??
              (options.data && (
                <ModelPicker
                  options={options.data}
                  provider={form.provider}
                  model={form.model}
                  error={errors.model}
                  onChange={(provider, model) => {
                    set("provider", provider);
                    set("model", model);
                    setErrors({});
                  }}
                />
              ))}
          </Card>

          <Card
            className="guide-prompt"
            title="系统提示词"
            actions={
              <>
                <span className="muted mono">{form.system.length.toLocaleString()} 字</span>
                <button type="button" className="btn btn-text btn-sm pv-adv-toggle" aria-expanded={promptOpen} onClick={() => setPromptOpen((open) => !open)}>
                  {promptOpen ? "收起" : "展开"}
                  <ChevronDown size={14} strokeWidth={1.75} className="pv-chevron" aria-hidden />
                </button>
              </>
            }
          >
            {promptOpen &&
              (gate ?? (
                <Field label="提示词内容" hint="发布前会先做供应商连通性测试" error={errors.system}>
                  <textarea className="textarea textarea--code guide-prompt__text" rows={18} {...bind("system")} />
                </Field>
              ))}
          </Card>
        </div>

        <GuideChat
          form={{ system: form.system, provider: form.provider, model: form.model }}
          formProblem={formProblem}
          liveLabel={live ? `${live.provider}/${live.model}` : undefined}
        />
      </div>

      {historyOpen && versions.data && (
        <HistoryDrawer
          versions={versions.data}
          onClose={() => setHistoryOpen(false)}
          onChanged={refresh}
          discardDirty={() => {
            forceFill.current = true;
          }}
          hasDirty={dirty}
        />
      )}

      <LeaveGuard when={dirty} />
    </div>
  );
}

function isSelectable(options: ModelOptions | null, provider: string, model: string): boolean {
  if (!options) return false;
  if (options.current.provider === provider && options.current.model === model) return true;
  const row = options.providers.find((one) => one.name === provider);
  return Boolean(row?.enabled && row.models.some((one) => one.id === model));
}

function ModelPicker({
  options,
  provider,
  model,
  error,
  onChange,
}: {
  options: ModelOptions;
  provider: string;
  model: string;
  error?: string;
  onChange: (provider: string, model: string) => void;
}) {
  const { current } = options;
  const enabled = options.providers.filter((one) => one.enabled);
  const keepingCurrent = !current.inList && provider === current.provider && model === current.model;
  const row = enabled.find((one) => one.name === provider);
  // 草稿里的供应商不在可选列表（已停用、已删除）：下拉框回到未选，由下面的错误提示换一个
  const providerValue = keepingCurrent ? KEEP_CURRENT : (row?.name ?? "");

  function pickProvider(next: string) {
    if (next === KEEP_CURRENT) {
      onChange(current.provider, current.model);
      return;
    }
    const target = enabled.find((one) => one.name === next);
    onChange(next, target?.models.length === 1 ? target.models[0].id : "");
  }

  return (
    <div className="stack">
      {!current.inList && (
        <div className="guide-current">
          <span className="muted">线上正在用</span>
          <b className="mono">
            {current.provider}/{current.model}
          </b>
          <span className="pill pill--warn">不在供应商列表</span>
          <Link className="guide-current__link" to={`${PROVIDERS_URL}?import=1`}>
            从 pi 导入
          </Link>
        </div>
      )}
      {enabled.length === 0 && (
        <div className="banner">
          <span>还没有可选的供应商。</span>
          <Link className="banner__action" to={PROVIDERS_URL}>
            去配置模型供应商
          </Link>
        </div>
      )}
      {(enabled.length > 0 || !keepingCurrent) && (
        <div className="form-grid">
          <Field label="供应商" hint={enabled.some((one) => !one.ready) ? "灰色的还没配好 Key，到模型供应商页补上后才能选" : undefined}>
            <select className="select" value={providerValue} onChange={(e) => pickProvider(e.target.value)}>
              {!current.inList && <option value={KEEP_CURRENT}>保持线上的 {current.provider}</option>}
              {providerValue === "" && <option value="">请选择</option>}
              {enabled.map((one) => (
                <option key={one.name} value={one.name} disabled={!one.ready}>
                  {one.displayName || one.name}
                  {one.ready ? "" : "（缺 Key）"}
                </option>
              ))}
            </select>
          </Field>
          {row && (
            <Field label="模型">
              <select className="select" value={row.models.some((one) => one.id === model) ? model : ""} onChange={(e) => onChange(row.name, e.target.value)}>
                {!row.models.some((one) => one.id === model) && <option value="">请选择</option>}
                {row.models.map((one) => (
                  <option key={one.id} value={one.id}>
                    {one.name && one.name !== one.id ? `${one.name}（${one.id}）` : one.id}
                  </option>
                ))}
              </select>
            </Field>
          )}
        </div>
      )}
      {error && <p className="err">{error}</p>}
    </div>
  );
}

/* ── 右边试聊 ───────────────────────────────────────── */
type Source = "form" | "published";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  citations: Array<{ title?: string; origin?: string; url?: string }>;
  suggestions: string[];
  state: "streaming" | "done" | "stopped" | "error";
  error?: string;
}

interface Used {
  source?: string;
  versionNo?: number | null;
  provider?: string | null;
  model?: string | null;
}

let messageId = 0;

function GuideChat({ form, formProblem, liveLabel }: { form: { system: string; provider: string; model: string }; formProblem: string | null; liveLabel?: string }) {
  const [source, setSource] = useState<Source>("form");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [notReady, setNotReady] = useState(false);
  const [used, setUsed] = useState<Used | null>(null);
  const [usage, setUsage] = useState<{ inputTokens?: number; outputTokens?: number } | null>(null);
  const [latency, setLatency] = useState<number | null>(null);
  const abort = useRef<AbortController | null>(null);
  const scroller = useRef<HTMLDivElement | null>(null);

  // 离开页面时停掉还在跑的请求
  useEffect(() => () => abort.current?.abort(), []);

  useEffect(() => {
    const node = scroller.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [messages]);

  function patchLast(patch: (message: Message) => Message) {
    setMessages((prev) => (prev.length === 0 ? prev : [...prev.slice(0, -1), patch(prev[prev.length - 1])]));
  }

  async function send(text: string) {
    const question = text.trim();
    if (!question || streaming) return;
    if (source === "form" && formProblem) {
      setMessages((prev) => [
        ...prev,
        { id: (messageId += 1), role: "user", content: question, citations: [], suggestions: [], state: "done" },
        { id: (messageId += 1), role: "assistant", content: "", citations: [], suggestions: [], state: "error", error: formProblem },
      ]);
      setInput("");
      return;
    }
    const history: ChatTurn[] = messages
      .filter((m) => m.content && m.state !== "error")
      .slice(-HISTORY_LIMIT)
      .map((m) => ({ role: m.role, content: m.content.slice(0, CONTENT_LIMIT) }));

    setInput("");
    setNotReady(false);
    setStreaming(true);
    setMessages((prev) => [
      ...prev,
      { id: (messageId += 1), role: "user", content: question, citations: [], suggestions: [], state: "done" },
      { id: (messageId += 1), role: "assistant", content: "", citations: [], suggestions: [], state: "streaming" },
    ]);

    const controller = new AbortController();
    abort.current = controller;
    const started = performance.now();
    try {
      const body =
        source === "form"
          ? { question, history, draft: { prompt: { system: form.system }, model: { provider: form.provider, model: form.model } } }
          : { question, history, useDraft: false };
      const response = await api.tryStream(body, controller.signal);
      const parser = createSseParser((event) => {
        if (event.event === "token") patchLast((m) => ({ ...m, content: m.content + event.data.text }));
        else if (event.event === "citation") patchLast((m) => ({ ...m, citations: [...m.citations, event.data as Message["citations"][number]] }));
        else if (event.event === "suggestions") patchLast((m) => ({ ...m, suggestions: event.data.items }));
        else if (event.event === "error") patchLast((m) => ({ ...m, state: "error", error: event.data.message }));
        else if (event.event === "done") {
          const data = event.data as { usage?: typeof usage; used?: Used };
          if (data.usage) setUsage(data.usage);
          if (data.used) setUsed(data.used);
        }
      });
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;
        parser.push(decoder.decode(value, { stream: true }));
      }
      parser.push(decoder.decode());
      parser.flush();
      setLatency(Math.round(performance.now() - started));
      patchLast((m) => (m.state === "streaming" ? { ...m, state: "done" } : m));
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        patchLast((m) => ({ ...m, state: "stopped" }));
      } else if (err instanceof ApiError && err.status === 404) {
        setNotReady(true);
        setMessages((prev) => prev.slice(0, -2));
        setInput(question);
      } else {
        patchLast((m) => ({ ...m, state: "error", error: err instanceof ApiError ? err.message : "试聊失败" }));
      }
    } finally {
      setStreaming(false);
      abort.current = null;
    }
  }

  function clear() {
    abort.current?.abort();
    setMessages([]);
    setUsage(null);
    setUsed(null);
    setLatency(null);
  }

  const lastSuggestions = !streaming ? (messages[messages.length - 1]?.suggestions ?? []) : [];

  return (
    <Card className="chat-card guide-chat" flush>
      <div className="guide-chat__head">
        <Segmented
          value={source}
          onChange={(next) => setSource(next as Source)}
          options={[
            { value: "form", label: "编辑中" },
            { value: "published", label: "线上" },
          ]}
          label="试聊用哪份配置"
        />
        <span className="muted mono dl-ellipsis guide-chat__model">{source === "form" ? (form.provider && form.model ? `${form.provider}/${form.model}` : "未选模型") : (liveLabel ?? "—")}</span>
        <button type="button" className="btn btn-text btn-sm" disabled={messages.length === 0} onClick={clear}>
          <Eraser size={16} strokeWidth={1.75} aria-hidden />
          清空
        </button>
      </div>
      <div className="chat-log" ref={scroller} aria-live="polite">
        {notReady ? (
          <NotReady onRetry={() => setNotReady(false)} />
        ) : messages.length === 0 ? (
          <Empty icon={<FlaskConical size={40} strokeWidth={1.5} aria-hidden />}>{source === "form" ? "问一句，试试左边正在编辑的内容，不用先保存。" : "问一句，看看线上版本答得怎么样。"}这里的对话不计入正式统计。</Empty>
        ) : (
          messages.map((message) => (
            <div key={message.id} className={message.role === "user" ? "msg user" : "msg"}>
              {message.content ? <div className={message.role === "user" ? undefined : "md"}>{message.role === "user" ? message.content : renderMarkdown(message.content)}</div> : message.state === "streaming" ? <span className="typing" aria-label="正在作答"><i /><i /><i /></span> : null}
              {message.state === "stopped" && <div className="meta">已停止</div>}
              {message.state === "error" && (
                <div className="err">
                  {message.error} <Link to={PROVIDERS_URL}>去模型供应商</Link>
                </div>
              )}
              {message.citations.length > 0 && (
                <div className="meta">
                  引用：
                  {message.citations.map((citation, index) => (
                    <span key={index}>
                      {index > 0 ? "；" : ""}
                      {citation.url ? (
                        <a href={citation.url} target="_blank" rel="noreferrer">
                          {citation.origin || citation.title || "知识库"}
                        </a>
                      ) : (
                        citation.origin || citation.title || "知识库"
                      )}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
      {(used || usage || latency !== null) && (
        <p className="muted mono guide-chat__used">
          {used?.provider ? `${used.provider}/${used.model}` : ""}
          {usage ? ` · 词元 ${usage.inputTokens ?? 0}/${usage.outputTokens ?? 0}` : ""}
          {latency !== null ? ` · ${latency}ms` : ""}
        </p>
      )}
      {lastSuggestions.length > 0 && (
        <div className="chip-group chat-suggest">
          {lastSuggestions.map((item) => (
            <button key={item} type="button" className="chip" onClick={() => void send(item)}>
              {item}
            </button>
          ))}
        </div>
      )}
      <form
        className="chat-input"
        onSubmit={(event) => {
          event.preventDefault();
          void send(input);
        }}
      >
        <textarea
          className="textarea"
          rows={2}
          maxLength={CONTENT_LIMIT}
          aria-label="试聊内容"
          placeholder="输入问题，Enter 发送，Shift+Enter 换行"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
              e.preventDefault();
              void send(input);
            }
          }}
        />
        {streaming ? (
          <button type="button" className="btn btn-outline" onClick={() => abort.current?.abort()}>
            <Square size={16} strokeWidth={1.75} aria-hidden />
            停止
          </button>
        ) : (
          <button type="submit" className="btn btn-filled" disabled={!input.trim()}>
            <Send size={16} strokeWidth={1.75} aria-hidden />
            发送
          </button>
        )}
      </form>
    </Card>
  );
}

/* ── 版本记录与对比 ─────────────────────────────────── */
function HistoryDrawer({
  versions,
  onClose,
  onChanged,
  discardDirty,
  hasDirty,
}: {
  versions: ConfigVersion[];
  onClose: () => void;
  onChanged: () => void;
  discardDirty: () => void;
  hasDirty: boolean;
}) {
  const query = useListQuery([]);
  const [view, setView] = useState<"list" | "diff">("list");
  const [target, setTarget] = useState<ConfigVersion | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function confirm() {
    if (!target) return;
    setError(null);
    try {
      const result = await api.publishConfig(target.id);
      toast(target.status === "draft" ? `已发布 v${result.versionNo}` : `已回滚到 v${result.versionNo}`);
      if (hasDirty) discardDirty();
      onChanged();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "操作失败");
    } finally {
      setTarget(null);
    }
  }

  const columns: Column<ConfigVersion>[] = [
    { key: "no", label: "版本", width: "56px", render: (row) => <span className="dl-title mono">v{row.versionNo}</span> },
    { key: "status", label: "状态", width: "72px", render: (row) => <VersionStatus status={row.status} /> },
    { key: "model", label: "模型", width: "minmax(0, 1fr)", mobile: "grow", render: (row) => <span className="muted mono dl-ellipsis">{row.model ? `${row.model.provider}/${row.model.model}` : "—"}</span> },
    { key: "time", label: "时间", width: "112px", mobile: "hide", render: (row) => <span className="dl-time">{dateTime(row.publishedAt ?? row.createdAt)}</span> },
  ];

  return (
    <Drawer
      title={view === "list" ? "版本记录" : "对比提示词"}
      onClose={onClose}
      status={
        <button type="button" className="btn btn-outline btn-sm" disabled={versions.length < 2} onClick={() => setView(view === "list" ? "diff" : "list")}>
          <GitCompareArrows size={16} strokeWidth={1.75} aria-hidden />
          {view === "list" ? "对比两版" : "回到列表"}
        </button>
      }
    >
      {error && <ErrorBar message={error} />}
      {view === "diff" ? (
        <DiffView versions={versions} />
      ) : versions.length === 0 ? (
        <Empty icon={<History size={40} strokeWidth={1.5} aria-hidden />}>还没有版本。保存草稿或发布后会出现在这里。</Empty>
      ) : (
        <DataList
          label="配置版本"
          columns={columns}
          rows={versions}
          rowKey={(row) => row.id}
          query={query}
          actionsWidth="64px"
          actions={(row) =>
            row.status === "published" ? null : (
              <button type="button" className="btn btn-text btn-sm" onClick={() => setTarget(row)}>
                {row.status === "draft" ? "发布" : "回滚"}
              </button>
            )
          }
        />
      )}
      <Confirm
        open={Boolean(target)}
        title={target?.status === "draft" ? `发布 v${target?.versionNo}？` : `回滚到 v${target?.versionNo}？`}
        desc={`访客端的讲解员会立刻改用这一版的提示词和模型。${hasDirty ? "左边没保存的改动会被放弃。" : ""}`}
        confirmText={target?.status === "draft" ? "发布" : "回滚"}
        onConfirm={() => void confirm()}
        onCancel={() => setTarget(null)}
      />
    </Drawer>
  );
}

type DiffLine = { kind: "same" | "add" | "del"; text: string; left?: number; right?: number };

/** 逐行 LCS。先削掉首尾相同的行，提示词改动通常很小，表格也就很小 */
function diffLines(before: string, after: string): DiffLine[] {
  const a = before.split("\n");
  const b = after.split("\n");
  let start = 0;
  while (start < a.length && start < b.length && a[start] === b[start]) start += 1;
  let endA = a.length;
  let endB = b.length;
  while (endA > start && endB > start && a[endA - 1] === b[endB - 1]) {
    endA -= 1;
    endB -= 1;
  }
  const n = endA - start;
  const m = endB - start;
  const out: DiffLine[] = [];
  for (let i = 0; i < start; i += 1) out.push({ kind: "same", text: a[i], left: i + 1, right: i + 1 });

  if (n * m > 4_000_000) {
    // 太大就退化成整段替换，不卡页面
    for (let i = 0; i < n; i += 1) out.push({ kind: "del", text: a[start + i], left: start + i + 1 });
    for (let j = 0; j < m; j += 1) out.push({ kind: "add", text: b[start + j], right: start + j + 1 });
  } else {
    const table = new Uint32Array((n + 1) * (m + 1));
    const at = (i: number, j: number) => i * (m + 1) + j;
    for (let i = n - 1; i >= 0; i -= 1) {
      for (let j = m - 1; j >= 0; j -= 1) {
        table[at(i, j)] = a[start + i] === b[start + j] ? table[at(i + 1, j + 1)] + 1 : Math.max(table[at(i + 1, j)], table[at(i, j + 1)]);
      }
    }
    let i = 0;
    let j = 0;
    while (i < n || j < m) {
      if (i < n && j < m && a[start + i] === b[start + j]) {
        out.push({ kind: "same", text: a[start + i], left: start + i + 1, right: start + j + 1 });
        i += 1;
        j += 1;
      } else if (j < m && (i === n || table[at(i, j + 1)] >= table[at(i + 1, j)])) {
        out.push({ kind: "add", text: b[start + j], right: start + j + 1 });
        j += 1;
      } else {
        out.push({ kind: "del", text: a[start + i], left: start + i + 1 });
        i += 1;
      }
    }
  }
  for (let k = 0; k < a.length - endA; k += 1) out.push({ kind: "same", text: a[endA + k], left: endA + k + 1, right: endB + k + 1 });
  return out;
}

function DiffView({ versions }: { versions: ConfigVersion[] }) {
  // 默认：线上版本对比最新一版（没有线上就最新两版）
  const sorted = useMemo(() => [...versions].sort((x, y) => y.versionNo - x.versionNo), [versions]);
  const published = sorted.find((v) => v.status === "published");
  const [leftId, setLeftId] = useState((published && published.id !== sorted[0].id ? published : sorted[1]).id);
  const [rightId, setRightId] = useState(sorted[0].id);

  // 列表里没带 prompt 时按 id 单独取
  const load = (id: string) => {
    const hit = versions.find((v) => v.id === id);
    return hit?.prompt ? Promise.resolve(hit) : api.version(id);
  };
  const left = useAsync(() => load(leftId), [leftId]);
  const right = useAsync(() => load(rightId), [rightId]);

  const lines = useMemo(
    () => (left.data && right.data ? diffLines(left.data.prompt?.system ?? "", right.data.prompt?.system ?? "") : null),
    [left.data, right.data],
  );
  const added = lines?.filter((l) => l.kind === "add").length ?? 0;
  const removed = lines?.filter((l) => l.kind === "del").length ?? 0;
  const option = (v: ConfigVersion) => (
    <option key={v.id} value={v.id}>
      v{v.versionNo} · {VERSION_STATUS[v.status]?.label ?? v.status}
    </option>
  );

  return (
    <>
      <div className="form-grid">
        <Field label="旧版本">
          <select className="select" value={leftId} onChange={(e) => setLeftId(e.target.value)}>
            {sorted.map(option)}
          </select>
        </Field>
        <Field label="新版本">
          <select className="select" value={rightId} onChange={(e) => setRightId(e.target.value)}>
            {sorted.map(option)}
          </select>
        </Field>
      </div>
      {left.notReady || right.notReady ? (
        <NotReady compact />
      ) : left.error || right.error ? (
        <ErrorBar
          message={left.error ?? right.error ?? "读取失败"}
          onRetry={() => {
            left.reload();
            right.reload();
          }}
        />
      ) : !lines ? (
        <Skeleton rows={8} />
      ) : added === 0 && removed === 0 ? (
        <Empty compact>这两版的提示词完全相同。</Empty>
      ) : (
        <>
          <div className="meta-row">
            <span className="mono diff-add">+{added}</span>
            <span className="mono diff-del">-{removed}</span>
          </div>
          <div className="diff" role="table" aria-label="提示词逐行差异">
            {lines.map((line, index) => (
              <div className="diff__line" data-kind={line.kind} role="row" key={index}>
                <span className="diff__no" role="cell">
                  {line.left ?? ""}
                </span>
                <span className="diff__no" role="cell">
                  {line.right ?? ""}
                </span>
                <span className="diff__sign" role="cell" aria-label={line.kind === "add" ? "新增" : line.kind === "del" ? "删除" : undefined}>
                  {line.kind === "add" ? "+" : line.kind === "del" ? "-" : ""}
                </span>
                <span className="diff__text" role="cell">
                  {line.text || " "}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}
