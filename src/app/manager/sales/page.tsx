"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Loader2, AlertCircle, Receipt, TrendingUp } from "lucide-react";
import {
  PROFIT_CENTERS,
  PROFIT_CENTER_LABELS,
  PAYMENT_METHOD_LABELS,
  SALE_STATUS_LABELS,
  type ProfitCenter,
  type PaymentMethod,
} from "@/lib/types";

type Sale = {
  id: string;
  number: string;
  profitCenter: ProfitCenter;
  status: string;
  totalAmount: number;
  paidAmount: number;
  createdAt: string;
  customer: { name: string } | null;
  user: { name: string };
  lines: { id: string; quantity: number; unitPrice: number; totalAmount: number; product: { name: string } }[];
  payments: { method: string; amount: number }[];
};

type ProductService = {
  id: string;
  name: string;
  unit: string;
  unitPrice: number;
  profitCenter: string;
};

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [products, setProducts] = useState<ProductService[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const salesRes = await fetch("/api/manager/sales");
    const productsRes = await fetch("/api/manager/products");
    const salesData = await salesRes.json();
    const productsData = await productsRes.json();
    if (salesData.ok) setSales(salesData.data);
    if (productsData.ok) setProducts(productsData.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const totalCA = sales.reduce((sum, s) => sum + s.totalAmount, 0);
  const payees = sales.filter((s) => s.status === "PAYEE");
  const enAttente = sales.filter((s) => s.status === "EN_ATTENTE");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <span className="section-tag">Ventes</span>
          <h1 className="mt-3 font-display text-3xl font-medium text-blanc-creme">Ventes &amp; encaissements</h1>
          <p className="mt-1 text-sm text-gris-light">Enregistrer et suivre les ventes immédiates.</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          <Plus className="h-4 w-4" /> Nouvelle vente
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Ventes totales" value={String(sales.length)} />
        <StatCard label="CA total" value={formatFCFA(totalCA)} />
        <StatCard label="Ventes payées" value={String(payees.length)} />
        <StatCard label="Ventes en attente" value={String(enAttente.length)} />
      </div>

      {loading ? (
        <div className="text-center py-8 text-or font-mono text-sm animate-pulse">Chargement…</div>
      ) : sales.length === 0 ? (
        <div className="rounded-xl border border-gris-dark/30 bg-noir-2 p-12 text-center">
          <Receipt className="h-10 w-10 text-gris mx-auto mb-4" />
          <p className="text-gris-light">Aucune vente enregistrée pour le moment.</p>
          <button onClick={() => setShowForm(true)} className="btn-primary mt-4">
            Enregistrer la première vente
          </button>
        </div>
      ) : (
        <div className="rounded-xl border border-gris-dark/30 bg-noir-2 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-noir-3 text-left">
              <tr>
                <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-gris">N°</th>
                <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-gris">Date</th>
                <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-gris">Client</th>
                <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-gris">Centre</th>
                <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-gris text-right">Montant</th>
                <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-gris">Paiement</th>
                <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-gris">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gris-dark/20">
              {sales.map((sale) => (
                <tr key={sale.id} className="hover:bg-noir-3 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-or">{sale.number}</td>
                  <td className="px-4 py-3 text-gris-light">
                    {new Date(sale.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "2-digit" })}
                  </td>
                  <td className="px-4 py-3 text-blanc-creme">{sale.customer?.name || "—"}</td>
                  <td className="px-4 py-3">
                    <span className="badge-clip border border-or/30 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-or">
                      {PROFIT_CENTER_LABELS[sale.profitCenter] || sale.profitCenter}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-blanc-creme">
                    {formatFCFA(sale.totalAmount)}
                  </td>
                  <td className="px-4 py-3 text-xs text-gris-light">
                    {sale.payments[0] ? PAYMENT_METHOD_LABELS[sale.payments[0].method as PaymentMethod] || sale.payments[0].method : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-gris">
                      {SALE_STATUS_LABELS[sale.status as keyof typeof SALE_STATUS_LABELS] || sale.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AnimatePresence>
        {showForm && (
          <SaleFormModal
            products={products}
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

type SaleFormModalProps = {
  products: ProductService[];
  onClose: () => void;
  onCreated: () => void;
};

function SaleFormModal({ products, onClose, onCreated }: SaleFormModalProps) {
  const [profitCenter, setProfitCenter] = useState<ProfitCenter>("BOUTIQUE");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("ESPECES");
  const [paymentReference, setPaymentReference] = useState("");
  const [lines, setLines] = useState<{ productId: string; quantity: number; unitPrice: number }[]>([
    { productId: "", quantity: 1, unitPrice: 0 },
  ]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filteredProducts = products.filter((p) => p.profitCenter === profitCenter);
  const total = lines.reduce((sum, l) => sum + l.quantity * l.unitPrice, 0);

  function updateLine(idx: number, updates: Partial<{ productId: string; quantity: number; unitPrice: number }>) {
    setLines((prev) => prev.map((l, i) => (i === idx ? { ...l, ...updates } : l)));
  }

  function addLine() {
    setLines((prev) => [...prev, { productId: "", quantity: 1, unitPrice: 0 }]);
  }

  function removeLine(idx: number) {
    setLines((prev) => prev.filter((_, i) => i !== idx));
  }

  function selectProduct(idx: number, productId: string) {
    const product = filteredProducts.find((p) => p.id === productId);
    if (product) {
      updateLine(idx, { productId, unitPrice: product.unitPrice });
    } else {
      updateLine(idx, { productId });
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const validLines = lines.filter((l) => l.productId && l.quantity > 0 && l.unitPrice > 0);
    if (validLines.length === 0) {
      setError("Ajoute au moins une ligne de vente valide.");
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/manager/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profitCenter,
          paymentMethod,
          paymentReference: paymentReference || null,
          lines: validLines,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Échec de l'enregistrement");
      }

      onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-noir-profond/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.98 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl rounded-2xl border border-or/20 bg-noir-2 p-6 md:p-8 my-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="section-tag">Nouvelle vente</span>
            <h2 className="mt-3 font-display text-2xl font-medium text-blanc-creme">Enregistrer une vente</h2>
          </div>
          <button onClick={onClose} aria-label="Fermer" className="text-gris hover:text-or">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex flex-col gap-2">
              <span className="font-mono text-[10px] uppercase tracking-widest text-gris-light">Centre de profit</span>
              <select
                value={profitCenter}
                onChange={(e) => {
                  setProfitCenter(e.target.value as ProfitCenter);
                  setLines([{ productId: "", quantity: 1, unitPrice: 0 }]);
                }}
                className="manager-input"
              >
                {PROFIT_CENTERS.map((c) => (
                  <option key={c} value={c}>{PROFIT_CENTER_LABELS[c]}</option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-2">
              <span className="font-mono text-[10px] uppercase tracking-widest text-gris-light">Moyen de paiement</span>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="manager-input"
              >
                {Object.entries(PAYMENT_METHOD_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-widest text-gris-light">Lignes de vente</span>
              <button
                type="button"
                onClick={addLine}
                className="text-or text-xs link-underline font-mono uppercase tracking-wider"
              >
                + Ajouter une ligne
              </button>
            </div>

            {lines.map((line, idx) => (
              <div key={idx} className="grid grid-cols-12 gap-2 items-start">
                <div className="col-span-12 sm:col-span-6">
                  <select
                    value={line.productId}
                    onChange={(e) => selectProduct(idx, e.target.value)}
                    className="manager-input"
                    required
                  >
                    <option value="">— Sélectionner un service —</option>
                    {filteredProducts.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} — {formatFCFA(p.unitPrice)} / {p.unit}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-span-3 sm:col-span-2">
                  <input
                    type="number"
                    step="any"
                    min="0"
                    value={line.quantity}
                    onChange={(e) => updateLine(idx, { quantity: Number(e.target.value) })}
                    className="manager-input"
                    placeholder="Qté"
                  />
                </div>
                <div className="col-span-4 sm:col-span-2">
                  <input
                    type="number"
                    step="any"
                    min="0"
                    value={line.unitPrice}
                    onChange={(e) => updateLine(idx, { unitPrice: Number(e.target.value) })}
                    className="manager-input"
                    placeholder="Prix"
                  />
                </div>
                <div className="col-span-4 sm:col-span-1 text-right text-sm text-blanc-creme pt-2.5">
                  {formatFCFA(line.quantity * line.unitPrice)}
                </div>
                <div className="col-span-1 flex justify-end">
                  {lines.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeLine(idx)}
                      className="text-gris hover:text-danger pt-2.5"
                      aria-label="Supprimer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <label className="flex flex-col gap-2">
            <span className="font-mono text-[10px] uppercase tracking-widest text-gris-light">Référence paiement (optionnel)</span>
            <input
              type="text"
              value={paymentReference}
              onChange={(e) => setPaymentReference(e.target.value)}
              className="manager-input"
              placeholder="N° Mobile Money, n° transaction…"
            />
          </label>

          <div className="rounded-lg bg-or/5 border border-or/20 p-4 flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-widest text-or">Total à encaisser</span>
            <span className="font-display text-2xl font-medium text-or">{formatFCFA(total)}</span>
          </div>

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
                  <TrendingUp className="h-4 w-4" /> Enregistrer la vente
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
