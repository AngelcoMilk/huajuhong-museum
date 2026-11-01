// 商品与库存：按商品（不是规格）列表。搜索、筛选、排序都在后端，写进 URL。
import { useState } from "react";
import { ExternalLink, Image as ImageIcon, Plus, TriangleAlert } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { api, ApiError, type BatchAction, type ProductRow, type ProductStatus } from "../api";
import { BatchBar, DataList, FilterTags, PagedBody, SearchBox, useListQuery, useSelection, type Column } from "../list";
import { Card, Empty, money, toast, useAsync } from "../ui";

export const PRODUCT_CATEGORIES = ["化橘红干果", "化橘红成药", "化橘红制剂", "化橘红饮品", "化橘红食品", "化橘红工艺品"];

const SORTABLE = ["updatedAt", "title", "totalStock", "soldQty", "pendingShip"] as const;
const STATUSES: Array<{ key: ProductStatus; label: string; tone: string }> = [
  { key: "on_sale", label: "在售", tone: "pill pill--ok" },
  { key: "draft", label: "草稿", tone: "pill pill--warn" },
  { key: "off", label: "已下架", tone: "pill" },
  { key: "sold_out", label: "售罄", tone: "pill pill--bad" },
];
const STATUS_KEYS = STATUSES.map((s) => s.key);

export function ProductStatusPill({ status }: { status: ProductStatus }) {
  const meta = STATUSES.find((s) => s.key === status);
  return <span className={meta?.tone ?? "pill"}>{meta?.label ?? status}</span>;
}

function Thumb({ row }: { row: ProductRow }) {
  const [broken, setBroken] = useState(false);
  if (!row.thumbUrl || broken) {
    return (
      <span className="dl-thumb" aria-hidden="true">
        <ImageIcon size={18} strokeWidth={1.5} />
      </span>
    );
  }
  return <img className="dl-thumb" src={row.thumbUrl} alt="" loading="lazy" onError={() => setBroken(true)} />;
}

function priceRange(row: ProductRow): string {
  if (row.priceMinCents === null || row.priceMaxCents === null) return "—";
  if (row.priceMinCents === row.priceMaxCents) return money(row.priceMinCents);
  return `${money(row.priceMinCents)}–${money(row.priceMaxCents)}`;
}

