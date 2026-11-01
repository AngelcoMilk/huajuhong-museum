# -*- coding: utf-8 -*-
"""H 标准：药典指标 / 体系与地理标志 / 合规红线"""

CONFIGS = [
    # 药典鉴别两项 + 含量测定（§8.1 中的三行）
    dict(id='h-jianbie-01', title='药典鉴别与含量测定', file='标准-药典指标.md',
         tag='§8.1', origin='empty', rows_kw=['鉴别①', '鉴别②', '含量测定']),

    # 地理标志公告里的理化指标
    dict(id='h-libiao-01', title='地理标志理化指标', file='标准-药典指标.md', origin='tag',
         tag='地理标志产品保护的公告'),

    # 保护范围 14 个镇街
    dict(id='h-fanwei-01', title='保护范围14个镇街', file='标准-体系与地理标志.md', origin='tag',
         tag='地理标志产品保护的公告', paras=[1]),

    # 三级标准体系（表头「层级」行去掉）
    dict(id='h-tixi-01', title='化橘红三级标准体系', file='标准-体系与地理标志.md', origin='empty',
         tag='§8.2', paras=[1], drop=['层级；文件']),

    # 保护条例：七章五十三条 + 道地性保护 + 全链条监管
    dict(id='h-tiaoli-01', title='保护条例·七章五十三条', file='标准-体系与地理标志.md',
         origin='cat', cat='化橘红官网《茂名市化橘红保护发展条例》5月1日起施行',
         tag='保护发展条例', paras=[0, 1]),

    # 条例配套：地方标准制度 + 2+10 标准 + 专用标志
    dict(id='h-biaozhun-01', title='2+10标准与专用标志', file='标准-体系与地理标志.md',
         origin='cat', cat='化橘红官网《茂名市化橘红保护发展条例》5月1日起施行',
         tag='保护发展条例', paras=[2, 3],
         regex=[(r'答\s*市市场监管局\s*[：:]\s*', '')]),

    # 新增 5 项地方标准
    dict(id='h-difangbiaozhun-01', title='新增5项地方标准', file='标准-体系与地理标志.md', origin='tag',
         tag='地方标准+5', replace={'规a定了': '规定了'}),

    # 示范区获批（491 字，自动切两片）
    dict(id='h-shifanqu-01', title='国家地标示范区获批', file='标准-体系与地理标志.md', origin='tag',
         tag='四年筹建结硕果', titles=['粤西首个国家地标示范区', '示范区·标准与执法成效']),

    # 易错说法两张（附录 F 十条拆两片）
    dict(id='h-yicuo-01', title='易错说法·橘皮与史料', file='标准-合规红线.md', origin='empty',
         tag='附录 F',
         drop=['柚皮苷高 4 倍', '七爪只是好看', '所有橘红都能叫', '烘得越干越好', '陈化越久']),
    dict(id='h-yicuo-02', title='易错说法·指标与陈化', file='标准-合规红线.md', origin='empty',
         tag='附录 F',
         drop=['就是橘子皮', '本草纲目》记载', '神农本草经', '种植历史', '99 下']),
]
