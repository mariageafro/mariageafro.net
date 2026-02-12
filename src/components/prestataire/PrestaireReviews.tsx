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

      {/* Rating Summary */}
      <div className="mb-8 p-6 rounded-2xl bg-secondary">
        <div className="flex items-center gap-4">
          <div>
            <div className="text-4xl font-serif text-chocolate mb-1">{avgRating.toFixed(1)}</div>
            <div className="flex gap-0.5 mb-2">
              {Array.from({ length: Math.round(avgRating) }).map((_, i) => (
                <Star key={i} size={14} className="text-gold fill-gold" />
              ))}
            </div>
            <p className="font-body text-sm text-muted-foreground">
              Basé sur {reviewCount} avis
            </p>
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
              <div>
                <h4 className="font-serif text-lg text-chocolate">Client</h4>
                <p className="font-body text-xs text-muted-foreground">
                  {format(new Date(review.created_at), 'MMMM yyyy', { locale: fr })}
                </p>
              </div>
              <div className="flex gap-0.5">
                {Array.from({ length: review.note }).map((_, i) => (
                  <Star key={i} size={14} className="text-gold fill-gold" />
                ))}
              </div>
            </div>
            {review.commentaire && (
              <p className="font-body text-muted-foreground">{review.commentaire}</p>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
