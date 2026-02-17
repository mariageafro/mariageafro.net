import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { QuickSearchBar } from "@/components/home/QuickSearchBar";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { WhySection } from "@/components/home/WhySection";
import { InspirationSection } from "@/components/home/InspirationSection";
import { ProSection } from "@/components/home/ProSection";
import { DevenirPrestatairePopup } from "@/components/home/DevenirPrestatairePopup";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Sparkles, Heart, ArrowRight } from "lucide-react";

function DemoBanner() {
  return (
    <section className="section-padding bg-gradient-warm !py-12">
      <div className="container-editorial max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl border border-primary/20 bg-white/40 backdrop-blur-xl shadow-elegant p-8 md:p-12 text-center overflow-hidden my-[61px]">

          <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-accent/10 rounded-full blur-3xl" />
          <div className="relative">
            <Sparkles className="text-primary mx-auto mb-3" size={32} />
            <h2 className="font-serif text-2xl md:text-3xl text-chocolate mb-3">
              Découvrez un mariage complet en démo
            </h2>
            <p className="font-body text-muted-foreground max-w-lg mx-auto mb-6">
              Explorez un mariage afro-luxe terminé : budget détaillé, 29 prestataires, 250 invités, timeline Jour J et bien plus.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button className="font-body bg-primary hover:bg-primary/90 px-8" asChild>
                <Link to="/demo-mariage">
                  <Sparkles className="mr-2" size={16} /> Voir la démo
                </Link>
              </Button>
              <Button variant="outline" className="font-body px-8" asChild>
                <Link to="/mon-mariage/onboarding">
                  <Heart className="mr-2" size={16} /> Créer mon mariage
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>);

}

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <QuickSearchBar />
      <CategoriesSection />
      <DemoBanner />
      <WhySection />
      <InspirationSection />
      <ProSection />
      <DevenirPrestatairePopup />
    </Layout>);

};

export default Index;