-- Allow public read access to site-media bucket so staff/management photos
-- (and any other public marketing images) can be displayed on the website.
CREATE POLICY "Public can read site media"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'site-media');

-- Mark the bucket as public so getPublicUrl returns directly-accessible URLs.
UPDATE storage.buckets SET public = true WHERE id = 'site-media';