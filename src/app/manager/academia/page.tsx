"use client";

import { useEffect, useState } from "react";
import { GraduationCap, AlertTriangle } from "lucide-react";
import { ACADEMIA_STATUS_LABELS, type AcademiaSubscriptionStatus } from "@/lib/types";

type Subscription = {
  id: string;
  schoolName: string;
  contactName: string | null;
  contactPhone: string | null;
  contactEmail: string | null;
  monthlyFee: number;
  startedAt: string;
  endsAt: string | null;
  status: string;
  notes: string | null;
  customer: { name: string } | null;
};

export default function AcademiaPage() {
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/manager/academia")
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) setSubs(d.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-center py-8 text-or font-mono text-sm animate-pulse">Chargement…</div>;
  }

  const totalMonthly = subs
    .filter((s) => s.status === "ACTIF")
    .reduce((sum, s) => sum + s.monthlyFee, 0);

  const impayes = subs.filter((s) => s.status === "IMPAYE");

  return (
    <div className="space-y-6">
      <div>
        <span className="section-tag">Academia</span>
        <h1 className="mt-3 font-display text-3xl font-medium text-blanc-creme">Abonnements & suivi</h1>
        <p className="mt-1 text-sm text-gris-light">
          Suivi des établissements abonnés à Academia.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Abonnés" value={String(subs.length)} />
        <StatCard label="Actifs" value={String(subs.filter((s) => s.status === "ACTIF").length)} />
        <StatCard label="Impayés" value={String(impayes.length)} accent={impayes.length > 0 ? "danger" : "success"} />
        <StatCard label="Revenu récurrent mensuel" value={formatFCFA(totalMonthly)} />
      </div>

      {/* Alertes impayés */}
      {impayes.length > 0 && (
        <div className="rounded-xl border border-danger/30 bg-danger/5 p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-danger" />
            <span className="font-mono text-xs uppercase tracking-widest text-danger">
              {impayes.length} abonnement(s) en impayé
            </span>
          </div>
          <ul className="text-sm text-gris-light space-y-1">
            {impayes.map((s) => (
              <li key={s.id}>• {s.schoolName} — {formatFCFA(s.monthlyFee)} / mois</li>
            ))}
          </ul>
        </div>
      )}

      {/* Liste */}
      {subs.length === 0 ? (
        <div className="rounded-xl border border-gris-dark/30 bg-noir-2 p-12 text-center">
          <GraduationCap className="h-10 w-10 text-gris mx-auto mb-4" />
          <p className="text-gris-light">Aucun abonnement enregistré.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {subs.map((sub) => (
            <div
              key={sub.id}
              className="rounded-xl border border-gris-dark/30 bg-noir-2 p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-display text-lg font-medium text-blanc-creme">
                    {sub.schoolName}
                  </h3>
                  {sub.customer && (
                    <p className="text-xs text-gris">Client : {sub.customer.name}</p>
                  )}
                </div>
                <span className={`badge-clip border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${
                  sub.status === "ACTIF" ? "border-success/30 bg-success/10 text-success" :
                  sub.status === "IMPAYE" ? "border-danger/30 bg-danger/10 text-danger" :
                  "border-gris-dark/30 bg-noir-3 text-gris"
                }`}>
                  {ACADEMIA_STATUS_LABELS[sub.status as AcademiaSubscriptionStatus] || sub.status}
                </span>
              </div>

              <p className="font-display text-2xl text-or">{formatFCFA(sub.monthlyFee)}<span className="text-gris text-sm"> / mois</span></p>

              <dl className="mt-4 space-y-1 text-xs">
                {sub.contactName && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-gris">Contact</dt>
                    <dd className="text-gris-light text-right">{sub.contactName}</dd>
                  </div>
                )}
                {sub.contactPhone && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-gris">Téléphone</dt>
                    <dd className="text-gris-light text-right">{sub.contactPhone}</dd>
                  </div>
                )}
                {sub.contactEmail && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-gris">Email</dt>
                    <dd className="text-gris-light text-right">{sub.contactEmail}</dd>
                  </div>
                )}
                <div className="flex justify-between gap-4">
                  <dt className="text-gris">Abonné depuis</dt>
                  <dd className="text-gris-light text-right">
                    {new Date(sub.startedAt).toLocaleDateString("fr-FR")}
                  </dd>
                </div>
                {sub.endsAt && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-gris">Échéance</dt>
                    <dd className="text-gris-light text-right">
                      {new Date(sub.endsAt).toLocaleDateString("fr-FR")}
                    </dd>
                  </div>
                )}
              </dl>

              {sub.notes && (
                <p className="mt-3 text-xs text-gris italic border-t border-gris-dark/30 pt-3">
                  {sub.notes}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, accent = "or" }: { label: string; value: string; accent?: "or" | "success" | "danger" }) {
  const colors = {
    or: "text-blanc-creme",
    success: "text-success",
    danger: "text-danger",
  };
  return (
    <div className="rounded-lg border border-gris-dark/30 bg-noir-2 p-4">
      <p className="font-mono text-[10px] uppercase tracking-widest text-gris">{label}</p>
      <p className={`mt-1 font-display text-xl ${colors[accent]}`}>{value}</p>
    </div>
  );
}

function formatFCFA(amount: number): string {
  return new Intl.NumberFormat("fr-FR").format(Math.round(amount)) + " FCFA";
}
