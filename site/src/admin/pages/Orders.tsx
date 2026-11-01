// 订单：行内发货（小弹层 + 可撤销），详情抽屉带时间线、收货信息与客服备注。
import { useEffect, useState } from "react";
import { Check, Circle, Truck } from "lucide-react";
import { api, ApiError, type OrderTimelineEntry } from "../api";
import { DataList, FilterTags, PagedBody, SearchBox, useListQuery, type Column } from "../list";
import { applyApiError, Card, Confirm, dateTime, Drawer, Empty, ErrorBar, Field, money, Popover, Skeleton, toast, useAsync, useFormState } from "../ui";

const STATUS = [
  { key: "pending_payment", label: "待付款", tone: "pill pill--warn" },
  { key: "paid", label: "待发货", tone: "pill pill--tint" },
  { key: "shipped", label: "已发货", tone: "pill" },
  { key: "completed", label: "已完成", tone: "pill pill--ok" },
  { key: "cancelled", label: "已取消", tone: "pill" },
] as const;
const STATUS_KEYS = STATUS.map((s) => s.key);
const SORTABLE = ["createdAt", "totalCents", "paidAt"] as const;
const CARRIERS = ["顺丰速运", "京东物流", "中通快递", "圆通速递", "邮政EMS", "自行配送"];
const TRACKING = /^[A-Za-z0-9]{6,30}$/;

type OrderRow = Awaited<ReturnType<typeof api.orders>>["items"][number];

function OrderStatus({ status }: { status: string }) {
  const meta = STATUS.find((s) => s.key === status);
  return <span className={meta?.tone ?? "pill"}>{meta?.label ?? status}</span>;
}

/** 已发货的撤销入口：列表行和详情抽屉共用 */
function shippedToast(orderNo: string, reload: () => void) {
  toast("已发货", {
    action: {
      label: "撤销",
      run: () =>
        void api
          .unshipOrder(orderNo)
          .then(() => {
            toast("已撤回发货");
            reload();
          })
          .catch((err) => toast(err instanceof ApiError ? `撤销失败：${err.message}` : "撤销失败")),
    },
  });
}

export default function Orders() {
  const query = useListQuery(SORTABLE);
  const status = query.pick("status", STATUS_KEYS);
  const { q, page, pageSize, sort, order } = query;
  const productId = query.params.get("productId") ?? undefined;
  const list = useAsync(() => api.orders({ status, q, productId, page, pageSize, sort, order }), [status, q, productId, page, pageSize, sort, order]);
  // ?open=<订单号>：从商品页点最近订单直接打开详情
  const [openNo, setOpenNo] = useState<string | null>(() => query.params.get("open"));
  const [shipping, setShipping] = useState<{ orderNo: string; anchor: HTMLElement } | null>(null);

  const tags = [
    status && { key: "status", label: `状态：${STATUS.find((s) => s.key === status)?.label}`, onClear: () => query.update({ status: null }) },
    q && { key: "q", label: `搜索：${q}`, onClear: () => query.update({ q: null }) },
    productId && { key: "productId", label: `商品：${productId}`, onClear: () => query.update({ productId: null }) },
  ].filter(Boolean) as Array<{ key: string; label: string; onClear: () => void }>;
  const clearAll = () => query.update({ status: null, q: null, productId: null });

  const columns: Column<OrderRow>[] = [
    {
      key: "order",
      label: "收货人 / 订单号",
      width: "minmax(0, 1fr)",
      mobile: "grow",
      render: (row) => (
        <>
          <span className="dl-title dl-ellipsis">{row.user}</span>
          <span className="muted mono dl-ellipsis">{row.orderNo}</span>
        </>
      ),
    },
    { key: "phone", label: "手机号", width: "116px", mobile: "hide", render: (row) => <span className="muted mono">{row.phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2")}</span> },
    { key: "count", label: "件数", width: "48px", mobile: "hide", align: "end", render: (row) => <span className="muted mono">{row.itemCount}</span> },
    { key: "total", label: "金额", width: "96px", sortKey: "totalCents", firstOrder: "desc", align: "end", render: (row) => <span className="mono">{money(row.totalCents)}</span> },
    { key: "status", label: "状态", width: "84px", render: (row) => <OrderStatus status={row.status} /> },
    { key: "created", label: "下单时间", width: "128px", sortKey: "createdAt", firstOrder: "desc", mobile: "hide", render: (row) => <span className="dl-time">{dateTime(row.createdAt)}</span> },
    { key: "paid", label: "付款时间", width: "128px", sortKey: "paidAt", firstOrder: "desc", mobile: "hide", render: (row) => <span className="dl-time">{row.paidAt ? dateTime(row.paidAt) : "—"}</span> },
  ];

  return (
    <>
      <Card title="订单列表">
        <div className="filter-bar">
          <SearchBox value={q} onChange={(next) => query.update({ q: next || null }, { replace: true })} placeholder="搜索订单号、手机号或收货人" />
          <div className="chip-group" role="group" aria-label="状态">
            {STATUS.map((s) => (
              <button key={s.key} type="button" className={status === s.key ? "chip on" : "chip"} onClick={() => query.update({ status: status === s.key ? null : s.key })}>
                {s.label}
              </button>
            ))}
          </div>
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
                没有符合条件的订单。
              </Empty>
            ) : (
              <Empty>还没有订单。</Empty>
            )
          }
        >
          {(items) => (
            <DataList
              label="订单"
              columns={columns}
              rows={items}
              rowKey={(row) => row.orderNo}
              query={query}
              onRowClick={(row) => setOpenNo(row.orderNo)}
              actionsWidth="84px"
              actions={(row) =>
                row.status === "paid" ? (
                  <button
                    type="button"
                    className="btn btn-tonal btn-sm"
                    aria-haspopup="dialog"
                    onClick={(event) => setShipping({ orderNo: row.orderNo, anchor: event.currentTarget })}
                  >
                    <Truck size={16} strokeWidth={1.75} aria-hidden />
                    发货
                  </button>
                ) : null
              }
            />
          )}
        </PagedBody>
      </Card>

      {shipping && (
        <ShipPopover
          key={shipping.orderNo}
          orderNo={shipping.orderNo}
          anchor={shipping.anchor}
          onClose={() => setShipping(null)}
          onShipped={() => {
            setShipping(null);
            list.reload();
          }}
          reload={list.reload}
        />
      )}
      {openNo && <OrderDetail key={openNo} orderNo={openNo} onClose={() => setOpenNo(null)} onChanged={list.reload} />}
    </>
  );
}

