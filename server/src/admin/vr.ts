// VR 全景后台：场景 CRUD、分组（VrGroup）、页面布局与拖拽排序、地址就地体检。
// 公开只读接口在 public.ts（GET /api/content/vr、/vr-scenes）。
import { prisma } from "../db.ts";
import { audit } from "./audit.ts";
import { multi, paging, sortSpec, sortToOrderBy } from "./lists.ts";

// status 只允许这三个值；公开接口只放行 published
const VR_STATUSES = ["draft", "published", "archived"] as const;
type VrStatus = (typeof VR_STATUSES)[number];

// 编号形如 VR-001
const VR_ID_PATTERN = /^[A-Z]{2}-[A-Z0-9]+$/;

// 排序白名单：列表按 sort、id 排
const VR_SORTS = ["id", "title", "sort"] as const;

const VR_GROUP_LAYOUTS = ["grid", "feature"] as const;
const VR_PAGES = ["park", "museum"] as const;

/** 分组页 → 旧的 group 列取值（场景表保留 group 列，作为分组的镜像） */
const PAGE_LABEL: Record<string, string> = { park: "园区", museum: "博物馆" };

function fail(c: any, status: 400 | 404 | 409, code: string, message: string, field?: string) {
  return c.json({ error: { code, message, ...(field ? { field } : {}) } }, status);
}

function actorOf(c: any): string {
  return c.get("admin")?.username ?? "unknown";
}

function isVrStatus(value: unknown): value is VrStatus {
  return typeof value === "string" && (VR_STATUSES as readonly string[]).includes(value);
}

function isPage(value: unknown): value is string {
  return typeof value === "string" && (VR_PAGES as readonly string[]).includes(value);
}

/** 标量文本：只认字符串与数字/布尔；对象、数组一律当空（否则会写出 "[object Object]"） */
function textOf(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return "";
}

/** 可选文本字段：空串和缺省都落成 null，避免库里出现空引号。 */
function optionalText(value: unknown): string | null {
  if (value === undefined || value === null) return null;
  const text = textOf(value);
  return text ? text : null;
}

/** 缩略图：站内 / 开头，或 https；其余（含 http）不通过 */
function thumbOk(value: string): boolean {
  // 和 blocks.ts 的 isSafeSrc 同一套底线：空白、控制字符、反斜杠一律不收
  // （浏览器会把 `\` 当 `/`，`/\evil.com/x.png` 实际会变成 `//evil.com/x.png`）
  if (/[\s\u0000-\u001f\u007f]/.test(value)) return false;
  if (value.includes("\\")) return false;
  if (value.startsWith("/") && !value.startsWith("//")) return true;
  return value.startsWith("https://");
}

/** 嵌入地址：只收 https */
function iframeOk(value: string): boolean {
  return value.startsWith("https://");
}

/** 取现有最大 VR 编号 +1；不符合 VR-数字 的编号直接跳过。 */
async function nextVrId(): Promise<string> {
  const rows = await prisma.vrScene.findMany({ select: { id: true } });
  let max = 0;
  for (const row of rows) {
    const matched = /^VR-(\d+)$/.exec(String(row.id).trim());
    if (!matched) continue;
    const num = Number(matched[1]);
    if (Number.isFinite(num) && num > max) max = num;
  }
  return `VR-${String(max + 1).padStart(3, "0")}`;
}

/** 分组 id → 分组行；不存在回 null */
async function findGroup(id: string) {
  return prisma.vrGroup.findUnique({ where: { id } });
}

/** 同组下一个 sort */
async function nextSceneSort(groupId: string | null): Promise<number> {
  const rows = await prisma.vrScene.findMany({
    where: { groupId },
    select: { sort: true },
  });
  return rows.reduce((max, row) => Math.max(max, row.sort), -1) + 1;
}

/** 页面先后：园区在博物馆前面 */
const PAGE_RANK: Record<string, number> = { park: 0, museum: 1 };
/** 没分组的场景按旧的 group 列判断属于哪一页 */
const GROUP_LABEL_PAGE: Record<string, string> = { "园区": "park", "博物馆": "museum" };

