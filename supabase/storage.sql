-- Creer le bucket pour les photos des biens
INSERT INTO storage.buckets (id, name, public)
VALUES ('property-photos', 'property-photos', true);

-- Politique : les utilisateurs authentifies peuvent uploader
CREATE POLICY "Authenticated users can upload photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'property-photos');

-- Politique : tout le monde peut voir les photos (public)
CREATE POLICY "Anyone can view photos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'property-photos');

-- Politique : les utilisateurs peuvent supprimer leurs photos
CREATE POLICY "Users can delete their photos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'property-photos');
