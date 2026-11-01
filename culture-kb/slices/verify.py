# -*- coding: utf-8 -*-
import json, os, re, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import build

HERE = os.path.dirname(os.path.abspath(__file__))
items = build.build()
errs = build.validate(items)

groups = []
for line in open(os.path.join(HERE, 'synonyms.txt'), encoding='utf-8'):
    line = line.strip()
    if line:
        groups.append(line.split('|'))

INTENT = [
    (('是什么', '什么是', '定义', '何为', '怎么定义'), ['定义', '名称']),
    (('几天', '多久', '周期', '多长时间'), ['周期', '天']),
    (('谁', '人物', '来历'), ['传说', '仙翁', '李宗仁']),
]

def terms(q):
    out = {q}
    for g in groups:
        if any(t in q for t in g):
            out.update(g)
    for keys, extra in INTENT:
        if any(k in q for k in keys):
            out.update(extra)
    return out

def search(q, limit=3):
    ts = terms(q)
    hits = []
    for it in items:
        score = 0
        for t in ts:
            if t in it['title']:
                score += 12
            if t in it['content']:
                score += 6
            score += min(it['content'].count(t), 5)
        if score > 0:
            hits.append((score, it))
    hits.sort(key=lambda x: (-x[0], x[1]['id']))
    return [h[1] for h in hits[:limit]]

TESTS = [
    ('七爪是什么', 'f-qizhua'),
    ('化橘红怎么定义', 'a-yaodian'),
    ('罗辨是谁', 'c-luobian'),
    ('烘干要几天', 'f-canshu'),
    ('李宗仁和化橘红', 'c-lizongren'),
]
print('== 检索测试 ==')
for q, expect in TESTS:
    res = search(q)
    ok = bool(res) and res[0]['id'].startswith(expect)
    print(('PASS' if ok else 'FAIL'), q, '->', [r['id'] for r in res])
empty = search('张三丰')
print(('PASS' if empty == [] else 'FAIL'), '张三丰 ->', empty)
qz = search('七爪')
print('七爪 top1:', qz[0]['id'] if qz else None, '| 命中数', len(qz))
print()
print('== 校验 ==')
print('切片', len(items), '问题', len(errs))
for e in errs:
    print(' -', e)
# 形态统计
stats = {
  'origin': sum(1 for i in items if 'origin' in i),
  'no_origin': sum(1 for i in items if 'origin' not in i),
  'url': sum(1 for i in items if 'url' in i),
  'list': sum(1 for i in items if '\n- ' in i['content']),
}
print('统计', stats)
for i in items:
    if 'url' in i:
        print('URL', i['id'], i['url'])
if '--write' in sys.argv:
    json.dump(items, open(os.path.join(HERE, 'slices.json'), 'w', encoding='utf-8'),
              ensure_ascii=False, indent=2)
    print('written')
