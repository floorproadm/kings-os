
-- Function for updated_at (create first)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- PROJECTS
CREATE TABLE public.projects (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id uuid NOT NULL DEFAULT '73bfe84c-57d2-456e-8453-869a7f8c05af'::uuid REFERENCES public.organizations(id),
  lead_id uuid REFERENCES public.leads(id) ON DELETE SET NULL,
  title text NOT NULL,
  status text NOT NULL DEFAULT 'planning',
  address text,
  scheduled_date date,
  completed_date date,
  total_value numeric DEFAULT 0,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "projects: org select" ON public.projects FOR SELECT TO authenticated USING (org_id = get_user_org_id());
CREATE POLICY "projects: org insert" ON public.projects FOR INSERT TO authenticated WITH CHECK (org_id = get_user_org_id());
CREATE POLICY "projects: org update" ON public.projects FOR UPDATE TO authenticated USING (org_id = get_user_org_id());
CREATE POLICY "projects: org delete" ON public.projects FOR DELETE TO authenticated USING (org_id = get_user_org_id());
ALTER PUBLICATION supabase_realtime ADD TABLE public.projects;
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- MEASUREMENTS
CREATE TABLE public.measurements (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id uuid NOT NULL DEFAULT '73bfe84c-57d2-456e-8453-869a7f8c05af'::uuid REFERENCES public.organizations(id),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  sqft numeric DEFAULT 0,
  stairs_count integer DEFAULT 0,
  handrail_ft numeric DEFAULT 0,
  extras_value numeric DEFAULT 0,
  total_value numeric DEFAULT 0,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.measurements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "measurements: org select" ON public.measurements FOR SELECT TO authenticated USING (org_id = get_user_org_id());
CREATE POLICY "measurements: org insert" ON public.measurements FOR INSERT TO authenticated WITH CHECK (org_id = get_user_org_id());
CREATE POLICY "measurements: org update" ON public.measurements FOR UPDATE TO authenticated USING (org_id = get_user_org_id());
CREATE POLICY "measurements: org delete" ON public.measurements FOR DELETE TO authenticated USING (org_id = get_user_org_id());

-- MATERIAL COSTS
CREATE TABLE public.material_costs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id uuid NOT NULL DEFAULT '73bfe84c-57d2-456e-8453-869a7f8c05af'::uuid REFERENCES public.organizations(id),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  description text NOT NULL DEFAULT '',
  vendor text,
  amount numeric NOT NULL DEFAULT 0,
  purchased_at date,
  receipt_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.material_costs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "material_costs: org select" ON public.material_costs FOR SELECT TO authenticated USING (org_id = get_user_org_id());
CREATE POLICY "material_costs: org insert" ON public.material_costs FOR INSERT TO authenticated WITH CHECK (org_id = get_user_org_id());
CREATE POLICY "material_costs: org update" ON public.material_costs FOR UPDATE TO authenticated USING (org_id = get_user_org_id());
CREATE POLICY "material_costs: org delete" ON public.material_costs FOR DELETE TO authenticated USING (org_id = get_user_org_id());

-- LABOR PAYROLL
CREATE TABLE public.labor_payroll (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id uuid NOT NULL DEFAULT '73bfe84c-57d2-456e-8453-869a7f8c05af'::uuid REFERENCES public.organizations(id),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  worker_name text NOT NULL DEFAULT '',
  days_worked numeric NOT NULL DEFAULT 0,
  daily_rate numeric NOT NULL DEFAULT 0,
  total_cost numeric NOT NULL DEFAULT 0,
  work_date date,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.labor_payroll ENABLE ROW LEVEL SECURITY;
CREATE POLICY "labor_payroll: org select" ON public.labor_payroll FOR SELECT TO authenticated USING (org_id = get_user_org_id());
CREATE POLICY "labor_payroll: org insert" ON public.labor_payroll FOR INSERT TO authenticated WITH CHECK (org_id = get_user_org_id());
CREATE POLICY "labor_payroll: org update" ON public.labor_payroll FOR UPDATE TO authenticated USING (org_id = get_user_org_id());
CREATE POLICY "labor_payroll: org delete" ON public.labor_payroll FOR DELETE TO authenticated USING (org_id = get_user_org_id());

-- INVOICES
CREATE TABLE public.invoices (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id uuid NOT NULL DEFAULT '73bfe84c-57d2-456e-8453-869a7f8c05af'::uuid REFERENCES public.organizations(id),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  invoice_number text NOT NULL DEFAULT '',
  amount numeric NOT NULL DEFAULT 0,
  due_date date,
  status text NOT NULL DEFAULT 'draft',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "invoices: org select" ON public.invoices FOR SELECT TO authenticated USING (org_id = get_user_org_id());
CREATE POLICY "invoices: org insert" ON public.invoices FOR INSERT TO authenticated WITH CHECK (org_id = get_user_org_id());
CREATE POLICY "invoices: org update" ON public.invoices FOR UPDATE TO authenticated USING (org_id = get_user_org_id());
CREATE POLICY "invoices: org delete" ON public.invoices FOR DELETE TO authenticated USING (org_id = get_user_org_id());

-- PAYMENTS
CREATE TABLE public.payments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id uuid NOT NULL DEFAULT '73bfe84c-57d2-456e-8453-869a7f8c05af'::uuid REFERENCES public.organizations(id),
  invoice_id uuid NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  amount numeric NOT NULL DEFAULT 0,
  payment_date date,
  method text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "payments: org select" ON public.payments FOR SELECT TO authenticated USING (org_id = get_user_org_id());
CREATE POLICY "payments: org insert" ON public.payments FOR INSERT TO authenticated WITH CHECK (org_id = get_user_org_id());
CREATE POLICY "payments: org update" ON public.payments FOR UPDATE TO authenticated USING (org_id = get_user_org_id());
CREATE POLICY "payments: org delete" ON public.payments FOR DELETE TO authenticated USING (org_id = get_user_org_id());
