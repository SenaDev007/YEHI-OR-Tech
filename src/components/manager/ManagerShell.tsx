"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  ShoppingBag,
  Wallet,
  Receipt,
  Package,
  PiggyBank,
  GraduationCap,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { cn } from "@/lib/utils";
import { ROLE_LABELS, type Role } from "@/lib/types";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  permission: string;
};

const NAV_ITEMS: NavItem[] = [
  { href: "/manager/dashboard", label: "Tableau de bord", icon: LayoutDashboard, permission: "dashboard.view" },
  { href: "/manager/sales", label: "Ventes", icon: ShoppingBag, permission: "sales.view" },
  { href: "/manager/cash", label: "Caisse", icon: Wallet, permission: "cash.view" },
  { href: "/manager/expenses", label: "Dépenses", icon: Receipt, permission: "expenses.view" },
  { href: "/manager/stock", label: "Stocks", icon: Package, permission: "stock.view" },
  { href: "/manager/treasury", label: "Trésorerie", icon: PiggyBank, permission: "treasury.view" },
  { href: "/manager/academia", label: "Academia", icon: GraduationCap, permission: "academia.view" },
  { href: "/manager/reports", label: "Rapports", icon: BarChart3, permission: "reports.view" },
  { href: "/manager/settings", label: "Paramètres", icon: Settings, permission: "settings.view" },
];

type CurrentUser = {
  email: string;
  name: string;
  role: Role;
};

export function ManagerShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileSidebar, setMobileSidebar] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.ok) setUser(data.user as CurrentUser);
        else router.push("/manager/login");
      })
      .catch(() => router.push("/manager/login"))
      .finally(() => setLoading(false));
  }, [router]);

  // Fermer la sidebar mobile sur navigation
  useEffect(() => {
    setMobileSidebar(false);
  }, [pathname]);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/manager/login");
    router.refresh();
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-noir-profond">
        <div className="animate-pulse text-or font-mono text-sm">Chargement…</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen flex bg-noir-profond">
      {/* ============================================================
          SIDEBAR (desktop)
          ============================================================ */}
      <aside
        className="hidden lg:flex w-64 flex-col border-r border-gris-dark/30 bg-noir-2"
        aria-label="Navigation YEHI OR Manager"
      >
        <SidebarContent user={user} pathname={pathname} onLogout={handleLogout} />
      </aside>

      {/* ============================================================
          SIDEBAR (mobile)
          ============================================================ */}
      <AnimatePresence>
        {mobileSidebar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-50 bg-noir-profond/95 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between p-6 border-b border-gris-dark/30">
              <BrandLogo variant="compact" height={36} />
              <button
                onClick={() => setMobileSidebar(false)}
                aria-label="Fermer"
                className="text-blanc-creme hover:text-or"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <SidebarContent
              user={user}
              pathname={pathname}
              onLogout={handleLogout}
              isMobile
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================================================
          MAIN
          ============================================================ */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar mobile */}
        <header className="lg:hidden flex items-center justify-between border-b border-gris-dark/30 bg-noir-2/80 backdrop-blur-xl px-4 py-3">
          <button
            onClick={() => setMobileSidebar(true)}
            aria-label="Ouvrir le menu"
            className="text-blanc-creme hover:text-or"
          >
            <Menu className="h-6 w-6" />
          </button>
          <BrandLogo variant="compact" height={28} />
          <div className="w-6" />
        </header>

        {/* Contenu */}
        <main className="flex-1 overflow-y-auto bg-noir-profond">
          <div className="container-x py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

// ============================================================
// Sidebar content
// ============================================================

function SidebarContent({
  user,
  pathname,
  onLogout,
  isMobile = false,
}: {
  user: CurrentUser;
  pathname: string;
  onLogout: () => void;
  isMobile?: boolean;
}) {
  return (
    <div className="flex-1 flex flex-col">
      {/* Logo */}
      {!isMobile && (
        <div className="border-b border-gris-dark/30 p-6">
          <Link href="/manager/dashboard" className="inline-flex">
            <BrandLogo variant="compact" height={36} />
          </Link>
        </div>
      )}

      {/* Profil utilisateur */}
      <div className="p-4 border-b border-gris-dark/30">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-or to-or-ombre flex items-center justify-center text-noir-profond font-display font-semibold text-lg">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-blanc-creme truncate">{user.name}</p>
            <p className="font-mono text-[10px] uppercase tracking-wider text-or">
              {ROLE_LABELS[user.role] || user.role}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4" aria-label="Navigation modules">
        <ul className="flex flex-col gap-1 px-3">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-300",
                    active
                      ? "bg-or/10 text-or border-l-2 border-or"
                      : "text-gris-light hover:text-blanc-creme hover:bg-noir-3"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4 transition-transform duration-300",
                      active && "scale-110"
                    )}
                    aria-hidden
                  />
                  <span>{item.label}</span>
                  {active && (
                    <ChevronRight className="h-3 w-3 ml-auto" aria-hidden />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer sidebar */}
      <div className="border-t border-gris-dark/30 p-4">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gris-light hover:text-danger hover:bg-danger/5 transition-all duration-300"
        >
          <LogOut className="h-4 w-4" aria-hidden />
          Déconnexion
        </button>
        <p className="mt-4 text-center font-mono text-[9px] uppercase tracking-widest text-gris-dark">
          © {new Date().getFullYear()} YEHI OR Tech
        </p>
      </div>
    </div>
  );
}
