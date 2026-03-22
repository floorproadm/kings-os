import { useState } from "react";
import { formatPhone } from "@/lib/formatPhone";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PARTNER_TYPES, PIPELINE_STAGES, STAGE_CONFIG } from "@/hooks/admin/usePartnersData";
import { Loader2, Handshake } from "lucide-react";

const schema = z.object({
  company_name: z.string().min(1, "Company name is required").max(100),
  contact_name: z.string().max(100).optional(),
  phone: z.string().max(20).optional(),
  email: z.string().email("Invalid email").max(255).optional().or(z.literal("")),
  partner_type: z.string().default("builder"),
  status: z.string().default("prospect"),
  notes: z.string().max(1000).optional(),
});

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSubmit: (data: z.infer<typeof schema>) => Promise<void>;
}

export function NewPartnerDialog({ open, onOpenChange, onSubmit }: Props) {
  const [form, setForm] = useState({ company_name: "", contact_name: "", phone: "", email: "", partner_type: "builder", status: "prospect", notes: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const reset = () => { setForm({ company_name: "", contact_name: "", phone: "", email: "", partner_type: "builder", status: "prospect", notes: "" }); setErrors({}); };

  const handleSave = async () => {
    const result = schema.safeParse(form);
    if (!result.success) {
      const e: Record<string, string> = {};
      result.error.errors.forEach((err) => { e[err.path[0] as string] = err.message; });
      setErrors(e);
      return;
    }
    setSaving(true);
    try {
      await onSubmit(result.data);
      reset();
      onOpenChange(false);
    } finally { setSaving(false); }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) reset(); onOpenChange(v); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Handshake className="w-5 h-5 text-primary" /> New Partner
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Company Name *</Label>
            <Input value={form.company_name} onChange={(e) => { setForm(f => ({ ...f, company_name: e.target.value })); setErrors(er => ({ ...er, company_name: "" })); }} placeholder="ABC Builders" />
            {errors.company_name && <p className="text-xs text-destructive mt-1">{errors.company_name}</p>}
          </div>
          <div>
            <Label>Contact Name</Label>
            <Input value={form.contact_name} onChange={(e) => setForm(f => ({ ...f, contact_name: e.target.value }))} placeholder="John Smith" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Phone</Label>
              <Input type="tel" value={form.phone} onChange={(e) => setForm(f => ({ ...f, phone: formatPhone(e.target.value) }))} placeholder="(913) 000-0000" />
            </div>
            <div>
              <Label>Email</Label>
              <Input value={form.email} onChange={(e) => { setForm(f => ({ ...f, email: e.target.value })); setErrors(er => ({ ...er, email: "" })); }} placeholder="john@abc.com" />
              {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Type</Label>
              <Select value={form.partner_type} onValueChange={(v) => setForm(f => ({ ...f, partner_type: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PARTNER_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Stage</Label>
              <Select value={form.status} onValueChange={(v) => setForm(f => ({ ...f, status: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PIPELINE_STAGES.map(s => <SelectItem key={s} value={s}>{STAGE_CONFIG[s].label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>Notes</Label>
            <Textarea value={form.notes} onChange={(e) => setForm(f => ({ ...f, notes: e.target.value }))} rows={3} placeholder="Initial notes..." />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => { reset(); onOpenChange(false); }}>Cancel</Button>
          <Button variant="gold" onClick={handleSave} disabled={saving}>
            {saving && <Loader2 className="w-4 h-4 animate-spin" />} Create Partner
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
