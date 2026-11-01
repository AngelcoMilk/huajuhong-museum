// 模型解析。
// 注意：pi-ai 的 getModel() 只认内置模型目录，models.json 里自定义的 provider
// （如 inception/mercury-3、fastmodel/*）必须通过 ModelRegistry.find() 取。
import { getModel } from "@mariozechner/pi-ai";
import type { ModelRegistry } from "@mariozechner/pi-coding-agent";

const provider = process.env.GUIDE_PROVIDER ?? "inception";
const modelId = process.env.GUIDE_MODEL ?? "mercury-3";

export const MODEL = { provider, model: modelId };

const FALLBACK = { provider: "deepseek", model: "deepseek-v4-flash" } as const;

/** 优先取 models.json 里的配置（含自定义 provider），取不到再回退内置目录 */
export function resolveModelFrom(registry: ModelRegistry): never {
  const configured = registry.find(provider, modelId);
  if (configured) return configured as never;

  const fallback =
    registry.find(FALLBACK.provider, FALLBACK.model) ?? getModel(FALLBACK.provider, FALLBACK.model);
  if (fallback) {
    console.warn("[guide] 模型 " + provider + "/" + modelId + " 不在模型表中，回退到 " + FALLBACK.provider + "/" + FALLBACK.model);
    return fallback as never;
  }
  throw new Error("模型 " + provider + "/" + modelId + " 不可用，且回退模型也不可用");
}
