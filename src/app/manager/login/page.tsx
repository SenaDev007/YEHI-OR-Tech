"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, LockKeyhole, Mail, ShieldCheck } from "lucide-react";

export default function ManagerLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setError("");
    const response = await fetch("/api/manager/login", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email, password }) });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) { setError(data.error || "Impossible de vous connecter."); setLoading(false); return; }
    window.location.href = "/manager";
  }

  return (
    <main className="min-h-screen bg-yehi-navy px-5 py-8 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[2rem] border border-white/15 bg-white shadow-2xl lg:grid-cols-[.9fr_1.1fr]">
          <section className="hidden bg-[radial-gradient(circle_at_20%_15%,rgba(244,181,27,.35),transparent_35%),linear-gradient(150deg,#0b4fd3,#071b48)] p-10 lg:block lg:p-14">
            <p className="font-mono text-xs uppercase tracking-[.28em] text-or-light">YEHI OR TECH · MANAGER</p>
            <h1 className="mt-20 text-5xl leading-[.95] text-white">Piloter la lumière derrière les opérations.</h1>
            <p className="mt-7 max-w-sm text-base leading-7 text-white/70">Caisse, clients, prestations, trésorerie et Academia dans un espace de travail pensé pour une entreprise réelle.</p>
            <div className="mt-16 flex items-center gap-3 text-sm text-white/75"><ShieldCheck className="h-5 w-5 text-or-light" /> Données et accès protégés</div>
          </section>
          <section className="p-7 text-noir-profond sm:p-10 lg:p-14">
            <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[.16em] text-gris hover:text-bleu-tech"><ArrowLeft className="h-4 w-4" /> Retour au site</Link>
            <div className="mt-16 max-w-md"><p className="eyebrow">Espace privé</p><h2 className="mt-5 text-noir-profond">Bienvenue dans Manager.</h2><p className="mt-4 leading-7 text-gris">Connectez-vous pour accéder à votre activité et à vos données de gestion.</p></div>
            <form onSubmit={submit} className="mt-9 grid gap-4">
              <label className="grid gap-2 text-sm font-semibold">Adresse e-mail<input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-input" placeholder="vous@yehiortech.com" /></label>
              <label className="grid gap-2 text-sm font-semibold">Mot de passe<input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-input" placeholder="Votre mot de passe" /></label>
              {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
              <button disabled={loading} className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-bleu-tech px-5 py-3.5 text-sm font-bold text-white transition hover:bg-yehi-navy disabled:opacity-60">{loading ? "Connexion…" : "Se connecter"}<ArrowRight className="h-4 w-4" /></button>
            </form>
            <div className="my-6 flex items-center gap-3 text-xs text-slate-400"><span className="h-px flex-1 bg-slate-200" />ou<span className="h-px flex-1 bg-slate-200" /></div>
            <a href="/api/manager/google" className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3.5 text-sm font-semibold text-noir-profond transition hover:border-bleu-tech hover:bg-bleu-soft"><Mail className="h-4 w-4 text-bleu-tech" /> Continuer avec Google</a>
            <p className="mt-8 flex items-start gap-2 text-xs leading-5 text-gris"><LockKeyhole className="mt-0.5 h-4 w-4 shrink-0 text-or" /> L’accès Google est limité aux adresses autorisées dans la configuration de l’entreprise.</p>
          </section>
        </div>
      </div>
    </main>
  );
}
