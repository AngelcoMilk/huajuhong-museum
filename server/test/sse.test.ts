import assert from "node:assert/strict";
import { test } from "node:test";
import { encodeEvent, parseEvents } from "../src/sse.ts";

test("encodeEvent：event 名为类型，data 为载荷本体", () => {
  assert.equal(encodeEvent({ type: "token", text: "你好" }), 'event: token\ndata: {"text":"你好"}\n\n');
  assert.equal(
    encodeEvent({ type: "citation", citation: { id: "1", title: "t", source: "s" } }),
    'event: citation\ndata: {"id":"1","title":"t","source":"s"}\n\n',
  );
  assert.equal(
    encodeEvent({ type: "action", action: { type: "goto_page", payload: { route: "/products/CP-007", label: "七爪化橘红" } } }),
    'event: action\ndata: {"type":"goto_page","payload":{"route":"/products/CP-007","label":"七爪化橘红"}}\n\n',
  );
  assert.equal(
    encodeEvent({ type: "suggestions", items: ["甲", "乙"] }),
    'event: suggestions\ndata: {"items":["甲","乙"]}\n\n',
  );
  assert.equal(
    encodeEvent({ type: "error", code: "boom", message: "炸了" }),
    'event: error\ndata: {"code":"boom","message":"炸了"}\n\n',
  );
});

test("parseEvents 能还原五种事件", () => {
  const events = [
    { type: "token", text: "a" },
    { type: "citation", citation: { id: "1", title: "t", source: "s" } },
    { type: "action", action: { type: "goto_checkout", payload: {} } },
    { type: "suggestions", items: ["甲"] },
    { type: "error", code: "e", message: "m" },
    { type: "done", sessionId: "s1", usage: { inputTokens: 1, outputTokens: 2 }, finishReason: "stop" },
  ] as const;
  const parsed = parseEvents(events.map((e) => encodeEvent(e as never)).join(""));
  assert.equal(parsed.length, 6);
  assert.deepEqual(parsed.map((e) => e.type), ["token", "citation", "action", "suggestions", "error", "done"]);
  assert.deepEqual(parsed.at(-1), {
    type: "done",
    sessionId: "s1",
    usage: { inputTokens: 1, outputTokens: 2 },
    finishReason: "stop",
  });
});

test("parseEvents 忽略坏帧、缺字段与未知事件", () => {
  const raw =
    "\n\n" +
    'event: token\ndata: {oops}\n\n' +
    'event: ping\ndata: {}\n\n' +
    'event: token\ndata: {"text":"ok"}\n\n';
  const parsed = parseEvents(raw);
  assert.equal(parsed.length, 1);
  assert.deepEqual(parsed[0], { type: "token", text: "ok" });
});
