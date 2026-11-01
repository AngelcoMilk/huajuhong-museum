import assert from "node:assert/strict";
import { join } from "node:path";
import { test } from "node:test";
import { JsonKnowledge, readSlices, validateSlices } from "../src/knowledge/jsonProvider.ts";

const FIXTURES = join(import.meta.dirname, "fixtures");
const GOOD = join(FIXTURES, "slices.sample.json");
const BAD = join(FIXTURES, "slices.invalid.json");

function kb(): JsonKnowledge {
  return new JsonKnowledge(GOOD, { synonymsPath: join(FIXTURES, "no-such-synonyms.txt") });
}

test("空查询与无关查询都返回空数组（宁缺毋滥）", async () => {
  const store = kb();
  assert.deepEqual(await store.search(""), []);
  assert.deepEqual(await store.search("   "), []);
  assert.deepEqual(await store.search("张三丰"), []);
  assert.deepEqual(await store.search("今天天气怎么样"), []);
});

test("命中标题：问七爪只返回七爪那条，不把大五爪带出来", async () => {
  const store = kb();
  const hits = await store.search("七爪");
  assert.ok(hits.length >= 1);
  assert.equal(hits[0].citation.id, "f-qizhua-01");
  assert.ok(
    !hits.some((hit) => hit.citation.id === "f-wuzhua-01"),
    "大五爪正文里提到七爪，不应被召回到七爪问题下",
  );
});

test("同义扩展：问「割七刀」也能命中七爪条目", async () => {
  const store = kb();
  const hits = await store.search("割七刀");
  assert.ok(hits.some((hit) => hit.citation.id === "f-qizhua-01"), "未通过同义词命中七爪");
});

test("正文命中：title 不含但正文讲了，也能被检索到", async () => {
  const store = kb();
  const hits = await store.search("出果率");
  assert.ok(hits.some((hit) => hit.citation.id === "f-wuzhua-01"));
});

test("limit 生效：默认 3 条，上限 5 条", async () => {
  const store = kb();
  const byDefault = await store.search("工艺");
  assert.ok(byDefault.length <= 3);
  const wide = await store.search("工艺", 99);
  assert.ok(wide.length <= 5);
  const narrow = await store.search("工艺", 1);
  assert.equal(narrow.length, 1);
});

test("citation 完整透传 origin 与 url", async () => {
  const store = kb();
  const hits = await store.search("烫果");
  const target = hits.find((hit) => hit.citation.id === "f-tangguo-01");
  assert.ok(target);
  assert.equal(target.citation.origin, "化橘红官网《古法炮制》");
  assert.equal(target.citation.url, "https://www.hzhjh.com.cn/sys-nd/1001.html");

  const noOrigin = (await store.search("橘红胎"))[0];
  assert.equal(noOrigin.citation.origin, undefined, "没出处时不能凭空补一个");
  assert.equal(noOrigin.citation.source, "知识库");
});

test("read：按 id 取全文，未知 id 返回 null", async () => {
  const store = kb();
  const doc = await store.read("f-qizhua-01");
  assert.ok(doc);
  assert.match(doc.content, /七瓣/);
  assert.equal(doc.citation.id, "f-qizhua-01");
  assert.equal(await store.read("不存在"), null);
});

test("校验：合规数据零问题", () => {
  const slices = readSlices(GOOD);
  assert.deepEqual(validateSlices(slices), []);
});

test("校验：能揪出文件名 title、占位 origin、残留标签、非法链接、重复 id", () => {
  const issues = validateSlices(readSlices(BAD));
  const has = (field: string, keyword: string) =>
    issues.some((issue) => issue.field === field && issue.problem.includes(keyword));

  assert.ok(has("id", "重复"), "重复 id 未检出");
  assert.ok(has("title", "扩展名"), "文件名式 title 未检出");
  assert.ok(has("title", "路径") || has("title", "扩展名"));
  assert.ok(has("content", "短于"), "过短正文未检出");
  assert.ok(has("content", "〔"), "残留〔标签〕未检出");
  assert.ok(has("content", "相对链接"), "残留 ../ 未检出");
  assert.ok(has("origin", "占位词"), "占位 origin 未检出");
  assert.ok(has("origin", "h-col"), "栏目编号未检出");
  assert.ok(has("url", "http"), "非法 url 未检出");
});
