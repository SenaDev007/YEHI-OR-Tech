import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { queryWithFallback } from "@/lib/db-pg";

/**
 * Routes API contenu public (Vercel frontend) — catch-all.
 *
 * Routes exposées :
 *  GET    /api/content/services                → liste
 *  POST   /api/content/services                → crée
 *  PUT    /api/content/services/123           → met à jour
 *  DELETE /api/content/services/123           → supprime
 *
 * Idem pour : testimonials, portfolio, pricing, stats, values,
 * process-steps, faq, saas-apps, saas-tenants.
 *
 * Cas spécial : page-content utilise PUT (upsert par composite key).
 *
 * ⚠️ Ce fichier ne fait QUE des opérations CRUD basiques via pg direct
 * (contourne Prisma qui ne marche pas sur Vercel serverless).
 * Le backend Railway a la version complète avec validation Zod + cache.
 *
 * Si NEXT_PUBLIC_API_URL est configurée sur Vercel → le client va direct
 * au backend Railway. Sinon → fallback sur ces routes Vercel.
 */

const RESOURCE_MAP: Record<string, { table: string; orderCol?: string }> = {
  services: { table: "service_contents", orderCol: '"order"' },
  testimonials: { table: "testimonials", orderCol: '"order"' },
  portfolio: { table: "portfolio_items", orderCol: '"order"' },
  pricing: { table: "pricing_packs", orderCol: '"order"' },
  stats: { table: "stat_contents", orderCol: '"order"' },
  values: { table: "value_contents", orderCol: '"order"' },
  "process-steps": { table: "process_step_contents", orderCol: '"order"' },
  faq: { table: "faq_items", orderCol: '"order"' },
  "saas-apps": { table: "saas_apps" },
  "saas-tenants": { table: "saas_tenants" },
  "page-content": { table: "page_contents" },
};

async function requireAuth() {
  const session = await getSession();
  if (!session) {
    return {
      ok: false as const,
      response: NextResponse.json({ ok: false, error: "Non authentifié" }, { status: 401 }),
    };
  }
  return { ok: true as const, userId: session.sub };
}

function getResourceFields(resource: string): Set<string> {
  const fields: Record<string, string[]> = {
    services: ["slug", "number", "title", "icon", "tagline", "availability", "availabilityLabel", "problem", "fullDescription", "deliverables", "targetAudience", "commercialLimit", "formFields", "faq", "tags", "cta", "gradient", "isActive", "order"],
    testimonials: ["text", "highlight", "authorName", "authorRole", "authorAvatar", "rating", "isActive", "order"],
    portfolio: ["slug", "title", "category", "categorySlug", "description", "tags", "status", "statusLabel", "gradient", "iconName", "tech", "url", "previewImage", "isActive", "order"],
    pricing: ["slug", "name", "price", "currency", "period", "description", "tagline", "features", "featureDetails", "cta", "badge", "badgeColor", "color", "category", "deliveryTime", "supportIncluded", "isPopular", "isActive", "order"],
    stats: ["value", "suffix", "label", "meaning", "section", "isActive", "order"],
    values: ["number", "title", "description", "icon", "isActive", "order"],
    "process-steps": ["number", "title", "description", "icon", "isActive", "order"],
    faq: ["question", "answer", "category", "isActive", "order"],
    "saas-apps": ["slug", "name", "description", "icon", "apiUrl", "apiKey", "publicUrl", "isActive"],
    "saas-tenants": ["appId", "externalId", "name", "slug", "contactName", "contactEmail", "contactPhone", "plan", "status", "studentCount", "billingCycle", "amount", "startDate", "trialEndsAt", "nextPaymentDueAt", "cancelledAt", "metadata", "lastSyncAt", "initialFee", "yearlyAmount", "bilingualEnabled", "bilingualAmount", "schoolsCount", "annualDueDate"],
    "page-content": ["page", "section", "key", "value"],
  };
  return new Set(fields[resource] || []);
}

