export const BrandStrip = () => {
  const brands = [
    'Apple', 'Samsung', 'Sony', 'LG', 'Lenovo', 'HP', 'Dell', 'Xiaomi'
  ];

  return (
    <div style={{
      padding: '1.5rem 0',
      borderTop: '1px solid var(--color-border)',
      borderBottom: '1px solid var(--color-border)',
      marginBottom: '2.5rem',
      overflow: 'hidden',
      background: 'var(--color-bg-card)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem',
      }}>
        {brands.map(name => (
          <span 
            key={name} 
            style={{ 
              fontSize: '1rem', 
              fontWeight: 800, 
              letterSpacing: '0.08em', 
              color: 'var(--color-text-muted)',
              textTransform: 'uppercase',
              fontFamily: "'Outfit', sans-serif"
            }}
          >
            {name}
          </span>
        ))}
      </div>
    </div>
  );
};
