"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Loader2, AlertCircle, X, Plus, Pencil, Trash2, Save, Search,
  GraduationCap, ExternalLink, Building2, Users, Calendar, DollarSign,
  CheckCircle2, AlertTriangle, Clock,
} from "lucide-react";
import { apiJson, ApiError, invalidateCache } from "@/lib/api-client";

// ============================================================
// TYPES
// ============================================================
type SaasApp = {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  apiUrl: string;
  publicUrl: string;
  isActive: boolean;
  _count?: { tenants: number };
};

type SaasTenant = {
  id: string;
  appId: string;
  externalId: string;
  name: string;
  slug: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  plan: string; // SEED | GROW | LEAD | NETWORK
  status: string;
  studentCount: number;
  studentMin: number;
  studentMax: number | null;
  billingCycle: string;
  amount: number;
  initialFee: number;
  initialFeePaid: boolean;
  yearlyAmount: number;
  bilingualEnabled: boolean;
  bilingualAmount: number;
  schoolsCount: number;
  startDate: string;
  activationDate: string;
  trialEndsAt: string;
  annualDueDate: string;
  nextPaymentDueAt: string;
  cancelledAt: string;
  metadata: Record<string, unknown>;
  lastSyncAt: string;
  syncStatus: string;
  syncError: string;
  createdAt: string;
  app?: SaasApp;
};

// ⭐ Plans Academia Helm (Article 4 du contrat)
const ACADEMIA_HELM_PLANS = [
  {
    code: "SEED",
    name: "Helm Essentiel",
    studentMin: 1,
    studentMax: 50,
    initialFee: 300000,
    yearlyAmount: 50000,
    tagline: "1 à 50 élèves",
    features: ["21 modules métier", "Agents IA ORION/SARA/ATLAS", "WhatsApp illimité gratuit", "Paiements FedaPay/FeexPay", "Site institutionnel"],
  },
  {
    code: "GROW",
    name: "Helm Croissance",
    studentMin: 51,
    studentMax: 150,
    initialFee: 300000,
    yearlyAmount: 75000,
    tagline: "51 à 150 élèves",
    features: ["Tous les modules Essentiel", "Tableaux de bord ORION", "Support prioritaire", "Sauvegarde quotidienne"],
  },
  {
    code: "LEAD",
    name: "Helm Performance",
    studentMin: 151,
    studentMax: 400,
    initialFee: 300000,
    yearlyAmount: 100000,
    tagline: "151 à 400 élèves",
    features: ["Tous les modules Croissance", "ORION Analytics complet", "API d'intégration", "Support dédié 7j/7"],
  },
  {
    code: "NETWORK",
    name: "Helm Institution",
    studentMin: 401,
    studentMax: null,
    initialFee: 300000,
    yearlyAmount: 150000,
    tagline: "401+ élèves (multi-campus)",
    features: ["Tous les modules Performance", "Déploiement multi-campus", "Account manager dédié", "Formation sur site"],
  },
];

const BILINGUAL_YEARLY_AMOUNT = 50000; // FCFA/an

