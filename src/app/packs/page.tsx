import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";
import { Button } from "@/components/ui/Button";
import PacksPricing from "@/components/sections/PacksPricing";

const offers = [
  { title: "Présence digitale", desc: "Les fondations pour inspirer confiance dès le premier contact.", items: ["Email professionnel", "Google Business", "SEO local", "Conseil de lancement"] },
  { title: "Site & acquisition", desc: "Un site clair, rapide et pensé pour transformer les visiteurs en prospects.", items: ["Site responsive", "Pages de conversion", "Analytics", "Optimisation SEO"] },
  { title: "Automatisation IA", desc: "Des agents et workflows pour réduire les tâches répétitives.", items: ["Agent WhatsApp ou web", "Qualification de prospects", "Relances automatisées", "Tableau de suivi"] },
];

export default function PacksPage() { return <main className="min-h-screen bg-slate-50"><Navbar /><PageHero eyebrow="Offres & packs" title="Une trajectoire claire pour passer au niveau supérieur." description="Choisissez un point de départ. Nous adaptons ensuite le périmètre à vos objectifs, vos délais et votre budget." image="/images/heroes/tarifs.png" /><PacksPricing /><section className="site-container section-padding"><div className="mb-12 max-w-xl"><p className="eyebrow">Trois portes d’entrée</p><h2 className="mt-5 text-noir-profond">Commencer par <span className="text-gradient-blue">le vrai besoin.</span></h2></div><div className="grid gap-6 lg:grid-cols-3">{offers.map((offer,index)=><article key={offer.title} className={`rounded-3xl p-8 ${index===1?"bg-bleu-tech text-white shadow-[0_20px_60px_rgba(11,79,211,.25)]":"border border-slate-200 bg-white"}`}><p className={`font-mono text-xs tracking-[.2em] ${index===1?"text-or-light":"text-or"}`}>0{index+1}</p><h3 className="mt-8 text-3xl">{offer.title}</h3><p className={`mt-4 leading-7 ${index===1?"text-white/70":"text-gris"}`}>{offer.desc}</p><ul className="mt-8 space-y-3">{offer.items.map(item=><li key={item} className="flex gap-3 text-sm"><Check className={`h-5 w-5 shrink-0 ${index===1?"text-or-light":"text-bleu-tech"}`} />{item}</li>)}</ul><Link href="/devis" className="mt-8 inline-flex items-center gap-2 text-sm font-bold">En parler <ArrowRight className="h-4 w-4" /></Link></article>)}</div></section><section className="bg-yehi-navy py-20 text-center text-white"><div className="site-container"><h2 className="text-white">Vous ne savez pas quel pack choisir ?</h2><p className="mx-auto mt-5 max-w-xl text-white/65">Un échange de 20 minutes suffit pour cadrer la bonne première étape.</p><Link href="/contact" className="mt-8 inline-block"><Button variant="gold">Parler à l’équipe</Button></Link></div></section><Footer /></main>; }
