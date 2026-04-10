import { useState } from 'react';
import { Search, Send, FileText, CreditCard, DollarSign } from 'lucide-react';
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
    toast.success(`Boleto virtual de la orden ${ticket} enviado al cliente por email/SMS con éxito.`, {
      icon: '📩',
      style: {
        borderRadius: '16px',
        background: '#333',
        color: '#fff',
      },
    });
  };

  return (
    <div className="space-y-8 p-8 shrink-0 max-w-7xl mx-auto min-h-screen">
      <Toaster position="bottom-right" />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Reporte Financiero</h2>
          <p className="text-sm font-medium text-gray-500 mt-1">Gestión de recaudación y boletos de servicios realizados</p>
        </div>
        
        {/* Metric Cards Top */}
        <div className="flex gap-4">
          <div className="bg-white px-6 py-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-500">
              <DollarSign size={20} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Ingresos Mes</p>
              <h4 className="text-xl font-black text-gray-900">$480.00</h4>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-50 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto flex-1">
          <div className="relative w-full md:w-80">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-4 py-2.5 border-none rounded-xl focus:ring-2 focus:ring-accent-dark/50 text-sm bg-gray-50/50 shadow-inner transition-shadow placeholder:text-gray-400 font-medium"
              placeholder="Buscar por cliente o ticket..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Modern List Grid for Finances */}
      <div className="space-y-4">
        {filteredFinanzas.map(servicio => (
          <div key={servicio.id} className="bg-white rounded-[2rem] p-6 px-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-50 flex flex-col md:flex-row gap-6 md:items-center justify-between hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all group">
            
            <div className="flex items-center gap-6 flex-1">
              <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 shadow-inner">
                <FileText size={24} strokeWidth={1.5} />
              </div>
              
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-lg font-black text-gray-900">{servicio.cliente}</h3>
                  <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded uppercase tracking-widest">{servicio.ticket}</span>
                </div>
                <div className="text-sm font-medium text-gray-500">
                  {servicio.fecha} • {servicio.servicio}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-8 justify-between md:justify-end">
              <div className="text-right">
                <h4 className="text-2xl font-black text-gray-900">${servicio.monto.toFixed(2)}</h4>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{servicio.estado}</p>
              </div>

              <button 
                onClick={() => handleEnviarBoleto(servicio.ticket)}
                className="flex items-center gap-2 bg-gray-900 text-white px-5 py-3 rounded-2xl font-bold text-sm tracking-wide shadow-md hover:bg-primary transition-all active:scale-95 group-hover:scale-105"
              >
                <Send size={16} />
                <span>Enviar Boleto</span>
              </button>
            </div>

          </div>
        ))}

        {filteredFinanzas.length === 0 && (
          <div className="text-center py-16 text-gray-400 font-medium font-lg">
            No se encontraron servicios facturados.
          </div>
        )}
      </div>

    </div>
  );
};

export default Finanzas;
