// 模型供应商：和 pi 的 models.json 同样的配置逻辑。列表就地展开编辑，Key 只写不读。
import { useEffect, useMemo, useState } from "react";
import { ChevronDown, CircleCheck, CircleX, DownloadCloud, Plug, Plus, RefreshCw, Trash2 } from "lucide-react";
import { useSearchParams } from "react-router";
import { api, ApiError, type PiProvider, type ProviderDraft, type ProviderModel, type ProviderRow } from "../api";
import { applyApiError, asyncGate, Card, Confirm, Drawer, Empty, ErrorBar, Field, LeaveGuard, Segmented, Skeleton, toast, useAsync, useFormState } from "../ui";

type TestResult = { ok: boolean; latencyMs?: number; message: string };

const NEW = "__new__";
const NAME_RULE = /^[a-z0-9][a-z0-9._-]{0,39}$/;
const API_KINDS = [
  { value: "openai-completions", label: "OpenAI Chat Completions" },
  { value: "openai-responses", label: "OpenAI Responses" },
  { value: "anthropic-messages", label: "Anthropic Messages" },
  { value: "google-generative-ai", label: "Google Generative AI" },
];
const IMPORTABLE_API = new Set(API_KINDS.map((kind) => kind.value));

interface ModelRow {
  key: number;
  id: string;
  name: string;
  contextWindow: string;
  maxTokens: string;
  reasoning: boolean;
  image: boolean;
  compat: string;
  open: boolean;
}

let modelKey = 0;
function toModelRow(model?: ProviderModel | string): ModelRow {
  const spec: ProviderModel = typeof model === "string" ? { id: model } : (model ?? { id: "" });
  return {
    key: (modelKey += 1),
    id: spec.id,
    name: spec.name && spec.name !== spec.id ? spec.name : "",
    contextWindow: spec.contextWindow ? String(spec.contextWindow) : "",
    maxTokens: spec.maxTokens ? String(spec.maxTokens) : "",
    reasoning: Boolean(spec.reasoning),
    image: Boolean(spec.input?.includes("image")),
    compat: spec.compat ? JSON.stringify(spec.compat, null, 2) : "",
    open: false,
  };
}

/** 表单行 → 接口的 models。高级项没填就不传，由服务端给默认值 */
function toModelSpec(row: ModelRow): ProviderModel | null {
  const id = row.id.trim();
  if (!id) return null;
  const spec: ProviderModel = { id, name: row.name.trim() || id, reasoning: row.reasoning, input: row.image ? ["text", "image"] : ["text"] };
  if (row.contextWindow.trim()) spec.contextWindow = Number(row.contextWindow);
  if (row.maxTokens.trim()) spec.maxTokens = Number(row.maxTokens);
  if (row.compat.trim()) {
    try {
      spec.compat = JSON.parse(row.compat) as Record<string, unknown>;
    } catch {
      /* validate 已拦 */
    }
  }
  return spec;
}

function isPositiveInt(text: string) {
  return /^[1-9]\d*$/.test(text.trim());
}

function modelError(row: ModelRow): string | null {
  if (!row.id.trim()) return null;
  if (row.contextWindow.trim() && !isPositiveInt(row.contextWindow)) return `${row.id}：上下文长度要是正整数`;
  if (row.maxTokens.trim() && !isPositiveInt(row.maxTokens)) return `${row.id}：最大输出要是正整数`;
  if (row.compat.trim()) {
    try {
      const parsed = JSON.parse(row.compat) as unknown;
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return `${row.id}：compat 要是 JSON 对象`;
    } catch {
      return `${row.id}：compat 不是合法的 JSON`;
    }
  }
  return null;
}

function keyStatus(row: ProviderRow): { label: string; tone: string } {
  if (!row.hasKey) return { label: "需要填 Key", tone: "pill pill--warn" };
  if (!row.ready) return { label: row.keyMode === "env" ? "环境变量为空" : "Key 不可用", tone: "pill pill--warn" };
  return { label: row.keyMode === "env" ? `环境变量 ${row.apiKeyEnv}` : "Key 已保存", tone: "pill" };
}

