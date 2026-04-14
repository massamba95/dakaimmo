-- ============================================================
-- SUPER ADMIN SETUP — Jappalé Immo
-- A executer dans Supabase SQL Editor
-- ============================================================

-- Ajouter un super admin (remplace <USER_UUID> par l'UUID de ton compte)
-- Tu peux trouver l'UUID dans Supabase > Authentication > Users
INSERT INTO super_admins (user_id)
VALUES ('<USER_UUID>')
ON CONFLICT DO NOTHING;

-- Verifier la liste des super admins
SELECT sa.user_id, p.email, p.first_name, p.last_name
FROM super_admins sa
LEFT JOIN profiles p ON p.id = sa.user_id;

-- Supprimer un super admin (si besoin)
-- DELETE FROM super_admins WHERE user_id = '<USER_UUID>';
