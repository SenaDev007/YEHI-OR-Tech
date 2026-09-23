# YEHI OR Tech — Site web officiel

> **« Que la lumière soit ✦ »**

Site web production-ready pour **YEHI OR Tech**, agence digitale augmentée par l'IA basée à Parakou, Bénin. Huit pôles de services, un seul interlocuteur.

## Stack technique

- **Next.js 14** (App Router) — React 18
- **TypeScript 5** (strict mode)
- **Tailwind CSS 3** avec design tokens personnalisés
- **Framer Motion** — animations au scroll, transitions de page
- **react-hook-form + Zod** — formulaire de contact validé
- **lucide-react** — icônes
- **next/font** — Cormorant Garamond, DM Sans, DM Mono (Google Fonts)

## Démarrage

```bash
# Installation des dépendances
npm install

# Lancement en dev
npm run dev

# Build production
npm run build

# Démarrage en production
npm start
```

## Variables d'environnement

Copier `.env.example` en `.env.local` :

```bash
NEXT_PUBLIC_SITE_URL=https://yehiortech.com
CONTACT_EMAIL=contact@yehiortech.com
NEXT_PUBLIC_WHATSAPP_NUMBER=2290141360803
```

## Structure

```
/src
  /app
    layout.tsx            → Layout global, fonts, metadata de base
    page.tsx              → Page d'accueil
    /services             → Liste + détail des 8 services
    /tarifs               → Packs START et BUSINESS
    /portfolio            → Projets avec filtres
    /about                → Histoire, mission, vision, valeurs
    /contact              → Formulaire + infos de contact
    /api/contact          → Endpoint POST formulaire
    sitemap.ts            → Sitemap dynamique
    robots.ts             → robots.txt
    not-found.tsx         → Page 404
    globals.css           → Design system complet
  /components
    /layout               → Navbar, Footer, MobileMenu
    /sections             → Hero, StatsBar, ServicesGrid, etc.
    /ui                   → Button, ServiceCard, PricingCard, etc.
    /icons                → WhatsAppIcon
  /data                   → services, portfolio, pricing, navigation, values, process, stats, site
  /lib                    → utils, animations (Framer Motion variants)
```

## Design system

- **Palette extraite du logo officiel** (voir `globals.css`)
- **Boutons primaires** : clip-path angulaire, fond or `#F5B700`, texte noir
- **Cartes** : bordure top or animée au hover, fond `#0D1117`
- **Section tag** : ligne or + texte mono uppercase
- **Coins décoratifs** 20×20px sur les frames
- **Halos radiaux** or et bleu en arrière-plan des sections

## Pages

| Page | URL |
|---|---|
| Accueil | `/` |
| Services | `/services` |
| Détail service | `/services/[slug]` |
| Tarifs & Packs | `/tarifs` |
| Portfolio | `/portfolio` |
| À propos | `/about` |
| Contact | `/contact` |

## Contraintes respectées (CDC v4.0 section 16)

- ✅ Aucun faux témoignage client
- ✅ Aucun client inventé dans le portfolio
- ✅ Aucune promesse non vérifiable
- ✅ Code production-ready (zéro `console.log`, zéro `any` TypeScript)
- ✅ Responsive parfait de 320px à 1920px
- ✅ Accessibilité WCAG AA (focus visible, contraste 4.5:1)
- ✅ Design 100% original (aucun template reconnaissable)
- ✅ Animations non bloquantes (`prefers-reduced-motion` respecté)
- ✅ TypeScript strict (zéro `any`)
- ✅ Données séparées du code (fichiers `/data/*.ts`)
- ✅ Déployable sur Vercel sans configuration supplémentaire

## Déploiement sur Vercel

1. Push le repo sur GitHub
2. Connecter le repo à Vercel
3. Variables d'environnement à configurer dans Vercel
4. Deploy — c'est tout

## Contact

- **Email :** contact@yehiortech.com
- **WhatsApp :** +229 01 41 36 08 03
- **Site :** https://yehiortech.com

---

© YEHI OR Tech. Tous droits réservés.
*« Que la lumière soit ✦ »*
