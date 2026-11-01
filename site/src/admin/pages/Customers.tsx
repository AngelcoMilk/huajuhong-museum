// 客户（购物账号）：查询、档案、地址簿与订单。
import { useState } from "react";
import { Link } from "react-router";
import { MapPin, Plus, Trash2 } from "lucide-react";
import { api, ApiError } from "../api";
import { DataList, FilterTags, PagedBody, SearchBox, useListQuery, type Column } from "../list";
import { applyApiError, Card, Confirm, dateTime, Drawer, Empty, ErrorBar, Field, money, Skeleton, toast, useAsync, useFormState } from "../ui";

const ORDER_STATUS: Record<string, string> = {
  pending_payment: "待付款",
  paid: "待发货",
  shipped: "已发货",
  completed: "已完成",
  cancelled: "已取消",
};
const SORTABLE = ["createdAt"] as const;

type CustomerRow = Awaited<ReturnType<typeof api.customers>>["items"][number];

export default function Customers() {
  const query = useListQuery(SORTABLE);
  const { q, page, pageSize, sort, order } = query;
  const list = useAsync(() => api.customers({ q, page, pageSize, sort, order }), [q, page, pageSize, sort, order]);
  const [openId, setOpenId] = useState<string | null>(null);

  const tags = q ? [{ key: "q", label: `搜索：${q}`, onClear: () => query.update({ q: null }) }] : [];

  const columns: Column<CustomerRow>[] = [
    {
      key: "name",
      label: "称呼 / 手机号",
      width: "minmax(0, 1fr)",
      mobile: "grow",
      render: (row) => (
        <>
          <span className="dl-title dl-ellipsis">{row.name}</span>
          <span className="muted mono dl-ellipsis">{row.phone}</span>
        </>
      ),
    },
    { key: "orders", label: "订单", width: "56px", align: "end", render: (row) => <span className="mono">{row.orders}</span> },
    { key: "paid", label: "累计消费", width: "104px", align: "end", render: (row) => <span className="mono">{money(row.paidAmountCents)}</span> },
    { key: "last", label: "最近下单", width: "128px", mobile: "hide", render: (row) => <span className="dl-time">{row.lastOrderAt ? dateTime(row.lastOrderAt) : "—"}</span> },
    { key: "created", label: "注册时间", width: "128px", sortKey: "createdAt", firstOrder: "desc", mobile: "hide", render: (row) => <span className="dl-time">{dateTime(row.createdAt)}</span> },
  ];

  return (
    <>
      <Card title="客户列表">
        <div className="filter-bar">
          <SearchBox value={q} onChange={(next) => query.update({ q: next || null }, { replace: true })} placeholder="搜索姓名、手机号或地址" />
        </div>
        <FilterTags tags={tags} onClearAll={() => query.update({ q: null })} />
        <PagedBody
          state={list}
          query={query}
          empty={
            q ? (
              <Empty
                action={
                  <button type="button" className="btn btn-sm" onClick={() => query.update({ q: null })}>
                    清除筛选
                  </button>
                }
              >
                没有查到客户，换个手机号或姓名试试。
              </Empty>
            ) : (
              <Empty>还没有客户。前台注册购物账号后会出现在这里。</Empty>
            )
          }
        >
          {(items) => <DataList label="客户" columns={columns} rows={items} rowKey={(row) => row.id} query={query} onRowClick={(row) => setOpenId(row.id)} />}
        </PagedBody>
      </Card>

      {openId && <CustomerDetail key={openId} id={openId} onClose={() => setOpenId(null)} onChanged={list.reload} />}
    </>
  );
}

function CustomerDetail({ id, onClose, onChanged }: { id: string; onClose: () => void; onChanged: () => void }) {
  const detail = useAsync(() => api.customer(id), [id]);
  const customer = detail.data;
  if (!customer) {
    return (
      <Drawer title="客户" onClose={onClose}>
        {detail.error ? <ErrorBar message={detail.error} onRetry={detail.reload} /> : <Skeleton rows={6} />}
      </Drawer>
    );
  }
  return <CustomerForm key={`${customer.name}|${customer.remark}`} id={id} customer={customer} reload={detail.reload} onClose={onClose} onChanged={onChanged} />;
}

