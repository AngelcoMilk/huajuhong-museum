// 初始化数据：把 prisma/seed-data/*.json 写入空库，再建管理员。
// 可重复执行：已经存在的行一个字段都不动（后台改过的内容、现用口令都不受影响）。
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { PrismaClient } from "@prisma/client";
import { randomBytes } from "node:crypto";
import { hashPassword } from "../src/lib/password.ts";

const prisma = new PrismaClient();
const DATA_DIR = join(import.meta.dirname, "seed-data");

type Row = Record<string, string | number | null>;

/** 按外键顺序：父表在前，子表在后。 */
const TABLES = [
  "Item",
  "ItemMedia",
  "EnterpriseProfile",
  "ProductProfile",
  "ProductSku",
  "KbSlice",
  "VrGroup",
  "VrScene",
  "Setting",
  "ConfigVersion",
] as const;

const quote = (name: string) => '"' + name.replace(/"/g, '""') + '"';

function readRows(table: string): Row[] {
  return JSON.parse(readFileSync(join(DATA_DIR, table + ".json"), "utf8")) as Row[];
}

async function seedTable(table: string): Promise<number> {
  const rows = readRows(table);
  if (rows.length === 0) return 0;

  const columns = Object.keys(rows[0]);
  const sql =
    `INSERT OR IGNORE INTO ${quote(table)} (${columns.map(quote).join(", ")}) ` +
    `VALUES (${columns.map(() => "?").join(", ")})`;

  // 分批放进一个事务里，行多时不至于一条一条等下一次提交
  const BATCH = 200;
  for (let i = 0; i < rows.length; i += BATCH) {
    const chunk = rows.slice(i, i + BATCH);
    await prisma.$transaction(
      chunk.map((row) => prisma.$executeRawUnsafe(sql, ...columns.map((c) => row[c] ?? null))),
    );
  }
  return rows.length;
}

async function seedAdmin() {
  const username = process.env.ADMIN_USERNAME ?? "admin";
  // 不写死默认口令：ADMIN_PASSWORD 没设就随机生成，只在这里打印一次。
  const configured = (process.env.ADMIN_PASSWORD ?? "").trim();
  const existing = await prisma.adminUser.findUnique({ where: { username } });
  if (existing) {
    // 账号已存在时一个字段都不改：重复执行 seed 不会把现用口令冲掉
    console.log(`[seed] 管理员 ${username} 已存在，口令与标记保持不变。`);
    return;
  }
  const password = configured || randomBytes(12).toString("base64url");
  await prisma.adminUser.create({
    data: { username, passwordHash: await hashPassword(password), mustChangePassword: true },
  });
  console.log(`[seed] 已创建管理员 ${username}（首次登录后必须改密）。`);
  if (configured) console.log("[seed] 初始口令取自 ADMIN_PASSWORD。");
  else console.log(`[seed] 一次性初始口令（只显示这一次，请立刻保存）：${password}`);
}

async function main() {
  const counts: string[] = [];
  for (const table of TABLES) {
    const n = await seedTable(table);
    counts.push(`${table}=${n}`);
  }
  await seedAdmin();
  console.log(`[seed] ${counts.join(" ")}`);
}

main()
  .catch((error) => {
    console.error("[seed] failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
