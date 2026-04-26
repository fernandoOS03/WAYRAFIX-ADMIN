import { useState, useEffect } from 'react';
import { Search, ChevronRight, Car, ShieldCheck, Fingerprint } from 'lucide-react';
import Modal from '../components/Modal';
import clientesService from '../services/clientesService';

const Clientes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState(null);

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    try {
      setLoading(true);
      const data = await clientesService.getAll();
      setClientes(data);
    } catch (error) {
      console.error("Error fetching clientes:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredClientes = clientes.filter(c =>
    (c.nombre || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-wrapper" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '0.25rem' }}>Directorio de Clientes</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px' }}>Administración de usuarios y sus vehículos registrados.</p>
        </div>
        <div className="input-wrapper" style={{ width: '320px' }}>
          <Search size={14} className="input-icon" />
          <input
            type="text"
            className="input"
            placeholder="Buscar por nombre o correo..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="table-container">
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>Cargando directorio...</div>
        ) : filteredClientes.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>No se encontraron clientes.</div>
        ) : (
          filteredClientes.map((cliente) => (
            <div
              key={cliente.id}
              className="table-row"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem 1.5rem',
                cursor: 'pointer'
              }}
              onClick={() => setSelectedClient(cliente)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                <img
                  src={cliente.avatar || `https://i.pravatar.cc/150?u=${cliente.id}`}
                  alt={cliente.nombre}
                  style={{ width: '36px', height: '36px', borderRadius: '4px', border: '1px solid var(--color-border)' }}
                />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '14px' }}>{cliente.nombre || 'Sin nombre'}</div>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                    {cliente.email} · {cliente.celular || 'Sin celular'}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '2px' }}>Vehículos</div>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Car size={14} /> {(cliente.vehiculos || []).length} {(cliente.vehiculos || []).length === 1 ? 'unidad' : 'unidades'}
                  </div>
                </div>
                <ChevronRight size={16} color="var(--color-border)" />
              </div>
            </div>
          ))
        )}
      </div>

      <Modal isOpen={!!selectedClient} onClose={() => setSelectedClient(null)} title="Información del Cliente" maxWidth="500px">
        {selectedClient && (
          <div>
             <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
              <img
                src={selectedClient.avatar || `https://i.pravatar.cc/150?u=${selectedClient.id}`}
                alt="Avatar"
                style={{ width: '64px', height: '64px', borderRadius: '8px', border: '1px solid var(--color-border)' }}
              />
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 700 }}>{selectedClient.nombre}</h2>
                <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>{selectedClient.email}</p>
                <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>{selectedClient.celular || 'Sin celular'}</p>
                <div style={{ marginTop: '0.5rem' }}>
                  <span className={`badge badge-${selectedClient.is_active ? 'success' : 'danger'}`} style={{ fontSize: '10px' }}>
                    {selectedClient.is_active ? 'CUENTA ACTIVA' : 'CUENTA INACTIVA'}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '0.05em' }}>Vehículos Vinculados</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {(!selectedClient.vehiculos || selectedClient.vehiculos.length === 0) ? (
                  <div style={{ padding: '2rem', textAlign: 'center', background: 'rgba(0,0,0,0.02)', borderRadius: '12px', color: 'var(--color-text-muted)', fontSize: '13px' }}>
                    No hay vehículos registrados para este cliente.
                  </div>
                ) : (
                  selectedClient.vehiculos.map((v, i) => (
                    <div key={i} className="card" style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                        <div style={{ fontWeight: 600, fontSize: '14px' }}>{v.modelo || 'Modelo desconocido'}</div>
                        <span className="badge badge-success" style={{ gap: '4px' }}><ShieldCheck size={10} /> Verificado</span>
                      </div>
                      <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.75rem' }}>
                        <div>
                          <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Placa</div>
                          <div style={{ fontSize: '13px', fontWeight: 600, fontFamily: 'monospace' }}>{v.placa || '---'}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Color</div>
                          <div style={{ fontSize: '13px' }}>{v.color || '---'}</div>
                        </div>
                      </div>
                      <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--color-text-muted)' }}>
                        <Fingerprint size={12} /> VIN: {v.vin || '---'}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Clientes;
