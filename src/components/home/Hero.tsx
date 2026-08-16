import { Link } from 'react-router-dom';

export const Hero = () => {
  return (
    <section style={{
      background: 'linear-gradient(135deg, #0c0c0d 0%, #1a1a2e 100%)',
      borderRadius: 'var(--radius-xl)',
      padding: '4rem 2rem',
      marginBottom: '3rem',
      color: 'var(--color-text-on-dark)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      minHeight: '450px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative gradient orb */}
      <div style={{
        position: 'absolute',
        right: '-10%',
        top: '-20%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(96,165,250,0.15) 0%, rgba(0,0,0,0) 70%)',
        borderRadius: '50%',
        pointerEvents: 'none'
      }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '600px' }}>
        <h1 style={{
          fontSize: 'clamp(2.5rem, 5vw, 4rem)',
          fontWeight: 900,
          fontFamily: 'var(--font-display)',
          lineHeight: 1.1,
          marginBottom: '1.5rem',
          letterSpacing: '-0.02em'
        }}>
          Tecnología de <br />
          <span style={{ background: 'linear-gradient(90deg, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>vanguardia</span>
          <br />a tu alcance.
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '2rem', maxWidth: '480px' }}>
          Los mejores smartphones, laptops, audio y más. Envío gratis a todo el Perú en compras mayores a S/ 500.
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <a href="#catalogo" className="btn btn-accent btn-lg" style={{ borderRadius: '12px' }}>
            Explorar catálogo →
          </a>
          <Link to="/admin" className="btn btn-outline btn-lg" style={{ borderRadius: '12px', color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }}>
            Panel Admin
          </Link>
        </div>
        
        <div style={{ display: 'flex', gap: '2.5rem', marginTop: '3rem' }}>
          {[
            ['91+', 'Productos'], 
            ['10k+', 'Clientes Felices'], 
            ['14', 'Categorías']
          ].map(([n, l]) => (
            <div key={l}>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: '#60a5fa' }}>{n}</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '0.2rem' }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