/**
 * 没传 sort 时的默认顺序（只给 GET /vr-scenes 用）：
 * 页面（park → museum，按 VrGroup.page；没分组的按 group 列）→ 同页分组顺序（VrGroup.sort、id）
 * → 没分组的排在该页分组之后 → 组内 VrScene.sort、id。
 * 每组的 sort 都从 0 起，直接按 sort 排会让不同分组的场景交错，所以要在内存里排一遍。
 */
async function orderVrSceneIds(where: any): Promise<string[]> {
  const [scenes, groups] = await Promise.all([
    prisma.vrScene.findMany({ where, select: { id: true, groupId: true, group: true, sort: true } }),
    prisma.vrGroup.findMany({ select: { id: true, page: true, sort: true } }),
  ]);
  const groupsById = new Map(groups.map((group) => [group.id, group]));
  type SortKey = [number, number, number, string, number, string];
  const keys = new Map<string, SortKey>();
  for (const scene of scenes) {
    const group = scene.groupId ? groupsById.get(scene.groupId) : undefined;
    const page = group ? group.page : GROUP_LABEL_PAGE[scene.group] ?? "";
    keys.set(scene.id, [
      group ? PAGE_RANK[group.page] ?? 9 : PAGE_RANK[page] ?? 9,
      group ? 0 : 1, // 没分组的排在该页分组之后
      group ? group.sort : 0,
      group ? group.id : "",
      scene.sort,
      scene.id,
    ]);
  }
  const compare = (a: string, b: string): number => {
    const ka = keys.get(a)!;
    const kb = keys.get(b)!;
    if (ka[0] !== kb[0]) return ka[0] - kb[0];
    if (ka[1] !== kb[1]) return ka[1] - kb[1];
    if (ka[2] !== kb[2]) return ka[2] - kb[2];
    if (ka[3] !== kb[3]) return ka[3] < kb[3] ? -1 : 1;
    if (ka[4] !== kb[4]) return ka[4] - kb[4];
    return ka[5] < kb[5] ? -1 : 1;
  };
  return scenes.map((scene) => scene.id).sort(compare);
}

