// 生产入口：装配 PiRunner 并监听端口。
// 第一条 import 必须是环境变量校验：缺变量就在装配之前打印中文说明并退出。
import "./env-check.ts";
import { serve } from "@hono/node-server";
import { makeApp } from "./app.ts";
import { resolveKnowledge } from "./knowledge/provider.ts";
import { PiRunner } from "./agent/piRunner.ts";
import { MODEL } from "./agent/model.ts";
import { makeAdminApp } from "./admin/routes.ts";
import { makeContentApp, makeTrackApp } from "./public.ts";
import { makeShopApp } from "./shop/routes.ts";
import { hydrateDailyCounters } from "./guideLimits.ts";

const port = Number(process.env.PORT ?? 3000);
// 默认只绑回环地址：讲解服务会消耗本机 pi 凭证对应的额度，不该让同网段的人白嫖
const hostname = process.env.HOST ?? "127.0.0.1";

const knowledge = await resolveKnowledge();

// G1：全站当天的消息数与 token 数重启后不清零，启动时从 AgentMessage 回捞
await hydrateDailyCounters();

const { app, sessions } = makeApp({
  createRunner: (sessionId) => new PiRunner({ sessionId, knowledge }),
  knowledge,
  modelInfo: MODEL,
});

// 后台上传的图片/视频：只读静态服务，按扩展名给类型，带长缓存。
// 两个地址同一份实现：老的 /uploads/:name 保留（已有地址不会失效），
// 另挂 /api/uploads/:name —— 前台开发服务只代理 /api，走 /uploads 会拿到 index.html。
// 必须在下面的 app.route(...) 之前注册，否则会被挂在 /api 上的子应用抢走。
async function serveUpload(c: any) {
  const { readFile } = await import("node:fs/promises");
  const { join } = await import("node:path");
  const name = c.req.param("name");
  if (!/^[a-z0-9.\-]+$/i.test(name)) return c.text("bad name", 400);
  const ext = name.split(".").pop() ?? "";
  const types: Record<string, string> = { jpg: "image/jpeg", png: "image/png", webp: "image/webp", avif: "image/avif", mp4: "video/mp4" };
  try {
    const buffer = await readFile(join(import.meta.dirname, "..", "uploads", name));
    return c.body(buffer, 200, {
      "content-type": types[ext] ?? "application/octet-stream",
      "cache-control": "public, max-age=86400",
    });
  } catch {
    return c.text("not found", 404);
  }
}

app.get("/api/uploads/:name", serveUpload);

// 后台 / 公开内容 / 埋点挂在同一个进程，权限各自独立
app.route("/api/admin", makeAdminApp());
app.route("/api/content", makeContentApp());
app.route("/api", makeTrackApp());
app.route("/api", makeShopApp());

app.get("/uploads/:name", serveUpload);

// 生产单端口：SERVE_SITE=1 时由本服务托管 site/dist（SPA 回退到 index.html）
if (process.env.SERVE_SITE === "1") {
  app.get("*", async (c) => {
    const { readFile } = await import("node:fs/promises");
    const { join, normalize } = await import("node:path");
    const dist = normalize(join(import.meta.dirname, "..", "..", "site", "dist"));
    const raw = decodeURIComponent(new URL(c.req.url).pathname);
    const target = raw === "/" ? "/index.html" : raw;
    const filePath = normalize(join(dist, target));
    if (!filePath.startsWith(dist)) return c.text("bad path", 400);
    const types: Record<string, string> = {
      html: "text/html; charset=utf-8",
      js: "text/javascript; charset=utf-8",
      css: "text/css; charset=utf-8",
      json: "application/json; charset=utf-8",
      svg: "image/svg+xml",
      png: "image/png",
      jpg: "image/jpeg",
      webp: "image/webp",
      avif: "image/avif",
      woff2: "font/woff2",
      woff: "font/woff",
      ico: "image/x-icon",
      mp4: "video/mp4",
    };
    const fileName = filePath.split("/").pop() ?? "";
    const ext = fileName.includes(".") ? (fileName.split(".").pop() ?? "").toLowerCase() : "";
    try {
      const buffer = await readFile(filePath);
      return c.body(buffer, 200, { "content-type": types[ext] ?? "application/octet-stream" });
    } catch {
      // 带扩展名的请求找不到就给 404，别用 index.html 假装成功；只有前端路由才回退
      if (ext && ext !== "html") return c.text("not found", 404);
      try {
        const html = await readFile(join(dist, "index.html"));
        return c.body(html, 200, { "content-type": types.html });
      } catch {
        return c.text("site/dist 不存在，请先在 site/ 下执行 npm run build", 503);
      }
    }
  });
}

const server = serve({ fetch: app.fetch, port, hostname }, (info) => {
  console.log(`[guide] listening on http://${hostname}:${info.port}`);
  console.log(`[guide] model=${MODEL.provider}/${MODEL.model} kb=${knowledge.mode}`);
});

const shutdown = () => {
  console.log("[guide] shutting down");
  sessions.disposeAll();
  server.close(() => process.exit(0));
};
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);