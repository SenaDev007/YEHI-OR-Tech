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
import { apiJson, ApiError } from "@/lib/api-client";

type DashboardData = {
  today: { revenue: number; expenses: number; net: number };
  month: { revenue: number; expenses: number; net: number };
  openCash: { id: string; openedAt: string; openingAmount: number; user: string } | null;
  pendingOrders: number;
  recentLeads: {
    id: string;
    number: string;
    title: string;
    status: string;
    createdAt: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    description: string;
    price: number;
  }[];
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
    // Utilise apiJson : timeout 10s, cache 60s, retry auto, Bearer token auto.
    // Le backend Railway (ou la route Vercel en fallback) sert les données.
    apiJson<{ data: DashboardData }>("/api/manager/stats")
      .then((d) => setData(d.data))
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
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse font-sans text-sm text-or">Chargement du tableau de bord…</div>
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
        <h1 className="mt-3 font-serif text-4xl font-medium text-blanc-creme">
          Bonjour
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
            <h2 className="font-serif text-xl font-medium text-blanc-creme">État de la caisse</h2>
            <Link
              href="/manager/cash"
              className="font-sans text-[10px] uppercase tracking-widest text-or link-underline"
            >
              Ouvrir
            </Link>
          </div>
          {data.openCash ? (
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                <span className="font-sans text-xs uppercase tracking-wider text-success">
                  Session ouverte
                </span>
              </div>
              <p className="text-2xl font-serif font-medium text-blanc-creme">
                {formatFCFA(data.openCash.openingAmount)}
              </p>
              <p className="mt-1 text-sm text-gris">
                Ouverte à {new Date(data.openCash.openedAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })} par {data.openCash.user}
              </p>
            </div>
          ) : (
            <div>
              <p className="font-sans text-xs uppercase tracking-wider text-gris mb-3">
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
          <h2 className="font-serif text-xl font-medium text-blanc-creme mb-4">Alertes & échéances</h2>
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
                Aucune alerte pour le moment.
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Nouveaux leads reçus */}
      {data.recentLeads && data.recentLeads.length > 0 && (
        <div className="rounded-xl border border-or/20 bg-noir-2 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xl font-bold text-blanc-creme">
              Nouveaux leads reçus
            </h2>
            <span className="rounded-full bg-or/15 px-3 py-1 font-sans text-[10px] font-bold uppercase tracking-widest text-or">
              {data.recentLeads.length} nouveau(x)
            </span>
          </div>
          <ul className="space-y-3">
            {data.recentLeads.map((lead) => (
              <li key={lead.id} className="rounded-xl border border-gris-dark/30 bg-noir-3 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-sans text-xs font-bold text-or">{lead.number}</span>
                      <span className="rounded-full bg-success/10 border border-success/30 px-2 py-0.5 font-sans text-[9px] font-bold uppercase tracking-wider text-success">
                        Nouveau
                      </span>
                    </div>
                    <p className="font-serif text-base font-bold text-blanc-creme">{lead.title}</p>
                    <p className="mt-1 text-xs text-gris-light line-clamp-2 text-pretty">{lead.description}</p>
                    <div className="mt-2 flex items-center gap-4 text-xs text-gris">
                      <span>{lead.customerName}</span>
                      <span>·</span>
                      <span>{lead.customerEmail}</span>
                      {lead.customerPhone && (
                        <>
                          <span>·</span>
                          <span>{lead.customerPhone}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <span className="font-sans text-[10px] text-gris whitespace-nowrap">
                    {new Date(lead.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* CA par centre de profit */}
      <div className="rounded-xl border border-gris-dark/30 bg-noir-2 p-6">
        <h2 className="font-serif text-xl font-medium text-blanc-creme mb-4">
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
                    <span className="w-32 font-sans text-xs uppercase tracking-wider text-or">
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
                    <span className="w-16 text-right font-sans text-xs text-gris">
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
        <h2 className="font-serif text-xl font-medium text-blanc-creme mb-4">
          Enveloppes de trésorerie
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {data.envelopes.map((env) => (
            <div
              key={env.id}
              className="rounded-lg border border-gris-dark/30 bg-noir-3 p-4"
            >
              <p className="font-sans text-[10px] uppercase tracking-wider text-gris mb-1">
                {env.isOperational ? "Opérationnelle" : "Enveloppe"}
              </p>
              <p className="text-sm font-medium text-blanc-creme mb-2">{env.name}</p>
              <p className="font-serif text-lg text-or">{formatFCFA(env.balance)}</p>
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
        <span className="font-sans text-[10px] uppercase tracking-widest text-gris">
          {label}
        </span>
        {icon}
      </div>
      <p className="font-serif text-2xl font-medium text-blanc-creme">{value}</p>
    </motion.div>
  );
}

function formatFCFA(amount: number): string {
  return new Intl.NumberFormat("fr-FR").format(Math.round(amount)) + " FCFA";
}
