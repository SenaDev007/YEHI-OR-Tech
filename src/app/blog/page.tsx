import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SectionHeader from "@/components/ui/SectionHeader";
import CTASection from "@/components/sections/CTASection";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const articles = [
  {
    title: "Pourquoi une entreprise doit avoir une présence digitale professionnelle",
    excerpt: "Découvrez comment la visibilité en ligne impacte directement la confiance de vos clients potentiels.",
    date: "15 Mai 2026",
    cat: "Stratégie",
    img: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=2670&auto=format&fit=crop"
  },
  {
    title: "Comment un site web peut renforcer la crédibilité d'une PME",
    excerpt: "Le site web est votre premier commercial. Apprenez à le rendre efficace et rassurant.",
    date: "10 Mai 2026",
    cat: "Web",
    img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop"
  },
  {
    title: "L'importance des emails professionnels pour votre image",
    excerpt: "Arrêtez d'utiliser Gmail ou Yahoo pour votre business. Voici pourquoi passer à l'email pro.",
    date: "05 Mai 2026",
    cat: "Présence",
    img: "https://images.unsplash.com/photo-1557200134-90327ee9fafa?q=80&w=2670&auto=format&fit=crop"
  }
];

export default function BlogPage() {
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
            tag="Insights"
            title="Analyses & Conseils"
            subtitle="Décryptage des tendances technologiques et stratégies digitales pour propulser votre croissance en Afrique."
          />
        </div>
      </section>

      <section className="section-padding relative overflow-hidden">
        {/* Side Label */}
        <div className="absolute top-48 left-12 hidden xl:block">
          <div className="flex items-center gap-4 text-[10px] font-mono text-gris-dark uppercase tracking-[0.4em] vertical-text h-32">
            <span>Thoughts</span>
            <div className="w-px h-full bg-gris-dark/20" />
          </div>
        </div>

        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
            {articles.map((a, i) => (
              <article key={i} className="group flex flex-col h-full glass rounded-[2.5rem] overflow-hidden hover:bg-white/[0.06] transition-all duration-700">
                <div className="aspect-[16/10] overflow-hidden relative">
                  <Image
                    src={a.img}
                    alt={a.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute top-8 left-8 px-6 py-2 glass pill bg-white text-noir-profond text-[9px] font-mono font-bold uppercase tracking-[0.3em]">
                    {a.cat}
                  </div>
                </div>

                <div className="p-10 md:p-12 flex flex-col flex-grow">
                  <div className="flex items-center gap-8 text-gris-dark text-[10px] font-mono uppercase tracking-[0.3em] mb-8">
                    <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {a.date}</span>
                    <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> 5 min read</span>
                  </div>

                  <h3 className="text-2xl text-white mb-6 uppercase tracking-tighter leading-tight group-hover:text-or transition-colors line-clamp-2">
                    {a.title}
                  </h3>
                  <p className="text-lg text-gris leading-relaxed mb-10 flex-grow line-clamp-3 opacity-80 group-hover:opacity-100 transition-opacity">
                    {a.excerpt}
                  </p>

                  <Link href="/blog/slug" className="group/link flex items-center gap-4 text-[10px] font-mono uppercase tracking-[0.4em] text-or hover:text-white transition-colors">
                    Lire la suite
                    <ArrowRight className="w-4 h-4 group-hover/link:translate-x-2 transition-transform" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
      <Footer />
    </main>
  );
}
