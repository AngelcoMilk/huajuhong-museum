import { Suspense, lazy, useCallback, useEffect, useRef, useState } from "react";
import { Link, Navigate, NavLink, Route, Routes, useLocation, useNavigate, useSearchParams } from "react-router";
import {
  BookOpen,
  Building2,
  ChevronsUpDown,
  ClipboardList,
  ExternalLink,
  FileClock,
  FileText,
  Globe,
  KeyRound,
  LayoutDashboard,
  Lock,
  LogOut,
  MessageSquare,
  Moon,
  Package,
  PanelLeft,
  Search,
  ServerCog,
  Settings2,
  ShoppingBag,
  SlidersHorizontal,
  Sun,
  UserRound,
  Users,
} from "lucide-react";
import "./tokens.css";
import "./admin.css";
import type { LucideIcon } from "lucide-react";
import { afterLoginPath, api, setMustChangePasswordHandler, setUnauthorizedHandler, type AdminUser } from "./api";
import { AuthContext, ROLE_LABEL } from "./auth";
import { forwardPointer, Glass, useGlassPointer, useSlidingThumb } from "./glass";
import { SearchBox } from "./list";
import { Card, Drawer, Empty, ErrorBar, Loading, Menu, money, PageHeadSlot, Skeleton, Toaster, useAsync } from "./ui";

