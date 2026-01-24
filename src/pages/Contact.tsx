import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-warm">
        <div className="container-editorial">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="font-serif text-chocolate mb-4">
              Contactez-<span className="text-gradient-gold italic">nous</span>
            </h1>
            <p className="font-body text-muted-foreground">
              Une question, une suggestion, ou simplement envie de nous dire bonjour ? Nous sommes là pour vous.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding bg-gradient-warm">
        <div className="container-editorial">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-1 space-y-8"
            >
              <div>
                <h2 className="font-serif text-2xl text-chocolate mb-6">Restons en contact</h2>
                <p className="font-body text-muted-foreground leading-relaxed">
                  Notre équipe est disponible pour répondre à toutes vos questions. N'hésitez pas à nous contacter, nous vous répondrons dans les plus brefs délais.
                </p>
              </div>

              {/* Contact Cards */}
              <div className="space-y-4">
                <div className="p-6 rounded-2xl bg-ivory shadow-soft">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-champagne/10 flex items-center justify-center shrink-0">
                      <Mail className="text-champagne" size={22} />
                    </div>
                    <div>
                      <h4 className="font-serif text-lg text-chocolate mb-1">Email</h4>
                      <a href="mailto:contact@mariageafro.com" className="font-body text-sm text-muted-foreground hover:text-champagne transition-colors">
                        contact@mariageafro.com
                      </a>
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-ivory shadow-soft">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-champagne/10 flex items-center justify-center shrink-0">
                      <MapPin className="text-champagne" size={22} />
                    </div>
                    <div>
                      <h4 className="font-serif text-lg text-chocolate mb-1">Adresse</h4>
                      <p className="font-body text-sm text-muted-foreground">
                        Paris, France<br />
                        & International
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-ivory shadow-soft">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-champagne/10 flex items-center justify-center shrink-0">
                      <MessageCircle className="text-champagne" size={22} />
                    </div>
                    <div>
                      <h4 className="font-serif text-lg text-chocolate mb-1">Réseaux sociaux</h4>
                      <p className="font-body text-sm text-muted-foreground">
                        @mariageafro sur Instagram, Facebook & TikTok
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-2"
            >
              <div className="p-8 lg:p-12 rounded-3xl bg-ivory shadow-elegant">
                <h3 className="font-serif text-2xl text-chocolate mb-8">Envoyez-nous un message</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block font-body text-sm text-muted-foreground mb-2">
                        Votre nom
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-champagne/50"
                        placeholder="Prénom Nom"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-body text-sm text-muted-foreground mb-2">
                        Votre email
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-champagne/50"
                        placeholder="votre@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-body text-sm text-muted-foreground mb-2">
                      Sujet
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-champagne/50"
                      required
                    >
                      <option value="">Choisir un sujet</option>
                      <option value="general">Question générale</option>
                      <option value="vendor">Je suis prestataire</option>
                      <option value="couple">Je prépare mon mariage</option>
                      <option value="partnership">Partenariat</option>
                      <option value="press">Presse & Médias</option>
                      <option value="other">Autre</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-body text-sm text-muted-foreground mb-2">
                      Votre message
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={6}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-champagne/50 resize-none"
                      placeholder="Dites-nous tout..."
                      required
                    />
                  </div>

                  <Button type="submit" variant="gold" size="xl" className="w-full md:w-auto">
                    <Send size={18} />
                    Envoyer le message
                  </Button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
