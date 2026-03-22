
-- Create hero_media table for storing hero background media URLs per device
CREATE TABLE public.hero_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL DEFAULT '73bfe84c-57d2-456e-8453-869a7f8c05af'::uuid,
  device text NOT NULL CHECK (device IN ('desktop', 'tablet', 'mobile')),
  media_type text NOT NULL DEFAULT 'video' CHECK (media_type IN ('video', 'image')),
  media_url text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (org_id, device)
);

ALTER TABLE public.hero_media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "hero_media: public read active" ON public.hero_media
  FOR SELECT TO anon, authenticated USING (is_active = true);

CREATE POLICY "hero_media: org read all" ON public.hero_media
  FOR SELECT TO authenticated USING (org_id = get_user_org_id());

CREATE POLICY "hero_media: org insert" ON public.hero_media
  FOR INSERT TO authenticated WITH CHECK (org_id = get_user_org_id());

CREATE POLICY "hero_media: org update" ON public.hero_media
  FOR UPDATE TO authenticated USING (org_id = get_user_org_id());

CREATE POLICY "hero_media: org delete" ON public.hero_media
  FOR DELETE TO authenticated USING (org_id = get_user_org_id());

-- Create storage bucket for hero media
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('hero-media', 'hero-media', true, 52428800);

-- Storage policies
CREATE POLICY "hero_media_public_read" ON storage.objects
  FOR SELECT TO anon, authenticated USING (bucket_id = 'hero-media');

CREATE POLICY "hero_media_auth_insert" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'hero-media');

CREATE POLICY "hero_media_auth_update" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'hero-media');

CREATE POLICY "hero_media_auth_delete" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'hero-media');
