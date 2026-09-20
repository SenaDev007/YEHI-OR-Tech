"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CheckCircle2, Send } from "lucide-react";
import { Button } from "./Button";

const services = ["Conception graphique", "Identité visuelle", "Création de site web", "Site e-commerce", "Application web ou mobile", "Agent IA", "Automatisation métier", "Pack Crédibilité en ligne", "Marketing digital & réseaux sociaux", "SEO & référencement", "Maintenance & gestion de site", "Conseil & accompagnement", "Autre"];
const budgets = ["Moins de 50 000 FCFA", "50 000 – 150 000 FCFA", "150 000 – 500 000 FCFA", "500 000 FCFA et plus", "À discuter"];
const contactSchema = z.object({
  name: z.string().min(2, "Nom requis"), email: z.string().email("Email invalide"), phone: z.string().optional(), company: z.string().optional(), service: z.string().min(1, "Veuillez choisir un service"), budget: z.string().optional(), timeline: z.string().optional(), message: z.string().min(20, "Décrivez votre besoin en 20 caractères minimum"), consent: z.boolean().refine((value) => value, "Votre accord est requis"),
});
type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactForm() {
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ContactFormValues>({ resolver: zodResolver(contactSchema), defaultValues: { consent: false } });
  const onSubmit = async (data: ContactFormValues) => {
    const subject = encodeURIComponent(`Demande de projet — ${data.service}`);
    const body = encodeURIComponent(`Nom : ${data.name}\nEmail : ${data.email}\nTéléphone : ${data.phone || "Non renseigné"}\nEntreprise : ${data.company || "Non renseignée"}\nService : ${data.service}\nBudget : ${data.budget || "À discuter"}\nDélai : ${data.timeline || "Non renseigné"}\n\nProjet :\n${data.message}`);
    window.open(`mailto:contact@yehiortech.com?subject=${subject}&body=${body}`, "_self");
    setSent(true);
  };
  if (sent) return <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-7 text-emerald-900"><CheckCircle2 className="mb-4 h-8 w-8 text-emerald-600" /><h3 className="text-2xl">Votre demande est prête</h3><p className="mt-2 text-sm leading-6">Votre logiciel de messagerie va s’ouvrir pour finaliser l’envoi à notre équipe.</p></div>;
  return <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
    <div className="grid gap-6 sm:grid-cols-2">
      <Field label="Nom complet" error={errors.name?.message}><input {...register("name")} className="form-input" placeholder="Jean Dupont" /></Field>
      <Field label="Email professionnel" error={errors.email?.message}><input {...register("email")} type="email" className="form-input" placeholder="jean@entreprise.com" /></Field>
      <Field label="Téléphone"><input {...register("phone")} type="tel" className="form-input" placeholder="+229 ..." /></Field>
      <Field label="Entreprise"><input {...register("company")} className="form-input" placeholder="Ma Société" /></Field>
      <Field label="Service souhaité" error={errors.service?.message}><select {...register("service")} className="form-input"><option value="">Choisir un service</option>{services.map((item) => <option key={item}>{item}</option>)}</select></Field>
      <Field label="Budget approximatif"><select {...register("budget")} className="form-input"><option value="">À discuter</option>{budgets.map((item) => <option key={item}>{item}</option>)}</select></Field>
      <Field label="Délai souhaité"><input {...register("timeline")} className="form-input" placeholder="Ex. dans 1 mois" /></Field>
    </div>
    <Field label="Description du projet" error={errors.message?.message}><textarea {...register("message")} rows={6} className="form-input resize-y" placeholder="Décrivez votre besoin, vos objectifs et les fonctionnalités souhaitées..." /></Field>
    <label className="flex items-start gap-3 text-xs leading-5 text-gris"><input {...register("consent")} type="checkbox" className="mt-1 h-4 w-4 accent-bleu-tech" /><span>J’accepte d’être recontacté au sujet de ma demande.{errors.consent && <span className="ml-2 text-red-600">{errors.consent.message}</span>}</span></label>
    <Button type="submit" disabled={isSubmitting} variant="gold" className="w-full py-4">{isSubmitting ? "Préparation…" : "Envoyer ma demande"}<Send className="h-4 w-4" /></Button>
    <p className="text-center text-xs text-gris">La demande prépare un email adressé à contact@yehiortech.com.</p>
  </form>;
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) { return <div className="space-y-2"><label className="block text-xs font-semibold uppercase tracking-[.14em] text-bleu-tech">{label}</label>{children}{error && <p className="text-xs text-red-600">{error}</p>}</div>; }
