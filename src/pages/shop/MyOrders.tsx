import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { useAuthStore } from '../../store/useAuthStore';
import { Package, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const MyOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) return;
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await api.get('/orders/my-orders', { params: { page, limit: 10 } });
        setOrders(res.data.data ?? res.data);
        setTotalPages(res.data.meta?.totalPages ?? 1);
      } catch (e) {
        console.error('Error fetching orders', e);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [page, user]);

  if (!user) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <h2>Inicia sesión para ver tus pedidos</h2>
        <Link to="/login" className="btn btn-primary" style={{ marginTop: '1rem' }}>Ir al Login</Link>
      </div>
    );
  }

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'PENDING': return { icon: <Clock size={16} />, color: 'var(--color-warning)', label: 'Pendiente' };
      case 'CONFIRMED': return { icon: <CheckCircle size={16} />, color: 'var(--color-primary)', label: 'Confirmado' };
      case 'SHIPPED': return { icon: <Package size={16} />, color: 'var(--color-info)', label: 'Enviado' };
      case 'DELIVERED': return { icon: <CheckCircle size={16} />, color: 'var(--color-success)', label: 'Entregado' };
      case 'CANCELLED': return { icon: <XCircle size={16} />, color: 'var(--color-danger)', label: 'Cancelado' };
      default: return { icon: <Clock size={16} />, color: 'var(--color-text-muted)', label: status };
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem', fontFamily: 'var(--font-display)' }}>Mis Pedidos</h1>
      
      {loading ? (
        <div className="skeleton" style={{ height: '300px' }} />
      ) : orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', background: 'var(--color-bg-card)', borderRadius: 'var(--radius-lg)' }}>
          <Package size={48} style={{ color: 'var(--color-text-muted)', marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Aún no tienes pedidos</h3>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>Explora nuestro catálogo y realiza tu primera compra.</p>
          <Link to="/" className="btn btn-primary">Ir a la tienda</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {orders.map(order => {
            const statusInfo = getStatusInfo(order.status);
            return (
              <div key={order.id} className="card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>Pedido #{order.orderNumber}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                      {new Date(order.createdAt).toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: statusInfo.color, fontWeight: 600, background: 'var(--color-bg-subtle)', padding: '0.25rem 0.75rem', borderRadius: '999px' }}>
                    {statusInfo.icon} {statusInfo.label}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {order.items?.map((item: any) => (
                    <div key={item.id} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <img src={item.product?.image_url_webp || 'https://via.placeholder.com/60?text=Kovera'} alt="" style={{ width: 60, height: 60, objectFit: 'contain', borderRadius: 'var(--radius-md)' }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{item.product?.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                          Cant: {item.quantity} | {item.variationDetails}
                        </div>
                      </div>
                      <div style={{ fontWeight: 700 }}>
                        S/ {Number(item.subtotal).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
                  <div style={{ fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--color-text-secondary)' }}>Método de pago: </span>
                    <strong>{order.paymentMethod === 'credit_card' ? 'Tarjeta de crédito/débito' : order.paymentMethod}</strong>
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                    Total: S/ {Number(order.totalAmount).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem' }}>
          <button className="btn btn-outline btn-sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Ant</button>
          <span style={{ display: 'flex', alignItems: 'center', fontWeight: 600, fontSize: '0.9rem' }}>{page} / {totalPages}</span>
          <button className="btn btn-outline btn-sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Sig</button>
        </div>
      )}
    </div>
  );
};
