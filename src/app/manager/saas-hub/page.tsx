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
  plan: string;
  status: string;
  studentCount: number;
  billingCycle: string;
  amount: number;
  startDate: string;
  trialEndsAt: string;
  nextPaymentDueAt: string;
  cancelledAt: string;
  metadata: Record<string, unknown>;
  lastSyncAt: string;
  createdAt: string;
  app?: SaasApp;
};

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
    suspended: { label: "Suspendu", color: "bg-danger/10 border-danger/30 text-danger", icon: <AlertTriangle className="h-3 w-3" /> },
    cancelled: { label: "Annulé", color: "bg-gris-dark/10 border-gris-dark/30 text-gris", icon: <X className="h-3 w-3" /> },
  };
  const s = statusConfig[tenant.status] || statusConfig.trial;
  const appName = tenant.app?.name || "—";

  async function handleDelete() {
    if (!confirm(`Supprimer le tenant "${tenant.name}" ? Cette action est irréversible.`)) return;
    try {
      await apiJson(`/api/content/saas-tenants/${tenant.id}`, { method: "DELETE" });
      onDeleted();
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "Erreur");
    }
  }

  // Calcul jours restants
  const dueDate = tenant.nextPaymentDueAt ? new Date(tenant.nextPaymentDueAt) : null;
  const daysLeft = dueDate ? Math.ceil((dueDate.getTime() - Date.now()) / 86400000) : null;

  return (
    <motion.div
      layout
      className="rounded-xl border border-gris-dark/30 bg-noir-2 p-5"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`rounded-full border px-2 py-0.5 font-sans text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 ${s.color}`}>
              {s.icon}
              {s.label}
            </span>
            <span className="font-sans text-[10px] text-gris">{appName}</span>
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
          <span>{tenant.amount.toLocaleString("fr-FR")} FCFA</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-3 w-3 text-or" />
          {dueDate ? (
            <span className={daysLeft !== null && daysLeft <= 7 ? "text-warning" : ""}>
              {daysLeft}j restants
            </span>
          ) : (
            <span>—</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-3 w-3 text-or" />
          <span className="truncate">{tenant.contactName || "—"}</span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gris-dark/20 text-[10px] text-gris">
        <div className="flex items-center justify-between">
          <span>Plan: <span className="font-bold text-or uppercase">{tenant.plan}</span></span>
          <span>{tenant.billingCycle === "MONTHLY" ? "Mensuel" : tenant.billingCycle === "YEARLY" ? "Annuel" : tenant.billingCycle}</span>
        </div>
      </div>
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
  const [plan, setPlan] = useState(initial?.plan || "free");
  const [status, setStatus] = useState(initial?.status || "trial");
  const [studentCount, setStudentCount] = useState(initial?.studentCount || 0);
  const [billingCycle, setBillingCycle] = useState(initial?.billingCycle || "MONTHLY");
  const [amount, setAmount] = useState(initial?.amount || 0);
  const [startDate, setStartDate] = useState(initial?.startDate ? initial.startDate.slice(0, 10) : new Date().toISOString().slice(0, 10));
  const [trialEndsAt, setTrialEndsAt] = useState(initial?.trialEndsAt ? initial.trialEndsAt.slice(0, 10) : "");
  const [nextPaymentDueAt, setNextPaymentDueAt] = useState(initial?.nextPaymentDueAt ? initial.nextPaymentDueAt.slice(0, 10) : "");
  const [externalId, setExternalId] = useState(initial?.externalId || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

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
      billingCycle,
      amount: Number(amount),
      startDate,
      trialEndsAt: trialEndsAt || undefined,
      nextPaymentDueAt: nextPaymentDueAt || undefined,
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

  const selectedApp = apps.find(a => a.id === appId);

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

          {/* Plan + Statut + BillingCycle */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <label className="flex flex-col gap-2">
              <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-gris-light">Plan</span>
              <select value={plan} onChange={(e) => setPlan(e.target.value)} className="manager-input">
                <option value="free">Free</option>
                <option value="basic">Basic</option>
                <option value="pro">Pro</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </label>
            <label className="flex flex-col gap-2">
              <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-gris-light">Statut</span>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="manager-input">
                <option value="trial">Essai</option>
                <option value="active">Actif</option>
                <option value="suspended">Suspendu</option>
                <option value="cancelled">Annulé</option>
              </select>
            </label>
            <label className="flex flex-col gap-2">
              <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-gris-light">Cycle facturation</span>
              <select value={billingCycle} onChange={(e) => setBillingCycle(e.target.value)} className="manager-input">
                <option value="MONTHLY">Mensuel</option>
                <option value="YEARLY">Annuel</option>
                <option value="ONE_TIME">One-shot</option>
              </select>
            </label>
          </div>

          {/* Amount + StudentCount */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex flex-col gap-2">
              <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-gris-light">Montant (FCFA)</span>
              <input type="number" min="0" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="manager-input" />
            </label>
            <label className="flex flex-col gap-2">
              <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-gris-light">Nombre d'élèves</span>
              <input type="number" min="0" value={studentCount} onChange={(e) => setStudentCount(Number(e.target.value))} className="manager-input" />
            </label>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <label className="flex flex-col gap-2">
              <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-gris-light">Date de début</span>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="manager-input" />
            </label>
            <label className="flex flex-col gap-2">
              <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-gris-light">Fin d'essai</span>
              <input type="date" value={trialEndsAt} onChange={(e) => setTrialEndsAt(e.target.value)} className="manager-input" />
            </label>
            <label className="flex flex-col gap-2">
              <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-gris-light">Prochain paiement</span>
              <input type="date" value={nextPaymentDueAt} onChange={(e) => setNextPaymentDueAt(e.target.value)} className="manager-input" />
            </label>
          </div>

          {/* Info si Academia Helm */}
          {selectedApp?.slug === "academia-helm" && isNew && (
            <div className="rounded-lg border border-bleu-electrique/30 bg-bleu-electrique/5 p-4 text-xs text-gris-light">
              <p className="font-bold text-bleu-electrique mb-1">💡 Intégration Academia Helm</p>
              <p>Pour le moment, ce tenant est enregistré localement dans YEHI OR Tech. Pour le synchroniser automatiquement avec Academia Helm (créer l'école dans leur DB, sous-domaine, compte promoteur), il faut configurer <code className="text-or">ACADEMIA_HELM_API_URL</code> sur Railway et activer le sync.</p>
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
