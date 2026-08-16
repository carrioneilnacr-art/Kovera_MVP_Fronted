import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

export const Reports = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [ordRes, prodRes] = await Promise.all([
          api.get('/orders'),
          api.get('/catalog/products', { params: { limit: 100 } }),
        ]);
        setOrders(ordRes.data || []);
        setProducts(prodRes.data?.data ?? prodRes.data ?? []);
      } catch { /* silence */ }
      finally { setLoading(false); }
    };
    load();
  }, []);

  // Orders by status
  const ordersByStatus = ['pending', 'paid', 'shipped', 'cancelled'].map(s => ({
    name: { pending: 'Pendiente', paid: 'Pagado', shipped: 'Enviado', cancelled: 'Cancelado' }[s] ?? s,
    value: orders.filter(o => o.status === s).length,
  }));
  const statusColors = ['#f59e0b', '#10b981', '#3b82f6', '#ef4444'];

  // Products by category
  const catMap: Record<string, number> = {};
  products.forEach(p => { const c = p.category_name ?? 'Sin cat'; catMap[c] = (catMap[c] ?? 0) + 1; });
  const productsByCategory = Object.entries(catMap).map(([cat, count]) => ({ cat, count })).sort((a, b) => b.count - a.count).slice(0, 8);

  // Revenue by month (from orders)
  const monthMap: Record<string, number> = {};
  orders.filter(o => o.status === 'paid' || o.status === 'shipped').forEach(o => {
    const month = (o.created_at ?? '').slice(0, 7);
    monthMap[month] = (monthMap[month] ?? 0) + Number(o.total_amount ?? 0);
  });
  const revenueByMonth = Object.entries(monthMap).sort(([a],[b]) => a.localeCompare(b)).map(([month, total]) => ({
    mes: new Date(month + '-01').toLocaleDateString('es-PE', { month: 'short', year: '2-digit' }),
    ingresos: total,
  }));

  if (loading) return <div className="skeleton" style={{ height: '400px', borderRadius: 'var(--radius-lg)' }} />;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <h1 className="page-title">Reportes</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {/* Revenue by month */}
        <div className="card" style={{ padding: '1.5rem', gridColumn: '1 / -1' }}>
          <h2 style={{ fontWeight: 700, marginBottom: '1.25rem', fontSize: '1rem' }}>Ingresos por mes</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={revenueByMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="mes" tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} tickFormatter={(v) => `S/${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: any) => [`S/ ${v.toLocaleString()}`, 'Ingresos']} contentStyle={{ borderRadius: 8, border: '1px solid var(--color-border)' }} />
              <Bar dataKey="ingresos" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Orders by status */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h2 style={{ fontWeight: 700, marginBottom: '1.25rem', fontSize: '1rem' }}>Órdenes por estado</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={ordersByStatus} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                {ordersByStatus.map((_, i) => (
                  <Cell key={i} fill={statusColors[i % statusColors.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Products by category */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h2 style={{ fontWeight: 700, marginBottom: '1.25rem', fontSize: '1rem' }}>Productos por categoría</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={productsByCategory} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }} />
              <YAxis type="category" dataKey="cat" width={90} tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid var(--color-border)' }} />
              <Bar dataKey="count" fill="#8b5cf6" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
