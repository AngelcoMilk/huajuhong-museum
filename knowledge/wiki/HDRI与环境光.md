---
title: HDRI 与环境光
source: 本会话调研；three.js 用法与 Poly Haven 许可
updated: 2026-10-20
---

# HDRI 与环境光

## 一句话

**给 3D 场景拍的一张 360° 全景照片，然后拿它同时当灯泡和镜子用。**

## 名字拆开

- **HDR**（High Dynamic Range）：32 bit 浮点，能记录真实世界几万倍亮度差。太阳、灯泡这种“超亮”的东西不会像 JPG 那样被压成纯白
- **I**（Image）：等距柱状投影的 360°×180° 全景，记录的是**你周围整个球面的光**

普通图片 8 bit（0–255）**不能当环境用**，高光会死。

---

## 为什么少了它模型就“假”

PBR 材质的观感公式大致是：`最终颜色 = 直接光照 + 环境反射`

three.js 默认场景**没有环境**：

| 材质 | 没有 HDRI | 有 HDRI |
|---|---|---|
| 不锈钢/镀铬 | 全黑，像黑洞 | 映出周围环境，一眼是金属 |
| 粗糙金属 | 一片死灰 | 柔和渐变，有体积感 |
| 塑料外壳 | 平、假 | 边缘有高光过渡 |
| 玻璃 | 看不见 | 有折射与反射 |

该设置只改变环境反射，不改动几何与材质参数。

---

## 三种用法，别混

| 用法 | 属性 | 效果 |
|---|---|---|
| 只当背景 | `scene.background` | 背后出现环境照片 |
| **只当光照**（看不见） | `scene.environment` | 背景纯色，但金属有反射 ← **产品展示最常用** |
| 两者都开 | 两个都设 | 沉浸式展厅感 |

工业设备展示常用第二种：背景用纯色，环境用 HDRI。

---

## three.js 用法

```js
import * as THREE from 'three'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'

renderer.toneMapping = THREE.ACESFilmicToneMapping   // 关键：不加会过曝
renderer.toneMappingExposure = 1.0

const pmrem = new THREE.PMREMGenerator(renderer)      // 预过滤，粗糙度才正确

new RGBELoader().load('/assets/hdri/studio_small_03_1k.hdr', (hdr) => {
  hdr.mapping = THREE.EquirectangularReflectionMapping
  const envMap = pmrem.fromEquirectangular(hdr).texture
  scene.environment = envMap
  scene.environmentIntensity = 1.0                    // three r155+ 可整体调亮度
  // scene.background = envMap                        // 想要背景也用它就加这行
  hdr.dispose(); pmrem.dispose()
})
```

R3F 写法更简单：

```jsx
import { Environment } from '@react-three/drei'
<Environment files="/assets/hdri/studio_small_03_1k.hdr" />
```

**三个必须记住的点：**

1. `mapping` 一定要设 `EquirectangularReflectionMapping`，不设就是一张平面贴图糊墙上
2. `PMREMGenerator` 不能省，否则粗糙金属反射像镜子一样锐利、很假
3. 必须开 tone mapping（ACES Filmic），否则高光区死白

---

## 去哪拿、拿多大

| 项 | 取值 |
|---|---|
| 来源 | **`polyhaven.com/hdris` —— 全部 CC0，可商用、免署名** |
| 格式 | `.hdr`（Radiance，体积小）或 `.exr`；three.js 都能读 |
| 分辨率 | 桌面 **2K** 够；移动 **1K**；**4K 以上是浪费**（只用来照明，不是拿来看的） |
| 体积参考 | 1K ≈ 1–3 MB，2K ≈ 5–10 MB，4K ≈ 20–40 MB |
| 想更小 | 转 **KTX2（Basis）** 能压到约 1/5，需解码器 |

**选哪张**：选 `studio` / `indoor` / `warehouse` 类，中性灰、柔光、有明确窗光方向。
户外晴天 HDRI 的阳光方向单一，会在金属表面反出明显的天空色。

---

## 五个常见故障

| 故障 | 症状 | 处理 |
|---|---|---|
| 用 JPG 当环境 | 高光爆死、反射不真实 | 必须 `.hdr` / `.exr` |
| 忘设 `mapping` | 环境像海报贴在盒子上 | `EquirectangularReflectionMapping` |
| 没开 tone mapping | 全画面过曝 | `ACESFilmicToneMapping` |
| 用 `file://` 打开 | 加载失败（CORS） | 起本地 server：`npx serve` |
| HDRI 太亮/太暗 | 机器发白或发黑 | 调 `environmentIntensity` 或 `toneMappingExposure` |

---

## 在本项目里用在哪

| 模块 | 要不要 HDRI |
|---|---|
| **首页柚子树** | **不要**。背景是程序化烘焙的（墙、天空、树影），自建光照管线 |
| **工序动画 3D** | 要（金属机器需要反射） |
| **成品 3D 展台** | **一定要**。七爪/圆果是干燥粗糙表面，没环境会显得像纸片 |

目录约定：

```
public/assets/hdri/
  studio_small_03_1k.hdr     ← 1K 起步，效果不够再换 2K
```

> 注意：首页和展台**不要共用一套光照逻辑**，一个是自建管线、一个是 PBR 环境光。

---

## 相关

- [技术选型-3D与流程图](技术选型-3D与流程图.md) —— 引擎与组件选型
- [3D素材与许可](3D素材与许可.md) —— HDRI 与模型都是 CC0 来源
- [质量标准](质量标准.md) —— 展台成品的性状特征

> 返回 [目录](../index.md) ｜ 极简入口 [START.md](../START.md) ｜ 规范 [AGENTS.md](../AGENTS.md)
