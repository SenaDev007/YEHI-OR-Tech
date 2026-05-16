# CAHIER DES CHARGES — Site Web YEHI OR Tech
**Version 2.0 — Mai 2025**
**Destinataire : Google Antigravity**
**Commanditaire : Dawes S. Akpowi Tohou — Fondateur, YEHI OR Tech**

---

## 0. Instruction générale

Tu es un développeur web senior, expert en UI/UX, design system premium, animations avancées (GSAP / Framer Motion), performance web et SEO technique.

Tu vas créer un site web professionnel **complet, production-ready** pour YEHI OR Tech.

### Références design obligatoires

| Référence | Ce qu'on en extrait |
|---|---|
| **sheragency.com** | Niveau d'animations au scroll, transitions de page fluides, hover states sophistiqués, typographie expressive, hiérarchie visuelle forte, sections épurées à fort impact |
| **waouh-monde.com** | Complétude de l'offre de services, structure des packs tarifaires avec badge prix, couverture 360° des besoins digitaux d'une entreprise locale africaine |

Le site ne doit ressembler à aucun template existant. Il doit avoir une identité visuelle forte, mémorable et premium — celle d'une agence tech africaine de niveau international.

---

## 1. Identité du projet

### 1.1 L'entreprise

- **Nom :** YEHI OR Tech
- **Siège :** Parakou, Bénin — Afrique de l'Ouest
- **Fondateur :** Dawes S. Akpowi Tohou
- **Domaine :** yehiortech.com
- **Email :** contact@yehiortech.com

### 1.2 Signification du nom

**YEHI OR** = **"Que la lumière soit"** en hébreu.

L'identité visuelle et éditoriale doit incarner cette signification : lumière, clarté, transformation, excellence, intelligence et impact.

### 1.3 Positionnement

YEHI OR Tech est une **agence digitale augmentée par l'IA**, spécialisée dans :

- Le développement web et mobile
- La création d'agents IA
- L'automatisation des processus métiers
- La conception graphique et production de contenu
- Le marketing digital et gestion des réseaux sociaux
- La crédibilité en ligne (référencement local, emails pro, annuaires)
- Le conseil et l'accompagnement à la transformation numérique

### 1.4 Message central

> YEHI OR Tech aide les entreprises, entrepreneurs et organisations à créer une présence digitale professionnelle, automatiser leurs processus et transformer leurs idées en solutions numériques concrètes qui produisent des résultats réels.

---

## 2. Objectifs du site

1. Présenter YEHI OR Tech comme une agence digitale sérieuse, moderne et à fort impact.
2. Couvrir l'intégralité du spectre des services digitaux.
3. Convertir les visiteurs en demandes de devis ou prises de contact.
4. Inspirer confiance dès les 3 premières secondes.
5. Positionner YEHI OR Tech comme acteur de référence en Afrique francophone.
6. Servir de base évolutive vers un blog, un espace client et une vitrine SaaS.

---

## 3. Stack technique

### Framework et langage

```
Next.js 14 (App Router)
TypeScript (strict mode)
Tailwind CSS (avec design tokens personnalisés)
```

### Animations — niveau sheragency.com obligatoire

```
GSAP + ScrollTrigger   → animations au scroll, timeline, pin sections, scrub
Framer Motion          → transitions de page, composants interactifs, layout animations
Lenis                  → smooth scroll ultra-fluide
```

### Composants et utilitaires

```
lucide-react           → icônes
clsx + CVA             → classes conditionnelles
react-hook-form + zod  → formulaire de contact validé
next/image             → optimisation images
next/font              → polices optimisées
next-sitemap           → génération automatique sitemap.xml
```

### Performance cible

```
LCP < 2.5s
CLS < 0.1
FID < 100ms
Images en WebP/AVIF
Lazy loading sur tous les blocs hors viewport
Code splitting automatique Next.js
prefers-reduced-motion respecté sur toutes les animations
```

---

## 4. Design System

### 4.1 Palette de couleurs

```css
:root {
  /* Fonds */
  --noir-profond:   #080A0F;
  --noir-2:         #0D1117;
  --noir-3:         #141921;
  --bleu-nuit:      #071A2F;
  --bleu-tech:      #0B3D91;
  --bleu-medium:    #1A2744;

  /* Accent principal — L'or de la lumière */
  --or:             #C9A84C;
  --or-light:       #E8C96A;
  --or-pale:        #F5E6B8;
  --or-vivid:       #F5B700;

  /* Textes */
  --blanc:          #F8F5EE;
  --gris-light:     #C5C8D0;
  --gris:           #8A8F9E;
  --gris-dark:      #4B5563;

  /* Statuts */
  --success:        #4ADE80;
  --warning:        #FBBF24;
  --danger:         #F87171;
}
```

