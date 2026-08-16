import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { RefreshCw, Plus } from 'lucide-react';

export const InvoicesManager = () => {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    supplierId: '',
    totalCost: '',
    dateReceived: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const fetch = async () => {
    setLoading(true);
    try {
      const [invRes, supRes] = await Promise.all([
        api.get('/erp/invoices'),
        api.get('/erp/suppliers'),
      ]);
      setInvoices(invRes.data || []);
      setSuppliers(supRes.data || []);
    } catch { /* silence */ }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await api.post('/erp/invoices', {
        supplierId: Number(form.supplierId),
        totalCost: Number(form.totalCost),
        dateReceived: form.dateReceived,
        notes: form.notes,
        items: [], // Se pueden agregar ítems en futuras versiones
      });
      setShowModal(false);
      setForm({ supplierId: '', totalCost: '', dateReceived: new Date().toISOString().split('T')[0], notes: '' });
      fetch();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Error al crear factura');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Facturas de Compra</h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
            {invoices.length} facturas · Total: S/ {invoices.reduce((s, i) => s + Number(i.total_cost ?? 0), 0).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-outline btn-sm" onClick={fetch} aria-label="Refrescar"><RefreshCw size={15} /></button>
          <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
            <Plus size={15} /> Nueva factura
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: '52px', borderRadius: 'var(--radius-md)' }} />)}
        </div>
      ) : invoices.length === 0 ? (
        <div className="empty-state">
          <p>No hay facturas registradas aún.</p>
          <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => setShowModal(true)}>
            + Crear primera factura
          </button>
        </div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Proveedor</th>
                <th>Costo total</th>
                <th>Fecha recibido</th>
                <th>Fecha registro</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv: any) => (
                <tr key={inv.id}>
                  <td style={{ color: 'var(--color-text-muted)', fontSize: '0.82rem' }}>{inv.id}</td>
                  <td style={{ fontWeight: 600 }}>{inv.supplier?.company_name ?? suppliers.find(s => s.id === inv.supplier_id)?.company_name ?? `Proveedor #${inv.supplier_id}`}</td>
                  <td style={{ fontWeight: 700, fontFamily: "'Outfit', sans-serif", color: 'var(--color-success)' }}>
                    S/ {Number(inv.total_cost ?? 0).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                  </td>
                  <td style={{ color: 'var(--color-text-secondary)', fontSize: '0.88rem' }}>
                    {inv.date_received ? new Date(inv.date_received).toLocaleDateString('es-PE') : '—'}
                  </td>
                  <td style={{ color: 'var(--color-text-muted)', fontSize: '0.82rem' }}>
                    {inv.created_at ? new Date(inv.created_at).toLocaleDateString('es-PE') : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Modal */}
      {showModal && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="inv-modal-title" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal-box">
            <div className="modal-header">
              <h2 id="inv-modal-title" style={{ fontWeight: 700 }}>Nueva Factura de Compra</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', fontSize: '1.25rem' }} aria-label="Cerrar modal">×</button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="modal-body">
                {error && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 'var(--radius-md)', padding: '0.75rem', color: '#991b1b', fontSize: '0.875rem', marginBottom: '1rem' }}>{error}</div>}
                <div className="form-group">
                  <label className="label" htmlFor="inv-supplier">Proveedor *</label>
                  <select id="inv-supplier" className="input" required value={form.supplierId} onChange={e => setForm(f => ({ ...f, supplierId: e.target.value }))}>
                    <option value="">Seleccionar proveedor...</option>
                    {suppliers.map(s => <option key={s.id} value={s.id}>{s.company_name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="label" htmlFor="inv-cost">Costo total (S/) *</label>
                  <input id="inv-cost" type="number" min="0" step="0.01" className="input" required value={form.totalCost} onChange={e => setForm(f => ({ ...f, totalCost: e.target.value }))} placeholder="0.00" />
                </div>
                <div className="form-group">
                  <label className="label" htmlFor="inv-date">Fecha de recepción *</label>
                  <input id="inv-date" type="date" className="input" required value={form.dateReceived} onChange={e => setForm(f => ({ ...f, dateReceived: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="label" htmlFor="inv-notes">Notas</label>
                  <textarea id="inv-notes" className="input" rows={2} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Observaciones..." style={{ resize: 'vertical' }} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Guardando...' : 'Crear factura'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
