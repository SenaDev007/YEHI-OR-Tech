"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2, AlertCircle, CheckCircle2, X, UserPlus, Users as UsersIcon,
  Shield, Mail, Lock, Check,
} from "lucide-react";
import { ROLES, ROLE_LABELS, type Role } from "@/lib/types";

type UserRow = {
  id: string;
  email: string;
  name: string;
  role: Role;
  active: boolean;
  createdAt: string;
};

export default function UsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/manager/users");
    const data = await res.json();
    if (data.ok) setUsers(data.data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function toggleActive(userId: string, active: boolean) {
    const res = await fetch("/api/manager/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, active: !active }),
    });
    if (res.ok) load();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <span className="section-tag">Utilisateurs</span>
          <h1 className="mt-3 font-serif text-3xl font-bold text-blanc-creme">Gestion des accès</h1>
          <p className="mt-1 text-sm text-gris-light">Crée des comptes et attribue des rôles pour le back-office.</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="btn-primary btn-shimmer">
          <UserPlus className="h-4 w-4" /> Nouvel utilisateur
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8 text-or font-sans text-sm animate-pulse">Chargement…</div>
      ) : users.length === 0 ? (
        <div className="rounded-2xl border border-gris-dark/30 bg-noir-2 p-12 text-center">
          <UsersIcon className="h-10 w-10 text-gris mx-auto mb-4" />
          <p className="text-gris-light">Aucun utilisateur.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-gris-dark/30 bg-noir-2 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-noir-3 text-left">
              <tr>
                <th className="px-4 py-3 font-sans text-[10px] font-bold uppercase tracking-widest text-gris">Nom</th>
                <th className="px-4 py-3 font-sans text-[10px] font-bold uppercase tracking-widest text-gris">Email</th>
                <th className="px-4 py-3 font-sans text-[10px] font-bold uppercase tracking-widest text-gris">Rôle</th>
                <th className="px-4 py-3 font-sans text-[10px] font-bold uppercase tracking-widest text-gris">Statut</th>
                <th className="px-4 py-3 font-sans text-[10px] font-bold uppercase tracking-widest text-gris">Créé le</th>
                <th className="px-4 py-3 font-sans text-[10px] font-bold uppercase tracking-widest text-gris text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gris-dark/20">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-noir-3 transition-colors">
                  <td className="px-4 py-3 text-blanc-creme font-bold">{u.name}</td>
                  <td className="px-4 py-3 text-gris-light">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full border border-or/30 bg-or/10 px-2 py-0.5 font-sans text-[10px] font-bold uppercase tracking-wider text-or">
                      {ROLE_LABELS[u.role] || u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`font-sans text-[10px] font-bold uppercase tracking-wider ${u.active ? "text-success" : "text-danger"}`}>
                      {u.active ? "Actif" : "Désactivé"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gris text-xs">
                    {new Date(u.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" })}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {u.active ? (
                      <button onClick={() => toggleActive(u.id, u.active)} className="font-sans text-[10px] font-bold uppercase tracking-wider text-danger hover:underline">
                        Désactiver
                      </button>
                    ) : (
                      <button onClick={() => toggleActive(u.id, u.active)} className="font-sans text-[10px] font-bold uppercase tracking-wider text-success hover:underline">
                        Activer
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AnimatePresence>
        {showCreate && (
          <CreateUserModal onClose={() => setShowCreate(false)} onCreated={() => { setShowCreate(false); load(); }} />
        )}
      </AnimatePresence>
    </div>
  );
}

function CreateUserModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("CAISSIER");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/manager/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Échec");
      }

      setSuccess(true);
      setTimeout(onCreated, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
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
        className="w-full max-w-lg rounded-2xl border border-or/20 bg-noir-2 p-6 md:p-8 mb-8 max-h-[85vh] overflow-y-auto"
      >
        {success ? (
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <CheckCircle2 className="h-12 w-12 text-success" />
            <h2 className="font-serif text-2xl font-bold text-blanc-creme">Utilisateur créé !</h2>
            <p className="text-sm text-gris-light">{name} peut maintenant se connecter avec l'email {email}.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="section-tag">Nouvel utilisateur</span>
                <h2 className="mt-2 font-serif text-2xl font-bold text-blanc-creme">Créer un compte</h2>
              </div>
              <button onClick={onClose} className="text-gris hover:text-or"><X className="h-5 w-5" /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex flex-col gap-2">
                  <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-gris-light flex items-center gap-2"><UserPlus className="h-3.5 w-3.5" /> Nom complet</span>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="manager-input" required placeholder="Ex : Marie Adjovi" />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-gris-light flex items-center gap-2"><Mail className="h-3.5 w-3.5" /> Email</span>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="manager-input" required placeholder="marie@yehiortech.com" />
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex flex-col gap-2">
                  <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-gris-light flex items-center gap-2"><Lock className="h-3.5 w-3.5" /> Mot de passe temporaire</span>
                  <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} className="manager-input" required minLength={8} placeholder="Min. 8 caractères" />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-gris-light flex items-center gap-2"><Shield className="h-3.5 w-3.5" /> Rôle</span>
                  <select value={role} onChange={(e) => setRole(e.target.value as Role)} className="manager-input">
                    {ROLES.map((r) => (
                      <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="rounded-xl bg-bleu-nuit/30 p-3 text-xs text-gris-light">
                <p><strong className="text-or">Rôles disponibles :</strong></p>
                <ul className="mt-1 space-y-0.5">
                  <li><strong className="text-blanc-creme">Admin</strong> — Accès total (paramètres, utilisateurs, corrections)</li>
                  <li><strong className="text-blanc-creme">Responsable</strong> — Ventes, dépenses, caisse, stocks, rapports</li>
                  <li><strong className="text-blanc-creme">Caissier</strong> — Ventes, ouverture/clôture caisse</li>
                  <li><strong className="text-blanc-creme">Production</strong> — Commandes et stocks uniquement</li>
                  <li><strong className="text-blanc-creme">Support Academia</strong> — Abonnements Academia uniquement</li>
                  <li><strong className="text-blanc-creme">Lecture seule</strong> — Consultation uniquement</li>
                </ul>
              </div>

              {error && (
                <div className="flex items-center gap-2 rounded-xl border border-danger/30 bg-danger/5 p-3 text-sm text-danger">
                  <AlertCircle className="h-4 w-4" /> {error}
                </div>
              )}

              <div className="flex gap-3 justify-end">
                <button type="button" onClick={onClose} className="btn-outline">Annuler</button>
                <button type="submit" disabled={saving} className="btn-primary btn-shimmer disabled:opacity-50">
                  {saving ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Création…</>
                  ) : (
                    <><Check className="h-4 w-4" /> Créer l'utilisateur</>
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
