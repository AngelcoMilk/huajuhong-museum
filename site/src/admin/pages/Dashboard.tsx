import { useMemo } from "react";
import { Link, useSearchParams } from "react-router";
import {
  Activity,
  BookOpen,
  Building2,
  ChartColumn,
  ChevronRight,
  Coins,
  Database,
  FileText,
  Flame,
  Landmark,
  ListTodo,
  MessageSquare,
  Package,
  PackageCheck, PackageMinus,
  ScrollText,
  ShieldCheck,
  ShoppingBag,
  TreePine,
  Trees,
} from "lucide-react";
import { baseOption, Chart, lineSeries, useChartColors } from "../chart";
import { api, type DailyPoint, type DashboardRange } from "../api";
import { useAuth } from "../auth";
import { Glass } from "../glass";
import { asyncGate, Card, compact, Empty, money, relative, Segmented, Skeleton, useAsync, useIsNarrow, pageLabel } from "../ui";

const RANGES: Array<{ value: DashboardRange; label: string }> = [
  { value: "all", label: "全部" },
  { value: "month", label: "月" },
  { value: "week", label: "周" },
  { value: "day", label: "日" },
];
const DAYS = ["7", "30", "90"] as const;
type Days = (typeof DAYS)[number];

const BOARDS = [
  { value: "all", label: "全部" },
  { value: "park", label: "园区" },
  { value: "museum", label: "博物馆" },
  { value: "history", label: "历史" },
  { value: "product", label: "产品" },
] as const;
type BoardFilter = (typeof BOARDS)[number]["value"];

const BOARD_ICON: Record<string, typeof Trees> = {
  park: TreePine,
  museum: Landmark,
  history: ScrollText,
  product: Package,
};

const ORDER_STATUS: Record<string, { label: string; tone: string }> = {
  pending_payment: { label: "待付款", tone: "pill pill--warn" },
  paid: { label: "待发货", tone: "pill pill--tint" },
  shipped: { label: "已发货", tone: "pill" },
  completed: { label: "已完成", tone: "pill pill--ok" },
  cancelled: { label: "已取消", tone: "pill" },
};

const KPI_SKELETON = (
  <div style={{ display: "grid", gap: 12 }} aria-busy="true">
    <span className="skeleton" style={{ width: "56%", height: 40, borderRadius: 10 }} />
    <span className="skeleton" style={{ width: "72%" }} />
  </div>
);

function Waves() {
  return (
    <svg className="card-waves" width="120" height="96" viewBox="0 0 120 96" fill="none" aria-hidden="true">
      {[0, 14, 28, 42].map((y) => (
        <path key={y} d={`M4 ${44 + y}C34 ${14 + y} 66 ${70 + y} 118 ${28 + y}`} stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
      ))}
    </svg>
  );
}

function DailyChart({ series }: { series: DailyPoint[] }) {
  const colors = useChartColors();
  const option = useMemo(() => {
    const base = baseOption(colors);
    const axisLine = { lineStyle: { color: colors.grid } };
    return {
      textStyle: base.textStyle,
      legend: base.legend,
      grid: base.grid,
      tooltip: {
        ...base.tooltip,
        formatter: (points: Array<{ axisValue: string; seriesName: string; value: number; color: unknown; dataIndex: number; seriesIndex: number }>) => {
          const rows = points
            .map((p) => {
              const value = p.seriesIndex === 2 ? money(series[p.dataIndex].amountCents) : p.value.toLocaleString("en-US");
              return `<div class="chart-tip__row"><i style="background:${colors.series[p.seriesIndex]}"></i>${p.seriesName}<b>${value}</b></div>`;
            })
            .join("");
          return `<div class="chart-tip__day">${points[0]?.axisValue ?? ""}</div>${rows}`;
        },
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: series.map((d) => d.day.slice(5).replace("-", "/")),
        axisLine,
        axisTick: { show: false },
        axisLabel: { ...base.axisText, hideOverlap: true },
      },
      yAxis: [
        {
          type: "value",
          minInterval: 1,
          splitLine: base.splitLine,
          axisLabel: { ...base.axisText, formatter: (v: number) => compact(v) },
        },
        {
          type: "value",
          minInterval: 1,
          splitLine: { show: false },
          axisLabel: { ...base.axisText, color: colors.series[2], formatter: (v: number) => `¥${compact(v)}` },
        },
      ],
      series: [
        lineSeries("访问", colors.series[0], series.map((d) => d.pv)),
        lineSeries("对话", colors.series[1], series.map((d) => d.guideTurns)),
        lineSeries("成交额", colors.series[2], series.map((d) => d.amountCents / 100), 1),
      ],
    };
  }, [colors, series]);
  // 桌面和右边展项热度的七行等高，不在卡片下面留白
  const narrow = useIsNarrow(1099);
  return <Chart option={option} height={narrow ? 340 : 460} label="每日访问、对话与成交额" />;
}

