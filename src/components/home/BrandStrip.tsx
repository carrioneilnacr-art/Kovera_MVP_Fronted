export const BrandStrip = () => {
  const brands = [
    { name: 'Apple', logo: '🍎' },
    { name: 'Samsung', logo: '📱' },
    { name: 'Sony', logo: '🎮' },
    { name: 'LG', logo: '📺' },
    { name: 'Lenovo', logo: '💻' },
    { name: 'HP', logo: '🖨️' },
  ];

  return (
    <div style={{
      padding: '2rem 0',
      borderTop: '1px solid var(--color-border)',
      borderBottom: '1px solid var(--color-border)',
      marginBottom: '4rem',
      overflow: 'hidden',
      background: 'var(--color-bg-subtle)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '2rem',
        opacity: 0.7
      }}>
        {brands.map(brand => (
          <div key={brand.name} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-secondary)' }}>
            <span style={{ fontSize: '1.5rem' }}>{brand.logo}</span>
            {brand.name}
          </div>
        ))}
      </div>
    </div>
  );
};
