/**
 * Seed additionnel pour les sections About + navigation labels.
 *
 * About sections :
 *  - about.intro.title / paragraph1 / paragraph2 / paragraph3
 *  - about.mission.title / text
 *  - about.vision.title / text
 *  - about.values.title (titre section valeurs)
 *  - about.tech.title (titre section stack technique)
 *
 * Navigation :
 *  - nav.navbar.services / tarifs / portfolio / about / contact
 *  - nav.footer-services.X (8 services)
 *  - nav.footer-company.X
 *  - nav.footer-products.X
 */
import pg from "pg";

const DATABASE_URL =
  process.env.DATABASE_URL ||
  "postgresql://neondb_owner:npg_RCoTALa03Jbw@ep-cold-sun-agchdf0u-pooler.c-2.eu-central-1.aws.neon.tech/YEHI%20OR%20Tech?sslmode=require";

const client = new pg.Client({
  connectionString: DATABASE_URL,
  connectionTimeoutMillis: 15000,
});

const SEED = [
  // ============================================================
  // ABOUT — intro paragraphs
  // ============================================================
  { page: "about", section: "intro", key: "title", value: "Notre histoire" },
  { page: "about", section: "intro", key: "paragraph1", value: "YEHI OR Tech démarre à Parakou comme un centre de services numériques et d'impression de proximité : photocopie, impression, saisie, personnalisation. Pas de levée de fonds, pas de promesse en l'air, un service utile vendu chaque jour à ceux qui en ont besoin." },
  { page: "about", section: "intro", key: "paragraph2", value: "Les revenus de cette activité financent, étape par étape, la montée en gamme vers les applications SaaS, les agents IA et l'automatisation que tu vois sur ce site. C'est un choix : construire un socle solide avant de monter en technicité, plutôt que l'inverse." },
  { page: "about", section: "intro", key: "paragraph3", value: "YEHI OR signifie « Que la lumière soit » en hébreu. Lumière, clarté, transformation, excellence et impact : ce que cette entreprise entend incarner dans chaque mission." },

  // ============================================================
  // ABOUT — mission + vision
  // ============================================================
  { page: "about", section: "mission", key: "title", value: "Mission" },
  { page: "about", section: "mission", key: "text", value: "Donner aux organisations un accès à des solutions numériques professionnelles, accessibles, et réellement utiles à leur croissance." },
  { page: "about", section: "vision", key: "title", value: "Vision" },
  { page: "about", section: "vision", key: "text", value: "Devenir une référence de la transformation digitale et de l'IA appliquée en Afrique francophone, et au-delà." },

  // Section titles
  { page: "about", section: "values", key: "title", value: "Huit principes, un seul standard" },
  { page: "about", section: "values", key: "tag", value: "Valeurs" },
  { page: "about", section: "tech", key: "title", value: "Les outils qu'on utilise tous les jours" },
  { page: "about", section: "tech", key: "tag", value: "Stack technologique" },
  { page: "about", section: "tech", key: "description", value: "Pas une liste pour impressionner. Chaque outil ci-dessous est réellement utilisé en production." },
  { page: "about", section: "identity", key: "title", value: "Carte d'identité" },

  // ============================================================
  // NAVBAR labels
  // ============================================================
  { page: "nav", section: "navbar", key: "services", value: "Services" },
  { page: "nav", section: "navbar", key: "tarifs", value: "Tarifs" },
  { page: "nav", section: "navbar", key: "portfolio", value: "Réalisations" },
  { page: "nav", section: "navbar", key: "about", value: "À propos" },
  { page: "nav", section: "navbar", key: "contact", value: "Contact" },

  // ============================================================
  // FOOTER — Company links
  // ============================================================
  { page: "nav", section: "footer-company", key: "about", value: "À propos" },
  { page: "nav", section: "footer-company", key: "tarifs", value: "Tarifs" },
  { page: "nav", section: "footer-company", key: "portfolio", value: "Réalisations" },
  { page: "nav", section: "footer-company", key: "contact", value: "Contact" },

  // Footer section titles
  { page: "nav", section: "footer", key: "services_title", value: "Services" },
  { page: "nav", section: "footer", key: "products_title", value: "Produits" },
  { page: "nav", section: "footer", key: "company_title", value: "Entreprise" },
  { page: "nav", section: "footer", key: "follow_title", value: "Suivez-nous" },
  { page: "nav", section: "footer", key: "tagline", value: "L'agence numérique qui pense ton marché avant ton code." },
  { page: "nav", section: "footer", key: "copyright", value: "© YEHI OR Tech — Tous droits réservés." },

  // ============================================================
  // HOMEPAGE — section titles
  // ============================================================
  { page: "home", section: "services", key: "tag", value: "Nos services" },
  { page: "home", section: "services", key: "title", value: "Huit pôles. Un seul interlocuteur." },
  { page: "home", section: "services", key: "description", value: "Des besoins numériques du quotidien aux systèmes sur mesure. Chaque pôle correspond à un problème réel, avec une disponibilité et un mode de commande clairement indiqués." },
  { page: "home", section: "services", key: "cta", value: "Voir le détail de chaque pôle" },

  { page: "home", section: "stats", key: "tag", value: "Chiffres clés" },
  { page: "home", section: "stats", key: "subtitle", value: "Toutes vérifiables aujourd'hui — aucune promesse gonflée." },

  { page: "home", section: "process", key: "tag", value: "Notre processus" },
  { page: "home", section: "process", key: "title", value: "Comment nous travaillons" },
  { page: "home", section: "process", key: "description", value: "Six étapes, chacune répond à une peur implicite : flou du besoin, budget caché, découverte du résultat en fin de projet." },

  { page: "home", section: "why", key: "tag", value: "Pourquoi nous choisir" },
  { page: "home", section: "why", key: "title", value: "Ce qui nous différencie" },
  { page: "home", section: "why", key: "description", value: "Quatre arguments, chacun structuré comme un retournement : ce que tu crois probablement, et pourquoi ce n'est pas ce que tu obtiens ici." },

  { page: "home", section: "tarifs", key: "tag", value: "Tarifs" },
  { page: "home", section: "tarifs", key: "title", value: "Boostez ta crédibilité en ligne" },
  { page: "home", section: "tarifs", key: "description", value: "Pose les fondations numériques de ton image de marque avec nos Packs Start et Business. Prix clairs, livrables précis, sans surprise à la facture." },
  { page: "home", section: "tarifs", key: "cta", value: "Voir tous nos tarifs et packs" },

  { page: "home", section: "portfolio", key: "tag", value: "Réalisations" },
  { page: "home", section: "portfolio", key: "title", value: "Plateformes en production" },
  { page: "home", section: "portfolio", key: "description", value: "Academia Helm, Win Agro, Foncier Facile Afrique, Mouvement Christ Libéré — des produits réels, déployés, utilisés." },
  { page: "home", section: "portfolio", key: "cta", value: "Voir tous nos projets" },

  { page: "home", section: "cta", key: "tag", value: "On démarre ?" },
  { page: "home", section: "cta", key: "title", value: "Prêt à passer à l'action ?" },
  { page: "home", section: "cta", key: "description", value: "Décris ton projet en 2 minutes. Tu reçois une réponse sous 48h, avec une proposition claire." },
  { page: "home", section: "cta", key: "primary", value: "Démarrer un projet →" },
  { page: "home", section: "cta", key: "secondary", value: "Voir nos réalisations" },
];

async function main() {
  console.log("🔌 Connexion à Neon…");
  await client.connect();
  console.log("✅ Connecté\n");

  console.log(`📝 Upsert de ${SEED.length} entrées page-content…\n`);
  for (const pc of SEED) {
    await client.query(
      `INSERT INTO page_contents (page, section, key, value, "updatedAt")
       VALUES ($1, $2, $3, $4, NOW())
       ON CONFLICT (page, section, key)
       DO UPDATE SET value = EXCLUDED.value, "updatedAt" = NOW()`,
      [pc.page, pc.section, pc.key, pc.value]
    );
    process.stdout.write(".");
  }
  console.log("\n");

  console.log("📊 Vérification…");
  const r = await client.query("SELECT page, COUNT(*) FROM page_contents GROUP BY page ORDER BY page");
  for (const row of r.rows) {
    console.log(`  ${row.page}: ${row.count} entrées`);
  }

  console.log("\n✅ Seed terminé !");
}

main()
  .then(() => client.end())
  .catch((err) => {
    console.error("❌ Erreur:", err.message);
    client.end();
    process.exit(1);
  });