export default function Dashboard() {
  const { isAdmin } = useAuth();
  const [params, setParams] = useSearchParams();
  const rangeParam = params.get("range");
  const range = (RANGES.some((r) => r.value === rangeParam) ? rangeParam : "week") as DashboardRange;
  const daysParam = params.get("days");
  const days: Days = DAYS.includes(daysParam as Days) ? (daysParam as Days) : "30";
  const boardParam = params.get("board");
  const board: BoardFilter = BOARDS.some((b) => b.value === boardParam) ? (boardParam as BoardFilter) : "all";

  function setParam(key: string, value: string, fallback: string) {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value === fallback) next.delete(key);
        else next.set(key, value);
        return next;
      },
      { replace: true },
    );
  }

  const stats = useAsync(() => api.dashboard(range), [range]);
  const daily = useAsync(() => api.daily(Number(days)), [days]);
  const top = useAsync(() => api.topItems(board), [board]);
  const orders = useAsync(() => api.orders({ page: 1, pageSize: 5 }), []);
  const sessions = useAsync(() => (isAdmin ? api.sessions({ page: 1, pageSize: 5 }) : Promise.resolve(null)), [isAdmin]);

  const data = stats.data;
  const gate = asyncGate(stats, { compact: true, skeleton: KPI_SKELETON });
  const pct = data?.visits.weekChangePct;
  const rate = data?.guide.successRate;

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <div className="grid12">
        <Card className="col-3" title="总访问量" icon={<Database size={18} strokeWidth={1.75} aria-hidden />}>
          {gate ?? (
            <>
              <div className="kpi">{compact(data!.visits.totalPv)}</div>
              <div className="kpi-note">
                <span className={pct !== null && pct! < 0 ? "delta delta--down" : "delta"}>
                  {pct === null || pct === undefined ? "—" : `${pct > 0 ? "+" : ""}${pct}%`}
                </span>
                与上周比
              </div>
              <Waves />
            </>
          )}
        </Card>

        <Card className="col-3" title="讲解成功率" icon={<ShieldCheck size={18} strokeWidth={1.75} aria-hidden />}>
          {gate ?? (
            <>
              <div className="kpi">
                {rate === null || rate === undefined ? "—" : rate}
                <small>%</small>
              </div>
              <div
                className="progress"
                role="progressbar"
                aria-label="讲解成功率"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={rate ?? 0}
              >
                <i style={{ width: `${rate ?? 0}%` }} />
              </div>
              <div className="kpi-note">
                失败 <b className="mono">{data!.guide.failed}</b> 次
              </div>
            </>
          )}
        </Card>

        <Card
          className="col-3"
          title="讲解员词元"
          icon={<ChartColumn size={18} strokeWidth={1.75} aria-hidden />}
          actions={<Segmented label="词元统计范围" value={range} onChange={(v) => setParam("range", v, "week")} options={RANGES} />}
        >
          {gate ?? (
            <div className="token-cols">
              <div>
                <span>输入</span>
                <b>{compact(data!.guide.inputTokens)}</b>
              </div>
              <div>
                <span>输出</span>
                <b>{compact(data!.guide.outputTokens)}</b>
              </div>
              <div>
                <span>会话</span>
                <b>{compact(data!.guide.sessions)}</b>
              </div>
            </div>
          )}
        </Card>

        <Glass as="section" variant="tinted" className="today col-3">
          <div className="today__head">
            <Activity size={18} strokeWidth={1.75} aria-hidden />
            今日访问
          </div>
          {data ? (
            <>
              <div className="kpi">{compact(data.visits.todayPv)}</div>
              <div className="today__foot">
                <span>
                  本周：<b>{compact(data.visits.weekPv)}</b>
                </span>
                <span>
                  本月：<b>{compact(data.visits.monthPv)}</b>
                </span>
              </div>
            </>
          ) : (
            <div className="kpi" style={{ opacity: 0.7 }}>
              {stats.notReady ? <span style={{ fontSize: 14, fontFamily: "var(--font-ui)" }}>暂时无法使用</span> : "—"}
            </div>
          )}
        </Glass>
      </div>

      <div className="grid12">
        <Card
          className="col-8"
          title="每日概览"
          actions={
            <Segmented
              label="每日概览时间范围"
              value={days}
              onChange={(v) => setParam("days", v, "30")}
              options={DAYS.map((d) => ({ value: d, label: `${d} 天` }))}
            />
          }
        >
          {asyncGate(daily, { skeleton: <span className="skeleton" style={{ height: 340, borderRadius: 16 }} /> }) ?? <DailyChart series={daily.data!.series} />}
        </Card>

        <Card className="col-4" title="展项热度" icon={<Flame size={18} strokeWidth={1.75} aria-hidden />}>
          <div className="filter-bar" role="group" aria-label="按板块筛选">
            {BOARDS.map((b) => (
              <button
                key={b.value}
                type="button"
                className={board === b.value ? "chip on" : "chip"}
                aria-pressed={board === b.value}
                onClick={() => setParam("board", b.value, "all")}
              >
                {b.label}
              </button>
            ))}
          </div>
          {asyncGate(top, { compact: true, skeleton: <Skeleton rows={6} /> }) ??
            (top.data!.items.length === 0 ? (
              <Empty compact icon={<Flame size={28} strokeWidth={1.5} aria-hidden />}>
                这个板块近 30 天还没有浏览记录。
              </Empty>
            ) : (
              <div className="rank">
                {top.data!.items.slice(0, 7).map((item) => {
                  const Icon = BOARD_ICON[item.board] ?? FileText;
                  const row = (
                    <>
                      <span className="icon-tile">
                        <Icon size={20} strokeWidth={1.75} aria-hidden />
                      </span>
                      <span className="rank__main">
                        <b title={item.title}>{item.title}</b>
                        <span>{compact(item.views)} 次浏览</span>
                      </span>
                      <span className="rank__share">{item.share}%</span>
                    </>
                  );
                  return isAdmin ? (
                    <Link className="rank__row" key={item.id} to={item.board === "product" ? `/admin/products/${encodeURIComponent(item.id)}` : `/admin/content?q=${encodeURIComponent(item.id)}`}>
                      {row}
                    </Link>
                  ) : (
                    <div className="rank__row" key={item.id}>
                      {row}
                    </div>
                  );
                })}
              </div>
            ))}
        </Card>
      </div>

      <div className="grid12">
        <Card className="col-4" title="待办" icon={<ListTodo size={18} strokeWidth={1.75} aria-hidden />}>
          {asyncGate(stats, { compact: true, skeleton: <Skeleton rows={4} /> }) ?? (
            <div className="todo">
              <TodoItem to="/admin/orders?status=paid" icon={<PackageCheck size={20} strokeWidth={1.75} aria-hidden />} count={data!.todo.ordersToShip} label="待发货订单" />
              {isAdmin && (
                <>
                  <TodoItem to="/admin/kb?tab=gaps&status=pending" icon={<BookOpen size={20} strokeWidth={1.75} aria-hidden />} count={data!.todo.gapsPending} label="待处理知识缺口" />
                  <TodoItem to="/admin/enterprises?placed=no" icon={<Building2 size={20} strokeWidth={1.75} aria-hidden />} count={data!.todo.enterprisesUnplaced} label="未定位企业" />
                  <TodoItem to="/admin/content?status=draft" icon={<FileText size={20} strokeWidth={1.75} aria-hidden />} count={data!.todo.itemsDraft} label="草稿条目" />
                  <TodoItem to="/admin/products?stock=low" icon={<PackageMinus size={20} strokeWidth={1.75} aria-hidden />} count={data!.todo.lowStock} label="低库存商品" />
                </>
              )}
            </div>
          )}
        </Card>

        <Card
          className={isAdmin ? "col-4 col-md-6" : "col-8"}
          title="最近订单"
          icon={<ShoppingBag size={18} strokeWidth={1.75} aria-hidden />}
          actions={
            <Link className="btn btn-sm btn-text" to="/admin/orders">
              全部
            </Link>
          }
        >
          {asyncGate(orders, { compact: true, skeleton: <Skeleton rows={5} /> }) ??
            (orders.data!.items.length === 0 ? (
              <Empty compact icon={<ShoppingBag size={28} strokeWidth={1.5} aria-hidden />}>
                还没有订单。
              </Empty>
            ) : (
              <div className="mini-list">
                {orders.data!.items.map((order) => {
                  const status = ORDER_STATUS[order.status] ?? { label: order.status, tone: "pill" };
                  return (
                    <Link className="mini-row" key={order.orderNo} to={`/admin/orders?q=${encodeURIComponent(order.orderNo)}`}>
                      <span className="mini-row__main">
                        <b className="mono" title={order.orderNo}>{order.orderNo}</b>
                        <span>
                          {order.user || "—"} · {relative(order.createdAt)}
                        </span>
                      </span>
                      <span className="mono" style={{ fontSize: 13 }}>{money(order.totalCents)}</span>
                      <span className={status.tone}>{status.label}</span>
                    </Link>
                  );
                })}
              </div>
            ))}
        </Card>

        {isAdmin && <Card
          className="col-4 col-md-6"
          title="最近会话"
          icon={<MessageSquare size={18} strokeWidth={1.75} aria-hidden />}
          actions={
            <Link className="btn btn-sm btn-text" to="/admin/sessions">
              全部
            </Link>
          }
        >
          {asyncGate(sessions, { compact: true, skeleton: <Skeleton rows={5} /> }) ??
            (sessions.data!.items.length === 0 ? (
              <Empty compact icon={<MessageSquare size={28} strokeWidth={1.5} aria-hidden />}>
                还没有讲解会话。
              </Empty>
            ) : (
              <div className="mini-list">
                {sessions.data!.items.map((session) => (
                  <Link className="mini-row" key={session.id} to={`/admin/sessions?id=${encodeURIComponent(session.id)}`}>
                    <span className="mini-row__main">
                      <b className="mono" title={session.visitorId}>{session.visitorId.slice(0, 12)}</b>
                      <span>
                        {pageLabel(session.page)} · {relative(session.startedAt)}
                      </span>
                    </span>
                    <span className="mono muted" style={{ fontSize: 12, display: "inline-flex", alignItems: "center", gap: 4 }}>
                      <Coins size={14} strokeWidth={1.75} aria-hidden />
                      {compact(session.inputTokens + session.outputTokens)}
                    </span>
                    <span className="pill">{session.turnCount} 轮</span>
                  </Link>
                ))}
              </div>
            ))}
        </Card>}
      </div>
    </div>
  );
}

function TodoItem({ to, icon, count, label }: { to: string; icon: React.ReactNode; count: number; label: string }) {
  return (
    <Link className="todo__item" to={to}>
      <span className="todo__top">
        {icon}
        <ChevronRight size={16} strokeWidth={1.75} aria-hidden />
      </span>
      <span className="todo__num" data-zero={count === 0}>{count}</span>
      <span className="todo__label">{label}</span>
    </Link>
  );
}
