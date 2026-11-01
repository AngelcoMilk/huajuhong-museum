// 从 pi 的 models.json 读取供应商（只读，不写任何东西），并按勾选导入到库里。
// 安全边界：pi 文件里可能有 Key 明文 —— 这个模块只在内存里用一次，
// 响应里永远只给 keyKind / hasKey，审计只记名字，日志不打印文件内容。
import type { Context } from "hono";
import { readFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import { prisma } from "../db.ts";
import { audit } from "./audit.ts";
import { withConfigLock } from "./config-lock.ts";
import { encryptSecret } from "../lib/secrets.ts";
import { invalidateConfigCache } from "../runtime/config.ts";
import {
  API_KINDS,
  PROVIDER_NAME_RE,
  normaliseModels,
  parseModelsJson,
  validateBaseUrl,
  validateEnvName,
  validateLiteralKey,
  validateModels,
  type ModelSpec,
} from "./providers.ts";

const MAX_IMPORT = 100;

export type KeyKind = "env" | "literal" | "none";

interface PiProvider {
  name: string;
  displayName: string;
  baseUrl: string;
  api: string;
  models: unknown[];
  keyKind: KeyKind;
  /** 只在内存里短暂存在，绝不进响应 / 日志 / 审计 */
  apiKey: string | null;
}

export function piModelsPath(): string {
  const override = (process.env.PI_MODELS_PATH ?? "").trim();
  if (override) return override;
  return join(homedir(), ".pi", "agent", "models.json");
}

/** 和 pi 的 model-registry 一致：去掉 // 行注释和尾逗号，字符串字面量原样保留 */
function stripJsonComments(input: string): string {
  return input
    .replace(/"(?:\\.|[^"\\])*"|\/\/[^\n]*/g, (m) => (m[0] === '"' ? m : ""))
    .replace(/"(?:\\.|[^"\\])*"|,(\s*[}\]])/g, (m, tail) => tail ?? (m[0] === '"' ? m : ""));
}

/** pi 的 apiKey 写法分类：!命令不执行、全大写当环境变量名、其余当明文 */
export function classifyPiKey(raw: unknown): { kind: KeyKind; value: string | null } {
  if (typeof raw !== "string") return { kind: "none", value: null };
  const value = raw.trim();
  if (!value) return { kind: "none", value: null };
  if (value.startsWith("!")) return { kind: "none", value: null };
  if (/^[A-Z][A-Z0-9_]*$/.test(value)) return { kind: "env", value };
  return { kind: "literal", value };
}

function asObject(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null && !Array.isArray(value) ? (value as Record<string, unknown>) : null;
}

type LoadResult = { ok: true; found: boolean; providers: PiProvider[] } | { ok: false };

/**
 * 读 pi 配置。文件不存在 → found:false（不是错误）；解析失败 → ok:false，
 * 对外只报固定文案（JSON.parse 的原始报错会带文件片段，可能含 Key）。
 */
export async function loadPiConfig(): Promise<LoadResult> {
  let content: string;
  try {
    content = await readFile(piModelsPath(), "utf8");
  } catch (error) {
    if ((error as { code?: string }).code === "ENOENT") return { ok: true, found: false, providers: [] };
    console.error("[admin] 读取 pi models.json 失败:", (error as Error).message);
    return { ok: false };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(stripJsonComments(content));
  } catch {
    return { ok: false };
  }

  const root = asObject(parsed);
  const providersRaw = root ? asObject(root.providers) : null;
  if (!providersRaw) return { ok: true, found: true, providers: [] };

  const providers: PiProvider[] = [];
  for (const [name, raw] of Object.entries(providersRaw)) {
    const config = asObject(raw);
    if (!config) continue;
    const key = classifyPiKey(config.apiKey);
    providers.push({
      name,
      displayName: typeof config.name === "string" && config.name.trim() ? config.name.trim() : name,
      baseUrl: typeof config.baseUrl === "string" ? config.baseUrl.trim() : "",
      api: typeof config.api === "string" && config.api.trim() ? config.api.trim() : "openai-completions",
      models: Array.isArray(config.models) ? config.models : [],
      keyKind: key.kind,
      apiKey: key.value,
    });
  }
  return { ok: true, found: true, providers };
}

