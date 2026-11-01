// 自检：逐条检查 slices.json 的格式与引用
// 用法：npm run kb:check              （默认 server/kb/slices.json）
//       GUIDE_KB_PATH=路径 npm run kb:check
import { DEFAULT_SLICES_PATH, JsonKnowledge } from "./knowledge/jsonProvider.ts";

const path = (process.env.GUIDE_KB_PATH ?? "").trim() || process.argv[2] || DEFAULT_SLICES_PATH;

let kb: JsonKnowledge;
try {
  kb = new JsonKnowledge(path);
} catch (error) {
  console.error("✗ 加载失败：", (error as Error).message);
  process.exit(1);
}

console.log("文件：", path);
console.log("概况：", kb.summary());

const issues = kb.validate();
if (issues.length === 0) {
  console.log("✓ 校验通过，没有发现格式问题");
  process.exit(0);
}

console.log(`✗ 发现 ${issues.length} 个问题：`);
for (const issue of issues) {
  console.log(`  - [${issue.field}] ${issue.id}：${issue.problem}`);
}
process.exit(1);
