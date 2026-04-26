import { useState } from 'react';
import { Search, Send, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const MOCK_FINANZAS = [
  { id: 101, ticket: 'SRV-001A', fecha: '10 Abr 2026', cliente: 'Carlos Mendoza', servicio: 'Remolque Grúa Plana (15km)', monto: 150.00, estado: 'Completado' },
  { id: 102, ticket: 'SRV-002B', fecha: '09 Abr 2026', cliente: 'Lucía Fernández', servicio: 'Asistencia en sitio (Batería)', monto: 45.00, estado: 'Pendiente' },
  { id: 103, ticket: 'SRV-003C', fecha: '08 Abr 2026', cliente: 'Martín Gómez', servicio: 'Cambio de Neumático', monto: 35.00, estado: 'Completado' },
  { id: 104, ticket: 'SRV-004D', fecha: '05 Abr 2026', cliente: 'Andrea Silva', servicio: 'Siniestro Complejo Extracción', monto: 250.00, estado: 'Completado' },
];

const Finanzas = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFinanzas = MOCK_FINANZAS.filter(f =>
    f.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.ticket.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEnviarBoleto = (ticket) => {
    toast.success(`Boleto ${ticket} enviado.`);
  };

  return (
    <div className="page-wrapper" style={{ padding: '2rem' }}>
      <Toaster position="bottom-right" />
      
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '0.25rem' }}>Resumen Financiero</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px' }}>Seguimiento de ingresos y facturación de servicios.</p>
      </div>

      {/* Metrics Row (Minimalist boxes) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div className="card" style={{ padding: '1.25rem' }}>
          <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Ingresos Brutos</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 700 }}>$480.00</h2>
            <span style={{ fontSize: '12px', color: 'var(--color-success)', fontWeight: 600, display: 'flex', alignItems: 'center' }}>
              <ArrowUpRight size={14} /> +12%
            </span>
          </div>
        </div>
        <div className="card" style={{ padding: '1.25rem' }}>
          <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Servicios Pagados</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 700 }}>124</h2>
            <span style={{ fontSize: '12px', color: 'var(--color-success)', fontWeight: 600, display: 'flex', alignItems: 'center' }}>
               <ArrowUpRight size={14} /> +5%
            </span>
          </div>
        </div>
        <div className="card" style={{ padding: '1.25rem' }}>
          <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Pendientes de Cobro</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 700 }}>$45.00</h2>
            <span style={{ fontSize: '12px', color: 'var(--color-danger)', fontWeight: 600, display: 'flex', alignItems: 'center' }}>
               <ArrowDownRight size={14} /> -2%
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center' }}>
        <div className="input-wrapper" style={{ flex: 1, maxWidth: '400px' }}>
          <Search size={14} className="input-icon" />
          <input
            type="text"
            className="input"
            placeholder="Filtrar por cliente o ticket..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="btn-ghost" style={{ fontSize: '12px' }}>Período Actual</button>
      </div>

      {/* Simple List (Mapbox style) */}
      <div className="table-container">
        <div className="table-header" style={{ padding: '0.75rem 1.5rem', display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ flex: 1 }}>Servicio / Cliente</span>
          <span style={{ width: '120px', textAlign: 'center' }}>Monto</span>
          <span style={{ width: '120px', textAlign: 'center' }}>Estado</span>
          <span style={{ width: '120px', textAlign: 'right' }}>Acciones</span>
        </div>
        <div>
          {filteredFinanzas.map(item => (
            <div key={item.id} className="table-row" style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '13px' }}>{item.cliente}</div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{item.ticket} · {item.servicio}</div>
              </div>
              <div style={{ width: '120px', textAlign: 'center', fontWeight: 700, fontSize: '14px' }}>
                ${item.monto.toFixed(2)}
              </div>
              <div style={{ width: '120px', textAlign: 'center' }}>
                <span className={`badge badge-${item.estado === 'Completado' ? 'success' : 'warning'}`} style={{ fontSize: '9px' }}>
                  {item.estado}
                </span>
              </div>
              <div style={{ width: '120px', textAlign: 'right' }}>
                <button 
                  onClick={() => handleEnviarBoleto(item.ticket)}
                  className="btn-ghost" 
                  style={{ padding: '0.4rem 0.75rem', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}
                >
                  <Send size={12} style={{ marginRight: '4px' }} /> Enviar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Finanzas;
