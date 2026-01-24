import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { MapPin, Star, Heart, Share2, CheckCircle, Calendar, MessageCircle, Globe, Music, Camera, ChefHat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

import categoryDj from "@/assets/category-dj.jpg";
import categoryPhoto from "@/assets/category-photo.jpg";
import categoryTraiteur from "@/assets/category-traiteur.jpg";
import categoryDeco from "@/assets/category-deco.jpg";

const vendor = {
  id: 1,
  name: "DJ Kwame",
  category: "DJ & Musique",
  city: "Paris",
  country: "France",
  rating: 4.9,
  reviews: 87,
  image: categoryDj,
  culture: ["Ghana", "Nigeria", "Afrobeats"],
  description: "DJ professionnel spécialisé dans les mariages africains depuis plus de 10 ans. Passionné par la culture afro, je crée des ambiances uniques mélangeant traditions et modernité pour faire de votre célébration un moment inoubliable.",
  specialties: ["Afrobeats", "Highlife", "Coupé-décalé", "Ndombolo", "Amapiano"],
  languages: ["Français", "Anglais", "Twi"],
  experience: "10+ ans",
  priceRange: "€€€",
  responseTime: "< 24h",
};

const gallery = [categoryDj, categoryPhoto, categoryTraiteur, categoryDeco];

const reviews = [
  { id: 1, author: "Fatou & Moussa", date: "Décembre 2023", rating: 5, text: "DJ Kwame a été incroyable ! Il a parfaitement compris nos attentes et a su faire vibrer tous nos invités. Un vrai professionnel." },
  { id: 2, author: "Ama & Kofi", date: "Octobre 2023", rating: 5, text: "Notre mariage ghanéen n'aurait pas été le même sans lui. Il connaît parfaitement les traditions musicales et sait créer une ambiance unique." },
  { id: 3, author: "Adaeze & Chidi", date: "Août 2023", rating: 5, text: "Nous recommandons DJ Kwame à 100%. Professionnel, ponctuel, et surtout il a mis le feu à notre réception !" },
];

export default function ProfilPrestataire() {
  return (
    <Layout>
      {/* Hero */}
      <section className="pt-24">
        <div className="container-editorial">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Main Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative aspect-[4/3] rounded-2xl overflow-hidden"
            >
              <img src={vendor.image} alt={vendor.name} className="w-full h-full object-cover" />
              <div className="absolute top-4 right-4 flex gap-2">
                <button className="w-10 h-10 rounded-full bg-ivory/90 flex items-center justify-center hover:bg-ivory transition-colors">
                  <Heart size={18} className="text-chocolate" />
                </button>
                <button className="w-10 h-10 rounded-full bg-ivory/90 flex items-center justify-center hover:bg-ivory transition-colors">
                  <Share2 size={18} className="text-chocolate" />
                </button>
              </div>
            </motion.div>

            {/* Gallery */}
            <div className="grid grid-cols-2 gap-4">
              {gallery.slice(1).map((img, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: (index + 1) * 0.1 }}
                  className="aspect-[4/3] rounded-xl overflow-hidden"
                >
                  <img src={img} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </motion.div>
              ))}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="aspect-[4/3] rounded-xl bg-secondary flex items-center justify-center hover:bg-champagne/10 transition-colors"
              >
                <span className="font-body text-muted-foreground">Voir toutes les photos</span>
              </motion.button>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding">
        <div className="container-editorial">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="inline-block px-3 py-1 rounded-full bg-champagne/10 text-champagne-dark font-body text-sm mb-3">
                      {vendor.category}
                    </span>
                    <h1 className="font-serif text-4xl text-chocolate">{vendor.name}</h1>
                    <div className="flex items-center gap-4 mt-3 text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin size={16} />
                        <span className="font-body text-sm">{vendor.city}, {vendor.country}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star size={16} className="text-gold fill-gold" />
                        <span className="font-body text-sm font-medium text-foreground">{vendor.rating}</span>
                        <span className="font-body text-sm">({vendor.reviews} avis)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cultures */}
                <div className="flex flex-wrap gap-2 mt-6">
                  {vendor.culture.map((c) => (
                    <span key={c} className="px-3 py-1 rounded-full bg-secondary text-chocolate font-body text-sm">
                      {c}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <h2 className="font-serif text-2xl text-chocolate mb-4">Présentation</h2>
                <p className="font-body text-muted-foreground leading-relaxed">{vendor.description}</p>
              </motion.div>

              {/* Specialties */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h2 className="font-serif text-2xl text-chocolate mb-4">Spécialités musicales</h2>
                <div className="flex flex-wrap gap-3">
                  {vendor.specialties.map((s) => (
                    <span key={s} className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-champagne/10 to-gold/10 border border-champagne/20 text-chocolate font-body text-sm">
                      <Music size={14} className="text-champagne" />
                      {s}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* Reviews */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-serif text-2xl text-chocolate">Avis clients</h2>
                  <div className="flex items-center gap-2">
                    <Star size={20} className="text-gold fill-gold" />
                    <span className="font-serif text-2xl text-chocolate">{vendor.rating}</span>
                    <span className="font-body text-muted-foreground">/ 5</span>
                  </div>
                </div>
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="p-6 rounded-2xl bg-secondary">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-serif text-lg text-chocolate">{review.author}</h4>
                          <p className="font-body text-xs text-muted-foreground">{review.date}</p>
                        </div>
                        <div className="flex gap-0.5">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <Star key={i} size={14} className="text-gold fill-gold" />
                          ))}
                        </div>
                      </div>
                      <p className="font-body text-muted-foreground">{review.text}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="sticky top-28 space-y-6"
              >
                {/* Contact Card */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-champagne/10 to-gold/10 border border-champagne/20">
                  <h3 className="font-serif text-xl text-chocolate mb-6">Demander un devis</h3>
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-3">
                      <CheckCircle size={18} className="text-gold" />
                      <span className="font-body text-sm">Réponse {vendor.responseTime}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar size={18} className="text-gold" />
                      <span className="font-body text-sm">Disponibilités à vérifier</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Globe size={18} className="text-gold" />
                      <span className="font-body text-sm">{vendor.languages.join(", ")}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Button variant="gold" className="w-full" size="lg">
                      <MessageCircle size={18} />
                      Contacter
                    </Button>
                    <Button variant="outline" className="w-full" size="lg">
                      Demander un devis
                    </Button>
                  </div>
                </div>

                {/* Price Range */}
                <div className="p-6 rounded-2xl bg-secondary">
                  <h4 className="font-body text-sm text-muted-foreground mb-2">Gamme de prix</h4>
                  <p className="font-serif text-2xl text-champagne">{vendor.priceRange}</p>
                  <p className="font-body text-xs text-muted-foreground mt-1">Devis personnalisé sur demande</p>
                </div>

                {/* Experience */}
                <div className="p-6 rounded-2xl bg-secondary">
                  <h4 className="font-body text-sm text-muted-foreground mb-2">Expérience</h4>
                  <p className="font-serif text-2xl text-chocolate">{vendor.experience}</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
