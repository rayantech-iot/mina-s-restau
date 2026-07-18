"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  MapPin,
  ChevronRight,
  UtensilsCrossed,
  Clock,
} from "lucide-react";
import InstagramIcon from "@/components/InstagramIcon";
import FadeIn from "@/components/FadeIn";
import SectionTitle from "@/components/SectionTitle";
import PlaceholderImage from "@/components/PlaceholderImage";

const featuredPlats = [
  { id: "1", nom: "Poulet rôti à la broche", categorie: "Poulets rôtis", disponible: true },
  { id: "2", nom: "Civet de sanglier", categorie: "Plats du jour", disponible: true },
  { id: "3", nom: "Far breton aux pruneaux", categorie: "Desserts maison", disponible: true },
  { id: "4", nom: "Courgettes farcies", categorie: "Plats du jour", disponible: false },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-marine">
        <div className="absolute inset-0 bg-gradient-to-br from-marine via-marine to-marine-light opacity-90" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(212,175,55,0.15),transparent_50%)]" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <FadeIn>
              <div className="text-center lg:text-left">
                <span className="inline-block rounded-full bg-dore/20 px-4 py-1.5 text-sm font-medium text-dore mb-6">
                  Cuisine traditionnelle corse
                </span>
                <h1 className="font-serif text-4xl font-bold text-creme sm:text-5xl lg:text-6xl xl:text-7xl leading-tight">
                  Poulets rôtis
                  <br />
                  <span className="text-dore">à la broche</span>
                  <br />
                  & plats faits maison
                </h1>
                <p className="mt-6 max-w-lg text-lg text-creme/70 mx-auto lg:mx-0">
                  Entre Porto-Vecchio et Pinarello, savourez nos spécialités
                  préparées avec des produits frais et le savoir-faire d&apos;une
                  cuisine corse authentique.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link
                    href="/carte"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-dore px-8 py-3.5 text-sm font-semibold text-marine transition-all hover:bg-dore-light hover:scale-105"
                  >
                    <UtensilsCrossed size={18} />
                    Voir la carte
                  </Link>
                  <Link
                    href="/infos-pratiques"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-creme/30 px-8 py-3.5 text-sm font-semibold text-creme transition-all hover:border-creme/60 hover:bg-creme/10"
                  >
                    <MapPin size={18} />
                    Nous trouver
                  </Link>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.2} className="hidden lg:block">
              <div className="relative">
                <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl">
                  <PlaceholderImage
                    alt="Poulet rôti à la broche"
                    size="xl"
                    className="w-full h-full"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 rounded-2xl bg-dore p-4 shadow-xl">
                  <p className="font-serif text-lg font-bold text-marine">
                    Fait maison
                  </p>
                  <p className="text-sm text-marine/70">
                    avec amour
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Bandeau disponibilité du jour */}
      <section className="bg-creme border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center justify-center gap-3 text-center">
            <div className="flex items-center gap-2 rounded-full bg-success/10 px-4 py-2 text-sm font-medium text-success">
              <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
              Ouvert aujourd&apos;hui
            </div>
            <div className="flex items-center gap-2 rounded-full bg-dore/10 px-4 py-2 text-sm font-medium text-marine">
              <Clock size={16} className="text-dore" />
              Broche disponible
            </div>
          </div>
        </div>
      </section>

      {/* Plats mis en avant */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title="Nos spécialités"
            subtitle="Découvrez nos plats préparés quotidiennement avec des produits frais et locaux"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredPlats.map((plat, index) => (
              <FadeIn key={plat.id} delay={index * 0.1}>
                <Link href={`/carte/${plat.id}`} className="group block">
                  <div className="relative overflow-hidden rounded-2xl bg-blanc shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    <div className="aspect-square">
                      <PlaceholderImage
                        alt={plat.nom}
                        size="md"
                        className="w-full h-full transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-4">
                      <span className="text-xs font-medium text-dore uppercase tracking-wider">
                        {plat.categorie}
                      </span>
                      <h3 className="mt-1 font-serif text-lg font-semibold text-marine group-hover:text-dore transition-colors">
                        {plat.nom}
                      </h3>
                    </div>
                    {plat.disponible && (
                      <div className="absolute top-3 right-3 rounded-full bg-success/90 px-3 py-1 text-xs font-medium text-blanc">
                        Disponible
                      </div>
                    )}
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/carte"
              className="inline-flex items-center gap-2 rounded-full border-2 border-marine px-8 py-3 text-sm font-semibold text-marine transition-all hover:bg-marine hover:text-creme"
            >
              Voir toute la carte
              <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Bloc valeurs */}
      <section className="bg-marine py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                title: "Fait maison",
                desc: "Chaque plat est préparé sur place avec des ingrédients frais, dans le respect de la tradition culinaire corse.",
                icon: "🍳",
              },
              {
                title: "Produits locaux",
                desc: "Nous privilégions les producteurs corses et les circuits courts pour une qualité irréprochable.",
                icon: "🌿",
              },
              {
                title: "À emporter",
                desc: "Passez votre commande par téléphone ou sur place, et repartez avec des plats chauds et savoureux.",
                icon: "📦",
              },
            ].map((item, index) => (
              <FadeIn key={index} delay={index * 0.15}>
                <div className="text-center">
                  <span className="text-4xl">{item.icon}</span>
                  <h3 className="mt-4 font-serif text-xl font-bold text-creme">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-creme/60 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Événements */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-3xl bg-blanc shadow-lg">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <FadeIn>
                <div className="p-8 lg:p-12">
                  <span className="text-sm font-medium text-dore uppercase tracking-wider">
                    Événements
                  </span>
                  <h2 className="mt-3 font-serif text-3xl font-bold text-marine sm:text-4xl">
                    Vous organisez un événement ?
                  </h2>
                  <p className="mt-4 text-texte-light leading-relaxed">
                    Mariage, anniversaire, réunion de famille ou d&apos;entreprise
                    — nous proposons des formules sur mesure pour votre
                    événement. Devis gratuit et sans engagement.
                  </p>
                  <Link
                    href="/evenements"
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-marine px-6 py-3 text-sm font-semibold text-creme transition-all hover:bg-marine-light"
                  >
                    Découvrir nos offres
                    <ChevronRight size={18} />
                  </Link>
                </div>
              </FadeIn>
              <FadeIn delay={0.1}>
                <div className="relative min-h-[300px]">
                  <PlaceholderImage
                    alt="Événement - Commande groupée"
                    size="lg"
                    className="w-full h-full"
                  />
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* Localisation */}
      <section className="bg-blanc py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title="Nous trouver"
            subtitle="Entre Porto-Vecchio et Pinarello, au cœur de la Corse du Sud"
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
            <FadeIn delay={0.1}>
              <div className="flex flex-col justify-center space-y-6">
                <div>
                  <h3 className="font-serif text-xl font-bold text-marine">
                    Adresse
                  </h3>
                  <p className="mt-2 text-texte-light">
                    Route de Cirendino
                    <br />
                    20144 Sainte-Lucie de Porto-Vecchio
                    <br />
                    (entre Porto-Vecchio et Pinarello)
                  </p>
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-marine">
                    Horaires
                  </h3>
                  <p className="mt-2 text-texte-light text-sm">
                    Consultez notre page{" "}
                    <Link
                      href="/infos-pratiques"
                      className="text-marine font-medium underline underline-offset-2 hover:text-dore"
                    >
                      Infos pratiques
                    </Link>{" "}
                    pour les horaires du jour.
                  </p>
                </div>
                <Link
                  href="/infos-pratiques"
                  className="inline-flex items-center gap-2 self-start rounded-full bg-marine px-6 py-3 text-sm font-semibold text-creme transition-all hover:bg-marine-light"
                >
                  <MapPin size={18} />
                  Voir sur Google Maps
                </Link>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Aperçu Instagram */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title="Suivez-nous"
            subtitle="Retrouvez nos coulisses et nos plats du jour sur Instagram"
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <FadeIn key={i} delay={i * 0.05}>
                <a
                  href="https://instagram.com/acas_a_mina"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block aspect-square overflow-hidden rounded-xl"
                >
                  <div className="relative w-full h-full bg-border-light transition-transform duration-300 group-hover:scale-105">
                    <PlaceholderImage
                      alt={`Publication Instagram ${i + 1}`}
                      size="sm"
                      className="w-full h-full"
                    />
                    <div className="absolute inset-0 bg-marine/0 transition-colors group-hover:bg-marine/30 flex items-center justify-center">
                      <InstagramIcon
                        size={28}
                        className="text-blanc opacity-0 transition-all group-hover:opacity-100"
                      />
                    </div>
                  </div>
                </a>
              </FadeIn>
            ))}
          </div>
          <div className="mt-8 text-center">
            <a
              href="https://instagram.com/acas_a_mina"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 px-6 py-3 text-sm font-semibold text-blanc transition-all hover:scale-105"
            >
              <InstagramIcon size={18} />
              @acas_a_mina
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
