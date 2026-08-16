import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, X, Package, TrendingUp } from 'lucide-react';
import { useSearchSuggestions } from '../../hooks/useSearchSuggestions';

export const SearchAutocomplete = () => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const { results, loading } = useSearchSuggestions(query);
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsFocused(false);
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const handleClear = () => {
    setQuery('');
    setIsFocused(true);
  };

  const hasContent = loading || results;

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', maxWidth: '600px' }}>
      <form onSubmit={handleSearch} style={{ position: 'relative', zIndex: 50 }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: 'var(--color-bg-subtle)',
          borderRadius: 'var(--radius-pill)',
          padding: '0.5rem 1rem',
          border: `1px solid ${isFocused ? 'var(--color-accent)' : 'transparent'}`,
          transition: 'all var(--transition-fast)'
        }}>
          <Search size={18} style={{ color: 'var(--color-text-muted)', marginRight: '0.5rem' }} />
          <input
            type="text"
            placeholder="Buscar productos, marcas, categorías..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: '0.95rem',
              color: 'var(--color-text-primary)'
            }}
          />
          {query && (
            <button type="button" onClick={handleClear} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', color: 'var(--color-text-muted)' }}>
              <X size={18} />
            </button>
          )}
        </div>
      </form>

      {isFocused && hasContent && query.length >= 2 && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 8px)',
          left: 0,
          right: 0,
          background: 'var(--color-bg-card)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-xl)',
          border: '1px solid var(--color-border)',
          zIndex: 300,
          overflow: 'hidden',
          maxHeight: '70vh',
          overflowY: 'auto'
        }}>
          {loading ? (
            <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="skeleton" style={{ height: '40px', width: '100%' }} />
              <div className="skeleton" style={{ height: '40px', width: '100%' }} />
              <div className="skeleton" style={{ height: '40px', width: '100%' }} />
            </div>
          ) : results ? (
            <div style={{ padding: '0.5rem 0' }}>
              {/* Not Found state with suggestions */}
              {!results.found && (
                <div style={{ padding: '1rem', background: '#fff1f2', borderBottom: '1px solid #ffe4e6' }}>
                  <p style={{ color: '#be123c', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                    No encontramos resultados para "{query}".
                  </p>
                  {results.didYouMean && (
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                      ¿Quisiste decir <button onClick={() => setQuery(results.didYouMean!)} style={{ color: 'var(--color-info)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontWeight: 600 }}>{results.didYouMean}</button>?
                    </p>
                  )}
                </div>
              )}

              {/* Categories */}
              {results.categories.length > 0 && (
                <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--color-border)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Categorías</div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {results.categories.map(c => (
                      <Link
                        key={c.id}
                        to={`/search?categoryId=${c.id}`}
                        onClick={() => setIsFocused(false)}
                        className="badge badge-gray"
                        style={{ textDecoration: 'none' }}
                      >
                        {c.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Products */}
              {results.products.length > 0 && (
                <div>
                  <div style={{ padding: '0.75rem 1rem 0.25rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Productos</div>
                  {results.products.map(p => (
                    <Link
                      key={p.id}
                      to={`/product/${p.sku}`}
                      onClick={() => setIsFocused(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        padding: '0.75rem 1rem',
                        textDecoration: 'none',
                        transition: 'background var(--transition-fast)',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--color-bg-subtle)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-sm)', background: 'var(--color-bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                        {p.image_url ? <img src={p.image_url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : <Package size={20} color="var(--color-text-muted)" />}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{p.category_name}</div>
                      </div>
                      <div style={{ fontWeight: 700, color: 'var(--color-accent)', fontSize: '0.9rem' }}>
                        S/ {Number(p.base_price ?? 0).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Popular Fallback */}
              {!results.found && results.popularFallback && results.popularFallback.length > 0 && (
                <div>
                  <div style={{ padding: '1rem 1rem 0.25rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-warning)', textTransform: 'uppercase' }}>
                    <TrendingUp size={14} /> Lo más buscado
                  </div>
                  {results.popularFallback.map(p => (
                    <Link
                      key={p.id}
                      to={`/product/${p.sku}`}
                      onClick={() => setIsFocused(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        padding: '0.75rem 1rem',
                        textDecoration: 'none',
                        transition: 'background var(--transition-fast)',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--color-bg-subtle)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-sm)', background: 'var(--color-bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                        {p.image_url ? <img src={p.image_url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : <Package size={20} color="var(--color-text-muted)" />}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                      </div>
                      <div style={{ fontWeight: 700, color: 'var(--color-text-primary)', fontSize: '0.85rem' }}>
                        S/ {Number(p.base_price ?? 0).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* View all results link */}
              {results.found && (
                <div style={{ padding: '0.5rem', borderTop: '1px solid var(--color-border)' }}>
                  <button
                    onClick={handleSearch}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: 'none',
                      border: 'none',
                      color: 'var(--color-info)',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      borderRadius: 'var(--radius-sm)',
                      transition: 'background var(--transition-fast)'
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
