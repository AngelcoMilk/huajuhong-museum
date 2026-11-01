# -*- coding: utf-8 -*-
"""culture-kb -> slices.json：逐字原文、一片一出处、80-500 字。"""
import json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'sources')
RAW = os.path.join(ROOT, 'raw')
HEADER_CELLS = {'年份','事件','项目','指标','序号','品种','环节','名称','分类','维度','时间','时期','流传说法','数据项','指标项','#','时点','品名','规格','等级','工位'}

def read_sections(fname):
    t = open(os.path.join(SRC, fname), encoding='utf-8').read()
    parts = re.split(r'^## 〔(.+?)〕$', t, flags=re.M)
    out = {}
    for i in range(1, len(parts), 2):
        out.setdefault(parts[i], []).append(parts[i+1])
    return out

def pick_tag(secs, needle):
    if needle in secs:
        return needle
    for tag in secs:
        if needle in tag:
            return tag
    raise KeyError(needle)

def quote_text(body):
    out = []
    for l in body.split('\n'):
        if l.startswith('> '):
            out.append(l[2:])
        elif l.strip() == '>':
            out.append('')
    return '\n'.join(out)

def clean(s):
    s = re.sub(r'!\[[^\]]*\]\([^)]*\)', '', s)
    s = re.sub(r'\[([^\]]*)\]\([^)]*\)', r'\1', s)
    s = re.sub(r'〔[^〕]*〕', '', s)
    s = s.replace('**', '')
    s = re.sub(r'^\s*#{1,6}\s*', '', s, flags=re.M)
    s = re.sub(r'^\s*(原位置|原文链接)[:：].*$', '', s, flags=re.M)
    s = re.sub(r'^\s*\d+\.\d+\s+(?=[^\s])', '', s, flags=re.M)  # 只去 6.4 / 8.1 这类节号
    s = re.sub(r'^\s*\d+\s+(?!年|月|日|时|分)', '', s, flags=re.M)  # 去列表序号，但保留 1982 年这类年份
    s = re.sub(r'[ \t]+', ' ', s)
    return s.strip()

def blocks_of(text):
    return [b.strip() for b in re.split(r'\n\s*\n', text) if b.strip()]

def table_to_list(block):
    rows = []
    for line in block.split('\n'):
        line = line.strip()
        if not line.startswith('|'):
            continue
        cells = [c.strip() for c in line.strip('|').split('|')]
        if all(re.fullmatch(r':?-{2,}:?', c or '--') for c in cells):
            continue
        cells = [c for c in cells if c != '']
        if not cells:
            continue
        if cells[0] in HEADER_CELLS:
            continue
        rows.append('- ' + '；'.join(cells))
    return rows

def render_block(block):
    lines = [l for l in block.split('\n') if l.strip()]
    if any(l.strip().startswith('|') for l in lines):
        prose = [l for l in lines if not l.strip().startswith('|')]
        table = '\n'.join(table_to_list(block))
        head = re.sub(r'\s*\n\s*', ' ', ' '.join(prose)).strip()
        return '\n'.join(x for x in (head, table) if x)
    return re.sub(r'\s*\n\s*', ' ', block).strip()

def split_units(text, limit=480):
    """先按列表行/句子聚合到 limit 内，不切断单条。"""
    if len(text) <= limit:
        return [text]
    units = text.split('\n') if '\n' in text else re.split(r'(?<=[。！？；])', text)
    chunks, cur = [], ''
    for u in units:
        piece = u.strip()
        if not piece:
            continue
        if len(cur) + len(piece) > limit and cur:
            chunks.append(cur.strip())
            cur = piece
        else:
            cur += ('\n' if '\n' in text and cur else '') + piece
    if cur.strip():
        chunks.append(cur.strip())
    if len(chunks) == 2 and len(chunks[1]) < 150 and len(chunks[0]) > 300:
        sents = re.split(r'(?<=[。！？；])', text)
        half, a, b = len(text) / 2, '', ''
        for s in sents:
            if len(a) < half:
                a += s
            else:
                b += s
        if a and b:
            chunks = [a.strip(), b.strip()]
    return chunks

def merge_small(blocks, minimum=80):
    out = []
    for b in blocks:
        if out and len(out[-1]) < minimum:
            out[-1] = out[-1] + '\n' + b
        else:
            out.append(b)
    if len(out) > 1 and len(out[-1]) < minimum:
        out[-2] = out[-2] + '\n' + out[-1]
        out.pop()
    return out

import difflib

def _norm_title(s):
    s = re.sub(r'[《》〈〉“”"\'·\s]', '', s)
    return s

