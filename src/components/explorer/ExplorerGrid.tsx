import { useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Plane, BadgeCheck, ArrowUpRight, Loader2 } from 'lucide-react';
import { FavoriteButton } from '@/components/prestataire/FavoriteButton';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
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
        delay: Math.min((index % 30) * 0.04, 0.3),
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
            <div className="w-full h-full flex items-center justify-center text-muted-foreground/40 text-4xl font-serif">
              {vendor.nom_entreprise.charAt(0)}
            </div>
          )}

          {/* Badge */}
          {isPremium && (
            <span className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-champagne/90 text-[11px] font-semibold uppercase tracking-wider text-foreground backdrop-blur-sm">
              <BadgeCheck className="w-3 h-3" /> Premium
            </span>
          )}

          {vendor.badge_type === 'FOUNDER' && (
            <span className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-600/90 text-[11px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
              Fondateur
            </span>
          )}

          {/* Zone dispo */}
          {vendor.zone_disponibilite && (
            <span className="absolute top-2.5 right-2.5 inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-background/80 text-[10px] font-medium text-muted-foreground backdrop-blur-sm">
              <Plane className="w-2.5 h-2.5" /> {vendor.zone_disponibilite}
            </span>
          )}

          {/* Favorite */}
          <div className="absolute bottom-2 right-2">
            <FavoriteButton prestataireId={vendor.id} />
          </div>
        </div>

        {/* Info */}
        <div className="px-4 py-3.5">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-foreground truncate leading-tight group-hover:text-champagne transition-colors">
                {vendor.nom_entreprise}
              </h3>
              <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                {vendor.ville && (
                  <>
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span className="truncate">{vendor.ville}</span>
                  </>
                )}
                {vendor.origine_culturelle && (
                  <>
                    <span className="mx-0.5 text-border">·</span>
                    <span className="truncate">{vendor.origine_culturelle}</span>
                  </>
                )}
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-champagne shrink-0 transition-colors" />
          </div>

          {/* Rating + category */}
          <div className="flex items-center justify-between mt-2.5 text-xs">
            <span className="text-muted-foreground font-medium truncate">
              {vendor.categories?.name ?? vendor.sous_categorie ?? '—'}
            </span>
            {vendor.avg_rating > 0 && (
              <span className="flex items-center gap-0.5 font-semibold text-foreground">
                <Star className="w-3 h-3 fill-champagne text-champagne" />
                {vendor.avg_rating.toFixed(1)}
                <span className="text-muted-foreground font-normal ml-0.5">({vendor.review_count})</span>
              </span>
            )}
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

function LoadingMoreSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="rounded-xl border border-border/30 overflow-hidden">
          <Skeleton className="aspect-[4/3] w-full" />
          <div className="px-4 py-3.5">
            <div className="space-y-1.5">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-16" />
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
  isLoadingMore: boolean;
  hasMore: boolean;
  totalCount: number;
  onLoadMore: () => void;
}

export function ExplorerGrid({ prestataires, isLoading, isLoadingMore, hasMore, totalCount, onLoadMore }: Props) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Infinite scroll with IntersectionObserver
  useEffect(() => {
    if (!sentinelRef.current || !hasMore || isLoading || isLoadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          onLoadMore();
        }
      },
      { rootMargin: '400px' }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, isLoading, isLoadingMore, onLoadMore]);

  if (isLoading) return <LoadingSkeleton />;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">
          <span className="font-bold text-foreground tabular-nums">{prestataires.length}</span>
          {totalCount > prestataires.length && (
            <span> sur <span className="font-semibold tabular-nums">{totalCount}</span></span>
          )}
          {' '}prestataire{totalCount !== 1 ? 's' : ''} trouvé{totalCount !== 1 ? 's' : ''}
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {prestataires.map((vendor, i) => (
          <VendorCard key={vendor.id} vendor={vendor} index={i} />
        ))}
      </div>

      {/* Loading more indicator */}
      {isLoadingMore && <LoadingMoreSkeleton />}

      {/* Infinite scroll sentinel */}
      {hasMore && !isLoadingMore && (
        <div ref={sentinelRef} className="h-1" />
      )}

      {/* Manual fallback button */}
      {hasMore && !isLoadingMore && (
        <div className="flex justify-center mt-8">
          <Button
            variant="outline"
            onClick={onLoadMore}
            className="gap-2"
          >
            Voir plus de prestataires
          </Button>
        </div>
      )}

      {!hasMore && prestataires.length > 0 && (
        <p className="text-center text-sm text-muted-foreground mt-8">
          Tous les prestataires sont affichés
        </p>
      )}
    </div>
  );
}
