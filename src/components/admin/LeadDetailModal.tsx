import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Phone, Mail, MapPin, MessageSquare, Tag, Calendar, Globe, Trash2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const STATUSES = ["new", "contacted", "quoted", "closed", "lost"];

const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
  new: { bg: "bg-blue-500/15", text: "text-blue-400", label: "New" },
  contacted: { bg: "bg-yellow-500/15", text: "text-yellow-400", label: "Contacted" },
  quoted: { bg: "bg-purple-500/15", text: "text-purple-400", label: "Quoted" },
  closed: { bg: "bg-green-500/15", text: "text-green-400", label: "Closed" },
  lost: { bg: "bg-red-500/15", text: "text-red-400", label: "Lost" },
};

interface Lead {
  id: string;
  name: string;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  service?: string | null;
  message?: string | null;
  source?: string | null;
  referral_code?: string | null;
  status?: string | null;
  created_at?: string | null;
}

interface LeadDetailModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (id: string, status: string) => void;
  onDelete: (id: string) => void;
}

function InfoRow({ icon: Icon, label, value, href }: { icon: any; label: string; value?: string | null; href?: string }) {
  if (!value) return null;
  const content = href ? (
    <a href={href} className="text-sm text-primary hover:underline break-all">{value}</a>
  ) : (
    <span className="text-sm text-foreground break-all">{value}</span>
  );
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-border/50 last:border-0">
      <div className="w-8 h-8 rounded-lg bg-muted/60 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon className="w-4 h-4 text-muted-foreground" />
      </div>
      <div className="min-w-0 flex-1">
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium block">{label}</span>
        {content}
      </div>
    </div>
  );
}

export function LeadDetailModal({ lead, isOpen, onClose, onStatusChange, onDelete }: LeadDetailModalProps) {
  const [deleting, setDeleting] = useState(false);

  if (!lead) return null;

  const status = lead.status || "new";
  const config = statusConfig[status] || statusConfig.new;

  const handleStatusChange = async (newStatus: string) => {
    const { error } = await supabase.from("leads").update({ status: newStatus }).eq("id", lead.id);
    if (error) {
      toast.error("Failed to update status");
    } else {
      toast.success("Status updated");
      onStatusChange(lead.id, newStatus);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    const { error } = await supabase.from("leads").delete().eq("id", lead.id);
    setDeleting(false);
    if (error) {
      toast.error("Failed to delete lead");
    } else {
      toast.success("Lead deleted");
      onClose();
      onDelete(lead.id);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-border/50">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className={cn("w-11 h-11 rounded-full flex items-center justify-center text-base font-bold flex-shrink-0", config.bg, config.text)}>
                {lead.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <DialogTitle className="text-lg font-bold truncate">{lead.name}</DialogTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={cn("text-[10px] px-2 py-0.5 font-semibold rounded-md border-0", config.bg, config.text)}>
                    {config.label}
                  </Badge>
                  {lead.source && (
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4">
                      {lead.source}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Body */}
        <div className="px-6 py-4 space-y-1 max-h-[60vh] overflow-y-auto">
          <InfoRow icon={Phone} label="Phone" value={lead.phone} href={lead.phone ? `tel:${lead.phone}` : undefined} />
          <InfoRow icon={Mail} label="Email" value={lead.email} href={lead.email ? `mailto:${lead.email}` : undefined} />
          <InfoRow icon={MapPin} label="Address / Zipcode" value={lead.address} />
          <InfoRow icon={Tag} label="Service" value={lead.service} />
          <InfoRow icon={Globe} label="Referral Code" value={lead.referral_code} />
          <InfoRow icon={Calendar} label="Date" value={lead.created_at ? new Date(lead.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" }) : null} />
          
          {lead.message && (
            <div className="flex items-start gap-3 py-2.5">
              <div className="w-8 h-8 rounded-lg bg-muted/60 flex items-center justify-center flex-shrink-0 mt-0.5">
                <MessageSquare className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium block">Message</span>
                <p className="text-sm text-foreground whitespace-pre-wrap mt-0.5">{lead.message}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer: Status Updater */}
        <div className="px-6 py-4 border-t border-border/50 bg-muted/20">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-medium text-muted-foreground">Update Status</span>
            <Select value={status} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-[160px] h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    <span className="capitalize">{s}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
