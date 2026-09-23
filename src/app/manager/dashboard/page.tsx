"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Receipt,
  Package,
  GraduationCap,
  AlertTriangle,
  ArrowRight,
  PiggyBank,
} from "lucide-react";
import {
  PROFIT_CENTER_LABELS,
  type ProfitCenter,
  type Role,
} from "@/lib/types";

type DashboardData = {
  today: { revenue: number; expenses: number; net: number };
  month: { revenue: number; expenses: number; net: number };
  openCash: { id: string; openedAt: string; openingAmount: number; user: string } | null;
  pendingOrders: number;
  lowStockItems: { id: string; name: string; quantity: number; threshold: number; unit: string }[];
  academiaUpcoming: { id: string; schoolName: string; endsAt: string }[];
  academiaImpayes: number;
  salesByCenter: { profitCenter: ProfitCenter; _sum: { totalAmount: number | null }; _count: number }[];
  expensesByCategory: { category: string; _sum: { amount: number | null }; _count: number }[];
  envelopes: { id: string; name: string; balance: number; isOperational: boolean }[];
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/manager/stats")
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) setData(d.data);
        else setError(d.error || "Erreur");
      })
      .catch(() => setError("Erreur réseau"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse font-mono text-sm text-or">Chargement du tableau de bord…</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-xl border border-danger/30 bg-danger/5 p-6 text-danger">
        {error || "Erreur lors du chargement des données"}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className="section-tag">Tableau de bord</span>
        <h1 className="mt-3 font-display text-4xl font-medium text-blanc-creme">
          Bonjour 👋
        </h1>
        <p className="mt-2 text-sm text-gris-light">
          Voici l'état de l'activité aujourd'hui {new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}.
        </p>
      </motion.div>

      {/* KPIs du jour */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          icon={<TrendingUp className="h-5 w-5 text-success" />}
          label="Recettes du jour"
          value={formatFCFA(data.today.revenue)}
          accent="success"
        />
        <KpiCard
          icon={<TrendingDown className="h-5 w-5 text-danger" />}
          label="Dépenses du jour"
          value={formatFCFA(data.today.expenses)}
          accent="danger"
        />
        <KpiCard
          icon={<Wallet className="h-5 w-5 text-or" />}
          label="Résultat net du jour"
          value={formatFCFA(data.today.net)}
          accent={data.today.net >= 0 ? "or" : "danger"}
        />
        <KpiCard
          icon={<PiggyBank className="h-5 w-5 text-bleu-electrique" />}
          label="Résultat du mois"
          value={formatFCFA(data.month.net)}
          accent={data.month.net >= 0 ? "blue" : "danger"}
        />
      </div>

      {/* État caisse + alertes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Caisse */}
        <div className="rounded-xl border border-gris-dark/30 bg-noir-2 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-medium text-blanc-creme">État de la caisse</h2>
            <Link
              href="/manager/cash"
              className="font-mono text-[10px] uppercase tracking-widest text-or link-underline"
            >
              Ouvrir
            </Link>
          </div>
          {data.openCash ? (
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                <span className="font-mono text-xs uppercase tracking-wider text-success">
                  Session ouverte
                </span>
              </div>
              <p className="text-2xl font-display font-medium text-blanc-creme">
                {formatFCFA(data.openCash.openingAmount)}
              </p>
              <p className="mt-1 text-sm text-gris">
                Ouverte à {new Date(data.openCash.openedAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })} par {data.openCash.user}
              </p>
            </div>
          ) : (
            <div>
              <p className="font-mono text-xs uppercase tracking-wider text-gris mb-3">
                Aucune session ouverte
              </p>
              <Link href="/manager/cash" className="btn-primary inline-flex">
                Ouvrir la caisse
              </Link>
            </div>
          )}
        </div>

        {/* Alertes */}
        <div className="rounded-xl border border-gris-dark/30 bg-noir-2 p-6">
          <h2 className="font-display text-xl font-medium text-blanc-creme mb-4">Alertes & échéances</h2>
          <ul className="space-y-3">
            {data.pendingOrders > 0 && (
              <li className="flex items-center gap-3 text-sm text-gris-light">
                <AlertTriangle className="h-4 w-4 text-warning shrink-0" />
                <span>{data.pendingOrders} commande(s) en cours</span>
                <Link href="/manager/sales" className="ml-auto text-or text-xs link-underline">
                  Voir
                </Link>
              </li>
            )}
            {data.lowStockItems.length > 0 && (
              <li className="flex items-center gap-3 text-sm text-gris-light">
                <Package className="h-4 w-4 text-danger shrink-0" />
                <span>{data.lowStockItems.length} article(s) sous le seuil</span>
                <Link href="/manager/stock" className="ml-auto text-or text-xs link-underline">
                  Voir
                </Link>
              </li>
            )}
            {data.academiaImpayes > 0 && (
              <li className="flex items-center gap-3 text-sm text-gris-light">
                <GraduationCap className="h-4 w-4 text-danger shrink-0" />
                <span>{data.academiaImpayes} abonnement(s) Academia impayé(s)</span>
                <Link href="/manager/academia" className="ml-auto text-or text-xs link-underline">
                  Voir
                </Link>
              </li>
            )}
            {data.pendingOrders === 0 && data.lowStockItems.length === 0 && data.academiaImpayes === 0 && (
              <li className="text-sm text-gris italic">
                ✅ Aucune alerte pour le moment.
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* CA par centre de profit */}
      <div className="rounded-xl border border-gris-dark/30 bg-noir-2 p-6">
        <h2 className="font-display text-xl font-medium text-blanc-creme mb-4">
          Chiffre d'affaires du mois par centre de profit
        </h2>
        {data.salesByCenter.length === 0 ? (
          <p className="text-sm text-gris italic">Aucune vente enregistrée ce mois.</p>
        ) : (
          <ul className="space-y-3">
            {data.salesByCenter
              .sort((a, b) => (b._sum.totalAmount || 0) - (a._sum.totalAmount || 0))
              .map((item) => {
                const max = Math.max(...data.salesByCenter.map((s) => s._sum.totalAmount || 0), 1);
                const pct = ((item._sum.totalAmount || 0) / max) * 100;
                return (
                  <li key={item.profitCenter} className="flex items-center gap-4">
                    <span className="w-32 font-mono text-xs uppercase tracking-wider text-or">
                      {PROFIT_CENTER_LABELS[item.profitCenter as ProfitCenter] || item.profitCenter}
                    </span>
                    <div className="flex-1 h-2 bg-noir-3 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="h-full bg-gradient-to-r from-or to-or-light rounded-full"
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

      {/* Enveloppes de trésorerie */}
      <div className="rounded-xl border border-gris-dark/30 bg-noir-2 p-6">
        <h2 className="font-display text-xl font-medium text-blanc-creme mb-4">
          Enveloppes de trésorerie
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {data.envelopes.map((env) => (
            <div
              key={env.id}
              className="rounded-lg border border-gris-dark/30 bg-noir-3 p-4"
            >
              <p className="font-mono text-[10px] uppercase tracking-wider text-gris mb-1">
                {env.isOperational ? "⚡ Opérationnelle" : "Enveloppe"}
              </p>
              <p className="text-sm font-medium text-blanc-creme mb-2">{env.name}</p>
              <p className="font-display text-lg text-or">{formatFCFA(env.balance)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function KpiCard({
  icon,
  label,
  value,
  accent = "or",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent?: "or" | "success" | "danger" | "blue";
}) {
  const accentColors = {
    or: "border-or/20",
    success: "border-success/20",
    danger: "border-danger/20",
    blue: "border-bleu-electrique/20",
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`rounded-xl border ${accentColors[accent]} bg-noir-2 p-5`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-[10px] uppercase tracking-widest text-gris">
          {label}
        </span>
        {icon}
      </div>
      <p className="font-display text-2xl font-medium text-blanc-creme">{value}</p>
    </motion.div>
  );
}

function formatFCFA(amount: number): string {
  return new Intl.NumberFormat("fr-FR").format(Math.round(amount)) + " FCFA";
}
