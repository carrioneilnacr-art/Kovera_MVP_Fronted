import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Star, MessageCircle, User } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

interface ProductReviewsProps {
  productId: number;
}

export const ProductReviews = ({ productId }: ProductReviewsProps) => {
  const [data, setData] = useState<{ reviews: any[]; total_reviews: number; average_rating: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuthStore();
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = async () => {
    try {
      const response = await api.get(`/reviews/product/${productId}`);
      setData(response.data);
    } catch (e) {
      console.error('Error fetching reviews', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.comment.trim()) return;
    
    setSubmitting(true);
    try {
      await api.post('/reviews', {
        product_id: productId,
        rating: newReview.rating,
        comment: newReview.comment
      });
      setNewReview({ rating: 5, comment: '' });
      fetchReviews();
      alert('Reseña enviada correctamente. Está pendiente de aprobación.');
    } catch (e: any) {
      alert(e.response?.data?.message || 'Error al enviar reseña');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="skeleton" style={{ height: '200px' }} />;

  return (
    <div style={{ marginTop: '3rem', borderTop: '1px solid var(--color-border)', paddingTop: '2rem' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-display)', marginBottom: '1.5rem' }}>
        Opiniones de clientes
      </h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
        {/* Resumen */}
        <div className="card" style={{ padding: '2rem', textAlign: 'center', alignSelf: 'start' }}>
          <div style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--color-primary)', lineHeight: 1 }}>
            {data?.average_rating}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.2rem', margin: '0.5rem 0', color: 'var(--color-warning)' }}>
            {[1,2,3,4,5].map(star => (
              <Star key={star} size={20} fill={star <= Number(data?.average_rating) ? 'currentColor' : 'none'} />
            ))}
          </div>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
            Basado en {data?.total_reviews} reseñas
          </p>
        </div>

        {/* Lista de reseñas */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {data?.reviews.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)', background: 'var(--color-bg-card)', borderRadius: 'var(--radius-lg)' }}>
              <MessageCircle size={32} style={{ margin: '0 auto 0.5rem', opacity: 0.5 }} />
              <p>Aún no hay reseñas para este producto. ¡Sé el primero en opinar!</p>
            </div>
          ) : (
            data?.reviews.map((r: any) => (
              <div key={r.id} style={{ padding: '1.5rem', background: 'var(--color-bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <User size={16} />
                    </div>
                    <span style={{ fontWeight: 600 }}>{r.user_name}</span>
                  </div>
                  <div style={{ color: 'var(--color-warning)', display: 'flex', gap: '0.1rem' }}>
                    {[1,2,3,4,5].map(star => (
                      <Star key={star} size={14} fill={star <= r.rating ? 'currentColor' : 'none'} />
                    ))}
                  </div>
                </div>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                  {r.comment}
                </p>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.75rem' }}>
                  {new Date(r.created_at).toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              </div>
            ))
          )}

          {/* Formulario */}
          {isAuthenticated ? (
            <form onSubmit={handleSubmit} className="card" style={{ padding: '1.5rem', marginTop: '1rem' }}>
              <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Escribe una reseña</h3>
              <div className="form-control" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Calificación</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {[1,2,3,4,5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                      style={{ color: star <= newReview.rating ? 'var(--color-warning)' : 'var(--color-border)', background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      <Star size={24} fill="currentColor" />
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-control" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Tu opinión</label>
                <textarea 
                  className="input" 
                  rows={4} 
                  required
                  value={newReview.comment}
                  onChange={e => setNewReview({ ...newReview, comment: e.target.value })}
                  placeholder="¿Qué te pareció el producto?"
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Enviando...' : 'Enviar reseña'}
              </button>
            </form>
          ) : (
            <div style={{ padding: '1.5rem', textAlign: 'center', background: '#eff6ff', borderRadius: 'var(--radius-lg)', marginTop: '1rem' }}>
              <p style={{ color: '#1e40af', marginBottom: '0.5rem' }}>Para dejar una reseña, inicia sesión en tu cuenta.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
