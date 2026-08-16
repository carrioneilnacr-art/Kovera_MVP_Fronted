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

export const Home = () => {
  const [searchParams] = useSearchParams();
  const searchQ = searchParams.get('search') || '';
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const addItem = useCartStore((s) => s.addItem);

  const categoryIcons: Record<string, string> = {
    'celulares': '📱', 'laptops': '💻', 'tablets': '🖥️',
    'audio': '🎧', 'smartwatches': '⌚', 'camaras': '📷',
    'accesorios': '🎒', 'gaming': '🎮', 'televisores': '📺',
    'impresoras': '🖨️', 'auriculares-iphone': '🎵',
    'samsung-galaxy': '📲', 'laptops-apple': '🍎', 'laptops-gaming': '🕹️',
  };

  const fetchProducts = async (catId?: number | null, p = 1) => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { page: p, limit: 20 };
      if (catId) params.categoryId = catId;
      if (searchQ) params.search = searchQ;
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

  useEffect(() => { fetchProducts(activeCategory, 1); setPage(1); }, [activeCategory, searchQ]);
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
    // In a real app we would use a toast notification here
  };

  const skeletonArr = Array.from({ length: 12 });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      
      {/* ── Hero ── */}
      <Hero />

      {/* ── Banner de Campaña ── */}
      <CampaignBanner />

      {/* ── Tira de Marcas ── */}
      <BrandStrip />

      {/* ── Grid de Categorías ── */}
      <CategoryIconGrid 
        categories={categories}
        activeCategory={activeCategory}
        onSelect={setActiveCategory}
        categoryIcons={categoryIcons}
      />

      {/* ── Productos ── */}
      <section id="catalogo">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
          <div>
            <h2 className="section-title" style={{ marginBottom: '0.25rem' }}>
              {activeCategory ? categories.find(c => c.id === activeCategory)?.name : 'Novedades'}
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
              {searchQ ? `Resultados para "${searchQ}"` : 'Lo último en tecnología para ti'}
            </p>
          </div>
          {totalPages > 1 && (
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <button 
                className="btn btn-outline btn-sm" 
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
              >
                ← Anterior
              </button>
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{page} / {totalPages}</span>
              <button 
                className="btn btn-outline btn-sm"
                disabled={page >= totalPages}
                onClick={() => setPage(p => p + 1)}
              >
                Siguiente →
              </button>
            </div>
          )}
        </div>

        {error && (
          <div className="alert" style={{ background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca', marginBottom: '2rem' }}>
            <strong>Error:</strong> {error}
          </div>
        )}

        <div className="product-grid">
          {loading ? (
            skeletonArr.map((_, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="skeleton" style={{ height: '280px', borderRadius: 'var(--radius-lg)' }} />
                <div className="skeleton" style={{ height: '20px', width: '80%' }} />
                <div className="skeleton" style={{ height: '24px', width: '40%' }} />
              </div>
            ))
          ) : products.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', padding: '4rem', textAlign: 'center', background: 'var(--color-bg-card)', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>No encontramos productos</h3>
              <p style={{ color: 'var(--color-text-secondary)' }}>Intenta con otra búsqueda o categoría.</p>
              <button className="btn btn-primary" style={{ marginTop: '1.5rem' }} onClick={() => { setActiveCategory(null); }}>
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

        {/* Paginación Inferior */}
        {totalPages > 1 && !loading && products.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem' }}>
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
