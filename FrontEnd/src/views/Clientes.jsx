import { useState } from 'react';
import { Search, ChevronRight, Car, Fingerprint, ShieldCheck } from 'lucide-react';
import Modal from '../components/Modal';

const MOCK_CLIENTES = [
  { id: 1, nombre: 'Juan Pérez', email: 'juan.perez@ejemplo.com', telefono: '+51 999 888 777', avatar: 'https://i.pravatar.cc/150?u=1',
    vehiculos: [
      { modelo: 'Toyota Corolla 2024', placa: 'ABC-123', color: 'Gris Plata', vin: 'JTD1234567890VIN' }
    ]
  },
  { id: 2, nombre: 'María Gómez', email: 'maria.gomez@ejemplo.com', telefono: '+51 988 777 666', avatar: 'https://i.pravatar.cc/150?u=2',
    vehiculos: [
      { modelo: 'Nissan Sentra 2022', placa: 'XYZ-987', color: 'Rojo', vin: '3N1AB8CV67890VIN' },
      { modelo: 'Kia Rio 2020', placa: 'DEF-111', color: 'Negro', vin: '3N1AB8CV67899XXX' }
    ]
  },
  { id: 3, nombre: 'Carlos Ruiz', email: 'carlos.ruiz@ejemplo.com', telefono: '+51 977 666 555', avatar: 'https://i.pravatar.cc/150?u=3',
    vehiculos: [
      { modelo: 'Hyundai Tucson 2023', placa: 'DEF-456', color: 'Blanco', vin: 'KM81234567890VIN' }
    ]
  },
  { id: 4, nombre: 'Ana Silva', email: 'ana.silva@ejemplo.com', telefono: '+51 966 555 444', avatar: 'https://i.pravatar.cc/150?u=4',
    vehiculos: [
      { modelo: 'Kia Sportage 2021', placa: 'GHI-789', color: 'Azul', vin: 'KND1234567890VIN' }
    ]
  },
];

const Clientes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);

  const filteredClientes = MOCK_CLIENTES.filter(c => 
    c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 p-8 shrink-0 max-w-6xl mx-auto min-h-screen">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Directorio de Clientes</h2>
          <p className="text-sm font-medium text-gray-500 mt-1">Busca y administra los vehículos registrados por cada usuario</p>
        </div>
        
        <div className="relative w-full sm:w-80">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-4 py-2.5 border-none rounded-xl focus:ring-2 focus:ring-accent-dark/50 text-sm bg-gray-50/50 shadow-inner transition-shadow placeholder:text-gray-400 font-medium"
            placeholder="Buscar por nombre o correo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Minimalist List */}
      <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-50 overflow-hidden">
        <div className="divide-y divide-gray-100">
          {filteredClientes.map(cliente => (
            <div key={cliente.id} className="flex items-center justify-between p-5 px-8 hover:bg-gray-50/50 transition-colors group">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-full overflow-hidden shadow-sm border border-gray-100">
                  <img src={cliente.avatar} alt={cliente.nombre} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg tracking-tight mb-0.5">{cliente.nombre}</h3>
                  <div className="flex items-center gap-3 text-sm text-gray-500 font-medium">
                    <span>{cliente.email}</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <span>{cliente.telefono}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-8">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold uppercase tracking-wider text-accent-dark mb-0.5">Vehículos Registrados</p>
                  <div className="flex items-center justify-end gap-1.5 text-sm font-medium text-gray-700">
                    <Car size={16} className="text-gray-400" />
                    <span>{cliente.vehiculos.map(v => v.modelo.split(' ')[0]).join(', ')}</span>
                  </div>
                </div>
                
                <button 
                  onClick={() => setSelectedClient(cliente)}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-500 group-hover:bg-primary group-hover:text-white transition-all shadow-sm"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          ))}

          {filteredClientes.length === 0 && (
            <div className="py-16 text-center text-gray-400 font-medium">
              No se encontraron coincidencias.
            </div>
          )}
        </div>
      </div>

      {/* Modal Detalles del Cliente y Vehículos */}
      <Modal isOpen={!!selectedClient} onClose={() => setSelectedClient(null)} title="Ficha del Cliente" maxWidth="max-w-3xl">
        {selectedClient && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Header del Cliente */}
            <div className="flex items-center gap-6 p-6 bg-gray-50 rounded-3xl border border-gray-100">
              <img src={selectedClient.avatar} alt="Avatar" className="w-20 h-20 rounded-2xl shadow-sm border bg-white" />
              <div>
                <h3 className="text-2xl font-black text-gray-900 tracking-tight">{selectedClient.nombre}</h3>
                <p className="text-gray-500 font-medium">{selectedClient.email} • {selectedClient.telefono}</p>
              </div>
            </div>

            {/* Vehículos List */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-widest text-accent-dark mb-4 px-2">Vehículos Verificados</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedClient.vehiculos.map((vehiculo, idx) => (
                  <div key={idx} className="relative bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:border-accent-dark/30 transition-colors">
                    <div className="absolute top-4 right-4 text-green-500 bg-green-50 p-1.5 rounded-full" title="VIN Verificado">
                      <ShieldCheck size={18} />
                    </div>
                    
                    <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mb-4 border border-gray-100">
                      <Car size={20} />
                    </div>
                    
                    <h5 className="font-bold text-gray-900 text-lg mb-1">{vehiculo.modelo}</h5>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="bg-gray-100 text-gray-600 font-bold px-2 py-1 rounded text-xs">{vehiculo.placa}</span>
                      <span className="text-sm text-gray-500 font-medium">{vehiculo.color}</span>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-50 flex items-center gap-2 text-xs font-mono text-gray-400">
                      <Fingerprint size={14} className="text-gray-300"/>
                      VIN: {vehiculo.vin}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Clientes;
