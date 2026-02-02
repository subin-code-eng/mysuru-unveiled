import { useState, useRef, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import FilterBar from '@/components/FilterBar';
import PlaceCard from '@/components/PlaceCard';
import ArtisanCard from '@/components/ArtisanCard';
import TrailCard from '@/components/TrailCard';
import CrowdIndicator from '@/components/CrowdIndicator';
import Footer from '@/components/Footer';
import { places, PlaceCategory, CrowdLevel } from '@/data/places';
import { artisans } from '@/data/artisans';
import { trails } from '@/data/trails';

const MapView = lazy(() => import('@/components/MapView'));

const Index = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [categoryFilter, setCategoryFilter] = useState<PlaceCategory | 'all'>('all');
  const [crowdFilter, setCrowdFilter] = useState<'all' | CrowdLevel>('all');
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | undefined>();

  // Refs for scrolling
  const exploreRef = useRef<HTMLDivElement>(null);
  const artisansRef = useRef<HTMLDivElement>(null);
  const trailsRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  const handleNavigate = (section: string) => {
    setActiveSection(section);
    const refs: Record<string, React.RefObject<HTMLDivElement>> = {
      explore: exploreRef,
      artisans: artisansRef,
      trails: trailsRef,
      map: mapRef,
    };
    
    if (section === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (refs[section]?.current) {
      refs[section].current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const filteredPlaces = places.filter(place => {
    const categoryMatch = categoryFilter === 'all' || place.category === categoryFilter;
    const crowdMatch = crowdFilter === 'all' || place.crowdLevel === crowdFilter;
    return categoryMatch && crowdMatch;
  });

  const handlePlaceSelect = (placeId: string) => {
    setSelectedPlaceId(placeId);
    handleNavigate('map');
  };

  const handleArtisanSelect = (artisanId: string) => {
    // Find artisan and navigate to map with their location
    const artisan = artisans.find(a => a.id === artisanId);
    if (artisan) {
      setSelectedPlaceId(artisanId);
      handleNavigate('map');
    }
  };

  const handleTrailViewOnMap = (trailId: string) => {
    // Pass trail ID directly - MapView will handle showing all related places
    setSelectedPlaceId(`trail:${trailId}`);
    handleNavigate('map');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar activeSection={activeSection} onNavigate={handleNavigate} />
      
      {/* Hero Section */}
      <HeroSection 
        onExplore={() => handleNavigate('explore')} 
        onViewMap={() => handleNavigate('map')} 
      />

      {/* Problem Statement Section */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Problem */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-center md:text-left"
            >
              <span className="inline-block px-3 py-1 rounded-full bg-destructive/10 text-destructive text-sm font-semibold mb-4">
                The Problem
              </span>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-4">
                Over-Tourism at Famous Landmarks
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Mysore Palace attracts millions annually while local artisans struggle for visibility, 
                heritage streets remain unexplored, and cultural traditions fade. Current platforms lack 
                real-time crowd data and niche artisan discovery features.
              </p>
            </motion.div>

            {/* Solution */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-center md:text-left"
            >
              <span className="inline-block px-3 py-1 rounded-full bg-silk-green/20 text-silk-green text-sm font-semibold mb-4">
                Our Solution
              </span>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-4">
                Decentralised Tourism Platform
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                A platform that <span className="text-heritage-gold font-semibold">redistributes tourist attention</span> to 
                hidden gems, local artisans, and cultural trails — featuring crowd-level indicators, 
                artisan discovery, and curated walking routes through authentic Mysuru.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Explore Hidden Gems */}
      <section ref={exploreRef} className="py-16 bg-background" id="explore">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-3">
              Hidden Gems Explorer
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover lesser-known treasures across Mysuru. Filter by category and crowd level 
              to find your perfect off-the-beaten-path experience.
            </p>
          </motion.div>

          {/* Filters */}
          <div className="mb-8">
            <FilterBar
              activeFilter={categoryFilter}
              onFilterChange={setCategoryFilter}
              crowdFilter={crowdFilter}
              onCrowdFilterChange={setCrowdFilter}
            />
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{filteredPlaces.length}</span> hidden gems
              {categoryFilter !== 'all' && <span> in <span className="capitalize">{categoryFilter}</span></span>}
              {crowdFilter !== 'all' && <span> with <span className="capitalize">{crowdFilter}</span> crowd level</span>}
            </p>
          </div>

          {/* Place Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlaces.map((place, index) => (
              <PlaceCard
                key={place.id}
                place={place}
                onClick={() => handlePlaceSelect(place.id)}
                index={index}
              />
            ))}
          </div>

          {filteredPlaces.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No places match your current filters. Try adjusting your selection.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Local Artisans */}
      <section ref={artisansRef} className="py-16 bg-muted" id="artisans">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-3">
              Meet Local Artisans
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Connect with master craftspeople who've dedicated their lives to preserving 
              Mysuru's artistic heritage. Every purchase supports their livelihood and tradition.
            </p>
          </motion.div>

          {/* Artisan Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {artisans.map((artisan, index) => (
              <ArtisanCard
                key={artisan.id}
                artisan={artisan}
                onClick={() => handleArtisanSelect(artisan.id)}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Cultural Trails */}
      <section ref={trailsRef} className="py-16 bg-background" id="trails">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-3">
              Cultural Routes
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Curated walking and cycling routes that connect multiple experiences. 
              Not just destinations, but journeys through Mysuru's living heritage.
            </p>
          </motion.div>

          {/* Trail Cards */}
          <div className="space-y-6 max-w-4xl mx-auto">
            {trails.map((trail, index) => (
              <TrailCard
                key={trail.id}
                trail={trail}
                onViewOnMap={() => handleTrailViewOnMap(trail.id)}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Map Section */}
      <section ref={mapRef} className="py-16 bg-muted" id="map">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-3">
              Interactive Map
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore all hidden gems and artisan locations on our live map. 
              Click markers for details and plan your decentralised tourism route.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Map */}
            <div className="lg:col-span-2 h-[600px]">
              <Suspense fallback={<div className="flex items-center justify-center h-full bg-muted rounded-xl"><p className="text-muted-foreground">Loading map...</p></div>}>
                <MapView
                  selectedPlaceId={selectedPlaceId}
                  showArtisans={true}
                  onPlaceSelect={handlePlaceSelect}
                />
              </Suspense>
            </div>

            {/* Crowd Indicator Sidebar */}
            <div>
              <CrowdIndicator onPlaceSelect={handlePlaceSelect} />
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 heritage-gradient">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Be Part of the Change
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-8">
              Every visit to a hidden gem, every purchase from a local artisan, 
              every step on a cultural trail contributes to sustainable tourism.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => handleNavigate('explore')}
                className="px-8 py-4 bg-secondary text-secondary-foreground rounded-lg font-semibold hover:bg-secondary/90 transition-colors shadow-gold"
              >
                Start Exploring
              </button>
              <button
                onClick={() => handleNavigate('artisans')}
                className="px-8 py-4 bg-white/10 text-primary-foreground rounded-lg font-semibold hover:bg-white/20 transition-colors border border-white/20"
              >
                Meet Artisans
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
