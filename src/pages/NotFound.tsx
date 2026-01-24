import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";

const NotFound = () => {
  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center section-padding bg-gradient-warm">
        <div className="text-center max-w-lg mx-auto">
          <h1 className="font-serif text-8xl text-gradient-gold mb-4">404</h1>
          <h2 className="font-serif text-3xl text-chocolate mb-4">Page introuvable</h2>
          <p className="font-body text-muted-foreground mb-8">
            Oups ! La page que vous recherchez semble avoir disparu.
          </p>
          <Button variant="gold" size="lg" asChild>
            <Link to="/">
              <Home size={18} />
              Retour à l'accueil
            </Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
