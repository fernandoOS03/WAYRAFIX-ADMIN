import { useState } from 'react';
import { Search, Filter, Download, Calendar, MapPin } from 'lucide-react';

const mockHistorial = [
  { id: 1, ticket: 'TKT-001', cliente: 'Juan Pérez', placa: 'ABC-123', fecha: '10/04/2026', tipo: 'Falla Mecánica', estado: 'COMPLETADO' },
  { id: 2, ticket: 'TKT-002', cliente: 'María Gómez', placa: 'XYZ-987', fecha: '10/04/2026', tipo: 'Accidente', estado: 'EN CURSO' },
  { id: 3, ticket: 'TKT-003', cliente: 'Carlos Ruiz', placa: 'LMN-456', fecha: '09/04/2026', tipo: 'Neumático', estado: 'COMPLETADO' },
  { id: 4, ticket: 'TKT-004', cliente: 'Ana Silva', placa: 'QWE-444', fecha: '08/04/2026', tipo: 'Batería', estado: 'CANCELADO' },
];

const Historial = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState('');

  const filteredData = mockHistorial.filter(item => {
    const matchesSearch = item.cliente.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.ticket.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.placa.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTipo = filterTipo ? item.tipo === filterTipo : true;
    return matchesSearch && matchesTipo;
  });

  return (
    <div className="space-y-8 p-8 shrink-0 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Historial de Asistencias</h2>
          <p className="text-sm font-medium text-gray-500 mt-1">Consulta y exporta el registro de servicios pasados</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-50 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto flex-1">
          <div className="relative w-full md:w-80">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-4 py-2.5 border-none rounded-xl focus:ring-2 focus:ring-accent-dark/50 text-sm bg-gray-50/50 shadow-inner transition-shadow placeholder:text-gray-400 font-medium"
              placeholder="Buscar por cliente, placa o ticket..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="relative w-full md:w-56">
             <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Filter className="h-4 w-4 text-gray-400" />
            </div>
            <select
              className="block w-full pl-10 pr-8 py-2.5 border-none rounded-xl focus:ring-2 focus:ring-accent-dark/50 text-sm bg-gray-50/50 text-gray-700 font-medium appearance-none transition-shadow"
              value={filterTipo}
              onChange={(e) => setFilterTipo(e.target.value)}
            >
              <option value="">Todos los siniestros</option>
              <option value="Falla Mecánica">Falla Mecánica</option>
              <option value="Accidente">Accidente</option>
              <option value="Neumático">Neumático</option>
              <option value="Batería">Batería</option>
            </select>
          </div>
        </div>

        <button className="flex items-center justify-center w-full md:w-auto gap-2 px-6 py-3.5 bg-gray-900 text-white hover:bg-primary rounded-2xl text-sm font-bold tracking-wide transition-all shadow-md active:scale-95">
          <Download size={16} /> Exportar CSV
        </button>
      </div>

      {/* Table Minimalist */}
      <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-white text-gray-400 text-[10px] uppercase tracking-widest font-bold border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Servicio</th>
                <th className="px-6 py-4">Cliente / Vehículo</th>
                <th className="px-6 py-4">Siniestro</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-right">Detalles</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group border-b border-gray-50 last:border-0">
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="font-bold text-gray-900 text-base mb-0.5">{item.ticket}</div>
                    <div className="text-[11px] font-medium text-gray-500 flex items-center gap-1.5 uppercase tracking-wider">
                      <Calendar size={12} className="text-gray-400" /> {item.fecha}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-800">{item.cliente}</div>
                    <div className="text-xs text-gray-500 font-mono mt-0.5">{item.placa}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{item.tipo}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase ${
                      item.estado === 'COMPLETADO' ? 'bg-gray-100 text-gray-600' :
                      item.estado === 'EN CURSO' ? 'bg-primary/10 text-primary' :
                      'bg-red-50 text-red-600'
                    }`}>
                      {item.estado}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button className="text-gray-400 hover:text-accent-dark font-bold text-[11px] uppercase tracking-widest transition-colors py-2 px-3 hover:bg-gray-50 rounded-lg">
                      Ver Ficha
                    </button>
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                    No se encontraron registros.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Historial;
