/**
 * Les 8 pôles officiels de YEHI OR Tech (CDC v4.0 section 7.4).
 * Catalogue complet avec données détaillées pour la page /services
 * et les fiches individuelles /services/[slug].
 */

export type Availability = "immediate" | "sur-devis" | "produit";

export type Service = {
  slug: string;
  number: string;
  title: string;
  icon: string; // Nom lucide-react
  tagline: string;
  availability: Availability;
  availabilityLabel: string;
  problem: string;
  fullDescription: string;
  deliverables: string[];
  targetAudience: string[];
  commercialLimit?: string;
  formFields: string[];
  faq: { question: string; answer: string }[];
  tags: string[];
  cta: string;
  gradient: string;
};

export const services: Service[] = [
  {
    slug: "informatique-assistance",
    number: "01",
    title: "Informatique & Assistance",
    icon: "Wrench",
    tagline: "Des outils fiables, configurés et maintenus pour travailler sereinement.",
    availability: "immediate",
    availabilityLabel: "Immédiate, selon le besoin",
    problem:
      "Un ordinateur instable, un réseau mal configuré ou l'absence de technicien permanent freinent le travail quotidien d'une école, d'un commerce ou d'une organisation.",
    fullDescription:
      "YEHI OR Tech installe, configure et maintient les environnements informatiques. L'intervention peut concerner un poste individuel, un petit réseau, une école, un commerce ou une organisation qui souhaite mieux organiser son parc informatique.",
    deliverables: [
      "Installation et configuration d'ordinateurs",
      "Diagnostic et dépannage logiciel",
      "Optimisation des postes de travail",
      "Installation de petits réseaux et partage de ressources",
      "Configuration d'imprimantes et périphériques",
      "Maintenance préventive",
      "Accompagnement et formation des utilisateurs",
      "Fourniture d'accessoires sur commande",
    ],
    targetAudience: [
      "Enseignants et écoles",
      "Particuliers",
      "Petits commerces",
      "Associations et bureaux sans technicien permanent",
    ],
    commercialLimit:
      "Diagnostic, assistance et orientation vers la réparation adaptée. YEHI OR Tech ne promet pas de réparation matérielle lourde tant que l'outillage et les pièces nécessaires ne sont pas disponibles.",
    formFields: [
      "Type d'appareil",
      "Problème constaté",
      "Urgence",
      "Lieu d'intervention",
      "Système utilisé",
      "Photo ou capture d'écran (facultatif)",
    ],
    faq: [
      {
        question: "Intervenez-vous à domicile ou en entreprise ?",
        answer: "Oui, selon l'urgence et la localisation à Parakou.",
      },
      {
        question: "Le diagnostic est-il gratuit ?",
        answer:
          "Le diagnostic de base est gratuit, l'intervention est facturée selon le temps et les pièces.",
      },
    ],
    tags: ["Dépannage", "Réseaux", "Maintenance", "Formation utilisateurs"],
    cta: "Demander une assistance",
    gradient: "linear-gradient(135deg, #0B3D91 0%, #0D1117 100%)",
  },
  {
    slug: "developpement-logiciel",
    number: "02",
    title: "Développement Logiciel",
    icon: "Code2",
    tagline: "Sites, applications et systèmes métiers conçus pour ta réalité.",
    availability: "sur-devis",
    availabilityLabel: "Sur étude et devis",
    problem:
      "Un site absent ou obsolète, un processus métier géré à la main ou sur tableur, freinent la croissance et font perdre du temps chaque semaine.",
    fullDescription:
      "YEHI OR Tech accompagne la conception et l'évolution de produits numériques. La mission commence par la compréhension du besoin, se poursuit par une proposition fonctionnelle et se termine par une livraison documentée et un accompagnement après mise en ligne.",
    deliverables: [
      "Sites vitrines et sites institutionnels",
      "Applications web et mobiles",
      "Logiciels métiers et plateformes SaaS",
      "API et bases de données",
      "Portails clients et espaces privés",
      "Intégrations avec des services externes",
      "Maintenance corrective et évolutive",
      "Hébergement et mise en production selon le projet",
    ],
    targetAudience: [
      "PME et commerces",
      "Écoles et établissements",
      "Associations et organisations",
      "Porteurs de projet numérique",
    ],
    formFields: [
      "Objectif du projet",
      "Utilisateurs concernés",
      "Fonctionnalités attendues",
      "Délai souhaité",
      "Budget indicatif",
      "Outils déjà utilisés",
    ],
    faq: [
      {
        question: "Combien coûte un site ou une application ?",
        answer:
          "Le prix dépend du périmètre, du nombre d'utilisateurs, des intégrations, de la sécurité et du niveau de maintenance demandé. Un devis est établi après le cadrage.",
      },
      {
        question: "Quelles sont les étapes ?",
        answer:
          "Cadrage, conception, développement, tests, déploiement, formation et maintenance.",
      },
    ],
    tags: ["Sites web", "Applications", "SaaS", "API"],
    cta: "Décrire un projet",
    gradient: "linear-gradient(135deg, #1464F4 0%, #0D1117 100%)",
  },
  {
    slug: "academia",
    number: "03",
    title: "Academia",
    icon: "GraduationCap",
    tagline:
      "Une plateforme unifiée pour piloter les élèves, la scolarité, les finances et la communication de ton établissement.",
    availability: "produit",
    availabilityLabel: "Produit en production",
    problem:
      "Un établissement scolaire qui gère élèves, paiements, bulletins et communication avec les familles sur des supports séparés perd en visibilité et en fiabilité.",
    fullDescription:
      "Academia aide les établissements à structurer leurs données scolaires dans un environnement numérique unifié. La plateforme facilite la gestion des élèves, la scolarité, les paiements, les bulletins, les examens, l'économat, les finances et la communication, selon les modules réellement disponibles.",
    deliverables: [
      "Gestion des élèves et des responsables",
      "Classes, niveaux et inscriptions",
      "Suivi de la scolarité et des paiements",
      "Bulletins et résultats",
      "Examens et organisation pédagogique",
      "Économat et suivi financier",
      "Communication avec les familles",
      "Support, accompagnement et formation",
    ],
    targetAudience: [
      "Écoles primaires et secondaires",
      "Établissements privés et confessionnels",
      "Directions et administrations scolaires",
    ],
    commercialLimit:
      "Seuls les modules réellement disponibles dans le produit sont présentés. Aucune statistique ni logo client non autorisé n'est affiché.",
    formFields: [
      "Nom de l'établissement",
      "Nombre approximatif d'élèves",
      "Rôle du contact",
      "Besoins prioritaires",
      "Meilleur canal de contact",
    ],
    faq: [
      {
        question: "Academia est-il déjà utilisé par des écoles ?",
        answer:
          "Academia est un produit en production, avec un accompagnement personnalisé au déploiement.",
      },
      {
        question: "Une démonstration est-elle possible avant de s'engager ?",
        answer:
          "Oui, la démonstration est le point d'entrée recommandé avant toute discussion de tarif.",
      },
    ],
    tags: ["Gestion scolaire", "SaaS", "Paiements", "Communication"],
    cta: "Demander une démonstration",
    gradient: "linear-gradient(135deg, #F5B700 0%, #071A2F 100%)",
  },
  {
    slug: "infographie-identite-visuelle",
    number: "04",
    title: "Infographie & Identité Visuelle",
    icon: "Palette",
    tagline: "Des marques et supports visuels cohérents, mémorables et prêts à diffuser.",
    availability: "sur-devis",
    availabilityLabel: "Sur commande",
    problem:
      "Une identité visuelle incohérente ou absente affaiblit la crédibilité d'une structure avant même le premier échange avec un client.",
    fullDescription:
      "Ce pôle donne une forme cohérente aux marques, événements et communications, du logo jusqu'aux supports de diffusion.",
    deliverables: [
      "Création ou modernisation de logo",
      "Charte graphique",
      "Affiches, flyers et invitations",
      "Cartes de visite et brochures",
      "Visuels pour réseaux sociaux",
      "Présentations professionnelles",
      "Supports d'événements et de campagnes",
      "Déclinaisons pour impression et diffusion numérique",
    ],
    targetAudience: [
      "Entreprises et commerces",
      "Écoles et associations",
      "Organisateurs d'événements",
    ],
    commercialLimit:
      "Les fichiers sources modifiables ne sont inclus que lorsque cela est prévu dans le devis.",
    formFields: [
      "Nom de la structure",
      "Objectif",
      "Public cible",
      "Texte à intégrer",
      "Dimensions",
      "Références visuelles",
      "Couleurs souhaitées",
      "Délai",
      "Supports de diffusion",
    ],
    faq: [
      {
        question: "Combien de propositions de logo sont incluses ?",
        answer:
          "Le nombre de propositions et de corrections est précisé dans chaque devis.",
      },
      {
        question: "Recevrai-je les fichiers sources ?",
        answer: "Uniquement si cela est prévu au devis initial.",
      },
    ],
    tags: ["Logo", "Charte graphique", "Flyers", "Réseaux sociaux"],
    cta: "Demander un devis créatif",
    gradient: "linear-gradient(135deg, #2C1A2C 0%, #0D1117 100%)",
  },
  {
    slug: "impression-personnalisation",
    number: "05",
    title: "Impression & Personnalisation",
    icon: "Printer",
    tagline:
      "Du document urgent au support personnalisé, avec une production de proximité.",
    availability: "immediate",
    availabilityLabel: "Immédiate ou sur commande",
    problem:
      "Un document à rendre le jour même, un dossier à imprimer avant un rendez-vous, ou une classe qui veut des T-shirts pour un événement, ne peuvent pas attendre une commande à distance.",
    fullDescription:
      "Ce pôle constitue le service de proximité le plus immédiatement exploitable autour de l'agence à Parakou.",
    deliverables: [
      "Photocopies noir et blanc",
      "Impressions couleur",
      "Scan et conversion en PDF",
      "Envoi par WhatsApp ou e-mail",
      "Saisie et mise en forme",
      "Agrafage, perforation et finition",
      "Reliure selon l'équipement disponible",
      "T-shirts personnalisés sur commande",
    ],
    targetAudience: [
      "Élèves et étudiants",
      "Enseignants",
      "Petits commerces",
      "Classes, clubs et équipes pour événements",
    ],
    commercialLimit:
      "Pas de prix fixe publié si le coût des consommables fluctue fortement. Les travaux en quantité et les personnalisations sont demandés avec un acompte.",
    formFields: [
      "Quantité",
      "Format",
      "Type de papier",
      "Couleur",
      "Délai souhaité",
      "Fichier joint (si possible)",
    ],
    faq: [
      {
        question: "Quels sont vos horaires ?",
        answer:
          "Affichés sur la page contact, identiques à ceux du reste du site.",
      },
      {
        question: "Un acompte est-il demandé ?",
        answer: "Oui, pour les travaux en quantité et les personnalisations.",
      },
    ],
    tags: ["Photocopie", "Impression couleur", "Scan", "T-shirts"],
    cta: "Commander une impression",
    gradient: "linear-gradient(135deg, #C88000 0%, #0D1117 100%)",
  },
  {
    slug: "redaction-mise-en-forme",
    number: "06",
    title: "Rédaction & Mise en Forme",
    icon: "FileText",
    tagline: "Des documents propres, lisibles et adaptés à leur objectif.",
    availability: "immediate",
    availabilityLabel: "Immédiate, selon le volume",
    problem:
      "Un CV mal présenté, un rapport manuscrit à saisir, ou un dossier administratif à mettre en forme, coûtent du temps et parfois une opportunité.",
    fullDescription:
      "Ce pôle aide les clients à transformer des informations brutes en documents lisibles et présentables. Il améliore la présentation et la clarté d'un document sans se substituer à un avocat, un expert-comptable, un enseignant ou un rédacteur spécialisé lorsque le sujet l'exige.",
    deliverables: [
      "CV et lettres de motivation",
      "Saisie de documents manuscrits",
      "Rapports et mémoires",
      "Correction et relecture",
      "Mise en page professionnelle",
      "Dossiers administratifs",
      "Conversion en PDF et préparation à l'impression",
    ],
    targetAudience: [
      "Demandeurs d'emploi",
      "Étudiants",
      "Petits entrepreneurs",
      "Particuliers avec démarches administratives",
    ],
    commercialLimit:
      "Les documents transmis sont traités uniquement pour exécuter la commande, puis supprimés ou archivés selon un délai convenu avec le client.",
    formFields: [
      "Type de document",
      "Volume de pages",
      "Délai souhaité",
      "Fichier à fournir",
    ],
    faq: [
      {
        question: "Mes documents sont-ils confidentiels ?",
        answer:
          "Oui, ils sont traités uniquement pour la commande et supprimés ou archivés selon le délai convenu.",
      },
      {
        question: "Rédigez-vous du contenu spécialisé (juridique, comptable) ?",
        answer:
          "Non, ce pôle met en forme et corrige, il ne remplace pas un professionnel du domaine concerné.",
      },
    ],
    tags: ["CV", "Saisie", "Correction", "Mise en page"],
    cta: "Envoyer un document",
    gradient: "linear-gradient(135deg, #4B5563 0%, #0D1117 100%)",
  },
  {
    slug: "ia-automatisation",
    number: "07",
    title: "IA & Automatisation",
    icon: "Bot",
    tagline: "Des systèmes intelligents pour réduire les tâches répétitives.",
    availability: "sur-devis",
    availabilityLabel: "Sur audit et étude",
    problem:
      "Recopier la même information dans plusieurs outils, ou répondre manuellement aux mêmes questions chaque jour, consomme un temps qui pourrait être redistribué.",
    fullDescription:
      "Ce pôle aide les organisations à réduire les tâches répétitives et à mieux relier leurs outils. L'automatisation commence toujours par un audit : données manipulées, accès nécessaires, limites de l'intelligence artificielle et points qui doivent rester sous contrôle humain.",
    deliverables: [
      "Assistants web et assistants conversationnels",
      "Automatisation de la qualification de prospects",
      "Notifications et rappels",
      "Intégration d'API",
      "Génération de rapports",
      "Centralisation de données",
      "Audit de processus",
      "Documentation des workflows",
    ],
    targetAudience: [
      "PME avec tâches répétitives identifiées",
      "Écoles et organisations avec volume de demandes élevé",
      "Équipes commerciales",
    ],
    formFields: [
      "Tâche répétitive actuelle",
      "Fréquence",
      "Outils utilisés",
      "Volume de données",
      "Résultat attendu",
      "Personnes concernées",
      "Contraintes de confidentialité",
    ],
    faq: [
      {
        question: "Par où commence un projet d'automatisation ?",
        answer:
          "Par un audit des tâches et des outils existants, avant toute proposition technique.",
      },
      {
        question: "L'IA remplace-t-elle complètement l'humain ?",
        answer:
          "Non, les points qui doivent rester sous contrôle humain sont identifiés dès l'audit.",
      },
    ],
    tags: ["Assistants IA", "n8n", "Intégrations", "Audit"],
    cta: "Étudier une automatisation",
    gradient: "linear-gradient(135deg, #1464F4 0%, #071A2F 100%)",
  },
  {
    slug: "conseil-formation",
    number: "08",
    title: "Conseil & Formation",
    icon: "Compass",
    tagline:
      "Une feuille de route compréhensible avant d'investir dans la technologie.",
    availability: "sur-devis",
    availabilityLabel: "Sur rendez-vous",
    problem:
      "Acheter un outil ou lancer un projet numérique avant de savoir ce qui est vraiment nécessaire est la façon la plus coûteuse de se tromper.",
    fullDescription:
      "Ce pôle permet aux clients de prendre de bonnes décisions avant d'acheter ou de déployer une technologie. Une mission de conseil produit un diagnostic, des priorités, des recommandations chiffrées lorsque possible et un plan d'action par étapes.",
    deliverables: [
      "Audit numérique",
      "Feuille de route de transformation",
      "Choix d'outils",
      "Formation informatique",
      "Accompagnement au déploiement",
      "Documentation des procédures",
      "Veille technologique",
      "Formation à l'utilisation d'Academia lorsque pertinente",
    ],
    targetAudience: [
      "Dirigeants d'entreprise",
      "Directions d'établissement scolaire",
      "Organisations en digitalisation progressive",
    ],
    commercialLimit:
      "Le conseil n'est jamais présenté comme une promesse vague de digitalisation, toujours comme un diagnostic suivi de priorités concrètes.",
    formFields: [
      "Contexte de l'organisation",
      "Objectif de la mission",
      "Outils actuels",
      "Contraintes de budget et de délai",
    ],
    faq: [
      {
        question: "Qu'est-ce que je reçois à la fin d'une mission de conseil ?",
        answer:
          "Un diagnostic, des priorités, des recommandations et un plan d'action par étapes.",
      },
      {
        question: "La formation à Academia est-elle comprise ?",
        answer:
          "Elle peut être incluse lorsque c'est pertinent pour l'organisation accompagnée.",
      },
    ],
    tags: ["Audit", "Feuille de route", "Formation", "Déploiement"],
    cta: "Planifier un échange",
    gradient: "linear-gradient(135deg, #0B3D91 0%, #071A2F 100%)",
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}
