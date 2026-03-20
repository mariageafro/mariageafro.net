import { Link } from 'react-router-dom';
import { Star, MapPin, MessageCircle, Plane, Heart, BadgeCheck, ArrowUpRight } from 'lucide-react';
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
      initial={{ opacity: 0, y: 16, filter: 'blur(4px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{
        duration: 0.5,
        delay: Math.min(index * 0.05, 0.35),
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <Link
        to={`/prestataires/${vendor.slug}`}
        className="group block bg-card rounded-2xl overflow-hidden border border-border/30 hover:border-champagne/30 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elegant)] transition-all duration-500 hover:-translate-y-1.5"
      >
        {/* Image Container */}
        <div className="relative aspect-[3/2] overflow-hidden bg-muted">
          {image ? (
            <img
              src={image}
              alt={vendor.nom_entreprise}
              className="w-full h-full object-cover group-hover:scale-[1.06] transition-transform duration-[800ms] ease-out"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-secondary to-warm-beige flex items-center justify-center">
              <span className="font-serif text-4xl text-champagne/30">{vendor.nom_entreprise[0]}</span>
            </div>
          )}

          {/* Dark gradient overlay at bottom for readability */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-chocolate/60 to-transparent" />

          {/* Top badges row */}
          <div className="absolute top-3 left-3 flex gap-1.5">
            {isPremium && (
              <span className="px-2.5 py-1 rounded-lg bg-champagne/90 text-primary-foreground text-[10px] font-bold tracking-wide uppercase backdrop-blur-sm flex items-center gap-1">
                <BadgeCheck className="w-3 h-3" />
                Premium
              </span>
            )}
            {vendor.zone_disponibilite && vendor.zone_disponibilite !== 'France' && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-chocolate/60 text-ivory text-[10px] font-medium backdrop-blur-sm">
                <Plane className="w-3 h-3" />
                {vendor.zone_disponibilite}
              </span>
            )}
          </div>

          {/* Favorite button */}
          <div className="absolute top-3 right-3">
            <FavoriteButton prestataireId={vendor.id} />
          </div>

          {/* Bottom info on image */}
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
            <div>
              {vendor.categories?.name && (
                <span className="inline-block px-2 py-0.5 rounded-md bg-ivory/20 backdrop-blur-sm text-ivory text-[10px] font-medium tracking-wide uppercase mb-1.5">
                  {vendor.sous_categorie || vendor.categories.name}
                </span>
              )}
              <h3 className="font-serif text-lg font-semibold text-ivory leading-tight drop-shadow-sm">
                {vendor.nom_entreprise}
              </h3>
            </div>
            {vendor.avg_rating > 0 && (
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-ivory/20 backdrop-blur-sm shrink-0">
                <Star className="w-3 h-3 fill-champagne text-champagne" />
                <span className="text-[11px] font-semibold text-ivory">{vendor.avg_rating.toFixed(1)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              {vendor.ville && (
                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {vendor.ville}
                </span>
              )}
              {vendor.origine_culturelle && (
                <span className="text-champagne font-medium">
                  {vendor.origine_culturelle}
                </span>
              )}
              {vendor.review_count > 0 && (
                <span>{vendor.review_count} avis</span>
              )}
            </div>
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-champagne/10 text-champagne group-hover:bg-champagne group-hover:text-primary-foreground transition-all duration-300">
              <ArrowUpRight className="w-4 h-4" />
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
        <div key={i} className="rounded-2xl border border-border/30 overflow-hidden">
          <Skeleton className="aspect-[3/2] w-full" />
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1.5">
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="w-8 h-8 rounded-lg" />
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
      <div className="flex items-center justify-between mb-5">
        <p className="text-xs text-muted-foreground">
          <span className="font-semibold text-foreground tabular-nums">{prestataires.length}</span>
          {' '}prestataire{prestataires.length !== 1 ? 's' : ''} trouvé{prestataires.length !== 1 ? 's' : ''}
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {prestataires.map((vendor, i) => (
          <VendorCard key={vendor.id} vendor={vendor} index={i} />
        ))}
      </div>
    </div>
  );
}
