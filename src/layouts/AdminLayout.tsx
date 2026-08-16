import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import {
  LayoutDashboard, Package, FileText, ShoppingCart,
  LogOut, ChevronLeft, ChevronRight, BarChart3, Truck, TrendingUp,
} from 'lucide-react';

export const AdminLayout = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const links = [
    { to: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={18} />, end: true },
    { to: '/admin/analytics', label: 'Analítica', icon: <TrendingUp size={18} /> },
    { to: '/admin/products', label: 'Productos', icon: <Package size={18} /> },
    { to: '/admin/orders', label: 'Órdenes', icon: <ShoppingCart size={18} /> },
    { to: '/admin/invoices', label: 'Facturas', icon: <FileText size={18} /> },
    { to: '/admin/suppliers', label: 'Proveedores', icon: <Truck size={18} /> },
    { to: '/admin/reports', label: 'Reportes', icon: <BarChart3 size={18} /> },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-bg)' }}>
      {/* Sidebar */}
      <aside className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''}`} style={{ zIndex: 100 }}>
        {/* Logo */}
        <div style={{ padding: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: '72px' }}>
          {!collapsed && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden' }}>
              <svg viewBox="0 0 24 24" fill="none" style={{ width: 28, height: 28, color: '#60a5fa', flexShrink: 0 }}>
                <path d="M12 2L2 22h20L12 2z" fill="currentColor" />
              </svg>
              <span style={{ fontWeight: 900, fontSize: '1.1rem', letterSpacing: '0.12em', color: '#fff', fontFamily: "'Outfit', sans-serif" }}>KOVERA</span>
            </div>
          )}
          {collapsed && (
            <svg viewBox="0 0 24 24" fill="none" style={{ width: 28, height: 28, color: '#60a5fa', margin: '0 auto' }}>
              <path d="M12 2L2 22h20L12 2z" fill="currentColor" />
            </svg>
          )}
          <button
            onClick={() => setCollapsed(c => !c)}
            style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '6px', padding: '0.3rem', cursor: 'pointer', color: '#fff', display: 'flex', flexShrink: 0 }}
            aria-label={collapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* User info */}
        {!collapsed && user && (
          <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem', color: '#fff', flexShrink: 0 }}>
                {(user.firstName || user.email || 'A').charAt(0).toUpperCase()}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <p style={{ fontWeight: 600, fontSize: '0.85rem', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.firstName || user.email}</p>
                <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{user.role}</p>
              </div>
            </div>
          </div>
        )}

        {/* Nav Links */}
        <nav style={{ flex: 1, padding: '0.75rem 0' }} role="navigation" aria-label="Menú del panel admin">
          {links.map(({ to, label, icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              title={collapsed ? label : undefined}
            >
              <span style={{ flexShrink: 0 }}>{icon}</span>
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div style={{ padding: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <button
            onClick={handleLogout}
            className="sidebar-link"
            style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', borderRadius: 'var(--radius-sm)', justifyContent: collapsed ? 'center' : 'flex-start' }}
            title={collapsed ? 'Cerrar sesión' : undefined}
          >
            <LogOut size={18} />
            {!collapsed && <span>Cerrar sesión</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, overflow: 'auto' }}>
        {/* Top bar */}
        <header style={{ background: 'var(--color-bg-card)', borderBottom: '1px solid var(--color-border)', padding: '0 1.5rem', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Panel de Administración</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <a href="/" target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm" style={{ fontSize: '0.8rem' }}>
              Ver tienda ↗
            </a>
          </div>
        </header>

        <div style={{ padding: '2rem' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};
