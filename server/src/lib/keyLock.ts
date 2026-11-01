// 按 key 串行的小锁（限流要用的公共件，纯内存、零依赖）。
// 用途：同一个 (IP+用户名) 的登录尝试串行处理——并发下的正确口令不会被「正在处理的失败」
// 误判成超限，而并发暴力尝试也不会冲穿上限。
// 只有同一时刻真的排队时 Map 里才会有条目；队尾跑完就删掉，不会无限增长。
const locks = new Map<string, Promise<void>>();

export async function withKeyLock<T>(key: string, task: () => Promise<T>): Promise<T> {
  const previous = locks.get(key) ?? Promise.resolve();
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  const tail = previous.then(() => gate);
  locks.set(key, tail);
  // 前一个持锁者出错也不能把后面的人卡死
  await previous.catch(() => {});
  try {
    return await task();
  } finally {
    release();
    // 只有自己还是队尾时才清理，避免把后来者的条目删掉
    if (locks.get(key) === tail) locks.delete(key);
  }
}
