import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer style={{ 
      background: 'var(--color-bg-dark)', 
      color: 'var(--color-text-on-dark)',
      padding: '3rem 2rem 2rem 2rem',
      marginTop: 'auto'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '2.5rem',
        marginBottom: '2.5rem'
      }}>
        {/* Brand */}
        <div>
          <h2 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', marginBottom: '0.75rem', fontWeight: 900, letterSpacing: '0.08em' }}>KOVERA</h2>
          <p style={{ color: 'var(--color-text-on-dark-muted)', fontSize: '0.85rem', marginBottom: '1.25rem', lineHeight: 1.6 }}>
            El destino principal para tecnología de vanguardia. Equipos premium con garantía oficial y envíos a todo el Perú.
          </p>
        </div>

        {/* Links */}
        <div>
          <h3 style={{ fontSize: '0.9rem', marginBottom: '1rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Categorías Populares</h3>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li><Link to="/search?categoryId=1" style={{ color: 'var(--color-text-on-dark-muted)', textDecoration: 'none', fontSize: '0.85rem' }}>Celulares</Link></li>
            <li><Link to="/search?categoryId=2" style={{ color: 'var(--color-text-on-dark-muted)', textDecoration: 'none', fontSize: '0.85rem' }}>Laptops</Link></li>
            <li><Link to="/search?categoryId=4" style={{ color: 'var(--color-text-on-dark-muted)', textDecoration: 'none', fontSize: '0.85rem' }}>Audio</Link></li>
            <li><Link to="/search?categoryId=3" style={{ color: 'var(--color-text-on-dark-muted)', textDecoration: 'none', fontSize: '0.85rem' }}>Tablets</Link></li>
          </ul>
        </div>

        <div>
          <h3 style={{ fontSize: '0.9rem', marginBottom: '1rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Soporte</h3>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li><a href="#" style={{ color: 'var(--color-text-on-dark-muted)', textDecoration: 'none', fontSize: '0.85rem' }}>Centro de Ayuda</a></li>
            <li><a href="#" style={{ color: 'var(--color-text-on-dark-muted)', textDecoration: 'none', fontSize: '0.85rem' }}>Términos y Condiciones</a></li>
            <li><a href="#" style={{ color: 'var(--color-text-on-dark-muted)', textDecoration: 'none', fontSize: '0.85rem' }}>Políticas de Privacidad</a></li>
            <li><a href="#" style={{ color: 'var(--color-text-on-dark-muted)', textDecoration: 'none', fontSize: '0.85rem' }}>Libro de Reclamaciones</a></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 style={{ fontSize: '0.9rem', marginBottom: '1rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Club Kovera</h3>
          <p style={{ color: 'var(--color-text-on-dark-muted)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
            Recibe ofertas exclusivas y novedades de catálogo.
          </p>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input 
              type="email" 
              placeholder="Tu correo electrónico" 
              className="input" 
              style={{ 
                background: 'var(--color-bg-dark-elevated)', 
                border: '1px solid var(--color-border-dark)', 
                color: 'var(--color-text-on-dark)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.8rem',
                height: '38px'
              }} 
            />
            <button className="btn btn-primary" style={{ background: '#fff', color: '#000', fontSize: '0.8rem', height: '38px', padding: '0 0.875rem' }}>
              Unirse
            </button>
          </div>
        </div>
      </div>

      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        borderTop: '1px solid var(--color-border-dark)', 
        paddingTop: '1.5rem',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <p style={{ color: 'var(--color-text-on-dark-muted)', fontSize: '0.8rem', margin: 0 }}>
          &copy; {new Date().getFullYear()} Kovera Store. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
};
