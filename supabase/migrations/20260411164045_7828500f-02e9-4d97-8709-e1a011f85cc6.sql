
-- Create invoice_settings table
CREATE TABLE public.invoice_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL DEFAULT '73bfe84c-57d2-456e-8453-869a7f8c05af'::uuid,
  logo_url text,
  company_name text,
  tagline text,
  website text,
  company_address text,
  company_phone text,
  company_email text,
  accent_color text DEFAULT '#c9a84c',
  default_notes text,
  footer_text text DEFAULT 'Thank you for choosing Hardwood Kings!',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.invoice_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "invoice_settings: org select" ON public.invoice_settings FOR SELECT TO authenticated USING (org_id = get_user_org_id());
CREATE POLICY "invoice_settings: org insert" ON public.invoice_settings FOR INSERT TO authenticated WITH CHECK (org_id = get_user_org_id());
CREATE POLICY "invoice_settings: org update" ON public.invoice_settings FOR UPDATE TO authenticated USING (org_id = get_user_org_id());
CREATE POLICY "invoice_settings: org delete" ON public.invoice_settings FOR DELETE TO authenticated USING (org_id = get_user_org_id());

CREATE TRIGGER update_invoice_settings_updated_at BEFORE UPDATE ON public.invoice_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Storage bucket for invoice logos
INSERT INTO storage.buckets (id, name, public) VALUES ('invoice-logos', 'invoice-logos', true);

CREATE POLICY "invoice-logos: public read" ON storage.objects FOR SELECT USING (bucket_id = 'invoice-logos');
CREATE POLICY "invoice-logos: org upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'invoice-logos');
CREATE POLICY "invoice-logos: org update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'invoice-logos');
CREATE POLICY "invoice-logos: org delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'invoice-logos');
