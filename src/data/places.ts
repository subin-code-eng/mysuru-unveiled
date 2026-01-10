export type PlaceCategory = 'heritage' | 'art' | 'nature' | 'food' | 'culture';
export type CrowdLevel = 'low' | 'medium' | 'high';

export interface Place {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  category: PlaceCategory;
  coordinates: [number, number]; // [lat, lng]
  crowdLevel: CrowdLevel;
  bestTime: string;
  image: string;
  highlights: string[];
}

export const places: Place[] = [
  {
    id: 'devaraja-market',
    name: 'Devaraja Market',
    description: 'Historic 150-year-old market with local artisans selling traditional goods, spices, and flowers.',
    longDescription: 'One of the oldest and most vibrant markets in South India, Devaraja Market has been the heart of Mysuru trade since 1886. Wander through lanes filled with fragrant jasmine, fresh produce, traditional silk, and local handicrafts.',
    category: 'culture',
    coordinates: [12.3095, 76.6521],
    crowdLevel: 'medium',
    bestTime: 'Early morning (6-9 AM)',
    image: '/placeholder.svg',
    highlights: ['Traditional flower vendors', 'Spice traders', 'Sandalwood products', 'Local snacks']
  },
  {
    id: 'mandi-mohalla',
    name: 'Mandi Mohalla',
    description: 'Ancient trade quarter with narrow lanes, traditional architecture, and local craft workshops.',
    longDescription: 'This centuries-old neighborhood was the commercial hub during the Wodeyar dynasty. Today, it preserves the essence of old Mysuru with its winding lanes, traditional homes, and artisan workshops.',
    category: 'heritage',
    coordinates: [12.3108, 76.6489],
    crowdLevel: 'low',
    bestTime: 'Morning (8-11 AM)',
    image: '/placeholder.svg',
    highlights: ['Traditional architecture', 'Local artisans', 'Authentic street food', 'Heritage walks']
  },
  {
    id: 'kukkarahalli-lake',
    name: 'Kukkarahalli Lake',
    description: 'Serene lake surrounded by walking trails, diverse birdlife, and peaceful green spaces.',
    longDescription: 'A hidden gem managed by the University of Mysore, this 58-hectare lake is home to over 180 species of birds. Perfect for morning walks, birdwatching, and escaping the city bustle.',
    category: 'nature',
    coordinates: [12.3167, 76.6333],
    crowdLevel: 'low',
    bestTime: 'Dawn (5:30-7 AM) or Dusk',
    image: '/placeholder.svg',
    highlights: ['180+ bird species', 'Nature trails', 'Lotus ponds', 'Photography spots']
  },
  {
    id: 'ashoka-road-heritage',
    name: 'Ashoka Road Heritage Street',
    description: 'Colonial-era boulevard with heritage buildings, local shops, and traditional eateries.',
    longDescription: 'Named after Emperor Ashoka, this tree-lined avenue showcases a blend of colonial and Mysuru architectural styles. Home to traditional sweet shops, silk stores, and iconic landmarks.',
    category: 'heritage',
    coordinates: [12.3052, 76.6512],
    crowdLevel: 'medium',
    bestTime: 'Evening (4-7 PM)',
    image: '/placeholder.svg',
    highlights: ['Colonial architecture', 'Traditional sweet shops', 'Silk emporiums', 'Street photography']
  },
  {
    id: 'chamundi-foothill-villages',
    name: 'Chamundi Foothill Villages',
    description: 'Traditional villages at the base of Chamundi Hill with rural life experiences.',
    longDescription: 'Away from the tourist trail to Chamundi temple, these villages offer authentic rural Karnataka experiences. Meet local farmers, witness traditional crafts, and enjoy home-cooked meals.',
    category: 'culture',
    coordinates: [12.2722, 76.6701],
    crowdLevel: 'low',
    bestTime: 'Morning (7-10 AM)',
    image: '/placeholder.svg',
    highlights: ['Village homestays', 'Traditional farming', 'Local cuisine', 'Rural crafts']
  },
  {
    id: 'srirangapatna-outskirts',
    name: 'Srirangapatna Heritage Zone',
    description: 'Historic island town with Tipu Sultan\'s legacy, ancient temples, and river views.',
    longDescription: 'Beyond the main fort, explore lesser-known monuments, riverside ghats, and local communities. The outskirts offer peaceful walks along the Kaveri river and authentic local experiences.',
    category: 'heritage',
    coordinates: [12.4181, 76.6947],
    crowdLevel: 'low',
    bestTime: 'Morning or late afternoon',
    image: '/placeholder.svg',
    highlights: ['Riverside ghats', 'Hidden temples', 'Local fishing community', 'Bird sanctuary nearby']
  },
  {
    id: 'silk-weaving-kuvempunagar',
    name: 'Kuvempunagar Silk Weaving Cluster',
    description: 'Traditional silk weaving community where master weavers create Mysuru silk sarees.',
    longDescription: 'Visit the homes of master weavers who have practiced the art of silk weaving for generations. Watch the intricate process of creating world-famous Mysuru silk, from dyeing to final weaving.',
    category: 'art',
    coordinates: [12.2867, 76.6189],
    crowdLevel: 'low',
    bestTime: 'Working hours (9 AM - 5 PM)',
    image: '/placeholder.svg',
    highlights: ['Live weaving demonstrations', 'Direct artisan interaction', 'Authentic silk purchase', 'Heritage craft']
  },
  {
    id: 'agraharas-brahmapura',
    name: 'Brahmapura Agraharas',
    description: 'Traditional Brahmin quarters with ancient temples, agrahara architecture, and rituals.',
    longDescription: 'These centuries-old Brahmin settlements preserve traditional South Indian culture. Explore ancient temples, witness morning rituals, and experience the timeless rhythms of temple town life.',
    category: 'culture',
    coordinates: [12.3023, 76.6445],
    crowdLevel: 'low',
    bestTime: 'Early morning (5-8 AM)',
    image: '/placeholder.svg',
    highlights: ['Ancient temples', 'Traditional rituals', 'Agrahara architecture', 'Spiritual atmosphere']
  },
  {
    id: 'wood-carving-somanathapura',
    name: 'Wood Carving Artisans - Somanathapura Road',
    description: 'Cluster of traditional wood carving workshops continuing centuries-old Hoysala traditions.',
    longDescription: 'Skilled artisans here create intricate rosewood and sandalwood carvings inspired by Hoysala temple art. Watch masters transform raw wood into divine sculptures and decorative pieces.',
    category: 'art',
    coordinates: [12.2756, 76.8894],
    crowdLevel: 'low',
    bestTime: 'Daytime (10 AM - 4 PM)',
    image: '/placeholder.svg',
    highlights: ['Hoysala-style carvings', 'Master craftsmen', 'Custom orders', 'Sandalwood works']
  },
  {
    id: 'lingambudhi-lake',
    name: 'Lingambudhi Lake',
    description: 'Pristine lake with migratory birds, lotus blooms, and serene walking paths.',
    longDescription: 'This lesser-known lake on the outskirts offers peaceful mornings with stunning lotus blooms and diverse birdlife. A favorite among local birdwatchers and nature photographers.',
    category: 'nature',
    coordinates: [12.2989, 76.6067],
    crowdLevel: 'low',
    bestTime: 'Dawn (5:30-7 AM)',
    image: '/placeholder.svg',
    highlights: ['Migratory birds', 'Lotus gardens', 'Sunrise views', 'Nature photography']
  },
  {
    id: 'pottery-cluster-bannimantap',
    name: 'Bannimantap Pottery Cluster',
    description: 'Traditional pottery village where artisans create terracotta art using ancient techniques.',
    longDescription: 'Generations of potters have shaped clay here using traditional wheel methods. Visit during the festival season to see the creation of ceremonial items, lamps, and decorative pottery.',
    category: 'art',
    coordinates: [12.3289, 76.6678],
    crowdLevel: 'low',
    bestTime: 'Morning (8-11 AM)',
    image: '/placeholder.svg',
    highlights: ['Traditional pottery', 'Hands-on workshops', 'Festival specials', 'Terracotta art']
  },
  {
    id: 'gandhi-square-food-street',
    name: 'Gandhi Square Food Heritage',
    description: 'Historic food street with generations-old eateries serving authentic Mysuru cuisine.',
    longDescription: 'This bustling square has been feeding Mysoreans for over a century. Find iconic establishments serving Mysore Pak, filter coffee, traditional thalis, and street snacks unchanged for generations.',
    category: 'food',
    coordinates: [12.3078, 76.6556],
    crowdLevel: 'medium',
    bestTime: 'Evening (5-9 PM)',
    image: '/placeholder.svg',
    highlights: ['Mysore Pak origins', 'Filter coffee', 'Traditional thalis', 'Street snacks']
  }
];

export const getCrowdColor = (level: CrowdLevel): string => {
  switch (level) {
    case 'low': return 'bg-silk-green text-accent-foreground';
    case 'medium': return 'bg-secondary text-secondary-foreground';
    case 'high': return 'bg-primary text-primary-foreground';
  }
};

export const getCategoryIcon = (category: PlaceCategory): string => {
  switch (category) {
    case 'heritage': return '🏛️';
    case 'art': return '🎨';
    case 'nature': return '🌿';
    case 'food': return '🍛';
    case 'culture': return '🪔';
  }
};

export const getCategoryColor = (category: PlaceCategory): string => {
  switch (category) {
    case 'heritage': return 'bg-heritage-maroon text-primary-foreground';
    case 'art': return 'bg-secondary text-secondary-foreground';
    case 'nature': return 'bg-silk-green text-accent-foreground';
    case 'food': return 'bg-terracotta text-primary-foreground';
    case 'culture': return 'bg-heritage-gold text-secondary-foreground';
  }
};
