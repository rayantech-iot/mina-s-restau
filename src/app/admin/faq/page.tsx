"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, Pencil, Trash2, GripVertical, ChevronDown, ChevronUp } from "lucide-react";

interface FAQItem {
  id: string;
  question: string;
  reponse: string;
  ordre: number;
}

export default function AdminFAQPage() {
  const [items, setItems] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newQ, setNewQ] = useState("");
  const [newR, setNewR] = useState("");
  const supabase = createClient();

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    const { data } = await supabase
      .from("faq")
      .select("*")
      .order("ordre", { ascending: true });
    setItems(data || []);
    setLoading(false);
  };

  const handleAdd = async () => {
    if (!newQ.trim() || !newR.trim()) return;
    const maxOrdre = items.reduce((max, i) => Math.max(max, i.ordre), 0);
    const { data, error } = await supabase
      .from("faq")
      .insert({ question: newQ.trim(), reponse: newR.trim(), ordre: maxOrdre + 1 })
      .select()
      .single();
    if (!error && data) {
      setItems([...items, data]);
      setNewQ("");
      setNewR("");
      setShowAdd(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette question ?")) return;
    await supabase.from("faq").delete().eq("id", id);
    setItems(items.filter((i) => i.id !== id));
  };

  const moveUp = async (index: number) => {
    if (index === 0) return;
    const newItems = [...items];
    [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
    newItems.forEach((item, i) => (item.ordre = i + 1));
    setItems(newItems);
    await supabase.from("faq").upsert(
      newItems.map((item) => ({
        id: item.id,
        ordre: item.ordre,
        question: item.question,
        reponse: item.reponse,
      }))
    );
  };

  const moveDown = async (index: number) => {
    if (index === items.length - 1) return;
    const newItems = [...items];
    [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
    newItems.forEach((item, i) => (item.ordre = i + 1));
    setItems(newItems);
    await supabase.from("faq").upsert(
      newItems.map((item) => ({
        id: item.id,
        ordre: item.ordre,
        question: item.question,
        reponse: item.reponse,
      }))
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl font-bold text-marine">FAQ</h1>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="inline-flex items-center gap-2 rounded-full bg-marine px-5 py-2.5 text-sm font-semibold text-creme transition-all hover:bg-marine-light"
        >
          <Plus size={18} />
          Ajouter
        </button>
      </div>

      {showAdd && (
        <div className="mb-6 rounded-2xl bg-blanc p-5 shadow-sm space-y-4">
          <div>
            <label className="block text-sm font-medium text-texte mb-1">
              Question
            </label>
            <input
              type="text"
              value={newQ}
              onChange={(e) => setNewQ(e.target.value)}
              className="w-full rounded-lg border border-border bg-creme px-4 py-3 text-sm text-texte focus:border-marine focus:ring-2 focus:ring-marine/20 outline-none transition-all"
              placeholder="Ex: Peut-on commander à l'avance ?"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-texte mb-1">
              Réponse
            </label>
            <textarea
              rows={3}
              value={newR}
              onChange={(e) => setNewR(e.target.value)}
              className="w-full rounded-lg border border-border bg-creme px-4 py-3 text-sm text-texte focus:border-marine focus:ring-2 focus:ring-marine/20 outline-none transition-all resize-none"
              placeholder="Réponse..."
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              disabled={!newQ.trim() || !newR.trim()}
              className="rounded-full bg-marine px-5 py-2 text-sm font-semibold text-creme transition-all hover:bg-marine-light disabled:opacity-50"
            >
              Enregistrer
            </button>
            <button
              onClick={() => setShowAdd(false)}
              className="rounded-full border border-border px-5 py-2 text-sm font-medium text-texte-light hover:border-marine hover:text-marine transition-all"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-texte-light">Chargement...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 rounded-2xl bg-blanc shadow-sm">
          <p className="text-texte-light">Aucune question pour le moment</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="rounded-2xl bg-blanc shadow-sm overflow-hidden"
            >
              <div className="flex items-center gap-3 p-4">
                <div className="flex flex-col gap-0.5">
                  <button
                    onClick={() => moveUp(index)}
                    disabled={index === 0}
                    className="text-texte-lighter hover:text-marine disabled:opacity-30 transition-colors"
                  >
                    <ChevronUp size={14} />
                  </button>
                  <button
                    onClick={() => moveDown(index)}
                    disabled={index === items.length - 1}
                    className="text-texte-lighter hover:text-marine disabled:opacity-30 transition-colors"
                  >
                    <ChevronDown size={14} />
                  </button>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-texte text-sm">
                    {item.question}
                  </p>
                  <p className="text-xs text-texte-lighter mt-0.5 truncate">
                    {item.reponse}
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() =>
                      setEditing(editing === item.id ? null : item.id)
                    }
                    className="rounded-lg p-2 text-texte-light hover:bg-marine/10 hover:text-marine transition-colors"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="rounded-lg p-2 text-texte-light hover:bg-error/10 hover:text-error transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {editing === item.id && (
                <EditFAQ
                  item={item}
                  onSave={(q, r) => {
                    supabase
                      .from("faq")
                      .update({ question: q, reponse: r })
                      .eq("id", item.id);
                    setItems(
                      items.map((i) =>
                        i.id === item.id
                          ? { ...i, question: q, reponse: r }
                          : i
                      )
                    );
                    setEditing(null);
                  }}
                  onCancel={() => setEditing(null)}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function EditFAQ({
  item,
  onSave,
  onCancel,
}: {
  item: FAQItem;
  onSave: (q: string, r: string) => void;
  onCancel: () => void;
}) {
  const [q, setQ] = useState(item.question);
  const [r, setR] = useState(item.reponse);

  return (
    <div className="border-t border-border-light p-4 space-y-3 bg-creme/50">
      <input
        type="text"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="w-full rounded-lg border border-border bg-blanc px-4 py-2 text-sm text-texte focus:border-marine outline-none"
      />
      <textarea
        rows={3}
        value={r}
        onChange={(e) => setR(e.target.value)}
        className="w-full rounded-lg border border-border bg-blanc px-4 py-2 text-sm text-texte focus:border-marine outline-none resize-none"
      />
      <div className="flex gap-2">
        <button
          onClick={() => onSave(q, r)}
          className="rounded-full bg-marine px-4 py-1.5 text-xs font-semibold text-creme hover:bg-marine-light transition-all"
        >
          Sauvegarder
        </button>
        <button
          onClick={onCancel}
          className="rounded-full border border-border px-4 py-1.5 text-xs font-medium text-texte-light hover:border-marine hover:text-marine transition-all"
        >
          Annuler
        </button>
      </div>
    </div>
  );
}
