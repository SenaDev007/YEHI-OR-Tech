/**
 * Seed du contenu public éditable depuis le manager.
 *
 * Ce script peuple les 6 nouvelles tables de contenu (ServiceContent,
 * StatContent, PortfolioItem, PricingPack, Testimonial, PageContent)
 * à partir des fichiers statiques src/data/*.ts.
 *
 * Une fois exécuté, le manager peut éditer tout ce contenu via
 * /manager/services, /manager/testimonials, /manager/portfolio, etc.
 *
 * Usage : `npx tsx prisma/seed-content.ts`
 *
 * Idempotent : ré-exécuter ne duplique pas les entrées existantes
 * (utilise upsert sur slug/unique).
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Importe les données statiques existantes pour les migrer en DB
// Note: ces fichiers utilisent `export const`, on doit les transformer en require
// via une astuce TypeScript. On inline les données ici pour la simplicité.

async function main() {
  console.log("🌱 Début du seed contenu public…");

  // ============================================================
  // 1. STATS (depuis src/data/stats.ts)
  // ============================================================
  const statsData = [
    { value: 8, label: "Services numériques couverts", meaning: "Tu n'as pas besoin d'un prestataire différent pour chaque brique de ton projet." },
    { value: 6, label: "Marques dans l'écosystème YEHI OR", meaning: "Ce n'est pas une agence qui revend des templates, c'est une entreprise qui construit ses propres produits." },
    { value: 48, suffix: "h", label: "Délai de réponse garanti", meaning: "Ton message n'attend pas trois semaines dans une boîte mail." },
    { value: 3, label: "Métiers exercés avant le code", meaning: "Enseignement, sécurité industrielle, biotechnologie : la rigueur du terrain, appliquée au numérique." },
  ];
  for (let i = 0; i < statsData.length; i++) {
    const s = statsData[i];
    await prisma.statContent.upsert({
      where: { id: `stat-homepage-${i}` },
      update: { value: s.value, suffix: s.suffix || null, label: s.label, meaning: s.meaning, section: "homepage", order: i, isActive: true },
      create: { id: `stat-homepage-${i}`, value: s.value, suffix: s.suffix || null, label: s.label, meaning: s.meaning, section: "homepage", order: i, isActive: true },
    });
  }
  console.log(`✅ ${statsData.length} stats créées`);

  // ============================================================
  // 2. PORTFOLIO (depuis src/data/portfolio.ts)
  // ============================================================
  const portfolioData = [
    {
      slug: "academia-helm",
      title: "Academia Helm",
      category: "Application SaaS",
      categorySlug: "applications",
      description: "Plateforme de gestion scolaire : inscriptions, paiements, bulletins, communication parents, finances. Déployée et utilisée par des établissements.",
      tags: ["SaaS", "Éducation", "Production"],
      status: "live",
      statusLabel: "En production",
      gradient: "linear-gradient(135deg, #F5B700 0%, #071A2F 100%)",
      iconName: "GraduationCap",
      tech: ["Next.js", "Node.js", "PostgreSQL"],
      url: "https://academiahelm.com/",
      previewImage: "https://image.thum.io/get/width/800/crop/600/https://academiahelm.com/",
    },
    {
      slug: "win-agro",
      title: "Win Agro",
      category: "Site web & e-commerce",
      categorySlug: "sites-web",
      description: "Plateforme de formation et d'élevage au Bénin. Vente de volailles, provendes, accompagnement terrain.",
      tags: ["Agriculture", "E-commerce", "Production"],
      status: "live",
      statusLabel: "En production",
      gradient: "linear-gradient(135deg, #076B37 0%, #0F1F14 100%)",
      iconName: "Sprout",
      tech: ["Next.js", "Prisma", "Tailwind"],
      url: "https://winagrotech.com/",
      previewImage: "https://image.thum.io/get/width/800/crop/600/https://winagrotech.com/",
    },
    {
      slug: "foncier-facile-afrique",
      title: "Foncier Facile Afrique",
      category: "Plateforme civic tech",
      categorySlug: "applications",
      description: "Plateforme de gestion et de simplification des démarches foncières en Afrique francophone.",
      tags: ["Civic Tech", "Foncier", "Production"],
      status: "live",
      statusLabel: "En production",
      gradient: "linear-gradient(135deg, #0B3D91 0%, #0D1117 100%)",
      iconName: "Landmark",
      tech: ["Next.js", "TypeScript", "PostgreSQL"],
      url: "https://www.foncierfacileafrique.fr/",
      previewImage: "https://image.thum.io/get/width/800/crop/600/https://www.foncierfacileafrique.fr/",
    },
    {
      slug: "mouvement-christ-libere",
      title: "Mouvement Christ Libéré",
      category: "Site institutionnel",
      categorySlug: "sites-web",
      description: "Plateforme du Mouvement Christ Libéré : enseignements, événements, ressources spirituelles et communauté.",
      tags: ["Institutionnel", "Spiritualité", "Production"],
      status: "live",
      statusLabel: "En production",
      gradient: "linear-gradient(135deg, #076B37 0%, #07152D 100%)",
      iconName: "Church",
      tech: ["Next.js", "Tailwind", "TypeScript"],
      url: "https://www.mouvementchristlibere.com/",
      previewImage: "https://image.thum.io/get/width/800/crop/600/https://www.mouvementchristlibere.com/",
    },
  ];
  for (let i = 0; i < portfolioData.length; i++) {
    const p = portfolioData[i];
    await prisma.portfolioItem.upsert({
      where: { slug: p.slug },
      update: { ...p, order: i, isActive: true },
      create: { ...p, order: i, isActive: true },
    });
  }
  console.log(`✅ ${portfolioData.length} réalisations portfolio créées`);

  // ============================================================
  // 3. PRICING PACKS (depuis src/data/pricing.ts)
  // ============================================================
  const pricingData = [
    {
      slug: "pack-start",
      name: "Pack START",
      price: 35000,
      period: "one-shot",
      description: "Pose les fondations numériques de ton image de marque.",
      features: [
        "5 adresses email professionnelles",
        "Création et configuration de la fiche établissement Google Maps",
        "Indexation et référencement dans Google Search Console",
        "Inscription dans 3 annuaires professionnels ciblés",
        "Configuration des enregistrements DNS pour éviter les spams",
      ],
      isPopular: false,
      isActive: true,
    },
    {
      slug: "pack-business",
      name: "Pack BUSINESS",
      price: 50000,
      period: "one-shot",
      description: "La crédibilité en ligne montée en gamme pour les structures qui grandissent.",
      features: [
        "25 adresses email professionnelles",
        "Création et configuration de la fiche établissement Google Maps",
        "Indexation et référencement dans Google Search Console",
        "Inscription dans 5 annuaires professionnels ciblés",
        "Configuration des enregistrements DNS pour éviter les spams",
      ],
      isPopular: true,
      isActive: true,
    },
    {
      slug: "site-vitrine",
      name: "Site Vitrine",
      price: 150000,
      period: "projet",
      description: "Site vitrine professionnel, sur-mesure, optimisé pour le référencement.",
      features: [
        "5 pages sur-mesure",
        "Design responsive",
        "Référencement SEO de base",
        "Formulaire de contact",
        "Hébergement et nom de domaine 1 an",
      ],
      isPopular: false,
      isActive: true,
    },
  ];
  for (let i = 0; i < pricingData.length; i++) {
    const p = pricingData[i];
    await prisma.pricingPack.upsert({
      where: { slug: p.slug },
      update: { ...p, order: i },
      create: { ...p, order: i },
    });
  }
  console.log(`✅ ${pricingData.length} packs tarifaires créés`);

  // ============================================================
  // 4. SERVICES (depuis src/data/services.ts — on prend les titres/slugs)
  // ============================================================
  const servicesData = [
    {
      slug: "informatique-assistance",
      number: "01",
      title: "Informatique & Assistance",
      icon: "Wrench",
      tagline: "Des outils fiables, configurés et maintenus pour travailler sereinement.",
      availability: "immediate",
      availabilityLabel: "Immédiate, selon le besoin",
      problem: "Un ordinateur instable, un réseau mal configuré ou l'absence de technicien permanent freinent le travail quotidien d'une école, d'un commerce ou d'une organisation.",
      fullDescription: "YEHI OR Tech installe, configure et maintient les environnements informatiques. L'intervention peut concerner un poste individuel, un petit réseau, une école, un commerce ou une organisation qui souhaite mieux organiser son parc informatique.",
      deliverables: ["Installation et configuration d'ordinateurs", "Diagnostic et dépannage logiciel", "Optimisation des postes de travail", "Installation de petits réseaux", "Configuration d'imprimantes et périphériques", "Maintenance préventive", "Accompagnement et formation des utilisateurs", "Fourniture d'accessoires sur commande"],
      targetAudience: ["Enseignants et écoles", "Particuliers", "Petits commerces", "Associations et bureaux sans technicien permanent"],
      tags: ["Hardware", "Réseau", "Maintenance"],
      cta: "Démarrer ce service →",
      gradient: "linear-gradient(135deg, #F5B700 0%, #071A2F 100%)",
    },
    {
      slug: "design-graphique-imprime",
      number: "02",
      title: "Design Graphique & Imprimé",
      icon: "Palette",
      tagline: "Une identité visuelle forte, déclinée sur tous tes supports.",
      availability: "immediate",
      availabilityLabel: "Immédiate, selon le besoin",
      problem: "Une image de marque faible ou incohérente dessert ton produit. Les Flyers, cartes de visite, affiches et logos doivent transmettre ton sérieux dès le premier regard.",
      fullDescription: "YEHI OR Tech conçoit ton identité visuelle et imprime tes supports de communication. De la charte graphique au flyer final, en passant par les cartes de visite, on prend en charge toute la chaîne créative.",
      deliverables: ["Logo et charte graphique", "Cartes de visite", "Flyers et affiches", "Papeterie d'entreprise", "Supports réseaux sociaux", "Impression numérique"],
      targetAudience: ["Commerces", "Restaurants", "Associations", "Événementiel"],
      tags: ["Design", "Print", "Branding"],
      cta: "Démarrer ce service →",
      gradient: "linear-gradient(135deg, #071A2F 0%, #F5B700 100%)",
    },
    {
      slug: "textile-personnalise",
      number: "03",
      title: "Textile Personnalisé",
      icon: "Shirt",
      tagline: "Habille ton équipe et tes clients avec ton image.",
      availability: "sur-devis",
      availabilityLabel: "Sur devis selon quantité",
      problem: "Les T-shirts, polos et casquettes personnalisés renforcent l'identité d'une équipe, d'une école, d'un événement. Mais la qualité d'impression et de tissu fait toute la différence.",
      fullDescription: "YEHI OR Tech personnalise tes textiles : T-shirts, polos, casquettes, tote bags. Impression sérigraphie ou flex selon le volume et le rendu souhaité.",
      deliverables: ["T-shirts personnalisés", "Polos brodés", "Casquettes", "Tote bags", "Tenues d'équipe"],
      targetAudience: ["Entreprises", "Écoles", "Événementiel", "Sport"],
      tags: ["Textile", "Sérigraphie", "Broderie"],
      cta: "Demander un devis →",
      gradient: "linear-gradient(135deg, #0B3D91 0%, #071A2F 100%)",
    },
    {
      slug: "developpement-logiciel",
      number: "04",
      title: "Développement Logiciel",
      icon: "Code",
      tagline: "Des applications sur-mesure qui répondent à tes vrais besoins.",
      availability: "sur-devis",
      availabilityLabel: "Sur devis",
      problem: "Les outils du marché ne couvrent jamais 100% de tes besoins. Une application sur-mesure, c'est l'assurance d'un outil qui s'adapte à ton métier, pas l'inverse.",
      fullDescription: "YEHI OR Tech conçoit, développe et déploie des applications web et mobiles sur-mesure. Sites vitrine, applications métier, plateformes SaaS, intégrations API.",
      deliverables: ["Sites web et e-commerce", "Applications métier", "Plateformes SaaS", "APIs et intégrations", "Maintenance et évolutions"],
      targetAudience: ["Entrepreneurs", "PME", "Établissements", "Organisations"],
      tags: ["Web", "Mobile", "SaaS"],
      cta: "Demander un devis →",
      gradient: "linear-gradient(135deg, #071A2F 0%, #0B3D91 100%)",
    },
    {
      slug: "academia",
      number: "05",
      title: "Academia",
      icon: "GraduationCap",
      tagline: "La plateforme de gestion scolaire pensée pour le Bénin.",
      availability: "produit",
      availabilityLabel: "Abonnement mensuel",
      problem: "Les écoles béninoises jonglent entre inscriptions papier, calculs manuels de frais, et communication fragmentée avec les parents.",
      fullDescription: "Academia Helm est la plateforme de gestion scolaire conçue pour le contexte béninois. Inscriptions, paiement de frais scolaires, bulletins, communication parents-école, statistiques de fréquentation.",
      deliverables: ["Inscriptions en ligne", "Paiement de frais scolaires", "Bulletins numériques", "Communication parents", "Statistiques et rapports"],
      targetAudience: ["Écoles primaires", "Collèges", "Lycées", "Établissements privés"],
      tags: ["SaaS", "Éducation", "Bénin"],
      cta: "Découvrir Academia →",
      gradient: "linear-gradient(135deg, #F5B700 0%, #0B3D91 100%)",
    },
    {
      slug: "intelligence-artificielle",
      number: "06",
      title: "Intelligence Artificielle",
      icon: "Bot",
      tagline: "Automatise tes tâches répétitives avec des agents IA sur-mesure.",
      availability: "sur-devis",
      availabilityLabel: "Sur devis",
      problem: "Beaucoup d'entreprises perdent un temps précieux sur des tâches répétitives : relances, qualification de leads, prise de rendez-vous, publication de contenu.",
      fullDescription: "YEHI OR Tech conçoit des agents IA qui travaillent 24h/24 : assistants WhatsApp, chatbots intégrés, automatisations email, publication de contenu programmée, qualification de prospects.",
      deliverables: ["Agents WhatsApp", "Chatbots intégrés au site", "Automatisations email et CRM", "Publication de contenu programmée", "Qualification de prospects"],
      targetAudience: ["Entrepreneurs", "Commerciaux", "Équipes marketing", "TPE/PME"],
      tags: ["IA", "Automation", "WhatsApp"],
      cta: "Demander un devis →",
      gradient: "linear-gradient(135deg, #0B3D91 0%, #F5B700 100%)",
    },
  ];
  for (let i = 0; i < servicesData.length; i++) {
    const s = servicesData[i];
    await prisma.serviceContent.upsert({
      where: { slug: s.slug },
      update: { ...s, order: i, isActive: true },
      create: { ...s, order: i, isActive: true },
    });
  }
  console.log(`✅ ${servicesData.length} services créés`);

  // ============================================================
  // 5. TESTIMONIALS (vide au départ — l'utilisateur créera les siens)
  // ============================================================
  const testimonialsData = [
    {
      text: "Service impeccable. YEHI OR Tech a conçu notre site vitrine et l'identité visuelle en quelques jours. Notre image de marque a immédiatement gagné en crédibilité.",
      highlight: "Image de marque immédiatement crédibilisée",
      authorName: "Marie Adjovi",
      authorRole: "Gérante · Boutique Parakou",
      rating: 5,
      isActive: true,
    },
    {
      text: "Academia Helm a transformé notre gestion scolaire. Les inscriptions qui prenaient 3 semaines se font maintenant en 2 jours. Les parents adorent le suivi en temps réel.",
      highlight: "Inscriptions passées de 3 semaines à 2 jours",
      authorName: "M. Koffi",
      authorRole: "Directeur · CSP Baobab",
      rating: 5,
      isActive: true,
    },
  ];
  for (let i = 0; i < testimonialsData.length; i++) {
    const t = testimonialsData[i];
    await prisma.testimonial.upsert({
      where: { id: `testimonial-seed-${i}` },
      update: { ...t, order: i },
      create: { id: `testimonial-seed-${i}`, ...t, order: i },
    });
  }
  console.log(`✅ ${testimonialsData.length} témoignages créés`);

  // ============================================================
  // 6. PAGE CONTENT (hero, sections clés)
  // ============================================================
  const pageContentData = [
    // Homepage hero
    { page: "home", section: "hero", key: "title", value: "L'agence numérique qui pense ton marché avant ton code" },
    { page: "home", section: "hero", key: "subtitle", value: "Sites web, applications, IA, impression. YEHI OR Tech couvre toute la chaîne numérique, du pixel à l'imprimé, depuis Parakou." },
    { page: "home", section: "hero", key: "ctaPrimary", value: "Démarrer un projet →" },
    { page: "home", section: "hero", key: "ctaSecondary", value: "Voir les réalisations" },
    // About page
    { page: "about", section: "hero", key: "title", value: "Notre histoire" },
    { page: "about", section: "hero", key: "subtitle", value: "YEHI OR Tech est née à Parakou, au cœur du Bénin, pour bâtir l'infrastructure numérique de l'Afrique de l'Ouest." },
  ];
  for (const pc of pageContentData) {
    await prisma.pageContent.upsert({
      where: { page_section_key: { page: pc.page, section: pc.section, key: pc.key } },
      update: { value: pc.value },
      create: pc,
    });
  }
  console.log(`✅ ${pageContentData.length} contenus de page créés`);

  console.log("\n🌱 Seed contenu terminé.");
  console.log("Tu peux maintenant éditer ce contenu depuis le manager :");
  console.log("  - /manager/services — éditer les services");
  console.log("  - /manager/testimonials — éditer les témoignages");
  console.log("  - /manager/portfolio-content — éditer le portfolio");
  console.log("  - /manager/pricing — éditer les packs");
  console.log("  - /manager/stats-content — éditer les statistiques");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
