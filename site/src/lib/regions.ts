// 中国「省 → 市 → 区县」三级区划（离线数据，产物随仓库发布）。
//
// 数据由 site/scripts/build-regions.mjs 生成，勿手改。
// 这里用动态 import 懒加载：只有真正打开「选地区」时才拉这个数据块，首屏不带。

export type RegionCity = {
  /** 市 / 地区 / 州 / 盟名 */
  n: string
  /** 下辖区县，顺序与源一致 */
  d: string[]
}

export type RegionProvince = {
  /** 省 / 自治区 / 直辖市 / 特别行政区名 */
  n: string
  c: RegionCity[]
}

let cached: Promise<RegionProvince[]> | null = null

/** 取三级区划；首次调用触发一次数据块加载，之后复用同一 Promise */
export function loadRegions(): Promise<RegionProvince[]> {
  if (!cached) {
    cached = import('../data/regions.json').then(
      (mod) => (mod as unknown as { default: RegionProvince[] }).default,
    )
  }
  return cached
}

/** 按名字找省（含直辖市 / 特别行政区），找不到返回 undefined */
export function findProvince(
  provinces: readonly RegionProvince[],
  name: string,
): RegionProvince | undefined {
  return provinces.find((p) => p.n === name)
}

/** 按名字找市，找不到返回 undefined */
export function findCity(
  province: RegionProvince | undefined,
  name: string,
): RegionCity | undefined {
  return province?.c.find((c) => c.n === name)
}
