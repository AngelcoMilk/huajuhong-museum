import { Group, InstancedMesh, Mesh, Object3D, Plane, Quaternion, Vector3, type MeshPhysicalMaterial } from 'three'
import type { AddSound } from '../audio/sound'
import type { AddShot } from '../camera'
import type { LightName } from '../gfx/env'
import type { Stage } from '../stage'
import { clamp, hop, keys, lerp, rng, seg, smooth, smoother, smoothstep } from '../util'
import { discGeometry, discMaterial, FORM } from '../world/cake'
import { CUTTER } from '../world/cutter'
import { LAYOUT } from '../world/layout'
import { Jar } from '../world/tai'
import { COVER, FruitPress, FRUIT_PRESS, TUBE, Tubes } from '../world/tube'
import { Act } from './act'

// 压果片：烫过的整果小火烘软、缩小一大半 → 木压果器压成椭圆 → 套进竹筒定型 → 竹筒竖在竹筛上盖竹罩接着烘
// → 木棍顶出毛绒圆柱 → 切药刀横切成厚实的小圆片 → 一簸箕圆片倒进罐里。工艺照实拍做，物件自己动，不画手。
// 压果、入筒、切片只演主角一个；另外九个要出现时已经是做好的样子。章节之间有纸色遮罩，每段开头约 2 秒看不清，动作从那以后开始。

const v = (x: number, y: number, z: number) => new Vector3(x, y, z)
const UP = new Vector3(0, 1, 0)
const XAX = new Vector3(1, 0, 0)
const ZAX = new Vector3(0, 0, 1)

// 声音该响的时刻：数字只写在这里，声音只引用名字。这个文件里有六段，各自一张表。
const AT_OVEN = {
  hiss: 0.5, // 刚摆上焙炉，湿热的一激
  flip: 8.2, // 翻面落下
} as const
const AT_PRESS = {
  first: 3.6, // 第一下压住
  second: 6, // 第二下压实
} as const
const AT_TUBE = {
  seat: 4, // 果子卡进筒口
  push: 7.2, // 木棍把果子压进筒里
} as const
const AT_COVER = {
  down: 4.3, // 竹罩落下
  up: 9.2, // 竹罩揭开
} as const
const AT_SLICE = {
  drop: 7.3, // 圆柱顶出来落在板上
  setDown: 10.1, // 放到切药刀上
} as const
const AT_JAR = {
  pour: 5.8, // 圆片开始滑下去
  first: 6.3, // 第一片落进罐里
  lidUp: 11.65, // 木盖拿起来
  lidOn: 12.97, // 木盖盖上
} as const

/** 罐子立在底板前面的案上 */
const JAR_K = 0.9
const JAR_AT = new Vector3(LAYOUT.press.x, LAYOUT.tableTop + 0.01, LAYOUT.press.z + 33)

/** 新物件只在压果片这条线上才建（入口页排时长时不建），挂在这条线自己的院子里 */
const GEAR = new WeakMap<object, { tubes: Tubes; press: FruitPress; jar: Jar }>()
function gear(s: Stage) {
  let g = GEAR.get(s.w)
  if (!g) {
    g = { tubes: new Tubes(), press: new FruitPress(), jar: new Jar() }
    g.press.group.visible = false
    // 这只罐子的玻璃更透一点，里面的片不发灰（是自己的材质，不影响别的线）
    ;((g.jar.group.children[0] as Mesh).material as MeshPhysicalMaterial).opacity = 0.11
    g.jar.group.scale.setScalar(JAR_K)
    g.jar.lid.scale.setScalar(JAR_K)
    g.jar.group.position.copy(JAR_AT)
    g.jar.group.visible = false
    g.jar.lid.visible = false
    s.w.scene.add(g.tubes.group, g.press.group, g.jar.group, g.jar.lid)
    GEAR.set(s.w, g)
  }
  return g
}

/** 主角压完以后在底板上的位置（相对底板中心），竹筒就立在这里 */
const HOME = { x: 0, z: 15.5 }
/** 主角开场在木座前面（相对木座中心），放上去 */
const PUT_FROM = { x: 0, z: 13 }
/** 压果器的木座中心（相对底板中心） */
const SEAT = { x: -10, z: -2 }

/** 焙炉竹筛上：正中一个（主角），外面一圈九个 */
const OVEN_SLOTS: { x: number; z: number; yaw: number }[] = (() => {
  const r = rng(303)
  const s = [{ x: 0, z: 0, yaw: 0.2 }]
  for (let k = 0; k < 9; k++) {
    const a = ((10 + 40 * k) * Math.PI) / 180 + (r() - 0.5) * 0.12
    const rr = 20 + (r() - 0.5) * 1.6
    s.push({ x: Math.cos(a) * rr, z: Math.sin(a) * rr, yaw: r() * 6.28 })
  }
  return s
})()

/** 压过以后平躺：长轴（本地 y）沿 x，压扁的方向（本地 z）朝上 */
const FLAT = new Quaternion().setFromAxisAngle(XAX, -Math.PI / 2).premultiply(new Quaternion().setFromAxisAngle(UP, Math.PI / 2))
/** 圆柱横躺、长轴朝 +x（顶出来的时候） */
const ALONG_X = new Quaternion().setFromAxisAngle(ZAX, -Math.PI / 2)
/** 圆柱横躺、长轴朝 +z（在切药刀上，往前推） */
const ALONG_Z = new Quaternion().setFromAxisAngle(XAX, Math.PI / 2)
const IDENT = new Quaternion()

/** 果子完全进筒以后，果心离筒底多高（圆柱顶比筒口低一点） */
const IN_TUBE = TUBE.len - 0.1 - FORM.cylH

// ———— 初烘 ————

export class CakeOven extends Act {
  private q = new Quaternion()
  private qf = new Quaternion()

  constructor(s: Stage, id = 'cakeOven') {
    super(s, id, 16)
  }

  lights(): [number, LightName][] {
    return [
      [0, 'forenoon'],
      [8.6, 'noon'],
      [15.4, 'noon'],
    ]
  }

  carry(t: number) {
    const s = this.s
    const f = smoothstep(1.5, 15, t)
    s.w.cakes!.form.dry = f
    if (t < 0) return
    s.look.wet *= 1 - smoothstep(0, 4, t)
    s.look.dry = Math.max(s.look.dry, f)
    if (t < this.dur) {
      s.carry.ovenOn = Math.max(s.carry.ovenOn, smoothstep(0, 1.5, t))
      s.carry.haze = Math.max(s.carry.haze, smoothstep(0.5, 2.5, t) * (1 - smoothstep(this.dur - 1, this.dur, t)) * 0.8)
      s.carry.bloom = 0.32
    }
  }