function ShipPopover({
  orderNo,
  anchor,
  onClose,
  onShipped,
  reload,
}: {
  orderNo: string;
  anchor: HTMLElement;
  onClose: () => void;
  onShipped: () => void;
  reload: () => void;
}) {
  const [carrier, setCarrier] = useState(CARRIERS[0]);
  const [trackingNo, setTrackingNo] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);

  async function ship(event: React.FormEvent) {
    event.preventDefault();
    const value = trackingNo.trim();
    if (!TRACKING.test(value)) {
      setError("运单号要 6–30 位字母或数字");
      return;
    }
    setBusy(true);
    setError(undefined);
    try {
      await api.shipOrder(orderNo, { carrier, trackingNo: value });
      onShipped();
      shippedToast(orderNo, reload);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "发货失败");
      setBusy(false);
    }
  }

  return (
    <Popover anchor={anchor} onClose={onClose} label={`给 ${orderNo} 发货`}>
      <form className="popover-form" onSubmit={(event) => void ship(event)} noValidate>
        <Field label="物流公司">
          <select className="select" value={carrier} onChange={(e) => setCarrier(e.target.value)}>
            {CARRIERS.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </Field>
        <Field label="运单号" error={error}>
          <input
            className="input mono"
            value={trackingNo}
            autoComplete="off"
            onChange={(e) => {
              setTrackingNo(e.target.value);
              setError(undefined);
            }}
            placeholder="例如 SF1234567890"
          />
        </Field>
        <div className="popover-foot">
          <button type="button" className="btn btn-sm" onClick={onClose}>
            取消
          </button>
          <button type="submit" className="btn btn-filled btn-sm" disabled={busy}>
            {busy ? "发货中…" : "确认发货"}
          </button>
        </div>
      </form>
    </Popover>
  );
}

const TIMELINE: Array<{ status: OrderTimelineEntry["status"]; label: string }> = [
  { status: "created", label: "下单" },
  { status: "paid", label: "付款" },
  { status: "shipped", label: "发货" },
  { status: "completed", label: "完成" },
];