export default function Providers() {
  const list = useAsync<ProviderRow[]>(() => api.providers(), []);
  const [params, setParams] = useSearchParams();
  const [openId, setOpenId] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);
  const [switchTo, setSwitchTo] = useState<{ next: string | null } | null>(null);
  const [formRev, setFormRev] = useState(0);
  const [removing, setRemoving] = useState<ProviderRow | null>(null);
  const [results, setResults] = useState<Record<string, TestResult>>({});
  const [testingId, setTestingId] = useState<string | null>(null);
  const [importing, setImporting] = useState(params.get("import") === "1");

  function openCard(next: string | null) {
    // 新增表单每次都是新的，别留上次的测试结果
    setResults(({ [NEW]: _stale, ...rest }) => rest);
    setOpenId(next);
  }

  function requestOpen(next: string | null) {
    if (next === openId) return;
    if (dirty) setSwitchTo({ next });
    else openCard(next);
  }

  function closeImport() {
    setImporting(false);
    if (params.has("import")) {
      const rest = new URLSearchParams(params);
      rest.delete("import");
      setParams(rest, { replace: true });
    }
  }

  function setResult(id: string, result: TestResult) {
    setResults((prev) => ({ ...prev, [id]: result }));
  }

  async function test(row: ProviderRow) {
    setTestingId(row.id);
    try {
      setResult(row.id, await api.testProvider(row.id));
      list.reload();
    } catch (err) {
      setResult(row.id, { ok: false, message: err instanceof ApiError ? err.message : "测试失败" });
    } finally {
      setTestingId(null);
    }
  }

  async function toggle(row: ProviderRow) {
    const send = (enabled: boolean) => api.patchProvider(row.id, { enabled });
    try {
      await send(!row.enabled);
      list.reload();
      toast(row.enabled ? "已停用" : "已启用", {
        action: {
          label: "撤销",
          run: () =>
            void send(row.enabled)
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

  async function remove() {
    if (!removing) return;
    try {
      await api.deleteProvider(removing.id);
      toast("供应商已删除");
      if (openId === removing.id) {
        setDirty(false);
        setOpenId(null);
      }
      list.reload();
    } catch (err) {
      toast(err instanceof ApiError ? err.message : "删除失败");
    } finally {
      setRemoving(null);
    }
  }

  const gate = asyncGate(list);
  const rows = list.data ?? [];

  return (
    <>
      <Card
        title="供应商"
        actions={
          <>
            <button type="button" className="btn btn-outline btn-sm" onClick={() => setImporting(true)}>
              <DownloadCloud size={16} strokeWidth={1.75} aria-hidden />
              从 pi 导入
            </button>
            <button type="button" className="btn btn-filled btn-sm" onClick={() => requestOpen(NEW)}>
              <Plus size={16} strokeWidth={1.75} aria-hidden />
              新增供应商
            </button>
          </>
        }
      >
        {gate ?? (
          <div className="pv-list">
            {openId === NEW && (
              <section className="pv-card" data-open="true">
                <ProviderForm
                  key="new"
                  row={null}
                  onDirty={setDirty}
                  onCancel={() => {
                    setDirty(false);
                    setOpenId(null);
                  }}
                  onSaved={(saved) => {
                    setDirty(false);
                    setOpenId(saved.id);
                    list.mutate((prev) => [...prev, saved]);
                    list.reload();
                  }}
                  result={results[NEW]}
                  onResult={(result) => setResult(NEW, result)}
                />
              </section>
            )}
            {rows.length === 0 && openId !== NEW ? (
              <Empty
                action={
                  <button type="button" className="btn btn-filled btn-sm" onClick={() => openCard(NEW)}>
                    新增供应商
                  </button>
                }
              >
                还没有供应商。新增一个，或者从本机 pi 的配置导入。
              </Empty>
            ) : (
              rows.map((row) => {
                const open = openId === row.id;
                const status = keyStatus(row);
                return (
                  <section className="pv-card" data-open={open} key={row.id}>
                    <div className="pv-head">
                      <button type="button" className="pv-head__main" aria-expanded={open} onClick={() => requestOpen(open ? null : row.id)}>
                        <ChevronDown size={18} strokeWidth={1.75} className="pv-chevron" aria-hidden />
                        <span className="pv-head__text">
                          <span className="pv-head__title">
                            <b className="mono">{row.name}</b>
                            {row.displayName && <span className="muted">{row.displayName}</span>}
                          </span>
                          <span className="muted dl-ellipsis">{row.baseUrl}</span>
                        </span>
                      </button>
                      <div className="pv-head__meta">
                        <span className="muted mono">{row.models.length} 个模型</span>
                        <span className={status.tone}>{status.label}</span>
                        <span className={row.enabled ? "pill pill--ok" : "pill"}>{row.enabled ? "启用" : "停用"}</span>
                      </div>
                      <div className="pv-head__actions">
                        <button type="button" className="btn btn-text btn-sm" onClick={() => void toggle(row)}>
                          {row.enabled ? "停用" : "启用"}
                        </button>
                        {!open && (
                          <button type="button" className="btn btn-text btn-sm" disabled={testingId === row.id} onClick={() => void test(row)}>
                            {testingId === row.id ? "测试中…" : "测试连接"}
                          </button>
                        )}
                        <button type="button" className="icon-btn" title="删除" aria-label={`删除 ${row.name}`} onClick={() => setRemoving(row)}>
                          <Trash2 size={18} strokeWidth={1.75} />
                        </button>
                      </div>
                    </div>
                    {!open && results[row.id] && <TestLine result={results[row.id]} />}
                    {open && (
                      <ProviderForm
                        key={`${row.id}:${formRev}`}
                        row={row}
                        onDirty={setDirty}
                        onCancel={() => {
                          setDirty(false);
                          setFormRev((n) => n + 1);
                        }}
                        onSaved={(saved) => {
                          setDirty(false);
                          list.mutate((prev) => prev.map((one) => (one.id === saved.id ? saved : one)));
                          setFormRev((n) => n + 1);
                          list.reload();
                        }}
                        result={results[row.id]}
                        onResult={(result) => setResult(row.id, result)}
                        onTested={list.reload}
                      />
                    )}
                  </section>
                );
              })
            )}
          </div>
        )}
      </Card>

      {importing && (
        <PiImportDialog
          onClose={closeImport}
          onDone={() => {
            closeImport();
            list.reload();
            // 展开着的那条可能刚被覆盖；没改动就收起，下次展开读新值
            if (!dirty) setOpenId(null);
          }}
        />
      )}

      <LeaveGuard when={dirty} />

      <Confirm
        open={Boolean(switchTo)}
        danger
        title="放弃未保存的改动？"
        desc="这个供应商还有没保存的改动，切换后不会保留。"
        confirmText="放弃改动"
        onCancel={() => setSwitchTo(null)}
        onConfirm={() => {
          setDirty(false);
          openCard(switchTo?.next ?? null);
          setSwitchTo(null);
        }}
      />

      <Confirm
        open={Boolean(removing)}
        title={`删除 ${removing?.name ?? "供应商"}？`}
        desc="删除后不能恢复。发布配置或草稿还在用它时不能删除。"
        confirmText="删除"
        danger
        onConfirm={() => void remove()}
        onCancel={() => setRemoving(null)}
      />
    </>
  );
}

function TestLine({ result }: { result: TestResult }) {
  return (
    <div className="test-result" data-ok={result.ok} role="status">
      {result.ok ? <CircleCheck size={18} strokeWidth={1.75} aria-hidden /> : <CircleX size={18} strokeWidth={1.75} aria-hidden />}
      <span>{result.ok ? "连接成功" : "连接失败"}</span>
      {typeof result.latencyMs === "number" && result.latencyMs > 0 && <span className="mono muted">{result.latencyMs}ms</span>}
      {result.message && <span className="muted test-result__msg">{result.message}</span>}
    </div>
  );
}

function ProviderForm({
  row,
  onDirty,
  onCancel,
  onSaved,
  result,
  onResult,
  onTested,
}: {
  row: ProviderRow | null;
  onDirty: (dirty: boolean) => void;
  onCancel: () => void;
  onSaved: (saved: ProviderRow) => void;
  result?: TestResult;
  onResult: (result: TestResult) => void;
  onTested?: () => void;
}) {
  const { form, dirty, errors, setErrors, set, bind } = useFormState({
    name: row?.name ?? "",
    displayName: row?.displayName ?? "",
    baseUrl: row?.baseUrl ?? "",
    api: row?.api ?? "openai-completions",
    keyMode: row?.keyMode ?? "literal",
    apiKeyEnv: row?.apiKeyEnv ?? "",
    apiKey: "",
  });
  const [models, setModels] = useState<ModelRow[]>(() => (row?.models.length ? row.models.map(toModelRow) : [toModelRow()]));
  const initialModels = useState(() => JSON.stringify((row?.models ?? []).map(toModelRow).map(toModelSpec)))[0];
  const [choices, setChoices] = useState<string[]>([]);
  const [fetching, setFetching] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);

  const specs = () => models.map(toModelSpec).filter((spec): spec is ProviderModel => spec !== null);
  const modelsDirty = JSON.stringify(specs()) !== initialModels;
  const anyDirty = dirty || modelsDirty;
  useEffect(() => onDirty(anyDirty), [anyDirty, onDirty]);

  const hasSavedKey = Boolean(row?.hasKey && row.keyMode === "literal");
  const picked = useMemo(() => new Set(models.map((m) => m.id.trim())), [models]);

  function setModel(key: number, patch: Partial<ModelRow>) {
    setModels((prev) => prev.map((m) => (m.key === key ? { ...m, ...patch } : m)));
    setErrors({});
  }

  function toggleChoice(id: string) {
    setModels((prev) => {
      if (prev.some((m) => m.id.trim() === id)) {
        const rest = prev.filter((m) => m.id.trim() !== id);
        return rest.length > 0 ? rest : [toModelRow()];
      }
      return [...prev.filter((m) => m.id.trim()), toModelRow(id)];
    });
  }

  function takeAll() {
    setModels((prev) => {
      const kept = prev.filter((m) => m.id.trim());
      const have = new Set(kept.map((m) => m.id.trim()));
      return [...kept, ...choices.filter((id) => !have.has(id)).map(toModelRow)];
    });
  }

  function connection(): ProviderDraft {
    return {
      id: row?.id,
      baseUrl: form.baseUrl.trim(),
      api: form.api,
      keyMode: form.keyMode,
      apiKeyEnv: form.keyMode === "env" ? form.apiKeyEnv.trim() : undefined,
      apiKey: form.keyMode === "literal" ? form.apiKey.trim() : undefined,
    };
  }

  /** 连接相关的字段：拉模型、测试、保存都要 */
  function validateConnection(next: Record<string, string>) {
    if (!/^https?:\/\/\S+$/.test(form.baseUrl.trim())) next.baseUrl = "要填 http 或 https 开头的完整地址";
    if (form.keyMode === "env" && !form.apiKeyEnv.trim()) next.apiKeyEnv = "请填环境变量名";
    if (form.keyMode === "literal" && !hasSavedKey && !form.apiKey.trim()) next.apiKey = "请填 API Key";
  }

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!NAME_RULE.test(form.name.trim())) next.name = "1–40 位小写字母、数字、点、下划线、短横线，字母或数字开头";
    validateConnection(next);
    const list = specs();
    if (list.length === 0) next.models = "至少保留一个模型";
    else {
      const bad = models.map(modelError).find(Boolean);
      if (bad) next.models = bad;
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function fetchModels() {
    const next: Record<string, string> = {};
    validateConnection(next);
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    setFetching(true);
    try {
      const out = await api.fetchProviderModelsDraft(connection());
      if (!out.ok) {
        // 失败只提示，不动正在编辑的列表
        setErrors({ models: out.message || "拉取模型列表失败" });
        return;
      }
      setChoices(out.models);
      if (out.models.length === 0) setErrors({ models: "接口返回了空列表，可以手动添加模型" });
    } catch (err) {
      setError(applyApiError(err, setErrors, "拉取失败"));
    } finally {
      setFetching(false);
    }
  }

  async function test() {
    if (!validate()) return;
    setTesting(true);
    try {
      // 已保存且没改过就测库里的配置，并把结果记到这条供应商上；否则测表单里的值
      const out = row && !anyDirty ? await api.testProvider(row.id) : await api.testProviderDraft({ ...connection(), models: specs() });
      onResult(out);
      if (row && !anyDirty) onTested?.();
    } catch (err) {
      onResult({ ok: false, message: err instanceof ApiError ? err.message : "测试失败" });
    } finally {
      setTesting(false);
    }
  }

  async function save() {
    if (!validate()) return;
    setBusy(true);
    setError(null);
    const body = {
      name: form.name.trim(),
      displayName: form.displayName.trim() || null,
      baseUrl: form.baseUrl.trim(),
      api: form.api,
      keyMode: form.keyMode,
      models: specs(),
      ...(form.keyMode === "env" ? { apiKeyEnv: form.apiKeyEnv.trim() } : {}),
      ...(form.keyMode === "literal" && form.apiKey.trim() ? { apiKey: form.apiKey.trim() } : {}),
    };
    try {
      const saved = row ? await api.patchProvider(row.id, body) : await api.createProvider(body);
      toast(row ? "供应商已保存" : "供应商已创建");
      onSaved(saved);
    } catch (err) {
      setError(applyApiError(err, setErrors, "保存失败"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <form
      className="pv-form"
      onSubmit={(event) => {
        event.preventDefault();
        void save();
      }}
    >
      {!row && <h3 className="pv-form__title">新增供应商</h3>}
      {error && <ErrorBar message={error} />}

      <div className="form-grid">
        <Field label="名称" hint="配置里用它引用，如 deepseek" error={errors.name}>
          <input className="input mono" {...bind("name")} autoComplete="off" spellCheck={false} />
        </Field>
        <Field label="显示名" hint="可留空" error={errors.displayName}>
          <input className="input" {...bind("displayName")} autoComplete="off" />
        </Field>
      </div>
      <div className="form-grid">
        <Field label="Base URL" hint="例如 https://api.deepseek.com/v1" error={errors.baseUrl}>
          <input className="input" {...bind("baseUrl")} inputMode="url" autoComplete="off" spellCheck={false} />
        </Field>
        <Field label="接口类型" error={errors.api}>
          <select className="select" {...bind("api")}>
            {API_KINDS.map((kind) => (
              <option key={kind.value} value={kind.value}>
                {kind.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="form-grid">
        <Field label="Key 存放方式">
          <Segmented
            value={form.keyMode}
            onChange={(next) => set("keyMode", next)}
            options={[
              { value: "literal", label: "直接填写" },
              { value: "env", label: "环境变量" },
            ]}
            label="Key 存放方式"
          />
        </Field>
        {form.keyMode === "literal" ? (
          <Field label="API Key" hint={hasSavedKey ? "已保存，留空表示不改" : "加密保存，保存后不再显示"} error={errors.apiKey}>
            <input className="input" type="password" {...bind("apiKey")} autoComplete="new-password" placeholder={hasSavedKey ? "已保存" : undefined} />
          </Field>
        ) : (
          <Field label="环境变量名" hint="Key 不存数据库，运行时从服务器环境变量读取" error={errors.apiKeyEnv}>
            <input className="input mono" {...bind("apiKeyEnv")} placeholder="例如 DEEPSEEK_API_KEY" autoComplete="off" spellCheck={false} />
          </Field>
        )}
      </div>

      <section className="section">
        <div className="section__head">
          <h3>模型</h3>
          <button type="button" className="btn btn-text btn-sm" onClick={() => void fetchModels()} disabled={fetching}>
            <RefreshCw size={16} strokeWidth={1.75} aria-hidden />
            {fetching ? "拉取中…" : "从接口拉取"}
          </button>
          <button type="button" className="btn btn-text btn-sm" onClick={() => setModels((prev) => [...prev, toModelRow()])}>
            <Plus size={16} strokeWidth={1.75} aria-hidden />
            手动添加
          </button>
        </div>
        {choices.length > 0 && (
          <div className="pv-choices">
            <div className="pv-choices__head">
              <span className="muted">接口返回 {choices.length} 个模型，点一下收录或移除</span>
              <button type="button" className="btn btn-text btn-sm" onClick={takeAll}>
                全部收录
              </button>
            </div>
            <div className="chip-group">
              {choices.map((id) => (
                <button key={id} type="button" className={picked.has(id) ? "chip on" : "chip"} onClick={() => toggleChoice(id)}>
                  {id}
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="model-rows">
          <div className="model-row pv-model-row model-row--head muted" aria-hidden>
            <span>模型 id</span>
            <span>显示名</span>
            <span />
            <span />
          </div>
          {models.map((model) => (
            <div className="pv-model" key={model.key}>
              <div className="model-row pv-model-row">
                <input className="input mono" aria-label="模型 id" value={model.id} onChange={(e) => setModel(model.key, { id: e.target.value })} placeholder="deepseek-v4-flash" spellCheck={false} />
                <input className="input" aria-label="显示名" value={model.name} onChange={(e) => setModel(model.key, { name: e.target.value })} placeholder="可留空" />
                <button type="button" className="btn btn-text btn-sm pv-adv-toggle" aria-expanded={model.open} onClick={() => setModel(model.key, { open: !model.open })}>
                  高级
                  <ChevronDown size={14} strokeWidth={1.75} className="pv-chevron" aria-hidden />
                </button>
                <button
                  type="button"
                  className="icon-btn"
                  aria-label={`移除模型 ${model.id}`}
                  title="移除"
                  onClick={() => setModels((prev) => (prev.length > 1 ? prev.filter((m) => m.key !== model.key) : [toModelRow()]))}
                >
                  <Trash2 size={18} strokeWidth={1.75} />
                </button>
              </div>
              {model.open && (
                <div className="pv-model__adv">
                  <div className="form-grid">
                    <Field label="上下文长度" hint="留空用默认值 128000">
                      <input className="input mono" inputMode="numeric" value={model.contextWindow} onChange={(e) => setModel(model.key, { contextWindow: e.target.value })} />
                    </Field>
                    <Field label="最大输出" hint="留空用默认值 8192">
                      <input className="input mono" inputMode="numeric" value={model.maxTokens} onChange={(e) => setModel(model.key, { maxTokens: e.target.value })} />
                    </Field>
                  </div>
                  <div className="chip-group">
                    <label className="check-row">
                      <input type="checkbox" className="check" checked={model.reasoning} onChange={(e) => setModel(model.key, { reasoning: e.target.checked })} />
                      支持推理
                    </label>
                    <label className="check-row">
                      <input type="checkbox" className="check" checked={model.image} onChange={(e) => setModel(model.key, { image: e.target.checked })} />
                      可输入图片
                    </label>
                  </div>
                  <Field label="compat" hint="和 pi 的 compat 一样的 JSON 对象，可留空">
                    <textarea className="textarea textarea--code" rows={3} value={model.compat} onChange={(e) => setModel(model.key, { compat: e.target.value })} spellCheck={false} />
                  </Field>
                </div>
              )}
            </div>
          ))}
        </div>
        {errors.models && <p className="err">{errors.models}</p>}
      </section>

      <section className="section">
        <div className="section__head">
          <h3>连接测试</h3>
          <button type="button" className="btn btn-outline btn-sm" onClick={() => void test()} disabled={testing}>
            <Plug size={16} strokeWidth={1.75} aria-hidden />
            {testing ? "测试中…" : "测试连接"}
          </button>
        </div>
        {testing ? <Skeleton rows={1} /> : result && <TestLine result={result} />}
      </section>

      <div className="pv-form__foot">
        {anyDirty && <span className="pill pill--warn">有未保存的改动</span>}
        <span className="spacer" />
        <button type="button" className="btn" onClick={onCancel}>
          {row ? "还原" : "取消"}
        </button>
        <button type="submit" className="btn btn-filled" disabled={busy || (Boolean(row) && !anyDirty)}>
          {busy ? "保存中…" : row ? "保存" : "创建"}
        </button>
      </div>
    </form>
  );
}

/** 不能导入的原因；空串表示可以导入 */
function importBlock(one: PiProvider): string {
  if (!NAME_RULE.test(one.name)) return "名称不合规";
  if (!one.baseUrl) return "没有 Base URL";
  if (one.modelCount === 0) return "没有模型";
  if (!IMPORTABLE_API.has(one.api)) return `不支持 ${one.api}`;
  return "";
}

function PiImportDialog({ onClose, onDone }: { onClose: () => void; onDone: () => void }) {
  const config = useAsync(() => api.piConfig(), []);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [conflict, setConflict] = useState<"skip" | "overwrite">("skip");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const providers = config.data?.providers ?? [];
  const hasConflict = providers.some((one) => selected.has(one.name) && one.exists);

  function flip(name: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }

  async function run() {
    setBusy(true);
    setError(null);
    try {
      const out = await api.importPi([...selected], conflict);
      const parts = [`导入 ${out.imported.length} 个`];
      if (out.skipped.length > 0) parts.push(`跳过 ${out.skipped.join("、")}`);
      if (out.needKey.length > 0) parts.push(`${out.needKey.join("、")} 需要填 Key`);
      toast(parts.join("；"));
      onDone();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "导入失败");
      setBusy(false);
    }
  }

  return (
    <Drawer
      variant="dialog"
      title="从 pi 导入"
      onClose={onClose}
      footer={
        <>
          <span className="spacer" />
          <button type="button" className="btn" onClick={onClose}>
            取消
          </button>
          <button type="button" className="btn btn-filled" disabled={busy || selected.size === 0} onClick={() => void run()}>
            {busy ? "导入中…" : selected.size > 0 ? `导入 ${selected.size} 个` : "导入"}
          </button>
        </>
      }
    >
      {error && <ErrorBar message={error} />}
      {asyncGate(config, { compact: true }) ??
        (config.data && !config.data.found ? (
          <Empty compact>
            没有找到 pi 的配置文件：<span className="mono">{config.data.path}</span>
          </Empty>
        ) : providers.length === 0 ? (
          <Empty compact>pi 的配置里没有供应商。</Empty>
        ) : (
          <div className="stack">
            <p className="muted mono pv-import__path">{config.data?.path}</p>
            <div className="pv-import">
              {providers.map((one) => {
                const block = importBlock(one);
                return (
                  <label className="pv-import__row" key={one.name} data-disabled={Boolean(block)}>
                    <input type="checkbox" className="check" disabled={Boolean(block)} checked={selected.has(one.name)} onChange={() => flip(one.name)} />
                    <span className="pv-import__text">
                      <span className="pv-head__title">
                        <b className="mono">{one.name}</b>
                        {one.displayName && <span className="muted">{one.displayName}</span>}
                      </span>
                      <span className="muted dl-ellipsis">{one.baseUrl || "—"}</span>
                    </span>
                    <span className="pv-import__meta">
                      <span className="muted mono">{one.modelCount} 个模型</span>
                      {block ? (
                        <span className="pill">{block}</span>
                      ) : (
                        <>
                          {one.exists && <span className="pill pill--tint">已有同名</span>}
                          <span className={one.hasKey ? "pill" : "pill pill--warn"}>{one.keyKind === "env" ? "环境变量" : one.hasKey ? "带 Key" : "没存 Key"}</span>
                        </>
                      )}
                    </span>
                  </label>
                );
              })}
            </div>
            {hasConflict && (
              <Field label="同名的供应商" hint="覆盖时，pi 里没存 Key 的会保留已保存的 Key">
                <Segmented
                  value={conflict}
                  onChange={(next) => setConflict(next as "skip" | "overwrite")}
                  options={[
                    { value: "skip", label: "跳过" },
                    { value: "overwrite", label: "覆盖" },
                  ]}
                  label="同名的供应商"
                />
              </Field>
            )}
          </div>
        ))}
    </Drawer>
  );
}
