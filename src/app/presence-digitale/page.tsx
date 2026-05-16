import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SectionHeader from "@/components/ui/SectionHeader";
import PacksPricing from "@/components/sections/PacksPricing";
import CTASection from "@/components/sections/CTASection";
import { AlertCircle, Mail, Search, ShieldCheck, TrendingUp } from "lucide-react";

export default function PresenceDigitalePage() {
  return (
    <main className="min-h-screen bg-noir-profond">
      <Navbar />

      {/* Hero */}
      <section className="pt-40 pb-20 bg-noir-2 border-b border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-or/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10">
          <SectionHeader
            tag="Présence & Crédibilité"
            title="Soyez visible. Soyez crédible."
            subtitle="Votre crédibilité commence avant même le premier contact. Assurez-vous que vos prospects voient une entreprise sérieuse sur le web."
          />
        </div>
      </section>

      {/* Problem & Solution */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

            {/* Problem */}
            <div>
              <h2 className="text-white mb-10">Le constat est simple</h2>
              <div className="space-y-6">
                {[
                  "Beaucoup d'entreprises existent mais ne sont pas trouvables sur Google Maps.",
                  "Utiliser une adresse Gmail pour son business réduit la confiance des clients.",
                  "L'absence d'indexation empêche vos futurs partenaires de vous découvrir.",
                  "Une identité numérique négligée est un frein direct à votre croissance."
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 p-6 bg-red-500/5 border border-red-500/10 rounded-2xl">
                    <AlertCircle className="text-red-400 w-5 h-5 shrink-0 mt-0.5" />
                    <p className="text-gris-light text-base leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Solution */}
            <div className="p-10 md:p-12 rounded-[40px] bg-noir-2 border border-or/10">
              <h2 className="text-or mb-10">La Solution YEHI OR</h2>
              <div className="space-y-8">
                {[
                  { icon: Mail, t: "Emails Professionnels", d: "Finis les @gmail.com. Place aux adresses @votre-entreprise.com." },
                  { icon: Search, t: "SEO Local & Maps", d: "Soyez visible là où vos clients vous cherchent : sur Google et Maps." },
                  { icon: ShieldCheck, t: "Sécurité DNS", d: "Protection de votre nom de domaine et limitation des spams." },
                  { icon: TrendingUp, t: "Indexation Active", d: "Déclaration de votre existence aux moteurs de recherche." }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-6">
                    <div className="w-10 h-10 bg-or/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <item.icon className="text-or w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold mb-1">{item.t}</h3>
                      <p className="text-gris text-sm leading-relaxed">{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      <PacksPricing />
      <CTASection />
      <Footer />
    </main>
  );
}
