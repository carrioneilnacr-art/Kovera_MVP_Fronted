import { Truck, Shield, Star, HeadphonesIcon } from 'lucide-react';

export const TrustBar = () => {
  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
      gap: '1rem',
      padding: '2rem 0',
      borderTop: '1px solid var(--color-border)',
      borderBottom: '1px solid var(--color-border)',
      marginTop: '3rem',
      marginBottom: '3rem'
    }}>
      {[
        { icon: <Truck size={24} />, title: 'Envíos a todo el Perú', desc: 'Gratis por compras mayores a S/ 500' },
        { icon: <Star size={24} />, title: 'Garantía Oficial', desc: '12 meses en todos los equipos' },
        { icon: <Shield size={24} />, title: 'Compra 100% Segura', desc: 'Tus datos están protegidos' },
        { icon: <HeadphonesIcon size={24} />, title: 'Atención 24/7', desc: 'Soporte especializado' },
      ].map(({ icon, title, desc }) => (
        <div key={title} style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '1rem', 
          padding: '1rem',
          background: 'var(--color-bg-card)',
          borderRadius: 'var(--radius-lg)'
        }}>
          <div style={{ 
            width: 48, 
            height: 48, 
            borderRadius: 'var(--radius-pill)', 
            background: 'var(--color-bg-subtle)', 
            color: 'var(--color-accent)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            flexShrink: 0 
          }}>
            {icon}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-text-primary)' }}>{title}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>{desc}</div>
          </div>
        </div>
      ))}
    </div>
  );
};
