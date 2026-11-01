import { BoxGeometry, BufferAttribute, BufferGeometry, Color, CylinderGeometry, DoubleSide, Group, LatheGeometry, Mesh, TorusGeometry, Vector2, type Material } from 'three'
import { procPhysical, procStandard } from '../gfx/proc'
import { lerp } from '../util'
import { FORM } from './cake'
import { ironMat, woodMat } from './materials'

// 压果片新加的物件，都照实拍做：
// 竹筒：一节没有节的青竹，两头通，口上露出浅色的竹肉。烘着烘着由青转黄。
// 竹罩：宽篾条斜着编的穹顶，孔眼大，罩在竹筛上保温。
// 顶棍：一根木棍，把烘好的圆柱从筒里顶出来。
// 木压果器：一块深色木座，一块整木削成的厚木板带长柄，板头铰在木座一端，压下去就把皱球压成椭圆。

function mesh(geo: BufferGeometry, mat: Material, cast = true) {
  const m = new Mesh(geo, mat)
  m.castShadow = cast
  m.receiveShadow = true
  return m
}

export const TUBE = {
  /** 筒外、内半径，筒长（长约是直径的 1.7 倍，壁厚看得出来） */
  r: 2.1,
  rIn: 1.58,
  len: 7,
}

function tubeMat() {
  const C = (h: string) => new Color(h)
  return procPhysical(
    { roughness: 0.42, metalness: 0, clearcoat: 0.45, clearcoatRoughness: 0.4 },
    {
      uniforms: {
        uAge: { value: 0 },
        uRIn: { value: TUBE.rIn + 0.04 },
        uR: { value: TUBE.r - 0.02 },
        uLen: { value: TUBE.len },
        cGreen0: { value: C('#6E7420') },
        cGreen1: { value: C('#A3A23A') },
        cOld0: { value: C('#857C3E') },
        cOld1: { value: C('#B8AC68') },
        cMeat: { value: C('#EDE3BC') },
        cMeatOld: { value: C('#C8BA80') },
        cIn: { value: C('#B8AF74') },
        cInOld: { value: C('#7C6C3C') },
      },
      color: /* glsl */ `
        float rho = length(vPos.xz);
        float az = atan(vPos.z, vPos.x);
        float low = snoise(vec3(cos(az) * 1.3, sin(az) * 1.3, vPos.y * 0.22 + 2.0));
        float fib = snoise(vec3(cos(az) * 22.0, sin(az) * 22.0, vPos.y * 0.5));
        // 带黄的橄榄绿，深浅一块一块的
        float blot0 = snoise(vec3(cos(az) * 1.8, sin(az) * 1.8, vPos.y * 0.26 + 5.0));
        vec3 green = mix(cGreen0, cGreen1, smoothstep(-1.0, 1.0, low * 0.5 + blot0 * 0.7)) * (0.98 + 0.035 * fib);
        // 烘过：黄褐，局部还留一点绿，靠下的地方熏得深一点
        float blot = snoise(vec3(cos(az) * 1.8, sin(az) * 1.8, vPos.y * 0.3 + 9.0));
        vec3 old = mix(cOld0, cOld1, smoothstep(-1.0, 1.0, blot + low * 0.4)) * (0.93 + 0.09 * fib);
        old *= 0.88 + 0.12 * smoothstep(0.0, uLen * 0.3, vPos.y);
        float turn = smoothstep(blot * 0.22, 1.0 + blot * 0.22, uAge * 1.2 - 0.1);
        vec3 skin = mix(green, old, turn);
        // 内壁、筒口的竹肉
        float inner = 1.0 - smoothstep(uRIn - 0.02, uRIn + 0.02, rho);
        float meat = smoothstep(uRIn, uRIn + 0.03, rho) * (1.0 - smoothstep(uR - 0.03, uR, rho));
        meat *= smoothstep(uLen - 0.02, uLen, vPos.y) + (1.0 - smoothstep(0.0, 0.02, vPos.y));
        vec3 col = mix(skin, mix(cIn, cInOld, uAge), inner);
        col = mix(col, mix(cMeat, cMeatOld, uAge), clamp(meat, 0.0, 1.0));
        diffuseColor.rgb = col;
        procBump = fib * 0.004;
      `,
      rough: /* glsl */ `roughnessFactor = mix(0.42, 0.74, uAge);`,
      physical: /* glsl */ `
        #ifdef USE_CLEARCOAT
          material.clearcoat = 0.45 * (1.0 - uAge * 0.8);
        #endif
      `,
      bump: true,
    },
  )
}

