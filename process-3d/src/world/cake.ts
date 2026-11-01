import { BufferAttribute, BufferGeometry, Color, DynamicDrawUsage, Group, Mesh, Quaternion, SphereGeometry, Vector3, type MeshPhysicalMaterial, type Plane } from 'three'
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js'
import { procPhysical } from '../gfx/proc'
import { FRUIT } from '../palette'
import { clamp, lerp, rng } from '../util'
import type { FruitSet } from './fruitset'
import { PEEL } from './peel'

// 压果片用的果：整果 → 烘软缩成皱球 → 木压果器压成椭圆 → 竹筒里定型成圆柱 → 横切成圆片。
// 四种形态共用一份网格（单位球），CPU 上按进度变形，所以从头到尾是同一个果，没有一刀切换。
// 单位球的极轴（本地 y）是圆柱的长轴；压的时候本地 z 朝上。果的原点就在果心。

const R = PEEL.R

/** 各形态的尺寸（厘米） */
export const FORM = {
  /** 烘软缩小后的半径（直径缩到一半） */
  shrunk: 2,
  /** 压后的椭圆：半轴 */
  oval: { x: 1.85, y: 2.75, z: 1.8 },
  /** 毛绒圆柱：半径、半长、两端圆头的高 */
  cylR: 1.5,
  cylH: 3.15,
  cylDome: 1,
  /** 圆片的厚 */
  disc: 0.36,
}

/** 果皮的皱：几道弯弯的沟（一个数，乘半径就是往里陷多少） */
function wrinkle(x: number, y: number, z: number) {
  const val = (v: number) => Math.pow(1 - Math.abs(Math.sin(v)), 5)
  const a = val(3.1 * x + 1.7 * y + 2 * Math.sin(2.2 * z + 0.5))
  const b = val(2.6 * y - 2.2 * z + 1.6 * Math.sin(2.9 * x + 1.9))
  const c = val(3.4 * z + 1.2 * x + 1.4 * Math.sin(2.4 * y + 0.7))
  const lump = Math.sin(1.7 * x + 2.3 * y + 1) * Math.sin(2.1 * z - 1.1 * x + 0.4)
  return 0.022 * lump - 0.02 * a - 0.016 * b - 0.012 * c
}

/** 圆柱上的点：纬度 t（-1 到 1）顺着轮廓走，走直段和圆头的弧长各占一段，网格分布才均匀 */
function capsule(t: number, az: number, out: [number, number]) {
  const { cylR: r, cylH: H, cylDome: d } = FORM
  const L = H - d
  const dl = (Math.PI / 2) * Math.sqrt((r * r + d * d) / 2)
  const s = Math.abs(t) * (L + dl)
  let rho = r
  let yy = s
  if (s > L) {
    const a = ((s - L) / dl) * (Math.PI / 2)
    rho = r * Math.cos(a)
    yy = L + d * Math.sin(a)
  }
  // 手工定型的东西不会是车出来的：稍微起伏，顺长几道浅沟（像鹿茸）
  const crease = Math.pow(1 - Math.abs(Math.sin(az * 3 + 0.6 * Math.sin(yy * 0.9))), 7)
  rho *= 1 + 0.014 * Math.sin(2.1 * yy + az * 2 + 1) + 0.007 * Math.sin(5.3 * yy + az * 3) - 0.016 * crease
  out[0] = rho
  out[1] = Math.sign(t) * yy
}

export interface FormState {
  /** 烘：0 鲜果大小 → 1 缩成皱球 */
  dry: number
  /** 压：0 圆 → 1 椭圆 */
  oval: number
  /** 定型：0 → 1 毛绒圆柱 */
  cyl: number
  /** 竹筒口的高度（本地 y）：比它低的部分收进筒里（半径不超过 mouthR）；不在筒口就不填 */
  mouth?: number
  mouthR?: number
}

