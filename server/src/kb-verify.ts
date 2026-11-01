// 知识库验收：格式校验 + 重复检测 + 检索对拍
// 用法：npm run kb:verify
//       GUIDE_KB_PATH=/path/to/slices.json npm run kb:verify
//
// 退出码：0 全通过；1 有问题（会列出具体条目）
import { DEFAULT_SLICES_PATH, JsonKnowledge, readSlices } from "./knowledge/jsonProvider.ts";

const path = (process.env.GUIDE_KB_PATH ?? "").trim() || process.argv[2] || DEFAULT_SLICES_PATH;

let kb: JsonKnowledge;
let slices: ReturnType<typeof readSlices>;
try {
  kb = new JsonKnowledge(path);
  slices = readSlices(path);
} catch (error) {
  console.error("✗ 加载失败：", (error as Error).message);
  process.exit(1);
}

let failures = 0;

console.log("文件：" + path);
console.log("概况：" + kb.summary() + "\n");

// ---------- 1. 格式校验 ----------
console.log("【1】格式校验");
const issues = kb.validate();
if (issues.length === 0) {
  console.log("  ✓ 零问题");
} else {
  failures += issues.length;
  console.log("  ✗ " + issues.length + " 个问题：");
  for (const issue of issues.slice(0, 30)) {
    console.log("    - [" + issue.field + "] " + issue.id + "：" + issue.problem);
  }
  if (issues.length > 30) console.log("    … 还有 " + (issues.length - 30) + " 条");
}

// ---------- 2. 条目包含关系 ----------
console.log("\n【2】条目包含关系（3-gram）");
const norm = (s: string) => s.replace(/[\s，。；：、（）()【】\[\]\-—·]/g, "");
const grams = (s: string) => {
  const t = norm(s);
  const set = new Set<string>();
  for (let i = 0; i < t.length - 2; i += 1) set.add(t.slice(i, i + 3));
  return set;
};
const sets = slices.map((s) => ({ id: s.id, g: grams(s.content) }));
const contained: string[] = [];
for (let i = 0; i < sets.length; i += 1) {
  for (let j = i + 1; j < sets.length; j += 1) {
    const a = sets[i].g;
    const b = sets[j].g;
    if (a.size === 0 || b.size === 0) continue;
    let ab = 0;
    let ba = 0;
    for (const x of a) if (b.has(x)) ab += 1;
    for (const x of b) if (a.has(x)) ba += 1;
    if (ab / a.size >= 0.98) contained.push(sets[i].id + " ⊂ " + sets[j].id);
    else if (ba / b.size >= 0.98) contained.push(sets[j].id + " ⊂ " + sets[i].id);
  }
}
if (contained.length === 0) {
  console.log("  ✓ 无完全包含对");
} else {
  failures += contained.length;
  console.log("  ✗ " + contained.length + " 对完全包含：");
  for (const line of contained) console.log("    - " + line);
}

// ---------- 3. 检索对拍 ----------
console.log("\n【3】检索对拍");
interface Case {
  q: string;
  /** top1 标题应包含的词 */
  titleHas?: string;
  /** 应返回空 */
  empty?: boolean;
}
const CASES: Case[] = [
  { q: "烘干要几天", titleHas: "烘干" },
  { q: "烘干周期多久", titleHas: "烘干" },
  { q: "智能烘房几天", titleHas: "烘干" },
  { q: "出成率多少", titleHas: "烘干" },
  { q: "水分要求", titleHas: "水分" },
  { q: "柚皮苷标准", titleHas: "柚皮苷" },
  { q: "七爪是什么", titleHas: "七爪" },
  { q: "大五爪怎么割", titleHas: "五爪" },
  { q: "橘红胎是什么", titleHas: "胎" },
  { q: "罗辨是谁", titleHas: "罗辨" },
  { q: "翠鸟送种", titleHas: "翠鸟" },
  { q: "一片值一金", titleHas: "一金" },
  { q: "1963年版规格", titleHas: "1963" },
  { q: "VR 场景", titleHas: "VR" },
  { q: "产业园产值", titleHas: "产值" },
  { q: "化橘红膏功效", titleHas: "膏" },
  { q: "张三丰", empty: true },
  { q: "帮我写代码", empty: true },
];

let pass = 0;
for (const item of CASES) {
  const hits = await kb.search(item.q, 3);
  const top = hits[0];
  let ok: boolean;
  let detail: string;
  if (item.empty) {
    ok = hits.length === 0;
    detail = ok ? "(空)" : "误召回 " + hits.map((h) => h.citation.id).join(", ");
  } else if (!top) {
    ok = false;
    detail = "(空)";
  } else {
    ok = !item.titleHas || top.citation.title.includes(item.titleHas);
    detail = top.citation.id + "「" + top.citation.title + "」";
  }
  if (ok) pass += 1;
  else failures += 1;
  console.log("  " + (ok ? "✓" : "✗") + " " + item.q.padEnd(14) + " → " + detail);
}

console.log("\n────────────────────────");
console.log("检索对拍 " + pass + "/" + CASES.length + " 通过");
console.log(failures === 0 ? "✓ 全部通过" : "✗ 共 " + failures + " 处问题");
process.exit(failures === 0 ? 0 : 1);
