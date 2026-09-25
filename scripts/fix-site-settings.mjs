/**
 * Correction SiteSettings sur Neon — set les bonnes valeurs pour
 * whatsappNumber, contactEmail, phoneNumber, hours, address, socials.
 *
 * + Met à jour les heures d'ouverture selon les nouvelles valeurs :
 *   Lundi au Jeudi : 8h à 19h (GMT+1)
 *   Vendredi : 8h à 17h (GMT+1)
 *   Dimanche : 8h à 18h (GMT+1)
 *   Samedi : Fermé
 */
import pg from "pg";

const DATABASE_URL =
  process.env.DATABASE_URL ||
  "postgresql://neondb_owner:npg_RCoTALa03Jbw@ep-cold-sun-agchdf0u-pooler.c-2.eu-central-1.aws.neon.tech/YEHI%20OR%20Tech?sslmode=require";

const client = new pg.Client({
  connectionString: DATABASE_URL,
  connectionTimeoutMillis: 15000,
});

const NEW_VALUES = {
  whatsappNumber: "2290141360803",
  contactEmail: "contact@yehiortech.com",
  phoneNumber: "+229 01 41 36 08 03",
  hours: "Lundi au jeudi : 8h à 19h (GMT+1) · Vendredi : 8h à 17h (GMT+1) · Dimanche : 8h à 18h (GMT+1) · Samedi : Fermé",
  address: "Parakou, Bénin — Afrique de l'Ouest",
  socialLinkedin: "https://www.linkedin.com/company/yehi-or-tech",
  socialFacebook: "https://www.facebook.com/yehiortech",
  socialWhatsapp: "https://wa.me/2290141360803",
};

async function main() {
  console.log("🔌 Connexion à Neon…");
  await client.connect();
  console.log("✅ Connecté\n");

  // Vérifier l'état actuel
  const before = await client.query('SELECT * FROM "SiteSettings" LIMIT 1');
  console.log("📊 État actuel :");
  if (before.rows.length === 0) {
    console.log("   (aucune ligne — va créer)");
  } else {
    const r = before.rows[0];
    console.log(`   whatsappNumber: "${r.whatsappNumber}"`);
    console.log(`   contactEmail: "${r.contactEmail}"`);
    console.log(`   phoneNumber: "${r.phoneNumber}"`);
    console.log(`   hours: "${r.hours}"`);
  }

  // Upsert avec les nouvelles valeurs
  console.log("\n📝 Upsert avec nouvelles valeurs…");
  await client.query(`
    INSERT INTO "SiteSettings" ("id", "organizationId", "whatsappNumber", "contactEmail", "phoneNumber", "hours", "address", "socialLinkedin", "socialFacebook", "socialWhatsapp", "createdAt", "updatedAt")
    VALUES ('default', 'yehi-or-tech', $1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
    ON CONFLICT ("organizationId") DO UPDATE SET
      "whatsappNumber" = EXCLUDED."whatsappNumber",
      "contactEmail" = EXCLUDED."contactEmail",
      "phoneNumber" = EXCLUDED."phoneNumber",
      "hours" = EXCLUDED."hours",
      "address" = EXCLUDED."address",
      "socialLinkedin" = EXCLUDED."socialLinkedin",
      "socialFacebook" = EXCLUDED."socialFacebook",
      "socialWhatsapp" = EXCLUDED."socialWhatsapp",
      "updatedAt" = NOW()
  `, [
    NEW_VALUES.whatsappNumber,
    NEW_VALUES.contactEmail,
    NEW_VALUES.phoneNumber,
    NEW_VALUES.hours,
    NEW_VALUES.address,
    NEW_VALUES.socialLinkedin,
    NEW_VALUES.socialFacebook,
    NEW_VALUES.socialWhatsapp,
  ]);

  // Vérification finale
  const after = await client.query('SELECT * FROM "SiteSettings" LIMIT 1');
  if (after.rows.length > 0) {
    const r = after.rows[0];
    console.log("\n✅ Après correction :");
    console.log(`   whatsappNumber: "${r.whatsappNumber}"`);
    console.log(`   contactEmail: "${r.contactEmail}"`);
    console.log(`   phoneNumber: "${r.phoneNumber}"`);
    console.log(`   hours: "${r.hours}"`);
    console.log(`   address: "${r.address}"`);
  }

  console.log("\n✅ SiteSettings corrigé avec succès !");
  console.log("Les valeurs seront affichées sur /contact et le footer après redéploiement.");
}

main()
  .then(() => client.end())
  .catch((err) => {
    console.error("❌ Erreur:", err.message);
    client.end();
    process.exit(1);
  });
