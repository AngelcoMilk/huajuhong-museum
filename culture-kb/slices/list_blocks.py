# -*- coding: utf-8 -*-
"""列出 sources 文件的出处小节与段落块，供切片配置挑选 paras。"""
import sys, os, re
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import build

def main():
    fname = sys.argv[1]
    needle = sys.argv[2] if len(sys.argv) > 2 else None
    secs = build.read_sections(fname)
    for tag, bodies in secs.items():
        if needle and needle not in tag:
            continue
        text = build.clean(build.quote_text(bodies[0]))
        blocks = build.blocks_of(text)
        print('## 〔%s〕 段落 %d' % (tag, len(blocks)))
        for i, b in enumerate(blocks):
            r = build.render_block(b)
            print('  [%d] %4d 字 | %s' % (i, len(re.sub(r'\s', '', r)), r[:56].replace('\n', ' ')))

if __name__ == '__main__':
    main()
