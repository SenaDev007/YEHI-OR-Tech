"use client";

import React from "react";
import * as Icons from "lucide-react";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";
import { services } from "@/data/services";

export default function ServicesPage() {
  return <main className="min-h-screen bg-white"><Navbar /><PageHero eyebrow="Nos expertises" title="Construire. Automatiser. Rayonner." description="Un studio digital pour transformer une ambition en expérience claire, outil fiable et croissance mesurable." image="/images/heroes/services.png" />
    <section className="site-container section-padding">
      <div className="mb-14 max-w-2xl"><p className="eyebrow">Le bon levier au bon moment</p><h2 className="mt-5 text-noir-profond">Une équipe, <span className="text-gradient-blue">huit expertises.</span></h2><p className="mt-6 text-lg leading-8 text-gris">Nous réunissons design, technologie et intelligence artificielle pour créer des solutions adaptées aux réalités des entreprises africaines.</p></div>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">{services.map((service, index) => { const Icon = (Icons as unknown as Record<string, React.ComponentType<{className?: string}>>)[service.icon] || Icons.Sparkles; return <article key={service.slug} className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_8px_30px_rgba(7,27,72,.06)] transition duration-300 hover:-translate-y-2 hover:border-or/60 hover:shadow-[0_20px_50px_rgba(7,27,72,.12)]"><div className="relative h-40 overflow-hidden bg-bleu-soft"><div className="absolute inset-0 bg-cover bg-center opacity-55 transition duration-500 group-hover:scale-110" style={{backgroundImage:`url(${service.image})`}} /><div className="absolute inset-0 bg-gradient-to-br from-white/80 to-bleu-soft/40" /><div className="relative flex h-full items-center justify-between p-6"><span className="font-mono text-xs tracking-[.2em] text-bleu-tech">0{index + 1}</span><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-bleu-tech shadow-sm"><Icon className="h-6 w-6" /></span></div></div><div className="p-6"><h3 className="text-2xl text-noir-profond">{service.title}</h3><p className="mt-4 min-h-24 text-sm leading-6 text-gris">{service.shortDescription}</p><ul className="mt-5 space-y-2 border-t border-slate-100 pt-5">{service.deliverables.slice(0,3).map(item=><li key={item} className="flex gap-2 text-xs text-slate-600"><Check className="h-4 w-4 shrink-0 text-or" />{item}</li>)}</ul><Link href={`/contact?service=${service.slug}`} className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.14em] text-bleu-tech hover:text-or">Parlons-en <ArrowUpRight className="h-4 w-4" /></Link></div></article>})}</div>
    </section><Footer /></main>;
}

// Keep the Lucide module available to the typed icon map without runtime assumptions.
void Icons;

