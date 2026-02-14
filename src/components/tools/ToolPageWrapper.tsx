import { Layout } from "@/components/layout/Layout";
import { useAuthContext } from "@/contexts/auth-context";
import { useToolTranslations } from "@/hooks/use-tool-translations";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

interface ToolPageWrapperProps {
  title: string;
  children: React.ReactNode;
}

export function ToolPageWrapper({ title, children }: ToolPageWrapperProps) {
  const { user } = useAuthContext();
  const t = useToolTranslations();

  return (
    <Layout>
      <section className="pt-28 pb-8 bg-gradient-warm">
        <div className="container-editorial">
          <Link to="/outils-maries" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-body">
            {t("Retour aux outils")}
          </Link>
          <h1 className="font-serif text-chocolate mt-2 text-3xl md:text-4xl">{title}</h1>
        </div>
      </section>

      {!user && (
        <div className="bg-secondary border-b border-border">
          <div className="container-editorial py-4 flex items-center gap-3">
            <LogIn size={18} className="text-primary" />
            <span className="font-body text-sm text-muted-foreground">{t("Se connecter pour enregistrer")}</span>
            <Link to="/auth">
              <Button size="sm" className="btn-gold text-sm px-4 py-1 h-auto">
                {t("Se connecter pour enregistrer").split(" ")[0]}
              </Button>
            </Link>
          </div>
        </div>
      )}

      <section className="section-padding bg-gradient-warm !py-8 md:!py-12">
        <div className="container-editorial max-w-4xl">
          {children}
        </div>
      </section>
    </Layout>
  );
}
