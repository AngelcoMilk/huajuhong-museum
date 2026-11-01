// 分析用的模型：独立配置（Setting: analysis.provider / analysis.model），
// 缺省沿用已发布版本的模型。凭证优先取自定义供应商行，其次走 pi 的凭证表。
import { join } from "node:path";
import { AuthStorage, ModelRegistry, getAgentDir } from "@mariozechner/pi-coding-agent";
import type { Model } from "@mariozechner/pi-ai";
import { prisma } from "../db.ts";
import { decryptSecret } from "../lib/secrets.ts";
import { normaliseModels } from "../admin/providers.ts";
import { loadActiveConfig } from "../runtime/config.ts";

export interface AnalysisTarget {
  model: Model<any>;
  apiKey?: string;
  headers?: Record<string, string>;
  label: string;
}

export async function resolveAnalysisTarget(): Promise<AnalysisTarget | null> {
  const [providerSetting, modelSetting] = await Promise.all([
    prisma.setting.findUnique({ where: { key: "analysis.provider" } }),
    prisma.setting.findUnique({ where: { key: "analysis.model" } }),
  ]);
  const active = await loadActiveConfig();
  const providerName = providerSetting?.value || active.provider;
  const modelId = modelSetting?.value || active.model;

  // 自定义供应商：直接构造 Model，密钥从库里解
  const custom = await prisma.provider.findUnique({ where: { name: providerName } });
  if (custom && custom.enabled) {
    const models = normaliseModels(JSON.parse(custom.modelsJson || "[]"));
    const spec = models.find((m) => m.id === modelId) ?? models[0];
    if (!spec) return null;
    const apiKey =
      custom.keyMode === "env"
        ? custom.apiKeyEnv
          ? (process.env[custom.apiKeyEnv] ?? undefined)
          : undefined
        : custom.apiKeyEnc
          ? (decryptSecret(custom.apiKeyEnc) ?? undefined)
          : undefined;
    if (!apiKey) return null;
    return {
      model: {
        id: spec.id,
        name: spec.name,
        api: custom.api as any,
        provider: custom.name,
        baseUrl: custom.baseUrl,
        reasoning: spec.reasoning,
        input: spec.input,
        cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
        contextWindow: spec.contextWindow,
        maxTokens: spec.maxTokens,
      } as Model<any>,
      apiKey,
      label: `${custom.name}/${spec.id}`,
    };
  }

  // 内置供应商：走 pi 的模型表与凭证
  const agentDir = getAgentDir();
  const registry = ModelRegistry.create(
    AuthStorage.create(join(agentDir, "auth.json")),
    join(agentDir, "models.json"),
  );
  const model = registry.find(providerName, modelId);
  if (!model) return null;
  const auth = await registry.getApiKeyAndHeaders(model);
  if (!auth.ok) return null;
  return { model, apiKey: auth.apiKey, headers: auth.headers, label: `${providerName}/${modelId}` };
}
