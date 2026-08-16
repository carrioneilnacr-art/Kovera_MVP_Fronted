import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../../services/api';
import type { Product, Category } from '../../types';
import { useCartStore } from '../../store/useCartStore';
import { CampaignBanner } from '../../components/campaigns/CampaignBanner';
import { Hero } from '../../components/home/Hero';
import { CategoryIconGrid } from '../../components/home/CategoryIconGrid';
import { ProductCard } from '../../components/home/ProductCard';
import { BrandStrip } from '../../components/home/BrandStrip';
import { PackageSearch } from 'lucide-react';

export const Home = () => {
  const [searchParams] = useSearchParams();
  const searchQ = searchParams.get('search') || '';
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc'>('newest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const addItem = useCartStore((s) => s.addItem);

  const fetchProducts = async (catId?: number | null, p = 1) => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { page: p, limit: 20 };
      if (catId) params.categoryId = catId;
      if (searchQ) params.search = searchQ;
      if (sortBy) params.sortBy = sortBy;
      const [productsRes, categoriesRes] = await Promise.all([
        api.get('/catalog/products', { params }),
        categories.length ? Promise.resolve({ data: categories }) : api.get('/catalog/categories'),
      ]);
      const data = productsRes.data.data ?? productsRes.data;
      setProducts(data);
      setTotalPages(productsRes.data.meta?.totalPages ?? 1);
      if (!categories.length) setCategories(categoriesRes.data);
    } catch {
      setError('No se pudo conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(activeCategory, 1); setPage(1); }, [activeCategory, searchQ, sortBy]);
  useEffect(() => { if (page > 1) fetchProducts(activeCategory, page); }, [page]);

  const handleAddToCart = (product: Product) => {
    addItem({
      productId: String(product.id),
      name: product.name,
      price: Number(product.base_price ?? 0),
      quantity: 1,
      imageUrl: product.image_url ?? '',
      sku: product.sku,
    });
  };

  const skeletonArr = Array.from({ length: 10 });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Hero */}
      <Hero />

      {/* Campaign Banner */}
      <CampaignBanner />

      {/* Brand Strip */}
      <BrandStrip />

      {/* Categories Grid */}
      <CategoryIconGrid 
        categories={categories}
        activeCategory={activeCategory}
        onSelect={setActiveCategory}
      />

      {/* Catalog Section */}
      <section id="catalogo">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h2 className="section-title" style={{ marginBottom: '0.25rem', fontSize: '1.35rem' }}>
              {activeCategory ? categories.find(c => c.id === activeCategory)?.name : 'Catálogo de Productos'}
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', margin: 0 }}>
              {searchQ ? `Resultados para "${searchQ}"` : 'Lo último en tecnología para ti'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <label htmlFor="sortBy" style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Ordenar por:</label>
              <select 
                id="sortBy" 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value as any)}
                style={{ padding: '0.4rem 0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'var(--color-bg-card)', fontSize: '0.85rem', color: 'var(--color-text-primary)', outline: 'none' }}
              >
                <option value="newest">Novedades</option>
                <option value="price_desc">Mayor precio</option>
                <option value="price_asc">Menor precio</option>
              </select>
            </div>
          {totalPages > 1 && (
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <button 
                className="btn btn-outline btn-sm" 
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
              >
                &larr; Anterior
              </button>
              <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{page} / {totalPages}</span>
              <button 
                className="btn btn-outline btn-sm"
                disabled={page >= totalPages}
                onClick={() => setPage(p => p + 1)}
              >
                Siguiente &rarr;
              </button>
            </div>
          )}
        </div>
      </div>

        {error && (
          <div className="alert" style={{ background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca', marginBottom: '1.5rem' }}>
            <strong>Error:</strong> {error}
          </div>
        )}

        <div className="products-grid">
          {loading ? (
            skeletonArr.map((_, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div className="skeleton" style={{ aspectRatio: '1', borderRadius: 'var(--radius-md)' }} />
                <div className="skeleton" style={{ height: '16px', width: '80%' }} />
                <div className="skeleton" style={{ height: '20px', width: '40%' }} />
              </div>
            ))
          ) : products.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', padding: '3.5rem 1.5rem', textAlign: 'center', background: 'var(--color-bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
              <PackageSearch size={40} style={{ color: 'var(--color-text-muted)', marginBottom: '0.75rem' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.25rem' }}>No encontramos productos</h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', marginBottom: '1rem' }}>Intenta con otra búsqueda o categoría.</p>
              <button className="btn btn-primary btn-sm" onClick={() => { setActiveCategory(null); }}>
                Ver todos los productos
              </button>
            </div>
          ) : (
            products.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAdd={() => handleAddToCart(product)} 
              />
            ))
          )}
        </div>

        {/* Bottom Pagination */}
        {totalPages > 1 && !loading && products.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2.5rem' }}>
            <div style={{ display: 'flex', gap: '0.25rem' }}>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  className={`btn btn-sm ${page === i + 1 ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setPage(i + 1)}
                  style={{ width: '36px', padding: 0 }}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
