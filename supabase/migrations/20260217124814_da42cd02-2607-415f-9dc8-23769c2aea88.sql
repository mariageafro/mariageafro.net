
-- Add sort_order column to sub_categories
ALTER TABLE public.sub_categories ADD COLUMN sort_order integer DEFAULT 0;

-- ============ MODE & BEAUTÉ ============
-- 👗 Tenues (1-6)
UPDATE public.sub_categories SET sort_order = 1 WHERE slug = 'createur-robes-mariee';
UPDATE public.sub_categories SET sort_order = 2 WHERE slug = 'createur-tenues-traditionnelles';
UPDATE public.sub_categories SET sort_order = 3 WHERE slug = 'styliste-sur-mesure';
UPDATE public.sub_categories SET sort_order = 4 WHERE slug = 'location-tenues-traditionnelles';
UPDATE public.sub_categories SET sort_order = 5 WHERE slug = 'vendeur-pagnes';
-- 💄 Beauté (10-15)
UPDATE public.sub_categories SET sort_order = 10 WHERE slug = 'maquilleuse-afro';
UPDATE public.sub_categories SET sort_order = 11 WHERE slug = 'coiffeuse-afro';
UPDATE public.sub_categories SET sort_order = 12 WHERE slug = 'barbier-mariage';
UPDATE public.sub_categories SET sort_order = 13 WHERE slug = 'estheticienne';
UPDATE public.sub_categories SET sort_order = 14 WHERE slug = 'prothesiste-ongulaire';

-- ============ IMAGE & SOUVENIRS ============
UPDATE public.sub_categories SET sort_order = 1 WHERE slug = 'photographe';
UPDATE public.sub_categories SET sort_order = 2 WHERE slug = 'videaste';
UPDATE public.sub_categories SET sort_order = 3 WHERE slug = 'drone';
UPDATE public.sub_categories SET sort_order = 4 WHERE slug = 'same-day-edit';
UPDATE public.sub_categories SET sort_order = 5 WHERE slug = 'createur-reels';
UPDATE public.sub_categories SET sort_order = 6 WHERE slug = 'content-creator';
UPDATE public.sub_categories SET sort_order = 7 WHERE slug = 'livre-or-video';
UPDATE public.sub_categories SET sort_order = 8 WHERE slug = 'photobooth';
UPDATE public.sub_categories SET sort_order = 9 WHERE slug = 'photobooth-360';
UPDATE public.sub_categories SET sort_order = 10 WHERE slug = 'live-streaming';

-- ============ ANIMATION & AMBIANCE ============
UPDATE public.sub_categories SET sort_order = 1 WHERE slug = 'dj-mariage';
UPDATE public.sub_categories SET sort_order = 2 WHERE slug = 'dj-afro';
UPDATE public.sub_categories SET sort_order = 3 WHERE slug = 'mc-animateur';
UPDATE public.sub_categories SET sort_order = 4 WHERE slug = 'mc-traditionnel';
UPDATE public.sub_categories SET sort_order = 5 WHERE slug = 'groupe-live';
UPDATE public.sub_categories SET sort_order = 6 WHERE slug = 'chorale-gospel';
UPDATE public.sub_categories SET sort_order = 7 WHERE slug = 'chorale-traditionnelle';
UPDATE public.sub_categories SET sort_order = 8 WHERE slug = 'percussionnistes';
UPDATE public.sub_categories SET sort_order = 9 WHERE slug = 'groupe-folklorique';
UPDATE public.sub_categories SET sort_order = 10 WHERE slug = 'griots';

-- ============ TRAITEURS & GASTRONOMIE ============
UPDATE public.sub_categories SET sort_order = 1 WHERE slug = 'traiteur-africain';
UPDATE public.sub_categories SET sort_order = 2 WHERE slug = 'traiteur-afro-fusion';
UPDATE public.sub_categories SET sort_order = 3 WHERE slug = 'wedding-cake';
UPDATE public.sub_categories SET sort_order = 4 WHERE slug = 'chef-prive-afro';
UPDATE public.sub_categories SET sort_order = 5 WHERE slug = 'bar-cocktails-afro';
UPDATE public.sub_categories SET sort_order = 6 WHERE slug = 'bar-jus-africains';
UPDATE public.sub_categories SET sort_order = 7 WHERE slug = 'stand-street-food';

