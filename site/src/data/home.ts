// 序厅内容。史实按馆方展陈与地方志口径写；图片取自项目自己的拍摄与整理，仅作演示。
// 文案按博物馆展签写：传说标「相传」，引方志写版本年份。

export type Chronicle = { when: string; book: string; text: string }

export const RECORDS: Chronicle[] = [
  { when: '明万历（约 1600）', book: '《高州府志》', text: '化州橘红为化州独有' },
  { when: '清康熙十四年（1675）', book: '《广东通志》', text: '灵奇珍异' },
  { when: '清乾隆十三年（1748）', book: '《化州志》', text: '惟橘红最为佳品' },
]

// 规模曲线：mu 只用来算柱高，页面上显示 value + unit
export type Step = { when: string; value: string; unit: string; mu: number; note?: string }

export const STEPS: Step[] = [
  { when: '1949', value: '30', unit: '余亩', mu: 30 },
  { when: '1970 年代初', value: '3000', unit: '余亩', mu: 3000 },
  { when: '1985', value: '8500', unit: '亩', mu: 8500 },
  { when: '2005 前后', value: '3', unit: '万余亩', mu: 30000 },
  { when: '2026', value: '14.3', unit: '万亩', mu: 143000, note: '年产鲜果 7.6 万吨' },
]

export const HONORS = [
  { when: '2006', title: '国家地理标志产品' },
  { when: '2012', title: '广东省省级非遗' },
  { when: '2024', title: '食药物质目录' },
  { when: '2026', title: '中国重要农业文化遗产' },
]

export type ArchiveSub = { name: string; count: number }

// 历史文化的七个子栏目（103 条），并进序厅资料台
export const ARCHIVE: ArchiveSub[] = [
  { name: '药理作用', count: 29 },
  { name: '诗歌文选', count: 21 },
  { name: '典故逸事', count: 19 },
  { name: '歌舞戏曲', count: 17 },
  { name: '何为化橘红', count: 8 },
  { name: '抗疫担当', count: 5 },
  { name: '历史悠久', count: 4 },
]

export type Shape = { name: string; note: string; img: string }

export const SHAPES: Shape[] = [
  { name: '毛橘红', note: '果面密被绒毛', img: '/img/shape-mao.jpg' },
  { name: '七爪橘红', note: '割七刀，压制成形', img: '/img/shape-qizhua.jpg' },
  { name: '橘红胎', note: '幼果整果干燥', img: '/img/shape-tai.jpg' },
  { name: '陈年橘红', note: '存放三年以上', img: '/img/shape-chennian.jpg' },
]

export type Hall = { no: string; name: string; route: string; meta: string; cover: string }

// 参观动线：序厅之后的五个展厅，按这个顺序首尾相接
export const HALLS: Hall[] = [
  { no: '壹', name: '园区', route: '/park', meta: '6 栏图文 · 36 个全景', cover: '/img/board-park.jpg' },
  { no: '贰', name: '博物馆', route: '/museum', meta: '馆内 8 场景 · 车间 3 场景', cover: '/img/board-museum.jpg' },
  { no: '叁', name: '工艺', route: '/craft', meta: '4 种古法做法 · 5 台机器', cover: '/img/tl-shaqing.jpg' },
  { no: '肆', name: '企业地图', route: '/enterprises', meta: '12 个镇街 · 34 家企业', cover: '/img/board-ent.jpg' },
  { no: '伍', name: '产品中心', route: '/products', meta: '六类产品', cover: '/img/board-products.jpg' },
]
