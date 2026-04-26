import { useState, useEffect, useRef } from 'react';
import { Search, Bell, ChevronRight, Zap } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import asistenciasService from '../services/asistenciasService';

// Token de Mapbox desde variables de entorno
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const mapContainer = useRef(null);
  const map = useRef(null);
  const mainMarker = useRef(null);
  const craneMarker = useRef(null);

  useEffect(() => {
    fetchRequests();
    // Podríamos añadir un polling o socket aquí para tiempo real
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await asistenciasService.getAll();
      // Filtrar solo las pendientes o en camino para el dashboard en vivo
      const activeRequests = data
        .filter(req => ['pendiente', 'en_camino'].includes(req.estado))
        .map(req => ({
          ...req,
          id: req.id,
          name: req.cliente?.nombre || req.cliente || 'Anónimo',
          vehicle: req.vehiculo?.modelo || req.vehiculo || 'Vehículo',
          plate: req.vehiculo?.placa || req.placa || 'S/N',
          type: req.tipoSiniestro || 'Falla Mecánica',
          typeVariant: req.tipoSiniestro === 'Accidente' ? 'danger' : 'warning',
          coords: req.ubicacion ? [req.ubicacion.longitud, req.ubicacion.latitud] : [-77.02824, -12.04318]
        }));
      
      setRequests(activeRequests);
      if (activeRequests.length > 0 && !selectedRequest) {
        setSelectedRequest(activeRequests[0]);
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRequests = requests.filter(req =>
    req.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.plate.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Inicializar Mapa
  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    const defaultCoords = [-77.02824, -12.04318]; // Lima central

    const newMap = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/navigation-night-v1',
      center: selectedRequest?.coords || defaultCoords,
      zoom: 14,
      pitch: 45,
      antialias: true
    });

    // Controles de navegación discretos
    newMap.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'bottom-right');

    newMap.once('load', () => {
      setIsMapReady(true);
    });

    map.current = newMap;

    return () => {
      newMap.remove();
      map.current = null;
      setIsMapReady(false);
    };
  }, []);

  // Actualizar marcadores y posición cuando cambia la solicitud
  useEffect(() => {
    if (!isMapReady || !map.current || !selectedRequest) return;

    // Volar a la ubicación
    map.current.flyTo({
      center: selectedRequest.coords,
      zoom: 15,
      speed: 1.2,
      curve: 1.42,
      essential: true
    });

    // Limpiar marcadores anteriores
    if (mainMarker.current) mainMarker.current.remove();
    if (craneMarker.current) craneMarker.current.remove();

    // Crear marcador de Siniestro (Premium Glossy)
    const elSiniestro = document.createElement('div');
    elSiniestro.innerHTML = `
      <div style="
        width: 38px; height: 38px; 
        background: rgba(56, 91, 245, 0.9); 
        backdrop-filter: blur(4px);
        border-radius: 50%; 
        border: 2px solid #fff; 
        box-shadow: 0 0 15px rgba(56, 91, 245, 0.5);
        display: flex; align-items: center; justify-content: center; color: #fff;
        position: relative;
      ">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
        <div style="position: absolute; bottom: -4px; width: 8px; height: 8px; background: #fff; border-radius: 50%; box-shadow: 0 0 10px #fff;"></div>
      </div>`;
    
    mainMarker.current = new mapboxgl.Marker(elSiniestro)
      .setLngLat(selectedRequest.coords)
      .addTo(map.current);

    // Crear marcador de Grúa (Premium Green)
    const craneCoords = [selectedRequest.coords[0] + 0.008, selectedRequest.coords[1] + 0.005];
    const elGrua = document.createElement('div');
    elGrua.innerHTML = `
      <div style="
        width: 34px; height: 34px; 
        background: rgba(34, 197, 94, 0.9); 
        backdrop-filter: blur(4px);
        border-radius: 8px; 
        border: 2px solid #fff; 
        box-shadow: 0 0 12px rgba(34, 197, 94, 0.4);
        display: flex; align-items: center; justify-content: center; color: #fff;
      ">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 17h4V5H2v12h3"/><path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5"/><path d="M14 17h1"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>
      </div>`;
    
    craneMarker.current = new mapboxgl.Marker(elGrua)
      .setLngLat(craneCoords)
      .addTo(map.current);

    // Dibujar Ruta Simulada (Premium dashed line)
    const drawRoute = () => {
      if (!map.current || !map.current.isStyleLoaded()) return;

      const routeData = {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [selectedRequest.coords, craneCoords]
        }
      };

      if (map.current.getSource('route')) {
        map.current.getSource('route').setData(routeData);
      } else {
        map.current.addSource('route', { type: 'geojson', data: routeData });
        map.current.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: {
            'line-color': '#385bf5',
            'line-width': 4,
            'line-opacity': 0.8,
            'line-dasharray': [2, 1]
          }
        });
      }
    };

    drawRoute();

  }, [isMapReady, selectedRequest]);

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%', overflow: 'hidden', background: '#fff' }}>

      {/* ── Panel Izquierdo (Solicitudes - Glassmorphism) ── */}
      <div style={{
        width: '360px',
        flexShrink: 0,
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(0,0,0,0.05)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        zIndex: 10,
        boxShadow: '10px 0 30px rgba(0,0,0,0.02)'
      }}>
        <div style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '-0.02em' }}>Despacho</h2>
            <div className="badge badge-primary" style={{ borderRadius: '4px' }}>En Vivo</div>
          </div>
          <div className="input-wrapper" style={{ background: 'rgba(0,0,0,0.03)', border: 'none' }}>
            <Search size={14} className="input-icon" />
            <input
              type="text"
              className="input"
              placeholder="Buscar por nombre o placa..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ fontSize: '13px', background: 'transparent' }}
            />
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '0 1rem 1.5rem' }}>
          {loading ? (
            <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>Cargando...</div>
          ) : filteredRequests.length === 0 ? (
            <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>No hay servicios activos</div>
          ) : (
            filteredRequests.map(req => {
              const isSelected = selectedRequest?.id === req.id;
              return (
                <div
                  key={req.id}
                  onClick={() => setSelectedRequest(req)}
                  style={{
                    padding: '1rem',
                    borderRadius: 'var(--radius-lg)',
                    background: isSelected ? '#fff' : 'transparent',
                    cursor: 'pointer',
                    marginBottom: '8px',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    border: isSelected ? '1px solid rgba(0,0,0,0.05)' : '1px solid transparent',
                    boxShadow: isSelected ? '0 4px 12px rgba(0,0,0,0.05)' : 'none',
                    transform: isSelected ? 'scale(1.02)' : 'scale(1)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                     <div style={{ position: 'relative' }}>
                       <img
                        src={`https://i.pravatar.cc/150?u=${req.id}`}
                        alt="User"
                        style={{ width: '40px', height: '40px', borderRadius: '10px', objectFit: 'cover' }}
                      />
                      <div style={{ position: 'absolute', bottom: '-2px', right: '-2px', width: '10px', height: '10px', background: 'var(--color-success)', border: '2px solid #fff', borderRadius: '50%' }}></div>
                     </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 700, fontSize: '14px', color: isSelected ? 'var(--color-primary)' : '#1a202c' }}>{req.name}</span>
                        <ChevronRight size={14} style={{ opacity: isSelected ? 1 : 0.2, color: 'var(--color-primary)' }} />
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', display: 'flex', justifyContent: 'space-between' }}>
                        <span>{req.plate}</span>
                        <span style={{ fontWeight: 600 }}>{(req.type || '').split('/')[0]}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── Área de Mapa (Mapbox) ── */}
      <div style={{ flex: 1, position: 'relative' }}>
        <div ref={mapContainer} style={{ width: '100%', height: '100%', background: '#f0f0f0' }} />

        {/* Top bar minimal */}
        <div style={{ 
          position: 'absolute', top: '1rem', right: '1rem', 
          display: 'flex', alignItems: 'center', gap: '0.5rem', zIndex: 10 
        }}>
          <button className="btn-ghost" style={{ padding: '0.5rem', borderRadius: '50%', minWidth: 'unset', background: '#fff' }}>
            <Bell size={16} />
          </button>
          <div className="btn-ghost" style={{ padding: '0.25rem 0.75rem 0.25rem 0.25rem', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#fff' }}>
            <img src="https://i.pravatar.cc/150?u=admin" alt="Admin" style={{ width: '24px', height: '24px', borderRadius: '50%' }} />
            <span style={{ fontSize: '12px', fontWeight: 600 }}>Admin</span>
          </div>
        </div>

        {/* Floating Detail Card (Premium) */}
        {selectedRequest && (
          <div style={{
            position: 'absolute', bottom: '2rem', right: '2rem',
            width: '320px', zIndex: 10,
          }}>
            <div className="card" style={{ 
              padding: '1.5rem', 
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)', 
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '20px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <div>
                  <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.25rem' }}>Estado del Servicio</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '8px', height: '8px', background: 'var(--color-warning)', borderRadius: '50%', animation: 'pulse 2s infinite' }}></div>
                    <span style={{ fontSize: '14px', fontWeight: 600 }}>Grúa en Camino</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.25rem' }}>ETA</p>
                  <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-primary)' }}>18 min</span>
                </div>
              </div>
              
              <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.02)', borderRadius: '12px', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <div style={{ width: '32px', height: '32px', background: '#000', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                    <Zap size={16} />
                  </div>
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: 700 }}>{selectedRequest.vehicle}</p>
                    <p style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Placa: {selectedRequest.plate}</p>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button className="btn-primary" style={{ flex: 1, height: '42px', borderRadius: '10px' }}>Asignar Grúa</button>
                <button className="btn-ghost" style={{ color: 'var(--color-danger)', border: '1px solid var(--color-danger-bg)', height: '42px', borderRadius: '10px' }}>Rechazar</button>
              </div>
            </div>
          </div>
        )}

        <style>{`
          @keyframes pulse {
            0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.7); }
            70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(245, 158, 11, 0); }
            100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(245, 158, 11, 0); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default Dashboard;
