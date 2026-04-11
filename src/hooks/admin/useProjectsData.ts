import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Project {
  id: string;
  org_id: string;
  lead_id: string | null;
  title: string;
  status: string;
  address: string | null;
  scheduled_date: string | null;
  completed_date: string | null;
  total_value: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
  // joined
  lead_name?: string;
}

export type ProjectInsert = {
  title: string;
  lead_id?: string | null;
  status?: string;
  address?: string | null;
  scheduled_date?: string | null;
  total_value?: number;
  notes?: string | null;
};

const PROJECT_STATUSES = ["planning", "in_progress", "completed", "awaiting_payment", "paid", "archived"] as const;
export { PROJECT_STATUSES };

export function useProjectsData() {
  const qc = useQueryClient();

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*, leads(name)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []).map((p: any) => ({
        ...p,
        lead_name: p.leads?.name || null,
      })) as Project[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (input: ProjectInsert) => {
      const orgRes = await supabase.rpc("get_user_org_id");
      const org_id = orgRes.data;
      if (!org_id) throw new Error("Org not found");
      const { error } = await supabase.from("projects").insert({ ...input, org_id });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project created");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, lead_name, ...updates }: { id: string } & Partial<Project>) => {
      const { error } = await supabase.from("projects").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["projects"] }),
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project deleted");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return {
    projects,
    isLoading,
    createProject: createMutation.mutateAsync,
    updateProject: updateMutation.mutateAsync,
    deleteProject: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
  };
}
