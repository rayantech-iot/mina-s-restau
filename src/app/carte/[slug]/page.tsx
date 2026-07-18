import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import FadeIn from "@/components/FadeIn";
import { getPlatImage } from "@/lib/images";

export const metadata: Metadata = {
  title: "Fiche plat",
};

export default function PlatDetailPage() {
  return (
    <div className="py-12 lg:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <Link
            href="/carte"
            className="inline-flex items-center gap-2 text-sm font-medium text-marine hover:text-dore transition-colors mb-8"
          >
            <ArrowLeft size={16} />
            Retour à la carte
          </Link>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <FadeIn>
            <div className="rounded-3xl overflow-hidden shadow-xl aspect-square relative">
              <Image
                src={getPlatImage(0)}
                alt="Photo du plat"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
            <div className="flex flex-col justify-center">
              <span className="text-sm font-medium text-dore uppercase tracking-wider">
                Poulets rôtis à la broche
              </span>
              <h1 className="mt-2 font-serif text-3xl font-bold text-marine sm:text-4xl lg:text-5xl">
                Poulet rôti à la broche
              </h1>
              <p className="mt-4 text-texte-light leading-relaxed">
                Notre spécialité — poulet entier rôti lentement à la broche,
                pour une peau croustillante et une chair juteuse et savoureuse.
                Préparé quotidiennement avec des produits frais.
              </p>
              <div className="mt-6 inline-flex items-center rounded-full bg-success/10 px-4 py-2 text-sm font-medium text-success w-fit">
                Disponible
              </div>
              <p className="mt-6 text-sm text-texte-lighter">
                Prix et description complétés par le gestionnaire depuis le tableau de bord admin.
              </p>
            </div>
          </FadeIn>
        </div>

        {/* Suggestions */}
        <FadeIn>
          <div className="mt-16">
            <h2 className="font-serif text-2xl font-bold text-marine mb-6">
              Vous aimerez aussi
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[3, 6, 9].map((imgIdx) => (
                <div
                  key={imgIdx}
                  className="rounded-2xl bg-blanc shadow-sm overflow-hidden"
                >
                  <div className="aspect-square relative">
                    <Image
                      src={getPlatImage(imgIdx)}
                      alt="Plat similaire"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 33vw"
                    />
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-medium text-marine">
                      Plat à venir
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
