import { useState, useEffect, useRef } from "react";
import { Layout } from "@/components/layout/Layout";
import { useAuthContext } from "@/contexts/auth-context";
import { useWeddingProfile } from "@/hooks/use-wedding-profile";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Link, Navigate } from "react-router-dom";
import {
  Globe, Copy, ExternalLink, Image, Type, Palette, Check,
  Upload, Eye, EyeOff, Smartphone, Monitor, Settings2, Sparkles,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { weddingThemes, getWeddingTheme } from "@/lib/wedding-themes";
import { supabase } from "@/integrations/supabase/client";

const FONT_OPTIONS = [
  { key: "classic-serif", label: "Classique Serif", preview: "font-serif", description: "Cormorant Garamond" },
  { key: "modern-sans", label: "Moderne Sans", preview: "font-sans tracking-wider uppercase", description: "Sans-serif épuré" },
  { key: "romantic-script", label: "Romantique Script", preview: "font-serif italic", description: "Italique élégant" },
  { key: "bold-display", label: "Urbain Bold", preview: "font-sans font-black", description: "Gras et impactant" },
];

const ACCENT_COLORS = [
  { key: "gold", label: "Or", color: "hsl(45, 80%, 55%)" },
  { key: "rose", label: "Rose", color: "hsl(340, 50%, 60%)" },
  { key: "green", label: "Vert", color: "hsl(160, 45%, 40%)" },
  { key: "terre", label: "Terre", color: "hsl(25, 40%, 45%)" },
  { key: "silver", label: "Argent", color: "hsl(220, 10%, 70%)" },
  { key: "blue", label: "Bleu", color: "hsl(210, 50%, 50%)" },
];

interface SectionsConfig {
  countdown: boolean;
  program: boolean;
  dresscode: boolean;
  rsvp_qr: boolean;
  photo_album: boolean;
}

export default function WeddingSiteEditor() {
  const { user, isLoading: authLoading } = useAuthContext();
  const { profile, loading, saveProfile } = useWeddingProfile();
  const { toast } = useToast();

  const [heroUrl, setHeroUrl] = useState("");
  const [welcomeText, setWelcomeText] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("classic");
  const [selectedFont, setSelectedFont] = useState("classic-serif");
  const [selectedAccent, setSelectedAccent] = useState("gold");
  const [sectionsConfig, setSectionsConfig] = useState<SectionsConfig>({
    countdown: true,
    program: true,
    dresscode: false,
    rsvp_qr: true,
    photo_album: true,
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewMode, setPreviewMode] = useState<"edit" | "preview">("edit");
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile) {
      setHeroUrl((profile as any).site_hero_image_url || "");
      setWelcomeText((profile as any).site_welcome_text || "");
      setSelectedTheme((profile as any).site_theme || "classic");
      setSelectedFont((profile as any).site_font_style || "classic-serif");
      setSelectedAccent((profile as any).site_accent_color || "gold");
      const config = (profile as any).site_sections_config;
      if (config && typeof config === "object") {
        setSectionsConfig({
          countdown: config.countdown ?? true,
          program: config.program ?? true,
          dresscode: config.dresscode ?? false,
          rsvp_qr: config.rsvp_qr ?? true,
          photo_album: config.photo_album ?? true,
        });
      }
    }
  }, [profile]);

  if (authLoading || loading) return null;
  if (!user) return <Navigate to="/auth" replace />;
  if (!profile) return <Navigate to="/mon-mariage/onboarding" replace />;

  const shareCode = (profile as any).site_share_code;
  const siteUrl = `${window.location.origin}/site/${shareCode}`;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (!file.type.startsWith("image/")) {
      toast({ title: "Fichier invalide", description: "Veuillez sélectionner une image", variant: "destructive" });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Fichier trop volumineux", description: "Maximum 5 Mo", variant: "destructive" });
      return;
    }

    setUploading(true);
    const ext = file.name.split(".").pop();
    const filePath = `${user.id}/hero-${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("wedding-sites")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      toast({ title: "Erreur d'upload", description: uploadError.message, variant: "destructive" });
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from("wedding-sites")
      .getPublicUrl(filePath);

    setHeroUrl(publicUrl);
    setUploading(false);
    toast({ title: "Photo uploadée !" });
  };

  const handleSave = async () => {
    setSaving(true);
    await saveProfile({
      site_hero_image_url: heroUrl || null,
      site_welcome_text: welcomeText || null,
      site_theme: selectedTheme,
      site_font_style: selectedFont,
      site_accent_color: selectedAccent,
      site_sections_config: sectionsConfig,
    } as any);
    toast({ title: "Site mis à jour !" });
    setSaving(false);
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(siteUrl);
    toast({ title: "Lien copié !" });
  };

  const themePreviewColors: Record<string, { bg: string; accent: string; text: string }> = {
    classic: { bg: "bg-[hsl(0,0%,10%)]", accent: "bg-white", text: "text-white" },
    romantique: { bg: "bg-[hsl(340,25%,35%)]", accent: "bg-[hsl(340,40%,80%)]", text: "text-[hsl(340,30%,95%)]" },
    moderne: { bg: "bg-[hsl(0,0%,8%)]", accent: "bg-[hsl(45,80%,60%)]", text: "text-white" },
    tropical: { bg: "bg-[hsl(160,35%,25%)]", accent: "bg-[hsl(45,70%,65%)]", text: "text-[hsl(45,60%,95%)]" },
  };

  const toggleSection = (key: keyof SectionsConfig) => {
    setSectionsConfig(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const theme = getWeddingTheme(selectedTheme);
  const coupleName = (profile as any).couple_display_name ||
    `${(profile as any).partner_one_first_name} & ${(profile as any).partner_two_first_name}`;

  // Preview mode
  if (previewMode === "preview") {
    return (
      <Layout>
        <section className="pt-28 pb-4 bg-gradient-warm">
          <div className="container-editorial flex items-center justify-between">
            <div>
              <Link to="/mon-mariage" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-body">
                ← Retour au tableau de bord
              </Link>
              <h1 className="font-serif text-chocolate mt-1 text-2xl">Prévisualisation</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={previewDevice === "desktop" ? "default" : "outline"}
                size="icon"
                onClick={() => setPreviewDevice("desktop")}
              >
                <Monitor size={16} />
              </Button>
              <Button
                variant={previewDevice === "mobile" ? "default" : "outline"}
                size="icon"
                onClick={() => setPreviewDevice("mobile")}
              >
                <Smartphone size={16} />
              </Button>
              <Button variant="outline" onClick={() => setPreviewMode("edit")} className="gap-2 ml-4">
                <EyeOff size={16} />
                Retour édition
              </Button>
            </div>
          </div>
        </section>

        <section className="section-padding bg-muted !py-6">
          <div className="flex justify-center">
            <div
              className={`bg-white shadow-2xl rounded-xl overflow-hidden transition-all duration-500 ${
                previewDevice === "mobile" ? "w-[390px] h-[844px]" : "w-full max-w-5xl h-[700px]"
              }`}
            >
              <iframe
                src={siteUrl}
                className="w-full h-full border-0"
                title="Prévisualisation du site"
              />
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="pt-28 pb-4 bg-gradient-warm">
        <div className="container-editorial flex items-center justify-between">
          <div>
            <Link to="/mon-mariage" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-body">
              ← Retour au tableau de bord
            </Link>
            <h1 className="font-serif text-chocolate mt-1 text-2xl md:text-3xl">Mon site de mariage</h1>
          </div>
          <Button variant="outline" onClick={() => setPreviewMode("preview")} className="gap-2">
            <Eye size={16} />
            Prévisualiser
          </Button>
        </div>
      </section>

      <section className="section-padding bg-gradient-warm !py-6 md:!py-10">
        <div className="container-editorial max-w-3xl space-y-6">

          {/* Site URL + QR */}
          <div className="card-premium p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Globe size={18} className="text-primary" />
              <h2 className="font-serif text-lg text-chocolate">Lien de votre site</h2>
            </div>
            <div className="flex gap-2">
              <Input value={siteUrl} readOnly className="text-sm" />
              <Button variant="outline" size="icon" onClick={copyUrl}><Copy size={16} /></Button>
              <a href={siteUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="icon"><ExternalLink size={16} /></Button>
              </a>
            </div>
            <div className="flex justify-center pt-2">
              <div className="bg-white rounded-xl p-3 shadow-sm">
                <QRCodeSVG value={siteUrl} size={120} level="M" />
              </div>
            </div>
            <p className="text-xs text-center text-muted-foreground font-body">
              Partagez ce QR code sur vos faire-part
            </p>
          </div>

          {/* Photo de couverture */}
          <div className="card-premium p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Image size={18} className="text-primary" />
              <h2 className="font-serif text-lg text-chocolate">Photo de couverture</h2>
            </div>

            {heroUrl && (
              <div className="relative rounded-xl overflow-hidden aspect-[16/9] bg-muted">
                <img src={heroUrl} alt="Couverture" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <Button
                    variant="outline"
                    className="bg-white/90 text-foreground gap-2"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                  >
                    <Upload size={16} />
                    Remplacer la photo
                  </Button>
                </div>
              </div>
            )}

            {!heroUrl && (
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="w-full aspect-[16/9] rounded-xl border-2 border-dashed border-muted-foreground/30 bg-muted/50 flex flex-col items-center justify-center gap-3 hover:border-primary/50 transition-colors"
              >
                <Upload size={32} className="text-muted-foreground" />
                <span className="text-sm text-muted-foreground font-body">
                  {uploading ? "Upload en cours..." : "Cliquez pour uploader votre photo de couple"}
                </span>
                <span className="text-xs text-muted-foreground/60 font-body">JPEG, PNG • Max 5 Mo</span>
              </button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />

            <div>
              <label className="font-body text-xs text-muted-foreground mb-1 block">
                Ou collez une URL d'image
              </label>
              <Input
                placeholder="https://exemple.com/notre-photo.jpg"
                value={heroUrl}
                onChange={e => setHeroUrl(e.target.value)}
                className="text-sm"
              />
            </div>
          </div>

          {/* Theme Selector */}
          <div className="card-premium p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Palette size={18} className="text-primary" />
              <h2 className="font-serif text-lg text-chocolate">Thème de couleurs</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.values(weddingThemes).map((t) => {
                const preview = themePreviewColors[t.key];
                const isSelected = selectedTheme === t.key;
                return (
                  <button
                    key={t.key}
                    onClick={() => setSelectedTheme(t.key)}
                    className={`relative rounded-xl overflow-hidden border-2 transition-all ${
                      isSelected ? "border-primary ring-2 ring-primary/30" : "border-transparent hover:border-muted-foreground/30"
                    }`}
                  >
                    <div className={`h-14 ${preview.bg} flex items-center justify-center gap-1`}>
                      <div className={`w-3 h-3 rounded-full ${preview.accent}`} />
                      <div className={`w-5 h-px ${preview.accent}`} />
                      <div className={`w-3 h-3 rounded-full ${preview.accent}`} />
                    </div>
                    <div className="p-2 bg-card text-center">
                      <p className="text-sm font-medium text-foreground">{t.emoji} {t.label}</p>
                    </div>
                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <Check size={12} className="text-primary-foreground" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Accent Color */}
          <div className="card-premium p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-primary" />
              <h2 className="font-serif text-lg text-chocolate">Couleur d'accent</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {ACCENT_COLORS.map(c => (
                <button
                  key={c.key}
                  onClick={() => setSelectedAccent(c.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all ${
                    selectedAccent === c.key
                      ? "border-primary ring-2 ring-primary/30"
                      : "border-muted hover:border-muted-foreground/30"
                  }`}
                >
                  <div
                    className="w-5 h-5 rounded-full border border-muted"
                    style={{ backgroundColor: c.color }}
                  />
                  <span className="text-sm font-body">{c.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Font Selector */}
          <div className="card-premium p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Type size={18} className="text-primary" />
              <h2 className="font-serif text-lg text-chocolate">Style de typographie</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {FONT_OPTIONS.map(f => (
                <button
                  key={f.key}
                  onClick={() => setSelectedFont(f.key)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    selectedFont === f.key
                      ? "border-primary ring-2 ring-primary/30 bg-primary/5"
                      : "border-muted hover:border-muted-foreground/30"
                  }`}
                >
                  <p className={`text-lg ${f.preview} text-foreground mb-1`}>{coupleName}</p>
                  <p className="text-xs text-muted-foreground font-body">{f.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Section Toggles */}
          <div className="card-premium p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Settings2 size={18} className="text-primary" />
              <h2 className="font-serif text-lg text-chocolate">Sections du site</h2>
            </div>
            <p className="text-xs text-muted-foreground font-body">
              Activez ou désactivez les blocs de votre site de mariage
            </p>
            <div className="space-y-3">
              {[
                { key: "countdown" as keyof SectionsConfig, label: "⏳ Compte à rebours", desc: "Décompte animé jusqu'au jour J" },
                { key: "program" as keyof SectionsConfig, label: "📋 Programme avec icônes", desc: "Timeline Moments avec horaires" },
                { key: "dresscode" as keyof SectionsConfig, label: "👗 Dress Code", desc: "Indications vestimentaires pour les invités" },
                { key: "rsvp_qr" as keyof SectionsConfig, label: "📱 RSVP par QR Code", desc: "QR code de confirmation de présence" },
                { key: "photo_album" as keyof SectionsConfig, label: "📸 Album photo partagé", desc: "Section Wedshoots pour les invités" },
              ].map(item => (
                <div key={item.key} className="flex items-center justify-between py-2 border-b border-muted last:border-0">
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground font-body">{item.desc}</p>
                  </div>
                  <Switch
                    checked={sectionsConfig[item.key]}
                    onCheckedChange={() => toggleSection(item.key)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Welcome Text */}
          <div className="card-premium p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Type size={18} className="text-primary" />
              <h2 className="font-serif text-lg text-chocolate">Texte d'accueil</h2>
            </div>
            <Textarea
              placeholder="Votre présence est la preuve de votre considération envers notre union..."
              value={welcomeText}
              onChange={e => setWelcomeText(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          {/* Save */}
          <Button onClick={handleSave} className="btn-gold w-full" disabled={saving}>
            {saving ? "Enregistrement..." : "💾 Sauvegarder toutes les modifications"}
          </Button>

          {/* Preview Link */}
          <div className="text-center pb-4">
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
