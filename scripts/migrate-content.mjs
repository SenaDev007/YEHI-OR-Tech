/**
 * Migration pure-JS pour créer les 6 nouvelles tables de contenu public
 * et les peupler avec les données initiales.
 *
 * Utilise pg (pure JavaScript) — contourne le moteur Rust de Prisma qui
 * ne peut pas joindre Neon depuis certains environnements (Vercel, sandbox).
 *
 * Usage : `node scripts/migrate-content.mjs`
 *
 * Idempotent : peut être ré-exécuté sans casser les données.
 */
import pg from "pg";
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, "../.env");
if (existsSync(envPath)) {
  const content = readFileSync(envPath, "utf-8");
  for (const line of content.split("\n")) {
    const m = line.match(/^([A-Z_]+)=(.*)$/);
    if (m && !process.env[m[1]]) {
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  }
}

const DATABASE_URL =
  process.env.DATABASE_URL ||
  "postgresql://neondb_owner:npg_RCoTALa03Jbw@ep-cold-sun-agchdf0u-pooler.c-2.eu-central-1.aws.neon.tech/YEHI%20OR%20Tech?sslmode=require";

if (!DATABASE_URL.startsWith("postgres")) {
  console.error("❌ DATABASE_URL doit être PostgreSQL (pas SQLite)");
  process.exit(1);
}

const client = new pg.Client({
  connectionString: DATABASE_URL,
  connectionTimeoutMillis: 15000,
});

const CREATE_TABLES = `
CREATE TABLE IF NOT EXISTS "service_contents" (
  id              TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  slug            TEXT UNIQUE NOT NULL,
  number          TEXT,
  title           TEXT NOT NULL,
  icon            TEXT NOT NULL DEFAULT 'Code',
  tagline         TEXT NOT NULL DEFAULT '',
  availability    TEXT NOT NULL DEFAULT 'sur-devis',
  "availabilityLabel" TEXT NOT NULL DEFAULT 'Sur devis',
  problem         TEXT,
  "fullDescription" TEXT,
  deliverables    TEXT[] DEFAULT '{}',
  "targetAudience" TEXT[] DEFAULT '{}',
  "commercialLimit" TEXT,
  "formFields"    TEXT[] DEFAULT '{}',
  faq             JSONB,
  tags            TEXT[] DEFAULT '{}',
  cta             TEXT NOT NULL DEFAULT 'Démarrer ce service →',
  gradient        TEXT NOT NULL DEFAULT 'linear-gradient(135deg, #F5B700 0%, #071A2F 100%)',
  "isActive"      BOOLEAN NOT NULL DEFAULT true,
  "order"         INTEGER NOT NULL DEFAULT 0,
  "createdAt"     TIMESTAMP NOT NULL DEFAULT now(),
  "updatedAt"     TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "stat_contents" (
  id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  value       INTEGER NOT NULL,
  suffix      TEXT,
  label       TEXT NOT NULL,
  meaning     TEXT,
  section     TEXT NOT NULL DEFAULT 'homepage',
  "order"     INTEGER NOT NULL DEFAULT 0,
  "isActive"  BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "portfolio_items" (
  id            TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  slug          TEXT UNIQUE NOT NULL,
  title         TEXT NOT NULL,
  category      TEXT NOT NULL DEFAULT 'Application',
  "categorySlug" TEXT NOT NULL DEFAULT 'applications',
  description   TEXT,
  tags          TEXT[] DEFAULT '{}',
  status        TEXT NOT NULL DEFAULT 'live',
  "statusLabel" TEXT NOT NULL DEFAULT 'En production',
  gradient      TEXT NOT NULL DEFAULT 'linear-gradient(135deg, #F5B700 0%, #071A2F 100%)',
  "iconName"    TEXT NOT NULL DEFAULT 'Code',
  tech          TEXT[] DEFAULT '{}',
  url           TEXT,
  "previewImage" TEXT,
  "isActive"    BOOLEAN NOT NULL DEFAULT true,
  "order"       INTEGER NOT NULL DEFAULT 0,
  "createdAt"   TIMESTAMP NOT NULL DEFAULT now(),
  "updatedAt"   TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "pricing_packs" (
  id                TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  slug              TEXT UNIQUE NOT NULL,
  name              TEXT NOT NULL,
  price             INTEGER NOT NULL,
  currency          TEXT NOT NULL DEFAULT 'FCFA',
  period            TEXT,
  description       TEXT,
  tagline           TEXT,
  features          TEXT[] DEFAULT '{}',
  "featureDetails"  JSONB,
  cta               TEXT NOT NULL DEFAULT 'Choisir ce pack',
  badge             TEXT,
  "badgeColor"      TEXT,
  color             TEXT,
  category          TEXT,
  "deliveryTime"    TEXT,
  "supportIncluded" TEXT,
  "isPopular"       BOOLEAN NOT NULL DEFAULT false,
  "isActive"        BOOLEAN NOT NULL DEFAULT true,
  "order"           INTEGER NOT NULL DEFAULT 0,
  "createdAt"       TIMESTAMP NOT NULL DEFAULT now(),
  "updatedAt"       TIMESTAMP NOT NULL DEFAULT now()
);

-- ALTER TABLE pour ajouter les nouvelles colonnes si la table existait déjà
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'pricing_packs') THEN
    ALTER TABLE pricing_packs ADD COLUMN IF NOT EXISTS currency TEXT NOT NULL DEFAULT 'FCFA';
    ALTER TABLE pricing_packs ADD COLUMN IF NOT EXISTS tagline TEXT;
    ALTER TABLE pricing_packs ADD COLUMN IF NOT EXISTS "featureDetails" JSONB;
    ALTER TABLE pricing_packs ADD COLUMN IF NOT EXISTS cta TEXT NOT NULL DEFAULT 'Choisir ce pack';
    ALTER TABLE pricing_packs ADD COLUMN IF NOT EXISTS badge TEXT;
    ALTER TABLE pricing_packs ADD COLUMN IF NOT EXISTS "badgeColor" TEXT;
    ALTER TABLE pricing_packs ADD COLUMN IF NOT EXISTS color TEXT;
    ALTER TABLE pricing_packs ADD COLUMN IF NOT EXISTS category TEXT;
    ALTER TABLE pricing_packs ADD COLUMN IF NOT EXISTS "deliveryTime" TEXT;
    ALTER TABLE pricing_packs ADD COLUMN IF NOT EXISTS "supportIncluded" TEXT;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS "testimonials" (
  id             TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  text           TEXT NOT NULL,
  highlight      TEXT,
  "authorName"   TEXT NOT NULL,
  "authorRole"   TEXT NOT NULL DEFAULT '',
  "authorAvatar" TEXT,
  rating         INTEGER NOT NULL DEFAULT 5,
  "isActive"     BOOLEAN NOT NULL DEFAULT true,
  "order"        INTEGER NOT NULL DEFAULT 0,
  "createdAt"    TIMESTAMP NOT NULL DEFAULT now(),
  "updatedAt"    TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "page_contents" (
  id        TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  page      TEXT NOT NULL,
  section   TEXT NOT NULL,
  key       TEXT NOT NULL,
  value     TEXT NOT NULL,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
  CONSTRAINT page_contents_page_section_key_unique UNIQUE (page, section, key)
);
`;

const SEED_DATA = {
  stats: [
    { value: 8, label: "Services numériques couverts", meaning: "Tu n'as pas besoin d'un prestataire différent pour chaque brique de ton projet." },
    { value: 6, label: "Marques dans l'écosystème YEHI OR", meaning: "Ce n'est pas une agence qui revend des templates, c'est une entreprise qui construit ses propres produits." },
    { value: 48, suffix: "h", label: "Délai de réponse garanti", meaning: "Ton message n'attend pas trois semaines dans une boîte mail." },
    { value: 3, label: "Métiers exercés avant le code", meaning: "Enseignement, sécurité industrielle, biotechnologie : la rigueur du terrain, appliquée au numérique." },
  ],
  portfolio: [
    { slug: "academia-helm", title: "Academia Helm", category: "Application SaaS", categorySlug: "applications", description: "Plateforme de gestion scolaire : inscriptions, paiements, bulletins, communication parents, finances. Déployée et utilisée par des établissements.", tags: ["SaaS", "Éducation", "Production"], status: "live", statusLabel: "En production", gradient: "linear-gradient(135deg, #F5B700 0%, #071A2F 100%)", iconName: "GraduationCap", tech: ["Next.js", "Node.js", "PostgreSQL"], url: "https://academiahelm.com/", previewImage: "https://image.thum.io/get/width/800/crop/600/https://academiahelm.com/" },
    { slug: "win-agro", title: "Win Agro", category: "Site web & e-commerce", categorySlug: "sites-web", description: "Plateforme de formation et d'élevage au Bénin. Vente de volailles, provendes, accompagnement terrain.", tags: ["Agriculture", "E-commerce", "Production"], status: "live", statusLabel: "En production", gradient: "linear-gradient(135deg, #076B37 0%, #0F1F14 100%)", iconName: "Sprout", tech: ["Next.js", "Prisma", "Tailwind"], url: "https://winagrotech.com/", previewImage: "https://image.thum.io/get/width/800/crop/600/https://winagrotech.com/" },
    { slug: "foncier-facile-afrique", title: "Foncier Facile Afrique", category: "Plateforme civic tech", categorySlug: "applications", description: "Plateforme de gestion et de simplification des démarches foncières en Afrique francophone.", tags: ["Civic Tech", "Foncier", "Production"], status: "live", statusLabel: "En production", gradient: "linear-gradient(135deg, #0B3D91 0%, #0D1117 100%)", iconName: "Landmark", tech: ["Next.js", "TypeScript", "PostgreSQL"], url: "https://www.foncierfacileafrique.fr/", previewImage: "https://image.thum.io/get/width/800/crop/600/https://www.foncierfacileafrique.fr/" },
    { slug: "mouvement-christ-libere", title: "Mouvement Christ Libéré", category: "Site institutionnel", categorySlug: "sites-web", description: "Plateforme du Mouvement Christ Libéré : enseignements, événements, ressources spirituelles et communauté.", tags: ["Institutionnel", "Spiritualité", "Production"], status: "live", statusLabel: "En production", gradient: "linear-gradient(135deg, #076B37 0%, #07152D 100%)", iconName: "Church", tech: ["Next.js", "Tailwind", "TypeScript"], url: "https://www.mouvementchristlibere.com/", previewImage: "https://image.thum.io/get/width/800/crop/600/https://www.mouvementchristlibere.com/" },
  ],
  pricing: [
    {
      slug: "pack-start",
      name: "Pack START",
      price: 35000,
      currency: "FCFA",
      period: "one-shot",
      tagline: "Pose les fondations numériques de ton image de marque.",
      description: "Pose les fondations numériques de ton image de marque.",
      features: ["5 adresses email professionnelles", "Création et configuration de la fiche établissement Google Maps", "Indexation et référencement dans Google Search Console", "Inscription dans 3 annuaires professionnels ciblés", "Configuration des enregistrements DNS pour éviter les spams"],
      featureDetails: [
        { label: "Emails pro", detail: "Serveur SMTP configuré, accès webmail, compatible Outlook/Gmail" },
        { label: "Google Maps", detail: "Fiche complète avec photos, horaires, description, catégorie" },
        { label: "Search Console", detail: "Propriété vérifiée, sitemaps soumis, suivi des positions" },
        { label: "Annuaires", detail: "Ciblés par secteur et localisation géographique" },
        { label: "DNS", detail: "Enregistrements SPF, DKIM, DMARC configurés" },
      ],
      cta: "Choisir le Pack Start",
      badge: "START",
      badgeColor: "green",
      color: "dark",
      category: "credibilite",
      deliveryTime: "3 à 5 jours ouvrés",
      supportIncluded: "30 jours de support inclus",
      isPopular: false,
      isActive: true,
    },
    {
      slug: "pack-business",
      name: "Pack BUSINESS",
      price: 50000,
      currency: "FCFA",
      period: "one-shot",
      tagline: "La crédibilité en ligne montée en gamme pour les structures qui grandissent.",
      description: "La crédibilité en ligne montée en gamme pour les structures qui grandissent.",
      features: ["25 adresses email professionnelles", "Création et configuration de la fiche établissement Google Maps", "Indexation et référencement dans Google Search Console", "Inscription dans 5 annuaires professionnels ciblés", "Configuration des enregistrements DNS pour éviter les spams"],
      featureDetails: [
        { label: "Emails pro", detail: "Serveur SMTP configuré, accès webmail, compatible Outlook/Gmail" },
        { label: "Google Maps", detail: "Fiche complète avec photos, horaires, description, catégorie" },
        { label: "Search Console", detail: "Propriété vérifiée, sitemaps soumis, suivi des positions" },
        { label: "Annuaires", detail: "Ciblés par secteur et localisation géographique" },
        { label: "DNS", detail: "Enregistrements SPF, DKIM, DMARC configurés" },
      ],
      cta: "Choisir le Pack Business",
      badge: "BUSINESS",
      badgeColor: "gold",
      color: "gold",
      category: "credibilite",
      deliveryTime: "5 à 7 jours ouvrés",
      supportIncluded: "60 jours de support inclus",
      isPopular: true,
      isActive: true,
    },
    {
      slug: "site-vitrine",
      name: "Site Vitrine",
      price: 150000,
      currency: "FCFA",
      period: "projet",
      tagline: "Site vitrine professionnel, sur-mesure, optimisé pour le référencement.",
      description: "Site vitrine professionnel, sur-mesure, optimisé pour le référencement.",
      features: ["5 pages sur-mesure", "Design responsive", "Référencement SEO de base", "Formulaire de contact", "Hébergement et nom de domaine 1 an"],
      cta: "Démarrer mon site",
      badge: "WEB",
      badgeColor: "blue",
      color: "blue",
      category: "web",
      deliveryTime: "2 à 4 semaines",
      supportIncluded: "3 mois de support inclus",
      isPopular: false,
      isActive: true,
    },
  ],
  services: [
    { slug: "informatique-assistance", number: "01", title: "Informatique & Assistance", icon: "Wrench", tagline: "Des outils fiables, configurés et maintenus pour travailler sereinement.", availability: "immediate", availabilityLabel: "Immédiate, selon le besoin", problem: "Un ordinateur instable, un réseau mal configuré ou l'absence de technicien permanent freinent le travail quotidien d'une école, d'un commerce ou d'une organisation.", fullDescription: "YEHI OR Tech installe, configure et maintient les environnements informatiques. L'intervention peut concerner un poste individuel, un petit réseau, une école, un commerce ou une organisation qui souhaite mieux organiser son parc informatique.", deliverables: ["Installation et configuration d'ordinateurs", "Diagnostic et dépannage logiciel", "Optimisation des postes de travail", "Installation de petits réseaux", "Configuration d'imprimantes et périphériques", "Maintenance préventive", "Accompagnement et formation des utilisateurs", "Fourniture d'accessoires sur commande"], targetAudience: ["Enseignants et écoles", "Particuliers", "Petits commerces", "Associations et bureaux sans technicien permanent"], tags: ["Hardware", "Réseau", "Maintenance"], cta: "Démarrer ce service →", gradient: "linear-gradient(135deg, #F5B700 0%, #071A2F 100%)" },
    { slug: "design-graphique-imprime", number: "02", title: "Design Graphique & Imprimé", icon: "Palette", tagline: "Une identité visuelle forte, déclinée sur tous tes supports.", availability: "immediate", availabilityLabel: "Immédiate, selon le besoin", problem: "Une image de marque faible ou incohérente dessert ton produit. Les Flyers, cartes de visite, affiches et logos doivent transmettre ton sérieux dès le premier regard.", fullDescription: "YEHI OR Tech conçoit ton identité visuelle et imprime tes supports de communication. De la charte graphique au flyer final, en passant par les cartes de visite, on prend en charge toute la chaîne créative.", deliverables: ["Logo et charte graphique", "Cartes de visite", "Flyers et affiches", "Papeterie d'entreprise", "Supports réseaux sociaux", "Impression numérique"], targetAudience: ["Commerces", "Restaurants", "Associations", "Événementiel"], tags: ["Design", "Print", "Branding"], cta: "Démarrer ce service →", gradient: "linear-gradient(135deg, #071A2F 0%, #F5B700 100%)" },
    { slug: "developpement-logiciel", number: "04", title: "Développement Logiciel", icon: "Code", tagline: "Des applications sur-mesure qui répondent à tes vrais besoins.", availability: "sur-devis", availabilityLabel: "Sur devis", problem: "Les outils du marché ne couvrent jamais 100% de tes besoins. Une application sur-mesure, c'est l'assurance d'un outil qui s'adapte à ton métier, pas l'inverse.", fullDescription: "YEHI OR Tech conçoit, développe et déploie des applications web et mobiles sur-mesure. Sites vitrine, applications métier, plateformes SaaS, intégrations API.", deliverables: ["Sites web et e-commerce", "Applications métier", "Plateformes SaaS", "APIs et intégrations", "Maintenance et évolutions"], targetAudience: ["Entrepreneurs", "PME", "Établissements", "Organisations"], tags: ["Web", "Mobile", "SaaS"], cta: "Demander un devis →", gradient: "linear-gradient(135deg, #071A2F 0%, #0B3D91 100%)" },
    { slug: "academia", number: "05", title: "Academia", icon: "GraduationCap", tagline: "La plateforme de gestion scolaire pensée pour le Bénin.", availability: "produit", availabilityLabel: "Abonnement mensuel", problem: "Les écoles béninoises jonglent entre inscriptions papier, calculs manuels de frais, et communication fragmentée avec les parents.", fullDescription: "Academia Helm est la plateforme de gestion scolaire conçue pour le contexte béninois. Inscriptions, paiement de frais scolaires, bulletins, communication parents-école, statistiques de fréquentation.", deliverables: ["Inscriptions en ligne", "Paiement de frais scolaires", "Bulletins numériques", "Communication parents", "Statistiques et rapports"], targetAudience: ["Écoles primaires", "Collèges", "Lycées", "Établissements privés"], tags: ["SaaS", "Éducation", "Bénin"], cta: "Découvrir Academia →", gradient: "linear-gradient(135deg, #F5B700 0%, #0B3D91 100%)" },
    { slug: "intelligence-artificielle", number: "06", title: "Intelligence Artificielle", icon: "Bot", tagline: "Automatise tes tâches répétitives avec des agents IA sur-mesure.", availability: "sur-devis", availabilityLabel: "Sur devis", problem: "Beaucoup d'entreprises perdent un temps précieux sur des tâches répétitives : relances, qualification de leads, prise de rendez-vous, publication de contenu.", fullDescription: "YEHI OR Tech conçoit des agents IA qui travaillent 24h/24 : assistants WhatsApp, chatbots intégrés, automatisations email, publication de contenu programmée, qualification de prospects.", deliverables: ["Agents WhatsApp", "Chatbots intégrés au site", "Automatisations email et CRM", "Publication de contenu programmée", "Qualification de prospects"], targetAudience: ["Entrepreneurs", "Commerciaux", "Équipes marketing", "TPE/PME"], tags: ["IA", "Automation", "WhatsApp"], cta: "Demander un devis →", gradient: "linear-gradient(135deg, #0B3D91 0%, #F5B700 100%)" },
  ],
  testimonials: [
    { text: "Service impeccable. YEHI OR Tech a conçu notre site vitrine et l'identité visuelle en quelques jours. Notre image de marque a immédiatement gagné en crédibilité.", highlight: "Image de marque immédiatement crédibilisée", authorName: "Marie Adjovi", authorRole: "Gérante · Boutique Parakou", rating: 5, isActive: true },
    { text: "Academia Helm a transformé notre gestion scolaire. Les inscriptions qui prenaient 3 semaines se font maintenant en 2 jours. Les parents adorent le suivi en temps réel.", highlight: "Inscriptions passées de 3 semaines à 2 jours", authorName: "M. Koffi", authorRole: "Directeur · CSP Baobab", rating: 5, isActive: true },
  ],
  pageContent: [
    { page: "home", section: "hero", key: "title", value: "L'agence numérique qui pense ton marché avant ton code" },
    { page: "home", section: "hero", key: "subtitle", value: "Sites web, applications, IA, impression. YEHI OR Tech couvre toute la chaîne numérique, du pixel à l'imprimé, depuis Parakou." },
    { page: "home", section: "hero", key: "ctaPrimary", value: "Démarrer un projet →" },
    { page: "home", section: "hero", key: "ctaSecondary", value: "Voir les réalisations" },
    { page: "about", section: "hero", key: "title", value: "Notre histoire" },
    { page: "about", section: "hero", key: "subtitle", value: "YEHI OR Tech est née à Parakou, au cœur du Bénin, pour bâtir l'infrastructure numérique de l'Afrique de l'Ouest." },
  ],
};

async function main() {
  console.log("🔌 Connexion à Neon…");
  await client.connect();
  console.log("✅ Connecté");

  console.log("\n📦 Création des 6 tables (idempotent)…");
  await client.query(CREATE_TABLES);
  console.log("✅ Tables prêtes");

  console.log(`\n🌱 Seed de ${SEED_DATA.stats.length} stats…`);
  for (let i = 0; i < SEED_DATA.stats.length; i++) {
    const s = SEED_DATA.stats[i];
    await client.query(
      `INSERT INTO stat_contents (id, value, suffix, label, meaning, section, "order", "isActive")
       VALUES ($1, $2, $3, $4, $5, 'homepage', $6, true)
       ON CONFLICT (id) DO UPDATE SET value = EXCLUDED.value, suffix = EXCLUDED.suffix, label = EXCLUDED.label, meaning = EXCLUDED.meaning`,
      [`stat-homepage-${i}`, s.value, s.suffix || null, s.label, s.meaning, i]
    );
  }
  console.log("✅ Stats seedés");

  console.log(`\n🌱 Seed de ${SEED_DATA.portfolio.length} portfolio items…`);
  for (let i = 0; i < SEED_DATA.portfolio.length; i++) {
    const p = SEED_DATA.portfolio[i];
    await client.query(
      `INSERT INTO portfolio_items (slug, title, category, "categorySlug", description, tags, status, "statusLabel", gradient, "iconName", tech, url, "previewImage", "isActive", "order")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, true, $14)
       ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, category = EXCLUDED.category, "categorySlug" = EXCLUDED."categorySlug", description = EXCLUDED.description, tags = EXCLUDED.tags, status = EXCLUDED.status, "statusLabel" = EXCLUDED."statusLabel", gradient = EXCLUDED.gradient, "iconName" = EXCLUDED."iconName", tech = EXCLUDED.tech, url = EXCLUDED.url, "previewImage" = EXCLUDED."previewImage", "isActive" = true, "order" = EXCLUDED."order"`,
      [p.slug, p.title, p.category, p.categorySlug, p.description, p.tags, p.status, p.statusLabel, p.gradient, p.iconName, p.tech, p.url, p.previewImage, i]
    );
  }
  console.log("✅ Portfolio seedé");

  console.log(`\n🌱 Seed de ${SEED_DATA.pricing.length} packs pricing…`);
  for (let i = 0; i < SEED_DATA.pricing.length; i++) {
    const p = SEED_DATA.pricing[i];
    await client.query(
      `INSERT INTO pricing_packs (slug, name, price, currency, period, description, tagline, features, "featureDetails", cta, badge, "badgeColor", color, category, "deliveryTime", "supportIncluded", "isPopular", "isActive", "order")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
       ON CONFLICT (slug) DO UPDATE SET
         name = EXCLUDED.name, price = EXCLUDED.price, currency = EXCLUDED.currency, period = EXCLUDED.period,
         description = EXCLUDED.description, tagline = EXCLUDED.tagline, features = EXCLUDED.features,
         "featureDetails" = EXCLUDED."featureDetails", cta = EXCLUDED.cta, badge = EXCLUDED.badge,
         "badgeColor" = EXCLUDED."badgeColor", color = EXCLUDED.color, category = EXCLUDED.category,
         "deliveryTime" = EXCLUDED."deliveryTime", "supportIncluded" = EXCLUDED."supportIncluded",
         "isPopular" = EXCLUDED."isPopular", "isActive" = EXCLUDED."isActive", "order" = EXCLUDED."order"`,
      [p.slug, p.name, p.price, p.currency || "FCFA", p.period, p.description, p.tagline || null, p.features, JSON.stringify(p.featureDetails || []), p.cta || "Choisir ce pack", p.badge || null, p.badgeColor || null, p.color || null, p.category || null, p.deliveryTime || null, p.supportIncluded || null, p.isPopular, p.isActive, i]
    );
  }
  console.log("✅ Packs pricing seedés");

  console.log(`\n🌱 Seed de ${SEED_DATA.services.length} services…`);
  for (let i = 0; i < SEED_DATA.services.length; i++) {
    const s = SEED_DATA.services[i];
    await client.query(
      `INSERT INTO service_contents (slug, number, title, icon, tagline, availability, "availabilityLabel", problem, "fullDescription", deliverables, "targetAudience", tags, cta, gradient, "isActive", "order")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, true, $15)
       ON CONFLICT (slug) DO UPDATE SET number = EXCLUDED.number, title = EXCLUDED.title, icon = EXCLUDED.icon, tagline = EXCLUDED.tagline, availability = EXCLUDED.availability, "availabilityLabel" = EXCLUDED."availabilityLabel", problem = EXCLUDED.problem, "fullDescription" = EXCLUDED."fullDescription", deliverables = EXCLUDED.deliverables, "targetAudience" = EXCLUDED."targetAudience", tags = EXCLUDED.tags, cta = EXCLUDED.cta, gradient = EXCLUDED.gradient, "isActive" = true, "order" = EXCLUDED."order"`,
      [s.slug, s.number, s.title, s.icon, s.tagline, s.availability, s.availabilityLabel, s.problem, s.fullDescription, s.deliverables, s.targetAudience, s.tags, s.cta, s.gradient, i]
    );
  }
  console.log("✅ Services seedés");

  console.log(`\n🌱 Seed de ${SEED_DATA.testimonials.length} témoignages…`);
  for (let i = 0; i < SEED_DATA.testimonials.length; i++) {
    const t = SEED_DATA.testimonials[i];
    await client.query(
      `INSERT INTO testimonials (id, text, highlight, "authorName", "authorRole", rating, "isActive", "order")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text, highlight = EXCLUDED.highlight, "authorName" = EXCLUDED."authorName", "authorRole" = EXCLUDED."authorRole", rating = EXCLUDED.rating, "isActive" = EXCLUDED."isActive", "order" = EXCLUDED."order"`,
      [`testimonial-seed-${i}`, t.text, t.highlight, t.authorName, t.authorRole, t.rating, t.isActive, i]
    );
  }
  console.log("✅ Témoignages seedés");

  console.log(`\n🌱 Seed de ${SEED_DATA.pageContent.length} contenus de page…`);
  for (const pc of SEED_DATA.pageContent) {
    await client.query(
      `INSERT INTO page_contents (page, section, key, value) VALUES ($1, $2, $3, $4) ON CONFLICT (page, section, key) DO UPDATE SET value = EXCLUDED.value`,
      [pc.page, pc.section, pc.key, pc.value]
    );
  }
  console.log("✅ Contenus de page seedés");

  console.log("\n📊 Vérification du contenu…");
  for (const table of ["service_contents", "stat_contents", "portfolio_items", "pricing_packs", "testimonials", "page_contents"]) {
    const r = await client.query(`SELECT COUNT(*) FROM ${table}`);
    console.log(`   ${table}: ${r.rows[0].count} entrées`);
  }

  console.log("\n✅ Migration + seed terminés avec succès !");
}

// ============================================================
// TABLES SUPPLÉMENTAIRES (Phase A extension + Phase B SaaS Hub)
// ============================================================
const EXTRA_TABLES = `
CREATE TABLE IF NOT EXISTS "value_contents" (
  id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  number      TEXT,
  title       TEXT NOT NULL,
  description TEXT,
  icon        TEXT NOT NULL DEFAULT 'Star',
  "isActive"  BOOLEAN NOT NULL DEFAULT true,
  "order"     INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "process_step_contents" (
  id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  number      TEXT,
  title       TEXT NOT NULL,
  description TEXT,
  icon        TEXT NOT NULL DEFAULT 'Search',
  "isActive"  BOOLEAN NOT NULL DEFAULT true,
  "order"     INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "faq_items" (
  id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  question    TEXT NOT NULL,
  answer      TEXT NOT NULL,
  category    TEXT NOT NULL DEFAULT 'general',
  "isActive"  BOOLEAN NOT NULL DEFAULT true,
  "order"     INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "saas_apps" (
  id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  slug        TEXT UNIQUE NOT NULL,
  name        TEXT NOT NULL,
  description TEXT,
  icon        TEXT NOT NULL DEFAULT 'App',
  "apiUrl"    TEXT,
  "apiKey"    TEXT,
  "publicUrl" TEXT,
  "isActive"  BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "saas_tenants" (
  id                  TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "appId"             TEXT NOT NULL,
  "externalId"        TEXT,
  name                TEXT NOT NULL,
  slug                TEXT,
  "contactName"       TEXT,
  "contactEmail"      TEXT,
  "contactPhone"      TEXT,
  plan                TEXT NOT NULL DEFAULT 'SEED',
  status              TEXT NOT NULL DEFAULT 'trial',
  "studentCount"      INTEGER NOT NULL DEFAULT 0,
  "studentMin"        INTEGER NOT NULL DEFAULT 1,
  "studentMax"        INTEGER,
  "billingCycle"      TEXT NOT NULL DEFAULT 'ANNUAL',
  amount              INTEGER NOT NULL DEFAULT 0,
  "initialFee"        INTEGER NOT NULL DEFAULT 0,
  "initialFeePaid"    BOOLEAN NOT NULL DEFAULT false,
  "yearlyAmount"      INTEGER NOT NULL DEFAULT 0,
  "bilingualEnabled"  BOOLEAN NOT NULL DEFAULT false,
  "bilingualAmount"   INTEGER NOT NULL DEFAULT 0,
  "schoolsCount"      INTEGER NOT NULL DEFAULT 1,
  "startDate"         TIMESTAMP NOT NULL DEFAULT now(),
  "activationDate"     TIMESTAMP,
  "trialEndsAt"       TIMESTAMP,
  "annualDueDate"     TIMESTAMP,
  "nextPaymentDueAt"  TIMESTAMP,
  "cancelledAt"       TIMESTAMP,
  metadata            JSONB,
  "lastSyncAt"        TIMESTAMP,
  "syncStatus"        TEXT NOT NULL DEFAULT 'pending',
  "syncError"         TEXT,
  "createdAt"         TIMESTAMP NOT NULL DEFAULT now(),
  "updatedAt"         TIMESTAMP NOT NULL DEFAULT now(),
  CONSTRAINT saas_tenants_app_fkey FOREIGN KEY ("appId") REFERENCES "saas_apps"(id) ON DELETE CASCADE
);

-- ALTER TABLE pour ajouter les nouvelles colonnes Academia Helm si la table existait déjà
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'saas_tenants') THEN
    ALTER TABLE saas_tenants ADD COLUMN IF NOT EXISTS "studentMin" INTEGER NOT NULL DEFAULT 1;
    ALTER TABLE saas_tenants ADD COLUMN IF NOT EXISTS "studentMax" INTEGER;
    ALTER TABLE saas_tenants ADD COLUMN IF NOT EXISTS "initialFee" INTEGER NOT NULL DEFAULT 0;
    ALTER TABLE saas_tenants ADD COLUMN IF NOT EXISTS "initialFeePaid" BOOLEAN NOT NULL DEFAULT false;
    ALTER TABLE saas_tenants ADD COLUMN IF NOT EXISTS "yearlyAmount" INTEGER NOT NULL DEFAULT 0;
    ALTER TABLE saas_tenants ADD COLUMN IF NOT EXISTS "bilingualEnabled" BOOLEAN NOT NULL DEFAULT false;
    ALTER TABLE saas_tenants ADD COLUMN IF NOT EXISTS "bilingualAmount" INTEGER NOT NULL DEFAULT 0;
    ALTER TABLE saas_tenants ADD COLUMN IF NOT EXISTS "schoolsCount" INTEGER NOT NULL DEFAULT 1;
    ALTER TABLE saas_tenants ADD COLUMN IF NOT EXISTS "activationDate" TIMESTAMP;
    ALTER TABLE saas_tenants ADD COLUMN IF NOT EXISTS "annualDueDate" TIMESTAMP;
    ALTER TABLE saas_tenants ADD COLUMN IF NOT EXISTS "syncStatus" TEXT NOT NULL DEFAULT 'pending';
    ALTER TABLE saas_tenants ADD COLUMN IF NOT EXISTS "syncError" TEXT;
    -- Mettre à jour le plan par défaut de 'free' à 'SEED'
    UPDATE saas_tenants SET plan = 'SEED' WHERE plan = 'free';
    UPDATE saas_tenants SET "billingCycle" = 'ANNUAL' WHERE "billingCycle" = 'MONTHLY';
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS saas_tenants_app_idx ON "saas_tenants"("appId");
CREATE INDEX IF NOT EXISTS saas_tenants_status_idx ON "saas_tenants"(status);
CREATE INDEX IF NOT EXISTS saas_tenants_plan_idx ON "saas_tenants"(plan);
CREATE INDEX IF NOT EXISTS saas_tenants_next_payment_idx ON "saas_tenants"("nextPaymentDueAt");
CREATE INDEX IF NOT EXISTS saas_tenants_annual_due_idx ON "saas_tenants"("annualDueDate");
`;

const EXTRA_SEED = {
  values: [
    { number: "01", title: "Excellence", description: "Un livrable fini vaut mieux que trois livrables approximatifs. On ne livre rien qui ne tienne la route sur la durée.", icon: "Star" },
    { number: "02", title: "Clarté", description: "Un prix, un délai, un périmètre. Écrits, pas promis à l'oral. Le flou est la première trahison de la confiance.", icon: "Eye" },
    { number: "03", title: "Fiabilité", description: "Ce qui est annoncé est tenu, ou communiqué à temps si ça change. Le silence radio n'est jamais une option.", icon: "ShieldCheck" },
    { number: "04", title: "Créativité", description: "Une solution qui ressemble à ton activité, pas à un modèle générique. Le copier-coller tue la marque.", icon: "Sparkles" },
  ],
  processSteps: [
    { number: "01", title: "Analyse du besoin", description: "On commence par comprendre ton activité et le problème réel à résoudre, avant de proposer quoi que ce soit.", icon: "Search" },
    { number: "02", title: "Proposition de solution", description: "Architecture technique, choix des outils, budget et délai posés noir sur blanc avant le premier jour de travail.", icon: "ClipboardList" },
    { number: "03", title: "Design & Architecture", description: "Maquettes et structure technique validées avec toi avant qu'une seule ligne de code ne soit écrite.", icon: "PenTool" },
    { number: "04", title: "Développement", description: "Construction de la solution, avec un point d'avancement à chaque étape, pas un silence de trois semaines.", icon: "Code2" },
  ],
  faq: [
    { question: "Quels sont vos délais moyens de livraison ?", answer: "Un site vitrine prend 2 à 4 semaines. Une application sur-mesure varie de 1 à 6 mois selon la complexité. Les petits travaux (impression, design) se font en 3 à 5 jours.", category: "general", order: 1 },
    { question: "Comment se déroule le paiement ?", answer: "Pour les projets > 100 000 FCFA, on travaille en 3 versements : 40% à la commande, 40% à mi-parcours, 20% à la livraison. Pour les packs (START, BUSINESS), paiement intégral à la commande.", category: "pricing", order: 2 },
    { question: "Proposez-vous un support après livraison ?", answer: "Oui, tout projet vient avec un support inclus (30 à 90 jours selon le pack). Au-delà, des forfaits de maintenance mensuels sont disponibles.", category: "general", order: 3 },
    { question: "Travaillez-vous avec des clients hors du Bénin ?", answer: "Oui, nous accompagnons des clients en Afrique de l'Ouest et au-delà. La communication se fait en français ou en anglais, à distance ou en présentiel selon le projet.", category: "general", order: 4 },
  ],
  saasApps: [
    {
      slug: "academia-helm",
      name: "Academia Helm",
      description: "Plateforme de gestion scolaire : inscriptions, paiements, bulletins, communication parents, finances.",
      icon: "GraduationCap",
      apiUrl: "https://api.academiahelm.com",
      publicUrl: "https://academiahelm.com",
      isActive: true,
    },
  ],
};

async function migrateExtra() {
  console.log("\n📦 Création des tables additionnelles (values, process, faq, saas)... ");
  await client.query(EXTRA_TABLES);
  console.log("✅ Tables additionnelles prêtes");

  // Seed values
  console.log(`\n🌱 Seed de ${EXTRA_SEED.values.length} valeurs…`);
  for (let i = 0; i < EXTRA_SEED.values.length; i++) {
    const v = EXTRA_SEED.values[i];
    await client.query(
      `INSERT INTO value_contents (number, title, description, icon, "isActive", "order")
       VALUES ($1, $2, $3, $4, true, $5)
       ON CONFLICT DO NOTHING`,
      [v.number, v.title, v.description, v.icon, i]
    );
  }
  console.log("✅ Valeurs seedées");

  // Seed process steps
  console.log(`\n🌱 Seed de ${EXTRA_SEED.processSteps.length} étapes de processus…`);
  for (let i = 0; i < EXTRA_SEED.processSteps.length; i++) {
    const p = EXTRA_SEED.processSteps[i];
    await client.query(
      `INSERT INTO process_step_contents (number, title, description, icon, "isActive", "order")
       VALUES ($1, $2, $3, $4, true, $5)
       ON CONFLICT DO NOTHING`,
      [p.number, p.title, p.description, p.icon, i]
    );
  }
  console.log("✅ Étapes seedées");

  // Seed FAQ
  console.log(`\n🌱 Seed de ${EXTRA_SEED.faq.length} items FAQ…`);
  for (let i = 0; i < EXTRA_SEED.faq.length; i++) {
    const f = EXTRA_SEED.faq[i];
    await client.query(
      `INSERT INTO faq_items (question, answer, category, "isActive", "order")
       VALUES ($1, $2, $3, true, $4)
       ON CONFLICT DO NOTHING`,
      [f.question, f.answer, f.category, f.order]
    );
  }
  console.log("✅ FAQ seedée");

  // Seed SaaS apps
  console.log(`\n🌱 Seed de ${EXTRA_SEED.saasApps.length} apps SaaS…`);
  for (const app of EXTRA_SEED.saasApps) {
    await client.query(
      `INSERT INTO saas_apps (slug, name, description, icon, "apiUrl", "publicUrl", "isActive")
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (slug) DO UPDATE SET
         name = EXCLUDED.name, description = EXCLUDED.description,
         icon = EXCLUDED.icon, "apiUrl" = EXCLUDED."apiUrl",
         "publicUrl" = EXCLUDED."publicUrl", "isActive" = EXCLUDED."isActive"`,
      [app.slug, app.name, app.description, app.icon, app.apiUrl, app.publicUrl, app.isActive]
    );
  }
  console.log("✅ Apps SaaS seedées");

  console.log("\n📊 Vérification additionnelle…");
  for (const table of ["value_contents", "process_step_contents", "faq_items", "saas_apps", "saas_tenants"]) {
    const r = await client.query(`SELECT COUNT(*) FROM ${table}`);
    console.log(`   ${table}: ${r.rows[0].count} entrées`);
  }
}

// Exécute la migration additionnelle dans le même contexte que main()
main()
  .then(() => migrateExtra())
  .then(() => {
    console.log("\n✅ Migration additionnelle terminée !");
    return client.end();
  })
  .catch((err) => {
    console.error("❌ Erreur:", err.message);
    client.end();
    process.exit(1);
  });
