"use client";

import { useState, useEffect } from "react";
import SectionTitle from "@/components/SectionTitle";
import FadeIn from "@/components/FadeIn";
import { MapPin, Clock, Phone } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const defaultHoraires: Record<string, { ouverture: string; fermeture: string } | null> = {
  lundi: { ouverture: "11:30", fermeture: "14:00" },
  mardi: { ouverture: "11:30", fermeture: "14:00" },
  mercredi: null,
  jeudi: { ouverture: "11:30", fermeture: "14:00" },
  vendredi: { ouverture: "11:30", fermeture: "14:00" },
  samedi: { ouverture: "11:30", fermeture: "14:00" },
  dimanche: null,
};

const jourLabels: Record<string, string> = {
  lundi: "Lundi",
  mardi: "Mardi",
  mercredi: "Mercredi",
  jeudi: "Jeudi",
  vendredi: "Vendredi",
  samedi: "Samedi",
  dimanche: "Dimanche",
};

export default function InfosPratiquesPage() {
  const [telephone, setTelephone] = useState("");
  const [horaires, setHoraires] = useState(defaultHoraires);
  const [adresse, setAdresse] = useState("Route de Cirendino\n20144 Sainte-Lucie de Porto-Vecchio");
  const [googleMapsUrl, setGoogleMapsUrl] = useState("");
  const supabase = createClient();

  useEffect(() => {
    supabase.from("reglages").select("*").limit(1).single().then(({ data }) => {
      if (data) {
        if (data.telephone) setTelephone(data.telephone);
        if (data.horaires) setHoraires(data.horaires);
        if (data.adresse) setAdresse(data.adresse);
        if (data.google_maps_url) setGoogleMapsUrl(data.google_maps_url);
      }
    });
  }, []);

  const formatHoraire = (h: { ouverture: string; fermeture: string } | null) => {
    if (!h) return "Ferme";
    const formatTime = (t: string) => {
      const [h2, m] = t.split(":");
      return `${parseInt(h2)}h${m !== "00" ? m : ""}`;
    };
    return `${formatTime(h.ouverture)} - ${formatTime(h.fermeture)}`;
  };

  const defaultMapEmbed = "https://www.google.com/maps?q=Route+de+Cirendino,+20144+Sainte-Lucie+de+Porto-Vecchio,+France&output=embed";
  const mapSrc = googleMapsUrl
    ? googleMapsUrl.replace(/\/maps\/place\/.*$/, "").includes("google.com/maps")
      ? googleMapsUrl.replace("maps?q=", "maps/embed?output=embed&q=")
      : defaultMapEmbed
    : defaultMapEmbed;

  return (
    <div className="py-12 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Infos pratiques"
          subtitle="Tout ce qu&apos;il faut savoir pour nous retrouver"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <FadeIn>
            <div className="rounded-2xl overflow-hidden shadow-lg h-[350px] lg:h-[450px] bg-border-light">
              <iframe
                src={mapSrc}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Maps - A Cas'a Mina"
              />
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="space-y-8">
              <div>
                <h3 className="font-serif text-xl font-bold text-marine flex items-center gap-2">
                  <MapPin size={20} className="text-dore" />
                  Adresse
                </h3>
                <p className="mt-3 text-texte-light whitespace-pre-line">
                  {adresse}
                </p>
              </div>

              <div>
                <h3 className="font-serif text-xl font-bold text-marine flex items-center gap-2">
                  <Phone size={20} className="text-dore" />
                  Telephone
                </h3>
                <a
                  href={telephone ? `tel:${telephone.replace(/\s/g, "")}` : "tel:"}
                  className="mt-3 inline-block text-marine font-medium underline underline-offset-2 hover:text-dore"
                >
                  {telephone || "06 76 77 22 75"}
                </a>
              </div>

              <div className="rounded-xl bg-dore/10 p-4">
                <p className="text-sm text-marine">
                  Pensez à appeler pour vérifier la disponibilité du poulet à la broche avant de vous déplacer !
                </p>
              </div>
            </div>
          </FadeIn>
        </div>

        <FadeIn>
          <div className="mt-12 rounded-2xl bg-blanc p-6 lg:p-8 shadow-md">
            <h3 className="font-serif text-2xl font-bold text-marine flex items-center gap-2 mb-6">
              <Clock size={22} className="text-dore" />
              Horaires d&apos;ouverture
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(horaires).map(([jour, h]) => (
                <div
                  key={jour}
                  className="flex items-center justify-between rounded-lg bg-creme px-4 py-3"
                >
                  <span className="font-medium text-texte">{jourLabels[jour]}</span>
                  <span
                    className={`text-sm ${
                      !h ? "text-error font-medium" : "text-texte-light"
                    }`}
                  >
                    {formatHoraire(h)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