/** 竹罩的材质：两组宽篾条斜着交叉，按对数螺旋走，孔眼往顶上一路变小；整数根，转一圈接得上 */
function coverMat(N: number) {
  const LATTICE = /* glsl */ `
    float cvRho = max(length(vPos.xz), 1.5);
    float cvA = atan(vPos.z, vPos.x) / 6.28318530718 * uN;
    float cvV = log(cvRho) * uN / 6.28318530718;
    float cvU1 = cvA + cvV;
    float cvU2 = cvA - cvV;
    float cvD1 = abs(fract(cvU1) - 0.5);
    float cvD2 = abs(fract(cvU2) - 0.5);
    // 一格比像素还小的时候不挖孔（不然一闪一闪）
    float cvAA = 1.0 - smoothstep(0.25, 0.6, (fwidth(vPos.x) + fwidth(vPos.z) + fwidth(vPos.y)) / (cvRho * 6.28318530718 / uN));
  `
  return procStandard(
    { roughness: 0.74, metalness: 0, side: DoubleSide },
    {
      uniforms: {
        uN: { value: N },
        cA: { value: new Color('#D8C698') },
        cB: { value: new Color('#B39C68') },
      },
      discard: /* glsl */ `
        ${LATTICE}
        if (cvD1 > 0.37 && cvD2 > 0.37 && cvRho > 3.0 && vPos.y > 0.8 && cvAA > 0.5) discard;
      `,
      color: /* glsl */ `
        float on1 = 1.0 - step(0.37, cvD1);
        float on2 = 1.0 - step(0.37, cvD2);
        float i1 = floor(cvU1);
        float i2 = floor(cvU2);
        // 一上一下：格子奇偶决定交叉处哪根在上
        float top1 = on1 * (1.0 - on2 * step(0.5, mod(i1 + i2, 2.0)));
        float id = mix(i2 + 61.0, i1, top1);
        float d = mix(cvD2, cvD1, top1);
        float along = mix(cvU1, cvU2, top1);
        float fib = snoise(vec3(d * 22.0 + id, along * 1.6, id));
        vec3 col = mix(cB, cA, hash11(mod(id, 97.0) + 1.3) * 0.75 + 0.1 * fib + 0.1);
        // 篾条边上一条暗线，压在下面那根靠近交叉处发暗
        col *= 1.0 - 0.34 * smoothstep(0.3, 0.37, d) * cvAA;
        diffuseColor.rgb = mix(mix(cA, cB, 0.5), col, cvAA);
        procBump = (1.0 - smoothstep(0.26, 0.37, d)) * 0.05 * cvAA;
      `,
      bump: true,
    },
  )
}

// 罩口和竹筛沿上的竹箍一样大，正好坐在箍上。seat：筛面到罩口的高度（筛沿 3.4 + 筛箍半径 0.65 + 罩箍底 0.15）
export const COVER = { r: 34.6, h: 21, seat: 4.2 }

export class Tubes {
  readonly group = new Group()
  readonly tubes: Mesh[] = []
  readonly mat = tubeMat()
  /** 顶棍：原点在顶圆柱的那一头，沿 +y 伸出去 */
  readonly rod = new Group()
  /** 竹罩：原点在罩口中心 */
  readonly cover = new Group()

