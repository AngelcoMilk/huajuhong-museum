// 示例知识库：只为演示「引用自 …」的契约，不是真实资料。
// 开启方式：GUIDE_KB=sample npm run dev
// 接真实知识库时删掉这个文件即可，接口与 Agent 都不用改。
import type { Citation } from "../contract.ts";
import type { KnowledgeHit, KnowledgeProvider } from "./provider.ts";

interface Doc {
  id: string;
  title: string;
  keywords: string[];
  /** 原文出处；留空表示只有知识库、没有具体典籍 */
  origin?: string;
  content: string;
}

const DOCS: Doc[] = [
  {
    id: "doc-qizhua",
    title: "七爪橘红",
    keywords: ["七爪", "割七刀", "七刀", "对折"],
    origin: "《中国药典》1963年版一部「橘红」条",
    content:
      "取成熟果，用刀割成七瓣，去瓤，对折压扁，晒干或烘干，十片一扎。片面呈七爪状，色黄褐，质硬而脆。",
  },
  {
    id: "doc-wuzhua",
    title: "大五爪",
    keywords: ["五爪", "大五爪", "割五刀", "瓣尖"],
    origin: "《化州县志·物产》",
    content: "割五刀成五瓣，瓣尖向内折，片形较大，出果率高于七爪，焙干后十片一扎。",
  },
  {
    id: "doc-tai",
    title: "橘红胎",
    keywords: ["橘红胎", "幼果", "整果"],
    origin: "馆藏工艺档案",
    content: "取未成熟幼果，一半烫、一半直接烘，连烘数日，整果入药，味厚力峻。",
  },
  {
    id: "doc-origin-place",
    title: "化州产地",
    keywords: ["化州", "产地", "橘红产地", "南方人参"],
    content: "化橘红为广东化州特产，因产地土壤含礞石而气味独厚，素有「南方人参」之称。",
  },
  {
    id: "doc-tangguo",
    title: "烫果",
    keywords: ["烫果", "杀青", "沸水"],
    origin: "馆藏工艺档案",
    content: "鲜果入沸水略烫，取出沥干，使果皮转软、便于下刀，同时固定色泽。",
  },
];

function toHit(doc: Doc): KnowledgeHit {
  return {
    citation: {
      id: doc.id,
      title: doc.title,
      source: "知识库",
      ...(doc.origin ? { origin: doc.origin } : {}),
    },
    snippet: doc.content,
  };
}

export class SampleKnowledge implements KnowledgeProvider {
  readonly mode = "sample";

  async search(query: string, limit = 3): Promise<KnowledgeHit[]> {
    const text = query.trim();
    if (!text) return [];
    const scored = DOCS.map((doc) => {
      const hits = doc.keywords.filter((kw) => text.includes(kw)).length;
      return { doc, hits };
    })
      .filter((item) => item.hits > 0)
      .sort((a, b) => b.hits - a.hits)
      .slice(0, Math.max(1, limit));
    return scored.map((item) => toHit(item.doc));
  }

  async read(id: string): Promise<{ citation: Citation; content: string } | null> {
    const doc = DOCS.find((item) => item.id === id);
    if (!doc) return null;
    return { citation: toHit(doc).citation, content: doc.content };
  }
}
