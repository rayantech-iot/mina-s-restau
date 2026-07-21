"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ChevronLeft, ChevronRight, X, CheckSquare, Square } from "lucide-react";

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
  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());
  const [bulkEdit, setBulkEdit] = useState(false);
  const [bulkData, setBulkData] = useState({
    statut_ouverture: "ouvert",
    broche_disponible: false,
    reserve_evenement: false,
    note: "",
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
  const today = new Date().toISOString().split("T")[0];

  const toggleDate = (dateStr: string) => {
    setSelectedDates((prev) => {
      const next = new Set(prev);
      if (next.has(dateStr)) {
        next.delete(dateStr);
      } else {
        next.add(dateStr);
      }
      return next;
    });
  };

  const selectAllDays = () => {
    const all: string[] = [];
    for (let i = 1; i <= daysInMonth; i++) {
      all.push(`${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`);
    }
    setSelectedDates(new Set(all));
  };

  const clearSelection = () => {
    setSelectedDates(new Set());
    setBulkEdit(false);
  };

  const applyBulk = async () => {
    if (selectedDates.size === 0) return;

    for (const dateStr of selectedDates) {
      const existing = dispos[dateStr];
      const payload = {
        date: dateStr,
        statut_ouverture: bulkData.statut_ouverture,
        broche_disponible: bulkData.broche_disponible,
        reserve_evenement: bulkData.reserve_evenement,
        note: bulkData.note || null,
      };

      if (existing?.id) {
        await supabase.from("disponibilites").update(payload).eq("id", existing.id);
      } else {
        await supabase.from("disponibilites").insert(payload);
      }
    }
    await loadDispos();
    clearSelection();
  };

  const handleDayClick = (dateStr: string) => {
    if (selectedDates.size > 0) {
      toggleDate(dateStr);
    } else {
      toggleDate(dateStr);
    }
  };

  const handleDayDoubleClick = (dateStr: string) => {
    setSelectedDates(new Set([dateStr]));
    setBulkEdit(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl font-bold text-marine">Calendrier</h1>
        {selectedDates.size > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-texte-light">{selectedDates.size} jour{selectedDates.size > 1 ? "s" : ""} sélectionné{selectedDates.size > 1 ? "s" : ""}</span>
            <button
              onClick={() => setBulkEdit(!bulkEdit)}
              className="inline-flex items-center gap-2 rounded-full bg-marine px-4 py-2 text-sm font-semibold text-creme transition-all hover:bg-marine-light"
            >
              Modifier
            </button>
            <button
              onClick={clearSelection}
              className="rounded-full border border-border px-3 py-2 text-sm text-texte-light hover:border-marine hover:text-marine transition-all"
            >
              Annuler
            </button>
          </div>
        )}
      </div>

      {selectedDates.size === 0 && (
        <p className="text-sm text-texte-light mb-6">
          Appuyez sur un jour pour le sélectionner. Double-cliquez pour modifier directement.
        </p>
      )}

      <div className="rounded-2xl bg-blanc p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setCurrentMonth(new Date(year, month - 1, 1))}
            className="rounded-lg p-2 text-texte-light hover:bg-marine/10 hover:text-marine transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-3">
            <h2 className="font-serif text-xl font-bold text-marine">
              {MONTHS_FR[month]} {year}
            </h2>
            <button
              onClick={selectAllDays}
              className="text-xs text-marine hover:text-dore transition-colors underline"
            >
              Tout sélectionner
            </button>
          </div>
          <button
            onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}
            className="rounded-lg p-2 text-texte-light hover:bg-marine/10 hover:text-marine transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {DAYS.map((day) => (
            <div key={day} className="text-center text-xs font-medium text-texte-lighter py-2">
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
            const isSelected = selectedDates.has(dateStr);

            return (
              <button
                key={day}
                onClick={() => handleDayClick(dateStr)}
                onDoubleClick={() => handleDayDoubleClick(dateStr)}
                className={`relative rounded-lg p-2 min-h-[60px] text-left text-xs transition-all ${
                  isSelected
                    ? "ring-2 ring-marine bg-marine/10"
                    : "hover:bg-creme"
                } ${isToday ? "ring-1 ring-dore" : ""}`}
              >
                <span
                  className={`font-medium ${
                    d?.statut_ouverture === "ferme" ? "text-error" : "text-texte"
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

      {/* Bulk editor */}
      {bulkEdit && selectedDates.size > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-blanc p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif text-lg font-bold text-marine">
                Modifier {selectedDates.size} jour{selectedDates.size > 1 ? "s" : ""}
              </h3>
              <button
                onClick={() => setBulkEdit(false)}
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
                    onClick={() => setBulkData({ ...bulkData, statut_ouverture: "ouvert" })}
                    className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${
                      bulkData.statut_ouverture === "ouvert"
                        ? "bg-success text-blanc"
                        : "bg-creme text-texte-light border border-border"
                    }`}
                  >
                    Ouvert
                  </button>
                  <button
                    type="button"
                    onClick={() => setBulkData({ ...bulkData, statut_ouverture: "ferme" })}
                    className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${
                      bulkData.statut_ouverture === "ferme"
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
                  onClick={() => setBulkData({ ...bulkData, broche_disponible: !bulkData.broche_disponible })}
                  className={`h-5 w-9 rounded-full transition-colors ${
                    bulkData.broche_disponible ? "bg-dore" : "bg-border"
                  }`}
                >
                  <span
                    className={`block h-4 w-4 rounded-full bg-blanc shadow transition-transform ${
                      bulkData.broche_disponible ? "translate-x-4" : "translate-x-0.5"
                    }`}
                  />
                </button>
                <span className="text-sm text-texte">Broche disponible</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <button
                  type="button"
                  onClick={() => setBulkData({ ...bulkData, reserve_evenement: !bulkData.reserve_evenement })}
                  className={`h-5 w-9 rounded-full transition-colors ${
                    bulkData.reserve_evenement ? "bg-marine" : "bg-border"
                  }`}
                >
                  <span
                    className={`block h-4 w-4 rounded-full bg-blanc shadow transition-transform ${
                      bulkData.reserve_evenement ? "translate-x-4" : "translate-x-0.5"
                    }`}
                  />
                </button>
                <span className="text-sm text-texte">Réservé pour un événement</span>
              </label>

              <div>
                <label className="block text-sm font-medium text-texte mb-1">
                  Note libre
                </label>
                <input
                  type="text"
                  value={bulkData.note}
                  onChange={(e) => setBulkData({ ...bulkData, note: e.target.value })}
                  placeholder="Ex: Fermé pour rénovation"
                  className="w-full rounded-lg border border-border bg-creme px-4 py-3 text-sm text-texte focus:border-marine focus:ring-2 focus:ring-marine/20 outline-none transition-all"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={applyBulk}
                className="flex-1 rounded-full bg-marine py-3 text-sm font-semibold text-creme transition-all hover:bg-marine-light"
              >
                Appliquer à {selectedDates.size} jour{selectedDates.size > 1 ? "s" : ""}
              </button>
              <button
                onClick={() => setBulkEdit(false)}
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
