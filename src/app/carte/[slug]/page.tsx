import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import PlaceholderImage from "@/components/PlaceholderImage";
import FadeIn from "@/components/FadeIn";

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
            <div className="rounded-3xl overflow-hidden shadow-xl">
              <PlaceholderImage
                alt="Photo du plat"
                size="lg"
                className="w-full"
              />
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
            <div className="flex flex-col justify-center">
              <span className="text-sm font-medium text-dore uppercase tracking-wider">
                Poulets rôtis à la broche
              </span>
              <h1 className="mt-2 font-serif text-3xl font-bold text-creme sm:text-4xl lg:text-5xl">
                Plat en cours de chargement
              </h1>
              <p className="mt-4 text-creme/70 leading-relaxed">
                Ce plat sera disponible une fois la connexion à Supabase
                configurée et les données saisies depuis le tableau de bord
                admin.
              </p>
              <div className="mt-6 inline-flex items-center rounded-full bg-success/20 px-4 py-2 text-sm font-medium text-success w-fit">
                Disponible
              </div>
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
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-blanc shadow-sm overflow-hidden"
                >
                  <div className="aspect-square">
                    <PlaceholderImage
                      alt={`Suggestion ${i + 1}`}
                      size="sm"
                      className="w-full h-full"
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
