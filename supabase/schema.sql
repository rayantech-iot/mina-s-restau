-- =============================================
-- A CAS'A MINA — Schéma Supabase
-- Exécuter dans SQL Editor du dashboard Supabase
-- =============================================

-- Table: categories
create table categories (
  id uuid primary key default gen_random_uuid(),
  nom text not null,
  image_url text,
  description text,
  ordre integer not null default 0,
  created_at timestamptz not null default now()
);

-- Table: plats
create table plats (
  id uuid primary key default gen_random_uuid(),
  nom text not null,
  description text,
  image_url text not null default '',
  galerie text[] not null default '{}',
  categorie_id uuid references categories(id) on delete set null,
  prix numeric(10,2),
  afficher_prix boolean not null default false,
  statut text not null default 'disponible'
    check (statut in ('disponible', 'sur_commande', 'rupture')),
  mis_en_avant boolean not null default false,
  ordre integer not null default 0,
  created_at timestamptz not null default now()
);

-- Table: disponibilites
create table disponibilites (
  id uuid primary key default gen_random_uuid(),
  date date not null unique,
  statut_ouverture text not null default 'ouvert'
    check (statut_ouverture in ('ouvert', 'ferme')),
  broche_disponible boolean not null default false,
  reserve_evenement boolean not null default false,
  note text
);

-- Table: demandes_devis
create table demandes_devis (
  id uuid primary key default gen_random_uuid(),
  nom text not null,
  telephone text not null,
  email text not null,
  type_occasion text not null,
  date_souhaitee text not null,
  nb_convives integer not null,
  lieu text not null default '',
  preferences text,
  allergies text,
  message text,
  statut text not null default 'nouveau'
    check (statut in ('nouveau', 'en_discussion', 'confirme', 'refuse', 'termine')),
  created_at timestamptz not null default now()
);

-- Table: messages_contact
create table messages_contact (
  id uuid primary key default gen_random_uuid(),
  nom text not null,
  telephone text,
  email text,
  message text not null,
  statut text not null default 'nouveau'
    check (statut in ('nouveau', 'en_discussion', 'traite')),
  created_at timestamptz not null default now()
);

-- Table: faq
create table faq (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  reponse text not null,
  ordre integer not null default 0
);

-- Table: reglages
create table reglages (
  id uuid primary key default gen_random_uuid(),
  telephone text,
  whatsapp text,
  horaires jsonb not null default '{}'::jsonb,
  texte_a_propos text,
  adresse text,
  google_maps_url text,
  reseaux_sociaux jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- Enregistrement reglages par défaut
insert into reglages (id, horaires, reseaux_sociaux) values (
  '00000000-0000-0000-0000-000000000001',
  '{
    "lundi": {"ouverture": "11:30", "fermeture": "14:00"},
    "mardi": {"ouverture": "11:30", "fermeture": "14:00"},
    "mercredi": null,
    "jeudi": {"ouverture": "11:30", "fermeture": "14:00"},
    "vendredi": {"ouverture": "11:30", "fermeture": "14:00"},
    "samedi": {"ouverture": "11:30", "fermeture": "14:00"},
    "dimanche": null
  }'::jsonb,
  '{"instagram": "https://instagram.com/acas_a_mina"}'::jsonb
);

-- Catégories par défaut
insert into categories (nom, ordre) values
  ('Poulets rotis a la broche', 1),
  ('Plats du jour', 2),
  ('Accompagnements', 3),
  ('Entrees', 4),
  ('Desserts maison', 5),
  ('Menus speciaux', 6);

-- FAQ par défaut
insert into faq (question, reponse, ordre) values
  ('Peut-on commander a l''avance ?', 'Oui, vous pouvez passer commande par telephone a l''avance.', 1),
  ('Le poulet a la broche est-il disponible tous les jours ?', 'Non, consultez notre page Infos pratiques pour la disponibilite du jour.', 2),
  ('Proposez-vous des commandes groupees ?', 'Oui ! Rendez-vous sur notre page Evenements pour une demande de devis.', 3),
  ('Est-ce uniquement a emporter ?', 'Oui, A Cas''a Mina est un restaurant a emporter uniquement.', 4),
  ('Quels moyens de paiement acceptes ?', 'Especes et carte bancaire.', 5);

-- =============================================
-- STORAGE — Bucket pour les images
-- =============================================
insert into storage.buckets (id, name, public) values ('images', 'images', true);

-- Politique : lecture publique
create policy "Public read access"
on storage.objects for select
using (bucket_id = 'images');

-- Politique : upload pour les utilisateurs authentifies
create policy "Authenticated upload"
on storage.objects for insert
with check (bucket_id = 'images' and auth.role() = 'authenticated');

-- Politique : suppression pour les utilisateurs authentifies
create policy "Authenticated delete"
on storage.objects for delete
using (bucket_id = 'images' and auth.role() = 'authenticated');