function CustomerForm({
  id,
  customer,
  reload,
  onClose,
  onChanged,
}: {
  id: string;
  customer: Awaited<ReturnType<typeof api.customer>>;
  reload: () => void;
  onClose: () => void;
  onChanged: () => void;
}) {
  const { form, dirty, errors, setErrors, bind } = useFormState({ name: customer.name, remark: customer.remark ?? "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addingAddress, setAddingAddress] = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);

  async function save() {
    if (!form.name.trim()) {
      setErrors({ name: "称呼不能为空" });
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await api.patchCustomer(id, { name: form.name.trim(), remark: form.remark });
      toast("已保存");
      onChanged();
      onClose();
    } catch (err) {
      setError(applyApiError(err, setErrors, "保存失败"));
    } finally {
      setBusy(false);
    }
  }

  async function removeAddress() {
    if (!removing) return;
    try {
      await api.deleteCustomerAddress(id, removing);
      toast("地址已删除");
      reload();
      onChanged();
    } catch (err) {
      toast(err instanceof ApiError ? err.message : "删除失败");
    } finally {
      setRemoving(null);
    }
  }

  return (
    <>
      <Drawer title={customer.name} status={<span className="muted mono">{customer.phone}</span>} onClose={onClose} onSave={save} saving={busy} dirty={dirty}>
        {error && <ErrorBar message={error} />}
        <div className="form-grid">
          <Field label="称呼" error={errors.name}>
            <input className="input" {...bind("name")} />
          </Field>
          <Field label="注册时间">
            <input className="input mono" value={dateTime(customer.createdAt)} readOnly />
          </Field>
        </div>
        <Field label="客服备注" error={errors.remark}>
          <textarea className="textarea" rows={3} {...bind("remark")} />
        </Field>

        <section className="section">
          <div className="section__head">
            <h3>地址簿（{customer.addresses.length}）</h3>
            <button type="button" className="btn btn-text btn-sm" onClick={() => setAddingAddress(true)}>
              <Plus size={16} strokeWidth={1.75} aria-hidden />
              新增地址
            </button>
          </div>
          {customer.addresses.length === 0 ? (
            <Empty compact icon={<MapPin size={22} strokeWidth={1.75} />}>
              还没有保存的地址。
            </Empty>
          ) : (
            <div className="mini-list">
              {customer.addresses.map((address: any) => (
                <div className="kv" key={address.id}>
                  <span className="kv__main">
                    <span>
                      {address.name} · <span className="mono">{address.phone}</span>
                      {address.isDefault ? <span className="pill pill--tint kv__tag">默认</span> : null}
                    </span>
                    <span className="muted">
                      {address.province}
                      {address.city}
                      {address.district}
                      {address.detail}
                    </span>
                  </span>
                  <button type="button" className="icon-btn" title="删除地址" aria-label={`删除地址 ${address.detail}`} onClick={() => setRemoving(address.id)}>
                    <Trash2 size={18} strokeWidth={1.75} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="section">
          <div className="section__head">
            <h3>订单（{customer.orders.length}）</h3>
            {customer.orders.length > 0 && (
              <Link className="btn btn-text btn-sm" to={`/admin/orders?q=${encodeURIComponent(customer.phone)}`}>
                在订单页查看
              </Link>
            )}
          </div>
          {customer.orders.length === 0 ? (
            <Empty compact>这位客户还没有订单。</Empty>
          ) : (
            <div className="mini-list">
              {customer.orders.map((order) => (
                <Link className="kv kv--link" key={order.orderNo} to={`/admin/orders?q=${encodeURIComponent(order.orderNo)}`}>
                  <span className="kv__main">
                    <span className="mono dl-ellipsis">{order.orderNo}</span>
                    <span className="muted">
                      {ORDER_STATUS[order.status] ?? order.status} · {order.itemCount} 件 · {dateTime(order.createdAt)}
                    </span>
                  </span>
                  <span className="mono">{money(order.totalCents)}</span>
                </Link>
              ))}
            </div>
          )}
        </section>
      </Drawer>

      {addingAddress && (
        <NewAddress
          id={id}
          onClose={() => setAddingAddress(false)}
          onSaved={() => {
            reload();
            onChanged();
          }}
        />
      )}

      <Confirm
        open={Boolean(removing)}
        title="删除这个地址？"
        desc="删除后不能恢复，已下的订单不受影响。"
        confirmText="删除"
        danger
        onConfirm={() => void removeAddress()}
        onCancel={() => setRemoving(null)}
      />
    </>
  );
}

function NewAddress({ id, onClose, onSaved }: { id: string; onClose: () => void; onSaved: () => void }) {
  const { form, dirty, errors, setErrors, bind } = useFormState({ name: "", phone: "", province: "广东省", city: "茂名市", district: "化州市", detail: "", postcode: "", tag: "家" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setBusy(true);
    setError(null);
    try {
      await api.addCustomerAddress(id, form);
      toast("地址已添加");
      onSaved();
      onClose();
    } catch (err) {
      setError(applyApiError(err, setErrors, "保存失败"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Drawer variant="dialog" title="新增地址" onClose={onClose} onSave={save} saving={busy} dirty={dirty}>
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
    </Drawer>
  );
}
