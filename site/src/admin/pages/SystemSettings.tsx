// 系统设置：站点级开关与参数。可写的键以接口返回的 allowedKeys 为准。
import { useState } from "react";
import { api, ApiError, type ModelOptions } from "../api";
import { Advanced, asyncGate, Card, Empty, ErrorBar, Field, LeaveGuard, Segmented, toast, useAsync } from "../ui";

const SETTING_META: Record<string, { label: string; hint?: string; kind?: "text" | "textarea" | "bool" }> = {
  "site.title": { label: "站点标题" },
  "site.notice": { label: "站点公告", kind: "textarea" },
  "guide.enabled": { label: "讲解员开关", kind: "bool" },
};
// 低库存线在商品列表上改；shop.demoPriceEnabled 前台没有用到，不放出来
const HIDDEN_KEYS = new Set(["shop.lowStockThreshold", "shop.demoPriceEnabled"]);
const ANALYSIS_PROVIDER = "analysis.provider";
const ANALYSIS_MODEL = "analysis.model";

export default function SystemSettings() {
  const settings = useAsync(() => api.settings(), []);
  // 已经有数据时刷新失败不换掉表单，没保存的输入和保存按钮都留着
  if (!settings.data) return <Card title="站点与开关">{asyncGate(settings)}</Card>;
  return (
    <>
      {settings.error && <ErrorBar message={settings.error} />}
      <SettingsForm key={JSON.stringify(settings.data.values)} values={settings.data.values} allowedKeys={settings.data.allowedKeys} onSaved={settings.reload} />
    </>
  );
}

function SettingsForm({ values, allowedKeys, onSaved }: { values: Record<string, string>; allowedKeys: string[]; onSaved: () => void }) {
  const keys = allowedKeys.filter((key) => !HIDDEN_KEYS.has(key));
  // 开关没落库时按开启处理，与后端默认值一致
  const initial = Object.fromEntries(keys.map((key) => [key, values[key] ?? (SETTING_META[key]?.kind === "bool" ? "true" : "")]));
  const [form, setForm] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dirty = keys.some((key) => form[key] !== initial[key]);
  const options = useAsync(() => api.modelOptions(), []);

  if (keys.length === 0) return <Card title="站点与开关"><Empty compact>没有可修改的设置项。</Empty></Card>;

  const set = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  async function save() {
    setBusy(true);
    setError(null);
    try {
      await api.saveSettings(form);
      toast("设置已保存");
      onSaved();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "保存失败");
    } finally {
      setBusy(false);
    }
  }

  const render = (key: string) => {
    const meta = SETTING_META[key];
    const label = meta?.label ?? key;
    if (meta?.kind === "bool") {
      return (
        <Field key={key} label={label} hint={meta.hint}>
          <Segmented
            value={form[key]}
            onChange={(next) => set(key, next)}
            options={[
              { value: "true", label: "开启" },
              { value: "false", label: "关闭" },
            ]}
            label={label}
          />
        </Field>
      );
    }
    if (meta?.kind === "textarea") {
      return (
        <Field key={key} label={label} hint={meta.hint}>
          <textarea className="textarea" rows={4} value={form[key]} onChange={(e) => set(key, e.target.value)} />
        </Field>
      );
    }
    return (
      <Field key={key} label={label} hint={meta?.hint}>
        <input className="input" value={form[key]} onChange={(e) => set(key, e.target.value)} />
      </Field>
    );
  };

  const hasAnalysis = keys.includes(ANALYSIS_PROVIDER);
  const common = keys.filter((key) => key !== ANALYSIS_PROVIDER && key !== ANALYSIS_MODEL);
  const provider = form[ANALYSIS_PROVIDER] ?? "";
  const model = form[ANALYSIS_MODEL] ?? "";
  // 只拦这次改出来的空模型；库里原有的值不因为改别的设置而被挡
  const needModel = Boolean(provider) && !model && (provider !== initial[ANALYSIS_PROVIDER] || model !== initial[ANALYSIS_MODEL]);

  return (
    <div className="product-page">
      {error && <ErrorBar message={error} />}
      <Card
        title="站点与开关"
        actions={
          <>
            {dirty && <span className="pill pill--bad">有未保存的改动</span>}
            <button type="button" className="btn btn-outline btn-sm" disabled={!dirty || busy} onClick={() => setForm(initial)}>
              还原
            </button>
            <button type="button" className="btn btn-filled btn-sm" disabled={!dirty || busy || needModel} onClick={() => void save()}>
              {busy ? "保存中…" : "保存"}
            </button>
          </>
        }
      >
        <div className="stack">
          <div className="form-grid">{common.filter((key) => SETTING_META[key]?.kind !== "textarea").map(render)}</div>
          {common.filter((key) => SETTING_META[key]?.kind === "textarea").map(render)}
          {hasAnalysis && (
            <Advanced open={options.data ? isStale(options.data, provider, model) : false}>
              {asyncGate(options, { compact: true }) ??
                (options.data && (
                  <AnalysisModel
                    options={options.data}
                    provider={provider}
                    model={model}
                    needModel={needModel}
                    onChange={(nextProvider, nextModel) => setForm((prev) => ({ ...prev, [ANALYSIS_PROVIDER]: nextProvider, [ANALYSIS_MODEL]: nextModel }))}
                  />
                ))}
            </Advanced>
          )}
        </div>
      </Card>
      <LeaveGuard when={dirty} />
    </div>
  );
}

