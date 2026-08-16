import { Link } from 'react-router-dom';
import { useCartStore } from '../../store/useCartStore';
import { Trash2, ShoppingBag, Plus, Minus } from 'lucide-react';

export const Cart = () => {
  const { items, removeItem, updateQuantity, clearCart, getTotals } = useCartStore();
  const { total, count } = getTotals();

  if (items.length === 0) return (
    <div className="empty-state" style={{ minHeight: '60vh' }}>
      <ShoppingBag size={72} style={{ opacity: 0.2, marginBottom: '1rem' }} />
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Tu carrito está vacío</h2>
      <p style={{ marginTop: '0.5rem', color: 'var(--color-text-secondary)' }}>Agrega productos desde el catálogo para continuar.</p>
      <Link to="/" className="btn btn-primary" style={{ marginTop: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
        ← Ver catálogo
      </Link>
    </div>
  );

  return (
    <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }}>
      {/* Items */}
      <div>
        <div className="page-header">
          <h1 className="page-title">Carrito ({count} {count === 1 ? 'item' : 'items'})</h1>
          <button className="btn btn-outline btn-sm" onClick={clearCart} style={{ color: 'var(--color-danger)', borderColor: 'var(--color-danger)' }}>
            Vaciar carrito
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {items.map((item) => (
            <div key={`${item.productId}-${item.variationId}`} className="card" style={{ padding: '1.25rem', display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
              {/* Image */}
              <div style={{ width: 90, height: 90, background: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-md)', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '0.5rem' }} />
                ) : <span style={{ fontSize: '2rem' }}>📦</span>}
              </div>

              {/* Info */}
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.2rem' }}>{item.name}</p>
                <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>SKU: {item.sku}</p>
                <p style={{ fontWeight: 800, fontSize: '1.1rem', fontFamily: "'Outfit', sans-serif", marginTop: '0.5rem', color: 'var(--color-primary)' }}>
                  S/ {Number(item.price).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                </p>
              </div>

              {/* Quantity */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-md)', padding: '0.25rem 0.5rem' }}>
                <button
                  onClick={() => updateQuantity(item.productId, item.variationId, item.quantity - 1)}
                  className="btn btn-sm"
                  style={{ padding: '0.25rem', background: 'none', border: 'none', cursor: 'pointer' }}
                  aria-label="Reducir cantidad"
                >
                  <Minus size={14} />
                </button>
                <span style={{ fontWeight: 700, minWidth: '24px', textAlign: 'center', fontSize: '0.95rem' }}>{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.productId, item.variationId, item.quantity + 1)}
                  className="btn btn-sm"
                  style={{ padding: '0.25rem', background: 'none', border: 'none', cursor: 'pointer' }}
                  aria-label="Aumentar cantidad"
                >
                  <Plus size={14} />
                </button>
              </div>

              {/* Subtotal */}
              <div style={{ textAlign: 'right', minWidth: '100px' }}>
                <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>Subtotal</p>
                <p style={{ fontWeight: 800, fontSize: '1.1rem', fontFamily: "'Outfit', sans-serif" }}>
                  S/ {(item.price * item.quantity).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                </p>
              </div>

              {/* Remove */}
              <button
                onClick={() => removeItem(item.productId, item.variationId)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', padding: '0.5rem' }}
                aria-label="Eliminar del carrito"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Order Summary */}
      <div className="card" style={{ padding: '1.5rem', position: 'sticky', top: '100px' }}>
        <h2 style={{ fontWeight: 700, marginBottom: '1.25rem', fontSize: '1.1rem' }}>Resumen del pedido</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
            <span style={{ color: 'var(--color-text-secondary)' }}>Subtotal ({count} items)</span>
            <span>S/ {total.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
            <span style={{ color: 'var(--color-text-secondary)' }}>Envío</span>
            <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>{total >= 500 ? 'GRATIS' : 'S/ 25.00'}</span>
          </div>
          {total < 500 && (
            <p style={{ fontSize: '0.78rem', color: 'var(--color-accent)', background: '#eff6ff', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)' }}>
              ¡Agrega S/ {(500 - total).toFixed(2)} más para envío gratis!
            </p>
          )}
          <div className="divider" />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.2rem', fontFamily: "'Outfit', sans-serif" }}>
            <span>Total</span>
            <span>S/ {(total + (total >= 500 ? 0 : 25)).toLocaleString('es-PE', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>
        <Link to="/checkout" className="btn btn-primary btn-lg" style={{ width: '100%', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
          Proceder al checkout →
        </Link>
        <Link to="/" style={{ display: 'block', textAlign: 'center', marginTop: '1rem', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
          ← Seguir comprando
        </Link>
      </div>
    </div>
  );
};
