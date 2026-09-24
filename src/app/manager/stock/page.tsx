"use client";

import { useEffect, useState } from "react";
import { Package, AlertTriangle, TrendingDown } from "lucide-react";
import { apiJson } from "@/lib/api-client";

type StockItem = {
  id: string;
  name: string;
  category: string;
  unit: string;
  quantity: number;
  threshold: number;
  unitCost: number | null;
  movements: { id: string; type: string; quantity: number; createdAt: string }[];
};

export default function StockPage() {
  const [items, setItems] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiJson<{ data: StockItem[] }>("/api/manager/stock")
      .then((d) => setItems(d.data))
      .finally(() => setLoading(false));
  }, []);

  const lowStock = items.filter((i) => i.quantity <= i.threshold);

  if (loading) {
    return <div className="text-center py-8 text-or font-mono text-sm animate-pulse">Chargement…</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <span className="section-tag">Stocks</span>
        <h1 className="mt-3 font-display text-3xl font-medium text-blanc-creme">Inventaire</h1>
        <p className="mt-1 text-sm text-gris-light">Suivi du papier, toners, encres et fournitures.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Articles" value={String(items.length)} />
        <StatCard label="Catégories" value={String(new Set(items.map((i) => i.category)).size)} />
        <StatCard label="Sous le seuil" value={String(lowStock.length)} accent={lowStock.length > 0 ? "danger" : "success"} />
        <StatCard
          label="Valeur totale"
          value={formatFCFA(items.reduce((sum, i) => sum + (i.unitCost || 0) * i.quantity, 0))}
        />
      </div>

      {/* Alertes stock bas */}
      {lowStock.length > 0 && (
        <div className="rounded-xl border border-danger/30 bg-danger/5 p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-danger" />
            <span className="font-mono text-xs uppercase tracking-widest text-danger">
              {lowStock.length} article(s) sous le seuil
            </span>
          </div>
          <ul className="text-sm text-gris-light space-y-1">
            {lowStock.map((item) => (
              <li key={item.id}>
                • {item.name} — {item.quantity} {item.unit} restant(s) (seuil : {item.threshold})
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Liste */}
      <div className="rounded-xl border border-gris-dark/30 bg-noir-2 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-noir-3 text-left">
            <tr>
              <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-gris">Article</th>
              <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-gris">Catégorie</th>
              <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-gris text-right">Quantité</th>
              <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-gris text-right">Seuil</th>
              <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-gris text-right">Coût unit.</th>
              <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-gris text-right">Valeur</th>
              <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-gris">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gris-dark/20">
            {items.map((item) => {
              const low = item.quantity <= item.threshold;
              return (
                <tr key={item.id} className="hover:bg-noir-3 transition-colors">
                  <td className="px-4 py-3 text-blanc-creme">{item.name}</td>
                  <td className="px-4 py-3 text-gris-light">{item.category}</td>
                  <td className="px-4 py-3 text-right text-blanc-creme">
                    {item.quantity} <span className="text-gris text-xs">{item.unit}</span>
                  </td>
                  <td className="px-4 py-3 text-right text-gris-light">{item.threshold}</td>
                  <td className="px-4 py-3 text-right text-gris-light">
                    {item.unitCost ? formatFCFA(item.unitCost) : "—"}
                  </td>
                  <td className="px-4 py-3 text-right text-blanc-creme">
                    {item.unitCost ? formatFCFA(item.unitCost * item.quantity) : "—"}
                  </td>
                  <td className="px-4 py-3">
                    {low ? (
                      <span className="font-mono text-[10px] uppercase tracking-wider text-danger flex items-center gap-1">
                        <TrendingDown className="h-3 w-3" /> Sous seuil
                      </span>
                    ) : (
                      <span className="font-mono text-[10px] uppercase tracking-wider text-success">
                        OK
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {items.length === 0 && (
        <div className="rounded-xl border border-gris-dark/30 bg-noir-2 p-12 text-center">
          <Package className="h-10 w-10 text-gris mx-auto mb-4" />
          <p className="text-gris-light">Aucun article de stock.</p>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, accent = "or" }: { label: string; value: string; accent?: "or" | "success" | "danger" }) {
  const colors = {
    or: "text-blanc-creme",
    success: "text-success",
    danger: "text-danger",
  };
  return (
    <div className="rounded-lg border border-gris-dark/30 bg-noir-2 p-4">
      <p className="font-mono text-[10px] uppercase tracking-widest text-gris">{label}</p>
      <p className={`mt-1 font-display text-xl ${colors[accent]}`}>{value}</p>
    </div>
  );
}

function formatFCFA(amount: number): string {
  return new Intl.NumberFormat("fr-FR").format(Math.round(amount)) + " FCFA";
}