// ============================================================
// PAGE PRINCIPALE
// ============================================================
export default function SaasHubPage() {
  const [apps, setApps] = useState<SaasApp[]>([]);
  const [tenants, setTenants] = useState<SaasTenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeAppId, setActiveAppId] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [creating, setCreating] = useState(false);
  const [editingTenant, setEditingTenant] = useState<SaasTenant | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    invalidateCache("/api/content/saas-apps");
    invalidateCache("/api/content/saas-tenants");
    try {
      const [appsData, tenantsData] = await Promise.all([
        apiJson<{ data: SaasApp[] }>("/api/content/saas-apps"),
        apiJson<{ data: SaasTenant[] }>("/api/content/saas-tenants"),
      ]);
      setApps(appsData.data);
      setTenants(tenantsData.data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Filtre tenants
  const filteredTenants = tenants.filter(t => {
    if (activeAppId !== "all" && t.appId !== activeAppId) return false;
    if (search) {
      const s = search.toLowerCase();
      return t.name.toLowerCase().includes(s) ||
        (t.contactEmail || "").toLowerCase().includes(s) ||
        (t.contactName || "").toLowerCase().includes(s) ||
        (t.slug || "").toLowerCase().includes(s);
    }
    return true;
  });

  // Stats synthétiques
  const stats = {
    total: tenants.length,
    active: tenants.filter(t => t.status === "active").length,
    trial: tenants.filter(t => t.status === "trial").length,
    suspended: tenants.filter(t => t.status === "suspended").length,
    expiringSoon: tenants.filter(t => {
      if (!t.nextPaymentDueAt) return false;
      const days = (new Date(t.nextPaymentDueAt).getTime() - Date.now()) / 86400000;
      return days >= 0 && days <= 7;
    }).length,
    monthlyRevenue: tenants
      .filter(t => t.status === "active" && t.billingCycle === "MONTHLY")
      .reduce((sum, t) => sum + (t.amount || 0), 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <span className="section-tag">SaaS Hub</span>
          <h1 className="mt-3 font-serif text-3xl font-bold text-blanc-creme">
            Contrôle des applications SaaS
          </h1>
          <p className="mt-1 text-sm text-gris-light">
            Hub central pour piloter les apps SaaS développées (Academia Helm, etc.). Crée des tenants, gère les abonnements, dates d'échéance et statuts.
          </p>
        </div>
        <button onClick={() => setCreating(true)} className="btn-primary btn-shimmer">
          <Plus className="h-4 w-4" /> Nouveau tenant
        </button>
      </div>

      {/* Stats synthétiques */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard label="Total tenants" value={String(stats.total)} icon={<Building2 className="h-4 w-4" />} />
        <StatCard label="Actifs" value={String(stats.active)} icon={<CheckCircle2 className="h-4 w-4 text-success" />} />
        <StatCard label="En essai" value={String(stats.trial)} icon={<Clock className="h-4 w-4 text-or" />} />
        <StatCard label="Suspendus" value={String(stats.suspended)} icon={<AlertTriangle className="h-4 w-4 text-danger" />} />
        <StatCard label="Échéance ≤7j" value={String(stats.expiringSoon)} icon={<Calendar className="h-4 w-4 text-warning" />} />
        <StatCard label="Revenus/mois" value={`${stats.monthlyRevenue.toLocaleString("fr-FR")} FCFA`} icon={<DollarSign className="h-4 w-4 text-or" />} />
      </div>

      {/* Apps SaaS — sélection */}
      <div className="rounded-xl border border-gris-dark/30 bg-noir-2 p-4">
        <h2 className="font-sans text-[10px] font-bold uppercase tracking-widest text-gris mb-3">
          Applications enregistrées
        </h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveAppId("all")}
            className={`rounded-full border px-3 py-1.5 font-sans text-[10px] font-bold uppercase tracking-wider transition-all ${
              activeAppId === "all" ? "border-or bg-or/10 text-or" : "border-gris-dark/30 text-gris hover:border-or/30 hover:text-blanc-creme"
            }`}
          >
            Toutes ({tenants.length})
          </button>
          {apps.map(app => (
            <button
              key={app.id}
              onClick={() => setActiveAppId(app.id)}
              className={`rounded-full border px-3 py-1.5 font-sans text-[10px] font-bold uppercase tracking-wider transition-all ${
                activeAppId === app.id ? "border-or bg-or/10 text-or" : "border-gris-dark/30 text-gris hover:border-or/30 hover:text-blanc-creme"
              }`}
            >
              {app.name} ({app._count?.tenants || 0})
            </button>
          ))}
        </div>
      </div>

      {/* Recherche */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gris" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher par nom, email, contact, slug..."
          className="manager-input pl-10"
        />
      </div>

      {/* Liste des tenants */}
      {loading ? (
        <div className="text-center py-8 text-or font-sans text-sm animate-pulse">Chargement…</div>
      ) : error ? (
        <div className="rounded-xl border border-danger/30 bg-danger/5 p-4 text-sm text-danger flex items-center gap-2">
          <AlertCircle className="h-4 w-4" /> {error}
        </div>
      ) : filteredTenants.length === 0 ? (
        <div className="rounded-xl border border-gris-dark/30 bg-noir-2 p-12 text-center">
          <p className="text-gris-light">Aucun tenant pour le moment.</p>
          <button onClick={() => setCreating(true)} className="btn-primary mt-4">
            <Plus className="h-4 w-4" /> Créer le premier
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTenants.map(tenant => (
            <TenantCard
              key={tenant.id}
              tenant={tenant}
              onEdit={() => setEditingTenant(tenant)}
              onDeleted={() => load()}
            />
          ))}
        </div>
      )}

      {/* Modal création tenant */}
      <AnimatePresence>
        {creating && (
          <TenantModal
            apps={apps}
            isNew={true}
            onClose={() => setCreating(false)}
            onSaved={() => { setCreating(false); load(); }}
          />
        )}
        {editingTenant && (
          <TenantModal
            apps={apps}
            isNew={false}
            initial={editingTenant}
            onClose={() => setEditingTenant(null)}
            onSaved={() => { setEditingTenant(null); load(); }}
          />
        )}
      </AnimatePresence>
    </div>
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
// TENANT CARD
// ============================================================
function TenantCard({ tenant, onEdit, onDeleted }: { tenant: SaasTenant; onEdit: () => void; onDeleted: () => void }) {
  const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    active: { label: "Actif", color: "bg-success/10 border-success/30 text-success", icon: <CheckCircle2 className="h-3 w-3" /> },
    trial: { label: "Essai", color: "bg-or/10 border-or/30 text-or", icon: <Clock className="h-3 w-3" /> },
    grace_period: { label: "Période de grâce", color: "bg-warning/10 border-warning/30 text-warning", icon: <AlertTriangle className="h-3 w-3" /> },
    suspended: { label: "Suspendu", color: "bg-danger/10 border-danger/30 text-danger", icon: <AlertTriangle className="h-3 w-3" /> },
    cancelled: { label: "Annulé", color: "bg-gris-dark/10 border-gris-dark/30 text-gris", icon: <X className="h-3 w-3" /> },
  };
  const s = statusConfig[tenant.status] || statusConfig.trial;
  const appName = tenant.app?.name || "—";
  const isAcademiaHelm = tenant.app?.slug === "academia-helm";
  const planLabel = isAcademiaHelm
    ? (ACADEMIA_HELM_PLANS.find(p => p.code === tenant.plan)?.name || tenant.plan)
    : tenant.plan;

  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState<string | null>(null);

  async function handleDelete() {
    if (!confirm(`Supprimer le tenant "${tenant.name}" ? Cette action est irréversible.`)) return;
    try {
      await apiJson(`/api/content/saas-tenants/${tenant.id}`, { method: "DELETE" });
      onDeleted();
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "Erreur");
    }
  }

  async function handleSyncAcademiaHelm() {
    setSyncing(true);
    setSyncMsg(null);
    try {
      const data = await apiJson<{ message?: string; data?: SaasTenant }>(
        `/api/content/saas-tenants/${tenant.id}/sync-academia-helm`,
        { method: "POST", body: JSON.stringify({}) }
      );
      setSyncMsg(data.message || "Synchronisé ✓");
      onDeleted(); // reload list
    } catch (err) {
      setSyncMsg(err instanceof ApiError ? err.message : "Erreur sync");
    } finally {
      setSyncing(false);
    }
  }

  // Calcul jours restants avant échéance annuelle
  const dueDate = tenant.annualDueDate ? new Date(tenant.annualDueDate) : (tenant.nextPaymentDueAt ? new Date(tenant.nextPaymentDueAt) : null);
  const daysLeft = dueDate ? Math.ceil((dueDate.getTime() - Date.now()) / 86400000) : null;

  return (
    <motion.div layout className="rounded-xl border border-gris-dark/30 bg-noir-2 p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className={`rounded-full border px-2 py-0.5 font-sans text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 ${s.color}`}>
              {s.icon}
              {s.label}
            </span>
            <span className="font-sans text-[10px] text-gris">{appName}</span>
            {isAcademiaHelm && tenant.syncStatus === "synced" && (
              <span className="rounded-full bg-success/10 border border-success/30 px-1.5 py-0.5 font-sans text-[8px] uppercase text-success flex items-center gap-0.5">
                <CheckCircle2 className="h-2.5 w-2.5" /> Sync OK
              </span>
            )}
            {isAcademiaHelm && tenant.syncStatus === "error" && (
              <span className="rounded-full bg-danger/10 border border-danger/30 px-1.5 py-0.5 font-sans text-[8px] uppercase text-danger flex items-center gap-0.5">
                <AlertTriangle className="h-2.5 w-2.5" /> Sync erreur
              </span>
            )}
            {isAcademiaHelm && tenant.syncStatus === "pending" && (
              <span className="rounded-full bg-or/10 border border-or/30 px-1.5 py-0.5 font-sans text-[8px] uppercase text-or">
                Sync en attente
              </span>
            )}
          </div>
          <h3 className="font-serif text-lg font-bold text-blanc-creme truncate">{tenant.name}</h3>
          {tenant.slug && (
            <a href={tenant.app?.publicUrl ? `${tenant.app.publicUrl.replace(/\/$/, "")}/${tenant.slug}` : "#"}
               target="_blank" rel="noreferrer"
               className="mt-1 inline-flex items-center gap-1 font-sans text-[10px] text-or hover:underline">
              /{tenant.slug} <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
        <div className="flex gap-1 shrink-0">
          <button onClick={onEdit} className="rounded p-1.5 text-gris-light hover:text-or">
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button onClick={handleDelete} className="rounded p-1.5 text-gris-light hover:text-danger">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Métadonnées */}
      <div className="grid grid-cols-2 gap-2 text-xs text-gris-light">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-3 w-3 text-or" />
          <span>{tenant.studentCount} élèves</span>
        </div>
        <div className="flex items-center gap-2">
          <DollarSign className="h-3 w-3 text-or" />
          <span>{(tenant.yearlyAmount || tenant.amount || 0).toLocaleString("fr-FR")} FCFA/an</span>
        </div>
        {dueDate && (
          <div className="flex items-center gap-2">
            <Calendar className="h-3 w-3 text-or" />
            <span className={daysLeft !== null && daysLeft <= 15 ? "text-warning" : ""}>
              {daysLeft}j avant échéance
            </span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Users className="h-3 w-3 text-or" />
          <span className="truncate">{tenant.contactName || "—"}</span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gris-dark/20 text-[10px] text-gris space-y-1">
        <div className="flex items-center justify-between">
          <span>Plan: <span className="font-bold text-or uppercase">{planLabel}</span></span>
          <span>{isAcademiaHelm ? "Annuel" : tenant.billingCycle}</span>
        </div>
        {isAcademiaHelm && (
          <div className="flex items-center justify-between">
            <span>Activation: <span className={tenant.initialFeePaid ? "text-success" : "text-warning"}>{tenant.initialFee?.toLocaleString("fr-FR") || 0} FCFA</span></span>
            {tenant.bilingualEnabled && <span className="text-or">★ Bilingue</span>}
          </div>
        )}
        {tenant.schoolsCount > 1 && (
          <div className="text-or">🏘 {tenant.schoolsCount} écoles (multi-campus)</div>
        )}
      </div>

      {/* Bouton Sync Academia Helm */}
      {isAcademiaHelm && tenant.syncStatus !== "synced" && (
        <button
          onClick={handleSyncAcademiaHelm}
          disabled={syncing}
          className="mt-3 w-full btn-outline text-[10px] py-1.5 disabled:opacity-50"
        >
          {syncing ? (
            <><Loader2 className="h-3 w-3 animate-spin" /> Sync en cours…</>
          ) : (
            <>Synchroniser avec Academia Helm</>
          )}
        </button>
      )}
      {syncMsg && (
        <div className={`mt-2 text-[10px] p-2 rounded ${syncMsg.includes("Erreur") || syncMsg.includes("erreur") ? "bg-danger/10 text-danger" : "bg-success/10 text-success"}`}>
          {syncMsg}
        </div>
      )}
    </motion.div>
  );
}

// ============================================================
// TENANT MODAL — Création/Édition
// ============================================================
function TenantModal({
  apps, isNew, initial, onClose, onSaved,
}: {
  apps: SaasApp[];
  isNew: boolean;
  initial?: SaasTenant;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [appId, setAppId] = useState(initial?.appId || apps[0]?.id || "");
  const [name, setName] = useState(initial?.name || "");
  const [slug, setSlug] = useState(initial?.slug || "");
  const [contactName, setContactName] = useState(initial?.contactName || "");
  const [contactEmail, setContactEmail] = useState(initial?.contactEmail || "");
  const [contactPhone, setContactPhone] = useState(initial?.contactPhone || "");
  const [plan, setPlan] = useState(initial?.plan || "SEED");
  const [status, setStatus] = useState(initial?.status || "trial");
  const [studentCount, setStudentCount] = useState(initial?.studentCount || 0);
  const [bilingualEnabled, setBilingualEnabled] = useState(initial?.bilingualEnabled || false);
  const [schoolsCount, setSchoolsCount] = useState(initial?.schoolsCount || 1);
  const [initialFeePaid, setInitialFeePaid] = useState(initial?.initialFeePaid || false);
  const [startDate, setStartDate] = useState(initial?.startDate ? initial.startDate.slice(0, 10) : new Date().toISOString().slice(0, 10));
  const [activationDate, setActivationDate] = useState(initial?.activationDate ? initial.activationDate.slice(0, 10) : "");
  const [trialEndsAt, setTrialEndsAt] = useState(initial?.trialEndsAt ? initial.trialEndsAt.slice(0, 10) : "");
  const [annualDueDate, setAnnualDueDate] = useState(initial?.annualDueDate ? initial.annualDueDate.slice(0, 10) : "");
  const [externalId, setExternalId] = useState(initial?.externalId || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedApp = apps.find(a => a.id === appId);
  const isAcademiaHelm = selectedApp?.slug === "academia-helm";

  // Calcul automatique des montants selon le plan Helm
  const helmPlan = ACADEMIA_HELM_PLANS.find(p => p.code === plan);
  const initialFee = isAcademiaHelm ? (helmPlan?.initialFee || 300000) : 0;
  const yearlyAmount = isAcademiaHelm ? (helmPlan?.yearlyAmount || 50000) : 0;
  const bilingualAmount = isAcademiaHelm && bilingualEnabled ? BILINGUAL_YEARLY_AMOUNT : 0;
  const totalYearly = yearlyAmount + bilingualAmount;
  const totalFirstYear = initialFee + totalYearly;

  // Validation : si élèves > studentMax, on doit proposer plan supérieur
  const studentWarning = isAcademiaHelm && helmPlan
    ? (studentCount > (helmPlan.studentMax || 999999)
        ? `⚠️ ${studentCount} élèves dépassent la tranche du plan ${helmPlan.name} (${helmPlan.studentMax} max). Passe au plan supérieur.`
        : studentCount < helmPlan.studentMin && studentCount > 0
          ? `ℹ️ ${studentCount} élèves — tu pourrais passer au plan inférieur (jusqu'à ${helmPlan.studentMin - 1}).`
          : null)
    : null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    // ⭐ Si l'élève dépasse la tranche, on refuse (saut automatique)
    if (isAcademiaHelm && helmPlan && helmPlan.studentMax !== null && studentCount > helmPlan.studentMax) {
      setError(`${studentCount} élèves dépassent le plan ${helmPlan.name} (max ${helmPlan.studentMax}). Choisis un plan supérieur.`);
      setSaving(false);
      return;
    }

    const body = JSON.stringify({
      appId,
      externalId: externalId || undefined,
      name,
      slug: slug || undefined,
      contactName: contactName || undefined,
      contactEmail: contactEmail || undefined,
      contactPhone: contactPhone || undefined,
      plan,
      status,
      studentCount: Number(studentCount),
      studentMin: helmPlan?.studentMin || 1,
      studentMax: helmPlan?.studentMax || null,
      billingCycle: "ANNUAL", // Academia Helm = annual
      amount: totalYearly, // montant annuel total (yearly + bilingual)
      initialFee,
      initialFeePaid,
      yearlyAmount,
      bilingualEnabled,
      bilingualAmount,
      schoolsCount: Number(schoolsCount),
      startDate,
      activationDate: activationDate || undefined,
      trialEndsAt: trialEndsAt || undefined,
      annualDueDate: annualDueDate || undefined,
    });

    try {
      if (isNew) {
        await apiJson("/api/content/saas-tenants", { method: "POST", body });
      } else if (initial) {
        await apiJson(`/api/content/saas-tenants/${initial.id}`, { method: "PUT", body });
      }
      invalidateCache("/api/content/saas-tenants");
      onSaved();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Erreur");
    } finally {
      setSaving(false);
    }
  }

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
            <span className="section-tag">{isNew ? "Nouveau tenant" : "Édition"}</span>
            <h2 className="mt-2 font-serif text-2xl font-bold text-blanc-creme">
              {isNew ? "Créer un tenant" : `Éditer — ${initial?.name}`}
            </h2>
          </div>
          <button onClick={onClose} className="text-gris hover:text-or"><X className="h-5 w-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* App SaaS + nom */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex flex-col gap-2">
              <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-gris-light">Application SaaS *</span>
              <select value={appId} onChange={(e) => setAppId(e.target.value)} className="manager-input" required>
                {apps.map(app => (
                  <option key={app.id} value={app.id}>{app.name}</option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-2">
              <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-gris-light">Nom du tenant *</span>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="manager-input" placeholder="École / Organisation" required />
            </label>
          </div>

          {/* Slug + externalId */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex flex-col gap-2">
              <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-gris-light">Slug (sous-domaine)</span>
              <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} className="manager-input" placeholder="mon-ecole" />
            </label>
            <label className="flex flex-col gap-2">
              <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-gris-light">External ID (optionnel)</span>
              <input type="text" value={externalId} onChange={(e) => setExternalId(e.target.value)} className="manager-input" placeholder="ID chez l'app distante" />
            </label>
          </div>

          {/* Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <label className="flex flex-col gap-2">
              <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-gris-light">Contact (nom)</span>
              <input type="text" value={contactName} onChange={(e) => setContactName(e.target.value)} className="manager-input" />
            </label>
            <label className="flex flex-col gap-2">
              <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-gris-light">Email</span>
              <input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} className="manager-input" />
            </label>
            <label className="flex flex-col gap-2">
              <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-gris-light">Téléphone</span>
              <input type="tel" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} className="manager-input" />
            </label>
          </div>

          {/* ⭐ PLAN ACHEMIA HELM — sélecteur visuel avec cartes */}
          {isAcademiaHelm && (
            <div className="space-y-3">
              <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-gris-light">
                Plan d'abonnement Academia Helm (Article 4 du contrat)
              </span>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {ACADEMIA_HELM_PLANS.map(p => {
                  const selected = plan === p.code;
                  return (
                    <button
                      key={p.code}
                      type="button"
                      onClick={() => setPlan(p.code)}
                      className={`rounded-xl border p-3 text-left transition-all ${
                        selected
                          ? "border-or bg-or/10"
                          : "border-gris-dark/30 hover:border-or/40"
                      }`}
                    >
                      <div className="font-serif text-sm font-bold text-blanc-creme">{p.name}</div>
                      <div className="font-sans text-[10px] text-or mt-0.5">{p.tagline}</div>
                      <div className="mt-2 text-[10px] text-gris-light">
                        <div>Activation: <span className="font-bold text-blanc-creme">{p.initialFee.toLocaleString("fr-FR")}</span> FCFA</div>
                        <div>Annuel: <span className="font-bold text-blanc-creme">{p.yearlyAmount.toLocaleString("fr-FR")}</span> FCFA</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Non-Academia fallback */}
          {!isAcademiaHelm && (
            <label className="flex flex-col gap-2">
              <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-gris-light">Plan</span>
              <select value={plan} onChange={(e) => setPlan(e.target.value)} className="manager-input">
                <option value="free">Free</option>
                <option value="basic">Basic</option>
                <option value="pro">Pro</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </label>
          )}

          {/* Statut */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex flex-col gap-2">
              <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-gris-light">Statut</span>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="manager-input">
                <option value="trial">Essai</option>
                <option value="active">Actif</option>
                <option value="grace_period">Période de grâce</option>
                <option value="suspended">Suspendu</option>
                <option value="cancelled">Annulé</option>
              </select>
            </label>
            <label className="flex flex-col gap-2">
              <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-gris-light">Nombre d'élèves estimé</span>
              <input
                type="number"
                min="0"
                value={studentCount}
                onChange={(e) => setStudentCount(Number(e.target.value))}
                className="manager-input"
              />
              {studentWarning && (
                <span className="text-[10px] text-warning mt-1">{studentWarning}</span>
              )}
            </label>
          </div>

          {/* ⭐ ADD-ONS Academia Helm */}
          {isAcademiaHelm && (
            <div className="rounded-xl border border-or/20 bg-or/5 p-4 space-y-3">
              <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-or">Add-ons Academia Helm</span>

              {/* Bilingue */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={bilingualEnabled}
                  onChange={(e) => setBilingualEnabled(e.target.checked)}
                  className="h-5 w-5 mt-0.5 accent-or"
                />
                <div>
                  <div className="text-sm text-blanc-creme font-bold">Option bilingue FR/EN</div>
                  <div className="text-xs text-gris-light">+{BILINGUAL_YEARLY_AMOUNT.toLocaleString("fr-FR")} FCFA/an — interface bilingue pour parents/élèves</div>
                </div>
              </label>

              {/* Multi-campus */}
              <label className="flex flex-col gap-2">
                <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-gris-light">
                  Nombre d'écoles (multi-campus)
                </span>
                <input
                  type="number"
                  min="1"
                  value={schoolsCount}
                  onChange={(e) => setSchoolsCount(Number(e.target.value))}
                  className="manager-input"
                />
                <span className="text-[10px] text-gris">1 = école unique · 2+ = réseau multi-campus</span>
              </label>

              {/* Frais d'activation payé */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={initialFeePaid}
                  onChange={(e) => setInitialFeePaid(e.target.checked)}
                  className="h-5 w-5 accent-or"
                />
                <div className="text-sm text-blanc-creme">
                  Frais d'activation ({initialFee.toLocaleString("fr-FR")} FCFA) <span className="text-or">payés</span>
                </div>
              </label>
            </div>
          )}

          {/* Récapitulatif financier Academia Helm */}
          {isAcademiaHelm && (
            <div className="rounded-xl border border-bleu-electrique/30 bg-bleu-electrique/5 p-4">
              <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-bleu-electrique">Récapitulatif financier (Article 4)</span>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between"><dt className="text-gris-light">Frais d'activation (one-shot)</dt><dd className="font-bold text-blanc-creme">{initialFee.toLocaleString("fr-FR")} FCFA</dd></div>
                <div className="flex justify-between"><dt className="text-gris-light">Abonnement annuel</dt><dd className="font-bold text-blanc-creme">{yearlyAmount.toLocaleString("fr-FR")} FCFA/an</dd></div>
                {bilingualEnabled && (
                  <div className="flex justify-between"><dt className="text-gris-light">Option bilingue FR/EN</dt><dd className="font-bold text-blanc-creme">{bilingualAmount.toLocaleString("fr-FR")} FCFA/an</dd></div>
                )}
                <div className="border-t border-gris-dark/30 pt-2 flex justify-between">
                  <dt className="font-bold text-or">Total 1ère année</dt>
                  <dd className="font-serif text-xl font-bold text-or">{totalFirstYear.toLocaleString("fr-FR")} FCFA</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gris">Total années suivantes</dt>
                  <dd className="font-bold text-blanc-creme">{totalYearly.toLocaleString("fr-FR")} FCFA/an</dd>
                </div>
              </dl>
            </div>
          )}

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <label className="flex flex-col gap-2">
              <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-gris-light">Date de début</span>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="manager-input" />
            </label>
            <label className="flex flex-col gap-2">
              <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-gris-light">Date d'activation</span>
              <input type="date" value={activationDate} onChange={(e) => setActivationDate(e.target.value)} className="manager-input" />
            </label>
            <label className="flex flex-col gap-2">
              <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-gris-light">Fin d'essai</span>
              <input type="date" value={trialEndsAt} onChange={(e) => setTrialEndsAt(e.target.value)} className="manager-input" />
            </label>
            <label className="flex flex-col gap-2">
              <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-gris-light">Échéance annuelle</span>
              <input type="date" value={annualDueDate} onChange={(e) => setAnnualDueDate(e.target.value)} className="manager-input" />
            </label>
          </div>

          {/* Info si Academia Helm */}
          {isAcademiaHelm && isNew && (
            <div className="rounded-lg border border-bleu-electrique/30 bg-bleu-electrique/5 p-4 text-xs text-gris-light">
              <p className="font-bold text-bleu-electrique mb-1">💡 Sync automatique Academia Helm</p>
              <p>Ce tenant est enregistré localement. Pour le synchroniser automatiquement avec Academia Helm (créer l'école distante, sous-domaine, compte promoteur), le bouton <code className="text-or">Synchroniser Academia Helm</code> apparaîtra sur la carte du tenant après création, une fois <code className="text-or">ACADEMIA_HELM_API_URL</code> configurée sur Railway.</p>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-danger/30 bg-danger/5 p-3 text-sm text-danger">
              <AlertCircle className="h-4 w-4" /> {error}
            </div>
          )}

          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={onClose} className="btn-outline">Annuler</button>
            <button type="submit" disabled={saving} className="btn-primary btn-shimmer disabled:opacity-50">
              {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Enregistrement…</> : <><Save className="h-4 w-4" /> Enregistrer</>}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