  shots(add: AddShot) {
    const L = LAYOUT
    const s = this.s
    const O = v(L.oven.x, L.ovenTop + 1, L.oven.z)
    add(0, 6.4, { target: O, dist: 112, az: 18, el: 32, fov: 32, ap: 0.09 }, { target: O, dist: 98, az: 28, el: 34, fov: 32, ap: 0.1 })
    add(6.4, 11, { target: s.fruitCenter, dist: 32, az: 24, el: 40, fov: 30, ap: 0.3 }, { target: s.fruitCenter, dist: 24, az: 8, el: 40, fov: 30, ap: 0.34 }, 1.2)
    add(11, 16, { target: O, dist: 72, az: -4, el: 50, fov: 32, ap: 0.12 }, { target: O, dist: 64, az: 10, el: 52, fov: 32, ap: 0.13 }, 1.2)
  }

  sounds(add: AddSound) {
    const L = LAYOUT
    const at = v(L.oven.x, L.ovenTop, L.oven.z)
    add(AT_OVEN.hiss, 'hiss', { dur: 5, gain: 0.45, at })
    for (let i = 0; i < 10; i++) add(AT_OVEN.flip + i * 0.1 - 0.02, 'tap', { gain: 0.28, pitch: 0.7, at })
  }

  /** 这条线上每一帧都要做的：院子里的压石、顶板收起来，新物件先藏好 */
  hide() {
    const w = this.s.w
    w.table.stone.visible = false
    w.table.topBoard.visible = false
    w.cakes!.resetScale()
    const g = GEAR.get(w)
    if (g) {
      g.tubes.hideAll()
      g.press.group.visible = false
    }
  }

  pose(t: number) {
    const s = this.s
    const L = LAYOUT
    const c = s.w.cakes!
    const lift = c.lift(c.form.dry) + 0.03
    const pos = new Vector3()
    for (let i = 0; i < 10; i++) {
      const sl = s.layout.sieve[i]
      // 烘一阵，翻一面
      const f = smoother(seg(t, AT_OVEN.flip - 1.2 + i * 0.1, AT_OVEN.flip + i * 0.1))
      pos.set(L.oven.x + sl.x, L.ovenTop + lift + Math.sin(Math.PI * f) * 7.5, L.oven.z + sl.y)
      this.q.setFromAxisAngle(XAX, f * Math.PI).multiply(this.qf.copy(s.fruitRot(i)))
      if (i === 0) {
        s.setHeroByCenter(pos, this.q)
        s.applyHero()
      } else c.setFruit(i, pos, this.q)
    }
    c.show(true)
    // 烫过的果刚上炉，冒一点热气
    s.w.batchSteam.set(v(L.oven.x, L.ovenTop + 3, L.oven.z), 0.45 * smoothstep(0.5, 2.5, t) * (1 - smoothstep(4, 7, t)))
  }
}

// ———— 压果 ————

export class PressFruit extends Act {
  private q = new Quaternion()

  constructor(s: Stage, id = 'press') {
    super(s, id, 13)
  }

  /** 主角压到什么程度：压一下，抬起来，再压实 */
  private ovalAt(t: number) {
    return keys(t, [[3.2, 0], [3.9, 0.7], [5.6, 0.7], [6.2, 1]])
  }
  /** 主角压的那几秒，板子自己抬多高（压住的时候由果子的高度决定） */
  private openAt(t: number) {
    return keys(t, [[2.6, 0.62], [3.6, 0], [4.4, 0], [5, 0.5], [5.3, 0.5], [5.9, 0], [7, 0], [8, 0.62]])
  }

  carry(t: number) {
    this.s.w.cakes!.form.oval = this.ovalAt(t)
  }

  lights(): [number, LightName][] {
    return [
      [0, 'afternoon'],
      [12.4, 'afternoon'],
    ]
  }

  private seat() {
    const L = LAYOUT
    return v(L.press.x + SEAT.x, L.press.y + FRUIT_PRESS.height, L.press.z + SEAT.z)
  }

  shots(add: AddShot) {
    const c = this.seat().add(v(0, 1.8, 0))
    add(0, 2.6, { target: c, dist: 46, az: 26, el: 18, fov: 30, ap: 0.2 }, { target: c, dist: 40, az: 22, el: 16, fov: 30, ap: 0.22 })
    add(2.6, 8, { target: c, dist: 36, az: 20, el: 13, fov: 30, ap: 0.24 }, { target: c, dist: 32, az: 14, el: 14, fov: 30, ap: 0.24 }, 0.8)
    add(8, 13, { target: c, dist: 30, az: 12, el: 20, fov: 30, ap: 0.26 }, { target: c, dist: 25, az: 4, el: 26, fov: 30, ap: 0.3 }, 0.8)
  }

  sounds(add: AddSound) {
    const at = this.seat()
    add(AT_PRESS.first, 'squish', { dur: 1.1, gain: 0.4, at })
    add(AT_PRESS.second, 'squish', { dur: 0.9, gain: 0.32, at })
  }

  pose(t: number) {
    const s = this.s
    const c = s.w.cakes!
    const { press } = gear(s)
    const seat = this.seat()
    const O = FORM.oval
    const r0 = FORM.shrunk
    press.group.visible = true
    press.group.position.copy(seat)

    // 主角：从木座前面放上去，压，抬起来还留在木座上
    const oval = c.form.oval
    const heroZ = lerp(r0, O.z, oval)
    const inSeat = v(seat.x, seat.y + heroZ + 0.02, seat.z)
    const from = v(seat.x + PUT_FROM.x, LAYOUT.press.y + r0, seat.z + PUT_FROM.z)
    const put = seg(t, 1.4, 2.6)
    const hp = put < 1 ? hop(new Vector3(), from, inSeat, put, 2.2) : inSeat
    s.setHeroByCenter(hp, this.q.copy(s.fruitRot(0)).slerp(FLAT, smoother(put)))
    s.applyHero()
    press.setOpen(Math.max(this.openAt(t), press.angleOnto(0, lerp(r0, O.y, oval), heroZ)))
  }
}

// ———— 入筒 ————

const SEATED_Y = TUBE.len + 0.9 // 卡在筒口时果心的高度

export class IntoTube extends Act {
  private q = new Quaternion()

  constructor(s: Stage, id = 'tube') {
    super(s, id, 10)
  }

  /** 主角果心离底板多高 */
  private yAt(t: number) {
    return keys(t, [[1.6, FORM.oval.z], [2.8, TUBE.len + FORM.oval.y + 0.5], [3.1, TUBE.len + FORM.oval.y + 0.5], [4.1, SEATED_Y], [6, SEATED_Y], [7.6, IN_TUBE]])
  }
  private cylAt(t: number) {
    return keys(t, [[3.1, 0], [4.1, 0.35], [6, 0.35], [7.6, 1]])
  }

  carry(t: number) {
    const f = this.s.w.cakes!.form
    f.cyl = this.cylAt(t)
    // 进筒的这一段：筒口以下收进筒里
    if (t >= 3.1 && t < 7.6) {
      f.mouth = TUBE.len - this.yAt(t)
      f.mouthR = TUBE.rIn - 0.03
    } else {
      f.mouth = undefined
      f.mouthR = undefined
    }
  }

  lights(): [number, LightName][] {
    return [
      [0, 'afternoon'],
      [9.4, 'afternoon'],
    ]
  }

