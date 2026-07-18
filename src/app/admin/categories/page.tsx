"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, Pencil, Trash2, GripVertical } from "lucide-react";

interface Categorie {
  id: string;
  nom: string;
  image_url: string | null;
  description: string | null;
  ordre: number;
}

const defaultCategories = [
  "Poulets rôtis à la broche",
  "Plats du jour",
  "Accompagnements",
  "Entrées",
  "Desserts maison",
  "Menus spéciaux",
];

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const supabase = createClient();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const { data } = await supabase
      .from("categories")
      .select("*")
      .order("ordre", { ascending: true });
    setCategories(data || []);
    setLoading(false);
  };

  const handleAdd = async () => {
    if (!newName.trim()) return;
    const maxOrdre = categories.reduce((max, c) => Math.max(max, c.ordre), 0);
    const { data, error } = await supabase
      .from("categories")
      .insert({ nom: newName.trim(), ordre: maxOrdre + 1 })
      .select()
      .single();
    if (!error && data) {
      setCategories([...categories, data]);
      setNewName("");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette catégorie ?")) return;
    await supabase.from("categories").delete().eq("id", id);
    setCategories(categories.filter((c) => c.id !== id));
  };

  const initDefaults = async () => {
    const maxOrdre = categories.reduce((max, c) => Math.max(max, c.ordre), 0);
    const existing = categories.map((c) => c.nom);
    const toInsert = defaultCategories
      .filter((n) => !existing.includes(n))
      .map((nom, i) => ({ nom, ordre: maxOrdre + i + 1 }));

    if (toInsert.length === 0) return;

    const { data } = await supabase
      .from("categories")
      .insert(toInsert)
      .select();
    if (data) setCategories([...categories, ...data]);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl font-bold text-marine">
          Catégories
        </h1>
        <button
          onClick={initDefaults}
          className="rounded-full border border-border px-4 py-2 text-sm font-medium text-texte-light hover:border-marine hover:text-marine transition-all"
        >
          + Créer les catégories par défaut
        </button>
      </div>

      {/* Ajout rapide */}
      <div className="mb-6 flex gap-3">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder="Nouvelle catégorie..."
          className="flex-1 rounded-lg border border-border bg-blanc px-4 py-3 text-sm text-texte focus:border-marine focus:ring-2 focus:ring-marine/20 outline-none transition-all"
        />
        <button
          onClick={handleAdd}
          disabled={!newName.trim()}
          className="inline-flex items-center gap-2 rounded-full bg-marine px-5 py-3 text-sm font-semibold text-creme transition-all hover:bg-marine-light disabled:opacity-50"
        >
          <Plus size={18} />
          Ajouter
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-texte-light">Chargement...</div>
      ) : categories.length === 0 ? (
        <div className="text-center py-12 rounded-2xl bg-blanc shadow-sm">
          <p className="text-texte-light">
            Aucune catégorie. Cliquez sur &quot;Créer les catégories par
            défaut&quot; pour commencer.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl bg-blanc shadow-sm overflow-hidden">
          <ul className="divide-y divide-border-light">
            {categories.map((cat) => (
              <li
                key={cat.id}
                className="flex items-center gap-4 px-4 py-3 hover:bg-creme/50 transition-colors"
              >
                <GripVertical size={16} className="text-texte-lighter" />
                {editing === cat.id ? (
                  <input
                    autoFocus
                    defaultValue={cat.nom}
                    onBlur={(e) => {
                      supabase
                        .from("categories")
                        .update({ nom: e.target.value })
                        .eq("id", cat.id);
                      setCategories(
                        categories.map((c) =>
                          c.id === cat.id ? { ...c, nom: e.target.value } : c
                        )
                      );
                      setEditing(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter")
                        (e.target as HTMLInputElement).blur();
                    }}
                    className="flex-1 rounded border border-marine bg-blanc px-3 py-1 text-sm outline-none"
                  />
                ) : (
                  <span className="flex-1 text-sm font-medium text-texte">
                    {cat.nom}
                  </span>
                )}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEditing(cat.id)}
                    className="rounded-lg p-2 text-texte-light hover:bg-marine/10 hover:text-marine transition-colors"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="rounded-lg p-2 text-texte-light hover:bg-error/10 hover:text-error transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
