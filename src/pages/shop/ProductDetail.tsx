import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../services/api';
import type { Product, PriceHistory } from '../../types';
import { useCartStore } from '../../store/useCartStore';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ShoppingCart, ArrowLeft, Package, TrendingDown, Shield, Star } from 'lucide-react';
import { PriceBadge } from '../../components/campaigns/PriceBadge';
import { ProductReviews } from '../../components/reviews/ProductReviews';

export const ProductDetail = () => {
  const { sku } = useParams<{ sku: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [priceHistory, setPriceHistory] = useState<PriceHistory[]>([]);
  const [selectedVariation, setSelectedVariation] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [addedMsg, setAddedMsg] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    if (!sku) return;
    const load = async () => {
      try {
        const [prodRes, histRes] = await Promise.all([
          api.get(`/catalog/products/sku/${sku}`),
          api.get(`/catalog/products/sku/${sku}/price-history`).catch(() => ({ data: [] })),
        ]);
        setProduct(prodRes.data);
        setPriceHistory(histRes.data);
      } catch { /* silence */ }
      finally { setLoading(false); }
    };
    load();
  }, [sku]);

  const handleAddToCart = () => {
    if (!product) return;
    const v = product.variations?.[selectedVariation];
    addItem({
      productId: String(product.id),
      variationId: v ? String(v.id) : undefined,
      name: product.name,
      price: Number(v?.price ?? product.base_price ?? 0),
      quantity: 1,
      imageUrl: product.image_url ?? v?.image_url ?? '',
      sku: product.sku,
    });
    setAddedMsg(true);
    setTimeout(() => setAddedMsg(false), 2000);
  };

  // Build chart data
  const chartData = (() => {
    const grouped: Record<string, Record<string, number>> = {};
    priceHistory.forEach(({ recorded_date, competitor_name, recorded_price }) => {
      if (!grouped[recorded_date]) grouped[recorded_date] = {};
      grouped[recorded_date][competitor_name] = Number(recorded_price);
    });
    return Object.entries(grouped)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, vals]) => ({ date: date.slice(5), ...vals }));
  })();

  const competitors = [...new Set(priceHistory.map(h => h.competitor_name))];
  const competitorColors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b'];

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div className="skeleton" style={{ height: '2rem', width: '30%' }} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div className="skeleton" style={{ aspectRatio: '1', borderRadius: '16px' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[1,2,3,4,5].map(i => <div key={i} className="skeleton" style={{ height: '1.5rem', width: `${90 - i*10}%` }} />)}
        </div>
      </div>
    </div>
  );

  if (!product) return (
    <div className="empty-state">
      <Package className="empty-state-icon" />
      <h2>Producto no encontrado</h2>
      <p style={{ marginTop: '0.5rem' }}>El producto que buscas no existe o fue desactivado.</p>
      <Link to="/" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>← Volver al catálogo</Link>
    </div>
  );

  const currentVariation = product.variations?.[selectedVariation];
  const currentPrice = currentVariation?.price ?? product.base_price ?? 0;
  const currentStock = currentVariation?.stock ?? product.stock ?? 0;
  const currentImage = product.image_url ?? currentVariation?.image_url;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }} className="animate-fade-in">
      {/* Breadcrumb */}
      <nav aria-label="Navegación" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
        <Link to="/" style={{ color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <ArrowLeft size={14} /> Catálogo
        </Link>
        <span>/</span>
        <span style={{ color: 'var(--color-text-primary)' }}>{product.name}</span>
      </nav>

      {/* Main product layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem', alignItems: 'start' }}>
        {/* Image */}
        <div style={{ background: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-xl)', padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px', border: '1px solid var(--color-border)' }}>
          {currentImage ? (
            <img src={currentImage} alt={product.name} style={{ maxWidth: '100%', maxHeight: '380px', objectFit: 'contain' }} className="animate-float" />
          ) : (
            <span style={{ fontSize: '8rem', opacity: 0.3 }}>📦</span>
          )}
        </div>

        {/* Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {product.category_name && (
            <span className="badge badge-primary">{product.category_name}</span>
          )}
          <h1 style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 800, lineHeight: 1.2 }}>{product.name}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {[1,2,3,4,5].map(n => <Star key={n} size={16} fill={n <= 4 ? '#f59e0b' : 'none'} stroke="#f59e0b" />)}
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginLeft: '0.25rem' }}>4.8 (132 reseñas)</span>
          </div>

          {/* Price */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <PriceBadge sku={product.sku} defaultPrice={Number(currentPrice)} />
          </div>

          {/* Stock */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: currentStock > 0 ? 'var(--color-success)' : 'var(--color-danger)' }} />
            <span style={{ fontSize: '0.85rem', color: currentStock > 0 ? 'var(--color-success)' : 'var(--color-danger)', fontWeight: 600 }}>
              {currentStock > 0 ? `${currentStock} en stock` : 'Sin stock'}
            </span>
          </div>

          {/* Variations */}
          {product.variations && product.variations.length > 0 && (
            <div>
              <p style={{ fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>Variaciones disponibles:</p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {product.variations.map((v, i) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariation(i)}
                    className="btn btn-sm"
                    style={{
                      borderRadius: 'var(--radius-md)',
                      border: `2px solid ${selectedVariation === i ? 'var(--color-accent)' : 'var(--color-border)'}`,
                      background: selectedVariation === i ? '#eff6ff' : 'var(--color-bg-card)',
                      color: selectedVariation === i ? 'var(--color-accent)' : 'var(--color-text-primary)',
                      fontWeight: selectedVariation === i ? 700 : 500,
                    }}
                  >
                    {Object.values(v.attributes ?? {}).join(' · ')} — S/ {Number(v.price).toLocaleString()}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          {product.description && (
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>{product.description}</p>
          )}

          {/* CTA */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              className="btn btn-primary btn-lg"
              onClick={handleAddToCart}
              disabled={currentStock === 0}
              style={{ flex: '1 1 200px', borderRadius: 'var(--radius-lg)', background: addedMsg ? 'var(--color-success)' : '', transition: 'background 0.3s' }}
            >
              {addedMsg ? '✓ Agregado al carrito' : <><ShoppingCart size={18} /> Agregar al carrito</>}
            </button>
            <Link to="/checkout" className="btn btn-accent btn-lg" style={{ flex: '1 1 160px', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
              Comprar ahora
            </Link>
          </div>

          {/* Trust badges */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', padding: '1rem', background: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-md)' }}>
            {[<><Shield size={14} /> Garantía 12 meses</>, <><Package size={14} /> Producto original</>, <><TrendingDown size={14} /> Mejor precio</>].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Price History Chart */}
      {chartData.length > 0 && (
        <section className="card" style={{ padding: '1.5rem' }}>
          <h2 style={{ fontWeight: 700, marginBottom: '0.5rem', fontSize: '1.1rem' }}>📊 Historial de precios (vs. Competencia)</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>Los últimos 30 días comparados con Falabella y Ripley.</p>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} tickFormatter={(v) => `S/ ${v.toLocaleString()}`} />
              <Tooltip formatter={(v: any) => [`S/ ${Number(v).toLocaleString()}`, '']} contentStyle={{ borderRadius: 8, border: '1px solid var(--color-border)' }} />
              <Legend />
              {competitors.map((comp, i) => (
                <Line key={comp} type="monotone" dataKey={comp} stroke={competitorColors[i % competitorColors.length]} strokeWidth={2} dot={false} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </section>
      )}

      {/* Product Reviews */}
      <ProductReviews productId={Number(product.id)} />
    </div>
  );
};
