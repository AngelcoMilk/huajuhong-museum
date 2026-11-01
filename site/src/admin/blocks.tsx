// 正文块编辑器与图片输入：展项编辑器和 VR、页面头共用。块的结构和前台 HallBlocks 是同一份。
import { useLayoutEffect, useRef, useState, type ClipboardEvent, type KeyboardEvent } from "react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  ArrowDown,
  ArrowUp,
  Bold,
  GripVertical,
  Heading2,
  Image as ImageIcon,
  Images,
  List,
  Minus,
  Music,
  Pilcrow,
  Plus,
  Quote,
  StickyNote,
  Table,
  Trash2,
  Upload,
  Video,
  X,
} from "lucide-react";
import { api, ApiError, type Block } from "./api";
import { moveInList, stepInList, useDragSort } from "./sortable";
import { Popover, toast } from "./ui";

type BlockAlign = "left" | "center" | "right";

export interface EditBlock {
  key: string;
  block: Block;
}

let seq = 0;
const nextKey = () => `b${(seq += 1)}`;

export const toEditBlocks = (blocks: Block[] | null | undefined): EditBlock[] => (blocks ?? []).map((block) => ({ key: nextKey(), block }));

const TEXT_KINDS = ["p", "h2", "h3", "quote", "note"] as const;
type TextKind = (typeof TEXT_KINDS)[number];
const isTextKind = (kind: string): kind is TextKind => (TEXT_KINDS as readonly string[]).includes(kind);

const KIND_LABEL: Record<Block["kind"], string> = {
  p: "段落",
  h2: "大标题",
  h3: "小标题",
  img: "图片",
  imgrow: "多图",
  quote: "引用",
  list: "列表",
  table: "表格",
  video: "视频",
  audio: "音频",
  note: "附注",
  hr: "分隔线",
};

const ADD_OPTIONS: Array<{ kind: Block["kind"]; icon: typeof Pilcrow }> = [
  { kind: "p", icon: Pilcrow },
  { kind: "h2", icon: Heading2 },
  { kind: "img", icon: ImageIcon },
  { kind: "imgrow", icon: Images },
  { kind: "quote", icon: Quote },
  { kind: "list", icon: List },
  { kind: "table", icon: Table },
  { kind: "video", icon: Video },
  { kind: "audio", icon: Music },
  { kind: "note", icon: StickyNote },
  { kind: "hr", icon: Minus },
];

function emptyBlock(kind: Block["kind"]): Block {
  switch (kind) {
    case "img":
      return { kind, src: "" };
    case "imgrow":
      return { kind, images: [{ src: "" }, { src: "" }] };
    case "list":
      return { kind, items: [""] };
    case "table":
      return { kind, header: true, rows: [["", ""], ["", ""]] };
    case "video":
    case "audio":
      return { kind, src: "" };
    case "hr":
      return { kind };
    default:
      return { kind, text: "" } as Block;
  }
}

/** 提交前去掉空内容；返回每块对应的原下标，接口报第几块时能指回原来的位置 */
export function cleanBlocks(list: EditBlock[]): { blocks: Block[]; origin: number[] } {
  const blocks: Block[] = [];
  const origin: number[] = [];
  list.forEach(({ block }, index) => {
    const cleaned = cleanBlock(block);
    if (!cleaned) return;
    blocks.push(cleaned);
    origin.push(index);
  });
  return { blocks, origin };
}

function cleanBlock(block: Block): Block | null {
  switch (block.kind) {
    case "p":
    case "h2":
    case "h3":
    case "quote":
    case "note":
      return block.text.trim() ? block : null;
    case "list": {
      const items = block.items.map((item) => item.trim()).filter(Boolean);
      return items.length > 0 ? { ...block, items } : null;
    }
    case "imgrow": {
      const images = block.images.filter((image) => image.src.trim());
      return images.length > 0 ? { ...block, images } : null;
    }
    case "table":
      return block.rows.some((row) => row.some((cell) => cell.trim())) ? block : null;
    default:
      return block;
  }
}

/** 必填项没填的块：图片和音视频没有地址 */
export function blockProblem(block: Block): string | null {
  if ((block.kind === "img" || block.kind === "video" || block.kind === "audio") && !block.src.trim()) return `${KIND_LABEL[block.kind]}还没有地址`;
  return null;
}

