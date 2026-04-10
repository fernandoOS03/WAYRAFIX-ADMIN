import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { config } from '../config';
import 'mapbox-gl/dist/mapbox-gl.css';

const MapTracking = ({ startCoords, endCoords, currentCoords }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const currentMarker = useRef(null);

  useEffect(() => {
    if (map.current) return; // Initialize map only once

    mapboxgl.accessToken = config.mapboxToken || 'pk.eyJ1IjoiZmVybmFuZG8iLCJhIjoiY2xhMTI3bGIzMDFoZzNwcnhoY2RtcXhwdiJ9.Mocks_Token';

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11', // Clean light style
      center: currentCoords || [-77.02824, -12.04318], // Default Lima
      zoom: 13,
      attributionControl: false
    });

    map.current.on('load', () => {
      // Siniestro Marker (Destination)
      if (endCoords) {
        new mapboxgl.Marker({ color: '#D4AF37' })
          .setLngLat(endCoords)
          .addTo(map.current);
      }
      
      // Grua Marker (Current tracking)
      if (currentCoords) {
        currentMarker.current = new mapboxgl.Marker({ color: '#3D2B1F' })
          .setLngLat(currentCoords)
          .addTo(map.current);
      }
    });

    return () => {
       if (map.current) {
          map.current.remove();
          map.current = null;
       }
    };
  }, []);

  // Update current marker position (simulation)
  useEffect(() => {
    if (currentMarker.current && currentCoords && map.current) {
      currentMarker.current.setLngLat(currentCoords);
      map.current.flyTo({ center: currentCoords, speed: 0.5 });
    }
  }, [currentCoords]);

  return (
    <div className="w-full h-full min-h-[300px] rounded-xl overflow-hidden shadow-inner border border-gray-200">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};

export default MapTracking;