export function registerVr(app: any) {
  // ── 场景列表：分页 + 分组/状态/标题筛选 ──────────────
  app.get("/vr-scenes", async (c: any) => {
    const { page, pageSize, skip, take } = paging(c);
    const group = c.req.query("group")?.trim();
    const groupId = c.req.query("groupId")?.trim();
    const q = c.req.query("q")?.trim();
    const sort = sortSpec(c, VR_SORTS);
    if (!sort) return fail(c, 400, "BAD_SORT", "排序字段不支持。", "sort");

    // status=all 或不传都表示「全部状态」；支持逗号多值
    const filterStatus = multi(c.req.query("status"));
    if (filterStatus && filterStatus.some((value) => !isVrStatus(value))) {
      return fail(c, 400, "INVALID_STATUS", "状态只能是 draft / published / archived。", "status");
    }

    const where: any = {};
    if (group) where.group = group;
    if (groupId) where.groupId = groupId;
    if (filterStatus) where.status = { in: filterStatus };
    if (q) where.title = { contains: q };

    // 传了 sort：完全照旧（按字段 + skip/take）
    if (sort.field !== null) {
      const [total, items] = await Promise.all([
        prisma.vrScene.count({ where }),
        prisma.vrScene.findMany({ where, orderBy: sortToOrderBy(sort, [{ sort: "asc" }, { id: "asc" }]), skip, take }),
      ]);
      return c.json({ items, total, page, pageSize });
    }

    // 没传 sort：按「页面 → 分组顺序 → 组内顺序 → id」排完再切片，详见 orderVrSceneIds
    const ids = await orderVrSceneIds(where);
    const pageIds = ids.slice(skip, skip + take);
    const rows = pageIds.length > 0 ? await prisma.vrScene.findMany({ where: { id: { in: pageIds } } }) : [];
    const rowsById = new Map(rows.map((row) => [row.id, row]));
    return c.json({
      items: pageIds.map((id) => rowsById.get(id)).filter((row) => row !== undefined),
      total: ids.length,
      page,
      pageSize,
    });
  });

  // ── 新建：id 不传就自动生成 VR-xxx ──────────────────
  app.post("/vr-scenes", async (c: any) => {
    const body = (await c.req.json().catch(() => ({}))) as any;

    const title = textOf(body?.title);
    if (!title) return fail(c, 400, "INVALID_TITLE", "标题不能为空。", "title");

    const rawStatus = body?.status;
    if (rawStatus !== undefined && rawStatus !== null && rawStatus !== "" && !isVrStatus(rawStatus)) {
      return fail(c, 400, "INVALID_STATUS", "状态只能是 draft / published / archived。", "status");
    }
    const status: VrStatus = isVrStatus(rawStatus) ? rawStatus : "published";

    // 分组：给了 groupId 就以分组为准（group 列自动同步），否则沿用旧的 group 名字段
    let groupName = textOf(body?.group);
    let groupId: string | null = null;
    if (body?.groupId !== undefined && body?.groupId !== null && body?.groupId !== "") {
      groupId = textOf(body.groupId);
      const group = await findGroup(groupId);
      if (!group) return fail(c, 400, "INVALID_GROUP", "没有这个分组。", "groupId");
      groupName = PAGE_LABEL[group.page] ?? groupName;
    }
    if (!groupName) return fail(c, 400, "INVALID_GROUP", "分组不能为空。", "group");

    const iframe = optionalText(body?.iframe);
    const thumb = optionalText(body?.thumb);
    // 判最终状态：published 必须有 iframe，且地址必须是 https
    if (status === "published" && !iframe) {
      return fail(c, 400, "IFRAME_REQUIRED", "上架的场景要填嵌入地址。", "iframe");
    }
    if (iframe && !iframeOk(iframe)) {
      return fail(c, 400, "INVALID_URL", "嵌入地址必须是 https 开头的链接。", "iframe");
    }
    if (thumb && !thumbOk(thumb)) {
      return fail(c, 400, "INVALID_THUMB", "缩略图要用站内 / 开头或 https 的地址。", "thumb");
    }

    let id = textOf(body?.id);
    if (id) {
      if (!VR_ID_PATTERN.test(id)) return fail(c, 400, "INVALID_ID", "编号格式应形如 VR-001。", "id");
      const exists = await prisma.vrScene.findUnique({ where: { id }, select: { id: true } });
      if (exists) return fail(c, 409, "VR_EXISTS", "这个编号已经被占用了。", "id");
    } else {
      id = await nextVrId();
    }

    // 类型不对直接报错，不静默丢掉（免得表单写错了还以为存上了）
    if (body?.sort !== undefined && !(typeof body.sort === "number" && Number.isInteger(body.sort))) {
      return fail(c, 400, "INVALID_SORT", "排序号要是整数。", "sort");
    }
    if (body?.featured !== undefined && typeof body.featured !== "boolean") {
      return fail(c, 400, "INVALID_FEATURED", "featured 要是 true 或 false。", "featured");
    }
    const sort = typeof body?.sort === "number" && Number.isInteger(body.sort) ? body.sort : await nextSceneSort(groupId);
    const featured = body?.featured === true;

    let scene;
    try {
      scene = await prisma.$transaction(async (tx) => {
        if (featured && groupId) {
          // 一组只有一个大图
          await tx.vrScene.updateMany({ where: { groupId }, data: { featured: false } });
        }
        return tx.vrScene.create({
          data: {
            id,
            group: groupName,
            groupId,
            title,
            gid: optionalText(body?.gid),
            sceneId: optionalText(body?.sceneId),
            thumb,
            preview: optionalText(body?.preview),
            iframe,
            description: optionalText(body?.description),
            sort,
            featured,
            status,
          },
        });
      });
    } catch (error) {
      // 并发下自动编号可能撞车：Prisma P2002
      if ((error as { code?: string }).code === "P2002") {
        return fail(c, 409, "VR_EXISTS", "编号已被占用，请重试或手动指定。", "id");
      }
      throw error;
    }
    audit({ actor: actorOf(c), action: "vr.create", target: scene.id, detail: { groupId, status } });
    return c.json(scene, 201);
  });

  // ── 局部更新：只改传了的字段，编号不可改 ────────────
  app.patch("/vr-scenes/:id", async (c: any) => {
    const id = c.req.param("id");
    const body = (await c.req.json().catch(() => ({}))) as any;

    // 编号是主键，局部更新时不允许改掉
    if (body?.id !== undefined && body?.id !== null && String(body.id).trim() !== id) {
      return fail(c, 400, "INVALID_ID", "不允许修改场景编号。", "id");
    }

    const exists = await prisma.vrScene.findUnique({ where: { id } });
    if (!exists) return fail(c, 404, "VR_NOT_FOUND", "没有找到这个 VR 场景。");

    const data: any = {};
    let groupId = exists.groupId;
    let groupName = exists.group;
    if (body?.groupId !== undefined) {
      if (body.groupId === null || body.groupId === "") {
        groupId = null;
        groupName = PAGE_LABEL[await pageOf(exists.groupId)] ?? exists.group;
      } else {
        const nextId = textOf(body.groupId);
        const group = await findGroup(nextId);
        if (!group) return fail(c, 400, "INVALID_GROUP", "没有这个分组。", "groupId");
        groupId = nextId;
        groupName = PAGE_LABEL[group.page] ?? groupName;
      }
      data.groupId = groupId;
      data.group = groupName;
    } else if (body?.group !== undefined) {
      const group = textOf(body.group);
      if (!group) return fail(c, 400, "INVALID_GROUP", "分组不能为空。", "group");
      groupName = group;
      data.group = group;
      data.groupId = null;
      groupId = null;
    }
    if (body?.title !== undefined) {
      const title = textOf(body.title);
      if (!title) return fail(c, 400, "INVALID_TITLE", "标题不能为空。", "title");
      data.title = title;
    }
    if (body?.status !== undefined) {
      if (!isVrStatus(body.status)) {
        return fail(c, 400, "INVALID_STATUS", "状态只能是 draft / published / archived。", "status");
      }
      data.status = body.status;
    }
    for (const key of ["gid", "sceneId", "thumb", "preview", "iframe", "description"] as const) {
      if (body?.[key] !== undefined) data[key] = optionalText(body[key]);
    }
    if (typeof body?.sort === "number" && Number.isInteger(body.sort)) data.sort = body.sort;

    // 判最终状态：把没传的字段用库里的补齐再校验
    const finalStatus = (data.status ?? exists.status) as VrStatus;
    const finalIframe = data.iframe !== undefined ? data.iframe : exists.iframe;
    const finalThumb = data.thumb !== undefined ? data.thumb : exists.thumb;
    if (finalStatus === "published" && !finalIframe) {
      return fail(c, 400, "IFRAME_REQUIRED", "上架的场景要填嵌入地址。", "iframe");
    }
    if (finalIframe && !iframeOk(finalIframe)) {
      return fail(c, 400, "INVALID_URL", "嵌入地址必须是 https 开头的链接。", "iframe");
    }
    if (finalThumb && !thumbOk(finalThumb)) {
      return fail(c, 400, "INVALID_THUMB", "缩略图要用站内 / 开头或 https 的地址。", "thumb");
    }

    if (body?.featured !== undefined && typeof body.featured !== "boolean") {
      return fail(c, 400, "INVALID_FEATURED", "featured 要是 true 或 false。", "featured");
    }
    if (body?.sort !== undefined && !(typeof body.sort === "number" && Number.isInteger(body.sort))) {
      return fail(c, 400, "INVALID_SORT", "排序号要是整数。", "sort");
    }
    const wantFeatured = body?.featured === true ? true : body?.featured === false ? false : null;
    if (wantFeatured !== null) data.featured = wantFeatured;

    if (Object.keys(data).length > 0) {
      await prisma.$transaction(async (tx) => {
        if (wantFeatured === true && groupId) {
          // 一组只有一个大图：先把同组其它场景清掉
          await tx.vrScene.updateMany({ where: { groupId, id: { not: id } }, data: { featured: false } });
        }
        await tx.vrScene.update({ where: { id }, data });
      });
      audit({ actor: actorOf(c), action: "vr.update", target: id, detail: { fields: Object.keys(data) } });
    }
    const scene = await prisma.vrScene.findUnique({ where: { id } });
    return c.json(scene);
  });

  // ── 删除：默认软删（归档）；?hard=1 真删 ─────────────
  app.delete("/vr-scenes/:id", async (c: any) => {
    const id = c.req.param("id");
    const exists = await prisma.vrScene.findUnique({ where: { id }, select: { id: true, title: true } });
    if (!exists) return fail(c, 404, "VR_NOT_FOUND", "没有找到这个 VR 场景。");

    if (c.req.query("hard") === "1") {
      await prisma.vrScene.delete({ where: { id } });
      audit({ actor: actorOf(c), action: "vr.delete", target: id, detail: { title: exists.title, hard: true } });
      return c.json({ id, deleted: true });
    }
    await prisma.vrScene.update({ where: { id }, data: { status: "archived" } });
    audit({ actor: actorOf(c), action: "vr.delete", target: id, detail: { title: exists.title } });
    return c.json({ id, status: "archived" });
  });

  // ── 页面布局：前台实际版式（含草稿，不含归档） ───────
  app.get("/vr/layout", async (c: any) => {
    const page = c.req.query("page");
    if (!isPage(page)) return fail(c, 400, "INVALID_PAGE", "page 只能是 park 或 museum。", "page");
    const [groups, scenes] = await Promise.all([
      prisma.vrGroup.findMany({ where: { page }, orderBy: [{ sort: "asc" }, { id: "asc" }] }),
      prisma.vrScene.findMany({
        where: { status: { not: "archived" }, group: PAGE_LABEL[page] },
        orderBy: [{ sort: "asc" }, { id: "asc" }],
      }),
    ]);
    const byGroup = new Map<string, any[]>(groups.map((group) => [group.id, []]));
    const ungrouped: any[] = [];
    for (const scene of scenes) {
      // ungrouped 严格等于「groupId 为空」：分组归属对不上这一页的场景不进任何桶
      if (!scene.groupId) ungrouped.push(scene);
      else byGroup.get(scene.groupId)?.push(scene);
    }
    return c.json({
      groups: groups.map((group) => ({ ...group, scenes: byGroup.get(group.id) ?? [] })),
      ungrouped,
    });
  });

  // ── 分组 CRUD ───────────────────────────────────────
  app.get("/vr-groups", async (c: any) => {
    const page = c.req.query("page");
    if (page !== undefined && page !== "all" && !isPage(page)) {
      return fail(c, 400, "INVALID_PAGE", "page 只能是 park 或 museum。", "page");
    }
    const where = page && page !== "all" ? { page } : {};
    const groups = await prisma.vrGroup.findMany({ where, orderBy: [{ page: "asc" }, { sort: "asc" }, { id: "asc" }] });
    const counts = await prisma.vrScene.groupBy({ by: ["groupId"], _count: { _all: true } });
    const map = new Map(counts.map((row) => [row.groupId ?? "", row._count._all]));
    return c.json({ items: groups.map((group) => ({ ...group, sceneCount: map.get(group.id) ?? 0 })) });
  });

  app.post("/vr-groups", async (c: any) => {
    const body = (await c.req.json().catch(() => ({}))) as any;
    if (!isPage(body?.page)) return fail(c, 400, "INVALID_PAGE", "page 只能是 park 或 museum。", "page");
    const name = textOf(body?.name);
    if (!name || name.length > 40) return fail(c, 400, "INVALID_NAME", "分组名要在 1–40 字之间。", "name");
    const layout = body?.layout === undefined ? "grid" : textOf(body.layout);
    if (!(VR_GROUP_LAYOUTS as readonly string[]).includes(layout)) {
      return fail(c, 400, "INVALID_LAYOUT", "layout 只能是 grid 或 feature。", "layout");
    }
    const maxSort = await prisma.vrGroup.aggregate({ where: { page: body.page }, _max: { sort: true } });
    const id = textOf(body?.id) || `vg-${Date.now().toString(36)}-${Math.floor(Math.random() * 1e6).toString(36)}`;
    const exists = await prisma.vrGroup.findUnique({ where: { id }, select: { id: true } });
    if (exists) return fail(c, 409, "GROUP_EXISTS", "这个分组 id 已经被占用了。", "id");
    const group = await prisma.vrGroup.create({
      data: {
        id,
        page: body.page,
        name,
        layout,
        sort: (maxSort._max.sort ?? -1) + 1,
        visible: body?.visible === undefined ? true : body.visible === true,
      },
    });
    audit({ actor: actorOf(c), action: "vrgroup.create", target: group.id, detail: { page: group.page, name } });
    return c.json(group, 201);
  });

  app.patch("/vr-groups/:id", async (c: any) => {
    const id = c.req.param("id");
    const exists = await prisma.vrGroup.findUnique({ where: { id } });
    if (!exists) return fail(c, 404, "GROUP_NOT_FOUND", "没有这个分组。");
    const body = (await c.req.json().catch(() => ({}))) as any;
    const data: any = {};
    if (body?.name !== undefined) {
      const name = textOf(body.name);
      if (!name || name.length > 40) return fail(c, 400, "INVALID_NAME", "分组名要在 1–40 字之间。", "name");
      data.name = name;
    }
    if (body?.layout !== undefined) {
      const layout = textOf(body.layout);
      if (!(VR_GROUP_LAYOUTS as readonly string[]).includes(layout)) {
        return fail(c, 400, "INVALID_LAYOUT", "layout 只能是 grid 或 feature。", "layout");
      }
      data.layout = layout;
    }
    if (body?.visible !== undefined) {
      if (typeof body.visible !== "boolean") return fail(c, 400, "INVALID_VISIBLE", "visible 要是 true 或 false。", "visible");
      data.visible = body.visible;
    }
    if (body?.sort !== undefined && typeof body.sort === "number" && Number.isInteger(body.sort)) data.sort = body.sort;
    if (Object.keys(data).length === 0) return fail(c, 400, "NO_CHANGES", "没有可更新的字段。");
    const group = await prisma.vrGroup.update({ where: { id }, data });
    audit({ actor: actorOf(c), action: "vrgroup.update", target: id, detail: { fields: Object.keys(data) } });
    return c.json(group);
  });

  app.delete("/vr-groups/:id", async (c: any) => {
    const id = c.req.param("id");
    const exists = await prisma.vrGroup.findUnique({ where: { id }, select: { id: true, name: true } });
    if (!exists) return fail(c, 404, "GROUP_NOT_FOUND", "没有这个分组。");
    const scenes = await prisma.vrScene.count({ where: { groupId: id } });
    if (scenes > 0) {
      return c.json(
        { error: { code: "GROUP_NOT_EMPTY", message: `这个分组里还有 ${scenes} 个场景，先把它们移走。`, details: { scenes } } },
        409,
      );
    }
    await prisma.vrGroup.delete({ where: { id } });
    audit({ actor: actorOf(c), action: "vrgroup.delete", target: id, detail: { name: exists.name } });
    return c.json({ id, deleted: true });
  });

  // ── 拖拽排序：分组顺序 + 组内场景顺序 + 移进移出 ─────
  app.post("/vr/reorder", async (c: any) => {
    const body = (await c.req.json().catch(() => ({}))) as any;
    if (!isPage(body?.page)) return fail(c, 400, "INVALID_PAGE", "page 只能是 park 或 museum。", "page");
    const page: string = body.page;

    const groupIds: string[] | null = body?.groupIds === undefined ? null : Array.isArray(body.groupIds) ? body.groupIds.map(String) : null;
    if (body?.groupIds !== undefined && !groupIds) return fail(c, 400, "INVALID_IDS", "groupIds 要是数组。", "groupIds");
    if (groupIds && new Set(groupIds).size !== groupIds.length) {
      return fail(c, 400, "INVALID_IDS", "同一个分组不能出现两次。", "groupIds");
    }
    const groupsInput: { id: string; sceneIds: string[] }[] | null =
      body?.groups === undefined
        ? null
        : Array.isArray(body.groups)
          ? body.groups.map((raw: any) => ({
              id: String(raw?.id ?? ""),
              sceneIds: Array.isArray(raw?.sceneIds) ? raw.sceneIds.map((s: any) => String(s)) : [],
            }))
          : null;
    if (body?.groups !== undefined && !groupsInput) return fail(c, 400, "INVALID_IDS", "groups 要是数组。", "groups");
    const ungrouped: string[] | null =
      body?.ungrouped === undefined ? null : Array.isArray(body.ungrouped) ? body.ungrouped.map(String) : null;
    if (body?.ungrouped !== undefined && !ungrouped) return fail(c, 400, "INVALID_IDS", "ungrouped 要是数组。", "ungrouped");

    // 分组必须存在且属于这个 page
    const groupRows = await prisma.vrGroup.findMany({ where: { page } });
    const pageGroups = new Set(groupRows.map((group) => group.id));
    for (const id of [...(groupIds ?? []), ...(groupsInput ?? []).map((group) => group.id)]) {
      if (!pageGroups.has(id)) return fail(c, 400, "INVALID_GROUP", `分组 ${id} 不属于这个页面。`, "groups");
    }

    // 场景 id：全部要存在，且整批不重复
    const sceneIds = [...(groupsInput ?? []).flatMap((group) => group.sceneIds), ...(ungrouped ?? [])];
    if (new Set(sceneIds).size !== sceneIds.length) return fail(c, 400, "INVALID_IDS", "同一个场景不能在两个位置。", "groups");
    const sceneRows = await prisma.vrScene.findMany({ where: { id: { in: sceneIds } }, select: { id: true, featured: true } });
    if (sceneRows.length !== sceneIds.length) return fail(c, 404, "VR_NOT_FOUND", "有场景编号找不到。", "groups");
    const featured = new Set(sceneRows.filter((row) => row.featured).map((row) => row.id));

    await prisma.$transaction(async (tx) => {
      if (groupIds) {
        for (let index = 0; index < groupIds.length; index += 1) {
          await tx.vrGroup.update({ where: { id: groupIds[index] }, data: { sort: index } });
        }
      }
      for (const group of groupsInput ?? []) {
        // 一组里 featured 多于一个时只留排在最前的
        const keepIdx = group.sceneIds.reduce((keep, id, index) => (featured.has(id) && keep === -1 ? index : keep), -1);
        for (let index = 0; index < group.sceneIds.length; index += 1) {
          const id = group.sceneIds[index];
          const data: any = { groupId: group.id, group: PAGE_LABEL[page], sort: index };
          if (index === keepIdx) data.featured = true;
          else if (featured.has(id)) data.featured = false;
          await tx.vrScene.update({ where: { id }, data });
        }
      }
      if (ungrouped) {
        for (let index = 0; index < ungrouped.length; index += 1) {
          await tx.vrScene.update({
            where: { id: ungrouped[index] },
            data: { groupId: null, group: PAGE_LABEL[page], sort: index },
          });
        }
      }
    });

    audit({
      actor: actorOf(c),
      action: "vr.reorder",
      target: page,
      detail: { groups: (groupsInput ?? []).length, ungrouped: (ungrouped ?? []).length },
    });
    return c.json({ ok: true, page });
  });

  // ── 地址就地体检（防 SSRF，只回结论不回上游内容） ────
  app.post("/vr-scenes/check-url", async (c: any) => {
    const body = (await c.req.json().catch(() => ({}))) as any;
    const raw = typeof body?.url === "string" ? body.url.trim() : "";
    if (!raw || !raw.startsWith("https://")) {
      return fail(c, 400, "INVALID_URL", "地址必须是 https 开头的链接。", "url");
    }
    const result = await checkPanoUrl(raw);
    return c.json(result);
  });
}

