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
  id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  slug        TEXT UNIQUE NOT NULL,
  name        TEXT NOT NULL,
  price       INTEGER NOT NULL,
  period      TEXT,
  description TEXT,
  features    TEXT[] DEFAULT '{}',
  "isPopular" BOOLEAN NOT NULL DEFAULT false,
  "isActive"  BOOLEAN NOT NULL DEFAULT true,
  "order"     INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
);

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
    { slug: "pack-start", name: "Pack START", price: 35000, period: "one-shot", description: "Pose les fondations numériques de ton image de marque.", features: ["5 adresses email professionnelles", "Création et configuration de la fiche établissement Google Maps", "Indexation et référencement dans Google Search Console", "Inscription dans 3 annuaires professionnels ciblés", "Configuration des enregistrements DNS pour éviter les spams"], isPopular: false, isActive: true },
    { slug: "pack-business", name: "Pack BUSINESS", price: 50000, period: "one-shot", description: "La crédibilité en ligne montée en gamme pour les structures qui grandissent.", features: ["25 adresses email professionnelles", "Création et configuration de la fiche établissement Google Maps", "Indexation et référencement dans Google Search Console", "Inscription dans 5 annuaires professionnels ciblés", "Configuration des enregistrements DNS pour éviter les spams"], isPopular: true, isActive: true },
    { slug: "site-vitrine", name: "Site Vitrine", price: 150000, period: "projet", description: "Site vitrine professionnel, sur-mesure, optimisé pour le référencement.", features: ["5 pages sur-mesure", "Design responsive", "Référencement SEO de base", "Formulaire de contact", "Hébergement et nom de domaine 1 an"], isPopular: false, isActive: true },
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
      `INSERT INTO pricing_packs (slug, name, price, period, description, features, "isPopular", "isActive", "order")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, period = EXCLUDED.period, description = EXCLUDED.description, features = EXCLUDED.features, "isPopular" = EXCLUDED."isPopular", "isActive" = EXCLUDED."isActive", "order" = EXCLUDED."order"`,
      [p.slug, p.name, p.price, p.period, p.description, p.features, p.isPopular, p.isActive, i]
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

main()
  .then(() => client.end())
  .catch((err) => {
    console.error("❌ Erreur:", err.message);
    client.end();
    process.exit(1);
  });
