# -*- coding: utf-8 -*-
"""合并样板 + 各 part，去重、限同源片数、校验、检索回归。"""
import json, os, re, sys, glob, collections
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import build

def norm(s):
    return re.sub(r'\s', '', s)

def load_all():
    items = json.load(open(os.path.join(HERE, 'slices.json'), encoding='utf-8'))
    parts = sorted(glob.glob(os.path.join(HERE, 'parts', '*.json')))
    for p in parts:
        try:
            data = json.load(open(p, encoding='utf-8'))
        except Exception as e:
            print('!! 读取失败', os.path.basename(p), e)
            continue
        items += data
        print('读取', os.path.basename(p), len(data), '片')
    return items

def bigrams(s):
    s = re.sub(r'\s', '', s)
    return {s[i:i+2] for i in range(len(s)-1)}

def near_dup(items, threshold=0.45):
    kept, dropped = [], []
    for it in items:
        b = bigrams(it['content'])
        dup = False
        for k in kept:
            if not b:
                continue
            kb = bigrams(k['content'])
            inter = len(b & kb)
            union = len(b | kb) or 1
            if inter / union >= threshold:
                dropped.append((it['id'], '近似重复 %s (%.2f)' % (k['id'], inter/union)))
                dup = True
                break
        if not dup:
            kept.append(it)
    return kept, dropped

DROP_IDS = {
    'f-jiage-01', 'f-zhuanli-01', 'f-zhuangbei-01', 'f-zhuangbei-02',
    'f-yaguo-02', 'f-hongfang-01', 'f-qieban-01', 'f-tongyong-02',
    'd-mulu-01',
    'd-mulu-01', 'g-liulei-01', 'i-qiye-03', 'f-qunang-02',
    'f-zhengxian-01', 'f-tai-01', 'f-canshu-03',
}
TITLES = {
    'a-biaozhi-01': '专用标志怎么申请',
    'a-mingcheng-02': '七爪五爪和圆果是什么',
    'a-huanjing-01': '化州产地在哪里',
    'a-huanjing-02': '化州的气候与土壤',
    'a-suyuan-01': '一码溯源怎么查',
    'b-bencaogangmu-01': '古人怎么记载化橘红',
    'b-shijian-01': '化橘红什么时候进药典',
    'b-wenxian-01': '化橘红文献怎么串起来',
    'e-biaozhun-02': '有哪些化橘红地方标准',
    'e-pinxi-01': '化橘红有哪五个品种',
    'f-canshu-01': '烘干几天出成率多少',
    'f-dawuzhua-01': '大五爪是什么',
    'f-liushui-01': '七爪流水线有哪八道',
    'f-qieban-02': '七爪切瓣机怎么等分',
    'f-qunang-01': '去囊机怎么去瓤',
    'f-sanxian-01': '橘红胎怎么烘',
    'f-tongyong-01': '加工要用哪些通用设备',
    'f-xiandai-01': '现代工序有哪十二道',
    'g-xingtai-01': '化橘红有哪些形态',
    'h-tiaoli-01': '保护条例管什么',
    'h-yaodian-02': '药典水分灰分柚皮苷',
    'h-yicuo-02': '这些说法哪里不对',
    'i-gongyuan-02': '产业园带动多少人',
    'i-qiye-02': '赋码企业有哪些',
    'j-shuju-01': '面积产值历年变化',
    'j-chanye-01': '产业结构什么样',
    'k-vr-01': '博览馆VR能看什么',
    'l-wudayuan-01': '五大橘红园是哪几个',
}

def postprocess(items):
    out = []
    for it in items:
        if it['id'] in DROP_IDS:
            continue
        c = it['content']
        # 去重叠：只保留各自独有段落
        if it['id'] == 'j-shuju-01':
            c = '\n'.join(l for l in c.split('\n') if not re.match(r'^- 20(24|25|26)', l))
        if it['id'] == 'h-yaodian-02':
            lines = c.split('\n')
            c = '\n'.join(l for i, l in enumerate(lines) if i == 0 or any(k in l for k in ('水分', '总灰分', '柚皮苷')))
        if it['id'] == 'f-canshu-01':
            c = '\n'.join(l for l in c.split('\n') if not any(k in l for k in ('脱苦', '炮制', 'GMP', '水分', '总灰分', '柚皮苷')))
        if it['id'] == 'j-yuanqu-01' and not c.startswith('2021'):
            c = '2021 年，' + c
        if it['id'] == 'f-yaguo-01':
            c = c.replace('这是化橘红区别于', '压果是化橘红区别于', 1)
        if it['id'] in ('k-boguan-02', 'k-boguan-03', 'k-boguan-04', 'k-boguan-05'):
            m = re.search(r'[：:]\s*[“"](.+)[”"]\s*$', c, re.S)
            if m:
                c = re.sub(r'……$', '', m.group(1).strip())
        c = re.sub(r'^来源[:：].*$', '', c, flags=re.M)
        c = c.replace('（专利背景自述）', '').replace('（化橘红官网表述）', '')
        c = c.replace('【', '').replace('】', '').replace('‖', '')
        c = re.sub(r'CN\d{6,}[A-Z]?', '', c)
        c = re.sub(r'[ \t]{2,}', ' ', c).strip()
        if len(re.sub(r'\s', '', c)) < 80:
            continue
        it['content'] = c
        if 'origin' in it:
            it['origin'] = re.sub(r'^(化橘红官网《[^》]+》).*$', r'\1', it['origin'])
            if it['origin'].startswith('化橘红官网《') and 'url' not in it:
                name = it['origin'][len('化橘红官网《'):-1]
                u = build.article_url(name)
                if u:
                    it['url'] = u
        if it['id'] in TITLES:
            it['title'] = TITLES[it['id']]
        out.append(it)
    return out