/** 从分组 id 推回页面；查不到时 undefined */
async function pageOf(groupId: string | null): Promise<string> {
  if (!groupId) return "";
  const group = await prisma.vrGroup.findUnique({ where: { id: groupId }, select: { page: true } });
  return group?.page ?? "";
}

// ── check-url 的实现（SSRF 防护） ───────────────────────
const BLOCKED_V4 = [
  /^0\./,
  /^10\./,
  /^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./,
  /^127\./,
  /^169\.254\./,
  /^172\.(1[6-9]|2\d|3[01])\./,
  /^192\.168\./,
];

/**
 * 用 WHATWG URL 把 IPv6 规范化：去前导零、压成 `::`、小写。
 * 认不出来（比如点分 IPv4）就原样小写返回。NAT64 之类的前缀判断靠它对齐「展开写法」。
 */
function canonIp(value: string): string {
  try {
    return new URL(`https://[${value}]/`).hostname.replace(/^\[|\]$/g, "").toLowerCase();
  } catch {
    return value.toLowerCase();
  }
}

function blockedIp(ip: string): boolean {
  const value = canonIp(ip);
  if (value === "::1" || value === "::") return true;
  if (value.startsWith("::ffff:")) {
    const mapped = value.slice(7);
    // IPv4-mapped：带点的直接判；十六进制写法认不出来就按私网处理（宁严不松）
    return /^\d+\.\d+\.\d+\.\d+$/.test(mapped) ? blockedIp(mapped) : true;
  }
  // NAT64 64:ff9b::/96：前 6 组固定，后面 32 位就是被映射的 IPv4，一律挡掉
  if (value.startsWith("64:ff9b::")) return true;
  if (/^f[cd]/.test(value)) return true; // fc00::/7
  if (/^fe[89ab]/.test(value)) return true; // fe80::/10
  return BLOCKED_V4.some((pattern) => pattern.test(value));
}

