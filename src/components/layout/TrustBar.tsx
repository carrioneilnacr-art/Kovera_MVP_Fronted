import { Truck, Shield, Star, HeadphonesIcon } from 'lucide-react';

export const TrustBar = () => {
  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
      gap: '1rem',
      padding: '1.5rem 0',
      borderTop: '1px solid var(--color-border)',
      borderBottom: '1px solid var(--color-border)',
      marginTop: '2.5rem',
      marginBottom: '2.5rem'
    }}>
      {[
        { icon: <Truck size={20} />, title: 'Envíos a todo el Perú', desc: 'Gratis en compras mayores a S/ 500' },
        { icon: <Star size={20} />, title: 'Garantía Oficial', desc: '12 meses en todos los equipos' },
        { icon: <Shield size={20} />, title: 'Compra 100% Segura', desc: 'Tus datos están protegidos' },
        { icon: <HeadphonesIcon size={20} />, title: 'Atención 24/7', desc: 'Soporte especializado' },
      ].map(({ icon, title, desc }) => (
        <div key={title} style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.875rem', 
          padding: '0.875rem',
          background: 'var(--color-bg-card)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border)'
        }}>
          <div style={{ 
            width: 40, 
            height: 40, 
            borderRadius: 'var(--radius-sm)', 
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
            <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--color-text-primary)' }}>{title}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{desc}</div>
          </div>
        </div>
      ))}
    </div>
  );
};
