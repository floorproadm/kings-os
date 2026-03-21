
-- Gallery images table
CREATE TABLE public.gallery_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID NOT NULL DEFAULT '73bfe84c-57d2-456e-8453-869a7f8c05af' REFERENCES public.organizations(id),
  category TEXT NOT NULL,
  title TEXT,
  image_url TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

-- Public can read active images
CREATE POLICY "gallery: public read active"
  ON public.gallery_images FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Authenticated org members can manage
CREATE POLICY "gallery: org read all"
  ON public.gallery_images FOR SELECT
  TO authenticated
  USING (org_id = get_user_org_id());

CREATE POLICY "gallery: org insert"
  ON public.gallery_images FOR INSERT
  TO authenticated
  WITH CHECK (org_id = get_user_org_id());

CREATE POLICY "gallery: org update"
  ON public.gallery_images FOR UPDATE
  TO authenticated
  USING (org_id = get_user_org_id());

CREATE POLICY "gallery: org delete"
  ON public.gallery_images FOR DELETE
  TO authenticated
  USING (org_id = get_user_org_id());

-- Storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('gallery', 'gallery', true);

-- Storage policies
CREATE POLICY "gallery storage: public read"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'gallery');

CREATE POLICY "gallery storage: auth upload"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'gallery');

CREATE POLICY "gallery storage: auth delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'gallery');
