# -*- coding: utf-8 -*-
"""把 parts/<x>.py 的 CONFIGS 生成为 JSON，并做片段级自检。"""
import json, os, sys, re, importlib.util
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import build

def load(path):
    spec = importlib.util.spec_from_file_location('part', path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod.CONFIGS

def main():
    src, dst = sys.argv[1], sys.argv[2]
    cfgs = load(src)
    items = build.build_items(cfgs)
    errs = build.validate(items)

    # 同源片数
    from collections import Counter
    c = Counter(i.get('origin', '(空)') for i in items)
    for k, v in c.items():
        if k != '(空)' and v > 2:
            errs.append('同源超 2 片: %s (%d)' % (k, v))
    # 与已有样板重复
    try:
        base = json.load(open(os.path.join(HERE, 'slices.json'), encoding='utf-8'))
        exist = {re.sub(r'\s', '', x['content']) for x in base}
        ids = {x['id'] for x in base}
        for it in items:
            if re.sub(r'\s', '', it['content']) in exist:
                errs.append('与样板内容重复: ' + it['id'])
            if it['id'] in ids:
                errs.append('与样板 id 冲突: ' + it['id'])
    except FileNotFoundError:
        pass

    print('生成 %d 片，问题 %d' % (len(items), len(errs)))
    for e in errs:
        print(' -', e)
    if not errs:
        json.dump(items, open(dst, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
        print('已写', dst)
    else:
        print('未写文件，先修问题')

if __name__ == '__main__':
    main()