/** 文本框随内容长高，编辑长文章时不出现一堆小滚动条 */
function useAutoHeight(value: string) {
  const ref = useRef<HTMLTextAreaElement | null>(null);
  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;
    node.style.height = "auto";
    node.style.height = `${node.scrollHeight + 2}px`;
  }, [value]);
  return ref;
}

function AlignButtons({ value, onChange }: { value?: BlockAlign; onChange: (next: BlockAlign | undefined) => void }) {
  const current = value ?? "left";
  const options: Array<{ key: BlockAlign; label: string; icon: typeof AlignLeft }> = [
    { key: "left", label: "靠左", icon: AlignLeft },
    { key: "center", label: "居中", icon: AlignCenter },
    { key: "right", label: "靠右", icon: AlignRight },
  ];
  return (
    <span className="block-tools" role="group" aria-label="对齐">
      {options.map(({ key, label, icon: Icon }) => (
        <button key={key} type="button" className={current === key ? "icon-btn icon-btn--sm is-on" : "icon-btn icon-btn--sm"} title={label} aria-label={label} aria-pressed={current === key} onClick={() => onChange(key === "left" ? undefined : key)}>
          <Icon size={15} strokeWidth={1.75} aria-hidden />
        </button>
      ))}
    </span>
  );
}

function TextEditor({ block, onChange, onPasteLines }: { block: Extract<Block, { kind: TextKind }>; onChange: (next: Block) => void; onPasteLines: (first: string, rest: string[]) => void }) {
  const ref = useAutoHeight(block.text);
  const aligned = block.kind === "p" || block.kind === "h2" || block.kind === "h3";

  function bold() {
    const node = ref.current;
    if (!node) return;
    const { selectionStart: from, selectionEnd: to, value } = node;
    const selected = value.slice(from, to);
    // 已经是粗体就去掉，不然加上
    const wrapped = value.slice(Math.max(0, from - 2), from) === "**" && value.slice(to, to + 2) === "**";
    const text = wrapped ? value.slice(0, from - 2) + selected + value.slice(to + 2) : `${value.slice(0, from)}**${selected}**${value.slice(to)}`;
    onChange({ ...block, text });
    const start = wrapped ? from - 2 : from + 2;
    requestAnimationFrame(() => {
      node.focus();
      node.setSelectionRange(start, start + selected.length);
    });
  }

  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "b") {
      event.preventDefault();
      bold();
    }
  }

  // 粘贴多段文字自动分成多块：第一段留在当前块，其余往后排
  function onPaste(event: ClipboardEvent<HTMLTextAreaElement>) {
    const lines = event.clipboardData.getData("text/plain").split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
    if (lines.length < 2) return;
    event.preventDefault();
    const node = event.currentTarget;
    const first = node.value.slice(0, node.selectionStart) + lines[0] + node.value.slice(node.selectionEnd);
    onPasteLines(first, lines.slice(1));
  }

  return (
    <>
      <div className="block-card__row">
        <select className="select select--sm" aria-label="块类型" value={block.kind} onChange={(e) => onChange({ ...block, kind: e.target.value as TextKind } as Block)}>
          {TEXT_KINDS.map((kind) => (
            <option key={kind} value={kind}>
              {KIND_LABEL[kind]}
            </option>
          ))}
        </select>
        {aligned && <AlignButtons value={"align" in block ? block.align : undefined} onChange={(align) => onChange(withOptional({ ...block }, "align", align))} />}
        <button type="button" className="icon-btn icon-btn--sm" title="粗体" aria-label="粗体" onClick={bold}>
          <Bold size={15} strokeWidth={2} aria-hidden />
        </button>
      </div>
      <textarea ref={ref} className="textarea block-card__text" rows={2} aria-label={KIND_LABEL[block.kind]} value={block.text} onChange={(e) => onChange({ ...block, text: e.target.value })} onKeyDown={onKeyDown} onPaste={onPaste} />
    </>
  );
}

/** 空值不写进块里，保持结构干净 */
function withOptional<T extends object>(target: T, key: string, value: unknown): T {
  const next = { ...target } as Record<string, unknown>;
  if (value === undefined || value === "") delete next[key];
  else next[key] = value;
  return next as T;
}

