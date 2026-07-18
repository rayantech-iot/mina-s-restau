"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, Upload, X, Trash2 } from "lucide-react";
import Link from "next/link";

interface Categorie {
  id: string;
  nom: string;
}

interface Plat {
  id: string;
  nom: string;
  description: string | null;
  image_url: string;
  galerie: string[];
  categorie_id: string | null;
  prix: number | null;
  afficher_prix: boolean;
  statut: string;
  mis_en_avant: boolean;
  ordre: number;
}

export default function EditPlatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const supabase = createClient();
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [nom, setNom] = useState("");
  const [description, setDescription] = useState("");
  const [categorieId, setCategorieId] = useState("");
  const [prix, setPrix] = useState("");
  const [afficherPrix, setAfficherPrix] = useState(false);
  const [statut, setStatut] = useState("disponible");
  const [misEnAvant, setMisEnAvant] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [platsRes, catsRes] = await Promise.all([
      supabase.from("plats").select("*").eq("id", id).single(),
      supabase.from("categories").select("id, nom").order("ordre", { ascending: true }),
    ]);

    if (platsRes.data) {
      const p = platsRes.data as Plat;
      setNom(p.nom);
      setDescription(p.description || "");
      setCategorieId(p.categorie_id || "");
      setPrix(p.prix?.toString() || "");
      setAfficherPrix(p.afficher_prix);
      setStatut(p.statut);
      setMisEnAvant(p.mis_en_avant);
      setImagePreview(p.image_url || null);
    }

    setCategories(catsRes.data || []);
    setLoading(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nom.trim()) return;
    setSaving(true);

    let imageUrl = imagePreview || "";

    if (imageFile) {
      const ext = imageFile.name.split(".").pop();
      const filePath = `plats/${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(filePath, imageFile);

      if (!uploadError) {
        const { data: urlData } = supabase.storage
          .from("images")
          .getPublicUrl(filePath);
        imageUrl = urlData.publicUrl;
      }
    }

    const { error } = await supabase
      .from("plats")
      .update({
        nom: nom.trim(),
        description: description.trim() || null,
        categorie_id: categorieId || null,
        image_url: imageUrl,
        prix: afficherPrix && prix ? parseFloat(prix) : null,
        afficher_prix: afficherPrix,
        statut,
        mis_en_avant: misEnAvant,
      })
      .eq("id", id);

    if (error) {
      alert("Erreur: " + error.message);
      setSaving(false);
      return;
    }

    router.push("/admin/plats");
  };

  if (loading) {
    return <div className="text-center py-12 text-texte-light">Chargement...</div>;
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/plats"
          className="rounded-lg p-2 text-texte-light hover:bg-marine/10 hover:text-marine transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="font-serif text-3xl font-bold text-marine">
          Modifier le plat
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="rounded-2xl bg-blanc p-6 shadow-sm space-y-6">
          {/* Photo principale */}
          <div>
            <label className="block text-sm font-medium text-texte mb-2">
              Photo principale
            </label>
            <div className="relative">
              {imagePreview ? (
                <div className="relative h-48 rounded-xl overflow-hidden">
                  <Image
                    src={imagePreview}
                    alt="Apercu"
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 rounded-full bg-black/50 p-1.5 text-blanc hover:bg-black/70"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <label className="flex cursor-pointer flex-col items-center justify-center h-48 rounded-xl border-2 border-dashed border-border hover:border-marine transition-colors bg-creme">
                  <Upload size={32} className="text-texte-lighter mb-2" />
                  <span className="text-sm text-texte-light">
                    Cliquez pour changer la photo
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Nom */}
          <div>
            <label className="block text-sm font-medium text-texte mb-1">
              Nom du plat *
            </label>
            <input
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              required
              placeholder="Ex: Poulet roti a la broche"
              className="w-full rounded-lg border border-border bg-creme px-4 py-3 text-sm text-texte focus:border-marine focus:ring-2 focus:ring-marine/20 outline-none transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-texte mb-1">
              Description{" "}
              <span className="text-texte-lighter">(optionnelle)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Decrivez le plat en quelques mots..."
              className="w-full rounded-lg border border-border bg-creme px-4 py-3 text-sm text-texte focus:border-marine focus:ring-2 focus:ring-marine/20 outline-none transition-all resize-none"
            />
          </div>

          {/* Categorie */}
          <div>
            <label className="block text-sm font-medium text-texte mb-1">
              Categorie
            </label>
            <select
              value={categorieId}
              onChange={(e) => setCategorieId(e.target.value)}
              className="w-full rounded-lg border border-border bg-creme px-4 py-3 text-sm text-texte focus:border-marine focus:ring-2 focus:ring-marine/20 outline-none transition-all"
            >
              <option value="">Choisir une categorie</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nom}
                </option>
              ))}
            </select>
          </div>

          {/* Prix */}
          <div className="flex items-start gap-4">
            <div className="flex items-center gap-2 pt-8">
              <button
                type="button"
                onClick={() => setAfficherPrix(!afficherPrix)}
                className={`h-5 w-9 rounded-full transition-colors ${
                  afficherPrix ? "bg-dore" : "bg-border"
                }`}
              >
                <span
                  className={`block h-4 w-4 rounded-full bg-blanc shadow transition-transform ${
                    afficherPrix ? "translate-x-4" : "translate-x-0.5"
                  }`}
                />
              </button>
              <label className="text-sm text-texte">
                Afficher un prix
              </label>
            </div>
            {afficherPrix && (
              <div className="flex-1">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={prix}
                  onChange={(e) => setPrix(e.target.value)}
                  placeholder="0.00"
                  className="w-full rounded-lg border border-border bg-creme px-4 py-3 text-sm text-texte focus:border-marine focus:ring-2 focus:ring-marine/20 outline-none transition-all"
                />
              </div>
            )}
          </div>

          {/* Statut */}
          <div>
            <label className="block text-sm font-medium text-texte mb-2">
              Statut
            </label>
            <div className="flex gap-2">
              {[
                { value: "disponible", label: "Disponible", color: "success" },
                { value: "sur_commande", label: "Sur commande", color: "dore" },
                { value: "rupture", label: "Rupture", color: "error" },
              ].map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setStatut(s.value)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                    statut === s.value
                      ? s.color === "success"
                        ? "bg-success text-blanc"
                        : s.color === "dore"
                        ? "bg-dore text-marine"
                        : "bg-error text-blanc"
                      : "bg-creme text-texte-light border border-border hover:border-marine"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mis en avant */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMisEnAvant(!misEnAvant)}
              className={`h-5 w-9 rounded-full transition-colors ${
                misEnAvant ? "bg-dore" : "bg-border"
              }`}
            >
              <span
                className={`block h-4 w-4 rounded-full bg-blanc shadow transition-transform ${
                  misEnAvant ? "translate-x-4" : "translate-x-0.5"
                }`}
              />
            </button>
            <label className="text-sm text-texte">
              Mis en avant sur la page d&apos;accueil
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <button
            type="submit"
            disabled={saving || !nom.trim()}
            className="inline-flex items-center gap-2 rounded-full bg-marine px-8 py-3 text-sm font-semibold text-creme transition-all hover:bg-marine-light disabled:opacity-50"
          >
            {saving ? "Enregistrement..." : "Enregistrer les modifications"}
          </button>
          <Link
            href="/admin/plats"
            className="inline-flex items-center rounded-full border border-border px-6 py-3 text-sm font-medium text-texte-light transition-all hover:border-marine hover:text-marine"
          >
            Annuler
          </Link>
        </div>
      </form>
    </div>
  );
}
