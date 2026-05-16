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
      <section className="pt-64 pb-32 relative overflow-hidden">
        {/* Background Halos */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-[-10%] right-[-5%] w-[60%] h-[60%] glow-radial animate-pulse-slow" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] glow-blue animate-pulse-slow" />
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <SectionHeader 
            centered
            tag="Qui nous sommes"
            title="Éclairer votre futur numérique"
            subtitle="Une agence de production digitale augmentée par l'intelligence artificielle, dédiée à structurer et accélérer la transformation des organisations."
          />
        </div>
      </section>

      {/* Story Section */}
      <section className="section-padding relative overflow-hidden">
        {/* Side Label */}
        <div className="absolute top-48 left-12 hidden xl:block">
          <div className="flex items-center gap-4 text-[10px] font-mono text-gris-dark uppercase tracking-[0.4em] vertical-text h-32">
            <span>Our story</span>
            <div className="w-px h-full bg-gris-dark/20" />
          </div>
        </div>

        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-32 items-center">
            <div className="lg:w-1/2">
              <Tag>Génèse</Tag>
              <h2 className="text-white mt-8 mb-12 uppercase leading-[0.9]">Que la <br /><span className="text-gradient-or italic">lumière</span> soit.</h2>
              <div className="space-y-12 text-xl md:text-2xl text-gris leading-snug">
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
                  en intelligence artificielle.
                </p>
              </div>
            </div>
            <div className="lg:w-1/2 relative">
              <div className="aspect-square glass rounded-[3rem] p-12 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 glow-radial opacity-10 scale-150" />
                <div className="text-[20vw] font-display font-bold text-or opacity-5 select-none absolute">YO</div>
                <div className="relative z-10 text-center">
                  <div className="text-5xl font-display text-white mb-6 uppercase tracking-tighter">Innovation <br />Panafricaine</div>
                  <div className="text-or font-mono text-xs tracking-[0.4em] uppercase">BÉNIN — AFRIQUE</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding bg-noir-2/30 relative overflow-hidden">
        {/* Side Label */}
        <div className="absolute top-48 right-12 hidden xl:block">
          <div className="flex items-center gap-4 text-[10px] font-mono text-gris-dark uppercase tracking-[0.4em] vertical-text h-32">
            <span>Our values</span>
            <div className="w-px h-full bg-gris-dark/20" />
          </div>
        </div>

        <div className="container mx-auto px-6">
          <div className="max-w-4xl mb-32">
            <Tag>Philosophy</Tag>
            <h2 className="text-white mt-8 uppercase leading-[0.9]">Ce qui nous <br /><span className="text-gradient-or italic">définit</span>.</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, i) => (
              <div key={i} className="group glass p-10 rounded-[2rem] hover:bg-white/[0.06] transition-all duration-700">
                <div className="w-16 h-16 glass pill flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-or group-hover:text-noir-profond transition-all duration-700">
                  <value.icon className="w-8 h-8" />
                </div>
                <h4 className="text-2xl text-white mb-4 uppercase tracking-tight leading-none group-hover:text-or transition-colors">{value.title}</h4>
                <p className="text-gris text-base leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stack Section */}
      <section className="py-48 border-t border-white/5 relative overflow-hidden">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-white font-bold mb-20 uppercase text-[10px] tracking-[0.4em] font-mono text-gris-dark">Stack technologique de pointe</h3>
          <div className="flex flex-wrap justify-center gap-x-16 gap-y-12 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
            {["Next.js", "React", "Node.js", "PostgreSQL", "Claude AI", "n8n", "Vercel", "Git"].map(tech => (
              <span key={tech} className="text-4xl md:text-5xl font-display font-medium text-white hover:text-or transition-colors cursor-default tracking-tighter">
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