export default function Products() {
  const navigate = useNavigate();
  const query = useListQuery(SORTABLE);
  const status = query.pick("status", STATUS_KEYS);
  const stock = query.pick("stock", ["low", "out"] as const);
  const category = query.pick("category", PRODUCT_CATEGORIES);
  const { q, page, pageSize, sort, order } = query;
  const list = useAsync(() => api.products({ q, status, stock, category, page, pageSize, sort, order }), [q, status, stock, category, page, pageSize, sort, order]);
  const resetKey = [q, status, stock, category, page, pageSize, sort, order].join("|");
  const selection = useSelection(resetKey);
  const [busy, setBusy] = useState(false);
  const threshold = list.data?.lowStockThreshold;

  async function runBatch(action: Extract<BatchAction, "publish" | "archive">) {
    const ids = [...selection.selected];
    const done = action === "publish" ? "已上架" : "已下架";
    setBusy(true);
    try {
      const result = await api.itemsBatch(ids, action);
      if (result.failed.length > 0) {
        selection.set(result.failed.map((f) => f.id));
        toast(`${done} ${result.ok.length} 件，失败 ${result.failed.length} 件：${result.failed[0].message}`);
      } else {
        selection.clear();
        toast(`${done} ${result.ok.length} 件`);
      }
      list.reload();
    } catch (err) {
      toast(err instanceof ApiError ? err.message : "操作失败");
    } finally {
      setBusy(false);
    }
  }

  const tags = [
    status && { key: "status", label: `状态：${STATUSES.find((s) => s.key === status)?.label}`, onClear: () => query.update({ status: null }) },
    stock && { key: "stock", label: stock === "low" ? "低库存" : "库存：已售罄", onClear: () => query.update({ stock: null }) },
    category && { key: "category", label: `分类：${category}`, onClear: () => query.update({ category: null }) },
    q && { key: "q", label: `搜索：${q}`, onClear: () => query.update({ q: null }) },
  ].filter(Boolean) as Array<{ key: string; label: string; onClear: () => void }>;
  const clearAll = () => query.update({ status: null, stock: null, category: null, q: null });

  const columns: Column<ProductRow>[] = [
    {
      key: "title",
      label: "商品",
      width: "minmax(0, 1fr)",
      sortKey: "title",
      mobile: "grow",
      render: (row) => (
        <span className="product-cell">
          <Thumb row={row} />
          <span className="product-cell__text">
            <span className="dl-title dl-ellipsis">{row.title}</span>
            <span className="muted mono dl-ellipsis">{row.id}</span>
          </span>
        </span>
      ),
    },
    { key: "category", label: "分类", width: "104px", mobile: "hide", render: (row) => <span className="muted dl-ellipsis">{row.category}</span> },
    { key: "skus", label: "规格", width: "48px", mobile: "hide", align: "end", render: (row) => <span className="muted mono">{row.skuCount}</span> },
    { key: "price", label: "价格", width: "132px", mobile: "hide", align: "end", render: (row) => <span className="mono dl-ellipsis">{priceRange(row)}</span> },
    {
      key: "stock",
      label: "总库存",
      width: "104px",
      sortKey: "totalStock",
      align: "end",
      render: (row) => (
        <span className="product-stock" title={row.lowStock ? `有规格库存不超过 ${threshold} 件` : undefined}>
          <span className="mono">{row.totalStock}</span>
          {row.lowStock && (
            <span className="low-mark">
              <TriangleAlert size={13} strokeWidth={2} aria-hidden />
              低
            </span>
          )}
        </span>
      ),
    },
    { key: "sold", label: "售出", width: "60px", sortKey: "soldQty", firstOrder: "desc", mobile: "hide", align: "end", render: (row) => <span className="mono">{row.soldQty}</span> },
    {
      key: "pending",
      label: "待发货",
      width: "68px",
      sortKey: "pendingShip",
      firstOrder: "desc",
      mobile: "hide",
      align: "end",
      render: (row) =>
        row.pendingShip > 0 ? (
          <Link className="mono" to={`/admin/orders?productId=${encodeURIComponent(row.id)}&status=paid`} onClick={(e) => e.stopPropagation()}>
            {row.pendingShip}
          </Link>
        ) : (
          <span className="muted mono">0</span>
        ),
    },
    { key: "status", label: "状态", width: "72px", render: (row) => <ProductStatusPill status={row.status} /> },
  ];

  return (
    <>
      <Card
        title="商品"
        actions={
          <Link className="btn btn-filled btn-sm" to="/admin/products/new">
            <Plus size={16} strokeWidth={1.75} aria-hidden />
            新建商品
          </Link>
        }
      >
        <div className="filter-bar">
          <SearchBox value={q} onChange={(next) => query.update({ q: next || null }, { replace: true })} placeholder="搜索商品名称或编号" />
          <div className="chip-group" role="group" aria-label="状态">
            {STATUSES.map((s) => (
              <button key={s.key} type="button" className={status === s.key ? "chip on" : "chip"} aria-pressed={status === s.key} onClick={() => query.update({ status: status === s.key ? null : s.key })}>
                {s.label}
              </button>
            ))}
            <button type="button" className={stock === "low" ? "chip on" : "chip"} aria-pressed={stock === "low"} onClick={() => query.update({ stock: stock === "low" ? null : "low" })}>
              低库存
            </button>
          </div>
          <select className="select product-filter" aria-label="分类" value={category ?? ""} onChange={(e) => query.update({ category: e.target.value || null })}>
            <option value="">全部分类</option>
            {PRODUCT_CATEGORIES.map((one) => (
              <option key={one} value={one}>
                {one}
              </option>
            ))}
          </select>
          {threshold !== undefined && <ThresholdEditor key={threshold} value={threshold} onSaved={list.reload} />}
        </div>
        <FilterTags tags={tags} onClearAll={clearAll} />

        <PagedBody
          state={{ ...list, mutate: () => undefined }}
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
                没有符合条件的商品。
              </Empty>
            ) : (
              <Empty
                action={
                  <Link className="btn btn-sm" to="/admin/products/new">
                    新建商品
                  </Link>
                }
              >
                还没有商品。
              </Empty>
            )
          }
        >
          {(items) => (
            <DataList
              label="商品"
              columns={columns}
              rows={items}
              rowKey={(row) => row.id}
              query={query}
              selection={selection}
              actionsWidth="44px"
              onRowClick={(row) => navigate(`/admin/products/${encodeURIComponent(row.id)}`)}
              actions={(row) =>
                row.status === "draft" ? null : (
                  <a className="icon-btn" href={`/products/${encodeURIComponent(row.id)}`} target="_blank" rel="noopener noreferrer" title="在前台查看" aria-label={`在前台查看 ${row.title}`} onClick={(e) => e.stopPropagation()}>
                    <ExternalLink size={18} strokeWidth={1.75} />
                  </a>
                )
              }
            />
          )}
        </PagedBody>
      </Card>
      <BatchBar
        count={selection.selected.size}
        busy={busy}
        onClear={selection.clear}
        actions={[
          { key: "publish", label: "批量上架", onClick: () => void runBatch("publish") },
          { key: "archive", label: "批量下架", onClick: () => void runBatch("archive") },
        ]}
      />
    </>
  );
}

/** 低库存线只在这里改：短配置，就地编辑 */
function ThresholdEditor({ value, onSaved }: { value: number; onSaved: () => void }) {
  const [draft, setDraft] = useState(String(value));
  const [busy, setBusy] = useState(false);
  const changed = draft !== String(value);

  async function save() {
    const next = Number(draft);
    if (draft.trim() === "" || !Number.isInteger(next) || next < 0 || next > 9999) {
      toast("低库存线要是 0–9999 的整数");
      return;
    }
    setBusy(true);
    try {
      await api.saveSettings({ "shop.lowStockThreshold": String(next) });
      toast("低库存线已保存");
      onSaved();
    } catch (err) {
      toast(err instanceof ApiError ? err.message : "保存失败");
    } finally {
      setBusy(false);
    }
  }

  return (
    <label className="threshold">
      低库存线 ≤
      <input
        className="input mono"
        inputMode="numeric"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && changed) void save();
        }}
      />
      件
      {changed && (
        <button type="button" className="btn btn-sm btn-tonal" disabled={busy} onClick={() => void save()}>
          保存
        </button>
      )}
    </label>
  );
}
