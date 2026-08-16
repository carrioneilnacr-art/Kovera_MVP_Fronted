import type { Category } from '../../types';

interface CategoryIconGridProps {
  categories: Category[];
  activeCategory: number | null;
  onSelect: (id: number | null) => void;
  categoryIcons: Record<string, string>;
}

export const CategoryIconGrid = ({ categories, activeCategory, onSelect, categoryIcons }: CategoryIconGridProps) => {
  const mainCategories = categories.filter(c => !c.parent_id);

  return (
    <section style={{ marginBottom: '3rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
        <h2 className="section-title" style={{ marginBottom: 0 }}>Explorar categorías</h2>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', 
        gap: '1rem' 
      }}>
        <button
          onClick={() => onSelect(null)}
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem',
            padding: '1.25rem 1rem',
            background: activeCategory === null ? 'var(--color-primary)' : 'var(--color-bg-card)',
            color: activeCategory === null ? '#fff' : 'var(--color-text-primary)',
            borderRadius: 'var(--radius-lg)',
            border: `1px solid ${activeCategory === null ? 'var(--color-primary)' : 'var(--color-border)'}`,
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: activeCategory === null ? '0 4px 12px rgba(99, 102, 241, 0.2)' : 'none'
          }}
        >
          <div style={{ fontSize: '1.75rem' }}>✨</div>
          <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Todos</span>
        </button>

        {mainCategories.map((cat) => {
          const isActive = activeCategory === cat.id || categories.some(sub => sub.parent_id === cat.id && sub.id === activeCategory);
          return (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem',
                padding: '1.25rem 1rem',
                background: isActive ? 'var(--color-primary)' : 'var(--color-bg-card)',
                color: isActive ? '#fff' : 'var(--color-text-primary)',
                borderRadius: 'var(--radius-lg)',
                border: `1px solid ${isActive ? 'var(--color-primary)' : 'var(--color-border)'}`,
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: isActive ? '0 4px 12px rgba(99, 102, 241, 0.2)' : 'none'
              }}
            >
              <div style={{ fontSize: '1.75rem' }}>{categoryIcons[cat.slug] ?? '📦'}</div>
              <span style={{ fontWeight: 600, fontSize: '0.85rem', textAlign: 'center' }}>{cat.name}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
};
