import Link from "next/link";
import { ArrowUpRight, Mail, MapPin } from "lucide-react";
import BrandLogo from "@/components/ui/BrandLogo";
import { Button } from "@/components/ui/Button";

const links = [
  ["Accueil", "/"], ["Expertises", "/services"], ["Réalisations", "/portfolio"], ["Packs", "/packs"], ["À propos", "/about"], ["Contact", "/contact"],
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-yehi-ink text-white">
      <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-bleu-tech/20 blur-3xl" />
      <div className="absolute -bottom-48 left-1/3 h-96 w-96 rounded-full bg-or/10 blur-3xl" />
      <div className="site-container relative py-20 md:py-28">
        <div className="grid gap-14 border-b border-white/10 pb-16 lg:grid-cols-[1.3fr_.7fr_.9fr]">
          <div>
            <BrandLogo light />
            <h2 className="mt-10 max-w-xl text-4xl leading-[.98] text-white md:text-6xl">Des solutions digitales qui font avancer.</h2>
            <p className="mt-6 max-w-md text-base leading-7 text-white/60">YEHI OR Tech aide les entreprises à construire une présence crédible, automatiser leurs opérations et transformer leurs idées en outils utiles.</p>
            <Link href="/devis" className="mt-8 inline-block"><Button variant="gold">Parler de votre projet <ArrowUpRight className="h-4 w-4" /></Button></Link>
          </div>
          <div>
            <p className="eyebrow">Navigation</p>
            <div className="mt-6 grid gap-3">
              {links.map(([label, href]) => <Link key={href} href={href} className="text-sm text-white/60 transition-colors hover:text-or-light">{label}</Link>)}
            </div>
          </div>
          <div>
            <p className="eyebrow">Nous contacter</p>
            <div className="mt-6 grid gap-5">
              <a href="mailto:contact@yehiortech.com" className="flex items-start gap-3 text-sm text-white/70 hover:text-white"><Mail className="mt-0.5 h-4 w-4 text-or-light" />contact@yehiortech.com</a>
              <p className="flex items-start gap-3 text-sm text-white/70"><MapPin className="mt-0.5 h-4 w-4 text-or-light" />Parakou, Bénin · Afrique de l’Ouest</p>
              <a href="https://wa.me/22901413608" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-or-light hover:text-white">Écrire sur WhatsApp <span aria-hidden="true">↗</span></a>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-between gap-5 pt-7 text-[11px] text-white/40 md:flex-row">
          <p>© {new Date().getFullYear()} YEHI OR Tech. Tous droits réservés.</p>
          <div className="flex gap-5"><Link href="/privacy" className="hover:text-white">Confidentialité</Link><Link href="/legal" className="hover:text-white">Mentions légales</Link></div>
        </div>
      </div>
    </footer>
  );
}
