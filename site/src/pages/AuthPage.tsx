import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { shopApi } from '../lib/shop/api'
import { toShopError } from '../lib/shop/errors'
import { setSession, useSession } from '../lib/shop/session'
import { useSessionCheck } from '../lib/shop/useSessionCheck'
import '../styles/shop.css'

type Mode = 'login' | 'register'

function safeNext(value: string | null): string {
  if (!value || !value.startsWith('/') || value.startsWith('//')) return '/products'
  return value
}

function strength(password: string): number {
  if (!password) return 0
  let score = 0
  if (password.length >= 8) score += 1
  if (/[A-Za-z]/.test(password) && /\d/.test(password)) score += 1
  if (password.length >= 12) score += 1
  return score
}

export default function AuthPage({ mode }: { mode: Mode }) {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const session = useSession()
  const next = safeNext(params.get('next'))

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const isLogin = mode === 'login'
  const nextQuery = params.get('next') ? '?next=' + encodeURIComponent(next) : ''
  const score = strength(password)

  useSessionCheck()

  useEffect(() => {
    document.title = (isLogin ? '登录' : '注册') + ' · 化州橘红博览馆'
  }, [isLogin])

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')

    if (!isLogin && password !== confirm) {
      setError('两次输入的密码不一致。')
      return
    }

    setBusy(true)
    try {
      const result = isLogin
        ? await shopApi.login({ phone: phone.trim(), password })
        : await shopApi.register({ name: name.trim(), phone: phone.trim(), password })
      setSession(result)
      navigate(next, { replace: true })
    } catch (caught) {
      setError(toShopError(caught).message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="shop shop--auth">
      <div className="auth">
        <aside className="auth__visual">
          <img src="/img/hero.jpg" alt="化橘红果实" />
        </aside>

        <section className="auth__panel">
          <div className="auth__box">
          <div className="auth__top">
            <Link className="auth__brand" to="/">
              <span className="brand__seal zhu" aria-hidden="true">橘</span>
              化州橘红博览馆
            </Link>
            <Link className="auth__back" to="/products">← 返回产品中心</Link>
          </div>
          {session ? (
            <div className="auth__done">
              <h1>已登录</h1>
              <p>当前账号：{session.user.name} · {session.user.phone.slice(0, 3)}****{session.user.phone.slice(7)}</p>
              <div className="auth__done-acts">
                <Link className="btn btn--solid" to={next}>{next === '/checkout' ? '去结算' : '继续'}</Link>
                <Link className="btn" to="/account">我的账户</Link>
              </div>
            </div>
          ) : (
            <>
              <div className="auth__tabs" aria-label="登录或注册">
                <Link
                  to={'/login' + nextQuery}
                  className={isLogin ? 'is-on' : ''}
                  aria-current={isLogin ? 'page' : undefined}
                >
                  登录
                </Link>
                <Link
                  to={'/register' + nextQuery}
                  className={!isLogin ? 'is-on' : ''}
                  aria-current={!isLogin ? 'page' : undefined}
                >
                  注册
                </Link>
              </div>

              <h1 className="sr-only">{isLogin ? '登录' : '注册'}</h1>

              <form className="auth__form" onSubmit={(event) => void submit(event)} noValidate>
                {!isLogin ? (
                  <label className="field">
                    <span className="field__label">称呼</span>
                    <input
                      className="input"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="2–16 个字"
                      autoComplete="name"
                      maxLength={16}
                      required
                    />
                  </label>
                ) : null}

                <label className="field">
                  <span className="field__label">手机号</span>
                  <input
                    className="input"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value.replace(/\D/g, '').slice(0, 11))}
                    placeholder="11 位手机号"
                    inputMode="numeric"
                    autoComplete="tel"
                    maxLength={11}
                    required
                  />
                </label>

                <label className="field">
                  <span className="field__label">密码</span>
                  <span className="field__wrap">
                    <input
                      className="input"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder={isLogin ? '输入密码' : '至少 8 位，含字母和数字'}
                      autoComplete={isLogin ? 'current-password' : 'new-password'}
                      required
                    />
                    <button
                      type="button"
                      className="field__eye"
                      onClick={() => setShowPassword((now) => !now)}
                      aria-label={showPassword ? '隐藏密码' : '显示密码'}
                    >
                      {showPassword ? '隐藏' : '显示'}
                    </button>
                  </span>
                  {!isLogin ? (
                    <span className="pwd-meter" aria-label={'密码强度 ' + score + ' / 3'}>
                      <i className={score >= 1 ? 'is-on' : ''} />
                      <i className={score >= 2 ? 'is-on' : ''} />
                      <i className={score >= 3 ? 'is-on' : ''} />
                      <em>{score === 0 ? '至少 8 位' : score === 1 ? '再加数字或字母' : score === 2 ? '强度够用' : '很强'}</em>
                    </span>
                  ) : null}
                </label>

                {!isLogin ? (
                  <label className="field">
                    <span className="field__label">确认密码</span>
                    <input
                      className="input"
                      type={showPassword ? 'text' : 'password'}
                      value={confirm}
                      onChange={(event) => setConfirm(event.target.value)}
                      placeholder="再输入一次"
                      autoComplete="new-password"
                      required
                    />
                  </label>
                ) : null}

                {error ? <p className="auth__error" role="alert">{error}</p> : null}

                <button type="submit" className="btn btn--solid btn--wide" disabled={busy}>
                  {busy ? '处理中…' : isLogin ? '登录' : '注册'}
                </button>
              </form>

            </>
          )}
          </div>
        </section>
      </div>
    </div>
  )
}
