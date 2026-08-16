import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { useAuthStore } from './store/useAuthStore';
import ProductImporter from './pages/admin/ProductImporter';

// ── Code splitting (lazy loading) ──────────────────────
const Home = lazy(() => import('./pages/shop/Home').then(m => ({ default: m.Home })));
const ProductDetail = lazy(() => import('./pages/shop/ProductDetail').then(m => ({ default: m.ProductDetail })));
const Cart = lazy(() => import('./pages/shop/Cart').then(m => ({ default: m.Cart })));
const Checkout = lazy(() => import('./pages/shop/Checkout').then(m => ({ default: m.Checkout })));
const Login = lazy(() => import('./pages/auth/Login').then(m => ({ default: m.Login })));
const MyOrders = lazy(() => import('./pages/shop/MyOrders').then(m => ({ default: m.MyOrders })));
const Dashboard = lazy(() => import('./pages/admin/Dashboard').then(m => ({ default: m.Dashboard })));
const ProductsManager = lazy(() => import('./pages/admin/ProductsManager').then(m => ({ default: m.ProductsManager })));
const OrdersManager = lazy(() => import('./pages/admin/OrdersManager').then(m => ({ default: m.OrdersManager })));
const InvoicesManager = lazy(() => import('./pages/admin/InvoicesManager').then(m => ({ default: m.InvoicesManager })));
const SuppliersManager = lazy(() => import('./pages/admin/SuppliersManager').then(m => ({ default: m.SuppliersManager })));
const Reports = lazy(() => import('./pages/admin/Reports').then(m => ({ default: m.Reports })));
const Analytics = lazy(() => import('./pages/admin/Analytics').then(m => ({ default: m.Analytics })));

// ── Loading fallback ────────────────────────────────────
const PageLoader = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '2rem 0' }}>
    {[1, 2, 3].map(i => (
      <div key={i} className="skeleton" style={{ height: '120px', borderRadius: '16px' }} />
    ))}
  </div>
);

// ── Protected Route ─────────────────────────────────────
const ProtectedRoute = ({ children, requiredRole }: { children: React.ReactNode; requiredRole?: 'admin' }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (requiredRole && user?.role !== requiredRole) return <Navigate to="/" replace />;
  return children;
};

function App() {
  return (
    <Router>
      <Suspense fallback={<div className="container"><PageLoader /></div>}>
        <Routes>
          {/* Public storefront */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="p/:sku" element={<ProductDetail />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="my-orders" element={<MyOrders />} />
            <Route path="login" element={<Login />} />
          </Route>

          {/* Admin panel */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="/admin/importador" element={<ProductImporter />} />
            <Route path="products" element={<ProductsManager />} />
            <Route path="orders" element={<OrdersManager />} />
            <Route path="invoices" element={<InvoicesManager />} />
            <Route path="suppliers" element={<SuppliersManager />} />
            <Route path="reports" element={<Reports />} />
            <Route path="analytics" element={<Analytics />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
