"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Loader2, AlertCircle, X, Plus, Pencil, Trash2, Save, Search,
  GraduationCap, ExternalLink, Building2, Users, Calendar, DollarSign,
  CheckCircle2, AlertTriangle, Clock, ArrowLeft, RefreshCw, Globe,
} from "lucide-react";
import { apiJson, ApiError, invalidateCache } from "@/lib/api-client";

// ============================================================
// TYPES — format renvoyé par l'endpoint PUBLIC /api/public/schools/list
// (même pattern que le site public Academia Helm)
// ============================================================
type RemoteTenant = {
  id: string;
  name: string;
  slug: string;
  subdomain: string | null;
  city: string | null;
  primaryPhone: string | null;
  primaryEmail: string | null;
  address: string | null;
  schoolType: string | null;
  country: string | null;
  // Champs optionnels (présents si l'API les renvoie)
  plan?: string;
  status?: string;
  students?: number;
};

type SaasApp = {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  apiUrl: string;
  publicUrl: string;
  isActive: boolean;
};

// ============================================================
// PAGE — Dashboard d'une app SaaS
// ============================================================
export default function SaasAppDashboardPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const [app, setApp] = useState<SaasApp | null>(null);
  const [tenants, setTenants] = useState<RemoteTenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [creating, setCreating] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadApp = useCallback(async () => {
    try {
      const data = await apiJson<{ data: SaasApp[] }>("/api/content/saas-apps");
      const found = data.data.find((a) => a.slug === slug);
      if (!found) {
        setError(`App SaaS "${slug}" introuvable`);
        return;
      }
      setApp(found);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Erreur de chargement");
    }
  }, [slug]);

  const loadTenants = useCallback(async () => {
    if (!app) return;
    setLoading(true);
    setError(null);
    // ⭐ REFACTOR : appelle la route Vercel /api/academia-helm/tenants
    // qui appelle DIRECTEMENT l'API Academia Helm (plus de Railway)
    invalidateCache("/api/academia-helm/tenants");
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (statusFilter) params.set("status", statusFilter);
      params.set("limit", "100");
      const query = params.toString() ? `?${params.toString()}` : "";
      const data = await apiJson<{ data: RemoteTenant[]; total: number }>(
        `/api/academia-helm/tenants${query}`
      );
      setTenants(data.data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Erreur de chargement des tenants");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [app, search, statusFilter]);

  useEffect(() => { loadApp(); }, [loadApp]);
  useEffect(() => { if (app) loadTenants(); }, [app, loadTenants]);

  function handleRefresh() {
    setRefreshing(true);
    loadTenants();
  }

  if (error && !app) {
    return (
      <div className="space-y-6">
        <BackLink />
        <div className="rounded-xl border border-danger/30 bg-danger/5 p-6 text-danger">
          <AlertCircle className="h-5 w-5 inline mr-2" /> {error}
        </div>
      </div>
    );
  }

  if (!app) {
    return (
      <div className="text-center py-12 text-or font-sans text-sm animate-pulse">Chargement…</div>
    );
  }

  // Stats synthétiques (endpoint public — infos limitées)
  const stats = {
    total: tenants.length,
    withEmail: tenants.filter(t => t.primaryEmail).length,
    withPhone: tenants.filter(t => t.primaryPhone).length,
    cities: new Set(tenants.map(t => t.city).filter(Boolean)).size,
  };

  return (
    <div className="space-y-6">
      {/* Back link */}
      <BackLink />

      {/* Header app */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <span className="section-tag">Dashboard</span>
          <h1 className="mt-3 font-serif text-3xl font-bold text-blanc-creme flex items-center gap-3">
            {app.name}
            {app.publicUrl && (
              <a
                href={app.publicUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-sm font-sans font-bold text-or hover:underline"
              >
                <ExternalLink className="h-4 w-4" /> Voir le site
              </a>
            )}
          </h1>
          <p className="mt-1 text-sm text-gris-light">{app.description}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="btn-outline text-sm"
            aria-label="Rafraîchir"
          >
            {refreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          </button>
          <button onClick={() => setCreating(true)} className="btn-primary btn-shimmer">
            <Plus className="h-4 w-4" /> Créer un tenant
          </button>
        </div>
      </div>

      {/* Stats synthétiques */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Écoles" value={String(stats.total)} icon={<Building2 className="h-4 w-4" />} />
        <StatCard label="Avec email" value={String(stats.withEmail)} icon={<Users className="h-4 w-4 text-or" />} />
        <StatCard label="Avec téléphone" value={String(stats.withPhone)} icon={<Users className="h-4 w-4 text-or" />} />
        <StatCard label="Villes" value={String(stats.cities)} icon={<Building2 className="h-4 w-4 text-bleu-electrique" />} />
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[250px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gris" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom, slug, sous-domaine..."
            className="manager-input pl-10"
            onKeyDown={(e) => { if (e.key === "Enter") loadTenants(); }}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="manager-input w-auto"
        >
          <option value="">Tous statuts</option>
          <option value="ACTIVE">Actifs</option>
          <option value="TRIAL">Essais</option>
          <option value="SUSPENDED">Suspendus</option>
        </select>
        <button onClick={loadTenants} className="btn-outline text-sm">Filtrer</button>
      </div>

      {/* Liste des tenants distants */}
      {loading ? (
        <div className="text-center py-12 text-or font-sans text-sm animate-pulse">
          Chargement des tenants depuis {app.name}…
        </div>
      ) : error ? (
        <div className="rounded-xl border border-danger/30 bg-danger/5 p-5 space-y-3">
          <div className="flex items-start gap-2 text-danger">
            <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
            <div>
              <p className="font-bold mb-1">Erreur de chargement des tenants distants</p>
              <p className="text-xs text-gris-light">{error}</p>
            </div>
          </div>

          {/* Diagnostic panel */}
          <div className="mt-3 pt-3 border-t border-danger/20 text-xs text-gris-light space-y-2">
            <p className="font-bold text-or uppercase text-[10px] tracking-wider">Diagnostic :</p>
            <p>1. Vérifie que <code className="text-or">ACADEMIA_HELM_API_URL</code> est configuré sur <span className="text-or">Vercel</span> (pas Railway !)</p>
            <p>2. Vérifie que <code className="text-or">ACADEMIA_HELM_ADMIN_EMAIL</code> est configuré sur <span className="text-or">Vercel</span></p>
            <p>3. Ouvre <a href="/api/academia-helm/tenants?limit=1" target="_blank" rel="noreferrer" className="text-or hover:underline">/api/academia-helm/tenants?limit=1</a> pour tester directement</p>
            <p>4. Ouvre <a href="/api/debug-api-config" target="_blank" rel="noreferrer" className="text-or hover:underline">/api/debug-api-config</a> pour vérifier la config</p>
          </div>
        </div>
      ) : tenants.length === 0 ? (
        <div className="rounded-xl border border-gris-dark/30 bg-noir-2 p-12 text-center">
          <p className="text-gris-light">Aucun tenant trouvé sur {app.name}.</p>
          <button onClick={() => setCreating(true)} className="btn-primary mt-4">
            <Plus className="h-4 w-4" /> Créer le premier
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tenants.map(tenant => (
            <RemoteTenantCard key={tenant.id} tenant={tenant} app={app} />
          ))}
        </div>
      )}

      {/* Modal création */}
      <AnimatePresence>
        {creating && app && (
          <CreateTenantModal
            app={app}
            onClose={() => setCreating(false)}
            onCreated={() => { setCreating(false); loadTenants(); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================
// BACK LINK
// ============================================================
function BackLink() {
  return (
    <Link
      href="/manager/saas-hub"
      className="inline-flex items-center gap-2 font-sans text-[10px] font-bold uppercase tracking-widest text-gris-light hover:text-or transition-colors"
    >
      <ArrowLeft className="h-3 w-3" />
      Retour au portail SaaS
    </Link>
  );
}

// ============================================================
// STAT CARD
// ============================================================
function StatCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-gris-dark/30 bg-noir-2 p-3">
      <div className="flex items-center justify-between mb-1">
        <span className="font-sans text-[9px] font-bold uppercase tracking-wider text-gris">{label}</span>
        {icon}
      </div>
      <p className="font-serif text-lg font-bold text-blanc-creme">{value}</p>
    </div>
  );
}

// ============================================================
// REMOTE TENANT CARD
// ============================================================
const PLAN_LABELS: Record<string, string> = {
  SEED: "Helm Essentiel",
  GROW: "Helm Croissance",
  LEAD: "Helm Performance",
  NETWORK: "Helm Institution",
};

function RemoteTenantCard({ tenant, app }: { tenant: RemoteTenant; app: SaasApp }) {
  const tenantUrl = tenant.subdomain
    ? `${app.publicUrl?.replace(/\/$/, "")}/${tenant.subdomain}`
    : `${app.publicUrl?.replace(/\/$/, "")}/${tenant.slug}`;

  return (
    <motion.div layout className="rounded-xl border border-gris-dark/30 bg-noir-2 p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-serif text-lg font-bold text-blanc-creme truncate">{tenant.name}</h3>
          {tenant.subdomain && (
            <a href={tenantUrl} target="_blank" rel="noreferrer"
               className="mt-1 inline-flex items-center gap-1 font-sans text-[10px] text-or hover:underline">
              /{tenant.subdomain} <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
        {tenant.schoolType && (
          <span className="rounded-full border border-or/30 bg-or/10 px-2 py-0.5 font-sans text-[9px] font-bold uppercase tracking-wider text-or">
            {tenant.schoolType}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs text-gris-light">
        {tenant.city && (
          <div className="flex items-center gap-2">
            <Building2 className="h-3 w-3 text-or" />
            <span className="truncate">{tenant.city}</span>
          </div>
        )}
        {tenant.country && (
          <div className="flex items-center gap-2">
            <Globe className="h-3 w-3 text-or" />
            <span className="truncate">{tenant.country}</span>
          </div>
        )}
        {tenant.primaryPhone && (
          <div className="flex items-center gap-2">
            <Users className="h-3 w-3 text-or" />
            <span className="truncate">{tenant.primaryPhone}</span>
          </div>
        )}
        {tenant.primaryEmail && (
          <div className="flex items-center gap-2 col-span-2">
            <Users className="h-3 w-3 text-or shrink-0" />
            <a href={`mailto:${tenant.primaryEmail}`} className="truncate hover:text-or">{tenant.primaryEmail}</a>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ============================================================
// CREATE TENANT MODAL — utilise le sync Academia Helm
// ============================================================
function CreateTenantModal({
  app,
  onClose,
  onCreated,
}: {
  app: SaasApp;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [plan, setPlan] = useState("SEED");
  const [studentCount, setStudentCount] = useState(0);
  const [bilingualEnabled, setBilingualEnabled] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    // ⭐ REFACTOR : appelle DIRECTEMENT l'API Academia Helm via Vercel
    // (route /api/academia-helm/create-tenant → POST /platform/tenants/create-manual)
    // Plus de création locale + sync Railway. Tout en 1 seule requête.
    try {
      const [firstName, ...lastNameParts] = (contactName || name).split(" ");
      const lastName = lastNameParts.join(" ") || "—";
      const tempPassword = `YehiOr${Date.now().toString(36)}!`;

      const result = await apiJson<{ data?: { tenantId?: string; subdomain?: string; portalUrl?: string; hostname?: string; siteUrl?: string }; message?: string }>(
        "/api/academia-helm/create-tenant",
        {
          method: "POST",
          body: JSON.stringify({
            schoolName: name,
            schoolType: "MIXTE",
            city: "Parakou",
            country: "Bénin",
            phone: contactPhone || "+22900000000",
            email: contactEmail,
            bilingual: bilingualEnabled,
            preferredSubdomain: slug || "",
            plan,
            billingCycle: "ANNUAL",
            paymentMethod: "CASH",
            promoterFirstName: firstName,
            promoterLastName: lastName,
            promoterEmail: contactEmail,
            promoterPhone: contactPhone || "+22900000000",
            promoterPassword: tempPassword,
            estimatedStudentCount: Number(studentCount),
            schoolsCount: 1,
          }),
        }
      );

      const d = result.data || {};
      setSuccess(
        `✅ École créée sur Academia Helm !\n` +
        `• ID: ${d.tenantId || "—"}\n` +
        `• Sous-domaine: ${d.subdomain || slug || "—"}\n` +
        `• URL: ${d.portalUrl || d.siteUrl || "—"}\n` +
        `• Mot de passe temporaire: ${tempPassword} (à communiquer + changer à la 1ère connexion)`
      );
      invalidateCache("/api/academia-helm/tenants");
      setTimeout(() => onCreated(), 4000);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Erreur lors de la création");
    } finally {
      setSaving(false);
    }
  }

  const ACADEMIA_PLANS = [
    { code: "SEED", name: "Helm Essentiel", students: "1-50", yearly: "50 000" },
    { code: "GROW", name: "Helm Croissance", students: "51-150", yearly: "75 000" },
    { code: "LEAD", name: "Helm Performance", students: "151-400", yearly: "100 000" },
    { code: "NETWORK", name: "Helm Institution", students: "401+", yearly: "150 000" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-noir-profond/80 backdrop-blur-sm flex items-start justify-center p-4 pt-[5vh] overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.98 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl rounded-2xl border border-or/20 bg-noir-2 p-6 md:p-8 mb-8 max-h-[85vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="section-tag">Nouveau tenant {app.name}</span>
            <h2 className="mt-2 font-serif text-2xl font-bold text-blanc-creme">Créer une école</h2>
          </div>
          <button onClick={onClose} className="text-gris hover:text-or"><X className="h-5 w-5" /></button>
        </div>

        {success ? (
          <div className="rounded-xl border border-success/30 bg-success/5 p-6 text-center">
            <CheckCircle2 className="h-10 w-10 text-success mx-auto mb-3" />
            <p className="text-sm text-success font-bold mb-2">Succès !</p>
            <p className="text-xs text-gris-light whitespace-pre-line">{success}</p>
            <button onClick={onCreated} className="btn-primary mt-4">Fermer</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Infos école */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex flex-col gap-2">
                <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-gris-light">Nom école *</span>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="manager-input" placeholder="Ex: École Baobab" required />
              </label>
              <label className="flex flex-col gap-2">
                <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-gris-light">Slug (sous-domaine)</span>
                <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} className="manager-input" placeholder="ecole-baobab" />
              </label>
            </div>

            {/* Contact */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <label className="flex flex-col gap-2">
                <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-gris-light">Contact (nom)</span>
                <input type="text" value={contactName} onChange={(e) => setContactName(e.target.value)} className="manager-input" />
              </label>
              <label className="flex flex-col gap-2">
                <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-gris-light">Email *</span>
                <input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} className="manager-input" required />
              </label>
              <label className="flex flex-col gap-2">
                <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-gris-light">Téléphone</span>
                <input type="tel" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} className="manager-input" />
              </label>
            </div>

            {/* Plan Academia Helm */}
            <div className="space-y-3">
              <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-gris-light">
                Plan Academia Helm (Article 4 du contrat)
              </span>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {ACADEMIA_PLANS.map(p => {
                  const selected = plan === p.code;
                  return (
                    <button
                      key={p.code}
                      type="button"
                      onClick={() => setPlan(p.code)}
                      className={`rounded-xl border p-3 text-left transition-all ${selected ? "border-or bg-or/10" : "border-gris-dark/30 hover:border-or/40"}`}
                    >
                      <div className="font-serif text-sm font-bold text-blanc-creme">{p.name}</div>
                      <div className="font-sans text-[10px] text-or mt-0.5">{p.students} élèves</div>
                      <div className="mt-2 text-[10px] text-gris-light">{p.yearly} FCFA/an</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Student count + bilingual */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex flex-col gap-2">
                <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-gris-light">Effectif estimé</span>
                <input type="number" min="0" value={studentCount} onChange={(e) => setStudentCount(Number(e.target.value))} className="manager-input" />
              </label>
              <label className="flex items-center gap-3 cursor-pointer mt-6">
                <input type="checkbox" checked={bilingualEnabled} onChange={(e) => setBilingualEnabled(e.target.checked)} className="h-5 w-5 accent-or" />
                <div>
                  <div className="text-sm text-blanc-creme font-bold">Option bilingue FR/EN</div>
                  <div className="text-xs text-gris-light">+50 000 FCFA/an</div>
                </div>
              </label>
            </div>

            {/* Récap financier */}
            <div className="rounded-xl border border-bleu-electrique/30 bg-bleu-electrique/5 p-4 text-xs text-gris-light">
              <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-bleu-electrique">Récapitulatif</span>
              <div className="mt-2 space-y-1">
                <div className="flex justify-between"><span>Frais d'activation (one-shot)</span><span className="font-bold text-blanc-creme">300 000 FCFA</span></div>
                <div className="flex justify-between">
                  <span>Abonnement annuel</span>
                  <span className="font-bold text-blanc-creme">{ACADEMIA_PLANS.find(p => p.code === plan)?.yearly.replace(" ", " ") || "—"} FCFA/an</span>
                </div>
                {bilingualEnabled && (
                  <div className="flex justify-between"><span>Option bilingue</span><span className="font-bold text-blanc-creme">50 000 FCFA/an</span></div>
                )}
              </div>
              <p className="mt-2 text-[10px] text-gris">
                ⚠️ Le tenant sera créé localement + synchronisé avec Academia Helm via <code className="text-or">/platform/tenants/create-manual</code>.
                Le mot de passe temporaire du promoteur sera renvoyé dans le message de succès.
              </p>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-danger/30 bg-danger/5 p-3 text-sm text-danger">
                <AlertCircle className="h-4 w-4" /> {error}
              </div>
            )}

            <div className="flex gap-3 justify-end pt-2">
              <button type="button" onClick={onClose} className="btn-outline">Annuler</button>
              <button type="submit" disabled={saving} className="btn-primary btn-shimmer disabled:opacity-50">
                {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Création + sync…</> : <><Save className="h-4 w-4" /> Créer sur Academia Helm</>}
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
}
