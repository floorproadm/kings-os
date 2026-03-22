import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Service {
  id: string;
  org_id: string;
  title: string;
  description: string;
  icon_name: string;
  image_url: string | null;
  display_order: number;
  is_active: boolean;
  link_url: string | null;
  created_at: string;
  updated_at: string;
}

export type ServiceInsert = Omit<Service, "id" | "created_at" | "updated_at">;
export type ServiceUpdate = Partial<ServiceInsert> & { id: string };

const QUERY_KEY = ["admin-services"];

export function useServicesData() {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data as Service[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (input: Omit<ServiceInsert, "org_id">) => {
      const { data: profile } = await supabase.rpc("get_user_org_id");
      const { data, error } = await supabase
        .from("services")
        .insert({ ...input, org_id: profile as string })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success("Service created");
    },
    onError: (e) => toast.error(e.message),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...updates }: ServiceUpdate) => {
      const { error } = await supabase
        .from("services")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success("Service updated");
    },
    onError: (e) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("services").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success("Service deleted");
    },
    onError: (e) => toast.error(e.message),
  });

  const uploadImage = async (file: File, serviceId: string) => {
    const ext = file.name.split(".").pop();
    const path = `${serviceId}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("services")
      .upload(path, file, { upsert: true });
    if (uploadError) throw uploadError;
    const { data } = supabase.storage.from("services").getPublicUrl(path);
    // Append cache-busting timestamp so browser fetches the new image
    return `${data.publicUrl}?t=${Date.now()}`;
  };

  return {
    services: query.data ?? [],
    isLoading: query.isLoading,
    createService: createMutation.mutateAsync,
    updateService: updateMutation.mutateAsync,
    deleteService: deleteMutation.mutateAsync,
    uploadImage,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
  };
}
