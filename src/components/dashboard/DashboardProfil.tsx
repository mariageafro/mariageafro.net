import { useState, useEffect } from 'react';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2, Save, MapPin, Plane } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';
import { PRIORITY_CITIES } from '@/lib/priority-cities';
import { ZONES_DISPONIBILITE } from '@/lib/zone-disponibilite';

const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;

const prestataireSchema = z.object({
  nom_entreprise: z.string().trim().min(1, "Le nom d'entreprise est requis").max(100, "100 caractères max"),
  description: z.string().max(5000, "5000 caractères max").optional().or(z.literal('')),
  ville: z.string().max(100).optional().or(z.literal('')),
  pays: z.string().max(100).optional().or(z.literal('')),
  telephone: z.string().regex(phoneRegex, "Format de téléphone invalide").optional().or(z.literal('')),
  whatsapp: z.string().regex(phoneRegex, "Format WhatsApp invalide").optional().or(z.literal('')),
  site_web: z.string().url("URL invalide").optional().or(z.literal('')),
  instagram: z.string().max(100).optional().or(z.literal('')),
  origine_culturelle: z.string().max(100).optional().or(z.literal('')),
  sous_categorie: z.string().max(100).optional().or(z.literal('')),
});

interface DashboardProfilProps {
  prestataire: Tables<'prestataires'> | null;
  userId: string;
  onUpdate: (p: Tables<'prestataires'>) => void;
}

