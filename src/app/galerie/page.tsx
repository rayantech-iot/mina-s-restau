"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionTitle from "@/components/SectionTitle";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface GalerieImage {
  id: string;
  url: string;
  alt: string;
}

interface PlatImage {
  id: string;
  image_url: string;
  nom: string;
}

export default function GaleriePage() {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [allImages, setAllImages] = useState<{ id: string; src: string; alt: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    const [platsRes, galerieRes] = await Promise.all([
      supabase.from("plats").select("id, image_url, nom").not("image_url", "eq", ""),
      supabase.from("galerie_images").select("id, url, alt").order("ordre", { ascending: true }),
    ]);

    const platImages: { id: string; src: string; alt: string }[] =
      (platsRes.data || []).map((p: PlatImage) => ({
        id: `plat-${p.id}`,
        src: p.image_url,
        alt: p.nom,
      }));

    const galerieImages: { id: string; src: string; alt: string }[] =
      (galerieRes.data || []).map((g: GalerieImage) => ({
        id: g.id,
        src: g.url,
        alt: g.alt,
      }));

    setAllImages([...platImages, ...galerieImages]);
    setLoading(false);
  };

  const openLightbox = useCallback((index: number) => setLightbox(index), []);
  const closeLightbox = useCallback(() => setLightbox(null), []);

  const navigate = useCallback(
    (dir: number) => {
      if (lightbox === null) return;
      setLightbox((lightbox + dir + allImages.length) % allImages.length);
    },
    [lightbox, allImages.length]
  );

  return (
    <div className="py-12 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Galerie"
          subtitle="Nos plats, nos creations, nos coulisses"
        />

        {loading ? (
          <div className="text-center py-16 text-texte-light">Chargement...</div>
        ) : (
          <>
            <p className="text-center text-sm text-texte-lighter mb-6">
              {allImages.length} photo{allImages.length > 1 ? "s" : ""}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {allImages.map((photo) => (
                <motion.button
                  key={photo.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => openLightbox(allImages.indexOf(photo))}
                  className="group relative aspect-square focus:outline-none focus:ring-2 focus:ring-marine rounded-xl overflow-hidden bg-border-light"
                >
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-marine/0 transition-colors group-hover:bg-marine/20" />
                </motion.button>
              ))}
            </div>
          </>
        )}
      </div>

      <AnimatePresence>
        {lightbox !== null && allImages[lightbox] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-creme/80 hover:text-creme transition-colors z-10"
            >
              <X size={32} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); navigate(-1); }}
              className="absolute left-4 text-creme/80 hover:text-creme transition-colors z-10"
            >
              <ChevronLeft size={40} />
            </button>
            <div className="relative max-w-5xl max-h-[85vh] w-full" onClick={(e) => e.stopPropagation()}>
              <img
                src={allImages[lightbox].src}
                alt={allImages[lightbox].alt}
                className="max-h-[85vh] w-full object-contain rounded-lg"
              />
            </div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-creme/60 text-sm">
              {allImages[lightbox].alt} — {lightbox + 1} / {allImages.length}
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); navigate(1); }}
              className="absolute right-4 text-creme/80 hover:text-creme transition-colors z-10"
            >
              <ChevronRight size={40} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
