"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  User,
  Mail,
  Lock,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Phone,
  Clock,
  MapPin,
  Globe,
} from "lucide-react";
import { ROLE_LABELS, type Role } from "@/lib/types";

type CurrentUser = {
  id: string;
  email: string;
  name: string;
  role: Role;
};

type SiteSettingsData = {
  whatsappNumber: string;
  contactEmail: string;
  phoneNumber: string;
  hours: string;
  address: string;
  socialLinkedin: string;
  socialFacebook: string;
  socialWhatsapp: string;
};

export default function SettingsPage() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) setUser(d.user as CurrentUser);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-center py-8 text-or font-sans text-sm animate-pulse">Chargement…</div>;
  }

  if (!user) {
    return <div className="text-danger">Non authentifié</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <span className="section-tag">Paramètres</span>
        <h1 className="mt-3 font-serif text-3xl font-bold text-blanc-creme">Mon compte</h1>
        <p className="mt-1 text-sm text-gris-light">
          Gestion du profil, du mot de passe et des paramètres du site.
        </p>
      </div>

      {/* Section 1 : Profil (nom + email) */}
      <ProfileSection user={user} onUpdated={(u) => setUser(u)} />

      {/* Section 2 : Changement de mot de passe */}
      <PasswordSection />

      {/* Section 3 : Paramètres du site (admin seulement) */}
      {user.role === "ADMIN" || user.role === "RESPONSABLE" ? (
        <SiteSettingsSection />
      ) : (
        <div className="rounded-xl border border-gris-dark/30 bg-noir-2 p-6 text-center">
          <p className="text-sm text-gris-light">
            🔒 Seuls les administrateurs et responsables peuvent modifier les paramètres du site.
          </p>
        </div>
      )}

      {/* Footer info */}
      <div className="rounded-xl border border-gris-dark/30 bg-noir-2 p-6 text-center">
        <p className="font-sans text-xs font-bold uppercase tracking-widest text-gris">
          Version actuelle : MVP V0.1 — Gestion interne minimale
        </p>
        <p className="mt-2 text-sm text-gris-light">
          Gestion avancée des utilisateurs et des rôles sera ajoutée en V0.3 / V1.0.
        </p>
      </div>
    </div>
  );
}

// ============================================================
// Section 1 : Profil (nom + email)
// ============================================================

function ProfileSection({
  user,
  onUpdated,
}: {
  user: CurrentUser;
  onUpdated: (u: CurrentUser) => void;
}) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/manager/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Échec");
      }

      const data = await res.json();
      onUpdated(data.user);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-xl border border-gris-dark/30 bg-noir-2 p-6">
      <div className="flex items-center gap-3 mb-6">
        <User className="h-5 w-5 text-or" />
        <h2 className="font-serif text-xl font-bold text-blanc-creme">Profil</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="flex flex-col gap-2">
          <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-gris-light">Nom complet</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="manager-input"
            required
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-gris-light">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="manager-input"
            required
          />
        </label>

        <div className="flex items-center gap-3 pt-2">
          <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-gris">
            Rôle :
          </span>
          <span className="font-sans text-xs font-bold text-or">
            {ROLE_LABELS[user.role] || user.role}
          </span>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 rounded-lg border border-danger/30 bg-danger/5 p-3 text-sm text-danger"
            >
              <AlertCircle className="h-4 w-4" /> {error}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 rounded-lg border border-success/30 bg-success/5 p-3 text-sm text-success"
            >
              <CheckCircle2 className="h-4 w-4" /> Profil mis à jour.
            </motion.div>
          )}
        </AnimatePresence>

        <button
          type="submit"
          disabled={saving}
          className="btn-primary btn-shimmer disabled:opacity-50"
        >
          {saving ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Enregistrement…</>
          ) : (
            <><Save className="h-4 w-4" /> Enregistrer le profil</>
          )}
        </button>
      </form>
    </div>
  );
}

// ============================================================
// Section 2 : Mot de passe
// ============================================================

function PasswordSection() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("Les nouveaux mots de passe ne correspondent pas.");
      return;
    }
    if (newPassword.length < 8) {
      setError("Le nouveau mot de passe doit faire au moins 8 caractères.");
      return;
    }

    setSaving(true);
    setSuccess(false);

    try {
      const res = await fetch("/api/manager/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Échec");
      }

      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-xl border border-gris-dark/30 bg-noir-2 p-6">
      <div className="flex items-center gap-3 mb-6">
        <Lock className="h-5 w-5 text-or" />
        <h2 className="font-serif text-xl font-bold text-blanc-creme">Mot de passe</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="flex flex-col gap-2">
          <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-gris-light">Mot de passe actuel</span>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="manager-input"
            required
            autoComplete="current-password"
          />
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="flex flex-col gap-2">
            <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-gris-light">Nouveau mot de passe</span>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="manager-input"
              required
              minLength={8}
              autoComplete="new-password"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-gris-light">Confirmer</span>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="manager-input"
              required
              autoComplete="new-password"
            />
          </label>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 rounded-lg border border-danger/30 bg-danger/5 p-3 text-sm text-danger"
            >
              <AlertCircle className="h-4 w-4" /> {error}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 rounded-lg border border-success/30 bg-success/5 p-3 text-sm text-success"
            >
              <CheckCircle2 className="h-4 w-4" /> Mot de passe changé avec succès.
            </motion.div>
          )}
        </AnimatePresence>

        <button
          type="submit"
          disabled={saving}
          className="btn-primary btn-shimmer disabled:opacity-50"
        >
          {saving ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Modification…</>
          ) : (
            <><Lock className="h-4 w-4" /> Changer le mot de passe</>
          )}
        </button>
      </form>
    </div>
  );
}

