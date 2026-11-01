// 初始密码或过短的密码登录后停在这里：改完才能进管理中心。改密成功后旧登录态作废，回登录页。
import { useState } from "react";
import { api, ApiError, forceRelogin, LOGIN_NOTICE_KEY } from "../api";
import { Glass } from "../glass";
import { Field } from "../ui";

const MIN_LENGTH = 10;

export default function ForcePassword({ onLeave }: { onLeave: () => void }) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [repeat, setRepeat] = useState("");
  const [errors, setErrors] = useState<{ current?: string; next?: string; repeat?: string }>({});
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const found: typeof errors = {};
    if (!current) found.current = "请输入当前密码";
    if (next.length < MIN_LENGTH) found.next = `新密码至少 ${MIN_LENGTH} 位`;
    else if (next === current) found.next = "新密码不能和当前密码相同";
    if (repeat !== next) found.repeat = "两次输入的新密码不一致";
    setErrors(found);
    setError(null);
    if (Object.keys(found).length > 0) return;

    setBusy(true);
    try {
      await api.changePassword(current, next);
      // 旧登录态已作废，页面会被卸载：提示存起来，交给登录页显示
      sessionStorage.setItem(LOGIN_NOTICE_KEY, "密码已修改，请用新密码登录");
      forceRelogin();
    } catch (err) {
      if (err instanceof ApiError && err.code === "SAME_PASSWORD") setErrors({ next: err.message });
      else if (err instanceof ApiError && (err.field === "current" || err.field === "next")) setErrors({ [err.field]: err.message });
      else setError(err instanceof ApiError ? err.message : "修改失败，请稍后再试。");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="login-wrap">
      <Glass className="login-card">
        <div className="login-visual">
          <img src="/img/hero.jpg" alt="" />
        </div>
        <form className="login-form" onSubmit={submit} noValidate>
          <div className="login-brand">
            <div className="topbar__mark" aria-hidden="true">橘</div>
            <span>化州橘红博览馆</span>
          </div>
          <h1>设置新密码</h1>
          <p className="login-notice" role="status">
            这是初始密码，改完才能进入管理中心。
          </p>
          <Field label="当前密码" error={errors.current}>
            <input className="input" type="password" autoComplete="current-password" autoFocus value={current} aria-invalid={Boolean(errors.current)} onChange={(e) => setCurrent(e.target.value)} />
          </Field>
          <Field label="新密码" hint={`至少 ${MIN_LENGTH} 位`} error={errors.next}>
            <input className="input" type="password" autoComplete="new-password" value={next} aria-invalid={Boolean(errors.next)} onChange={(e) => setNext(e.target.value)} />
          </Field>
          <Field label="再输一次新密码" error={errors.repeat}>
            <input className="input" type="password" autoComplete="new-password" value={repeat} aria-invalid={Boolean(errors.repeat)} onChange={(e) => setRepeat(e.target.value)} />
          </Field>
          {error && (
            <p className="err" role="alert">
              {error}
            </p>
          )}
          <button className="btn btn-filled" type="submit" disabled={busy}>
            {busy ? "修改中…" : "修改密码"}
          </button>
          <button className="btn btn-text" type="button" disabled={busy} onClick={onLeave}>
            退出登录
          </button>
        </form>
      </Glass>
    </div>
  );
}
