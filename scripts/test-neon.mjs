import pg from "pg";

const DATABASE_URL = "postgresql://neondb_owner:npg_RCoTALa03Jbw@ep-cold-sun-agchdf0u-pooler.c-2.eu-central-1.aws.neon.tech/YEHI%20OR%20Tech?sslmode=require";

const client = new pg.Client({
  connectionString: DATABASE_URL,
  connectionTimeoutMillis: 15000,
});

async function main() {
  console.log("🔌 Test connexion Neon...");
  const start = Date.now();
  try {
    await client.connect();
    console.log(`✅ Connecté en ${Date.now() - start}ms`);
    const r = await client.query("SELECT 1 as test, NOW() as server_time, current_database() as db_name");
    console.log("📊 Résultat:", r.rows[0]);
    console.log("\n✅ Neon DB répond correctement !");
  } catch (err) {
    console.error("❌ Échec:", err.message);
    console.error("Code:", err.code);
  } finally {
    await client.end();
  }
}

main();
