
-- Add new columns to invoices table
ALTER TABLE public.invoices
  ADD COLUMN IF NOT EXISTS notes text,
  ADD COLUMN IF NOT EXISTS client_name text,
  ADD COLUMN IF NOT EXISTS client_email text,
  ADD COLUMN IF NOT EXISTS client_address text;

-- Create invoice_items table
CREATE TABLE public.invoice_items (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id uuid NOT NULL DEFAULT '73bfe84c-57d2-456e-8453-869a7f8c05af'::uuid,
  invoice_id uuid NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  description text NOT NULL DEFAULT '',
  quantity numeric NOT NULL DEFAULT 1,
  unit text NOT NULL DEFAULT 'unit',
  unit_price numeric NOT NULL DEFAULT 0,
  total numeric NOT NULL DEFAULT 0,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;

-- RLS policies (org-scoped)
CREATE POLICY "invoice_items: org select" ON public.invoice_items FOR SELECT TO authenticated USING (org_id = get_user_org_id());
CREATE POLICY "invoice_items: org insert" ON public.invoice_items FOR INSERT TO authenticated WITH CHECK (org_id = get_user_org_id());
CREATE POLICY "invoice_items: org update" ON public.invoice_items FOR UPDATE TO authenticated USING (org_id = get_user_org_id());
CREATE POLICY "invoice_items: org delete" ON public.invoice_items FOR DELETE TO authenticated USING (org_id = get_user_org_id());
