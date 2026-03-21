import { useState, useEffect, useRef, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  Tag,
  Calendar,
  Globe,
  Trash2,
  Loader2,
  ExternalLink,
  Copy,
  Clock,
  StickyNote,
  Check,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const STATUSES = ["new", "contacted", "quoted", "closed", "lost"] as const;

const statusConfig: Record<
  string,
  { bg: string; text: string; label: string; dot: string }
> = {
  new: {
    bg: "bg-blue-500/15",
    text: "text-blue-400",
    label: "New",
    dot: "bg-blue-400",
  },
  contacted: {
    bg: "bg-yellow-500/15",
    text: "text-yellow-400",
    label: "Contacted",
    dot: "bg-yellow-400",
  },
  quoted: {
    bg: "bg-purple-500/15",
    text: "text-purple-400",
    label: "Quoted",
    dot: "bg-purple-400",
  },
  closed: {
    bg: "bg-green-500/15",
    text: "text-green-400",
    label: "Closed",
    dot: "bg-green-400",
  },
  lost: {
    bg: "bg-red-500/15",
    text: "text-red-400",
    label: "Lost",
    dot: "bg-red-400",
  },
};

const sourceLabels: Record<string, string> = {
  website: "Website",
  "contact-page": "Contact Page",
  popup: "Popup",
  b2b: "B2B",
  referral: "Referral",
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
  internal_notes?: string | null;
}

interface LeadDetailModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (id: string, status: string) => void;
  onDelete: (id: string) => void;
}

function getTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

function copyToClipboard(text: string, label: string) {
  navigator.clipboard.writeText(text);
  toast.success(`${label} copied`);
}

/* ─── Contact Chip ─── */
function ContactChip({
  icon: Icon,
  value,
  href,
  label,
}: {
  icon: typeof Phone;
  value: string;
  href: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-1.5 group">
      <a
        href={href}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/40 hover:bg-primary/10 border border-border/50 hover:border-primary/30 transition-all text-sm"
      >
        <Icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
        <span className="text-foreground">{value}</span>
        <ExternalLink className="w-3 h-3 text-muted-foreground/50" />
      </a>
      <button
        onClick={() => copyToClipboard(value, label)}
        className="p-1.5 rounded-md hover:bg-muted/60 text-muted-foreground/50 hover:text-foreground transition-colors"
        title={`Copy ${label}`}
      >
        <Copy className="w-3 h-3" />
      </button>
    </div>
  );
}

/* ─── Detail Item ─── */
function DetailItem({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof Tag;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-muted/40 border border-border/30 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon className="w-3.5 h-3.5 text-muted-foreground" />
      </div>
      <div className="min-w-0 flex-1 pt-0.5">
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground/70 font-semibold block mb-0.5">
          {label}
        </span>
        {children}
      </div>
    </div>
  );
}