### 4.2 Typographie

```
Display / Titres      → Cormorant Garamond (serif élégant, poids 300–700)
Corps / UI            → DM Sans (sans-serif propre, poids 300–600)
Mono / Labels / Tags  → DM Mono (poids 400–500)
```

Règles typographiques :
- H1 : `clamp(52px, 8vw, 96px)` — letter-spacing négatif `-0.02em`
- H2 : `clamp(36px, 5vw, 56px)` — letter-spacing `-0.01em`
- Corps : `15–17px` — line-height `1.7`
- Labels mono : `10–11px` — letter-spacing `0.2em` — uppercase

### 4.3 Éléments visuels distinctifs

- **Clip-path angulaires** sur les boutons primaires : `polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))`
- **Grilles CSS subtiles** en fond hero (opacity 3–5%, masquées avec radial-gradient)
- **Halos radiaux** en arrière-plan des sections (couleur or et bleu, opacity 6–12%)
- **Bordures or à 1px** sur les cartes au hover avec transition fluide
- **Lignes de progression** animées entre les étapes de processus (GSAP DrawSVG)
- **Badges coin coupé** pour les prix et statuts (même clip-path que les boutons)
- **Coins décoratifs** sur les frames et visuels (style technique, 20×20px)
- **Section tag** : ligne or + texte mono uppercase or (pattern identifiant chaque section)

### 4.4 Animations — spécifications détaillées

#### Au chargement de page (GSAP)
```javascript
// Stagger reveal hero
gsap.fromTo([eyebrow, title, subtitle, cta], 
  { opacity: 0, y: 30 },
  { opacity: 1, y: 0, stagger: 0.2, duration: 0.8, ease: "power3.out" }
)
```

#### Au scroll (GSAP ScrollTrigger)
- Sections révélées avec `opacity: 0 → 1` + `y: 40 → 0` au passage
- Cartes de services : entrée en cascade (stagger 80ms)
- Compteurs stats : count-up animé (0 → valeur finale) au passage
- Ligne de processus : dessin progressif SVG path ou pseudo-element height
- Images/visuels : léger parallaxe vertical (ratio 0.3)

#### Hover states (CSS + Framer Motion)
- Cartes : `translateY(-6px)` + `box-shadow: 0 20px 60px rgba(201,168,76,0.15)` + bordure or
- Boutons primaires : scale légère + glow doré
- Liens nav : underline qui se dessine de gauche à droite (scaleX 0→1)
- Icônes services : rotation légère 5° ou scale 1.1

#### Transitions de page (Framer Motion)
```javascript
// Page exit
{ opacity: 0, scale: 0.98, transition: { duration: 0.3 } }
// Page enter
{ opacity: 0, y: 20 } → { opacity: 1, y: 0, transition: { duration: 0.4 } }
```

---

## 5. Architecture des fichiers

```
/src
  /app
    layout.tsx                    → Layout global, fonts, metadata de base
    page.tsx                      → Page d'accueil
    /about
      page.tsx
    /services
      page.tsx
      /[slug]
        page.tsx
    /tarifs
      page.tsx
    /portfolio
      page.tsx
    /contact
      page.tsx
  /components
    /layout
      Navbar.tsx
      Footer.tsx
      MobileMenu.tsx
      PageTransition.tsx
    /sections
      Hero.tsx
      StatsBar.tsx
      ServicesGrid.tsx
      PacksPricing.tsx
      WhyChooseUs.tsx
      IASection.tsx
      ProcessSteps.tsx
      PortfolioPreview.tsx
      CTASection.tsx
    /ui
      Button.tsx
      SectionHeader.tsx
      ServiceCard.tsx
      PortfolioCard.tsx
      PricingCard.tsx
      FeatureItem.tsx
      ValueCard.tsx
      ContactForm.tsx
      WhatsAppButton.tsx
      AnimatedCounter.tsx
      ProcessLine.tsx
      Badge.tsx
      Tag.tsx
  /data
    services.ts
    portfolio.ts
    navigation.ts
    values.ts
    process.ts
    pricing.ts
    stats.ts
  /lib
    utils.ts
    animations.ts                 → Variants Framer Motion réutilisables
    gsap.ts                       → Config GSAP + ScrollTrigger
    lenis.ts                      → Config smooth scroll
  /styles
    globals.css
  /public
    /images
    /og
      yehiortech-og.png           → 1200×630px pour Open Graph
robots.txt
next.config.ts
tailwind.config.ts
```

---

## 6. Pages à créer

