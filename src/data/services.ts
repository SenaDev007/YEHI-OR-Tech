export type Service = {
  slug: string;
  title: string;
  icon: string;
  shortDescription: string;
  fullDescription: string;
  deliverables: string[];
  benefits: string[];
  tags: string[];
  gradient: string;
  image?: string;
};

export const services: Service[] = [
  {
    slug: "informatique",
    title: "Informatique & assistance",
    icon: "Monitor",
    shortDescription: "Des outils fiables, configurés et maintenus pour travailler sereinement.",
    fullDescription: "Nous installons, configurons et maintenons les environnements informatiques des particuliers, écoles, entreprises et organisations de Parakou et du Bénin.",
    deliverables: ["Installation et configuration", "Maintenance et dépannage", "Réseaux de proximité", "Formation informatique", "Optimisation des postes", "Vente d'accessoires sur commande"],
    benefits: ["Moins d'interruptions", "Un parc mieux organisé", "Assistance de proximité", "Décisions techniques claires"],
    tags: ["Maintenance", "Réseau", "Formation", "Support"],
    gradient: "linear-gradient(135deg, #071b48 0%, #0b4fd3 100%)",
    image: "/images/services/credibility.png"
  },
  {
    slug: "developpement",
    title: "Développement logiciel",
    icon: "Code2",
    shortDescription: "Sites, applications et systèmes métiers conçus pour votre réalité.",
    fullDescription: "Nous transformons un besoin métier en produit numérique : application web, mobile, desktop, API, portail client ou logiciel métier évolutif.",
    deliverables: ["Sites web", "Applications web et mobiles", "SaaS métiers", "API et bases de données", "Portails clients", "Maintenance évolutive"],
    benefits: ["Processus centralisés", "Données mieux maîtrisées", "Produit évolutif", "Accompagnement de bout en bout"],
    tags: ["SaaS", "Web", "Mobile", "API"],
    gradient: "linear-gradient(135deg, #0d234f 0%, #1464f4 100%)",
    image: "/images/services/app-mobile.png"
  },
  {
    slug: "academia",
    title: "Academia — gestion scolaire",
    icon: "GraduationCap",
    shortDescription: "Le logiciel SaaS de YEHI OR Tech pour piloter les établissements scolaires.",
    fullDescription: "Academia aide les établissements à structurer leurs élèves, leur scolarité, leurs finances, leurs bulletins, leur pédagogie et leur communication dans un environnement numérique unifié.",
    deliverables: ["Gestion des élèves", "Scolarité et paiements", "Bulletins et examens", "Économat et finances", "Communication scolaire", "Accompagnement et support"],
    benefits: ["Moins de saisies répétitives", "Données accessibles", "Meilleure visibilité direction", "Décisions scolaires documentées"],
    tags: ["SaaS", "Éducation", "Écoles", "Parakou"],
    gradient: "linear-gradient(135deg, #0b3d91 0%, #f5b700 100%)",
    image: "/images/heroes/portfolio.png"
  },
  {
    slug: "design",
    title: "Infographie & identité visuelle",
    icon: "Palette",
    shortDescription: "Des marques et supports visuels cohérents, mémorables et prêts à diffuser.",
    fullDescription: "Nous donnons une forme claire aux idées : identité visuelle, logos, affiches, flyers, présentations et contenus numériques pour entreprises, écoles et événements.",
    deliverables: ["Logo et charte graphique", "Affiches et flyers", "Cartes et brochures", "Visuels réseaux sociaux", "Présentations", "Supports événementiels"],
    benefits: ["Image plus professionnelle", "Message plus lisible", "Supports cohérents", "Création réutilisable"],
    tags: ["Branding", "Print", "Social media", "Direction artistique"],
    gradient: "linear-gradient(135deg, #2c1a2c 0%, #0d1117 100%)",
    image: "/images/services/graphic-design.png"
  },
  {
    slug: "impression-personnalisation",
    title: "Impression & personnalisation",
    icon: "Printer",
    shortDescription: "Du document urgent au support personnalisé, avec une production de proximité.",
    fullDescription: "Notre atelier de proximité réalise photocopies, impressions couleur, scans, dossiers, supports de communication et personnalisations textiles sur commande.",
    deliverables: ["Photocopies et impressions", "Scan et envoi numérique", "Saisie et mise en forme", "Reliure et finition", "T-shirts personnalisés", "Supports promotionnels"],
    benefits: ["Service rapide", "Production locale", "Commandes sur acompte", "Un interlocuteur unique"],
    tags: ["Photocopie", "Impression", "Textile", "École"],
    gradient: "linear-gradient(135deg, #f5b700 0%, #0b3d91 100%)",
    image: "/images/heroes/services.png"
  },
  {
    slug: "redaction",
    title: "Rédaction & mise en forme",
    icon: "FileText",
    shortDescription: "Des documents propres, lisibles et adaptés à leur objectif.",
    fullDescription: "Nous saisissons, corrigeons et mettons en forme CV, lettres, rapports, dossiers professionnels et documents administratifs.",
    deliverables: ["CV et lettres", "Rapports et mémoires", "Saisie de documents", "Correction et relecture", "Mise en page", "Dossiers administratifs"],
    benefits: ["Documents plus clairs", "Moins d'erreurs", "Présentation professionnelle", "Délais maîtrisés"],
    tags: ["CV", "Saisie", "Correction", "Documents"],
    gradient: "linear-gradient(135deg, #071a2f 0%, #51627f 100%)",
    image: "/images/heroes/contact.png"
  },
  {
    slug: "ia-automatisation",
    title: "IA & automatisation",
    icon: "Bot",
    shortDescription: "Des systèmes intelligents pour réduire les tâches répétitives.",
    fullDescription: "Nous intégrons des assistants, automatisations et connexions entre outils pour améliorer le support, la vente et les opérations des organisations.",
    deliverables: ["Assistants web et WhatsApp", "Qualification de prospects", "Automatisations métier", "Intégrations API", "Reporting automatisé", "Audit de processus"],
    benefits: ["Gain de temps", "Réponses plus rapides", "Processus documentés", "Croissance progressive"],
    tags: ["IA", "Agents", "Automation", "API"],
    gradient: "linear-gradient(135deg, #071a2f 0%, #2c1a2c 100%)",
    image: "/images/services/ai-agents.png"
  },
  {
    slug: "conseil-formation",
    title: "Conseil & formation",
    icon: "Compass",
    shortDescription: "Une feuille de route compréhensible avant d'investir dans la technologie.",
    fullDescription: "Nous aidons les dirigeants, écoles et équipes à clarifier leurs priorités numériques, choisir des outils adaptés et faire monter leurs collaborateurs en compétence.",
    deliverables: ["Audit numérique", "Feuille de route", "Formation aux outils", "Accompagnement projet", "Documentation", "Veille technologique"],
    benefits: ["Investissements mieux ciblés", "Équipe plus autonome", "Vision partagée", "Décisions plus rapides"],
    tags: ["Stratégie", "Formation", "Audit", "Transformation"],
    gradient: "linear-gradient(135deg, #0d1117 0%, #0b3d91 100%)",
    image: "/images/services/consulting.png"
  }
];
