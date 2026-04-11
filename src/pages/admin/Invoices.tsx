import { useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useInvoicesData } from "@/hooks/admin/useInvoicesData";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, Clock, AlertTriangle, CheckCircle2, Search, Eye, Pencil, Trash2 } from "lucide-react";
import { InvoiceEditorDialog } from "@/components/admin/projects/InvoiceEditorDialog";
import { InvoicePreview } from "@/components/admin/projects/InvoicePreview";
import { toast } from "sonner";
import type { Invoice } from "@/hooks/admin/useProjectDetails";

const statusStyles: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  sent: "bg-blue-500/15 text-blue-400",
  paid: "bg-emerald-500/15 text-emerald-400",
  overdue: "bg-red-500/15 text-red-400",
};

export default function Invoices() {
  const { invoices, isLoading, kpis, getEffectiveStatus, deleteInvoice, invalidate } = useInvoicesData();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [editingProjectId, setEditingProjectId] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewInvoice, setPreviewInvoice] = useState<Invoice | null>(null);
  const [previewPayments, setPreviewPayments] = useState<import("@/hooks/admin/useProjectDetails").Payment[]>([]);

  const filtered = useMemo(() => {
    return invoices.filter((inv) => {
      const effective = getEffectiveStatus(inv);
      if (statusFilter !== "all" && effective !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          inv.invoice_number.toLowerCase().includes(q) ||
          inv.project_title.toLowerCase().includes(q) ||
          (inv.client_name || "").toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [invoices, search, statusFilter, getEffectiveStatus]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this invoice and all its payments?")) return;
    await deleteInvoice(id);
    toast.success("Invoice deleted");
  };

  const handleEdit = (inv: typeof invoices[0]) => {
    setEditingInvoice(inv as unknown as Invoice);
    setEditingProjectId(inv.project_id);
    setEditorOpen(true);
  };

  const handlePreview = async (invoiceId: string) => {
    const found = invoices.find((i) => i.id === invoiceId);
    if (!found) return;
    setPreviewInvoice(found as unknown as Invoice);
    const { data: pmts } = await supabase.from("payments").select("*").eq("invoice_id", invoiceId);
    setPreviewPayments((pmts ?? []) as import("@/hooks/admin/useProjectDetails").Payment[]);
    setPreviewOpen(true);
  };

  const kpiCards = [
    { label: "Total Invoiced", value: kpis.totalInvoiced, icon: DollarSign, color: "text-blue-400" },
    { label: "Received", value: kpis.totalReceived, icon: CheckCircle2, color: "text-emerald-400" },
    { label: "Outstanding", value: kpis.outstanding, icon: Clock, color: "text-amber-400" },
  ];

  return (
    <div className="space-y-4 pb-24 lg:pb-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-display font-bold">Invoices</h1>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpiCards.map((k) => (
          <Card key={k.label} className="bg-card/60 border-border/50">
            <CardContent className="p-3 flex items-center gap-3">
              <k.icon className={`w-5 h-5 ${k.color}`} />
              <div>
                <p className="text-[10px] text-muted-foreground">{k.label}</p>
                <p className="text-sm font-bold">${k.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
              </div>
            </CardContent>
          </Card>
        ))}
        <Card className="bg-card/60 border-border/50">
          <CardContent className="p-3 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <div>
              <p className="text-[10px] text-muted-foreground">Overdue</p>
              <p className="text-sm font-bold">{kpis.overdueCount}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search invoice, project or client..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8 h-8 text-xs" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-28 h-8 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="sent">Sent</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Invoice list */}
      {isLoading ? (
        <p className="text-sm text-muted-foreground text-center py-8">Loading invoices...</p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">No invoices found</p>
      ) : (
        <div className="space-y-2">
          {filtered.map((inv) => {
            const effective = getEffectiveStatus(inv);
            const paidPct = inv.amount > 0 ? Math.min((inv.total_paid / inv.amount) * 100, 100) : 0;
            return (
              <Card key={inv.id} className="bg-card/60 border-border/50 hover:border-primary/30 transition-colors">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold">#{inv.invoice_number}</span>
                        <Badge className={`text-[9px] px-1.5 py-0 ${statusStyles[effective] || statusStyles.draft}`}>
                          {effective}
                        </Badge>
                      </div>
                      <p className="text-[10px] text-muted-foreground truncate">{inv.project_title}</p>
                      {inv.client_name && <p className="text-[10px] text-muted-foreground truncate">{inv.client_name}</p>}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold">${Number(inv.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                      {inv.due_date && <p className="text-[9px] text-muted-foreground">Due {inv.due_date}</p>}
                    </div>
                  </div>

                  <div className="mt-2 flex items-center gap-2">
                    <Progress value={paidPct} className="flex-1 h-1.5" />
                    <span className="text-[9px] text-muted-foreground w-10 text-right">{Math.round(paidPct)}%</span>
                  </div>

                  <div className="flex gap-1 mt-2 justify-end">
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => handlePreview(inv.id)}>
                      <Eye className="w-3.5 h-3.5" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => handleEdit(inv)}>
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => handleDelete(inv.id)}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Dialogs */}
      {editorOpen && editingProjectId && (
        <InvoiceEditorDialog
          open={editorOpen}
          onOpenChange={setEditorOpen}
          projectId={editingProjectId}
          invoice={editingInvoice}
          onSaved={invalidate}
          onPreview={handlePreview}
        />
      )}
      {previewOpen && previewInvoice && (
        <InvoicePreview
          open={previewOpen}
          onOpenChange={setPreviewOpen}
          invoice={previewInvoice}
          payments={previewPayments}
        />
      )}
    </div>
  );
}
