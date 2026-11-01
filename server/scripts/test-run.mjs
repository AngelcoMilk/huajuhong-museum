// `npm test` 的包装：先把真实库快照到临时目录，把 DATABASE_URL 指过去，再跑 node --test。
// 测试进程只会写副本；跑完删掉临时目录，真实库的行数不受影响。
// 快照用 SQLite 的 VACUUM INTO（只读连接上取一致性快照），不直接 cp 正在使用的库文件。
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const root = join(import.meta.dirname, "..");
const realDb = process.env.GUIDE_TEST_SOURCE_DB ?? join(root, "prisma", "dev.db");
const workDir = mkdtempSync(join(tmpdir(), "hjh-test-db-"));
const copy = join(workDir, "dev.db");

async function snapshot() {
  if (!existsSync(realDb)) {
    // 还没建库（刚 clone、CI）：在临时目录里建一个空的，跑完就删，不碰仓库里的任何库文件
    console.warn(`[test] 没有找到真实库 ${realDb}，改用临时库 ${copy}。`);
    const cli = join(root, "node_modules", "prisma", "build", "index.js");
    const env = { ...process.env, DATABASE_URL: `file:${copy}`, ADMIN_PASSWORD: "test-only-password" };
    execFileSync(process.execPath, [cli, "migrate", "deploy"], { cwd: root, stdio: "inherit", env });
    execFileSync(process.execPath, ["prisma/seed.ts"], { cwd: root, stdio: "inherit", env });
    return true;
  }
  try {
    const { DatabaseSync } = await import("node:sqlite");
    const db = new DatabaseSync(realDb, { readOnly: true });
    db.exec(`VACUUM INTO '${copy.replace(/'/g, "''")}'`);
    db.close();
    return true;
  } catch (error) {
    console.warn("[test] node:sqlite 快照失败，改用 sqlite3 CLI：", error?.message ?? error);
    execFileSync("sqlite3", ["-readonly", realDb, `.backup ${copy}`], { stdio: "inherit" });
    return true;
  }
}

let copied = false;
try {
  copied = await snapshot();
} catch (error) {
  rmSync(workDir, { recursive: true, force: true });
  console.error("[test] 无法创建数据库副本，已中止（真实库不能被测试写入）：", error?.message ?? error);
  process.exit(1);
}

const env = { ...process.env };
if (copied) env.DATABASE_URL = `file:${copy}`;

const files = readdirSync(join(root, "test"))
  .filter((name) => name.endsWith(".test.ts"))
  .sort()
  .map((name) => join("test", name));

const result = spawnSync(process.execPath, ["--test", ...files], { cwd: root, stdio: "inherit", env });

rmSync(workDir, { recursive: true, force: true });
process.exit(result.status ?? 1);
