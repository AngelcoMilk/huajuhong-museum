# -*- coding: utf-8 -*-
CONFIGS = [
    dict(id='d-shanghua-01', title='咏化橘红·赏花节', file='诗文-诗歌文选.md', tag='3.15', origin='tag'),
    dict(id='d-shiyouxing-01', title='化州有幸化橘红有幸', file='诗文-诗歌文选.md', tag='化州有幸', origin='tag'),
    dict(id='d-gequ-01', title='歌曲《化橘红》', file='文艺-歌舞戏曲.md', tag='一曲〈化橘红〉', origin='tag'),
    dict(id='d-mulu-01', title='歌舞戏曲四部作品', file='文艺-歌舞戏曲.md', tag='歌舞戏曲栏目',
         origin='cat', cat='化橘红官网·歌舞戏曲栏目',
         regex=[(r'https?://\S+', ''), (r'\.mp4', ''), (r'—', ''), (r'，禁止转载', ''), (r'\s{2,}', ' ')]),
    dict(id='d-biaoyanchang-01', title='表演唱橘红飘香', file='文艺-歌舞戏曲.md', tag='表演唱〈橘红飘香乐万家〉', origin='tag'),
    dict(id='d-xiqu-01', title='小戏曲喜临橘红村', file='文艺-歌舞戏曲.md', tag='小戏曲〈喜临橘红村〉', origin='tag',
         regex=[(r'来源：化州市文化馆供稿，禁止转载', '')]),
    dict(id='d-chuanqi-01', title='方言歌舞小剧橘红传奇', file='文艺-歌舞戏曲.md', tag='方言歌舞小剧〈橘红传奇〉', origin='tag',
         regex=[(r'来源：化州市文化馆供稿，禁止转载', '')]),
    dict(id='d-duanju-01', title='短剧天下第一红', file='文艺-歌舞戏曲.md', tag='第二季）预告', origin='tag'),
    dict(id='d-zaolang-01', title='短剧造浪·破圈与一果三跃', file='文艺-歌舞戏曲.md', tag='短剧造浪', origin='tag',
         titles=['短剧造浪·破圈与一果三跃', '短剧造浪·金荔奖']),
]
