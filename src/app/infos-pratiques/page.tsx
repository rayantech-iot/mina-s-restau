import type { Metadata } from "next";
import SectionTitle from "@/components/SectionTitle";
import FadeIn from "@/components/FadeIn";
import { MapPin, Clock, Phone } from "lucide-react";

export const metadata: Metadata = {
  title: "Infos pratiques",
  description:
    "Adresse, horaires et disponibilités du jour — A Cas'a Mina, Sainte-Lucie de Porto-Vecchio.",
};

const horaires = [
  { jour: "Lundi", horaires: "11h30 - 14h00" },
  { jour: "Mardi", horaires: "11h30 - 14h00" },
  { jour: "Mercredi", horaires: "Fermé" },
  { jour: "Jeudi", horaires: "11h30 - 14h00" },
  { jour: "Vendredi", horaires: "11h30 - 14h00" },
  { jour: "Samedi", horaires: "11h30 - 14h00 / 18h30 - 21h00" },
  { jour: "Dimanche", horaires: "Fermé" },
];

export default function InfosPratiquesPage() {
  return (
    <div className="py-12 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Infos pratiques"
          subtitle="Tout ce qu&apos;il faut savoir pour nous retrouver"
        />

        {/* Bandeau statut du jour */}
        <FadeIn>
          <div className="mb-12 rounded-2xl bg-blanc p-6 shadow-md">
            <div className="flex flex-wrap items-center justify-center gap-4">
              <div className="flex items-center gap-2 rounded-full bg-success/10 px-4 py-2 text-sm font-medium text-success">
                <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
                Ouvert aujourd&apos;hui
              </div>
              <div className="flex items-center gap-2 rounded-full bg-dore/10 px-4 py-2 text-sm font-medium text-marine">
                Poulet à la broche disponible
              </div>
            </div>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Carte */}
          <FadeIn>
            <div className="rounded-2xl overflow-hidden shadow-lg h-[350px] lg:h-[450px] bg-border-light flex items-center justify-center">
              <div className="text-center text-texte-light">
                <MapPin size={48} className="mx-auto text-marine/40 mb-4" />
                <p className="text-sm">Carte Google Maps</p>
                <p className="text-xs text-texte-lighter mt-1">
                  Route de Cirendino, 20144 Zonza
                </p>
              </div>
            </div>
          </FadeIn>

          {/* Coordonnées */}
          <FadeIn delay={0.1}>
            <div className="space-y-8">
              <div>
                <h3 className="font-serif text-xl font-bold text-marine flex items-center gap-2">
                  <MapPin size={20} className="text-dore" />
                  Adresse
                </h3>
                <p className="mt-3 text-texte-light">
                  Route de Cirendino
                  <br />
                  20144 Sainte-Lucie de Porto-Vecchio
                  <br />
                  (entre Porto-Vecchio et Pinarello)
                </p>
              </div>

              <div>
                <h3 className="font-serif text-xl font-bold text-marine flex items-center gap-2">
                  <Phone size={20} className="text-dore" />
                  Téléphone
                </h3>
                <a
                  href="tel:"
                  className="mt-3 inline-block text-marine font-medium underline underline-offset-2 hover:text-dore"
                >
                  —
                </a>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Horaires */}
        <FadeIn>
          <div className="mt-12 rounded-2xl bg-blanc p-6 lg:p-8 shadow-md">
            <h3 className="font-serif text-2xl font-bold text-marine flex items-center gap-2 mb-6">
              <Clock size={22} className="text-dore" />
              Horaires d&apos;ouverture
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {horaires.map((h) => (
                <div
                  key={h.jour}
                  className="flex items-center justify-between rounded-lg bg-creme px-4 py-3"
                >
                  <span className="font-medium text-texte">{h.jour}</span>
                  <span
                    className={`text-sm ${
                      h.horaires === "Fermé"
                        ? "text-error font-medium"
                        : "text-texte-light"
                    }`}
                  >
                    {h.horaires}
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
