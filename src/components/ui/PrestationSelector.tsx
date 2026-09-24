"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, AlertCircle, CheckCircle2, X, Send, Check } from "lucide-react";
import type { Service } from "@/data/services";

type PrestationSelectorProps = {
  service: Service;
};

/**
 * Modal de sélection de prestation + expression de besoin.
 *
 * Flow :
 * 1. User clique sur "Demander un devis" dans une carte de service
 * 2. Modal s'ouvre avec les prestations du service (checkboxes)
 * 3. User sélectionne les prestations souhaitées
 * 4. User exprime son besoin (textarea)
 * 5. User renseigne son nom, email, téléphone
 * 6. Submit → POST /api/leads
 * 7. En DB : CustomerOrder créé (visible dans le CMS /manager)
 * 8. Email envoyé à l'équipe (si Resend configuré)
 * 9. Success screen avec n° de demande
 */
export function PrestationSelector({ service }: PrestationSelectorProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="btn-primary btn-shimmer justify-center w-full"
      >
        {service.cta}
      </button>
      <AnimatePresence>
        {open && (
          <PrestationModal
            service={service}
            onClose={() => setOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function PrestationModal({
  service,
  onClose,
}: {
  service: Service;
  onClose: () => void;
}) {
  const [selectedPrestations, setSelectedPrestations] = useState<string[]>([]);
  const [need, setNeed] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [budget, setBudget] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<{ leadNumber: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  function togglePrestation(prestation: string) {
    setSelectedPrestations((prev) =>
      prev.includes(prestation)
        ? prev.filter((p) => p !== prestation)
        : [...prev, prestation]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    if (selectedPrestations.length === 0) {
      setError("Sélectionne au moins une prestation.");
      setSubmitting(false);
      return;
    }
    if (need.length < 20) {
      setError("Décris ton besoin en au moins 20 caractères.");
      setSubmitting(false);
      return;
    }
    if (!name || !email) {
      setError("Nom et email sont requis.");
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          company,
          service: `${service.title} — ${selectedPrestations.join(", ")}`,
          budget,
          message: `Prestations sélectionnées :\n${selectedPrestations.map((p) => `• ${p}`).join("\n")}\n\nBesoin exprimé :\n${need}`,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Échec de l'envoi");
      }

      const data = await res.json();
      setSuccess({ leadNumber: data.leadNumber || `LEAD-${Date.now()}` });
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
      className="fixed inset-0 z-50 bg-noir-profond/80 backdrop-blur-sm flex items-start justify-center p-4 pt-[5vh] overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.98 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl rounded-2xl border border-or/20 bg-noir-2 p-6 md:p-8 mb-8 max-h-[85vh] overflow-y-auto"
      >
        {success ? (
          <SuccessView leadNumber={success.leadNumber} onClose={onClose} />
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="section-tag">{service.number}</span>
                <h2 className="mt-2 font-serif text-2xl font-bold text-blanc-creme">
                  {service.title}
                </h2>
                <p className="mt-1 text-sm text-or">{service.tagline}</p>
              </div>
              <button onClick={onClose} aria-label="Fermer" className="text-gris hover:text-or">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Étape 1 : Sélection des prestations */}
              <div>
                <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-gris-light">
                  1. Sélectionne les prestations souhaitées
                </span>
                <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {service.deliverables.map((p) => {
                    const checked = selectedPrestations.includes(p);
                    return (
                      <li key={p}>
                        <button
                          type="button"
                          onClick={() => togglePrestation(p)}
                          className={`flex items-start gap-3 rounded-xl border p-3 text-left text-sm transition-all duration-300 w-full ${
                            checked
                              ? "border-or bg-or/10 text-blanc-creme"
                              : "border-gris-dark/30 bg-noir-3 text-gris-light hover:border-or/30"
                          }`}
                        >
                          <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all ${
                            checked ? "border-or bg-or" : "border-gris-dark"
                          }`}>
                            {checked && <Check className="h-3 w-3 text-noir-profond" />}
                          </div>
                          <span className="text-pretty">{p}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Étape 2 : Expression du besoin */}
              <div>
                <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-gris-light">
                  2. Décris ton besoin
                </span>
                <textarea
                  rows={4}
                  value={need}
                  onChange={(e) => setNeed(e.target.value)}
                  className="manager-input resize-none mt-3"
                  placeholder="Ex : J'ai besoin d'un site vitrine pour mon école avec formulaire d'inscription. Le site doit être responsive et facile à mettre à jour."
                  required
                />
              </div>

              {/* Étape 3 : Coordonnées */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex flex-col gap-2">
                  <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-gris-light">Prénom et nom *</span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="manager-input"
                    required
                    placeholder="Ton nom"
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-gris-light">Email *</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="manager-input"
                    required
                    placeholder="vous@exemple.com"
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-gris-light">Téléphone</span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="manager-input"
                    placeholder="+229 …"
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-gris-light">Entreprise (optionnel)</span>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="manager-input"
                    placeholder="Nom de ton entreprise"
                  />
                </label>
              </div>

              {/* Budget */}
              <label className="flex flex-col gap-2">
                <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-gris-light">Budget approximatif</span>
                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="manager-input"
                >
                  <option value="">Sélectionne une fourchette…</option>
                  <option value="Moins de 50 000 FCFA">Moins de 50 000 FCFA</option>
                  <option value="50 000 – 150 000 FCFA">50 000 – 150 000 FCFA</option>
                  <option value="150 000 – 500 000 FCFA">150 000 – 500 000 FCFA</option>
                  <option value="500 000 FCFA et plus">500 000 FCFA et plus</option>
                  <option value="À discuter">À discuter</option>
                </select>
              </label>

              {error && (
                <div className="flex items-start gap-3 rounded-xl border border-danger/30 bg-danger/5 p-4 text-sm text-danger">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  {error}
                </div>
              )}

              <div className="flex gap-3 justify-end">
                <button type="button" onClick={onClose} className="btn-outline">
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary btn-shimmer disabled:opacity-50"
                >
                  {submitting ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Envoi en cours…</>
                  ) : (
                    <><Send className="h-4 w-4" /> Envoyer ma demande</>
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

function SuccessView({ leadNumber, onClose }: { leadNumber: string; onClose: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 py-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full border border-success/30 bg-success/5">
        <CheckCircle2 className="h-8 w-8 text-success" />
      </div>
      <h2 className="font-serif text-2xl font-bold text-blanc-creme">
        Demande envoyée.
      </h2>
      <p className="text-sm text-gris-light text-pretty max-w-md">
        Ta demande a été enregistrée sous le numéro <span className="font-bold text-or">{leadNumber}</span>.
        L'équipe YEHI OR Tech te répond sous 48h, souvent avant. Tu recevras une proposition
        claire, un délai et un prix transparent.
      </p>
      <p className="text-xs text-gris">
        En attendant, écris-nous sur WhatsApp si tu as une question urgente.
      </p>
      <button onClick={onClose} className="btn-primary btn-shimmer mt-4">
        Fermer
      </button>
    </div>
  );
}
