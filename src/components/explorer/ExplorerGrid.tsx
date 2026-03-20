import { Link } from 'react-router-dom';
import { Star, MapPin, BadgeCheck, MessageCircle, Plane } from 'lucide-react';
import { FavoriteButton } from '@/components/prestataire/FavoriteButton';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';

interface Vendor {
  id: string;
  nom_entreprise: string;
  slug: string;
  ville: string | null;
  photo_url: string | null;
  origine_culturelle: string | null;
  zone_disponibilite: string | null;
  sous_categorie: string | null;
  badge_type: string | null;
  is_featured: boolean | null;
  is_lifetime_featured: boolean | null;
  categories: { name: string; slug: string } | null;
  avg_rating: number;
  review_count: number;
  cover_url: string | null;
}

function VendorCard({ vendor, index }: { vendor: Vendor; index: number }) {
  const image = vendor.cover_url || vendor.photo_url;
  const isPremium = vendor.is_lifetime_featured || vendor.is_featured;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: Math.min(index * 0.06, 0.4),
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <Link
        to={`/prestataires/${vendor.slug}`}
        className="group block bg-card rounded-2xl border border-border/40 overflow-hidden shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elegant)] transition-all duration-300 hover:-translate-y-1"
      >
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          {image ? (
            <img
              src={image}
              alt={vendor.nom_entreprise}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <span className="font-serif text-2xl opacity-30">{vendor.nom_entreprise[0]}</span>
            </div>
          )}

          {/* Overlay badges */}
          <div className="absolute top-3 left-3 flex gap-1.5">
            {isPremium && (
              <span className="px-2.5 py-1 rounded-full bg-champagne/90 text-primary-foreground text-[10px] font-semibold tracking-wide uppercase backdrop-blur-sm">
                Premium
              </span>
            )}
          </div>

          {/* Favorite */}
          <div className="absolute top-3 right-3">
            <FavoriteButton prestataireId={vendor.id} />
          </div>

          {/* Zone badge */}
          {vendor.zone_disponibilite && (
            <div className="absolute bottom-3 left-3">
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-chocolate/70 text-ivory text-[10px] font-medium backdrop-blur-sm">
                <Plane className="w-3 h-3" />
                {vendor.zone_disponibilite}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Category */}
          {vendor.categories?.name && (
            <p className="text-[10px] font-medium tracking-wider uppercase text-champagne mb-1">
              {vendor.sous_categorie || vendor.categories.name}
            </p>
          )}

          {/* Name */}
          <h3 className="font-serif text-lg font-semibold text-chocolate leading-tight group-hover:text-champagne-dark transition-colors">
            {vendor.nom_entreprise}
          </h3>

          {/* Location & Origin */}
          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
            {vendor.ville && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {vendor.ville}
              </span>
            )}
            {vendor.origine_culturelle && (
              <span className="text-champagne">
                {vendor.origine_culturelle}
              </span>
            )}
          </div>

          {/* Rating */}
          {vendor.avg_rating > 0 && (
            <div className="flex items-center gap-1.5 mt-2">
              <Star className="w-3.5 h-3.5 fill-champagne text-champagne" />
              <span className="text-xs font-medium text-foreground">{vendor.avg_rating.toFixed(1)}</span>
              <span className="text-xs text-muted-foreground">({vendor.review_count} avis)</span>
            </div>
          )}

          {/* CTAs */}
          <div className="flex gap-2 mt-4">
            <span className="flex-1 text-center py-2 rounded-lg bg-champagne/10 text-champagne-dark text-xs font-medium hover:bg-champagne/20 transition-colors">
              Voir profil
            </span>
            <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-secondary hover:bg-warm-beige transition-colors">
              <MessageCircle className="w-4 h-4 text-chocolate" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-border/40 overflow-hidden">
          <Skeleton className="aspect-[4/3] w-full" />
          <div className="p-4 space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}

interface Props {
  prestataires: Vendor[];
  isLoading: boolean;
}

export function ExplorerGrid({ prestataires, isLoading }: Props) {
  if (isLoading) return <LoadingSkeleton />;

  return (
    <div>
      <p className="text-xs text-muted-foreground mb-4">
        {prestataires.length} prestataire{prestataires.length !== 1 ? 's' : ''} trouvé{prestataires.length !== 1 ? 's' : ''}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {prestataires.map((vendor, i) => (
          <VendorCard key={vendor.id} vendor={vendor} index={i} />
        ))}
      </div>
    </div>
  );
}
