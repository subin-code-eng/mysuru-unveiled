import { motion } from 'framer-motion';
import { MapPin, Clock, Quote } from 'lucide-react';
import { Artisan, getCraftIcon, getCraftColor } from '@/data/artisans';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface ArtisanCardProps {
  artisan: Artisan;
  onClick: () => void;
  index?: number;
}

const ArtisanCard = ({ artisan, onClick, index = 0 }: ArtisanCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <Card 
        className="group cursor-pointer overflow-hidden border-border hover:shadow-elevated transition-all duration-300 h-full"
        onClick={onClick}
      >
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-start gap-4 mb-4">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-full gold-gradient flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">{getCraftIcon(artisan.craft)}</span>
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-serif text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                {artisan.name}
              </h3>
              <Badge className={`${getCraftColor(artisan.craft)} text-xs font-medium mt-1 capitalize`}>
                {artisan.craft}
              </Badge>
            </div>
          </div>

          {/* Specialty */}
          <p className="text-sm font-medium text-foreground mb-2">
            {artisan.specialty}
          </p>

          {/* Story Quote */}
          <div className="relative bg-muted rounded-lg p-4 mb-4">
            <Quote className="absolute top-2 left-2 w-4 h-4 text-heritage-gold opacity-50" />
            <p className="text-sm text-muted-foreground italic pl-4 line-clamp-3">
              "{artisan.story}"
            </p>
          </div>

          {/* Info */}
          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-4">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{artisan.experience}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              <span className="line-clamp-1">{artisan.location}</span>
            </div>
          </div>

          {/* Products */}
          <div className="flex flex-wrap gap-1.5">
            {artisan.products.slice(0, 3).map((product) => (
              <span 
                key={product}
                className="text-xs px-2 py-0.5 rounded-full bg-heritage-gold/10 text-heritage-maroon border border-heritage-gold/20"
              >
                {product}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ArtisanCard;
