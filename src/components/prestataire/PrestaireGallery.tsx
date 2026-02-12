import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
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
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
              className="aspect-[4/3] rounded-xl overflow-hidden cursor-pointer group"
              onClick={() => setSelectedIndex(index + 1)}
            >
              <img
                src={url}
                alt={`Gallery ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
            onClick={() => {
              setSelectedIndex(null);
              setViewAll(false);
            }}
          >
            {!viewAll && selectedIndex !== null && (
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                onClick={e => e.stopPropagation()}
                className="relative max-w-4xl max-h-[90vh] w-full"
              >
                <img
                  src={galleryItems[selectedIndex]}
                  alt={`Gallery ${selectedIndex}`}
                  className="w-full h-full object-contain rounded-lg"
                />
                <button
                  onClick={() => setSelectedIndex(null)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                >
                  <X size={24} className="text-white" />
                </button>
                {/* Navigation */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {galleryItems.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedIndex(idx)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        idx === selectedIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {viewAll && (
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                onClick={e => e.stopPropagation()}
                className="max-w-5xl w-full max-h-[90vh] overflow-y-auto rounded-lg"
              >
                <div className="grid grid-cols-3 gap-4 p-6 bg-background rounded-lg">
                  {galleryItems.map((url, idx) => (
                    <motion.img
                      key={idx}
                      src={url}
                      alt={`Gallery ${idx}`}
                      className="aspect-[4/3] object-cover rounded-lg cursor-pointer hover:scale-105 transition-transform"
                      onClick={() => {
                        setSelectedIndex(idx);
                        setViewAll(false);
                      }}
                      layoutId={`gallery-${idx}`}
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
