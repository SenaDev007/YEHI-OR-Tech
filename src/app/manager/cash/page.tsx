"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, AlertCircle, Wallet, Lock, CheckCircle2, Clock } from "lucide-react";

type CashSession = {
  id: string;
  openedAt: string;
  closedAt: string | null;
  openingAmount: number;
  closingAmount: number | null;
  theoreticalAmount: number | null;
  difference: number | null;
  differenceNote: string | null;
  status: string;
  user: { name: string };
  sales: { id: string; totalAmount: number; number: string }[];
};

const CASH_SESSION_STATUS_LABELS: Record<string, string> = {
  OUVERTE: "Ouverte",
  CLOTUREE: "Clôturée",
  ECART_NON_RESOLU: "Écart non résolu",
};

export default function CashPage() {
  const [sessions, setSessions] = useState<CashSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [showOpenForm, setShowOpenForm] = useState(false);
  const [showCloseForm, setShowCloseForm] = useState<CashSession | null>(null);

  const openSession = sessions.find((s) => s.status === "OUVERTE");

  async function load() {
    setLoading(true);
    const res = await fetch("/api/manager/cash");
    const data = await res.json();
    if (data.ok) setSessions(data.data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <span className="section-tag">Caisse</span>
          <h1 className="mt-3 font-display text-3xl font-medium text-blanc-creme">Sessions de caisse</h1>
          <p className="mt-1 text-sm text-gris-light">Ouvrir, clôturer et suivre les écarts.</p>
        </div>
        {!openSession && (
          <button onClick={() => setShowOpenForm(true)} className="btn-primary">
            <Wallet className="h-4 w-4" /> Ouvrir la caisse
          </button>
        )}
      </div>

      {/* État actuel */}
      {openSession && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-success/30 bg-success/5 p-6"
        >
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-xl bg-success/20 flex items-center justify-center">
              <Wallet className="h-6 w-6 text-success" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                <span className="font-mono text-xs uppercase tracking-widest text-success">
                  Caisse ouverte
                </span>
              </div>
              <p className="mt-2 font-display text-3xl font-medium text-blanc-creme">
                {formatFCFA(openSession.openingAmount)}
              </p>
              <p className="mt-1 text-sm text-gris-light">
                Ouverte {new Date(openSession.openedAt).toLocaleString("fr-FR")} par {openSession.user.name}
              </p>
              {openSession.sales.length > 0 && (
                <p className="mt-2 text-sm text-gris">
                  {openSession.sales.length} vente(s) pour un total de{" "}
                  {formatFCFA(openSession.sales.reduce((sum, s) => sum + s.totalAmount, 0))}
                </p>
              )}
            </div>
            <button
              onClick={() => setShowCloseForm(openSession)}
              className="btn-outline"
            >
              <Lock className="h-4 w-4" /> Clôturer
            </button>
          </div>
        </motion.div>
      )}

      {/* Historique */}
      <div>
        <h2 className="font-display text-xl font-medium text-blanc-creme mb-4">Historique récent</h2>
        {loading ? (
          <div className="text-center py-8 text-or font-mono text-sm animate-pulse">Chargement…</div>
        ) : sessions.length === 0 ? (
          <div className="rounded-xl border border-gris-dark/30 bg-noir-2 p-8 text-center">
            <Clock className="h-8 w-8 text-gris mx-auto mb-3" />
            <p className="text-gris-light">Aucune session enregistrée.</p>
          </div>
        ) : (
          <div className="rounded-xl border border-gris-dark/30 bg-noir-2 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-noir-3 text-left">
                <tr>
                  <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-gris">Ouverture</th>
                  <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-gris">Clôture</th>
                  <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-gris">Ouvert par</th>
                  <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-gris text-right">Initial</th>
                  <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-gris text-right">Théorique</th>
                  <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-gris text-right">Réel</th>
                  <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-gris text-right">Écart</th>
                  <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-gris">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gris-dark/20">
                {sessions.map((s) => (
                  <tr key={s.id} className="hover:bg-noir-3 transition-colors">
                    <td className="px-4 py-3 text-gris-light">
                      {new Date(s.openedAt).toLocaleString("fr-FR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td className="px-4 py-3 text-gris-light">
                      {s.closedAt ? new Date(s.closedAt).toLocaleString("fr-FR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }) : "—"}
                    </td>
                    <td className="px-4 py-3 text-blanc-creme">{s.user.name}</td>
                    <td className="px-4 py-3 text-right text-blanc-creme">{formatFCFA(s.openingAmount)}</td>
                    <td className="px-4 py-3 text-right text-gris-light">
                      {s.theoreticalAmount != null ? formatFCFA(s.theoreticalAmount) : "—"}
                    </td>
                    <td className="px-4 py-3 text-right text-blanc-creme">
                      {s.closingAmount != null ? formatFCFA(s.closingAmount) : "—"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {s.difference != null ? (
                        <span className={Math.abs(s.difference) > 1 ? "text-danger" : "text-success"}>
                          {s.difference >= 0 ? "+" : ""}{formatFCFA(s.difference)}
                        </span>
                      ) : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-mono text-[10px] uppercase tracking-wider ${
                        s.status === "CLOTUREE" ? "text-success" :
                        s.status === "OUVERTE" ? "text-or" : "text-danger"
                      }`}>
                        {CASH_SESSION_STATUS_LABELS[s.status] || s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal ouverture */}
      <AnimatePresence>
        {showOpenForm && (
          <OpenCashModal
            onClose={() => setShowOpenForm(false)}
            onCreated={() => {
              setShowOpenForm(false);
              load();
            }}
          />
        )}
      </AnimatePresence>

      {/* Modal clôture */}
      <AnimatePresence>
        {showCloseForm && (
          <CloseCashModal
            session={showCloseForm}
            onClose={() => setShowCloseForm(null)}
            onClosed={() => {
              setShowCloseForm(null);
              load();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function OpenCashModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const [openingAmount, setOpeningAmount] = useState("0");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/manager/cash", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ openingAmount: Number(openingAmount) }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Échec");
      }
      onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ModalFrame onClose={onClose} title="Ouvrir une session de caisse" tag="Ouverture">
      <form onSubmit={handleSubmit} className="space-y-5">
        <label className="flex flex-col gap-2">
          <span className="font-mono text-[10px] uppercase tracking-widest text-gris-light">Montant initial (espèces)</span>
          <input
            type="number"
            min="0"
            step="any"
            value={openingAmount}
            onChange={(e) => setOpeningAmount(e.target.value)}
            className="manager-input"
            autoFocus
            required
          />
          <span className="text-xs text-gris">Indique le montant en espèces présent dans la caisse à l'ouverture.</span>
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
                <Loader2 className="h-4 w-4 animate-spin" /> Ouverture…
              </>
            ) : (
              <>
                <Wallet className="h-4 w-4" /> Ouvrir la caisse
              </>
            )}
          </button>
        </div>
      </form>
    </ModalFrame>
  );
}

function CloseCashModal({
  session,
  onClose,
  onClosed,
}: {
  session: CashSession;
  onClose: () => void;
  onClosed: () => void;
}) {
  const salesTotal = session.sales.reduce((sum, s) => sum + s.totalAmount, 0);
  const theoretical = session.openingAmount + salesTotal;
  const [closingAmount, setClosingAmount] = useState(String(theoretical));
  const [differenceNote, setDifferenceNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const diff = Number(closingAmount) - theoretical;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/manager/cash", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: session.id,
          closingAmount: Number(closingAmount),
          differenceNote: differenceNote || null,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Échec");
      }
      onClosed();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ModalFrame onClose={onClose} title="Clôturer la session de caisse" tag="Clôture">
      <div className="space-y-4">
        {/* Récap */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-gris-dark/30 bg-noir-3 p-3">
            <p className="font-mono text-[10px] uppercase tracking-widest text-gris">Ouverture</p>
            <p className="font-display text-lg text-blanc-creme">{formatFCFA(session.openingAmount)}</p>
          </div>
          <div className="rounded-lg border border-gris-dark/30 bg-noir-3 p-3">
            <p className="font-mono text-[10px] uppercase tracking-widest text-gris">Ventes encaissées</p>
            <p className="font-display text-lg text-blanc-creme">{formatFCFA(salesTotal)}</p>
            <p className="text-xs text-gris">{session.sales.length} vente(s)</p>
          </div>
        </div>

        <div className="rounded-lg border border-or/30 bg-or/5 p-3">
          <p className="font-mono text-[10px] uppercase tracking-widest text-or">Montant théorique en caisse</p>
          <p className="font-display text-2xl text-or">{formatFCFA(theoretical)}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="flex flex-col gap-2">
            <span className="font-mono text-[10px] uppercase tracking-widest text-gris-light">Montant réel compté</span>
            <input
              type="number"
              min="0"
              step="any"
              value={closingAmount}
              onChange={(e) => setClosingAmount(e.target.value)}
              className="manager-input"
              autoFocus
              required
            />
          </label>

          <div className={`rounded-lg border p-3 ${
            Math.abs(diff) > 1
              ? "border-danger/40 bg-danger/5"
              : "border-success/40 bg-success/5"
          }`}>
            <p className="font-mono text-[10px] uppercase tracking-widest text-gris">Écart</p>
            <p className={`font-display text-2xl ${
              Math.abs(diff) > 1 ? "text-danger" : "text-success"
            }`}>
              {diff >= 0 ? "+" : ""}{formatFCFA(diff)}
            </p>
          </div>

          {Math.abs(diff) > 1 && (
            <label className="flex flex-col gap-2">
              <span className="font-mono text-[10px] uppercase tracking-widest text-gris-light">
                Explication de l'écart (obligatoire)
              </span>
              <textarea
                rows={3}
                value={differenceNote}
                onChange={(e) => setDifferenceNote(e.target.value)}
                className="manager-input resize-none"
                placeholder="Ex : monnaie rendue oubliée, erreur de saisie, vente non enregistrée…"
                required
              />
            </label>
          )}

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
                  <Loader2 className="h-4 w-4 animate-spin" /> Clôture…
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" /> Confirmer la clôture
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </ModalFrame>
  );
}

function ModalFrame({
  children,
  onClose,
  title,
  tag,
}: {
  children: React.ReactNode;
  onClose: () => void;
  title: string;
  tag: string;
}) {
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
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-2xl border border-or/20 bg-noir-2 p-6 md:p-8 mb-8 max-h-[85vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="section-tag">{tag}</span>
            <h2 className="mt-3 font-display text-2xl font-medium text-blanc-creme">{title}</h2>
          </div>
          <button onClick={onClose} aria-label="Fermer" className="text-gris hover:text-or">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  );
}

function formatFCFA(amount: number): string {
  return new Intl.NumberFormat("fr-FR").format(Math.round(amount)) + " FCFA";
}
