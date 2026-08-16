import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { RefreshCw, Plus } from 'lucide-react';

export const SuppliersManager = () => {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ company_name: '', contact_email: '', phone: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await api.get('/erp/suppliers');
      setSuppliers(res.data || []);
    } catch { /* silence */ }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await api.post('/erp/suppliers', form);
      setShowModal(false);
      setForm({ company_name: '', contact_email: '', phone: '' });
      fetch();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Error al crear proveedor');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Proveedores</h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>{suppliers.length} proveedores registrados</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-outline btn-sm" onClick={fetch} aria-label="Refrescar"><RefreshCw size={15} /></button>
          <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
            <Plus size={15} /> Nuevo proveedor
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: '52px', borderRadius: 'var(--radius-md)' }} />)}
        </div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Empresa</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Fecha registro</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((s: any) => (
                <tr key={s.id}>
                  <td style={{ color: 'var(--color-text-muted)', fontSize: '0.82rem' }}>{s.id}</td>
                  <td style={{ fontWeight: 600 }}>{s.company_name}</td>
                  <td style={{ color: 'var(--color-text-secondary)', fontSize: '0.88rem' }}>{s.contact_email ?? '—'}</td>
                  <td style={{ color: 'var(--color-text-secondary)', fontSize: '0.88rem' }}>{s.phone ?? '—'}</td>
                  <td style={{ color: 'var(--color-text-muted)', fontSize: '0.82rem' }}>
                    {s.created_at ? new Date(s.created_at).toLocaleDateString('es-PE') : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Modal */}
      {showModal && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="supplier-modal-title" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal-box">
            <div className="modal-header">
              <h2 id="supplier-modal-title" style={{ fontWeight: 700 }}>Nuevo Proveedor</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', fontSize: '1.25rem' }} aria-label="Cerrar modal">×</button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="modal-body">
                {error && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 'var(--radius-md)', padding: '0.75rem', color: '#991b1b', fontSize: '0.875rem', marginBottom: '1rem' }}>⚠️ {error}</div>}
                <div className="form-group">
                  <label className="label" htmlFor="sup-name">Nombre de la empresa *</label>
                  <input id="sup-name" className="input" required value={form.company_name} onChange={e => setForm(f => ({ ...f, company_name: e.target.value }))} placeholder="Empresa S.A.C." />
                </div>
                <div className="form-group">
                  <label className="label" htmlFor="sup-email">Email de contacto</label>
                  <input id="sup-email" type="email" className="input" value={form.contact_email} onChange={e => setForm(f => ({ ...f, contact_email: e.target.value }))} placeholder="ventas@empresa.com" />
                </div>
                <div className="form-group">
                  <label className="label" htmlFor="sup-phone">Teléfono</label>
                  <input id="sup-phone" className="input" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="01-XXX-XXXX" />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Guardando...' : 'Crear proveedor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