const Login = lazy(() => import("./pages/Login"));
const ForcePassword = lazy(() => import("./pages/ForcePassword"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Content = lazy(() => import("./pages/Content"));
const ArticleEditor = lazy(() => import("./pages/ArticleEditor"));
const Knowledge = lazy(() => import("./pages/Knowledge"));
const Sessions = lazy(() => import("./pages/Sessions"));
const Orders = lazy(() => import("./pages/Orders"));
const Products = lazy(() => import("./pages/Products"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const ProductNew = lazy(() => import("./pages/ProductDetail").then((m) => ({ default: m.ProductNew })));
const Customers = lazy(() => import("./pages/Customers"));
const Enterprises = lazy(() => import("./pages/Enterprises"));
const VrScenes = lazy(() => import("./pages/VrScenes"));
const Guide = lazy(() => import("./pages/Guide"));
const Providers = lazy(() => import("./pages/Providers"));
const SystemSettings = lazy(() => import("./pages/SystemSettings"));
const Audit = lazy(() => import("./pages/Audit"));
const Account = lazy(() => import("./pages/Account"));

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
  /** 运营能进的页面。不写就是只有管理员能进，新页面默认不开放 */
  operator?: boolean;
}

// 同一种对象只在一个页面管：按「这件事属于哪条工作流」分组
const NAV_GROUPS: Array<{ label: string; items: NavItem[] }> = [
  {
    label: "总览",
    items: [{ to: "/admin", label: "仪表板", icon: LayoutDashboard, end: true, operator: true }],
  },
  {
    label: "展陈",
    items: [
      { to: "/admin/content", label: "展项管理", icon: FileText },
      { to: "/admin/enterprises", label: "企业名录", icon: Building2 },
      { to: "/admin/vr", label: "VR 全景", icon: Globe },
    ],
  },
  {
    label: "讲解员",
    items: [
      { to: "/admin/guide", label: "讲解员", icon: SlidersHorizontal },
      { to: "/admin/sessions", label: "会话记录", icon: MessageSquare },
      { to: "/admin/kb", label: "知识库", icon: BookOpen },
    ],
  },
  {
    label: "商城",
    items: [
      { to: "/admin/orders", label: "订单", icon: ShoppingBag, operator: true },
      { to: "/admin/products", label: "商品与库存", icon: Package },
      { to: "/admin/customers", label: "客户", icon: Users },
    ],
  },
  {
    label: "系统",
    items: [
      { to: "/admin/settings/providers", label: "模型供应商", icon: ServerCog },
      { to: "/admin/settings/system", label: "系统设置", icon: Settings2 },
      { to: "/admin/settings/audit", label: "操作日志", icon: FileClock },
      { to: "/admin/account", label: "账号", icon: UserRound, operator: true },
    ],
  },
];

const TABS: NavItem[] = [
  { to: "/admin", label: "仪表板", icon: LayoutDashboard, end: true },
  { to: "/admin/content", label: "展项", icon: FileText },
  { to: "/admin/sessions", label: "会话", icon: MessageSquare },
  { to: "/admin/orders", label: "订单", icon: ClipboardList },
  { to: "/admin/kb", label: "知识库", icon: BookOpen },
];

const OPERATOR_TABS: NavItem[] = [
  { to: "/admin", label: "仪表板", icon: LayoutDashboard, end: true },
  { to: "/admin/orders", label: "订单", icon: ClipboardList },
  { to: "/admin/account", label: "账号", icon: UserRound },
];

const ALL_NAV = NAV_GROUPS.flatMap((group) => group.items);

type Theme = "light" | "dark";

const STATUS_LABEL: Record<string, string> = {
  pending_payment: "待付款",
  paid: "已付款",
  shipped: "已发货",
  completed: "已完成",
  cancelled: "已取消",
};

function readTheme(): Theme {
  try {
    const saved = localStorage.getItem("my-theme");
    if (saved === "light" || saved === "dark") return saved;
  } catch {
    /* ignore */
  }
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function readCollapsed(): boolean {
  try {
    return localStorage.getItem("admin-side-collapsed") === "1";
  } catch {
    return false;
  }
}

// 登录成功的那一刻路由还停在 /admin/login，这里接住，否则会落进兜底路由回首页，丢掉 next
function AfterLogin() {
  const [params] = useSearchParams();
  return <Navigate to={afterLoginPath(params.get("next"))} replace />;
}

export default function AdminApp() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [checked, setChecked] = useState(false);
  const [theme, setTheme] = useState<Theme>(readTheme);
  const [collapsed, setCollapsed] = useState(readCollapsed);
  const [navOpen, setNavOpen] = useState(false);
  const [mobile, setMobile] = useState(() => window.matchMedia("(max-width: 767px)").matches);
  const [animating, setAnimating] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [headSlot, setHeadSlot] = useState<HTMLDivElement | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const navRef = useRef<HTMLDivElement | null>(null);
  const lensRef = useRef<HTMLSpanElement | null>(null);
  useSlidingThumb(navRef, lensRef, "a.active", [location.pathname, collapsed, Boolean(user)]);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px)");
    const onChange = (event: MediaQueryListEvent) => setMobile(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);
  useGlassPointer();

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem("my-theme", theme);
    } catch {
      /* ignore */
    }
    // 画在 canvas 上的图表拿不到 CSS 变量，靠这个事件重新取色
    window.dispatchEvent(new Event("my-theme-change"));
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem("admin-side-collapsed", collapsed ? "1" : "0");
    } catch {
      /* ignore */
    }
  }, [collapsed]);

  // 手机抽屉：切页后收起；入口多于一屏时把当前项滚进侧栏视野
  useEffect(() => {
    setNavOpen(false);
    setMenuAnchor(null);
    navRef.current?.querySelector("a.active")?.scrollIntoView({ block: "nearest" });
  }, [location.pathname]);

  useEffect(() => {
    setUnauthorizedHandler(() => setUser(null));
    // 别的标签页刚被要求改密时，这边下一个请求会撞上 403
    setMustChangePasswordHandler(() => setUser((prev) => (prev ? { ...prev, mustChangePassword: true } : prev)));
    return () => {
      setUnauthorizedHandler(null);
      setMustChangePasswordHandler(null);
    };
  }, []);

  // 登录态在 HttpOnly Cookie 里，脚本看不到，只能问一次服务端
  useEffect(() => {
    api
      .me()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setChecked(true));
  }, []);

  // 角色可能刚被管理员改过：切页时重取一次，侧栏马上跟着变；停用或重置后这里会 401 退回登录
  const pathname = location.pathname;
  const signedIn = Boolean(user);
  useEffect(() => {
    if (!signedIn) return;
    api
      .me()
      .then((fresh) => setUser((prev) => (prev && prev.role === fresh.role && prev.mustChangePassword === fresh.mustChangePassword ? prev : fresh)))
      .catch(() => undefined);
  }, [pathname, signedIn]);

  const closeMenu = useCallback(() => setMenuAnchor(null), []);

  if (!checked) {
    return (
      <div className="admin-root">
        <div className="blobs" />
        <div style={{ padding: 48, position: "relative", zIndex: 1 }}>
          <Loading rows={3} />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="admin-root">
        <div className="blobs" />
        <Suspense fallback={null}>
          <Login onAuthenticated={setUser} />
        </Suspense>
        <Toaster />
      </div>
    );
  }

  if (user.mustChangePassword) {
    return (
      <div className="admin-root">
        <div className="blobs" />
        <Suspense fallback={null}>
          <ForcePassword
            onLeave={() => {
              void api.logout().catch(() => {});
              setUser(null);
            }}
          />
        </Suspense>
        <Toaster />
      </div>
    );
  }

  // 详情页（/admin/products/:id）跟随它所属的栏目
  const path = location.pathname.replace(/\/+$/, "");
  const matched =
    ALL_NAV.find((item) => item.to === path) ??
    ALL_NAV.filter((item) => !item.end && path.startsWith(`${item.to}/`)).sort((a, b) => b.to.length - a.to.length)[0];
  const meta = matched ?? ALL_NAV[0];
  const initial = user.username.slice(0, 1).toUpperCase();
  const isAdmin = user.permissions.includes("*");
  const roleLabel = ROLE_LABEL[user.role];
  // 所在页面运营不能进（不在导航里的页面默认如此），整页换成提示，不渲染也就不会请求。/commerce 是订单的旧地址
  const forbidden = !isAdmin && !matched?.operator && path !== "/admin/commerce" && path !== "/admin/login";
  const navGroups = isAdmin ? NAV_GROUPS : NAV_GROUPS.map((group) => ({ ...group, items: group.items.filter((item) => item.operator) })).filter((group) => group.items.length > 0);
  const tabs = isAdmin ? TABS : OPERATOR_TABS;

  function toggleSide() {
    if (mobile) setNavOpen((open) => !open);
    else {
      setAnimating(true);
      setCollapsed((value) => !value);
      window.setTimeout(() => setAnimating(false), 320);
    }
  }

  function toggleMenu(event: React.MouseEvent<HTMLElement>) {
    const target = event.currentTarget;
    setMenuAnchor((current) => (current === target ? null : target));
  }

  return (
    <AuthContext.Provider value={user}>
    <PageHeadSlot.Provider value={headSlot}>
    <div className="admin-root">
      <div className="blobs" />
      <div className="admin-shell" data-collapsed={collapsed} data-animating={animating}>
        <Glass as="header" className="topbar">
          <button
            type="button"
            className="icon-btn"
            aria-label={mobile ? (navOpen ? "关闭导航" : "打开导航") : collapsed ? "展开侧栏" : "收起侧栏"}
            aria-expanded={mobile ? navOpen : !collapsed}
            onClick={toggleSide}
          >
            <PanelLeft size={20} strokeWidth={1.75} />
          </button>
          <div className="topbar__brand">
            <div className="topbar__mark" aria-hidden="true">橘</div>
            <div className="topbar__name">
              化橘红博览馆<span> · 管理中心</span>
            </div>
          </div>
          <div className="topbar__actions">
            {isAdmin && (
              <button
                type="button"
                className="icon-btn"
                aria-label="全局检索"
                title="检索客户 / 订单 / 内容"
                onClick={() => setSearchOpen(true)}
              >
                <Search size={20} strokeWidth={1.75} />
              </button>
            )}
            <a className="icon-btn" href="/" target="_blank" rel="noopener noreferrer" aria-label="查看前台" title="查看前台">
              <ExternalLink size={20} strokeWidth={1.75} />
            </a>
            <button
              type="button"
              className="icon-btn"
              aria-label={theme === "dark" ? "切到浅色" : "切到深色"}
              title={theme === "dark" ? "切到浅色" : "切到深色"}
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <Sun size={20} strokeWidth={1.75} /> : <Moon size={20} strokeWidth={1.75} />}
            </button>
            <button type="button" className="avatar" aria-label="账号菜单" aria-haspopup="menu" onClick={toggleMenu} style={{ marginLeft: 4 }}>
              {initial}
            </button>
          </div>
        </Glass>

        {navOpen && <div className="nav-scrim" onClick={() => setNavOpen(false)} />}
        <Glass as="aside" className="sidebar" refract data-open={navOpen}>
          <nav className="side-nav" aria-label="后台主导航" onPointerMove={(e) => forwardPointer(e, lensRef.current)}>
            <div className="side-nav__inner" ref={navRef}>
              <span ref={lensRef} className="glass-thumb side-lens" aria-hidden="true" />
              {navGroups.map((group) => (
                <div key={group.label} style={{ display: "contents" }}>
                  <div className="side-group">{group.label}</div>
                  {group.items.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.end}
                      title={collapsed ? item.label : undefined}
                      className={({ isActive }) => (isActive ? "side-link active" : "side-link")}
                    >
                      <item.icon size={20} strokeWidth={1.75} aria-hidden />
                      <span>{item.label}</span>
                    </NavLink>
                  ))}
                </div>
              ))}
            </div>
          </nav>
          <button type="button" className="side-user" aria-label="账号菜单" aria-haspopup="menu" onClick={toggleMenu}>
            <span className="avatar" aria-hidden="true">{initial}</span>
            <span className="side-user__text">
              <b>{user.username}</b>
              <span>{roleLabel}</span>
            </span>
            <ChevronsUpDown size={16} strokeWidth={1.75} aria-hidden />
          </button>
        </Glass>

        <main className="admin-main">
          <div className="admin-body" key={location.pathname}>
            <div className="page-head">
              <h1>{forbidden ? "没有权限" : meta.label}</h1>
              <div className="page-head__extra" ref={setHeadSlot} />
            </div>
            {forbidden ? (
              <Card>
                <Empty icon={<Lock size={40} strokeWidth={1.5} aria-hidden />} action={<Link className="btn btn-tonal btn-sm" to="/admin">回到仪表板</Link>}>
                  你的账号不能查看这个页面。需要的话请联系管理员。
                </Empty>
              </Card>
            ) : (
            <Suspense fallback={<Loading rows={4} />}>
              <Routes>
                <Route index element={<Dashboard />} />
                <Route path="content" element={<Content />} />
                <Route path="content/new" element={<ArticleEditor />} />
                <Route path="content/edit/:id" element={<ArticleEditor />} />
                <Route path="enterprises" element={<Enterprises />} />
                <Route path="vr" element={<VrScenes />} />
                <Route path="guide" element={<Guide />} />
                <Route path="guide/playground" element={<Navigate to="/admin/guide" replace />} />
                <Route path="guide/config" element={<Navigate to="/admin/guide" replace />} />
                <Route path="sessions" element={<Sessions />} />
                <Route path="kb" element={<Knowledge />} />
                <Route path="orders" element={<Orders />} />
                <Route path="products" element={<Products />} />
                <Route path="products/new" element={<ProductNew />} />
                <Route path="products/:id" element={<ProductDetail />} />
                <Route path="customers" element={<Customers />} />
                <Route path="settings/providers" element={<Providers />} />
                <Route path="settings/system" element={<SystemSettings />} />
                <Route path="settings/audit" element={<Audit />} />
                <Route path="account" element={<Account />} />
                {/* 旧书签不失效 */}
                <Route path="commerce" element={<Navigate to="/admin/orders" replace />} />
                <Route path="settings" element={<Navigate to="/admin/settings/providers" replace />} />
                <Route path="login" element={<AfterLogin />} />
                <Route path="*" element={<Navigate to="/admin" replace />} />
              </Routes>
            </Suspense>
            )}
          </div>
        </main>

        <Glass as="nav" className="tabbar" aria-label="常用入口">
          {tabs.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => (isActive ? "tabbar__link active" : "tabbar__link")}>
              <item.icon size={20} strokeWidth={1.75} aria-hidden />
              {item.label}
            </NavLink>
          ))}
        </Glass>
      </div>

      {menuAnchor && (
        <Menu anchor={menuAnchor} onClose={closeMenu} label="账号菜单">
          <div className="menu__head">
            <b>{user.username}</b>
            <span>{roleLabel}</span>
          </div>
          <Link className="menu-item" role="menuitem" to="/admin/account" onClick={closeMenu}>
            <UserRound size={18} strokeWidth={1.75} aria-hidden />
            账号设置
          </Link>
          <Link className="menu-item" role="menuitem" to="/admin/account#password" onClick={closeMenu}>
            <KeyRound size={18} strokeWidth={1.75} aria-hidden />
            修改密码
          </Link>
          <button
            type="button"
            className="menu-item menu-item--danger"
            role="menuitem"
            onClick={() => {
              closeMenu();
              // 接口失败也照常退回登录页
              void api.logout().catch(() => {});
              setUser(null);
              navigate("/admin");
            }}
          >
            <LogOut size={18} strokeWidth={1.75} aria-hidden />
            退出登录
          </button>
        </Menu>
      )}

      {searchOpen && isAdmin && <GlobalSearch onClose={() => setSearchOpen(false)} />}

      <Toaster />
    </div>
    </PageHeadSlot.Provider>
    </AuthContext.Provider>
  );
}

