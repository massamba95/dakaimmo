-- Espace locataire : user_id sur tenants + table issues + RLS safe (via SECURITY DEFINER)

-- 1. Lier un locataire à un compte auth.users (nullable)
ALTER TABLE tenants
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS invited_at timestamptz;

CREATE INDEX IF NOT EXISTS tenants_auth_user_id_idx ON tenants(user_id);

-- 2. Table des signalements
CREATE TABLE IF NOT EXISTS issues (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id uuid NOT NULL,
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
  property_id uuid REFERENCES properties(id) ON DELETE SET NULL,
  lease_id uuid REFERENCES leases(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text NOT NULL,
  category text DEFAULT 'OTHER'
    CHECK (category IN ('PLUMBING', 'ELECTRICITY', 'APPLIANCE', 'HEATING', 'STRUCTURE', 'OTHER')),
  status text NOT NULL DEFAULT 'OPEN'
    CHECK (status IN ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED')),
  created_at timestamptz DEFAULT now() NOT NULL,
  resolved_at timestamptz
);

CREATE INDEX IF NOT EXISTS issues_org_id_idx ON issues(org_id);
CREATE INDEX IF NOT EXISTS issues_tenant_id_idx ON issues(tenant_id);
CREATE INDEX IF NOT EXISTS issues_status_idx ON issues(status);

ALTER TABLE issues ENABLE ROW LEVEL SECURITY;

-- Policies pour l'agence
CREATE POLICY "org members view issues" ON issues FOR SELECT
  USING (org_id IN (SELECT org_id FROM memberships WHERE user_id = auth.uid() AND status = 'ACTIVE'));

CREATE POLICY "org members update issues" ON issues FOR UPDATE
  USING (org_id IN (SELECT org_id FROM memberships WHERE user_id = auth.uid() AND status = 'ACTIVE'));

-- 3. Fonctions SECURITY DEFINER — bypass RLS pour éviter la récursion
CREATE OR REPLACE FUNCTION public.auth_tenant_id() RETURNS uuid
LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT id FROM public.tenants WHERE user_id = auth.uid() LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.auth_tenant_property_ids() RETURNS setof uuid
LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT DISTINCT property_id FROM public.leases
  WHERE tenant_id = public.auth_tenant_id() AND property_id IS NOT NULL;
$$;

CREATE OR REPLACE FUNCTION public.auth_tenant_lease_ids() RETURNS setof uuid
LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT id FROM public.leases WHERE tenant_id = public.auth_tenant_id();
$$;

-- 4. Policies pour le locataire (safe, sans récursion)
CREATE POLICY "tenant views self" ON tenants FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "tenant views own leases" ON leases FOR SELECT
  USING (tenant_id = public.auth_tenant_id());

CREATE POLICY "tenant views own payments" ON payments FOR SELECT
  USING (lease_id IN (SELECT public.auth_tenant_lease_ids()));

CREATE POLICY "tenant views own property" ON properties FOR SELECT
  USING (id IN (SELECT public.auth_tenant_property_ids()));

CREATE POLICY "tenant views own issues" ON issues FOR SELECT
  USING (tenant_id = public.auth_tenant_id());

CREATE POLICY "tenant creates own issues" ON issues FOR INSERT
  WITH CHECK (tenant_id = public.auth_tenant_id());