  shots(add: AddShot) {
    const L = LAYOUT
    const c = v(L.press.x + HOME.x + 1.5, L.press.y + 5.5, L.press.z + HOME.z)
    add(0, 10, { target: c, dist: 36, az: 22, el: 12, fov: 30, ap: 0.2 }, { target: c, dist: 29, az: 10, el: 20, fov: 30, ap: 0.22 })
  }

  sounds(add: AddSound) {
    const L = LAYOUT
    const at = v(L.press.x, L.press.y, L.press.z + 15)
    add(AT_TUBE.seat, 'squish', { dur: 0.5, gain: 0.25, at })
    add(AT_TUBE.push, 'knock', { gain: 0.25, pitch: 1.4, at })
  }

  pose(t: number) {
    const s = this.s
    const L = LAYOUT
    const c = s.w.cakes!
    const { tubes } = gear(s)
    tubes.setAge(0)
    const m = tubes.tubes[0]
    m.visible = true
    m.rotation.set(0, 0, 0)
    m.position.set(L.press.x + HOME.x, L.press.y + 0.02, L.press.z + HOME.z)
    // 主角：躺在筒边，立起来，卡进筒口；木棍压下去
    const y = this.yAt(t)
    const x = keys(t, [[1.9, 5], [3, 0]])
    const hp = v(L.press.x + HOME.x + x, L.press.y + y, L.press.z + HOME.z)
    s.setHeroByCenter(hp, this.q.copy(FLAT).slerp(IDENT, smoother(seg(t, 1.7, 3))))
    s.applyHero()
    const rod = tubes.rod
    rod.visible = t > 5 && t < 8.8
    if (rod.visible) {
      const top = hp.y + lerp(FORM.oval.y, FORM.cylH, c.form.cyl)
      const y1 = L.press.y + 34
      const tip = t < 6 ? lerp(y1, L.press.y + SEATED_Y + lerp(FORM.oval.y, FORM.cylH, 0.35), smoother(seg(t, 5, 6))) : t < 7.6 ? top : lerp(top, y1, smoother(seg(t, 7.6, 8.8)))
      rod.rotation.set(0, 0, 0)
      rod.position.set(hp.x, tip, hp.z)
    }
  }
}

// ———— 筒烘 ————

export class TubeOven extends Act {
  constructor(s: Stage, id = 'cover') {
    super(s, id, 14.5)
  }

  lights(): [number, LightName][] {
    return [
      [0, 'afternoon'],
      [4.8, 'golden'],
      [13.9, 'dusk'],
    ]
  }

  carry(t: number) {
    const c = this.s.carry
    if (t < 0 || t >= this.dur) return
    c.ovenOn = Math.max(c.ovenOn, smoothstep(0, 1.5, t))
    c.haze = Math.max(c.haze, smoothstep(0.5, 2.5, t) * (1 - smoothstep(this.dur - 1, this.dur, t)) * 0.7)
    c.bloom = 0.3
    c.lapse = Math.max(c.lapse, 300 * smoothstep(4.4, 9.2, t))
  }

  shots(add: AddShot) {
    const L = LAYOUT
    const O = v(L.oven.x, L.ovenTop + 6, L.oven.z)
    add(0, 4.6, { target: O, dist: 96, az: 16, el: 28, fov: 32, ap: 0.09 }, { target: O, dist: 110, az: 22, el: 24, fov: 32, ap: 0.09 })
    add(4.6, 9, { target: O, dist: 112, az: 24, el: 22, fov: 32, ap: 0.09 }, { target: O, dist: 104, az: 12, el: 24, fov: 32, ap: 0.09 }, 1.0)
    add(9, 11.6, { target: O, dist: 96, az: 8, el: 30, fov: 32, ap: 0.1 }, { target: O, dist: 72, az: 4, el: 36, fov: 32, ap: 0.12 }, 1.0)
    add(11.6, 14.5, { target: v(O.x, L.ovenTop + 4, O.z + 4), dist: 54, az: 2, el: 40, fov: 30, ap: 0.16 }, { target: v(O.x, L.ovenTop + 4, O.z + 2), dist: 40, az: 14, el: 38, fov: 30, ap: 0.2 }, 1.0)
  }

  sounds(add: AddSound) {
    const L = LAYOUT
    const at = v(L.oven.x, L.ovenTop, L.oven.z)
    add(AT_COVER.down, 'rustle', { dur: 0.6, gain: 0.45, at })
    add(AT_COVER.up, 'rustle', { dur: 0.6, gain: 0.4, at })
  }

  pose(t: number) {
    const s = this.s
    const L = LAYOUT
    const c = s.w.cakes!
    const { tubes } = gear(s)
    tubes.setAge(smoothstep(4.6, 9.2, t))
    const pos = new Vector3()
    for (let i = 0; i < 10; i++) {
      const sl = OVEN_SLOTS[i]
      const y = L.ovenTop + 0.02
      const m = tubes.tubes[i]
      m.visible = true
      m.rotation.set(0, sl.yaw, 0)
      m.position.set(L.oven.x + sl.x, y, L.oven.z + sl.z)
      pos.set(m.position.x, y + IN_TUBE, m.position.z)
      if (i === 0) {
        s.setHeroByCenter(pos, IDENT)
        s.applyHero()
      } else {
        c.setFruit(i, pos, IDENT)
        c.setOval(i, 1, 1)
      }
    }
    c.show(true)
    // 竹罩：落下来盖住，烘够了再揭开
    const lift = keys(t, [[2.2, 70], [4.4, 0], [9.2, 0], [11.2, 70]])
    tubes.cover.visible = t > 2.2 && t < 11.2
    tubes.cover.position.set(L.oven.x, L.ovenTop + COVER.seat + lift, L.oven.z)
  }
}

// ———— 切片 ————

/**
 * 片一片片落下来堆着：每片按它平躺时占的那块地（转过的长方形），找底下已经堆了多高，搁在最高处上面。
 * 这样片和片不会插在一起，也不会两片停在同一高度叠着（那样会闪）。
 */
class Heap {
  private h: Float32Array
  private n: number
  constructor(
    private x0: number,
    private z0: number,
    size: number,
    private floor: number,
    private cell = 0.4,
  ) {
    this.n = Math.ceil(size / cell)
    this.h = new Float32Array(this.n * this.n).fill(floor)
  }
  /** 放一片（中心 cx、cz，转 yaw，半宽 hw、半深 hd，厚 th），返回它底面的高度 */
  place(cx: number, cz: number, yaw: number, hw: number, hd: number, th: number) {
    const c = Math.cos(yaw)
    const s = Math.sin(yaw)
    const R = Math.hypot(hw, hd)
    const cells: number[] = []
    let top = this.floor
    const i0 = Math.max(0, Math.floor((cx - R - this.x0) / this.cell))
    const i1 = Math.min(this.n - 1, Math.ceil((cx + R - this.x0) / this.cell))
    const j0 = Math.max(0, Math.floor((cz - R - this.z0) / this.cell))
    const j1 = Math.min(this.n - 1, Math.ceil((cz + R - this.z0) / this.cell))
    for (let i = i0; i <= i1; i++) {
      for (let j = j0; j <= j1; j++) {
        const dx = this.x0 + (i + 0.5) * this.cell - cx
        const dz = this.z0 + (j + 0.5) * this.cell - cz
        // 转回片自己的坐标看在不在长方形里（片的长边沿 x，转了 yaw）
        const lx = dx * c - dz * s
        const lz = dx * s + dz * c
        if (Math.abs(lx) <= hw + this.cell * 0.5 && Math.abs(lz) <= hd + this.cell * 0.5) {
          const k = i * this.n + j
          cells.push(k)
          top = Math.max(top, this.h[k])
        }
      }
    }
    const base = top + 0.012
    for (const k of cells) this.h[k] = base + th
    return base
  }
}

