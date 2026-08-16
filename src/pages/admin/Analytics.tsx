import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import {
  Users, PackageSearch, Tag, TrendingUp, RefreshCw,
  ShoppingBag, Zap, ShieldAlert, Award, ArrowUpRight, Search
} from 'lucide-react';

export const Analytics = () => {
  const [activeTab, setActiveTab] = useState<'customers' | 'catalog' | 'pricing' | 'funnel' | 'operations'>('customers');
  const [loading, setLoading] = useState(true);

  // States per tab
  const [rfmData, setRfmData] = useState<any>(null);
  const [churnList, setChurnList] = useState<any[]>([]);
  const [catalogHealth, setCatalogHealth] = useState<any>(null);
  const [zeroSearches, setZeroSearches] = useState<any[]>([]);
  const [basketPairs, setBasketPairs] = useState<any[]>([]);
  const [pricingData, setPricingData] = useState<any[]>([]);
  const [pricingSuggestions, setPricingSuggestions] = useState<any[]>([]);
  const [pricingCandidates, setPricingCandidates] = useState<any[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<number | ''>('');
  const [discoveryLoading, setDiscoveryLoading] = useState(false);
  const [funnelData, setFunnelData] = useState<any[]>([]);
  const [abTests, setAbTests] = useState<any[]>([]);
  const [forecastData, setForecastData] = useState<any[]>([]);
  const [anomalies, setAnomalies] = useState<any[]>([]);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'customers') {
        const [rfmRes, churnRes] = await Promise.all([
          api.get('/admin/analytics/customers/rfm'),
          api.get('/admin/analytics/customers/churn-risk'),
        ]);
        setRfmData(rfmRes.data);
        setChurnList(churnRes.data);
      } else if (activeTab === 'catalog') {
        const [healthRes, zeroRes, basketRes] = await Promise.all([
          api.get('/admin/analytics/catalog/health-score'),
          api.get('/admin/analytics/catalog/zero-result-searches'),
          api.get('/admin/analytics/catalog/basket-pairs'),
        ]);
        setCatalogHealth(healthRes.data);
        setZeroSearches(zeroRes.data);
        setBasketPairs(basketRes.data);
      } else if (activeTab === 'pricing') {
        const [compRes, sugRes, candRes, prodRes] = await Promise.all([
          api.get('/admin/analytics/pricing/competitor-comparison'),
          api.get('/admin/analytics/pricing/suggestions'),
          api.get('/admin/pricing/discovery/candidates'),
          api.get('/catalog/products?limit=1000'),
        ]);
        setPricingData(compRes.data);
        setPricingSuggestions(sugRes.data);
        setPricingCandidates(candRes.data);
        setAllProducts(prodRes.data.data || prodRes.data);
      } else if (activeTab === 'funnel') {
        const [funnelRes, abRes] = await Promise.all([
          api.get('/admin/analytics/funnel/summary'),
          api.get('/admin/analytics/ab-tests'),
        ]);
        setFunnelData(funnelRes.data);
        setAbTests(abRes.data);
      } else if (activeTab === 'operations') {
        const [foreRes, anoRes] = await Promise.all([
          api.get('/admin/analytics/operations/forecast'),
          api.get('/admin/analytics/operations/anomalies'),
        ]);
        setForecastData(foreRes.data);
        setAnomalies(anoRes.data);
      }
    } catch (e) {
      console.error('Error loading analytics', e);
    } finally {
      setLoading(false);
    }
  };

  const handleDiscoverSingle = async () => {
    if (!selectedProductId) return;
    try {
      setDiscoveryLoading(true);
      const res = await api.post(`/admin/pricing/discovery/products/${selectedProductId}/discover`);
      const encontrados = res.data.length;
      if (encontrados > 0) {
        alert(`¡Descubrimiento exitoso! Se encontraron ${encontrados} candidatos. Actualiza la lista para verlos.`);
      } else {
        alert('No se encontraron candidatos con una similitud aceptable (>35%) para este producto. Intenta con otro que tenga un nombre más comercial.');
      }
    } catch (e: any) {
      alert('Error al iniciar descubrimiento: ' + e.message);
    } finally {
      setDiscoveryLoading(false);
    }
  };

  const handleDiscoverAll = async () => {
    try {
      setDiscoveryLoading(true);
      await api.post('/admin/pricing/discovery/discover-all');
      alert('Descubrimiento masivo iniciado en segundo plano.');
    } catch (e: any) {
      alert('Error al iniciar descubrimiento: ' + e.message);
    } finally {
      setDiscoveryLoading(false);
    }
  };

  const handleReviewCandidate = async (id: number, approve: boolean) => {
    try {
      if (approve) {
        await api.post(`/admin/pricing/discovery/candidates/${id}/approve`);
      } else {
        await api.post(`/admin/pricing/discovery/candidates/${id}/reject`);
      }
      setPricingCandidates(prev => prev.filter(c => c.id !== id));
    } catch (e: any) {
      alert('Error al revisar candidato: ' + e.message);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const handleResolveAnomaly = async (id: number) => {
    try {
      await api.put(`/admin/analytics/operations/anomalies/${id}/resolve`);
      setAnomalies(prev => prev.map(a => a.id === id ? { ...a, resolved: true } : a));
    } catch (e) {
      console.error('Error resolving anomaly', e);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }} className="animate-fade-in">
      {/* Header & Tabs Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingUp style={{ color: 'var(--color-primary)' }} /> Portal de Analítica e Inteligencia Kovera
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
            Métricas transaccionales, segmentación de clientes, precios dinámicos y proyecciones
          </p>
        </div>

        <button className="btn btn-outline btn-sm" onClick={loadData} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <RefreshCw size={14} className={loading ? 'spin' : ''} /> Actualizar Datos
        </button>
      </div>

      {/* Tabs Menu */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '2px solid var(--color-border)', paddingBottom: '0.5rem', overflowX: 'auto' }}>
        {[
          { id: 'customers', label: 'Clientes 360 & RFM', icon: <Users size={16} /> },
          { id: 'catalog', label: 'Análisis de Catálogo', icon: <PackageSearch size={16} /> },
          { id: 'pricing', label: 'Precios Dinámicos', icon: <Tag size={16} /> },
          { id: 'funnel', label: 'Embudos & Test A/B', icon: <Zap size={16} /> },
          { id: 'operations', label: 'Operaciones & Anomalías', icon: <ShieldAlert size={16} /> },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`btn ${activeTab === t.id ? 'btn-primary' : 'btn-outline'}`}
            style={{ borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', fontSize: '0.85rem' }}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ padding: '3rem 0', textAlign: 'center' }}>
          <div className="skeleton" style={{ height: '300px', borderRadius: '16px' }} />
        </div>
      ) : (
        <>
          {/* ────────────────── 1. TAB CLIENTES ────────────────── */}
          {activeTab === 'customers' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {/* KPIs */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <div className="kpi-card">
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>CLIENTES TOTALES</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-primary)', margin: '0.25rem 0' }}>
                    {rfmData?.metrics?.total_customers ?? 0}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Muestreo sintético activo</div>
                </div>

                <div className="kpi-card">
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>RECAUDACIÓN TOTAL</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#10b981', margin: '0.25rem 0' }}>
                    S/ {Number(rfmData?.metrics?.total_revenue ?? 0).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Acumulado histórico de ventas</div>
                </div>

                <div className="kpi-card">
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>LTV PROMEDIO</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#8b5cf6', margin: '0.25rem 0' }}>
                    S/ {Number(rfmData?.metrics?.avg_ltv ?? 0).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Valor de vida del cliente estimado</div>
                </div>

                <div className="kpi-card">
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>RIESGO DE CHURN GLOBAL</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f59e0b', margin: '0.25rem 0' }}>
                    {(Number(rfmData?.metrics?.avg_churn_risk ?? 0) * 100).toFixed(1)}%
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Probabilidad de abandono</div>
                </div>
              </div>

              {/* Chart & Segments */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="card" style={{ padding: '1.5rem' }}>
                  <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1rem' }}>Segmentación RFM (Recencia, Frecuencia, Monto)</h3>
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie data={rfmData?.segments ?? []} dataKey="count" nameKey="segment" cx="50%" cy="50%" outerRadius={90} label={(entry: any) => `${entry.segment}: ${entry.count}`}>
                        {(rfmData?.segments ?? []).map((_: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v: any) => [`${v} clientes`, 'Cantidad']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Top VIP Customers */}
                <div className="card" style={{ padding: '1.5rem' }}>
                  <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Award style={{ color: '#f59e0b' }} /> Top Clientes de Mayor Valor (LTV / Monto)
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {(rfmData?.topCustomers ?? []).slice(0, 5).map((c: any) => (
                      <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid var(--color-border)' }}>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{c.customer_name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{c.customer_email}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontWeight: 700, color: '#10b981', fontSize: '0.9rem' }}>
                            S/ {Number(c.monetary_total).toLocaleString('es-PE')}
                          </div>
                          <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>Score: {c.rfm_score}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Churn Risk Table */}
              <div className="card" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1rem', color: 'var(--color-danger)' }}>
                  Clientes en Riesgo Alto de Churn (Inactivos)
                </h3>
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Cliente</th>
                        <th>Días Sin Comprar</th>
                        <th>Órdenes Previas</th>
                        <th>Gasto Acumulado</th>
                        <th>Riesgo de Churn</th>
                      </tr>
                    </thead>
                    <tbody>
                      {churnList.map((user: any) => (
                        <tr key={user.id}>
                          <td><code>#{user.user_id || 'INV'}</code></td>
                          <td>{user.customer_name} <br/><span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{user.customer_email}</span></td>
                          <td><span className="badge badge-warning">{user.recency_days} días</span></td>
                          <td style={{ fontWeight: 600 }}>{user.frequency_orders} pedidos</td>
                          <td style={{ fontWeight: 700 }}>S/ {Number(user.monetary_total).toLocaleString('es-PE')}</td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <div style={{ flex: 1, background: '#fee2e2', borderRadius: '4px', height: '8px', overflow: 'hidden' }}>
                                <div style={{ width: `${Number(user.churn_risk_score) * 100}%`, background: 'var(--color-danger)', height: '100%' }} />
                              </div>
                              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-danger)' }}>
                                {(Number(user.churn_risk_score) * 100).toFixed(0)}%
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ────────────────── 2. TAB CATÁLOGO ────────────────── */}
          {activeTab === 'catalog' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {/* KPIs */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div className="kpi-card">
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>SALUD PROMEDIO DEL CATÁLOGO</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#10b981', margin: '0.25rem 0' }}>
                    {Number(catalogHealth?.summary?.avg_catalog_score ?? 0).toFixed(0)} / 100
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Índice de calidad general</div>
                </div>

                <div className="kpi-card">
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>SIN IMAGEN</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-danger)', margin: '0.25rem 0' }}>
                    {catalogHealth?.summary?.missing_images_count ?? 0}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Productos requieren foto</div>
                </div>

                <div className="kpi-card">
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>SIN DESCRIPCIÓN</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f59e0b', margin: '0.25rem 0' }}>
                    {catalogHealth?.summary?.missing_descriptions_count ?? 0}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Incompletos para SEO</div>
                </div>

                <div className="kpi-card">
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>STOCK CRÍTICO (&gt;15 DÍAS)</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ef4444', margin: '0.25rem 0' }}>
                    {catalogHealth?.summary?.critical_out_of_stock ?? 0}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Riesgo de venta perdida</div>
                </div>
              </div>

              {/* Grid 2 Columnas: Basket & Zero Results */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                {/* Market Basket Analysis */}
                <div className="card" style={{ padding: '1.5rem' }}>
                  <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <ShoppingBag style={{ color: 'var(--color-primary)' }} /> Market Basket (Productos comprados juntos)
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {basketPairs.slice(0, 6).map((pair: any) => (
                      <div key={pair.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid var(--color-border)' }}>
                        <div style={{ fontSize: '0.82rem', maxWidth: '75%' }}>
                          <strong>{pair.product_a_name}</strong> + <br />
                          <span style={{ color: 'var(--color-text-secondary)' }}>{pair.product_b_name}</span>
                        </div>
                        <span className="badge badge-primary" style={{ fontWeight: 700 }}>
                          {pair.co_occurrence_count} veces
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Zero Result Searches */}
                <div className="card" style={{ padding: '1.5rem' }}>
                  <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1rem', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <PackageSearch /> Búsquedas Sin Resultado (Demanda Insatisfecha)
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {zeroSearches.map((zs: any, i: number) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid var(--color-border)' }}>
                        <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>"{zs.query_text}"</div>
                        <span className="badge badge-danger" style={{ fontWeight: 700 }}>
                          {zs.search_count} búsquedas
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ────────────────── 3. TAB PRECIOS DINÁMICOS ────────────────── */}
          {activeTab === 'pricing' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', flexWrap: 'wrap' }}>
                <select 
                  className="input" 
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(Number(e.target.value) || '')}
                  style={{ minWidth: '250px' }}
                >
                  <option value="">Seleccione un producto...</option>
                  {allProducts.map((p: any) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                <button 
                  onClick={handleDiscoverSingle} 
                  disabled={discoveryLoading || !selectedProductId}
                  className="btn btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <Search size={16} /> 
                  {discoveryLoading ? 'Buscando...' : 'Buscar (Solo Uno)'}
                </button>
                <div style={{ width: '1px', background: 'var(--color-border)', margin: '0 0.5rem' }}></div>
                <button 
                  onClick={async () => {
                    const candRes = await api.get('/admin/pricing/discovery/candidates');
                    setPricingCandidates(candRes.data);
                  }}
                  className="btn btn-outline"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <RefreshCw size={16} /> 
                  Actualizar Lista
                </button>
                <button 
                  onClick={handleDiscoverAll} 
                  disabled={discoveryLoading}
                  className="btn btn-outline"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444', borderColor: '#ef4444' }}
                >
                  <Search size={16} /> 
                  Buscar en TODOS
                </button>
              </div>

              {/* Discovery Candidates Table */}
              {pricingCandidates.length > 0 && (
                <div className="card" style={{ padding: '1.5rem', border: '1px solid var(--color-primary)' }}>
                  <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>
                    Candidatos por revisar ({pricingCandidates.length} pendientes)
                  </h3>
                  <div className="table-wrapper">
                    <table>
                      <thead>
                        <tr>
                          <th>Tu Producto</th>
                          <th>Candidato Encontrado</th>
                          <th>Competidor</th>
                          <th>Confianza</th>
                          <th>Precio Visto</th>
                          <th>Acción</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pricingCandidates.map((cand: any) => (
                          <tr key={cand.id} style={{ backgroundColor: Number(cand.match_confidence) < 0.6 ? '#fef3c7' : 'transparent' }}>
                            <td style={{ fontWeight: 600 }}>{cand.product_name}</td>
                            <td>{cand.candidate_title}</td>
                            <td><span className="badge badge-outline">{cand.competitor_name}</span></td>
                            <td>
                              <span style={{ fontWeight: 700, color: Number(cand.match_confidence) < 0.6 ? '#d97706' : '#10b981' }}>
                                {(Number(cand.match_confidence) * 100).toFixed(0)}%
                              </span>
                            </td>
                            <td style={{ fontWeight: 700 }}>
                              {cand.candidate_price ? `S/ ${Number(cand.candidate_price).toFixed(2)}` : 'N/A'}
                            </td>
                            <td>
                              <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <a 
                                  href={cand.candidate_url} 
                                  target="_blank" 
                                  rel="noreferrer" 
                                  className="btn" 
                                  style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem', background: 'var(--color-bg-subtle)' }}
                                >
                                  Ver
                                </a>
                                <button 
                                  onClick={() => handleReviewCandidate(cand.id, true)} 
                                  className="btn btn-primary" 
                                  style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
                                >
                                  Aprobar
                                </button>
                                <button 
                                  onClick={() => handleReviewCandidate(cand.id, false)} 
                                  className="btn" 
                                  style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem', background: '#fee2e2', color: '#ef4444' }}
                                >
                                  Rechazar
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className="card" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1rem' }}>
                  Sugerencias de Precios Dinámicos (Algoritmo Automático por Demanda/Competencia)
                </h3>
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>SKU</th>
                        <th>Producto</th>
                        <th>Precio Actual</th>
                        <th>Promedio Competencia</th>
                        <th>Mínimo Competencia</th>
                        <th>Sugerencia del Sistema</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pricingSuggestions.map((sug: any) => (
                        <tr key={sug.product_id}>
                          <td><code>{sug.sku}</code></td>
                          <td style={{ fontWeight: 600 }}>{sug.product_name}</td>
                          <td style={{ fontWeight: 700 }}>S/ {Number(sug.current_price).toFixed(2)}</td>
                          <td style={{ color: 'var(--color-text-secondary)' }}>S/ {Number(sug.avg_competitor_price).toFixed(2)}</td>
                          <td style={{ color: 'var(--color-text-secondary)' }}>S/ {Number(sug.min_competitor_price).toFixed(2)}</td>
                          <td>
                            <span className={`badge ${sug.suggestion.includes('Descuento') ? 'badge-warning' : sug.suggestion.includes('Aumento') ? 'badge-primary' : 'badge-success'}`}>
                              {sug.suggestion}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Competitor Scraped Feed */}
              <div className="card" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1rem' }}>
                  Monitoreo de Competencia en Tiempo Real (Scraper Snaps)
                </h3>
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>Producto</th>
                        <th>Competidor</th>
                        <th>Precio Competidor</th>
                        <th>Fecha de Scrape</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pricingData.slice(0, 10).map((cp: any) => (
                        <tr key={cp.id}>
                          <td style={{ fontWeight: 600 }}>{cp.product_name}</td>
                          <td>
                            <a 
                              href={`https://www.google.com/search?tbm=shop&q=${encodeURIComponent(cp.competitor_name + ' ' + cp.product_name)}`} 
                              target="_blank" 
                              rel="noreferrer" 
                              title="Verificar precio real en Google Shopping" 
                              style={{ textDecoration: 'none' }}
                            >
                              <span className="badge badge-outline" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                {cp.competitor_name} <ArrowUpRight size={10} />
                              </span>
                            </a>
                          </td>
                          <td style={{ fontWeight: 700, color: 'var(--color-primary)' }}>S/ {Number(cp.competitor_price).toFixed(2)}</td>
                          <td style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>{new Date(cp.scraped_at).toLocaleDateString('es-PE')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ────────────────── 4. TAB EMBUDOS & A/B ────────────────── */}
          {activeTab === 'funnel' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                {/* Funnel Chart */}
                <div className="card" style={{ padding: '1.5rem' }}>
                  <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1rem' }}>
                    Embudo de Conversión de la Tienda (Funnel Drop-off)
                  </h3>
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={funnelData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="step" type="category" width={110} tick={{ fontSize: 11 }} />
                      <Tooltip formatter={(v: any) => [`${v} sesiones`, 'Usuarios']} />
                      <Bar dataKey="unique_sessions" fill="#3b82f6" radius={[0, 8, 8, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* A/B Test Results */}
                <div className="card" style={{ padding: '1.5rem' }}>
                  <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Zap style={{ color: '#f59e0b' }} /> Resultados de Tests A/B Activos
                  </h3>
                  {abTests.map((ab: any, i: number) => (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{ab.test.name}</div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        {ab.variants.map((v: any, vIdx: number) => (
                          <div key={vIdx} style={{ background: 'var(--color-bg-subtle)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>VARIANTE {v.variant_assigned.toUpperCase()}</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: vIdx === 1 ? '#10b981' : '#3b82f6', margin: '0.2rem 0' }}>
                              {Number(v.conversion_rate).toFixed(1)}%
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                              {v.total_converted} compras / {v.total_assigned} visitas
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ────────────────── 5. TAB OPERACIONES & ANOMALÍAS ────────────────── */}
          {activeTab === 'operations' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {/* Anomalies Feed */}
              <div className="card" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1rem', color: 'var(--color-danger)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ShieldAlert /> Feed de Detección de Anomalías Transaccionales
                </h3>
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Tipo de Anomalía</th>
                        <th>Severidad</th>
                        <th>Detalle del Error</th>
                        <th>Fecha Detección</th>
                        <th>Estado</th>
                        <th>Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {anomalies.map((a: any) => (
                        <tr key={a.id}>
                          <td><code>#{a.id}</code></td>
                          <td style={{ fontWeight: 600, textTransform: 'capitalize' }}>{a.type.replace('_', ' ')}</td>
                          <td>
                            <span className={`badge ${a.severity === 'alta' ? 'badge-danger' : 'badge-warning'}`}>
                              {a.severity.toUpperCase()}
                            </span>
                          </td>
                          <td style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)' }}>{a.detail}</td>
                          <td style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{new Date(a.detectedAt).toLocaleDateString('es-PE')}</td>
                          <td>
                            <span className={`badge ${a.resolved ? 'badge-success' : 'badge-danger'}`}>
                              {a.resolved ? 'Resuelto' : 'Pendiente'}
                            </span>
                          </td>
                          <td>
                            {!a.resolved && (
                              <button className="btn btn-outline btn-sm" onClick={() => handleResolveAnomaly(a.id)} style={{ fontSize: '0.75rem' }}>
                                Resolver
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Demand Forecast */}
              <div className="card" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1rem' }}>
                  Proyección de Demanda por SKU (Forecasting por Suavizado Exponencial)
                </h3>
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={forecastData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="forecast_date" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(v: any) => [`${v} unidades`, 'Demanda Estimada']} />
                    <Area type="monotone" dataKey="predicted_units" stroke="#10b981" fill="#d1fae5" strokeWidth={2.5} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
