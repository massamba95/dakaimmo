-- Table des demandes de visite
CREATE TABLE IF NOT EXISTS visits (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE,
  org_id uuid NOT NULL,
  property_title text NOT NULL,
  visitor_name text NOT NULL,
  visitor_phone text NOT NULL,
  visitor_email text,
  requested_date date NOT NULL,
  requested_time text,
  message text,
  status text NOT NULL DEFAULT 'PENDING'
    CHECK (status IN ('PENDING', 'CONFIRMED', 'CANCELLED', 'DONE')),
  created_at timestamptz DEFAULT now()
);

-- RLS
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "org members can view visits"
  ON visits FOR SELECT
  USING (
    org_id IN (
      SELECT org_id FROM memberships
      WHERE user_id = auth.uid() AND status = 'ACTIVE'
    )
  );

CREATE POLICY "org members can update visits"
  ON visits FOR UPDATE
  USING (
    org_id IN (
      SELECT org_id FROM memberships
      WHERE user_id = auth.uid() AND status = 'ACTIVE'
    )
  );

-- Insertions publiques (visiteurs sans compte)
CREATE POLICY "public can insert visits"
  ON visits FOR INSERT
  WITH CHECK (true);

-- Index
CREATE INDEX IF NOT EXISTS visits_org_id_idx ON visits(org_id);
CREATE INDEX IF NOT EXISTS visits_property_id_idx ON visits(property_id);
CREATE INDEX IF NOT EXISTS visits_status_idx ON visits(status);
