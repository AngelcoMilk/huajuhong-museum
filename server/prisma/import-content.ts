// 内容结构导入（幂等）。两段分开跑，先跑第一段，第二段等 blocks.json 就位：
//   npx --prefix server tsx prisma/import-content.ts --part=structure
// 也可以 dotenv 注入后直接 node prisma/import-content.ts --part=blocks
// 两段都会先把库备份到 backups/devdb/，并打印改了多少行。
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { prisma } from "../src/db.ts";
import { blocksToText, validateBlocks } from "../src/admin/blocks.ts";

const ROOT = join(import.meta.dirname, "..", "..");
const DATA_DIR = join(ROOT, "site", "src", "data");
const VR_IMG_DIR = join(ROOT, "site", "public", "img", "vr");
const VR_CSV = join(ROOT, "knowledge", "raw", "化橘红官网镜像", "_清单", "VR全景资源清单.csv");
const BLOCKS_JSON = join(import.meta.dirname, "content-import", "blocks.json");
const BACKUP_DIR = join(ROOT, "backups", "devdb");

/** 展项管理覆盖的板块 */
const EXHIBIT_BOARDS = ["park", "museum", "history"];

/** 园区栏目（其余 YQ-005~011 是挂到 YQ-004 下的文章） */
const PARK_COLUMNS = ["YQ-002", "YQ-003", "YQ-004", "YQ-012", "YQ-013", "YQ-014"];

/** iframe 里固定的 work_id */
const WORK_ID = "147899";

function log(...args: unknown[]) {
  console.log("[import]", ...args);
}

/** DATABASE_URL 指向的库文件；相对路径按 prisma/ 目录解析（和 Prisma 一致） */
function dbFile(): string {
  const url = process.env.DATABASE_URL ?? "file:./dev.db";
  const raw = url.replace(/^file:/, "");
  return raw.startsWith("/") ? raw : join(import.meta.dirname, raw);
}

function backup(): string {
  const source = dbFile();
  mkdirSync(BACKUP_DIR, { recursive: true });
  const stamp = new Date().toISOString().replace(/[-:T]/g, "").slice(0, 14);
  const target = join(BACKUP_DIR, `${source.split("/").pop()}.import-${stamp}`);
  copyFileSync(source, target);
  log("已备份库到", target);
  return target;
}

function readJson(path: string): any {
  return JSON.parse(readFileSync(path, "utf8"));
}

// ── 第一段：结构（type / parentId / 页面头 / VR 分组与地址） ─────────

/** CSV 里 缩略图直链 → 切片路径 132221/scene/scene613881/view/ */
function readCsvPaths(): Map<string, string> {
  const map = new Map<string, string>();
  if (!existsSync(VR_CSV)) return map;
  const lines = readFileSync(VR_CSV, "utf8").split(/\r?\n/);
  for (const line of lines.slice(1)) {
    if (!line.trim()) continue;
    const cells = line.split(",");
    const sceneId = (cells[2] ?? "").trim();
    if (!sceneId) continue;
    const thumb = (cells[4] ?? "").trim();
    const direct = /imj\.kuleiman\.com\/(132221\/scene\/scene\d+)\/pano_thumb\.jpg/.exec(thumb);
    if (direct) {
      map.set(sceneId, `${direct[1]}/view/`);
      continue;
    }
    // 退路：从立方体切片模板里抠
    const template = (cells[6] ?? "").trim();
    const matched = /imj\.kuleiman\.com\/(132221\/scene\/scene\d+)\/view\//.exec(template);
    if (matched) map.set(sceneId, `${matched[1]}/view/`);
  }
  return map;
}

