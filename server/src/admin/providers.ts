// 模型供应商：校验、密钥解析、连通性测试、模型列表拉取。
// 对应 pi 的 models.json 自定义 provider（baseUrl + apiKey + models[]），
// 只是把配置搬进数据库，运行时通过 ModelRegistry.registerProvider 注入。
import type { Provider } from "@prisma/client";
import { prisma } from "../db.ts";
import { decryptSecret } from "../lib/secrets.ts";

/** 允许的接口类型，和 pi 的 provider api 取值对齐 */
export const API_KINDS = ["openai-completions", "openai-responses", "anthropic-messages", "google-generative-ai"] as const;
export type ApiKind = (typeof API_KINDS)[number];

/** P1：1–40 位，小写字母、数字、`.`、`_`、`-`，字母或数字开头 */
export const PROVIDER_NAME_RE = /^[a-z0-9][a-z0-9._-]{0,39}$/;
/** 环境变量名：字母或下划线开头 */
export const ENV_NAME_RE = /^[A-Za-z_][A-Za-z0-9_]*$/;
/** pi 把 `!` 开头的 apiKey 当 shell 命令执行，把全大写值当环境变量名取；这两种都不许当 literal 存 */
const SHELL_COMMAND_PREFIX = "!";
const ENV_SHAPED_KEY_RE = /^[A-Z][A-Z0-9_]*$/;
/** 服务端自己的机密变量，不能拿来当供应商的 Key 来源 */
const RESERVED_ENV_NAMES = new Set(["DATABASE_URL", "SECRETS_KEY", "SHOP_JWT_SECRET", "ADMIN_JWT_SECRET"]);

const MAX_COMPAT_BYTES = 4096;
const MAX_DISPLAY_NAME = 80;
const MAX_MODEL_ID = 200;

export interface ModelSpec {
  id: string;
  name: string;
  contextWindow: number;
  maxTokens: number;
  reasoning: boolean;
  input: ("text" | "image")[];
  compat?: Record<string, unknown>;
}

export type Validated<T> = { ok: true; value: T } | { ok: false; code: string; message: string; field?: string };

