"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { CalendarDays, Clock, Drumstick, PartyPopper, XOctagon } from "lucide-react";

interface Disponibilite {
  date: string;
  statut_ouverture: string;
  broche_disponible: boolean;
  reserve_evenement: boolean;
  note: string | null;
}

const DAY_NAMES = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return `${DAY_NAMES[d.getDay()]} ${d.getDate()}`;
}

export default function DisponibiliteBanner() {
  const supabase = createClient();
  const [today, setToday] = useState<Disponibilite | null>(null);
  const [upcoming, setUpcoming] = useState<Disponibilite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const todayStr = new Date().toISOString().split("T")[0];
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);
    const endStr = endDate.toISOString().split("T")[0];

    supabase
      .from("disponibilites")
      .select("*")
      .gte("date", todayStr)
      .lte("date", endStr)
      .order("date", { ascending: true })
      .then(({ data }) => {
        if (data) {
          const todayEntry = data.find((d) => d.date === todayStr);
          setToday(todayEntry || null);
          setUpcoming(data.filter((d) => d.date !== todayStr));
        }
        setLoading(false);
      });
  }, []);

  if (loading) return null;

  const isOuvert = today?.statut_ouverture === "ouvert";

  return (
    <div className="rounded-2xl bg-blanc border border-border p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <CalendarDays size={16} className="text-marine" />
        <h3 className="font-serif text-sm font-bold text-marine">Disponibilite du jour</h3>
      </div>

      {today ? (
        <div className="space-y-2">
          <div className={`flex items-center gap-2 text-sm font-medium ${isOuvert ? "text-success" : "text-error"}`}>
            {isOuvert ? <Clock size={14} /> : <XOctagon size={14} />}
            {isOuvert ? "Ouvert aujourd'hui" : "Ferme aujourd'hui"}
          </div>

          {today.broche_disponible && (
            <div className="flex items-center gap-2 text-sm text-dore font-medium">
              <Drumstick size={14} />
              Poulet a la broche disponible
            </div>
          )}

          {today.reserve_evenement && (
            <div className="flex items-center gap-2 text-sm text-marine font-medium">
              <PartyPopper size={14} />
              Reserve pour un evenement
            </div>
          )}

          {today.note && (
            <p className="text-xs text-texte-light italic">{today.note}</p>
          )}
        </div>
      ) : (
        <p className="text-sm text-texte-light">Pas d&apos;information pour aujourd&apos;hui.</p>
      )}

      {upcoming.length > 0 && (
        <div className="mt-3 pt-3 border-t border-border">
          <p className="text-xs text-texte-lighter mb-2">Prochains jours :</p>
          <div className="flex flex-wrap gap-1.5">
            {upcoming.map((d) => (
              <span
                key={d.date}
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                  d.statut_ouverture === "ouvert"
                    ? "bg-success/10 text-success"
                    : "bg-error/10 text-error"
                }`}
              >
                {formatDate(d.date)}
                {d.broche_disponible && <Drumstick size={10} className="text-dore" />}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