/** 一个果的网格：单位球按形态变形 */
export class CakeGeometry {
  readonly geo: BufferGeometry
  private unit: Float32Array
  private wr: Float32Array
  private cap: Float32Array
  private key = ''
  constructor() {
    const s = new SphereGeometry(1, 96, 72)
    s.deleteAttribute('uv')
    s.deleteAttribute('normal')
    const g = mergeVertices(s)
    this.unit = (g.attributes.position.array as Float32Array).slice()
    ;(g.attributes.position as BufferAttribute).setUsage(DynamicDrawUsage)
    g.setAttribute('aRest', new BufferAttribute(this.unit.slice(), 3))
    this.geo = g
    const U = this.unit
    this.wr = new Float32Array(U.length / 3)
    this.cap = new Float32Array(U.length)
    const pc: [number, number] = [0, 0]
    for (let i = 0; i < U.length; i += 3) {
      const [x, y, z] = [U[i], U[i + 1], U[i + 2]]
      this.wr[i / 3] = wrinkle(x, y, z)
      const rho = Math.hypot(x, z)
      const az = Math.atan2(z, x)
      capsule(Math.asin(clamp(y, -1, 1)) / (Math.PI / 2), az, pc)
      const k = rho > 1e-6 ? pc[0] / rho : 0
      this.cap[i] = x * k
      this.cap[i + 1] = pc[1]
      this.cap[i + 2] = z * k
    }
    this.set({ dry: 0, oval: 0, cyl: 0 })
  }
  set(f: FormState) {
    const key = `${f.dry.toFixed(4)}|${f.oval.toFixed(4)}|${f.cyl.toFixed(4)}|${(f.mouth ?? 99).toFixed(3)}|${f.mouthR ?? 0}`
    if (key === this.key) return
    this.key = key
    const P = this.geo.attributes.position.array as Float32Array
    const U = this.unit
    const C = this.cap
    const rb = lerp(R, FORM.shrunk, f.dry)
    const sx = lerp(1, FORM.oval.x / FORM.shrunk, f.oval)
    const sy = lerp(1, FORM.oval.y / FORM.shrunk, f.oval)
    const sz = lerp(1, FORM.oval.z / FORM.shrunk, f.oval)
    const m = f.mouth ?? Infinity
    const mr = f.mouthR ?? Infinity
    for (let i = 0; i < U.length; i += 3) {
      const rr = rb * (1 + this.wr[i / 3] * f.dry)
      let x = lerp(U[i] * rr * sx, C[i], f.cyl)
      const y = lerp(U[i + 1] * rr * sy, C[i + 1], f.cyl)
      let z = lerp(U[i + 2] * rr * sz, C[i + 2], f.cyl)
      if (y < m) {
        const rho = Math.hypot(x, z)
        if (rho > mr) {
          x *= mr / rho
          z *= mr / rho
        }
      }
      P[i] = x
      P[i + 1] = y
      P[i + 2] = z
    }
    this.geo.attributes.position.needsUpdate = true
    this.geo.computeVertexNormals()
    this.geo.computeBoundingSphere()
  }
}

