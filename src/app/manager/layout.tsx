import type { Metadata } from "next";
import { ManagerShellOrLogin } from "@/components/manager/ManagerShellOrLogin";

export const metadata: Metadata = {
  title: {
    default: "YEHI OR Manager — Espace de gestion interne",
    template: "%s · YEHI OR Manager",
  },
  description: "Plateforme de gestion interne YEHI OR Tech — sécurisée, réservée au personnel autorisé.",
  robots: {
    index: false,
    follow: false,
  },
};

/**
 * Layout pour toutes les pages /manager/*.
 * Le ManagerShell fournit la sidebar + topbar + auth check.
 * Exception : la page /manager/login n'utilise pas le shell (sinon boucle).
 */
export default function ManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ManagerShellOrLogin>{children}</ManagerShellOrLogin>;
}
