"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Send, CheckCircle2 } from "lucide-react";
import { Button } from "./Button";

const contactSchema = z.object({
  name: z.string().min(2, "Nom requis"),
  email: z.string().email("Email invalide"),
  company: z.string().optional(),
  service: z.string().min(1, "Veuillez choisir un service"),
  message: z.string().min(10, "Message trop court"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactForm() {
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ContactFormValues>({ resolver: zodResolver(contactSchema) });

  const onSubmit = async (data: ContactFormValues) => {
    const subject = encodeURIComponent(`Demande de projet — ${data.service}`);
    const body = encodeURIComponent(`Nom : ${data.name}\nEmail : ${data.email}\nEntreprise : ${data.company || "Non renseignée"}\nService : ${data.service}\n\nProjet :\n${data.message}`);
    window.open(`mailto:contact@yehiortech.com?subject=${subject}&body=${body}`, "_self");
    setSent(true);
  };

  if (sent) return <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-7 text-emerald-900"><CheckCircle2 className="mb-4 h-8 w-8 text-emerald-600" /><h3 className="text-2xl">Votre demande est prête</h3><p className="mt-2 text-sm leading-6">Votre logiciel de messagerie va s’ouvrir pour finaliser l’envoi à notre équipe.</p></div>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field label="Nom complet" error={errors.name?.message}><input {...register("name")} placeholder="Jean Dupont" className="form-input" /></Field>
        <Field label="Email professionnel" error={errors.email?.message}><input {...register("email")} type="email" placeholder="jean@entreprise.com" className="form-input" /></Field>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field label="Entreprise (optionnel)"><input {...register("company")} placeholder="Ma Société" className="form-input" /></Field>
        <Field label="Service souhaité" error={errors.service?.message}><select {...register("service")} className="form-input"><option value="">Choisir un service</option><option value="Site Web">Site Web</option><option value="Application SaaS">Application SaaS</option><option value="Agent IA">Agent IA</option><option value="Automatisation">Automatisation</option><option value="Design & Branding">Design & Branding</option><option value="Marketing Digital">Marketing Digital</option></select></Field>
      </div>
      <Field label="Votre projet" error={errors.message?.message}><textarea {...register("message")} rows={6} placeholder="Décrivez brièvement votre besoin..." className="form-input resize-y" /></Field>
      <Button type="submit" disabled={isSubmitting} variant="gold" className="w-full py-4">{isSubmitting ? "Préparation..." : "Préparer ma demande"}<Send className="h-4 w-4" /></Button>
      <p className="text-center text-xs text-gris">Le bouton prépare un email adressé directement à contact@yehiortech.com.</p>
    </form>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return <div className="space-y-2"><label className="block text-xs font-semibold uppercase tracking-[.14em] text-bleu-tech">{label}</label>{children}{error && <p className="text-xs text-red-600">{error}</p>}</div>;
}
