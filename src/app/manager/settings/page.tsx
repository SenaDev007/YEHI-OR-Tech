"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, User, Mail, Lock } from "lucide-react";
import { ROLE_LABELS, ROLE_PERMISSIONS, type Role } from "@/lib/types";

type CurrentUser = {
  id: string;
  email: string;
  name: string;
  role: Role;
};

export default function SettingsPage() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) setUser(d.user);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-center py-8 text-or font-mono text-sm animate-pulse">Chargement…</div>;
  }

  if (!user) {
    return <div className="text-danger">Non authentifié</div>;
  }

  const permissions = ROLE_PERMISSIONS[user.role] || [];

  return (
    <div className="space-y-6">
      <div>
        <span className="section-tag">Paramètres</span>
        <h1 className="mt-3 font-display text-3xl font-medium text-blanc-creme">Mon compte</h1>
        <p className="mt-1 text-sm text-gris-light">
          Gestion de l'utilisateur connecté et des permissions associées.
        </p>
      </div>

      {/* Profil */}
      <div className="rounded-xl border border-gris-dark/30 bg-noir-2 p-6">
        <h2 className="font-display text-xl font-medium text-blanc-creme mb-4">
          Profil
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoLine icon={<User className="h-4 w-4 text-or" />} label="Nom complet" value={user.name} />
          <InfoLine icon={<Mail className="h-4 w-4 text-or" />} label="Email" value={user.email} />
          <InfoLine
            icon={<ShieldCheck className="h-4 w-4 text-or" />}
            label="Rôle"
            value={ROLE_LABELS[user.role] || user.role}
          />
          <InfoLine
            icon={<Lock className="h-4 w-4 text-or" />}
            label="ID Utilisateur"
            value={<code className="font-mono text-xs text-gris">{user.id}</code>}
          />
        </div>
      </div>

      {/* Permissions */}
      <div className="rounded-xl border border-gris-dark/30 bg-noir-2 p-6">
        <h2 className="font-display text-xl font-medium text-blanc-creme mb-4">
          Permissions du rôle ({permissions.length})
        </h2>
        {permissions.includes("*") ? (
          <p className="text-sm text-success">
            ✅ Accès total — Toutes les permissions sont accordées au rôle {ROLE_LABELS[user.role]}.
          </p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {permissions.map((perm) => (
              <li
                key={perm}
                className="rounded border border-gris-dark/30 bg-noir-3 px-3 py-2 font-mono text-xs text-gris-light"
              >
                {perm}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Configuration du sous-domaine */}
      <div className="rounded-xl border border-or/20 bg-or/5 p-6">
        <h2 className="font-display text-xl font-medium text-blanc-creme mb-2">
          Configuration du sous-domaine
        </h2>
        <p className="text-sm text-gris-light mb-4">
          Cette application est accessible via le sous-domaine sécurisé :
        </p>
        <code className="block rounded-lg border border-or/30 bg-noir-2 px-4 py-3 font-mono text-sm text-or">
          https://manager.yehiortech.com
        </code>
        <p className="mt-4 text-xs text-gris">
          ⚠️ L'accès direct via <code className="text-or">yehiortech.com/manager/*</code> est également possible pour le débogage.
        </p>
      </div>

      {/* V1 info */}
      <div className="rounded-xl border border-gris-dark/30 bg-noir-2 p-6 text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-gris">
          Version actuelle : MVP V0.1 — Gestion interne minimale
        </p>
        <p className="mt-2 text-sm text-gris-light">
          Gestion des utilisateurs, des rôles, des paramètres avancés et des exports comptables seront ajoutés en V0.3 / V1.0.
        </p>
      </div>
    </div>
  );
}

function InfoLine({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-gris-dark/30 bg-noir-3 p-4">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="font-mono text-[10px] uppercase tracking-widest text-gris">{label}</span>
      </div>
      <p className="text-sm text-blanc-creme">{value}</p>
    </div>
  );
}