/**
 * 簸箕里的片：一片片撒下去，落在哪就顺着底下的东西躺下——底下平就平躺，一头搭在别的片上就斜着靠过去
 * （像一块木板搁在高低不平的地上：重心在中间，靠在中间两边最高的两个支点上）。
 * 每片撒的时候比几个地方，落到最低的那个（簸箕一颠，片会往空当里走），所以先铺满底、再搭着叠，不会一摞摞堆高。
 */
class Settle {
  private h: Float32Array
  private n: number
  private covered = 0
  constructor(
    private x0: number,
    private z0: number,
    size: number,
    readonly floor: number,
    private cell = 0.25,
  ) {
    this.n = Math.ceil(size / cell)
    this.h = new Float32Array(this.n * this.n).fill(floor)
  }

  /** 片底下压着的格子：(格子号, 片上纵向 s, 横向 u) */
  private cells(x: number, z: number, yaw: number, hw: number, hd: number) {
    const c = Math.cos(yaw)
    const sn = Math.sin(yaw)
    const R = Math.hypot(hw, hd)
    const out: [number, number, number][] = []
    const i0 = Math.max(0, Math.floor((x - R - this.x0) / this.cell))
    const i1 = Math.min(this.n - 1, Math.ceil((x + R - this.x0) / this.cell))
    const j0 = Math.max(0, Math.floor((z - R - this.z0) / this.cell))
    const j1 = Math.min(this.n - 1, Math.ceil((z + R - this.z0) / this.cell))
    for (let i = i0; i <= i1; i++) {
      for (let j = j0; j <= j1; j++) {
        const dx = this.x0 + (i + 0.5) * this.cell - x
        const dz = this.z0 + (j + 0.5) * this.cell - z
        const u = dx * c - dz * sn
        const w = dx * sn + dz * c
        if (Math.abs(u) <= hw && Math.abs(w) <= hd) out.push([i * this.n + j, u, w])
      }
    }
    return out
  }

  /** 一条板搁在一串高度上（按位置排好）：重心在 0，找它靠着的那条线（上凸包跨过 0 的那段） */
  private static lean(pts: [number, number][], maxSlope: number) {
    const hull: [number, number][] = []
    for (const p of pts) {
      while (hull.length >= 2) {
        const [ax, ay] = hull[hull.length - 2]
        const [bx, by] = hull[hull.length - 1]
        if ((bx - ax) * (p[1] - ay) - (by - ay) * (p[0] - ax) >= 0) hull.pop()
        else break
      }
      hull.push(p)
    }
    let k = 0
    while (k < hull.length - 2 && hull[k + 1][0] < 0) k++
    const [ax, ay] = hull[k]
    const [bx, by] = hull[Math.min(k + 1, hull.length - 1)]
    let slope = bx > ax ? (by - ay) / (bx - ax) : 0
    slope = clamp(slope, -maxSlope, maxSlope)
    // 斜度封了顶就整条抬到碰得到最高点
    let base = -Infinity
    for (const [x, y] of pts) base = Math.max(base, y - slope * x)
    return { base, slope }
  }

  /** 片落在 (x, z)、转 yaw 时怎么躺：底面中心高度、纵向和横向的斜度 */
  rest(x: number, z: number, yaw: number, hw: number, hd: number) {
    const cs = this.cells(x, z, yaw, hw, hd)
    const bin = this.cell
    const along = new Map<number, number>()
    for (const [k, u] of cs) {
      const b = Math.round(u / bin)
      along.set(b, Math.max(along.get(b) ?? -Infinity, this.h[k]))
    }
    const pa = [...along.entries()].sort((p, q) => p[0] - q[0]).map(([b, y]) => [b * bin, y] as [number, number])
    const L = Settle.lean(pa, 0.6)
    const across = new Map<number, number>()
    for (const [k, u, w] of cs) {
      const b = Math.round(w / bin)
      across.set(b, Math.max(across.get(b) ?? -Infinity, this.h[k] - (L.base + L.slope * u)))
    }
    const pc = [...across.entries()].sort((p, q) => p[0] - q[0]).map(([b, y]) => [b * bin, y] as [number, number])
    const C = Settle.lean(pc, 0.5)
    return { y: L.base + C.base, b: L.slope, c: C.slope, cells: cs }
  }

  /** 片躺下了：它盖住的格子抬到片的上表面 */
  add(r: { y: number; b: number; c: number; cells: [number, number, number][] }, th: number) {
    const t = th * Math.hypot(1, r.b, r.c)
    for (const [k, u, w] of r.cells) {
      if (this.h[k] <= this.floor + 1e-4) this.covered++
      this.h[k] = Math.max(this.h[k], r.y + r.b * u + r.c * w + t)
    }
  }
  /** 底面盖住了多少（格子数） */
  get coveredCells() {
    return this.covered
  }
}

/** 平躺：片的厚度方向（本地 z）转到竖直，再绕竖轴转 yaw */
function layQ(yaw: number, out = new Quaternion()) {
  return out.setFromAxisAngle(XAX, -Math.PI / 2).premultiply(new Quaternion().setFromAxisAngle(UP, yaw))
}

const D = FORM.disc // 片厚（厘米）
/** 第一刀切掉圆头，从这里开始是整片（主角本地 y） */
const Y0 = FORM.cylH - FORM.cylDome
const DISCS = Math.floor((2 * Y0) / D)
/** 第 k 刀切在主角本地 y 的哪里（0 是切掉圆头那一刀） */
const yCut = (k: number) => Y0 - k * D
/** 一刀的节奏：推、压、抬。头三刀慢，看清怎么切，后面快起来 */
const CHOP0 = 10.6
const CHOP_SLOW = 1.2
const CHOP_FAST = 0.62
/** 刀走到第几下（k + 这一下的进度）是什么时候 */
const chopTime = (ph: number) => CHOP0 + (ph <= 3 ? ph * CHOP_SLOW : 3 * CHOP_SLOW + (ph - 3) * CHOP_FAST)
/** 这一刻刀走到第几下（chopTime 的反过来） */
const chopPhase = (t: number) => {
  const a = t - CHOP0
  return a <= 3 * CHOP_SLOW ? a / CHOP_SLOW : 3 + (a - 3 * CHOP_SLOW) / CHOP_FAST
}
/** 木棍顶圆柱：竹筒横躺在底板上（相对底板中心），筒口朝 -x */
const OUT = { x: -8, z: 13 }
const OUT_T = { rodIn: 1.2, touch: 2.2, out: 6.6 }
/** 圆柱顶出来停一下，再拿到切药刀上 */
const TO_BED = { from: 8.4, to: 10.2 }

