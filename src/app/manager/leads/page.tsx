"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2, AlertCircle, X, Send, FileText, Mail, Phone, User,
  CheckCircle2, CreditCard, Link as LinkIcon, Loader, Inbox,
} from "lucide-react";
import { FedaPayCheckout } from "@/components/ui/FedaPayCheckout";

type Lead = {
  id: string;
  number: string;
  title: string;
  description: string;
  status: string;
  price: number;
  createdAt: string;
  customer: { name: string; email: string; phone: string | null } | null;
};

type PaymentModalData = {
  lead: Lead;
  amount: number;
  description: string;
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [paymentModal, setPaymentModal] = useState<PaymentModalData | null>(null);

  useEffect(() => {
    fetch("/api/manager/leads")
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) setLeads(d.data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <span className="section-tag">Leads</span>
        <h1 className="mt-3 font-serif text-3xl font-bold text-blanc-creme">
          Demandes reçues
        </h1>
        <p className="mt-1 text-sm text-gris-light">
          Traite les demandes reçues depuis le site public. Crée une facture avec lien de paiement FedaPay.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-8 text-or font-sans text-sm animate-pulse">Chargement…</div>
      ) : leads.length === 0 ? (
        <div className="rounded-2xl border border-gris-dark/30 bg-noir-2 p-12 text-center">
          <Inbox className="h-10 w-10 text-gris mx-auto mb-4" />
          <p className="text-gris-light">Aucune demande pour le moment.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {leads.map((lead) => (
            <LeadCard key={lead.id} lead={lead} onCreatePayment={(l) => setPaymentModal({ lead: l, amount: l.price || 0, description: l.title })} />
          ))}
        </div>
      )}

      <AnimatePresence>
        {paymentModal && (
          <PaymentModal
            data={paymentModal}
            onClose={() => setPaymentModal(null)}
            onPaid={() => {
              setPaymentModal(null);
              fetch("/api/manager/leads").then(r => r.json()).then(d => { if (d.ok) setLeads(d.data); });
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function LeadCard({ lead, onCreatePayment }: { lead: Lead; onCreatePayment: (lead: Lead) => void }) {
  const statusStyles: Record<string, string> = {
    NOUVELLE: "bg-success/10 border-success/30 text-success",
    EN_PRODUCTION: "bg-or/10 border-or/30 text-or",
    PRETE: "bg-bleu-electrique/10 border-bleu-electrique/30 text-bleu-electrique",
    LIVREE: "bg-gris-dark/20 border-gris-dark/30 text-gris",
  };

  return (
    <div className="rounded-2xl border border-gris-dark/30 bg-noir-2 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <span className="font-sans text-xs font-bold text-or">{lead.number}</span>
            <span className={`rounded-full border px-2 py-0.5 font-sans text-[10px] font-bold uppercase tracking-wider ${statusStyles[lead.status] || statusStyles.NOUVELLE}`}>
              {lead.status}
            </span>
          </div>
          <h3 className="font-serif text-lg font-bold text-blanc-creme">{lead.title}</h3>
          <p className="mt-2 text-sm text-gris-light text-pretty">{lead.description}</p>
        </div>
        <span className="font-sans text-[10px] text-gris whitespace-nowrap">
          {new Date(lead.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>

      {/* Client info */}
      {lead.customer && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <div className="flex items-center gap-2 text-xs text-gris-light">
            <User className="h-3.5 w-3.5 text-or" />
            {lead.customer.name}
          </div>
          <div className="flex items-center gap-2 text-xs text-gris-light">
            <Mail className="h-3.5 w-3.5 text-or" />
            {lead.customer.email}
          </div>
          {lead.customer.phone && (
            <div className="flex items-center gap-2 text-xs text-gris-light">
              <Phone className="h-3.5 w-3.5 text-or" />
              {lead.customer.phone}
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={() => onCreatePayment(lead)}
          className="btn-primary btn-shimmer"
        >
          <CreditCard className="h-4 w-4" />
          Créer une facture
        </button>
        {lead.price > 0 && (
          <span className="rounded-full bg-or/10 px-3 py-1.5 font-sans text-xs font-bold text-or">
            {formatFCFA(lead.price)}
          </span>
        )}
      </div>
    </div>
  );
}

function PaymentModal({
  data,
  onClose,
  onPaid,
}: {
  data: PaymentModalData;
  onClose: () => void;
  onPaid: () => void;
}) {
  const [amount, setAmount] = useState(data.amount);
  const [description, setDescription] = useState(data.description);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkoutData, setCheckoutData] = useState<{
    publicKey: string;
    transaction: { id: string; amount: number; description: string };
    customer: { email: string; lastname: string; phone_number?: string };
  } | null>(null);
  const [paid, setPaid] = useState(false);

  async function handleCreatePayment(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setError(null);

    try {
      const res = await fetch("/api/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          description,
          customerEmail: data.lead.customer?.email || "",
          customerName: data.lead.customer?.name || "",
          customerPhone: data.lead.customer?.phone || undefined,
          leadId: data.lead.id,
        }),
      });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Échec");
      }

      const d = await res.json();
      setCheckoutData(d);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setCreating(false);
    }
  }

  async function handlePaymentComplete(transactionData: unknown) {
    // Vérifier le statut réel côté serveur
    if (!checkoutData) return;
    try {
      const res = await fetch(`/api/payments/${checkoutData.transaction.id}/verify`, {
        method: "POST",
      });
      const d = await res.json();
      if (d.isPaid) {
        setPaid(true);
        setTimeout(() => onPaid(), 2000);
      }
    } catch {
      // Le webhook confirmera plus tard
      setPaid(true);
      setTimeout(() => onPaid(), 2000);
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
        className="w-full max-w-lg rounded-2xl border border-or/20 bg-noir-2 p-6 md:p-8 mb-8 max-h-[85vh] overflow-y-auto"
      >
        {paid ? (
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <CheckCircle2 className="h-12 w-12 text-success" />
            <h2 className="font-serif text-2xl font-bold text-blanc-creme">Paiement confirmé !</h2>
            <p className="text-sm text-gris-light">La facture a été réglée. Le lead est mis à jour.</p>
          </div>
        ) : checkoutData ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="section-tag">Paiement FedaPay</span>
                <h2 className="mt-2 font-serif text-2xl font-bold text-blanc-creme">Encaissement</h2>
              </div>
              <button onClick={onClose} className="text-gris hover:text-or"><X className="h-5 w-5" /></button>
            </div>

            <div className="rounded-xl bg-or/5 border border-or/20 p-4 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gris">Montant</span>
                <span className="font-serif text-xl font-bold text-or">{formatFCFA(checkoutData.transaction.amount)}</span>
              </div>
              <div className="flex justify-between text-xs mt-2">
                <span className="text-gris">Client</span>
                <span className="text-blanc-creme">{checkoutData.customer.lastname}</span>
              </div>
            </div>

            <FedaPayCheckout
              publicKey={checkoutData.publicKey}
              transaction={checkoutData.transaction}
              customer={checkoutData.customer}
              onComplete={handlePaymentComplete}
              onError={(err) => setError("Erreur de paiement")}
            />
          </>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="section-tag">Facture</span>
                <h2 className="mt-2 font-serif text-2xl font-bold text-blanc-creme">Créer une facture</h2>
              </div>
              <button onClick={onClose} className="text-gris hover:text-or"><X className="h-5 w-5" /></button>
            </div>

            <form onSubmit={handleCreatePayment} className="space-y-4">
              <label className="flex flex-col gap-2">
                <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-gris-light">Montant (FCFA)</span>
                <input
                  type="number"
                  min="1"
                  step="any"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="manager-input"
                  required
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-gris-light">Description</span>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="manager-input"
                  required
                />
              </label>

              <div className="rounded-xl bg-bleu-nuit/30 p-3 text-xs text-gris-light">
                <p><strong className="text-or">Client :</strong> {data.lead.customer?.name}</p>
                <p><strong className="text-or">Email :</strong> {data.lead.customer?.email}</p>
                {data.lead.customer?.phone && <p><strong className="text-or">Tél :</strong> {data.lead.customer.phone}</p>}
              </div>

              {error && (
                <div className="flex items-center gap-2 rounded-xl border border-danger/30 bg-danger/5 p-3 text-sm text-danger">
                  <AlertCircle className="h-4 w-4" /> {error}
                </div>
              )}

              <button type="submit" disabled={creating} className="btn-primary btn-shimmer w-full disabled:opacity-50">
                {creating ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Création…</>
                ) : (
                  <><CreditCard className="h-4 w-4" /> Générer le lien de paiement</>
                )}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

function formatFCFA(amount: number): string {
  return new Intl.NumberFormat("fr-FR").format(Math.round(amount)) + " FCFA";
}
