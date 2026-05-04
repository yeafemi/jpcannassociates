DROP POLICY IF EXISTS "Public can read site media" ON storage.objects;

UPDATE storage.buckets
SET public = false
WHERE id = 'site-media';