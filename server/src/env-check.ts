// 启动前校验必需的环境变量：缺了就打印一句清楚的中文说明并退出，
// 不要等到第一次登录（jwt.ts 抛错）或第一次查库（Prisma 抛错）才发现。
// 只在服务入口 src/index.ts 里 import；脚本（seed 等）不经过这里。

const MIN_SECRET_CHARS = 16;

interface Problem {
  name: string;
  why: string;
  fix: string;
}

function requiredProblems(): Problem[] {
  const problems: Problem[] = [];

  const databaseUrl = (process.env.DATABASE_URL ?? "").trim();
  if (!databaseUrl) {
    problems.push({
      name: "DATABASE_URL",
      why: "Prisma 需要它才知道数据库文件在哪（本地 SQLite 形如 file:./dev.db）。",
      fix: 'DATABASE_URL="file:./dev.db"',
    });
  }

  const jwtSecret = (process.env.ADMIN_JWT_SECRET ?? "").trim();
  if (!jwtSecret) {
    problems.push({
      name: "ADMIN_JWT_SECRET",
      why: `后台登录 token 的签名密钥，至少 ${MIN_SECRET_CHARS} 个字符；缺了后台登录直接不可用。`,
      fix: `ADMIN_JWT_SECRET="${"x".repeat(MIN_SECRET_CHARS)}"（换成你自己的随机字符串）`,
    });
  } else if (jwtSecret.length < MIN_SECRET_CHARS) {
    problems.push({
      name: "ADMIN_JWT_SECRET",
      why: `现在只有 ${jwtSecret.length} 个字符，太短（至少要 ${MIN_SECRET_CHARS} 个）。`,
      fix: `ADMIN_JWT_SECRET="${"x".repeat(MIN_SECRET_CHARS)}"（换成你自己的随机字符串）`,
    });
  }

  // 生产环境购物端必须是独立密钥，否则两边 token 只靠 aud 隐式隔离
  if (process.env.NODE_ENV === "production") {
    const shopSecret = (process.env.SHOP_JWT_SECRET ?? "").trim();
    if (!shopSecret) {
      problems.push({
        name: "SHOP_JWT_SECRET",
        why: "生产环境（NODE_ENV=production）购物端必须用自己的 JWT 密钥，不能回落到 ADMIN_JWT_SECRET。",
        fix: `SHOP_JWT_SECRET="${"y".repeat(MIN_SECRET_CHARS)}"（换成另一个随机字符串，别和后台的一样）`,
      });
    } else if (shopSecret.length < MIN_SECRET_CHARS) {
      problems.push({
        name: "SHOP_JWT_SECRET",
        why: `现在只有 ${shopSecret.length} 个字符，太短（至少要 ${MIN_SECRET_CHARS} 个）。`,
        fix: `SHOP_JWT_SECRET="${"y".repeat(MIN_SECRET_CHARS)}"（换成另一个随机字符串，别和后台的一样）`,
      });
    } else if (shopSecret === jwtSecret) {
      problems.push({
        name: "SHOP_JWT_SECRET",
        why: "生产环境购物端密钥不能与 ADMIN_JWT_SECRET 相同。",
        fix: `SHOP_JWT_SECRET="${"y".repeat(MIN_SECRET_CHARS)}"（换成另一个随机字符串）`,
      });
    }
  }

  return problems;
}

/** 缺变量时打印中文说明并退出进程；没问题就返回。 */
export function assertRequiredEnv(): void {
  const problems = requiredProblems();
  if (problems.length === 0) return;

  console.error("");
  console.error("[env] 启动中止：后端必需的环境变量没配好。");
  for (const problem of problems) {
    console.error(`[env] 缺少或无效：${problem.name}`);
    console.error(`[env]   为什么必需：${problem.why}`);
    console.error(`[env]   怎么补：在 server/.env 里加一行 ${problem.fix}`);
  }
  console.error("[env] 现成的样例见 server/.env.example（复制成 server/.env 再填值）。");
  console.error("[env] 改完重启：npm --prefix server run dev");
  console.error("");
  process.exit(1);
}

// 老代码里 jwt.ts 自己抛的是英文短句，这里给个更直白的补丁：把缺失信息一次讲清再退出。
assertRequiredEnv();

// ── 非致命提醒：不影响启动，但会让人以为功能坏了 ─────────
if (!(process.env.ADMIN_USERNAME ?? "").trim()) {
  console.warn("[env] 提醒：ADMIN_USERNAME 没配，只影响 npm run db:seed 首次建管理员，不影响本次启动。");
}
if (!(process.env.SHOP_JWT_SECRET ?? "").trim()) {
  console.warn("[env] 提醒：SHOP_JWT_SECRET 没配，购物账号 token 会用 ADMIN_JWT_SECRET 签名（本地演示可接受）。");
}
