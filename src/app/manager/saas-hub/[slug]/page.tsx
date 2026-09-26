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
// TYPES — supporte BOTH formats (endpoint privé ET public)
// Privé /platform/tenants : plan, status, students, daysRemaining, bilingual, etc.
// Public /api/public/schools/list : name, city, phone, email, schoolType
// ============================================================
type RemoteTenant = {
  id: string;
  name: string;
  slug: string;
  subdomain: string | null;
  city: string | null;
  primaryPhone: string | null;
  phone: string | null;
  primaryEmail: string | null;
  email: string | null;
  address: string | null;
  schoolType: string | null;
  country: string | null;
  // Champs endpoint privé (peuvent être absents en mode public)
  plan?: string;
  planStatus?: string | null;
  billingCycle?: string | null;
  status?: string;
  students?: number;
  lastActivity?: string;
  expiration?: string | null;
  daysRemaining?: number | null;
  trialEnd?: string | null;
  bilingualEnabled?: boolean;
  bilingualExpiresAt?: string | null;
  bilingualExpired?: boolean;
  studentEnrollmentBlocked?: boolean;
  createdAt?: string;
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
  const [cityFilter, setCityFilter] = useState<string>("");
  const [creating, setCreating] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<RemoteTenant | null>(null);

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

  // Stats synthétiques — affiche les infos dispo (endpoint privé = plus détaillé)
  const stats = {
    total: tenants.length,
    active: tenants.filter(t => t.status === "ACTIVE").length,
    trial: tenants.filter(t => t.status === "TRIAL").length,
    suspended: tenants.filter(t => t.status === "SUSPENDED").length,
    bilingual: tenants.filter(t => t.bilingualEnabled).length,
    expiringSoon: tenants.filter(t => t.daysRemaining !== null && t.daysRemaining !== undefined && t.daysRemaining <= 15).length,
    totalStudents: tenants.reduce((sum, t) => sum + (t.students || 0), 0),
    cities: new Set(tenants.map(t => t.city).filter(Boolean)).size,
  };

  // Liste des villes pour le filtre
  const cities = Array.from(new Set(tenants.map(t => t.city).filter(Boolean))).sort() as string[];

  // Tenants filtrés par ville
  const filteredByCity = cityFilter
    ? tenants.filter(t => t.city === cityFilter)
    : tenants;

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

      {/* Stats synthétiques — affiche plus si endpoint privé */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-{6} gap-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))' }}>
        <StatCard label="Écoles" value={String(stats.total)} icon={<Building2 className="h-4 w-4" />} />
        <StatCard label="Élèves" value={stats.totalStudents.toLocaleString("fr-FR")} icon={<GraduationCap className="h-4 w-4 text-or" />} />
        {stats.active > 0 && <StatCard label="Actifs" value={String(stats.active)} icon={<CheckCircle2 className="h-4 w-4 text-success" />} />}
        {stats.trial > 0 && <StatCard label="Essais" value={String(stats.trial)} icon={<Clock className="h-4 w-4 text-or" />} />}
        {stats.suspended > 0 && <StatCard label="Suspendus" value={String(stats.suspended)} icon={<AlertTriangle className="h-4 w-4 text-danger" />} />}
        {stats.bilingual > 0 && <StatCard label="Bilingues" value={String(stats.bilingual)} icon={<Globe className="h-4 w-4 text-bleu-electrique" />} />}
        {stats.expiringSoon > 0 && <StatCard label="Échéance ≤15j" value={String(stats.expiringSoon)} icon={<Calendar className="h-4 w-4 text-warning" />} />}
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
        {/* ⭐ Filtre par ville */}
        <select
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
          className="manager-input w-auto"
        >
          <option value="">Toutes les villes</option>
          {cities.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
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
      ) : filteredByCity.length === 0 ? (
        <div className="rounded-xl border border-gris-dark/30 bg-noir-2 p-12 text-center">
          <p className="text-gris-light">Aucun tenant trouvé sur {app.name}.</p>
          <button onClick={() => setCreating(true)} className="btn-primary mt-4">
            <Plus className="h-4 w-4" /> Créer le premier
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredByCity.map(tenant => (
            <div key={tenant.id} onClick={() => setSelectedTenant(tenant)} className="cursor-pointer">
              <RemoteTenantCard tenant={tenant} app={app} />
            </div>
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

      {/* Modal détail + contrôles */}
      <AnimatePresence>
        {selectedTenant && app && (
          <TenantDetailModal
            tenant={selectedTenant}
            app={app}
            onClose={() => setSelectedTenant(null)}
            onUpdated={() => { setSelectedTenant(null); loadTenants(); }}
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
  const email = tenant.primaryEmail || tenant.email;
  const phone = tenant.primaryPhone || tenant.phone;

  // Status badge (si endpoint privé)
  const statusConfig: Record<string, { label: string; color: string }> = {
    ACTIVE: { label: "Actif", color: "bg-success/10 border-success/30 text-success" },
    TRIAL: { label: "Essai", color: "bg-or/10 border-or/30 text-or" },
    SUSPENDED: { label: "Suspendu", color: "bg-danger/10 border-danger/30 text-danger" },
  };
  const sc = tenant.status ? statusConfig[tenant.status] : null;
  const planLabel = tenant.plan ? (PLAN_LABELS[tenant.plan] || tenant.plan) : null;

  return (
    <motion.div layout className="rounded-xl border border-gris-dark/30 bg-noir-2 p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            {sc && (
              <span className={`rounded-full border px-2 py-0.5 font-sans text-[9px] font-bold uppercase tracking-wider ${sc.color}`}>
                {sc.label}
              </span>
            )}
            {tenant.studentEnrollmentBlocked && (
              <span className="rounded-full bg-danger/10 border border-danger/30 px-2 py-0.5 font-sans text-[8px] uppercase text-danger">
                Inscriptions bloquées
              </span>
            )}
            {tenant.bilingualEnabled && (
              <span className="rounded-full bg-bleu-electrique/10 border border-bleu-electrique/30 px-2 py-0.5 font-sans text-[8px] uppercase text-bleu-electrique">
                Bilingue
              </span>
            )}
          </div>
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
        {tenant.students !== undefined && (
          <div className="flex items-center gap-2">
            <GraduationCap className="h-3 w-3 text-or" />
            <span>{tenant.students} élèves</span>
          </div>
        )}
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
        {tenant.daysRemaining !== null && tenant.daysRemaining !== undefined && (
          <div className="flex items-center gap-2">
            <Calendar className="h-3 w-3 text-or" />
            <span className={tenant.daysRemaining <= 15 ? "text-warning" : ""}>
              {tenant.daysRemaining}j restants
            </span>
          </div>
        )}
        {phone && (
          <div className="flex items-center gap-2">
            <Users className="h-3 w-3 text-or" />
            <span className="truncate">{phone}</span>
          </div>
        )}
        {email && (
          <div className="flex items-center gap-2 col-span-2">
            <Users className="h-3 w-3 text-or shrink-0" />
            <a href={`mailto:${email}`} className="truncate hover:text-or">{email}</a>
          </div>
        )}
      </div>

      {/* Plan info (si endpoint privé) */}
      {(planLabel || tenant.expiration) && (
        <div className="mt-3 pt-3 border-t border-gris-dark/20 text-[10px] text-gris space-y-1">
          {planLabel && (
            <div className="flex items-center justify-between">
              <span>Plan: <span className="font-bold text-or uppercase">{planLabel}</span></span>
              {tenant.billingCycle && <span>{tenant.billingCycle}</span>}
            </div>
          )}
          {tenant.expiration && (
            <div className="flex items-center justify-between">
              <span>Échéance: {new Date(tenant.expiration).toLocaleDateString("fr-FR")}</span>
              {tenant.trialEnd && <span className="text-or">Essai: {new Date(tenant.trialEnd).toLocaleDateString("fr-FR")}</span>}
            </div>
          )}
        </div>
      )}
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

// ============================================================
// TENANT DETAIL — PANNEAU DE CONTRÔLE COMPLET
// Permet de contrôler TOUT : plan, statut, échéance, bilingue, etc.
// Même pattern que admin.academiahelm.com
// ============================================================
const PLAN_FINANCIALS: Record<string, { initialFee: number; yearly: number; studentRange: string }> = {
  SEED: { initialFee: 300000, yearly: 50000, studentRange: "1-50" },
  GROW: { initialFee: 300000, yearly: 75000, studentRange: "51-150" },
  LEAD: { initialFee: 300000, yearly: 100000, studentRange: "151-400" },
  NETWORK: { initialFee: 300000, yearly: 150000, studentRange: "401+" },
};
const BILINGUAL_YEARLY = 50000;

function TenantDetailModal({
  tenant, app, onClose, onUpdated,
}: {
  tenant: RemoteTenant;
  app: SaasApp;
  onClose: () => void;
  onUpdated: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  // Champs éditables
  const [plan, setPlan] = useState(tenant.plan || "SEED");
  const [planStatus, setPlanStatus] = useState(tenant.planStatus || "ACTIVE");
  const [bilingualEnabled, setBilingualEnabled] = useState(tenant.bilingualEnabled || false);
  const [expiration, setExpiration] = useState(tenant.expiration ? tenant.expiration.slice(0, 10) : "");
  const [trialEnd, setTrialEnd] = useState(tenant.trialEnd ? tenant.trialEnd.slice(0, 10) : "");
  const [bilingualExpiresAt, setBilingualExpiresAt] = useState(tenant.bilingualExpiresAt ? tenant.bilingualExpiresAt.slice(0, 10) : "");

  const email = tenant.primaryEmail || tenant.email;
  const phone = tenant.primaryPhone || tenant.phone;
  const planLabel = PLAN_LABELS[tenant.plan || ""] || tenant.plan || "—";
  const fin = PLAN_FINANCIALS[plan] || PLAN_FINANCIALS.SEED;
  const totalYearly = fin.yearly + (bilingualEnabled ? BILINGUAL_YEARLY : 0);
  const totalFirstYear = fin.initialFee + totalYearly;
  const tenantUrl = tenant.subdomain
    ? `${app.publicUrl?.replace(/\/$/, "")}/${tenant.subdomain}`
    : `${app.publicUrl?.replace(/\/$/, "")}/${tenant.slug}`;

  async function patch(body: Record<string, unknown>, label: string) {
    setSaving(true);
    setMsg(null);
    try {
      await apiJson(`/api/academia-helm/tenants/${tenant.id}`, { method: "PATCH", body: JSON.stringify(body) });
      setMsg({ type: "ok", text: `✅ ${label}` });
    } catch (err) {
      setMsg({ type: "err", text: err instanceof ApiError ? err.message : "Erreur" });
    } finally { setSaving(false); }
  }

  async function patchStatus(newStatus: string, label: string) {
    setSaving(true);
    setMsg(null);
    try {
      await apiJson(`/api/academia-helm/tenants/${tenant.id}`, { method: "PATCH", body: JSON.stringify({ status: newStatus }) });
      setMsg({ type: "ok", text: `✅ ${label}` });
      setTimeout(onUpdated, 1500);
    } catch (err) {
      setMsg({ type: "err", text: err instanceof ApiError ? err.message : "Erreur" });
    } finally { setSaving(false); }
  }

  function saveAll() {
    const body: Record<string, unknown> = {};
    if (plan !== tenant.plan) body.plan = plan;
    if (planStatus !== tenant.planStatus) body.planStatus = planStatus;
    if (bilingualEnabled !== tenant.bilingualEnabled) body.bilingualEnabled = bilingualEnabled;
    if (expiration !== (tenant.expiration?.slice(0, 10) || "")) body.expiration = expiration ? new Date(expiration).toISOString() : null;
    if (trialEnd !== (tenant.trialEnd?.slice(0, 10) || "")) body.trialEnd = trialEnd ? new Date(trialEnd).toISOString() : null;
    if (bilingualExpiresAt !== (tenant.bilingualExpiresAt?.slice(0, 10) || "")) body.bilingualExpiresAt = bilingualExpiresAt ? new Date(bilingualExpiresAt).toISOString() : null;
    if (Object.keys(body).length === 0) { setMsg({ type: "err", text: "Aucun changement à sauvegarder" }); return; }
    patch(body, "Modifications enregistrées");
  }

  const statusConfig: Record<string, { label: string; color: string }> = {
    ACTIVE: { label: "Actif", color: "bg-success/10 border-success/30 text-success" },
    TRIAL: { label: "Essai", color: "bg-or/10 border-or/30 text-or" },
    SUSPENDED: { label: "Suspendu", color: "bg-danger/10 border-danger/30 text-danger" },
  };
  const sc = tenant.status ? statusConfig[tenant.status] : null;

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-noir-profond/80 backdrop-blur-sm flex items-start justify-center p-4 pt-[3vh] overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.98 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl rounded-2xl border border-or/20 bg-noir-2 p-6 md:p-8 mb-8 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <span className="section-tag">Panneau de contrôle</span>
            <h2 className="mt-2 font-serif text-2xl font-bold text-blanc-creme">{tenant.name}</h2>
            {tenant.subdomain && (
              <a href={tenantUrl} target="_blank" rel="noreferrer" className="mt-1 inline-flex items-center gap-1 font-sans text-xs text-or hover:underline">
                /{tenant.subdomain} <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
          <button onClick={onClose} className="text-gris hover:text-or"><X className="h-5 w-5" /></button>
        </div>

        {/* Status + badges */}
        <div className="flex flex-wrap gap-2 mb-6">
          {sc && <span className={`rounded-full border px-3 py-1 font-sans text-[10px] font-bold uppercase ${sc.color}`}>{sc.label}</span>}
          {tenant.bilingualEnabled && <span className="rounded-full bg-bleu-electrique/10 border border-bleu-electrique/30 px-3 py-1 font-sans text-[10px] uppercase text-bleu-electrique">★ Bilingue</span>}
          {tenant.studentEnrollmentBlocked && <span className="rounded-full bg-danger/10 border border-danger/30 px-3 py-1 font-sans text-[10px] uppercase text-danger">⚠ Inscriptions bloquées</span>}
        </div>

        {/* === SECTION 1: FINANCES === */}
        <Section title="Finances" icon={<DollarSign className="h-4 w-4 text-or" />}>
          {/* Plan éditable */}
          <Field label="Plan d'abonnement">
            <select value={plan} onChange={(e) => setPlan(e.target.value)} className="manager-input w-auto">
              <option value="SEED">Helm Essentiel (1-50 élèves)</option>
              <option value="GROW">Helm Croissance (51-150)</option>
              <option value="LEAD">Helm Performance (151-400)</option>
              <option value="NETWORK">Helm Institution (401+)</option>
            </select>
          </Field>
          <InfoGrid>
            <InfoBox label="Frais d'activation" value={`${fin.initialFee.toLocaleString("fr-FR")} FCFA`} subtext="One-shot" />
            <InfoBox label="Abonnement annuel" value={`${fin.yearly.toLocaleString("fr-FR")} FCFA/an`} subtext={fin.studentRange} />
            <InfoBox label="Option bilingue" value={bilingualEnabled ? `+${BILINGUAL_YEARLY.toLocaleString("fr-FR")} FCFA/an` : "Désactivé"} subtext="FR/EN" />
            <InfoBox label="Total 1ère année" value={`${totalFirstYear.toLocaleString("fr-FR")} FCFA`} highlight subtext="Activation + annuel" />
            <InfoBox label="Total ans suivants" value={`${totalYearly.toLocaleString("fr-FR")} FCFA/an`} subtext="Annuel + bilingue" />
          </InfoGrid>
        </Section>

        {/* === SECTION 2: STATUT & ÉCHÉANCES === */}
        <Section title="Statut & échéances" icon={<Calendar className="h-4 w-4 text-or" />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Statut d'abonnement éditable */}
            <Field label="Statut d'abonnement">
              <select value={planStatus} onChange={(e) => setPlanStatus(e.target.value)} className="manager-input w-auto">
                <option value="ACTIVE">ACTIVE (en règle)</option>
                <option value="TRIAL">TRIAL (essai)</option>
                <option value="SUSPENDED">SUSPENDED (suspendu)</option>
                <option value="GRACE_PERIOD">GRACE_PERIOD (période de grâce)</option>
              </select>
            </Field>
            {/* Échéance annuelle éditable */}
            <Field label="Échéance annuelle">
              <input type="date" value={expiration} onChange={(e) => setExpiration(e.target.value)} className="manager-input" />
            </Field>
            {/* Fin d'essai éditable */}
            <Field label="Fin d'essai (vider si pas d'essai)">
              <input type="date" value={trialEnd} onChange={(e) => setTrialEnd(e.target.value)} className="manager-input" />
            </Field>
            {/* Expiration bilingue éditable */}
            <Field label="Expiration bilingue">
              <input type="date" value={bilingualExpiresAt} onChange={(e) => setBilingualExpiresAt(e.target.value)} className="manager-input" disabled={!bilingualEnabled} />
            </Field>
          </div>
          <InfoGrid>
            <InfoBox label="Jours restants" value={tenant.daysRemaining !== null && tenant.daysRemaining !== undefined ? `${tenant.daysRemaining}j` : "—"} highlight={tenant.daysRemaining !== null && tenant.daysRemaining !== undefined && tenant.daysRemaining <= 15} />
            <InfoBox label="Dernière activité" value={tenant.lastActivity ? new Date(tenant.lastActivity).toLocaleDateString("fr-FR") : "—"} />
            <InfoBox label="Créée le" value={tenant.createdAt ? new Date(tenant.createdAt).toLocaleDateString("fr-FR") : "—"} />
          </InfoGrid>
        </Section>

        {/* === SECTION 3: ÉLÈVES === */}
        <Section title="Élèves" icon={<GraduationCap className="h-4 w-4 text-or" />}>
          <InfoGrid>
            <InfoBox label="Nombre d'élèves" value={tenant.students !== undefined ? String(tenant.students) : "—"} />
            <InfoBox label="Tranche du plan" value={fin.studentRange} />
            <InfoBox label="Inscriptions" value={tenant.studentEnrollmentBlocked ? "Bloquées" : "Autorisées"} highlight={tenant.studentEnrollmentBlocked} />
          </InfoGrid>
        </Section>

        {/* === SECTION 4: CONTACT === */}
        <Section title="Contact" icon={<Users className="h-4 w-4 text-or" />}>
          <InfoGrid>
            <InfoBox label="Ville" value={tenant.city || "—"} />
            <InfoBox label="Pays" value={tenant.country || "—"} />
            <InfoBox label="Adresse" value={tenant.address || "—"} />
            <InfoBox label="Téléphone" value={phone || "—"} />
            <InfoBox label="Email" value={email || "—"} />
            <InfoBox label="Type école" value={tenant.schoolType || "—"} />
          </InfoGrid>
        </Section>

        {/* === SECTION 5: BILINGUE === */}
        <Section title="Option bilingue FR/EN" icon={<Globe className="h-4 w-4 text-or" />}>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={bilingualEnabled} onChange={(e) => setBilingualEnabled(e.target.checked)} className="h-5 w-5 accent-or" disabled={saving} />
            <div>
              <span className="text-sm text-blanc-creme font-bold">{bilingualEnabled ? "Activé" : "Désactivé"}</span>
              <span className="text-xs text-gris-light ml-2">+{BILINGUAL_YEARLY.toLocaleString("fr-FR")} FCFA/an</span>
            </div>
          </label>
        </Section>

        {/* === ACTIONS RAPIDES === */}
        <Section title="Actions rapides" icon={<AlertTriangle className="h-4 w-4 text-or" />}>
          <div className="flex flex-wrap gap-3">
            {/* Suspendre/Réactiver */}
            <button
              onClick={() => patchStatus(tenant.status === "SUSPENDED" ? "active" : "suspended", tenant.status === "SUSPENDED" ? "École réactivée" : "École suspendue")}
              disabled={saving}
              className={tenant.status === "SUSPENDED" ? "btn-primary btn-shimmer" : "btn-outline"}
            >
              {tenant.status === "SUSPENDED" ? "✓ Réactiver" : "⏸ Suspendre"}
            </button>
            {/* Fix trial → ACTIVE + clear trialEnd */}
            <button
              onClick={() => { setPlanStatus("ACTIVE"); setTrialEnd(""); patch({ planStatus: "ACTIVE", trialEnd: null }, "Statut corrigé → ACTIVE (essai supprimé)"); }}
              disabled={saving}
              className="btn-outline"
            >
              🔧 Corriger essai → Active
            </button>
            {/* Étendre échéance +1 an */}
            <button
              onClick={() => {
                const newDate = new Date();
                newDate.setFullYear(newDate.getFullYear() + 1);
                const newDateStr = newDate.toISOString().slice(0, 10);
                setExpiration(newDateStr);
                patch({ expiration: newDate.toISOString() }, `Échéance étendue → ${newDateStr}`);
              }}
              disabled={saving}
              className="btn-outline"
            >
              📅 Étendre échéance +1 an
            </button>
            {/* Lien portail */}
            {tenantUrl && (
              <a href={tenantUrl} target="_blank" rel="noreferrer" className="btn-outline">
                <ExternalLink className="h-4 w-4" /> Ouvrir le portail
              </a>
            )}
          </div>
        </Section>

        {/* === SAUVEGARDER === */}
        <div className="border-t border-gris-dark/30 pt-6 flex items-center justify-between">
          {msg && (
            <div className={`rounded-lg border p-3 text-sm flex-1 mr-4 ${msg.type === "ok" ? "border-success/30 bg-success/5 text-success" : "border-danger/30 bg-danger/5 text-danger"}`}>{msg.text}</div>
          )}
          <button onClick={saveAll} disabled={saving} className="btn-primary btn-shimmer disabled:opacity-50">
            {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Sauvegarde…</> : <><Save className="h-4 w-4" /> Sauvegarder les modifications</>}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h3 className="font-sans text-[10px] font-bold uppercase tracking-widest text-or">{title}</h3>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-gris-light">{label}</span>
      {children}
    </div>
  );
}

function InfoGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 md:grid-cols-3 gap-3">{children}</div>;
}

function InfoBox({ label, value, subtext, highlight }: { label: string; value: string; subtext?: string; highlight?: boolean }) {
  return (
    <div className="rounded-lg border border-gris-dark/30 bg-noir-3 p-3">
      <p className="font-sans text-[9px] font-bold uppercase tracking-wider text-gris mb-1">{label}</p>
      <p className={`text-sm font-bold ${highlight ? "text-warning" : "text-blanc-creme"}`}>{value}</p>
      {subtext && <p className="text-[9px] text-gris-dark mt-0.5">{subtext}</p>}
    </div>
  );
}
