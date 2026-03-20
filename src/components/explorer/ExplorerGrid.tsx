import { Link } from 'react-router-dom';
import { Star, MapPin, Plane, BadgeCheck, ArrowUpRight } from 'lucide-react';
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
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: Math.min(index * 0.04, 0.3),
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <Link
        to={`/prestataires/${vendor.slug}`}
        className="group block bg-card rounded-xl overflow-hidden border border-border/40 hover:border-champagne/40 shadow-sm hover:shadow-lg transition-all duration-400 hover:-translate-y-1"
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
            <div className="w-full h-full bg-gradient-to-br from-secondary to-warm-beige flex items-center justify-center">
              <span className="font-serif text-5xl text-champagne/25">{vendor.nom_entreprise[0]}</span>
            </div>
          )}

          {/* Gradient scrim */}
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

          {/* Top row */}
          <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
            <div className="flex gap-1.5">
              {isPremium && (
                <span className="px-2.5 py-1 rounded-lg bg-champagne text-primary-foreground text-[10px] font-bold tracking-wide uppercase flex items-center gap-1 shadow-sm">
                  <BadgeCheck className="w-3 h-3" />
                  Premium
                </span>
              )}
              {vendor.zone_disponibilite && vendor.zone_disponibilite !== 'France' && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-black/50 text-white text-[10px] font-medium backdrop-blur-sm">
                  <Plane className="w-3 h-3" />
                  {vendor.zone_disponibilite}
                </span>
              )}
            </div>
            <FavoriteButton prestataireId={vendor.id} />
          </div>

          {/* Bottom on image */}
          <div className="absolute bottom-3 left-3 right-3">
            {vendor.categories?.name && (
              <span className="inline-block px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-sm text-white text-[10px] font-medium tracking-wide uppercase mb-1.5">
                {vendor.sous_categorie || vendor.categories.name}
              </span>
            )}
            <h3 className="font-serif text-lg font-semibold text-white leading-tight" style={{ textShadow: '0 1px 6px rgba(0,0,0,0.5)' }}>
              {vendor.nom_entreprise}
            </h3>
          </div>
        </div>

        {/* Details */}
        <div className="px-4 py-3.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 text-xs text-muted-foreground min-w-0 flex-1">
              {vendor.ville && (
                <span className="inline-flex items-center gap-1 shrink-0">
                  <MapPin className="w-3 h-3 text-champagne/70" />
                  {vendor.ville}
                </span>
              )}
              {vendor.origine_culturelle && (
                <span className="text-champagne font-medium truncate">
                  {vendor.origine_culturelle}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {vendor.avg_rating > 0 && (
                <span className="flex items-center gap-1 text-xs">
                  <Star className="w-3.5 h-3.5 fill-champagne text-champagne" />
                  <span className="font-semibold text-foreground tabular-nums">{vendor.avg_rating.toFixed(1)}</span>
                  {vendor.review_count > 0 && (
                    <span className="text-muted-foreground">({vendor.review_count})</span>
                  )}
                </span>
              )}
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-champagne/10 text-champagne group-hover:bg-champagne group-hover:text-primary-foreground transition-all duration-300">
                <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="rounded-xl border border-border/30 overflow-hidden">
          <Skeleton className="aspect-[4/3] w-full" />
          <div className="px-4 py-3.5">
            <div className="flex items-center justify-between">
              <div className="space-y-1.5">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="w-7 h-7 rounded-lg" />
            </div>
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
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">
          <span className="font-bold text-foreground tabular-nums">{prestataires.length}</span>
          {' '}prestataire{prestataires.length !== 1 ? 's' : ''} trouvé{prestataires.length !== 1 ? 's' : ''}
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {prestataires.map((vendor, i) => (
          <VendorCard key={vendor.id} vendor={vendor} index={i} />
        ))}
      </div>
    </div>
  );
}
