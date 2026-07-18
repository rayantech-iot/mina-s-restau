"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

interface Disponibilite {
  id?: string;
  date: string;
  statut_ouverture: string;
  broche_disponible: boolean;
  reserve_evenement: boolean;
  note: string | null;
}

const MONTHS_FR = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];

const DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

export default function AdminCalendrierPage() {
  const supabase = createClient();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [dispos, setDispos] = useState<Record<string, Disponibilite>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [editData, setEditData] = useState<Disponibilite>({
    date: "",
    statut_ouverture: "ouvert",
    broche_disponible: false,
    reserve_evenement: false,
    note: null,
  });

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  useEffect(() => {
    loadDispos();
  }, [year, month]);

  const loadDispos = async () => {
    const startDate = `${year}-${String(month + 1).padStart(2, "0")}-01`;
    const endMonth = month === 11 ? 1 : month + 2;
    const endYear = month === 11 ? year + 1 : year;
    const endDate = `${endYear}-${String(endMonth).padStart(2, "0")}-01`;

    const { data } = await supabase
      .from("disponibilites")
      .select("*")
      .gte("date", startDate)
      .lt("date", endDate);

    const map: Record<string, Disponibilite> = {};
    data?.forEach((d) => {
      map[d.date] = d;
    });
    setDispos(map);
  };

  const getDaysInMonth = () => {
    const firstDay = new Date(year, month, 1).getDay();
    const adjustedStart = firstDay === 0 ? 6 : firstDay - 1;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { adjustedStart, daysInMonth };
  };

  const { adjustedStart, daysInMonth } = getDaysInMonth();

  const openEditor = (dateStr: string) => {
    setSelected(dateStr);
    const existing = dispos[dateStr];
    setEditData(
      existing || {
        date: dateStr,
        statut_ouverture: "ouvert",
        broche_disponible: false,
        reserve_evenement: false,
        note: null,
      }
    );
  };

  const saveDay = async () => {
    if (!selected) return;
    const existing = dispos[selected];

    if (existing?.id) {
      await supabase
        .from("disponibilites")
        .update(editData)
        .eq("id", existing.id);
    } else {
      await supabase.from("disponibilites").insert(editData);
    }

    await loadDispos();
    setSelected(null);
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold text-marine mb-8">
        Calendrier
      </h1>

      <div className="rounded-2xl bg-blanc p-6 shadow-sm">
        {/* Navigation mois */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() =>
              setCurrentMonth(new Date(year, month - 1, 1))
            }
            className="rounded-lg p-2 text-texte-light hover:bg-marine/10 hover:text-marine transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <h2 className="font-serif text-xl font-bold text-marine">
            {MONTHS_FR[month]} {year}
          </h2>
          <button
            onClick={() =>
              setCurrentMonth(new Date(year, month + 1, 1))
            }
            className="rounded-lg p-2 text-texte-light hover:bg-marine/10 hover:text-marine transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Grille */}
        <div className="grid grid-cols-7 gap-1">
          {DAYS.map((day) => (
            <div
              key={day}
              className="text-center text-xs font-medium text-texte-lighter py-2"
            >
              {day}
            </div>
          ))}

          {Array.from({ length: adjustedStart }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const d = dispos[dateStr];
            const isToday = dateStr === today;
            const isSelected = dateStr === selected;

            return (
              <button
                key={day}
                onClick={() => openEditor(dateStr)}
                className={`relative rounded-lg p-2 min-h-[60px] text-left text-xs transition-all ${
                  isSelected
                    ? "ring-2 ring-marine bg-marine/5"
                    : "hover:bg-creme"
                } ${isToday ? "ring-1 ring-dore" : ""}`}
              >
                <span
                  className={`font-medium ${
                    d?.statut_ouverture === "ferme"
                      ? "text-error"
                      : "text-texte"
                  }`}
                >
                  {day}
                </span>
                {d && (
                  <div className="mt-1 space-y-0.5">
                    {d.broche_disponible && (
                      <div className="h-1.5 w-1.5 rounded-full bg-dore" />
                    )}
                    {d.reserve_evenement && (
                      <div className="h-1.5 w-1.5 rounded-full bg-marine" />
                    )}
                    {d.note && (
                      <div className="text-[10px] text-texte-lighter truncate">
                        {d.note}
                      </div>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Légende */}
        <div className="mt-4 flex flex-wrap gap-4 text-xs text-texte-lighter">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-success" />
            Ouvert
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-error" />
            Fermé
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-dore" />
            Broche disponible
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-marine" />
            Réservé événement
          </div>
        </div>
      </div>

      {/* Éditeur jour */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-blanc p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif text-lg font-bold text-marine">
                {new Date(selected + "T12:00:00").toLocaleDateString("fr-FR", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </h3>
              <button
                onClick={() => setSelected(null)}
                className="rounded-lg p-1 text-texte-lighter hover:text-texte"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-texte mb-2">
                  Statut d&apos;ouverture
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setEditData({ ...editData, statut_ouverture: "ouvert" })
                    }
                    className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${
                      editData.statut_ouverture === "ouvert"
                        ? "bg-success text-blanc"
                        : "bg-creme text-texte-light border border-border"
                    }`}
                  >
                    Ouvert
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setEditData({ ...editData, statut_ouverture: "ferme" })
                    }
                    className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${
                      editData.statut_ouverture === "ferme"
                        ? "bg-error text-blanc"
                        : "bg-creme text-texte-light border border-border"
                    }`}
                  >
                    Fermé
                  </button>
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <button
                  type="button"
                  onClick={() =>
                    setEditData({
                      ...editData,
                      broche_disponible: !editData.broche_disponible,
                    })
                  }
                  className={`h-5 w-9 rounded-full transition-colors ${
                    editData.broche_disponible ? "bg-dore" : "bg-border"
                  }`}
                >
                  <span
                    className={`block h-4 w-4 rounded-full bg-blanc shadow transition-transform ${
                      editData.broche_disponible
                        ? "translate-x-4"
                        : "translate-x-0.5"
                    }`}
                  />
                </button>
                <span className="text-sm text-texte">Broche disponible</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <button
                  type="button"
                  onClick={() =>
                    setEditData({
                      ...editData,
                      reserve_evenement: !editData.reserve_evenement,
                    })
                  }
                  className={`h-5 w-9 rounded-full transition-colors ${
                    editData.reserve_evenement ? "bg-marine" : "bg-border"
                  }`}
                >
                  <span
                    className={`block h-4 w-4 rounded-full bg-blanc shadow transition-transform ${
                      editData.reserve_evenement
                        ? "translate-x-4"
                        : "translate-x-0.5"
                    }`}
                  />
                </button>
                <span className="text-sm text-texte">
                  Réservé pour un événement
                </span>
              </label>

              <div>
                <label className="block text-sm font-medium text-texte mb-1">
                  Note libre
                </label>
                <input
                  type="text"
                  value={editData.note || ""}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      note: e.target.value || null,
                    })
                  }
                  placeholder="Ex: Plat du jour : civet de sanglier"
                  className="w-full rounded-lg border border-border bg-creme px-4 py-3 text-sm text-texte focus:border-marine focus:ring-2 focus:ring-marine/20 outline-none transition-all"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={saveDay}
                className="flex-1 rounded-full bg-marine py-3 text-sm font-semibold text-creme transition-all hover:bg-marine-light"
              >
                Enregistrer
              </button>
              <button
                onClick={() => setSelected(null)}
                className="rounded-full border border-border px-6 py-3 text-sm font-medium text-texte-light transition-all hover:border-marine hover:text-marine"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
