-- Ajout du support immeuble/résidence sur la table properties

-- 1. Nouvelles colonnes
ALTER TABLE properties
  ADD COLUMN IF NOT EXISTS parent_id uuid REFERENCES properties(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS unit_label text,
  ADD COLUMN IF NOT EXISTS floor integer;

-- 2. Ajouter le type BUILDING au CHECK constraint
-- (Supabase ne supporte pas ALTER CONSTRAINT directement, on drop et recrée)
ALTER TABLE properties DROP CONSTRAINT IF EXISTS properties_type_check;
ALTER TABLE properties ADD CONSTRAINT properties_type_check
  CHECK (type IN ('APARTMENT', 'HOUSE', 'COMMERCIAL', 'LAND', 'BUILDING'));

-- 3. Index pour les requêtes parent/enfant
CREATE INDEX IF NOT EXISTS properties_parent_id_idx ON properties(parent_id);
