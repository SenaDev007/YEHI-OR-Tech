"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "./Button";
import { Send } from "lucide-react";

const contactSchema = z.object({
  name: z.string().min(2, "Nom requis"),
  email: z.string().email("Email invalide"),
  company: z.string().optional(),
  service: z.string().min(1, "Veuillez choisir un service"),
  message: z.string().min(10, "Message trop court"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const ContactForm = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormValues) => {
    // Simulation d'envoi
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log(data);
    alert("Message envoyé avec succès ! Nous vous répondrons sous 48h.");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-mono text-or uppercase tracking-widest ml-1">Nom complet</label>
          <input 
            {...register("name")}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-or/50 outline-none transition-all"
            placeholder="Jean Dupont"
          />
          {errors.name && <p className="text-red-400 text-[10px] ml-1">{errors.name.message}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-xs font-mono text-or uppercase tracking-widest ml-1">Email professionnel</label>
          <input 
            {...register("email")}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-or/50 outline-none transition-all"
            placeholder="jean@entreprise.com"
          />
          {errors.email && <p className="text-red-400 text-[10px] ml-1">{errors.email.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-mono text-or uppercase tracking-widest ml-1">Entreprise (Optionnel)</label>
          <input 
            {...register("company")}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-or/50 outline-none transition-all"
            placeholder="Ma Société SARL"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-mono text-or uppercase tracking-widest ml-1">Service souhaité</label>
          <select 
            {...register("service")}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-or/50 outline-none transition-all appearance-none"
          >
            <option value="" className="bg-noir-profond">Choisir un service</option>
            <option value="web" className="bg-noir-profond">Site Web</option>
            <option value="saas" className="bg-noir-profond">Application SaaS</option>
            <option value="ia" className="bg-noir-profond">Agent IA</option>
            <option value="automation" className="bg-noir-profond">Automatisation</option>
            <option value="branding" className="bg-noir-profond">Design & Branding</option>
            <option value="marketing" className="bg-noir-profond">Marketing Digital</option>
          </select>
          {errors.service && <p className="text-red-400 text-[10px] ml-1">{errors.service.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-mono text-or uppercase tracking-widest ml-1">Votre projet</label>
        <textarea 
          {...register("message")}
          rows={5}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-or/50 outline-none transition-all"
          placeholder="Décrivez brièvement votre besoin..."
        />
        {errors.message && <p className="text-red-400 text-[10px] ml-1">{errors.message.message}</p>}
      </div>

      <Button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full py-5 group"
      >
        {isSubmitting ? "Envoi en cours..." : "Envoyer ma demande"}
        <Send className="ml-2 w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
      </Button>
    </form>
  );
};

export default ContactForm;
