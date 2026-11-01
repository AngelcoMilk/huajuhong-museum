# -*- coding: utf-8 -*-
CONFIGS = [
    dict(id='l-wudayuan-01', title='五大橘红园', file='非遗-传承谱系.md', tag='知识库', origin='empty', paras=[0],
         regex=[(r'" 明清以来', '"' + chr(10) + '明清以来')]),
    dict(id='l-lishi-01', title='李家园李氏谱系', file='非遗-传承谱系.md', tag='知识库', origin='empty', paras=[1], drop=['代；人物；事'],
         regex=[(r'(?m)^- —；', '- ')]),
    dict(id='l-guimo-01', title='种植面积古今对比', file='非遗-传承谱系.md', tag='知识库', origin='empty', paras=[2]),
]