  constructor() {
    const { r, rIn, len } = TUBE
    const prof = [new Vector2(rIn, 0), new Vector2(r, 0), new Vector2(r, len), new Vector2(rIn, len), new Vector2(rIn, 0)]
    // 外棱磨一点，不是刀裁的
    const pts: Vector2[] = []
    for (let i = 0; i < prof.length - 1; i++) pts.push(prof[i], prof[i].clone().lerp(prof[i + 1], 0.5))
    pts.push(prof[prof.length - 1])
    const geo = new LatheGeometry(pts, 40)
    for (let i = 0; i < 10; i++) {
      const m = mesh(geo, this.mat)
      m.visible = false
      this.tubes.push(m)
      this.group.add(m)
    }
    // 顶棍
    const stick = mesh(new CylinderGeometry(FORM.cylR - 0.25, FORM.cylR - 0.15, 19, 18), woodMat({ axis: 'y', light: '#C9A06C', dark: '#8E6A42', seed: 71 }))
    stick.position.y = 9.5
    this.rod.add(stick)
    this.rod.visible = false
    this.group.add(this.rod)
    // 竹罩：一个穹顶转出来，底边一圈竹箍
    const dome: Vector2[] = []
    const { r: cr, h: ch } = COVER
    for (let i = 0; i <= 28; i++) {
      const t = i / 28
      const a = (t * Math.PI) / 2
      dome.push(new Vector2(Math.max(0.01, cr * Math.cos(a)), ch * Math.pow(Math.sin(a), 0.85)))
    }
    const cov = mesh(new LatheGeometry(dome.reverse().reverse(), 96), coverMat(52))
    this.cover.add(cov)
    const hoop = mesh(new TorusGeometry(cr, 0.55, 8, 96), woodMat({ axis: 'x', light: '#BFA672', dark: '#8A7248', seed: 72 }))
    hoop.rotation.x = Math.PI / 2
    hoop.position.y = 0.4
    this.cover.add(hoop)
    this.cover.visible = false
    this.group.add(this.cover)
  }

  /** 由青转黄：0 → 1 */
  setAge(a: number) {
    ;(this.mat.userData.proc as { uniforms: Record<string, { value: number }> }).uniforms.uAge.value = a
  }
  hideAll() {
    for (const t of this.tubes) t.visible = false
    this.rod.visible = false
    this.cover.visible = false
  }
}

// ———— 木压果器 ————

/** 整个压果器按实拍的比例缩一点：板宽约是皱球直径的两倍 */
const PRESS_K = 0.76
export const FRUIT_PRESS = {
  /** 木座高 */
  height: 2.6 * PRESS_K,
  /** 铰在哪（本地 x，木座顶面是 y = 0） */
  pinX: -15 * PRESS_K,
  pinY: 0.7 * PRESS_K,
}

/** 一段段截面放样：x 处宽 w、上下面 yTop / yBot，截面是圆角长方形 */
function loft(sections: { x: number; w: number; top: number; bot: number; round: number }[]) {
  const M = 20
  const pos: number[] = []
  const idx: number[] = []
  sections.forEach((s) => {
    for (let k = 0; k < M; k++) {
      const a = (k / M) * Math.PI * 2
      const c = Math.cos(a)
      const n = Math.sin(a)
      const e = lerp(0.18, 1, s.round)
      const y = Math.sign(n) * Math.pow(Math.abs(n), e)
      const z = Math.sign(c) * Math.pow(Math.abs(c), e)
      pos.push(s.x, lerp(s.bot, s.top, y * 0.5 + 0.5), (z * s.w) / 2)
    }
  })
  for (let i = 0; i < sections.length - 1; i++) {
    for (let k = 0; k < M; k++) {
      const k1 = (k + 1) % M
      const a = i * M + k
      const b = i * M + k1
      const c = (i + 1) * M + k
      const d = (i + 1) * M + k1
      idx.push(a, d, b, a, c, d)
    }
  }
  // 两头封口
  const close = (off: number, flip: boolean) => {
    const c = pos.length / 3
    let x = 0
    let y = 0
    let z = 0
    for (let k = 0; k < M; k++) {
      x += pos[(off + k) * 3] / M
      y += pos[(off + k) * 3 + 1] / M
      z += pos[(off + k) * 3 + 2] / M
    }
    pos.push(x, y, z)
    for (let k = 0; k < M; k++) {
      const a = off + k
      const b = off + (k + 1) % M
      if (flip) idx.push(c, b, a)
      else idx.push(c, a, b)
    }
  }
  close(0, false)
  close((sections.length - 1) * M, true)
  const g = new BufferGeometry()
  g.setAttribute('position', new BufferAttribute(new Float32Array(pos), 3))
  g.setIndex(idx)
  g.computeVertexNormals()
  return g
}

