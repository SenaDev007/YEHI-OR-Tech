"use client";

import { useEffect, useState } from "react";
import { PiggyBank, Wallet } from "lucide-react";

type Envelope = {
  id: string;
  name: string;
  description: string | null;
  target: number | null;
  balance: number;
  isOperational: boolean;
};

export default function TreasuryPage() {
  const [envelopes, setEnvelopes] = useState<Envelope[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/manager/treasury")
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) setEnvelopes(d.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const total = envelopes.reduce((sum, e) => sum + e.balance, 0);

  if (loading) {
    return <div className="text-center py-8 text-or font-mono text-sm animate-pulse">Chargement…</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <span className="section-tag">Trésorerie</span>
        <h1 className="mt-3 font-display text-3xl font-medium text-blanc-creme">Enveloppes</h1>
        <p className="mt-1 text-sm text-gris-light">
          Les centres de profit décrivent l'origine de l'activité. Les enveloppes décrivent sa destination.
        </p>
      </div>

      {/* Total */}
      <div className="rounded-xl border border-or/30 bg-or/5 p-6">
        <div className="flex items-center gap-3 mb-2">
          <Wallet className="h-5 w-5 text-or" />
          <span className="font-mono text-xs uppercase tracking-widest text-or">
            Solde total
          </span>
        </div>
        <p className="font-display text-4xl font-medium text-or">{formatFCFA(total)}</p>
      </div>

      {/* Enveloppes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {envelopes.map((env) => {
          const pctProgress = env.target && env.target > 0 ? (env.balance / env.target) * 100 : null;
          return (
            <div
              key={env.id}
              className={`rounded-xl border p-5 ${
                env.isOperational
                  ? "border-or/30 bg-or/5"
                  : "border-gris-dark/30 bg-noir-2"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <PiggyBank className={`h-5 w-5 ${env.isOperational ? "text-or" : "text-gris"}`} />
                {env.isOperational && (
                  <span className="badge-clip border border-or/30 bg-or/15 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-or">
                    Opérationnelle
                  </span>
                )}
              </div>
              <h3 className="font-display text-lg font-medium text-blanc-creme">{env.name}</h3>
              {env.description && (
                <p className="mt-1 text-xs text-gris text-pretty">{env.description}</p>
              )}
              <p className="mt-3 font-display text-2xl text-or">{formatFCFA(env.balance)}</p>

              {env.target && env.target > 0 && (
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gris mb-1">
                    <span>Objectif : {formatFCFA(env.target)}</span>
                    <span>{pctProgress?.toFixed(0)}%</span>
                  </div>
                  <div className="h-1.5 bg-noir-3 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-or to-or-light"
                      style={{ width: `${Math.min(pctProgress || 0, 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function formatFCFA(amount: number): string {
  return new Intl.NumberFormat("fr-FR").format(Math.round(amount)) + " FCFA";
}
