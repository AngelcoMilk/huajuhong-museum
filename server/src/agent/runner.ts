// Runner：把「谁在生成回答」抽象出来。
// PiRunner 走真模型；MockRunner 供离线开发与测试，二者对路由完全等价。
import type { AgentEvent, PageContext } from "../contract.ts";

export type Emit = (event: AgentEvent) => void;

export interface RunInput {
  message: string;
  page?: PageContext;
}

export interface Runner {
  run(input: RunInput, emit: Emit, signal: AbortSignal): Promise<void>;
  dispose(): void;
}

export interface RunnerFactory {
  (sessionId: string): Runner;
}
