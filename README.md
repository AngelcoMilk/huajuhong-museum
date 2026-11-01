# 化州橘红博览馆数字化展示系统

毕业设计项目：一个线上数字展厅，配一套轻量的内容管理后台和一个 AI 讲解员。展示站、接口服务和一段程序化 3D 动画都在这一个仓库里。

## 目录结构

| 目录 | 内容 |
|---|---|
| `site/` | 展示站与后台前端（React 19 + TypeScript + Vite） |
| `site/public/craft-3d/` | 工艺动画打包后的静态文件，由 `/craft` 页内嵌播放 |
| `server/` | 接口服务（Hono + Prisma + SQLite）：内容、后台、讲解员、购物 |
| `server/prisma/seed-data/` | 内容快照（JSON）。建库后由 seed 写入，不含数据库文件 |
| `process-3d/` | 工艺动画的源码（Three.js），单独构建后放进 `site/public/craft-3d/` |
| `knowledge/` | 史料调研、时间轴、条目来源（Markdown）与知识库切片数据 |
| `culture-kb/` | 知识库的原始交付：切片、同义词、核对报告 |
| `materials/` | 企业、园区、博物馆、产品、VR 的采集数据（JSON）与对照表（CSV） |
| `docs/` | 素材整理、VR 场景清单、机器参数卡、参考资料 |
| `assets/` | 字体授权文件和背景图素材 |

### 资料目录

`materials/` 是展示内容的原始采集数据，`site/src/data/` 里的几份 JSON 由脚本从它生成（改过原始数据后重跑）：

```sh
npm --prefix site run build:shop        # 生成 site/src/data/products.json
npm --prefix site run sync:enterprises  # 生成 site/src/data/enterprises.json
npm --prefix site run sync:hall         # 生成 site/src/data/park.json、museum.json
```

`knowledge/` 与 `culture-kb/` 是史料与知识库资料；其中 `knowledge/wiki/` 是后台「知识库」wiki 页签读取的目录，不能挪位置。`server/kb/` 下是讲解员实际检索的切片与同义词。`docs/` 是整理过程中的素材与核对文档，`assets/` 是字体授权文件和背景图素材。

## 功能

展示站：首页、园区展示、博物馆、历史文化（含文章页）、企业地图、产品中心、商品详情、购物车与下单、VR 全景、工艺动画。

管理后台（`/admin`）：展项与文章、VR 场景与分组、商品与库存、企业与坐标、知识库、讲解员配置、系统设置、账号与权限。首次登录强制改密。

讲解员：接任意 OpenAI 兼容接口的模型供应商。没有配置供应商时，讲解员提示暂不可用；在后台「模型供应商」里添加之后即可使用。

## 快速开始

需要 Node.js 22.18 或更高版本。命令都在仓库根目录执行。

```sh
npm --prefix server install
npm --prefix site install

cp server/.env.example server/.env
# 编辑 server/.env，至少填好 ADMIN_JWT_SECRET

npm --prefix server run db:deploy   # 建库：按 prisma/migrations 建表
npm --prefix server run db:seed     # 写入内容，并创建管理员
```

`db:seed` 会打印管理员用户名与初始口令。设了 `ADMIN_PASSWORD` 就用你设的值；没设则随机生成，只打印这一次，请立刻保存。

起服务：

```sh
npm --prefix server run dev         # 接口 http://127.0.0.1:3000
npm --prefix site run dev           # 站点 http://localhost:5173
```

站点开发服务器会把 `/api` 代理到 3000 端口。后台在 `http://localhost:5173/admin`。

## 环境变量

后端变量写在 `server/.env`，样例见 `server/.env.example`。

| 变量 | 必填 | 说明 |
|---|---|---|
| `DATABASE_URL` | 是 | SQLite 文件位置，默认 `file:./dev.db`，相对 `server/prisma/` |
| `ADMIN_JWT_SECRET` | 是 | 后台登录 token 的签名密钥，至少 16 字符。生成：`openssl rand -base64 32` |
| `SHOP_JWT_SECRET` | 生产必填 | 购物账号的 JWT 密钥，不能与 `ADMIN_JWT_SECRET` 相同 |
| `SECRETS_KEY` | 否 | 加密后台保存的供应商 Key；不填回落到 `ADMIN_JWT_SECRET` |
| `ADMIN_USERNAME` / `ADMIN_PASSWORD` | 否 | 仅 `db:seed` 使用 |
| `PORT` / `HOST` | 否 | 监听端口与地址，默认 `3000` / `127.0.0.1` |
| `SERVE_SITE` | 否 | 设 `1` 时由后端单端口托管 `site/dist` |
| `GUIDE_PROVIDER` / `GUIDE_MODEL` | 否 | 没有已发布讲解员配置时的默认模型 |
| `PI_MODELS_PATH` | 否 | 自定义模型表位置，默认用 pi 自己的 `~/.pi/agent/models.json` |

其余限流、并发、Cookie 相关的可选变量都写在 `server/.env.example` 的注释里。

## 生产部署

```sh
npm --prefix site run build                 # 产出 site/dist
cd server
NODE_ENV=production SERVE_SITE=1 npm start  # 一个端口同时提供接口与 site/dist
```

生产环境要求 `ADMIN_JWT_SECRET` 与 `SHOP_JWT_SECRET` 都配置好且互不相同，否则服务拒绝启动。没有用反向代理时保持 `HOST=127.0.0.1`，由前置的 Nginx 等转发；用了反向代理请设置 `TRUST_PROXY_HOPS` 与 `COOKIE_SECURE`。

## 重新构建 3D 动画

动画源码在 `process-3d/`，改完之后重新打包进站点：

```sh
cd process-3d
npm ci
npx vite build --base /craft-3d/ --outDir ../site/public/craft-3d --emptyOutDir
```

产物是纯静态文件，不需要后端。

## 内容与版权

展项文字与史料整理自化橘红官网（hzhjh.com.cn）与公开资料，版权归原作者。企业信息来自各企业公开资料。大部分图片与外链的全景地址直接指向原站，原站调整后可能失效。

VR 全景由第三方平台制作并提供播放页，本项目只做嵌入跳转，不抓取全景切片。缩略图保存在 `site/public/img/vr/`。3D 动画是本项目自己绘制的程序化图形，不含导出的模型与贴图；字体授权文件在 `assets/fonts/`，音频的授权说明见 `site/public/craft-3d/audio/CREDITS.md`。
