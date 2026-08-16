import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, X, Package, TrendingUp } from 'lucide-react';
import { api } from '../../services/api';

interface SearchResult {
  query: string;
  found: boolean;
  didYouMean?: string;
  products: {
    id: number;
    sku: string;
    name: string;
    base_price: number;
    category_name: string;
    image_url?: string;
  }[];
  categories: {
    id: number;
    name: string;
    slug: string;
  }[];
  popularFallback?: {
    id: number;
    sku: string;
    name: string;
    base_price: number;
    image_url?: string;
  }[];
}

export const SearchAutocomplete: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Debounce API call
  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setResults(null);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await api.get('/catalog/search/suggestions', { params: { q: query } });
        setResults(res.data);
      } catch (err) {
        console.error('Error fetching suggestions', err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsFocused(false);
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  const clearQuery = () => {
    setQuery('');
    setResults(null);
  };

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      <form onSubmit={handleSearch} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="Buscar productos, marcas y más..."
          className="input"
          style={{
            paddingLeft: '2.5rem',
            paddingRight: query ? '2.5rem' : '1rem',
            borderRadius: 'var(--radius-pill)',
            fontSize: '0.875rem',
            height: '40px',
            width: '100%',
            background: 'var(--color-bg-subtle)',
            border: '1px solid var(--color-border)',
          }}
        />
        <Search
          size={18}
          style={{
            position: 'absolute',
            left: '0.85rem',
            color: 'var(--color-text-muted)',
            pointerEvents: 'none'
          }}
        />
        {query && (
          <button
            type="button"
            onClick={clearQuery}
            style={{
              position: 'absolute',
              right: '0.75rem',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-text-muted)',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <X size={16} />
          </button>
        )}
      </form>

      {/* Floating Dropdown */}
      {isFocused && (query.length >= 2 || results) && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 8px)',
          left: 0,
          right: 0,
          background: 'var(--color-bg-card)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-xl)',
          border: '1px solid var(--color-border)',
          zIndex: 1000,
          overflow: 'hidden',
          maxHeight: '70vh',
          overflowY: 'auto'
        }}>
          {loading ? (
            <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div className="skeleton" style={{ height: '40px', width: '100%', borderRadius: 'var(--radius-md)' }} />
              <div className="skeleton" style={{ height: '40px', width: '100%', borderRadius: 'var(--radius-md)' }} />
            </div>
          ) : results ? (
            <div style={{ padding: '0.5rem 0' }}>
              {/* Not Found state with suggestions */}
              {!results.found && (
                <div style={{ padding: '0.875rem 1rem', background: '#fff1f2', borderBottom: '1px solid #ffe4e6' }}>
                  <p style={{ color: '#be123c', fontWeight: 600, fontSize: '0.85rem', margin: 0 }}>
                    No encontramos resultados para "{query}".
                  </p>
                  {results.didYouMean && (
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem', marginBottom: 0 }}>
                      ¿Quisiste decir <button onClick={() => setQuery(results.didYouMean!)} style={{ color: 'var(--color-info)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontWeight: 600 }}>{results.didYouMean}</button>?
                    </p>
                  )}
                </div>
              )}

              {/* Categories */}
              {results.categories && results.categories.length > 0 && (
                <div style={{ padding: '0.625rem 1rem', borderBottom: '1px solid var(--color-border)' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem', letterSpacing: '0.05em' }}>Categorías</div>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    {results.categories.map(c => (
                      <Link
                        key={c.id}
                        to={`/search?categoryId=${c.id}`}
                        onClick={() => setIsFocused(false)}
                        className="badge badge-gray"
                        style={{ textDecoration: 'none', fontSize: '0.75rem' }}
                      >
                        {c.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Products */}
              {results.products && results.products.length > 0 && (
                <div>
                  <div style={{ padding: '0.625rem 1rem 0.25rem 1rem', fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Productos</div>
                  {results.products.map(p => (
                    <Link
                      key={p.id}
                      to={`/p/${p.sku}`}
                      onClick={() => setIsFocused(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.875rem',
                        padding: '0.625rem 1rem',
                        textDecoration: 'none',
                        transition: 'background var(--transition-fast)',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--color-bg-subtle)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-sm)', background: 'var(--color-bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0, border: '1px solid var(--color-border)' }}>
                        {p.image_url ? (
                          <img 
                            src={p.image_url} 
                            alt={p.name} 
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                            onError={(e) => { (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/' + p.id + '/200/200'; }} 
                          />
                        ) : (
                          <Package size={20} color="var(--color-text-muted)" />
                        )}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)' }}>{p.category_name}</div>
                      </div>
                      <div style={{ fontWeight: 700, color: 'var(--color-text-primary)', fontSize: '0.85rem', flexShrink: 0 }}>
                        S/ {Number(p.base_price ?? 0).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Popular Fallback */}
              {!results.found && results.popularFallback && results.popularFallback.length > 0 && (
                <div>
                  <div style={{ padding: '0.75rem 1rem 0.25rem 1rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    <TrendingUp size={13} /> Lo más buscado
                  </div>
                  {results.popularFallback.map(p => (
                    <Link
                      key={p.id}
                      to={`/p/${p.sku}`}
                      onClick={() => setIsFocused(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.875rem',
                        padding: '0.625rem 1rem',
                        textDecoration: 'none',
                        transition: 'background var(--transition-fast)',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--color-bg-subtle)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-sm)', background: 'var(--color-bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0, border: '1px solid var(--color-border)' }}>
                        {p.image_url ? (
                          <img 
                            src={p.image_url} 
                            alt={p.name} 
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                            onError={(e) => { (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/' + p.id + '/200/200'; }}
                          />
                        ) : (
                          <Package size={18} color="var(--color-text-muted)" />
                        )}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                      </div>
                      <div style={{ fontWeight: 700, color: 'var(--color-text-primary)', fontSize: '0.82rem', flexShrink: 0 }}>
                        S/ {Number(p.base_price ?? 0).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* View all results link */}
              {results.found && (
                <div style={{ padding: '0.4rem 0.5rem', borderTop: '1px solid var(--color-border)' }}>
                  <button
                    onClick={handleSearch}
                    style={{
                      width: '100%',
                      padding: '0.625rem',
                      background: 'none',
                      border: 'none',
                      color: 'var(--color-info)',
                      fontWeight: 600,
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      borderRadius: 'var(--radius-sm)',
                      transition: 'background var(--transition-fast)',
                      textAlign: 'center'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#eff6ff'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    Ver todos los resultados para "{query}" &rarr;
                  </button>
                </div>
              )}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};