def article_url(title):
    cands = []
    for root, _, files in os.walk(RAW):
        for f in files:
            if not f.endswith('.md'):
                continue
            p = os.path.join(root, f)
            try:
                head = open(p, encoding='utf-8').read(1500)
            except Exception:
                continue
            first = head.split('\n', 1)[0].lstrip('# ').strip()
            m = re.search(r'原文链接[:：]\s*(https?://\S+)', head)
            if m:
                cands.append((first, m.group(1)))
    nt = _norm_title(title)
    best = None
    for first, u in cands:
        nf = _norm_title(first)
        if nf == nt:
            return u
        if nt and nt in nf and (best is None or len(nf) < best[0]):
            best = (len(nf), u)
    if best:
        return best[1]
    keys = [_norm_title(c[0]) for c in cands]
    hit = difflib.get_close_matches(nt, keys, n=1, cutoff=0.72)
    if hit:
        return cands[keys.index(hit[0])][1]
    return None

SLICES = [
    dict(id='c-luobian-01', title='罗辨仙翁饮石坑水', file='典故-罗辨植橘.md', tag='罗辨仙翁植橘', paras=[0, 1]),
    dict(id='c-luobian-02', title='罗辨植橘与白牛传说', file='典故-罗辨植橘.md', tag='罗辨仙翁植橘', paras=[2]),
    dict(id='c-cuiniao-01', title='翠鸟送种', file='典故-民间传说五则.md', tag='翠鸟送种'),
    dict(id='c-lizongren-01', title='李宗仁与赖园橘红', file='典故-民间传说五则.md', tag='李宗仁与化橘红'),
    dict(id='a-yaodian-01', title='化橘红是什么·药典定义', file='本体-法定定义与名称.md', tag='《中国药典》2020 年版一部'),
    dict(id='a-yaodian-02', title='1963年药典·七爪五爪规格', file='本体-法定定义与名称.md', tag='《中国药典》1963 年版一部'),
    dict(id='b-huazhouzhi-01', title='一片值一金·《化州志》', file='源流-本草纲目拾遗.md', tag='《化州志》（光绪十四年）',
         extra=[('非遗-传承谱系.md', '《化州志》（光绪十四年）')], origin='empty'),
    dict(id='f-qizhua-01', title='七爪的由来', file='工艺-古法工序.md', tag='七爪"的由来',
         titles=['七爪是什么·由来', '七爪为何成为贡品']),
    dict(id='f-canshu-01', title='烘干周期·出成率与药典指标', file='工艺-关键参数与出成率.md', tag='§6.4', origin='empty'),
    dict(id='a-didao-01', title='为什么只有化州能种', file='本体-道地性.md', tag='§2.3', origin='empty'),
    dict(id='f-xiandai-01', title='现代加工·十二道工序', file='工艺-现代工序.md', tag='§6.3', origin='empty'),
    dict(id='b-shijian-01', title='历史·化橘红现代节点', file='源流-时间轴.md', tag='§3.4', origin='empty',
         titles=['历史·1963到2021节点', '历史·2024到2026节点']),
    dict(id='i-gongyuan-01', title='国家现代农业产业园', file='园区-产业园与基地.md', tag='产业园栏目',
         origin='cat', cat='化橘红官网·产业园栏目',
         titles=['产业园·265万亩布局', '产业园·联农带农与科技']),
    dict(id='i-qiye-01', title='首批赋码企业名单', file='企业-名录与镇街.md', tag='官宣，首批23家',
         titles=['企业·首批23家赋码', '企业·赋码名单与范围']),
    dict(id='k-vr-01', title='博览馆 VR 全景', file='展陈-VR场景清单.md', tag='VR',
         origin='cat', cat='化橘红博览馆 VR 全景', replace={'酷雷曼': '第三方'},
         titles=['VR全景·博览馆场景', 'VR全景·园区场景清单'],
         regex=[(r'scene\d+', ''), (r'……', '，'), (r'站点本身不存 VR 切片', ''), (r'（第三方）', ''), (r'，，+', '，')]),
    dict(id='h-yaodian-02', title='药典指标·水分灰分柚皮苷', file='标准-药典指标.md', tag='§8.1', origin='empty'),
    dict(id='j-shuju-01', title='种植面积·历年产值数据', file='数据-面积产量产值.md', tag='§4', origin='empty'),
    dict(id='a-tiaomu-01', title='药典·性味归经与用法用量', file='标准-药典指标.md', tag='§8.1', origin='empty',
         rows_kw=['性味归经', '功能主治', '用法用量', '贮藏', '含量测定']),
    dict(id='g-chanpin-01', title='化橘红膏', file='产品-代表条目.md', tag='《化橘红膏》',
         titles=['化橘红膏·是什么', '化橘红膏·功效与吃法']),
    dict(id='d-shige-01', title='贺药食同源推介诗联', file='诗文-诗歌文选.md', tag='《贺化橘红"药食同源"全球推介圆满成功》',
         titles=['诗联·药食同源作品一', '诗联·药食同源作品二']),
]
for i, cfg in enumerate(SLICES):
    cfg.setdefault('origin', 'tag')
    cfg.setdefault('paras', 'all')

