// 正文块：后台保存时校验，公开接口读出来给前台渲染。
// 同一份规则给 routes.ts、public.ts 和导入脚本共用，不要在这里引入数据库或 Hono。

export type BlockAlign = "left" | "center" | "right";

export type Block =
  | { kind: "p"; text: string; align?: BlockAlign }
  | { kind: "h2"; text: string; align?: BlockAlign }
  | { kind: "h3"; text: string; align?: BlockAlign }
  | { kind: "img"; src: string; alt?: string; caption?: string; width?: number; align?: BlockAlign }
  | { kind: "imgrow"; images: { src: string; alt?: string }[]; caption?: string }
  | { kind: "quote"; text: string }
  | { kind: "list"; ordered?: boolean; items: string[] }
  | { kind: "table"; rows: string[][]; header?: boolean }
  | { kind: "video"; src: string; poster?: string; caption?: string }
  | { kind: "audio"; src: string; poster?: string; caption?: string }
  | { kind: "note"; text: string }
  | { kind: "hr" };

export type BlocksResult = { ok: true; blocks: Block[] } | { ok: false; index: number; reason: string };

/** 上限：块数、单段文字、表格行数 */
const MAX_BLOCKS = 2000;
const MAX_TEXT = 50000;
const MAX_TABLE_ROWS = 200;

const ALIGNS: BlockAlign[] = ["left", "center", "right"];

/** 是否是普通对象（不是 null / 数组 / 别的类型） */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * src 规则：http(s) 绝对地址，或站内单斜杠路径（`//` 不行），
 * 不能含空白或控制字符。coverUrl / heroImage / 媒体地址也用它。
 */
export function isSafeSrc(value: unknown): value is string {
  if (typeof value !== "string") return false;
  const text = value.trim();
  if (!text || text !== value) return false;
  if (/[\s\u0000-\u001f\u007f]/.test(text)) return false;
  // 反斜杠一律拒绝：浏览器会把 `\` 当 `/`，`/\evil.com/x` 会被规范成 `//evil.com`（协议相对地址）
  if (text.includes("\\")) return false;
  if (text.startsWith("https://") || text.startsWith("http://")) return text.length > 8;
  if (text.startsWith("//")) return false;
  return text.startsWith("/") && text.length > 1;
}

/** 文本字段：必须是字符串、不超长；不是字符串就报错 */
function readText(value: unknown, field: string): { ok: true; text: string } | { ok: false; reason: string } {
  if (typeof value !== "string") return { ok: false, reason: `${field} 必须是文字` };
  if (value.length > MAX_TEXT) return { ok: false, reason: `${field} 太长（上限 ${MAX_TEXT} 字）` };
  return { ok: true, text: value };
}

/** 可选文本：缺省/空串都当没有；给了就必须是字符串且不超长 */
function optionalText(value: unknown, field: string): { ok: true; text?: string } | { ok: false; reason: string } {
  if (value === undefined || value === null) return { ok: true };
  const read = readText(value, field);
  if (!read.ok) return read;
  return read.text ? { ok: true, text: read.text } : { ok: true };
}

function optionalAlign(value: unknown): { ok: true; align?: BlockAlign } | { ok: false; reason: string } {
  if (value === undefined || value === null || value === "") return { ok: true };
  if (typeof value === "string" && (ALIGNS as string[]).includes(value)) return { ok: true, align: value as BlockAlign };
  return { ok: false, reason: "对齐只能是 left / center / right" };
}

/** width 是原文宽度百分比，必须是 1–100 的整数 */
function optionalWidth(value: unknown): { ok: true; width?: number } | { ok: false; reason: string } {
  if (value === undefined || value === null || value === "") return { ok: true };
  if (typeof value !== "number" || !Number.isInteger(value) || value < 1 || value > 100) {
    return { ok: false, reason: "图片宽度要是 1–100 的整数" };
  }
  return { ok: true, width: value };
}