export class Slice extends Act {
  readonly group = new Group()
  /** 切下来的圆片（只切主角这一个） */
  private discs: Mesh[] = []
  private spots: { c: Vector3; q: Quaternion }[] = []
  private heel = new Group()
  private heelMesh!: Mesh
  private cap!: Mesh
  private plane = new Plane(new Vector3(0, 0, -1), 0)
  private heelPlane = new Plane(new Vector3(0, 0, 1), 0)
  private q = new Quaternion()
  private built = false

  constructor(s: Stage, id = 'slice') {
    super(s, id, 23.4)
  }

  carry(t: number) {
    const c = this.s.w.cakes!
    c.rind = smoothstep(TO_BED.from - 0.4, TO_BED.to - 0.2, t) * 0.8
  }

  prepare() {
    this.build()
    // 主角切片时带裁切面，是另一份着色器：预热时也编上
    this.s.w.cakes!.setClip([this.plane])
    this.group.visible = true
  }

  /** 片、裁口第一次用到的时候再建（入口页只算时长，不建模型） */
  private build() {
    if (this.built) return
    this.built = true
    const s = this.s
    const c = s.w.cakes!
    const mat = discMaterial()
    for (let k = 0; k < DISCS; k++) {
      const m = new Mesh(discGeometry(k + 1, D * 0.96), mat)
      m.castShadow = true
      m.receiveShadow = true
      this.discs.push(m)
      this.group.add(m)
    }
    // 主角切口上盖一片，切掉的圆头切口上也盖一片
    this.cap = new Mesh(discGeometry(40, 0.02, 0.4, FORM.cylR * 0.985), mat)
    this.cap.rotation.x = -Math.PI / 2
    c.heroGroup.add(this.cap)
    c.matHeel.clippingPlanes = [this.heelPlane]
    this.heelMesh = new Mesh(c.heroShape.geo, c.matHeel)
    this.heelMesh.castShadow = true
    this.heel.add(this.heelMesh)
    const heelCap = new Mesh(discGeometry(41, 0.02, 0.4, FORM.cylR * 0.985), mat)
    heelCap.rotation.x = Math.PI / 2
    heelCap.position.y = Y0 + 0.01
    this.heel.add(heelCap)
    this.group.add(this.heel)
    // 每片落在哪：从刀口翻下来，落在木座前面不远，一片片按落下的先后堆起来
    const b = this.base()
    const heap = new Heap(b.x - 30, b.z - 2, 60, LAYOUT.press.y)
    const r = rng(311)
    const R = FORM.cylR
    for (let i = 0; i < DISCS; i++) {
      const cx = b.x + 4 + (r() * 2 - 1) * 5
      const cz = b.z + 3.4 + r() * 3.6
      const yaw = r() * 6.28
      const y = heap.place(cx, cz, yaw, R, R, D * 0.96)
      this.spots.push({ c: new Vector3(cx, y + D * 0.48, cz), q: layQ(yaw) })
    }
    s.w.scene.add(this.group)
  }

  sounds(add: AddSound) {
    const b = this.base()
    const at = v(b.x + 4, b.y, b.z)
    add(AT_SLICE.drop, 'tap', { gain: 0.3, pitch: 0.85, at })
    add(AT_SLICE.setDown, 'knock', { gain: 0.3, pitch: 1.6, at })
    // 每一刀：刀压到底那一下脆响，切下来的片翻倒落在刀前
    for (let k = 0; k <= DISCS; k++) {
      add(chopTime(k + 0.58), 'chop', { gain: 0.7, pitch: 0.95 + 0.025 * ((k * 7) % 5), at })
      add(this.offAt(k) + 0.5, 'tap', { gain: 0.2, pitch: 1.2, at })
    }
  }

  /** 木座摆在压板底板上：前沿朝外（+z） */
  private base() {
    const L = LAYOUT
    return v(L.press.x, L.press.y + CUTTER.height, L.press.z - 4)
  }

  /** 第 k 刀什么时候断开（刀压到底那一下） */
  private offAt(k: number) {
    return chopTime(k + 0.55)
  }

  hide() {
    const c = this.s.w.cutter
    if (c) c.group.visible = false
    if (!this.built) return
    this.group.visible = false
    this.cap.visible = false
  }

  lights(): [number, LightName][] {
    return [
      [0.6, 'forenoon'],
      [22.8, 'afternoon'],
    ]
  }

  shots(add: AddShot) {
    const L = LAYOUT
    const b = this.base()
    const cutZ = b.z + CUTTER.bladeZ
    const edge = v(b.x + 4, b.y + 1.5, cutZ + 0.5)
    const out = v(L.press.x + OUT.x - 1, L.press.y + 2.2, L.press.z + OUT.z)
    const pile = v(b.x + 4, L.press.y + 1, b.z + 5)
    add(0, 4.6, { target: out, dist: 38, az: 10, el: 16, fov: 30, ap: 0.2 }, { target: out, dist: 32, az: 4, el: 14, fov: 30, ap: 0.22 })
    add(4.6, 8.4, { target: v(out.x - 5, out.y - 0.6, out.z), dist: 22, az: 4, el: 16, fov: 30, ap: 0.32 }, { target: v(out.x - 6, out.y - 0.6, out.z), dist: 18, az: -8, el: 18, fov: 30, ap: 0.36 }, 0.8)
    add(8.4, 10.6, { target: v(b.x + 2, b.y - 2, b.z + 2), dist: 70, az: 24, el: 28, fov: 30, ap: 0.12 }, { target: edge, dist: 44, az: 30, el: 24, fov: 30, ap: 0.18 }, 0.6)
    add(10.6, 15.2, { target: edge, dist: 22, az: 36, el: 18, fov: 30, ap: 0.34 }, { target: edge, dist: 19, az: 44, el: 16, fov: 30, ap: 0.36 }, 0.8)
    add(15.2, 19.8, { target: v(b.x + 4, b.y - 2.5, b.z + 1.5), dist: 32, az: 12, el: 32, fov: 30, ap: 0.22 }, { target: v(b.x + 4, b.y - 2.5, b.z + 1.5), dist: 29, az: 2, el: 36, fov: 30, ap: 0.24 }, 1.0)
    add(19.8, 23.4, { target: pile, dist: 15, az: -6, el: 56, fov: 30, ap: 0.3 }, { target: pile, dist: 12.5, az: 6, el: 60, fov: 30, ap: 0.32 }, 1.0)
  }

