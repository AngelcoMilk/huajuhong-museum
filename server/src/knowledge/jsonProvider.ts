// 知识库：读 slices.json → 可检索的切片。
//
// 设计约束：
// 1. content 是给模型念的原文，origin 是给访客看的出处，两者都不许出现内部痕迹。
// 2. 宁缺毋滥：无关查询必须返回空数组，绝不塞"相关内容"凑数。
// 3. 一片一出处；同一事实只切一片（由上游保证，这里只做校验）。
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import type { Citation } from "../contract.ts";
import type { KnowledgeHit, KnowledgeProvider } from "./provider.ts";

/** 默认知识库位置：server/kb/slices.json（随项目走，不依赖外部路径） */
export const DEFAULT_SLICES_PATH = join(import.meta.dirname, "..", "..", "kb", "slices.json");

export interface SliceRecord {
  id: string;
  title: string;
  source?: string;
  origin?: string;
  url?: string;
  content: string;
}

export interface ValidationIssue {
  id: string;
  field: string;
  problem: string;
}

/** 虚词：主要由它们组成的二字词元权重压到很低，避免"是怎么"这类片段把无关内容拉进来 */
const STOP_CHARS = new Set(
  "的了是在和与或之其也就都而及等这那哪个些什么怎么如何为吗呢吧啊把被从对向于以所我你他她它们上下".split(""),
);

/** 内置同义组；若交付目录里有 synonyms.txt，会与它合并（文件优先） */
const DEFAULT_SYNONYMS: string[][] = [
  ["七爪", "七瓣", "割七刀", "七爪橘红"],
  ["大五爪", "五爪", "割五刀"],
  ["压果片", "压片", "切片"],
  ["橘红胎", "胎果", "幼果"],
  ["化橘红", "橘红", "毛橘红"],
  ["炮制", "加工", "制作", "工艺"],
  ["药典", "中国药典"],
  ["产地", "道地", "原产地"],
  ["非遗", "非物质文化遗产"],
];

// 中文 60 字已经能说清一件事；标准里建议 80–500，校验下限放到 60 免得误杀短典故
const CONTENT_MIN = 60;
const CONTENT_MAX = 500;
const TITLE_MAX = 20;

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[\s，。？！、；：,.!?;:~～"'“”‘’()（）【】\[\]《》<>·—\-_/\\]/g, "");
}

function isStopTerm(term: string): boolean {
  for (const ch of term) if (!STOP_CHARS.has(ch)) return false;
  return true;
}

interface Term {
  term: string;
  weight: number;
}

/** 查询 → 词元。中文取二字词元 + 完整片段，英文/数字取整词。 */
function tokenize(query: string): Term[] {
  const text = normalize(query);
  const terms = new Map<string, number>();

  const add = (term: string, weight: number) => {
    if (term.length < 2 && !/[a-z0-9]/.test(term)) return;
    const prev = terms.get(term) ?? 0;
    if (weight > prev) terms.set(term, weight);
  };

  const segments = text.match(/[\u4e00-\u9fa5]+|[a-z0-9]+/g) ?? [];
  for (const segment of segments) {
    if (/^[a-z0-9]+$/.test(segment)) {
      add(segment, 1.5);
      continue;
    }
    if (segment.length >= 3) add(segment, 1.4); // 完整片段比二字词元更精确
    for (let i = 0; i < segment.length - 1; i += 1) {
      const gram2 = segment.slice(i, i + 2);
      add(gram2, isStopTerm(gram2) ? 0.1 : 1);
      // 三字词元是识别实体的关键：「橘红胎」「大五爪」「压果片」拆成两个二字词元就认不出来了，
      // 会被「橘红」「什么」这类词靠数量压过去。
      // 但必须整串都是实字才算，否则"爪是什"这种跨词碎片会反向压过真正的条目。
      if (i < segment.length - 2) {
        const gram3 = segment.slice(i, i + 3);
        const hasStop = [...gram3].some((ch) => STOP_CHARS.has(ch));
        if (!hasStop) add(gram3, 1.3);
      }
    }
    if (segment.length === 2) add(segment, 1);
  }
  return [...terms.entries()].map(([term, weight]) => ({ term, weight }));
}

/**
 * 查询里出现某个同义组的完整词，就把组内其它词也加入匹配目标。
 * 注意必须用「查询文本包含组内完整词」判断，不能反过来用「组内词包含查询词元」——
 * 否则查询里的"橘红"会激活"橘红胎"那一组，把不相关的条目拉进来。
 */
