/**
 * Seed des images hero professionnelles pour chaque page.
 * Les images sont éditables depuis /manager/page-content (clé hero_image).
 */
import pg from "pg";

const DATABASE_URL =
  process.env.DATABASE_URL ||
  "postgresql://neondb_owner:npg_RCoTALa03Jbw@ep-cold-sun-agchdf0u-pooler.c-2.eu-central-1.aws.neon.tech/YEHI%20OR%20Tech?sslmode=require";

const client = new pg.Client({
  connectionString: DATABASE_URL,
  connectionTimeoutMillis: 15000,
});

// Images professionnelles haute qualité Unsplash (1920px+)
const HERO_IMAGES = [
  // Homepage — startup office + tech vibe (professional, dynamic)
  {
    page: "home",
    section: "hero",
    key: "image",
    value: "https://images.unsplash.com/photo-1460925895977-253fabe57ce8?auto=format&fit=crop&w=1920&q=85",
  },
  // About — team collaboration meeting
  {
    page: "about",
    section: "hero",
    key: "image",
    value: "https://images.unsplash.com/photo-1522071820088-cd2d915a32e5?auto=format&fit=crop&w=1920&q=85",
  },
  // Services — modern office workspace with code on screen
  {
    page: "services",
    section: "hero",
    key: "image",
    value: "https://images.unsplash.com/photo-1556761175-b413da4b4f8b?auto=format&fit=crop&w=1920&q=85",
  },
  // Tarifs — business strategy / pricing concept
  {
    page: "tarifs",
    section: "hero",
    key: "image",
    value: "https://images.unsplash.com/photo-1554224155-6723b4ec2365?auto=format&fit=crop&w=1920&q=85",
  },
  // Portfolio — showcase / creative workspace
  {
    page: "portfolio",
    section: "hero",
    key: "image",
    value: "https://images.unsplash.com/photo-1620712947042-ab4d6807b9b1?auto=format&fit=crop&w=1920&q=85",
  },
  // Contact — meeting / workspace discussion
  {
    page: "contact",
    section: "hero",
    key: "image",
    value: "https://images.unsplash.com/photo-1577563908940-94eae5d285e2?auto=format&fit=crop&w=1920&q=85",
  },
];

async function main() {
  console.log("🔌 Connexion à Neon…");
  await client.connect();
  console.log("✅ Connecté\n");

  console.log(`📝 Seed de ${HERO_IMAGES.length} images hero…\n`);
  for (const pc of HERO_IMAGES) {
    await client.query(
      `INSERT INTO page_contents (page, section, key, value, "updatedAt")
       VALUES ($1, $2, $3, $4, NOW())
       ON CONFLICT (page, section, key)
       DO UPDATE SET value = EXCLUDED.value, "updatedAt" = NOW()`,
      [pc.page, pc.section, pc.key, pc.value]
    );
    console.log(`  ✅ ${pc.page}.${pc.section}.${pc.key}`);
  }

  console.log("\n✅ Images hero seedées !");
  console.log("\nÉdite les images depuis /manager/page-content (clé: <page> / hero / image)");
}

main()
  .then(() => client.end())
  .catch((err) => {
    console.error("❌ Erreur:", err.message);
    client.end();
    process.exit(1);
  });
