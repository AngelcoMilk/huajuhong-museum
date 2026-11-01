// 企业名录：档案与地图点位合一。左列表、右地图，点地图就能给选中的企业定位。
// 库里存 WGS-84；行政区划是 GCJ-02（来自高德）。这里不加载在线瓦片，断网也能用：
// 画点时 WGS→GCJ，点地图取坐标时 GCJ→WGS，和前台地图的换算方向一致。
import { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import type { GeoJsonObject } from "geojson";
import { CircleArrowDown, CircleArrowUp, Crosshair, Download, ExternalLink, MapPin, MapPinOff, Pencil, Plus } from "lucide-react";
import "leaflet/dist/leaflet.css";
import boundaryRaw from "../../data/map/huazhou.geo.json";
import townsRaw from "../../data/map/towns.json";
import { wgs84ToGcj02 } from "../../lib/gcj02";
import { api, ApiError, type EnterpriseRow } from "../api";
import { BatchBar, batchActions, DataList, FilterTags, ITEM_STATUSES as STATUSES, PagedBody, SearchBox, StatusPill, useBatch, useListQuery, useSelection, type Column } from "../list";
import { Advanced, applyApiError, Card, Drawer, Empty, ErrorBar, Field, toast, useAsync, useFormState } from "../ui";

const STATUS_KEYS = STATUSES.map((s) => s.key);
const PLACED = [
  { key: "yes", label: "已定位" },
  { key: "no", label: "未定位" },
] as const;
const PLACED_KEYS = PLACED.map((p) => p.key);
const SORTABLE = ["id", "title"] as const;

const TOWNS = (townsRaw as { towns: Array<{ name: string; lng: number; lat: number }> }).towns;

/** GCJ-02 → WGS-84：正向换算没有解析逆，迭代两轮到亚米级 */
function gcj02ToWgs84(lng: number, lat: number): [number, number] {
  let wgsLng = lng;
  let wgsLat = lat;
  for (let i = 0; i < 3; i += 1) {
    const [gcjLng, gcjLat] = wgs84ToGcj02(wgsLng, wgsLat);
    wgsLng += lng - gcjLng;
    wgsLat += lat - gcjLat;
  }
  return [Number(wgsLng.toFixed(6)), Number(wgsLat.toFixed(6))];
}

function placed(row: EnterpriseRow): row is EnterpriseRow & { lng: number; lat: number } {
  return row.lng !== null && row.lat !== null;
}

export default function Enterprises() {
  const query = useListQuery(SORTABLE);
  const status = query.pick("status", STATUS_KEYS);
  const placedFilter = query.pick("placed", PLACED_KEYS);
  const { q, page, pageSize, sort, order } = query;

  const list = useAsync(
    () => api.enterprises({ q, placed: placedFilter, status, page, pageSize, sort, order }),
    [q, placedFilter, status, page, pageSize, sort, order],
  );
  // 地图要显示全部点位，不受分页和筛选影响；定位成功后两份数据都刷新
  const points = useAsync(() => api.enterprises({ pageSize: 100 }), []);
  const rows = list.data?.items ?? [];
  const selection = useSelection([q, placedFilter, status, page, pageSize, sort, order].join("|"));
  const { busy, run } = useBatch<EnterpriseRow>(api.itemsBatch, {
    mutate: list.mutate,
    reload: () => {
      list.reload();
      points.reload();
    },
  }, selection);
  const selectedRows = rows.filter((row) => selection.selected.has(row.id));

  const [focusId, setFocusId] = useState<string | null>(null);
  const [editing, setEditing] = useState<EnterpriseRow | null>(null);
  const [creating, setCreating] = useState(false);

  const focused = useMemo(
    () => rows.find((row) => row.id === focusId) ?? points.data?.items.find((row) => row.id === focusId) ?? null,
    [rows, points.data, focusId],
  );

  function reloadAll() {
    list.reload();
    points.reload();
  }

  async function setCoord(row: EnterpriseRow, coord: string | null, message: string) {
    const before = placed(row) ? `${row.lng},${row.lat}` : null;
    try {
      await api.patchEnterprise(row.id, { coord });
      reloadAll();
      toast(message, {
        action: {
          label: "撤销",
          run: () =>
            void api
              .patchEnterprise(row.id, { coord: before })
              .then(() => {
                toast("已撤销");
                reloadAll();
              })
              .catch((err) => toast(err instanceof ApiError ? `撤销失败：${err.message}` : "撤销失败")),
        },
      });
    } catch (err) {
      toast(err instanceof ApiError ? err.message : "定位失败");
    }
  }

  async function exportPoints() {
    try {
      const data = await api.exportEnterprisePoints();
      const blob = new Blob([JSON.stringify(data.points, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "enterprise-points.json";
      a.click();
      URL.revokeObjectURL(url);
      toast(`已导出 ${data.count} 个点位`);
    } catch (err) {
      toast(err instanceof ApiError ? err.message : "导出失败");
    }
  }

  const tags = [
    placedFilter && { key: "placed", label: `定位：${PLACED.find((p) => p.key === placedFilter)?.label}`, onClear: () => query.update({ placed: null }) },
    status && { key: "status", label: `状态：${STATUSES.find((s) => s.key === status)?.label}`, onClear: () => query.update({ status: null }) },
    q && { key: "q", label: `搜索：${q}`, onClear: () => query.update({ q: null }) },
  ].filter(Boolean) as Array<{ key: string; label: string; onClear: () => void }>;
  const clearAll = () => query.update({ placed: null, status: null, q: null });

  const columns: Column<EnterpriseRow>[] = [
    {
      key: "title",
      label: "企业 / 编号",
      width: "minmax(0, 1fr)",
      sortKey: "title",
      mobile: "grow",
      render: (row) => (
        <>
          <span className="dl-title dl-wrap">{row.title}</span>
          <span className="muted mono dl-ellipsis">{row.id}</span>
        </>
      ),
    },
    { key: "town", label: "镇街", width: "72px", mobile: "hide", render: (row) => <span className="muted dl-ellipsis">{row.town || "—"}</span> },
    {
      key: "placed",
      label: "定位",
      width: "84px",
      render: (row) => (placed(row) ? <span className="pill pill--ok">已定位</span> : <span className="pill pill--warn">未定位</span>),
    },
    { key: "status", label: "状态", width: "84px", render: (row) => <StatusPill status={row.status} /> },
  ];

  return (
    <>

      <div className="split">
        <Card
          className="split__list"
          title="企业列表"
          actions={
            <>
              <button type="button" className="btn btn-outline btn-sm" onClick={() => void exportPoints()}>
                <Download size={16} strokeWidth={1.75} aria-hidden />
                导出点位
              </button>
              <button type="button" className="btn btn-filled btn-sm" onClick={() => setCreating(true)}>
                <Plus size={16} strokeWidth={1.75} aria-hidden />
                新建企业
              </button>
            </>
          }
        >
          <div className="filter-bar">
            <SearchBox value={q} onChange={(next) => query.update({ q: next || null }, { replace: true })} placeholder="搜索企业名称或编号" />
            <div className="chip-group" role="group" aria-label="定位">
              {PLACED.map((p) => (
                <button key={p.key} type="button" className={placedFilter === p.key ? "chip on" : "chip"} onClick={() => query.update({ placed: placedFilter === p.key ? null : p.key })}>
                  {p.label}
                </button>
              ))}
            </div>
            <div className="chip-group" role="group" aria-label="状态">
              {STATUSES.map((s) => (
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
                  没有符合条件的企业。
                </Empty>
              ) : (
                <Empty
                  action={
                    <button type="button" className="btn btn-filled btn-sm" onClick={() => setCreating(true)}>
                      新建企业
                    </button>
                  }
                >
                  还没有企业，新建第一家吧。
                </Empty>
              )
            }
          >
            {(items) => (
              <DataList
                label="企业"
                columns={columns}
                rows={items}
                rowKey={(row) => row.id}
                query={query}
                selection={selection}
                activeKey={focusId}
                onRowClick={(row) => setFocusId(row.id)}
                actionsWidth="96px"
                actions={(row) => {
                  const live = row.status === "published";
                  return (
                    <>
                      <button
                        type="button"
                        className="icon-btn"
                        title={live ? "下架" : "发布"}
                        aria-label={`${live ? "下架" : "发布"} ${row.title}`}
                        disabled={busy}
                        onClick={() => void run([row], live ? "unpublish" : "publish")}
                      >
                        {live ? <CircleArrowDown size={18} strokeWidth={1.75} /> : <CircleArrowUp size={18} strokeWidth={1.75} />}
                      </button>
                      <button type="button" className="icon-btn" title="编辑" aria-label={`编辑 ${row.title}`} onClick={() => setEditing(row)}>
                        <Pencil size={18} strokeWidth={1.75} />
                      </button>
                      <a className="icon-btn" href="/enterprises" target="_blank" rel="noopener noreferrer" title="在前台查看" aria-label={`在前台查看 ${row.title}`}>
                        <ExternalLink size={18} strokeWidth={1.75} />
                      </a>
                    </>
                  );
                }}
              />
            )}
          </PagedBody>
        </Card>

        <div className="split__map">
          <Card flush className="map-card">
            <EnterpriseMap
              points={points.data?.items ?? []}
              focusId={focusId}
              onFocus={setFocusId}
              onPlace={focused ? (coord) => void setCoord(focused, coord, placed(focused) ? "已更新定位" : "已定位") : undefined}
            />
            <div className="map-foot">
              {focused ? (
                <>
                  <span className="map-foot__title dl-ellipsis">
                    <Crosshair size={16} strokeWidth={1.75} aria-hidden />
                    {focused.title}
                  </span>
                  <span className="muted mono">{placed(focused) ? `${focused.lng.toFixed(5)}, ${focused.lat.toFixed(5)}` : "点地图给它定位"}</span>
                  {placed(focused) && (
                    <button type="button" className="btn btn-text btn-sm" onClick={() => void setCoord(focused, null, "已清除定位")}>
                      <MapPinOff size={16} strokeWidth={1.75} aria-hidden />
                      清除
                    </button>
                  )}
                  <button type="button" className="btn btn-text btn-sm" onClick={() => setEditing(focused)}>
                    编辑档案
                  </button>
                </>
              ) : (
                <span className="muted">
                  <MapPin size={16} strokeWidth={1.75} aria-hidden />
                  点列表里的企业或地图上的点，选中后点地图即可定位
                </span>
              )}
            </div>
          </Card>
        </div>
      </div>

      <BatchBar count={selectedRows.length} busy={busy} onClear={selection.clear} actions={batchActions(selectedRows, (targets, action) => void run(targets, action))} />

      {editing && (
        <EnterpriseEditor
          key={editing.id}
          row={editing}
          onClose={() => setEditing(null)}
          onSaved={reloadAll}
        />
      )}
      {creating && (
        <EnterpriseEditor
          row={null}
          onClose={() => setCreating(false)}
          onSaved={reloadAll}
        />
      )}
    </>
  );
}

function EnterpriseMap({
  points,
  focusId,
  onFocus,
  onPlace,
}: {
  points: EnterpriseRow[];
  focusId: string | null;
  onFocus: (id: string) => void;
  onPlace?: (coord: string) => void;
}) {
  const host = useRef<HTMLDivElement | null>(null);
  const map = useRef<L.Map | null>(null);
  const layer = useRef<L.LayerGroup | null>(null);
  const latest = useRef({ onFocus, onPlace });
  latest.current = { onFocus, onPlace };
  const prevFocus = useRef<string | null>(null);
  const moved = useRef(false);

  useEffect(() => {
    if (!host.current) return;
    const instance = L.map(host.current, { attributionControl: false, zoomSnap: 0.1, minZoom: 8, maxZoom: 16 });
    const boundary = L.geoJSON(boundaryRaw as unknown as GeoJsonObject, {
      interactive: false,
      style: { color: "var(--primary)", weight: 1.5, fillColor: "var(--primary)", fillOpacity: 0.06 },
    }).addTo(instance);
    let fitting = false;
    const fit = () => {
      fitting = true;
      instance.fitBounds(boundary.getBounds(), { padding: [12, 12], animate: false });
      fitting = false;
    };
    fit();
    instance.on("dragstart zoomstart", () => {
      if (!fitting) moved.current = true;
    });
    for (const town of TOWNS) {
      L.marker([town.lat, town.lng], {
        interactive: false,
        keyboard: false,
        icon: L.divIcon({ className: town.name.endsWith("街道") ? "map-town map-town--street" : "map-town", html: town.name, iconSize: [64, 16], iconAnchor: [32, 8] }),
      }).addTo(instance);
    }
    layer.current = L.layerGroup().addTo(instance);
    const syncZoom = () => {
      if (instance.getZoom() < 10.5) host.current?.setAttribute("data-far", "");
      else host.current?.removeAttribute("data-far");
    };
    instance.on("zoomend", syncZoom);
    syncZoom();
    instance.on("click", (event: L.LeafletMouseEvent) => {
      const place = latest.current.onPlace;
      if (!place) return;
      const [lng, lat] = gcj02ToWgs84(event.latlng.lng, event.latlng.lat);
      place(`${lng},${lat}`);
    });
    const observer = new ResizeObserver(() => {
      instance.invalidateSize({ animate: false });
      if (!moved.current) fit();
    });
    observer.observe(host.current);
    map.current = instance;
    return () => {
      observer.disconnect();
      instance.remove();
      map.current = null;
      layer.current = null;
    };
  }, []);

  useEffect(() => {
    const group = layer.current;
    if (!group) return;
    group.clearLayers();
    let focusLatLng: L.LatLngExpression | null = null;
    for (const row of points) {
      if (!placed(row)) continue;
      const [lng, lat] = wgs84ToGcj02(row.lng, row.lat);
      const active = row.id === focusId;
      if (active) focusLatLng = [lat, lng];
      L.circleMarker([lat, lng], {
        radius: active ? 8 : 5,
        color: "var(--surface)",
        weight: active ? 2.5 : 1.5,
        fillColor: active ? "var(--primary)" : "var(--chart-2)",
        fillOpacity: active ? 1 : 0.82,
        bubblingMouseEvents: false,
      })
        .bindTooltip(row.title, { direction: "top", offset: [0, -6], className: "map-tip" })
        .on("click", () => latest.current.onFocus(row.id))
        .addTo(group);
    }
    // 只在选中项变化时移动视野，保存后刷新点位不要抢走用户拖好的位置
    if (focusLatLng && prevFocus.current !== focusId) {
      moved.current = true;
      map.current?.panTo(focusLatLng);
    }
    prevFocus.current = focusId;
  }, [points, focusId]);

  return <div className="map-host" ref={host} data-placing={onPlace ? "true" : undefined} role="application" aria-label="化州企业点位地图" />;
}

function EnterpriseEditor({ row, onClose, onSaved }: { row: EnterpriseRow | null; onClose: () => void; onSaved: () => void }) {
  const { form, dirty, errors, setErrors, bind } = useFormState({
    title: row?.title ?? "",
    town: row?.town ?? "",
    address: row?.address ?? "",
    tel: row?.tel ?? "",
    email: row?.email ?? "",
    site: row?.site ?? "",
    coord: row && placed(row) ? `${row.lng},${row.lat}` : "",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    if (!form.title.trim()) {
      setErrors({ title: "企业名称不能为空" });
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const coord = form.coord.trim();
      if (row) {
        await api.patchEnterprise(row.id, {
          title: form.title.trim(),
          town: form.town,
          address: form.address,
          tel: form.tel,
          email: form.email,
          site: form.site,
          coord: coord || null,
        });
        toast("已保存");
      } else {
        const created = await api.createEnterprise({ ...form, title: form.title.trim(), coord: coord || undefined });
        toast(created.coord ? `已创建 ${created.id}，坐标已定位` : `已创建 ${created.id}，还没有定位`);
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(applyApiError(err, setErrors, row ? "保存失败" : "创建失败"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Drawer
      title={row ? row.title : "新建企业"}
      status={row ? <StatusPill status={row.status} /> : undefined}
      onClose={onClose}
      onSave={save}
      saving={busy}
      saveText={row ? "保存" : "创建"}
      dirty={dirty}
    >
      {error && <ErrorBar message={error} />}
      <Field label="企业名称" error={errors.title}>
        <input className="input" {...bind("title")} />
      </Field>
      <div className="form-grid">
        <Field label="镇街" error={errors.town}>
          <input className="input" {...bind("town")} />
        </Field>
        <Field label="电话" error={errors.tel}>
          <input className="input" {...bind("tel")} />
        </Field>
      </div>
      <Field label="地址" error={errors.address}>
        <input className="input" {...bind("address")} />
      </Field>
      <Field label="坐标" hint="经度在前；也可以留空，回列表点地图定位" error={errors.coord}>
        <input className="input mono" {...bind("coord")} placeholder="110.634471,21.664117" inputMode="decimal" />
      </Field>
      <Advanced open={Boolean(errors.email || errors.site)}>
        <div className="form-grid">
          <Field label="邮箱" error={errors.email}>
            <input className="input" {...bind("email")} />
          </Field>
          <Field label="官网" error={errors.site}>
            <input className="input" {...bind("site")} />
          </Field>
        </div>
      </Advanced>
    </Drawer>
  );
}
