# -*- coding: utf-8 -*-
"""J 数据：面积产量产值 / 荣誉与年表"""

CONFIGS = [
    # 产业结构：二产占比、加工转化率、文旅、金融、审批
    dict(id='j-chanye-01', title='二产占比与产业结构', file='数据-面积产量产值.md',
         tag='§10.2', origin='empty'),

    # 价格与等级逻辑（原文连续列表，按句号断行）
    dict(id='j-jiage-01', title='价格·保底价与等级分档', file='数据-面积产量产值.md',
         tag='§10.4', origin='empty', regex=[(r'。\s+-\s+', '。\n- ')]),

    # 产业园产值口径（152.47 亿元、占 GDP 27.2%）
    dict(id='j-yuanqu-01', title='产业园产值152亿口径', file='数据-面积产量产值.md',
         tag='化州成功创建', origin='tag'),

    # 销售端：线上销售额、客单价、复购率
    dict(id='j-xiaoshou-01', title='线上销售与复购率', file='数据-面积产量产值.md',
         tag='从72亿到126亿', origin='tag'),

    # 称号：中国气候好产品 + 品牌矩阵
    dict(id='j-chenghao-01', title='中国气候好产品称号', file='数据-荣誉与年表.md',
         tag='气候好产品', origin='tag'),

    # 农业文化遗产（2026.10 第八批）
    dict(id='j-yichan-01', title='第八批农业文化遗产', file='数据-荣誉与年表.md',
         tag='第八批中国重要农业文化遗产', origin='tag', paras=[0]),

    # 地理标志综合价值百强（广东第三）+ 荣誉清单
    dict(id='j-baiqiang-01', title='地标价值百强·广东第三', file='数据-荣誉与年表.md',
         tag='综合价值百强', origin='tag'),
]
