import { motion } from 'framer-motion';

export function ExplorerHeader() {
  return (
    <section className="relative py-16 md:py-20 bg-gradient-to-b from-secondary to-background overflow-hidden">
      {/* Subtle decorative element */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'radial-gradient(circle at 20% 50%, hsl(var(--champagne)) 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }} />

      <div className="max-w-4xl mx-auto px-4 text-center relative">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-champagne font-medium tracking-widest uppercase text-xs mb-4"
        >
          Marketplace Premium
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif text-4xl md:text-5xl lg:text-6xl text-chocolate font-semibold leading-[1.1] tracking-tight"
        >
          Nos Prestataires
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-5 text-muted-foreground font-body text-base md:text-lg max-w-2xl mx-auto leading-relaxed"
        >
          Découvrez les meilleurs professionnels du mariage afro, sélectionnés pour leur expertise et leur compréhension de nos cultures.
        </motion.p>
      </div>
    </section>
  );
}
