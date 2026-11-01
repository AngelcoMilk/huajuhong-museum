// Prisma 单例：开发时 --watch 会反复加载模块，避免连接数暴涨。
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { __hjhPrisma?: PrismaClient };

export const prisma =
  globalForPrisma.__hjhPrisma ??
  new PrismaClient({
    log: process.env.PRISMA_LOG === "1" ? ["query", "warn", "error"] : ["warn", "error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.__hjhPrisma = prisma;
