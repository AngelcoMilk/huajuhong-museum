# -*- coding: utf-8 -*-
# A 本体：法定定义与名称 / 道地性 / 真伪辨别
CONFIGS = [
    # —— 法定定义与名称 ——
    dict(id='a-mingcheng-01', title='名称对照·毛橘红与光橘红',
         file='本体-法定定义与名称.md', tag='知识库 · 详细调研 §1.2', origin='empty',
         rows_kw=['- 化橘红 / 化州橘红', '- 毛橘红', '- 光橘红', '- 橘红；']),
    dict(id='a-mingcheng-02', title='七爪五爪·橘红胎与圆果',
         file='本体-法定定义与名称.md', tag='知识库 · 详细调研 §1.2', origin='empty',
         rows_kw=['- 七爪', '- 黄七爪', '- 橘红胎', '- 圆果', '- 光青', '- 副毛']),
    dict(id='a-julei-01', title='橘类橘红与化橘红区别',
         file='本体-法定定义与名称.md', tag='知识库 · 详细调研 §1.3', origin='empty',
         regex=[(r' - ', '\n- ')]),

    # —— 道地性 ——
    dict(id='a-huanjing-01', title='产地环境·经纬与地形',
         file='本体-道地性.md', tag='化橘红官网 · 《化橘红产地环境》', origin='tag',
         titles=['产地环境·经纬与地形', '产地环境·气候与礞石土壤']),

    # —— 真伪辨别 ——
    dict(id='a-zhenwei-01', title='正毛副毛光青·看绒毛',
         file='本体-真伪辨别.md', tag='化橘红官网 · 《什么是道地化橘红？》', origin='tag'),
    dict(id='a-zhenwei-02', title='真伪双指标·绒毛与柚皮苷',
         file='本体-真伪辨别.md', tag='知识库 · 详细调研 §1.2', origin='empty',
         extra=[('本体-真伪辨别.md', '知识库 · 详细调研 §8.1')]),
    dict(id='a-biaozhi-01', title='专用标志·理化指标与申请',
         file='本体-真伪辨别.md', tag='化橘红官网 · 《关于批准对化橘红实施地理标志产品保护的公告》', origin='tag',
         regex=[(r'^2\. ', ''), (r'三、专用标志使用', '专用标志使用')]),
    dict(id='a-maochong-01', title='广西橘红冒充与治理工具',
         file='本体-真伪辨别.md', tag='知识库 · 详细调研 §10.5', origin='empty',
         regex=[(r' - ', '\n- ')]),
    dict(id='a-suyuan-01', title='一码溯源·23家主体',
         file='本体-真伪辨别.md', tag='化橘红官网 · 《化州化橘红实现一码溯源 全链条监管》', origin='tag'),
]