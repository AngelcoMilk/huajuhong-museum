// 讲解员配置版本：列表 / 单条 / 发布与回滚。
// 回滚 = 对已归档的历史版本再发一次（POST /config/publish {versionId}），
// 成功后该版本变 published、原 published 归档；动作记 config.rollback（发草稿仍记 config.publish）。
import type { Context } from "hono";
import { prisma } from "../db.ts";
import { audit } from "./audit.ts";
import { invalidateConfigCache } from "../runtime/config.ts";
import { modelSelectable, recordTest, testProvider } from "./providers.ts";
import { withConfigLock } from "./config-lock.ts";

function fail(c: Context, status: 400 | 404 | 409, code: string, message: string, field?: string) {
  return c.json({ error: { code, message, ...(field ? { field } : {}) } }, status);
}

/** 统一视图：prompt / model 返回解析后的对象（前端算两版差异用全文） */
function versionView(version: any) {
  return {
    id: version.id,
    versionNo: version.versionNo,
    status: version.status,
    note: version.note,
    prompt: JSON.parse(version.promptJson),
    model: JSON.parse(version.modelJson),
    createdAt: version.createdAt.getTime(),
    publishedAt: version.publishedAt?.getTime() ?? null,
    publishedBy: version.publishedBy ?? null,
  };
}

export function registerConfigVersions(app: any) {
  // ── 列表（旧接口，补 prompt 与 publishedBy）──────────
  app.get("/config/versions", async (c) => {
    const rows = await prisma.configVersion.findMany({ orderBy: { versionNo: "desc" }, take: 50 });
    return c.json(rows.map(versionView));
  });

  // ── 单条：形状与列表项一致 ──────────────────────────
  app.get("/config/versions/:id", async (c) => {
    const version = await prisma.configVersion.findUnique({ where: { id: c.req.param("id") } });
    if (!version) return fail(c, 404, "VERSION_NOT_FOUND", "没有找到这一版配置。");
    return c.json(versionView(version));
  });

  // ── 发布 / 回滚 ─────────────────────────────────────
  app.post("/config/publish", async (c) => {
    const body = (await c.req.json().catch(() => ({}))) as any;
    const id = String(body?.versionId ?? "");
    const target = id
      ? await prisma.configVersion.findUnique({ where: { id } })
      : await prisma.configVersion.findFirst({ where: { status: "draft" }, orderBy: { createdAt: "desc" } });
    if (!target) return fail(c, 404, "VERSION_NOT_FOUND", "没有可发布的版本。");

    const model = JSON.parse(target.modelJson) as { provider?: string; model?: string };
    // 发布草稿时模型必须是可选的（库内已启用供应商 + 它的模型，或线上原值）；
    // 回滚历史版本不受此限制，但仍走下面的发布前检查。
    if (target.status === "draft" && !(await modelSelectable(model))) {
      return fail(c, 400, "MODEL_NOT_SELECTABLE", "这一版用的模型已经不在可选的供应商列表里，先在「讲解员」里换一个模型再发布。", "model");
    }
    const provider = model.provider ? await prisma.provider.findUnique({ where: { name: model.provider } }) : null;
    let testNote = "内置模型，跳过连通性测试";
    if (!provider) {
      try {
        const { AuthStorage, ModelRegistry, getAgentDir } = await import("@mariozechner/pi-coding-agent");
        const { join } = await import("node:path");
        const agentDir = getAgentDir();
        const registry = ModelRegistry.create(
          AuthStorage.create(join(agentDir, "auth.json")),
          join(agentDir, "models.json"),
        );
        const found = registry.find(model.provider ?? "", model.model ?? "");
        if (!found) {
          return fail(c, 409, "PROVIDER_TEST_FAILED", `发布被阻止：模型表中没有 ${model.provider}/${model.model}。`, "model");
        }
        if (!registry.hasConfiguredAuth(found)) {
          return fail(
            c,
            409,
            "PROVIDER_TEST_FAILED",
            `发布被阻止：内置供应商 ${model.provider} 未配置凭证，讲解员会不可用。`,
            "model",
          );
        }
        testNote = "内置模型，凭证已就绪";
      } catch (error) {
        console.error("[admin] 内置模型检查失败:", error);
      }
    } else {
      const result = await testProvider(provider, model.model);
      await recordTest(provider.id, result);
      if (!result.ok) {
        return fail(c, 409, "PROVIDER_TEST_FAILED", `发布被阻止：供应商连通性测试未通过（${result.message}）。`, "model");
      }
      testNote = `连通正常（${result.latencyMs}ms）`;
    }

    const username = c.get("admin").username as string;
    // 目标版本已是归档历史版 → 这是回滚；否则是发布草稿
    const isRollback = target.status === "archived";
    // 连通性测试要几秒，这期间草稿或供应商可能被改：进锁后重新确认，发布的必须是刚才校验过的那一份
    return withConfigLock(async () => {
      const fresh = await prisma.configVersion.findUnique({ where: { id: target.id } });
      if (!fresh || fresh.status !== target.status || fresh.promptJson !== target.promptJson || fresh.modelJson !== target.modelJson) {
        return fail(c, 409, "VERSION_CHANGED", "这一版在发布过程中被改过或已经发布，请确认后重新发布。");
      }
      if (target.status === "draft" && !(await modelSelectable(model))) {
        return fail(c, 400, "MODEL_NOT_SELECTABLE", "这一版用的模型已经不在可选的供应商列表里，先在「讲解员」里换一个模型再发布。", "model");
      }
      if (provider) {
        const now = await prisma.provider.findUnique({ where: { id: provider.id } });
        const sameConnection =
          now &&
          now.name === provider.name &&
          now.baseUrl === provider.baseUrl &&
          now.api === provider.api &&
          now.keyMode === provider.keyMode &&
          now.apiKeyEnc === provider.apiKeyEnc &&
          now.apiKeyEnv === provider.apiKeyEnv;
        if (!sameConnection || (provider.enabled && !now.enabled)) {
          return fail(c, 409, "PROVIDER_TEST_FAILED", `发布被阻止：供应商 ${provider.name} 在发布过程中被停用或修改，刚才的连通性测试已经不作数，请重新发布。`, "model");
        }
      }
      const published = await prisma.$transaction(async (tx) => {
        await tx.configVersion.updateMany({ where: { status: "published" }, data: { status: "archived" } });
        return tx.configVersion.update({
          where: { id: target.id },
          data: { status: "published", publishedAt: new Date(), publishedBy: username },
        });
      });
      invalidateConfigCache();
      audit({
        actor: username,
        action: isRollback ? "config.rollback" : "config.publish",
        target: published.id,
        detail: { versionNo: published.versionNo, from: target.status, ...model },
      });
      return c.json({ ...publishedView(published), note: testNote });
    });
  });
}

function publishedView(version: any) {
  return {
    id: version.id,
    versionNo: version.versionNo,
    status: version.status,
    publishedBy: version.publishedBy ?? null,
    publishedAt: version.publishedAt?.getTime() ?? null,
  };
}