/** 果的材质：青绿 → 烫过转亮 → 烘成橄榄黄、再到黄褐带深斑 → 定型后一身黄褐细绒 */
export function cakeMaterial(seed = 0, shell = 0) {
  const C = (h: string) => new Color(h)
  return procPhysical(
    { roughness: 0.6, metalness: 0, sheen: 1, sheenRoughness: 0.5, sheenColor: new Color('#ffffff'), clearcoat: 1, clearcoatRoughness: 0.3 },
    {
      uniforms: {
        uBlanch: { value: 0 },
        uWet: { value: 0 },
        uDry: { value: 0 },
        uCyl: { value: 0 },
        uRind: { value: 0 },
        uSeed: { value: seed },
        cSkin0: { value: C(FRUIT.skin[0]) },
        cSkin1: { value: C(FRUIT.skin[1]) },
        cBl0: { value: C(FRUIT.blanch[0]) },
        cBl1: { value: C(FRUIT.blanch[1]) },
        cMid0: { value: C('#5F5C18') },
        cMid1: { value: C('#8F8726') },
        cDry0: { value: C('#413C20') },
        cDry1: { value: C('#7C6C3C') },
        cCyl0: { value: C('#6A5320') },
        cCyl1: { value: C('#A5853C') },
        cFuzz: { value: C('#E9E2B8') },
        cRind: { value: C('#2A2A18') },
      },
      attributes: 'attribute vec3 aRest;',
      varyings: 'varying vec3 vRest;',
      vertex: `vRest = aRest; transformed += normal * ${(shell * 0.028).toFixed(3)};`,
      // 绒毛：外面再套几层，一层比一层稀，只留下散开的小点，轮廓上就毛茸茸的。太远看不清时整层不画
      discard: shell
        ? /* glsl */ `
          float hk = hash13(floor(vRest * 170.0));
          if (hk > ${(0.62 - shell * 0.14).toFixed(3)} || aaFade3(vRest * 170.0) < 0.4) discard;
        `
        : undefined,
      color: /* glsl */ `
        vec3 rp = vRest;
        float mott = snoise(rp * 2.6 + uSeed) * 0.45 + snoise(rp * 7.3 + uSeed * 2.0) * 0.18;
        float lo = smoothstep(-0.8, 0.25, mott);
        vec3 col = mix(mix(cSkin0, cSkin1, lo), mix(cBl0, cBl1, lo), uBlanch);
        // 油胞：鲜果上明显，烘软以后收进绒里
        vec3 gl = voronoi3(rp * 40.0 + uSeed);
        float gland = mix(0.12, 1.0 - smoothstep(0.1, 0.36, gl.x), aaFade3(rp * 40.0)) * (1.0 - smoothstep(0.2, 0.7, uDry));
        col *= 1.0 - gland * 0.12;
        // 烘：先转橄榄黄，再到黄褐，深色斑慢慢显出来
        vec3 mid = mix(cMid0, cMid1, lo);
        float blotch = smoothstep(-1.0, 0.9, mott + snoise(rp * 5.1 + 3.0) * 0.25);
        vec3 dried = mix(cDry0, cDry1, blotch);
        col = mix(col, mid, smoothstep(0.02, 0.45, uDry));
        col = mix(col, dried, smoothstep(0.4, 1.0, uDry));
        // 细绒：粗细两层小点，圆柱上顺长拉开，看着像绒毛
        float k1 = mix(0.5, hash13(floor(rp * 150.0)), aaFade3(rp * 150.0));
        float k2 = mix(0.5, hash13(floor(rp * 62.0 + 7.0)), aaFade3(rp * 62.0));
        float k3 = mix(0.5, hash13(floor(rp * 26.0 + 3.0)), aaFade3(rp * 26.0));
        float sn = snoise(rp * 18.0 + uSeed) * 0.5;
        float fz = (k1 - 0.5) * 0.8 + (k2 - 0.5) * 0.55 + (k3 - 0.5) * 0.25 + sn * 0.35;
        col *= 1.0 + fz * mix(0.08, 0.75, smoothstep(0.1, 0.9, uDry));
        // 定型：一身黄褐细绒，顺长几道浅沟
        float az = atan(rp.z, rp.x);
        float cr = abs(sin(az * 3.0 + 0.6 * sin(rp.y * 3.2)));
        float crease = (1.0 - smoothstep(0.0, 0.13, cr)) * uCyl;
        vec3 cyl = mix(cCyl0, cCyl1, smoothstep(-0.9, 0.7, mott * 0.7 + fz * 1.1));
        col = mix(col, cyl * (1.0 + fz * 0.8), uCyl);
        col *= 1.0 - crease * 0.16;
        // 烘透的外皮是深色的，上切药刀时绒面也看着发深，才接得上圆片那一圈
        col = mix(col, cRind * (1.0 + fz * 0.9), uRind);
        diffuseColor.rgb = col${shell ? ' * ' + (1 + shell * 0.13).toFixed(2) : ''};
        procBump = -gland * 0.016 + mott * 0.008 + fz * 0.014 * uDry - crease * 0.006;
      `,
      rough: /* glsl */ `roughnessFactor = mix(mix(0.6, 0.34, uWet), 0.92, uDry);`,
      physical: /* glsl */ `
        #ifdef USE_SHEEN
          material.sheenColor = cFuzz * mix(0.25, 0.42, uDry);
          material.sheenRoughness = 0.55;
        #endif
        #ifdef USE_CLEARCOAT
          material.clearcoat = uWet * 0.75;
          material.clearcoatRoughness = 0.28;
        #endif
      `,
      bump: true,
    },
  )
}