/** 地址 + 上传 + 缩略图；图打不开就地提示 */
export function ImageInput({ value, onChange, label, placeholder = "粘贴图片地址，或上传", accept = "image/*", invalid }: { value: string; onChange: (next: string) => void; label: string; placeholder?: string; accept?: string; invalid?: boolean }) {
  const [broken, setBroken] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const shown = value.trim();
  const isVideo = accept.startsWith("video");

  async function upload(file: File) {
    setUploading(true);
    try {
      const uploaded = await api.upload(file);
      onChange(uploaded.url);
    } catch (err) {
      toast(err instanceof ApiError ? err.message : "上传失败");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="image-input">
      {!isVideo && (
        <span className="image-input__fig" aria-hidden={!shown}>
          {shown && broken !== shown ? <img src={shown} alt="" referrerPolicy="no-referrer" onError={() => setBroken(shown)} /> : <ImageIcon size={18} strokeWidth={1.5} aria-hidden />}
        </span>
      )}
      <div className="image-input__main">
        <div className="image-input__row">
          <input className="input" aria-label={label} aria-invalid={invalid || undefined} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
          <label className="btn btn-tonal image-input__upload" aria-disabled={uploading}>
            <Upload size={15} strokeWidth={1.75} aria-hidden />
            {uploading ? "上传中…" : "上传"}
            <input
              type="file"
              accept={accept}
              hidden
              disabled={uploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void upload(file);
                e.currentTarget.value = "";
              }}
            />
          </label>
        </div>
        {!isVideo && shown && broken === shown && <p className="field__error">这张图打不开，请换一个地址或重新上传。</p>}
      </div>
    </div>
  );
}

function ImageBlockEditor({ block, onChange }: { block: Extract<Block, { kind: "img" }>; onChange: (next: Block) => void }) {
  return (
    <>
      <ImageInput label="图片地址" value={block.src} onChange={(src) => onChange({ ...block, src })} />
      <div className="block-card__row">
        <input className="input input--grow" aria-label="图片说明" placeholder="图片说明，可留空" value={block.caption ?? ""} onChange={(e) => onChange(withOptional(block, "caption", e.target.value))} />
        <AlignButtons value={block.align} onChange={(align) => onChange(withOptional(block, "align", align))} />
      </div>
      <label className="block-range">
        <span>宽度</span>
        <input type="range" min={10} max={100} step={5} aria-label="显示宽度" value={block.width ?? 100} onChange={(e) => onChange(withOptional(block, "width", Number(e.target.value) === 100 ? undefined : Number(e.target.value)))} />
        <span className="mono">{block.width ?? 100}%</span>
      </label>
    </>
  );
}

function ImageRowEditor({ block, onChange }: { block: Extract<Block, { kind: "imgrow" }>; onChange: (next: Block) => void }) {
  const setImage = (index: number, src: string) => onChange({ ...block, images: block.images.map((image, at) => (at === index ? { ...image, src } : image)) });
  return (
    <>
      {block.images.map((image, index) => (
        <div className="block-card__row" key={index}>
          <div className="input--grow">
            <ImageInput label={`第 ${index + 1} 张图片地址`} value={image.src} onChange={(src) => setImage(index, src)} />
          </div>
          <button type="button" className="icon-btn icon-btn--sm" title="去掉这张" aria-label={`去掉第 ${index + 1} 张`} onClick={() => onChange({ ...block, images: block.images.filter((_, at) => at !== index) })}>
            <X size={15} strokeWidth={1.75} aria-hidden />
          </button>
        </div>
      ))}
      <div className="block-card__row">
        <input className="input input--grow" aria-label="多图说明" placeholder="说明，可留空" value={block.caption ?? ""} onChange={(e) => onChange(withOptional(block, "caption", e.target.value))} />
        <button type="button" className="btn btn-sm" onClick={() => onChange({ ...block, images: [...block.images, { src: "" }] })}>
          <Plus size={15} strokeWidth={1.75} aria-hidden />
          加一张
        </button>
      </div>
    </>
  );
}

function ListEditor({ block, onChange }: { block: Extract<Block, { kind: "list" }>; onChange: (next: Block) => void }) {
  const text = block.items.join("\n");
  const ref = useAutoHeight(text);
  return (
    <>
      <div className="block-card__row">
        <label className="check-inline">
          <input type="checkbox" checked={Boolean(block.ordered)} onChange={(e) => onChange(withOptional(block, "ordered", e.target.checked || undefined))} />
          带序号
        </label>
      </div>
      <textarea ref={ref} className="textarea block-card__text" rows={3} aria-label="列表内容，一行一项" placeholder="一行一项" value={text} onChange={(e) => onChange({ ...block, items: e.target.value.split("\n") })} />
    </>
  );
}

