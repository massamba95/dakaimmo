-- ============================================================
-- MIGRATION MULTI-TENANT — Jappale Immo
-- A executer dans Supabase SQL Editor
-- ============================================================

-- 1. Table organisations
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  plan TEXT NOT NULL DEFAULT 'FREE' CHECK (plan IN ('FREE', 'PRO', 'AGENCY', 'ENTERPRISE')),
  status TEXT NOT NULL DEFAULT 'TRIAL' CHECK (status IN ('ACTIVE', 'TRIAL', 'BLOCKED', 'CANCELLED')),
  max_properties INTEGER NOT NULL DEFAULT 2,
  max_members INTEGER NOT NULL DEFAULT 1,
  trial_ends_at TIMESTAMPTZ,
  blocked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 2. Table memberships (utilisateur <-> organisation)
CREATE TABLE memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL DEFAULT 'AGENT' CHECK (role IN ('ADMIN', 'MANAGER', 'AGENT', 'ACCOUNTANT', 'SECRETARY')),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(org_id, user_id)
);

-- 3. Table subscriptions
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  plan TEXT NOT NULL,
  amount INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'PAST_DUE', 'CANCELLED')),
  payment_method TEXT,
  current_period_start DATE NOT NULL,
  current_period_end DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 4. Table super_admins
CREATE TABLE super_admins (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY
);

-- 5. Ajouter org_id aux tables existantes
ALTER TABLE properties ADD COLUMN org_id UUID REFERENCES organizations(id) ON DELETE CASCADE;
ALTER TABLE tenants ADD COLUMN org_id UUID REFERENCES organizations(id) ON DELETE CASCADE;

-- 6. Index
CREATE INDEX idx_memberships_org_id ON memberships(org_id);
CREATE INDEX idx_memberships_user_id ON memberships(user_id);
CREATE INDEX idx_subscriptions_org_id ON subscriptions(org_id);
CREATE INDEX idx_properties_org_id ON properties(org_id);
CREATE INDEX idx_tenants_org_id ON tenants(org_id);

-- 7. RLS sur les nouvelles tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE super_admins ENABLE ROW LEVEL SECURITY;

-- Organizations: membres peuvent voir leur org
CREATE POLICY "Members can view their organization"
  ON organizations FOR SELECT USING (
    id IN (SELECT org_id FROM memberships WHERE user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM super_admins WHERE user_id = auth.uid())
  );

CREATE POLICY "Super admins can view all organizations"
  ON organizations FOR ALL USING (
    EXISTS (SELECT 1 FROM super_admins WHERE user_id = auth.uid())
  );

CREATE POLICY "Anyone can insert organization on signup"
  ON organizations FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can update their organization"
  ON organizations FOR UPDATE USING (
    id IN (SELECT org_id FROM memberships WHERE user_id = auth.uid() AND role = 'ADMIN')
  );

-- Memberships: membres voient les membres de leur org
CREATE POLICY "Members can view memberships in their org"
  ON memberships FOR SELECT USING (
    org_id IN (SELECT org_id FROM memberships AS m WHERE m.user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM super_admins WHERE user_id = auth.uid())
  );

CREATE POLICY "Anyone can insert membership on signup"
  ON memberships FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can manage memberships"
  ON memberships FOR ALL USING (
    org_id IN (SELECT org_id FROM memberships AS m WHERE m.user_id = auth.uid() AND m.role = 'ADMIN')
  );

-- Subscriptions: admins de l'org peuvent voir
CREATE POLICY "Admins can view subscriptions"
  ON subscriptions FOR SELECT USING (
    org_id IN (SELECT org_id FROM memberships WHERE user_id = auth.uid() AND role = 'ADMIN')
    OR EXISTS (SELECT 1 FROM super_admins WHERE user_id = auth.uid())
  );

CREATE POLICY "Super admins can manage subscriptions"
  ON subscriptions FOR ALL USING (
    EXISTS (SELECT 1 FROM super_admins WHERE user_id = auth.uid())
  );

-- Super admins: seuls les super admins se voient
CREATE POLICY "Super admins can view super_admins"
  ON super_admins FOR SELECT USING (
    EXISTS (SELECT 1 FROM super_admins AS sa WHERE sa.user_id = auth.uid())
  );

-- 8. Mettre a jour les policies de properties pour org_id
DROP POLICY IF EXISTS "Users can view their own properties" ON properties;
DROP POLICY IF EXISTS "Users can insert their own properties" ON properties;
DROP POLICY IF EXISTS "Users can update their own properties" ON properties;
DROP POLICY IF EXISTS "Users can delete their own properties" ON properties;

CREATE POLICY "Members can view org properties"
  ON properties FOR SELECT USING (
    org_id IN (SELECT org_id FROM memberships WHERE user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM super_admins WHERE user_id = auth.uid())
  );

CREATE POLICY "Members can insert org properties"
  ON properties FOR INSERT WITH CHECK (
    org_id IN (SELECT org_id FROM memberships WHERE user_id = auth.uid())
  );

CREATE POLICY "Members can update org properties"
  ON properties FOR UPDATE USING (
    org_id IN (SELECT org_id FROM memberships WHERE user_id = auth.uid())
  );

CREATE POLICY "Admins and managers can delete org properties"
  ON properties FOR DELETE USING (
    org_id IN (SELECT org_id FROM memberships WHERE user_id = auth.uid() AND role IN ('ADMIN', 'MANAGER'))
  );

-- 9. Mettre a jour les policies de tenants pour org_id
DROP POLICY IF EXISTS "Users can view their own tenants" ON tenants;
DROP POLICY IF EXISTS "Users can insert their own tenants" ON tenants;
DROP POLICY IF EXISTS "Users can update their own tenants" ON tenants;
DROP POLICY IF EXISTS "Users can delete their own tenants" ON tenants;

CREATE POLICY "Members can view org tenants"
  ON tenants FOR SELECT USING (
    org_id IN (SELECT org_id FROM memberships WHERE user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM super_admins WHERE user_id = auth.uid())
  );

CREATE POLICY "Members can insert org tenants"
  ON tenants FOR INSERT WITH CHECK (
    org_id IN (SELECT org_id FROM memberships WHERE user_id = auth.uid())
  );

CREATE POLICY "Members can update org tenants"
  ON tenants FOR UPDATE USING (
    org_id IN (SELECT org_id FROM memberships WHERE user_id = auth.uid())
  );

CREATE POLICY "Admins and managers can delete org tenants"
  ON tenants FOR DELETE USING (
    org_id IN (SELECT org_id FROM memberships WHERE user_id = auth.uid() AND role IN ('ADMIN', 'MANAGER'))
  );

-- Les policies de leases et payments restent basees sur property_id
-- donc elles fonctionnent deja via la relation avec properties

-- 10. Fonction helper pour recuperer l'org_id de l'utilisateur connecte
CREATE OR REPLACE FUNCTION get_user_org_id()
RETURNS UUID AS $$
  SELECT org_id FROM memberships WHERE user_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER;

-- 11. Fonction helper pour recuperer le role
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT AS $$
  SELECT role FROM memberships WHERE user_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER;
