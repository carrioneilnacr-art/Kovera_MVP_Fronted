import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Clock, Zap } from 'lucide-react';

export const CampaignBanner = () => {
  const [campaign, setCampaign] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState<{ d: number; h: number; m: number; s: number } | null>(null);

  const fetchActive = async () => {
    try {
      const response = await api.get('/campaigns/active');
      if (response.data && response.data.length > 0) {
        setCampaign(response.data[0]);
      }
    } catch (e) {
      console.error('Error fetching active campaign', e);
    }
  };

  useEffect(() => {
    fetchActive();
  }, []);

  // Timer logic
  useEffect(() => {
    if (!campaign?.ends_at) return;
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(campaign.ends_at).getTime();
      const distance = end - now;

      if (distance < 0) {
        clearInterval(interval);
        setCampaign(null);
        return;
      }

      setTimeLeft({
        d: Math.floor(distance / (1000 * 60 * 60 * 24)),
        h: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        m: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        s: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [campaign]);

  if (!campaign || !timeLeft) return null;

  return (
    <div style={{
      background: 'var(--color-bg-dark)',
      color: 'var(--color-text-on-dark)',
      padding: '1rem',
      borderRadius: 'var(--radius-lg)',
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '1rem',
      boxShadow: 'var(--shadow-md)',
      position: 'relative',
      overflow: 'hidden',
      marginBottom: '2rem'
    }}>
      {/* Decorative gradient */}
      <div style={{
        position: 'absolute',
        top: 0, right: 0, bottom: 0,
        width: '30%',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.05))',
        pointerEvents: 'none'
      }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', zIndex: 1 }}>
        <div style={{ 
          width: 48, height: 48, 
          borderRadius: 'var(--radius-md)', 
          background: 'var(--color-accent)', 
          color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center' 
        }}>
          <Zap size={24} />
        </div>
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {campaign.name}
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-on-dark-muted)' }}>
            Ofertas exclusivas por tiempo limitado
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-warning)' }}>
          <Clock size={18} />
          <span style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>Termina en:</span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {[
            { label: 'D', value: timeLeft.d },
            { label: 'H', value: timeLeft.h },
            { label: 'M', value: timeLeft.m },
            { label: 'S', value: timeLeft.s }
          ].map((t, i) => (
            <div key={i} style={{ 
              background: 'rgba(255,255,255,0.1)', 
              borderRadius: 'var(--radius-sm)',
              padding: '0.4rem',
              minWidth: '40px',
              textAlign: 'center',
              border: '1px solid rgba(255,255,255,0.15)'
            }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: 'var(--font-display)', lineHeight: 1 }}>
                {t.value.toString().padStart(2, '0')}
              </div>
              <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.6)', marginTop: '0.1rem' }}>
                {t.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
