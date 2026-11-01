// 账号：我的账号（资料、改密码）和账号管理（只有管理员）。改密成功后旧登录态全部失效，必须重新登录。
import { useEffect, useRef, useState } from "react";
import { Copy, Ellipsis, Plus, User, Users } from "lucide-react";
import { useLocation, useSearchParams } from "react-router";
import { api, ApiError, forceRelogin, LOGIN_NOTICE_KEY, type AdminAccount, type AdminRole } from "../api";
import { ROLE_LABEL, useAuth } from "../auth";
import { DataList, type Column } from "../list";
import { applyApiError, asyncGate, Card, Confirm, dateTime, Drawer, ErrorBar, Field, Menu, PageHeadExtra, Segmented, Skeleton, toast, useAsync, useFormState } from "../ui";

const MIN_LENGTH = 10;

/** 只按长度和字符种类估一个提示，不拦提交；硬规则只有「至少 10 位」 */
function strength(password: string): { level: 0 | 1 | 2 | 3; label: string } {
  if (!password) return { level: 0, label: "" };
  const kinds = [/[a-z]/, /[A-Z]/, /\d/, /[^a-zA-Z\d]/].filter((re) => re.test(password)).length;
  if (password.length < MIN_LENGTH || kinds < 2) return { level: 1, label: "弱" };
  if (password.length >= 14 && kinds >= 3) return { level: 3, label: "强" };
  return { level: 2, label: "中" };
}

export default function Account() {
  const { isAdmin } = useAuth();
  const [params, setParams] = useSearchParams();
  if (!isAdmin) return <MyAccount />;
  const tab = params.get("tab") === "manage" ? "manage" : "me";
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <PageHeadExtra>
        <Segmented
          size="md"
          label="账号分段"
          value={tab}
          onChange={(next) => setParams(next === "manage" ? { tab: "manage" } : {}, { replace: true })}
          options={[
            { value: "me", label: "我的账号", icon: <User size={16} strokeWidth={1.75} aria-hidden /> },
            { value: "manage", label: "账号管理", icon: <Users size={16} strokeWidth={1.75} aria-hidden /> },
          ]}
        />
      </PageHeadExtra>
      {tab === "manage" ? <AccountManage /> : <MyAccount />}
    </div>
  );
}

function MyAccount() {
  const me = useAsync(() => api.me(), []);
  const gate = asyncGate(me, { compact: true });
  return (
    <>
      <Card>
        {gate ?? (
          me.data && (
            <dl className="info-grid">
              <div>
                <dt>用户名</dt>
                <dd>{me.data.username}</dd>
              </div>
              <div>
                <dt>角色</dt>
                <dd>{ROLE_LABEL[me.data.role]}</dd>
              </div>
              {me.data.createdAt ? (
                <div>
                  <dt>创建时间</dt>
                  <dd className="mono">{dateTime(me.data.createdAt)}</dd>
                </div>
              ) : null}
            </dl>
          )
        )}
      </Card>
      <PasswordCard />
    </>
  );
}

