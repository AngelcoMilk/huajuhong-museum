// 操作日志：后台写操作的留痕，只读。
import { api } from "../api";
import { DataList, FilterTags, PagedBody, SearchBox, useListQuery, type Column } from "../list";
import { Card, dateTime, Empty, useAsync } from "../ui";

const ACTION_LABEL: Record<string, string> = {
  "admin.login": "登录",
  "admin.login.failed": "登录失败",
  "admin.password": "修改密码",
  "admin.logout": "退出登录",
  "item.create": "新建内容",
  "item.archive": "归档内容",
  "item.publish": "发布状态",
  "item.update": "修改内容",
  "item.draft": "保存草稿",
  "item.draft.discard": "丢弃草稿",
  "item.delete": "删除内容",
  "item.reorder": "调整内容顺序",
  "page.update": "修改页面头",
  "history.section.order": "调整史料分类顺序",
  "history.section.rename": "史料分类改名",
  "item.batch.set-section": "批量改分类",
  "items.batch": "批量操作内容",
  "media.add": "添加媒体",
  "media.remove": "移除媒体",
  "upload.create": "上传文件",
  "config.publish": "发布配置",
  "config.rollback": "回滚配置",
  "config.try": "测试场试聊",
  "provider.create": "新增供应商",
  "provider.update": "修改供应商",
  "provider.delete": "删除供应商",
  "provider.import": "导入供应商",
  "settings.update": "修改设置",
  "enterprise.create": "新建企业",
  "enterprise.update": "修改企业",
  "enterprise.coord": "修改坐标",
  "vr.batch": "批量操作 VR",
  "vr.create": "新建 VR 场景",
  "vr.update": "修改 VR 场景",
  "vr.delete": "删除 VR 场景",
  "vr.reorder": "调整 VR 布局",
  "vrgroup.create": "新建 VR 分组",
  "vrgroup.update": "修改 VR 分组",
  "vrgroup.delete": "删除 VR 分组",
  "order.ship": "订单发货",
  "order.unship": "撤回发货",
  "order.complete": "订单完成",
  "order.address": "修改收货地址",
  "order.remark": "修改订单备注",
  "product.create": "新建商品",
  "product.update": "修改商品",
  "product.publish": "上架商品",
  "product.unpublish": "下架商品",
  "product.cover": "设置封面",
  "sku.create": "新增规格",
  "sku.update": "修改规格",
  "sku.delete": "删除规格",
  "account.create": "新建账号",
  "account.role": "修改角色",
  "account.disable": "停用账号",
  "account.enable": "启用账号",
  "account.reset_password": "重置密码",
  "account.delete": "删除账号",
  "customer.update": "修改客户",
  "customer.address.add": "新增客户地址",
  "customer.address.remove": "删除客户地址",
  "kb.slice.create": "新建切片",
  "kb.slice.update": "修改切片",
  "kb.slice.delete": "删除切片",
  "analytics.aggregate": "汇总统计",
};
const ACTIONS = Object.keys(ACTION_LABEL);
const SORTABLE = ["createdAt"] as const;

type AuditRow = Awaited<ReturnType<typeof api.audit>>["items"][number];

export default function Audit() {
  const query = useListQuery(SORTABLE);
  const action = query.pick("action", ACTIONS);
  const { q, page, pageSize, sort, order } = query;
  const list = useAsync(() => api.audit({ action, q, page, pageSize, sort, order }), [action, q, page, pageSize, sort, order]);

  const tags = [
    action && { key: "action", label: `动作：${ACTION_LABEL[action]}`, onClear: () => query.update({ action: null }) },
    q && { key: "q", label: `搜索：${q}`, onClear: () => query.update({ q: null }) },
  ].filter(Boolean) as Array<{ key: string; label: string; onClear: () => void }>;
  const clearAll = () => query.update({ action: null, q: null });

  const columns: Column<AuditRow>[] = [
    { key: "action", label: "动作", width: "128px", mobile: "grow", render: (row) => <span className="dl-title dl-ellipsis">{ACTION_LABEL[row.action] ?? row.action}</span> },
    { key: "target", label: "对象", width: "minmax(0, 200px)", render: (row) => <span className="mono dl-ellipsis">{row.target || "—"}</span> },
    { key: "actor", label: "操作人", width: "96px", mobile: "hide", render: (row) => <span className="muted dl-ellipsis">{row.actor}</span> },
    {
      key: "detail",
      label: "详情",
      width: "minmax(0, 1fr)",
      mobile: "hide",
      render: (row) => {
        const text = row.detail ? JSON.stringify(row.detail) : "";
        return (
          <span className="muted mono dl-ellipsis" title={text}>
            {text || "—"}
          </span>
        );
      },
    },
    { key: "time", label: "时间", width: "128px", sortKey: "createdAt", firstOrder: "desc", render: (row) => <span className="dl-time">{dateTime(row.createdAt)}</span> },
  ];

  return (
    <Card title="操作日志">
      <div className="filter-bar">
        <SearchBox value={q} onChange={(next) => query.update({ q: next || null }, { replace: true })} placeholder="搜索对象或操作人" />
        <select className="select select--auto" aria-label="按动作筛选" value={action ?? ""} onChange={(e) => query.update({ action: e.target.value || null })}>
          <option value="">全部动作</option>
          {ACTIONS.map((key) => (
            <option key={key} value={key}>
              {ACTION_LABEL[key]}
            </option>
          ))}
        </select>
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
              没有符合条件的记录。
            </Empty>
          ) : (
            <Empty>还没有操作记录。</Empty>
          )
        }
      >
        {(items) => <DataList label="操作日志" columns={columns} rows={items} rowKey={(row) => row.id} query={query} />}
      </PagedBody>
    </Card>
  );
}
