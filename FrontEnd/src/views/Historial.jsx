import { useState, useEffect } from 'react';
import { Search, Filter, Download, Calendar, ExternalLink } from 'lucide-react';
import asistenciasService from '../services/asistenciasService';

const Historial = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState('');
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistorial();
  }, []);

  const fetchHistorial = async () => {
    try {
      setLoading(true);
      const data = await asistenciasService.getAll();
      setHistorial(data);
    } catch (error) {
      console.error("Error fetching historial:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = historial.filter(item => {
    const clienteNombre = item.cliente?.nombre || item.cliente || '';
    const vehiculoPlaca = item.vehiculo?.placa || item.placa || '';
    
    const matchesSearch =
      clienteNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.ticket || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehiculoPlaca.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTipo = filterTipo ? (item.tipoSiniestro || item.tipo) === filterTipo : true;
    return matchesSearch && matchesTipo;
  });

  return (
    <div className="page-wrapper" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '0.25rem' }}>Historial de Asistencias</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px' }}>Registro detallado de todos los servicios realizados.</p>
        </div>
        <button className="btn-primary" style={{ gap: '0.5rem' }}>
          <Download size={14} />
          Exportar Datos
        </button>
      </div>

      {/* Filters Bar */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="input-wrapper" style={{ flex: 1, maxWidth: '400px' }}>
          <Search size={14} className="input-icon" />
          <input
            type="text"
            className="input"
            placeholder="Buscar por cliente, placa o ticket..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="input-wrapper" style={{ width: '200px' }}>
          <Filter size={14} className="input-icon" />
          <select
            className="input"
            style={{ paddingLeft: '2.5rem', appearance: 'none' }}
            value={filterTipo}
            onChange={e => setFilterTipo(e.target.value)}
          >
            <option value="">Todos los tipos</option>
            <option value="Falla Mecánica">Falla Mecánica</option>
            <option value="Accidente">Accidente</option>
            <option value="Neumático">Neumático</option>
            <option value="Batería">Batería</option>
          </select>
        </div>
      </div>

      {/* Minimalist Table */}
      <div className="table-container">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead className="table-header">
            <tr>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>Ticket / Fecha</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>Cliente / Vehículo</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>Servicio</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>Estado</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                  Cargando asistencias...
                </td>
              </tr>
            ) : filteredData.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                  No se encontraron asistencias.
                </td>
              </tr>
            ) : (
              filteredData.map(item => (
                <tr key={item.id} className="table-row">
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: 600, fontSize: '13px' }}>{item.ticket || 'S/N'}</div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Calendar size={12} /> {item.fechaCorta || item.fecha || 'N/A'}
                    </div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: 500, fontSize: '13px' }}>{item.cliente?.nombre || item.cliente || 'Anónimo'}</div>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>
                      {item.vehiculo?.placa || item.placa || 'Sin placa'}
                    </div>
                  </td>
                  <td style={{ padding: '1rem', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                    {item.tipoSiniestro || item.tipo || 'General'}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span className={`badge badge-${
                      (item.estado || '').toLowerCase() === 'finalizado' ? 'success' : 
                      ['pendiente', 'en_camino'].includes((item.estado || '').toLowerCase()) ? 'warning' : 'danger'
                    }`} style={{ fontSize: '10px', textTransform: 'uppercase' }}>
                      {item.estado || 'DESCONOCIDO'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <button className="btn-ghost" style={{ padding: '0.4rem', borderRadius: '4px', minWidth: 'unset' }}>
                      <ExternalLink size={14} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Historial;
