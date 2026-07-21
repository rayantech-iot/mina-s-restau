"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import SectionTitle from "@/components/SectionTitle";
import FadeIn from "@/components/FadeIn";
import InstagramIcon from "@/components/InstagramIcon";
import { createClient } from "@/lib/supabase/client";

interface Categorie {
  id: string;
  nom: string;
  ordre: number;
}

interface Plat {
  id: string;
  nom: string;
  description: string | null;
  image_url: string;
  categorie_id: string | null;
  prix: number | null;
  afficher_prix: boolean;
  statut: string;
}

export default function CartePage() {
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [plats, setPlats] = useState<Plat[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [catsRes, platsRes] = await Promise.all([
      supabase.from("categories").select("id, nom, ordre").order("ordre", { ascending: true }),
      supabase.from("plats").select("*").order("ordre", { ascending: true }),
    ]);
    setCategories(catsRes.data || []);
    setPlats(platsRes.data || []);
    setLoading(false);
  };

  const filtered = plats;

  return (
    <div className="py-12 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="La Carte"
          subtitle="Tous nos plats, préparés quotidiennement avec des produits frais"
        />

        <FadeIn>
          <div className="mb-10 text-center">
            <p className="text-sm text-texte-light">
              {filtered.length} plat{filtered.length > 1 ? "s" : ""} disponible{filtered.length > 1 ? "s" : ""}
            </p>
          </div>
        </FadeIn>

        {loading ? (
          <div className="text-center py-16 text-texte-light">Chargement...</div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
              {filtered.map((plat, index) => (
                <FadeIn key={plat.id} delay={index * 0.05}>
                  <Link href={`/carte/${plat.id}`} className="group block">
                    <div className="overflow-hidden rounded-2xl bg-blanc shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                      <div className="aspect-square relative bg-border-light">
                        {plat.image_url ? (
                          <img
                            src={plat.image_url}
                            alt={plat.nom}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-texte-lighter text-sm">
                            Pas de photo
                          </div>
                        )}
                      </div>
                      <div className="p-2 sm:p-4">
                        <span className="text-xs font-medium text-dore uppercase tracking-wider">
                          {categories.find((c) => c.id === plat.categorie_id)?.nom || ""}
                        </span>
                        <h3 className="mt-1 font-serif text-sm sm:text-lg font-semibold text-marine group-hover:text-dore transition-colors">
                          {plat.nom}
                        </h3>
                        {plat.description && (
                          <p className="mt-1 text-sm text-texte-light line-clamp-2">
                            {plat.description}
                          </p>
                        )}
                        {plat.afficher_prix && plat.prix != null && (
                          <p className="mt-2 text-sm font-semibold text-marine">
                            {plat.prix.toFixed(2)} €
                          </p>
                        )}
                        {plat.statut === "rupture" && (
                          <span className="mt-2 inline-block rounded-full bg-error/10 px-3 py-0.5 text-xs font-medium text-error">
                            Indisponible
                          </span>
                        )}
                        {plat.statut === "sur_commande" && (
                          <span className="mt-2 inline-block rounded-full bg-dore/10 px-3 py-0.5 text-xs font-medium text-marine">
                            Sur commande
                          </span>
                        )}
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
          </>
        )}

        {/* CTA Devis */}
        <FadeIn>
          <div className="mt-16 rounded-3xl bg-creme border border-border p-8 lg:p-12 text-center">
            <h3 className="font-serif text-2xl font-bold text-marine mb-3">
              Vous avez un projet événementiel ?
            </h3>
            <p className="text-texte-light mb-6 max-w-lg mx-auto">
              Mariage, anniversaire, réunion — nous proposons des menus sur mesure. Devis gratuit et sans engagement.
            </p>
            <Link
              href="/evenements"
              className="inline-flex items-center gap-2 rounded-full bg-marine px-6 py-3 text-sm font-semibold text-creme transition-all hover:bg-marine-light"
            >
              Demander un devis
            </Link>
          </div>
        </FadeIn>

        {/* CTA Instagram */}
        <FadeIn>
          <div className="mt-16 rounded-3xl bg-marine p-8 lg:p-12 text-center">
            <h3 className="font-serif text-2xl font-bold text-creme mb-3">
              Vous aimez nos plats ?
            </h3>
            <p className="text-creme/70 mb-6 max-w-lg mx-auto">
              Nous préparons bien d&apos;autres spécialités chaque jour.
              Découvrez nos créations sur Instagram !
            </p>
            <a
              href="https://instagram.com/acas_a_mina"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 px-6 py-3 text-sm font-semibold text-blanc transition-all hover:scale-105"
            >
              <InstagramIcon size={18} />
              Suivez-nous sur Instagram
            </a>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