async function handleList(resource: string): Promise<NextResponse> {
  const cfg = RESOURCE_MAP[resource];
  if (!cfg) return NextResponse.json({ ok: false, error: "Ressource inconnue" }, { status: 404 });
  try {
    const orderBy = cfg.orderCol ? `ORDER BY ${cfg.orderCol} ASC, "createdAt" ASC` : 'ORDER BY "createdAt" ASC';
    const result = await queryWithFallback(`SELECT * FROM ${cfg.table} ${orderBy}`);
    return NextResponse.json({ ok: true, data: result.rows });
  } catch (err) {
    console.error(`[content/${resource}] list erreur:`, err);
    return NextResponse.json({ ok: false, error: err instanceof Error ? err.message : "Erreur serveur" }, { status: 500 });
  }
}

async function handleCreate(resource: string, body: Record<string, unknown>): Promise<NextResponse> {
  const cfg = RESOURCE_MAP[resource];
  if (!cfg) return NextResponse.json({ ok: false, error: "Ressource inconnue" }, { status: 404 });
  try {
    const allowedFields = getResourceFields(resource);
    const filtered: Record<string, unknown> = {};
    for (const k of Object.keys(body)) {
      if (allowedFields.has(k)) filtered[k] = body[k];
    }
    if (!("order" in filtered) && cfg.orderCol) filtered.order = 0;
    if (!("isActive" in filtered) && resource !== "page-content") filtered.isActive = true;

    const keys = Object.keys(filtered);
    if (keys.length === 0) {
      return NextResponse.json({ ok: false, error: "Aucun champ valide" }, { status: 400 });
    }
    const values = keys.map((_, i) => `$${i + 1}`);
    const params = keys.map((k) => filtered[k]);

    const result = await queryWithFallback(
      `INSERT INTO ${cfg.table} (${keys.map((k) => `"${k}"`).join(", ")})
       VALUES (${values.join(", ")})
       RETURNING *`,
      params
    );
    return NextResponse.json({ ok: true, data: result.rows[0] }, { status: 201 });
  } catch (err) {
    console.error(`[content/${resource}] create erreur:`, err);
    return NextResponse.json({ ok: false, error: err instanceof Error ? err.message : "Erreur serveur" }, { status: 500 });
  }
}

async function handleUpdate(resource: string, id: string, body: Record<string, unknown>): Promise<NextResponse> {
  const cfg = RESOURCE_MAP[resource];
  if (!cfg) return NextResponse.json({ ok: false, error: "Ressource inconnue" }, { status: 404 });
  try {
    const allowedFields = getResourceFields(resource);
    const filtered: Record<string, unknown> = {};
    for (const k of Object.keys(body)) {
      if (allowedFields.has(k)) filtered[k] = body[k];
    }
    const keys = Object.keys(filtered);
    if (keys.length === 0) {
      return NextResponse.json({ ok: false, error: "Aucun champ à mettre à jour" }, { status: 400 });
    }
    const setClause = keys.map((k, i) => `"${k}" = $${i + 1}`).join(", ");
    const params = keys.map((k) => filtered[k]);
    params.push(id);

    const result = await queryWithFallback(
      `UPDATE ${cfg.table} SET ${setClause}, "updatedAt" = NOW() WHERE id = $${keys.length + 1} RETURNING *`,
      params
    );
    if (result.rows.length === 0) {
      return NextResponse.json({ ok: false, error: "Item introuvable" }, { status: 404 });
    }
    return NextResponse.json({ ok: true, data: result.rows[0] });
  } catch (err) {
    console.error(`[content/${resource}] update erreur:`, err);
    return NextResponse.json({ ok: false, error: err instanceof Error ? err.message : "Erreur serveur" }, { status: 500 });
  }
}

async function handleDelete(resource: string, id: string): Promise<NextResponse> {
  const cfg = RESOURCE_MAP[resource];
  if (!cfg) return NextResponse.json({ ok: false, error: "Ressource inconnue" }, { status: 404 });
  try {
    await queryWithFallback(`DELETE FROM ${cfg.table} WHERE id = $1`, [id]);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(`[content/${resource}] delete erreur:`, err);
    return NextResponse.json({ ok: false, error: err instanceof Error ? err.message : "Erreur serveur" }, { status: 500 });
  }
}

