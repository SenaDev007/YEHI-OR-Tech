/**
 * Liens de navigation (navbar, footer, mobile menu).
 */

export type NavLink = { label: string; href: string };

export const navLinks: NavLink[] = [
  { label: "Services", href: "/services" },
  { label: "Tarifs", href: "/tarifs" },
  { label: "Réalisations", href: "/portfolio" },
  { label: "À propos", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const footerServiceLinks: NavLink[] = [
  { label: "Informatique & assistance", href: "/services/informatique-assistance" },
  { label: "Développement logiciel", href: "/services/developpement-logiciel" },
  { label: "Academia", href: "/services/academia" },
  { label: "Infographie & identité visuelle", href: "/services/infographie-identite-visuelle" },
  { label: "Impression & personnalisation", href: "/services/impression-personnalisation" },
  { label: "Rédaction & mise en forme", href: "/services/redaction-mise-en-forme" },
  { label: "IA & automatisation", href: "/services/ia-automatisation" },
  { label: "Conseil & formation", href: "/services/conseil-formation" },
];

export const footerProductLinks: NavLink[] = [
  { label: "Academia", href: "/services/academia" },
  { label: "MédiHelm", href: "/portfolio#medihelm" },
  { label: "Travel Helm", href: "/portfolio#travelhelm" },
  { label: "NumériSeal Bénin", href: "/portfolio#numeriseal-benin" },
  { label: "AfriBayit", href: "/portfolio#afribayit" },
];

export const footerCompanyLinks: NavLink[] = [
  { label: "À propos", href: "/about" },
  { label: "Tarifs", href: "/tarifs" },
  { label: "Réalisations", href: "/portfolio" },
  { label: "Contact", href: "/contact" },
];

export const footerSocialLinks = [
  { label: "LinkedIn", href: "https://www.linkedin.com/company/yehi-or-tech", icon: "Linkedin" },
  { label: "Facebook", href: "https://www.facebook.com/yehiortech", icon: "Facebook" },
  { label: "WhatsApp", href: "https://wa.me/2290141360803", icon: "MessageCircle" },
];
