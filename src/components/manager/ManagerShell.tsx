"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Inbox,
  ShoppingBag,
  Wallet,
  Receipt,
  Package,
  PiggyBank,
  GraduationCap,
  BarChart3,
  Settings,
  Users as UsersIcon,
  LogOut,
  Menu,
  X,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ROLE_LABELS, type Role } from "@/lib/types";
import { fetchCurrentUser, logout } from "@/lib/api-client";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  permission: string;
};

const NAV_ITEMS: NavItem[] = [
  { href: "/manager/dashboard", label: "Tableau de bord", icon: LayoutDashboard, permission: "dashboard.view" },
  { href: "/manager/leads", label: "Leads", icon: Inbox, permission: "dashboard.view" },
  { href: "/manager/sales", label: "Ventes", icon: ShoppingBag, permission: "sales.view" },
  { href: "/manager/cash", label: "Caisse", icon: Wallet, permission: "cash.view" },
  { href: "/manager/expenses", label: "Dépenses", icon: Receipt, permission: "expenses.view" },
  { href: "/manager/stock", label: "Stocks", icon: Package, permission: "stock.view" },
  { href: "/manager/treasury", label: "Trésorerie", icon: PiggyBank, permission: "treasury.view" },
  { href: "/manager/academia", label: "Academia", icon: GraduationCap, permission: "academia.view" },
  { href: "/manager/reports", label: "Rapports", icon: BarChart3, permission: "reports.view" },
  { href: "/manager/users", label: "Utilisateurs", icon: UsersIcon, permission: "settings.view" },
  { href: "/manager/settings", label: "Paramètres", icon: Settings, permission: "settings.view" },
];

/**
 * Map href → endpoint API à précharger au survol.
 * Quand l'utilisateur survole un lien, on lance un fetch en arrière-plan
 * pour remplir le cache. Au clic, la page s'affiche instantanément.
 */
const NAV_API_MAP: Record<string, string> = {
  "/manager/dashboard": "/api/manager/stats",
  "/manager/leads": "/api/manager/leads",
  "/manager/sales": "/api/manager/sales",
  "/manager/cash": "/api/manager/cash",
  "/manager/expenses": "/api/manager/expenses",
  "/manager/stock": "/api/manager/stock",
  "/manager/treasury": "/api/manager/treasury",
  "/manager/academia": "/api/manager/academia",
  "/manager/reports": "/api/manager/stats",
  "/manager/users": "/api/manager/users",
  "/manager/settings": "/api/auth/me",
};

type CurrentUser = {
  email: string;
  name: string;
  role: Role;
};

/**
 * ManagerShell style Win Agro adapté palette YEHI OR Tech :
 * sidebar dark avec logo light beam (or + blue), liens avec card-shimmer au hover,
 * profil utilisateur avec avatar or, déconnexion.
 */