/** 解析主机名并确认不是回环 / 私网 / 链路本地 / .local；任何一步不合规都算 blocked */
async function hostBlocked(hostname: string): Promise<boolean> {
  // IPv6 主机名在 URL 里带方括号：先剥掉再判，否则 isIP("[::1]") 认不出来
  const host = hostname.toLowerCase().replace(/^\[|\]$/g, "");
  if (!host) return true;
  if (host === "localhost" || host.endsWith(".local") || host.endsWith(".internal")) return true;
  const { lookup } = await import("node:dns/promises");
  const { isIP } = await import("node:net");
  if (isIP(host)) return blockedIp(host);
  try {
    const records = await lookup(host, { all: true, verbatim: true });
    if (records.length === 0) return false;
    return records.some((record) => blockedIp(record.address));
  } catch {
    // 解析不了交给 fetch 去报 unreachable，这里不当作 blocked
    return false;
  }
}

type CheckResult = { ok: boolean; reason?: "blocked" | "timeout" | "unreachable" | "http_error" | "pano_missing" };

/** 取一个地址的状态与跳转目标；不读响应体，不下载上游内容 */
async function probe(
  url: string,
  referer?: string,
): Promise<{ status: number; location: string | null } | { error: CheckResult["reason"] }> {
  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "manual",
      signal: AbortSignal.timeout(5000),
      headers: referer ? { referer } : undefined,
    });
    const location = response.headers.get("location");
    // 不读上游内容
    await response.body?.cancel().catch(() => {});
    return { status: response.status, location };
  } catch (error) {
    const name = (error as { name?: string })?.name;
    if (name === "TimeoutError" || name === "AbortError") return { error: "timeout" };
    return { error: "unreachable" };
  }
}