| Page | URL | Priorité |
|---|---|---|
| Accueil | `/` | P0 |
| Services | `/services` | P0 |
| Détail service | `/services/[slug]` | P1 |
| Tarifs & Packs | `/tarifs` | P0 |
| Portfolio | `/portfolio` | P0 |
| À propos | `/about` | P0 |
| Contact | `/contact` | P0 |

---

## 7. Page d'accueil — Structure détaillée

### 7.1 Navbar

- Logo texte : **YEHI OR Tech** (OR en couleur or `#C9A84C`)
- Liens : Accueil · Services · Tarifs · Réalisations · À propos · Contact
- Bouton CTA : **Demander un devis** (fond or, clip-path angulaire, texte noir)
- Comportement :
  - Transparente au top de page
  - `backdrop-blur(20px)` + fond `rgba(8,10,15,0.95)` au scroll
  - Bordure bottom `rgba(201,168,76,0.15)` au scroll
  - Transition `all 0.4s ease`
  - Menu hamburger mobile → overlay plein écran noir avec liens centrés, animation stagger entrée

### 7.2 Hero Section

**Objectif :** Impact immédiat. Compréhension en 3 secondes.

**Titre principal :**
```
Donnez de la lumière
à votre présence digitale.
```

**Sous-titre :**
```
Sites web, applications, agents IA, automatisation,
marketing digital et crédibilité en ligne —
YEHI OR Tech conçoit des solutions numériques concrètes
pour les entreprises qui veulent avancer.
```

