import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { flushTracking, initClickTracking, trackPageView } from "./track";

describe("前台埋点", () => {
  let calls: Array<{ url: string; body: any }> = [];

  beforeEach(() => {
    calls = [];
    localStorage.clear();
    vi.stubGlobal("fetch", (url: string, init: any) => {
      calls.push({ url, body: JSON.parse(init.body) });
      return Promise.resolve(new Response(null, { status: 200 }));
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("进页面与离开各产生一条事件，离开带停留时长", () => {
    const stop = trackPageView("/park");
    stop();
    flushTracking();
    expect(calls.length).toBeGreaterThan(0);
    const events = calls.flatMap((c) => c.body.events);
    expect(events[0]).toMatchObject({ kind: "page_view", route: "/park" });
    const leave = events.find((e: any) => e.kind === "page_leave");
    expect(leave).toBeTruthy();
    expect(typeof leave.durationMs).toBe("number");
    expect(events[0].visitorId).toBeTruthy();
  });

  it("admin 路由不采集", () => {
    const stop = trackPageView("/admin/content");
    stop();
    flushTracking();
    expect(calls.length).toBe(0);
  });

  it("点击带 data-track 的元素才上报", () => {
    const stop = initClickTracking();
    const node = document.createElement("button");
    node.dataset.track = "hero-cta";
    document.body.appendChild(node);
    node.click();
    flushTracking();
    stop();
    const events = calls.flatMap((c) => c.body.events);
    expect(events.some((e: any) => e.kind === "click" && e.targetId === "hero-cta")).toBe(true);
  });
});
