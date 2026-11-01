// 讲解员接口契约：后端产出、前端消费的唯一事实来源。
// 接口形状：
//   POST /api/agent/chat → SSE 事件 token / citation / action / done（另加 error）

/** 引用来源：知识库返回的片段出处 */
export interface Citation {
  id: string;
  /** 条目名，内部用，不直接展示给访客 */
  title: string;
  /** 来源类型，例如「知识库」；不用于展示具体文件路径 */
  source: string;
  /**
   * 原文出处（完整可读文本，如「《中国药典》1963年版一部」）。
   * 为空表示只来自知识库、没有具体典籍出处，前端会显示「引用自 知识库」。
   * 注意：这里绝不能放文件路径或知识库文件名。
   */
  origin?: string;
  url?: string;
}

/** 前端动作：讲解员可以让页面做点什么（服务端只校验并产事件，实际动作由浏览器执行） */
export type AgentActionType =
  | "goto_page"
  | "cart_add"
  | "cart_set"
  | "cart_remove"
  | "goto_checkout"
  | "goto_pay";
export interface AgentAction {
  type: AgentActionType;
  payload: Record<string, unknown>;
}

/** 前端上报的当前购物车（不可信数据，进提示词前必须清洗） */
export interface CartLine {
  skuId: string;
  title: string;
  variant: string;
  qty: number;
}

export interface PageContext {
  route?: string;
  exhibitId?: string;
  actId?: string;
  cart?: CartLine[];
  signedIn?: boolean;
  /**
   * 访客浏览器上报的「未过期待付款订单数」（不可信数据，只进提示词，不做权限判断）。
   * 已登录时是整数；未登录或查询失败时前端不传这个字段。
   */
  pendingOrders?: number;
}

/** SSE 事件（event 名与 type 同名） */
export type AgentEvent =
  | { type: "token"; text: string }
  | { type: "citation"; citation: Citation }
  | { type: "action"; action: AgentAction }
  | { type: "suggestions"; items: string[] }
  | { type: "error"; code: string; message: string }
  | {
      type: "done";
      sessionId: string;
      usage: { inputTokens: number; outputTokens: number };
      finishReason: string;
      /** 只有讲解员测试场（/config/try/stream）会带：这一轮用的是哪份配置 */
      used?: { source: string; versionNo: number; provider: string | null; model: string | null };
    };

export type AgentEventType = AgentEvent["type"];

export interface ChatRequest {
  sessionId: string;
  message: string;
  page?: PageContext;
}

export const MAX_MESSAGE_CHARS = 2000;
export const MAX_SESSIONS = 256;
export const SESSION_TTL_MS = 30 * 60 * 1000;
export const RUN_TIMEOUT_MS = 90 * 1000;
