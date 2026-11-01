import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigationType } from 'react-router'
import { initClickTracking, trackPageView } from '../../lib/track'
import '../../styles/shell.css'
import '../../styles/paper.css'

// 一级导航按参观动线排：序厅 → 园区 → 博物馆 → 工艺 → 企业 → 产品。
const NAV = [
  { to: '/', label: '序厅', end: true },
  { to: '/park', label: '园区' },
  { to: '/museum', label: '博物馆' },
  { to: '/craft', label: '工艺' },
  { to: '/enterprises', label: '企业地图' },
  { to: '/products', label: '产品中心' },
]

// 页头的印按展厅换字；购物流程都算产品中心
const HALL_SEALS: [RegExp, string][] = [
  [/^\/park/, '园'],
  [/^\/museum/, '馆'],
  [/^\/craft/, '艺'],
  [/^\/enterprises/, '企'],
  [/^\/vr/, '景'],
  [/^\/history/, '史'],
  [/^\/(products|cart|checkout|pay|orders|order|account)(\/|$)/, '品'],
]

function hallSeal(pathname: string) {
  return HALL_SEALS.find(([pattern]) => pattern.test(pathname))?.[1] ?? '序'
}

const TITLES: Record<string, string> = {
  '/': '序厅',
  '/park': '园区展示',
  '/museum': '博物馆',
  '/history': '史料区',
  '/enterprises': '企业地图',
  '/products': '产品中心',
  '/cart': '购物车',
  '/checkout': '结算',
  '/orders': '我的订单',
  '/account': '账户',
  '/login': '登录',
  '/register': '注册',
  '/craft': '工艺',
  '/vr': 'VR 全景',
}

const SITE_TITLE = '化州橘红博览馆'
const NOTICE_KEY = 'hjh-notice-closed'
// 库里的旧公告还写着演示说明：这类文字不上页面，其余公告照常显示
const NOT_FOR_SITE = /毕业设计|毕设|非官方|用于演示|仅作学习|整理自/
// 库里的 site.title 还是课题名（同一份清单）：这个值不上页面，后台改成别的就照常用
const TITLE_NOT_FOR_SITE = /数字化展示系统/

export default function SiteShell() {
  const { pathname, hash } = useLocation()
  const navigationType = useNavigationType()
  const [siteTitle, setSiteTitle] = useState(SITE_TITLE)
  const [notice, setNotice] = useState('')

  // 站点标题与公告可在后台改；接口失败就用写死的标题，不显示公告
  useEffect(() => {
    let alive = true
    fetch('/api/content/settings')
      .then((response) => (response.ok ? response.json() : null))
      .then((payload: { values?: Record<string, string> } | null) => {
        if (!alive || !payload?.values) return
        const title = payload.values['site.title']?.trim()
        if (title && !TITLE_NOT_FOR_SITE.test(title)) setSiteTitle(title)
        const text = payload.values['site.notice']?.trim()
        let closed: string | null = null
        try {
          closed = sessionStorage.getItem(NOTICE_KEY)
        } catch {
          closed = null
        }
        if (text && text !== closed && !NOT_FOR_SITE.test(text)) setNotice(text)
      })
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [])

  const closeNotice = () => {
    try {
      sessionStorage.setItem(NOTICE_KEY, notice)
    } catch {
      // 存不下就只关这一次
    }
    setNotice('')
  }

  // 换页回到顶部：不这么做的话，从长页（园区）点「接着去看博物馆」会保留滚动位置，
  // 直接落在新页中段。带 #hash 的地址不动，交给页面自己滚到锚点。
  useEffect(() => {
    if (hash) return
    // 从阅读页退回史料列表，列表自己恢复原来的滚动位置
    if (pathname === '/history' && navigationType === 'POP') return
    // html 上有 scroll-behavior: smooth，这里要立刻到顶，否则新页会先停在旧位置再滑上去
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname, hash])

  // 访问统计：进页面记 page_view，离开补一条带停留时长的 page_leave。
  // 只上报匿名 id 与路由；IP 由服务端脱敏后记录，埋点失败不影响页面。
  useEffect(() => trackPageView(pathname, /^\/products\/([^/]+)/.exec(pathname)?.[1]), [pathname])
  useEffect(() => initClickTracking(), [])

  useEffect(() => {
    const prefix = pathname.startsWith('/products/')
      ? '产品详情'
      : pathname.startsWith('/order/')
        ? '订单详情'
        : pathname.startsWith('/pay/')
          ? '付款'
          : undefined
    const label = TITLES[pathname] ?? prefix
    document.title = label ? label + ' · ' + siteTitle : siteTitle
  }, [pathname, siteTitle])

  return (
    <div className="shell">
      <a className="shell-skip" href="#main">跳到正文</a>

      {notice ? (
        <div className="shell-notice" role="status">
          <p>{notice}</p>
          <button type="button" onClick={closeNotice} aria-label="关闭公告">×</button>
        </div>
      ) : null}

      <header className="shell-head">
        <div className="shell-head__in">
          <Link to="/" className="brand" aria-label={siteTitle + ' · 序厅'}>
            <span className="brand__seal zhu" aria-hidden="true">{hallSeal(pathname)}</span>
            <span className="brand__name">{siteTitle}</span>
          </Link>

          <nav className="nav" aria-label="主导航">
            {NAV.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end}>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main id="main" className="shell-main">
        <Outlet />
      </main>

      <footer className="shell-foot">
        <div className="shell-foot__in">
          <p>{siteTitle}</p>
          <nav className="foot-links" aria-label="页脚导航">
            <Link to="/park">园区展示</Link>
            <Link to="/museum">博物馆</Link>
            <Link to="/history">史料区</Link>
            <Link to="/vr">VR 全景</Link>
            <Link to="/craft">工艺</Link>
            <Link to="/enterprises">企业地图</Link>
            <Link to="/products">产品中心</Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}