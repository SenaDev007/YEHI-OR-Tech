"use client";

import { usePathname } from "next/navigation";
import { ManagerShell } from "./ManagerShell";

/**
 * Wrapper client qui décide d'afficher le shell ou non
 * en fonction de la route courante.
 * - /manager/login, /manager/forgot-password, /manager/reset-password → pas de shell
 * - toutes les autres routes /manager/* → shell avec sidebar + auth
 */
export function ManagerShellOrLogin({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isShellLess =
    pathname === "/manager/login" ||
    pathname.startsWith("/manager/login/") ||
    pathname === "/manager/forgot-password" ||
    pathname.startsWith("/manager/forgot-password/") ||
    pathname === "/manager/reset-password" ||
    pathname.startsWith("/manager/reset-password/");

  if (isShellLess) {
    return <>{children}</>;
  }

  return <ManagerShell>{children}</ManagerShell>;
}