function bad(code: string, message: string, field?: string): { ok: false; code: string; message: string; field?: string } {
  return { ok: false, code, message, ...(field ? { field } : {}) };
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** 只认正整数；JSON 里的 "8192" / 1.5 / -1 / NaN 一律不合法 */
function isPositiveInt(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && Number.isInteger(value) && value > 0;
}

/** modelsJson 是库里的字符串，脏数据不能把只读接口变成 500 */
export function parseModelsJson(raw: string | null | undefined): unknown[] {
  try {
    const parsed = JSON.parse(raw || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/** 缺省的模型参数：第三方模型常常只给 id，这里补安全默认值，避免运行时 NaN。
 *  只用于「已经落库的数据」，写入前请走 validateModels。 */
export function normaliseModels(raw: unknown): ModelSpec[] {
  const list = Array.isArray(raw) ? raw : [];
  return list
    .map((one: any) => {
      const spec: ModelSpec = {
        id: String(one?.id ?? "").trim(),
        name: String(one?.name ?? one?.id ?? "").trim(),
        contextWindow: Number(one?.contextWindow ?? 128000) || 128000,
        maxTokens: Number(one?.maxTokens ?? 8192) || 8192,
        reasoning: Boolean(one?.reasoning ?? false),
        input: (Array.isArray(one?.input) && one.input.length > 0 ? one.input : ["text"]) as ("text" | "image")[],
      };
      if (isPlainObject(one?.compat)) spec.compat = one.compat;
      return spec;
    })
    .filter((m) => m.id.length > 0);
}

/** 写入前的严格校验：形状、正整数、输入类型、id 去重、compat 体积 */
export function validateModels(raw: unknown): Validated<ModelSpec[]> {
  if (!Array.isArray(raw)) return bad("INVALID_MODELS", "models 必须是数组。", "models");
  const models: ModelSpec[] = [];
  const seen = new Set<string>();
  for (const one of raw) {
    if (!isPlainObject(one)) return bad("INVALID_MODELS", "每个模型都必须是一个对象。", "models");
    const id = typeof one.id === "string" ? one.id.trim() : "";
    if (!id) return bad("INVALID_MODELS", "每个模型都要有 id。", "models");
    if (id.length > MAX_MODEL_ID) return bad("INVALID_MODELS", "模型 id 太长。", "models");
    if (seen.has(id)) return bad("INVALID_MODELS", `模型 id 重复：${id}。`, "models");
    seen.add(id);

    if (one.name !== undefined && one.name !== null && typeof one.name !== "string") {
      return bad("INVALID_MODELS", `模型 ${id} 的显示名必须是字符串。`, "models");
    }
    const name = typeof one.name === "string" && one.name.trim() ? one.name.trim() : id;

    if (one.contextWindow !== undefined && one.contextWindow !== null && !isPositiveInt(one.contextWindow)) {
      return bad("INVALID_MODELS", `模型 ${id} 的上下文长度必须是正整数。`, "models");
    }
    if (one.maxTokens !== undefined && one.maxTokens !== null && !isPositiveInt(one.maxTokens)) {
      return bad("INVALID_MODELS", `模型 ${id} 的最大输出必须是正整数。`, "models");
    }
    if (one.reasoning !== undefined && typeof one.reasoning !== "boolean") {
      return bad("INVALID_MODELS", `模型 ${id} 的推理开关必须是布尔值。`, "models");
    }

    let input: ("text" | "image")[] = ["text"];
    if (one.input !== undefined && one.input !== null) {
      if (!Array.isArray(one.input) || one.input.length === 0) {
        return bad("INVALID_MODELS", `模型 ${id} 的输入类型必须是非空数组。`, "models");
      }
      for (const kind of one.input) {
        if (kind !== "text" && kind !== "image") {
          return bad("INVALID_MODELS", `模型 ${id} 的输入类型只能是 text 或 image。`, "models");
        }
      }
      input = Array.from(new Set(one.input as ("text" | "image")[]));
    }

    const spec: ModelSpec = {
      id,
      name,
      contextWindow: isPositiveInt(one.contextWindow) ? one.contextWindow : 128000,
      maxTokens: isPositiveInt(one.maxTokens) ? one.maxTokens : 8192,
      reasoning: one.reasoning === true,
      input,
    };
    if (one.compat !== undefined && one.compat !== null) {
      if (!isPlainObject(one.compat)) return bad("INVALID_MODELS", `模型 ${id} 的 compat 必须是对象。`, "models");
      if (Buffer.byteLength(JSON.stringify(one.compat), "utf8") > MAX_COMPAT_BYTES) {
        return bad("INVALID_MODELS", `模型 ${id} 的 compat 太大了。`, "models");
      }
      spec.compat = one.compat;
    }
    models.push(spec);
  }
  return { ok: true, value: models };
}

/** 列表/详情视图：永远不含 Key 明文，只给 hasKey / ready */
export function publicView(provider: Provider) {
  const models = normaliseModels(parseModelsJson(provider.modelsJson));
  return {
    id: provider.id,
    name: provider.name,
    displayName: provider.displayName ?? null,
    baseUrl: provider.baseUrl,
    api: provider.api,
    keyMode: provider.keyMode,
    apiKeyEnv: provider.apiKeyEnv,
    hasKey: Boolean(provider.apiKeyEnc || provider.apiKeyEnv),
    ready: providerReady(provider),
    models,
    enabled: provider.enabled,
    lastTestAt: provider.lastTestAt?.getTime() ?? null,
    lastTestOk: provider.lastTestOk,
    lastTestError: provider.lastTestError,
  };
}

/** 解出来的值可能是 pi 的「命令」写法，这种值我们既不会执行也不该当成可用 Key */
export function usableApiKey(value: string | null | undefined): string | null {
  const key = String(value ?? "").trim();
  if (!key) return null;
  if (key.startsWith(SHELL_COMMAND_PREFIX)) return null;
  return key;
}

export function resolveApiKey(provider: Provider): string | null {
  if (provider.keyMode === "env") {
    return provider.apiKeyEnv ? usableApiKey(process.env[provider.apiKeyEnv]) : null;
  }
  return usableApiKey(provider.apiKeyEnc ? decryptSecret(provider.apiKeyEnc) : null);
}

/** ready：env 模式下变量非空，literal 模式下能解出值 */
export function providerReady(provider: Provider): boolean {
  return resolveApiKey(provider) !== null;
}

/** 上游错误里偶尔会回显请求头，任何对外文案都过一遍：把 Key 值换成 *** */
export function scrubKey(text: string, apiKey?: string | null): string {
  let out = String(text ?? "");
  const key = String(apiKey ?? "").trim();
  if (key.length >= 3) out = out.split(key).join("***");
  return out;
}

// ── 字段校验（POST / PATCH / 试连 / 导入共用）────────────────

export function validateProviderName(raw: unknown): Validated<string> {
  // 先判类型再 trim：对象/数组 String() 出来是 "[object Object]"，不能当名字用
  if (typeof raw !== "string") return bad("INVALID_NAME", "供应商名称必须是字符串。", "name");
  const name = raw.trim();
  if (!name) return bad("INVALID_NAME", "供应商名称不能为空。", "name");
  if (!PROVIDER_NAME_RE.test(name)) {
    return bad("INVALID_NAME", "名称要 1–40 位，只能用小写字母、数字、. _ -，并以字母或数字开头。", "name");
  }
  return { ok: true, value: name };
}

export function validateDisplayName(raw: unknown): Validated<string | null> {
  if (raw === undefined || raw === null) return { ok: true, value: null };
  if (typeof raw !== "string") return bad("INVALID_NAME", "显示名必须是字符串。", "displayName");
  const text = raw.trim();
  if (text.length > MAX_DISPLAY_NAME) return bad("INVALID_NAME", `显示名最多 ${MAX_DISPLAY_NAME} 字。`, "displayName");
  return { ok: true, value: text || null };
}

export function validateBaseUrl(raw: unknown): Validated<string> {
  if (typeof raw !== "string") return bad("INVALID_URL", "baseUrl 必须是字符串。", "baseUrl");
  const baseUrl = raw.trim();
  if (!baseUrl) return bad("INVALID_URL", "baseUrl 不能为空。", "baseUrl");
  if (baseUrl.length > 500) return bad("INVALID_URL", "baseUrl 太长。", "baseUrl");
  let url: URL;
  try {
    url = new URL(baseUrl);
  } catch {
    return bad("INVALID_URL", "baseUrl 必须是合法的 http/https 地址。", "baseUrl");
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return bad("INVALID_URL", "baseUrl 只能是 http 或 https。", "baseUrl");
  }
  if (url.username || url.password) {
    return bad("INVALID_URL", "baseUrl 里不能带用户名或密码。", "baseUrl");
  }
  return { ok: true, value: baseUrl };
}

export function validateApi(raw: unknown): Validated<ApiKind> {
  if (raw === undefined || raw === null || raw === "") return { ok: true, value: "openai-completions" };
  if (typeof raw !== "string") return bad("INVALID_API", "接口类型必须是字符串。", "api");
  const api = raw.trim();
  if (!(API_KINDS as readonly string[]).includes(api)) {
    return bad("INVALID_API", `接口类型只能是 ${API_KINDS.join("、")}。`, "api");
  }
  return { ok: true, value: api as ApiKind };
}

export function isReservedEnvName(name: string): boolean {
  const upper = name.trim().toUpperCase();
  return upper.startsWith("ADMIN_") || RESERVED_ENV_NAMES.has(upper);
}

export function validateEnvName(raw: unknown): Validated<string> {
  if (typeof raw !== "string") return bad("INVALID_KEY", "环境变量名必须是字符串。", "apiKeyEnv");
  const name = raw.trim();
  if (!name) return bad("INVALID_KEY", "环境变量名不能为空。", "apiKeyEnv");
  if (!ENV_NAME_RE.test(name)) {
    return bad("INVALID_KEY", "环境变量名只能包含字母、数字、下划线，且不能以数字开头。", "apiKeyEnv");
  }
  if (isReservedEnvName(name)) {
    return bad("INVALID_KEY", "这个环境变量属于服务端自己的机密，不能用作供应商 Key。", "apiKeyEnv");
  }
  return { ok: true, value: name };
}

/** literal Key：可见 ASCII 无空白，不能是 pi 的 `!命令` 写法，也不能是环境变量名形状 */
export function validateLiteralKey(raw: unknown): Validated<string> {
  if (typeof raw !== "string") return bad("INVALID_KEY", "Key 必须是字符串。", "apiKey");
  const key = raw.trim();
  if (!key) return bad("INVALID_KEY", "Key 不能为空。", "apiKey");
  if (key.length > 500) return bad("INVALID_KEY", "Key 太长。", "apiKey");
  if (key.startsWith(SHELL_COMMAND_PREFIX)) {
    return bad("INVALID_KEY", "Key 不能以 ! 开头。", "apiKey");
  }
  if (ENV_SHAPED_KEY_RE.test(key)) {
    return bad("INVALID_KEY", "这看起来是环境变量名，请选「环境变量」模式。", "apiKey");
  }
  // \x21-\x7e 排除空格、换行和其他控制字符：含空白的 Key 会让底层请求直接抛错并把值带进 message
  if (!/^[\x21-\x7e]+$/.test(key)) {
    return bad("INVALID_KEY", "Key 只能包含可见 ASCII 字符，不能有空格。", "apiKey");
  }
  return { ok: true, value: key };
}

// ── 连通性测试与模型列表 ────────────────────────────────

function trimBase(baseUrl: string): string {
  return baseUrl.replace(/\/+$/, "");
}

interface UpstreamRequest {
  url: string;
  headers: Record<string, string>;
  body: unknown;
}

/** 按接口类型拼一次最小请求；四种 api 的路径和鉴权头都不一样 */
function buildProbe(api: string, baseUrl: string, apiKey: string, model: string): UpstreamRequest {
  const base = trimBase(baseUrl);
  const json = { "content-type": "application/json" };
  switch (api) {
    case "openai-responses":
      return {
        url: `${base}/responses`,
        headers: { ...json, authorization: `Bearer ${apiKey}` },
        body: { model, input: "ping", max_output_tokens: 16 },
      };
    case "anthropic-messages":
      return {
        url: `${base}/v1/messages`,
        headers: { ...json, "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
        body: { model, max_tokens: 16, messages: [{ role: "user", content: "ping" }] },
      };
    case "google-generative-ai":
      return {
        url: `${base}/models/${encodeURIComponent(model)}:generateContent`,
        headers: { ...json, "x-goog-api-key": apiKey },
        body: { contents: [{ parts: [{ text: "ping" }] }], generationConfig: { maxOutputTokens: 16 } },
      };
    default:
      return {
        url: `${base}/chat/completions`,
        headers: { ...json, authorization: `Bearer ${apiKey}` },
        body: { model, messages: [{ role: "user", content: "ping" }], max_tokens: 1, stream: false },
      };
  }
}

/** 各 api 的模型列表端点与鉴权头 */
function buildModelListRequest(api: string, baseUrl: string, apiKey: string): { url: string; headers: Record<string, string> } {
  const base = trimBase(baseUrl);
  switch (api) {
    case "anthropic-messages":
      return { url: `${base}/v1/models`, headers: { "x-api-key": apiKey, "anthropic-version": "2023-06-01" } };
    case "google-generative-ai":
      return { url: `${base}/models`, headers: { "x-goog-api-key": apiKey } };
    default:
      return { url: `${base}/models`, headers: { authorization: `Bearer ${apiKey}` } };
  }
}

export interface TestResult {
  ok: boolean;
  latencyMs: number;
  model?: string;
  message: string;
  httpStatus?: number;
}

/**
 * 真发一次最小请求。失败原因要能区分「key 错」「模型名错」「网络不通」。
 * explicitKey：表单未保存时的明文 Key（只在内存里用一次，不落库、不回显）。
 * 所有对外文案都过 scrubKey，上游响应正文一律不回传。
 */
export async function testProvider(provider: Provider, modelId?: string, explicitKey?: string): Promise<TestResult> {
  const apiKey = usableApiKey(explicitKey) ?? resolveApiKey(provider);
  if (!apiKey) {
    return { ok: false, latencyMs: 0, message: "未配置 API Key（或环境变量为空）" };
  }
  const models = normaliseModels(parseModelsJson(provider.modelsJson));
  const model = modelId ?? models[0]?.id;
  if (!model) return { ok: false, latencyMs: 0, message: "该供应商下还没有配置模型" };

  const probe = buildProbe(provider.api, provider.baseUrl, apiKey, model);
  const started = Date.now();
  try {
    const response = await fetch(probe.url, {
      method: "POST",
      headers: probe.headers,
      body: JSON.stringify(probe.body),
      signal: AbortSignal.timeout(10_000),
    });
    const latencyMs = Date.now() - started;
    if (!response.ok) {
      const hint =
        response.status === 401 || response.status === 403
          ? "Key 无效或无权访问该模型"
          : response.status === 404
            ? "地址或模型名可能不对"
            : "上游返回错误";
      return {
        ok: false,
        latencyMs,
        message: scrubKey(`${hint}（HTTP ${response.status}）`, apiKey),
        httpStatus: response.status,
        model: scrubKey(model, apiKey),
      };
    }
    // 上游可能把请求头（含 Key）回显进 model 字段：对外只给脱敏后的值
    let echoed = scrubKey(model, apiKey);
    try {
      const body = (await response.json()) as any;
      if (typeof body?.model === "string" && body.model.trim()) echoed = scrubKey(body.model.trim(), apiKey);
    } catch {
      // 有的实现返回空体：HTTP 200 就算通
    }
    return { ok: true, latencyMs, model: echoed, message: "连通正常", httpStatus: response.status };
  } catch (error) {
    const latencyMs = Date.now() - started;
    const message = scrubKey(error instanceof Error ? error.message : String(error), apiKey);
    const timeout = /abort|timeout/i.test(message);
    return {
      ok: false,
      latencyMs,
      message: timeout ? "请求超时（10 秒），检查 baseUrl 与网络" : `请求失败：${message.slice(0, 120)}`,
    };
  }
}

export async function recordTest(providerId: string, result: TestResult) {
  await prisma.provider.update({
    where: { id: providerId },
    data: {
      lastTestAt: new Date(),
      lastTestOk: result.ok,
      lastTestError: result.ok ? null : result.message,
    },
  });
}

export async function fetchModelList(provider: Provider, explicitKey?: string): Promise<{ ok: boolean; models: string[]; message?: string }> {
  const apiKey = usableApiKey(explicitKey) ?? resolveApiKey(provider);
  if (!apiKey) return { ok: false, models: [], message: "未配置 API Key" };
  const request = buildModelListRequest(provider.api, provider.baseUrl, apiKey);
  try {
    const response = await fetch(request.url, { headers: request.headers, signal: AbortSignal.timeout(10_000) });
    if (!response.ok) {
      return { ok: false, models: [], message: scrubKey(`上游返回 HTTP ${response.status}`, apiKey) };
    }
    const body = (await response.json()) as any;
    const list: string[] = Array.isArray(body?.data)
      ? body.data.map((m: any) => String(m?.id ?? "")).filter(Boolean)
      : Array.isArray(body?.models)
        ? body.models.map((m: any) => String(m?.name ?? "").replace(/^models\//, "")).filter(Boolean)
        : [];
    // 上游可能把 Authorization 回显成模型 id；被脱敏改过的不是真模型，直接丢掉
    const safe = list
      .map((id) => ({ raw: id, clean: scrubKey(id, apiKey) }))
      .filter((one) => one.clean === one.raw && one.clean.trim())
      .map((one) => one.clean);
    return { ok: true, models: Array.from(new Set(safe)) };
  } catch (error) {
    const message = scrubKey(error instanceof Error ? error.message : String(error), apiKey);
    const timeout = /abort|timeout/i.test(message);
    return { ok: false, models: [], message: timeout ? "请求超时（10 秒），检查 baseUrl 与网络" : `请求失败：${message.slice(0, 120)}` };
  }
}

// ── 模型可选性 ────────────────────────────────────

export interface ModelRef {
  provider?: string;
  model?: string;
}

/** 取线上（published）版本的 provider/model；没有版本时为 null */
export async function currentPublishedModel(): Promise<ModelRef | null> {
  const published = await prisma.configVersion.findFirst({
    where: { status: "published" },
    orderBy: { publishedAt: "desc" },
  });
  if (!published) return null;
  try {
    const parsed = JSON.parse(published.modelJson) as unknown;
    if (!isPlainObject(parsed)) return null;
    const provider = typeof parsed.provider === "string" ? parsed.provider : undefined;
    const model = typeof parsed.model === "string" ? parsed.model : undefined;
    return { provider, model };
  } catch {
    return null;
  }
}

/**
 * 可选的模型 = 库内已启用供应商且模型在其列表里，
 * 或者和当前线上版本的 provider/model 完全相同（内置 pi 供应商只能保持原值）。
 */
export async function modelSelectable(model: ModelRef): Promise<boolean> {
  const name = typeof model?.provider === "string" ? model.provider.trim() : "";
  const modelId = typeof model?.model === "string" ? model.model.trim() : "";
  if (!name || !modelId) return false;
  const row = await prisma.provider.findUnique({ where: { name } });
  if (row && row.enabled) {
    const models = normaliseModels(parseModelsJson(row.modelsJson));
    if (models.some((one) => one.id === modelId)) return true;
  }
  const current = await currentPublishedModel();
  return Boolean(current && current.provider === name && current.model === modelId);
}
