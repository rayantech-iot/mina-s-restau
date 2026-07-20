"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Upload, Trash2 } from "lucide-react";

interface GalerieImage {
  id: string;
  url: string;
  alt: string;
  ordre: number;
}

export default function AdminGaleriePage() {
  const [images, setImages] = useState<GalerieImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    const { data } = await supabase
      .from("galerie_images")
      .select("*")
      .order("ordre", { ascending: true });
    setImages(data || []);
    setLoading(false);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);

    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop();
      const filePath = `galerie/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage
        .from("images")
        .upload(filePath, file);

      if (!error) {
        const { data } = supabase.storage
          .from("images")
          .getPublicUrl(filePath);

        const maxOrdre = images.reduce((max, img) => Math.max(max, img.ordre), 0);
        const { data: inserted } = await supabase
          .from("galerie_images")
          .insert({ url: data.publicUrl, alt: file.name.replace(/\.[^.]+$/, ""), ordre: maxOrdre + 1 })
          .select()
          .single();

        if (inserted) {
          setImages((prev) => [...prev, inserted]);
        }
      }
    }

    setUploading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette image de la galerie ?")) return;
    await supabase.from("galerie_images").delete().eq("id", id);
    setImages(images.filter((img) => img.id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl font-bold text-marine">Galerie</h1>
        <label className="inline-flex items-center gap-2 rounded-full bg-marine px-5 py-2.5 text-sm font-semibold text-creme transition-all hover:bg-marine-light cursor-pointer">
          <Upload size={18} />
          {uploading ? "Envoi..." : "Ajouter des photos"}
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleUpload}
            className="hidden"
          />
        </label>
      </div>

      <p className="text-sm text-texte-light mb-6">
        Ajoutez des photos à la galerie. Les plats de la carte apparaissent aussi automatiquement dans la galerie publique.
      </p>

      {loading ? (
        <div className="text-center py-16 text-texte-light">Chargement...</div>
      ) : images.length === 0 ? (
        <div className="text-center py-16 rounded-2xl bg-blanc shadow-sm">
          <Upload size={40} className="mx-auto text-texte-lighter mb-3" />
          <p className="text-texte-light">
            Aucune image supplementaire. Ajoutez des photos pour commencer.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {images.map((img) => (
            <div
              key={img.id}
              className="group relative aspect-square rounded-xl overflow-hidden bg-border-light"
            >
              <img
                src={img.url}
                alt={img.alt}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <button
                  onClick={() => handleDelete(img.id)}
                  className="rounded-full bg-error p-2 text-blanc hover:bg-error/80 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