export function DashboardProfil({ prestataire, userId, onUpdate }: DashboardProfilProps) {
  const [categories, setCategories] = useState<Tables<'categories'>[]>([]);
  const [countries, setCountries] = useState<{ id: string; name: string; flag_emoji: string | null }[]>([]);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    nom_entreprise: prestataire?.nom_entreprise ?? '',
    description: prestataire?.description ?? '',
    ville: prestataire?.ville ?? '',
    pays: prestataire?.pays ?? 'France',
    country_id: prestataire?.country_id ?? '',
    telephone: '',
    whatsapp: '',
    site_web: '',
    instagram: '',
    origine_culturelle: prestataire?.origine_culturelle ?? '',
    categorie_id: prestataire?.categorie_id ?? '',
    sous_categorie: prestataire?.sous_categorie ?? '',
    langues: prestataire?.langues?.join(', ') ?? 'Français',
    lat: prestataire?.lat?.toString() ?? '',
    lng: prestataire?.lng?.toString() ?? '',
    zone_disponibilite: (prestataire as any)?.zone_disponibilite ?? '',
  });

  useEffect(() => {
    const fetchData = async () => {
      const [catRes, countryRes] = await Promise.all([
        supabase.from('categories').select('*'),
        supabase.from('countries').select('id, name, flag_emoji').order('priority', { ascending: true }),
      ]);
      if (catRes.data) setCategories(catRes.data);
      if (countryRes.data) setCountries(countryRes.data);

      // Fetch contacts from separate table
      if (prestataire) {
        const { data: contactsData } = await supabase
          .from('prestataire_contacts')
          .select('*')
          .eq('prestataire_id', prestataire.id)
          .maybeSingle();
        if (contactsData) {
          setForm(f => ({
            ...f,
            telephone: contactsData.telephone ?? '',
            whatsapp: contactsData.whatsapp ?? '',
            site_web: contactsData.site_web ?? '',
            instagram: contactsData.instagram ?? '',
          }));
        }
      }
    };
    fetchData();
  }, [prestataire]);

  const handleGeocode = async () => {
    if (!form.ville) { toast.error("Entrez une ville d'abord"); return; }
    const query = `${form.ville}, ${form.pays}`;
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`);
      const data = await res.json();
      if (data.length > 0) {
        setForm(f => ({ ...f, lat: data[0].lat, lng: data[0].lon }));
        toast.success('Coordonnées trouvées');
      } else {
        toast.error('Adresse non trouvée');
      }
    } catch {
      toast.error('Erreur de géocodage');
    }
  };

  const handleSave = async () => {
    const validation = prestataireSchema.safeParse({
      nom_entreprise: form.nom_entreprise,
      description: form.description,
      ville: form.ville,
      pays: form.pays,
      telephone: form.telephone,
      whatsapp: form.whatsapp,
      site_web: form.site_web,
      instagram: form.instagram,
      origine_culturelle: form.origine_culturelle,
      sous_categorie: form.sous_categorie,
    });
    if (!validation.success) {
      const firstError = validation.error.errors[0];
      toast.error(firstError.message);
      return;
    }
    setSaving(true);
    const slug = form.nom_entreprise.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const langues = form.langues.split(',').map(l => l.trim()).filter(Boolean);
    
    // Prestataire payload (no contact fields)
    const prestatairePayload = {
      nom_entreprise: form.nom_entreprise,
      description: form.description || null,
      ville: form.ville || null,
      pays: form.pays || null,
      country_id: form.country_id || null,
      origine_culturelle: form.origine_culturelle || null,
      categorie_id: form.categorie_id || null,
      sous_categorie: form.sous_categorie || null,
      langues,
      slug,
      lat: form.lat ? parseFloat(form.lat) : null,
      lng: form.lng ? parseFloat(form.lng) : null,
    };

    // Contacts payload
    const contactsPayload = {
      telephone: form.telephone || null,
      whatsapp: form.whatsapp || null,
      site_web: form.site_web || null,
      instagram: form.instagram || null,
    };

    if (prestataire) {
      const { data, error } = await supabase.from('prestataires').update(prestatairePayload).eq('id', prestataire.id).select().single();
      if (error) { toast.error(error.message); setSaving(false); return; }
      
      // Upsert contacts
      const { error: contactError } = await supabase
        .from('prestataire_contacts')
        .upsert({ prestataire_id: prestataire.id, ...contactsPayload }, { onConflict: 'prestataire_id' });
      if (contactError) { toast.error(contactError.message); setSaving(false); return; }
      
      toast.success('Profil mis à jour');
      onUpdate(data);
    } else {
      const { data, error } = await supabase.from('prestataires').insert({ ...prestatairePayload, user_id: userId }).select().single();
      if (error) { toast.error(error.message); setSaving(false); return; }
      
      // Insert contacts
      await supabase
        .from('prestataire_contacts')
        .upsert({ prestataire_id: data.id, ...contactsPayload }, { onConflict: 'prestataire_id' });
      
      toast.success('Profil créé');
      onUpdate(data);
    }
    setSaving(false);
  };

  const update = (key: string, value: string) => setForm(f => ({ ...f, [key]: value }));

  return (
    <Card className="card-premium max-w-3xl">
      <CardHeader>
        <CardTitle className="text-xl">Informations du profil</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nom d'entreprise *</label>
            <Input value={form.nom_entreprise} onChange={e => update('nom_entreprise', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Catégorie</label>
            <Select value={form.categorie_id} onValueChange={v => update('categorie_id', v)}>
              <SelectTrigger><SelectValue placeholder="Choisir..." /></SelectTrigger>
              <SelectContent>
                {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Sous-catégorie</label>
            <Input value={form.sous_categorie} onChange={e => update('sous_categorie', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Pays</label>
            <Select value={form.country_id} onValueChange={v => {
              update('country_id', v);
              const c = countries.find(ct => ct.id === v);
              if (c) update('pays', c.name);
            }}>
              <SelectTrigger><SelectValue placeholder="Choisir un pays..." /></SelectTrigger>
              <SelectContent>
                {countries.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.flag_emoji} {c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Ville</label>
            <div className="flex gap-2">
              <Input value={form.ville} onChange={e => update('ville', e.target.value)} className="flex-1" list="priority-cities" />
              <Button type="button" variant="outline" size="sm" onClick={handleGeocode} title="Géocoder">
                <MapPin className="h-4 w-4" />
              </Button>
            </div>
            <datalist id="priority-cities">
              {PRIORITY_CITIES.map(c => <option key={c.name} value={c.name} />)}
            </datalist>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Origine culturelle</label>
            <Input value={form.origine_culturelle} onChange={e => update('origine_culturelle', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Latitude</label>
            <Input value={form.lat} onChange={e => update('lat', e.target.value)} placeholder="Auto ou manuel" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Longitude</label>
            <Input value={form.lng} onChange={e => update('lng', e.target.value)} placeholder="Auto ou manuel" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Téléphone</label>
            <Input value={form.telephone} onChange={e => update('telephone', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">WhatsApp</label>
            <Input value={form.whatsapp} onChange={e => update('whatsapp', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Site web</label>
            <Input value={form.site_web} onChange={e => update('site_web', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Instagram</label>
            <Input value={form.instagram} onChange={e => update('instagram', e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Langues (séparées par des virgules)</label>
            <Input value={form.langues} onChange={e => update('langues', e.target.value)} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <Textarea value={form.description} onChange={e => update('description', e.target.value)} rows={5} />
        </div>

        <Button onClick={handleSave} disabled={saving} className="btn-gold">
          {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
          {prestataire ? 'Enregistrer' : 'Créer mon profil'}
        </Button>
      </CardContent>
    </Card>
  );
}
