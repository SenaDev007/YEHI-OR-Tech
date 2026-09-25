"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  Loader2, AlertCircle, Rocket, ExternalLink, ChevronRight,
  Building2, CheckCircle2, Clock, AlertTriangle,
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
  tenantCount?: number;
};

// ============================================================
// PAGE PORTAIL — sélection de l'app SaaS
// ============================================================
export default function SaasHubPage() {
  const [apps, setApps] = useState<SaasApp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Comptes distants par appId (fetch en parallèle, en arrière-plan)
  const [remoteCounts, setRemoteCounts] = useState<Record<string, number | null>>({});

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    invalidateCache("/api/content/saas-apps");
    try {
      const data = await apiJson<{ data: SaasApp[] }>("/api/content/saas-apps");
      setApps(data.data);

      // ⭐ Fetch parallèle du compte de tenants distants pour chaque app
      // (best-effort — si ça échoue, on affiche juste "Voir dashboard")
      for (const app of data.data) {
        apiJson<{ total: number }>(`/api/content/saas-apps/${app.id}/remote-tenants?limit=1`)
          .then((r) => {
            setRemoteCounts((prev) => ({ ...prev, [app.id]: r.total }));
          })
          .catch(() => {
            setRemoteCounts((prev) => ({ ...prev, [app.id]: null }));
          });
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <span className="section-tag">SaaS Hub</span>
        <h1 className="mt-3 font-serif text-3xl font-bold text-blanc-creme">
          Hub de contrôle des applications SaaS
        </h1>
        <p className="mt-1 text-sm text-gris-light">
          Sélectionne une application pour accéder à son dashboard de contrôle.
          Chaque app expose ses tenants (écoles, organisations) via son API.
        </p>
      </div>

      {/* Portail des apps */}
      {loading ? (
        <div className="text-center py-12 text-or font-sans text-sm animate-pulse">Chargement des apps…</div>
      ) : error ? (
        <div className="rounded-xl border border-danger/30 bg-danger/5 p-4 text-sm text-danger flex items-center gap-2">
          <AlertCircle className="h-4 w-4" /> {error}
        </div>
      ) : apps.length === 0 ? (
        <div className="rounded-xl border border-gris-dark/30 bg-noir-2 p-12 text-center">
          <p className="text-gris-light">Aucune app SaaS enregistrée pour le moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {apps.map((app, idx) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.4 }}
            >
              <AppCard app={app} remoteCount={remoteCounts[app.id]} />
            </motion.div>
          ))}
        </div>
      )}

      {/* Section info architecture */}
      <div className="rounded-xl border border-bleu-electrique/30 bg-bleu-electrique/5 p-5 mt-8">
        <h2 className="font-sans text-[10px] font-bold uppercase tracking-widest text-bleu-electrique mb-2">
          🏗️ Architecture SaaS Hub
        </h2>
        <p className="text-sm text-gris-light leading-relaxed">
          Le SaaS Hub est le point d'entrée central pour piloter toutes les apps SaaS développées par YEHI OR Tech.
          Chaque app est enregistrée ici avec son API URL + credentials admin. Au clic sur une app,
          tu accèdes à son dashboard dédié qui fetch dynamiquement les tenants depuis l'API distante
          (Academia Helm expose <code className="text-or">/platform/tenants</code> par exemple).
        </p>
        <p className="mt-2 text-xs text-gris">
          Pour ajouter une nouvelle app SaaS, crée une entrée via <code className="text-or">/api/content/saas-apps</code> (POST) ou directement en DB.
        </p>
      </div>
    </div>
  );
}

// ============================================================
// APP CARD — carte d'une app SaaS (div + onClick pour éviter nested <a>)
// ============================================================
function AppCard({ app, remoteCount }: { app: SaasApp; remoteCount?: number | null }) {
  const router = useRouter();
  // ⭐ Logo dynamique : utilise publicUrl + /icon-512.png si publicUrl est défini
  // Sinon fallback sur l'icône Rocket
  const logoUrl = app.publicUrl ? `${app.publicUrl.replace(/\/$/, "")}/icon-512.png` : null;

  function handleNavigate() {
    router.push(`/manager/saas-hub/${app.slug}`);
  }

  return (
    <div
      onClick={handleNavigate}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleNavigate(); } }}
      className="block rounded-2xl border border-gris-dark/30 bg-noir-2 p-6 transition-all duration-300 hover:border-or/40 hover:bg-noir-3/50 group h-full cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        {/* ⭐ Logo officiel de l'app (fetch depuis leur /icon-512.png) */}
        {logoUrl ? (
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl overflow-hidden border border-or/30 bg-white p-1.5">
            <Image
              src={logoUrl}
              alt={`${app.name} logo`}
              width={48}
              height={48}
              className="object-contain rounded-lg"
              // Pas de priority pour ne pas surcharger le lazy-load
            />
          </div>
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-or/20 to-bleu-electrique/20 border border-or/30">
            <Rocket className="h-7 w-7 text-or" />
          </div>
        )}
        {app.publicUrl && (
          <a
            href={app.publicUrl}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-gris hover:text-or transition-colors p-1"
            aria-label={`Voir ${app.name} dans un nouvel onglet`}
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
      </div>

      <h2 className="font-serif text-2xl font-bold text-blanc-creme group-hover:text-or transition-colors duration-300">
        {app.name}
      </h2>
      <p className="mt-2 text-sm text-gris-light line-clamp-3 text-pretty">
        {app.description}
      </p>

      <div className="mt-4 pt-4 border-t border-gris-dark/20 flex items-center justify-between text-xs">
        <span className="font-sans font-bold uppercase tracking-wider text-gris">
          {remoteCount !== null && remoteCount !== undefined ? (
            <>{remoteCount} tenant{remoteCount > 1 ? "s" : ""}</>
          ) : (
            <>Voir dashboard</>
          )}
        </span>
        <span className="inline-flex items-center gap-1 font-sans font-bold uppercase tracking-widest text-or group-hover:translate-x-1 transition-transform duration-300">
          Accéder
          <ChevronRight className="h-3 w-3" />
        </span>
      </div>
    </div>
  );
}
