import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Search, Plus, RefreshCw, Eye, EyeOff, Package } from 'lucide-react';
export const ProductsManager = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetch = async (p = 1, q = '') => {
    setLoading(true);
    try {
      const params: any = { page: p, limit: 20 };
      if (q) params.search = q;
      const res = await api.get('/catalog/products', { params });
      const data = res.data?.data ?? res.data ?? [];
      setProducts(data);
      setTotalPages(res.data?.meta?.totalPages ?? 1);
      setTotal(res.data?.meta?.total ?? data.length);
    } catch { /* silence */ }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(page, search); }, [page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetch(1, search);
  };

  const handleSoftDelete = async (id: number, name: string) => {
    if (!confirm(`¿Desactivar "${name}"?`)) return;
    try {
      await api.put(`/catalog/products/${id}/soft-delete`);
      fetch(page, search);
    } catch (err: any) {
      alert(err?.response?.data?.message ?? 'Error al desactivar');
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Productos</h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>{total} productos en total</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-outline btn-sm" onClick={() => fetch(page, search)} aria-label="Refrescar lista">
            <RefreshCw size={15} />
          </button>
          <a href="http://localhost:3000/api/docs#/Catalog" target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
            <Plus size={15} /> Crear producto (Swagger)
          </a>
        </div>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
          <input
            className="input"
            style={{ paddingLeft: '2.5rem' }}
            placeholder="Buscar por nombre, SKU o categoría..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            aria-label="Buscar productos"
          />
        </div>
        <button type="submit" className="btn btn-primary btn-sm">Buscar</button>
      </form>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {[1,2,3,4,5].map(i => <div key={i} className="skeleton" style={{ height: '52px', borderRadius: 'var(--radius-md)' }} />)}
        </div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Imagen</th>
                <th>SKU</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio base</th>
                <th>Stock</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p: any) => (
                <tr key={p.id}>
                  <td>
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.name} style={{ width: 48, height: 48, objectFit: 'contain', borderRadius: 'var(--radius-sm)', background: 'var(--color-bg-subtle)', padding: '4px' }} />
                    ) : <Package size={20} style={{ color: "var(--color-text-muted)" }} />}
                  </td>
                  <td><code style={{ fontSize: '0.75rem', background: 'var(--color-bg-subtle)', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>{p.sku}</code></td>
                  <td style={{ fontWeight: 500, maxWidth: '220px' }}>
                    <p style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</p>
                  </td>
                  <td><span className="badge badge-primary" style={{ textTransform: 'capitalize' }}>{p.category_name ?? '—'}</span></td>
                  <td style={{ fontWeight: 700, fontFamily: "'Outfit', sans-serif" }}>S/ {Number(p.base_price ?? 0).toLocaleString('es-PE', { minimumFractionDigits: 2 })}</td>
                  <td>
                    <span className={`badge ${Number(p.stock) === 0 ? 'badge-danger' : Number(p.stock) <= 10 ? 'badge-warning' : 'badge-success'}`}>
                      {p.stock ?? 0}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${p.is_active ? 'badge-success' : 'badge-gray'}`}>
                      {p.is_active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <a href={`/product/${p.sku}`} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm" aria-label={`Ver ${p.name} en tienda`} title="Ver en tienda">
                        <Eye size={13} />
                      </a>
                      {p.is_active && (
                        <button
                          onClick={() => handleSoftDelete(p.id, p.name)}
                          className="btn btn-sm"
                          style={{ background: '#fef2f2', color: 'var(--color-danger)', border: '1px solid #fecaca' }}
                          aria-label={`Desactivar ${p.name}`}
                          title="Desactivar"
                        >
                          <EyeOff size={13} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1.5rem' }}>
          <button className="btn btn-outline btn-sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Anterior</button>
          <span style={{ display: 'flex', alignItems: 'center', padding: '0 1rem', fontSize: '0.88rem', color: 'var(--color-text-secondary)' }}>
            Pág {page} de {totalPages}
          </span>
          <button className="btn btn-outline btn-sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Siguiente →</button>
        </div>
      )}
    </div>
  );
};