export class FruitPress {
  readonly group = new Group()
  /** 绕铰转的压板（rotation.z 正的是抬起来） */
  readonly paddle = new Group()

  constructor() {
    const LEN = 34
    const DEPTH = 20
    const H = 2.6
    const PIN_X = -15
    const PIN_Y = 0.7
    const body = new Group()
    body.scale.setScalar(PRESS_K)
    this.group.add(body)
    const dark = woodMat({ axis: 'x', light: '#6E5040', dark: '#35241C', seed: 61, worn: 0.5 })
    const base = mesh(new BoxGeometry(LEN, H, DEPTH), dark)
    base.position.y = -H / 2
    body.add(base)
    // 木座一圈矮沿（实拍木座上有一圈起边）
    const rail = (w: number, d: number, x: number, z: number) => {
      const m = mesh(new BoxGeometry(w, 0.7, d), dark)
      m.position.set(x, 0.35, z)
      body.add(m)
    }
    rail(LEN - 6, 1.4, 3, DEPTH / 2 - 0.7)
    rail(LEN - 6, 1.4, 3, -DEPTH / 2 + 0.7)
    rail(1.4, DEPTH - 2.8, LEN / 2 - 0.7, 0)
    // 铰：两块木耳夹着板头，一根木销
    for (const z of [-5.6, 5.6]) {
      const ear = mesh(new BoxGeometry(5, 4, 1.2), dark)
      ear.position.set(PIN_X, 1.6, z)
      body.add(ear)
    }
    const pin = mesh(new CylinderGeometry(0.5, 0.5, 13.4, 12), ironMat({ rust: 0.5 }))
    pin.rotation.x = Math.PI / 2
    pin.position.set(PIN_X, PIN_Y + 1.4, 0)
    body.add(pin)

    // 压板：板头厚、板身平，往后收成圆柄；底面是平的，贴着铰
    this.paddle.position.set(PIN_X, PIN_Y, 0)
    body.add(this.paddle)
    const wood = woodMat({ axis: 'x', light: '#DDB070', dark: '#A77A42', seed: 62, worn: 0.25 })
    const g = loft([
      { x: -2.2, w: 8.6, top: 3.2, bot: 0.6, round: 0.45 },
      { x: -1.2, w: 9.6, top: 4.1, bot: 0.1, round: 0.3 },
      { x: 2, w: 10, top: 4.4, bot: 0, round: 0.25 },
      { x: 22, w: 10, top: 4.2, bot: 0, round: 0.25 },
      { x: 25, w: 8.4, top: 3.9, bot: 0, round: 0.35 },
      { x: 28, w: 5, top: 3.1, bot: 0.15, round: 0.6 },
      { x: 31, w: 3.3, top: 2.75, bot: 0.3, round: 0.9 },
      { x: 44, w: 3.2, top: 2.7, bot: 0.4, round: 1 },
      { x: 45, w: 2.6, top: 2.45, bot: 0.65, round: 1 },
    ])
    this.paddle.add(mesh(g, wood))
    this.setOpen(0.6)
  }

  setOpen(a: number) {
    this.paddle.rotation.z = a
  }
  /**
   * 压板正好贴着底下那个东西时抬多少：东西放在木座上（本地 x0），横半轴 xr、竖半轴 zr。
   * 板是一条过铰的直线，所以要算直线到椭圆的距离，只看正上方那一点的话板的另一头会插进果里
   */
  angleOnto(x0: number, xr: number, zr: number) {
    const P = FRUIT_PRESS
    const dx = x0 - P.pinX
    const cy = zr - P.pinY
    const A = Math.hypot(dx, cy)
    const phi = Math.atan2(cy, dx)
    let a = phi
    for (let i = 0; i < 5; i++) {
      const rho = Math.hypot(xr * Math.sin(a), zr * Math.cos(a))
      a = phi + Math.asin(Math.min(0.99, rho / A))
    }
    return a
  }
}
