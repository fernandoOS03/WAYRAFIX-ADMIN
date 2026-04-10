import { useState, useEffect, useRef } from 'react';
import { Search, Bell, CheckCircle2, Navigation, Wrench } from 'lucide-react';
import clsx from 'clsx';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MOCK_REQUESTS = [
  { id: 1, name: 'Carlos Mendoza', vehicle: 'Toyota Corolla 2024', plate: 'ABC-123', type: 'Falla Mecánica', typeColor: 'text-accent-dark bg-accent-light/20', coords: [-12.04318, -77.02824] },
  { id: 2, name: 'Lucía Fernández', vehicle: 'Nissan Sentra 2022', plate: 'XYZ-987', type: 'Accidente/Choque', typeColor: 'text-red-600 bg-red-500/10', coords: [-12.10, -76.99] },
  { id: 3, name: 'Martín Gómez', vehicle: 'Hyundai Tucson 2023', plate: 'DEF-456', type: 'Llanta/Neumático', typeColor: 'text-blue-600 bg-blue-500/10', coords: [-12.08, -77.05] },
  { id: 4, name: 'Andrea Silva', vehicle: 'Kia Sportage 2021', plate: 'GHI-789', type: 'Falla Mecánica', typeColor: 'text-accent-dark bg-accent-light/20', coords: [-12.12, -76.95] },
];

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(MOCK_REQUESTS[0]);
  
  // Map logic
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markerRef = useRef(null);
  const userMarkerRef = useRef(null);

  const filteredRequests = MOCK_REQUESTS.filter(req => 
    req.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    req.plate.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (map.current) return;

    map.current = L.map(mapContainer.current, {
      zoomControl: false
    }).setView(selectedRequest.coords, 14);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map.current);

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!map.current || !selectedRequest) return;
    
    // Fix leaflet grey container bug due to dynamic screen sizes
    setTimeout(() => {
      if (map.current) {
        map.current.invalidateSize();
        map.current.flyTo(selectedRequest.coords, 15, { duration: 0.8 });
      }
    }, 150);

    // Update markers
    if (markerRef.current) markerRef.current.remove();
    if (userMarkerRef.current) userMarkerRef.current.remove();

    // Custom marker for Siniestro (Wrench Icon)
    const siniestroHtml = '<div class="w-12 h-12 bg-accent rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-wrench"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg></div>';
    
    const siniestroIcon = L.divIcon({
      className: 'bg-transparent border-0',
      html: siniestroHtml,
      iconSize: [48, 48],
      iconAnchor: [24, 24]
    });

    markerRef.current = L.marker(selectedRequest.coords, { icon: siniestroIcon }).addTo(map.current);

    // Mock grúa location nearby
    const gruaHtml = '<div class="w-8 h-8 bg-green-500 rounded-full border-2 border-white shadow-md flex items-center justify-center text-white"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-truck"><path d="M10 17h4V5H2v12h3"/><path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5"/><path d="M14 17h1"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg></div>';
    
    const gruaIcon = L.divIcon({
      className: 'bg-transparent border-0',
      html: gruaHtml,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });
    
    const gruaCoords = [selectedRequest.coords[0] - 0.005, selectedRequest.coords[1] - 0.005];
    userMarkerRef.current = L.marker(gruaCoords, { icon: gruaIcon }).addTo(map.current);

  }, [selectedRequest]);

  return (
    <div className="flex w-full h-full bg-gray-50 overflow-hidden">
      {/* Left Column: Requests List */}
      <div className="w-[480px] bg-gray-50/80 backdrop-blur-2xl shadow-[8px_0_40px_rgba(0,0,0,0.04)] z-[100] flex flex-col h-full border-r border-white/50">
        <div className="p-8 pb-6 z-[200]">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-8">Solicitudes Activas</h2>
          
          <div className="relative shadow-[0_12px_40px_-5px_rgba(0,0,0,0.08)] bg-white/95 backdrop-blur-md rounded-[1.5rem] border border-white p-1.5 transition-shadow focus-within:shadow-[0_20px_50px_-5px_rgba(0,0,0,0.12)]">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-4 py-2.5 border-none bg-transparent focus:ring-0 text-sm font-semibold text-gray-800 placeholder:text-gray-400 placeholder:font-medium placeholder:opacity-70 transition-all outline-none"
              placeholder="Buscar vehículo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-8 pb-8">
          {filteredRequests.map((req) => {
            const isSelected = selectedRequest?.id === req.id;
            return (
              <button
                key={req.id}
                onClick={() => setSelectedRequest(req)}
                className={clsx(
                  "w-full text-left p-4 rounded-2xl transition-all duration-300 block mb-3 relative overflow-hidden",
                  isSelected 
                    ? "bg-white shadow-[0_8px_30px_-8px_rgba(0,0,0,0.15)] ring-1 ring-gray-100 scale-100" 
                    : "bg-white/40 hover:bg-white/80 hover:shadow-sm border border-transparent"
                )}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full overflow-hidden shadow-inner border border-gray-50 bg-gray-100">
                        <img src={`https://i.pravatar.cc/150?u=${req.id}`} alt="User" className="w-full h-full object-cover"/>
                     </div>
                     <div>
                       <h3 className="font-bold text-gray-900 text-[15px] leading-tight mb-0.5">{req.name}</h3>
                       <div className="flex items-center gap-1.5 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full inline-flex border border-green-100/50">
                         <CheckCircle2 size={10} strokeWidth={3} /> Validado
                       </div>
                     </div>
                  </div>
                </div>
                
                <div className="flex items-end justify-between mt-1 pt-3 border-t border-gray-50/50">
                  <div>
                    <h4 className="text-gray-700 font-semibold text-xs">{req.vehicle}</h4>
                    <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase mt-0.5">{req.plate}</p>
                  </div>
                  <span className={clsx("text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg border", isSelected ? 'border-transparent' : 'border-white', req.typeColor)}>
                    {req.type}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Right Column: Map & Overlays */}
      <div className="flex-1 relative h-full bg-gray-100">
        <div ref={mapContainer} className="w-full h-full" />

        {/* Top Right User Info */}
        <div className="absolute top-6 right-6 flex items-center gap-3 z-[500]">
          <button className="w-10 h-10 bg-white shadow-md rounded-full flex items-center justify-center text-gray-500 hover:text-primary transition-colors relative">
            <Bell size={18} />
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 absolute top-2 right-2 border-2 border-white"></span>
          </button>
          
          <div className="bg-white shadow-md rounded-full p-1 pl-1.5 pr-4 flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition-colors">
            <img 
              src="https://i.pravatar.cc/150?u=admin" 
              alt="Admin" 
              className="w-8 h-8 rounded-full border border-gray-100"
            />
            <span className="text-sm font-bold text-gray-700 hidden sm:block">Admin</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400"><path d="m6 9 6 6 6-6"/></svg>
          </div>
        </div>

        {/* Bottom Floating Card (Minimalist) */}
        {selectedRequest && (
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-[340px] z-[500] animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.12)] p-5 border border-white">
              <div className="text-center mb-5 mt-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Tiempo estimado</p>
                <h3 className="text-3xl font-black text-gray-900 tracking-tight">
                  18 <span className="text-base font-semibold text-gray-500 tracking-normal">min</span>
                </h3>
              </div>
              
              <div className="flex gap-3">
                <button className="flex-1 py-3 bg-gray-900 text-white rounded-xl font-bold text-sm tracking-wide hover:bg-primary transition-all shadow-md active:scale-95">
                  Asignar Grúa
                </button>
                <button className="px-5 py-3 bg-transparent border-2 border-gray-100 text-gray-500 rounded-xl font-bold text-sm hover:border-red-200 hover:text-red-500 hover:bg-red-50/50 transition-all active:scale-95">
                  Rechazar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
