import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge classes Tailwind avec gestion des conflits.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formate un prix avec séparateur de milliers (sans devise).
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("fr-FR").format(price);
}

/**
 * Formate un prix en FCFA.
 */
export function formatFCFA(price: number): string {
  return new Intl.NumberFormat("fr-FR").format(price) + " FCFA";
}

/**
 * Génère un lien WhatsApp avec message prérempli.
 * Le numéro peut être passé en paramètre (depuis la DB via SettingsProvider)
 * sinon utilise la valeur par défaut.
 */
export function whatsappLink(
  message?: string,
  service?: string,
  phone: string = "2290141360803"
): string {
  let text = message || "Bonjour YEHI OR Tech, je m'appelle [NOM]. J'aimerais discuter d'un projet numérique. Mon numéro : [TÉLÉPHONE]";
  if (service) {
    text = `Bonjour YEHI OR Tech, je m'appelle [NOM]. Je suis intéressé(e) par : ${service}. [MESSAGE LIBRE] Mon numéro : [TÉLÉPHONE]`;
  }
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

/**
 * Tronque un texte à n caractères.
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trimEnd() + "…";
}

/**
 * Convertit une chaîne en slug URL-safe.
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}
