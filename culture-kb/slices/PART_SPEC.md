# 全量切片分工说明（子代理用）

你在 culture-kb/slices 目录下工作。目标：把分配给你的类目切成对接用切片，写入 parts/<你的字母>.json。

## 硬规则（与对接标准一致）

1. content 只能来自 sources/ 的原文引用块，由脚本抽取，**禁止手写或改写**。
2. 一片一出处；一篇官网文章最多 2 片；同一出处全文合计不得超过 2 片。
3. content 80–500 字；超了用 paras 指定段落或让脚本自动切；不足 80 的与同出处相邻段合并。
4. title ≤20 字，不含 .md / 路径 / 括号；把访客最可能问的名词放进 title（如「烘干周期」「化橘红是什么」），不要只写类目名。
5. id 格式：{类字母小写}-{主题}-{两位序号}，如 f-dawuzhua-01、e-pinzhong-01。
6. origin：官网文章不用填（脚本自动生成「化橘红官网《文章名》」）；古籍填 tag 即可；内部调研与知识库整理一律 origin='empty'；栏目用 origin='cat', cat='化橘红官网·XX栏目'。
7. 不得与已有 27 片样板重复（emit_part.py 会自动检查 id 与内容）。

## 工作流

1. 读 ../START.md、report.md、slices.json（了解已覆盖内容）。
2. 对你负责的 sources 文件运行：
     python3 list_blocks.py <文件名>.md
   看每个出处小节的段落编号与字数。
3. 写 parts/<字母>.py，内容形如：

     CONFIGS = [
       dict(id='a-mingcheng-01', title='毛橘红与光橘红', file='本体-法定定义与名称.md', tag='§1.2', origin='empty'),
       dict(id='a-zhenwei-01', title='怎么辨别真假化橘红', file='本体-真伪辨别.md', tag='§10.5', origin='empty', paras=[0,1]),
     ]

     可选字段：paras=[段落下标...]（默认全部）、titles=[逐片标题]（该小节切多片时用）。
4. 生成并自检：
     python3 emit_part.py parts/<字母>.py parts/<字母>.json
   必须输出「问题 0」才算完成；有问题按提示改配置重跑。
5. 只创建/修改 parts/<字母>.py 与 parts/<字母>.json，**不要改** build.py、slices.json、report.md、其他 part 文件。

## 交付报告

返回：生成片数、覆盖的主题清单、按 id 列出的清单、有哪些主题找不到原文因此没做、以及用了空 origin 的片数。

## 质量提醒

- 一条切片只讲一个主题；同一小节里话题不同，就拆成两条（用 paras 指定）。
- 表格型小节会自动转成「- 项：值」列表，可直接用。
- 访谈、诗句、剧目等原文保留作者名与出处名，属原文组成部分，不用删。
- 若某主题在 sources 里只有一句话（<80 字），不要硬做，回报说明即可。
