import { useEffect, useState } from 'react';
import { places, getCategoryIcon } from '@/data/places';
import { artisans, getCraftIcon } from '@/data/artisans';
import 'leaflet/dist/leaflet.css';

interface MapViewProps {
  selectedPlaceId?: string;
  showArtisans?: boolean;
  onPlaceSelect?: (placeId: string) => void;
}

const MapView = ({ selectedPlaceId, showArtisans = true, onPlaceSelect }: MapViewProps) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="relative w-full h-full min-h-[500px] rounded-xl overflow-hidden border border-border shadow-card bg-muted flex items-center justify-center">
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    );
  }

  return <MapContent selectedPlaceId={selectedPlaceId} showArtisans={showArtisans} onPlaceSelect={onPlaceSelect} />;
};

const MapContent = ({ selectedPlaceId, showArtisans = true, onPlaceSelect }: MapViewProps) => {
  const [leafletComponents, setLeafletComponents] = useState<any>(null);

  useEffect(() => {
    const loadLeaflet = async () => {
      const L = await import('leaflet');
      const { MapContainer, TileLayer, Marker, Popup } = await import('react-leaflet');
      
      // Fix for default marker icons
      delete (L.default.Icon.Default.prototype as any)._getIconUrl;
      L.default.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });

      setLeafletComponents({ L: L.default, MapContainer, TileLayer, Marker, Popup });
    };

    loadLeaflet();
  }, []);

  if (!leafletComponents) {
    return (
      <div className="relative w-full h-full min-h-[500px] rounded-xl overflow-hidden border border-border shadow-card bg-muted flex items-center justify-center">
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    );
  }

  const { L, MapContainer, TileLayer, Marker, Popup } = leafletComponents;

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

  return (
    <div className="relative w-full h-full min-h-[500px] rounded-xl overflow-hidden border border-border shadow-card bg-muted">
      <MapContainer
        center={[12.3051, 76.6551]}
        zoom={12}
        style={{ height: '100%', width: '100%', minHeight: '500px' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {places.map((place) => (
          <Marker
            key={place.id}
            position={place.coordinates}
            icon={createCustomIcon(getCategoryIcon(place.category), colors[place.category])}
            eventHandlers={{ click: () => onPlaceSelect?.(place.id) }}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <h3 className="font-semibold mb-1">{place.name}</h3>
                <p className="text-xs text-gray-600 mb-2">{place.description}</p>
                <p className="text-xs"><strong>Best time:</strong> {place.bestTime}</p>
              </div>
            </Popup>
          </Marker>
        ))}
        {showArtisans && artisans.map((artisan) => (
          <Marker
            key={artisan.id}
            position={artisan.coordinates}
            icon={createCustomIcon(getCraftIcon(artisan.craft), '#d4a843')}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <h3 className="font-semibold mb-1">{artisan.name}</h3>
                <p className="text-xs text-amber-600 mb-1 capitalize">{artisan.craft} Artisan</p>
                <p className="text-xs text-gray-600">{artisan.specialty}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

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
