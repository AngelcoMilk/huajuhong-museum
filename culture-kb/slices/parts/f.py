# -*- coding: utf-8 -*-
"""F 工艺 part：古法工序 / 现代工序 / 机器 / 关键参数 + 三条产线缺口。"""

CONFIGS = [
    # ── 古法工序 ────────────────────────────────────────────────
    dict(id='f-gufa-01', title='古法六步与七步工序', file='工艺-古法工序.md', tag='§6.1',
         origin='empty', extra=[('工艺-古法工序.md', '§6.2')],
         regex=[(r'```', ''), (r'\s{2,}', ' ')]),
    dict(id='f-feiyi-01', title='七爪开皮与荔枝木烘三日',
         file='工艺-古法工序.md', tag='《化橘红从摘果到制成', origin='tag'),

    # ── 现代工序（十二道表按 80 字下限分两段） ───────────────────
    dict(id='f-xiandai-02', title='前七道·采摘到精去瓤', file='工艺-现代工序.md', tag='§6.3',
         origin='empty', rows_kw=['1；采摘', '2；选果分级', '3；清洗', '4；杀青', '5；割瓣', '6；粗去瓤', '7；精去瓤']),
    dict(id='f-xiandai-03', title='后五道·压形到包装', file='工艺-现代工序.md', tag='§6.3',
         origin='empty', rows_kw=['8；压形', '9；一次烘干', '10；二次压制', '11；陈化', '12；切片']),

    # ── 产线：大五爪 ────────────────────────────────────────────
    dict(id='f-dawuzhua-01', title='大五爪与七爪五爪规格', file='产品-分类与形态谱系.md', tag='§1.2',
         origin='empty', rows_kw=['光七爪', '按割瓣数', '大五爪']),
    dict(id='f-dawuzhua-02', title='五爪怎么切·改传动比', file='工艺-机器.md', tag='§7.2',
         origin='empty', paras=[0, 1], rows_kw=['巧思一', '现场价值']),

    # ── 产线：压果片（压果机两片） ──────────────────────────────
    dict(id='f-yaguo-01', title='压果机·双液压圆柱成型', file='工艺-机器.md', tag='§7.2',
         origin='empty', paras=[3, 4], rows_kw=['这是化橘红', 'CN202220081126', 'CN201922355516']),
    dict(id='f-yaguo-02', title='压果机价格与人工对照', file='工艺-机器.md', tag='§7.2',
         origin='empty', paras=[4], rows_kw=['商品机', '传统对照']),

    # ── 产线：橘红胎 ────────────────────────────────────────────
    dict(id='f-tai-01', title='橘红胎与圆果压果', file='产品-分类与形态谱系.md', tag='§1.2',
         origin='empty', rows_kw=['化橘红 / 化州橘红', '橘红胎 / 橘红胎果', '圆果 / 压果']),

    # ── 机器：五类专机 ──────────────────────────────────────────
    dict(id='f-qieban-01', title='七爪切瓣机为何独有', file='工艺-机器.md', tag='§7.2',
         origin='empty', paras=[0, 1], rows_kw=['为什么独有', '商品机', '专利']),
    dict(id='f-qieban-02', title='切深自适应与去瓤标识', file='工艺-机器.md', tag='§7.2',
         origin='empty', paras=[0, 1], rows_kw=['核心机构', '巧思二', '巧思三']),
    dict(id='f-qunang-01', title='去囊机·旋挖去瓤', file='工艺-机器.md', tag='§7.2',
         origin='empty', paras=[2], drop=['- 项；内容']),
    dict(id='f-qunang-02', title='去囊机·800个每小时', file='工艺-机器.md', tag='五台机器参数卡 §7.1',
         origin='empty',
         replace={'论文全文（《南方农机》2026, 57(5): 23-26，免费 PDF）；茂名人社局项目页的样机实拍 3 张；2022 国创年会展板；': '',
                  '论文图 1 所示结构': '结构'}),
    dict(id='f-hongfang-01', title='热泵烘房·7天变4天', file='工艺-机器.md', tag='§7.2',
         origin='empty', paras=[5], drop=['- 项；内容']),
    dict(id='f-qiepian-01', title='定长切片机·压果后切片', file='工艺-机器.md', tag='§7.2',
         origin='empty', paras=[6]),

    # ── 机器：通用设备 / 整线 / 装备格局 / 报价 / 专利 ───────────
    dict(id='f-tongyong-01', title='选果清洗杀青设备', file='工艺-机器.md', tag='§7.3',
         origin='empty', rows_kw=['分级选果', '清洗；', '杀青；']),
    dict(id='f-tongyong-02', title='深加工与包装质检设备', file='工艺-机器.md', tag='§7.3',
         origin='empty', rows_kw=['深加工', '包装溯源', '质检', '非标定制']),
    dict(id='f-zhengxian-01', title='红峰农场智能初加工线', file='工艺-机器.md', tag='§7.4',
         origin='empty'),
    dict(id='f-zhuangbei-01', title='装备格局·成熟与中试', file='工艺-机器.md', tag='§7.5',
         origin='empty', rows_kw=['已成熟商品机', '已出样机']),
    dict(id='f-zhuangbei-02', title='去瓤瓶颈与采购要点', file='工艺-机器.md', tag='§7.5',
         origin='empty', rows_kw=['行业瓶颈', '采购要点']),
    dict(id='f-jiage-01', title='设备报价·切瓣机七万八', file='工艺-机器.md', tag='附录 C',
         origin='empty', paras=[1], drop=['- 设备；品牌/厂商；参考价']),
    dict(id='f-zhuanli-01', title='化橘红加工专利五项', file='工艺-机器.md', tag='附录 C',
         origin='empty', paras=[0], drop=['- 专利号；名称；申请人/发明人']),

    # ── 关键参数（参数片已用，补炮制/GMP/脱苦与出成率单列） ──────
    dict(id='f-canshu-02', title='炮制脱苦与GMP流程', file='工艺-关键参数与出成率.md', tag='§6.4',
         origin='empty', paras=[1], rows_kw=['脱苦', '炮制', 'GMP']),
    dict(id='f-canshu-03', title='出成率·百斤鲜果二十斤', file='工艺-关键参数与出成率.md', tag='§6.4',
         origin='empty', paras=[1], rows_kw=['烘干周期', '出成率', '出皮率', '采摘窗口']),
]
