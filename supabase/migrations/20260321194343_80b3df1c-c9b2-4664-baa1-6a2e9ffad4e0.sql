
CREATE TABLE public.partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  company_name text NOT NULL,
  contact_name text,
  email text,
  phone text,
  partner_type text NOT NULL DEFAULT 'builder',
  service_zone text DEFAULT 'core',
  status text NOT NULL DEFAULT 'prospect',
  last_contacted_at timestamptz,
  next_action_date date,
  next_action_note text,
  total_referrals integer NOT NULL DEFAULT 0,
  total_converted integer NOT NULL DEFAULT 0,
  notes text,
  photo_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "partners: org read" ON public.partners FOR SELECT TO authenticated USING (org_id = get_user_org_id());
CREATE POLICY "partners: org insert" ON public.partners FOR INSERT TO authenticated WITH CHECK (org_id = get_user_org_id());
CREATE POLICY "partners: org update" ON public.partners FOR UPDATE TO authenticated USING (org_id = get_user_org_id());
CREATE POLICY "partners: org delete" ON public.partners FOR DELETE TO authenticated USING (org_id = get_user_org_id());
