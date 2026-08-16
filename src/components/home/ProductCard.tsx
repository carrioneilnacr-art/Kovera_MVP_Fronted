import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { PriceBadge } from '../campaigns/PriceBadge';
import type { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  onAdd: () => void;
}

export const ProductCard = ({ product, onAdd }: ProductCardProps) => {
  const stock = Number(product.stock ?? 0);
  const outOfStock = stock === 0;

  return (
    <div className="product-card">
      <div className="product-image-container">
        {outOfStock && (
          <div style={{
            position: 'absolute', top: '1rem', right: '1rem',
            background: 'var(--color-danger)', color: '#fff',
            padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-sm)',
            fontSize: '0.75rem', fontWeight: 600, zIndex: 10
          }}>
            Agotado
          </div>
        )}
        <Link to={`/p/${product.sku}`}>
          <img
            src={product.image_url ?? 'https://via.placeholder.com/400?text=No+Image'}
            alt={product.name}
            className="product-image"
            style={{ filter: outOfStock ? 'grayscale(1)' : 'none' }}
          />
        </Link>
        <button 
          className="product-action-btn"
          onClick={onAdd}
          disabled={outOfStock}
          aria-label="Agregar al carrito"
        >
          <ShoppingCart size={20} />
        </button>
      </div>

      <div className="product-info">
        {product.category_name && (
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
            {product.category_name}
          </div>
        )}
        
        <Link to={`/p/${product.sku}`} style={{ textDecoration: 'none' }}>
          <h3 className="product-title">{product.name}</h3>
        </Link>

        {/* Simulamos rating para el MVP, en la vida real vendría de la DB */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.75rem', color: '#f59e0b' }}>
          {[1,2,3,4,5].map(n => <Star key={n} size={12} fill={n <= 4 ? '#f59e0b' : 'none'} stroke="#f59e0b" />)}
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginLeft: '0.25rem' }}>(+50)</span>
        </div>

        <div style={{ marginTop: 'auto' }}>
          <PriceBadge sku={product.sku} defaultPrice={Number(product.base_price ?? 0)} />
        </div>
      </div>
    </div>
  );
};
