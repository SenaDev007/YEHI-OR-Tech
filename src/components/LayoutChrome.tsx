"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

/**
 * LayoutChrome — affiche Navbar + Footer + WhatsAppButton uniquement sur
 * les pages publiques. Désactivé sur /manager/* (le CRM a sa propre sidebar)
 * et en particulier sur /manager/login (page d'auth sans chrome).
 */
export function LayoutChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isManagerRoute = pathname.startsWith("/manager");

  return (
    <>
      {!isManagerRoute && <Navbar />}
      <main id="main" className="flex-1">
        {children}
      </main>
      {!isManagerRoute && <Footer />}
      {!isManagerRoute && <WhatsAppButton />}
    </>
  );
}
