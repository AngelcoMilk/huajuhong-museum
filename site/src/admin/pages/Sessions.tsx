// 会话记录：列表（搜索、日期、测试会话）+ 详情抽屉；整体分析放在另一个 Tab。
import { useState } from "react";
import { ChartPie, MessagesSquare, Sparkles } from "lucide-react";
import { api, ApiError } from "../api";
import { DataList, FilterTags, PagedBody, SearchBox, useListQuery, type Column } from "../list";
import { Card, dateTime, Drawer, Empty, ErrorBar, PageHeadExtra, pageLabel, Segmented, Skeleton, toast, useAsync } from "../ui";

const SORTABLE = ["startedAt", "turnCount"] as const;
const TABS = [
  { value: "list", label: "会话", icon: <MessagesSquare size={16} strokeWidth={1.75} aria-hidden /> },
  { value: "analysis", label: "整体分析", icon: <ChartPie size={16} strokeWidth={1.75} aria-hidden /> },
];
const STATE_LABEL: Record<string, string> = { open: "进行中", reset: "已重置", ttl: "已超时", idle: "闲置结束" };
const stateLabel = (reason: string | null) => (reason ? (STATE_LABEL[reason] ?? reason) : "进行中");

type SessionRow = Awaited<ReturnType<typeof api.sessions>>["items"][number];

/** 日期框的值换算成毫秒；结束日包含当天 */
function dayMs(value: string, end: boolean): number | undefined {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined;
  const ms = new Date(`${value}T${end ? "23:59:59.999" : "00:00:00"}`).getTime();
  return Number.isNaN(ms) ? undefined : ms;
}

export default function Sessions() {
  const query = useListQuery(SORTABLE);
  const tab = query.pick("tab", ["analysis"] as const) ?? "list";
  const from = query.params.get("from") ?? "";
  const to = query.params.get("to") ?? "";
  const test = query.params.get("test") === "1";
  const openId = query.params.get("id");
  const { q, page, pageSize, sort, order } = query;

  const list = useAsync(
    () => api.sessions({ q, from: dayMs(from, false), to: dayMs(to, true), test: test ? 1 : undefined, page, pageSize, sort, order }),
    [q, from, to, test, page, pageSize, sort, order],
  );

  // 打开、关闭详情不动筛选，也不回第一页
  const setOpen = (id: string | null) => query.update({ id, page });

  const tags = [
    q && { key: "q", label: `搜索：${q}`, onClear: () => query.update({ q: null }) },
    from && { key: "from", label: `从 ${from}`, onClear: () => query.update({ from: null }) },
    to && { key: "to", label: `到 ${to}`, onClear: () => query.update({ to: null }) },
    test && { key: "test", label: "测试场会话", onClear: () => query.update({ test: null }) },
  ].filter(Boolean) as Array<{ key: string; label: string; onClear: () => void }>;
  const clearAll = () => query.update({ q: null, from: null, to: null, test: null });

  const columns: Column<SessionRow>[] = [
    {
      key: "visitor",
      label: "访客 / 页面",
      width: "minmax(0, 1fr)",
      mobile: "grow",
      render: (row) => (
        <>
          <span className="dl-title mono dl-ellipsis">{row.visitorId.slice(0, 12)}</span>
          <span className="muted dl-ellipsis">{pageLabel(row.page)}</span>
        </>
      ),
    },
    { key: "turns", label: "轮数", width: "64px", sortKey: "turnCount", firstOrder: "desc", align: "end", render: (row) => <span className="mono">{row.turnCount}</span> },
    { key: "tokens", label: "词元", width: "84px", mobile: "hide", align: "end", render: (row) => <span className="muted mono">{(row.inputTokens + row.outputTokens).toLocaleString()}</span> },
    { key: "state", label: "状态", width: "96px", render: (row) => <span className={row.endedAt ? "pill" : "pill pill--ok"}>{stateLabel(row.endedReason)}</span> },
    { key: "started", label: "开始时间", width: "128px", sortKey: "startedAt", firstOrder: "desc", mobile: "hide", render: (row) => <span className="dl-time">{dateTime(row.startedAt)}</span> },
  ];

  return (
    <>
      <PageHeadExtra>
        <Segmented value={tab} onChange={(next) => query.update({ tab: next === "list" ? null : next })} options={TABS} label="会话视图" size="md" />
      </PageHeadExtra>

      {tab === "analysis" ? (
        <AnalysisPanel onDone={list.reload} />
      ) : (
        <Card>
          <div className="filter-bar">
            <SearchBox value={q} onChange={(next) => query.update({ q: next || null }, { replace: true })} placeholder="搜索访客编号或消息内容" />
            <input className="input input--date" type="date" aria-label="开始日期" value={from} max={to || undefined} onChange={(e) => query.update({ from: e.target.value || null })} />
            <input className="input input--date" type="date" aria-label="结束日期" value={to} min={from || undefined} onChange={(e) => query.update({ to: e.target.value || null })} />
            <button type="button" className={test ? "chip on" : "chip"} onClick={() => query.update({ test: test ? null : 1 })}>
              测试场会话
            </button>
          </div>
          <FilterTags tags={tags} onClearAll={clearAll} />
          <PagedBody
            state={list}
            query={query}
            empty={
              tags.length > 0 ? (
                <Empty
                  action={
                    <button type="button" className="btn btn-sm" onClick={clearAll}>
                      清除筛选
                    </button>
                  }
                >
                  没有符合条件的会话。
                </Empty>
              ) : (
                <Empty>还没有对话记录。前台讲解员每说一句，这里就会多一条。</Empty>
              )
            }
          >
            {(items) => <DataList label="会话" columns={columns} rows={items} rowKey={(row) => row.id} query={query} onRowClick={(row) => setOpen(row.id)} />}
          </PagedBody>
        </Card>
      )}

      {openId && <SessionDetail key={openId} id={openId} onClose={() => setOpen(null)} />}
    </>
  );
}

