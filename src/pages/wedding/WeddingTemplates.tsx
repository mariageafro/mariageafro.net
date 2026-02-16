import { Layout } from "@/components/layout/Layout";
import { weddingThemes } from "@/lib/wedding-themes";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { TemplateCard } from "@/components/wedding/TemplateCard";

export default function WeddingTemplates() {
  return (
    <Layout>
      {/* Header */}
      <section className="pt-28 pb-12 bg-gradient-warm">
        <div className="container-editorial text-center">
          <h1 className="font-serif text-chocolate text-3xl md:text-5xl">
            Nos templates de site de mariage
          </h1>
          <p className="font-body text-muted-foreground mt-3 max-w-xl mx-auto">
            Choisissez parmi nos thèmes élégants pour créer votre site de
            mariage unique. Chaque template est entièrement personnalisable.
          </p>
        </div>
      </section>

      {/* Templates Grid */}
      <section className="py-16 bg-muted/50">
        <div className="container-editorial">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Object.values(weddingThemes).map((theme) => (
              <TemplateCard key={theme.key} theme={theme} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-warm text-center">
        <div className="container-editorial space-y-6">
          <h2 className="font-serif text-chocolate text-2xl md:text-3xl">
            Prêt(e) à créer votre site ?
          </h2>
          <p className="font-body text-muted-foreground max-w-md mx-auto">
            Créez gratuitement votre site de mariage personnalisé avec le thème
            de votre choix, QR code et confirmation de présence intégrés.
          </p>
          <div className="flex justify-center gap-3">
            <Link to="/mon-mariage/onboarding">
              <Button className="btn-gold">Créer mon site gratuitement</Button>
            </Link>
            <Link to="/demo-mariage">
              <Button variant="outline">Voir la démo</Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
