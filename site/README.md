# 展示站（site）

展示站与管理后台的前端。React 19 + TypeScript + Vite + React Router。

## 跑起来

```bash
npm install
npm run dev       # http://localhost:5173，/api 代理到 127.0.0.1:3000
npm run build     # 类型检查 + 打包到 dist/
npm run preview   # 预览打包结果
npm test          # 组件与状态相关的单元测试
npm run lint      # oxlint
```

`dev:mock` 用内置假数据跑购物流程，`dev:http` 强制走后端 HTTP。两者都只影响购物接口。

## 目录

```
src/
  pages/        展示站页面：首页、园区、博物馆、史料、企业、产品、购物、VR、工艺
  admin/        管理后台（/admin）：内容、VR、商品、企业、知识库、讲解员、设置、账号
  components/   共用组件：版式块、全景墙、企业卡与地图、购物件、讲解员浮层
  lib/          数据层：内容水合、购物适配器、讲解员客户端、工具函数
  data/         静态回落数据（接口不可用时用）
  styles/       展示区样式，令牌在 tokens.css
  types/        接口数据类型
public/
  craft-3d/     3D 动画打包产物，由 /craft 页内嵌
  fonts/        站内字体子集
  img/          版式图与商品图；img/vr/ 是全景缩略图
scripts/        地理数据脚本、静态回归脚本
```

## 与后端

页面默认从 `/api` 读内容。开发时 Vite 代理到后端 3000 端口；生产可以把 `site/dist` 交给后端托管（后端设 `SERVE_SITE=1`）。

3D 动画源码不在本目录，见仓库根目录的 `process-3d/`；重新打包的命令写在根 README 里。
