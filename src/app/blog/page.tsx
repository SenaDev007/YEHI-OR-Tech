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
      <section className="pt-40 pb-20 bg-noir-2 border-b border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-or/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10">
          <SectionHeader
            tag="Blog"
            title="Analyses & Conseils"
            subtitle="Analyses, conseils et actualités pour vous aider à naviguer dans l'écosystème numérique africain."
          />
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {articles.map((a, i) => (
              <article key={i} className="group flex flex-col h-full bg-noir-2 border border-white/5 rounded-3xl overflow-hidden hover:border-or/30 transition-all duration-500">
                <div className="aspect-[16/10] overflow-hidden relative">
                  <Image
                    src={a.img}
                    alt={a.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-6 left-6 px-4 py-1.5 bg-or text-noir-profond text-[10px] font-mono font-bold rounded-full uppercase tracking-widest">
                    {a.cat}
                  </div>
                </div>

                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex items-center gap-6 text-gris text-[10px] font-mono uppercase tracking-widest mb-6">
                    <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {a.date}</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> 5 min</span>
                  </div>

                  <h3 className="text-xl text-white mb-4 group-hover:text-or transition-colors line-clamp-2">
                    {a.title}
                  </h3>
                  <p className="text-gris text-sm leading-relaxed mb-8 flex-grow line-clamp-3">
                    {a.excerpt}
                  </p>

                  <Link href="/blog/slug" className="inline-flex items-center text-or font-bold text-sm hover:gap-3 gap-2 transition-all">
                    Lire l'article
                    <ArrowRight className="w-4 h-4" />
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