export interface CakeLook {
  blanch: number
  wet: number
  dry: number
  cyl: number
  rind: number
}
export function setCakeLook(mat: MeshPhysicalMaterial, k: Partial<CakeLook>) {
  const u = (mat.userData.proc as { uniforms: Record<string, { value: number }> }).uniforms
  if (k.blanch !== undefined) u.uBlanch.value = k.blanch
  if (k.wet !== undefined) u.uWet.value = k.wet
  if (k.dry !== undefined) u.uDry.value = k.dry
  if (k.cyl !== undefined) u.uCyl.value = k.cyl
  if (k.rind !== undefined) u.uRind.value = k.rind
}

/**
 * 一片圆片：本地 z 是厚度方向，原点在片心。边略不规则，seed 决定个别缺口；
 * aRest.xy 是单位圆上的位置（边上正好是 1），aCut 1 是切面、0 是外皮那一圈侧壁，aSeed 让每种片的花纹不同。
 */
export function discGeometry(seed: number, th = FORM.disc, rough = 1, r0 = FORM.cylR, M = 72) {
  const r = rng(1000 + seed * 37)
  const p = [r() * 6.28, r() * 6.28, r() * 6.28]
  const ell = 1 + (r() - 0.5) * 0.07 * rough
  const notch = r() < 0.45 ? { a: r() * 6.28, w: 0.1 + r() * 0.16, d: 0.07 + r() * 0.1 } : null
  const jag = Array.from({ length: M }, () => (r() - 0.5) * 0.022)
  const edge = (k: number) => {
    const a = (k / M) * Math.PI * 2
    let e = 1 + 0.024 * Math.sin(3 * a + p[0]) + 0.014 * Math.sin(7 * a + p[1]) + 0.008 * Math.sin(13 * a + p[2]) + jag[k]
    if (notch) {
      const da = Math.atan2(Math.sin(a - notch.a), Math.cos(a - notch.a))
      e -= notch.d * Math.exp(-(da * da) / (notch.w * notch.w))
    }
    return 1 + (e - 1) * rough
  }
  const pos: number[] = []
  const rest: number[] = []
  const cut: number[] = []
  const idx: number[] = []
  const bev = Math.min(th * 0.2, 0.05)
  const F = [0.35, 0.7, 0.93, 1]
  // 面：中心 + 四圈（最外一圈倒一点角，边不至于像冲床冲出来的）
  const face = (sign: number) => {
    const c = pos.length / 3
    pos.push(0, 0, (sign * th) / 2)
    rest.push(0, 0, sign)
    cut.push(1)
    const base = pos.length / 3
    F.forEach((f, ri) => {
      for (let k = 0; k < M; k++) {
        const a = (k / M) * Math.PI * 2
        const e = lerp(1, edge(k), f)
        const rho = r0 * e * f
        const z = ri === F.length - 1 ? th / 2 - bev : th / 2
        pos.push(Math.cos(a) * rho * ell, Math.sin(a) * rho, sign * z)
        rest.push(Math.cos(a) * f, Math.sin(a) * f, sign)
        cut.push(1)
      }
    })
    const tri = (a: number, b: number, d: number) => (sign > 0 ? idx.push(a, b, d) : idx.push(a, d, b))
    for (let k = 0; k < M; k++) {
      const k1 = (k + 1) % M
      tri(c, base + k, base + k1)
      for (let ri = 0; ri < F.length - 1; ri++) {
        const a0 = base + ri * M + k
        const a1 = base + ri * M + k1
        const b0 = base + (ri + 1) * M + k
        const b1 = base + (ri + 1) * M + k1
        tri(a0, b0, b1)
        tri(a0, b1, a1)
      }
    }
  }
  face(1)
  face(-1)
  // 侧壁：外皮那一圈
  const base = pos.length / 3
  for (const z of [th / 2 - bev, -th / 2 + bev]) {
    for (let k = 0; k < M; k++) {
      const a = (k / M) * Math.PI * 2
      const rho = r0 * edge(k)
      pos.push(Math.cos(a) * rho * ell, Math.sin(a) * rho, z)
      rest.push(Math.cos(a), Math.sin(a), z / (th / 2))
      cut.push(0)
    }
  }
  for (let k = 0; k < M; k++) {
    const k1 = (k + 1) % M
    idx.push(base + k, base + M + k, base + M + k1, base + k, base + M + k1, base + k1)
  }
  const g = new BufferGeometry()
  g.setAttribute('position', new BufferAttribute(new Float32Array(pos), 3))
  g.setAttribute('aRest', new BufferAttribute(new Float32Array(rest), 3))
  g.setAttribute('aCut', new BufferAttribute(new Float32Array(cut), 1))
  g.setAttribute('aSeed', new BufferAttribute(new Float32Array(cut.length).fill(seed * 1.37 + 0.5), 1))
  g.setIndex(idx)
  g.computeVertexNormals()
  return g
}

