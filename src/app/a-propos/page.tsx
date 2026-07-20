import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SectionTitle from "@/components/SectionTitle";
import FadeIn from "@/components/FadeIn";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "Découvrez A Cas'a Mina, restaurant à emporter en Corse, et l'histoire de Mina et de sa cuisine.",
};

export default function AProposPage() {
  return (
    <div className="py-12 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="À propos"
          subtitle="Une cuisine corse authentique, transmise avec passion"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <FadeIn>
            <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-[3/4] max-h-[600px] mx-auto">
              <Image
                src="/images/galerie/mina.png"
                alt="Mina - A Cas'a Mina"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
            <div className="space-y-6">
              <div>
                <h3 className="font-serif text-2xl font-bold text-marine">
                  Notre histoire
                </h3>
                <p className="mt-4 text-texte-light leading-relaxed">
                  Niché entre Porto-Vecchio et Pinarello, en pleine Corse du
                  Sud, A Cas&apos;a Mina est bien plus qu&apos;un simple
                  restaurant à emporter. C&apos;est le reflet d&apos;une passion
                  pour la cuisine corse authentique, celle qui se transmet de
                  génération en génération.
                </p>
              </div>

              <div>
                <h3 className="font-serif text-2xl font-bold text-marine">
                  Notre philosophie
                </h3>
                <p className="mt-4 text-texte-light leading-relaxed">
                  Chaque plat est préparé sur place, avec des produits frais et
                  locaux autant que possible. Nos poulets rôtis à la broche sont
                  cuits lentement pour une peau croustillante et une chair
                  juteuse — notre spécialité qui fait la joie de nos clients.
                </p>
              </div>

              <div>
                <h3 className="font-serif text-2xl font-bold text-marine">
                  Pour vous
                </h3>
                <p className="mt-4 text-texte-light leading-relaxed">
                  Que ce soit pour un repas rapide à emporter, un déjeuner en
                  famille ou la préparation d&apos;un événement spécial, nous
                  sommes là pour vous régaler avec des plats faits maison et
                  pleins de saveurs.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-full bg-marine px-6 py-3 text-sm font-semibold text-creme transition-all hover:bg-marine-light"
                >
                  Nous contacter
                </Link>
                <Link
                  href="/evenements"
                  className="inline-flex items-center justify-center rounded-full border-2 border-marine px-6 py-3 text-sm font-semibold text-marine transition-all hover:bg-marine hover:text-creme"
                >
                  Demander un devis
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