-- ============ DÉCORATION & LIEUX ============
UPDATE public.sub_categories SET sort_order = 1 WHERE slug = 'decorateur';
UPDATE public.sub_categories SET sort_order = 2 WHERE slug = 'fleuriste';
UPDATE public.sub_categories SET sort_order = 3 WHERE slug = 'location-mobilier';
UPDATE public.sub_categories SET sort_order = 4 WHERE slug = 'salle-reception';
UPDATE public.sub_categories SET sort_order = 5 WHERE slug = 'domaine-chateau';
UPDATE public.sub_categories SET sort_order = 6 WHERE slug = 'lumiere-son';

-- ============ CÉRÉMONIES & COUTUMES ============
UPDATE public.sub_categories SET sort_order = 1 WHERE slug = 'wedding-planner';
UPDATE public.sub_categories SET sort_order = 2 WHERE slug = 'coordinateur-jour-j';
UPDATE public.sub_categories SET sort_order = 3 WHERE slug = 'maitre-ceremonie';
UPDATE public.sub_categories SET sort_order = 4 WHERE slug = 'mc-traditionnel'; -- already set above, this is in animation
UPDATE public.sub_categories SET sort_order = 5 WHERE slug = 'conseiller-coutumier';
UPDATE public.sub_categories SET sort_order = 6 WHERE slug = 'coordinateur-tradition';
UPDATE public.sub_categories SET sort_order = 7 WHERE slug = 'accessoires-traditionnels';
UPDATE public.sub_categories SET sort_order = 8 WHERE slug = 'pasteur';
UPDATE public.sub_categories SET sort_order = 9 WHERE slug = 'pretre';
UPDATE public.sub_categories SET sort_order = 10 WHERE slug = 'imam';
UPDATE public.sub_categories SET sort_order = 11 WHERE slug = 'chantre';
UPDATE public.sub_categories SET sort_order = 12 WHERE slug = 'officiant-laique';
UPDATE public.sub_categories SET sort_order = 13 WHERE slug = 'redacteur-discours';
UPDATE public.sub_categories SET sort_order = 14 WHERE slug = 'coach-couple';

-- ============ LOGISTIQUE & SERVICES ============
UPDATE public.sub_categories SET sort_order = 1 WHERE slug = 'transport-mariage';
UPDATE public.sub_categories SET sort_order = 2 WHERE slug = 'hebergement-invites';
UPDATE public.sub_categories SET sort_order = 3 WHERE slug = 'agence-voyage-mariage';
UPDATE public.sub_categories SET sort_order = 4 WHERE slug = 'conciergerie-mariage';
UPDATE public.sub_categories SET sort_order = 5 WHERE slug = 'securite-evenementielle';
UPDATE public.sub_categories SET sort_order = 6 WHERE slug = 'hotesses-accueil';
UPDATE public.sub_categories SET sort_order = 7 WHERE slug = 'garde-enfants';
UPDATE public.sub_categories SET sort_order = 8 WHERE slug = 'animations-enfants';

-- ============ BIJOUX & ACCESSOIRES ============
UPDATE public.sub_categories SET sort_order = 1 WHERE slug = 'bijoutier';
UPDATE public.sub_categories SET sort_order = 2 WHERE slug = 'alliances';
UPDATE public.sub_categories SET sort_order = 3 WHERE slug = 'bijoux-traditionnels';
UPDATE public.sub_categories SET sort_order = 4 WHERE slug = 'accessoires-cheveux';
UPDATE public.sub_categories SET sort_order = 5 WHERE slug = 'chaussures';
UPDATE public.sub_categories SET sort_order = 6 WHERE slug = 'parfums';
