"use client";

import { useState, useEffect } from "react";
import SectionTitle from "@/components/SectionTitle";
import FadeIn from "@/components/FadeIn";
import { MapPin, Clock, Phone } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const defaultHoraires: Record<string, { ouverture: string; fermeture: string; ouverture2?: string; fermeture2?: string } | null> = {
  lundi: { ouverture: "08:00", fermeture: "13:30", ouverture2: "17:00", fermeture2: "20:30" },
  mardi: { ouverture: "08:00", fermeture: "13:30", ouverture2: "17:00", fermeture2: "20:30" },
  mercredi: { ouverture: "08:00", fermeture: "13:30", ouverture2: "17:00", fermeture2: "20:30" },
  jeudi: { ouverture: "08:00", fermeture: "13:30", ouverture2: "17:00", fermeture2: "20:30" },
  vendredi: { ouverture: "08:00", fermeture: "13:30", ouverture2: "17:00", fermeture2: "20:30" },
  samedi: { ouverture: "08:00", fermeture: "13:30", ouverture2: "17:00", fermeture2: "20:30" },
  dimanche: { ouverture: "08:00", fermeture: "13:30", ouverture2: "17:00", fermeture2: "20:30" },
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
  const [adresse, setAdresse] = useState("Route de Cirindinu, 20144 Sainte-Lucie-de-Porto-Vecchio");
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

  const formatTime = (t: string) => {
    const [h, m] = t.split(":");
    return `${parseInt(h)}h${m !== "00" ? m : ""}`;
  };

  const formatHoraire = (h: { ouverture: string; fermeture: string; ouverture2?: string; fermeture2?: string } | null) => {
    if (!h) return "Ferme";
    const period1 = `${formatTime(h.ouverture)} - ${formatTime(h.fermeture)}`;
    if (h.ouverture2 && h.fermeture2) {
      return `${period1} / ${formatTime(h.ouverture2)} - ${formatTime(h.fermeture2)}`;
    }
    return period1;
  };

  const defaultMapEmbed = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3229.7!2d9.3619012!3d41.6599612!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12d985b0d121ee01%3A0x341015c291f43cf2!2sA%20Cas%27a%20Mina!5e0!3m2!1sfr!2sfr!4v1";
  const mapSrc = googleMapsUrl && googleMapsUrl.includes("google.com/maps")
    ? googleMapsUrl.includes("embed")
      ? googleMapsUrl
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
            <div className="rounded-2xl overflow-hidden shadow-lg h-[350px] lg:h-[450px] bg-border-light relative">
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
              {googleMapsUrl && (
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-blanc px-3 py-1.5 text-xs font-medium text-marine shadow-md hover:bg-marine hover:text-creme transition-all"
                >
                  <MapPin size={12} />
                  Ouvrir dans Google Maps
                </a>
              )}
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

        {/* CTA Devis */}
        <FadeIn>
          <div className="mt-12 rounded-3xl bg-marine p-8 lg:p-12 text-center">
            <h3 className="font-serif text-2xl font-bold text-creme mb-3">
              Un événement à préparer ?
            </h3>
            <p className="text-creme/70 mb-6 max-w-lg mx-auto">
              Nous créons des menus sur mesure pour mariages, anniversaires et événements. Devis gratuit !
            </p>
            <Link
              href="/evenements"
              className="inline-flex items-center gap-2 rounded-full bg-dore px-6 py-3 text-sm font-semibold text-marine transition-all hover:bg-dore-light hover:scale-105"
            >
              Demander un devis
            </Link>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