  pose(t: number) {
    const s = this.s
    const w = s.w
    const L = LAYOUT
    const c = w.cakes!
    const cut = w.cutter!
    const { tubes } = gear(s)
    this.build()
    const b = this.base()
    cut.group.visible = true
    cut.group.position.copy(b)
    this.group.visible = true
    tubes.setAge(1)

    // 主角的竹筒横躺，木棍从后头顶进去
    const by = L.press.y + TUBE.r + 0.02
    const x0 = L.press.x + OUT.x
    const zOut = L.press.z + OUT.z
    const ht = tubes.tubes[0]
    ht.visible = true
    ht.rotation.set(0, 0, -Math.PI / 2)
    ht.position.set(x0, by, zOut)

    // 圆柱：贴着筒的下壁往外走
    const inTube = x0 + TUBE.len / 2
    const outX = x0 - FORM.cylH - 0.3
    const cx = lerp(inTube, outX, smoother(seg(t, OUT_T.touch, OUT_T.out)))
    const yIn = by - TUBE.rIn + FORM.cylR
    const yOut = L.press.y + FORM.cylR + 0.03
    const cy = lerp(yIn, yOut, smoothstep(OUT_T.out - 0.4, OUT_T.out + 0.7, t))
    const rod = tubes.rod
    rod.visible = true
    rod.rotation.set(0, 0, -Math.PI / 2)
    const tipFar = x0 + TUBE.len + 12
    const tipAt = t < OUT_T.touch ? lerp(tipFar, inTube + FORM.cylH, smoother(seg(t, OUT_T.rodIn, OUT_T.touch))) : t < OUT_T.out + 0.4 ? Math.min(inTube + FORM.cylH, cx + FORM.cylH) : lerp(cx + FORM.cylH, tipFar, smoother(seg(t, OUT_T.out + 0.4, OUT_T.out + 1.6)))
    rod.position.set(tipAt, by, zOut)

    // 上切药刀
    const hp = new Vector3()
    const cutZ = b.z + CUTTER.bladeZ
    const onBed = b.y + FORM.cylR + 0.02
    const heroX = b.x + 4
    const ph = chopPhase(t)
    const k = Math.floor(ph)
    const u = ph - k
    let yPush = Y0
    if (k > DISCS) yPush = yCut(DISCS)
    else if (k > 0) yPush = lerp(yCut(k - 1), yCut(k), smoother(clamp(u / 0.3)))
    const zOnBed = cutZ - yPush - (1 - smoother(seg(t, TO_BED.to, CHOP0))) * 1.6
    if (t < TO_BED.from) {
      hp.set(cx, cy, zOut)
      this.q.copy(ALONG_X)
    } else if (t < TO_BED.to) {
      const f = smoother(seg(t, TO_BED.from, TO_BED.to))
      hop(hp, v(outX, yOut, zOut), v(heroX, onBed, zOnBed), f, 10)
      this.q.copy(ALONG_X).slerp(ALONG_Z, f)
    } else {
      hp.set(heroX, onBed, zOnBed)
      this.q.copy(ALONG_Z)
    }
    s.setHeroByCenter(hp, this.q)
    s.applyHero()

    // 刀：每一刀先抬着等推，压下去，再抬起来
    const open = u < 0.3 ? 0.62 : u < 0.6 ? lerp(0.62, 0, smooth((u - 0.3) / 0.3)) : lerp(0, 0.62, smooth((u - 0.6) / 0.4))
    cut.setOpen(t < CHOP0 || k > DISCS ? 0.62 : open)

    // 断了几刀：主角只留切口往后那一截，切口盖一片
    let done = 0
    while (done <= DISCS && t >= this.offAt(done)) done++
    if (done > 0) {
      const yc = yCut(done - 1)
      this.plane.set(new Vector3(0, 0, -1), hp.z + yc)
      c.setClip([this.plane])
      this.cap.visible = true
      this.cap.position.set(0, yc - 0.012, 0)
    }

    // 第一刀切下的圆头：切口朝下落在片堆边上
    this.heel.visible = done > 0
    if (done > 0) {
      const f = smooth(clamp((t - this.offAt(0)) / 0.5))
      const yMid = Y0 + 0.5
      const fromC = v(heroX, onBed, cutZ + 0.5)
      const toC = v(b.x - 3.5, L.press.y + 0.52, b.z + 5.5)
      const center = hop(new Vector3(), fromC, toC, f, 1.2)
      const hq = this.q.copy(ALONG_Z).slerp(IDENT, f)
      this.heel.quaternion.copy(hq)
      this.heel.position.copy(center).sub(new Vector3(0, yMid, 0).applyQuaternion(hq))
      const n = new Vector3(0, 1, 0).applyQuaternion(hq)
      this.heelPlane.setFromNormalAndCoplanarPoint(n, this.heel.position.clone().addScaledVector(n, Y0))
    }

    // 圆片：刀压到底那一下断开，翻倒、平躺落在木座前面的片堆上
    const qd = new Quaternion()
    for (let i = 0; i < DISCS; i++) {
      const m = this.discs[i]
      const age = t - this.offAt(i + 1)
      m.visible = age >= 0
      if (!m.visible) continue
      const sp = this.spots[i]
      const f = smooth(clamp(age / 0.5))
      hop(m.position, v(heroX, onBed, cutZ + D / 2), sp.c, f, 1.2)
      m.quaternion.copy(qd.identity().slerp(sp.q, f))
    }
  }
}

// ———— 结尾：一簸箕圆片倒进罐里 ————

/** 簸箕里的片：每种形状一组 */
const VARIANTS = 8
/** 簸箕前沿压的竹条（本地） */
const LIP = new Vector3(0, 0.6, 20.6)
/** 簸箕倒的时候倾斜多少、前沿停在哪 */
const TILT = 0.52
const RIM = new Vector3(JAR_AT.x, JAR_AT.y + 19 * JAR_K + 4.2, JAR_AT.z - 1)
const REST = new Vector3(LAYOUT.press.x, LAYOUT.press.y + 0.02, LAYOUT.press.z + 1)
/** 公共界面在全线最后 14 秒放片尾、最后 15 秒不放字幕，这段的动作要在那之前做完 */
const BOTTLE_DUR = 28
/** 时间表：抬起倾斜 → 一片片滑下去 → 簸箕放回 → 盖盖 */
const POUR = { lift0: 3.6, lift1: 5.6, start: 5.2, span: 4.8, back0: 11.2, back1: 12.6, lid0: 11.6, lid1: 13 }
/** 片出了前沿飞多久；开头稀（看得清一片片），后面密 */
const FLY = 0.45
const POUR_EASE = 0.85
/** 片落到罐里的加速度（比真实慢一点，看得清） */
const FALL_G = 240

/** 一片从簸箕到罐里的全部数据 */
interface Flake {
  /** 这一片在第几组的第几个实例 */
  vi: number
  k: number
  /** 簸箕本地的位置、朝向 */
  lp: Vector3
  lq: Quaternion
  /** 什么时候开始滑、滑多久、从前沿哪里出去（簸箕本地） */
  rel: number
  slide: number
  exit: Vector3
  /** 经过罐口的点、翻到一半的朝向 */
  mouth: Vector3
  qMid: Quaternion
  /** 在罐里的位置、朝向，落多久 */
  sp: Vector3
  sq: Quaternion
  fall: number
}