function optionalBool(value: unknown, field: string): { ok: true; flag?: boolean } | { ok: false; reason: string } {
  if (value === undefined || value === null) return { ok: true };
  if (typeof value !== "boolean") return { ok: false, reason: `${field} 要是 true 或 false` };
  return { ok: true, flag: value };
}

/** 校验一块；结果只保留约定的键，多余的丢掉 */
function readBlock(block: unknown): { ok: true; block: Block } | { ok: false; reason: string } {
  if (!isRecord(block)) return { ok: false, reason: "这一块不是对象" };
  const kind = block.kind;
  if (typeof kind !== "string") return { ok: false, reason: "缺 kind" };

  switch (kind) {
    case "p":
    case "h2":
    case "h3":
    case "quote":
    case "note": {
      const text = readText(block.text, "text");
      if (!text.ok) return text;
      // quote / note 没有 align（align 只给 p、h2、h3）
      if (kind === "quote" || kind === "note") return { ok: true, block: { kind, text: text.text } };
      const align = optionalAlign(block.align);
      if (!align.ok) return align;
      return { ok: true, block: { kind, text: text.text, ...(align.align ? { align: align.align } : {}) } };
    }
    case "img": {
      if (!isSafeSrc(block.src)) return { ok: false, reason: "图片地址要在 http(s) 或站内 / 开头" };
      const alt = optionalText(block.alt, "alt");
      if (!alt.ok) return alt;
      const caption = optionalText(block.caption, "caption");
      if (!caption.ok) return caption;
      const width = optionalWidth(block.width);
      if (!width.ok) return width;
      const align = optionalAlign(block.align);
      if (!align.ok) return align;
      return {
        ok: true,
        block: {
          kind: "img",
          src: block.src,
          ...(alt.text ? { alt: alt.text } : {}),
          ...(caption.text ? { caption: caption.text } : {}),
          ...(width.width !== undefined ? { width: width.width } : {}),
          ...(align.align ? { align: align.align } : {}),
        },
      };
    }
    case "imgrow": {
      if (!Array.isArray(block.images)) return { ok: false, reason: "图组要带 images 数组" };
      const images: { src: string; alt?: string }[] = [];
      for (const raw of block.images) {
        if (!isRecord(raw)) return { ok: false, reason: "图组里每一项都要是对象" };
        if (!isSafeSrc(raw.src)) return { ok: false, reason: "图组里的图片地址不合法" };
        const alt = optionalText(raw.alt, "alt");
        if (!alt.ok) return alt;
        images.push({ src: raw.src, ...(alt.text ? { alt: alt.text } : {}) });
      }
      const caption = optionalText(block.caption, "caption");
      if (!caption.ok) return caption;
      return { ok: true, block: { kind: "imgrow", images, ...(caption.text ? { caption: caption.text } : {}) } };
    }
    case "list": {
      if (!Array.isArray(block.items)) return { ok: false, reason: "列表要带 items 数组" };
      const items: string[] = [];
      for (const raw of block.items) {
        const item = readText(raw, "items");
        if (!item.ok) return item;
        items.push(item.text);
      }
      const ordered = optionalBool(block.ordered, "ordered");
      if (!ordered.ok) return ordered;
      return { ok: true, block: { kind: "list", items, ...(ordered.flag !== undefined ? { ordered: ordered.flag } : {}) } };
    }
    case "table": {
      if (!Array.isArray(block.rows)) return { ok: false, reason: "表格要带 rows 数组" };
      if (block.rows.length > MAX_TABLE_ROWS) return { ok: false, reason: `表格最多 ${MAX_TABLE_ROWS} 行` };
      const rows: string[][] = [];
      for (const raw of block.rows) {
        if (!Array.isArray(raw)) return { ok: false, reason: "表格每一行都要是数组" };
        const cells: string[] = [];
        for (const cell of raw) {
          const read = readText(cell, "单元格");
          if (!read.ok) return read;
          cells.push(read.text);
        }
        rows.push(cells);
      }
      const header = optionalBool(block.header, "header");
      if (!header.ok) return header;
      return { ok: true, block: { kind: "table", rows, ...(header.flag !== undefined ? { header: header.flag } : {}) } };
    }
    case "video":
    case "audio": {
      if (!isSafeSrc(block.src)) return { ok: false, reason: "音视频地址要在 http(s) 或站内 / 开头" };
      if (block.poster !== undefined && block.poster !== null && block.poster !== "" && !isSafeSrc(block.poster)) {
        return { ok: false, reason: "封面图地址不合法" };
      }
      const caption = optionalText(block.caption, "caption");
      if (!caption.ok) return caption;
      return {
        ok: true,
        block: {
          kind,
          src: block.src,
          ...(isSafeSrc(block.poster) ? { poster: block.poster } : {}),
          ...(caption.text ? { caption: caption.text } : {}),
        },
      };
    }
    case "hr":
      return { ok: true, block: { kind: "hr" } };
    default:
      return { ok: false, reason: `不认识的块类型：${kind.slice(0, 30)}` };
  }
}

