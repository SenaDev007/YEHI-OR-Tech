/**
 * Seed des textes Hero/About dans page_contents.
 *
 * Met à jour les entrées existantes avec les valeurs actuelles du Hero
 * et de la page About. L'utilisateur peut ensuite éditer depuis
 * /manager/page-content.
 */
import pg from "pg";

const DATABASE_URL =
  process.env.DATABASE_URL ||
  "postgresql://neondb_owner:npg_RCoTALa03Jbw@ep-cold-sun-agchdf0u-pooler.c-2.eu-central-1.aws.neon.tech/YEHI%20OR%20Tech?sslmode=require";

const client = new pg.Client({
  connectionString: DATABASE_URL,
  connectionTimeoutMillis: 15000,
});

const PAGE_CONTENTS = [
  // Hero homepage
  { page: "home", section: "hero", key: "badge", value: "Agence digitale augmentée par l'IA · Parakou, Bénin" },
  { page: "home", section: "hero", key: "title_line1", value: "Ta présence numérique" },
  { page: "home", section: "hero", key: "title_line2", value: "mérite mieux qu'un" },
  { page: "home", section: "hero", key: "title_line3", value: "site vitrine" },
  { page: "home", section: "hero", key: "title_line3_highlight", value: "oublié" },
  { page: "home", section: "hero", key: "subtitle", value: "Sites web, applications, agents IA, automatisation et crédibilité en ligne." },
  { page: "home", section: "hero", key: "subtitle_bold", value: "Huit métiers, un seul interlocuteur" },
  { page: "home", section: "hero", key: "subtitle_end", value: "un devis clair avant de commencer." },
  { page: "home", section: "hero", key: "cta_primary", value: "Demander un devis" },
  { page: "home", section: "hero", key: "cta_primary_href", value: "/contact" },
  { page: "home", section: "hero", key: "cta_secondary", value: "Voir nos services" },
  { page: "home", section: "hero", key: "cta_secondary_href", value: "/services" },
  { page: "home", section: "hero", key: "cta_whatsapp", value: "Écrire sur WhatsApp" },

  // About page
  { page: "about", section: "hero", key: "title", value: "Notre histoire" },
  { page: "about", section: "hero", key: "subtitle", value: "YEHI OR Tech est née à Parakou, au cœur du Bénin, pour bâtir l'infrastructure numérique de l'Afrique de l'Ouest." },
  { page: "about", section: "hero", key: "badge", value: "À propos de nous" },
  { page: "about", section: "intro", key: "title", value: "Une agence numérique ancrée dans le réel" },
  { page: "about", section: "intro", key: "paragraph1", value: "YEHI OR Tech n'est pas née dans un garage de la Silicon Valley, mais à Parakou, au cœur du Bénin. Notrefondateur, Sènakpon AKPOVI, a exercé trois métiers avant le code : enseignant, agent de sécurité industrielle, biotechnologue. Cette rigueur du terrain, on l'applique aujourd'hui au numérique." },
  { page: "about", section: "intro", key: "paragraph2", value: "Notre conviction est simple : l'Afrique de l'Ouest mérite des outils numériques pensés pour elle, pas des templates génériques importés. Nous construisons des produits qui s'adaptent au terrain béninois — connexions instables, modes de paiement locaux, langues nationales, contexte culturel." },
  { page: "about", section: "intro", key: "paragraph3", value: "Chaque projet commence par comprendre le problème réel avant de proposer une solution technique. Pas de jargon, pas de promesses gonflées, pas de copier-coller." },

  // Contact page
  { page: "contact", section: "hero", key: "title", value: "Discutons de ton projet" },
  { page: "contact", section: "hero", key: "subtitle", value: "Une demande, une question, un devis ? On répond sous 48h, en français, sans jargon." },
];

async function main() {
  console.log("🔌 Connexion à Neon…");
  await client.connect();
  console.log("✅ Connecté\n");

  console.log(`📝 Upsert de ${PAGE_CONTENTS.length} entrées page-content…\n`);
  for (const pc of PAGE_CONTENTS) {
    await client.query(
      `INSERT INTO page_contents (page, section, key, value, "updatedAt")
       VALUES ($1, $2, $3, $4, NOW())
       ON CONFLICT (page, section, key)
       DO UPDATE SET value = EXCLUDED.value, "updatedAt" = NOW()`,
      [pc.page, pc.section, pc.key, pc.value]
    );
    console.log(`  ✅ ${pc.page}.${pc.section}.${pc.key}`);
  }

  // Vérification
  console.log("\n📊 Vérification…");
  const r = await client.query("SELECT page, COUNT(*) FROM page_contents GROUP BY page ORDER BY page");
  for (const row of r.rows) {
    console.log(`  ${row.page}: ${row.count} entrées`);
  }

  console.log("\n✅ Seed page-content terminé !");
  console.log("\nÉdite ces textes depuis /manager/page-content");
}

main()
  .then(() => client.end())
  .catch((err) => {
    console.error("❌ Erreur:", err.message);
    client.end();
    process.exit(1);
  });
