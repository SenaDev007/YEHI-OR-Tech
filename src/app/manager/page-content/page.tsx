"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, AlertCircle, X, Save, Plus, Pencil, Trash2 } from "lucide-react";
import { apiJson, ApiError, invalidateCache } from "@/lib/api-client";

type PageContentItem = {
  id: string;
  page: string;
  section: string;
  key: string;
  value: string;
};

export default function PageContentManagerPage() {
  const [items, setItems] = useState<PageContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<PageContentItem | null>(null);
  const [creating, setCreating] = useState(false);

  async function load() {
    setLoading(true);
    invalidateCache("/api/content/page-content");
    try {
      const data = await apiJson<{ data: PageContentItem[] }>("/api/content/page-content");
      setItems(data.data);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id: string) {
    if (!confirm("Supprimer ?")) return;
    try {
      await apiJson(`/api/content/page-content/${id}`, { method: "DELETE" });
      setItems(items.filter(i => i.id !== id));
      invalidateCache("/api/content/page-content");
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "Erreur");
    }
  }

  // Group by page
  const grouped = items.reduce<Record<string, PageContentItem[]>>((acc, item) => {
    if (!acc[item.page]) acc[item.page] = [];
    acc[item.page].push(item);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <span className="section-tag">Contenu public</span>
          <h1 className="mt-3 font-serif text-3xl font-bold text-blanc-creme">Textes de pages</h1>
          <p className="mt-1 text-sm text-gris-light">
            Édite les titres, sous-titres et descriptions de toutes les pages publiques (homepage, à propos, etc.).
          </p>
        </div>
        <button onClick={() => setCreating(true)} className="btn-primary btn-shimmer">
          <Plus className="h-4 w-4" /> Nouvelle entrée
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8 text-or font-sans text-sm animate-pulse">Chargement…</div>
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-gris-dark/30 bg-noir-2 p-12 text-center">
          <p className="text-gris-light">Aucune entrée pour le moment.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([page, pageItems]) => (
            <div key={page} className="rounded-xl border border-gris-dark/30 bg-noir-2 p-5">
              <h2 className="font-serif text-lg font-bold text-or capitalize mb-3">/{page}</h2>
              <div className="space-y-2">
                {pageItems.map((item) => (
                  <div key={item.id} className="flex items-start gap-3 rounded-lg bg-noir-3 p-3">
                    <div className="flex-1 min-w-0">
                      <div className="font-sans text-[10px] font-bold uppercase tracking-wider text-gris">
                        {item.section} · {item.key}
                      </div>
                      <p className="mt-1 text-sm text-blanc-creme text-pretty line-clamp-3">{item.value}</p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button onClick={() => setEditing(item)} className="rounded p-1.5 text-gris-light hover:text-or">
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="rounded p-1.5 text-gris-light hover:text-danger">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {(editing || creating) && (
          <PageContentModal
            initial={editing || {}}
            isNew={creating}
            onClose={() => { setEditing(null); setCreating(false); }}
            onSaved={() => { setEditing(null); setCreating(false); load(); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function PageContentModal({
  initial, isNew, onClose, onSaved,
}: {
  initial: Partial<PageContentItem>;
  isNew: boolean;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [page, setPage] = useState(initial.page || "home");
  const [section, setSection] = useState(initial.section || "hero");
  const [key, setKey] = useState(initial.key || "title");
  const [value, setValue] = useState(initial.value || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const body = JSON.stringify({ page, section, key, value });
      if (isNew) {
        await apiJson("/api/content/page-content", { method: "PUT", body });
      } else {
        await apiJson(`/api/content/page-content/${initial.id}`, { method: "DELETE" }).catch(() => {});
        await apiJson("/api/content/page-content", { method: "PUT", body });
      }
      invalidateCache("/api/content/page-content");
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-2xl border border-or/20 bg-noir-2 p-6 md:p-8 mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-2xl font-bold text-blanc-creme">
            {isNew ? "Nouveau texte" : "Éditer le texte"}
          </h2>
          <button onClick={onClose} className="text-gris hover:text-or"><X className="h-5 w-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <label className="flex flex-col gap-2">
              <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-gris-light">Page</span>
              <select value={page} onChange={(e) => setPage(e.target.value)} className="manager-input">
                <option value="home">home</option>
                <option value="about">about</option>
                <option value="services">services</option>
                <option value="tarifs">tarifs</option>
                <option value="portfolio">portfolio</option>
                <option value="contact">contact</option>
              </select>
            </label>
            <label className="flex flex-col gap-2">
              <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-gris-light">Section</span>
              <input type="text" value={section} onChange={(e) => setSection(e.target.value)} className="manager-input" placeholder="hero" />
            </label>
            <label className="flex flex-col gap-2">
              <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-gris-light">Clé</span>
              <input type="text" value={key} onChange={(e) => setKey(e.target.value)} className="manager-input" placeholder="title" />
            </label>
          </div>
          <label className="flex flex-col gap-2">
            <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-gris-light">Valeur</span>
            <textarea value={value} onChange={(e) => setValue(e.target.value)} className="manager-input resize-none" rows={5} required />
          </label>
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