function piConfigInvalid(c: Context) {
  return c.json(
    {
      error: {
        code: "PI_CONFIG_INVALID",
        message: "pi 的 models.json 解析不了（可能不是合法 JSON）。请先修好该文件再导入。",
      },
    },
    400,
  );
}

/** pi 的模型条目可能带 cost / thinkingLevelMap 等我们的字段之外的键，只取我们要的 */
function modelsFromPi(raw: unknown[]): ModelSpec[] {
  const strict = validateModels(raw);
  if (strict.ok) return strict.value;
  // 个别条目不合法时退回宽容解析，至少把能认的模型导进来（全部不合格则返回空）
  return normaliseModels(raw);
}

/** GET /providers/pi-config */
export function registerPiProviders(app: any) {
  app.get("/providers/pi-config", async (c: Context) => {
    const loaded = await loadPiConfig();
    if (!loaded.ok) return piConfigInvalid(c);

    const names = loaded.providers.map((one) => one.name);
    const existing = names.length
      ? await prisma.provider.findMany({ where: { name: { in: names } }, select: { name: true } })
      : [];
    const known = new Set(existing.map((row) => row.name));

    return c.json({
      path: piModelsPath(),
      found: loaded.found,
      providers: loaded.providers.map((one) => ({
        name: one.name,
        displayName: one.displayName,
        baseUrl: one.baseUrl,
        api: one.api,
        modelCount: one.models.length,
        hasKey: one.keyKind !== "none",
        keyKind: one.keyKind,
        exists: known.has(one.name),
      })),
    });
  });

  // POST /providers/import-pi
  app.post("/providers/import-pi", async (c: Context) => {
    const body = (await c.req.json().catch(() => ({}))) as any;
    const names = body?.names;
    const onConflict = body?.onConflict === "overwrite" ? "overwrite" : body?.onConflict === "skip" ? "skip" : null;
    if (!Array.isArray(names) || names.length === 0 || names.length > MAX_IMPORT) {
      return c.json({ error: { code: "BAD_REQUEST", message: `names 必须是 1–${MAX_IMPORT} 个供应商名。`, field: "names" } }, 400);
    }
    if (!onConflict) {
      return c.json({ error: { code: "BAD_REQUEST", message: "onConflict 只能是 skip 或 overwrite。", field: "onConflict" } }, 400);
    }
    // 去重：同一个名字传两次会让「第二次」看到循环前的旧快照，出现既 imported 又 skipped
    const wanted = Array.from(
      new Set(names.filter((one): one is string => typeof one === "string").map((one) => one.trim()).filter(Boolean)),
    );

    const loaded = await loadPiConfig();
    if (!loaded.ok) return piConfigInvalid(c);

    const byName = new Map(loaded.providers.map((one) => [one.name, one]));
    // 覆盖可能拿掉模型：线上引用的检查和写库要连着做
    return withConfigLock(async () => {
    const existingRows = await prisma.provider.findMany({ where: { name: { in: wanted } } });
    const existingByName = new Map(existingRows.map((row) => [row.name, row]));

    // 线上正在用的供应商/模型：覆盖时不能把它们弄没
    const published = await prisma.configVersion.findFirst({ where: { status: "published" }, orderBy: { publishedAt: "desc" } });
    let publishedModel: { provider?: string; model?: string } = {};
    if (published) {
      try {
        const parsed = JSON.parse(published.modelJson);
        if (parsed && typeof parsed === "object") publishedModel = parsed;
      } catch {
        publishedModel = {};
      }
    }

    const imported: string[] = [];
    const skipped: string[] = [];

    for (const name of wanted) {
      const found = byName.get(name);
      if (!found) {
        skipped.push(name);
        continue;
      }
      if (!PROVIDER_NAME_RE.test(name)) {
        skipped.push(name);
        continue;
      }
      const baseUrlCheck = validateBaseUrl(found.baseUrl);
      if (!baseUrlCheck.ok) {
        skipped.push(name);
        continue;
      }
      const baseUrl = baseUrlCheck.value;
      if (!(API_KINDS as readonly string[]).includes(found.api)) {
        skipped.push(name);
        continue;
      }
      const models = modelsFromPi(found.models);
      if (models.length === 0) {
        skipped.push(name);
        continue;
      }

      const existing = existingByName.get(name);
      if (existing && onConflict === "skip") {
        skipped.push(name);
        continue;
      }

      // pi 里的 Key 必须过和手工新建同一套校验，不合格按「没有 Key」处理：
      // env 尤其重要 —— 不能让 ADMIN_* / DATABASE_URL 这类服务端机密被当成供应商 Key 发给任意 baseUrl。
      const keyCheck =
        found.keyKind === "env"
          ? validateEnvName(found.apiKey ?? "")
          : found.keyKind === "literal"
            ? validateLiteralKey(found.apiKey ?? "")
            : null;
      const usableKey = keyCheck && keyCheck.ok ? keyCheck.value : null;
      // 没有可用的 Key 时不要留在这个模式上：keyMode 落回 literal、密钥字段留空，自然会进 needKey
      const keyMode = found.keyKind === "env" && usableKey ? "env" : "literal";

      const overwriteModels = existing ? modelsFromPi(parseModelsJson(existing.modelsJson)) : null;
      if (existing && publishedModel.provider === name) {
        const stillThere = models.some((one) => one.id === publishedModel.model);
        const wasThere = (overwriteModels ?? []).some((one) => one.id === publishedModel.model);
        if (wasThere && !stillThere) {
          skipped.push(name);
          continue;
        }
      }

      try {
        if (!existing) {
          await prisma.provider.create({
            data: {
              name,
              displayName: found.displayName === name ? null : found.displayName,
              baseUrl,
              api: found.api,
              keyMode,
              apiKeyEnv: keyMode === "env" ? usableKey : null,
              apiKeyEnc: keyMode === "literal" && usableKey ? encryptSecret(usableKey) : null,
              modelsJson: JSON.stringify(models),
              enabled: true,
            },
          });
        } else {
          const data: any = {
            displayName: found.displayName === name ? existing.displayName : found.displayName,
            baseUrl,
            api: found.api,
            modelsJson: JSON.stringify(models),
          };
          // pi 里有 Key 才换；没有就保留库里已有的
          if (usableKey) {
            data.keyMode = keyMode;
            data.apiKeyEnv = keyMode === "env" ? usableKey : null;
            data.apiKeyEnc = keyMode === "literal" ? encryptSecret(usableKey) : null;
          }
          await prisma.provider.update({ where: { name }, data });
        }
        imported.push(name);
      } catch (error) {
        // 唯一约束撞车（并发导入）等：算跳过，不要整批 500
        console.error("[admin] 导入供应商失败:", name, (error as { code?: string }).code ?? "");
        skipped.push(name);
      }
    }

    invalidateConfigCache();

    // needKey：导入后库里确实没有可用 Key 的那些
    const after = imported.length ? await prisma.provider.findMany({ where: { name: { in: imported } } }) : [];
    const needKey = after.filter((row) => !row.apiKeyEnc && !row.apiKeyEnv).map((row) => row.name);

    audit({
      actor: c.get("admin").username,
      action: "provider.import",
      target: imported.join(",") || "-",
      detail: { imported, skipped, onConflict },
    });

    return c.json({ imported, skipped, needKey });
    });
  });
}
