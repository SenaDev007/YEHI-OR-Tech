import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  cta?: string;
}

export default function PageHero({ eyebrow, title, description, image, cta = "Demander un devis" }: PageHeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-yehi-navy pb-20 pt-36 text-white md:pb-28 md:pt-44">
      <div className="hero-grid absolute inset-0 opacity-40" />
      <div className="absolute -right-40 top-8 h-96 w-96 rounded-full bg-bleu-tech/30 blur-3xl" />
      <div className="site-container relative grid items-center gap-10 lg:grid-cols-[1.1fr_.9fr]">
        <div className="reveal-up">
          <p className="eyebrow text-or-light">{eyebrow}</p>
          <h1 className="mt-6 max-w-4xl text-white">{title}</h1>
          <p className="reveal-up reveal-delay-1 mt-7 max-w-2xl text-lg leading-8 text-white/70">{description}</p>
          <Link href="/devis" className="reveal-up reveal-delay-2 mt-9 inline-block"><Button variant="gold">{cta}<ArrowRight className="h-4 w-4" /></Button></Link>
        </div>
        <div className="reveal-up reveal-delay-2 relative hidden min-h-[260px] overflow-hidden rounded-[2rem] border border-white/20 bg-white/10 lg:block">
          <Image src={image} alt="" fill className="object-cover opacity-70 mix-blend-screen transition duration-700 hover:scale-105" sizes="(max-width: 1024px) 0px, 40vw" priority />
          <div className="absolute inset-0 bg-gradient-to-tr from-yehi-navy via-transparent to-or/20" />
          <div className="absolute bottom-5 left-5 rounded-xl border border-white/15 bg-yehi-navy/70 px-4 py-3 text-[10px] font-mono uppercase tracking-[.2em] text-or-light backdrop-blur">YEHI OR / 2026</div>
        </div>
      </div>
    </section>
  );
}