/**
 * 校验整个 blocks 值。不通过时返回第几块（0 起）和原因。
 * 先判类型再用，任何输入（对象、数组、null、字符串）都不能抛成 500。
 */
export function validateBlocks(value: unknown): BlocksResult {
  if (!Array.isArray(value)) return { ok: false, index: -1, reason: "blocks 要是数组" };
  if (value.length > MAX_BLOCKS) return { ok: false, index: -1, reason: `块太多了（上限 ${MAX_BLOCKS}）` };
  const blocks: Block[] = [];
  for (let index = 0; index < value.length; index += 1) {
    const read = readBlock(value[index]);
    if (!read.ok) return { ok: false, index, reason: read.reason };
    blocks.push(read.block);
  }
  return { ok: true, blocks };
}

/** 去掉行内 ** 粗体记号，正文纯文本用 */
function stripBold(text: string): string {
  return text.replace(/\*\*/g, "");
}

/** 生成 body 用的纯文本：块之间空一行，图片取说明文字 */
export function blocksToText(blocks: Block[]): string {
  const parts: string[] = [];
  for (const block of blocks) {
    switch (block.kind) {
      case "p":
      case "h2":
      case "h3":
      case "quote":
      case "note":
        parts.push(stripBold(block.text));
        break;
      case "img":
        parts.push(stripBold(block.caption ?? block.alt ?? ""));
        break;
      case "imgrow":
        parts.push(stripBold(block.caption ?? ""));
        break;
      case "list":
        parts.push(block.items.map(stripBold).join("\n"));
        break;
      case "table":
        parts.push(block.rows.map((row) => row.map(stripBold).join(" ")).join("\n"));
        break;
      case "video":
      case "audio":
        parts.push(stripBold(block.caption ?? ""));
        break;
      case "hr":
        break;
    }
  }
  return parts
    .map((part) => part.trim())
    .filter(Boolean)
    .join("\n\n");
}

/** blocksJson 为空时的退路：按空行切成 p 块 */
export function bodyToBlocks(body: string | null | undefined): Block[] {
  const text = String(body ?? "").replace(/\r\n?/g, "\n");
  return text
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => ({ kind: "p", text: part }) as Block);
}

/** 读一行内容的正文档：坏 JSON 或结构不对都退回 body，永远不抛 */
export function parseBlocks(row: { blocksJson?: string | null; body?: string | null }): Block[] {
  const raw = row.blocksJson;
  if (typeof raw === "string" && raw.trim()) {
    try {
      const result = validateBlocks(JSON.parse(raw));
      if (result.ok) return result.blocks;
    } catch {
      // 坏数据：退回 body
    }
  }
  return bodyToBlocks(row.body);
}

