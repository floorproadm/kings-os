import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Measurement {
  id: string;
  project_id: string;
  sqft: number;
  stairs_count: number;
  handrail_ft: number;
  extras_value: number;
  total_value: number;
  notes: string | null;
  created_at: string;
}

export interface MaterialCost {
  id: string;
  project_id: string;
  description: string;
  vendor: string | null;
  amount: number;
  purchased_at: string | null;
  receipt_url: string | null;
  created_at: string;
}

export interface LaborEntry {
  id: string;
  project_id: string;
  worker_name: string;
  days_worked: number;
  daily_rate: number;
  total_cost: number;
  work_date: string | null;
  notes: string | null;
  created_at: string;
}

export interface Invoice {
  id: string;
  project_id: string;
  invoice_number: string;
  amount: number;
  due_date: string | null;
  status: string;
  created_at: string;
}

export interface Payment {
  id: string;
  invoice_id: string;
  amount: number;
  payment_date: string | null;
  method: string | null;
  notes: string | null;
  created_at: string;
}

export interface ProjectKPIs {
  totalValue: number;
  totalMaterials: number;
  totalLabor: number;
  totalCosts: number;
  netProfit: number;
  marginPct: number;
  totalInvoiced: number;
  totalReceived: number;
  balanceDue: number;
}

export function useProjectDetails(projectId: string | null) {
  const qc = useQueryClient();
  const key = ["project-details", projectId];

  const { data: measurements = [] } = useQuery({
    queryKey: [...key, "measurements"],
    enabled: !!projectId,
    queryFn: async () => {
      const { data } = await supabase.from("measurements").select("*").eq("project_id", projectId!).order("created_at", { ascending: false });
      return (data || []) as Measurement[];
    },
  });

  const { data: materialCosts = [] } = useQuery({
    queryKey: [...key, "materials"],
    enabled: !!projectId,
    queryFn: async () => {
      const { data } = await supabase.from("material_costs").select("*").eq("project_id", projectId!).order("created_at", { ascending: false });
      return (data || []) as MaterialCost[];
    },
  });

  const { data: laborEntries = [] } = useQuery({
    queryKey: [...key, "labor"],
    enabled: !!projectId,
    queryFn: async () => {
      const { data } = await supabase.from("labor_payroll").select("*").eq("project_id", projectId!).order("created_at", { ascending: false });
      return (data || []) as LaborEntry[];
    },
  });

  const { data: invoices = [] } = useQuery({
    queryKey: [...key, "invoices"],
    enabled: !!projectId,
    queryFn: async () => {
      const { data } = await supabase.from("invoices").select("*").eq("project_id", projectId!).order("created_at", { ascending: false });
      return (data || []) as Invoice[];
    },
  });

  const { data: payments = [] } = useQuery({
    queryKey: [...key, "payments"],
    enabled: !!projectId,
    queryFn: async () => {
      if (!invoices.length) return [];
      const invoiceIds = invoices.map((i) => i.id);
      const { data } = await supabase.from("payments").select("*").in("invoice_id", invoiceIds).order("created_at", { ascending: false });
      return (data || []) as Payment[];
    },
  });

  const invalidate = () => qc.invalidateQueries({ queryKey: key });

  // Generic add helpers
  const addMeasurement = async (input: Omit<Measurement, "id" | "created_at" | "project_id"> & { project_id?: string }) => {
    const orgRes = await supabase.rpc("get_user_org_id");
    const { error } = await supabase.from("measurements").insert({ ...input, project_id: projectId!, org_id: orgRes.data! });
    if (error) { toast.error(error.message); return; }
    toast.success("Measurement added");
    invalidate();
  };

  const addMaterialCost = async (input: { description: string; vendor?: string; amount: number; purchased_at?: string }) => {
    const orgRes = await supabase.rpc("get_user_org_id");
    const { error } = await supabase.from("material_costs").insert({ ...input, project_id: projectId!, org_id: orgRes.data! });
    if (error) { toast.error(error.message); return; }
    toast.success("Cost added");
    invalidate();
  };

  const addLaborEntry = async (input: { worker_name: string; days_worked: number; daily_rate: number; total_cost: number; work_date?: string; notes?: string }) => {
    const orgRes = await supabase.rpc("get_user_org_id");
    const { error } = await supabase.from("labor_payroll").insert({ ...input, project_id: projectId!, org_id: orgRes.data! });
    if (error) { toast.error(error.message); return; }
    toast.success("Labor entry added");
    invalidate();
  };

  const addInvoice = async (input: { invoice_number: string; amount: number; due_date?: string; status?: string }) => {
    const orgRes = await supabase.rpc("get_user_org_id");
    const { error } = await supabase.from("invoices").insert({ ...input, project_id: projectId!, org_id: orgRes.data! });
    if (error) { toast.error(error.message); return; }
    toast.success("Invoice added");
    invalidate();
  };

  const addPayment = async (input: { invoice_id: string; amount: number; payment_date?: string; method?: string; notes?: string }) => {
    const orgRes = await supabase.rpc("get_user_org_id");
    const { error } = await supabase.from("payments").insert({ ...input, org_id: orgRes.data! });
    if (error) { toast.error(error.message); return; }
    toast.success("Payment added");
    invalidate();
  };

  const deleteRecord = async (table: "measurements" | "material_costs" | "labor_payroll" | "invoices" | "payments", id: string) => {
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Deleted");
    invalidate();
  };

  const updateMeasurement = async (id: string, input: Partial<Omit<Measurement, "id" | "created_at" | "project_id">>) => {
    const { error } = await supabase.from("measurements").update(input).eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Measurement updated");
    invalidate();
  };

  const updateMaterialCost = async (id: string, input: { description: string; vendor?: string; amount: number; purchased_at?: string }) => {
    const { error } = await supabase.from("material_costs").update(input).eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Material cost updated");
    invalidate();
  };

  const updateLaborEntry = async (id: string, input: { worker_name: string; days_worked: number; daily_rate: number; total_cost: number; work_date?: string; notes?: string }) => {
    const { error } = await supabase.from("labor_payroll").update(input).eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Labor entry updated");
    invalidate();
  };

  // KPI calculations
  const totalMaterials = materialCosts.reduce((s, c) => s + Number(c.amount), 0);
  const totalLabor = laborEntries.reduce((s, c) => s + Number(c.total_cost), 0);
  const totalCosts = totalMaterials + totalLabor;
  const totalInvoiced = invoices.reduce((s, i) => s + Number(i.amount), 0);
  const totalReceived = payments.reduce((s, p) => s + Number(p.amount), 0);

  const kpis: ProjectKPIs | null = projectId
    ? {
        totalValue: 0, // will be set by caller with project.total_value
        totalMaterials,
        totalLabor,
        totalCosts,
        netProfit: 0,
        marginPct: 0,
        totalInvoiced,
        totalReceived,
        balanceDue: totalInvoiced - totalReceived,
      }
    : null;

  return {
    measurements,
    materialCosts,
    laborEntries,
    invoices,
    payments,
    kpis,
    addMeasurement,
    addMaterialCost,
    addLaborEntry,
    addInvoice,
    addPayment,
    deleteRecord,
    updateMeasurement,
    updateMaterialCost,
    updateLaborEntry,
    invalidate,
  };
}
