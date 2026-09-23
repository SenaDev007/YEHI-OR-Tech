"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { services } from "@/data/services";
import { whatsappLink } from "@/lib/utils";

const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Ce champ est nécessaire pour traiter ta demande."),
  email: z
    .string()
    .min(1, "Cette adresse email est nécessaire.")
    .email("Cette adresse email n'a pas l'air valide."),
  phone: z.string().optional(),
  company: z.string().optional(),
  service: z
    .string()
    .min(1, "Indique le service souhaité pour qu'on traite ta demande."),
  budget: z.string().optional(),
  message: z
    .string()
    .min(20, "Quelques mots de plus nous aideraient à comprendre ton besoin."),
});

type ContactFormData = z.infer<typeof contactSchema>;

const budgetOptions = [
  "Moins de 50 000 FCFA",
  "50 000 – 150 000 FCFA",
  "150 000 – 500 000 FCFA",
  "500 000 FCFA et plus",
  "À discuter",
];

const serviceOptions = [
  ...services.map((s) => s.title),
  "Autre",
];

type ContactFormProps = {
  defaultService?: string;
};

/**
 * Formulaire de contact — react-hook-form + zod.
 * Validation en temps réel, état loading, succès animé.
 */
export function ContactForm({ defaultService }: ContactFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: defaultService ? { service: defaultService } : undefined,
  });

  const onSubmit = async (data: ContactFormData) => {
    setSubmitting(true);
    setError(null);
    try {
      // Envoi API
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Erreur d'envoi");
      setSubmitted(true);
      reset();
    } catch {
      setError(
        "L'envoi a échoué. Écris-nous directement sur WhatsApp, ça ira plus vite."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-4 border border-success/30 bg-success/5 p-8 text-center"
          >
            <CheckCircle2 className="h-12 w-12 text-success" aria-hidden />
            <h3 className="font-display text-2xl font-medium text-blanc-creme">
              Message reçu.
            </h3>
            <p className="text-sm text-gris-light text-pretty">
              Tu auras une réponse sous 48h, souvent avant.
            </p>
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="font-mono text-[10px] uppercase tracking-widest text-or link-underline"
            >
              Envoyer un autre message
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
            noValidate
          >
            {/* Prénom & Nom + Email */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label="Prénom et nom" required error={errors.name?.message}>
                <input
                  type="text"
                  autoComplete="name"
                  className="input-base"
                  placeholder="Ex : Koffi Adjovi"
                  {...register("name")}
                />
              </Field>
              <Field label="Adresse email" required error={errors.email?.message}>
                <input
                  type="email"
                  autoComplete="email"
                  className="input-base"
                  placeholder="toi@exemple.com"
                  {...register("email")}
                />
              </Field>
            </div>

            {/* Téléphone + Entreprise */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label="Téléphone" error={errors.phone?.message}>
                <input
                  type="tel"
                  autoComplete="tel"
                  className="input-base"
                  placeholder="+229 …"
                  {...register("phone")}
                />
              </Field>
              <Field label="Entreprise (facultatif)" error={errors.company?.message}>
                <input
                  type="text"
                  autoComplete="organization"
                  className="input-base"
                  placeholder="Nom de l'entreprise"
                  {...register("company")}
                />
              </Field>
            </div>

            {/* Service souhaité + Budget */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label="Service souhaité" required error={errors.service?.message}>
                <select className="input-base" {...register("service")}>
                  <option value="">Sélectionne un service…</option>
                  {serviceOptions.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Budget approximatif" error={errors.budget?.message}>
                <select className="input-base" {...register("budget")}>
                  <option value="">Sélectionne une fourchette…</option>
                  {budgetOptions.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            {/* Description */}
            <Field
              label="Décris ton projet en quelques lignes"
              required
              error={errors.message?.message}
            >
              <textarea
                rows={5}
                className="input-base resize-none"
                placeholder="Exemple : je veux un site vitrine pour mon école avec un formulaire d'inscription en ligne."
                {...register("message")}
              />
            </Field>

            {/* Erreur générique */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3 border border-danger/30 bg-danger/5 p-4"
              >
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-danger" aria-hidden />
                <p className="text-sm text-danger">{error}</p>
              </motion.div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  Envoi en cours…
                </>
              ) : (
                <>
                  Envoyer ma demande
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </>
              )}
            </button>

            {/* Fallback WhatsApp */}
            <p className="mt-4 text-center text-xs text-gris">
              Pas de formulaire ?{" "}
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="text-or link-underline"
              >
                Écris-nous sur WhatsApp
              </a>
            </p>
          </motion.form>
        )}
      </AnimatePresence>

      <style jsx>{`
        :global(.input-base) {
          width: 100%;
          background-color: var(--noir-3);
          border: 1px solid rgba(75, 85, 99, 0.3);
          color: var(--blanc);
          padding: 0.875rem 1rem;
          font-size: 0.875rem;
          transition: all 0.3s ease;
          font-family: var(--font-dm-sans), system-ui, sans-serif;
        }
        :global(.input-base:focus) {
          border-color: var(--or);
          background-color: var(--noir-2);
          outline: none;
          box-shadow: 0 0 0 3px rgba(245, 183, 0, 0.1);
        }
        :global(.input-base::placeholder) {
          color: var(--gris);
        }
      `}</style>
    </div>
  );
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="font-mono text-[10px] uppercase tracking-widest text-gris-light">
        {label}
        {required && <span className="text-or"> *</span>}
      </span>
      {children}
      {error && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-1.5 text-xs text-danger"
        >
          <AlertCircle className="h-3 w-3" aria-hidden />
          {error}
        </motion.span>
      )}
    </label>
  );
}
