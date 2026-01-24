import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Search, MapPin, Filter, Star, Heart, Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

import categoryDj from "@/assets/category-dj.jpg";
import categoryPhoto from "@/assets/category-photo.jpg";
import categoryTraiteur from "@/assets/category-traiteur.jpg";
import categoryDeco from "@/assets/category-deco.jpg";
import categoryPlanner from "@/assets/category-planner.jpg";
import categoryTenues from "@/assets/category-tenues.jpg";
import categoryBeaute from "@/assets/category-beaute.jpg";

const vendors = [
  { id: 1, name: "DJ Kwame", category: "DJ & Musique", city: "Paris", country: "France", rating: 4.9, reviews: 87, image: categoryDj, culture: "Ghana, Afrobeats" },
  { id: 2, name: "Studio Lumière Afrique", category: "Photographe", city: "Lyon", country: "France", rating: 4.8, reviews: 124, image: categoryPhoto, culture: "Multi-culturel" },
  { id: 3, name: "Saveurs d'Afrique", category: "Traiteur", city: "Marseille", country: "France", rating: 4.9, reviews: 56, image: categoryTraiteur, culture: "Sénégal, Côte d'Ivoire" },
  { id: 4, name: "Déco Royale", category: "Décoration", city: "Paris", country: "France", rating: 4.7, reviews: 43, image: categoryDeco, culture: "Nigeria, Ghana" },
  { id: 5, name: "Wedding by Ama", category: "Wedding Planner", city: "Bordeaux", country: "France", rating: 5.0, reviews: 32, image: categoryPlanner, culture: "Cameroun, Congo" },
  { id: 6, name: "Tenues Royales", category: "Tenues traditionnelles", city: "Paris", country: "France", rating: 4.8, reviews: 78, image: categoryTenues, culture: "Nigeria, Sénégal" },
  { id: 7, name: "Beauté Afro Luxe", category: "Beauté", city: "Paris", country: "France", rating: 4.9, reviews: 95, image: categoryBeaute, culture: "Multi-culturel" },
  { id: 8, name: "DJ Selassie", category: "DJ & Musique", city: "Lille", country: "France", rating: 4.6, reviews: 41, image: categoryDj, culture: "Éthiopie, Érythrée" },
];

const categories = [
  "Tous", "DJ & Musique", "Photographe", "Traiteur", "Décoration", "Wedding Planner", "Tenues traditionnelles", "Beauté"
];

const cities = ["Toutes les villes", "Paris", "Lyon", "Marseille", "Bordeaux", "Lille", "Toulouse", "Nantes"];

const cultures = ["Toutes les cultures", "Nigeria", "Sénégal", "Ghana", "Cameroun", "Congo", "Côte d'Ivoire", "Mali", "Maghreb"];

export default function Prestataires() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-12 bg-gradient-warm">
        <div className="container-editorial">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="font-serif text-chocolate mb-4">
              Nos <span className="text-gradient-gold italic">Prestataires</span>
            </h1>
            <p className="font-body text-muted-foreground">
              Découvrez les meilleurs professionnels du mariage afro, sélectionnés pour leur expertise et leur compréhension de nos cultures.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-ivory border-b border-border sticky top-20 z-40">
        <div className="container-editorial">
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
              <input
                type="text"
                placeholder="Rechercher un prestataire..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-champagne/50"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <select className="px-4 py-3 rounded-xl border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-champagne/50">
                {cities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
              <select className="px-4 py-3 rounded-xl border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-champagne/50">
                {cultures.map((culture) => (
                  <option key={culture} value={culture}>{culture}</option>
                ))}
              </select>
              <Button variant="outline" size="lg">
                <Filter size={18} />
                Plus de filtres
              </Button>
            </div>

            {/* View Toggle */}
            <div className="flex gap-1 p-1 bg-secondary rounded-lg">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-colors ${viewMode === "grid" ? "bg-background shadow-sm" : "text-muted-foreground"}`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-colors ${viewMode === "list" ? "bg-background shadow-sm" : "text-muted-foreground"}`}
              >
                <List size={20} />
              </button>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex gap-2 mt-6 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full font-body text-sm whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? "bg-champagne text-primary-foreground shadow-md"
                    : "bg-secondary text-muted-foreground hover:bg-champagne/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="section-padding bg-gradient-warm">
        <div className="container-editorial">
          <div className="flex items-center justify-between mb-8">
            <p className="font-body text-muted-foreground">
              <span className="font-medium text-foreground">{vendors.length}</span> prestataires trouvés
            </p>
            <select className="px-4 py-2 rounded-lg border border-border bg-background font-body text-sm">
              <option>Pertinence</option>
              <option>Note (décroissant)</option>
              <option>Avis (décroissant)</option>
            </select>
          </div>

          {/* Grid */}
          <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"}`}>
            {vendors.map((vendor, index) => (
              <motion.div
                key={vendor.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <Link to={`/prestataires/${vendor.id}`} className="group block card-premium">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={vendor.image}
                      alt={vendor.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-ivory/90 flex items-center justify-center hover:bg-ivory transition-colors">
                      <Heart size={18} className="text-chocolate" />
                    </button>
                    <div className="absolute bottom-4 left-4">
                      <span className="px-3 py-1 rounded-full bg-ivory/90 font-body text-xs font-medium text-chocolate">
                        {vendor.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-serif text-lg text-chocolate mb-1 group-hover:text-champagne transition-colors">
                      {vendor.name}
                    </h3>
                    <div className="flex items-center gap-2 text-muted-foreground font-body text-sm mb-3">
                      <MapPin size={14} />
                      {vendor.city}, {vendor.country}
                    </div>
                    <p className="font-body text-xs text-muted-foreground mb-3">
                      {vendor.culture}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star size={16} className="text-gold fill-gold" />
                        <span className="font-body text-sm font-medium">{vendor.rating}</span>
                        <span className="font-body text-xs text-muted-foreground">({vendor.reviews} avis)</span>
                      </div>
                      <Button variant="ghost" size="sm" className="text-champagne hover:text-champagne-dark">
                        Voir le profil
                      </Button>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center gap-2 mt-12">
            <Button variant="outline" disabled>Précédent</Button>
            <Button variant="gold">1</Button>
            <Button variant="outline">2</Button>
            <Button variant="outline">3</Button>
            <Button variant="outline">Suivant</Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