function AnalysisPanel({ onDone }: { onDone: () => void }) {
  const reports = useAsync(() => api.analysisReports(), []);
  const [mode, setMode] = useState<"incremental" | "full">("incremental");
  const [estimate, setEstimate] = useState<Awaited<ReturnType<typeof api.analysisEstimate>> | null>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function prepare(next: "incremental" | "full") {
    setMode(next);
    setError(null);
    try {
      setEstimate(await api.analysisEstimate(next));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "估算失败");
    }
  }

  async function run() {
    setBusy(true);
    setError(null);
    try {
      const out = await api.analysisRun(mode);
      setResult(out);
      setEstimate(null);
      reports.reload();
      toast(out.skipped ? (out.reason ?? "没有可分析的会话") : `分析完成：${out.sessionCount} 个会话`);
      onDone();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "分析失败");
    } finally {
      setBusy(false);
    }
  }

  const latest = result?.parsed ?? reports.data?.[0]?.parsed ?? null;

  return (
    <Card
      actions={
        <>
          <button type="button" className="btn btn-outline btn-sm" onClick={() => void prepare("incremental")} disabled={busy}>
            分析新会话
          </button>
          <button type="button" className="btn btn-tonal btn-sm" onClick={() => void prepare("full")} disabled={busy}>
            全量分析
          </button>
        </>
      }
    >
      {error && <ErrorBar message={error} />}
      {estimate && (
        <div className="banner">
          <span>
            本次将分析 <b className="mono">{estimate.sessionCount}</b> 个会话（约 <span className="mono">{estimate.estimatedTokens.toLocaleString()}</span> 词元），用后台配置的分析模型。
          </span>
          <button type="button" className="btn btn-filled btn-sm banner__action" onClick={() => void run()} disabled={busy || estimate.sessionCount === 0}>
            {busy ? "分析中…" : "开始分析"}
          </button>
        </div>
      )}
      {busy && !estimate && <Skeleton rows={3} />}
      {!latest && !estimate && !busy && (
        <Empty icon={<Sparkles size={40} strokeWidth={1.5} aria-hidden />}>还没有分析结果。点「分析新会话」会把访客提问归纳成主题、高频问题与知识缺口。</Empty>
      )}
      {latest && (
        <div className="stack">
          <div className="chip-group">
            {(latest.topics ?? []).slice(0, 8).map((topic: any, index: number) => (
              <span className="chip on" key={index}>
                {topic.name}
                {topic.count > 1 ? ` · ${topic.count}` : ""}
              </span>
            ))}
          </div>
          {(latest.topQuestions ?? []).length > 0 && (
            <section className="section">
              <div className="section__head">
                <h3>高频问题</h3>
              </div>
              <div className="mini-list">
                {(latest.topQuestions ?? []).slice(0, 8).map((item: any, index: number) => (
                  <div className="kv" key={index}>
                    <span className="kv__main dl-ellipsis">{item.question}</span>
                    <span className="muted mono">{item.count}×</span>
                  </div>
                ))}
              </div>
            </section>
          )}
          {(latest.gaps ?? []).length > 0 && (
            <div className="banner bad banner--block">
              <b>发现知识缺口 {(latest.gaps ?? []).length} 条</b>
              {(latest.gaps ?? []).slice(0, 5).map((gap: any, index: number) => (
                <div key={index}>
                  · {gap.question}
                  {gap.reason ? `（${gap.reason}）` : ""}
                </div>
              ))}
            </div>
          )}
          {latest.quality?.notes && <p className="muted">质量画像：{latest.quality.notes}</p>}
          {reports.data && reports.data.length > 0 && (
            <p className="muted">
              最近一次：{dateTime(reports.data[0].createdAt)} · {reports.data[0].sessionCount} 个会话 · {reports.data[0].model}
            </p>
          )}
        </div>
      )}
    </Card>
  );
}

