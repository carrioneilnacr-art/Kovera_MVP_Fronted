import React from 'react';
import { 
  Smartphone, Laptop, Tablet, Headphones, Watch, 
  Camera, Cable, Gamepad2, Tv, Printer, LayoutGrid 
} from 'lucide-react';
import type { Category } from '../../types';

interface CategoryIconGridProps {
  categories: Category[];
  activeCategory: number | null;
  onSelect: (id: number | null) => void;
  categoryIcons?: Record<string, string>;
}

export const CategoryIconGrid: React.FC<CategoryIconGridProps> = ({ 
  categories, 
  activeCategory, 
  onSelect 
}) => {
  const mainCategories = categories.filter(c => !c.parentId);

  const renderIcon = (slug: string) => {
    switch (slug) {
      case 'celulares':
      case 'samsung-galaxy':
        return <Smartphone size={20} strokeWidth={1.75} />;
      case 'laptops':
      case 'laptops-apple':
      case 'laptops-gaming':
        return <Laptop size={20} strokeWidth={1.75} />;
      case 'tablets':
        return <Tablet size={20} strokeWidth={1.75} />;
      case 'audio':
      case 'auriculares-iphone':
        return <Headphones size={20} strokeWidth={1.75} />;
      case 'smartwatches':
        return <Watch size={20} strokeWidth={1.75} />;
      case 'camaras':
        return <Camera size={20} strokeWidth={1.75} />;
      case 'accesorios':
        return <Cable size={20} strokeWidth={1.75} />;
      case 'gaming':
        return <Gamepad2 size={20} strokeWidth={1.75} />;
      case 'televisores':
        return <Tv size={20} strokeWidth={1.75} />;
      case 'impresoras':
        return <Printer size={20} strokeWidth={1.75} />;
      default:
        return <LayoutGrid size={20} strokeWidth={1.75} />;
    }
  };

  return (
    <section style={{ marginBottom: '2.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}>
          Explorar categorías
        </h2>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', 
        gap: '0.625rem' 
      }}>
        {/* Todos button */}
        <button
          onClick={() => onSelect(null)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.4rem',
            padding: '0.875rem 0.5rem',
            background: activeCategory === null ? 'var(--color-primary)' : 'var(--color-bg-card)',
            color: activeCategory === null ? '#ffffff' : 'var(--color-text-primary)',
            borderRadius: 'var(--radius-md)',
            border: `1px solid ${activeCategory === null ? 'var(--color-primary)' : 'var(--color-border)'}`,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          <div style={{ 
            color: activeCategory === null ? '#ffffff' : 'var(--color-text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <LayoutGrid size={20} strokeWidth={1.75} />
          </div>
          <span style={{ fontWeight: 600, fontSize: '0.78rem', textAlign: 'center' }}>Todos</span>
        </button>

        {mainCategories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                padding: '0.875rem 0.5rem',
                background: isActive ? 'var(--color-primary)' : 'var(--color-bg-card)',
                color: isActive ? '#ffffff' : 'var(--color-text-primary)',
                borderRadius: 'var(--radius-md)',
                border: `1px solid ${isActive ? 'var(--color-primary)' : 'var(--color-border)'}`,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{ 
                color: isActive ? '#ffffff' : 'var(--color-text-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {renderIcon(cat.slug)}
              </div>
              <span style={{ fontWeight: 600, fontSize: '0.78rem', textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '95px' }}>
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};