function expandSynonyms(terms: Term[], groups: string[][], queryText: string): Term[] {
  const extra: Term[] = [];
  const seen = new Set(terms.map((item) => item.term));

  // 先把所有能触发的「组内词」按长度降序排：长的优先。
  // 否则查询里的"橘红胎"会顺带激活"橘红"所在的那一组（化橘红/毛橘红/化州柚），
  // 扩展出来的词反而把分数堆到无关条目上。
  const triggers = groups
    .map((group) => ({ group, words: group.map(normalize).filter(Boolean) }))
    .flatMap(({ group, words }) => words.map((word) => ({ group, word })))
    .filter(({ word }) => word && !isStopTerm(word) && queryText.includes(word))
    .sort((a, b) => b.word.length - a.word.length);

  const usedTriggers: string[] = [];
  for (const { group, word } of triggers) {
    // 已被更长的触发词包含（"橘红"之于"橘红胎"）就跳过
    if (usedTriggers.some((used) => used.includes(word))) continue;
    usedTriggers.push(word);
    for (const candidate of group.map(normalize).filter(Boolean)) {
      if (isStopTerm(candidate)) continue;
      if (seen.has(candidate)) continue;
      seen.add(candidate);
      // 扩展词只是"可能相关"，权重必须低于查询原词，否则反客为主
      extra.push({ term: candidate, weight: 0.7 });
    }
  }
  return [...terms, ...extra];
}

function loadSynonyms(path?: string): string[][] {
  const groups: string[][] = DEFAULT_SYNONYMS.map((group) => [...group]);
  if (!path || !existsSync(path)) return groups;
  const text = readFileSync(path, "utf8");
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const words = trimmed.split(/[\/,，|\s]+/).filter(Boolean);
    if (words.length >= 2) groups.push(words);
  }
  return groups;
}

export function readSlices(path: string): SliceRecord[] {
  if (!existsSync(path)) {
    throw new Error(`找不到知识库文件：${path}（用 GUIDE_KB_PATH 指定）`);
  }
  const parsed: unknown = JSON.parse(readFileSync(path, "utf8"));
  const list = Array.isArray(parsed)
    ? parsed
    : ((parsed as { slices?: unknown[] } | null)?.slices ?? []);
  if (!Array.isArray(list)) throw new Error("slices.json 结构不对：应为数组或 { slices: [...] }");
  return list.map((item) => {
    const record = item as Partial<SliceRecord>;
    return {
      id: String(record.id ?? ""),
      title: String(record.title ?? ""),
      source: record.source ? String(record.source) : "知识库",
      origin: record.origin ? String(record.origin) : undefined,
      url: record.url ? String(record.url) : undefined,
      content: String(record.content ?? ""),
    };
  });
}

