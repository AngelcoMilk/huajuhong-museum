// 园区 / 博物馆两厅的数据类型。
// 数据本身由后台内容接口提供；src/data/ 下的 park.json、museum.json 只作接口不可用时的回落。

/** 正文里的一个排版块：段落 / 小标题 / 插图 / 图注 */
export type TextBlock = {
  kind: 'p' | 'h3' | 'img' | 'note'
  text?: string
  src?: string
  alt?: string
}

export type BlockAlign = 'left' | 'center' | 'right'

/** 正文块，前后台共用同一形状。文本一律当纯文本渲染，段落里只认 **粗体** */
export type Block =
  | { kind: 'p'; text: string; align?: BlockAlign }
  | { kind: 'h2' | 'h3'; text: string; align?: BlockAlign }
  | { kind: 'img'; src: string; alt?: string; caption?: string; width?: number; align?: BlockAlign }
  | { kind: 'imgrow'; images: { src: string; alt?: string }[]; caption?: string }
  | { kind: 'quote'; text: string }
  | { kind: 'list'; ordered?: boolean; items: string[] }
  | { kind: 'table'; rows: string[][]; header?: boolean }
  | { kind: 'video' | 'audio'; src: string; poster?: string; caption?: string }
  | { kind: 'note'; text: string }
  | { kind: 'hr' }

export type MediaImage = { url: string; alt: string }

/** 一篇园区图文（官网栏目的原文，已按块切好，一个字词没改） */
export type HallSection = {
  id: string
  title: string
  sub: string
  date: string
  sourceUrl: string
  blocks: TextBlock[]
  images: MediaImage[]
  usage: string
  caution: string
  copyright: string
  /** 正文与另一篇重复时，记下那一篇的 id（官网「园区优势」与「带动农户」同文） */
  duplicateOf?: string
}

/** 一个全景场景（酷雷曼项目 147899 里的一场面） */
export type VrScene = {
  /** 官方素材编号 VR-001～047 */
  id: string
  title: string
  gid: string
  /** 引擎里的场景名，如 scene628738 */
  sceneId: string
  /** 立方体切片数，用来标"场面大小" */
  slices: number
  thumb: string
  preview: string
  /** 单场景全景页（酷雷曼 pano.html），点哪个场景就开哪一场；空串表示只能进总入口 */
  panoUrl: string
  /** 已本地化的缩略图路径；没下载到就为空串 */
  thumbLocal: string
  group: string
  /** 后台指定的大图 */
  featured?: boolean
  description?: string
}

export type VrGroup = { key: string; name: string; scenes: VrScene[] }

export type Stat = { value: string; unit: string; label: string }

/** 一篇关于博览馆的官网文章 */
export type HallArticle = {
  id: string
  title: string
  /** 栏目名，如「博览馆文章」 */
  sub: string
  date: string
  sourceUrl: string
  text: string
  blocks: TextBlock[]
  usage: string
  caution: string
  copyright: string
  /** 官网镜像只抓到节选、末句断在半句上 */
  truncated: boolean
}