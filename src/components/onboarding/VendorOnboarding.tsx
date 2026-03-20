import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Loader2, Check, Plane, Building2, Palette, Phone, FileText, Globe2, Sparkles } from 'lucide-react';
import { CULTURAL_ORIGINS } from '@/lib/cultural-origins';
import { ZONES_DISPONIBILITE } from '@/lib/zone-disponibilite';
import { getFieldConfigForCategory, type VendorField } from '@/lib/vendor-fields-config';
import type { Tables } from '@/integrations/supabase/types';

const STEPS = [
  { key: 'identity', label: 'Identité', icon: Building2 },
  { key: 'category', label: 'Activité', icon: Palette },
  { key: 'location', label: 'Disponibilité', icon: Globe2 },
  { key: 'culture', label: 'Culture & langues', icon: Sparkles },
  { key: 'specifics', label: 'Spécialités', icon: Sparkles },
  { key: 'contact', label: 'Contact', icon: Phone },
  { key: 'description', label: 'Description', icon: FileText },
];

interface VendorOnboardingProps {
  userId: string;
  onComplete: (p: Tables<'prestataires'>) => void;
}

export function VendorOnboarding({ userId, onComplete }: VendorOnboardingProps) {
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Tables<'categories'>[]>([]);
  const [subCategories, setSubCategories] = useState<Tables<'sub_categories'>[]>([]);

  const [form, setForm] = useState({
    nom_entreprise: '',
    categorie_id: '',
    sous_categorie: '',
    pays: 'France',
    ville: '',
    zone_disponibilite: '',
    origine_culturelle: '',
    langues: ['Français'],
    telephone: '',
    whatsapp: '',
    email: '',
    instagram: '',
    site_web: '',
    description: '',
    vendor_metadata: {} as Record<string, any>,
  });

  useEffect(() => {
    supabase.from('categories').select('*').order('name').then(({ data }) => {
      if (data) setCategories(data);
    });
  }, []);

  useEffect(() => {
    if (form.categorie_id) {
      supabase.from('sub_categories').select('*').eq('category_id', form.categorie_id).order('sort_order').then(({ data }) => {
        if (data) setSubCategories(data);
      });
    } else {
      setSubCategories([]);
    }
  }, [form.categorie_id]);

  const update = (key: string, value: any) => setForm(f => ({ ...f, [key]: value }));
  const updateMeta = (key: string, value: any) => setForm(f => ({
    ...f,
    vendor_metadata: { ...f.vendor_metadata, [key]: value },
  }));

  const selectedCategorySlug = categories.find(c => c.id === form.categorie_id)?.slug;
  const fieldConfig = getFieldConfigForCategory(selectedCategorySlug ?? null);
  const hasSpecifics = fieldConfig && fieldConfig.fields.length > 0;

  const visibleSteps = STEPS.filter(s => {
    if (s.key === 'specifics' && !hasSpecifics) return false;
    return true;
  });

  const currentStepKey = visibleSteps[step]?.key;
  const progress = ((step + 1) / visibleSteps.length) * 100;

  // Profile completeness
  const completeness = (() => {
    let filled = 0;
    let total = 7;
    if (form.nom_entreprise.trim()) filled++;
    if (form.categorie_id) filled++;
    if (form.zone_disponibilite) filled++;
    if (form.origine_culturelle) filled++;
    if (form.telephone || form.whatsapp || form.email) filled++;
    if (form.description.trim().length > 20) filled++;
    if (Object.keys(form.vendor_metadata).length > 0) filled++;
    return Math.round((filled / total) * 100);
  })();

  const canNext = () => {
    switch (currentStepKey) {
      case 'identity': return form.nom_entreprise.trim().length > 0;
      case 'category': return !!form.categorie_id;
      default: return true;
    }
  };

  const handleSubmit = async () => {
    setSaving(true);
    const slug = form.nom_entreprise.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now().toString(36);

    const { data, error } = await supabase.from('prestataires').insert({
      user_id: userId,
      nom_entreprise: form.nom_entreprise,
      slug,
      categorie_id: form.categorie_id || null,
      sous_categorie: form.sous_categorie || null,
      pays: form.pays || 'France',
      ville: form.ville || null,
      zone_disponibilite: form.zone_disponibilite || null,
      origine_culturelle: form.origine_culturelle || null,
      langues: form.langues.filter(Boolean),
      description: form.description || null,
      vendor_metadata: form.vendor_metadata,
      statut: 'en_attente' as const,
    }).select().single();

    if (error) {
      toast.error(error.message);
      setSaving(false);
      return;
    }

    await supabase.from('prestataire_contacts').upsert({
      prestataire_id: data.id,
      telephone: form.telephone || null,
      whatsapp: form.whatsapp || null,
      email: form.email || null,
      instagram: form.instagram || null,
      site_web: form.site_web || null,
    }, { onConflict: 'prestataire_id' });

    toast.success('Profil créé avec succès !');
    setSaving(false);
    onComplete(data);
  };

  const next = () => {
    if (step === visibleSteps.length - 1) {
      handleSubmit();
    } else {
      setStep(s => Math.min(s + 1, visibleSteps.length - 1));
    }
  };

  const prev = () => setStep(s => Math.max(s - 1, 0));

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-body text-muted-foreground">
            Étape {step + 1} sur {visibleSteps.length}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Profil complété à</span>
            <span className={`text-xs font-semibold ${completeness >= 80 ? 'text-green-600' : completeness >= 50 ? 'text-amber-600' : 'text-muted-foreground'}`}>
              {completeness}%
            </span>
          </div>
        </div>
        <Progress value={progress} className="h-1.5" />

        {/* Step indicators */}
        <div className="flex justify-between mt-3">
          {visibleSteps.map((s, i) => {
            const Icon = s.icon;
            return (
              <button
                key={s.key}
                type="button"
                onClick={() => { if (i < step) setStep(i); }}
                disabled={i > step}
                className={`flex flex-col items-center gap-1 transition-all ${i <= step ? 'cursor-pointer' : 'cursor-default'}`}
              >
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-medium transition-all ${
                  i < step ? 'bg-champagne text-white' :
                  i === step ? 'bg-champagne/15 text-champagne border border-champagne/40' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {i < step ? <Check className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
                </div>
                <span className={`text-[10px] font-medium hidden sm:block ${
                  i === step ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {s.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-sm min-h-[340px]">
        {currentStepKey === 'identity' && (
          <StepIdentity form={form} update={update} />
        )}
        {currentStepKey === 'category' && (
          <StepCategory form={form} update={update} categories={categories} subCategories={subCategories} />
        )}
        {currentStepKey === 'location' && (
          <StepLocation form={form} update={update} />
        )}
        {currentStepKey === 'culture' && (
          <StepCulture form={form} update={update} />
        )}
        {currentStepKey === 'specifics' && fieldConfig && (
          <StepSpecifics form={form} updateMeta={updateMeta} fieldConfig={fieldConfig} />
        )}
        {currentStepKey === 'contact' && (
          <StepContact form={form} update={update} />
        )}
        {currentStepKey === 'description' && (
          <StepDescription form={form} update={update} completeness={completeness} />
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={prev} disabled={step === 0} className="gap-1.5">
          <ChevronLeft className="w-4 h-4" /> Précédent
        </Button>
        <Button onClick={next} disabled={!canNext() || saving} className="btn-gold gap-1.5">
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          {step === visibleSteps.length - 1 ? 'Créer mon profil' : 'Suivant'}
          {step < visibleSteps.length - 1 && <ChevronRight className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  );
}

/* ── Step Components ── */

function StepIdentity({ form, update }: { form: any; update: (k: string, v: any) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-serif text-xl text-foreground">Votre entreprise</h3>
        <p className="text-sm text-muted-foreground mt-1">Comment souhaitez-vous apparaître sur MariageAfro ?</p>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5">Nom d'entreprise *</label>
        <Input
          value={form.nom_entreprise}
          onChange={e => update('nom_entreprise', e.target.value)}
          placeholder="ex: Studio Lumière, DJ Kenzo, Traiteur Mama..."
          className="text-base"
          maxLength={100}
        />
        <p className="text-xs text-muted-foreground mt-1">C'est le nom qui sera affiché sur votre profil public.</p>
      </div>
    </div>
  );
}

function StepCategory({ form, update, categories, subCategories }: { form: any; update: (k: string, v: any) => void; categories: Tables<'categories'>[]; subCategories: Tables<'sub_categories'>[] }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-serif text-xl text-foreground">Votre activité</h3>
        <p className="text-sm text-muted-foreground mt-1">Sélectionnez votre catégorie principale. Des options spécifiques à votre métier apparaîtront ensuite.</p>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5">Catégorie *</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {categories.map(c => (
            <button
              key={c.id}
              type="button"
              onClick={() => { update('categorie_id', c.id); update('sous_categorie', ''); }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all border text-left ${
                form.categorie_id === c.id
                  ? 'bg-champagne/10 border-champagne/30 text-foreground shadow-sm ring-1 ring-champagne/20'
                  : 'bg-background border-border text-muted-foreground hover:border-champagne/20 hover:bg-champagne/5'
              }`}
            >
              {c.icon && <span className="text-lg">{c.icon}</span>}
              <span>{c.name}</span>
            </button>
          ))}
        </div>
      </div>
      {subCategories.length > 0 && (
        <div>
          <label className="block text-sm font-medium mb-1.5">Sous-catégorie (optionnel)</label>
          <Select value={form.sous_categorie} onValueChange={v => update('sous_categorie', v)}>
            <SelectTrigger><SelectValue placeholder="Précisez votre spécialité..." /></SelectTrigger>
            <SelectContent>
              {subCategories.map(s => <SelectItem key={s.id} value={s.slug}>{s.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}

function StepLocation({ form, update }: { form: any; update: (k: string, v: any) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-serif text-xl text-foreground">Localisation & disponibilité</h3>
        <p className="text-sm text-muted-foreground mt-1">Où êtes-vous basé et où acceptez-vous de vous déplacer ?</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1.5">Pays de base</label>
          <Select value={form.pays} onValueChange={v => update('pays', v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="France">🇫🇷 France</SelectItem>
              <SelectItem value="Belgique">🇧🇪 Belgique</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Ville</label>
          <Input value={form.ville} onChange={e => update('ville', e.target.value)} placeholder="ex: Paris, Lyon, Bruxelles..." />
        </div>
      </div>
      <div>
        <label className="flex items-center gap-1.5 text-sm font-medium mb-2.5">
          <Plane className="h-4 w-4 text-champagne" />
          Zone de disponibilité
        </label>
        <p className="text-xs text-muted-foreground mb-2">Jusqu'où êtes-vous prêt(e) à vous déplacer ?</p>
        <div className="flex flex-wrap gap-2">
          {ZONES_DISPONIBILITE.map(z => (
            <button
              key={z.value}
              type="button"
              onClick={() => update('zone_disponibilite', form.zone_disponibilite === z.value ? '' : z.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                form.zone_disponibilite === z.value
                  ? 'bg-champagne/15 border-champagne/30 text-foreground shadow-sm'
                  : 'bg-background border-border text-muted-foreground hover:border-champagne/20 hover:bg-champagne/5'
              }`}
            >
              {z.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function StepCulture({ form, update }: { form: any; update: (k: string, v: any) => void }) {
  const [showAll, setShowAll] = useState(false);
  const visibleOrigins = showAll ? CULTURAL_ORIGINS : CULTURAL_ORIGINS.slice(0, 8);

  const COMMON_LANGUAGES = ['Français', 'Anglais', 'Lingala', 'Wolof', 'Bambara', 'Créole', 'Portugais', 'Espagnol', 'Arabe'];

  const toggleLang = (lang: string) => {
    const current: string[] = form.langues;
    if (current.includes(lang)) {
      update('langues', current.filter((l: string) => l !== lang));
    } else {
      update('langues', [...current, lang]);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-serif text-xl text-foreground">Culture & langues</h3>
        <p className="text-sm text-muted-foreground mt-1">Quelle origine culturelle représentez-vous principalement ? Cela aide les couples à vous trouver.</p>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Origine & culture</label>
        <div className="flex flex-wrap gap-1.5">
          {visibleOrigins.map(o => (
            <button
              key={o.label}
              type="button"
              onClick={() => update('origine_culturelle', form.origine_culturelle === o.filter[0] ? '' : o.filter[0])}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                o.filter.includes(form.origine_culturelle)
                  ? 'bg-champagne/15 border-champagne/30 text-foreground'
                  : 'bg-background border-border text-muted-foreground hover:border-champagne/20'
              }`}
            >
              {o.flag} {o.label}
            </button>
          ))}
          {!showAll && (
            <button type="button" onClick={() => setShowAll(true)} className="px-3 py-1.5 rounded-full text-xs text-champagne hover:underline">
              Voir tout
            </button>
          )}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Langues parlées</label>
        <div className="flex flex-wrap gap-1.5">
          {COMMON_LANGUAGES.map(lang => (
            <button
              key={lang}
              type="button"
              onClick={() => toggleLang(lang)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                form.langues.includes(lang)
                  ? 'bg-champagne/15 border-champagne/30 text-foreground'
                  : 'bg-background border-border text-muted-foreground hover:border-champagne/20'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function StepSpecifics({ form, updateMeta, fieldConfig }: { form: any; updateMeta: (k: string, v: any) => void; fieldConfig: { label: string; fields: VendorField[] } }) {
  const meta = form.vendor_metadata;
  const groups = [...new Set(fieldConfig.fields.map(f => f.group ?? 'Général'))];

  const toggleChip = (key: string, value: string) => {
    const current: string[] = meta[key] ?? [];
    if (current.includes(value)) {
      updateMeta(key, current.filter((v: string) => v !== value));
    } else {
      updateMeta(key, [...current, value]);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-serif text-xl text-foreground">Vos spécialités</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Personnalisez votre profil <span className="font-medium text-foreground">{fieldConfig.label}</span>. Ces informations aident les couples à affiner leur recherche.
        </p>
      </div>
      <div className="space-y-5">
        {groups.map(group => {
          const fields = fieldConfig.fields.filter(f => (f.group ?? 'Général') === group);
          return (
            <div key={group} className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-champagne/70 border-b border-border pb-1">{group}</p>
              {fields.map(field => (
                <div key={field.key}>
                  {field.type === 'chips' && (
                    <div>
                      <label className="block text-sm font-medium mb-1.5">{field.label}</label>
                      <div className="flex flex-wrap gap-1.5">
                        {field.options?.map(opt => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => toggleChip(field.key, opt)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                              (meta[field.key] ?? []).includes(opt)
                                ? 'bg-champagne/15 border-champagne/30 text-foreground'
                                : 'bg-background border-border text-muted-foreground hover:border-champagne/20'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {field.type === 'toggle' && (
                    <label className="flex items-center gap-3 cursor-pointer group py-1">
                      <button
                        type="button"
                        onClick={() => updateMeta(field.key, !meta[field.key])}
                        className={`w-10 h-6 rounded-full transition-colors relative shrink-0 ${
                          meta[field.key] ? 'bg-champagne' : 'bg-muted'
                        }`}
                      >
                        <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                          meta[field.key] ? 'translate-x-[18px]' : 'translate-x-0.5'
                        }`} />
                      </button>
                      <span className="text-sm text-foreground group-hover:text-champagne transition-colors">{field.label}</span>
                    </label>
                  )}
                  {field.type === 'number' && (
                    <div>
                      <label className="block text-sm font-medium mb-1.5">{field.label}</label>
                      <Input
                        type="number"
                        value={meta[field.key] ?? ''}
                        onChange={e => updateMeta(field.key, e.target.value ? parseInt(e.target.value) : null)}
                        placeholder={field.placeholder}
                        className="max-w-[200px]"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StepContact({ form, update }: { form: any; update: (k: string, v: any) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-serif text-xl text-foreground">Coordonnées</h3>
        <p className="text-sm text-muted-foreground mt-1">Comment les couples peuvent-ils vous contacter ? Au moins un moyen de contact est recommandé.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1.5">Téléphone</label>
          <Input value={form.telephone} onChange={e => update('telephone', e.target.value)} placeholder="+33 6 12 34 56 78" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">WhatsApp</label>
          <Input value={form.whatsapp} onChange={e => update('whatsapp', e.target.value)} placeholder="+33 6 12 34 56 78" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Email professionnel</label>
          <Input type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="contact@votreentreprise.com" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Instagram</label>
          <Input value={form.instagram} onChange={e => update('instagram', e.target.value)} placeholder="@votrecompte" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1.5">Site web</label>
          <Input value={form.site_web} onChange={e => update('site_web', e.target.value)} placeholder="https://www.votresite.com" />
        </div>
      </div>
    </div>
  );
}

function StepDescription({ form, update, completeness }: { form: any; update: (k: string, v: any) => void; completeness: number }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-serif text-xl text-foreground">Présentez-vous</h3>
        <p className="text-sm text-muted-foreground mt-1">Décrivez votre activité, votre expérience et ce qui vous rend unique. Les profils complets sont mieux référencés.</p>
      </div>
      <Textarea
        value={form.description}
        onChange={e => update('description', e.target.value)}
        placeholder="Parlez de vous, de vos prestations, de votre parcours et de votre passion pour les mariages afro & diaspora..."
        rows={8}
        className="text-base"
        maxLength={5000}
      />
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">{form.description.length} / 5 000 caractères</p>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${completeness >= 80 ? 'bg-green-500' : completeness >= 50 ? 'bg-amber-500' : 'bg-muted-foreground'}`} />
          <span className="text-xs text-muted-foreground">
            Profil complété à {completeness}%
          </span>
        </div>
      </div>
    </div>
  );
}