/** 逐条检查；只报告，不阻断加载 */
export function validateSlices(slices: SliceRecord[]): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const seen = new Set<string>();

  for (const slice of slices) {
    const id = slice.id || "(缺 id)";
    const push = (field: string, problem: string) => issues.push({ id, field, problem });

    if (!slice.id.trim()) push("id", "缺少 id");
    else if (seen.has(slice.id)) push("id", "id 重复");
    seen.add(slice.id);

    const title = slice.title.trim();
    if (!title) push("title", "缺少 title");
    else {
      if (title.length > TITLE_MAX) push("title", `超过 ${TITLE_MAX} 字：${title.length}`);
      if (/\.[a-z0-9]{2,4}$/i.test(title)) push("title", "疑似文件名（带扩展名）");
      if (/[\\/]/.test(title)) push("title", "疑似路径");
    }

    const content = slice.content.trim();
    if (!content) push("content", "缺少 content");
    else {
      const length = content.length;
      if (length < CONTENT_MIN) push("content", `短于 ${CONTENT_MIN} 字：${length}`);
      if (length > CONTENT_MAX) push("content", `超过 ${CONTENT_MAX} 字：${length}`);
      if (/[〔〕]/.test(content)) push("content", "残留〔出处〕标签");
      if (/\.\.\//.test(content)) push("content", "残留相对链接 ../");
      if (/h-col-?\d+/i.test(content)) push("content", "残留栏目编号 h-col");
      if (/https?:\/\//.test(content)) push("content", "content 里不应出现 URL，请移到 url 字段");
    }

    const origin = (slice.origin ?? "").trim();
    if (origin) {
      if (/^(知识库|内部资料|内部|详细调研|资料)$/.test(origin)) push("origin", "占位词应留空");
      if (/h-col-?\d+/i.test(origin)) push("origin", "残留栏目编号 h-col");
      if (/\b\d{5,}\b/.test(origin)) push("origin", "疑似项目编号");
      if (/https?:\/\//.test(origin)) push("origin", "URL 应放 url 字段");
    }

    const url = (slice.url ?? "").trim();
    if (url && !/^https?:\/\//i.test(url)) push("url", "只接受 http(s) 链接");
  }
  return issues;
}

export class JsonKnowledge implements KnowledgeProvider {
  readonly mode = "json";
  private readonly slices: SliceRecord[];
  private readonly synonyms: string[][];
  private readonly normalized: { slice: SliceRecord; haystack: string; title: string }[];

  constructor(path: string, options: { synonymsPath?: string } = {}) {
    this.slices = readSlices(path);
    const defaultSynonyms = join(dirname(path), "synonyms.txt");
    this.synonyms = loadSynonyms(options.synonymsPath ?? defaultSynonyms);
    this.normalized = this.slices.map((slice) => ({
      slice,
      haystack: normalize(`${slice.title}${slice.title}${slice.content}${slice.origin ?? ""}`),
      title: normalize(slice.title),
    }));
  }

  get size(): number {
    return this.slices.length;
  }

  validate(): ValidationIssue[] {
    return validateSlices(this.slices);
  }

  /** 单次打分：返回按分数排序的候选，不截断 */
  private rank(query: string): { slice: SliceRecord; score: number }[] {
    const trimmed = query.trim();
    if (!trimmed) return [];
    const base = tokenize(trimmed);
    if (base.length === 0) return [];
    const terms = expandSynonyms(base, this.synonyms, normalize(trimmed));

    const total = this.normalized.length;

    // 文档频率：出现在一半以上切片里的词没有区分度（比如"橘红"），
    // 只靠它们命中不算数，否则问"七爪"会把标题含"橘红胎"的条目也带出来。
    const df = new Map<string, number>();
    for (const { term } of terms) {
      let count = 0;
      for (const entry of this.normalized) if (entry.haystack.includes(term)) count += 1;
      df.set(term, count);
    }

    const strict: { slice: SliceRecord; score: number }[] = [];
    const loose: { slice: SliceRecord; score: number }[] = [];
    // 长的先匹配：避免"化橘红"和"橘红"被当成两个词重复计分
    const orderedTerms = [...terms].sort((a, b) => b.term.length - a.term.length);

    for (const entry of this.normalized) {
      let score = 0;
      let distinctHit = 0;
      let titleHit = false;
      let strongHit = false;
      const matched: string[] = [];
      for (const { term, weight } of orderedTerms) {
        const inTitle = entry.title.includes(term);
        const inBody = entry.haystack.includes(term);
        if (!inTitle && !inBody) continue;
        if (matched.some((longer) => longer !== term && longer.includes(term))) continue;
        matched.push(term);
        if (inTitle) titleHit = true;
        const termDf = df.get(term) ?? 0;
        // df>=2 表示这个词在本库里不止一处出现，不是偶然撞上的孤词
        if (termDf >= 2) strongHit = true;
        if (termDf / total < 0.5) distinctHit += 1;
        const lengthFactor = term.length >= 3 ? 1.4 : 1;
        // IDF：越是稀有的词越说明问题。"化橘红"这种库内遍地都是的词要压下去，
        // 否则长查询里它会把分数带偏，真正关键的"烘干"反而排不上。
        const idf = Math.log((total + 1) / (termDf + 0.5));
        const idfFactor = Math.max(0.35, Math.min(1.6, idf / 1.6));
        // 三字以上的实词元基本等于实体名（"橘红胎""化橘红膏"），命中标题时再加一档，
        // 否则会被"化橘红"这类泛词靠数量压过去。
        const titleBoost = inTitle ? (term.length >= 3 ? 3.4 : 2.5) : 1;
        score += weight * idfFactor * lengthFactor * titleBoost;
      }
      if (score <= 0) continue;
      loose.push({ slice: entry.slice, score });
      // 标题没命中、又只撞上"独此一家"的孤词 → 视为偶然共现（例如"今天天气"撞到故事里的天气描写）
      if (!titleHit && !strongHit) continue;
      if (distinctHit === 0) continue;
      strict.push({ slice: entry.slice, score });
    }

    // 整个库都是同一主题时，"橘红"这类词处处都在、区分度天然为零。
    // 这时不能让用户得到空答案，退回按原始分数给最相关的一条。
    if (strict.length === 0) loose.sort((a, b) => b.score - a.score);
    const scored = strict.length > 0 ? strict : loose.slice(0, 1);
    scored.sort((a, b) => b.score - a.score);

    if (scored.length === 0) return [];
    scored.sort((a, b) => b.score - a.score);
    const best = scored[0].score;
    // 只有虚词命中（best < 1）就当作没找到，避免"是怎么"把无关条目拉进来
    if (best < 1) return [];
    const floor = Math.max(1, best * 0.45);

    const kept = scored.filter((item) => item.score >= floor);
    // 第一名显著领先时只给它：避免"七爪"问题下把仅正文提过一句的"大五爪"带出来
    const dominant = kept.length > 1 && kept[0].score >= kept[1].score * 1.8;
    return dominant ? kept.slice(0, 1) : kept;
  }

  /** 调试用：把某次检索的每个词元贡献摊开 */
  explain(query: string): { id: string; score: number; hits: string[] }[] {
    const trimmed = query.trim();
    if (!trimmed) return [];
    const base = tokenize(trimmed);
    const terms = expandSynonyms(base, this.synonyms, normalize(trimmed));
    const total = this.normalized.length;
    const df = new Map<string, number>();
    for (const { term } of terms) {
      let count = 0;
      for (const entry of this.normalized) if (entry.haystack.includes(term)) count += 1;
      df.set(term, count);
    }
    const ordered = [...terms].sort((a, b) => b.term.length - a.term.length);
    const out: { id: string; score: number; hits: string[] }[] = [];
    for (const entry of this.normalized) {
      let score = 0;
      const hits: string[] = [];
      const matched: string[] = [];
      for (const { term, weight } of ordered) {
        const inTitle = entry.title.includes(term);
        const inBody = entry.haystack.includes(term);
        if (!inTitle && !inBody) continue;
        if (matched.some((longer) => longer !== term && longer.includes(term))) continue;
        matched.push(term);
        const termDf = df.get(term) ?? 0;
        const lengthFactor = term.length >= 3 ? 1.4 : 1;
        const idf = Math.log((total + 1) / (termDf + 0.5));
        const idfFactor = Math.max(0.35, Math.min(1.6, idf / 1.6));
        const contrib = weight * idfFactor * lengthFactor * (inTitle ? 2.5 : 1);
        score += contrib;
        hits.push(`${term}(${inTitle ? "题" : "文"},df=${termDf},+${contrib.toFixed(2)})`);
      }
      if (score > 0) out.push({ id: entry.slice.id, score, hits });
    }
    return out.sort((a, b) => b.score - a.score);
  }

  async search(query: string, limit = 3): Promise<KnowledgeHit[]> {
    const trimmed = query.trim();
    if (!trimmed) return [];

    // 模型给的往往是空格分隔的关键词串（「化橘红 烘干 干燥 需要几天 时间」）。
    // 当成一整句算分会被"化橘红"这种高频词带偏，所以逐段召回再合并。
    const parts = trimmed.split(/\s+/).filter((part) => part.length >= 2);
    const ranks = parts.length > 1 ? parts.map((part) => this.rank(part)) : [this.rank(trimmed)];

    const merged = new Map<string, { slice: SliceRecord; score: number }>();
    for (const rank of ranks) {
      for (const item of rank) {
        const prev = merged.get(item.slice.id);
        if (!prev || item.score > prev.score) merged.set(item.slice.id, item);
      }
    }

    const cap = Math.min(Math.max(Math.trunc(limit) || 3, 1), 5);
    const all = [...merged.values()].sort((a, b) => b.score - a.score);
    const best = all[0]?.score ?? 0;
    const floor = best * 0.4;

    // 每个查询片段的头名优先保留：否则"烘干"这一段的答案会被"化橘红"段的高分条目挤掉
    const picked = new Map<string, { slice: SliceRecord; score: number }>();
    for (const rank of ranks) {
      const top = rank[0];
      if (top && top.score >= floor) picked.set(top.slice.id, top);
    }
    for (const item of all) if (!picked.has(item.slice.id)) picked.set(item.slice.id, item);

    return [...picked.values()]
      .sort((a, b) => b.score - a.score)
      .slice(0, cap)
      .map(({ slice }) => ({
        citation: {
          id: slice.id,
          title: slice.title,
          source: slice.source ?? "知识库",
          ...(slice.origin ? { origin: slice.origin } : {}),
          ...(slice.url ? { url: slice.url } : {}),
        },
        snippet: slice.content,
      }));
  }

  async read(id: string): Promise<{ citation: Citation; content: string } | null> {
    const slice = this.slices.find((item) => item.id === id);
    if (!slice) return null;
    return {
      citation: {
        id: slice.id,
        title: slice.title,
        source: slice.source ?? "知识库",
        ...(slice.origin ? { origin: slice.origin } : {}),
        ...(slice.url ? { url: slice.url } : {}),
      },
      content: slice.content,
    };
  }

  /** 给启动日志用的一行摘要 */
  summary(): string {
    const withOrigin = this.slices.filter((item) => item.origin).length;
    return `${this.slices.length} 片，${withOrigin} 片带出处，同义组 ${this.synonyms.length} 组`;
  }
}