/** 全局检索：边输边查，结果点进对应列表 */
function GlobalSearch({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const [term, setTerm] = useState("");
  const result = useAsync(() => (term ? api.adminSearch(term) : Promise.resolve(null)), [term]);
  const data = result.data;
  const empty = data && data.customers.length === 0 && data.orders.length === 0 && data.items.length === 0;

  function go(url: string) {
    onClose();
    navigate(url);
  }

  return (
    <Drawer variant="dialog" title="全局检索" onClose={onClose}>
      <SearchBox value={term} onChange={setTerm} placeholder="客户姓名、手机号、订单号或内容标题" />
      {result.loading && term && !data && <Skeleton rows={3} />}
      {/* 搜索失败不能装成「没有匹配」，否则会把网络或鉴权问题带偏 */}
      {result.error && <ErrorBar message={result.error} onRetry={result.reload} />}
      {!term && <Empty compact>输入关键字，查客户、订单和内容。</Empty>}
      {empty && <Empty compact>没有匹配的客户、订单或内容。</Empty>}
      {data && data.customers.length > 0 && (
        <section className="section">
          <div className="section__head">
            <h3>客户（{data.customers.length}）</h3>
          </div>
          <div className="mini-list">
            {data.customers.map((customer) => (
              <button key={customer.id} type="button" className="kv kv--link" onClick={() => go(`/admin/customers?q=${encodeURIComponent(customer.phone)}`)}>
                <span className="kv__main">
                  <span className="dl-ellipsis">{customer.name}</span>
                  <span className="muted mono">{customer.phone}</span>
                </span>
              </button>
            ))}
          </div>
        </section>
      )}
      {data && data.orders.length > 0 && (
        <section className="section">
          <div className="section__head">
            <h3>订单（{data.orders.length}）</h3>
          </div>
          <div className="mini-list">
            {data.orders.map((order) => (
              <button key={order.orderNo} type="button" className="kv kv--link" onClick={() => go(`/admin/orders?q=${encodeURIComponent(order.orderNo)}`)}>
                <span className="kv__main">
                  <span className="mono dl-ellipsis">{order.orderNo}</span>
                  <span className="muted">{STATUS_LABEL[order.status] ?? order.status}</span>
                </span>
                <span className="mono">{money(order.totalCents)}</span>
              </button>
            ))}
          </div>
        </section>
      )}
      {data && data.items.length > 0 && (
        <section className="section">
          <div className="section__head">
            <h3>内容（{data.items.length}）</h3>
          </div>
          <div className="mini-list">
            {data.items.map((item) => (
              <button
                key={item.id}
                type="button"
                className="kv kv--link"
                onClick={() => go(item.board === "product" ? `/admin/products/${encodeURIComponent(item.id)}` : `${item.board === "enterprise" ? "/admin/enterprises" : item.board === "vr" ? "/admin/vr" : "/admin/content"}?q=${encodeURIComponent(item.id)}`)}
              >
                <span className="kv__main">
                  <span className="dl-ellipsis">{item.title}</span>
                  <span className="muted mono">{item.id}</span>
                </span>
              </button>
            ))}
          </div>
        </section>
      )}
    </Drawer>
  );
}
