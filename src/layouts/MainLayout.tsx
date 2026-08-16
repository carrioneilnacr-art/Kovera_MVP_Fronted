import { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, Menu, X, Accessibility, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import { useAccessibilityStore } from '../store/useAccessibilityStore';
import { useKoveraSockets } from '../hooks/useKoveraSockets';
import { SearchAutocomplete } from '../components/layout/SearchAutocomplete';
import { Footer } from '../components/layout/Footer';

export const MainLayout = () => {
  const cartCount = useCartStore((s) => s.getTotals().count);
  const { isAuthenticated, user, logout } = useAuthStore();
  const { highContrast, fontSize, toggleHighContrast, increaseFontSize, decreaseFontSize, resetAccessibility } = useAccessibilityStore();
  const navigate = useNavigate();
  useKoveraSockets();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [a11yOpen, setA11yOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  const navLinks = [
    { href: '/', label: 'Catálogo' },
    { href: '/#celulares', label: 'Celulares' },
    { href: '/#laptops', label: 'Laptops' },
    { href: '/#audio', label: 'Audio' },
    { href: '/#gaming', label: 'Gaming' },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--color-bg)', color: 'var(--color-text-primary)' }}>
      {/* Header */}
      <header style={{ background: 'var(--color-bg-card)', borderBottom: '1px solid var(--color-border)', position: 'sticky', top: 0, zIndex: 200 }} role="banner">
        {/* Main nav row */}
        <div className="container" style={{ height: 72, display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', flexShrink: 0 }} aria-label="Ir al inicio de Kovera">
            <svg viewBox="0 0 24 24" fill="none" style={{ width: 30, height: 30, color: 'var(--color-primary)' }} aria-hidden="true">
              <path d="M12 2L2 22h20L12 2z" fill="currentColor" />
            </svg>
            <span style={{ fontSize: '1.4rem', fontWeight: 900, fontFamily: "'Outfit', sans-serif", letterSpacing: '0.1em', color: 'var(--color-text-primary)' }}>KOVERA</span>
          </Link>

          {/* Search */}
          <div style={{ flex: 1, maxWidth: '600px', display: 'flex', justifyContent: 'center' }}>
            <SearchAutocomplete />
          </div>

          {/* Right Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: 'auto', flexShrink: 0 }}>
            {/* Account */}
            {isAuthenticated ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', cursor: 'pointer' }} onClick={handleLogout} role="button" tabIndex={0} aria-label={`Cerrar sesión de ${user?.firstName || user?.email}`} onKeyDown={e => e.key === 'Enter' && handleLogout()}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--color-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem' }}>
                  {(user?.firstName || user?.email || 'A').charAt(0).toUpperCase()}
                </div>
                <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>Salir</span>
              </div>
            ) : (
              <Link to="/login" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', color: 'var(--color-text-primary)', fontSize: '0.72rem' }} aria-label="Iniciar sesión">
                <User size={22} strokeWidth={1.5} aria-hidden="true" />
                <span>Mi cuenta</span>
              </Link>
            )}
            {isAuthenticated && user?.role === 'admin' && (
              <Link to="/admin" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', textDecoration: 'none', color: 'var(--color-accent)', fontSize: '0.72rem' }} aria-label="Panel de administración">
                <User size={22} strokeWidth={1.5} aria-hidden="true" />
                <span>Admin</span>
              </Link>
            )}
            <Link to="/cart" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', textDecoration: 'none', color: 'var(--color-text-primary)', position: 'relative', fontSize: '0.72rem' }} aria-label={`Carrito con ${cartCount} productos`}>
              <div style={{ position: 'relative' }}>
                <ShoppingBag size={22} strokeWidth={1.5} aria-hidden="true" />
                {cartCount > 0 && (
                  <span
                    style={{ position: 'absolute', top: '-8px', right: '-8px', background: 'var(--color-accent)', color: '#fff', fontSize: '0.62rem', fontWeight: 700, width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    aria-hidden="true"
                  >{cartCount}</span>
                )}
              </div>
              <span>Carrito</span>
            </Link>
            {/* Hamburger */}
            <button
              className="hamburger"
              onClick={() => setMobileOpen(o => !o)}
              style={{ marginLeft: '0.5rem' }}
              aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Secondary nav */}
        <nav
          className={`nav-links ${mobileOpen ? 'open' : ''}`}
          aria-label="Navegación principal"
          style={{ borderTop: '1px solid var(--color-border)', position: mobileOpen ? 'absolute' : 'relative', width: '100%', left: 0, top: '100%', zIndex: 100 }}
        >
          <div className="container" style={{ display: 'flex', gap: '0.25rem', padding: '0.5rem 1.5rem', overflowX: 'auto' }}>
            {navLinks.map(({ href, label }) => (
              <Link
                key={label}
                to={href}
                onClick={() => setMobileOpen(false)}
                style={{
                  padding: '0.4rem 0.875rem',
                  borderRadius: '999px',
                  textDecoration: 'none',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: 'var(--color-text-secondary)',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={e => { (e.target as HTMLElement).style.background = 'var(--color-bg-subtle)'; (e.target as HTMLElement).style.color = 'var(--color-text-primary)'; }}
                onMouseLeave={e => { (e.target as HTMLElement).style.background = ''; (e.target as HTMLElement).style.color = 'var(--color-text-secondary)'; }}
              >
                {label}
              </Link>
            ))}
          </div>
        </nav>
      </header>

      {/* Main */}
      <main role="main" id="main-content" style={{ flex: 1, padding: '2rem 0' }}>
        <div className="container">
          <Outlet />
        </div>
      </main>

      {/* Footer modular */}
      <Footer />

      {/* ── Accessibility Panel ── */}
      <div className="a11y-panel" role="region" aria-label="Panel de accesibilidad">
        {a11yOpen && (
          <div className="a11y-menu" role="dialog" aria-label="Opciones de accesibilidad">
            <h3 style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '1rem', color: 'var(--color-text-primary)' }}>
              ♿ Accesibilidad
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {/* High Contrast */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--color-text-primary)' }}>Contraste alto</span>
                <button
                  onClick={toggleHighContrast}
                  role="switch"
                  aria-checked={highContrast}
                  style={{
                    width: 44,
                    height: 24,
                    borderRadius: 999,
                    background: highContrast ? 'var(--color-accent)' : 'var(--color-border)',
                    border: 'none',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'background 0.2s',
                    flexShrink: 0,
                  }}
                >
                  <span style={{ position: 'absolute', width: 18, height: 18, borderRadius: '50%', background: '#fff', top: 3, left: highContrast ? 23 : 3, transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }} />
                </button>
              </div>

              {/* Font Size */}
              <div>
                <p style={{ fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.5rem', color: 'var(--color-text-primary)' }}>
                  Tamaño de texto
                  <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    {fontSize === 'normal' ? 'Normal' : fontSize === 'large' ? 'Grande' : 'Muy grande'}
                  </span>
                </p>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={decreaseFontSize} className="btn btn-outline btn-sm" style={{ flex: 1 }} aria-label="Reducir tamaño de fuente">
                    <ZoomOut size={14} /> A-
                  </button>
                  <button onClick={increaseFontSize} className="btn btn-outline btn-sm" style={{ flex: 1 }} aria-label="Aumentar tamaño de fuente">
                    <ZoomIn size={14} /> A+
                  </button>
                </div>
              </div>

              {/* Reset */}
              <button onClick={resetAccessibility} className="btn btn-outline btn-sm" style={{ width: '100%' }} aria-label="Restablecer configuración de accesibilidad">
                <RotateCcw size={13} /> Restablecer
              </button>

              <div className="divider" />
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                Esta web cumple con <strong>WCAG 2.1 Nivel AA</strong>. Si necesitas asistencia, escríbenos a accessibility@kovera.pe
              </p>
            </div>
          </div>
        )}
        <button
          className="a11y-trigger"
          onClick={() => setA11yOpen(o => !o)}
          aria-label={a11yOpen ? 'Cerrar panel de accesibilidad' : 'Abrir panel de accesibilidad'}
          aria-expanded={a11yOpen}
        >
          <Accessibility size={20} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};
