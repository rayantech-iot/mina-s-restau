"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import FadeIn from "@/components/FadeIn";
import { createClient } from "@/lib/supabase/client";

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

interface Categorie {
  id: string;
  nom: string;
}

export default function PlatDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [plat, setPlat] = useState<Plat | null>(null);
  const [categorie, setCategorie] = useState<Categorie | null>(null);
  const [loading, setLoading] = useState(true);
  const [telephone, setTelephone] = useState("0676772275");
  const supabase = createClient();

  useEffect(() => {
    loadPlat();
    supabase.from("reglages").select("telephone").limit(1).single().then(({ data }) => {
      if (data?.telephone) setTelephone(data.telephone.replace(/\s/g, ""));
    });
  }, []);

  const loadPlat = async () => {
    const { data: p } = await supabase.from("plats").select("*").eq("id", id).single();
    if (p) {
      setPlat(p);
      if (p.categorie_id) {
        const { data: c } = await supabase.from("categories").select("id, nom").eq("id", p.categorie_id).single();
        setCategorie(c);
      }
    }
    setLoading(false);
  };

  if (loading) {
    return <div className="text-center py-20 text-texte-light">Chargement...</div>;
  }

  if (!plat) {
    return (
      <div className="text-center py-20">
        <p className="text-texte-light mb-4">Plat introuvable.</p>
        <Link href="/carte" className="text-marine underline hover:text-dore">
          Retour à la carte
        </Link>
      </div>
    );
  }

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
            <div className="rounded-3xl overflow-hidden shadow-xl aspect-square relative bg-border-light">
              {plat.image_url ? (
                <img
                  src={plat.image_url}
                  alt={plat.nom}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-texte-lighter">
                  Pas de photo
                </div>
              )}
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
            <div className="flex flex-col justify-center">
              {categorie && (
                <span className="text-sm font-medium text-dore uppercase tracking-wider">
                  {categorie.nom}
                </span>
              )}
              <h1 className="mt-2 font-serif text-3xl font-bold text-marine sm:text-4xl lg:text-5xl">
                {plat.nom}
              </h1>
              {plat.description && (
                <p className="mt-4 text-texte-light leading-relaxed">
                  {plat.description}
                </p>
              )}
              <div className="mt-4 flex items-center gap-3">
                <span
                  className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-medium ${
                    plat.statut === "disponible"
                      ? "bg-success/10 text-success"
                      : plat.statut === "sur_commande"
                      ? "bg-dore/10 text-marine"
                      : "bg-error/10 text-error"
                  }`}
                >
                  {plat.statut === "disponible"
                    ? "Disponible"
                    : plat.statut === "sur_commande"
                    ? "Sur commande"
                    : "Indisponible"}
                </span>
                {plat.afficher_prix && plat.prix != null && (
                  <span className="text-lg font-bold text-marine">
                    {plat.prix.toFixed(2)} €
                  </span>
                )}
              </div>
              <div className="mt-8">
                <a
                  href={`tel:${telephone}`}
                  className="inline-flex items-center gap-2 rounded-full bg-marine px-6 py-3 text-sm font-semibold text-creme transition-all hover:bg-marine-light"
                >
                  Commander par téléphone
                </a>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