// ============================================================
// Section 3 : Paramètres du site
// ============================================================

function SiteSettingsSection() {
  const [settings, setSettings] = useState<SiteSettingsData | null>(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/manager/site-settings")
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) setSettings(d.settings);
      })
      .catch(() => setError("Erreur de chargement"));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/manager/site-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Échec");
      }

      const data = await res.json();
      setSettings(data.settings);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setSaving(false);
    }
  }

  if (!settings) {
    return (
      <div className="rounded-xl border border-gris-dark/30 bg-noir-2 p-6 text-center">
        <div className="animate-pulse text-or font-sans text-sm">Chargement des paramètres…</div>
      </div>
    );
  }

  function update<K extends keyof SiteSettingsData>(key: K, value: string) {
    setSettings((s) => (s ? { ...s, [key]: value } : s));
  }

  return (
    <div className="rounded-xl border border-gris-dark/30 bg-noir-2 p-6">
      <div className="flex items-center gap-3 mb-6">
        <Globe className="h-5 w-5 text-or" />
        <h2 className="font-serif text-xl font-bold text-blanc-creme">Paramètres du site</h2>
      </div>

      <p className="text-sm text-gris-light mb-6">
        Ces valeurs sont affichées sur le site public (footer, contact, bouton WhatsApp).
        Modifiables à tout moment, sauvegardées en base de données.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Coordonnées */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field
            label="Numéro WhatsApp"
            icon={<Phone className="h-4 w-4 text-or" />}
            value={settings.whatsappNumber}
            onChange={(v) => update("whatsappNumber", v)}
            placeholder="2290141360803"
            hint="Format international sans + ni espaces"
          />
          <Field
            label="Téléphone affiché"
            icon={<Phone className="h-4 w-4 text-or" />}
            value={settings.phoneNumber}
            onChange={(v) => update("phoneNumber", v)}
            placeholder="+229 01 41 36 08 03"
          />
          <Field
            label="Email de contact"
            icon={<Mail className="h-4 w-4 text-or" />}
            value={settings.contactEmail}
            onChange={(v) => update("contactEmail", v)}
            placeholder="contact@yehiortech.com"
            type="email"
          />
          <Field
            label="Horaires"
            icon={<Clock className="h-4 w-4 text-or" />}
            value={settings.hours}
            onChange={(v) => update("hours", v)}
            placeholder="Lundi à samedi, 8h à 20h (GMT+1)"
          />
        </div>

        <Field
          label="Adresse"
          icon={<MapPin className="h-4 w-4 text-or" />}
          value={settings.address}
          onChange={(v) => update("address", v)}
          placeholder="Parakou, Bénin — Afrique de l'Ouest"
        />

        {/* Réseaux sociaux */}
        <div className="pt-4 border-t border-gris-dark/30">
          <p className="font-sans text-[10px] font-bold uppercase tracking-widest text-gris mb-4">Réseaux sociaux</p>
          <div className="grid grid-cols-1 gap-3">
            <Field
              label="LinkedIn"
              value={settings.socialLinkedin}
              onChange={(v) => update("socialLinkedin", v)}
              placeholder="https://www.linkedin.com/..."
            />
            <Field
              label="Facebook"
              value={settings.socialFacebook}
              onChange={(v) => update("socialFacebook", v)}
              placeholder="https://www.facebook.com/..."
            />
            <Field
              label="WhatsApp (lien direct)"
              value={settings.socialWhatsapp}
              onChange={(v) => update("socialWhatsapp", v)}
              placeholder="https://wa.me/..."
            />
          </div>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 rounded-lg border border-danger/30 bg-danger/5 p-3 text-sm text-danger"
            >
              <AlertCircle className="h-4 w-4" /> {error}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 rounded-lg border border-success/30 bg-success/5 p-3 text-sm text-success"
            >
              <CheckCircle2 className="h-4 w-4" /> Paramètres enregistrés. Le site est mis à jour.
            </motion.div>
          )}
        </AnimatePresence>

        <button
          type="submit"
          disabled={saving}
          className="btn-primary btn-shimmer disabled:opacity-50"
        >
          {saving ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Enregistrement…</>
          ) : (
            <><Save className="h-4 w-4" /> Enregistrer les paramètres</>
          )}
        </button>
      </form>
    </div>
  );
}

function Field({
  label,
  icon,
  value,
  onChange,
  placeholder,
  type = "text",
  hint,
}: {
  label: string;
  icon?: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  hint?: string;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="flex items-center gap-2 font-sans text-[10px] font-bold uppercase tracking-widest text-gris-light">
        {icon}
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="manager-input"
        placeholder={placeholder}
        required
      />
      {hint && <span className="text-xs text-gris">{hint}</span>}
    </label>
  );
}
