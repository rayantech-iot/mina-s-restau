import type { Metadata } from "next";
import SectionTitle from "@/components/SectionTitle";
import PlaceholderImage from "@/components/PlaceholderImage";
import FadeIn from "@/components/FadeIn";

export const metadata: Metadata = {
  title: "La Carte",
  description:
    "Découvrez nos plats : poulets rôtis à la broche, plats du jour, accompagnements, desserts maison.",
};

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
  { id: "1", nom: "Poulet rôti à la broche", cat: "Poulets rôtis à la broche" },
  { id: "2", nom: "Civet de sanglier", cat: "Plats du jour" },
  { id: "3", nom: "Pâtes courgettes", cat: "Plats du jour" },
  { id: "4", nom: "Salade de lentilles", cat: "Accompagnements" },
  { id: "5", nom: "Bruschetta tomates", cat: "Entrées" },
  { id: "6", nom: "Far breton", cat: "Desserts maison" },
  { id: "7", nom: "Tarte aux myrtilles", cat: "Desserts maison" },
  { id: "8", nom: "Menu du midi", cat: "Menus spéciaux" },
];

export default function CartePage() {
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
            {categories.map((cat, i) => (
              <button
                key={cat}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  i === 0
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
          {platsPlaceholder.map((plat, index) => (
            <FadeIn key={plat.id} delay={index * 0.05}>
              <div className="group block overflow-hidden rounded-2xl bg-blanc shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="aspect-square relative">
                  <PlaceholderImage
                    alt={plat.nom}
                    size="md"
                    className="w-full h-full transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <span className="text-xs font-medium text-dore uppercase tracking-wider">
                    {plat.cat}
                  </span>
                  <h3 className="mt-1 font-serif text-lg font-semibold text-marine">
                    {plat.nom}
                  </h3>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </div>
  );
}
