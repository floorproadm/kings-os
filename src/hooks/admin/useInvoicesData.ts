import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface InvoiceWithProject {
  id: string;
  invoice_number: string;
  amount: number;
  status: string;
  due_date: string | null;
  client_name: string | null;
  client_email: string | null;
  client_address: string | null;
  notes: string | null;
  project_id: string;
  org_id: string;
  created_at: string;
  project_title: string;
  total_paid: number;
}

export interface InvoicesKPIs {
  totalInvoiced: number;
  totalReceived: number;
  outstanding: number;
  overdueCount: number;
}

export function useInvoicesData() {
  const qc = useQueryClient();

  const { data: invoices = [], isLoading } = useQuery({
    queryKey: ["all-invoices"],
    queryFn: async () => {
      const { data: invData, error } = await supabase
        .from("invoices")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;

      const projectIds = [...new Set(invData.map((i) => i.project_id))];
      const { data: projects } = await supabase
        .from("projects")
        .select("id, title")
        .in("id", projectIds);
      const projMap = new Map((projects ?? []).map((p) => [p.id, p.title]));

      const invoiceIds = invData.map((i) => i.id);
      const { data: payments } = await supabase
        .from("payments")
        .select("invoice_id, amount")
        .in("invoice_id", invoiceIds);

      const paidMap = new Map<string, number>();
      (payments ?? []).forEach((p) => {
        paidMap.set(p.invoice_id, (paidMap.get(p.invoice_id) || 0) + Number(p.amount));
      });

      return invData.map((inv) => ({
        ...inv,
        project_title: projMap.get(inv.project_id) || "Unknown",
        total_paid: paidMap.get(inv.id) || 0,
      })) as InvoiceWithProject[];
    },
  });

  const invalidate = () => qc.invalidateQueries({ queryKey: ["all-invoices"] });

  const today = new Date().toISOString().slice(0, 10);
  const getEffectiveStatus = (inv: InvoiceWithProject) => {
    if (inv.total_paid >= inv.amount && inv.amount > 0) return "paid";
    if (inv.due_date && inv.due_date < today && inv.status !== "paid") return "overdue";
    return inv.status;
  };

  const kpis: InvoicesKPIs = {
    totalInvoiced: invoices.reduce((s, i) => s + Number(i.amount), 0),
    totalReceived: invoices.reduce((s, i) => s + i.total_paid, 0),
    outstanding: invoices.reduce((s, i) => s + Math.max(Number(i.amount) - i.total_paid, 0), 0),
    overdueCount: invoices.filter((i) => getEffectiveStatus(i) === "overdue").length,
  };

  const deleteInvoice = async (id: string) => {
    await supabase.from("invoice_items").delete().eq("invoice_id", id);
    await supabase.from("payments").delete().eq("invoice_id", id);
    await supabase.from("invoices").delete().eq("id", id);
    invalidate();
  };

  return { invoices, isLoading, kpis, getEffectiveStatus, deleteInvoice, invalidate };
}
