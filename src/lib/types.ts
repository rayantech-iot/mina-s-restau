export interface Plat {
  id: string;
  nom: string;
  description: string | null;
  image_url: string;
  galerie: string[];
  categorie_id: string;
  prix: number | null;
  afficher_prix: boolean;
  statut: "disponible" | "sur_commande" | "rupture";
  mis_en_avant: boolean;
  ordre: number;
  created_at: string;
}

export interface Categorie {
  id: string;
  nom: string;
  image_url: string | null;
  description: string | null;
  ordre: number;
}

export interface Disponibilite {
  id: string;
  date: string;
  statut_ouverture: "ouvert" | "ferme";
  broche_disponible: boolean;
  reserve_evenement: boolean;
  note: string | null;
}

export interface DemandeDevis {
  id: string;
  nom: string;
  telephone: string;
  email: string;
  type_occasion: string;
  date_souhaitee: string;
  nb_convives: number;
  lieu: string;
  preferences: string | null;
  allergies: string | null;
  message: string | null;
  statut: "nouveau" | "en_discussion" | "confirme" | "refuse" | "termine";
  created_at: string;
}

export interface MessageContact {
  id: string;
  nom: string;
  telephone: string | null;
  email: string | null;
  message: string;
  statut: "nouveau" | "en_discussion" | "traite";
  created_at: string;
}

export interface FAQ {
  id: string;
  question: string;
  reponse: string;
  ordre: number;
}

export interface Reglages {
  id: string;
  telephone: string | null;
  whatsapp: string | null;
  horaires: Record<string, { ouverture: string; fermeture: string } | null>;
  texte_a_propos: string | null;
  adresse: string | null;
  google_maps_url: string | null;
  reseaux_sociaux: {
    instagram?: string;
    facebook?: string;
  };
}

export type StatutDemande = "nouveau" | "en_discussion" | "confirme" | "refuse" | "termine";
