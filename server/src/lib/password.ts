// 口令哈希：node:crypto 的 scrypt，异步版（同步 scrypt 会卡住事件循环）。
// 格式 "scrypt$N$r$p$salt$hash"，参数跟着哈希一起存，升级参数时旧口令仍可校验。
// 并发闸：同时最多跑 2 个 scrypt，其余排队；排队超过 32 个直接抛 ScryptBusyError（调用方转 503）。
import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";

export interface ScryptParams {
  N: number;
  r: number;
  p: number;
  keylen: number;
}

/** 新哈希参数（OWASP 等价档位）。老哈希按自己那行参数校验，不重算。 */
export const CURRENT_PARAMS: ScryptParams = { N: 32768, r: 8, p: 3, keylen: 64 };

/** 128 * N * r = 32 MiB，留一倍余量 */
const MAXMEM = 64 * 1024 * 1024;
const MAX_PARALLEL = 2;
const MAX_QUEUE = 32;

/** 排队超过上限：调用方回 503 BUSY，而不是把请求堆在内存里 */
export class ScryptBusyError extends Error {
  readonly code = "BUSY";
  constructor() {
    super("scrypt 队列已满");
    this.name = "ScryptBusyError";
  }
}

let running = 0;
const waiters: Array<() => void> = [];

async function acquire(): Promise<void> {
  if (running < MAX_PARALLEL) {
    running += 1;
    return;
  }
  if (waiters.length >= MAX_QUEUE) throw new ScryptBusyError();
  await new Promise<void>((resolve) => {
    waiters.push(resolve);
  });
}

function release(): void {
  running -= 1;
  const next = waiters.shift();
  if (next) {
    running += 1;
    next();
  }
}

function derive(password: string, salt: string, params: ScryptParams): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(
      password,
      salt,
      params.keylen,
      { N: params.N, r: params.r, p: params.p, maxmem: MAXMEM },
      (error, key) => (error ? reject(error) : resolve(key)),
    );
  });
}

interface Parsed {
  params: ScryptParams;
  salt: string;
  hash: Buffer;
}

function parse(stored: string): Parsed | null {
  const parts = stored.split("$");
  if (parts.length !== 6 || parts[0] !== "scrypt") return null;
  const [, n, r, p, salt, hash] = parts;
  if (!salt || !hash || hash.length % 2 !== 0) return null;
  const params: ScryptParams = { N: Number(n), r: Number(r), p: Number(p), keylen: hash.length / 2 };
  if (![params.N, params.r, params.p, params.keylen].every((value) => Number.isInteger(value) && value > 0)) {
    return null;
  }
  return { params, salt, hash: Buffer.from(hash, "hex") };
}

/** 按新参数生成哈希（随机盐） */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  await acquire();
  let hash: Buffer;
  try {
    hash = await derive(password, salt, CURRENT_PARAMS);
  } finally {
    release();
  }
  return `scrypt$${CURRENT_PARAMS.N}$${CURRENT_PARAMS.r}$${CURRENT_PARAMS.p}$${salt}$${hash.toString("hex")}`;
}

/** 按哈希自带的参数校验；格式不对返回 false（不抛错） */
export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parsed = parse(stored);
  if (!parsed) return false;
  await acquire();
  let actual: Buffer;
  try {
    actual = await derive(password, parsed.salt, parsed.params);
  } finally {
    release();
  }
  return actual.length === parsed.hash.length && timingSafeEqual(actual, parsed.hash);
}

/** 是不是按当前参数存的：登录成功时用它决定要不要透明升级（不动 tokenVersion） */
export function needsUpgrade(stored: string): boolean {
  const parsed = parse(stored);
  if (!parsed) return false;
  return (
    parsed.params.N !== CURRENT_PARAMS.N ||
    parsed.params.r !== CURRENT_PARAMS.r ||
    parsed.params.p !== CURRENT_PARAMS.p
  );
}

let dummy: Promise<string> | null = null;

/** 账号不存在时的假哈希：同样用新参数 */
function dummyHash(): Promise<string> {
  if (!dummy) dummy = hashPassword("m4-dummy-password-never-matches");
  return dummy;
}

/**
 * 跑一次注定失败的校验，只为耗时对齐：
 * 账号不存在时跑一次；旧参数账号校验完再跑一次，别让新旧账号的耗时差暴露账号状态。
 */
export async function verifyDummy(password: string): Promise<void> {
  await verifyPassword(password, await dummyHash());
}
