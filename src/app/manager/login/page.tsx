"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, AlertCircle, Eye, EyeOff, Network, ExternalLink } from "lucide-react";
import { login, ApiError, invalidateCache } from "@/lib/api-client";

/**
 * Page de login YEHI OR Manager — style Win Agro adapté palette YEHI OR Tech :
 * dark theme, halo or + bleu, logo light beam, carte glassmorphism dark.
 */
export default function ManagerLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-noir-profond">
          <div className="animate-pulse text-or font-sans text-sm">Chargement…</div>
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
      // Nouveau flux : appelle le backend Railway (ou Vercel API en fallback)
      // et stocke le token dans le cookie côté client.
      invalidateCache(); // nettoie le cache des anciennes sessions
      await login(email, password);
      router.push(redirect);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : err instanceof Error
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
        <div className="absolute inset-0 bg-grain opacity-30" />
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full halo-bleu opacity-40" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md"
      >
        <div className="relative bg-noir-2/80 backdrop-blur-xl border border-or/20 p-8 md:p-10 rounded-2xl shadow-gold-glow">
          {/* Logo avec light beam */}
          <div className="flex justify-center mb-6">
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-or/40 bg-white logo-light-beam shadow-lg flex items-center justify-center p-2">
              <Image src="/icon-512.png" alt="YEHI OR Tech" width={80} height={80} className="object-contain rounded-full" priority />
            </div>
          </div>

          {/* Titre */}
          <div className="text-center mb-8">
            <span className="section-tag justify-center">YEHI OR Manager</span>
            <h1 className="mt-4 font-serif text-3xl font-bold text-blanc-creme">
              Accès sécurisé
            </h1>
            <p className="mt-2 text-sm text-gris-light text-pretty">
              Plateforme interne. Connecte-toi pour accéder à l'espace de gestion.
            </p>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
            <label className="flex flex-col gap-2">
              <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-gris-light">
                Email professionnel
              </span>
              <input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="manager-input"
                placeholder="vous@exemple.com"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-gris-light">
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
                  className="border border-danger/30 bg-danger/5 rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-start gap-3">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-danger" />
                    <p className="text-sm text-danger">{error}</p>
                  </div>

                  {/* Panneau de diagnostic — affiché seulement si erreur réseau */}
                  {(error.includes("injoignable") || error.includes("Impossible")) && (
                    <div className="mt-3 pt-3 border-t border-danger/20 space-y-3 text-xs text-gris-light">
                      <p className="font-bold text-or uppercase text-[10px] tracking-wider flex items-center gap-2">
                        <Network className="h-3 w-3" /> Diagnostic (502 = Cloudflare ne joint pas Railway)
                      </p>

                      {/* Étape 1 : test backend direct */}
                      <div>
                        <p className="font-bold text-blanc-creme mb-1">1. Test backend direct</p>
                        <p>
                          Ouvre{" "}
                          <a
                            href="https://backend.yehiortech.com/api/health"
                            target="_blank"
                            rel="noreferrer"
                            className="text-or hover:underline inline-flex items-center gap-1"
                          >
                            backend.yehiortech.com/api/health
                            <ExternalLink className="h-3 w-3" />
                          </a>{" "}
                          dans un nouvel onglet
                        </p>
                        <ul className="text-[10px] text-gris pl-4 mt-1 space-y-0.5">
                          <li>✓ Si JSON <code>{`{ ok: true }`}</code> → backend OK, problème = CORS</li>
                          <li>✗ Si 502 → Cloudflare ne joint pas Railway (backend down ou mal configuré)</li>
                          <li>✗ Si 521/522/523 → backend Railway DOWN, redémarre Railway</li>
                          <li>✗ Si 525 → SSL entre Cloudflare et Railway en panne</li>
                        </ul>
                      </div>

                      {/* Étape 2 : test depuis Vercel */}
                      <div>
                        <p className="font-bold text-blanc-creme mb-1">2. Test depuis Vercel (server-side, sans CORS)</p>
                        <a
                          href="/api/test-backend"
                          target="_blank"
                          rel="noreferrer"
                          className="text-or hover:underline inline-flex items-center gap-1"
                        >
                          /api/test-backend
                          <ExternalLink className="h-3 w-3" />
                        </a>
                        <p className="text-[10px] text-gris pl-4 mt-1">
                          Si OK ici mais navigateur échoue → problème CORS côté backend
                        </p>
                      </div>

                      {/* Étape 3 : vérifier Railway */}
                      <div>
                        <p className="font-bold text-blanc-creme mb-1">3. Vérifier Railway backend</p>
                        <ul className="text-[10px] text-gris pl-4 space-y-0.5 list-disc list-inside">
                          <li>Railway dashboard → service backend → <span className="text-or">Status</span> (Running/Deploying/Crashed?)</li>
                          <li>Vérifie les <span className="text-or">logs</span> récents (erreurs démarrage?)</li>
                          <li>Si status = "Deploying" → attends 2-3 min</li>
                          <li>Si status = "Crashed" → clique <span className="text-or">Redeploy</span></li>
                          <li>Variables requises : <code className="text-or">FRONTEND_URL</code>=https://yehiortech.com, <code className="text-or">DATABASE_URL</code>, <code className="text-or">JWT_SECRET</code></li>
                        </ul>
                      </div>

                      {/* Étape 4 : vérifier Cloudflare */}
                      <div>
                        <p className="font-bold text-blanc-creme mb-1">4. Vérifier Cloudflare (si 502 persiste)</p>
                        <ul className="text-[10px] text-gris pl-4 space-y-0.5 list-disc list-inside">
                          <li>Cloudflare → DNS → backend.yehiortech.com → type CNAME → cible = xxx.up.railway.app</li>
                          <li>Cloudflare → SSL/TLS → mode <span className="text-or">"Full"</span> (PAS "Flexible" — ça casse Railway)</li>
                          <li>Test : désactive le proxy Cloudflare (gray cloud au lieu d'orange) → si ça marche → Cloudflare était le problème</li>
                          <li>Cloudflare → Caching → Purge Everything (au cas où cache corrompu)</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary btn-shimmer justify-center mt-2 disabled:cursor-not-allowed disabled:opacity-50"
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

          {/* Liens */}
          <div className="mt-8 pt-6 border-t border-gris-dark/30 flex flex-col items-center gap-3">
            <Link
              href="/manager/forgot-password"
              className="font-sans text-[10px] font-bold uppercase tracking-widest text-or hover:text-or-light transition-colors link-underline"
            >
              Mot de passe oublié ?
            </Link>
            <Link
              href="/"
              className="font-sans text-[10px] font-bold uppercase tracking-widest text-gris hover:text-or transition-colors link-underline"
            >
              ← Retour au site
            </Link>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-gris text-pretty">
          Espace réservé au personnel autorisé. Toutes les actions sont journalisées.
        </p>
      </motion.div>
    </main>
  );
}
