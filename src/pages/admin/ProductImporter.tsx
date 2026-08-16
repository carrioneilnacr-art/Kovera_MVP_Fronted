import { useState } from 'react';
import { api } from '../../services/api';
import { Search, Download, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface ExternalProduct {
  id: string;
  name: string;
  brand: string;
  model: string;
  description: string;
  imageUrl: string | null;
  price: number;
}

export default function ProductImporter() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ExternalProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [importingId, setImportingId] = useState<string | null>(null);
  const [importedIds, setImportedIds] = useState<Set<string>>(new Set());

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setResults([]);
    try {
      const { data } = await api.get('/catalog/import/search-external?q=' + encodeURIComponent(query));
      setResults(data.items || []);
      if ((data.items || []).length === 0) setError('No se encontraron resultados.');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al buscar.');
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async (product: ExternalProduct) => {
    if (!product.imageUrl) { alert('Sin imagen, no se puede importar.'); return; }
    setImportingId(product.id);
    try {
      await api.post('/catalog/import/save', { name: product.name, description: product.description, model: product.model, imageUrl: product.imageUrl, price: product.price });
      setImportedIds(prev => new Set([...prev, product.id]));
    } catch (err: any) {
      alert('Error: ' + (err.response?.data?.message || err.message));
    } finally {
      setImportingId(null);
    }
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>Importador de Productos</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>Busca en UPCitemDB y añade productos al catalogo con un click.</p>
      </div>

      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', maxWidth: '640px' }}>
        <input type="text" className="input" placeholder="Ej. iPhone 15, Laptop HP..." value={query} onChange={(e) => setQuery(e.target.value)} style={{ flex: 1 }} />
        <button type="submit" className="btn btn-primary" disabled={loading || !query.trim()} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}>
          {loading ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <Search size={18} />}
          {loading ? 'Buscando...' : 'Buscar'}
        </button>
      </form>

      {error && (
        <div style={{ marginBottom: '1.5rem', padding: '1rem 1.25rem', background: '#fef2f2', color: '#dc2626', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.75rem', border: '1px solid #fecaca' }}>
          <AlertCircle size={20} style={{ flexShrink: 0 }} />{error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
        {results.map((product) => {
          const isImported = importedIds.has(product.id);
          const isImporting = importingId === product.id;
          return (
            <div key={product.id} className="card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
              <div style={{ aspectRatio: '1', background: 'var(--color-bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
                {product.imageUrl
                  ? <img src={product.imageUrl} alt={product.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  : <span style={{ color: 'var(--color-text-muted)' }}>Sin imagen</span>
                }
              </div>
              <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  {product.brand && <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-info)', background: '#eff6ff', padding: '2px 8px', borderRadius: '999px' }}>{product.brand}</span>}
                  <span style={{ fontWeight: 800, fontSize: '1rem', marginLeft: 'auto' }}>S/ {product.price > 0 ? product.price.toFixed(2) : '—'}</span>
                </div>
                <h3 style={{ fontWeight: 600, fontSize: '0.9rem', lineHeight: 1.4, marginBottom: '0.25rem' }}>{product.name}</h3>
                {product.model && <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>Modelo: {product.model}</p>}
                <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
                  <button onClick={() => handleImport(product)} disabled={isImported || isImporting || !product.imageUrl} className={isImported ? 'btn btn-outline' : 'btn btn-primary'} style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                    {isImported ? <><CheckCircle size={16} /> Importado</> : isImporting ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Descargando...</> : <><Download size={16} /> Añadir a tienda</>}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {!loading && results.length === 0 && !error && (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--color-text-muted)' }}>
          <Search size={48} style={{ marginBottom: '1rem', opacity: 0.4 }} />
          <p>Escribe un término y presiona Buscar</p>
        </div>
      )}
      <style>{'@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }'}</style>
    </div>
  );
}
