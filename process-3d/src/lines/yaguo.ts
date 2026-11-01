import { Blanch } from '../acts/blanch'
import { Pick } from '../acts/pick'
import { Weigh } from '../acts/weigh'
import { Bottling, CakeOven, IntoTube, PressFruit, Slice, TubeOven } from '../acts/yaguo'
import type { LineDef } from './types'

// 书页是集句，句子逐字取自《中国药典》和《岭南杂记》（见《本草纲目拾遗》卷七），原文不是专讲压果片的；竹筒这一步查不到古籍出处，不写进书页。

export const YAGUO: LineDef = {
  id: 'yaguo',
  name: '压果片',
  blurb: '大果烫过烘软，压扁套进竹筒烘干，顶出来切成小圆片。',
  ready: true,
  cast: { kind: 'cake' },
  acts: (s) => [new Pick(s), new Weigh(s, 4.8), new Blanch(s), new CakeOven(s), new PressFruit(s), new IntoTube(s), new TubeOven(s), new Slice(s), new Bottling(s)],
  script: {
    cover: { title: '压果片', sub: '整果压扁、入筒、切片', play: '开始' },
    sentence: [
      { key: 'y1', text: '夏季采摘未成熟的果实，', clear: ['pick', 12.5] },
      { key: 'y2', text: '置沸水中略烫后，', clear: ['blanch', 16] },
      { key: 'y3', text: '焙干，', clear: ['cakeOven', 13.5] },
      { key: 'y4', text: '压制成形，', clear: ['press', 7] },
      { key: 'y5', text: '干燥。', clear: ['cover', 11] },
      { key: 'y6', text: '每片真者可值一金。', clear: ['slice', 19] },
      { key: 'y7', text: '置阴凉干燥处，防潮及虫蛀。', clear: ['bottle', 11.5] },
    ],
    source: '——集《中国药典》《岭南杂记》句',
    chapters: [
      { num: '一', title: '青果', seal: '摘', from: 'pick', phrases: ['y1'], card: '挑四两半以上的大果。' },
      { num: '二', title: '烫果', seal: '烫', from: 'blanch', phrases: ['y2'], card: '大果整个烫过。' },
      { num: '三', title: '初烘', seal: '焙', from: 'cakeOven', phrases: ['y3'], card: '小火烘软，缩小一大半。' },
      { num: '四', title: '压果', seal: '压', from: 'press', phrases: ['y4'], card: '木压果器压成椭圆。' },
      { num: '五', title: '入筒烘干', seal: '烘', from: 'tube', phrases: ['y5'], card: '套进竹筒定型，上焙炉烘干。' },
      { num: '六', title: '切片', seal: '切', from: 'slice', phrases: ['y6'], card: '切成两到四毫米的圆片。' },
      { num: '', title: '装瓶', seal: '成', from: 'bottle', phrases: ['y7'], card: '一簸箕圆片，倒进瓶里。' },
    ],
    captions: [
      ['pick', 8.6, 13.6, '青果还没熟，皮上一层细细的白绒。'],
      ['weigh', 1.4, 4.4, '挑个大的，放上秤称一称。'],
      ['weigh', 4.9, 8.2, '四两八。四两半以上的大果，拿来压果。'],
      ['blanch', 2.5, 7.5, '水要滚透了才下锅。'],
      ['blanch', 8.2, 12.0, '一篮十个，一起下锅。'],
      ['blanch', 13.8, 18.6, '一烫就捞，颜色转亮了。'],
      ['blanch', 21.4, 27, '摊在竹筛上放凉，沥干水。'],
      ['cakeOven', 2, 5.6, '整果摊上焙炉，小火烘。'],
      ['cakeOven', 6.6, 9.6, '烘一阵，翻一面。'],
      ['cakeOven', 11, 15.2, '烘软了，个头小了一大半。'],
      ['press', 1.4, 5.6, '烘软的果放上压果器，压下去。'],
      ['press', 8, 12.2, '抬起来，圆球压成了椭圆。'],
      ['tube', 1.8, 4.6, '趁软套进竹筒。'],
      ['tube', 5.4, 9.6, '木棍一推，压到筒里定型。'],
      ['cover', 1.8, 4.6, '竹筒竖在竹筛上，盖上竹罩。'],
      ['cover', 5.2, 8.8, '小火慢烘，直到烘透。'],
      ['cover', 10, 13.8, '揭开罩，竹筒由青转黄。'],
      ['slice', 2.6, 8, '木棍一顶，出来一根毛绒圆柱，模样像鹿茸。'],
      ['slice', 11, 15.2, '推一点，切一刀，两到四毫米厚。'],
      ['slice', 19.8, 22.9, '外皮一圈深色，切面由褐转琥珀黄。'],
      ['bottle', 1.8, 4.4, '一簸箕压果片。'],
      ['bottle', 6.6, 12.9, '倒进瓶里，盖好。'],
    ],
    ending: { title: '压果片', seal: '成', replay: '再看一遍', more: '去展厅看看现在怎么做' },
  },
}
