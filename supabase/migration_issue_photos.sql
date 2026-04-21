-- Photos sur les signalements + bucket storage

-- 1. Colonne photos sur issues
ALTER TABLE issues ADD COLUMN IF NOT EXISTS photos text[] DEFAULT '{}';

-- 2. Bucket issue-photos (public)
INSERT INTO storage.buckets (id, name, public)
VALUES ('issue-photos', 'issue-photos', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Policies storage
CREATE POLICY "Authenticated can upload issue photos"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'issue-photos');

CREATE POLICY "Anyone can view issue photos"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'issue-photos');

CREATE POLICY "Authenticated can delete issue photos"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'issue-photos');
