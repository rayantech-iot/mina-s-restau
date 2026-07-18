"use client";

import { useState } from "react";
import Image from "next/image";
import SectionTitle from "@/components/SectionTitle";
import FadeIn from "@/components/FadeIn";
import { Send, CheckCircle } from "lucide-react";
import { getPlatImage } from "@/lib/images";

const occasions = [
  "Mariage",
  "Anniversaire",
  "Réunion de famille",
  "Entreprise",
  "Autre",
];

export default function EvenementsPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="py-12 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Événements & commandes groupées"
          subtitle="Mariages, anniversaires, réunions — nous créons un menu sur mesure pour votre occasion"
        />

        {/* Introduction */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <FadeIn>
            <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-[4/3]">
              <Image
                src={getPlatImage(40)}
                alt="Événement A Cas'a Mina"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </FadeIn>
          <FadeIn delay={0.15}>
            <div className="space-y-4">
              <h3 className="font-serif text-2xl font-bold text-marine">
                Votre événement, nos plats
              </h3>
              <p className="text-texte-light leading-relaxed">
                Vous organisez un mariage, un anniversaire, une réunion de
                famille ou un événement d&apos;entreprise ? Confiez-nous la
                partie culinaire. Nous proposons des menus adaptés à votre
                événement, avec des plats préparés sur place et livrés à
                l&apos;heure souhaitée.
              </p>
              <p className="text-texte-light leading-relaxed">
                Devis gratuit et sans engagement. Contactez-nous pour discuter
                de votre projet.
              </p>
              <div className="rounded-xl bg-dore/10 p-4 mt-4">
                <p className="text-sm font-medium text-marine">
                  Toutes nos prestations sont sur devis. Aucun tarif n&apos;est
                  affiché car chaque événement est unique.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Galerie réalisations passées */}
        <FadeIn>
          <div className="mb-16">
            <h3 className="font-serif text-2xl font-bold text-marine text-center mb-8">
              Nos réalisations
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-square rounded-xl overflow-hidden relative">
                  <Image
                    src={getPlatImage(50 + i * 2)}
                    alt={`Réalisation ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* Formulaire de devis */}
        <FadeIn>
          <div className="rounded-3xl bg-blanc p-6 lg:p-10 shadow-lg max-w-3xl mx-auto">
            <h3 className="font-serif text-2xl font-bold text-marine text-center mb-2">
              Demande de devis
            </h3>
            <p className="text-center text-texte-light mb-8">
              Remplissez le formulaire ci-dessous et nous vous répondrons dans
              les meilleurs délais.
            </p>

            {submitted ? (
              <div className="text-center py-12">
                <CheckCircle size={48} className="mx-auto text-success mb-4" />
                <h4 className="font-serif text-xl font-bold text-marine">
                  Demande envoyée !
                </h4>
                <p className="mt-2 text-texte-light">
                  Nous vous contacterons très rapidement.
                </p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubmitted(true);
                }}
                className="space-y-5"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-texte mb-1">
                      Nom et prénom *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full rounded-lg border border-border bg-creme px-4 py-3 text-sm text-texte focus:border-marine focus:ring-2 focus:ring-marine/20 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-texte mb-1">
                      Téléphone *
                    </label>
                    <input
                      type="tel"
                      required
                      className="w-full rounded-lg border border-border bg-creme px-4 py-3 text-sm text-texte focus:border-marine focus:ring-2 focus:ring-marine/20 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-texte mb-1">
                    E-mail *
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full rounded-lg border border-border bg-creme px-4 py-3 text-sm text-texte focus:border-marine focus:ring-2 focus:ring-marine/20 outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-texte mb-1">
                      Type d&apos;occasion *
                    </label>
                    <select
                      required
                      className="w-full rounded-lg border border-border bg-creme px-4 py-3 text-sm text-texte focus:border-marine focus:ring-2 focus:ring-marine/20 outline-none transition-all"
                    >
                      <option value="">Choisir...</option>
                      {occasions.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-texte mb-1">
                      Date souhaitée *
                    </label>
                    <input
                      type="date"
                      required
                      className="w-full rounded-lg border border-border bg-creme px-4 py-3 text-sm text-texte focus:border-marine focus:ring-2 focus:ring-marine/20 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-texte mb-1">
                      Nombre de convives *
                    </label>
                    <input
                      type="number"
                      min={1}
                      required
                      className="w-full rounded-lg border border-border bg-creme px-4 py-3 text-sm text-texte focus:border-marine focus:ring-2 focus:ring-marine/20 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-texte mb-1">
                      Lieu de réception
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-lg border border-border bg-creme px-4 py-3 text-sm text-texte focus:border-marine focus:ring-2 focus:ring-marine/20 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-texte mb-1">
                    Préférences culinaires / plats souhaités
                  </label>
                  <textarea
                    rows={3}
                    className="w-full rounded-lg border border-border bg-creme px-4 py-3 text-sm text-texte focus:border-marine focus:ring-2 focus:ring-marine/20 outline-none transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-texte mb-1">
                    Allergies ou restrictions alimentaires
                  </label>
                  <textarea
                    rows={2}
                    className="w-full rounded-lg border border-border bg-creme px-4 py-3 text-sm text-texte focus:border-marine focus:ring-2 focus:ring-marine/20 outline-none transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-texte mb-1">
                    Message libre
                  </label>
                  <textarea
                    rows={3}
                    className="w-full rounded-lg border border-border bg-creme px-4 py-3 text-sm text-texte focus:border-marine focus:ring-2 focus:ring-marine/20 outline-none transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-marine px-8 py-3.5 text-sm font-semibold text-creme transition-all hover:bg-marine-light"
                >
                  <Send size={18} />
                  Envoyer la demande
                </button>
              </form>
            )}
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
