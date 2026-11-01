// 讲解员的运行时配置：从"已发布版本"读提示词与模型；后台草稿可覆盖。
// 读不到库时回退代码内置提示词 + 环境变量模型，保证服务永远起得来。
import { prisma } from "../db.ts";
import { GUIDE_SYSTEM_PROMPT } from "../agent/prompts.ts";
import { decryptSecret } from "../lib/secrets.ts";
import { normaliseModels, usableApiKey } from "../admin/providers.ts";

export interface ProviderConfig {
  name: string;
  baseUrl: string;
  api: string;
  apiKey: string;
  models: ReturnType<typeof normaliseModels>;
}

export interface ActiveConfig {
  systemPrompt: string;
  provider: string;
  model: string;
  providerConfig: ProviderConfig | null;
  versionNo: number | null;
  /** 库里有没有已发布的配置版本；没有时前台讲解员一律提示暂不可用（后台试聊走 override，不受影响） */
  published: boolean;
}

const CACHE_MS = 10_000;
let cache: { at: number; value: ActiveConfig } | null = null;

export function invalidateConfigCache(): void {
  cache = null;
}

const ENV_DEFAULT: ActiveConfig = {
  systemPrompt: GUIDE_SYSTEM_PROMPT,
  provider: process.env.GUIDE_PROVIDER ?? "deepseek",
  model: process.env.GUIDE_MODEL ?? "deepseek-v4-flash",
  providerConfig: null,
  versionNo: null,
  published: false,
};

async function resolveProvider(name: string): Promise<ProviderConfig | null> {
  const row = await prisma.provider.findUnique({ where: { name } });
  if (!row || !row.enabled) return null;
  // modelsJson 只由 create/patch/import 写入，脏数据时回落空数组，别让读配置变成 500
  let models: ReturnType<typeof normaliseModels> = [];
  try {
    models = normaliseModels(JSON.parse(row.modelsJson || "[]"));
  } catch {
    models = [];
  }
  if (models.length === 0) return null;
  const rawKey =
    row.keyMode === "env"
      ? row.apiKeyEnv
        ? (process.env[row.apiKeyEnv] ?? "")
        : ""
      : row.apiKeyEnc
        ? (decryptSecret(row.apiKeyEnc) ?? "")
        : "";
  // pi 把 `!` 开头的 apiKey 当 shell 命令执行；库里存到这种值一律视为不可用（不执行）
  const apiKey = usableApiKey(rawKey);
  if (!apiKey) return null;
  return { name: row.name, baseUrl: row.baseUrl, api: row.api, apiKey, models };
}

export async function loadActiveConfig(): Promise<ActiveConfig> {
  if (cache && Date.now() - cache.at < CACHE_MS) return cache.value;
  let value = ENV_DEFAULT;
  try {
    const published = await prisma.configVersion.findFirst({
      where: { status: "published" },
      orderBy: { publishedAt: "desc" },
    });
    if (published) {
      const prompt = JSON.parse(published.promptJson) as { system?: string };
      const model = JSON.parse(published.modelJson) as { provider?: string; model?: string };
      const provider = model.provider || ENV_DEFAULT.provider;
      const modelId = model.model || ENV_DEFAULT.model;
      value = {
        systemPrompt: prompt.system?.trim() ? prompt.system : GUIDE_SYSTEM_PROMPT,
        provider,
        model: modelId,
        providerConfig: await resolveProvider(provider),
        versionNo: published.versionNo,
        published: true,
      };
    }
  } catch (error) {
    console.error("[runtime] 读取发布配置失败，回退内置默认值:", error);
    return ENV_DEFAULT;
  }
  cache = { at: Date.now(), value };
  return value;
}

/** 快速问答用：在当前已发布配置之上叠加草稿值（不落库、不影响访客） */
export async function withOverride(override?: {
  systemPrompt?: string;
  provider?: string;
  model?: string;
}): Promise<ActiveConfig> {
  const base = await loadActiveConfig();
  if (!override) return base;
  const provider = override.provider || base.provider;
  return {
    systemPrompt: override.systemPrompt?.trim() ? override.systemPrompt : base.systemPrompt,
    provider,
    model: override.model || base.model,
    providerConfig: provider === base.provider ? base.providerConfig : await resolveProvider(provider),
    versionNo: base.versionNo,
    published: base.published,
  };
}

/** 组装成 pi 的模型：自定义供应商先注册进 registry，再取模型 */
export async function projectModel(registry: any, active: ActiveConfig) {
  if (active.providerConfig) {
    const cfg = active.providerConfig;
    try {
      registry.registerProvider(cfg.name, {
        baseUrl: cfg.baseUrl,
        api: cfg.api,
        apiKey: cfg.apiKey,
        models: cfg.models.map((m) => ({
          id: m.id,
          name: m.name,
          api: cfg.api,
          reasoning: m.reasoning,
          input: m.input,
          cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
          contextWindow: m.contextWindow,
          maxTokens: m.maxTokens,
          // P2 的「高级」里配的 compat 要在运行时真的生效（pi 按 api 收窄成联合类型，这里放宽）
          ...(m.compat ? { compat: m.compat as any } : {}),
        })),
      });
    } catch (error) {
      console.error("[runtime] 注册供应商失败:", error);
    }
    const found = registry.find(cfg.name, active.model);
    if (found) return found;
    console.error(`[runtime] 供应商 ${cfg.name} 下没有模型 ${active.model}，回退`);
  }
  return registry.find(active.provider, active.model);
}
/** 讲解员总开关：后台"系统设置"里 guide.enabled=false 时直接拒绝，不消耗模型额度 */
let guideCache: { at: number; enabled: boolean } | null = null;

export async function isGuideEnabled(): Promise<boolean> {
  if (guideCache && Date.now() - guideCache.at < 10_000) return guideCache.enabled;
  // G4：配置缺失或读库出错一律按关闭处理——「没配置」不等于「对公网开放」
  let enabled = false;
  try {
    const row = await prisma.setting.findUnique({ where: { key: "guide.enabled" } });
    if (row) enabled = row.value !== "false";
  } catch {
    enabled = false;
  }
  guideCache = { at: Date.now(), enabled };
  return enabled;
}
