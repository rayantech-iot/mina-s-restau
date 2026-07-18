"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { Plus, Pencil, Trash2, GripVertical } from "lucide-react";

interface Plat {
  id: string;
  nom: string;
  image_url: string;
  categorie_id: string;
  prix: number | null;
  afficher_prix: boolean;
  statut: string;
  mis_en_avant: boolean;
  ordre: number;
}

export default function AdminPlatsPage() {
  const [plats, setPlats] = useState<Plat[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    loadPlats();
  }, []);

  const loadPlats = async () => {
    const { data } = await supabase
      .from("plats")
      .select("*")
      .order("ordre", { ascending: true });
    setPlats(data || []);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce plat ?")) return;
    await supabase.from("plats").delete().eq("id", id);
    setPlats(plats.filter((p) => p.id !== id));
  };

  const toggleAvant = async (id: string, current: boolean) => {
    await supabase.from("plats").update({ mis_en_avant: !current }).eq("id", id);
    setPlats(
      plats.map((p) => (p.id === id ? { ...p, mis_en_avant: !current } : p))
    );
  };

  const statutColor = (s: string) => {
    switch (s) {
      case "disponible":
        return "bg-success/10 text-success";
      case "sur_commande":
        return "bg-dore/10 text-marine";
      case "rupture":
        return "bg-error/10 text-error";
      default:
        return "bg-border text-texte-light";
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl font-bold text-marine">Plats</h1>
        <Link
          href="/admin/plats/new"
          className="inline-flex items-center gap-2 rounded-full bg-marine px-5 py-2.5 text-sm font-semibold text-creme transition-all hover:bg-marine-light"
        >
          <Plus size={18} />
          Ajouter
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-12 text-texte-light">Chargement...</div>
      ) : plats.length === 0 ? (
        <div className="text-center py-12 rounded-2xl bg-blanc shadow-sm">
          <p className="text-texte-light mb-4">Aucun plat pour le moment</p>
          <Link
            href="/admin/plats/new"
            className="inline-flex items-center gap-2 rounded-full bg-marine px-5 py-2.5 text-sm font-semibold text-creme"
          >
            <Plus size={18} />
            Ajouter un plat
          </Link>
        </div>
      ) : (
        <div className="rounded-2xl bg-blanc shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-creme border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-texte-light w-10"></th>
                  <th className="px-4 py-3 text-left font-medium text-texte-light">
                    Photo
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-texte-light">
                    Nom
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-texte-light">
                    Prix
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-texte-light">
                    Statut
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-texte-light">
                    À la une
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-texte-light">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light">
                {plats.map((plat) => (
                  <tr key={plat.id} className="hover:bg-creme/50 transition-colors">
                    <td className="px-4 py-3">
                      <GripVertical size={16} className="text-texte-lighter" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-border-light">
                        {plat.image_url ? (
                          <Image
                            src={plat.image_url}
                            alt={plat.nom}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-xs text-texte-lighter">
                            —
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-texte">
                      {plat.nom}
                    </td>
                    <td className="px-4 py-3 text-texte-light">
                      {plat.afficher_prix && plat.prix
                        ? `${plat.prix.toFixed(2)} €`
                        : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${statutColor(
                          plat.statut
                        )}`}
                      >
                        {plat.statut === "disponible"
                          ? "Disponible"
                          : plat.statut === "sur_commande"
                          ? "Sur commande"
                          : "Rupture"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleAvant(plat.id, plat.mis_en_avant)}
                        className={`h-5 w-9 rounded-full transition-colors ${
                          plat.mis_en_avant ? "bg-dore" : "bg-border"
                        }`}
                      >
                        <span
                          className={`block h-4 w-4 rounded-full bg-blanc shadow transition-transform ${
                            plat.mis_en_avant ? "translate-x-4" : "translate-x-0.5"
                          }`}
                        />
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/plats/${plat.id}`}
                          className="rounded-lg p-2 text-texte-light hover:bg-marine/10 hover:text-marine transition-colors"
                        >
                          <Pencil size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(plat.id)}
                          className="rounded-lg p-2 text-texte-light hover:bg-error/10 hover:text-error transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
