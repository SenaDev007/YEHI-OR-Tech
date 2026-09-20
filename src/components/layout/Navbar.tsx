"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import BrandLogo from "@/components/ui/BrandLogo";

const navLinks = [
  { name: "Accueil", href: "/" },
  { name: "Blog", href: "/blog" },
  { name: "Expertises", href: "/services" },
  { name: "Réalisations", href: "/portfolio" },
  { name: "Packs", href: "/packs" },
  { name: "À propos", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 md:px-6">
      <nav className={cn("mx-auto flex max-w-7xl items-center justify-between rounded-2xl border px-4 py-3 transition-all duration-300 md:px-5", scrolled ? "border-slate-200/80 bg-white/90 shadow-[0_12px_40px_rgba(7,27,72,.1)] backdrop-blur-xl" : "border-white/20 bg-white/85 shadow-sm backdrop-blur-lg")}>
        <BrandLogo />
        <div className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className={cn("relative py-2 text-[11px] font-semibold uppercase tracking-[.12em] transition-colors", pathname === link.href ? "text-bleu-tech" : "text-gris hover:text-bleu-tech")}>
              {link.name}
              {pathname === link.href && <span className="absolute inset-x-0 -bottom-0.5 h-0.5 rounded-full bg-or" />}
            </Link>
          ))}
        </div>
        <div className="hidden items-center gap-3 lg:flex">
          <Link href="/devis"><Button size="sm" variant="gold">Demander un devis <ArrowUpRight className="h-3.5 w-3.5" /></Button></Link>
        </div>
        <button type="button" aria-label={open ? "Fermer le menu" : "Ouvrir le menu"} aria-expanded={open} onClick={() => setOpen(!open)} className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-bleu-tech lg:hidden">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>
      {open && (
        <div className="mx-auto mt-2 max-w-7xl rounded-2xl border border-slate-200 bg-white p-6 shadow-xl lg:hidden">
          <div className="grid gap-2">
            {navLinks.map((link) => <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className={cn("rounded-xl px-4 py-3 text-lg font-semibold", pathname === link.href ? "bg-bleu-soft text-bleu-tech" : "text-noir-profond hover:bg-slate-50")}>{link.name}</Link>)}
          </div>
          <Link href="/devis" className="mt-4 block"><Button className="w-full" variant="gold">Demander un devis <ArrowUpRight className="h-4 w-4" /></Button></Link>
        </div>
      )}
    </header>
  );
}
