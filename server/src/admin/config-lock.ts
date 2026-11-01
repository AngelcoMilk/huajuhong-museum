// 讲解员配置与供应商的写操作串行执行：校验和写库之间不能被另一个请求插队。
// 服务端是单进程，进程内排队就够。锁里不要做网络请求（测连接最长 10 秒）。
let tail: Promise<unknown> = Promise.resolve();

export function withConfigLock<T>(fn: () => Promise<T>): Promise<T> {
  const run = tail.then(fn);
  tail = run.catch(() => undefined);
  return run;
}