export class Bottling extends Act {
  readonly group = new Group()
  private pile: InstancedMesh[] = []
  private flakes: Flake[] = []
  private built = false
  private tp = new Vector3()
  private tq = new Quaternion()
  private ta = new Vector3()
  private tb = new Vector3()
  private tc = new Quaternion()
  private d = new Object3D()

  constructor(s: Stage, id = 'bottle') {
    super(s, id, BOTTLE_DUR)
  }

  prepare() {
    this.build()
    this.group.visible = true
    gear(this.s)
  }

  /** 一片躺下以后的片心和朝向：先平躺，横向、纵向各斜一点，再转 yaw */
  private static laid(x: number, z: number, yaw: number, r: { y: number; b: number; c: number }, th: number) {
    const q = new Quaternion().setFromAxisAngle(XAX, -Math.PI / 2)
    const qa = new Quaternion()
    q.premultiply(qa.setFromAxisAngle(XAX, -Math.atan(r.c)))
    q.premultiply(qa.setFromAxisAngle(ZAX, Math.atan(r.b)))
    q.premultiply(qa.setFromAxisAngle(UP, yaw))
    const n = new Vector3(0, 0, 1).applyQuaternion(q)
    return { p: new Vector3(x, r.y, z).addScaledVector(n, th * 0.5), q }
  }

  private build() {
    if (this.built) return
    this.built = true
    const s = this.s
    const r = rng(331)
    const wn = s.w.winnow!
    // 撒到簸箕底铺了七成半就停：满满一簸箕，又不堆成一摞
    const th = D * 0.96
    const R = FORM.cylR
    const inside = (x: number, z: number) => Math.abs(x) < wn.halfW - 1.2 && z < wn.front - 1 && z > wn.back + 1 && (z > -1 || Math.hypot(x, (z + 1) / 0.9) < 21.5)
    let floorCells = 0
    for (let x = -wn.halfW + 0.125; x < wn.halfW; x += 0.25) for (let z = wn.back + 0.125; z < wn.front; z += 0.25) if (inside(x, z)) floorCells++
    const pile = new Settle(-wn.halfW, wn.back, wn.halfW * 2, 0.62)
    const spots: { p: Vector3; q: Quaternion }[] = []
    for (let i = 0; i < 700 && pile.coveredCells < floorCells * 0.74; i++) {
      // 比几个落点，落到最低的那个（往空当里走）
      let best: (ReturnType<Settle['rest']> & { x: number; z: number; yaw: number }) | null = null
      for (let k = 0, tries = 0; k < 4 && tries < 40; tries++) {
        const x = (r() * 2 - 1) * (wn.halfW - 1.5)
        const z = lerp(wn.back + 1.5, wn.front - 1.5, r())
        const yaw = r() * Math.PI * 2
        const c0 = Math.cos(yaw)
        const s0 = Math.sin(yaw)
        let ok = true
        for (const [u, w] of [[R, R], [R, -R], [-R, R], [-R, -R]]) if (!inside(x + u * c0 + w * s0, z - u * s0 + w * c0)) ok = false
        if (!ok) continue
        k++
        const rest = pile.rest(x, z, yaw, R, R)
        if (!best || rest.y < best.y) best = { ...rest, x, z, yaw }
      }
      if (!best) continue
      pile.add(best, th)
      spots.push(Bottling.laid(best.x, best.z, best.yaw, best, th))
    }
    // 先走的是离前沿正中最近、堆在上面的片
    spots.sort((a, b) => Math.hypot(a.p.x, a.p.z - LIP.z) - 3 * a.p.y - (Math.hypot(b.p.x, b.p.z - LIP.z) - 3 * b.p.y))

    // 罐里怎么堆：片一片片落下去，顺着底下的东西躺（方格略小于片，圆片不占四个角）
    const jarR = 6.5 * JAR_K
    const reach = jarR - R - 0.15
    const inJar = new Settle(-jarR, -jarR, jarR * 2, 0.9 * JAR_K, 0.2)
    const N = spots.length
    const counts = new Array<number>(VARIANTS).fill(0)
    const top = (i: number) => (i + 1) / N
    for (let i = 0; i < N; i++) {
      let best: (ReturnType<Settle['rest']> & { x: number; z: number; yaw: number }) | null = null
      for (let k = 0; k < 6; k++) {
        const a = r() * 6.283
        const rho = Math.sqrt(r()) * reach
        const x = Math.cos(a) * rho
        const z = Math.sin(a) * rho
        const yaw = r() * Math.PI * 2
        const rest = inJar.rest(x, z, yaw, R * 0.8, R * 0.8)
        if (!best || rest.y < best.y) best = { ...rest, x, z, yaw }
      }
      inJar.add(best!, th)
      const inP = Bottling.laid(best!.x, best!.z, best!.yaw, best!, th)
      const sp = inP.p.add(JAR_AT)
      const sp0 = spots[i]
      const a = r() * 6.283
      const rho = Math.sqrt(r()) * 3.2
      const mouth = new Vector3(JAR_AT.x + Math.cos(a) * rho, JAR_AT.y + 19 * JAR_K + 1.3, JAR_AT.z + Math.sin(a) * rho)
      const exit = new Vector3((r() * 2 - 1) * 8, 1.35, LIP.z + 0.2)
      const vi = i % VARIANTS
      this.flakes.push({
        vi,
        k: counts[vi]++,
        lp: sp0.p,
        lq: sp0.q,
        rel: POUR.start + POUR.span * Math.pow(top(i), 1 / POUR_EASE),
        slide: 0.35 + sp0.p.distanceTo(exit) / 60,
        exit,
        mouth,
        qMid: new Quaternion().setFromAxisAngle(new Vector3(r() - 0.5, r() - 0.5, r() - 0.5).normalize(), 1.2 + r() * 2.2),
        sp,
        sq: inP.q,
        fall: Math.sqrt((2 * Math.max(0.2, mouth.y - sp.y)) / FALL_G),
      })
    }
    const mat: MeshPhysicalMaterial = discMaterial()
    for (let vi = 0; vi < VARIANTS; vi++) {
      const im = new InstancedMesh(discGeometry(50 + vi, th, 1, R, 36), mat, Math.max(1, counts[vi]))
      im.castShadow = true
      im.receiveShadow = true
      im.frustumCulled = false
      im.count = counts[vi]
      this.pile.push(im)
      this.group.add(im)
    }
    s.w.scene.add(this.group)
  }

  hide() {
    const wn = this.s.w.winnow
    if (wn) wn.group.visible = false
    this.group.visible = false
    const g = GEAR.get(this.s.w)
    if (g) {
      g.jar.group.visible = false
      g.jar.lid.visible = false
    }
  }

  lights(): [number, LightName][] {
    return [
      [0, 'afternoon'],
      [BOTTLE_DUR - 1, 'golden'],
    ]
  }

