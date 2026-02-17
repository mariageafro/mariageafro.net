import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

interface PrestaireGalleryProps {
  medias: Tables<'medias'>[];
  coverUrl: string | null;
  businessName: string;
}

export function PrestaireGallery({ medias, coverUrl, businessName }: PrestaireGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [viewAll, setViewAll] = useState(false);

  const photoMedias = medias.filter(m => m.type === 'photo');
  const galleryItems = coverUrl ? [coverUrl, ...photoMedias.map(m => m.url)] : photoMedias.map(m => m.url);

  const goNext = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex + 1) % galleryItems.length);
  }, [selectedIndex, galleryItems.length]);

  const goPrev = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex - 1 + galleryItems.length) % galleryItems.length);
  }, [selectedIndex, galleryItems.length]);

  const closeLightbox = useCallback(() => {
    setSelectedIndex(null);
    setViewAll(false);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    if (selectedIndex === null && !viewAll) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [selectedIndex, viewAll, goNext, goPrev, closeLightbox]);

  if (galleryItems.length === 0) {
    return (
      <div className="grid lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-secondary"
        >
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            Aucune photo disponible
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Main Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer group"
          onClick={() => setSelectedIndex(0)}
        >
          <img
            src={galleryItems[0]}
            alt={businessName}
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
        </motion.div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 gap-4">
          {galleryItems.slice(1, 5).map((url, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: (index + 1) * 0.1 }}
              className="relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer group"
              onClick={() => setSelectedIndex(index + 1)}
            >
              <img
                src={url}
                alt={`Gallery ${index + 1}`}
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            </motion.div>
          ))}
          {galleryItems.length > 5 && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="aspect-[4/3] rounded-xl bg-secondary flex items-center justify-center hover:bg-champagne/10 transition-colors"
              onClick={() => setViewAll(true)}
            >
              <span className="font-body text-muted-foreground">
                +{galleryItems.length - 5} photos
              </span>
            </motion.button>
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {(selectedIndex !== null || viewAll) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
            onClick={closeLightbox}
          >
            {!viewAll && selectedIndex !== null && (
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                onClick={e => e.stopPropagation()}
                className="relative max-w-5xl max-h-[90vh] w-full px-16"
              >
                <img
                  src={galleryItems[selectedIndex]}
                  alt={`${businessName} – photo ${selectedIndex + 1}`}
                  className="w-full h-full object-contain rounded-lg max-h-[85vh]"
                />

                {/* Close */}
                <button
                  onClick={closeLightbox}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                >
                  <X size={24} className="text-white" />
                </button>

                {/* Prev */}
                {galleryItems.length > 1 && (
                  <button
                    onClick={goPrev}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/15 hover:bg-white/30 flex items-center justify-center transition-colors backdrop-blur-sm"
                  >
                    <ChevronLeft size={28} className="text-white" />
                  </button>
                )}

                {/* Next */}
                {galleryItems.length > 1 && (
                  <button
                    onClick={goNext}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/15 hover:bg-white/30 flex items-center justify-center transition-colors backdrop-blur-sm"
                  >
                    <ChevronRight size={28} className="text-white" />
                  </button>
                )}

                {/* Counter + dots */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
                  <span className="text-white/70 font-body text-sm">
                    {selectedIndex + 1} / {galleryItems.length}
                  </span>
                  <div className="flex gap-1.5">
                    {galleryItems.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedIndex(idx)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          idx === selectedIndex ? 'bg-white scale-125' : 'bg-white/40 hover:bg-white/60'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {viewAll && (
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                onClick={e => e.stopPropagation()}
                className="relative max-w-5xl w-full max-h-[90vh] overflow-y-auto rounded-lg"
              >
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-6 bg-background rounded-lg">
                  {galleryItems.map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt={`Gallery ${idx + 1}`}
                      className="aspect-[4/3] object-cover object-top rounded-lg cursor-pointer hover:scale-105 transition-transform"
                      onClick={() => {
                        setSelectedIndex(idx);
                        setViewAll(false);
                      }}
                    />
                  ))}
                </div>
                <button
                  onClick={() => setViewAll(false)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                >
                  <X size={24} className="text-white" />
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