/** 圆片的材质：外皮一圈深墨绿到近黑，切面由外向内深褐、茶褐、琥珀黄，正中一小团粗纤维，部分片上有细白点和径向裂纹 */
export function discMaterial() {
  const C = (h: string) => new Color(h)
  return procPhysical(
    { roughness: 0.88, metalness: 0, sheen: 0.4, sheenRoughness: 0.7, sheenColor: new Color('#7A6A50') },
    {
      uniforms: {
        cAmber: { value: C('#B47A30') },
        cTea: { value: C('#74441F') },
        cDeep: { value: C('#3C2110') },
        cRim0: { value: C('#0E110A') },
        cRim1: { value: C('#1F2517') },
        cFray: { value: C('#8D7450') },
        cFib0: { value: C('#4E3019') },
        cFib1: { value: C('#C2A06C') },
        cSpeck: { value: C('#EFE7D2') },
        cCrack: { value: C('#20130A') },
      },
      attributes: 'attribute vec3 aRest; attribute float aCut; attribute float aSeed;',
      varyings: 'varying vec3 vRest; varying float vCut; varying float vSeed;',
      vertex: 'vRest = aRest; vCut = aCut; vSeed = aSeed;',
      color: /* glsl */ `
        vec2 uv = vRest.xy;
        float sd = vSeed;
        float rr = length(uv);
        float ang = atan(uv.y, uv.x);
        vec3 col;
        float bump = 0.0;
        if (vCut > 0.5) {
          float wob = snoise(vec3(uv * 3.0, sd)) * 0.05 + snoise(vec3(uv * 9.0, sd * 2.0)) * 0.02;
          float e = rr + wob;
          col = mix(cAmber, cTea, smoothstep(0.12, 0.56, e));
          col = mix(col, cDeep, smoothstep(0.48, 0.86, e));
          // 径向的细纹和细颗粒（没有木纹那样的同心圈）
          float rad = snoise(vec3(cos(ang) * 9.0, sin(ang) * 9.0, rr * 1.5 + sd));
          float gr = mix(0.0, snoise(vec3(uv * 46.0, sd)), aaFade(uv * 46.0));
          col *= 0.95 + 0.06 * rad + 0.09 * gr;
          bump += gr * 0.006;
          // 纤维芯
          float core = 1.0 - smoothstep(0.09, 0.2, rr + snoise(vec3(uv * 8.0, sd + 3.0)) * 0.06);
          float fib = snoise(vec3(uv * 42.0, sd + 5.0));
          col = mix(col, mix(cFib0, cFib1, smoothstep(-0.3, 0.45, fib)), core);
          bump += core * fib * 0.03;
          // 细白点：不是每片都有
          vec2 q = uv * 21.0;
          vec2 cell = floor(q);
          vec2 jit = hash22(cell + sd * 13.0) - 0.5;
          float d = length(fract(q) - 0.5 - jit * 0.5);
          float spot = (1.0 - smoothstep(0.05, 0.15, d)) * step(0.8, hash12(cell + sd * 3.3)) * step(0.35, hash11(sd * 7.1));
          col = mix(col, cSpeck, spot * 0.85 * (1.0 - core) * aaFade(q));
          // 径向裂纹：从边往里，个别片才有
          float a0 = hash11(sd * 3.1) * 6.283;
          float da = abs(atan(sin(ang - a0 + wob * 1.6), cos(ang - a0 + wob * 1.6)));
          float crack = (1.0 - smoothstep(0.004, 0.022, da * rr)) * smoothstep(0.34, 0.62, rr) * step(0.42, hash11(sd * 5.7));
          col = mix(col, cCrack, crack);
          bump -= crack * 0.04;
          // 外皮一圈，交界处毛糙
          float wr = rr + wob * 0.55;
          float rim = smoothstep(0.885, 0.915, wr);
          float n = snoise(vec3(cos(ang) * 16.0, sin(ang) * 16.0, sd));
          col = mix(col, mix(cRim0, cRim1, n * 0.5 + 0.5), rim);
          // 交界处零星的毛刺（不连成一圈）
          float tick = snoise(vec3(cos(ang) * 38.0, sin(ang) * 38.0, sd + rr * 6.0));
          float fray = (1.0 - smoothstep(0.0, 0.022, abs(wr - 0.89 - tick * 0.012))) * smoothstep(0.15, 0.65, tick);
          col = mix(col, cFray, fray * 0.6);
        } else {
          // 侧壁：近黑的外皮，一层黄褐的细绒点
          float n = snoise(vec3(cos(ang) * 16.0, sin(ang) * 16.0, vRest.z * 2.0 + sd));
          float fl = mix(0.0, step(0.72, hash12(floor(vec2(ang * 34.0, vRest.z * 5.0 + sd)))), 1.0);
          col = mix(mix(cRim0, cRim1, n * 0.5 + 0.5), cFray, fl * 0.32);
          bump += n * 0.02;
        }
        diffuseColor.rgb = col;
        procBump = bump;
      `,
      bump: true,
    },
  )
}