function SessionDetail({ id, onClose }: { id: string; onClose: () => void }) {
  const detail = useAsync(() => api.session(id), [id]);
  const analysis = useAsync(() => api.sessionAnalysis(id), [id]);
  const [busy, setBusy] = useState(false);
  const parsed = analysis.data?.parsed;

  async function analyze() {
    setBusy(true);
    try {
      await api.analyzeSession(id);
      analysis.reload();
      toast("这次会话的分析写好了");
    } catch (err) {
      toast(err instanceof ApiError ? err.message : "分析失败");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Drawer
      title="对话详情"
      onClose={onClose}
      footer={
        <button type="button" className="btn btn-filled" onClick={() => void analyze()} disabled={busy}>
          {busy ? "分析中…" : parsed ? "重新分析这次会话" : "分析这次会话"}
        </button>
      }
    >
      {detail.loading && !detail.data && <Skeleton rows={6} />}
      {detail.error && <ErrorBar message={detail.error} onRetry={detail.reload} />}
      {detail.data && (
        <>
          <div className="meta-row muted">
            <span>开始 {dateTime(detail.data.startedAt)}</span>
            <span>轮数 {detail.data.turnCount}</span>
            <span>
              词元 {detail.data.inputTokens} / {detail.data.outputTokens}
            </span>
            <span>状态 {stateLabel(detail.data.endedReason)}</span>
          </div>

          {parsed && (
            <section className="section section--tint">
              <div className="section__head">
                <h3>AI 分析</h3>
              </div>
              {parsed.summary && <p>{parsed.summary}</p>}
              {(parsed.questions ?? []).length > 0 && <p className="muted">关键问题：{(parsed.questions ?? []).join("；")}</p>}
              {(parsed.gaps ?? []).map((gap: any, index: number) => (
                <p className="err" key={index}>
                  缺口：{gap.question}
                </p>
              ))}
              {(parsed.shouldImprove ?? []).length > 0 && (
                <div className="muted">
                  可以更好：
                  {(parsed.shouldImprove ?? []).map((item: string, index: number) => (
                    <div key={index}>· {item}</div>
                  ))}
                </div>
              )}
            </section>
          )}

          {detail.data.messages.length === 0 && <Empty compact>这次会话还没有消息。</Empty>}
          <div className="stack">
            {detail.data.messages.map((msg) => (
              <div key={msg.id} className={msg.role === "user" ? "msg user" : "msg"}>
                <div className="meta">
                  {msg.role === "user" ? "访客" : "讲解员"} · {dateTime(msg.createdAt)}
                  {msg.latencyMs ? ` · ${msg.latencyMs}ms` : ""}
                  {msg.errorCode ? ` · 错误 ${msg.errorCode}` : ""}
                </div>
                <div>{msg.content}</div>
                {msg.toolJson && <div className="meta mono">工具：{msg.toolJson}</div>}
              </div>
            ))}
          </div>
        </>
      )}
    </Drawer>
  );
}