function Timeline({ entries }: { entries: OrderTimelineEntry[] }) {
  return (
    <ol className="timeline" aria-label="订单时间线">
      {TIMELINE.map((step) => {
        const hit = entries.find((entry) => entry.status === step.status);
        return (
          <li key={step.status} className="timeline__step" data-done={Boolean(hit)}>
            <span className="timeline__dot" aria-hidden>
              {hit ? <Check size={12} strokeWidth={2.5} /> : <Circle size={8} strokeWidth={2} />}
            </span>
            <span className="timeline__label">{step.label}</span>
            <span className="muted mono">{hit ? dateTime(hit.at) : "—"}</span>
          </li>
        );
      })}
    </ol>
  );
}

function OrderDetail({ orderNo, onClose, onChanged }: { orderNo: string; onClose: () => void; onChanged: () => void }) {
  const detail = useAsync(() => api.order(orderNo), [orderNo]);
  const order = detail.data;
  const [remark, setRemark] = useState("");
  const [savingRemark, setSavingRemark] = useState(false);
  const [editingAddress, setEditingAddress] = useState(false);
  const [shipAnchor, setShipAnchor] = useState<HTMLElement | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);

  // 备注以服务端为准，详情刷新后同步回输入框
  const savedRemark = String(order?.remark ?? "");
  useEffect(() => {
    setRemark(savedRemark);
  }, [savedRemark]);

  function refresh() {
    detail.reload();
    onChanged();
  }

  // 后端已给 timeline 就用；没给时按时间戳推，时间线不空着
  const timeline: OrderTimelineEntry[] = order
    ? (order.timeline ??
      ([
        { status: "created", at: order.createdAt },
        { status: "paid", at: order.paidAt },
        { status: "shipped", at: order.shippedAt },
        { status: "completed", at: order.completedAt },
      ].filter((entry) => entry.at) as OrderTimelineEntry[]))
    : [];

  const canEditAddress = order && ["pending_payment", "paid"].includes(order.status);

  async function saveRemark() {
    setSavingRemark(true);
    try {
      await api.remarkOrder(orderNo, remark.trim());
      toast("备注已保存");
      detail.reload();
    } catch (err) {
      toast(err instanceof ApiError ? err.message : "备注保存失败");
    } finally {
      setSavingRemark(false);
    }
  }

  async function complete() {
    setBusy(true);
    try {
      await api.completeOrder(orderNo);
      toast("已标记完成");
      refresh();
    } catch (err) {
      toast(err instanceof ApiError ? err.message : "操作失败");
    } finally {
      setBusy(false);
      setConfirming(false);
    }
  }

  async function unship() {
    setBusy(true);
    try {
      await api.unshipOrder(orderNo);
      toast("已撤回发货");
      refresh();
    } catch (err) {
      toast(err instanceof ApiError ? err.message : "撤回失败");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Drawer
        title={orderNo}
        status={order ? <OrderStatus status={order.status} /> : undefined}
        onClose={onClose}
        dirty={order ? remark.trim() !== savedRemark : false}
        footer={
          <>
            {order?.status === "paid" && (
              <button type="button" className="btn btn-filled" onClick={(event) => setShipAnchor(event.currentTarget)}>
                <Truck size={16} strokeWidth={1.75} aria-hidden />
                发货
              </button>
            )}
            {order?.status === "shipped" && (
              <>
                <button type="button" className="btn btn-outline" onClick={() => void unship()} disabled={busy}>
                  撤回发货
                </button>
                <button type="button" className="btn btn-filled" onClick={() => setConfirming(true)} disabled={busy}>
                  标记完成
                </button>
              </>
            )}
          </>
        }
      >
        {detail.loading && !order && <Skeleton rows={6} />}
        {detail.error && <ErrorBar message={detail.error} onRetry={detail.reload} />}
        {order && (
          <>
            <Timeline entries={timeline} />

            <section className="section">
              <div className="section__head">
                <h3>收货信息</h3>
                {canEditAddress && (
                  <button type="button" className="btn btn-text btn-sm" onClick={() => setEditingAddress(true)}>
                    修改
                  </button>
                )}
              </div>
              <p>
                {order.address.name} · <span className="mono">{order.address.phone}</span>
              </p>
              <p className="muted">
                {order.address.province}
                {order.address.city}
                {order.address.district}
                {order.address.detail}
                {order.address.postcode ? ` · ${order.address.postcode}` : ""}
              </p>
            </section>

            {(order.carrier || order.trackingNo) && (
              <section className="section">
                <div className="section__head">
                  <h3>物流</h3>
                </div>
                <p>
                  {order.carrier ?? "未填物流公司"} · <span className="mono">{order.trackingNo ?? "无运单号"}</span>
                </p>
              </section>
            )}

            <section className="section">
              <div className="section__head">
                <h3>商品</h3>
              </div>
              <div className="mini-list">
                {order.items.map((item: any) => (
                  <div className="kv" key={item.id}>
                    <span className="kv__main">
                      <span className="dl-ellipsis">{item.title}</span>
                      <span className="muted">
                        {item.variant} · {money(item.priceCents)} × {item.qty}
                      </span>
                    </span>
                    <span className="mono">{money(item.priceCents * item.qty)}</span>
                  </div>
                ))}
              </div>
              <div className="totals">
                <span className="muted">
                  商品小计 <span className="mono">{money(order.subtotalCents)}</span>
                </span>
                <span className="muted">
                  运费 <span className="mono">{money(order.shippingFeeCents)}</span>
                </span>
                <strong>
                  合计 <span className="mono">{money(order.totalCents)}</span>
                </strong>
              </div>
            </section>

            <Field label="客服备注">
              <textarea className="textarea" rows={3} value={remark} maxLength={200} placeholder="例如：客户要求周末送达" onChange={(e) => setRemark(e.target.value)} />
            </Field>
            <div className="section__foot">
              <button type="button" className="btn btn-outline btn-sm" onClick={() => void saveRemark()} disabled={savingRemark || remark.trim() === savedRemark}>
                {savingRemark ? "保存中…" : "保存备注"}
              </button>
            </div>
          </>
        )}
      </Drawer>

      {shipAnchor && (
        <ShipPopover
          orderNo={orderNo}
          anchor={shipAnchor}
          onClose={() => setShipAnchor(null)}
          onShipped={() => {
            setShipAnchor(null);
            refresh();
          }}
          reload={refresh}
        />
      )}

      {editingAddress && order && <AddressDialog orderNo={orderNo} initial={order.address} onClose={() => setEditingAddress(false)} onSaved={detail.reload} />}

      <Confirm
        open={confirming}
        title="把这单标记为完成？"
        desc="完成后不能再撤回发货。"
        confirmText="标记完成"
        onConfirm={() => void complete()}
        onCancel={() => setConfirming(false)}
      />
    </>
  );
}

