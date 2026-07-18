"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionTitle from "@/components/SectionTitle";
import PlaceholderImage from "@/components/PlaceholderImage";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const themes = ["Tous", "Plats", "Lieu", "Coulisses", "Événements"];

const photos = Array.from({ length: 12 }).map((_, i) => ({
  id: i,
  src: `/images/galerie/${i + 1}.jpg`,
  alt: `Photo ${i + 1}`,
  theme: themes[1 + (i % 4)],
}));

export default function GaleriePage() {
  const [filter, setFilter] = useState("Tous");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered =
    filter === "Tous" ? photos : photos.filter((p) => p.theme === filter);

  const openLightbox = (index: number) => setLightbox(index);
  const closeLightbox = () => setLightbox(null);

  const navigate = (dir: number) => {
    if (lightbox === null) return;
    setLightbox((lightbox + dir + filtered.length) % filtered.length);
  };

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

        {/* Grille */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {filtered.map((photo, index) => (
            <motion.button
              key={photo.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => openLightbox(index)}
              className="group aspect-square overflow-hidden rounded-xl focus:outline-none focus:ring-2 focus:ring-marine"
            >
              <div className="relative w-full h-full bg-border-light">
                <PlaceholderImage
                  alt={photo.alt}
                  size="sm"
                  className="w-full h-full transition-transform duration-500 group-hover:scale-110"
                />
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-creme/80 hover:text-creme transition-colors"
            >
              <X size={32} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(-1);
              }}
              className="absolute left-4 text-creme/80 hover:text-creme transition-colors"
            >
              <ChevronLeft size={40} />
            </button>

            <div
              className="relative max-w-4xl max-h-[80vh] w-full aspect-square"
              onClick={(e) => e.stopPropagation()}
            >
              <PlaceholderImage
                alt={filtered[lightbox]?.alt || ""}
                size="xl"
                className="w-full h-full rounded-lg"
              />
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(1);
              }}
              className="absolute right-4 text-creme/80 hover:text-creme transition-colors"
            >
              <ChevronRight size={40} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
