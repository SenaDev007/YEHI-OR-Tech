"use client";

import React, { useEffect, useRef } from "react";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Tag from "@/components/ui/Tag";
import ServiceCard from "@/components/ui/ServiceCard";
import gsap from "@/lib/gsap";
import { services } from "@/data/services";

export default function ServicesGrid() {
  const sectionRef = useRef<HTMLDivElement>(null);
  useEffect(() => { const ctx = gsap.context(() => { gsap.from(".service-card-reveal", { opacity: 0, y: 40, duration: .8, stagger: .08, ease: "power3.out", scrollTrigger: { trigger: sectionRef.current, start: "top 80%" } }); }, sectionRef); return () => ctx.revert(); }, []);
  return <section ref={sectionRef} className="section-padding relative overflow-hidden bg-noir-profond"><div className="absolute -right-48 top-20 h-[30rem] w-[30rem] rounded-full bg-bleu-tech/10 blur-3xl" /><div className="site-container relative"><div className="mb-20 max-w-3xl"><Tag>Nos expertises</Tag><h2 className="mt-8 text-white">Ce que nous construisons pour <span className="text-gradient-or">vous.</span></h2><p className="mt-7 max-w-2xl text-lg leading-8 text-gris">Du premier support graphique au SaaS métier, nous créons des systèmes qui donnent de la visibilité, de la crédibilité et du temps.</p></div><div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">{services.map((service, index) => { const Icon = (Icons as unknown as Record<string, LucideIcon>)[service.icon] || Icons.Sparkles; return <div key={service.slug} className="service-card-reveal h-full"><ServiceCard number={String(index + 1).padStart(2, "0")} title={service.title} description={service.shortDescription} icon={Icon} tags={service.tags.slice(0, 4)} image={service.image} className="h-full" /></div>; })}</div></div></section>;
}
