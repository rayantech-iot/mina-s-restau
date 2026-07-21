"use client";

import Link from "next/link";
import InstagramIcon from "@/components/InstagramIcon";
import FadeIn from "@/components/FadeIn";
import SectionTitle from "@/components/SectionTitle";
import HeroSection from "@/components/HeroSection";
import ScrollAnimations from "@/components/ScrollAnimations";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Plat {
  id: string;
  nom: string;
  description: string | null;
  image_url: string;
  categorie_id: string | null;
  statut: string;
  mis_en_avant: boolean;
}

export default function Home() {
  const [featuredPlats, setFeaturedPlats] = useState<Plat[]>([]);
  const [recentImages, setRecentImages] = useState<{ src: string; alt: string }[]>([]);

  useEffect(() => {
    const supabase = createClient();

    supabase
      .from("plats")
      .select("*")
      .eq("mis_en_avant", true)
      .limit(4)
      .then(({ data }) => setFeaturedPlats(data || []));

    supabase
      .from("galerie_images")
      .select("url, alt")
      .order("created_at", { ascending: false })
      .limit(8)
      .then(({ data }) => {
        setRecentImages((data || []).map((g) => ({ src: g.url, alt: g.alt })));
      });
  }, []);

  return (
    <>
      <ScrollAnimations />
      <HeroSection />

      {/* Plats mis en avant */}
      <section className="py-16 lg:py-24" data-animate>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" data-animate-child>
          <SectionTitle
            title="Nos specialties"
            subtitle="Decouvrez nos plats prepares quotidiennement avec des produits frais et locaux"
          />
          {featuredPlats.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {featuredPlats.map((plat, index) => (
                <FadeIn key={plat.id} delay={index * 0.1}>
                  <Link href={`/carte/${plat.id}`} className="group block">
                    <div className="relative overflow-hidden rounded-2xl bg-blanc shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                      <div className="aspect-square relative bg-border-light">
                        {plat.image_url ? (
                          <img
                            src={plat.image_url}
                            alt={plat.nom}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            loading="lazy"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-texte-lighter text-sm">
                            Pas de photo
                          </div>
                        )}
                      </div>
                      <div className="p-2 sm:p-4">
                        <h3 className="font-serif text-sm sm:text-lg font-semibold text-marine group-hover:text-dore transition-colors">
                          {plat.nom}
                        </h3>
                      </div>
                    </div>
                  </Link>
                </FadeIn>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-texte-light">Nos specialties arrivent bientot.</p>
            </div>
          )}
          <div className="mt-10 text-center">
            <Link
              href="/carte"
              className="inline-flex items-center gap-2 rounded-full border-2 border-marine px-8 py-3 text-sm font-semibold text-marine transition-all hover:bg-marine hover:text-creme"
            >
              Voir toute la carte
            </Link>
          </div>
        </div>
      </section>

      {/* Bloc valeurs */}
      <section className="bg-marine py-16 lg:py-24" data-animate>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" data-animate-child>
          <SectionTitle
            title="Notre philosophie"
            subtitle="Une cuisine honnete, preparee avec passion"
            light
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 mt-12">
            {[
              {
                title: "Fait maison",
                desc: "Chaque plat est prepare sur place avec des ingredients frais, dans le respect de la tradition culinaire corse.",
              },
              {
                title: "Produits locaux",
                desc: "Nous privilegions les producteurs corses et les circuits courts pour une qualite irreprochable.",
              },
              {
                title: "A emporter",
                desc: "Passez votre commande par telephone ou sur place, et repartez avec des plats chauds et savoureux.",
              },
            ].map((item, index) => (
              <FadeIn key={index} delay={index * 0.15}>
                <div className="text-center">
                  <h3 className="font-serif text-xl font-bold text-creme">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-creme/80 text-sm leading-relaxed max-w-xs mx-auto">
                    {item.desc}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Galerie apercu */}
      {recentImages.length > 0 && (
        <section className="py-16 lg:py-24" data-animate>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" data-animate-child>
            <SectionTitle
              title="Nos creations"
              subtitle="Un apercu de nos plats et coulisses"
            />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {recentImages.map((img, i) => (
                <FadeIn key={i} delay={i * 0.05}>
                  <a
                    href="/galerie"
                    className="group block aspect-square overflow-hidden rounded-xl bg-border-light"
                  >
                    <img
                      src={img.src}
                      alt={img.alt}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                  </a>
                </FadeIn>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link
                href="/galerie"
                className="inline-flex items-center gap-2 rounded-full border-2 border-marine px-6 py-2.5 text-sm font-semibold text-marine transition-all hover:bg-marine hover:text-creme"
              >
                Voir la galerie
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Evenements */}
      <section className="py-16 lg:py-24 bg-creme" data-animate>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" data-animate-child>
          <div className="overflow-hidden rounded-3xl bg-blanc shadow-lg">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <FadeIn>
                <div className="p-8 lg:p-12">
                  <span className="text-sm font-medium text-dore uppercase tracking-wider">
                    Evenements
                  </span>
                  <h2 className="mt-3 font-serif text-3xl font-bold text-marine sm:text-4xl">
                    Vous organisez un evenement ?
                  </h2>
                  <p className="mt-4 text-texte-light leading-relaxed">
                    Mariage, anniversaire, reunion de famille ou d&apos;entreprise
                    — nous proposons des formules sur mesure pour votre
                    evenement. Devis gratuit et sans engagement.
                  </p>
                  <Link
                    href="/evenements"
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-marine px-6 py-3 text-sm font-semibold text-creme transition-all hover:bg-marine-light"
                  >
                    Demander un devis
                  </Link>
                </div>
              </FadeIn>
              <FadeIn delay={0.1}>
                <div className="relative min-h-[300px] overflow-hidden">
                  <img
                    src="/images/plats/Saut%C3%A9%20de%20veau%20aux%20olives.png"
                    alt="Evenement - Commande groupee"
                    className="absolute inset-0 w-full h-[120%] object-cover"
                    data-parallax
                  />
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* Apercu Instagram */}
      <section className="py-16 lg:py-24" data-animate>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" data-animate-child>
          <SectionTitle
            title="Suivez-nous"
            subtitle="Retrouvez nos coulisses et nos plats du jour sur Instagram"
          />
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
