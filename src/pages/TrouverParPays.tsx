import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { MapPin, ArrowRight } from "lucide-react";

type Country = {
  id: string;
  name: string;
  code: string;
  flag_emoji: string | null;
  priority: number;
};

export default function TrouverParPays() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("countries")
        .select("*")
        .order("priority", { ascending: true });
      if (data) setCountries(data);

      // Count prestataires per country
      const { data: presta } = await supabase
        .from("prestataires")
        .select("country_id")
        .eq("statut", "actif")
        .not("country_id", "is", null);

      if (presta) {
        const map: Record<string, number> = {};
        presta.forEach((p) => {
          if (p.country_id) map[p.country_id] = (map[p.country_id] || 0) + 1;
        });
        setCounts(map);
      }
    };
    fetch();
  }, []);

  return (
    <Layout>
      <section className="pt-32 pb-12 bg-gradient-warm">
        <div className="container-editorial">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="font-serif text-chocolate mb-4">
              Trouver par <span className="text-gradient-gold italic">Pays</span>
            </h1>
            <p className="font-body text-muted-foreground">
              Explorez les prestataires spécialisés dans les traditions de votre pays d'origine.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-gradient-warm">
        <div className="container-editorial">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {countries.map((country, index) => (
              <motion.div
                key={country.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
              >
                <Link
                  to={`/prestataires?country=${country.id}`}
                  className="group card-premium p-6 flex items-center gap-4 hover:shadow-elegant"
                >
                  <span className="text-4xl">{country.flag_emoji}</span>
                  <div className="flex-1">
                    <h3 className="font-serif text-xl text-chocolate group-hover:text-champagne transition-colors">
                      {country.name}
                    </h3>
                    <p className="font-body text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin size={14} />
                      {counts[country.id] || 0} prestataire{(counts[country.id] || 0) !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <ArrowRight size={20} className="text-muted-foreground group-hover:text-champagne transition-colors" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
