"use client";

import { useEffect, useState } from "react";
import { BarChart3, TrendingUp, TrendingDown } from "lucide-react";
import { PROFIT_CENTER_LABELS, type ProfitCenter } from "@/lib/types";
import { apiJson, ApiError } from "@/lib/api-client";

type Stats = {
  today: { revenue: number; expenses: number; net: number };
  month: { revenue: number; expenses: number; net: number };
  salesByCenter: { profitCenter: ProfitCenter; _sum: { totalAmount: number | null }; _count: number }[];
  expensesByCategory: { category: string; _sum: { amount: number | null }; _count: number }[];
  envelopes: { id: string; name: string; balance: number }[];
};

export default function ReportsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiJson<{ data: Stats }>("/api/manager/stats")
      .then((d) => setStats(d.data))
      .catch((err) => {
        setError(
          err instanceof ApiError
            ? err.message
            : "Erreur réseau — vérifie ta connexion."
        );
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-center py-8 text-or font-mono text-sm animate-pulse">Chargement…</div>;
  }

  if (error || !stats) {
    return (
      <div className="rounded-xl border border-danger/30 bg-danger/5 p-6 text-danger">
        {error || "Erreur lors du chargement des données"}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <span className="section-tag">Rapports</span>
        <h1 className="mt-3 font-display text-3xl font-medium text-blanc-creme">Tableaux de bord agrégés</h1>
        <p className="mt-1 text-sm text-gris-light">Vue consolidée de l'activité.</p>
      </div>

      {/* Synthèse */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SynthesisCard
          title="Aujourd'hui"
          revenue={stats.today.revenue}
          expenses={stats.today.expenses}
          net={stats.today.net}
        />
        <SynthesisCard
          title="Ce mois"
          revenue={stats.month.revenue}
          expenses={stats.month.expenses}
          net={stats.month.net}
          highlight
        />
      </div>

      {/* CA par centre de profit */}
      <div className="rounded-xl border border-gris-dark/30 bg-noir-2 p-6">
        <h2 className="font-display text-xl font-medium text-blanc-creme mb-4">
          Chiffre d'affaires par centre de profit (mois en cours)
        </h2>
        {stats.salesByCenter.length === 0 ? (
          <p className="text-sm text-gris italic">Aucune vente ce mois.</p>
        ) : (
          <ul className="space-y-3">
            {stats.salesByCenter
              .sort((a, b) => (b._sum.totalAmount || 0) - (a._sum.totalAmount || 0))
              .map((item) => {
                const max = Math.max(...stats.salesByCenter.map((s) => s._sum.totalAmount || 0), 1);
                const pct = ((item._sum.totalAmount || 0) / max) * 100;
                return (
                  <li key={item.profitCenter} className="flex items-center gap-4">
                    <span className="w-32 font-mono text-xs uppercase tracking-wider text-or">
                      {PROFIT_CENTER_LABELS[item.profitCenter as ProfitCenter] || item.profitCenter}
                    </span>
                    <div className="flex-1 h-2 bg-noir-3 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-or to-or-light rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-32 text-right text-sm text-blanc-creme">
                      {formatFCFA(item._sum.totalAmount || 0)}
                    </span>
                    <span className="w-16 text-right font-mono text-xs text-gris">
                      {item._count} vente(s)
                    </span>
                  </li>
                );
              })}
          </ul>
        )}
      </div>

      {/* Dépenses par catégorie */}
      <div className="rounded-xl border border-gris-dark/30 bg-noir-2 p-6">
        <h2 className="font-display text-xl font-medium text-blanc-creme mb-4">
          Dépenses par catégorie (mois en cours)
        </h2>
        {stats.expensesByCategory.length === 0 ? (
          <p className="text-sm text-gris italic">Aucune dépense ce mois.</p>
        ) : (
          <ul className="space-y-3">
            {stats.expensesByCategory
              .sort((a, b) => (b._sum.amount || 0) - (a._sum.amount || 0))
              .map((item) => {
                const max = Math.max(...stats.expensesByCategory.map((s) => s._sum.amount || 0), 1);
                const pct = ((item._sum.amount || 0) / max) * 100;
                return (
                  <li key={item.category} className="flex items-center gap-4">
                    <span className="w-32 font-mono text-xs uppercase tracking-wider text-danger">
                      {item.category}
                    </span>
                    <div className="flex-1 h-2 bg-noir-3 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-danger to-warning rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-32 text-right text-sm text-blanc-creme">
                      {formatFCFA(item._sum.amount || 0)}
                    </span>
                    <span className="w-16 text-right font-mono text-xs text-gris">
                      {item._count} occ.
                    </span>
                  </li>
                );
              })}
          </ul>
        )}
      </div>

      {/* Export */}
      <div className="rounded-xl border border-gris-dark/30 bg-noir-2 p-6 text-center">
        <BarChart3 className="h-8 w-8 text-or mx-auto mb-3" />
        <p className="text-sm text-gris-light mb-4">
          Export CSV mensuel et clôtures trimestrielles seront disponibles en V1.0.
        </p>
        <p className="font-mono text-xs text-gris-dark">
          Version actuelle : MVP V0.1 — Gestion interne minimale
        </p>
      </div>
    </div>
  );
}

function SynthesisCard({
  title,
  revenue,
  expenses,
  net,
  highlight = false,
}: {
  title: string;
  revenue: number;
  expenses: number;
  net: number;
  highlight?: boolean;
}) {
  return (
    <div className={`rounded-xl border p-5 ${highlight ? "border-or/30 bg-or/5" : "border-gris-dark/30 bg-noir-2"}`}>
      <h3 className="font-display text-xl font-medium text-blanc-creme mb-4">{title}</h3>
      <dl className="space-y-3">
        <div className="flex items-center justify-between">
          <dt className="flex items-center gap-2 text-sm text-gris-light">
            <TrendingUp className="h-4 w-4 text-success" /> Recettes
          </dt>
          <dd className="font-display text-lg text-success">{formatFCFA(revenue)}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="flex items-center gap-2 text-sm text-gris-light">
            <TrendingDown className="h-4 w-4 text-danger" /> Dépenses
          </dt>
          <dd className="font-display text-lg text-danger">{formatFCFA(expenses)}</dd>
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-gris-dark/30">
          <dt className="font-mono text-xs uppercase tracking-widest text-or">Résultat net</dt>
          <dd className={`font-display text-2xl ${net >= 0 ? "text-or" : "text-danger"}`}>
            {formatFCFA(net)}
          </dd>
        </div>
      </dl>
    </div>
  );
}

function formatFCFA(amount: number): string {
  return new Intl.NumberFormat("fr-FR").format(Math.round(amount)) + " FCFA";
}