export function ManagerShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileSidebar, setMobileSidebar] = useState(false);

  useEffect(() => {
    // Utilise le client API centralisé :
    //  - timeout 10s (au lieu de bloquer indéfiniment)
    //  - cache 60s pour éviter de rappeler /api/auth/me à chaque navigation
    //  - en cas de 401 (token expiré), redirige vers login
    fetchCurrentUser<CurrentUser>()
      .then((u) => {
        if (u) setUser(u);
        else router.push("/manager/login");
      })
      .finally(() => setLoading(false));
  }, [router]);

  useEffect(() => { setMobileSidebar(false); }, [pathname]);

  async function handleLogout() {
    // logout() nettoie le cookie localement ET appelle le backend (best-effort)
    await logout();
    router.push("/manager/login");
    router.refresh();
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-noir-profond">
        <div className="animate-pulse text-or font-sans text-sm">Chargement…</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen flex bg-noir-profond">
      {/* Sidebar desktop */}
      <aside
        className="hidden lg:flex w-64 flex-col border-r border-or/15 bg-noir-2"
        aria-label="Navigation YEHI OR Manager"
      >
        <SidebarContent user={user} pathname={pathname} onLogout={handleLogout} />
      </aside>

      {/* Sidebar mobile */}
      <AnimatePresence>
        {mobileSidebar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-50 bg-noir-profond/95 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between p-6 border-b border-or/15">
              <Link href="/manager/dashboard" className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden border border-or/30 bg-white logo-light-beam flex items-center justify-center p-0.5">
                  <Image src="/icon-192.png" alt="YEHI OR Tech" width={36} height={36} className="object-contain rounded-full" />
                </div>
                <span className="font-serif text-base font-bold text-blanc-creme">YEHI OR Tech</span>
              </Link>
              <button onClick={() => setMobileSidebar(false)} aria-label="Fermer" className="text-blanc-creme hover:text-or">
                <X className="h-6 w-6" />
              </button>
            </div>
            <SidebarContent user={user} pathname={pathname} onLogout={handleLogout} isMobile />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar mobile */}
        <header className="lg:hidden flex items-center justify-between border-b border-or/15 bg-noir-2/80 backdrop-blur-xl px-4 py-3">
          <button
            onClick={() => setMobileSidebar(true)}
            aria-label="Ouvrir le menu"
            className="text-blanc-creme hover:text-or"
          >
            <Menu className="h-6 w-6" />
          </button>
          <Link href="/manager/dashboard" className="flex items-center gap-2">
            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-or/30 bg-white logo-light-beam flex items-center justify-center p-0.5">
              <Image src="/icon-192.png" alt="YEHI OR Tech" width={28} height={28} className="object-contain rounded-full" />
            </div>
            <span className="font-serif text-sm font-bold text-blanc-creme">YEHI OR Tech</span>
          </Link>
          <div className="w-6" />
        </header>

        {/* Contenu */}
        <main className="flex-1 overflow-y-auto bg-noir-profond">
          <div className="container-x py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}

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
        <div className="border-b border-or/15 p-6">
          <Link href="/manager/dashboard" className="inline-flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-or/30 bg-white logo-light-beam flex items-center justify-center p-0.5">
              <Image src="/icon-192.png" alt="YEHI OR Tech" width={36} height={36} className="object-contain rounded-full" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-lg font-bold leading-tight text-blanc-creme">YEHI OR Tech</span>
              <span className="text-[9px] font-sans font-bold uppercase tracking-wider text-or">Manager</span>
            </div>
          </Link>
        </div>
      )}

      {/* Profil utilisateur */}
      <div className="p-4 border-b border-or/15">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-or to-or-ombre flex items-center justify-center text-noir-profond font-serif font-bold text-lg">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-blanc-creme truncate">{user.name}</p>
            <p className="font-sans text-[10px] font-bold uppercase tracking-wider text-or">
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
                  prefetch={true /* Précharge les données au hover pour navigation instantanée */}
                  onMouseEnter={() => {
                    // Préchargement soft : déclenche un fetch en arrière-plan
                    // 1) Next.js prefetch (HTML/JS) via prefetch={true}
                    // 2) Le composant cible va faire son apiJson au mount,
                    //    qui sera servi depuis le cache 60s si l'utilisateur
                    //    finit par cliquer.
                    const apiPath = NAV_API_MAP[item.href];
                    if (apiPath) {
                      import("@/lib/api-client").then(({ apiFetch }) => {
                        apiFetch(apiPath).catch(() => {});
                      });
                    }
                  }}
                  className={cn(
                    "group flex items-center gap-3 px-3 py-2.5 rounded-full text-sm font-bold transition-all duration-300",
                    active
                      ? "bg-or/10 text-or border border-or/30"
                      : "text-gris-light hover:text-blanc-creme hover:bg-noir-3 border border-transparent"
                  )}
                >
                  <Icon className={cn("h-4 w-4 transition-transform duration-300", active && "scale-110")} aria-hidden />
                  <span>{item.label}</span>
                  {active && <ChevronRight className="h-3 w-3 ml-auto" aria-hidden />}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer sidebar */}
      <div className="border-t border-or/15 p-4">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-full text-sm font-bold text-gris-light hover:text-danger hover:bg-danger/5 transition-all duration-300"
        >
          <LogOut className="h-4 w-4" aria-hidden />
          Déconnexion
        </button>
        <p className="mt-4 text-center font-sans text-[9px] font-bold uppercase tracking-widest text-gris-dark">
          © {new Date().getFullYear()} YEHI OR Tech
        </p>
      </div>
    </div>
  );
}
