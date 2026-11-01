// 真实模型联调测试：默认跳过，LIVE=1 才跑（会消耗 token）。
// 没有可用凭证时同样跳过，不会失败。
// 运行：npm run test:live
import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { PiRunner } from "../src/agent/piRunner.ts";
import { NullKnowledge } from "../src/knowledge/provider.ts";
import type { AgentEvent } from "../src/contract.ts";

/** pi 的凭证放在 agent 目录的 auth.json；环境里直接给了 Key 也算有。 */
function hasCredential(): boolean {
  if (process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY) return true;
  const dir = process.env.PI_CODING_AGENT_DIR ?? join(homedir(), ".pi", "agent");
  try {
    return readFileSync(join(dir, "auth.json"), "utf8").trim().length > 2;
  } catch {
    return false;
  }
}

const live = process.env.LIVE === "1" && hasCredential();

test("真实模型：流式返回中文 token，附带候选追问，以 done 结束", { skip: !live, timeout: 120_000 }, async () => {
  const events: AgentEvent[] = [];
  const runner = new PiRunner({ sessionId: "live-1", knowledge: new NullKnowledge() });
  try {
    await runner.run(
      { message: "用一句话说明七爪橘红是什么。" },
      (e) => events.push(e),
      new AbortController().signal,
    );
  } finally {
    runner.dispose();
  }

  const text = events.flatMap((e) => (e.type === "token" ? [e.text] : [])).join("");
  console.log("[live] tokens:", events.filter((e) => e.type === "token").length, "chars:", text.length);
  console.log("[live] answer:", text.slice(0, 120));
  console.log("[live] events:", events.map((e) => e.type).join(","));

  const suggestions = events.find((e) => e.type === "suggestions");
  if (suggestions && suggestions.type === "suggestions") {
    console.log("[live] suggestions:", JSON.stringify(suggestions.items));
    assert.ok(suggestions.items.length >= 1, "候选追问不应为空");
    assert.ok(suggestions.items.every((s) => s.length > 0 && s.length < 40), "候选应短");
    assert.doesNotMatch(text, /<<候选>>/, "正文里不能残留标记");
  } else {
    console.log("[live] 本轮未产出候选追问（模型未遵循格式）");
  }

  assert.ok(events.some((e) => e.type === "token"), "应至少有一个 token 事件");
  assert.ok(text.length > 5, "回答不应为空");
  assert.match(text, /[\u4e00-\u9fa5]/, "回答应是中文");
  const done = events.at(-1);
  assert.equal(done?.type, "done");
  if (done?.type === "done") {
    assert.equal(done.sessionId, "live-1");
    assert.ok(done.usage.outputTokens > 0, "应统计到输出 token");
  }
});

test("真实模型：工具调用产出 action 事件", { skip: !live, timeout: 120_000 }, async () => {
  const events: AgentEvent[] = [];
  const runner = new PiRunner({ sessionId: "live-2", knowledge: new NullKnowledge() });
  try {
    await runner.run(
      { message: "直接带我去看七爪化橘红这件商品，不要解释。" },
      (e) => events.push(e),
      new AbortController().signal,
    );
  } finally {
    runner.dispose();
  }
  console.log("[live-2] events:", events.map((e) => e.type).join(","));
  // 模型有概率不调工具，只断言链路没炸；调用了则必须结构完整
  const action = events.find((e) => e.type === "action");
  if (action && action.type === "action") {
    assert.equal(action.action.type, "goto_page");
    assert.equal(typeof action.action.payload.route, "string");
  } else {
    console.log("[live-2] 本轮模型未调用工具，跳过动作断言");
  }
  assert.equal(events.at(-1)?.type, "done");
});