async function importStructure() {
  backup();

  // ① 园区 / 博物馆 / 史料的 type 与 parentId
  let typed = 0;
  for (const id of PARK_COLUMNS) {
    const result = await prisma.item.updateMany({ where: { id }, data: { type: "column", parentId: null } });
    typed += result.count;
  }
  const parkArticles = await prisma.item.updateMany({
    where: { id: { in: ["YQ-005", "YQ-006", "YQ-007", "YQ-008", "YQ-009", "YQ-010", "YQ-011"] } },
    data: { type: "article", parentId: "YQ-004" },
  });
  typed += parkArticles.count;
  const vrRow = await prisma.item.updateMany({ where: { id: "YQ-001" }, data: { type: "VR场景", parentId: null } });
  typed += vrRow.count;
  const museumArticles = await prisma.item.updateMany({
    where: { board: "museum", id: { startsWith: "BO-A" } },
    data: { type: "article", parentId: null },
  });
  typed += museumArticles.count;
  const historyArticles = await prisma.item.updateMany({
    where: { board: "history" },
    data: { type: "article", parentId: null },
  });
  typed += historyArticles.count;
  log(`结构：改了 ${typed} 行的 type / parentId`);

  // ② 页面头：只在键不存在时写
  const park = readJson(join(DATA_DIR, "park.json"));
  const museum = readJson(join(DATA_DIR, "museum.json"));
  const parkHead = {
    title: "园区展示",
    intro: "化橘红产业园，2022 年园内种植面积 10.2 万亩，占全市 90.2% 以上。",
    heroImage: "/img/board-park.jpg",
    stats: park.stats ?? [],
  };
  const museumHallCount = (museum.groups ?? []).find((group: any) => group.key === "hall")?.scenes?.length ?? 0;
  const museumHead = {
    title: "博物馆",
    intro: `正门大堂、博物馆 1 到 6、橘香体验馆，共 ${museumHallCount} 个全景场景。`,
    heroImage: "/img/board-museum.jpg",
    stats: museum.stats ?? [],
  };
  for (const [key, value] of [
    ["page.park", parkHead],
    ["page.museum", museumHead],
  ] as [string, unknown][]) {
    const exists = await prisma.setting.findUnique({ where: { key } });
    if (exists) {
      log(`页面头 ${key} 已存在，跳过`);
      continue;
    }
    await prisma.setting.create({ data: { key, value: JSON.stringify(value) } });
    log(`页面头 ${key} 写入初值`);
  }
  if (!(await prisma.setting.findUnique({ where: { key: "page.history" } }))) {
    log("页面头 page.history 没有来源（前台还没有史料页），保持未设置");
  }

  // ③ VR 分组 + 场景归属
  const pages: [string, any][] = [
    ["park", park],
    ["museum", museum],
  ];
  const csvPaths = readCsvPaths();
  const matched = new Set<string>();
  let groupsWritten = 0;
  let scenesSorted = 0;

  for (const [page, json] of pages) {
    const groups = Array.isArray(json.groups) ? json.groups : [];
    for (let index = 0; index < groups.length; index += 1) {
      const group = groups[index];
      const id = `${page}-${group.key}`;
      const layout = group.layout === "feature" ? "feature" : "grid";
      const data = { page, name: String(group.name ?? group.key), sort: index, layout, visible: true };
      const existing = await prisma.vrGroup.findUnique({ where: { id } });
      if (existing) await prisma.vrGroup.update({ where: { id }, data });
      else await prisma.vrGroup.create({ data: { id, ...data } });
      groupsWritten += 1;

      const scenes = Array.isArray(group.scenes) ? group.scenes : [];
      for (let sceneIndex = 0; sceneIndex < scenes.length; sceneIndex += 1) {
        const sceneId = String(scenes[sceneIndex].sceneId ?? "");
        const row = sceneId ? await prisma.vrScene.findFirst({ where: { sceneId }, select: { id: true } }) : null;
        if (!row) {
          log(`  ！分组 ${id} 里的 ${sceneId || "(没有 sceneId)"} 在库里找不到，跳过`);
          continue;
        }
        matched.add(row.id);
        await prisma.vrScene.update({ where: { id: row.id }, data: { groupId: id, group: page === "park" ? "园区" : "博物馆", sort: sceneIndex } });
        scenesSorted += 1;
      }
    }
  }
  log(`VR 分组：${groupsWritten} 个分组，${scenesSorted} 个场景归组`);

  // ④ 47 行 iframe / thumb
  const scenes = await prisma.vrScene.findMany({ orderBy: { id: "asc" } });
  const localFiles = new Set(existsSync(VR_IMG_DIR) ? readdirSync(VR_IMG_DIR) : []);
  let iframeWritten = 0;
  let thumbMissing: string[] = [];
  let noSceneId: string[] = [];
  for (const scene of scenes) {
    const sceneId = (scene.sceneId ?? "").trim();
    if (!sceneId) {
      noSceneId.push(scene.id);
      continue;
    }
    const path = csvPaths.get(sceneId);
    if (!path) {
      log(`  ！${scene.id}（${sceneId}）在 VR全景资源清单.csv 里找不到切片路径`);
      continue;
    }
    const file = `${sceneId}.jpg`;
    const hasThumb = localFiles.has(file);
    if (!hasThumb) thumbMissing.push(`${scene.id}:${file}`);
    await prisma.vrScene.update({
      where: { id: scene.id },
      data: {
        iframe: `https://live.kuleiman.com/static/live/public/pano.html?tileserver=${path}&work_id=${WORK_ID}`,
        thumb: hasThumb ? `/img/vr/${file}` : scene.thumb,
        preview: scene.preview && scene.preview.trim() ? scene.preview : scene.thumb,
      },
    });
    iframeWritten += 1;
  }
  log(`VR 地址：写了 ${iframeWritten} 行的 iframe；本地缩略图缺失 ${thumbMissing.length} 个`);
  if (thumbMissing.length) log("  缺失缩略图：", thumbMissing.join(", "));
  if (noSceneId.length) log("  ！没有 sceneId 的行：", noSceneId.join(", "));

  const unmatched = scenes.filter((scene) => !matched.has(scene.id)).map((scene) => `${scene.id}/${scene.sceneId ?? "-"}`);
  if (unmatched.length) log(`  ！没有归到任何分组的场景（${unmatched.length}）：`, unmatched.join(", "));
}

