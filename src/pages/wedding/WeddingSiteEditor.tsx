import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { useAuthContext } from "@/contexts/auth-context";
import { useWeddingProfile } from "@/hooks/use-wedding-profile";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Link, Navigate } from "react-router-dom";
import { Globe, Copy, ExternalLink, Image, Type } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

export default function WeddingSiteEditor() {
  const { user, isLoading: authLoading } = useAuthContext();
  const { profile, loading, saveProfile } = useWeddingProfile();
  const { toast } = useToast();

  const [heroUrl, setHeroUrl] = useState("");
  const [welcomeText, setWelcomeText] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setHeroUrl((profile as any).site_hero_image_url || "");
      setWelcomeText((profile as any).site_welcome_text || "");
    }
  }, [profile]);

  if (authLoading || loading) return null;
  if (!user) return <Navigate to="/auth" replace />;
  if (!profile) return <Navigate to="/mon-mariage/onboarding" replace />;

  const shareCode = (profile as any).site_share_code;
  const siteUrl = `${window.location.origin}/site/${shareCode}`;

  const handleSave = async () => {
    setSaving(true);
    await saveProfile({
      site_hero_image_url: heroUrl || null,
      site_welcome_text: welcomeText || null,
    } as any);
    toast({ title: "Site mis à jour !" });
    setSaving(false);
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(siteUrl);
    toast({ title: "Lien copié !" });
  };

  return (
    <Layout>
      <section className="pt-28 pb-8 bg-gradient-warm">
        <div className="container-editorial">
          <Link to="/mon-mariage" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-body">
            ← Retour au tableau de bord
          </Link>
          <h1 className="font-serif text-chocolate mt-2 text-3xl md:text-4xl">Mon site de mariage</h1>
        </div>
      </section>

      <section className="section-padding bg-gradient-warm !py-8 md:!py-12">
        <div className="container-editorial max-w-3xl space-y-8">

          {/* Site URL + QR */}
          <div className="card-premium p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Globe size={18} className="text-primary" />
              <h2 className="font-serif text-xl text-chocolate">Lien de votre site</h2>
            </div>
            <div className="flex gap-2">
              <Input value={siteUrl} readOnly className="text-sm" />
              <Button variant="outline" size="icon" onClick={copyUrl}><Copy size={16} /></Button>
              <a href={siteUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="icon"><ExternalLink size={16} /></Button>
              </a>
            </div>
            <div className="flex justify-center pt-4">
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <QRCodeSVG value={siteUrl} size={140} level="M" />
              </div>
            </div>
            <p className="text-xs text-center text-muted-foreground font-body">
              Partagez ce QR code sur vos faire-part ou invitations
            </p>
          </div>

          {/* Customization */}
          <div className="card-premium p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Image size={18} className="text-primary" />
              <h2 className="font-serif text-xl text-chocolate">Personnalisation</h2>
            </div>
            <div>
              <label className="font-body text-sm text-muted-foreground mb-1 block">
                URL de votre photo de couverture (Hero)
              </label>
              <Input
                placeholder="https://exemple.com/notre-photo.jpg"
                value={heroUrl}
                onChange={e => setHeroUrl(e.target.value)}
              />
              <p className="text-xs text-muted-foreground font-body mt-1">
                Utilisez une photo de couple en haute résolution pour un rendu optimal
              </p>
            </div>
            <div>
              <label className="font-body text-sm text-muted-foreground mb-1 block">
                <Type size={14} className="inline mr-1" />
                Texte d'accueil personnalisé
              </label>
              <Textarea
                placeholder="Votre présence est la preuve de votre considération envers notre union..."
                value={welcomeText}
                onChange={e => setWelcomeText(e.target.value)}
                className="min-h-[120px]"
              />
            </div>
            <Button onClick={handleSave} className="btn-gold w-full" disabled={saving}>
              {saving ? "Enregistrement..." : "Sauvegarder"}
            </Button>
          </div>

          {/* Preview Link */}
          <div className="text-center">
            <a href={siteUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="gap-2">
                <ExternalLink size={16} />
                Voir mon site en ligne
              </Button>
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
}