/** 客服照着客户发的信息改收货地址，可选同步进地址簿 */
function AddressDialog({ orderNo, initial, onClose, onSaved }: { orderNo: string; initial: Record<string, any>; onClose: () => void; onSaved: () => void }) {
  const { form, dirty, errors, setErrors, bind } = useFormState({
    name: String(initial.name ?? ""),
    phone: String(initial.phone ?? ""),
    province: String(initial.province ?? ""),
    city: String(initial.city ?? ""),
    district: String(initial.district ?? ""),
    detail: String(initial.detail ?? ""),
    postcode: String(initial.postcode ?? ""),
    tag: String(initial.tag ?? "家"),
  });
  const [saveToBook, setSaveToBook] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setBusy(true);
    setError(null);
    try {
      await api.updateOrderAddress(orderNo, form, saveToBook);
      toast(saveToBook ? "地址已更新，并存入客户地址簿" : "地址已更新");
      onSaved();
      onClose();
    } catch (err) {
      setError(applyApiError(err, setErrors, "保存失败"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Drawer variant="dialog" title="收货信息" onClose={onClose} onSave={save} saving={busy} dirty={dirty || !saveToBook}>
      {error && <ErrorBar message={error} />}
      <div className="form-grid">
        <Field label="收货人" error={errors.name}>
          <input className="input" {...bind("name")} />
        </Field>
        <Field label="手机号" error={errors.phone}>
          <input className="input" {...bind("phone")} inputMode="tel" />
        </Field>
        <Field label="省" error={errors.province}>
          <input className="input" {...bind("province")} />
        </Field>
        <Field label="市" error={errors.city}>
          <input className="input" {...bind("city")} />
        </Field>
        <Field label="区/县" error={errors.district}>
          <input className="input" {...bind("district")} />
        </Field>
        <Field label="邮编" error={errors.postcode}>
          <input className="input" {...bind("postcode")} inputMode="numeric" />
        </Field>
      </div>
      <Field label="详细地址" error={errors.detail}>
        <input className="input" {...bind("detail")} />
      </Field>
      <label className="check-row">
        <input className="check" type="checkbox" checked={saveToBook} onChange={(e) => setSaveToBook(e.target.checked)} />
        同时存入客户地址簿
      </label>
    </Drawer>
  );
}
