"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, AlertCircle, Eye, EyeOff } from "lucide-react";
import { BrandLogo } from "@/components/ui/BrandLogo";

/**
 * Page de login YEHI OR Manager.
 * Authentification par email + mot de passe, cookie HTTP-only signé.
 */
export default function ManagerLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-noir-profond">
          <div className="animate-pulse text-or font-mono text-sm">Chargement…</div>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const router = useRouter();
  const search = useSearchParams();
  const redirect = search.get("redirect") || "/manager/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Échec de connexion");
      }

      router.push(redirect);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Connexion impossible. Réessaie ou contacte l'administrateur."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden bg-noir-profond px-4 py-12">
      {/* Halos or et bleu en fond */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/4 h-[400px] w-[400px] -translate-x-1/2 rounded-full halo-or opacity-60" />
        <div className="absolute inset-0 bg-grid-gold opacity-30" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md"
      >
        <div className="corner-decor bg-noir-2/80 backdrop-blur-xl border border-or/20 p-8 md:p-10 rounded-2xl">
          <div className="flex justify-center mb-6">
            <BrandLogo variant="compact" height={48} />
          </div>

          <div className="text-center mb-8">
            <span className="section-tag justify-center">YEHI OR Manager</span>
            <h1 className="mt-4 font-display text-3xl font-medium text-blanc-creme">
              Accès sécurisé
            </h1>
            <p className="mt-2 text-sm text-gris-light text-pretty">
              Plateforme interne. Connecte-toi pour accéder à l'espace de gestion.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
            <label className="flex flex-col gap-2">
              <span className="font-mono text-[10px] uppercase tracking-widest text-gris-light">
                Email professionnel
              </span>
              <input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="manager-input"
                placeholder="admin@yehiortech.com"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="font-mono text-[10px] uppercase tracking-widest text-gris-light">
                Mot de passe
              </span>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="manager-input pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gris hover:text-or transition-colors"
                  aria-label={showPassword ? "Masquer" : "Afficher"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </label>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-start gap-3 border border-danger/30 bg-danger/5 rounded-lg p-4"
                >
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-danger" />
                  <p className="text-sm text-danger">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary justify-center mt-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Connexion…
                </>
              ) : (
                "Se connecter →"
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gris-dark/30 text-center">
            <Link
              href="/"
              className="font-mono text-[10px] uppercase tracking-widest text-gris hover:text-or transition-colors link-underline"
            >
              ← Retour au site
            </Link>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-gris text-pretty">
          🔒 Espace réservé au personnel autorisé. Toutes les actions sont journalisées.
        </p>
      </motion.div>
    </main>
  );
}
