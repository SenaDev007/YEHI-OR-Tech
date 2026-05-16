"use client";

import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SectionHeader from "@/components/ui/SectionHeader";
import CTASection from "@/components/sections/CTASection";
import Tag from "@/components/ui/Tag";
import { 
  Award, Lightbulb, ShieldCheck, Heart, 
  Zap, TrendingUp, Search, Handshake 
} from "lucide-react";

const values = [
  { icon: Award, title: "Excellence", desc: "La qualité n'est pas une option, c'est notre standard minimal." },
  { icon: Lightbulb, title: "Innovation", desc: "Nous explorons les frontières de l'IA pour vous offrir un avantage." },
  { icon: Search, title: "Clarté", desc: "Zéro jargon inutile. Des explications simples et des prix clairs." },
  { icon: ShieldCheck, title: "Fiabilité", desc: "Nous tenons nos délais et nos promesses, sans exception." },
  { icon: Heart, title: "Éthique", desc: "Une approche honnête et transparente dans toutes nos relations." },
  { icon: Zap, title: "Impact", desc: "Nous construisons des solutions qui génèrent des résultats réels." },
  { icon: Handshake, title: "Service", desc: "Un accompagnement humain et une écoute active de vos besoins." },
  { icon: TrendingUp, title: "Créativité", desc: "Penser différemment pour résoudre vos problèmes complexes." },
];

const AboutPage = () => {
  return (
    <main className="min-h-screen bg-noir-profond">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-40 pb-20 bg-noir-2 border-b border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1/3 h-full bg-or/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10 text-center">
          <SectionHeader 
            centered
            tag="À propos de YEHI OR Tech"
            title="Éclairer votre futur numérique"
            subtitle="Une entreprise technologique pensée pour structurer, automatiser et accélérer la transformation digitale des organisations en Afrique et au-delà."
          />
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-20 items-center">
            <div className="lg:w-1/2">
              <Tag>Notre Histoire</Tag>
              <h2 className="text-white mb-8">Que la lumière soit.</h2>
              <div className="space-y-6 text-lg text-gris leading-relaxed">
                <p>
                  <strong className="text-or">YEHI OR</strong> signifie <strong className="italic text-white">"Que la lumière soit"</strong> en hébreu. 
                  C'est cette philosophie qui guide chaque ligne de code que nous écrivons et chaque stratégie que nous concevons.
                </p>
                <p>
                  Basée à Parakou, au Nord du Bénin, YEHI OR Tech est née d'une vision simple : 
                  combler le fossé entre les ambitions des entrepreneurs africains et la réalité 
                  de leur présence numérique.
                </p>
                <p>
                  Nous croyons que la technologie ne doit pas être une barrière, mais un levier. 
                  En combinant notre expertise en développement avec les dernières avancées 
                  en intelligence artificielle, nous créons des outils qui n'existent pas 
                  seulement pour être beaux, mais pour être utiles.
                </p>
              </div>
            </div>
            <div className="lg:w-1/2 relative">
              <div className="aspect-square bg-noir-2 rounded-[40px] border border-white/5 p-12 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 grid-pattern opacity-20" />
                <div className="text-[12rem] font-display font-bold text-or opacity-10 select-none">YO</div>
                <div className="relative z-10 text-center">
                  <div className="text-4xl font-display text-white mb-4">Innovation Panafricaine</div>
                  <div className="text-or font-mono text-sm tracking-[0.3em]">BÉNIN — AFRIQUE</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-bleu-nuit">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white/5 p-12 rounded-[40px] border border-white/10">
              <h3 className="text-or text-2xl mb-6">Notre Mission</h3>
              <p className="text-white text-xl leading-relaxed">
                Aider les organisations à accéder à des solutions numériques professionnelles, 
                accessibles et concrètement utiles pour leur croissance quotidienne.
              </p>
            </div>
            <div className="bg-white/5 p-12 rounded-[40px] border border-white/10">
              <h3 className="text-or text-2xl mb-6">Notre Vision</h3>
              <p className="text-white text-xl leading-relaxed">
                Devenir une référence incontournable dans la transformation digitale, 
                l'IA appliquée et l'automatisation en Afrique francophone d'ici 2030.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <Tag className="justify-center">Nos Valeurs</Tag>
            <h2 className="text-white">Ce qui nous définit</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, i) => (
              <div key={i} className="group p-8 rounded-3xl bg-noir-2 border border-white/5 hover:border-or/40 transition-all duration-300">
                <div className="w-12 h-12 bg-or/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <value.icon className="w-6 h-6 text-or" />
                </div>
                <h4 className="text-white font-bold text-lg mb-3">{value.title}</h4>
                <p className="text-gris text-sm leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stack Section */}
      <section className="py-24 border-t border-white/5">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-white font-bold mb-12 uppercase text-xs tracking-[0.3em] font-mono">Notre Stack Technologique</h3>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
            {["Next.js", "React", "Node.js", "PostgreSQL", "Claude API", "n8n", "Vercel", "Git"].map(tech => (
              <span key={tech} className="text-xl font-bold text-white hover:text-or transition-colors cursor-default">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
      <Footer />
    </main>
  );
};

export default AboutPage;
