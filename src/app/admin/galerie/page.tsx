"use client";

import { useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { Upload, Trash2, X } from "lucide-react";

export default function AdminGaleriePage() {
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const supabase = createClient();

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
        setImages((prev) => [data.publicUrl, ...prev]);
      }
    }

    setUploading(false);
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
        Ajoutez des photos à la galerie générale du site. Les images seront
        visibles dans la section Galerie du site public.
      </p>

      {images.length === 0 ? (
        <div className="text-center py-16 rounded-2xl bg-blanc shadow-sm">
          <Upload size={40} className="mx-auto text-texte-lighter mb-3" />
          <p className="text-texte-light">
            Aucune image. Ajoutez des photos pour commencer.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {images.map((src, i) => (
            <div
              key={i}
              className="group relative aspect-square rounded-xl overflow-hidden bg-border-light"
            >
              <Image
                src={src}
                alt={`Galerie ${i + 1}`}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <button className="rounded-full bg-error p-2 text-blanc hover:bg-error/80 transition-colors">
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
