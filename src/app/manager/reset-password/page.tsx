"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, AlertCircle, CheckCircle2, Lock, Eye, EyeOff } from "lucide-react";
import { apiJson, ApiError } from "@/lib/api-client";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-noir-profond"><div className="animate-pulse text-or text-sm">Chargement…</div></div>}>
      <ResetContent />
    </Suspense>
  );
}

function ResetContent() {
  const router = useRouter();
  const search = useSearchParams();
  const token = search.get("token") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    if (newPassword.length < 8) {
      setError("Le mot de passe doit faire au moins 8 caractères.");
      return;
    }

    setLoading(true);

    try {
      await apiJson("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, newPassword }),
      });
      setSuccess(true);
      setTimeout(() => router.push("/manager/login"), 2500);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-noir-profond px-4">
        <div className="rounded-2xl border border-danger/30 bg-danger/5 p-8 text-center max-w-md">
          <AlertCircle className="h-10 w-10 text-danger mx-auto mb-4" />
          <h1 className="font-serif text-xl font-bold text-blanc-creme mb-2">Lien invalide</h1>
          <p className="text-sm text-gris-light mb-4">Ce lien de réinitialisation est invalide. Demande un nouveau lien.</p>
          <Link href="/manager/forgot-password" className="btn-primary btn-shimmer">Demander un nouveau lien</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden bg-noir-profond px-4 py-12">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/4 h-[400px] w-[400px] -translate-x-1/2 rounded-full halo-or opacity-60" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md"
      >
        <div className="relative bg-noir-2/80 backdrop-blur-xl border border-or/20 p-8 md:p-10 rounded-2xl shadow-gold-glow">
          <div className="flex justify-center mb-6">
            <div className="relative w-16 h-16 rounded-full overflow-hidden border border-or/30 bg-white logo-light-beam shadow-md flex items-center justify-center p-1">
              <Image src="/icon-192.png" alt="YEHI OR Tech" width={56} height={56} className="object-contain rounded-full" priority />
            </div>
          </div>

          {success ? (
            <div className="flex flex-col items-center gap-4 text-center">
              <CheckCircle2 className="h-12 w-12 text-success" />
              <h1 className="font-serif text-2xl font-bold text-blanc-creme">Mot de passe réinitialisé !</h1>
              <p className="text-sm text-gris-light">Tu peux maintenant te connecter avec ton nouveau mot de passe.</p>
              <p className="text-xs text-gris">Redirection vers la page de connexion…</p>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <span className="section-tag justify-center">YEHI OR Manager</span>
                <h1 className="mt-4 font-serif text-2xl font-bold text-blanc-creme">Nouveau mot de passe</h1>
                <p className="mt-2 text-sm text-gris-light">Définis un nouveau mot de passe pour ton compte.</p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
                <label className="flex flex-col gap-2">
                  <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-gris-light flex items-center gap-2">
                    <Lock className="h-3.5 w-3.5" /> Nouveau mot de passe
                  </span>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={8}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="manager-input pr-12"
                      placeholder="••••••••"
                      autoComplete="new-password"
                    />
                    <button type="button" onClick={() => setShowPassword(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gris hover:text-or">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </label>

                <label className="flex flex-col gap-2">
                  <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-gris-light">Confirmer le mot de passe</span>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={8}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="manager-input"
                    placeholder="••••••••"
                    autoComplete="new-password"
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
                    <><Loader2 className="h-4 w-4 animate-spin" /> Réinitialisation…</>
                  ) : (
                    <><Lock className="h-4 w-4" /> Définir le nouveau mot de passe</>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </main>
  );
}
