-- =============================================
-- A CAS'A MINA — Schema Supabase (Update)
-- Execute dans SQL Editor du dashboard Supabase
-- =============================================

-- Table: galerie_images (photos supplementaires hors carte)
create table if not exists galerie_images (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  alt text not null default '',
  ordre integer not null default 0,
  created_at timestamptz not null default now()
);

-- Policy: lecture publique galerie
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Public read galerie'
  ) THEN
    create policy "Public read galerie"
    on galerie_images for select
    using (true);
  END IF;
END $$;

-- Policy: insert/update/delete pour utilisateurs authentifies
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Auth write galerie'
  ) THEN
    create policy "Auth write galerie"
    on galerie_images for all
    using (auth.role() = 'authenticated');
  END IF;
END $$;

-- Ajouter champ email_notification aux reglages
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'reglages' AND column_name = 'email_notification'
  ) THEN
    ALTER TABLE reglages ADD COLUMN email_notification jsonb not null default '{}'::jsonb;
  END IF;
END $$;
