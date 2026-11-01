import assert from "node:assert/strict";
import { test } from "node:test";
import { makeApp } from "../src/app.ts";
import { MockRunner } from "../src/agent/mockRunner.ts";
import type { Runner } from "../src/agent/runner.ts";
import { NullKnowledge } from "../src/knowledge/provider.ts";
import { parseEvents } from "../src/sse.ts";
import { issueSessionId } from "../src/guideSession.ts";

function build(runnerFactory?: () => Runner) {
  return makeApp({
    createRunner: runnerFactory ?? (() => new MockRunner()),
    knowledge: new NullKnowledge(),
    modelInfo: { provider: "mock", model: "mock-model" },
  });
}

function chat(app: ReturnType<typeof build>["app"], body: unknown) {
  return app.request("/api/agent/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

test("GET /api/health 只回 ok（G4：不再泄露 provider/model/会话数）", async () => {
  const { app } = build();
  const res = await app.request("/api/health");
  assert.equal(res.status, 200);
  const body = (await res.json()) as Record<string, unknown>;
  assert.deepEqual(body, { ok: true });
});

test("chat 返回 SSE，事件顺序为 token* → citation/action → done", async () => {
  const { app } = build();
  const sid = issueSessionId();
  const res = await chat(app, { sessionId: sid, message: "七爪怎么割" });
  assert.equal(res.status, 200);
  assert.match(res.headers.get("content-type") ?? "", /text\/event-stream/);

  const events = parseEvents(await res.text());
  const types = events.map((e) => e.type);
  assert.equal(types[0], "token");
  assert.equal(types.at(-1), "done");
  assert.equal(types.filter((t) => t === "done").length, 1);

  const text = events.flatMap((e) => (e.type === "token" ? [e.text] : [])).join("");
  assert.ok(text.includes("七爪怎么割"), "回答应回显问题");

  const done = events.at(-1);
  assert.equal(done?.type, "done");
  if (done?.type === "done") {
    assert.equal(done.sessionId, sid, "done 必须原样回传请求的 sessionId");
    assert.equal(done.finishReason, "stop");
  }
});

test("chat 同时产出 citation 与 action 事件且带完整字段", async () => {
  const { app } = build();
  const events = parseEvents((await (await chat(app, { sessionId: issueSessionId(), message: "带我看看七爪" })).text()));
  const citation = events.find((e) => e.type === "citation");
  const action = events.find((e) => e.type === "action");
  assert.ok(citation && citation.type === "citation");
  assert.deepEqual(Object.keys(citation.citation).sort(), ["id", "origin", "source", "title"]);
  assert.equal(citation.citation.origin, "《化橘红志》");
  assert.ok(action && action.type === "action");
  assert.equal(action.action.type, "goto_page");
  assert.ok(action.action.payload.route);
});

test("模型失败时只发 error，不发 done", async () => {
  const { app } = build();
  const events = parseEvents((await (await chat(app, { sessionId: issueSessionId(), message: "请报错" })).text()));
  assert.deepEqual(events.map((e) => e.type), ["error"]);
  const err = events[0];
  if (err.type === "error") {
    assert.equal(err.code, "mock_failure");
    assert.ok(err.message);
  }
});

test("runner 抛异常时被兜住并转成 error 事件", async () => {
  const throwing: Runner = {
    async run() {
      throw new Error("boom");
    },
    dispose() {},
  };
  const { app } = build(() => throwing);
  const events = parseEvents((await (await chat(app, { sessionId: issueSessionId(), message: "hi" })).text()));
  assert.equal(events.length, 1);
  assert.equal(events[0].type, "error");
  if (events[0].type === "error") {
    assert.equal(events[0].code, "internal_error");
    // 内部错误原文不能外泄（可能带路径/凭证/provider 细节）
    assert.doesNotMatch(events[0].message, /boom/);
    assert.match(events[0].message, /暂时不可用/);
  }
});

test("参数校验：缺 sessionId / 空 message / 超长 / 非 JSON", async () => {
  const { app } = build();
  assert.equal((await chat(app, { message: "hi" })).status, 400);
  assert.equal((await chat(app, { sessionId: "  ", message: "hi" })).status, 400);
  assert.equal((await chat(app, { sessionId: "s", message: "   " })).status, 400);
  assert.equal((await chat(app, { sessionId: "s", message: "字".repeat(2001) })).status, 413);

  const bad = await app.request("/api/agent/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{not json",
  });
  assert.equal(bad.status, 400);
});

test("同一 sessionId 复用同一个 Runner，reset 后重新创建", async () => {
  let created = 0;
  const { app } = build(() => {
    created += 1;
    return new MockRunner();
  });

  // 阶段二起会话 id 必须带签名，这里现签两个
  const same = issueSessionId();
  // G1 加了「同一会话并发 1」的闸：不把上一轮的流读干净，下一轮会被 409 挡住
  await (await chat(app, { sessionId: same, message: "一" })).text();
  await (await chat(app, { sessionId: same, message: "二" })).text();
  assert.equal(created, 1, "同一会话不应重建 Runner");

  await (await chat(app, { sessionId: issueSessionId(), message: "三" })).text();
  assert.equal(created, 2);

  const reset = await app.request("/api/agent/reset", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId: same }),
  });
  assert.equal(reset.status, 200);
  assert.equal(((await reset.json()) as { existed: boolean }).existed, true);

  await (await chat(app, { sessionId: same, message: "四" })).text();
  assert.equal(created, 3, "reset 后应重建 Runner");
});

test("reset 不存在的会话返回 existed:false", async () => {
  const { app } = build();
  const res = await app.request("/api/agent/reset", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // 签名合法但从没建过：才测得到 existed:false（未签名的 id 现在先被 401 挡掉）
    body: JSON.stringify({ sessionId: issueSessionId() }),
  });
  assert.equal(((await res.json()) as { existed: boolean }).existed, false);
});

test("CORS：白名单来源回显，陌生来源不给许可", async () => {
  const { app } = build();

  // 无 Origin 的预检：允许通过，但不发 ACAO
  const pre = await app.request("/api/agent/chat", { method: "OPTIONS" });
  assert.equal(pre.status, 204);
  assert.equal(pre.headers.get("access-control-allow-origin"), null);

  // 白名单内回显
  const ok = await app.request("/api/health", { headers: { Origin: "http://localhost:5173" } });
  assert.equal(ok.headers.get("access-control-allow-origin"), "http://localhost:5173");

  // 陌生来源：不回显（否则任意网页都能驱动本机服务）
  const bad = await app.request("/api/health", { headers: { Origin: "https://evil.example" } });
  assert.equal(bad.headers.get("access-control-allow-origin"), null);
  assert.equal(bad.status, 200);
});

test("CORS 白名单可注入，便于部署时收窄", async () => {
  const { app } = makeApp({
    createRunner: () => new MockRunner(),
    knowledge: new NullKnowledge(),
    modelInfo: { provider: "mock", model: "mock-model" },
    allowedOrigins: ["https://museum.example"],
  });
  const ok = await app.request("/api/health", { headers: { Origin: "https://museum.example" } });
  assert.equal(ok.headers.get("access-control-allow-origin"), "https://museum.example");
  const denied = await app.request("/api/health", { headers: { Origin: "http://localhost:5173" } });
  assert.equal(denied.headers.get("access-control-allow-origin"), null);
});

test("未知路由返回 404 JSON", async () => {
  const { app } = build();
  const res = await app.request("/api/nope");
  assert.equal(res.status, 404);
  assert.equal(((await res.json()) as { code: string }).code, "not_found");
});
