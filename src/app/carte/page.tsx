"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import SectionTitle from "@/components/SectionTitle";
import FadeIn from "@/components/FadeIn";
import { getPlatImage } from "@/lib/images";

const categories = [
  "Tous",
  "Poulets rôtis à la broche",
  "Plats du jour",
  "Accompagnements",
  "Entrées",
  "Desserts maison",
  "Menus spéciaux",
];

const platsPlaceholder = [
  { id: "1", nom: "Poulet rôti à la broche", cat: "Poulets rôtis à la broche", imgIdx: 0 },
  { id: "2", nom: "Civet de sanglier", cat: "Plats du jour", imgIdx: 3 },
  { id: "3", nom: "Pâtes courgettes", cat: "Plats du jour", imgIdx: 6 },
  { id: "4", nom: "Salade de lentilles", cat: "Accompagnements", imgIdx: 9 },
  { id: "5", nom: "Bruschetta tomates", cat: "Entrées", imgIdx: 12 },
  { id: "6", nom: "Far breton", cat: "Desserts maison", imgIdx: 15 },
  { id: "7", nom: "Tarte aux myrtilles", cat: "Desserts maison", imgIdx: 18 },
  { id: "8", nom: "Menu du midi", cat: "Menus spéciaux", imgIdx: 21 },
  { id: "9", nom: "Poulet basquaise", cat: "Plats du jour", imgIdx: 24 },
  { id: "10", nom: " gratin dauphinois", cat: "Accompagnements", imgIdx: 27 },
  { id: "11", nom: "Soupe de poisson", cat: "Entrées", imgIdx: 30 },
  { id: "12", nom: "Tarte aux citrons", cat: "Desserts maison", imgIdx: 33 },
];

export default function CartePage() {
  const [activeFilter, setActiveFilter] = useState("Tous");

  const filtered =
    activeFilter === "Tous"
      ? platsPlaceholder
      : platsPlaceholder.filter((p) => p.cat === activeFilter);

  return (
    <div className="py-12 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="La Carte"
          subtitle="Tous nos plats, préparés quotidiennement avec des produits frais"
        />

        {/* Filtres */}
        <FadeIn>
          <div className="mb-10 flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  activeFilter === cat
                    ? "bg-marine text-creme"
                    : "bg-blanc text-texte-light border border-border hover:border-marine hover:text-marine"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </FadeIn>

        {/* Grille de plats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((plat, index) => (
            <FadeIn key={plat.id} delay={index * 0.05}>
              <Link href={`/carte/${plat.id}`} className="group block">
                <div className="overflow-hidden rounded-2xl bg-blanc shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="aspect-square relative">
                    <Image
                      src={getPlatImage(plat.imgIdx)}
                      alt={plat.nom}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                  </div>
                  <div className="p-4">
                    <span className="text-xs font-medium text-dore uppercase tracking-wider">
                      {plat.cat}
                    </span>
                    <h3 className="mt-1 font-serif text-lg font-semibold text-marine group-hover:text-dore transition-colors">
                      {plat.nom}
                    </h3>
                  </div>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-texte-light">
              Aucun plat dans cette catégorie pour le moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
