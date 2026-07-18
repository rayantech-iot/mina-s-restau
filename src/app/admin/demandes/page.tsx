"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { MessageSquare, ChevronDown } from "lucide-react";

interface Demande {
  id: string;
  nom: string;
  telephone: string;
  email: string;
  type_occasion?: string;
  date_souhaitee?: string;
  nb_convives?: number;
  lieu?: string;
  preferences?: string;
  allergies?: string;
  message: string;
  statut: string;
  created_at: string;
  table: "demandes_devis" | "messages_contact";
}

const statuts = [
  { value: "nouveau", label: "Nouveau", color: "bg-dore/20 text-marine" },
  { value: "en_discussion", label: "En discussion", color: "bg-blue-100 text-blue-700" },
  { value: "confirme", label: "Confirmé", color: "bg-success/10 text-success" },
  { value: "refuse", label: "Refusé", color: "bg-error/10 text-error" },
  { value: "termine", label: "Terminé", color: "bg-border text-texte-light" },
];

export default function AdminDemandesPage() {
  const [demandes, setDemandes] = useState<Demande[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter, setFilter] = useState("tous");
  const supabase = createClient();

  useEffect(() => {
    loadDemandes();
  }, []);

  const loadDemandes = async () => {
    const [devisRes, contactRes] = await Promise.all([
      supabase
        .from("demandes_devis")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase
        .from("messages_contact")
        .select("*")
        .order("created_at", { ascending: false }),
    ]);

    const all: Demande[] = [
      ...(devisRes.data || []).map((d) => ({ ...d, table: "demandes_devis" as const })),
      ...(contactRes.data || []).map((d) => ({
        id: d.id,
        nom: d.nom,
        telephone: d.telephone || "",
        email: d.email || "",
        message: d.message,
        statut: d.statut,
        created_at: d.created_at,
        table: "messages_contact" as const,
      })),
    ];

    all.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    setDemandes(all);
    setLoading(false);
  };

  const updateStatut = async (d: Demande, newStatut: string) => {
    const table = d.table;
    await supabase.from(table).update({ statut: newStatut }).eq("id", d.id);
    setDemandes(
      demandes.map((item) =>
        item.id === d.id && item.table === table
          ? { ...item, statut: newStatut }
          : item
      )
    );
  };

  const filtered =
    filter === "tous"
      ? demandes
      : demandes.filter((d) => d.statut === filter);

  const statutBadge = (s: string) => {
    return statuts.find((st) => st.value === s)?.color || "bg-border text-texte-light";
  };

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold text-marine mb-8">
        Demandes reçues
      </h1>

      {/* Filtres */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setFilter("tous")}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
            filter === "tous"
              ? "bg-marine text-creme"
              : "bg-blanc text-texte-light border border-border hover:border-marine hover:text-marine"
          }`}
        >
          Tous ({demandes.length})
        </button>
        {statuts.map((s) => {
          const count = demandes.filter((d) => d.statut === s.value).length;
          if (count === 0) return null;
          return (
            <button
              key={s.value}
              onClick={() => setFilter(s.value)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                filter === s.value
                  ? "bg-marine text-creme"
                  : "bg-blanc text-texte-light border border-border hover:border-marine hover:text-marine"
              }`}
            >
              {s.label} ({count})
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="text-center py-12 text-texte-light">Chargement...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 rounded-2xl bg-blanc shadow-sm">
          <MessageSquare size={40} className="mx-auto text-texte-lighter mb-3" />
          <p className="text-texte-light">Aucune demande pour le moment</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((d) => (
            <div
              key={`${d.table}-${d.id}`}
              className="rounded-2xl bg-blanc shadow-sm overflow-hidden"
            >
              <button
                onClick={() =>
                  setExpanded(expanded === d.id ? null : d.id)
                }
                className="w-full flex items-center gap-4 p-4 text-left hover:bg-creme/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-texte">{d.nom}</span>
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${statutBadge(
                        d.statut
                      )}`}
                    >
                      {statuts.find((s) => s.value === d.statut)?.label || d.statut}
                    </span>
                    {d.table === "demandes_devis" && (
                      <span className="text-xs text-dore font-medium bg-dore/10 rounded-full px-2 py-0.5">
                        Devis
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-texte-light truncate mt-0.5">
                    {d.message || "Pas de message"}
                  </p>
                  <p className="text-xs text-texte-lighter mt-1">
                    {new Date(d.created_at).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <ChevronDown
                  size={18}
                  className={`text-texte-lighter transition-transform ${
                    expanded === d.id ? "rotate-180" : ""
                  }`}
                />
              </button>

              {expanded === d.id && (
                <div className="border-t border-border-light p-4 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-texte-lighter">Téléphone:</span>{" "}
                      <span className="text-texte">
                        {d.telephone || "—"}
                      </span>
                    </div>
                    <div>
                      <span className="text-texte-lighter">Email:</span>{" "}
                      <span className="text-texte">{d.email || "—"}</span>
                    </div>
                    {d.type_occasion && (
                      <div>
                        <span className="text-texte-lighter">Occasion:</span>{" "}
                        <span className="text-texte">{d.type_occasion}</span>
                      </div>
                    )}
                    {d.date_souhaitee && (
                      <div>
                        <span className="text-texte-lighter">Date:</span>{" "}
                        <span className="text-texte">{d.date_souhaitee}</span>
                      </div>
                    )}
                    {d.nb_convives && (
                      <div>
                        <span className="text-texte-lighter">Convives:</span>{" "}
                        <span className="text-texte">{d.nb_convives}</span>
                      </div>
                    )}
                    {d.lieu && (
                      <div>
                        <span className="text-texte-lighter">Lieu:</span>{" "}
                        <span className="text-texte">{d.lieu}</span>
                      </div>
                    )}
                  </div>

                  {d.preferences && (
                    <div className="text-sm">
                      <span className="text-texte-lighter">Préférences:</span>{" "}
                      <span className="text-texte">{d.preferences}</span>
                    </div>
                  )}
                  {d.allergies && (
                    <div className="text-sm">
                      <span className="text-texte-lighter">Allergies:</span>{" "}
                      <span className="text-texte">{d.allergies}</span>
                    </div>
                  )}
                  {d.message && (
                    <div className="rounded-lg bg-creme p-3 text-sm text-texte">
                      {d.message}
                    </div>
                  )}

                  <div className="flex gap-2 flex-wrap pt-2">
                    {statuts.map((s) => (
                      <button
                        key={s.value}
                        onClick={() => updateStatut(d, s.value)}
                        className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                          d.statut === s.value
                            ? "bg-marine text-creme"
                            : "bg-creme text-texte-light hover:bg-marine/10 hover:text-marine"
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