/** 能选的供应商：已启用且配好 Key */
function usable(options: ModelOptions, name: string) {
  return options.providers.find((one) => one.name === name && one.enabled && one.ready);
}

function isStale(options: ModelOptions, provider: string, model: string): boolean {
  if (!provider) return Boolean(model);
  const row = usable(options, provider);
  return !row || (Boolean(model) && !row.models.some((one) => one.id === model));
}

/** 和讲解员页一样的两级下拉。库里的值不在列表里时原样显示并标「已失效」，只有用户另选才会变 */
function AnalysisModel({
  options,
  provider,
  model,
  needModel,
  onChange,
}: {
  options: ModelOptions;
  provider: string;
  model: string;
  needModel: boolean;
  onChange: (provider: string, model: string) => void;
}) {
  const row = usable(options, provider);
  const staleProvider = Boolean(provider) && !row;
  const staleModel = Boolean(model) && !row?.models.some((one) => one.id === model);
  const enabled = options.providers.filter((one) => one.enabled && !(staleProvider && one.name === provider));

  function pickProvider(next: string) {
    const target = usable(options, next);
    onChange(next, target?.models.length === 1 ? target.models[0].id : "");
  }

  return (
    <div className="stack">
      <div className="form-grid">
        <Field label="分析模型供应商">
          <select className="select" value={provider} onChange={(e) => pickProvider(e.target.value)}>
            <option value="">沿用讲解员已发布的模型</option>
            {staleProvider && <option value={provider}>{provider}（已失效）</option>}
            {enabled.map((one) => (
              <option key={one.name} value={one.name} disabled={!one.ready}>
                {one.displayName || one.name}
                {one.ready ? "" : "（缺 Key）"}
              </option>
            ))}
          </select>
        </Field>
        {(provider || model) && (
          <Field label="分析模型" error={needModel ? "请选择模型" : undefined}>
            <select className="select" value={model} disabled={!row} onChange={(e) => onChange(provider, e.target.value)}>
              {!model && <option value="">请选择</option>}
              {staleModel && <option value={model}>{model}（已失效）</option>}
              {row?.models.map((one) => (
                <option key={one.id} value={one.id}>
                  {one.name && one.name !== one.id ? `${one.name}（${one.id}）` : one.id}
                </option>
              ))}
            </select>
          </Field>
        )}
      </div>
      {(staleProvider || staleModel) && (
        <p className="muted analysis-stale">
          <span className="pill pill--warn">已失效</span>
          这个值不在已配置的供应商和模型里。原样保留，另选才会改动。
        </p>
      )}
    </div>
  );
}