def dedupe(items):
    out, ids, contents = [], set(), set()
    dropped = []
    for it in items:
        key = norm(it['content'])
        if it['id'] in ids:
            dropped.append((it['id'], '重复 id')); continue
        if key in contents:
            dropped.append((it['id'], '重复内容')); continue
        ids.add(it['id']); contents.add(key); out.append(it)
    return out, dropped

def cap_origin(items, cap=2):
    cnt = collections.Counter()
    out, dropped = [], []
    for it in items:
        o = it.get('origin')
        if o:
            if cnt[o] >= cap:
                dropped.append((it['id'], '同源超 %d 片: %s' % (cap, o))); continue
            cnt[o] += 1
        out.append(it)
    return out, dropped, cnt

def search(items, q, limit=3):
    groups = []
    syn = os.path.join(HERE, 'synonyms.txt')
    if os.path.exists(syn):
        for line in open(syn, encoding='utf-8'):
            line = line.strip()
            if line:
                groups.append(line.split('|'))
    INTENT = [(('是什么', '什么是', '定义', '何为', '怎么定义'), ['定义', '名称']),
              (('几天', '多久', '周期', '多长时间'), ['周期', '天'])]
    literal = {q} | {t for g in groups for t in g if t in q}
    inferred = set()
    for g in groups:
        if any(t in q for t in g):
            inferred.update(t for t in g if t not in literal)
    for keys, extra in INTENT:
        if any(k in q for k in keys):
            inferred.update(extra)
    ts = literal | inferred
    hits = []
    for it in items:
        score = 0
        for t in ts:
            w = 16 if t in literal else 8
            if t in it['title']:
                score += w
            if t in it['content']:
                score += w // 2
            score += min(it['content'].count(t), 5)
        if q in it['title']:
            score += 20
        if score:
            hits.append((score, it))
    hits.sort(key=lambda x: (-x[0], x[1]['id']))
    return [h[1] for h in hits[:limit]]

def main():
    items = load_all()
    items = postprocess(items)
    items, d1 = dedupe(items)
    items, d1b = near_dup(items)
    items, d2, cnt = cap_origin(items)
    errs = build.validate(items)
    print('合并后', len(items), '片；去重丢弃', len(d1), '；近似重复丢弃', len(d1b), '；限流丢弃', len(d2))
    for x in d1 + d1b + d2:
        print('  丢弃', x)
    print('校验问题', len(errs))
    for e in errs:
        print('  -', e)
    cls = collections.Counter(i['id'][0] for i in items)
    print('类分布', dict(sorted(cls.items())))
    print('origin 有值', sum(1 for i in items if 'origin' in i), '空', sum(1 for i in items if 'origin' not in i), 'url', sum(1 for i in items if 'url' in i))
    lens = [len(norm(i['content'])) for i in items]
    print('长度 min/median/max', min(lens), sorted(lens)[len(lens)//2], max(lens))
    print()
    tests = [('七爪是什么', 'f-qizhua'), ('化橘红怎么定义', 'a-yaodian'), ('罗辨是谁', 'c-luobian'),
             ('烘干要几天', 'f-canshu'), ('李宗仁和化橘红', 'c-lizongren'),
             ('橘红胎怎么烘', 'f-sanxian'), ('大五爪是什么', 'f-dawuzhua'), ('压果片怎么来的', 'f-yaguo')]
    for q, exp in tests:
        r = search(items, q)
        ok = bool(r) and r[0]['id'].startswith(exp)
        print(('PASS' if ok else 'FAIL'), q, '->', [x['id'] for x in r])
    empty = search(items, '张三丰')
    print(('PASS' if not empty else 'FAIL'), '张三丰 ->', empty)
    if '--write' in sys.argv and not errs:
        json.dump(items, open(os.path.join(HERE, 'slices_full.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
        print('已写 slices_full.json')

if __name__ == '__main__':
    main()
