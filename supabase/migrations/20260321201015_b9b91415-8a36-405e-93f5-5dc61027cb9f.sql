
-- Services table for dynamic homepage services section
CREATE TABLE public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL DEFAULT '73bfe84c-57d2-456e-8453-869a7f8c05af'::uuid,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  icon_name text NOT NULL DEFAULT 'Sparkles',
  image_url text,
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  link_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Public read active
CREATE POLICY "services: public read active"
  ON public.services FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Org read all (admin sees inactive too)
CREATE POLICY "services: org read all"
  ON public.services FOR SELECT
  TO authenticated
  USING (org_id = get_user_org_id());

-- Org insert
CREATE POLICY "services: org insert"
  ON public.services FOR INSERT
  TO authenticated
  WITH CHECK (org_id = get_user_org_id());

-- Org update
CREATE POLICY "services: org update"
  ON public.services FOR UPDATE
  TO authenticated
  USING (org_id = get_user_org_id());

-- Org delete
CREATE POLICY "services: org delete"
  ON public.services FOR DELETE
  TO authenticated
  USING (org_id = get_user_org_id());

-- Seed with existing static services
INSERT INTO public.services (org_id, title, description, icon_name, display_order) VALUES
  ('73bfe84c-57d2-456e-8453-869a7f8c05af', 'Hardwood Floor Installation', 'Premium solid and engineered hardwood installed with precision.', 'TreePine', 0),
  ('73bfe84c-57d2-456e-8453-869a7f8c05af', 'Sanding, Staining & Refinishing', 'Restore your floors to their original beauty with expert refinishing.', 'Paintbrush', 1),
  ('73bfe84c-57d2-456e-8453-869a7f8c05af', 'Staircase Design & Finishing', 'Custom hardwood staircases that elevate your home''s elegance.', 'ArrowUpDown', 2),
  ('73bfe84c-57d2-456e-8453-869a7f8c05af', 'Demolition & Replacement', 'Full removal of old flooring and preparation for new installation.', 'Trash2', 3),
  ('73bfe84c-57d2-456e-8453-869a7f8c05af', 'Vinyl & Engineered Wood Installation', 'Durable, waterproof options with the look of natural wood.', 'Layers', 4),
  ('73bfe84c-57d2-456e-8453-869a7f8c05af', 'Deck & Handrail Refinishing', 'Extend your craftsmanship outdoors with deck and rail restoration.', 'Fence', 5),
  ('73bfe84c-57d2-456e-8453-869a7f8c05af', 'Wash & Polish', 'Professional deep clean and polish to maintain your floor''s shine.', 'Sparkles', 6);

-- Storage bucket for service images
INSERT INTO storage.buckets (id, name, public) VALUES ('services', 'services', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for services bucket
CREATE POLICY "services_images: public read"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'services');

CREATE POLICY "services_images: auth upload"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'services');

CREATE POLICY "services_images: auth update"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'services');

CREATE POLICY "services_images: auth delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'services');
