import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus, ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Invoice, Payment } from "@/hooks/admin/useProjectDetails";

const invoiceStatusColors: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  sent: "bg-blue-500/15 text-blue-400",
  paid: "bg-green-500/15 text-green-400",
  overdue: "bg-red-500/15 text-red-400",
};

interface Props {
  invoices: Invoice[];
  payments: Payment[];
  onAddInvoice: (i: { invoice_number: string; amount: number; due_date?: string; status?: string }) => Promise<void>;
  onAddPayment: (p: { invoice_id: string; amount: number; payment_date?: string; method?: string }) => Promise<void>;
  onDelete: (table: "invoices" | "payments", id: string) => Promise<void>;
}

export function InvoicesTab({ invoices, payments, onAddInvoice, onAddPayment, onDelete }: Props) {
  const [showInv, setShowInv] = useState(false);
  const [num, setNum] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const handleAddInvoice = async () => {
    if (!num || !amount) return;
    await onAddInvoice({ invoice_number: num, amount: parseFloat(amount), due_date: dueDate || undefined });
    setNum(""); setAmount(""); setDueDate(""); setShowInv(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold">Invoices</h4>
        <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => setShowInv(!showInv)}><Plus className="w-3 h-3" /> Add</Button>
      </div>

      {showInv && (
        <div className="grid grid-cols-2 gap-2 p-3 rounded-lg border bg-muted/30">
          <div><Label className="text-[10px]">Invoice # *</Label><Input value={num} onChange={(e) => setNum(e.target.value)} className="h-8 text-xs" /></div>
          <div><Label className="text-[10px]">Amount ($) *</Label><Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="h-8 text-xs" /></div>
          <div className="col-span-2"><Label className="text-[10px]">Due Date</Label><Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="h-8 text-xs" /></div>
          <Button size="sm" className="col-span-2 h-7 text-xs" onClick={handleAddInvoice}>Save</Button>
        </div>
      )}

      {invoices.length === 0 ? (
        <p className="text-xs text-muted-foreground text-center py-4">No invoices</p>
      ) : (
        <div className="space-y-2">
          {invoices.map((inv) => {
            const invPayments = payments.filter((p) => p.invoice_id === inv.id);
            const totalPaid = invPayments.reduce((s, p) => s + Number(p.amount), 0);
            const isExpanded = expanded === inv.id;

            return (
              <div key={inv.id} className="rounded-lg border bg-card">
                <div className="flex items-center justify-between p-2.5 cursor-pointer" onClick={() => setExpanded(isExpanded ? null : inv.id)}>
                  <div className="flex items-center gap-2 text-xs">
                    {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                    <span className="font-medium">#{inv.invoice_number}</span>
                    <Badge className={cn("text-[9px] px-1.5 h-4 border-0", invoiceStatusColors[inv.status])}>{inv.status}</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-semibold">${Number(inv.amount).toLocaleString()}</span>
                    <span className="text-muted-foreground">paid: ${totalPaid.toLocaleString()}</span>
                    <Button size="icon" variant="ghost" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); onDelete("invoices", inv.id); }}>
                      <Trash2 className="w-3 h-3 text-destructive" />
                    </Button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-3 pb-3 border-t space-y-2 pt-2">
                    {inv.due_date && <p className="text-[10px] text-muted-foreground">Due: {new Date(inv.due_date).toLocaleDateString()}</p>}
                    <PaymentsList invoiceId={inv.id} payments={invPayments} onAdd={onAddPayment} onDelete={(id) => onDelete("payments", id)} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function PaymentsList({ invoiceId, payments, onAdd, onDelete }: {
  invoiceId: string;
  payments: Payment[];
  onAdd: Props["onAddPayment"];
  onDelete: (id: string) => void;
}) {
  const [show, setShow] = useState(false);
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [method, setMethod] = useState("cash");

  const handleAdd = async () => {
    if (!amount) return;
    await onAdd({ invoice_id: invoiceId, amount: parseFloat(amount), payment_date: date || undefined, method });
    setAmount(""); setDate(""); setShow(false);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-medium text-muted-foreground">Payments</span>
        <Button size="sm" variant="ghost" className="h-5 text-[10px] gap-0.5 px-1.5" onClick={() => setShow(!show)}><Plus className="w-2.5 h-2.5" /> Add</Button>
      </div>
      {show && (
        <div className="grid grid-cols-3 gap-1.5 p-2 rounded border bg-muted/20">
          <Input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} className="h-7 text-[10px]" />
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="h-7 text-[10px]" />
          <Select value={method} onValueChange={setMethod}>
            <SelectTrigger className="h-7 text-[10px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="cash">Cash</SelectItem>
              <SelectItem value="check">Check</SelectItem>
              <SelectItem value="zelle">Zelle</SelectItem>
              <SelectItem value="card">Card</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm" className="col-span-3 h-6 text-[10px]" onClick={handleAdd}>Save</Button>
        </div>
      )}
      {payments.length === 0 ? (
        <p className="text-[10px] text-muted-foreground/60 text-center">No payments</p>
      ) : (
        payments.map((p) => (
          <div key={p.id} className="flex items-center justify-between text-[10px] px-1">
            <span>${Number(p.amount).toLocaleString()} · {p.method || "—"} · {p.payment_date ? new Date(p.payment_date).toLocaleDateString() : "—"}</span>
            <Button size="icon" variant="ghost" className="h-5 w-5" onClick={() => onDelete(p.id)}><Trash2 className="w-2.5 h-2.5 text-destructive" /></Button>
          </div>
        ))
      )}
    </div>
  );
}
