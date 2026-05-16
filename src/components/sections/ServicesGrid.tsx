"use client";

import React, { useEffect, useRef } from "react";
import Tag from "@/components/ui/Tag";
import ServiceCard from "@/components/ui/ServiceCard";
import { 
  Palette, Globe, Monitor, Bot, 
  Zap, TrendingUp, ShieldCheck, Compass 
} from "lucide-react";
import gsap from "@/lib/gsap";

const services = [
  {
    number: "01",
    title: "Conception Graphique",
    icon: Palette,
    description: "Flyers, affiches, cartes de visite, identité visuelle et supports de communication professionnels. Une image propre dès le premier regard.",
    tags: ["Flyers", "Cartes de visite", "Social Media", "Identité visuelle"]
  },
  {
    number: "02",
    title: "Création de Sites Web",
    icon: Globe,
    description: "Sites vitrines, sites d'entreprise, landing pages, sites pour écoles et commerces. Modernes, rapides, compatibles mobile et conçus pour convertir.",
    tags: ["Site vitrine", "Landing page", "E-commerce", "Responsive"]
  },
  {
    number: "03",
    title: "Applications Web & Mobile",
    icon: Monitor,
    description: "Plateformes SaaS, applications de gestion, tableaux de bord administratifs, outils métiers sur mesure. Des systèmes structurés pour vos besoins.",
    tags: ["SaaS", "Dashboard", "API REST", "Mobile"]
  },
  {
    number: "04",
    title: "Agents IA",
    icon: Bot,
    description: "Agents WhatsApp, Facebook, web. Support client automatisé, qualification de prospects, prise de rendez-vous. L'IA au service de votre productivité.",
    tags: ["WhatsApp Bot", "Support client", "Claude API", "Facebook"]
  },
  {
    number: "05",
    title: "Automatisation Métier",
    icon: Zap,
    description: "Workflows intelligents, relances automatiques, notifications, gestion des prospects. Si une tâche est répétitive, elle peut être automatisée.",
    tags: ["n8n", "Workflows", "Intégrations", "APIs"]
  },
  {
    number: "06",
    title: "Marketing Digital",
    icon: TrendingUp,
    description: "Gestion des réseaux sociaux, création de contenu, publicité ciblée (Facebook Ads, Google Ads), stratégie de croissance et community management.",
    tags: ["Facebook Ads", "Google Ads", "Community", "Contenu"]
  },
  {
    number: "07",
    title: "Crédibilité en Ligne",
    icon: ShieldCheck,
    description: "Emails pro, fiche Google Maps, indexation Google Search Console, inscription dans les annuaires. Votre entreprise prend son rang sur internet.",
    tags: ["Emails pro", "Google Maps", "SEO local", "Annuaires"]
  },
  {
    number: "08",
    title: "Conseil & Stratégie",
    icon: Compass,
    description: "Audit de votre présence numérique, stratégie digitale, choix des outils, structuration des processus. Nous vous guidons avec méthode.",
    tags: ["Audit digital", "Stratégie", "Formation", "Suivi"]
  }
];

const ServicesGrid = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".service-card-reveal", {
        opacity: 0,
        y: 40,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 md:py-32 bg-noir-profond relative overflow-hidden">
      <div className="container mx-auto px-6">
        
        <div className="max-w-3xl mb-20">
          <Tag>Nos Services</Tag>
          <h2 className="text-white mb-6">Ce que nous construisons pour vous</h2>
          <p className="text-lg text-gris leading-relaxed">
            Nous ne fabriquons pas seulement des outils numériques. 
            Nous créons des systèmes qui résolvent de vrais problèmes, 
            automatisent ce qui peut l'être, et donnent à votre entreprise un avantage concret.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 border border-white/5">
          {services.map((service) => (
            <div key={service.number} className="service-card-reveal h-full">
              <ServiceCard {...service} className="h-full border-none" />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ServicesGrid;
