import { Link } from 'react-router-dom';

export const Hero = () => {
  return (
    <section style={{
      background: 'linear-gradient(135deg, #0c0c0d 0%, #17171c 100%)',
      borderRadius: 'var(--radius-lg)',
      padding: '3.5rem 2rem',
      marginBottom: '2.5rem',
      color: 'var(--color-text-on-dark)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      minHeight: '380px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ position: 'relative', zIndex: 1, maxWidth: '600px' }}>
        <h1 style={{
          fontSize: 'clamp(2rem, 4vw, 3.25rem)',
          fontWeight: 900,
          fontFamily: 'var(--font-display)',
          lineHeight: 1.15,
          marginBottom: '1rem',
          letterSpacing: '-0.02em'
        }}>
          Tecnología de <br />
          <span style={{ background: 'linear-gradient(90deg, #60a5fa, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>vanguardia</span>
          <br />a tu alcance.
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.75rem', maxWidth: '480px' }}>
          Los mejores smartphones, laptops, audio y accesorios con garantía oficial y envíos a todo el Perú.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <a href="#catalogo" className="btn btn-accent" style={{ borderRadius: '8px' }}>
            Explorar catálogo &rarr;
          </a>
          <Link to="/admin" className="btn btn-outline" style={{ borderRadius: '8px', color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }}>
            Panel Admin
          </Link>
        </div>
        
        <div style={{ display: 'flex', gap: '2rem', marginTop: '2.5rem' }}>
          {[
            ['300+', 'Productos'], 
            ['10k+', 'Clientes'], 
            ['10', 'Categorías']
          ].map(([n, l]) => (
            <div key={l}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: '#ffffff' }}>{n}</div>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '0.15rem' }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
