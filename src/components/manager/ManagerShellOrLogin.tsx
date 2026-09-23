"use client";

import { usePathname } from "next/navigation";
import { ManagerShell } from "./ManagerShell";

/**
 * Wrapper client qui décide d'afficher le shell ou non
 * en fonction de la route courante.
 * - /manager/login → pas de shell (sinon boucle de loader)
 * - toutes les autres routes /manager/* → shell avec sidebar + auth
 */
export function ManagerShellOrLogin({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Page de login : rendu sans le shell
  if (pathname === "/manager/login" || pathname.startsWith("/manager/login/")) {
    return <>{children}</>;
  }

  return <ManagerShell>{children}</ManagerShell>;
}
