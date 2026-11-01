// 知识库接入位。现在只定义接口 + 空实现，接真数据时只换实现，不动 Agent 与路由。
import { existsSync } from "node:fs";
import { join } from "node:path";
import type { Citation } from "../contract.ts";

export interface KnowledgeHit {
  citation: Citation;
  /** 供模型阅读的片段正文 */
  snippet: string;
}

export interface KnowledgeProvider {
  readonly mode: string;
  search(query: string, limit?: number): Promise<KnowledgeHit[]>;
  read(id: string): Promise<{ citation: Citation; content: string } | null>;
}

/**
 * 未接入知识库时的实现：永远返回空。
 * 这样讲解员会如实回答「我这里没有资料」，而不是编造——符合人设要求。
 */
export class NullKnowledge implements KnowledgeProvider {
  readonly mode = "null";
  async search(): Promise<KnowledgeHit[]> {
    return [];
  }
  async read(): Promise<null> {
    return null;
  }
}

export const knowledge: KnowledgeProvider = new NullKnowledge();

/** 默认知识库位置，与 jsonProvider 保持一致 */
const DEFAULT_SLICES_PATH = join(import.meta.dirname, "..", "..", "kb", "slices.json");

/**
 * 按 GUIDE_KB 选择实现：
 *   空      → NullKnowledge（什么都不返回，讲解员会说"暂时没有资料"）
 *   sample  → 内置 5 条演示数据
 *   json    → 读切片文件 slices.json（路径由 GUIDE_KB_PATH 覆盖）
 */
export async function resolveKnowledge(): Promise<KnowledgeProvider> {
  const explicit = (process.env.GUIDE_KB ?? "").trim();
  // 没显式指定时：项目里放了 kb/slices.json 就用它，否则退回空知识库
  const mode = explicit || (existsSync(DEFAULT_SLICES_PATH) ? "json" : "null");

  if (mode === "sample") {
    const { SampleKnowledge } = await import("./sampleProvider.ts");
    return new SampleKnowledge();
  }

  if (mode === "json") {
    const { JsonKnowledge } = await import("./jsonProvider.ts");
    const path = (process.env.GUIDE_KB_PATH ?? "").trim() || DEFAULT_SLICES_PATH;
    const kb = new JsonKnowledge(path);
    console.log(`[guide] 知识库 json：${kb.summary()} ← ${path}`);

    const issues = kb.validate();
    if (issues.length > 0) {
      console.warn(`[guide] 校验发现 ${issues.length} 个问题（不影响启动），前 10 条：`);
      for (const issue of issues.slice(0, 10)) {
        console.warn(`  - ${issue.id} / ${issue.field}：${issue.problem}`);
      }
    }
    return kb;
  }

  return knowledge;
}
