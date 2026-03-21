
-- Organizations table (multi-tenant from day 1)
CREATE TABLE public.organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  phone text,
  email text,
  plan text DEFAULT 'standard',
  created_at timestamptz DEFAULT now()
);

-- Profiles (linked to Supabase auth users)
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  org_id uuid REFERENCES public.organizations(id),
  role text DEFAULT 'admin',
  full_name text,
  created_at timestamptz DEFAULT now()
);

-- Leads table
CREATE TABLE public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES public.organizations(id) NOT NULL,
  name text NOT NULL,
  phone text,
  email text,
  address text,
  service text,
  message text,
  source text DEFAULT 'website',
  referral_code text,
  status text DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);

-- Referral codes
CREATE TABLE public.referral_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES public.organizations(id) NOT NULL,
  code text UNIQUE NOT NULL,
  referrer_name text,
  commission_pct numeric DEFAULT 5,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_codes ENABLE ROW LEVEL SECURITY;

-- Helper function: get user's org_id (security definer to avoid RLS recursion)
CREATE OR REPLACE FUNCTION public.get_user_org_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT org_id FROM public.profiles WHERE id = auth.uid()
$$;

-- Organizations policies
CREATE POLICY "orgs: authenticated read own" ON public.organizations
  FOR SELECT TO authenticated
  USING (id = public.get_user_org_id());

-- Profiles policies
CREATE POLICY "profiles: users read own" ON public.profiles
  FOR SELECT TO authenticated
  USING (id = auth.uid());

CREATE POLICY "profiles: users update own" ON public.profiles
  FOR UPDATE TO authenticated
  USING (id = auth.uid());

-- Leads policies
CREATE POLICY "leads: public insert" ON public.leads
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "leads: org read" ON public.leads
  FOR SELECT TO authenticated
  USING (org_id = public.get_user_org_id());

CREATE POLICY "leads: org update" ON public.leads
  FOR UPDATE TO authenticated
  USING (org_id = public.get_user_org_id());

-- Referral codes policies
CREATE POLICY "referral_codes: public read active" ON public.referral_codes
  FOR SELECT TO anon, authenticated
  USING (active = true);

CREATE POLICY "referral_codes: org manage select" ON public.referral_codes
  FOR SELECT TO authenticated
  USING (org_id = public.get_user_org_id());

CREATE POLICY "referral_codes: org insert" ON public.referral_codes
  FOR INSERT TO authenticated
  WITH CHECK (org_id = public.get_user_org_id());

CREATE POLICY "referral_codes: org update" ON public.referral_codes
  FOR UPDATE TO authenticated
  USING (org_id = public.get_user_org_id());

CREATE POLICY "referral_codes: org delete" ON public.referral_codes
  FOR DELETE TO authenticated
  USING (org_id = public.get_user_org_id());

-- Trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert Hardwood Kings as first org
INSERT INTO public.organizations (name, slug, phone, email)
VALUES ('Hardwood Kings Inc.', 'hardwood-kings', '9139153193', 'hardwoodkingsinc@gmail.com');