async function checkPanoUrl(raw: string): Promise<CheckResult> {
  let current: URL;
  try {
    current = new URL(raw);
  } catch {
    return { ok: false, reason: "unreachable" };
  }
  // 最多 3 跳，每跳都重查域名
  for (let hop = 0; hop < 4; hop += 1) {
    if (current.protocol !== "https:") return { ok: false, reason: "blocked" };
    if (await hostBlocked(current.hostname)) return { ok: false, reason: "blocked" };
    const result = await probe(current.toString());
    if ("error" in result) return { ok: false, reason: result.error };
    if (result.status >= 300 && result.status < 400) {
      if (hop === 3) return { ok: false, reason: "blocked" };
      if (!result.location) return { ok: false, reason: "blocked" };
      try {
        current = new URL(result.location, current);
      } catch {
        return { ok: false, reason: "blocked" };
      }
      continue;
    }
    if (result.status >= 400) return { ok: false, reason: "http_error" };

    // 化橘红全景页：顺带看一下预览图在不在（对方要 Referer，不给会 403）
    const isPano = current.hostname === "live.kuleiman.com" && current.pathname.includes("pano.html");
    const tileserver = current.searchParams.get("tileserver");
    if (isPano && tileserver) {
      const preview = await probe(`https://imj.kuleiman.com/${tileserver}preview.jpg`, "https://live.kuleiman.com/");
      if ("error" in preview) return { ok: false, reason: preview.error };
      if (preview.status === 403 || preview.status === 404) return { ok: false, reason: "pano_missing" };
      if (preview.status >= 400) return { ok: false, reason: "http_error" };
    }
    return { ok: true };
  }
  return { ok: false, reason: "blocked" };
}