async function handlePageContentUpsert(body: { page: string; section: string; key: string; value: string }): Promise<NextResponse> {
  try {
    const result = await queryWithFallback(
      `INSERT INTO page_contents (page, section, key, value, "updatedAt")
       VALUES ($1, $2, $3, $4, NOW())
       ON CONFLICT (page, section, key)
       DO UPDATE SET value = EXCLUDED.value, "updatedAt" = NOW()
       RETURNING *`,
      [body.page, body.section, body.key, body.value]
    );
    return NextResponse.json({ ok: true, data: result.rows[0] });
  } catch (err) {
    console.error("[content/page-content] upsert erreur:", err);
    return NextResponse.json({ ok: false, error: err instanceof Error ? err.message : "Erreur serveur" }, { status: 500 });
  }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ path?: string[] }> }) {
  const { path } = await params;
  const resource = (path?.[0] || "") as string;
  if (path && path.length > 1) {
    return NextResponse.json({ ok: false, error: "GET par ID non supporté — utiliser la liste" }, { status: 400 });
  }

  const auth = await requireAuth();
  if (!auth.ok) return auth.response;

  const url = new URL(req.url);
  const appId = url.searchParams.get("appId");
  const status = url.searchParams.get("status");

  if (resource === "saas-tenants" && (appId || status)) {
    try {
      const where: string[] = [];
      const params: unknown[] = [];
      if (appId) { params.push(appId); where.push(`"appId" = $${params.length}`); }
      if (status) { params.push(status); where.push(`status = $${params.length}`); }
      const result = await queryWithFallback(
        `SELECT * FROM saas_tenants WHERE ${where.join(" AND ")} ORDER BY "createdAt" DESC`,
        params
      );
      return NextResponse.json({ ok: true, data: result.rows });
    } catch (err) {
      console.error("[content/saas-tenants] filtered list erreur:", err);
      return NextResponse.json({ ok: false, error: "Erreur serveur" }, { status: 500 });
    }
  }

  if (resource === "saas-apps") {
    try {
      const result = await queryWithFallback(
        `SELECT s.*, (SELECT COUNT(*) FROM saas_tenants WHERE "appId" = s.id) as "tenantCount" FROM saas_apps s ORDER BY "createdAt" ASC`
      );
      return NextResponse.json({ ok: true, data: result.rows });
    } catch (err) {
      console.error("[content/saas-apps] list erreur:", err);
      return NextResponse.json({ ok: false, error: "Erreur serveur" }, { status: 500 });
    }
  }

  return handleList(resource);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ path?: string[] }> }) {
  const { path } = await params;
  const resource = (path?.[0] || "") as string;

  const auth = await requireAuth();
  if (!auth.ok) return auth.response;

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "JSON invalide" }, { status: 400 });
  }

  if (resource === "page-content") {
    return handlePageContentUpsert(body as { page: string; section: string; key: string; value: string });
  }

  return handleCreate(resource, body);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ path?: string[] }> }) {
  const { path } = await params;
  const resource = (path?.[0] || "") as string;
  const id = path?.[1];

  if (!id) {
    if (resource === "page-content") {
      const auth = await requireAuth();
      if (!auth.ok) return auth.response;
      let body: Record<string, unknown>;
      try { body = await req.json(); } catch { return NextResponse.json({ ok: false, error: "JSON invalide" }, { status: 400 }); }
      return handlePageContentUpsert(body as { page: string; section: string; key: string; value: string });
    }
    return NextResponse.json({ ok: false, error: "ID manquant" }, { status: 400 });
  }

  const auth = await requireAuth();
  if (!auth.ok) return auth.response;

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false, error: "JSON invalide" }, { status: 400 }); }

  return handleUpdate(resource, id, body);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ path?: string[] }> }) {
  const { path } = await params;
  const resource = (path?.[0] || "") as string;
  const id = path?.[1];

  if (!id) return NextResponse.json({ ok: false, error: "ID manquant" }, { status: 400 });

  const auth = await requireAuth();
  if (!auth.ok) return auth.response;

  return handleDelete(resource, id);
}
