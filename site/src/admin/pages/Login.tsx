import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { afterLoginPath, api, ApiError, LOGIN_NOTICE_KEY, type AdminUser } from "../api";
import { Glass } from "../glass";
import { Field } from "../ui";

export default function Login({ onAuthenticated }: { onAuthenticated?: (user: AdminUser) => void } = {}) {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [username, setUsername] = useState("");
  const [notice] = useState(() => {
    try {
      const saved = sessionStorage.getItem(LOGIN_NOTICE_KEY);
      sessionStorage.removeItem(LOGIN_NOTICE_KEY);
      return saved;
    } catch {
      return null; // 隐私模式忽略
    }
  });
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!username.trim() || !password) {
      setError("请输入账号和密码。");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const result = await api.login(username.trim(), password);
      onAuthenticated?.(result.user);
      navigate(afterLoginPath(params.get("next")), { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "登录失败，请稍后再试。");
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
          <h1>管理中心</h1>
          {notice && (
            <p className="login-notice" role="status">
              {notice}
            </p>
          )}
          <Field label="账号">
            <input
              className="input"
              value={username}
              autoComplete="username"
              autoCapitalize="off"
              spellCheck={false}
              autoFocus
              onChange={(e) => {
                setUsername(e.target.value);
                setError(null);
              }}
              aria-invalid={Boolean(error)}
            />
          </Field>
          <div className="field">
            <label htmlFor="login-password">密码</label>
            <div className="login-pass">
              <input
                id="login-password"
                className="input"
                type={showPassword ? "text" : "password"}
                value={password}
                autoComplete="current-password"
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(null);
                }}
                aria-invalid={Boolean(error)}
              />
              <button
                className="login-pass__toggle"
                type="button"
                aria-label={showPassword ? "隐藏密码" : "显示密码"}
                onClick={() => setShowPassword((on) => !on)}
              >
                {showPassword ? "隐藏" : "显示"}
              </button>
            </div>
          </div>
          {error && (
            <p className="err" role="alert">
              {error}
            </p>
          )}
          <button className="btn btn-filled" type="submit" disabled={busy}>
            {busy ? "登录中…" : "登录"}
          </button>
        </form>
      </Glass>
    </div>
  );
}