function PasswordCard() {
  const location = useLocation();
  const currentRef = useRef<HTMLInputElement | null>(null);
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [repeat, setRepeat] = useState("");
  const [errors, setErrors] = useState<{ current?: string; next?: string; repeat?: string }>({});
  const [error, setError] = useState<string | null>(null);
  const [asking, setAsking] = useState(false);
  const [busy, setBusy] = useState(false);
  const meter = strength(next);

  useEffect(() => {
    if (location.hash === "#password") currentRef.current?.focus();
  }, [location.hash]);

  function validate(event: React.FormEvent) {
    event.preventDefault();
    const found: typeof errors = {};
    if (!current) found.current = "请输入当前密码";
    if (next.length < MIN_LENGTH) found.next = `新密码至少 ${MIN_LENGTH} 位`;
    else if (next === current) found.next = "新密码不能和当前密码相同";
    if (repeat !== next) found.repeat = "两次输入的新密码不一致";
    setErrors(found);
    setError(null);
    if (Object.keys(found).length === 0) setAsking(true);
  }

  async function submit() {
    setBusy(true);
    try {
      await api.changePassword(current, next);
      // 旧登录态已作废，页面会被卸载：提示存起来，交给登录页显示
      sessionStorage.setItem(LOGIN_NOTICE_KEY, "密码已修改，请重新登录");
      forceRelogin();
    } catch (err) {
      if (err instanceof ApiError && err.code === "SAME_PASSWORD") setErrors({ next: err.message });
      else if (err instanceof ApiError && (err.field === "current" || err.field === "next")) setErrors({ [err.field]: err.message });
      else setError(err instanceof ApiError ? err.message : "修改失败");
      setAsking(false);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card title="修改密码">
      <form id="password" className="stack stack--narrow" onSubmit={validate} noValidate>
        {error && <ErrorBar message={error} />}
        <Field label="当前密码" error={errors.current}>
          <input ref={currentRef} className="input" type="password" autoComplete="current-password" value={current} onChange={(e) => setCurrent(e.target.value)} />
        </Field>
        <Field label="新密码" hint={`至少 ${MIN_LENGTH} 位，混用大小写、数字和符号更安全`} error={errors.next}>
          <input className="input" type="password" autoComplete="new-password" value={next} onChange={(e) => setNext(e.target.value)} />
        </Field>
        {meter.level > 0 && (
          <div className="strength" data-level={meter.level} role="status">
            <span className="strength__bar" aria-hidden>
              <i />
              <i />
              <i />
            </span>
            <span className="muted">强度：{meter.label}</span>
          </div>
        )}
        <Field label="再输一次新密码" error={errors.repeat}>
          <input className="input" type="password" autoComplete="new-password" value={repeat} onChange={(e) => setRepeat(e.target.value)} />
        </Field>
        <div>
          <button type="submit" className="btn btn-filled" disabled={busy}>
            修改密码
          </button>
        </div>
      </form>
      <Confirm
        open={asking}
        title="修改登录密码？"
        desc="修改成功后，所有已登录的设备都会退出，需要用新密码重新登录。"
        confirmText={busy ? "修改中…" : "确认修改"}
        danger
        onConfirm={() => void submit()}
        onCancel={() => setAsking(false)}
      />
    </Card>
  );
}

function validUsername(name: string) {
  return /^[a-z0-9][a-z0-9._-]{2,31}$/.test(name);
}

/** 服务端生成的密码只在这里出现一次 */
function PasswordOnce({ username, password, onClose }: { username: string; password: string; onClose: () => void }) {
  async function copy() {
    try {
      await navigator.clipboard.writeText(password);
      toast("已复制");
    } catch {
      toast("复制失败，请手动选中复制");
    }
  }
  return (
    <Drawer
      variant="dialog"
      title={`${username} 的初始密码`}
      onClose={onClose}
      footer={
        <button type="button" className="btn btn-filled" onClick={onClose}>
          我已保存
        </button>
      }
    >
      <p className="hint">这个密码只显示这一次，关闭后无法再查看。对方用它登录后要先改密码。</p>
      <div className="password-once">
        <code className="mono">{password}</code>
        <button type="button" className="btn btn-tonal btn-sm" onClick={() => void copy()}>
          <Copy size={16} strokeWidth={1.75} aria-hidden />
          复制
        </button>
      </div>
    </Drawer>
  );
}

function AccountCreate({ onClose, onCreated }: { onClose: () => void; onCreated: (account: AdminAccount, initialPassword?: string) => void }) {
  const { form, dirty, errors, setErrors, set, bind } = useFormState({ username: "", role: "operator" as AdminRole, password: "", currentPassword: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    const username = form.username.trim();
    const found: Record<string, string> = {};
    if (!validUsername(username)) found.username = "3–32 位小写字母、数字、点、下划线或连字符，字母或数字开头";
    if (form.password && form.password.length < MIN_LENGTH) found.password = `密码至少 ${MIN_LENGTH} 位`;
    if (form.role === "admin" && !form.currentPassword) found.currentPassword = "请输入你的当前密码";
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    setBusy(true);
    setError(null);
    try {
      const created = await api.createAccount({
        username,
        role: form.role,
        ...(form.password ? { password: form.password } : {}),
        ...(form.role === "admin" ? { currentPassword: form.currentPassword } : {}),
      });
      onCreated(created.account, created.initialPassword);
    } catch (err) {
      setError(applyApiError(err, setErrors, "新建失败"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Drawer variant="dialog" title="新建账号" onClose={onClose} onSave={() => void submit()} saving={busy} saveText="新建" dirty={dirty}>
      {error && <ErrorBar message={error} />}
      <Field label="用户名" error={errors.username}>
        <input className="input" autoComplete="off" maxLength={32} autoFocus {...bind("username")} />
      </Field>
      <Field label="角色">
        <Segmented
          size="md"
          label="角色"
          value={form.role}
          onChange={(next) => set("role", next)}
          options={[
            { value: "operator", label: "运营" },
            { value: "admin", label: "管理员" },
          ]}
        />
      </Field>
      <Field label="初始密码" hint="留空时自动生成，创建后显示一次" error={errors.password}>
        <input className="input" type="password" autoComplete="new-password" {...bind("password")} />
      </Field>
      {form.role === "admin" && (
        <Field label="你的当前密码" hint="新建管理员要再验证一次" error={errors.currentPassword}>
          <input className="input" type="password" autoComplete="current-password" {...bind("currentPassword")} />
        </Field>
      )}
    </Drawer>
  );
}

function ResetPassword({ account, onClose, onDone }: { account: AdminAccount; onClose: () => void; onDone: (initialPassword?: string) => void }) {
  const [password, setPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit() {
    const found: Record<string, string> = {};
    if (password && password.length < MIN_LENGTH) found.password = `密码至少 ${MIN_LENGTH} 位`;
    if (!currentPassword) found.currentPassword = "请输入你的当前密码";
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    setBusy(true);
    setError(null);
    try {
      const result = await api.resetAccountPassword(account.id, { ...(password ? { password } : {}), currentPassword });
      onDone(result.initialPassword);
    } catch (err) {
      setError(applyApiError(err, setErrors, "重置失败"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Drawer variant="dialog" title={`重置 ${account.username} 的密码`} onClose={onClose} onSave={() => void submit()} saving={busy} saveText="重置" dirty>
      {error && <ErrorBar message={error} />}
      <p className="hint">重置后这个账号会立刻退出登录，下次登录要先改密码。</p>
      <Field label="新密码" hint="留空时自动生成，重置后显示一次" error={errors.password}>
        <input className="input" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </Field>
      <Field label="你的当前密码" hint="重置别人的密码要再验证一次" error={errors.currentPassword}>
        <input className="input" type="password" autoComplete="current-password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
      </Field>
    </Drawer>
  );
}

/** 改为管理员要再验证一次，改回运营走普通确认 */
function PromoteAdmin({ account, onClose, onDone }: { account: AdminAccount; onClose: () => void; onDone: () => void }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit() {
    if (!currentPassword) {
      setErrors({ currentPassword: "请输入你的当前密码" });
      return;
    }
    setErrors({});
    setBusy(true);
    setError(null);
    try {
      await api.patchAccount(account.id, { role: "admin", currentPassword });
      onDone();
    } catch (err) {
      setError(applyApiError(err, setErrors, "修改失败"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Drawer variant="dialog" title={`把 ${account.username} 改为管理员`} onClose={onClose} onSave={() => void submit()} saving={busy} saveText="确认修改" dirty>
      {error && <ErrorBar message={error} />}
      <p className="hint">管理员可以使用全部功能，下一次操作就按新角色生效。</p>
      <Field label="你的当前密码" error={errors.currentPassword}>
        <input className="input" type="password" autoComplete="current-password" autoFocus value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
      </Field>
    </Drawer>
  );
}

type RowAction = { kind: "role" | "toggle" | "delete"; account: AdminAccount };

function AccountManage() {
  const { user } = useAuth();
  const list = useAsync(() => api.accounts(), []);
  const [creating, setCreating] = useState(false);
  const [menu, setMenu] = useState<{ anchor: HTMLElement; account: AdminAccount } | null>(null);
  const [resetting, setResetting] = useState<AdminAccount | null>(null);
  const [promoting, setPromoting] = useState<AdminAccount | null>(null);
  const [once, setOnce] = useState<{ username: string; password: string } | null>(null);
  const [asking, setAsking] = useState<RowAction | null>(null);

  async function apply(action: RowAction) {
    setAsking(null);
    const { kind, account } = action;
    try {
      if (kind === "role") await api.patchAccount(account.id, { role: "operator" });
      else if (kind === "toggle") await api.patchAccount(account.id, { disabled: !account.disabled });
      else await api.deleteAccount(account.id);
      toast(kind === "role" ? "角色已修改" : kind === "toggle" ? (account.disabled ? "账号已启用" : "账号已停用") : "账号已删除");
      list.reload();
    } catch (err) {
      toast(err instanceof ApiError ? err.message : "操作失败");
    }
  }

  const columns: Column<AdminAccount>[] = [
    {
      key: "username",
      label: "用户名",
      width: "minmax(0, 1fr)",
      mobile: "grow",
      render: (row) => (
        <span className="dl-ellipsis">
          {row.username}
          {row.id === user.id && <span className="pill" style={{ marginLeft: 8 }}>当前账号</span>}
          {row.mustChangePassword && <span className="pill" style={{ marginLeft: 8 }}>待改密</span>}
        </span>
      ),
    },
    { key: "role", label: "角色", width: "72px", render: (row) => <span>{ROLE_LABEL[row.role]}</span> },
    { key: "status", label: "状态", width: "72px", render: (row) => (row.disabled ? <span className="pill pill--bad">已停用</span> : <span className="pill pill--ok">启用</span>) },
    { key: "created", label: "创建时间", width: "136px", mobile: "hide", render: (row) => <span className="dl-time">{dateTime(row.createdAt)}</span> },
    { key: "login", label: "最近登录", width: "136px", mobile: "hide", render: (row) => <span className="dl-time">{row.lastLoginAt ? dateTime(row.lastLoginAt) : "—"}</span> },
  ];

  const gate = asyncGate(list, { compact: true, skeleton: <Skeleton rows={3} /> });
  return (
    <Card
      actions={
        <button type="button" className="btn btn-filled btn-sm" onClick={() => setCreating(true)}>
          <Plus size={16} strokeWidth={1.75} aria-hidden />
          新建账号
        </button>
      }
    >
      {gate ?? (
        <DataList
          label="账号"
          columns={columns}
          rows={list.data!.items}
          rowKey={(row) => row.id}
          query={{ sort: undefined, order: undefined, update: () => undefined }}
          actionsWidth="44px"
          actions={(row) =>
            row.id === user.id ? null : (
              <button type="button" className="icon-btn" aria-label={`操作 ${row.username}`} aria-haspopup="menu" onClick={(event) => setMenu({ anchor: event.currentTarget, account: row })}>
                <Ellipsis size={18} strokeWidth={1.75} />
              </button>
            )
          }
        />
      )}

      {menu && (
        <Menu anchor={menu.anchor} onClose={() => setMenu(null)} label={`操作 ${menu.account.username}`}>
          <button type="button" className="menu-item" role="menuitem" onClick={() => { if (menu.account.role === "admin") setAsking({ kind: "role", account: menu.account }); else setPromoting(menu.account); setMenu(null); }}>
            改为{menu.account.role === "admin" ? "运营" : "管理员"}
          </button>
          <button type="button" className="menu-item" role="menuitem" onClick={() => { setResetting(menu.account); setMenu(null); }}>
            重置密码
          </button>
          <button type="button" className="menu-item" role="menuitem" onClick={() => { setAsking({ kind: "toggle", account: menu.account }); setMenu(null); }}>
            {menu.account.disabled ? "启用" : "停用"}
          </button>
          <button type="button" className="menu-item menu-item--danger" role="menuitem" onClick={() => { setAsking({ kind: "delete", account: menu.account }); setMenu(null); }}>
            删除
          </button>
        </Menu>
      )}

      {creating && (
        <AccountCreate
          onClose={() => setCreating(false)}
          onCreated={(account, initialPassword) => {
            setCreating(false);
            toast("账号已新建");
            list.reload();
            if (initialPassword) setOnce({ username: account.username, password: initialPassword });
          }}
        />
      )}
      {resetting && (
        <ResetPassword
          account={resetting}
          onClose={() => setResetting(null)}
          onDone={(initialPassword) => {
            const username = resetting.username;
            setResetting(null);
            toast("密码已重置");
            list.reload();
            if (initialPassword) setOnce({ username, password: initialPassword });
          }}
        />
      )}
      {promoting && (
        <PromoteAdmin
          account={promoting}
          onClose={() => setPromoting(null)}
          onDone={() => {
            setPromoting(null);
            toast("角色已修改");
            list.reload();
          }}
        />
      )}
      {once && <PasswordOnce username={once.username} password={once.password} onClose={() => setOnce(null)} />}

      <Confirm
        open={asking !== null}
        danger={asking?.kind !== "role"}
        title={
          asking?.kind === "role"
            ? `把 ${asking.account.username} 改为运营？`
            : asking?.kind === "toggle"
              ? `${asking.account.disabled ? "启用" : "停用"} ${asking.account.username}？`
              : `删除 ${asking?.account.username ?? ""}？`
        }
        desc={
          asking?.kind === "role"
            ? "下一次操作就按新角色生效。"
            : asking?.kind === "toggle"
              ? asking.account.disabled
                ? "启用后可以用原密码登录。"
                : "停用后这个账号会立刻退出，不能再登录。"
              : "删除后不可恢复，操作日志里的记录会保留。"
        }
        confirmText={asking?.kind === "role" ? "确认修改" : asking?.kind === "toggle" ? (asking.account.disabled ? "启用" : "停用") : "删除"}
        onCancel={() => setAsking(null)}
        onConfirm={() => {
          if (asking) void apply(asking);
        }}
      />
    </Card>
  );
}
