// 商品详情：一件商品从内容、规格库存到销售的全流程。保存和上下架固定在顶部条。
import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowLeft, Boxes, ChartColumn, Check, ChevronRight, CircleAlert, ExternalLink, FileText, Plus, Trash2 } from "lucide-react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router";
import { api, ApiError, type ProductDetail as Detail, type ProductSku, type ProductStage } from "../api";
import { Glass } from "../glass";
import { DataList, type Column } from "../list";
import { MediaField } from "../media";
import { applyApiError, asyncGate, Card, Confirm, dateTime, Empty, ErrorBar, Field, LeaveGuard, money, Segmented, Skeleton, Stat, toast, useAsync, useFormState } from "../ui";
import { PRODUCT_CATEGORIES, ProductStatusPill } from "./Products";

const STAGES: Array<{ key: ProductStage; label: string }> = [
  { key: "draft", label: "草稿" },
  { key: "on_sale", label: "在售" },
  { key: "has_orders", label: "已有订单" },
];
const ORDER_STATUS: Record<string, { label: string; tone: string }> = {
  pending_payment: { label: "待付款", tone: "pill pill--warn" },
  paid: { label: "待发货", tone: "pill pill--tint" },
  shipped: { label: "已发货", tone: "pill" },
  completed: { label: "已完成", tone: "pill pill--ok" },
  cancelled: { label: "已取消", tone: "pill" },
};
type Tab = "content" | "skus" | "sales";
const TABS: Array<{ value: Tab; label: string; icon: ReactNode }> = [
  { value: "content", label: "内容", icon: <FileText size={16} strokeWidth={1.75} aria-hidden /> },
  { value: "skus", label: "规格与库存", icon: <Boxes size={16} strokeWidth={1.75} aria-hidden /> },
  { value: "sales", label: "销售", icon: <ChartColumn size={16} strokeWidth={1.75} aria-hidden /> },
];

function Stage({ stage, off }: { stage: ProductStage; off: boolean }) {
  const at = STAGES.findIndex((s) => s.key === stage);
  // 下架又没有订单时退回第一步，但它不是草稿
  const labelOf = (s: (typeof STAGES)[number]) => (off && s.key === "draft" ? "未在售" : s.label);
  return (
    <span className="stage" aria-label={`当前阶段：${STAGES[at] ? labelOf(STAGES[at]) : ""}`}>
      {STAGES.map((s, index) => (
        <span key={s.key} className="stage" style={{ gap: 6 }}>
          {index > 0 && <ChevronRight size={14} strokeWidth={1.75} aria-hidden />}
          <span className="stage__step" data-on={index <= at} data-now={index === at}>
            {labelOf(s)}
          </span>
        </span>
      ))}
    </span>
  );
}

