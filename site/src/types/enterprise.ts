// 企业板块的数据形状。数据源是企业档案，构建时整理成 src/data/enterprises.json。
// 地图点位由 scripts/build-map-data.mjs 生成（镇街近似坐标 + 确定性偏移），不是精确地理编码。

export interface EnterpriseShop {
  label: string
  url: string
}

export interface EnterpriseImage {
  url: string
  alt: string
}

export interface EnterpriseVideo {
  url: string
  alt: string
}

export interface Enterprise {
  /** 素材编号 QY-001 ~ QY-035 */
  id: string
  name: string
  /** 镇街名；官网未标注时为「待核」 */
  town: string
  address: string
  tel: string
  email: string
  site: string
  shops: EnterpriseShop[]
  /** 企业自述原文，照录不改写 */
  text: string
  date: string
  sourceUrl: string
  images: EnterpriseImage[]
  /** 官网图总数（站内只留前 12 张） */
  imageTotal: number
  videos: EnterpriseVideo[]
  articleCount: number
}

export interface GeoPoint {
  lng: number
  lat: number
  /** 坐标口径，如「镇街中心 + 偏移（OSM / 待核）」 */
  coordSource: string
  verified: boolean
}

export interface MappedEnterprise extends Enterprise, GeoPoint {}

export interface TownPoint {
  name: string
  lng: number
  lat: number
  kind: 'suburb' | 'town' | 'city'
  /** 标签摆在哪一侧（排版权用） */
  side?: string
  /** 该镇街是否只有「待核」企业 */
  pending?: boolean
}

export interface EnterpriseMapProps {
  items: MappedEnterprise[]
  selectedId: string | null
  hoveredId: string | null
  /** 点了「打开档案」时传进来：地图要飞到这家企业的特写 */
  focusId?: string | null
  activeTown: string | null
  /** 在册总数（筛选后 items 会变少，用来显示「2 家 / 共 34 家」） */
  total?: number
  /** 点地图上的单点：打开这家企业的档案（页面负责收起上一家再展开） */
  onOpen?: (id: string) => void
  onSelect: (id: string) => void
  onHover: (id: string | null) => void
}