import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';
import { CheckCircle, User, MapPin, CreditCard } from 'lucide-react';

type Step = 'datos' | 'pago' | 'confirmacion';

export const Checkout = () => {
  const { items, getTotals, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const { total } = getTotals();
  const [step, setStep] = useState<Step>('datos');
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    phone: '',
    address: '',
    district: '',
    city: 'Lima',
    notes: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    cardName: '',
  });

  const steps: { id: Step; label: string; icon: React.ReactNode }[] = [
    { id: 'datos', label: 'Datos', icon: <User size={16} /> },
    { id: 'pago', label: 'Pago', icon: <CreditCard size={16} /> },
    { id: 'confirmacion', label: 'Confirmación', icon: <CheckCircle size={16} /> },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const submitOrder = async () => {
    setLoading(true);
    setError('');
    try {
      const orderData = {
        items: items.map(i => ({
          productId: Number(i.productId),
          variationId: i.variationId ? Number(i.variationId) : undefined,
          quantity: i.quantity,
        })),
        guestEmail: user ? undefined : form.email,
        guestName: user ? undefined : form.name,
        shippingAddress: `${form.address}, ${form.district}, ${form.city}`,
        notes: form.notes,
        paymentMethod: 'credit_card',
      };
      const res = await api.post('/orders/checkout', orderData);
      setOrderId(res.data.orderNumber ?? res.data.id ?? 'KVR-' + Date.now());
      clearCart();
      setStep('confirmacion');
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Error al procesar el pedido. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0 && step !== 'confirmacion') {
    return (
      <div className="empty-state">
        <h2>Tu carrito está vacío</h2>
        <Link to="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>Ir al catálogo</Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 className="page-title" style={{ marginBottom: '2rem' }}>Finalizar compra</h1>

      {/* Stepper */}
      <div className="stepper">
        {steps.map((s, i) => (
          <div key={s.id} className={`step ${step === s.id ? 'active' : steps.indexOf(steps.find(x => x.id === step)!) > i ? 'completed' : ''}`}>
            <div className="step-icon">{s.icon}</div>
            <span className="step-label">{s.label}</span>
          </div>
        ))}
      </div>

      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 'var(--radius-md)', padding: '1rem', color: '#991b1b', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          {error}
        </div>
      )}

      {/* Step 1: Datos */}
      {step === 'datos' && (
        <div className="card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <MapPin size={20} style={{ color: 'var(--color-accent)' }} />
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Datos de envío</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="label" htmlFor="name">Nombre completo *</label>
              <input id="name" name="name" className="input" value={form.name} onChange={handleChange} placeholder="Tu nombre" required />
            </div>
            <div className="form-group">
              <label className="label" htmlFor="email">Email *</label>
              <input id="email" name="email" className="input" type="email" value={form.email} onChange={handleChange} placeholder="tu@email.com" required />
            </div>
            <div className="form-group">
              <label className="label" htmlFor="phone">Teléfono</label>
              <input id="phone" name="phone" className="input" value={form.phone} onChange={handleChange} placeholder="9XXXXXXXX" />
            </div>
            <div className="form-group">
              <label className="label" htmlFor="city">Ciudad</label>
              <select id="city" name="city" className="input" value={form.city} onChange={handleChange}>
                <option>Lima</option><option>Callao</option><option>Arequipa</option>
                <option>Trujillo</option><option>Chiclayo</option><option>Piura</option>
              </select>
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="label" htmlFor="address">Dirección *</label>
              <input id="address" name="address" className="input" value={form.address} onChange={handleChange} placeholder="Av. Ejemplo 123, Miraflores" required />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="label" htmlFor="notes">Notas adicionales (opcional)</label>
              <textarea id="notes" name="notes" className="input" value={form.notes} onChange={handleChange} rows={2} placeholder="Instrucciones especiales de entrega..." style={{ resize: 'vertical' }} />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button
              className="btn btn-primary btn-lg"
              onClick={() => setStep('pago')}
              disabled={!form.name || !form.email || !form.address}
              style={{ borderRadius: 'var(--radius-lg)' }}
            >
              Continuar al pago →
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Pago */}
      {step === 'pago' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <CreditCard size={20} style={{ color: 'var(--color-accent)' }} />
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Información de pago</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="label" htmlFor="cardName">Nombre en la tarjeta</label>
                <input id="cardName" name="cardName" className="input" value={form.cardName} onChange={handleChange} placeholder="NOMBRE APELLIDO" />
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="label" htmlFor="cardNumber">Número de tarjeta</label>
                <input id="cardNumber" name="cardNumber" className="input" value={form.cardNumber} onChange={handleChange} placeholder="•••• •••• •••• ••••" maxLength={19} />
              </div>
              <div className="form-group">
                <label className="label" htmlFor="cardExpiry">Vencimiento</label>
                <input id="cardExpiry" name="cardExpiry" className="input" value={form.cardExpiry} onChange={handleChange} placeholder="MM/AA" maxLength={5} />
              </div>
              <div className="form-group">
                <label className="label" htmlFor="cardCvv">CVV</label>
                <input id="cardCvv" name="cardCvv" className="input" value={form.cardCvv} onChange={handleChange} placeholder="•••" maxLength={4} type="password" />
              </div>
            </div>
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem', fontSize: '0.82rem', color: '#166534', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Tus datos de pago están protegidos con encriptación SSL de 256 bits.
            </div>
          </div>

          {/* Order summary */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '1rem' }}>Resumen</h3>
            {items.map(item => (
              <div key={item.productId} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', padding: '0.4rem 0', borderBottom: '1px solid var(--color-border)' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>{item.name} × {item.quantity}</span>
                <span style={{ fontWeight: 600 }}>S/ {(item.price * item.quantity).toLocaleString('es-PE', { minimumFractionDigits: 2 })}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.1rem', marginTop: '0.75rem', fontFamily: "'Outfit', sans-serif" }}>
              <span>Total</span>
              <span>S/ {total.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'space-between' }}>
            <button className="btn btn-outline" onClick={() => setStep('datos')} style={{ borderRadius: 'var(--radius-lg)' }}>← Volver</button>
            <button
              className="btn btn-primary btn-lg"
              onClick={submitOrder}
              disabled={loading}
              style={{ borderRadius: 'var(--radius-lg)', minWidth: '200px' }}
            >
              {loading ? '⏳ Procesando...' : `Pagar S/ ${total.toLocaleString('es-PE', { minimumFractionDigits: 2 })} →`}
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Confirmación */}
      {step === 'confirmacion' && (
        <div className="card animate-scale-in" style={{ padding: '3rem', textAlign: 'center' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <CheckCircle size={40} style={{ color: 'var(--color-success)' }} />
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, fontFamily: "'Outfit', sans-serif", marginBottom: '0.75rem' }}>¡Pedido confirmado!</h1>
          {orderId && (
            <p style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>
              Número de orden: <strong style={{ color: 'var(--color-primary)', fontFamily: 'monospace' }}>{orderId}</strong>
            </p>
          )}
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', maxWidth: '400px', margin: '1rem auto' }}>
            Te enviaremos un correo a <strong>{form.email}</strong> con los detalles de tu pedido y número de seguimiento.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
            <Link to="/" className="btn btn-primary btn-lg" style={{ borderRadius: 'var(--radius-lg)' }}>Seguir comprando</Link>
          </div>
        </div>
      )}
    </div>
  );
};