function BasicsFields({ bind, errors }: { bind: (key: "title" | "category" | "summary" | "body") => { value: string; onChange: (e: { target: { value: string } }) => void }; errors: Record<string, string> }) {
  return (
    <>
      <div className="form-grid">
        <Field label="名称" error={errors.title}>
          <input className="input" maxLength={80} {...bind("title")} />
        </Field>
        <Field label="分类" error={errors.category}>
          <select className="select" {...bind("category")}>
            {PRODUCT_CATEGORIES.map((one) => (
              <option key={one} value={one}>
                {one}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <Field label="摘要" hint="显示在前台产品卡片上，留空时取正文第一段" error={errors.summary}>
        <textarea className="textarea" rows={2} maxLength={200} style={{ minHeight: 72 }} {...bind("summary")} />
      </Field>
      <Field label="正文" hint="空一行分段" error={errors.body}>
        <textarea className="textarea" rows={10} {...bind("body")} />
      </Field>
    </>
  );
}

/** 新建：先存草稿拿到编号，图片和规格在详情页接着加 */
export function ProductNew() {
  const navigate = useNavigate();
  const { form, dirty, errors, setErrors, bind } = useFormState({ title: "", category: PRODUCT_CATEGORIES[0], summary: "", body: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdId, setCreatedId] = useState<string | null>(null);

  useEffect(() => {
    // 等 LeaveGuard 解除后再跳，否则会弹「放弃改动」
    if (createdId) navigate(`/admin/products/${encodeURIComponent(createdId)}?tab=content`, { replace: true });
  }, [createdId, navigate]);

  async function submit() {
    if (!form.title.trim()) {
      setErrors({ title: "名称不能为空" });
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const created = await api.createProduct({ title: form.title.trim(), category: form.category, summary: form.summary, body: form.body });
      toast(`草稿已保存（${created.id}），接着加图片和规格`);
      setCreatedId(created.id);
    } catch (err) {
      setError(applyApiError(err, setErrors, "保存失败"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="product-page">
      <Glass className="guide-bar" reading>
        <div className="guide-bar__status">
          <Link className="btn btn-text btn-sm" to="/admin/products">
            <ArrowLeft size={16} strokeWidth={1.75} aria-hidden />
            商品与库存
          </Link>
          <b className="product-bar__title">新建商品</b>
          {dirty && <span className="pill pill--bad">有未保存的改动</span>}
        </div>
        <div className="guide-bar__actions">
          <button type="button" className="btn btn-filled btn-sm" disabled={busy} onClick={() => void submit()}>
            {busy ? "保存中…" : "保存草稿，下一步"}
          </button>
        </div>
      </Glass>
      <Card title="基本信息">
        {error && <ErrorBar message={error} />}
        <BasicsFields bind={bind} errors={errors} />
      </Card>
      <LeaveGuard when={dirty && !createdId} />
    </div>
  );
}

export default function ProductDetail() {
  const id = useParams().id ?? "";
  const [params, setParams] = useSearchParams();
  const rawTab = params.get("tab");
  const tab: Tab = rawTab === "skus" || rawTab === "sales" ? rawTab : "content";
  const detail = useAsync(() => api.product(id), [id]);
  const skus = useAsync(() => api.productSkus(id), [id]);
  const { form, dirty, errors, setErrors, bind, reset } = useFormState({ title: "", category: PRODUCT_CATEGORIES[0], summary: "", body: "" });
  const [dirtySkus, setDirtySkus] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmOff, setConfirmOff] = useState(false);
  const data = detail.data;

  // 只在首次拿到数据时填表：媒体增删会重新拉详情，不能冲掉正在编辑的文字
  const filled = useRef<string | null>(null);
  useEffect(() => {
    if (data && filled.current !== data.id) {
      filled.current = data.id;
      reset({ title: data.title, category: data.category, summary: data.summary, body: data.body });
    }
  }, [data, reset]);

  const skuDirty = dirtySkus.length > 0;
  const refresh = () => {
    detail.reload();
    skus.reload();
  };

  async function saveContent(): Promise<Detail | null> {
    if (!form.title.trim()) {
      setErrors({ title: "名称不能为空" });
      setParams({ tab: "content" }, { replace: true });
      return null;
    }
    try {
      const saved = await api.patchProduct(id, { title: form.title.trim(), category: form.category, summary: form.summary, body: form.body });
      reset({ title: saved.title, category: saved.category, summary: saved.summary, body: saved.body });
      detail.mutate(() => saved);
      return saved;
    } catch (err) {
      setError(applyApiError(err, setErrors, "保存失败"));
      setParams({ tab: "content" }, { replace: true });
      return null;
    }
  }

  async function onSave() {
    setBusy(true);
    setError(null);
    if (await saveContent()) toast("已保存");
    setBusy(false);
  }

  async function publish() {
    if (skuDirty) {
      setError("规格还有没保存的改动，先保存再上架。");
      setParams({ tab: "skus" }, { replace: true });
      return;
    }
    setBusy(true);
    setError(null);
    try {
      if (dirty && !(await saveContent())) return;
      const next = await api.publishProduct(id);
      detail.mutate(() => next);
      toast("已上架");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "上架失败");
    } finally {
      setBusy(false);
    }
  }

  async function unpublish() {
    setConfirmOff(false);
    setBusy(true);
    setError(null);
    try {
      const next = await api.unpublishProduct(id);
      detail.mutate(() => next);
      toast("已下架，前台不再显示");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "下架失败");
    } finally {
      setBusy(false);
    }
  }

  const gate = asyncGate(detail, { skeleton: <Skeleton rows={6} /> });
  if (gate || !data) {
    return (
      <div className="product-page">
        <Link className="btn btn-text btn-sm" style={{ alignSelf: "flex-start" }} to="/admin/products">
          <ArrowLeft size={16} strokeWidth={1.75} aria-hidden />
          商品与库存
        </Link>
        <Card>{gate}</Card>
      </div>
    );
  }

  const published = data.itemStatus === "published";
  const coverOk = Boolean(data.thumbUrl);
  const skuOk = (skus.data ?? []).some((one) => one.status === "on" && one.priceCents > 0);

  return (
    <div className="product-page">
      <Glass className="guide-bar" reading>
        <div className="guide-bar__status">
          <Link className="btn btn-text btn-sm" to="/admin/products" aria-label="回到商品列表">
            <ArrowLeft size={16} strokeWidth={1.75} aria-hidden />
          </Link>
          <b className="product-bar__title dl-ellipsis">{data.title}</b>
          <span className="muted mono">{data.id}</span>
          <ProductStatusPill status={data.status} />
          <Stage stage={data.stage} off={data.status === "off"} />
          {(dirty || skuDirty) && <span className="pill pill--bad">有未保存的改动</span>}
        </div>
        <div className="guide-bar__actions">
          {published && (
            <a className="btn btn-text btn-sm" href={`/products/${encodeURIComponent(data.id)}`} target="_blank" rel="noopener noreferrer">
              <ExternalLink size={16} strokeWidth={1.75} aria-hidden />
              前台查看
            </a>
          )}
          <button type="button" className="btn btn-outline btn-sm" disabled={busy || !dirty} onClick={() => void onSave()}>
            保存
          </button>
          {published ? (
            <button type="button" className="btn btn-outline btn-sm" disabled={busy} onClick={() => setConfirmOff(true)}>
              下架
            </button>
          ) : (
            <button type="button" className="btn btn-filled btn-sm" disabled={busy} onClick={() => void publish()}>
              {busy ? "处理中…" : "上架"}
            </button>
          )}
        </div>
      </Glass>

      {error && <ErrorBar message={error} />}

      {!published && (
        <Card title="上架前要满足">
          <ul className="ready-list">
            <li data-ok={coverOk}>
              {coverOk ? <Check size={16} strokeWidth={2} aria-hidden /> : <CircleAlert size={16} strokeWidth={1.75} aria-hidden />}
              有封面图
              {!coverOk && (
                <button type="button" className="btn btn-text btn-sm" onClick={() => setParams({ tab: "content" }, { replace: true })}>
                  去加图片
                </button>
              )}
            </li>
            <li data-ok={skuOk}>
              {skuOk ? <Check size={16} strokeWidth={2} aria-hidden /> : <CircleAlert size={16} strokeWidth={1.75} aria-hidden />}
              至少一个已上架、价格大于 0 的规格
              {!skuOk && (
                <button type="button" className="btn btn-text btn-sm" onClick={() => setParams({ tab: "skus" }, { replace: true })}>
                  去加规格
                </button>
              )}
            </li>
          </ul>
        </Card>
      )}

      <div>
        <Segmented size="md" label="商品分段" value={tab} onChange={(next) => setParams({ tab: next }, { replace: true })} options={TABS} />
      </div>

      {/* 内容和规格保持挂载：切分段不能丢没保存的输入 */}
      <div className="product-page" hidden={tab !== "content"}>
        <Card title="基本信息">
          <BasicsFields bind={bind} errors={errors} />
        </Card>
        <Card title="图片">
          <MediaField
            itemId={data.id}
            media={data.media}
            emptyHint="还没有图片，上架前至少要有一张。"
            label={`共 ${data.media.length} 张`}
            coverUrl={data.thumbUrl}
            onSetCover={async (mediaId) => {
              const next = await api.setProductCover(id, mediaId);
              detail.mutate(() => next);
            }}
            onChange={(next) => {
              detail.mutate((prev) => ({ ...prev, media: next }));
              detail.reload();
            }}
          />
        </Card>
      </div>

      <div className="product-page" hidden={tab !== "skus"}>
        <Card title="规格与库存">
          {skus.data ? (
            <SkuList
              productId={data.id}
              skus={skus.data}
              threshold={data.lowStockThreshold}
              onChanged={refresh}
              onDirty={(skuId, isDirty) => setDirtySkus((prev) => (isDirty ? (prev.includes(skuId) ? prev : [...prev, skuId]) : prev.filter((one) => one !== skuId)))}
            />
          ) : (
            asyncGate(skus, { compact: true, skeleton: <Skeleton rows={3} /> })
          )}
        </Card>
      </div>

      {tab === "sales" && <SalesPane productId={data.id} />}

      <Confirm
        open={confirmOff}
        danger
        title="下架这件商品？"
        desc="前台不再显示，也不能下单。已有订单不受影响，可以随时再上架。"
        confirmText="下架"
        onCancel={() => setConfirmOff(false)}
        onConfirm={() => void unpublish()}
      />
      <LeaveGuard when={dirty || skuDirty} />
    </div>
  );
}

function SkuList({
  productId,
  skus,
  threshold,
  onChanged,
  onDirty,
}: {
  productId: string;
  skus: ProductSku[];
  threshold: number;
  onChanged: () => void;
  onDirty: (skuId: string, dirty: boolean) => void;
}) {
  const [adding, setAdding] = useState(false);
  return (
    <div className="sku-list">
      {skus.length === 0 && !adding ? (
        <Empty
          action={
            <button type="button" className="btn btn-sm" onClick={() => setAdding(true)}>
              新增规格
            </button>
          }
        >
          还没有规格。
        </Empty>
      ) : (
        <>
          {skus.length > 0 && (
            <div className="sku-head" aria-hidden="true">
              <span>规格名</span>
              <span>价格（元）</span>
              <span>库存（件）</span>
              <span>上下架</span>
              <span>可否下单</span>
              <span />
            </div>
          )}
          {skus.map((sku) => (
            <SkuRow key={sku.id} sku={sku} threshold={threshold} onChanged={onChanged} onDirty={onDirty} />
          ))}
          {adding ? (
            <SkuAdd
              productId={productId}
              onClose={() => setAdding(false)}
              onCreated={() => {
                setAdding(false);
                onChanged();
              }}
            />
          ) : (
            <div>
              <button type="button" className="btn btn-text btn-sm" onClick={() => setAdding(true)}>
                <Plus size={16} strokeWidth={1.75} aria-hidden />
                新增规格
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function skuForm(sku: ProductSku) {
  return { name: sku.variantName, price: (sku.priceCents / 100).toFixed(2), stock: String(sku.stock), status: sku.status, purchasable: sku.purchasable ? "yes" : "no" };
}

/** Number("") 是 0，空串要先挡掉，否则价格会被写成 0 元 */
function parseSku(form: { name: string; price: string; stock: string }) {
  const errors: Record<string, string> = {};
  const name = form.name.trim();
  if (!name) errors.variantName = "规格名不能为空";
  const price = Number(form.price);
  if (form.price.trim() === "" || !Number.isFinite(price) || price <= 0) errors.priceCents = "价格要大于 0";
  const stock = Number(form.stock);
  if (form.stock.trim() === "" || !Number.isInteger(stock) || stock < 0) errors.stock = "库存要是不小于 0 的整数";
  return { errors, name, priceCents: Math.round(price * 100), stock };
}

function SkuRow({ sku, threshold, onChanged, onDirty }: { sku: ProductSku; threshold: number; onChanged: () => void; onDirty: (skuId: string, dirty: boolean) => void }) {
  const { form, dirty, errors, setErrors, set, bind, reset } = useFormState(skuForm(sku));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [removing, setRemoving] = useState(false);
  const hasOrders = sku.orderCount > 0;

  useEffect(() => {
    onDirty(sku.id, dirty);
    return () => onDirty(sku.id, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sku.id, dirty]);

  // 别处改了价格或库存（比如前台下单）后重新拉取：没有在改的行跟着更新
  const serverKey = JSON.stringify(skuForm(sku));
  useEffect(() => {
    if (!dirty) reset(skuForm(sku));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverKey]);

  async function save() {
    const parsed = parseSku(form);
    if (Object.keys(parsed.errors).length > 0) {
      setErrors(parsed.errors);
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const saved = await api.patchSku(sku.id, {
        variantName: parsed.name,
        priceCents: parsed.priceCents,
        stock: parsed.stock,
        status: form.status,
        purchasable: form.purchasable === "yes",
      });
      reset(skuForm({ ...sku, ...saved }));
      toast("规格已保存");
      onChanged();
    } catch (err) {
      setError(applyApiError(err, setErrors, "保存失败"));
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    setRemoving(false);
    try {
      await api.deleteSku(sku.id);
      toast("规格已删除");
      onChanged();
    } catch (err) {
      toast(err instanceof ApiError ? err.message : "删除失败");
    }
  }

  const low = form.status === "on" && form.purchasable === "yes" && Number(form.stock) <= threshold;
  return (
    <div className="sku-row">
      <div className="sku-row__name">
        <input className="input" aria-label="规格名" maxLength={40} {...bind("name")} />
        {errors.variantName && <span className="field__error" role="alert">{errors.variantName}</span>}
      </div>
      <div>
        <input className="input mono" aria-label="价格（元）" inputMode="decimal" {...bind("price")} />
        {errors.priceCents && <span className="field__error" role="alert">{errors.priceCents}</span>}
      </div>
      <div>
        <input className="input mono" aria-label="库存（件）" inputMode="numeric" {...bind("stock")} />
        {errors.stock && <span className="field__error" role="alert">{errors.stock}</span>}
        {low && !errors.stock && (Number(form.stock) === 0 ? <span className="sku-low" data-out="true">售罄</span> : <span className="sku-low">低库存</span>)}
      </div>
      <Segmented
        label="上下架"
        value={form.status}
        onChange={(next) => set("status", next)}
        options={[
          { value: "on", label: "上架" },
          { value: "off", label: "下架" },
        ]}
      />
      <Segmented
        label="可否下单"
        value={form.purchasable}
        onChange={(next) => set("purchasable", next)}
        options={[
          { value: "yes", label: "可下单" },
          { value: "no", label: "不可" },
        ]}
      />
      <div className="sku-row__save">
        {dirty && (
          <button type="button" className="btn btn-filled btn-sm" disabled={busy} onClick={() => void save()}>
            保存
          </button>
        )}
        <button
          type="button"
          className="icon-btn"
          disabled={hasOrders}
          title={hasOrders ? "已有订单，只能下架不能删" : "删除"}
          aria-label={hasOrders ? `${sku.variantName} 已有订单，只能下架不能删` : `删除 ${sku.variantName}`}
          onClick={() => setRemoving(true)}
        >
          <Trash2 size={16} strokeWidth={1.75} />
        </button>
      </div>
      {error && (
        <div className="sku-row__err">
          <ErrorBar message={error} />
        </div>
      )}
      <Confirm open={removing} danger title={`删除规格「${sku.variantName}」？`} desc="购物车里的这个规格也会移除，删除后不可恢复。" confirmText="删除" onCancel={() => setRemoving(false)} onConfirm={() => void remove()} />
    </div>
  );
}

function SkuAdd({ productId, onClose, onCreated }: { productId: string; onClose: () => void; onCreated: () => void }) {
  const { form, errors, setErrors, bind } = useFormState({ name: "", price: "", stock: "0" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    const parsed = parseSku(form);
    if (Object.keys(parsed.errors).length > 0) {
      setErrors(parsed.errors);
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await api.createSku(productId, { variantName: parsed.name, priceCents: parsed.priceCents, stock: parsed.stock, status: "on", purchasable: true });
      toast("规格已添加");
      onCreated();
    } catch (err) {
      setError(applyApiError(err, setErrors, "添加失败"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="sku-add">
      {error && <ErrorBar message={error} />}
      <div className="sku-add__grid">
        <Field label="规格名" error={errors.variantName}>
          <input className="input" maxLength={40} autoFocus {...bind("name")} />
        </Field>
        <Field label="价格（元）" error={errors.priceCents}>
          <input className="input mono" inputMode="decimal" {...bind("price")} />
        </Field>
        <Field label="库存（件）" error={errors.stock}>
          <input className="input mono" inputMode="numeric" {...bind("stock")} />
        </Field>
      </div>
      <div className="filter-bar">
        <button type="button" className="btn btn-filled btn-sm" disabled={busy} onClick={() => void submit()}>
          {busy ? "添加中…" : "添加规格"}
        </button>
        <button type="button" className="btn btn-text btn-sm" onClick={onClose}>
          取消
        </button>
      </div>
    </div>
  );
}

type RecentOrder = Awaited<ReturnType<typeof api.productSales>>["recentOrders"][number];

function SalesPane({ productId }: { productId: string }) {
  const navigate = useNavigate();
  const sales = useAsync(() => api.productSales(productId), [productId]);
  const gate = asyncGate(sales, { skeleton: <Skeleton rows={4} /> });
  if (gate || !sales.data) return <Card title="销售">{gate}</Card>;
  const data = sales.data;
  const ordersUrl = `/admin/orders?productId=${encodeURIComponent(productId)}`;
  const columns: Column<RecentOrder>[] = [
    { key: "order", label: "订单号", width: "minmax(0, 1fr)", mobile: "grow", render: (row) => <span className="mono dl-ellipsis">{row.orderNo}</span> },
    { key: "qty", label: "件数", width: "56px", align: "end", render: (row) => <span className="mono">{row.qty}</span> },
    { key: "amount", label: "金额", width: "96px", align: "end", render: (row) => <span className="mono">{money(row.amountCents)}</span> },
    {
      key: "status",
      label: "状态",
      width: "84px",
      render: (row) => <span className={ORDER_STATUS[row.status]?.tone ?? "pill"}>{ORDER_STATUS[row.status]?.label ?? row.status}</span>,
    },
    { key: "time", label: "下单时间", width: "128px", mobile: "hide", render: (row) => <span className="dl-time">{dateTime(row.createdAt)}</span> },
  ];
  return (
    <>
      <div className="grid12">
        <div className="col-4">
          <Card>
            <Stat label="累计售出" value={data.soldQty} unit="件" />
          </Card>
        </div>
        <div className="col-4">
          <Card>
            <Stat label="销售额" value={money(data.amountCents)} />
          </Card>
        </div>
        <div className="col-4">
          <Card>
            <Stat label="待发货" value={data.pendingShip} unit="单" accent={data.pendingShip > 0} />
          </Card>
        </div>
      </div>
      <Card
        title="最近订单"
        actions={
          <div className="filter-bar">
            {data.pendingShip > 0 && (
              <Link className="btn btn-tonal btn-sm" to={`${ordersUrl}&status=paid`}>
                去发货（{data.pendingShip}）
              </Link>
            )}
            <Link className="btn btn-text btn-sm" to={ordersUrl}>
              全部订单
            </Link>
          </div>
        }
      >
        {data.recentOrders.length === 0 ? (
          <Empty>这件商品还没有订单。</Empty>
        ) : (
          <DataList
            label="最近订单"
            columns={columns}
            rows={data.recentOrders}
            rowKey={(row) => row.orderNo}
            query={{ sort: undefined, order: undefined, update: () => undefined }}
            onRowClick={(row) => navigate(`${ordersUrl}&open=${encodeURIComponent(row.orderNo)}`)}
          />
        )}
      </Card>
    </>
  );
}