/** 十个果：主角（0）和另外九个各一份形状。主角要做筒口收进去那一下，所以单独算 */
export class CakeSet implements FruitSet {
  readonly count = 10
  readonly group = new Group()
  readonly heroGroup = new Group()
  readonly hero: Mesh
  readonly others: Mesh[] = []
  readonly heroShape = new CakeGeometry()
  readonly othersShape = new CakeGeometry()
  readonly matHero: MeshPhysicalMaterial
  /** 主角的绒毛层（特写才看得见，只给主角） */
  readonly heroFuzz: Mesh[] = []
  readonly fuzzMats: MeshPhysicalMaterial[] = []
  readonly matOthers: MeshPhysicalMaterial
  /** 切下来的头（带弧的那一截）：和主角同形状，裁面不同 */
  readonly matHeel: MeshPhysicalMaterial
  readonly rots: Quaternion[] = []
  /** 主角此刻的形态：各段的 carry 写，导演每帧交给网格 */
  readonly form: FormState = { dry: 0, oval: 0, cyl: 0 }
  /** 另外九个是不是已经顶出来成了圆柱 */
  othersCyl = 0
  /** 绒面转深：切片时才有 */
  rind = 0

  constructor() {
    this.matHero = cakeMaterial(0)
    this.matOthers = cakeMaterial(3)
    this.matHeel = cakeMaterial(0)
    this.hero = new Mesh(this.heroShape.geo, this.matHero)
    this.hero.castShadow = true
    this.hero.receiveShadow = true
    this.heroGroup.add(this.hero)
    for (const k of [1, 2, 3]) {
      const mat = cakeMaterial(0, k)
      this.fuzzMats.push(mat)
      const m = new Mesh(this.heroShape.geo, mat)
      m.receiveShadow = true
      m.visible = false
      this.heroFuzz.push(m)
      this.heroGroup.add(m)
    }
    const r = rng(41)
    this.rots.push(new Quaternion())
    for (let i = 1; i < this.count; i++) {
      const m = new Mesh(this.othersShape.geo, this.matOthers)
      m.castShadow = true
      m.receiveShadow = true
      m.visible = false
      this.others.push(m)
      this.group.add(m)
      this.rots.push(new Quaternion().setFromAxisAngle(new Vector3(r() - 0.5, r() - 0.5, r() - 0.5).normalize(), r() * Math.PI * 2))
    }
  }
  rot(i: number) {
    return this.rots[i]
  }
  setFruit(i: number, center: Vector3, q: Quaternion) {
    const m = this.others[i - 1]
    m.position.copy(center)
    m.quaternion.copy(q)
  }
  show(on: boolean) {
    for (const m of this.others) m.visible = on
  }
  /** 把这一帧的形态和外观交给网格、材质（导演每帧调） */
  sync(k: { blanch: number; wet: number; dry: number }) {
    const f = this.form
    this.heroShape.set(f)
    this.othersShape.set({ dry: f.dry, oval: 0, cyl: this.othersCyl })
    for (const m of [this.matHero, this.matHeel, ...this.fuzzMats]) setCakeLook(m, { blanch: k.blanch, wet: k.wet, dry: k.dry, cyl: f.cyl, rind: this.rind })
    setCakeLook(this.matOthers, { blanch: k.blanch, wet: k.wet, dry: k.dry, cyl: this.othersCyl, rind: this.rind })
    for (const m of this.heroFuzz) m.visible = f.dry > 0.1
  }
  /** 另外九个的椭圆用缩放来做（压的时刻各不相同）：oval 0 圆 → 1 椭圆，fit 收窄进筒用 */
  setOval(i: number, oval: number, fit = 0) {
    const sx = lerp(1, FORM.oval.x / FORM.shrunk, oval) * lerp(1, FORM.cylR / FORM.oval.x, fit)
    const sy = lerp(1, FORM.oval.y / FORM.shrunk, oval)
    const sz = lerp(1, FORM.oval.z / FORM.shrunk, oval) * lerp(1, FORM.cylR / FORM.oval.z, fit)
    this.others[i - 1].scale.set(sx, sy, sz)
  }
  resetScale() {
    for (const m of this.others) m.scale.set(1, 1, 1)
  }
  /** 裁掉主角的一截（切片用） */
  setClip(planes: Plane[] | null) {
    this.matHero.clippingPlanes = planes
    for (const m of this.fuzzMats) m.clippingPlanes = planes
  }
  /** 皱球放在平面上时果心离平面多高 */
  lift(dry: number) {
    return lerp(R, FORM.shrunk, dry)
  }
}
