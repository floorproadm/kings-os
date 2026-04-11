import { useEffect, useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Invoice, Payment } from "@/hooks/admin/useProjectDetails";
import { useInvoiceSettings } from "@/hooks/admin/useInvoiceSettings";

interface LineItem {
  description: string;
  quantity: number;
  unit: string;
  unit_price: number;
  total: number;
}

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  invoice: Invoice | null;
  payments: Payment[];
}

export function InvoicePreview({ open, onOpenChange, invoice, payments }: Props) {
  const [items, setItems] = useState<LineItem[]>([]);
  const printRef = useRef<HTMLDivElement>(null);
  const { settings } = useInvoiceSettings();

  const companyName = settings?.company_name || "Hardwood Kings";
  const tagline = settings?.tagline || "Premium Hardwood Flooring";
  const websiteText = settings?.website || "hardwoodkings.com";
  const accent = settings?.accent_color || "#c9a84c";
  const footerMsg = settings?.footer_text || "Thank you for choosing Hardwood Kings!";
  const logoUrl = settings?.logo_url || null;
  const companyAddr = settings?.company_address || null;
  const companyPhone = settings?.company_phone || null;
  const companyEmail = settings?.company_email || null;

  useEffect(() => {
    if (!open || !invoice) return;
    loadItems(invoice.id);
  }, [open, invoice]);

  const loadItems = async (invoiceId: string) => {
    const { data } = await supabase.from("invoice_items").select("*").eq("invoice_id", invoiceId).order("display_order");
    setItems((data || []).map((d) => ({
      description: d.description, quantity: Number(d.quantity), unit: d.unit,
      unit_price: Number(d.unit_price), total: Number(d.total),
    })));
  };

  if (!invoice) return null;

  const inv = invoice as unknown as Record<string, unknown>;
  const subtotal = items.reduce((s, i) => s + i.total, 0);
  const totalPaid = payments.filter(p => p.invoice_id === invoice.id).reduce((s, p) => s + Number(p.amount), 0);
  const balanceDue = subtotal - totalPaid;

  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`<!DOCTYPE html><html><head><title>Invoice #${invoice.invoice_number}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #1a1a1a; padding: 40px; font-size: 13px; }
        .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; border-bottom: 3px solid ${accent}; padding-bottom: 20px; }
        .company-name { font-size: 22px; font-weight: 800; color: #1a1a0f; letter-spacing: -0.5px; }
        .company-detail { font-size: 11px; color: #666; margin-top: 2px; }
        .invoice-title { font-size: 28px; font-weight: 800; color: ${accent}; text-align: right; }
        .invoice-meta { text-align: right; font-size: 11px; color: #666; margin-top: 4px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
        th { background: #1a1a0f; color: #f5e6c0; font-size: 9px; text-transform: uppercase; letter-spacing: 0.5px; padding: 8px 12px; text-align: left; }
        th:nth-child(2), th:nth-child(4), th:nth-child(5) { text-align: right; }
        td { padding: 10px 12px; border-bottom: 1px solid #eee; font-size: 12px; }
        td:nth-child(2), td:nth-child(4), td:nth-child(5) { text-align: right; }
        .totals { display: flex; justify-content: flex-end; }
        .totals-table { width: 240px; }
        .totals-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 12px; }
        .totals-row.total { font-size: 16px; font-weight: 800; border-top: 2px solid #1a1a0f; padding-top: 10px; margin-top: 4px; }
        .totals-row.balance { color: ${balanceDue > 0 ? "#dc2626" : "#16a34a"}; }
        .notes { margin-top: 32px; padding-top: 16px; border-top: 1px solid #eee; font-size: 11px; color: #666; }
        .footer { margin-top: 48px; text-align: center; font-size: 10px; color: #999; }
        .logo { height: 40px; margin-bottom: 4px; }
      </style></head><body>
      ${printContent.innerHTML}
      </body></html>`);
    win.document.close();
    setTimeout(() => { win.print(); win.close(); }, 500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-base">Invoice Preview</DialogTitle>
            <Button size="sm" variant="outline" className="gap-1.5" onClick={handlePrint}>
              <Printer className="w-3.5 h-3.5" /> Print / PDF
            </Button>
          </div>
        </DialogHeader>

        <div ref={printRef} className="bg-white text-black rounded-lg p-6">
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, borderBottom: `3px solid ${accent}`, paddingBottom: 16 }}>
            <div>
              {logoUrl && <img src={logoUrl} alt="" style={{ height: 36, marginBottom: 4, objectFit: "contain" }} />}
              <div style={{ fontSize: 20, fontWeight: 800, color: "#1a1a0f" }}>{companyName}</div>
              {tagline && <div style={{ fontSize: 11, color: "#666", marginTop: 2 }}>{tagline}</div>}
              {websiteText && <div style={{ fontSize: 11, color: "#666" }}>{websiteText}</div>}
              {companyAddr && <div style={{ fontSize: 11, color: "#666" }}>{companyAddr}</div>}
              {companyPhone && <div style={{ fontSize: 11, color: "#666" }}>{companyPhone}</div>}
              {companyEmail && <div style={{ fontSize: 11, color: "#666" }}>{companyEmail}</div>}
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: accent }}>INVOICE</div>
              <div style={{ fontSize: 11, color: "#666", marginTop: 4 }}>#{invoice.invoice_number}</div>
              {inv.due_date && <div style={{ fontSize: 11, color: "#666" }}>Due: {new Date(inv.due_date as string).toLocaleDateString()}</div>}
              <div style={{ fontSize: 10, marginTop: 4, padding: "2px 8px", borderRadius: 4, display: "inline-block", background: invoice.status === "paid" ? "#dcfce7" : invoice.status === "sent" ? "#dbeafe" : "#f3f4f6", color: invoice.status === "paid" ? "#16a34a" : invoice.status === "sent" ? "#2563eb" : "#666" }}>
                {invoice.status.toUpperCase()}
              </div>
            </div>
          </div>

          {/* Bill To */}
          {(inv.client_name || inv.client_email || inv.client_address) && (
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "#999", marginBottom: 6 }}>BILL TO</div>
              {inv.client_name && <div style={{ fontSize: 14, fontWeight: 600 }}>{String(inv.client_name)}</div>}
              {inv.client_email && <div style={{ fontSize: 11, color: "#666" }}>{String(inv.client_email)}</div>}
              {inv.client_address && <div style={{ fontSize: 11, color: "#666" }}>{String(inv.client_address)}</div>}
            </div>
          )}

          {/* Items table */}
          <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 24 }}>
            <thead>
              <tr style={{ background: "#1a1a0f" }}>
                <th style={{ color: "#f5e6c0", fontSize: 9, textTransform: "uppercase", letterSpacing: 0.5, padding: "8px 12px", textAlign: "left" }}>Description</th>
                <th style={{ color: "#f5e6c0", fontSize: 9, textTransform: "uppercase", letterSpacing: 0.5, padding: "8px 12px", textAlign: "right" }}>Qty</th>
                <th style={{ color: "#f5e6c0", fontSize: 9, textTransform: "uppercase", letterSpacing: 0.5, padding: "8px 12px", textAlign: "center" }}>Unit</th>
                <th style={{ color: "#f5e6c0", fontSize: 9, textTransform: "uppercase", letterSpacing: 0.5, padding: "8px 12px", textAlign: "right" }}>Price</th>
                <th style={{ color: "#f5e6c0", fontSize: 9, textTransform: "uppercase", letterSpacing: 0.5, padding: "8px 12px", textAlign: "right" }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={idx}>
                  <td style={{ padding: "10px 12px", borderBottom: "1px solid #eee", fontSize: 12 }}>{item.description}</td>
                  <td style={{ padding: "10px 12px", borderBottom: "1px solid #eee", fontSize: 12, textAlign: "right" }}>{item.quantity}</td>
                  <td style={{ padding: "10px 12px", borderBottom: "1px solid #eee", fontSize: 12, textAlign: "center" }}>{item.unit}</td>
                  <td style={{ padding: "10px 12px", borderBottom: "1px solid #eee", fontSize: 12, textAlign: "right" }}>${Number(item.unit_price).toFixed(2)}</td>
                  <td style={{ padding: "10px 12px", borderBottom: "1px solid #eee", fontSize: 12, textAlign: "right", fontWeight: 600 }}>${item.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <div style={{ width: 220 }}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 12 }}>
                <span>Subtotal</span><span>${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              {totalPaid > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 12, color: "#16a34a" }}>
                  <span>Paid</span><span>-${totalPaid.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0 6px", fontSize: 16, fontWeight: 800, borderTop: "2px solid #1a1a0f", marginTop: 4, color: balanceDue > 0 ? "#dc2626" : "#16a34a" }}>
                <span>Balance Due</span><span>${balanceDue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {inv.notes && (
            <div style={{ marginTop: 32, paddingTop: 16, borderTop: "1px solid #eee", fontSize: 11, color: "#666" }}>
              <strong>Notes:</strong> {String(inv.notes)}
            </div>
          )}

          <div style={{ marginTop: 48, textAlign: "center", fontSize: 10, color: "#999" }}>
            {footerMsg}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
