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
      <div className="product-card-image">
        {outOfStock && (
          <span className="badge badge-danger product-card-badge">
            Agotado
          </span>
        )}
        <Link to={`/p/${product.sku}`} style={{ display: 'block', width: '100%', height: '100%' }}>
          <img
            src={product.image_url || 'https://picsum.photos/seed/kovera/400/400'}
            alt={product.name}
            loading="lazy"
            onError={(e) => { (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/' + product.id + '/400/400'; }}
            style={{ filter: outOfStock ? 'grayscale(1)' : 'none' }}
          />
        </Link>
        <button 
          className="product-card-add-btn"
          onClick={(e) => { e.preventDefault(); onAdd(); }}
          disabled={outOfStock}
          aria-label="Agregar al carrito"
          title="Agregar al carrito"
        >
          <ShoppingCart size={15} />
        </button>
      </div>

      <div className="product-card-body">
        {product.category_name && (
          <div className="product-card-category">
            {product.category_name}
          </div>
        )}
        
        <Link to={`/p/${product.sku}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <h3 className="product-card-name" title={product.name}>{product.name}</h3>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#f59e0b', fontSize: '0.75rem', marginTop: '0.2rem' }}>
          {[1,2,3,4,5].map(n => <Star key={n} size={11} fill={n <= 4 ? '#f59e0b' : 'none'} stroke="#f59e0b" />)}
          <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginLeft: '0.25rem' }}>(4.5)</span>
        </div>

        <div style={{ marginTop: 'auto', paddingTop: '0.4rem' }}>
          <PriceBadge sku={product.sku} defaultPrice={Number(product.base_price ?? 0)} />
        </div>
      </div>
    </div>
  );
};
