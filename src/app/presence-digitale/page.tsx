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
      <section className="pt-64 pb-32 relative overflow-hidden">
        {/* Background Halos */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-[-10%] right-[-5%] w-[60%] h-[60%] glow-radial animate-pulse-slow" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] glow-blue animate-pulse-slow" />
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <SectionHeader
            tag="Trust"
            title="Soyez visible. Soyez crédible."
            subtitle="Votre crédibilité commence avant même le premier contact. Assurez-vous que vos prospects voient une organisation sérieuse sur le web."
          />
        </div>
      </section>

      {/* Problem & Solution */}
      <section className="section-padding relative overflow-hidden">
        {/* Side Label */}
        <div className="absolute top-48 left-12 hidden xl:block">
          <div className="flex items-center gap-4 text-[10px] font-mono text-gris-dark uppercase tracking-[0.4em] vertical-text h-32">
            <span>Identity</span>
            <div className="w-px h-full bg-gris-dark/20" />
          </div>
        </div>

        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-start">

            {/* Problem */}
            <div>
              <h2 className="text-white mt-8 mb-16 uppercase leading-[0.9]">Le constat <br /><span className="text-red-500 italic">implacable</span>.</h2>
              <div className="space-y-8">
                {[
                  "Beaucoup d'entreprises existent mais ne sont pas trouvables sur Google Maps.",
                  "Utiliser une adresse Gmail pour son business réduit la confiance des clients.",
                  "L'absence d'indexation empêche vos futurs partenaires de vous découvrir.",
                  "Une identité numérique négligée est un frein direct à votre croissance."
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-6 group">
                    <div className="w-12 h-12 glass pill flex items-center justify-center flex-shrink-0 group-hover:bg-red-500 group-hover:text-white transition-all duration-700">
                      <AlertCircle className="w-6 h-6" />
                    </div>
                    <p className="text-xl text-gris leading-tight opacity-80 group-hover:opacity-100 transition-opacity">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Solution */}
            <div className="glass p-12 md:p-16 rounded-[3rem] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 glow-radial opacity-5 group-hover:opacity-10 transition-opacity" />
              <h2 className="text-or mb-16 uppercase tracking-tighter text-4xl">La Solution <br />YEHI OR</h2>
              <div className="space-y-12">
                {[
                  { icon: Mail, t: "Emails Professionnels", d: "Finis les @gmail.com. Place aux adresses @votre-entreprise.com." },
                  { icon: Search, t: "SEO Local & Maps", d: "Soyez visible là où vos clients vous cherchent : sur Google et Maps." },
                  { icon: ShieldCheck, t: "Sécurité DNS", d: "Protection de votre nom de domaine et limitation des spams." },
                  { icon: TrendingUp, t: "Indexation Active", d: "Déclaration de votre existence aux moteurs de recherche." }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-8">
                    <div className="w-14 h-14 glass pill flex items-center justify-center flex-shrink-0 text-or group-hover:bg-or group-hover:text-noir-profond transition-all duration-700">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl text-white font-bold mb-2 uppercase tracking-tight leading-none">{item.t}</h3>
                      <p className="text-lg text-gris leading-relaxed opacity-80">{item.d}</p>
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
