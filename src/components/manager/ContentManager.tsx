"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2, AlertCircle, X, Plus, Pencil, Trash2, Save, GripVertical,
} from "lucide-react";
import { apiJson, ApiError, invalidateCache } from "@/lib/api-client";

type Item = Record<string, unknown> & { id: string };

type FieldDef = {
  name: string;
  label: string;
  type: "text" | "textarea" | "number" | "boolean" | "list" | "json";
  default?: unknown;
  placeholder?: string;
};

type ContentManagerProps = {
  title: string;
  subtitle: string;
  tag: string;
  apiPath: string; // e.g. "/api/content/services"
  fields: FieldDef[];
  renderItem: (item: Item) => React.ReactNode;
  itemLabel: (item: Item) => string;
};

/**
 * Composant générique pour gérer une liste de contenu (CRUD).
 * Réutilisé pour services, testimonials, portfolio, pricing, stats.
 *
 * Le pattern est inspiré de Win-Agro (admin/catalogue) :
 *  - Liste des items existants avec boutons éditer/supprimer
 *  - Modal d'édition/création avec les fields définis
 *  - POST pour créer, PUT pour éditer, DELETE pour supprimer
 */
export function ContentManager({
  title, subtitle, tag, apiPath, fields, renderItem, itemLabel,
}: ContentManagerProps) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Item | null>(null);
  const [creating, setCreating] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    invalidateCache(apiPath);
    try {
      const data = await apiJson<{ data: Item[] }>(apiPath);
      setItems(data.data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }, [apiPath]);

  useEffect(() => { load(); }, [load]);

  async function handleDelete(id: string) {
    if (!confirm("Supprimer cet élément ? Cette action est irréversible.")) return;
    try {
      await apiJson(`${apiPath}/${id}`, { method: "DELETE" });
      setItems(items.filter(i => i.id !== id));
      invalidateCache(apiPath);
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "Erreur lors de la suppression");
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <span className="section-tag">{tag}</span>
          <h1 className="mt-3 font-serif text-3xl font-bold text-blanc-creme">{title}</h1>
          <p className="mt-1 text-sm text-gris-light">{subtitle}</p>
        </div>
        <button onClick={() => setCreating(true)} className="btn-primary btn-shimmer">
          <Plus className="h-4 w-4" /> Nouvel élément
        </button>
      </div>

      {/* Liste */}
      {loading ? (
        <div className="text-center py-8 text-or font-sans text-sm animate-pulse">Chargement…</div>
      ) : error ? (
        <div className="rounded-xl border border-danger/30 bg-danger/5 p-4 text-sm text-danger flex items-center gap-2">
          <AlertCircle className="h-4 w-4" /> {error}
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-gris-dark/30 bg-noir-2 p-12 text-center">
          <p className="text-gris-light">Aucun élément pour le moment.</p>
          <button onClick={() => setCreating(true)} className="btn-primary mt-4">
            <Plus className="h-4 w-4" /> Créer le premier
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <motion.div
              key={item.id}
              layout
              className="rounded-xl border border-gris-dark/30 bg-noir-2 p-4 flex items-start gap-4"
            >
              <GripVertical className="h-4 w-4 text-gris-dark mt-1 shrink-0" />
              <div className="flex-1 min-w-0">{renderItem(item)}</div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => setEditing(item)}
                  className="rounded-lg p-2 text-gris-light hover:bg-noir-3 hover:text-or transition-colors"
                  aria-label="Éditer"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="rounded-lg p-2 text-gris-light hover:bg-danger/10 hover:text-danger transition-colors"
                  aria-label="Supprimer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal création/édition */}
      <AnimatePresence>
        {(creating || editing) && (
          <EditModal
            fields={fields}
            initial={editing ?? ({} as Item)}
            isNew={creating}
            onClose={() => { setCreating(false); setEditing(null); }}
            onSaved={() => { setCreating(false); setEditing(null); load(); }}
            apiPath={apiPath}
            title={creating ? "Créer" : `Éditer — ${itemLabel(editing!)}`}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================
// MODAL D'ÉDITION
// ============================================================
function EditModal({
  fields, initial, isNew, onClose, onSaved, apiPath, title,
}: {
  fields: FieldDef[];
  initial: Item;
  isNew: boolean;
  onClose: () => void;
  onSaved: () => void;
  apiPath: string;
  title: string;
}) {
  const [values, setValues] = useState<Record<string, unknown>>(() => {
    const v: Record<string, unknown> = {};
    for (const f of fields) {
      v[f.name] = initial[f.name] ?? f.default ?? (f.type === "list" ? [] : f.type === "boolean" ? false : f.type === "number" ? 0 : "");
    }
    return v;
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update(name: string, value: unknown) {
    setValues((s) => ({ ...s, [name]: value }));
  }

  function handleListChange(name: string, text: string) {
    const arr = text.split("\n").map((s) => s.trim()).filter(Boolean);
    update(name, arr);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const body = JSON.stringify(values);
      if (isNew) {
        await apiJson(apiPath, { method: "POST", body });
      } else {
        await apiJson(`${apiPath}/${initial.id}`, { method: "PUT", body });
      }
      invalidateCache(apiPath);
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
            <span className="section-tag">{isNew ? "Nouveau" : "Édition"}</span>
            <h2 className="mt-2 font-serif text-2xl font-bold text-blanc-creme">{title}</h2>
          </div>
          <button onClick={onClose} className="text-gris hover:text-or"><X className="h-5 w-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((f) => (
            <label key={f.name} className="flex flex-col gap-2">
              <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-gris-light">
                {f.label}
              </span>
              {f.type === "textarea" ? (
                <textarea
                  value={String(values[f.name] ?? "")}
                  onChange={(e) => update(f.name, e.target.value)}
                  className="manager-input resize-none"
                  rows={4}
                  placeholder={f.placeholder}
                />
              ) : f.type === "number" ? (
                <input
                  type="number"
                  value={Number(values[f.name] ?? 0)}
                  onChange={(e) => update(f.name, Number(e.target.value))}
                  className="manager-input"
                  placeholder={f.placeholder}
                />
              ) : f.type === "boolean" ? (
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(values[f.name])}
                    onChange={(e) => update(f.name, e.target.checked)}
                    className="h-5 w-5 accent-or"
                  />
                  <span className="text-sm text-gris-light">Activé</span>
                </label>
              ) : f.type === "list" ? (
                <textarea
                  value={Array.isArray(values[f.name]) ? (values[f.name] as string[]).join("\n") : ""}
                  onChange={(e) => handleListChange(f.name, e.target.value)}
                  className="manager-input resize-none font-mono text-xs"
                  rows={6}
                  placeholder={"Un élément par ligne"}
                />
              ) : (
                <input
                  type="text"
                  value={String(values[f.name] ?? "")}
                  onChange={(e) => update(f.name, e.target.value)}
                  className="manager-input"
                  placeholder={f.placeholder}
                />
              )}
            </label>
          ))}

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