function TableEditor({ block, onChange }: { block: Extract<Block, { kind: "table" }>; onChange: (next: Block) => void }) {
  const width = Math.max(1, ...block.rows.map((row) => row.length));
  const setCell = (r: number, c: number, value: string) => onChange({ ...block, rows: block.rows.map((row, at) => (at === r ? row.map((cell, col) => (col === c ? value : cell)) : row)) });
  return (
    <>
      <div className="block-card__row">
        <label className="check-inline">
          <input type="checkbox" checked={Boolean(block.header)} onChange={(e) => onChange(withOptional(block, "header", e.target.checked || undefined))} />
          第一行是表头
        </label>
        <button type="button" className="btn btn-sm" onClick={() => onChange({ ...block, rows: [...block.rows, Array.from({ length: width }, () => "")] })}>
          加一行
        </button>
        <button type="button" className="btn btn-sm" onClick={() => onChange({ ...block, rows: block.rows.map((row) => [...row, ""]) })}>
          加一列
        </button>
        <button type="button" className="btn btn-sm" disabled={width <= 1} onClick={() => onChange({ ...block, rows: block.rows.map((row) => row.slice(0, width - 1)) })}>
          去掉末列
        </button>
      </div>
      <div className="block-table" style={{ gridTemplateColumns: `repeat(${width}, minmax(96px, 1fr)) 32px` }}>
        {block.rows.map((row, r) => (
          <div className="block-table__row" key={r}>
            {Array.from({ length: width }, (_, c) => (
              <input key={c} className="input input--cell" aria-label={`第 ${r + 1} 行第 ${c + 1} 列`} value={row[c] ?? ""} onChange={(e) => setCell(r, c, e.target.value)} />
            ))}
            <button type="button" className="icon-btn icon-btn--sm" title="删除这行" aria-label={`删除第 ${r + 1} 行`} disabled={block.rows.length <= 1} onClick={() => onChange({ ...block, rows: block.rows.filter((_, at) => at !== r) })}>
              <X size={15} strokeWidth={1.75} aria-hidden />
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

function MediaEditor({ block, onChange }: { block: Extract<Block, { kind: "video" | "audio" }>; onChange: (next: Block) => void }) {
  return (
    <>
      {block.kind === "video" ? (
        <ImageInput label="视频地址" accept="video/mp4" placeholder="粘贴视频地址，或上传 mp4" value={block.src} onChange={(src) => onChange({ ...block, src })} />
      ) : (
        <input className="input" aria-label="音频地址" placeholder="粘贴音频地址" value={block.src} onChange={(e) => onChange({ ...block, src: e.target.value })} />
      )}
      {block.kind === "video" && <ImageInput label="封面图地址" placeholder="封面图，可留空" value={block.poster ?? ""} onChange={(poster) => onChange(withOptional(block, "poster", poster))} />}
      <input className="input" aria-label="说明" placeholder="说明，可留空" value={block.caption ?? ""} onChange={(e) => onChange(withOptional(block, "caption", e.target.value))} />
    </>
  );
}

function AddMenu({ anchor, onPick, onClose }: { anchor: HTMLElement; onPick: (kind: Block["kind"]) => void; onClose: () => void }) {
  return (
    <Popover anchor={anchor} onClose={onClose} label="添加内容块">
      <div className="block-add-menu">
        {ADD_OPTIONS.map(({ kind, icon: Icon }) => (
          <button
            key={kind}
            type="button"
            className="btn btn-text btn-sm"
            onClick={() => {
              onPick(kind);
              onClose();
            }}
          >
            <Icon size={15} strokeWidth={1.75} aria-hidden />
            {KIND_LABEL[kind]}
          </button>
        ))}
      </div>
    </Popover>
  );
}

export function BlocksEditor({ value, onChange, errorKey, errorText }: { value: EditBlock[]; onChange: (next: EditBlock[]) => void; errorKey?: string | null; errorText?: string | null }) {
  const [adding, setAdding] = useState<{ anchor: HTMLElement; at: number } | null>(null);
  const keys = value.map((item) => item.key);

  function applyOrder(next: string[] | null) {
    if (!next) return;
    const byKey = new Map(value.map((item) => [item.key, item]));
    onChange(next.map((key) => byKey.get(key) as EditBlock));
  }

  const drag = useDragSort((id, _from, spot) => applyOrder(moveInList(keys, id, spot)));

  const setBlock = (key: string, block: Block) => onChange(value.map((item) => (item.key === key ? { ...item, block } : item)));

  function insert(at: number, blocks: Block[]) {
    const created = blocks.map((block) => ({ key: nextKey(), block }));
    onChange([...value.slice(0, at), ...created, ...value.slice(at)]);
    return created;
  }

  function pasteLines(key: string, first: string, rest: string[]) {
    const at = value.findIndex((item) => item.key === key);
    const created = rest.map((text) => ({ key: nextKey(), block: { kind: "p", text } as Block }));
    const next = value.map((item) => (item.key === key ? { ...item, block: { ...item.block, text: first } as Block } : item));
    onChange([...next.slice(0, at + 1), ...created, ...next.slice(at + 1)]);
  }

  return (
    <div className="block-list">
      {value.length === 0 && <p className="field__hint">还没有内容，从下面选一种开始。粘贴多段文字会自动分段。</p>}
      {value.map((item, index) => {
        const { key, block } = item;
        const failed = errorKey === key;
        return (
          <section key={key} id={`block-${key}`} className={["block-card", failed && "is-error", drag.rowClass(key)].filter(Boolean).join(" ")} {...drag.row(key, "root")}>
            <header className="block-card__head">
              <span className="drag-handle" title="拖动排序" aria-hidden {...drag.handle(key, "root")}>
                <GripVertical size={16} strokeWidth={1.75} />
              </span>
              <span className="block-card__kind">{isTextKind(block.kind) ? "" : KIND_LABEL[block.kind]}</span>
              <span className="block-tools">
                <button type="button" className="icon-btn icon-btn--sm" title="上移" aria-label={`上移第 ${index + 1} 块`} disabled={index === 0} onClick={() => applyOrder(stepInList(keys, key, -1))}>
                  <ArrowUp size={15} strokeWidth={1.75} aria-hidden />
                </button>
                <button type="button" className="icon-btn icon-btn--sm" title="下移" aria-label={`下移第 ${index + 1} 块`} disabled={index === value.length - 1} onClick={() => applyOrder(stepInList(keys, key, 1))}>
                  <ArrowDown size={15} strokeWidth={1.75} aria-hidden />
                </button>
                <button type="button" className="icon-btn icon-btn--sm" title="在下面加一块" aria-label={`在第 ${index + 1} 块下面加一块`} onClick={(e) => setAdding({ anchor: e.currentTarget, at: index + 1 })}>
                  <Plus size={15} strokeWidth={1.75} aria-hidden />
                </button>
                <button type="button" className="icon-btn icon-btn--sm" title="删除这一块" aria-label={`删除第 ${index + 1} 块`} onClick={() => onChange(value.filter((other) => other.key !== key))}>
                  <Trash2 size={15} strokeWidth={1.75} aria-hidden />
                </button>
              </span>
            </header>
            {isTextKind(block.kind) && <TextEditor block={block as Extract<Block, { kind: TextKind }>} onChange={(next) => setBlock(key, next)} onPasteLines={(first, rest) => pasteLines(key, first, rest)} />}
            {block.kind === "img" && <ImageBlockEditor block={block} onChange={(next) => setBlock(key, next)} />}
            {block.kind === "imgrow" && <ImageRowEditor block={block} onChange={(next) => setBlock(key, next)} />}
            {block.kind === "list" && <ListEditor block={block} onChange={(next) => setBlock(key, next)} />}
            {block.kind === "table" && <TableEditor block={block} onChange={(next) => setBlock(key, next)} />}
            {(block.kind === "video" || block.kind === "audio") && <MediaEditor block={block} onChange={(next) => setBlock(key, next)} />}
            {failed && errorText && <p className="field__error">{errorText}</p>}
          </section>
        );
      })}
      <div className="block-add" role="group" aria-label="添加内容块">
        {ADD_OPTIONS.map(({ kind, icon: Icon }) => (
          <button key={kind} type="button" className="btn btn-sm" onClick={() => insert(value.length, [emptyBlock(kind)])}>
            <Icon size={15} strokeWidth={1.75} aria-hidden />
            {KIND_LABEL[kind]}
          </button>
        ))}
      </div>
      {adding && <AddMenu anchor={adding.anchor} onPick={(kind) => insert(adding.at, [emptyBlock(kind)])} onClose={() => setAdding(null)} />}
    </div>
  );
}