**Boutons d'action :**
- Primaire (or, clip-path) : `Demander un devis →`
- Outline (blanc, bordure) : `Découvrir nos services`
- Lien WhatsApp (vert #25D366) : `💬 Discuter sur WhatsApp`

**Visuel hero (composition CSS/HTML) :**
Construire une illustration abstraite représentant l'univers digital de YEHI OR Tech :
- Anneau rotatif lent avec point doré (animation `rotate` 20s infinite)
- Halo or central (radial-gradient, opacity 10%)
- Grille de fond (lignes or à 4% d'opacity)
- 3 cartes flottantes animées (subtle `translateY` oscillation) représentant : Agent IA · Site Web · Automatisation
- Chaque carte : fond `rgba(26,39,68,0.8)`, backdrop-blur, icône + label

**Animations hero :**
- Stagger reveal des éléments : eyebrow → titre → sous-titre → boutons (délais 0.2s)
- Visuel : fade-in depuis le bas avec délai 0.6s
- Indicateur de scroll : ligne verticale animée en bas de section

### 7.3 Barre de Stats

4 métriques animées au scroll (AnimatedCounter) :

| Valeur | Label |
|---|---|
| 8+ | Services couverts |
| 5+ | Produits SaaS actifs |
| 100% | Orienté résultats |
| 48h | Délai de réponse |

Design : séparateurs verticaux or, fond légèrement plus clair que le fond principal, bordures top/bottom or à 10% d'opacity.

### 7.4 Section Services Principaux

**Section tag :** `Nos Services`

**Titre :**
```
Ce que nous construisons pour vous
```

**Description :**
```
Nous ne fabriquons pas seulement des outils numériques.
Nous créons des systèmes qui résolvent de vrais problèmes,
automatisent ce qui peut l'être, et donnent à votre entreprise un avantage concret.
```

**8 services en grille (4×2 desktop, 2×4 tablette, 1×8 mobile) :**

#### 01 — Conception Graphique
- Icône : `Palette`
- Description : Flyers, affiches, cartes de visite, cartes d'invitation, visuels réseaux sociaux, identité visuelle et supports de communication professionnels. Une image propre dès le premier regard.
- Tags : `Flyers` · `Cartes de visite` · `Social Media` · `Identité visuelle`

#### 02 — Création de Sites Web
- Icône : `Globe`
- Description : Sites vitrines, sites d'entreprise, landing pages, sites pour écoles et commerces. Modernes, rapides, compatibles mobile et conçus pour convertir vos visiteurs.
- Tags : `Site vitrine` · `Landing page` · `E-commerce` · `Responsive`

#### 03 — Applications Web & Mobile
- Icône : `Monitor`
- Description : Plateformes SaaS, applications de gestion, tableaux de bord administratifs, outils métiers sur mesure. Des systèmes structurés qui résolvent de vrais problèmes.
- Tags : `SaaS` · `Dashboard` · `API REST` · `Mobile`

#### 04 — Agents IA
- Icône : `Bot`
- Description : Agents WhatsApp, Facebook, web. Support client automatisé, qualification de prospects, prise de rendez-vous. L'IA au service de votre productivité quotidienne, 24h/24.
- Tags : `WhatsApp Bot` · `Support client` · `Claude API` · `Facebook`

#### 05 — Automatisation Métier
- Icône : `Zap`
- Description : Workflows intelligents, relances automatiques, notifications, gestion des prospects, connexion entre vos outils. Si une tâche est répétitive, elle peut être automatisée.
- Tags : `n8n` · `Workflows` · `Intégrations` · `APIs`

#### 06 — Marketing Digital & Réseaux Sociaux
- Icône : `TrendingUp`
- Description : Gestion des réseaux sociaux, création de contenu, publicité ciblée (Facebook Ads, Google Ads), stratégie de croissance et community management professionnel.
- Tags : `Facebook Ads` · `Google Ads` · `Community` · `Contenu`

#### 07 — Crédibilité en Ligne
- Icône : `ShieldCheck`
- Description : Emails professionnels sur votre domaine, fiche Google Maps, indexation Google Search Console, inscription dans les annuaires professionnels, configuration DNS anti-spam. Votre entreprise prend son rang sur internet.
- Tags : `Emails pro` · `Google Maps` · `SEO local` · `Annuaires`

#### 08 — Conseil & Accompagnement Digital
- Icône : `Compass`
- Description : Audit de votre présence numérique, stratégie digitale, choix des outils, structuration des processus. Nous vous guidons à chaque étape avec clarté et méthode.
- Tags : `Audit digital` · `Stratégie` · `Formation` · `Suivi`

**Animations :** cartes révélées en cascade au scroll, stagger 80ms, `opacity: 0 → 1` + `y: 40 → 0`.

**Hover carte :**
- `translateY(-6px)`
- Bordure top `2px or` qui apparaît (scaleX 0→1)
- Fond légèrement plus clair
- Icône : scale 1.05

### 7.5 Section Packs Crédibilité en Ligne

**Section tag :** `Tarifs`

**Titre :**
```
Boostez votre crédibilité en ligne
```

**Sous-titre :**
```
Posez les fondations numériques de votre image de marque
avec nos Packs Start et Business.
```

**Deux cards pricing côte à côte :**

#### Pack START — 35 000 FCFA
- Badge vert `START` (clip-path angulaire, fond #16A34A)
- Prix : `35 000 FCFA` (typographie display, or)
- Contenu :
  - ✦ 5 adresses email professionnelles
  - ✦ Création et configuration de la fiche établissement Google Maps
  - ✦ Indexation et référencement dans Google Search Console
  - ✦ Inscription dans 3 annuaires professionnels ciblés
  - ✦ Configuration des enregistrements DNS pour éviter les spams
- CTA : `Choisir le Pack Start →`

#### Pack BUSINESS — 50 000 FCFA
- Badge or `BUSINESS` (clip-path angulaire, fond var(--or))
- Badge flottant : `Recommandé` (haut droite, fond or, texte noir)
- Prix : `50 000 FCFA` (typographie display, or)
- Contenu :
  - ✦ 25 adresses email professionnelles
  - ✦ Création et configuration de la fiche établissement Google Maps
  - ✦ Indexation et référencement dans Google Search Console
  - ✦ Inscription dans 5 annuaires professionnels ciblés
  - ✦ Configuration des enregistrements DNS pour éviter les spams
- CTA : `Choisir le Pack Business →`

**Design des cards :**
- Fond : `var(--noir-2)` avec bordure or 10% opacity
- Hover : élévation + bordure or 40% + glow subtil
- Pack Business : légère surbrillance or en fond (2% opacity) + bordure légèrement plus visible
- Animation entrée : Pack START depuis la gauche, Pack BUSINESS depuis la droite

**Lien sous les packs :**
```
Voir tous nos tarifs et packs →  (lien vers /tarifs)
```

### 7.6 Section "Pourquoi choisir YEHI OR Tech"

**Layout 2 colonnes :** arguments (gauche) + métriques visuelles (droite)

**Section tag :** `Pourquoi nous choisir`

**Titre :**
```
Ce qui nous différencie
```

**4 arguments (colonne gauche) :**

Chaque argument : icône + titre + description, fond `var(--noir-2)`, hover avec bordure or.

1. **Solutions adaptées aux réalités locales** — Mobile Money, contraintes réseau, usages africains. Nos solutions sont pensées pour ici, pas copiées d'ailleurs.
2. **IA & Automatisation intégrées** — Chaque solution intègre nativement l'intelligence artificielle pour maximiser votre productivité sans effort supplémentaire de votre part.
3. **Approche 360° complète** — Du logo au SaaS, de l'email pro à l'agent IA. Un seul interlocuteur pour tous vos besoins digitaux.
4. **Accompagnement transparent** — Délais clairs, communication directe, suivi régulier. Vous savez toujours où en est votre projet.

**Métriques visuelles (colonne droite) :**

4 metric cards empilées avec icône + valeur + label. Hover : `translateX(8px)` + bordure or.

- ⚡ `48h` — Délai de réponse garanti
- 🌍 `5+` — Pays couverts par nos solutions
- 🤖 `100%` — Projets avec IA intégrée
- 📱 `Mobile First` — Toutes nos solutions

**Citation encadrée sous les métriques :**
```
"Si une tâche est répétitive,
elle peut être automatisée."

— YEHI OR Tech, Philosophie produit
```
Design : bordure gauche or 2px, fond bleu nuit 30% opacity.

### 7.7 Section IA & Automatisation

**Section tag :** `Intelligence Artificielle`

**Titre :**
```
L'intelligence artificielle
au service de votre productivité
```

**Texte :**
```
Nous aidons les entreprises à intégrer des agents IA
et des automatisations concrètes pour répondre plus vite
aux clients, gérer les demandes, qualifier les prospects,
publier du contenu et réduire les tâches répétitives.
```

**6 cas d'usage en grille 3×2 :**
- 🤖 Agent IA WhatsApp 24h/24
- 💬 Assistant client web intégré
- 📧 Automatisation des relances commerciales
- 📱 Publication automatique sur les réseaux
- 🎯 Qualification intelligente des prospects
- 📅 Prise de rendez-vous automatisée

Design : fond `var(--bleu-nuit)` légèrement différent, halo or central, cartes avec micro-animation hover (scale icône).

### 7.8 Section Processus de Travail

**Section tag :** `Notre Processus`

**Titre :**
```
Comment nous travaillons
```

**6 étapes avec ligne de progression animée (GSAP) :**

| N° | Étape | Description |
|---|---|---|
| 01 | Analyse du besoin | Comprendre votre activité, vos objectifs et les problèmes à résoudre avant de proposer quoi que ce soit. |
| 02 | Proposition de solution | Architecture technique, choix des outils, estimation du budget et du délai. Tout est clair avant de démarrer. |
| 03 | Design & Architecture | Maquettes, structure technique et validation du plan avec vous. |
| 04 | Développement | Construction de la solution avec rigueur et transparence. Vous suivez l'avancement à chaque étape. |
| 05 | Validation client | Tests, corrections et validation avec vous avant toute mise en ligne. Zéro surprise. |
| 06 | Livraison & Suivi | Déploiement et accompagnement post-livraison. Votre succès est notre indicateur. |

**Animation ligne :** Pseudo-element ou SVG path entre les cercles numérotés, dessiné progressivement au scroll avec GSAP ScrollTrigger scrub.

**Hover étape :** Cercle numéroté passe de bordure or → fond or (texte noir).

### 7.9 Section Portfolio Aperçu

**Section tag :** `Réalisations`

**Titre :**
```
Nos projets phares
```

**4 cartes portfolio :**

| Projet | Catégorie | Emoji | Statut |
|---|---|---|---|
| Academia Helm | Application SaaS | 🎓 | En développement |
| MédiHelm | Application SaaS | 💊 | En développement |
| NumériSeal Bénin | Civic Tech | 🛡️ | En développement |
| AfriBayit | Proptech | 🏠 | En développement |

Lien : `Voir toutes les réalisations →` → `/portfolio`

### 7.10 Section CTA Final

**Fond :** `var(--bleu-medium)` avec halos radiaux or

**Titre :**
```
Transformons votre idée
en solution concrète.
```

**Texte :**
```
Vous avez un projet, un besoin ou une idée numérique ?
Décrivez-le nous. Nous vous proposons une solution adaptée,
un délai réaliste et un prix transparent.
```

**Boutons :**
- `Demander un devis gratuit →` (or, clip-path)
- `💬 Discuter sur WhatsApp` (vert #25D366, clip-path)

---

## 8. Page Services `/services`

**Hero :**
- Titre : `Nos Services`
- Sous-titre : `De la conception graphique au SaaS, du marketing digital à l'agent IA — une couverture complète de vos besoins numériques.`

**Corps :** 8 blocs détaillés, un par service.

Chaque bloc :
```
[Icône + N°]  [Titre]
[Description complète — 3 à 4 phrases]
[Livrables — liste à puces]
[Bénéfices — liste à puces]
[CTA : Demander un devis pour ce service →]
```

**Navigation latérale sticky** (desktop) : liste des 8 services avec scroll spy — le service actif est mis en surbrillance or.

**Données centralisées** dans `/data/services.ts` :

```typescript
export type Service = {
  slug: string;
  title: string;
  icon: string;          // Nom du composant lucide-react
  shortDescription: string;
  fullDescription: string;
  deliverables: string[];
  benefits: string[];
  tags: string[];
  gradient: string;      // Couleur du fond de la card hero
};

export const services: Service[] = [
  {
    slug: "conception-graphique",
    title: "Conception Graphique",
    icon: "Palette",
    shortDescription: "Supports visuels professionnels pour renforcer votre image.",
    fullDescription: "...",
    deliverables: ["Flyers professionnels", "Affiches publicitaires", "Cartes de visite", "Cartes d'invitation", "Visuels réseaux sociaux", "Supports promotionnels"],
    benefits: ["Image professionnelle dès le premier regard", "Communication claire et cohérente", "Supports prêts à diffuser", "Identité visuelle mémorable"],
    tags: ["Flyers", "Cartes de visite", "Social Media", "Identité visuelle"],
    gradient: "linear-gradient(135deg, #2C1A2C 0%, #0D1117 100%)"
  },
  // ... 7 autres services
];
```

---

## 9. Page Tarifs `/tarifs`

### 9.1 Hero

- Section tag : `Tarifs & Packs`
- Titre : `Des prix clairs, des livrables précis`
- Sous-titre : `Pas de surprises. Chaque pack est décrit avec exactement ce qui est inclus.`

### 9.2 Packs Crédibilité en Ligne

Section identique au bloc 7.5 mais avec informations supplémentaires :

**Description étendue sous chaque livrable :**
- Emails pro : serveur SMTP configuré, accès webmail, compatible Outlook/Gmail
- Google Maps : fiche complète avec photos, horaires, description, catégorie
- Search Console : propriété vérifiée, sitemaps soumis, suivi des positions
- Annuaires : ciblés par secteur et localisation géographique
- DNS : enregistrements SPF, DKIM, DMARC configurés

**FAQ rapide (accordion) :**
- Quel est le délai de livraison ? → 3 à 5 jours ouvrés
- Que faut-il fournir pour démarrer ? → Nom de domaine, logo (si disponible), informations de l'entreprise
- Le support est-il inclus après livraison ? → Oui, 30 jours de support inclus

### 9.3 Autres packs (structure prête, contenus à compléter)

Prévoir la structure de composants `PricingCard` réutilisable pour ajouter ultérieurement :
- Pack Site Web Vitrine
- Pack Application Sur Mesure
- Pack Agent IA WhatsApp

```typescript
// /data/pricing.ts
export type Pack = {
  id: string;
  name: string;
  price: number;
  currency: "FCFA";
  badge?: string;
  badgeColor?: "green" | "gold" | "blue";
  recommended?: boolean;
  features: string[];
  cta: string;
  color: "blue" | "gold" | "dark";
  category: "credibilite" | "web" | "application" | "ia";
};
```

### 9.4 CTA bas de page

```
Besoin d'une offre sur mesure ?
Contactez-nous et nous établissons un devis adapté
à votre budget et vos objectifs.

[Demander un devis personnalisé →]
```

---

## 10. Page Portfolio `/portfolio`

### 10.1 Structure

1. Hero : titre + description + filtres par catégorie
2. Grille de projets (masonry ou grille uniforme)
3. CTA final

### 10.2 Filtres

- Tous · Sites Web · Applications · Design · Agents IA · Automatisation · Crédibilité

### 10.3 Projets — données dans `/data/portfolio.ts`

```typescript
export type Project = {
  id: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  status: "live" | "development" | "concept";
  thumbnail?: string;
  gradient: string;
  emoji: string;
  tech: string[];
};
```

**Projets réels à afficher :**

| # | Titre | Catégorie | Statut | Tech |
|---|---|---|---|---|
| 1 | Academia Helm | Application SaaS | En développement | Next.js · Node.js · PostgreSQL |
| 2 | MédiHelm | Application SaaS | En développement | React · Node.js · PostgreSQL |
| 3 | Travel Helm | Application SaaS | En développement | Next.js · PostgreSQL |
| 4 | NumériSeal Bénin | Civic Tech | En développement | Next.js 14 · NestJS · PostgreSQL |
| 5 | AfriBayit | Proptech | En développement | React · Node.js |
| 6 | YEHI OR Éditions | Édition & Formation | Actif | Publication · Pédagogie |

---

## 11. Page À Propos `/about`

### Structure des sections

1. **Hero** — Titre : `À propos de YEHI OR Tech` · Sous-titre : `Une entreprise numérique pensée pour éclairer, structurer et accélérer la transformation digitale des organisations.`

2. **Notre histoire** — Texte de présentation de l'entreprise et de sa vision. Mentionner l'ancrage béninois, la vision panafricaine, le nom YEHI OR et sa signification.

3. **Mission** — `Aider les organisations à accéder à des solutions numériques professionnelles, accessibles et concrètement utiles pour leur croissance.`

4. **Vision** — `Devenir une référence dans la transformation digitale, l'IA appliquée et l'automatisation en Afrique francophone et au-delà.`

5. **Valeurs** — 8 cartes (2×4) avec icône, titre, description courte :
   - Excellence · Innovation · Clarté · Fiabilité · Créativité · Impact · Éthique · Service

6. **Notre stack technologique** — Logos/badges des technologies utilisées :
   - Next.js · React · Node.js · PostgreSQL · Claude API · n8n · FedaPay · Kkiapay · Vercel · Git

7. **CTA** — `Travailler avec nous →` → `/contact`

---

## 12. Page Contact `/contact`

### 12.1 Hero

- Titre : `Parlons de votre projet`
- Sous-titre : `Décrivez votre besoin. Nous vous répondons sous 48h avec une proposition claire.`

### 12.2 Layout 2 colonnes

**Colonne gauche — Informations de contact :**

4 blocs contact :
- 📍 Localisation : Parakou, Bénin — Afrique de l'Ouest
- ✉️ Email : contact@yehiortech.com
- 💬 WhatsApp : +229 XX XX XX XX (bouton direct)
- ⏰ Disponibilité : Lun–Sam, 8h–20h (GMT+1)

**Colonne droite — Formulaire :**

```
Champs (react-hook-form + zod) :
├── Prénom & Nom       [text, requis]
├── Email              [email, requis, validé]
├── Téléphone          [tel]
├── Entreprise         [text]
├── Service souhaité   [select, requis]
│   ├── Conception graphique
│   ├── Création de site web
│   ├── Application web ou mobile
│   ├── Agent IA
│   ├── Automatisation métier
│   ├── Pack Crédibilité en ligne
│   ├── Marketing digital & réseaux sociaux
│   ├── Conseil & accompagnement
│   └── Autre
├── Budget approximatif [select]
│   ├── Moins de 50 000 FCFA
│   ├── 50 000 – 150 000 FCFA
│   ├── 150 000 – 500 000 FCFA
│   ├── 500 000 FCFA et plus
│   └── À discuter
├── Description du projet [textarea, requis, min 20 caractères]
└── [Envoyer ma demande →]  bouton or clip-path
```

**Comportement formulaire :**
- Validation Zod en temps réel (messages d'erreur under chaque champ)
- État `loading` sur le bouton (spinner + texte "Envoi en cours...")
- Message de succès animé (fade-in) après envoi
- Pas de rechargement de page

---

## 13. Composants globaux

### Navbar
- Sticky, backdrop-blur au scroll
- Logo + liens + CTA or
- Hamburger mobile → overlay plein écran, liens centrés, animation stagger

### Footer

**4 colonnes :**
1. Brand : Logo · Tagline · Réseaux sociaux (LinkedIn, Facebook, WhatsApp)
2. Services : 8 liens
3. Produits SaaS : Academia Helm · MédiHelm · Travel Helm · LifeHelm · NumériSeal · AfriBayit
4. Entreprise : À propos · Tarifs · Portfolio · Contact · Mentions légales

**Bas du footer :**
- Copyright dynamique : `© {new Date().getFullYear()} YEHI OR Tech. Tous droits réservés.`
- Signature : `Que la lumière soit ✦`

### Bouton WhatsApp Flottant

```
Position : fixed bottom-8 right-8
Fond : #25D366
Animation : pulse 2s infinite (box-shadow)
Tooltip hover : "Discuter sur WhatsApp"
Comportement : masqué quand section #contact est dans le viewport (IntersectionObserver)
```

---

## 14. SEO Technique

### Metadata par page

```typescript
// Accueil
title: "YEHI OR Tech | Agence Digitale IA & Automatisation — Bénin"
description: "YEHI OR Tech accompagne les entreprises dans la création de sites web, applications, agents IA, automatisation et crédibilité en ligne. Parakou, Bénin."

// Services
title: "Nos Services | YEHI OR Tech"
description: "Conception graphique, sites web, applications, agents IA, automatisation, marketing digital, crédibilité en ligne — 8 services pour digitaliser votre activité."

// Tarifs
title: "Tarifs & Packs | YEHI OR Tech"
description: "Packs Crédibilité en ligne dès 35 000 FCFA. Emails professionnels, Google Maps, référencement, annuaires. Prix clairs, livrables précis."

// Portfolio
title: "Réalisations | YEHI OR Tech"
description: "Academia Helm, MédiHelm, NumériSeal, AfriBayit — découvrez les projets SaaS et digitaux développés par YEHI OR Tech."

// À propos
title: "À propos | YEHI OR Tech — Que la lumière soit"
description: "YEHI OR Tech, agence digitale basée à Parakou, Bénin. Notre mission : rendre la technologie accessible et utile pour les entreprises africaines."

// Contact
title: "Contact & Devis Gratuit | YEHI OR Tech"
description: "Contactez YEHI OR Tech pour un devis gratuit. WhatsApp disponible. Réponse sous 48h."
```

### Open Graph

```typescript
og:title        → Même que title
og:description  → Même que description
og:image        → /public/og/yehiortech-og.png (1200×630px)
og:type         → "website"
og:url          → URL canonique de la page
og:locale       → "fr_FR"
```

### Structure sémantique

- `<h1>` unique par page, visible, jamais caché
- Hiérarchie H1 → H2 → H3 strictement respectée
- `alt` descriptif sur toutes les images et illustrations
- `aria-label` sur tous les boutons icône sans texte
- `role="navigation"` + `aria-label="Navigation principale"` sur la navbar
- `<main>`, `<header>`, `<footer>`, `<section>`, `<article>` utilisés correctement

### Fichiers techniques

```
robots.txt      → Autoriser tout, pointer vers sitemap
sitemap.xml     → Généré par next-sitemap (toutes les pages)
```

---

## 15. Données centralisées — Résumé complet

| Fichier | Contenu |
|---|---|
| `/data/services.ts` | 8 services : slug, titre, icône, description courte/longue, livrables, bénéfices, tags, gradient |
| `/data/portfolio.ts` | 6 projets : titre, catégorie, statut, description, tags, tech, gradient, emoji |
| `/data/pricing.ts` | Pack START + BUSINESS + structure pour packs futurs |
| `/data/navigation.ts` | Liens navbar, liens footer |
| `/data/values.ts` | 8 valeurs de l'entreprise : titre, description, icône |
| `/data/process.ts` | 6 étapes du processus : numéro, titre, description |
| `/data/stats.ts` | 4 métriques : valeur, label, suffixe |

**Règle absolue :** Aucun contenu textuel hardcodé dans les composants. Tout passe par les fichiers `/data`.

---

## 16. Contraintes Absolues

1. **Aucun faux témoignage client.**
2. **Aucun client inventé dans le portfolio.**
3. **Aucune promesse non vérifiable** dans les textes.
4. **Code production-ready** — zéro `console.log`, zéro TODO non résolu, zéro `any` TypeScript.
5. **Responsive parfait** — testé de 320px (iPhone SE) à 1920px (grand desktop).
6. **Accessibilité WCAG AA** — contraste minimum 4.5:1 sur tous les textes, focus visible sur tous les éléments interactifs.
7. **Design 100% original** — aucun template reconnaissable.
8. **Animations non bloquantes** — `prefers-reduced-motion: reduce` désactive toutes les animations non essentielles.
9. **TypeScript strict** — pas de `any`, props typées sur tous les composants.
10. **Données séparées du code** — aucun texte, prix ou contenu hardcodé dans les composants JSX.
11. **Déployable sur Vercel** sans configuration supplémentaire.

---

## 17. Ordre de construction recommandé

Si tu dois prioriser, construis dans cet ordre exact :

```
1. Design tokens + globals.css + tailwind.config.ts
2. Lenis + GSAP config + Framer Motion variants
3. Layout global : Navbar + Footer + MobileMenu + PageTransition + WhatsAppButton
4. Page d'accueil complète avec toutes les sections (7.1 → 7.10)
5. Page Tarifs avec packs START et BUSINESS
6. Page Services avec les 8 services détaillés
7. Page Portfolio avec filtres et grille
8. Page À propos
9. Page Contact avec formulaire validé
10. Pages détail service /services/[slug]
11. SEO : metadata, Open Graph, sitemap, robots.txt
12. Audit performance + accessibilité final
```

---

## 18. Livrables attendus

| Livrable | Détail |
|---|---|
| Projet Next.js complet | Structure `/src` telle que définie section 5 |
| 7 pages fonctionnelles | `/`, `/services`, `/services/[slug]`, `/tarifs`, `/portfolio`, `/about`, `/contact` |
| Tous les composants | Typés, réutilisables, documentés si nécessaire |
| Fichiers de données | `/data/*.ts` complets avec contenu réel |
| Config animations | `animations.ts`, `gsap.ts`, `lenis.ts` |
| `package.json` | Toutes les dépendances versionnées |
| `tailwind.config.ts` | Avec design tokens complets |
| `robots.txt` | Configuré |
| `README.md` | Instructions `npm install` + `npm run dev` + variables d'env |

---

*CDC rédigé par Dawes S. Akpowi Tohou — YEHI OR Tech*
*Parakou, Bénin — Version 2.0 — Mai 2025*
*"Que la lumière soit ✦"*
