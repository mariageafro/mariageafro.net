import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

import categoryVideaste from "@/assets/category-videaste.jpg";
import categoryPhotographe from "@/assets/category-photographe.jpg";
import categoryDjMusique from "@/assets/category-djmusique.jpg";
import categoryWeddingPlanner from "@/assets/category-weddingplanner.jpg";
import categoryAnimation from "@/assets/category-animation.jpg";
import categoryCoiffureBeaute from "@/assets/category-coiffurebeaute.jpg";
import categoryDecoration from "@/assets/category-decoration.jpg";
import categoryTraiteur from "@/assets/category-traiteur2.jpg";
import categorySalleLieu from "@/assets/category-sallelieu.jpg";
import categoryTenuesCouture from "@/assets/category-tenuescouture.jpg";
import categoryTransport from "@/assets/category-transport.jpg";
import categoryRobes from "@/assets/category-robes.jpg";

const categoryImages: Record<string, string> = {
  "videaste": categoryVideaste,
  "photographe": categoryPhotographe,
  "dj-musique": categoryDjMusique,
  "wedding-planner": categoryWeddingPlanner,
  "animation": categoryAnimation,
  "coiffure-beaute": categoryCoiffureBeaute,
  "salle-lieu": categorySalleLieu,
  "traiteur": categoryTraiteur,
  "decoration": categoryDecoration,
  "robes-mariee": categoryRobes,
  "tenues-couture": categoryTenuesCouture,
  "transport": categoryTransport
};

const featuredSlugs = ["videaste", "photographe", "dj-musique", "wedding-planner", "animation", "coiffure-beaute"];


export function CategoriesSection() {
  const [categories, setCategories] = useState<{name: string;slug: string;count: number;featured: boolean;image: string;}[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [catRes, countRes] = await Promise.all([
      supabase.from('categories').select('id, name, slug').order('name'),
      supabase.from('prestataires').select('categorie_id').eq('statut', 'actif').not('photo_url', 'is', null).neq('photo_url', '')]
      );

      const counts: Record<string, number> = {};
      (countRes.data ?? []).forEach((p) => {
        if (p.categorie_id) counts[p.categorie_id] = (counts[p.categorie_id] || 0) + 1;
      });

      const mapped = (catRes.data ?? []).map((cat) => ({
        name: cat.name,
        slug: cat.slug,
        count: counts[cat.id] || 0,
        featured: featuredSlugs.includes(cat.slug),
        image: categoryImages[cat.slug] || categoryVideaste
      }));

      setCategories(mapped);
    };
    fetchData();
  }, []);

  return;




































































































































}