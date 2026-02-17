import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface PrestaireReviewsProps {
  reviews: Tables<'avis'>[];
  avgRating: number;
  reviewCount: number;
}

export function PrestaireReviews({ reviews, avgRating, reviewCount }: PrestaireReviewsProps) {
  if (reviewCount === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-2xl text-chocolate">Avis clients</h2>
        </div>
        <div className="p-8 rounded-2xl bg-secondary text-center">
          <p className="font-body text-muted-foreground">
            Aucun avis pour l'instant. Les clients satisfaits partageront bientôt leurs avis !
          </p>
        </div>
      </motion.div>
    );
  }

  // Rating distribution
  const distribution = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.note === star).length,
    pct: (reviews.filter(r => r.note === star).length / reviewCount) * 100,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-2xl text-chocolate">Avis clients</h2>
        <div className="flex items-center gap-2">
          <Star size={20} className="text-gold fill-gold" />
          <span className="font-serif text-2xl text-chocolate">{avgRating.toFixed(1)}</span>
          <span className="font-body text-muted-foreground">/ 5</span>
        </div>
      </div>

      {/* Rating Summary with distribution bars */}
      <div className="mb-8 p-6 rounded-2xl bg-secondary">
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex-shrink-0 text-center sm:text-left">
            <div className="text-5xl font-serif text-chocolate mb-1">{avgRating.toFixed(1)}</div>
            <div className="flex gap-0.5 justify-center sm:justify-start mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={i < Math.round(avgRating) ? 'text-gold fill-gold' : 'text-muted-foreground/30'}
                />
              ))}
            </div>
            <p className="font-body text-sm text-muted-foreground">
              {reviewCount} avis
            </p>
          </div>

          {/* Distribution bars */}
          <div className="flex-1 space-y-2">
            {distribution.map(({ star, count, pct }) => (
              <div key={star} className="flex items-center gap-3">
                <span className="font-body text-sm text-muted-foreground w-4 text-right">{star}</span>
                <Star size={12} className="text-gold fill-gold flex-shrink-0" />
                <div className="flex-1 h-2.5 rounded-full bg-background overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${pct}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="h-full rounded-full bg-gradient-to-r from-gold to-champagne"
                  />
                </div>
                <span className="font-body text-xs text-muted-foreground w-6">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.map((review, index) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="p-6 rounded-2xl bg-secondary"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-champagne/20 flex items-center justify-center font-serif text-chocolate text-lg">
                  C
                </div>
                <div>
                  <h4 className="font-serif text-lg text-chocolate">Client</h4>
                  <p className="font-body text-xs text-muted-foreground">
                    {format(new Date(review.created_at), 'MMMM yyyy', { locale: fr })}
                  </p>
                </div>
              </div>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={i < review.note ? 'text-gold fill-gold' : 'text-muted-foreground/30'}
                  />
                ))}
              </div>
            </div>
            {review.commentaire && (
              <p className="font-body text-muted-foreground leading-relaxed">{review.commentaire}</p>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
