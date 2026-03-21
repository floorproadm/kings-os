import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Partner {
  id: string;
  org_id: string;
  company_name: string;
  contact_name: string | null;
  email: string | null;
  phone: string | null;
  partner_type: string;
  service_zone: string | null;
  status: string;
  last_contacted_at: string | null;
  next_action_date: string | null;
  next_action_note: string | null;
  total_referrals: number;
  total_converted: number;
  notes: string | null;
  photo_url: string | null;
  created_at: string;
  updated_at: string;
}

export const PARTNER_TYPES = [
  { value: "builder", label: "Builder" },
  { value: "realtor", label: "Realtor" },
  { value: "designer", label: "Designer" },
  { value: "contractor", label: "Contractor" },
  { value: "property_manager", label: "Property Manager" },
  { value: "other", label: "Other" },
];

export const PIPELINE_STAGES = [
  "prospect",
  "contacted",
  "meeting_scheduled",
  "trial_first_job",
  "active",
  "inactive",
  "churned",
] as const;

export const STAGE_CONFIG: Record<string, { label: string; color: string; dotColor: string }> = {
  prospect: { label: "Prospect", color: "bg-blue-500/15 text-blue-400", dotColor: "bg-blue-400" },
  contacted: { label: "Contacted", color: "bg-cyan-500/15 text-cyan-400", dotColor: "bg-cyan-400" },
  meeting_scheduled: { label: "Meeting", color: "bg-violet-500/15 text-violet-400", dotColor: "bg-violet-400" },
  trial_first_job: { label: "Trial Job", color: "bg-amber-500/15 text-amber-400", dotColor: "bg-amber-400" },
  active: { label: "Active", color: "bg-emerald-500/15 text-emerald-400", dotColor: "bg-emerald-400" },
  inactive: { label: "Inactive", color: "bg-zinc-500/15 text-zinc-400", dotColor: "bg-zinc-400" },
  churned: { label: "Churned", color: "bg-red-500/15 text-red-400", dotColor: "bg-red-400" },
};

export function isAtRisk(partner: Partner): boolean {
  if (partner.status !== "active") return false;
  if (!partner.last_contacted_at) return true;
  const diff = Date.now() - new Date(partner.last_contacted_at).getTime();
  return diff > 30 * 24 * 60 * 60 * 1000;
}

export function usePartnersData() {
  const queryClient = useQueryClient();

  const { data: partners = [], isLoading } = useQuery({
    queryKey: ["partners"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("partners")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Partner[];
    },
  });

  const createPartner = useMutation({
    mutationFn: async (partner: Partial<Partner>) => {
      const { data: orgId } = await supabase.rpc("get_user_org_id");
      const { error } = await supabase.from("partners").insert({ ...partner, org_id: orgId } as any);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partners"] });
      toast.success("Partner created");
    },
    onError: (e) => toast.error(e.message),
  });

  const updatePartner = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Partner> & { id: string }) => {
      const { error } = await supabase.from("partners").update({ ...updates, updated_at: new Date().toISOString() } as any).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partners"] });
    },
    onError: (e) => toast.error(e.message),
  });

  const deletePartner = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("partners").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partners"] });
      toast.success("Partner deleted");
    },
    onError: (e) => toast.error(e.message),
  });

  return { partners, isLoading, createPartner, updatePartner, deletePartner };
}