def origin_of(cfg, tag):
    if cfg['origin'] == 'empty':
        return None
    if cfg['origin'] == 'cat':
        return cfg['cat']
    m = re.match(r'化橘红官网 · 《([^》]+)》', tag)
    if m:
        return '化橘红官网《' + m.group(1) + '》'
    return tag

def collect(cfg):
    secs = read_sections(cfg['file'])
    tag = pick_tag(secs, cfg['tag'])
    text = clean(quote_text(secs[tag][0]))
    raw_blocks = blocks_of(text)
    rendered = [render_block(b) for b in raw_blocks]
    if cfg.get('paras') not in (None, 'all'):
        rendered = [rendered[i] for i in cfg['paras'] if i < len(rendered)]
    if 'rows_kw' in cfg:
        items = '\n'.join(rendered).split('\n')
        rendered = ['\n'.join(l for l in items if any(k in l for k in cfg['rows_kw']))]
    if cfg.get('drop'):
        rendered = ['\n'.join(l for l in r.split('\n') if not any(d in l for d in cfg['drop'])) for r in rendered]
        rendered = [r for r in rendered if r.strip()]
    rendered = merge_small(rendered)
    for f2, t2 in cfg.get('extra', []):
        s2 = read_sections(f2)
        tag2 = pick_tag(s2, t2)
        rendered += merge_small([render_block(b) for b in blocks_of(clean(quote_text(s2[tag2][0])))])
    content = '\n'.join(x for x in rendered if x)
    if cfg.get('replace'):
        for a, b in cfg['replace'].items():
            content = content.replace(a, b)
    if cfg.get('regex'):
        for pat, rep in cfg['regex']:
            content = re.sub(pat, rep, content)
    content = re.sub(r'\s{2,}', ' ', content).strip()
    return tag, content

def build_items(cfgs):
    out = []
    for cfg in cfgs:
        cfg.setdefault('origin', 'tag')
        cfg.setdefault('paras', 'all')
        tag, content = collect(cfg)
        chunks = split_units(content)
        base = cfg['id'][:-1] if re.search(r'-\d$', cfg['id']) is None else cfg['id']
        chunks = merge_small(chunks)
        for k, ch in enumerate(chunks, 1):
            if len(chunks) == 1:
                sid, title = cfg['id'], cfg['title']
            else:
                base = cfg['id'].rsplit('-', 1)[0]
                sid = '%s-%02d' % (base, k)
                ts = cfg.get('titles') or []
                title = ts[k - 1] if k - 1 < len(ts) else '%s·%d' % (cfg['title'], k)
            item = dict(id=sid, title=title, source='知识库')
            o = origin_of(cfg, tag)
            if o:
                item['origin'] = o
                m = re.match(r'化橘红官网《(.+)》$', o)
                if m:
                    u = article_url(m.group(1))
                    if u:
                        item['url'] = u
            item['content'] = ch
            out.append(item)
    return out

def build():
    return build_items(SLICES)

def validate(items):
    errs = []
    seen = set()
    for it in items:
        if it['id'] in seen:
            errs.append('重复 id ' + it['id'])
        seen.add(it['id'])
        if len(it['title']) > 20:
            errs.append('title 超 20 字: ' + it['title'])
        if re.search(r'[./\\]', it['title']):
            errs.append('title 含路径字符: ' + it['title'])
        n = len(re.sub(r'\s', '', it['content']))
        if not (80 <= n <= 500):
            errs.append('长度 %d 越界: %s' % (n, it['id']))
        for bad in ['〔', '〕', '../', 'h-col', '147899', '酷雷曼', '.md', '/Users/', 'scene']:
            if bad in it['content']:
                errs.append('content 含内部痕迹 %s: %s' % (bad, it['id']))
        if 'origin' in it and ('知识库' in it['origin'] or '内部' in it['origin']):
            errs.append('origin 含占位词: ' + it['id'])
        if 'url' in it and not re.match(r'https?://', it['url']):
            errs.append('url 非 http: ' + it['id'])
    return errs

if __name__ == '__main__':
    items = build()
    errs = validate(items)
    print('切片数', len(items), '校验问题', len(errs))
    for e in errs:
        print(' -', e)
    if '--write' in sys.argv:
        d = os.path.dirname(os.path.abspath(__file__))
        json.dump(items, open(os.path.join(d, 'slices.json'), 'w', encoding='utf-8'),
                  ensure_ascii=False, indent=2)
        print('已写 slices.json')