// ── 第二段：正文块（等 blocks.json 就位） ─────────────────────────

async function importBlocks() {
  if (!existsSync(BLOCKS_JSON)) {
    log(`没有找到 ${BLOCKS_JSON}，第二段先不跑。`);
    return;
  }
  backup();
  const raw = readJson(BLOCKS_JSON) as Record<string, any>;
  const ids = Object.keys(raw ?? {});
  if (ids.length === 0) {
    log("blocks.json 是空的，什么都没写。");
    return;
  }

  // 先全部校验，有一条不合法就整体不写
  const prepared: { id: string; blocks: any[]; summary?: string; author?: string; sourceName?: string; coverUrl?: string }[] = [];
  for (const id of ids) {
    const entry = raw[id];
    const checked = validateBlocks(entry?.blocks);
    if (!checked.ok) {
      console.error(`[import] blocks.json 里 ${id} 的第 ${checked.index + 1} 块不合法：${checked.reason}`);
      console.error("[import] 整体不写。");
      process.exitCode = 1;
      return;
    }
    const text = (value: unknown, max: number) => (typeof value === "string" && value.trim() ? value.trim().slice(0, max) : undefined);
    prepared.push({
      id,
      blocks: checked.blocks,
      summary: text(entry?.summary, 1000),
      author: text(entry?.author, 200),
      sourceName: text(entry?.sourceName, 200),
      coverUrl: typeof entry?.coverUrl === "string" && entry.coverUrl.trim() ? entry.coverUrl.trim() : undefined,
    });
  }

  const rows = await prisma.item.findMany({ where: { id: { in: ids } }, select: { id: true, board: true } });
  const boards = new Map(rows.map((row) => [row.id, row.board]));
  let written = 0;
  const skipped: string[] = [];
  for (const entry of prepared) {
    const board = boards.get(entry.id);
    if (!board) {
      skipped.push(`${entry.id}(不存在)`);
      continue;
    }
    if (!EXHIBIT_BOARDS.includes(board)) {
      skipped.push(`${entry.id}(${board})`);
      continue;
    }
    await prisma.item.update({
      where: { id: entry.id },
      data: {
        blocksJson: JSON.stringify(entry.blocks),
        body: blocksToText(entry.blocks),
        ...(entry.summary !== undefined ? { summary: entry.summary } : {}),
        ...(entry.author !== undefined ? { author: entry.author } : {}),
        ...(entry.sourceName !== undefined ? { sourceName: entry.sourceName } : {}),
        ...(entry.coverUrl !== undefined ? { coverUrl: entry.coverUrl } : {}),
      },
    });
    written += 1;
  }
  log(`正文块：写了 ${written} 行；跳过 ${skipped.length} 条`);
  if (skipped.length) log("  跳过：", skipped.join(", "));
}

const part = process.argv.find((arg) => arg.startsWith("--part="))?.slice("--part=".length)
  ?? (process.argv.includes("--part") ? process.argv[process.argv.indexOf("--part") + 1] : "");

if (part === "structure") {
  await importStructure();
} else if (part === "blocks") {
  await importBlocks();
} else {
  console.error("用法：import-content.ts --part=structure | --part=blocks");
  process.exit(1);
}

await prisma.$disconnect();
