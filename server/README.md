# 接口服务（guide-server）

展示站、管理后台、AI 讲解员和购物流程的后端。Hono + Prisma + SQLite，直接用 Node 跑 TypeScript，不需要编译。

## 跑起来

```bash
cd server
npm install
cp .env.example .env      # 至少填好 ADMIN_JWT_SECRET
npm run db:deploy         # 按 prisma/migrations 建表
npm run db:seed           # 写入内容快照并创建管理员
npm run dev               # http://127.0.0.1:3000
```

需要 Node ≥ 22.18。

| 命令 | 作用 |
|---|---|
| `npm run dev` | 带 `--watch` 的开发服务 |
| `npm start` | 生产启动（先 `NODE_ENV=production`） |
| `npm run db:deploy` | 应用迁移，建库 |
| `npm run db:migrate` | 开发期新建迁移 |
| `npm run db:seed` | 写入 `prisma/seed-data/*.json`，创建管理员与讲解员默认配置；可重复执行 |
| `npm run db:studio` | 打开 Prisma Studio 看库 |
| `npm test` | 接口测试（不发网络请求，不碰真实库） |
| `npm run test:live` | 真实模型联调，需要 Key，会消耗 token |
| `npm run kb:check` / `kb:verify` | 知识库切片格式与检索自检 |

环境变量的完整列表见 [`.env.example`](./.env.example)。

## 目录

```
src/
  index.ts      进程入口：环境检查、静态资源、上传与站点托管
  app.ts        讲解员主流程（SSE）
  public.ts     公开内容接口
  shop/         购物：账号、购物车、订单、支付
  admin/        后台接口：鉴权、账号、内容、VR、商品、统计、日志、供应商
  agent/        讲解员：模型调用、提示词、工具
  knowledge/    知识库读取（切片 JSON 与内置样例）
  analysis/     内容分析任务
prisma/
  migrations/   数据库迁移
  seed-data/    内容快照（JSON）
  seed.ts       建库后的初始化脚本
kb/             知识库切片、同义词表
test/           接口测试
```

## 接口分组

| 前缀 | 说明 |
|---|---|
| `GET /api/health` | 健康检查 |
| `GET /api/content/*` | 公开内容：板块、文章、企业、产品、VR |
| `POST /api/agent/session`、`/api/agent/chat` | 讲解员：签发会话、流式对话 |
| `/api/auth/*`、`/api/shop/*` | 购物：注册登录、购物车、订单、支付（演示价） |
| `/api/admin/*` | 管理后台，JWT 鉴权。首次登录强制改密 |

讲解员对话用 `text/event-stream`，事件有 `token`、`citation`、`suggestions`、`action`、`error`、`done`。

## 管理员与模型

`db:seed` 创建管理员：用户名默认 `admin`，口令取 `ADMIN_PASSWORD`；没设则随机生成并只打印一次。首次登录必须改密。

讲解员的模型来自管理后台「模型供应商」：填 OpenAI 兼容接口的 `baseUrl`、模型名与 Key（Key 加密存在库里，接口不回显）。

`db:seed` 只建一版**未发布**的 v1：系统提示词是代码里的 `GUIDE_SYSTEM_PROMPT` 全文，供应商与模型留空（后台显示待配置）。
在后台「讲解员」里选好供应商和模型再发布，前台才会启用；没有已发布版本时前台统一提示「讲解服务暂时不可用，请稍后再试」。
重复执行 `db:seed` 不会新增版本、也不会覆盖 v1 上的修改和发布状态；库里已有的其他版本（比如老部署留下的 v2）照原样保留。

## 测试

`npm test` 用临时库快照跑接口测试，不写真实库，也不需要模型 Key。真实模型联调用 `npm run test:live`（`LIVE=1`，默认跳过）。
