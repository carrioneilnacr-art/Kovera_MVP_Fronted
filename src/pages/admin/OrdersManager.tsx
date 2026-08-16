import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { RefreshCw, XCircle, CheckCircle } from 'lucide-react';

export const OrdersManager = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await api.get('/orders');
      setOrders(res.data || []);
    } catch { /* silence */ }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const handleCancel = async (id: string) => {
    if (!confirm('¿Cancelar esta orden? El stock será revertido automáticamente.')) return;
    try {
      await api.put(`/orders/${id}/cancel`);
      fetch();
    } catch (err: any) {
      alert(err?.response?.data?.message ?? 'Error al cancelar');
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await api.put(`/orders/${id}/status`, { status });
      fetch();
    } catch (err: any) {
      alert(err?.response?.data?.message ?? 'Error al actualizar estado');
    }
  };

  const statusOptions = ['pending', 'paid', 'shipped', 'cancelled'];
  const statusLabels: Record<string, string> = { pending: 'Pendiente', paid: 'Pagado', shipped: 'Enviado', cancelled: 'Cancelado' };

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);
  const totalRevenue = orders.filter(o => o.status === 'paid' || o.status === 'shipped')
    .reduce((s, o) => s + Number(o.total_amount ?? 0), 0);

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Órdenes</h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
            {orders.length} órdenes totales · Ingresos confirmados: <strong style={{ color: 'var(--color-success)' }}>S/ {totalRevenue.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</strong>
          </p>
        </div>
        <button className="btn btn-outline btn-sm" onClick={fetch} aria-label="Refrescar">
          <RefreshCw size={15} />
        </button>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', background: 'var(--color-bg-subtle)', padding: '0.375rem', borderRadius: 'var(--radius-md)', width: 'fit-content' }}>
        {['all', ...statusOptions].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className="btn btn-sm"
            style={{
              borderRadius: 'var(--radius-sm)',
              background: filter === s ? 'var(--color-bg-card)' : 'transparent',
              color: filter === s ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
              boxShadow: filter === s ? 'var(--shadow-sm)' : 'none',
              border: 'none',
            }}
          >
            {s === 'all' ? 'Todos' : statusLabels[s]}
            <span style={{ marginLeft: '0.35rem', fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
              ({s === 'all' ? orders.length : orders.filter(o => o.status === s).length})
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: '60px', borderRadius: 'var(--radius-md)' }} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state" style={{ padding: '3rem' }}>
          <CheckCircle size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
          <p>No hay órdenes en este estado</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Estado</th>
                <th>Total</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order: any) => (
                <tr key={order.id}>
                  <td><code style={{ fontSize: '0.75rem', background: 'var(--color-bg-subtle)', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>#{order.id}</code></td>
                  <td style={{ color: 'var(--color-text-secondary)', fontSize: '0.88rem' }}>
                    {order.user_id ? `Usuario #${order.user_id}` : order.guest_email ?? 'Invitado'}
                  </td>
                  <td>
                    <select
                      value={order.status}
                      onChange={e => handleUpdateStatus(order.id, e.target.value)}
                      className="input"
                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.78rem', width: 'auto', borderRadius: 'var(--radius-sm)' }}
                      aria-label={`Cambiar estado de orden ${order.id}`}
                    >
                      {statusOptions.map(s => (
                        <option key={s} value={s}>{statusLabels[s]}</option>
                      ))}
                    </select>
                  </td>
                  <td style={{ fontWeight: 700, fontFamily: "'Outfit', sans-serif" }}>
                    S/ {Number(order.total_amount ?? 0).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                  </td>
                  <td style={{ color: 'var(--color-text-muted)', fontSize: '0.82rem' }}>
                    {new Date(order.created_at).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td>
                    {order.status !== 'cancelled' && order.status !== 'shipped' && (
                      <button
                        onClick={() => handleCancel(order.id)}
                        className="btn btn-sm"
                        style={{ background: '#fef2f2', color: 'var(--color-danger)', border: '1px solid #fecaca' }}
                        title="Cancelar orden"
                        aria-label={`Cancelar orden ${order.id}`}
                      >
                        <XCircle size={13} /> Cancelar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
