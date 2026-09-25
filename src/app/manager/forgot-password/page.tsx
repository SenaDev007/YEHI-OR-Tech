"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, AlertCircle, CheckCircle2, ArrowLeft, Mail } from "lucide-react";
import { apiJson, ApiError } from "@/lib/api-client";

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-noir-profond"><div className="animate-pulse text-or text-sm">Chargement…</div></div>}>
      <ForgotContent />
    </Suspense>
  );
}

function ForgotContent() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await apiJson("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden bg-noir-profond px-4 py-12">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/4 h-[400px] w-[400px] -translate-x-1/2 rounded-full halo-or opacity-60" />
        <div className="absolute inset-0 bg-grain opacity-30" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md"
      >
        <div className="relative bg-noir-2/80 backdrop-blur-xl border border-or/20 p-8 md:p-10 rounded-2xl shadow-gold-glow">
          <div className="flex justify-center mb-6">
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-or/40 bg-white logo-light-beam shadow-lg flex items-center justify-center p-2">
              <Image src="/icon-512.png" alt="YEHI OR Tech" width={80} height={80} className="object-contain rounded-full" priority />
            </div>
          </div>

          {success ? (
            <div className="flex flex-col items-center gap-4 text-center">
              <CheckCircle2 className="h-12 w-12 text-success" />
              <h1 className="font-serif text-2xl font-bold text-blanc-creme">Email envoyé</h1>
              <p className="text-sm text-gris-light text-pretty">
                Si un compte existe avec l'email <span className="text-or font-bold">{email}</span>, tu recevras un lien de réinitialisation. Vérifie ta boîte de réception et tes spams.
              </p>
              <button onClick={() => router.push("/manager/login")} className="btn-primary btn-shimmer mt-4">
                <ArrowLeft className="h-4 w-4" /> Retour à la connexion
              </button>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <span className="section-tag justify-center">YEHI OR Manager</span>
                <h1 className="mt-4 font-serif text-2xl font-bold text-blanc-creme">Mot de passe oublié</h1>
                <p className="mt-2 text-sm text-gris-light text-pretty">
                  Saisis ton email professionnel. Tu recevras un lien pour réinitialiser ton mot de passe.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
                <label className="flex flex-col gap-2">
                  <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-gris-light flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5" /> Email professionnel
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

                <AnimatePresence>
                  {error && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-start gap-3 border border-danger/30 bg-danger/5 rounded-lg p-4">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-danger" />
                      <p className="text-sm text-danger">{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button type="submit" disabled={loading} className="btn-primary btn-shimmer justify-center disabled:opacity-50">
                  {loading ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Envoi en cours…</>
                  ) : (
                    "Envoyer le lien de réinitialisation"
                  )}
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-gris-dark/30 text-center">
                <Link href="/manager/login" className="font-sans text-[10px] font-bold uppercase tracking-widest text-gris hover:text-or transition-colors link-underline">
                  ← Retour à la connexion
                </Link>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </main>
  );
}
