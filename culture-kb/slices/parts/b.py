# -*- coding: utf-8 -*-
CONFIGS = [
    dict(id='b-bencaogangmu-01', title='清代文献·本草纲目拾遗', file='源流-本草纲目拾遗.md', tag='详细调研 §3.2', origin='empty',
         regex=[(r' - ', chr(10) + '- ')]),
    dict(id='b-yinwen-01', title='李时珍写过化橘红吗', file='源流-本草纲目拾遗.md', tag='详细调研 §3.3', origin='empty'),
    dict(id='b-wenxian-01', title='化橘红历史文献链', file='源流-本草纲目拾遗.md', tag='详细调研 摘要 5', origin='empty'),
    dict(id='b-gudai-01', title='古代化橘红记载', file='源流-时间轴.md', tag='详细调研 §3.1', origin='empty',
         regex=[(r'/地方口径；', ''), (r'；可信；', '；')]),
    dict(id='b-nongyi-01', title='化橘红入选农业文化遗产', file='源流-时间轴.md', tag='农业农村部关于公布第八批', origin='tag'),
]
