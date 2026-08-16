import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Tag } from 'lucide-react';

interface PriceBadgeProps {
  sku: string;
  defaultPrice: number;
}

export const PriceBadge = ({ sku, defaultPrice }: PriceBadgeProps) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBadge = async () => {
      try {
        const response = await api.get(`/catalog/products/sku/${sku}/price-badge`);
        setData(response.data);
      } catch (err) {
        console.error('Error fetching price badge', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBadge();
  }, [sku]);

  if (loading) {
    return <div className="skeleton" style={{ width: '80px', height: '24px' }} />;
  }

  if (data?.has_campaign) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ 
            fontSize: '1.25rem', 
            fontWeight: 800, 
            color: 'var(--color-danger)',
            fontFamily: 'var(--font-display)'
          }}>
            S/ {data.campaign_price.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
          </span>
          <span className="badge" style={{ background: 'var(--color-danger)', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
            <Tag size={12} /> -{data.discount_percentage}%
          </span>
        </div>
        <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', textDecoration: 'line-through' }}>
          S/ {data.base_price.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
        </div>
        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-danger)', textTransform: 'uppercase' }}>
          {data.campaign_name}
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      fontSize: '1.25rem', 
      fontWeight: 800, 
      color: 'var(--color-text-primary)',
      fontFamily: 'var(--font-display)'
    }}>
      S/ {defaultPrice.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
    </div>
  );
};
