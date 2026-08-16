import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  ShoppingCart, Package, AlertTriangle, ArrowRight,
  DollarSign,
} from 'lucide-react';

interface DashboardData {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  lowStockCount: number;
  recentOrders: any[];
  lowStockProducts: any[];
  salesChart: { date: string; ventas: number; ordenes: number }[];
}

export const Dashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [ordersRes, productsRes] = await Promise.all([
          api.get('/orders'),
          api.get('/catalog/products', { params: { limit: 100 } }),
        ]);
        const orders: any[] = ordersRes.data || [];
        const products: any[] = productsRes.data?.data || productsRes.data || [];

        const totalRevenue = orders.filter(o => o.status === 'paid' || o.status === 'shipped')
          .reduce((sum, o) => sum + Number(o.total_amount ?? 0), 0);
        const lowStockProds = products.filter(p => Number(p.stock ?? 0) <= 10);

        // Build chart from last 7 days
        const salesChart: { date: string; ventas: number; ordenes: number }[] = [];
        for (let i = 6; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const dateStr = d.toISOString().split('T')[0];
          const dayOrders = orders.filter(o => (o.created_at ?? '').startsWith(dateStr));
          salesChart.push({
            date: d.toLocaleDateString('es-PE', { weekday: 'short', day: 'numeric' }),
            ventas: dayOrders.reduce((s, o) => s + Number(o.total_amount ?? 0), 0),
            ordenes: dayOrders.length,
          });
        }

        setData({
          totalOrders: orders.length,
          totalRevenue,
          totalProducts: products.length,
          lowStockCount: lowStockProds.length,
          recentOrders: orders.slice(0, 5),
          lowStockProducts: lowStockProds.slice(0, 5),
          salesChart,
        });
      } catch { /* silence */ }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      pending: 'badge-warning',
      paid: 'badge-success',
      shipped: 'badge-primary',
      cancelled: 'badge-danger',
    };
    const labels: Record<string, string> = { pending: 'Pendiente', paid: 'Pagado', shipped: 'Enviado', cancelled: 'Cancelado' };
    return <span className={`badge ${map[status] ?? 'badge-gray'}`}>{labels[status] ?? status}</span>;
  };

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="skeleton" style={{ height: '2rem', width: '30%' }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
        {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: '110px', borderRadius: '16px' }} />)}
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }} className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
          {new Date().toLocaleDateString('es-PE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </span>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        {[
          { label: 'Ingresos totales', value: `S/ ${(data?.totalRevenue ?? 0).toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, icon: <DollarSign size={20} />, color: '#3b82f6', bg: '#eff6ff', sub: 'Solo ventas confirmadas' },
          { label: 'Total órdenes', value: String(data?.totalOrders ?? 0), icon: <ShoppingCart size={20} />, color: '#10b981', bg: '#d1fae5', sub: 'Todos los estados' },
          { label: 'Productos activos', value: String(data?.totalProducts ?? 0), icon: <Package size={20} />, color: '#8b5cf6', bg: '#ede9fe', sub: 'En catálogo' },
          { label: 'Stock crítico', value: String(data?.lowStockCount ?? 0), icon: <AlertTriangle size={20} />, color: '#f59e0b', bg: '#fef3c7', sub: '≤ 10 unidades' },
        ].map(({ label, value, icon, color, bg, sub }) => (
          <div key={label} className="kpi-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div className="kpi-label">{label}</div>
              <div className="kpi-icon" style={{ background: bg, color }}>{icon}</div>
            </div>
            <div className="kpi-value">{value}</div>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{sub}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        {/* Sales Chart */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontWeight: 700, fontSize: '1rem' }}>Ventas últimos 7 días</h2>
            <Link to="/admin/orders" style={{ fontSize: '0.82rem', color: 'var(--color-accent)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              Ver órdenes <ArrowRight size={13} />
            </Link>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={data?.salesChart ?? []}>
              <defs>
                <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} tickFormatter={(v) => `S/${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: any) => [`S/ ${v.toLocaleString()}`, 'Ventas']} contentStyle={{ borderRadius: 8, border: '1px solid var(--color-border)' }} />
              <Area type="monotone" dataKey="ventas" stroke="#3b82f6" fill="url(#colorVentas)" strokeWidth={2.5} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Low Stock */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontWeight: 700, fontSize: '1rem' }}>Stock crítico</h2>
            <Link to="/admin/products" style={{ fontSize: '0.82rem', color: 'var(--color-accent)' }}>Ver todos</Link>
          </div>
          {(data?.lowStockProducts ?? []).length === 0 ? (
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', textAlign: 'center', padding: '2rem 0' }}>
              Todos los productos tienen stock suficiente
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {data?.lowStockProducts.map((p: any) => (
                <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid var(--color-border)' }}>
                  <p style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--color-text-primary)', maxWidth: '70%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</p>
                  <span className={`badge ${Number(p.stock) === 0 ? 'badge-danger' : 'badge-warning'}`}>{p.stock} uds.</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontWeight: 700, fontSize: '1rem' }}>Órdenes recientes</h2>
          <Link to="/admin/orders" className="btn btn-outline btn-sm">Ver todas →</Link>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Estado</th>
                <th>Total</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {(data?.recentOrders ?? []).map((order: any) => (
                <tr key={order.id}>
                  <td><code style={{ fontSize: '0.78rem', background: 'var(--color-bg-subtle)', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>#{order.id}</code></td>
                  <td style={{ color: 'var(--color-text-secondary)' }}>{order.user_id ? `Usuario #${order.user_id}` : order.guest_email ?? 'Invitado'}</td>
                  <td>{statusBadge(order.status)}</td>
                  <td style={{ fontWeight: 700 }}>S/ {Number(order.total_amount ?? 0).toLocaleString('es-PE', { minimumFractionDigits: 2 })}</td>
                  <td style={{ color: 'var(--color-text-muted)', fontSize: '0.82rem' }}>{new Date(order.created_at).toLocaleDateString('es-PE')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
