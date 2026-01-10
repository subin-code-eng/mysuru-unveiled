import { lazy, Suspense } from 'react';

const LeafletMap = lazy(() => import('./LeafletMap'));

interface MapViewProps {
  selectedPlaceId?: string;
  showArtisans?: boolean;
  onPlaceSelect?: (placeId: string) => void;
}

const MapView = ({ selectedPlaceId, showArtisans = true, onPlaceSelect }: MapViewProps) => {
  return (
    <div className="relative w-full h-full min-h-[500px] rounded-xl overflow-hidden border border-border shadow-card bg-muted">
      <Suspense fallback={
        <div className="flex items-center justify-center h-full min-h-[500px]">
          <p className="text-muted-foreground">Loading map...</p>
        </div>
      }>
        <LeafletMap 
          selectedPlaceId={selectedPlaceId} 
          showArtisans={showArtisans} 
          onPlaceSelect={onPlaceSelect} 
        />
      </Suspense>

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
