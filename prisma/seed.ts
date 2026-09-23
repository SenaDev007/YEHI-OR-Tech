/**
 * Script de seed initial pour YEHI OR Manager.
 * Crée l'organisation, l'utilisateur admin par défaut, les enveloppes de trésorerie
 * et quelques services de démo.
 *
 * Usage : `npx prisma db push && npx tsx prisma/seed.ts` (ou `npm run db:seed`)
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Début du seed YEHI OR Manager…");

  // 1. Organisation
  const org = await prisma.organization.upsert({
    where: { id: "yehi-or-tech" },
    update: {},
    create: {
      id: "yehi-or-tech",
      name: "YEHI OR Tech",
      domain: "yehiortech.com",
    },
  });
  console.log(`✅ Organisation : ${org.name}`);

  // 2. Utilisateur admin
  const adminEmail = process.env.ADMIN_EMAIL || "admin@yehiortech.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "YehiOr2026!";
  const adminName = process.env.ADMIN_NAME || "Dawes S. Akpowi Tohou";
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash, name: adminName, role: "ADMIN", active: true },
    create: {
      email: adminEmail,
      name: adminName,
      role: "ADMIN",
      passwordHash,
      organizationId: org.id,
    },
  });
  console.log(`✅ Admin : ${admin.email} (mot de passe par défaut : ${adminPassword})`);

  // 3. Enveloppes de trésorerie par défaut
  const defaultEnvelopes = [
    { name: "Caisse opérationnelle", description: "Fonds de roulement quotidien", isOperational: true },
    { name: "Charges fixes", description: "Loyer, abonnements de base" },
    { name: "Électricité et Internet", description: "Charges techniques" },
    { name: "Taxes et obligations", description: "Réserve fiscale et taxes" },
    { name: "Maintenance et renouvellement", description: "Entretien, remplacement matériel" },
    { name: "Fonds Academia", description: "Réserve allouée à Academia" },
    { name: "Investissement", description: "Projets de croissance" },
    { name: "Rémunération du dirigeant", description: "Salaire dirigeant" },
    { name: "Bénéfices conservés", description: "Réserve de capital" },
  ];
  for (const env of defaultEnvelopes) {
    await prisma.treasuryEnvelope.upsert({
      where: {
        // Pas d'unique sur name+orgId, on utilise create ou update par findFirst
        id: env.name,
      },
      update: {},
      create: {
        id: env.name,
        name: env.name,
        description: env.description,
        isOperational: env.isOperational || false,
        organizationId: org.id,
      },
    });
  }
  console.log(`✅ ${defaultEnvelopes.length} enveloppes de trésorerie créées`);

  // 4. Services par défaut (centres de profit)
  const services = [
    // BOUTIQUE
    { name: "Photocopie A4 (N&B)", unit: "page", unitPrice: 25, unitCost: 10, profitCenter: "BOUTIQUE" },
    { name: "Photocopie A4 (couleur)", unit: "page", unitPrice: 75, unitCost: 30, profitCenter: "BOUTIQUE" },
    { name: "Impression A4 (N&B)", unit: "page", unitPrice: 50, unitCost: 15, profitCenter: "BOUTIQUE" },
    { name: "Impression A4 (couleur)", unit: "page", unitPrice: 150, unitCost: 50, profitCenter: "BOUTIQUE" },
    { name: "Scan document", unit: "page", unitPrice: 50, unitCost: 5, profitCenter: "BOUTIQUE" },
    { name: "Saisie document", unit: "page", unitPrice: 200, unitCost: 0, profitCenter: "BOUTIQUE" },
    { name: "Reliure plastique", unit: "unité", unitPrice: 500, unitCost: 100, profitCenter: "BOUTIQUE" },

    // DESIGN
    { name: "Flyers A6 recto (x100)", unit: "lot", unitPrice: 10000, unitCost: 3000, profitCenter: "DESIGN" },
    { name: "Carte de visite (x100)", unit: "lot", unitPrice: 8000, unitCost: 2000, profitCenter: "DESIGN" },
    { name: "Affiche A3", unit: "unité", unitPrice: 2000, unitCost: 500, profitCenter: "DESIGN" },
    { name: "Logo simple", unit: "forfait", unitPrice: 25000, unitCost: 0, profitCenter: "DESIGN" },
    { name: "Charte graphique", unit: "forfait", unitPrice: 75000, unitCost: 0, profitCenter: "DESIGN" },

    // TEXTILE
    { name: "T-shirt personnalisé", unit: "unité", unitPrice: 3000, unitCost: 1500, profitCenter: "TEXTILE" },

    // ACADEMIA
    { name: "Abonnement Academia (mensuel)", unit: "mois", unitPrice: 15000, unitCost: 0, profitCenter: "ACADEMIA" },
    { name: "Formation Academia", unit: "forfait", unitPrice: 25000, unitCost: 0, profitCenter: "ACADEMIA" },

    // DEV
    { name: "Site vitrine", unit: "forfait", unitPrice: 150000, unitCost: 0, profitCenter: "DEV" },
    { name: "Pack crédibilité START", unit: "forfait", unitPrice: 35000, unitCost: 0, profitCenter: "DEV" },
    { name: "Pack crédibilité BUSINESS", unit: "forfait", unitPrice: 50000, unitCost: 0, profitCenter: "DEV" },
  ];
  for (const svc of services) {
    const existing = await prisma.productService.findFirst({
      where: { name: svc.name, organizationId: org.id },
    });
    if (!existing) {
      await prisma.productService.create({
        data: { ...svc, organizationId: org.id },
      });
    }
  }
  console.log(`✅ ${services.length} services créés`);

  // 5. Stock de démo
  const stockItems = [
    { name: "Papier A4 (ramette 500)", category: "Papier", unit: "ramette", quantity: 12, threshold: 5, unitCost: 3000 },
    { name: "Papier A3 (ramette 500)", category: "Papier", unit: "ramette", quantity: 4, threshold: 3, unitCost: 5500 },
    { name: "Toner noir HP/Canon", category: "Toner", unit: "unité", quantity: 2, threshold: 3, unitCost: 18000 },
    { name: "Toner couleur cyan", category: "Toner", unit: "unité", quantity: 1, threshold: 2, unitCost: 22000 },
    { name: "Encre jet d'encre noire", category: "Encre", unit: "bouteille", quantity: 3, threshold: 2, unitCost: 8000 },
    { name: "Reliure plastique A4", category: "Fourniture", unit: "unité", quantity: 50, threshold: 20, unitCost: 75 },
    { name: "Pochette cartonnée A4", category: "Fourniture", unit: "unité", quantity: 30, threshold: 15, unitCost: 150 },
    { name: "T-shirt blanc (M)", category: "Textile", unit: "unité", quantity: 25, threshold: 10, unitCost: 1200 },
    { name: "T-shirt blanc (L)", category: "Textile", unit: "unité", quantity: 20, threshold: 10, unitCost: 1200 },
  ];
  for (const item of stockItems) {
    const existing = await prisma.stockItem.findFirst({
      where: { name: item.name, organizationId: org.id },
    });
    if (!existing) {
      await prisma.stockItem.create({
        data: { ...item, organizationId: org.id },
      });
    }
  }
  console.log(`✅ ${stockItems.length} articles de stock créés`);

  // 6. Abonnements Academia de démo
  const academiaSubs = [
    { schoolName: "CSP Baobab", contactName: "M. Koffi", contactPhone: "+229 01 99 88 77 66", monthlyFee: 15000, status: "ACTIF" },
    { schoolName: "École Horizon", contactName: "Mme Adjovi", contactPhone: "+229 01 55 44 33 22", monthlyFee: 15000, status: "ACTIF" },
    { schoolName: "Lycée Latrice", contactName: "M. Tohou", contactPhone: "+229 01 66 55 44 33", monthlyFee: 25000, status: "IMPAYE" },
  ];
  for (const sub of academiaSubs) {
    const existing = await prisma.academiaSubscription.findFirst({
      where: { schoolName: sub.schoolName, organizationId: org.id },
    });
    if (!existing) {
      await prisma.academiaSubscription.create({
        data: { ...sub, organizationId: org.id },
      });
    }
  }
  console.log(`✅ ${academiaSubs.length} abonnements Academia de démo`);

  console.log("\n🌱 Seed terminé.");
  console.log("\n📝 Compte admin par défaut :");
  console.log(`   Email : ${adminEmail}`);
  console.log(`   Mot de passe : ${adminPassword}`);
  console.log("   ⚠️  Change ce mot de passe après le premier login en production.");
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
