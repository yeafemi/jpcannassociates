-- Add 'editor' to the app_role enum
-- Note: PostgreSQL doesn't allow adding values to an enum within a transaction in some versions.
-- If this fails, run it outside a transaction.
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'editor';

-- Update RLS Policies for site_collections
DROP POLICY IF EXISTS "Admins can manage site collections" ON public.site_collections;

CREATE POLICY "Admins can manage site collections"
ON public.site_collections
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Editors can view and edit site collections"
ON public.site_collections
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'editor'));

CREATE POLICY "Editors can insert site collections"
ON public.site_collections
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'editor'));

CREATE POLICY "Editors can update site collections"
ON public.site_collections
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'editor'))
WITH CHECK (public.has_role(auth.uid(), 'editor'));

-- Update RLS Policies for site_pages
DROP POLICY IF EXISTS "Admins can manage site pages" ON public.site_pages;

CREATE POLICY "Admins can manage site pages"
ON public.site_pages
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Editors can view and edit site pages"
ON public.site_pages
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'editor'));

CREATE POLICY "Editors can update site pages"
ON public.site_pages
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'editor'))
WITH CHECK (public.has_role(auth.uid(), 'editor'));

-- Update RLS Policies for site_settings
DROP POLICY IF EXISTS "Admins can manage site settings" ON public.site_settings;

CREATE POLICY "Admins can manage site settings"
ON public.site_settings
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Editors can view and edit site settings"
ON public.site_settings
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'editor'));

CREATE POLICY "Editors can update site settings"
ON public.site_settings
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'editor'))
WITH CHECK (public.has_role(auth.uid(), 'editor'));

-- Update Storage Policies for site-media
DROP POLICY IF EXISTS "Admins can upload site media" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update site media" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete site media" ON storage.objects;

CREATE POLICY "Editors and Admins can upload site media"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'site-media'
  AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
);

CREATE POLICY "Editors and Admins can update site media"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'site-media'
  AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
);

CREATE POLICY "Admins can delete site media"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'site-media'
  AND public.has_role(auth.uid(), 'admin')
);

-- Allow Admins to manage all roles
DROP POLICY IF EXISTS "Admins can manage user roles" ON public.user_roles;
CREATE POLICY "Admins can manage user roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Allow Editors to see roles
CREATE POLICY "Editors can view user roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'editor'));
