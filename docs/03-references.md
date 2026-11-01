# 参考资源

## 内容资料

| 资料 | 位置 | 用途 |
|---|---|---|
| 化州橘红完整调研报告 | 桌面 `化州橘红-完整调研报告-2026-10-19.md`（同名 `.html` 内容相同） | 展品文案、机器结构、知识库 |
| 化橘红官方网站 | https://www.hzhjh.com.cn/ | 展品文案、产品图片、宣传视频、知识库 |
| 产业园 VR 全景 | https://www.kuleiman.com/147899 | 用 iframe 嵌入"云游产业园" |
| 实体馆报道（金羊网，2026-05-01） | https://news.ycwb.com/ikimvkntkj/content_54096690.htm | 研究背景，展厅划分参考 |
| 实体馆报道（中新网，2026-03-10） | https://www.chinanews.com.cn/cj/2026/03-10/10584308.shtml | 研究背景 |

### 调研报告各章的用法

| 章节 | 用途 |
|---|---|
| §1 定义与名称、§3 发展历史、附录 A 时间轴 | 序厅、历史展厅的展品文案 |
| §2 道地性、§5 品种与种植 | 品种和产地相关的展品 |
| §6 生产流程 | 工序动画的工位划分和讲解 |
| §6.5 产品形态谱系 | 成品展台和产品类展品 |
| §7 专用机械装备 | 展厅里现代机械交互图的输入 |
| §8 质量标准、§9 化学成分与药理 | 只引用药典原文，不写功效宣传 |
| 附录 F 易错说法核查表 | 写文案时逐条核对 |
| 全文 | 知识库 |

### 官网栏目

页面地址格式为 `https://www.hzhjh.com.cn/h-col-<编号>.html`。

| 栏目 | 编号 | 用途 |
|---|---|---|
| 历史文化 | 210；子栏目：何为化橘红 211、历史悠久 218、典故逸事 220、诗歌文选 221、歌舞戏曲 222 | 历史展厅 |
| 化橘红加工 | 127 | 工序动画的讲解 |
| 产品中心 | 136；子栏目：干果 152、成药 153、制剂 154、饮品 155、食品 159、工艺品 156 | 产品类展品 |
| 视频中心 | 137；子栏目：宣传视频 201 | 视频素材 |
| 园区介绍 · VR 展示 | 165 | 论文的现状分析；嵌入 VR |

截至 2026-10-19，官网首页是服务端直接输出的 HTML，网站没有 robots.txt。

## 参考仓库

| 仓库 | 是什么 | 许可证 | 在本项目里的用途 |
|---|---|---|---|
| [wheresryan22/anatomy](https://github.com/wheresryan22/anatomy) | Claude Code 技能。它把机器画成等轴测交互图（SVG，可以叠加 WebGL 效果；3D 模式为 beta），输出 React 组件或单独的 HTML 页面 | MIT | 生成展厅里现代机械的交互图（古法加工动画不用它，是自写的 Three.js） |
| [earendil-works/pi](https://github.com/earendil-works/pi) | 轻量、可扩展的 Agent 框架（原 badlogic/pi-mono）。支持 DeepSeek，提供 TypeScript SDK，可以自定义工具 | MIT | 讲解员用的 Agent 框架 |
| [lfnovo/open-notebook](https://github.com/lfnovo/open-notebook) | 开源版 NotebookLM。技术栈为 Python + Next.js + SurrealDB + LangChain，用 Docker 部署；支持全文和向量检索，回答带引用，提供 REST API | MIT | 参考它处理知识库的流程；知识库插件先接它的检索接口 |
| [cclank/cell-architecture-studio](https://github.com/cclank/cell-architecture-studio) | 3D 细胞展馆，技术栈为 Vite + React 19 + React Three Fiber + drei | MIT | 参考成品 3D 展台和讲解侧栏的布局 |

## 各板块参考项目（2026-10-26 记录）

> 用途：做对应板块时先看这里，有可借鉴的就参考，没有的再补。明确不采用的已剔除。
> 说明：目前只有少数板块有代码级参考；多数板块只有“内容来源”，没有指定线上参考站。

| 板块 | 参考对象 | 类型 | 怎么用 | 状态 |
|---|---|---|---|---|
| 序厅 / 展厅整体 | [cclank/cell-architecture-studio](https://github.com/cclank/cell-architecture-studio)（MIT） | 代码/布局 | 3D 展台与讲解侧栏的布局 | 可参考 |
| 序厅 / 展陈顺序 | 金羊网实体馆报道（2026-05-01） | 展陈 | 序厅 → 历史 → 非遗 → 橘香屋 → 品鉴 → 文创，只作顺序参考 | 参考 |
| 园区展示 | 官网园区介绍 h-col 116/117/121/123/124/125 + VR 165 | 内容/VR | 7 个子栏目的图文结构 + 全景入口 | 内容已入库 |
| 博物馆展示 | 官网 VR（酷雷曼 147899，gid 91984）+ 博览馆文章 | 内容/VR | 馆内 8 场景 + 4 篇文章 | 内容已入库 |
| 历史文化 | 官网 h-col 210 及 7 个子栏目 | 内容 | 分类与原文 | 内容已入库；无代码参考 |
| 产品中心 | 官网 h-col 136 及 6 个大类 | 内容 | 产品分类与图文 | 内容已入库；无代码参考 |
| 企业展示 / 地图 | 官网 h-col 119 及 184–244 | 内容 | 企业档案、地图点位 | 内容已入库；地图参考待补 |
| 购物（购物车/模拟支付/手机号查询） | 暂无 | — | — | 待补参考 |
| 古法 3D 动画 | 无（自研 Three.js） | — | 四条产线动画 | 自研，不引外部模型 |
| 现代机械交互图 | [wheresryan22/anatomy](https://github.com/wheresryan22/anatomy)（MIT） | 代码 | 13 道工序的交互图 | 可参考 |
| 成品 3D 展台 | [cclank/cell-architecture-studio](https://github.com/cclank/cell-architecture-studio)（MIT） | 代码 | GLB 展台与视角切换 | 可参考 |
| AI 讲解员 | [earendil-works/pi](https://github.com/earendil-works/pi)（MIT） | 代码 | Agent 框架 | 采用 |
| 知识库 | [lfnovo/open-notebook](https://github.com/lfnovo/open-notebook)（MIT） | 代码/流程 | 检索与引用；先接后自写 | 采用 |

> 缺口：园区、博物馆、历史文化、产品、企业地图目前没有“线上参考站”，等要做视觉/交互时再按需补；购物模块新增，暂无对标。

## 版权与引用规范

- **抓取官网**：放慢速度，只抓需要的栏目，每条内容都记下来源地址。
- **展示内容**：展品页注明出处；抓来的内容不整站公开部署。
- **VR 全景**：用 iframe 嵌入并注明来源，不下载全景图。
- **借鉴代码**：借鉴 MIT 项目的代码时，保留许可证和署名。
- **建模参考图**：refs/ 与 assets/refs-huajuhong/ 里的实物照片版权属原媒体，只作内部建模参考，**不进公开仓库、不上线**。
- **写论文**：写明 anatomy、Claude Code 等 AI 工具的使用情况；古法 3D 动画是自写程序，应单独说明。
