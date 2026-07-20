"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import SectionTitle from "@/components/SectionTitle";
import FadeIn from "@/components/FadeIn";
import { Send, CheckCircle, ChevronRight } from "lucide-react";

const occasions = [
  "Mariage",
  "Anniversaire",
  "Reunion de famille",
  "Entreprise",
  "Autre",
];

export default function EvenementsPage() {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const fd = new FormData(form);
    setSending(true);

    try {
      await fetch("/api/devis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom: fd.get("nom"),
          telephone: fd.get("telephone"),
          email: fd.get("email"),
          type_occasion: fd.get("occasion"),
          date_souhaitee: fd.get("date"),
          nb_convives: fd.get("convives"),
          lieu: fd.get("lieu"),
          preferences: fd.get("preferences"),
          allergies: fd.get("allergies"),
          message: fd.get("message"),
        }),
      });
      setSubmitted(true);
    } catch {
      alert("Erreur lors de l'envoi. Veuillez réessayer.");
    }
    setSending(false);
  };

  return (
    <div className="py-12 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Événements & commandes groupées"
          subtitle="Mariages, anniversaires, réunions — nous créons un menu sur mesure pour votre occasion"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <FadeIn>
            <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-[4/3]">
              <img
                src="/images/plats/plat-40.png"
                alt="Événement A Cas'a Mina"
                className="absolute inset-0 w-full h-full object-cover"
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
                <Link
                  href="/"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-marine px-6 py-3 text-sm font-semibold text-creme transition-all hover:bg-marine-light"
                >
                  Retour à l&apos;accueil
                  <ChevronRight size={16} />
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-texte mb-1">
                      Nom et prénom *
                    </label>
                    <input
                      name="nom"
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
                      name="telephone"
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
                    name="email"
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
                      name="occasion"
                      required
                      className="w-full rounded-lg border border-border bg-creme px-4 py-3 text-sm text-texte focus:border-marine focus:ring-2 focus:ring-marine/20 outline-none transition-all"
                    >
                      <option value="">Choisir...</option>
                      {occasions.map((o) => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-texte mb-1">
                      Date souhaitée *
                    </label>
                    <input
                      name="date"
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
                      name="convives"
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
                      name="lieu"
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
                    name="preferences"
                    rows={3}
                    className="w-full rounded-lg border border-border bg-creme px-4 py-3 text-sm text-texte focus:border-marine focus:ring-2 focus:ring-marine/20 outline-none transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-texte mb-1">
                    Allergies ou restrictions alimentaires
                  </label>
                  <textarea
                    name="allergies"
                    rows={2}
                    className="w-full rounded-lg border border-border bg-creme px-4 py-3 text-sm text-texte focus:border-marine focus:ring-2 focus:ring-marine/20 outline-none transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-texte mb-1">
                    Message libre
                  </label>
                  <textarea
                    name="message"
                    rows={3}
                    className="w-full rounded-lg border border-border bg-creme px-4 py-3 text-sm text-texte focus:border-marine focus:ring-2 focus:ring-marine/20 outline-none transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-marine px-8 py-3.5 text-sm font-semibold text-creme transition-all hover:bg-marine-light disabled:opacity-50"
                >
                  <Send size={18} />
                  {sending ? "Envoi..." : "Envoyer la demande"}
                </button>
              </form>
            )}
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
