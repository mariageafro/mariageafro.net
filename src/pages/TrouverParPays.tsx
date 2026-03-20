import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { CULTURAL_ORIGINS } from "@/lib/cultural-origins";

export default function TrouverParPays() {
  return (
    <Layout>
      <section className="pt-32 pb-12 bg-gradient-warm">
        <div className="container-editorial">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="font-serif text-chocolate mb-4">
              Explorer les prestataires par{" "}
              <span className="text-gradient-gold italic">origine & culture</span>
            </h1>
            <p className="font-body text-muted-foreground max-w-xl mx-auto">
              Trouvez des professionnels qui connaissent et célèbrent vos traditions.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-gradient-warm">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {CULTURAL_ORIGINS.map((o, i) => (
              <motion.div
                key={o.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: i * 0.06 }}
              >
                <Link
                  to={`/prestataires?culture=${encodeURIComponent(o.filter[0])}`}
                  className="group card-premium p-5 flex items-center gap-4 hover:shadow-elegant transition-shadow"
                >
                  <span className="text-3xl">{o.flag}</span>
                  <span className="flex-1 font-serif text-lg text-chocolate group-hover:text-champagne transition-colors">
                    {o.label}
                  </span>
                  <ArrowRight
                    size={18}
                    className="text-muted-foreground group-hover:text-champagne transition-colors"
                  />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
