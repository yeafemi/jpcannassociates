
-- 1. Private storage bucket for training outline files
INSERT INTO storage.buckets (id, name, public)
VALUES ('training-outlines', 'training-outlines', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: admins manage, nobody else can read/list directly
CREATE POLICY "Admins can read training outlines"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'training-outlines' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can upload training outlines"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'training-outlines' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update training outlines"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'training-outlines' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete training outlines"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'training-outlines' AND public.has_role(auth.uid(), 'admin'));

-- 2. Leads table for outline download requests
CREATE TABLE public.training_outline_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  training_id UUID REFERENCES public.site_collections(id) ON DELETE SET NULL,
  training_slug TEXT,
  training_title TEXT NOT NULL,
  full_name TEXT NOT NULL,
  telephone TEXT NOT NULL,
  email TEXT NOT NULL,
  organization TEXT NOT NULL,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_outline_leads_training_id ON public.training_outline_leads(training_id);
CREATE INDEX idx_outline_leads_created_at ON public.training_outline_leads(created_at DESC);

ALTER TABLE public.training_outline_leads ENABLE ROW LEVEL SECURITY;

-- Public can submit a lead (the form is on a public page)
CREATE POLICY "Anyone can submit an outline lead"
ON public.training_outline_leads FOR INSERT TO anon, authenticated
WITH CHECK (
  char_length(full_name) BETWEEN 1 AND 200
  AND char_length(telephone) BETWEEN 5 AND 40
  AND char_length(email) BETWEEN 3 AND 320
  AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND char_length(organization) BETWEEN 1 AND 200
  AND char_length(training_title) BETWEEN 1 AND 500
);

-- Only admins can read / update / delete leads
CREATE POLICY "Admins can read outline leads"
ON public.training_outline_leads FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update outline leads"
ON public.training_outline_leads FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete outline leads"
ON public.training_outline_leads FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
