import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Navigate } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import './index.css'
import { hydrateContent } from './lib/contentHydrate'
import './styles/tokens.css'
import GuideHost from './components/guide/GuideHost.tsx'
import SiteShell from './components/layout/SiteShell.tsx'
import RequireAuth from './components/shop/RequireAuth.tsx'
import ShopLayout from './components/shop/ShopLayout.tsx'
import Account from './pages/Account.tsx'
import AuthPage from './pages/AuthPage.tsx'
import CartPage from './pages/CartPage.tsx'
import Checkout from './pages/Checkout.tsx'
import Craft from './pages/Craft.tsx'
import Home from './pages/Home.tsx'
import OrderDetail from './pages/OrderDetail.tsx'
import Orders from './pages/Orders.tsx'
import Pay from './pages/Pay.tsx'
import ProductDetail from './pages/ProductDetail.tsx'
import Products from './pages/Products.tsx'

// 后台整块独立：不进 SiteShell，单独 chunk
const AdminApp = lazy(() => import('./admin/AdminApp.tsx'))

// 企业地图带着 150 KB 的档案数据和离线底图，单独一个 chunk，别拖累首屏
const Enterprises = lazy(() => import('./pages/Enterprises.tsx'))
// 园区与博物馆各带一份正文数据（园区 3 万字），同样切成独立 chunk
const Park = lazy(() => import('./pages/Park.tsx'))
const Museum = lazy(() => import('./pages/Museum.tsx'))
const Vr = lazy(() => import('./pages/Vr.tsx'))
const History = lazy(() => import('./pages/History.tsx'))
const HistoryArticle = lazy(() => import('./pages/HistoryArticle.tsx'))

/** 懒加载期间留一块纸色垫片，别闪白 */
const hallFallback = <div className="boot-fallback" aria-busy="true" />

const router = createBrowserRouter([
  // 讲解员挂在展示区最外层，见 GuideHost
  {
    element: <GuideHost />,
    children: [
      {
        path: '/',
        element: <SiteShell />,
        children: [
          { index: true, element: <Home /> },
          {
            path: 'park',
            element: <Suspense fallback={hallFallback}><Park /></Suspense>,
          },
          {
            path: 'museum',
            element: <Suspense fallback={hallFallback}><Museum /></Suspense>,
          },
          {
            path: 'history',
            element: <Suspense fallback={hallFallback}><History /></Suspense>,
          },
          {
            path: 'history/:id',
            element: <Suspense fallback={hallFallback}><HistoryArticle /></Suspense>,
          },

          {
            path: 'enterprises',
            element: <Suspense fallback={hallFallback}><Enterprises /></Suspense>,
          },
          {
            path: 'vr',
            element: <Suspense fallback={hallFallback}><Vr /></Suspense>,
          },

          // 产品中心与购物共用一条小栏：浏览公开，结算、付款、订单、账户需要登录。
          {
            element: <ShopLayout />,
            children: [
              { path: 'products', element: <Products /> },
              { path: 'products/:id', element: <ProductDetail /> },
              { path: 'cart', element: <CartPage /> },
              { path: 'checkout', element: <RequireAuth><Checkout /></RequireAuth> },
              { path: 'pay/:orderNo', element: <RequireAuth><Pay /></RequireAuth> },
              { path: 'orders', element: <RequireAuth><Orders /></RequireAuth> },
              { path: 'order/:orderNo', element: <RequireAuth><OrderDetail /></RequireAuth> },
              { path: 'account', element: <RequireAuth><Account /></RequireAuth> },
            ],
          },
          // 旧入口：独立购物页的方案已经并入产品中心，不再单开一页。
          { path: 'shop', element: <Navigate to="/products" replace /> },

          { path: 'craft', element: <Craft /> },
          // 未匹配的地址回序厅，别留一页空白。
          { path: '*', element: <Navigate to="/" replace /> },
        ],
      },
      // 登录、注册独占一屏：不要全站页头、产品中心小栏、页脚和讲解员。
      { path: '/login', element: <AuthPage mode="login" /> },
      { path: '/register', element: <AuthPage mode="register" /> },
    ],
  },
  {
    path: '/admin/*',
    element: (
      <Suspense fallback={<div className="boot-fallback" aria-busy="true" />}>
        <AdminApp />
      </Suspense>
    ),
  },
])

// 先把后台改过的文案水合进静态骨架，再渲染首屏。
// 接口不可用或超时（1.5s）时静默跳过，页面退回构建期数据，不影响打开。
await hydrateContent().catch(() => null)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)