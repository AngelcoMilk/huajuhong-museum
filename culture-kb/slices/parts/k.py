# -*- coding: utf-8 -*-
"""K 展陈：博览馆场景、参观动线与馆相关报道切片。"""

CONFIGS = [
    # 馆内 8 个场景 + 3 个配套车间 + 金羊网参观顺序（多源整理，origin 留空）
    dict(id='k-boguan-01', title='博览馆8场景与参观顺序', file='展陈-博物馆与场景.md',
         tag='酷雷曼', origin='empty',
         extra=[('展陈-博物馆与场景.md', '金羊网')],
         drop=['场景ID'],
         replace={'同组另有 3 个配套车间场景': '另有 3 个配套车间场景'},
         regex=[(r'（均 1020 切片）', ''), (r'；scene\d+；1020', ''),
                (r'\s*scene\d+', '')]),
    dict(id='k-boguan-02', title='化橘红种植始于晋代', file='展陈-博物馆与场景.md',
         tag='馆相关文章', paras=[0], origin='cat',
         cat='化橘红官网《化橘红博览馆印象》'),
    dict(id='k-boguan-03', title='化橘红胎地方标准', file='展陈-博物馆与场景.md',
         tag='馆相关文章', paras=[1], origin='cat',
         cat='化橘红官网《化橘红博览馆走笔》'),
    dict(id='k-boguan-04', title='博览馆获评社科普及基地', file='展陈-博物馆与场景.md',
         tag='馆相关文章', paras=[2], origin='cat',
         cat='化橘红官网《喜讯！化橘红博览馆获评茂名市社会科学普及基地》'),
    dict(id='k-boguan-05', title='化橘红两个3A景区', file='展陈-博物馆与场景.md',
         tag='馆相关文章', paras=[3], origin='cat',
         cat='化橘红官网《上榜了！化州两个化橘红旅游区成功获批国家3A级旅游景区》'),
]
