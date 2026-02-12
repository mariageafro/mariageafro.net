import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Navigation, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGeolocation } from "@/hooks/use-geolocation";
import { PRIORITY_CITIES, RADIUS_OPTIONS } from "@/lib/priority-cities";

const heroCategories = [
{ name: "Vidéaste", slug: "videaste" },
{ name: "Photographe", slug: "photographe" },
{ name: "DJ & Musique", slug: "dj-musique" },
{ name: "Wedding Planner", slug: "wedding-planner" },
{ name: "Animation", slug: "animation" },
{ name: "Chorégraphie / Flashmob", slug: "choregraphie-flashmob" },
{ name: "Photo Booth / Vidéo Booth", slug: "photo-booth-video-booth" },
{ name: "Vidéo Live / Diffusion en direct", slug: "video-live-diffusion" },
{ name: "Atalaku / Sebene", slug: "atalaku-sebene" },
{ name: "Gospel / Chorale", slug: "gospel-chorale" },
{ name: "Groupe musical (violon/flûte/guitare)", slug: "groupe-musical" },
{ name: "Groupe folklorique", slug: "groupe-folklorique" },
{ name: "Pasteur / Prédicateur (Église)", slug: "pasteur-predicateur" },
{ name: "Location matériel", slug: "location-materiel" },
{ name: "Sonorisation", slug: "sonorisation" },
{ name: "Lumières / Éclairage", slug: "lumieres-eclairage" },
{ name: "Décoration", slug: "decoration" },
{ name: "Traiteur", slug: "traiteur" },
{ name: "Tenues & Couture", slug: "tenues-couture" },
{ name: "Demande en mariage surprise", slug: "demande-mariage-surprise" }];


export function QuickSearchBar() {
  const navigate = useNavigate();
  const [ville, setVille] = useState("");
  const [categorie, setCategorie] = useState("");
  const [isSticky, setIsSticky] = useState(false);
  const { geo, radius, setRadius, requestLocation, disableGeo } = useGeolocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > window.innerHeight - 100);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (ville) params.set("ville", ville);
    if (categorie) params.set("category", categorie);
    if (geo.enabled) params.set("geo", "1");
    navigate(`/prestataires${params.toString() ? `?${params}` : ""}`);
  };

  return (
    <div
      className={`w-full z-40 transition-all duration-300 ${
      isSticky ?
      "fixed top-14 left-0 bg-ivory/95 backdrop-blur-md shadow-elegant border-b border-border" :
      "relative -mt-20 bg-background"}`
      }>

      
















































































    </div>);

}