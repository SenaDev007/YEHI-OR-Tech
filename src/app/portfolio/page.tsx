"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";
import { projects } from "@/data/portfolio";

const categories = ["Tous", "Sites Web", "Applications SaaS", "Design", "Agents IA", "Automatisation", "Crédibilité"];

export default function PortfolioPage() {
  const [active, setActive] = useState("Tous");
  const filtered = projects.filter((project) => active === "Tous" || project.category === active);
  return <main className="min-h-screen bg-slate-50"><Navbar /><PageHero eyebrow="Réalisations" title="Des expériences qui existent dans le réel." description="Quelques projets conçus pour rendre une activité plus claire, plus crédible et plus efficace." image="/images/heroes/portfolio.png" cta="Démarrer un projet" />
    <section className="site-container section-padding"><div className="flex flex-wrap gap-2 border-b border-slate-200 pb-8">{categories.map(category=><button type="button" key={category} onClick={()=>setActive(category)} className={`rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-[.12em] transition ${active===category?"bg-bleu-tech text-white":"bg-white text-gris hover:text-bleu-tech"}`}>{category}</button>)}</div><div className="mt-12 grid gap-8 md:grid-cols-2">{filtered.map((project,index)=><article key={project.id} className={`group ${index%2===1?"md:mt-16":""}`}><div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_10px_40px_rgba(7,27,72,.08)]"><div className="h-64 bg-gradient-to-br from-bleu-soft via-white to-or-pale p-8"><div className="flex h-full items-end justify-between"><div><p className="font-mono text-[10px] uppercase tracking-[.2em] text-bleu-tech">{project.category}</p><h3 className="mt-3 text-4xl text-noir-profond">{project.title}</h3></div><span className="flex h-12 w-12 items-center justify-center rounded-full bg-bleu-tech text-white"><ArrowUpRight className="h-5 w-5" /></span></div></div></div><div className="px-2 pt-6"><p className="text-base leading-7 text-gris">{project.description}</p><div className="mt-5 flex flex-wrap gap-2">{project.tech.map(tech=><span key={tech} className="rounded-full bg-bleu-soft px-3 py-1 text-[10px] font-bold uppercase tracking-[.12em] text-bleu-tech">{tech}</span>)}</div><Link href={project.link} target="_blank" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-bleu-tech hover:text-or">Voir le projet <ArrowUpRight className="h-4 w-4" /></Link></div></article>)}</div></section><Footer /></main>;
}
