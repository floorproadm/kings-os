import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Invoice } from "@/hooks/admin/useProjectDetails";

export interface LineItem {
  id?: string;
  description: string;
  quantity: number;
  unit: string;
  unit_price: number;
  total: number;
}

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  projectId: string;
  invoice?: Invoice | null;
  onSaved: () => void;
  onPreview?: (invoiceId: string) => void;
}

export function InvoiceEditorDialog({ open, onOpenChange, projectId, invoice, onSaved, onPreview }: Props) {
  const isEdit = !!invoice;

  const [num, setNum] = useState("");
  const [status, setStatus] = useState("draft");
  const [dueDate, setDueDate] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<LineItem[]>([{ description: "", quantity: 1, unit: "sqft", unit_price: 0, total: 0 }]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (isEdit && invoice) {
      setNum(invoice.invoice_number);
      setStatus(invoice.status);
      setDueDate((invoice as any).due_date || "");
      setClientName((invoice as any).client_name || "");
      setClientEmail((invoice as any).client_email || "");
      setClientAddress((invoice as any).client_address || "");
      setNotes((invoice as any).notes || "");
      loadItems(invoice.id);
    } else {
      resetForm();
    }
  }, [open, invoice]);

  const resetForm = () => {
    setNum(""); setStatus("draft"); setDueDate(""); setClientName(""); setClientEmail(""); setClientAddress(""); setNotes("");
    setItems([{ description: "", quantity: 1, unit: "sqft", unit_price: 0, total: 0 }]);
  };

  const loadItems = async (invoiceId: string) => {
    const { data } = await supabase.from("invoice_items" as any).select("*").eq("invoice_id", invoiceId).order("display_order");
    if (data && (data as any[]).length > 0) {
      setItems((data as any[]).map((d: any) => ({ id: d.id, description: d.description, quantity: Number(d.quantity), unit: d.unit, unit_price: Number(d.unit_price), total: Number(d.total) })));
    } else {
      setItems([{ description: "", quantity: 1, unit: "sqft", unit_price: 0, total: 0 }]);
    }
  };

  const updateItem = (idx: number, field: keyof LineItem, value: any) => {
    setItems(prev => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: value };
      if (field === "quantity" || field === "unit_price") {
        copy[idx].total = Number(copy[idx].quantity) * Number(copy[idx].unit_price);
      }
      return copy;
    });
  };

  const addLine = () => setItems(prev => [...prev, { description: "", quantity: 1, unit: "sqft", unit_price: 0, total: 0 }]);
  const removeLine = (idx: number) => setItems(prev => prev.filter((_, i) => i !== idx));

  const subtotal = items.reduce((s, i) => s + (i.total || 0), 0);

  const handleSave = async () => {
    if (!num) { toast.error("Invoice # is required"); return; }
    setSaving(true);
    try {
      const orgRes = await supabase.rpc("get_user_org_id");
      const orgId = orgRes.data!;
      const invoicePayload: any = {
        invoice_number: num, amount: subtotal, due_date: dueDate || null, status,
        client_name: clientName || null, client_email: clientEmail || null,
        client_address: clientAddress || null, notes: notes || null,
      };

      let invoiceId: string;
      if (isEdit && invoice) {
        invoiceId = invoice.id;
        await supabase.from("invoices").update(invoicePayload).eq("id", invoiceId);
        await supabase.from("invoice_items" as any).delete().eq("invoice_id", invoiceId);
      } else {
        invoicePayload.project_id = projectId;
        invoicePayload.org_id = orgId;
        const { data, error } = await supabase.from("invoices").insert(invoicePayload).select("id").single();
        if (error) throw error;
        invoiceId = data.id;
      }

      const itemRows = items.filter(i => i.description).map((item, idx) => ({
        invoice_id: invoiceId, org_id: orgId, description: item.description,
        quantity: item.quantity, unit: item.unit, unit_price: item.unit_price,
        total: item.total, display_order: idx,
      }));
      if (itemRows.length > 0) {
        await supabase.from("invoice_items" as any).insert(itemRows as any);
      }

      toast.success(isEdit ? "Invoice updated" : "Invoice created");
      onSaved();
      onOpenChange(false);
    } catch (e: any) {
      toast.error(e.message || "Error saving invoice");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base">{isEdit ? "Edit Invoice" : "New Invoice"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Header row */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label className="text-xs">Invoice # *</Label>
              <Input value={num} onChange={e => setNum(e.target.value)} className="h-8 text-xs" />
            </div>
            <div>
              <Label className="text-xs">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Due Date</Label>
              <Input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="h-8 text-xs" />
            </div>
          </div>

          {/* Client info */}
          <div className="rounded-lg border p-3 space-y-2">
            <h5 className="text-xs font-semibold text-muted-foreground">Client Info</h5>
            <div className="grid grid-cols-2 gap-2">
              <div><Label className="text-[10px]">Name</Label><Input value={clientName} onChange={e => setClientName(e.target.value)} className="h-7 text-xs" /></div>
              <div><Label className="text-[10px]">Email</Label><Input value={clientEmail} onChange={e => setClientEmail(e.target.value)} className="h-7 text-xs" /></div>
            </div>
            <div><Label className="text-[10px]">Address</Label><Input value={clientAddress} onChange={e => setClientAddress(e.target.value)} className="h-7 text-xs" /></div>
          </div>

          {/* Line items */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h5 className="text-xs font-semibold">Line Items</h5>
              <Button size="sm" variant="outline" className="h-6 text-[10px] gap-1" onClick={addLine}><Plus className="w-3 h-3" /> Add Line</Button>
            </div>

            <div className="rounded-lg border overflow-hidden">
              <div className="grid grid-cols-[1fr_70px_65px_80px_80px_32px] gap-1 px-2 py-1.5 bg-muted/50 text-[9px] font-semibold text-muted-foreground">
                <span>Description</span><span>Qty</span><span>Unit</span><span>Price</span><span>Total</span><span></span>
              </div>
              {items.map((item, idx) => (
                <div key={idx} className="grid grid-cols-[1fr_70px_65px_80px_80px_32px] gap-1 px-2 py-1 border-t items-center">
                  <Input value={item.description} onChange={e => updateItem(idx, "description", e.target.value)} className="h-7 text-[10px] border-0 bg-transparent p-0" placeholder="Service description" />
                  <Input type="number" value={item.quantity || ""} onChange={e => updateItem(idx, "quantity", parseFloat(e.target.value) || 0)} className="h-7 text-[10px] border-0 bg-transparent p-0 text-center" />
                  <Select value={item.unit} onValueChange={v => updateItem(idx, "unit", v)}>
                    <SelectTrigger className="h-7 text-[10px] border-0 bg-transparent p-0 px-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sqft">sqft</SelectItem>
                      <SelectItem value="unit">unit</SelectItem>
                      <SelectItem value="hour">hour</SelectItem>
                      <SelectItem value="step">step</SelectItem>
                      <SelectItem value="lft">lft</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input type="number" value={item.unit_price || ""} onChange={e => updateItem(idx, "unit_price", parseFloat(e.target.value) || 0)} className="h-7 text-[10px] border-0 bg-transparent p-0 text-right" placeholder="0.00" />
                  <span className="text-[10px] font-medium text-right pr-1">${item.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => removeLine(idx)} disabled={items.length <= 1}>
                    <Trash2 className="w-3 h-3 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <div className="text-sm font-bold">Subtotal: ${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label className="text-xs">Notes / Terms</Label>
            <Textarea value={notes} onChange={e => setNotes(e.target.value)} className="text-xs min-h-[60px]" placeholder="Payment terms, thank you message..." />
          </div>

          {/* Actions */}
          <div className="flex gap-2 justify-end pt-2 border-t">
            {isEdit && onPreview && (
              <Button variant="outline" size="sm" className="gap-1" onClick={() => { onPreview(invoice!.id); onOpenChange(false); }}>
                <Eye className="w-3.5 h-3.5" /> Preview
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button size="sm" onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save Invoice"}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
