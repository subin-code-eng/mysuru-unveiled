import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { places, getCategoryIcon } from '@/data/places';
import { artisans, getCraftIcon } from '@/data/artisans';

// Fix for default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapViewProps {
  selectedPlaceId?: string;
  showArtisans?: boolean;
  onPlaceSelect?: (placeId: string) => void;
}

const colors: Record<string, string> = {
  heritage: '#6b2137',
  art: '#d4a843',
  nature: '#2d6a4f',
  food: '#c96442',
  culture: '#d4a843',
};

const createCustomIcon = (emoji: string, color: string) => {
  return L.divIcon({
    html: `<div style="background:${color};width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);font-size:16px;">${emoji}</div>`,
    className: 'custom-marker',
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });
};

const MapView = ({ showArtisans = true, onPlaceSelect }: MapViewProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current).setView([12.3051, 76.6551], 12);
    mapInstanceRef.current = map;

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    // Add place markers
    places.forEach((place) => {
      const marker = L.marker(place.coordinates, {
        icon: createCustomIcon(getCategoryIcon(place.category), colors[place.category]),
      }).addTo(map);

      marker.bindPopup(`
        <div class="p-2 min-w-[200px]">
          <h3 class="font-semibold mb-1">${place.name}</h3>
          <p class="text-xs text-gray-600 mb-2">${place.description}</p>
          <p class="text-xs"><strong>Best time:</strong> ${place.bestTime}</p>
        </div>
      `);

      marker.on('click', () => onPlaceSelect?.(place.id));
    });

    // Add artisan markers
    if (showArtisans) {
      artisans.forEach((artisan) => {
        const marker = L.marker(artisan.coordinates, {
          icon: createCustomIcon(getCraftIcon(artisan.craft), '#d4a843'),
        }).addTo(map);

        marker.bindPopup(`
          <div class="p-2 min-w-[200px]">
            <h3 class="font-semibold mb-1">${artisan.name}</h3>
            <p class="text-xs text-amber-600 mb-1 capitalize">${artisan.craft} Artisan</p>
            <p class="text-xs text-gray-600">${artisan.specialty}</p>
          </div>
        `);
      });
    }

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [showArtisans, onPlaceSelect]);

  return (
    <div className="relative w-full h-full min-h-[500px] rounded-xl overflow-hidden border border-border shadow-card bg-muted">
      <div ref={mapRef} className="w-full h-full min-h-[500px]" />

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-background/95 backdrop-blur-sm rounded-lg p-3 shadow-card border border-border z-[1000]">
        <p className="text-xs font-semibold text-foreground mb-2">Legend</p>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2"><span>🏛️</span> <span className="text-muted-foreground">Heritage</span></div>
          <div className="flex items-center gap-2"><span>🎨</span> <span className="text-muted-foreground">Art & Craft</span></div>
          <div className="flex items-center gap-2"><span>🌿</span> <span className="text-muted-foreground">Nature</span></div>
          <div className="flex items-center gap-2"><span>🍛</span> <span className="text-muted-foreground">Food</span></div>
          <div className="flex items-center gap-2"><span>🪔</span> <span className="text-muted-foreground">Culture</span></div>
        </div>
      </div>
    </div>
  );
};

export default MapView;