export function LeadDetailModal({
  lead,
  isOpen,
  onClose,
  onStatusChange,
  onDelete,
}: LeadDetailModalProps) {
  const [deleting, setDeleting] = useState(false);

  if (!lead) return null;

  const status = lead.status || "new";
  const config = statusConfig[status] || statusConfig.new;

  const handleStatusChange = async (newStatus: string) => {
    const { error } = await supabase
      .from("leads")
      .update({ status: newStatus })
      .eq("id", lead.id);
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

  const hasContact = lead.phone || lead.email;
  const hasDetails =
    lead.address || lead.service || lead.referral_code || lead.message;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[520px] p-0 overflow-hidden gap-0 border-border/50">
        {/* ── Header ── */}
        <div className="relative px-6 pt-6 pb-5">
          {/* Subtle gradient accent */}
          <div
            className={cn(
              "absolute inset-x-0 top-0 h-1 rounded-t-lg",
              status === "new" && "bg-blue-500",
              status === "contacted" && "bg-yellow-500",
              status === "quoted" && "bg-purple-500",
              status === "closed" && "bg-green-500",
              status === "lost" && "bg-red-500"
            )}
          />
          <DialogHeader className="space-y-0">
            <div className="flex items-start gap-4">
              {/* Large avatar */}
              <div
                className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold flex-shrink-0 shadow-sm",
                  config.bg,
                  config.text
                )}
              >
                {lead.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1 space-y-1.5">
                <DialogTitle className="text-xl font-bold tracking-tight truncate pr-8">
                  {lead.name}
                </DialogTitle>
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Status pill with dot */}
                  <Badge
                    className={cn(
                      "text-[11px] px-2.5 py-0.5 font-semibold rounded-full border-0 gap-1.5",
                      config.bg,
                      config.text
                    )}
                  >
                    <span
                      className={cn(
                        "w-1.5 h-1.5 rounded-full inline-block",
                        config.dot
                      )}
                    />
                    {config.label}
                  </Badge>
                  {/* Source */}
                  {lead.source && (
                    <Badge
                      variant="outline"
                      className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                    >
                      {sourceLabels[lead.source] || lead.source}
                    </Badge>
                  )}
                  {/* Time ago */}
                  {lead.created_at && (
                    <span className="flex items-center gap-1 text-[10px] text-muted-foreground/60">
                      <Clock className="w-3 h-3" />
                      {getTimeAgo(lead.created_at)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* ── Body ── */}
        <div className="px-6 pb-5 space-y-5 max-h-[55vh] overflow-y-auto">
          {/* Contact Section */}
          {hasContact && (
            <div className="space-y-2.5">
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/50">
                Contact
              </h4>
              <div className="flex flex-col gap-2">
                {lead.phone && (
                  <ContactChip
                    icon={Phone}
                    value={lead.phone}
                    href={`tel:${lead.phone}`}
                    label="Phone"
                  />
                )}
                {lead.email && (
                  <ContactChip
                    icon={Mail}
                    value={lead.email}
                    href={`mailto:${lead.email}`}
                    label="Email"
                  />
                )}
              </div>
            </div>
          )}

          {/* Details Section */}
          {hasDetails && (
            <div className="space-y-3">
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/50">
                Details
              </h4>
              <div className="space-y-3">
                {lead.address && (
                  <DetailItem icon={MapPin} label="Zipcode">
                    <span className="text-sm text-foreground">
                      {lead.address}
                    </span>
                  </DetailItem>
                )}
                {lead.service && (
                  <DetailItem icon={Tag} label="Service">
                    <Badge
                      variant="secondary"
                      className="text-xs px-2.5 py-0.5 font-medium"
                    >
                      {lead.service}
                    </Badge>
                  </DetailItem>
                )}
                {lead.referral_code && (
                  <DetailItem icon={Globe} label="Referral Code">
                    <code className="text-xs bg-muted/60 px-2 py-1 rounded-md font-mono text-primary">
                      {lead.referral_code}
                    </code>
                  </DetailItem>
                )}
                {lead.message && (
                  <DetailItem icon={MessageSquare} label="Message">
                    <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed bg-muted/30 rounded-lg px-3 py-2.5 border border-border/30">
                      {lead.message}
                    </p>
                  </DetailItem>
                )}
              </div>
            </div>
          )}

          {/* Timeline - Created Date */}
          {lead.created_at && (
            <div className="space-y-2.5">
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/50">
                Timeline
              </h4>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-muted/40 border border-border/30 flex items-center justify-center">
                  <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground/70 font-semibold block">
                    Created
                  </span>
                  <span className="text-sm text-foreground">
                    {new Date(lead.created_at).toLocaleDateString("en-US", {
                      weekday: "short",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="px-6 py-4 border-t border-border/40 bg-muted/10">
          <div className="flex items-center justify-between gap-3">
            {/* Delete */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive/70 hover:text-destructive hover:bg-destructive/10 gap-1.5 h-8 text-xs"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this lead?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete{" "}
                    <strong>{lead.name}</strong>. This action cannot be
                    undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    disabled={deleting}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {deleting && (
                      <Loader2 className="w-4 h-4 animate-spin mr-1" />
                    )}
                    Yes, delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {/* Status Selector */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                Status
              </span>
              <Select value={status} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-[140px] h-8 text-xs rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => {
                    const sc = statusConfig[s];
                    return (
                      <SelectItem key={s} value={s}>
                        <span className="flex items-center gap-2">
                          <span
                            className={cn(
                              "w-2 h-2 rounded-full inline-block",
                              sc.dot
                            )}
                          />
                          <span className="capitalize">{s}</span>
                        </span>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
