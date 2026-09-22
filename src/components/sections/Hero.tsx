"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check, MessageCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-yehi-navy pt-32 text-white md:pt-40">
      <div className="hero-grid absolute inset-0 opacity-60" />
      <div className="absolute -right-48 top-20 h-[34rem] w-[34rem] rounded-full bg-bleu-tech/30 blur-3xl" />
      <div className="absolute -left-48 bottom-0 h-[28rem] w-[28rem] rounded-full bg-or/15 blur-3xl" />
      <div className="site-container relative grid min-h-[720px] items-center gap-14 pb-24 lg:grid-cols-[1.05fr_.95fr] lg:pb-32">
        <div className="max-w-3xl">
          <p className="eyebrow text-or-light">Entreprise technologique africaine · Parakou, Bénin</p>
          <h1 className="mt-7 max-w-3xl text-white">Des idées <em className="text-gradient-or">lumineuses</em>, des solutions encore plus brillantes.</h1>
          <p className="mt-8 max-w-xl text-lg leading-8 text-white/70 md:text-xl">YEHI OR Tech relie conseil, design, développement, impression et automatisation pour transformer une idée en solution concrète — jusqu’à Academia, notre SaaS de gestion scolaire déjà en production.</p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link href="/services/academia"><Button size="lg" variant="gold">Découvrir Academia <ArrowRight className="h-4 w-4" /></Button></Link>
            <Link href="/devis"><Button size="lg" variant="outline" className="border-white/25 bg-white/5 text-white hover:bg-white hover:text-noir-profond">Parler de votre projet</Button></Link>
            <Link href="https://wa.me/2290141360803" target="_blank"><Button size="lg" variant="whatsapp"><MessageCircle className="h-4 w-4" />WhatsApp</Button></Link>
          </div>
          <div className="mt-12 grid max-w-xl grid-cols-1 gap-4 border-t border-white/15 pt-7 sm:grid-cols-3">
            {["Née à Parakou", "Services · produits · plateformes", "Academia en production"].map((item) => <div key={item} className="flex items-center gap-2 text-xs font-semibold text-white/65"><Check className="h-4 w-4 text-or-light" />{item}</div>)}
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-[520px]">
          <div className="absolute -inset-6 rounded-[3rem] border border-or/20" />
          <div className="absolute -inset-12 rounded-[4rem] bg-or/10 blur-3xl" />
          <div className="relative overflow-hidden rounded-[2rem] border border-white/25 bg-white p-8 shadow-[0_30px_100px_rgba(0,0,0,.35)] md:p-12">
            <Image src="/images/brand/logo-transparent.png" alt="YEHI OR Tech — Que la lumière soit" width={900} height={900} priority className="h-auto w-full" />
            <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4 text-[10px] font-mono uppercase tracking-[.22em] text-bleu-tech"><span>Technologie · design · impact</span><Sparkles className="h-4 w-4 text-or" /></div>
          </div>
          <div className="absolute -bottom-5 -left-5 rounded-2xl border border-white/15 bg-bleu-tech px-5 py-4 shadow-xl"><p className="text-[10px] font-mono uppercase tracking-[.2em] text-white/60">Notre promesse</p><p className="mt-1 text-sm font-semibold text-white">Idée · système · exécution</p></div>
        </div>
      </div>
      <div className="site-container border-t border-white/10 py-5 text-center text-[10px] font-mono uppercase tracking-[.3em] text-white/45">Construire · équiper · automatiser · rayonner</div>
    </section>
  );
}
