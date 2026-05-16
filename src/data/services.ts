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
};

export const services: Service[] = [
  {
    slug: "conception-graphique",
    title: "Conception Graphique",
    icon: "Palette",
    shortDescription: "Supports visuels professionnels pour renforcer votre image.",
    fullDescription: "Nous créons des supports visuels qui captent l'attention et renforcent votre image de marque. De la carte de visite au flyer publicitaire, nous assurons une cohérence visuelle parfaite sur tous vos supports.",
    deliverables: ["Flyers professionnels", "Affiches publicitaires", "Cartes de visite", "Cartes d'invitation", "Visuels réseaux sociaux", "Identité visuelle"],
    benefits: ["Image professionnelle immédiate", "Communication claire", "Supports prêts à diffuser", "Mémorisation accrue"],
    tags: ["Flyers", "Cartes de visite", "Social Media", "Identité visuelle"],
    gradient: "linear-gradient(135deg, #2C1A2C 0%, #0D1117 100%)"
  },
  {
    slug: "creation-sites-web",
    title: "Création de Sites Web",
    icon: "Globe",
    shortDescription: "Sites modernes, rapides et optimisés pour la conversion.",
    fullDescription: "Votre site web est votre vitrine 24h/24. Nous concevons des sites performants, compatibles mobile et optimisés pour le référencement afin de transformer vos visiteurs en clients.",
    deliverables: ["Sites vitrines", "Landing pages", "E-commerce", "Sites institutionnels", "Blogs", "Maintenance"],
    benefits: ["Présence mondiale", "Crédibilité renforcée", "Acquisition de clients", "Autonomie de gestion"],
    tags: ["Responsive", "SEO", "Next.js", "Performance"],
    gradient: "linear-gradient(135deg, #0D1117 0%, #071A2F 100%)"
  },
  {
    slug: "applications-web-mobile",
    title: "Applications Web & Mobile",
    icon: "Monitor",
    shortDescription: "Solutions SaaS et outils métiers sur mesure.",
    fullDescription: "Nous développons des applications complexes qui automatisent vos processus métiers. Du tableau de bord administratif à la plateforme SaaS, nous construisons des outils robustes et évolutifs.",
    deliverables: ["Plateformes SaaS", "Dashboards", "Applications mobiles", "APIs robustes", "Gestion de données", "Outils internes"],
    benefits: ["Efficacité opérationnelle", "Centralisation des données", "Accessibilité multi-support", "Évolutivité"],
    tags: ["SaaS", "Dashboard", "React", "Node.js"],
    gradient: "linear-gradient(135deg, #1A2744 0%, #080A0F 100%)"
  },
  {
    slug: "agents-ia",
    title: "Agents IA",
    icon: "Bot",
    shortDescription: "L'IA au service de votre support et de vos ventes.",
    fullDescription: "Intégrez l'intelligence artificielle dans votre quotidien. Nos agents IA gèrent votre support client, qualifient vos prospects et prennent vos rendez-vous automatiquement sur WhatsApp, Facebook ou votre site.",
    deliverables: ["WhatsApp Bot IA", "Assistant web intelligent", "Qualification prospects", "Automatisation support", "Intégration LLM", "Agents multilingues"],
    benefits: ["Disponibilité 24h/24", "Réduction des coûts", "Réponse instantanée", "Productivité accrue"],
    tags: ["IA", "WhatsApp", "Automation", "Support"],
    gradient: "linear-gradient(135deg, #071A2F 0%, #141921 100%)"
  },
  {
    slug: "automatisation-metier",
    title: "Automatisation Métier",
    icon: "Zap",
    shortDescription: "Éliminez les tâches répétitives de votre quotidien.",
    fullDescription: "Ne perdez plus de temps sur des tâches manuelles. Nous créons des workflows intelligents qui connectent vos outils et automatisent vos processus de vente, de marketing et de gestion.",
    deliverables: ["Workflows n8n/Zapier", "Relances automatiques", "Notifications intelligentes", "Synchronisation CRM", "Reporting auto", "Audit process"],
    benefits: ["Gain de temps massif", "Zéro erreur humaine", "Focus sur l'essentiel", "Processus fluides"],
    tags: ["n8n", "Zapier", "Efficiency", "Process"],
    gradient: "linear-gradient(135deg, #2C1A2C 0%, #080A0F 100%)"
  },
  {
    slug: "marketing-digital",
    title: "Marketing Digital",
    icon: "TrendingUp",
    shortDescription: "Boostez votre visibilité et vos ventes en ligne.",
    fullDescription: "Attirez les bonnes personnes vers votre offre. Nous gérons vos réseaux sociaux et vos campagnes publicitaires pour maximiser votre retour sur investissement et faire croître votre communauté.",
    deliverables: ["Facebook Ads", "Google Ads", "Community Management", "Stratégie de contenu", "Email Marketing", "Copywriting"],
    benefits: ["Visibilité ciblée", "Augmentation des ventes", "Engagement communauté", "Notoriété"],
    tags: ["Ads", "Social Media", "Growth", "Content"],
    gradient: "linear-gradient(135deg, #1A2744 0%, #0D1117 100%)"
  },
  {
    slug: "credibilite-en-ligne",
    title: "Crédibilité en Ligne",
    icon: "ShieldCheck",
    shortDescription: "Les fondations de votre image professionnelle.",
    fullDescription: "Soyez pris au sérieux dès le premier contact. Nous configurons vos emails professionnels, votre fiche Google Maps et assurons votre présence dans les annuaires stratégiques pour une image impeccable.",
    deliverables: ["Emails pro @domaine", "Fiche Google Maps", "SEO Local", "Annuaires pro", "Config DNS anti-spam", "Indexation Google"],
    benefits: ["Confiance immédiate", "Référencement local", "Image institutionnelle", "Sécurité emails"],
    tags: ["Emails Pro", "Google Maps", "Trust", "Local SEO"],
    gradient: "linear-gradient(135deg, #080A0F 0%, #1A2744 100%)"
  },
  {
    slug: "conseil-accompagnement",
    title: "Conseil & Stratégie",
    icon: "Compass",
    shortDescription: "Votre partenaire pour votre transformation digitale.",
    fullDescription: "Le digital ne s'improvise pas. Nous vous accompagnons dans le choix des technologies, l'audit de votre présence actuelle et la définition d'une feuille de route claire pour vos projets numériques.",
    deliverables: ["Audit digital", "Stratégie numérique", "Accompagnement projet", "Formation outils", "Conseil technique", "Veille IA"],
    benefits: ["Choix technos sûrs", "Vision claire", "Accélération projets", "Compétences internes"],
    tags: ["Consulting", "Strategy", "Training", "Audit"],
    gradient: "linear-gradient(135deg, #0D1117 0%, #2C1A2C 100%)"
  }
];
