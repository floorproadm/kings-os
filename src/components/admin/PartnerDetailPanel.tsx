import { useState, useEffect } from "react";
import { Partner, STAGE_CONFIG, PIPELINE_STAGES, PARTNER_TYPES, isAtRisk } from "@/hooks/admin/usePartnersData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ArrowLeft, Phone, Mail, MessageSquare, Pencil, Trash2, AlertTriangle, Save, X } from "lucide-react";
import { toast } from "sonner";

interface Props {
  partner: Partner;
  onBack: () => void;
  onUpdate: (id: string, data: Partial<Partner>) => void;
  onDelete: (id: string) => void;
}

export function PartnerDetailPanel({ partner, onBack, onUpdate, onDelete }: Props) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(partner);
  const [notes, setNotes] = useState(partner.notes || "");
  const stage = STAGE_CONFIG[partner.status] || STAGE_CONFIG.prospect;
  const type = PARTNER_TYPES.find(t => t.value === partner.partner_type)?.label || partner.partner_type;
  const atRisk = isAtRisk(partner);

  useEffect(() => { setForm(partner); setNotes(partner.notes || ""); setEditing(false); }, [partner]);

  // Auto-save notes
  useEffect(() => {
    if (notes === (partner.notes || "")) return;
    const t = setTimeout(() => { onUpdate(partner.id, { notes }); }, 1200);
    return () => clearTimeout(t);
  }, [notes]);

  const handleSave = () => {
    onUpdate(partner.id, {
      company_name: form.company_name,
      contact_name: form.contact_name,
      email: form.email,
      phone: form.phone,
      partner_type: form.partner_type,
      service_zone: form.service_zone,
      status: form.status,
      next_action_date: form.next_action_date,
      next_action_note: form.next_action_note,
    });
    toast.success("Partner updated");
    setEditing(false);
  };

  const initials = partner.company_name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack}><ArrowLeft className="w-4 h-4" /></Button>
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-lg font-bold">{initials}</div>
          <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-background ${stage.dotColor}`} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-display font-semibold">{partner.company_name}</h2>
            {atRisk && <Badge variant="outline" className="text-amber-400 border-amber-400/40 gap-1"><AlertTriangle className="w-3 h-3" />At Risk</Badge>}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <Badge className={stage.color}>{stage.label}</Badge>
            <Badge variant="outline" className="text-xs">{type}</Badge>
          </div>
        </div>
        <div className="flex gap-1">
          {!editing ? (
            <Button variant="ghost" size="sm" onClick={() => setEditing(true)}><Pencil className="w-4 h-4" /></Button>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => { setForm(partner); setEditing(false); }}><X className="w-4 h-4" /></Button>
              <Button variant="gold" size="sm" onClick={handleSave}><Save className="w-4 h-4" /></Button>
            </>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="flex gap-2">
        {partner.phone && (
          <>
            <Button variant="outline" size="sm" asChild><a href={`tel:${partner.phone}`}><Phone className="w-3.5 h-3.5" /> Call</a></Button>
            <Button variant="outline" size="sm" asChild><a href={`sms:${partner.phone}`}><MessageSquare className="w-3.5 h-3.5" /> SMS</a></Button>
          </>
        )}
        {partner.email && <Button variant="outline" size="sm" asChild><a href={`mailto:${partner.email}`}><Mail className="w-3.5 h-3.5" /> Email</a></Button>}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-card rounded-lg p-3 text-center border border-border">
          <p className="text-2xl font-bold text-primary">{partner.total_referrals}</p>
          <p className="text-[10px] text-muted-foreground">Referrals</p>
        </div>
        <div className="bg-card rounded-lg p-3 text-center border border-border">
          <p className="text-2xl font-bold text-foreground">{partner.total_converted}</p>
          <p className="text-[10px] text-muted-foreground">Converted</p>
        </div>
        <div className="bg-card rounded-lg p-3 text-center border border-border">
          <p className="text-2xl font-bold text-foreground">{partner.total_referrals > 0 ? Math.round((partner.total_converted / partner.total_referrals) * 100) : 0}%</p>
          <p className="text-[10px] text-muted-foreground">Rate</p>
        </div>
      </div>

      {/* Form / Details */}
      {editing ? (
        <div className="space-y-3">
          <div><Label>Company</Label><Input value={form.company_name} onChange={e => setForm(f => ({ ...f, company_name: e.target.value }))} /></div>
          <div><Label>Contact</Label><Input value={form.contact_name || ""} onChange={e => setForm(f => ({ ...f, contact_name: e.target.value }))} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Phone</Label><Input value={form.phone || ""} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} /></div>
            <div><Label>Email</Label><Input value={form.email || ""} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Type</Label>
              <Select value={form.partner_type} onValueChange={v => setForm(f => ({ ...f, partner_type: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{PARTNER_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Stage</Label>
              <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{PIPELINE_STAGES.map(s => <SelectItem key={s} value={s}>{STAGE_CONFIG[s].label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div><Label>Next Action Date</Label><Input type="date" value={form.next_action_date || ""} onChange={e => setForm(f => ({ ...f, next_action_date: e.target.value }))} /></div>
          <div><Label>Next Action</Label><Input value={form.next_action_note || ""} onChange={e => setForm(f => ({ ...f, next_action_note: e.target.value }))} /></div>
        </div>
      ) : (
        <div className="space-y-2 text-sm">
          {partner.contact_name && <div className="flex justify-between"><span className="text-muted-foreground">Contact</span><span>{partner.contact_name}</span></div>}
          {partner.phone && <div className="flex justify-between"><span className="text-muted-foreground">Phone</span><span>{partner.phone}</span></div>}
          {partner.email && <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span>{partner.email}</span></div>}
          {partner.service_zone && <div className="flex justify-between"><span className="text-muted-foreground">Zone</span><span className="capitalize">{partner.service_zone}</span></div>}
          {partner.next_action_date && <div className="flex justify-between"><span className="text-muted-foreground">Next Action</span><span>{partner.next_action_date}</span></div>}
          {partner.next_action_note && <div className="flex justify-between"><span className="text-muted-foreground">Action Note</span><span className="text-right max-w-[60%]">{partner.next_action_note}</span></div>}
        </div>
      )}

      {/* Notes */}
      <div>
        <Label className="text-muted-foreground">Internal Notes</Label>
        <Textarea value={notes} onChange={e => setNotes(e.target.value)} rows={4} placeholder="Add notes about this partner..." className="mt-1" />
      </div>

      {/* Delete */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive w-full"><Trash2 className="w-4 h-4" /> Delete Partner</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete "{partner.company_name}"?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => { onDelete(partner.id); onBack(); }} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
