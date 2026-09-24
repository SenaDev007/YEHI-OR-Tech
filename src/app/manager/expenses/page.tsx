"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Loader2, AlertCircle, Receipt } from "lucide-react";
import {
  PROFIT_CENTERS,
  PROFIT_CENTER_LABELS,
  EXPENSE_CATEGORIES,
  type ProfitCenter,
} from "@/lib/types";
import { apiJson, ApiError, invalidateCache } from "@/lib/api-client";

type Expense = {
  id: string;
  number: string;
  category: string;
  amount: number;
  vendor: string | null;
  description: string | null;
  profitCenter: string | null;
  createdAt: string;
  user: { name: string };
  envelope: { id: string; name: string } | null;
};

type Envelope = { id: string; name: string; balance: number };

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [envelopes, setEnvelopes] = useState<Envelope[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  async function load() {
    setLoading(true);
    invalidateCache("/api/manager/expenses");
    invalidateCache("/api/manager/treasury");
    try {
      const [expData, envData] = await Promise.all([
        apiJson<{ data: Expense[] }>("/api/manager/expenses"),
        apiJson<{ data: Envelope[] }>("/api/manager/treasury"),
      ]);
      setExpenses(expData.data);
      setEnvelopes(envData.data);
    } catch (err) {
      console.error("[expenses] Erreur:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <span className="section-tag">Dépenses</span>
          <h1 className="mt-3 font-display text-3xl font-medium text-blanc-creme">Sorties d'argent</h1>
          <p className="mt-1 text-sm text-gris-light">Enregistrer et suivre toutes les dépenses.</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          <Plus className="h-4 w-4" /> Nouvelle dépense
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Total dépenses" value={formatFCFA(total)} />
        <StatCard label="Nombre" value={String(expenses.length)} />
        <StatCard label="Catégories" value={String(new Set(expenses.map((e) => e.category)).size)} />
        <StatCard
          label="Moyenne / dépense"
          value={expenses.length > 0 ? formatFCFA(total / expenses.length) : "—"}
        />
      </div>

      {/* Liste */}
      {loading ? (
        <div className="text-center py-8 text-or font-mono text-sm animate-pulse">Chargement…</div>
      ) : expenses.length === 0 ? (
        <div className="rounded-xl border border-gris-dark/30 bg-noir-2 p-12 text-center">
          <Receipt className="h-10 w-10 text-gris mx-auto mb-4" />
          <p className="text-gris-light">Aucune dépense enregistrée.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-gris-dark/30 bg-noir-2 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-noir-3 text-left">
              <tr>
                <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-gris">N°</th>
                <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-gris">Date</th>
                <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-gris">Catégorie</th>
                <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-gris">Fournisseur</th>
                <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-gris">Enveloppe</th>
                <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-gris text-right">Montant</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gris-dark/20">
              {expenses.map((e) => (
                <tr key={e.id} className="hover:bg-noir-3 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-or">{e.number}</td>
                  <td className="px-4 py-3 text-gris-light">
                    {new Date(e.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "2-digit" })}
                  </td>
                  <td className="px-4 py-3 text-blanc-creme">{e.category}</td>
                  <td className="px-4 py-3 text-gris-light">{e.vendor || "—"}</td>
                  <td className="px-4 py-3 text-gris-light text-xs">{e.envelope?.name || "—"}</td>
                  <td className="px-4 py-3 text-right font-medium text-danger">
                    -{formatFCFA(e.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal formulaire */}
      <AnimatePresence>
        {showForm && (
          <ExpenseFormModal
            envelopes={envelopes}
            onClose={() => setShowForm(false)}
            onCreated={() => {
              setShowForm(false);
              load();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-gris-dark/30 bg-noir-2 p-4">
      <p className="font-mono text-[10px] uppercase tracking-widest text-gris">{label}</p>
      <p className="mt-1 font-display text-xl text-blanc-creme">{value}</p>
    </div>
  );
}

function ExpenseFormModal({
  envelopes,
  onClose,
  onCreated,
}: {
  envelopes: Envelope[];
  onClose: () => void;
  onCreated: () => void;
}) {
  const [category, setCategory] = useState<string>(EXPENSE_CATEGORIES[0]);
  const [amount, setAmount] = useState("");
  const [vendor, setVendor] = useState("");
  const [description, setDescription] = useState("");
  const [profitCenter, setProfitCenter] = useState<ProfitCenter | "">("");
  const [envelopeId, setEnvelopeId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await apiJson("/api/manager/expenses", {
        method: "POST",
        body: JSON.stringify({
          category,
          amount: Number(amount),
          vendor: vendor || null,
          description: description || null,
          profitCenter: profitCenter || null,
          envelopeId: envelopeId || null,
        }),
      });
      onCreated();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : err instanceof Error ? err.message : "Erreur");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-noir-profond/80 backdrop-blur-sm flex items-start justify-center p-4 pt-[5vh] overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.98 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl rounded-2xl border border-or/20 bg-noir-2 p-6 md:p-8 mb-8 max-h-[85vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="section-tag">Nouvelle dépense</span>
            <h2 className="mt-3 font-display text-2xl font-medium text-blanc-creme">Enregistrer une sortie d'argent</h2>
          </div>
          <button onClick={onClose} aria-label="Fermer" className="text-gris hover:text-or">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex flex-col gap-2">
              <span className="font-mono text-[10px] uppercase tracking-widest text-gris-light">Catégorie *</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="manager-input"
                required
              >
                {EXPENSE_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-2">
              <span className="font-mono text-[10px] uppercase tracking-widest text-gris-light">Montant (FCFA) *</span>
              <input
                type="number"
                min="1"
                step="any"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="manager-input"
                placeholder="Ex : 5000"
                required
                autoFocus
              />
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex flex-col gap-2">
              <span className="font-mono text-[10px] uppercase tracking-widest text-gris-light">Fournisseur</span>
              <input
                type="text"
                value={vendor}
                onChange={(e) => setVendor(e.target.value)}
                className="manager-input"
                placeholder="Ex : Boutique papier Parakou"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="font-mono text-[10px] uppercase tracking-widest text-gris-light">Centre de profit (optionnel)</span>
              <select
                value={profitCenter}
                onChange={(e) => setProfitCenter(e.target.value as ProfitCenter | "")}
                className="manager-input"
              >
                <option value="">— Aucun</option>
                {PROFIT_CENTERS.map((c) => (
                  <option key={c} value={c}>{PROFIT_CENTER_LABELS[c]}</option>
                ))}
              </select>
            </label>
          </div>

          <label className="flex flex-col gap-2">
            <span className="font-mono text-[10px] uppercase tracking-widest text-gris-light">Enveloppe de trésorerie</span>
            <select
              value={envelopeId}
              onChange={(e) => setEnvelopeId(e.target.value)}
              className="manager-input"
            >
              <option value="">— Aucune</option>
              {envelopes.map((env) => (
                <option key={env.id} value={env.id}>
                  {env.name} ({formatFCFA(env.balance)})
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2">
            <span className="font-mono text-[10px] uppercase tracking-widest text-gris-light">Description (optionnel)</span>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="manager-input resize-none"
              placeholder="Ex : Achat 2 ramettes papier A4"
            />
          </label>

          {error && (
            <div className="flex items-start gap-3 rounded-lg border border-danger/30 bg-danger/5 p-4 text-sm text-danger">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          <div className="flex gap-3 justify-end">
            <button type="button" onClick={onClose} className="btn-outline">Annuler</button>
            <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-50">
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Enregistrement…
                </>
              ) : (
                <>
                  <Receipt className="h-4 w-4" /> Enregistrer la dépense
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

function formatFCFA(amount: number): string {
  return new Intl.NumberFormat("fr-FR").format(Math.round(amount)) + " FCFA";
}
