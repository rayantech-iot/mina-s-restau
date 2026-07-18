"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import SectionTitle from "@/components/SectionTitle";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { PLATS_IMAGES } from "@/lib/images";

const themes = ["Tous", "Plats", "Lieu", "Coulisses", "Événements"];

export default function GaleriePage() {
  const [filter, setFilter] = useState("Tous");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const photos = PLATS_IMAGES.map((src, i) => ({
    id: i,
    src,
    alt: `Photo ${i + 1}`,
    theme: themes[1 + (i % 4)],
  }));

  const filtered =
    filter === "Tous" ? photos : photos.filter((p) => p.theme === filter);

  const openLightbox = useCallback((index: number) => setLightbox(index), []);
  const closeLightbox = useCallback(() => setLightbox(null), []);

  const navigate = useCallback(
    (dir: number) => {
      if (lightbox === null) return;
      setLightbox((lightbox + dir + filtered.length) % filtered.length);
    },
    [lightbox, filtered.length]
  );

  return (
    <div className="py-12 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Galerie"
          subtitle="Nos plats, notre lieu, nos coulisses"
        />

        {/* Filtres */}
        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {themes.map((theme) => (
            <button
              key={theme}
              onClick={() => setFilter(theme)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                filter === theme
                  ? "bg-marine text-creme"
                  : "bg-blanc text-texte-light border border-border hover:border-marine hover:text-marine"
              }`}
            >
              {theme}
            </button>
          ))}
        </div>

        {/* Nombre de photos */}
        <p className="text-center text-sm text-texte-lighter mb-6">
          {filtered.length} photo{filtered.length > 1 ? "s" : ""}
        </p>

        {/* Grille */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {filtered.map((photo) => (
            <motion.button
              key={photo.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              onClick={() => openLightbox(photo.id)}
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
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && filtered[lightbox] && (
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
              onClick={(e) => {
                e.stopPropagation();
                navigate(-1);
              }}
              className="absolute left-4 text-creme/80 hover:text-creme transition-colors z-10"
            >
              <ChevronLeft size={40} />
            </button>

            <div
              className="relative max-w-5xl max-h-[85vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={filtered[lightbox].src}
                alt={filtered[lightbox].alt}
                className="max-h-[85vh] w-full object-contain rounded-lg"
              />
            </div>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-creme/60 text-sm">
              {lightbox + 1} / {filtered.length}
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(1);
              }}
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
