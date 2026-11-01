// 模型调用失败时 runner 只发 done(finishReason="error")、既没有 error 事件也没吐字，
// 前台会把它当正常完成渲染成空回答气泡。
// 这条测试锁住修复：这种收尾必须先补一条对外可读的 error，再发 done；
// 已吐过字 / 正常结束 / aborted 的收尾不许多发 error。
import assert from "node:assert/strict";
import { test } from "node:test";
import { makeApp } from "../src/app.ts";
import type { Emit, RunInput, Runner } from "../src/agent/runner.ts";
import { NullKnowledge } from "../src/knowledge/provider.ts";
import { issueSessionId } from "../src/guideSession.ts";
import { parseEvents } from "../src/sse.ts";

type Ending = "error" | "stop" | "aborted";

/** 只按指定收尾事件结束的 Runner：模拟 piRunner 把模型失败吞成 done(error)。 */
class EndingRunner implements Runner {
  private readonly ending: Ending;

  constructor(ending: Ending) {
    this.ending = ending;
  }

  async run(_input: RunInput, emit: Emit): Promise<void> {
    if (this.ending === "stop") emit({ type: "token", text: "七爪要划七刀。" });
    if (this.ending === "error") {
      emit({ type: "done", sessionId: "", usage: { inputTokens: 0, outputTokens: 0 }, finishReason: "error" });
      return;
    }
    emit({
      type: "done",
      sessionId: "",
      usage: { inputTokens: 0, outputTokens: 0 },
      finishReason: this.ending,
    });
  }

  dispose(): void {}
}

async function runOnce(ending: Ending) {
  const { app } = makeApp({
    createRunner: () => new EndingRunner(ending),
    knowledge: new NullKnowledge(),
    modelInfo: { provider: "mock", model: "mock-model" },
  });
  const res = await app.request("/api/agent/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId: issueSessionId(), message: "七爪怎么割" }),
  });
  assert.equal(res.status, 200);
  return parseEvents(await res.text());
}

test("模型失败且没吐字：先发 error（可读文案）再发 done", async () => {
  const events = await runOnce("error");
  assert.deepEqual(
    events.map((event) => event.type),
    ["error", "done"],
  );
  const error = events[0];
  assert.equal(error?.type, "error");
  if (error?.type === "error") {
    assert.equal(error.code, "internal_error");
    assert.equal(error.message, "讲解服务暂时不可用，请稍后再试");
  }
  const done = events[1];
  assert.equal(done?.type, "done");
  if (done?.type === "done") assert.equal(done.finishReason, "error");
});

test("正常结束的收尾不补 error", async () => {
  const events = await runOnce("stop");
  assert.deepEqual(
    events.map((event) => event.type),
    ["token", "done"],
  );
});

test("aborted 收尾不补 error", async () => {
  const events = await runOnce("aborted");
  assert.deepEqual(
    events.map((event) => event.type),
    ["done"],
  );
});
