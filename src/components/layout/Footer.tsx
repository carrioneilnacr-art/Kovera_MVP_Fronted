import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer style={{ 
      background: 'var(--color-bg-dark)', 
      color: 'var(--color-text-on-dark)',
      padding: '4rem 2rem 2rem 2rem',
      marginTop: 'auto'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '3rem',
        marginBottom: '3rem'
      }}>
        {/* Brand */}
        <div>
          <h2 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-display)', marginBottom: '1rem' }}>KOVERA.</h2>
          <p style={{ color: 'var(--color-text-on-dark-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            El destino principal para la tecnología de vanguardia. Equipos premium, garantía oficial y envíos a todo el Perú.
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <a href="#" style={{ color: 'var(--color-text-on-dark)', textDecoration: 'none' }}>FB</a>
            <a href="#" style={{ color: 'var(--color-text-on-dark)', textDecoration: 'none' }}>IG</a>
            <a href="#" style={{ color: 'var(--color-text-on-dark)', textDecoration: 'none' }}>TW</a>
            <a href="#" style={{ color: 'var(--color-text-on-dark)', textDecoration: 'none' }}>YT</a>
          </div>
        </div>

        {/* Links */}
        <div>
          <h3 style={{ fontSize: '1rem', marginBottom: '1.5rem' }}>Categorías Populares</h3>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <li><Link to="/search?categoryId=1" style={{ color: 'var(--color-text-on-dark-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>Celulares y Smartphones</Link></li>
            <li><Link to="/search?categoryId=2" style={{ color: 'var(--color-text-on-dark-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>Laptops Premium</Link></li>
            <li><Link to="/search?categoryId=4" style={{ color: 'var(--color-text-on-dark-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>Audio High-End</Link></li>
            <li><Link to="/search?categoryId=3" style={{ color: 'var(--color-text-on-dark-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>Tablets</Link></li>
          </ul>
        </div>

        <div>
          <h3 style={{ fontSize: '1rem', marginBottom: '1.5rem' }}>Soporte</h3>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <li><a href="#" style={{ color: 'var(--color-text-on-dark-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>Centro de Ayuda</a></li>
            <li><a href="#" style={{ color: 'var(--color-text-on-dark-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>Términos y Condiciones</a></li>
            <li><a href="#" style={{ color: 'var(--color-text-on-dark-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>Políticas de Privacidad</a></li>
            <li><a href="#" style={{ color: 'var(--color-text-on-dark-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>Libro de Reclamaciones</a></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 style={{ fontSize: '1rem', marginBottom: '1.5rem' }}>Únete al Club Kovera</h3>
          <p style={{ color: 'var(--color-text-on-dark-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
            Recibe ofertas exclusivas y acceso anticipado a campañas.
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
                borderRadius: 'var(--radius-md)'
              }} 
            />
            <button className="btn btn-primary" style={{ background: '#fff', color: '#000' }}>
              Suscribirse
            </button>
          </div>
        </div>
      </div>

      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        borderTop: '1px solid var(--color-border-dark)', 
        paddingTop: '2rem',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <p style={{ color: 'var(--color-text-on-dark-muted)', fontSize: '0.85rem' }}>
          &copy; {new Date().getFullYear()} Kovera Store. Todos los derechos reservados.
        </p>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <span style={{ color: 'var(--color-text-on-dark-muted)', fontSize: '1.5rem' }}>💳</span>
          <span style={{ color: 'var(--color-text-on-dark-muted)', fontSize: '1.5rem' }}>🏦</span>
          <span style={{ color: 'var(--color-text-on-dark-muted)', fontSize: '1.5rem' }}>🚚</span>
        </div>
      </div>
    </footer>
  );
};