  shots(add: AddShot) {
    const w = v(REST.x, REST.y + 3, REST.z)
    const mid = v(JAR_AT.x, JAR_AT.y + 10.5, JAR_AT.z)
    const both = v(JAR_AT.x, JAR_AT.y + 16, JAR_AT.z - 12)
    add(0, 3.8, { target: w, dist: 50, az: 10, el: 54, fov: 30, ap: 0.26 }, { target: w, dist: 44, az: 20, el: 50, fov: 30, ap: 0.3 })
    add(3.8, 6.4, { target: both, dist: 110, az: 42, el: 15, fov: 30, ap: 0.12 }, { target: both, dist: 88, az: 46, el: 12, fov: 30, ap: 0.16 })
    add(6.4, 11, { target: mid, dist: 60, az: 42, el: 10, fov: 30, ap: 0.2 }, { target: mid, dist: 53, az: 34, el: 12, fov: 30, ap: 0.24 }, 1.0)
    add(11, 13, { target: mid, dist: 55, az: 32, el: 13, fov: 30, ap: 0.22 }, { target: mid, dist: 58, az: 28, el: 15, fov: 30, ap: 0.2 }, 0.8)
    // 片尾：盖好、书页合上之后，罐子让到画面右边，片尾文字显现时已经让开
    const clear = { target: v(mid.x - 13.8, mid.y + 1.8, mid.z + 7.8), dist: 88, az: 30, el: 14.3, fov: 30, ap: 0.14 }
    add(13, 15, { target: mid, dist: 58, az: 28, el: 15, fov: 30, ap: 0.2 }, clear)
    add(15, this.dur + 2, clear, { target: v(mid.x - 14.6, mid.y + 2, mid.z + 8.3), dist: 93, az: 31, el: 14, fov: 30, ap: 0.14 }, 0, smooth)
  }

  sounds(add: AddSound) {
    const at = v(JAR_AT.x, JAR_AT.y + 10, JAR_AT.z)
    add(AT_JAR.pour, 'rustle', { dur: 4.8, gain: 0.3, at })
    for (let i = 0; i < 16; i++) add(AT_JAR.first + i * 0.29 + 0.02 * (i % 3), 'tap', { gain: 0.16, pitch: 1.1 + 0.05 * (i % 4), at })
    add(AT_JAR.lidUp, 'tap', { gain: 0.14, pitch: 1.3, at })
    add(AT_JAR.lidOn, 'clink', { gain: 0.55, at })
  }

  /** 簸箕这一刻在哪：前沿的竹条和倾斜角度给定，反算原点 */
  private tray(t: number, pos: Vector3, q: Quaternion) {
    const rest = this.ta.copy(LIP).add(REST)
    const y = keys(t, [[POUR.lift0, rest.y], [POUR.lift0 + 1.2, RIM.y], [POUR.back0 + 0.8, RIM.y], [POUR.back1, rest.y]])
    const z = keys(t, [[POUR.lift0 + 0.8, rest.z], [POUR.lift1, RIM.z], [POUR.back0, RIM.z], [POUR.back0 + 1, rest.z]])
    const a = keys(t, [[POUR.lift0, 0], [POUR.lift1 - 0.2, TILT], [POUR.back0, TILT], [POUR.back1, 0]])
    q.setFromAxisAngle(XAX, a)
    pos.set(RIM.x, y, z).sub(this.tb.copy(LIP).applyQuaternion(q))
  }

  pose(t: number) {
    this.build()
    const s = this.s
    const { jar } = gear(s)
    const wn = s.w.winnow!
    // 主角切完了，镜头也不看它了（藏起来）
    s.w.cakes!.heroGroup.visible = false

    // 簸箕
    const P = this.tp
    const Q = this.tq
    this.tray(t, P, Q)
    wn.group.visible = true
    wn.group.position.copy(P)
    wn.group.quaternion.copy(Q)

    // 一片片：在簸箕里 → 顺着簸箕滑到前沿 → 翻着飞进罐口 → 落到堆上
    const d = this.d
    const a0 = this.ta
    const b0 = this.tb
    const cq = this.tc
    this.group.visible = true
    for (const f of this.flakes) {
      const a = t - f.rel
      const flyAt = a - f.slide
      const fallAt = flyAt - FLY
      if (fallAt >= f.fall) {
        d.position.copy(f.sp)
        d.quaternion.copy(f.sq)
      } else if (fallAt >= 0) {
        const u = fallAt / f.fall
        d.position.lerpVectors(f.mouth, f.sp, u * u)
        d.quaternion.copy(f.qMid).slerp(f.sq, u)
      } else if (flyAt >= 0) {
        const u = flyAt / FLY
        a0.copy(f.exit).applyQuaternion(Q).add(P)
        // 离开前沿时还顺着簸箕的方向往前走一点，然后落下
        b0.set(0, 0, 1).applyQuaternion(Q).multiplyScalar(2.4).add(a0)
        const v0 = (1 - u) * (1 - u)
        const v1 = 2 * u * (1 - u)
        const v2 = u * u
        d.position.set(v0 * a0.x + v1 * b0.x + v2 * f.mouth.x, v0 * a0.y + v1 * b0.y + v2 * f.mouth.y, v0 * a0.z + v1 * b0.z + v2 * f.mouth.z)
        d.quaternion.copy(cq.copy(Q).multiply(f.lq)).slerp(f.qMid, u)
      } else {
        if (a <= 0) d.position.copy(f.lp)
        else {
          const u = a / f.slide
          d.position.lerpVectors(f.lp, f.exit, u * u)
          d.position.y += Math.sin(Math.PI * u) * 0.5
        }
        d.position.applyQuaternion(Q).add(P)
        d.quaternion.copy(Q).multiply(f.lq)
      }
      d.updateMatrix()
      this.pile[f.vi].setMatrixAt(f.k, d.matrix)
    }
    for (const im of this.pile) im.instanceMatrix.needsUpdate = true

    // 罐子和木盖：盖子放在罐旁边 → 直着提起来、挪到罐口上方、落下盖上（不碰罐沿）
    jar.group.visible = true
    jar.lid.visible = true
    const base = JAR_AT
    const H = 19 * JAR_K
    const side = v(base.x + 17, base.y + 1.2 * JAR_K, base.z - 4)
    const on = v(base.x, base.y + H + 0.02, base.z)
    const hi = base.y + H + 6
    const L = jar.lid.position
    if (t < POUR.lid0) L.copy(side)
    else {
      const u = seg(t, POUR.lid0, POUR.lid1)
      if (u < 0.4) L.lerpVectors(side, v(side.x, hi, side.z), smoother(u / 0.4))
      else if (u < 0.8) L.lerpVectors(v(side.x, hi, side.z), v(on.x, hi, on.z), smoother((u - 0.4) / 0.4))
      else L.lerpVectors(v(on.x, hi, on.z), on, smoother((u - 0.8) / 0.2))
    }
    jar.lid.rotation.set(0, 0.3 * (1 - smoother(seg(t, POUR.lid0, POUR.lid1))), 0)
  }
}
