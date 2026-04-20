-- Triggers SQL pour enforcer les limites de plan côté base de données
-- Empêche tout contournement via API directe

-- 1. Trigger sur properties : bloquer l'INSERT si limite atteinte
CREATE OR REPLACE FUNCTION enforce_property_limit()
RETURNS TRIGGER AS $$
DECLARE
  current_count INTEGER;
  max_allowed INTEGER;
BEGIN
  SELECT max_properties INTO max_allowed
  FROM organizations
  WHERE id = NEW.org_id;

  IF max_allowed IS NULL THEN
    RAISE EXCEPTION 'Organisation introuvable';
  END IF;

  SELECT COUNT(*) INTO current_count
  FROM properties
  WHERE org_id = NEW.org_id;

  IF current_count >= max_allowed THEN
    RAISE EXCEPTION 'Limite de % bien(s) atteinte pour votre plan. Mettez à niveau pour en ajouter plus.', max_allowed
      USING ERRCODE = 'check_violation';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS enforce_property_limit_trigger ON properties;
CREATE TRIGGER enforce_property_limit_trigger
  BEFORE INSERT ON properties
  FOR EACH ROW EXECUTE FUNCTION enforce_property_limit();

-- 2. Trigger sur memberships : bloquer l'INSERT d'un membre ACTIVE si limite atteinte
CREATE OR REPLACE FUNCTION enforce_membership_limit()
RETURNS TRIGGER AS $$
DECLARE
  current_count INTEGER;
  max_allowed INTEGER;
BEGIN
  -- Seuls les memberships ACTIVE comptent
  IF NEW.status != 'ACTIVE' THEN
    RETURN NEW;
  END IF;

  SELECT max_members INTO max_allowed
  FROM organizations
  WHERE id = NEW.org_id;

  IF max_allowed IS NULL THEN
    RAISE EXCEPTION 'Organisation introuvable';
  END IF;

  SELECT COUNT(*) INTO current_count
  FROM memberships
  WHERE org_id = NEW.org_id
    AND status = 'ACTIVE'
    AND (TG_OP = 'INSERT' OR id != NEW.id);

  IF current_count >= max_allowed THEN
    RAISE EXCEPTION 'Limite de % membre(s) atteinte pour votre plan.', max_allowed
      USING ERRCODE = 'check_violation';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS enforce_membership_limit_trigger ON memberships;
CREATE TRIGGER enforce_membership_limit_trigger
  BEFORE INSERT OR UPDATE OF status ON memberships
  FOR EACH ROW EXECUTE FUNCTION enforce_membership_limit();
