import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onSubmit: (data: {
    title: string;
    lead_id?: string | null;
    address?: string;
    scheduled_date?: string;
    total_value?: number;
    notes?: string;
  }) => Promise<void>;
  isSubmitting?: boolean;
}

export function NewProjectDialog({ open, onOpenChange, onSubmit, isSubmitting }: Props) {
  const [title, setTitle] = useState("");
  const [leadId, setLeadId] = useState<string>("");
  const [address, setAddress] = useState("");
  const [date, setDate] = useState("");
  const [value, setValue] = useState("");
  const [notes, setNotes] = useState("");
  const [leads, setLeads] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    if (open) {
      supabase.from("leads").select("id, name").order("created_at", { ascending: false }).limit(100).then(({ data }) => {
        setLeads(data || []);
      });
    }
  }, [open]);

  const reset = () => {
    setTitle("");
    setLeadId("");
    setAddress("");
    setDate("");
    setValue("");
    setNotes("");
  };

  const handleSubmit = async () => {
    if (!title.trim()) return;
    await onSubmit({
      title: title.trim(),
      lead_id: leadId || null,
      address: address || undefined,
      scheduled_date: date || undefined,
      total_value: value ? parseFloat(value) : undefined,
      notes: notes || undefined,
    });
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">New Project</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label className="text-xs">Title *</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Smith Residence Sanding" className="h-9 text-sm" />
          </div>
          <div>
            <Label className="text-xs">Link to Lead</Label>
            <Select value={leadId} onValueChange={setLeadId}>
              <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select lead (optional)" /></SelectTrigger>
              <SelectContent>
                {leads.map((l) => <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Address</Label>
            <Input value={address} onChange={(e) => setAddress(e.target.value)} className="h-9 text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Scheduled Date</Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="h-9 text-sm" />
            </div>
            <div>
              <Label className="text-xs">Contract Value ($)</Label>
              <Input type="number" value={value} onChange={(e) => setValue(e.target.value)} placeholder="0" className="h-9 text-sm" />
            </div>
          </div>
          <div>
            <Label className="text-xs">Notes</Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="text-sm" />
          </div>
          <Button onClick={handleSubmit} disabled={!title.trim() || isSubmitting} className="w-full">
            {isSubmitting ? "Creating..." : "Create Project"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
