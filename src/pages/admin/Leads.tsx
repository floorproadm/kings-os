import { useEffect, useState, useMemo, useCallback, DragEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Search, LayoutGrid, List, Phone, Mail, MapPin, Calendar, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { LeadDetailModal } from "@/components/admin/LeadDetailModal";
import { NewLeadModal } from "@/components/admin/NewLeadModal";
import { Button } from "@/components/ui/button";

const STATUSES = ["all", "new", "contacted", "quoted", "closed", "lost"];
const BOARD_STATUSES = ["new", "contacted", "quoted", "closed", "lost"] as const;
const SOURCES = ["all", "website", "b2b", "referral", "contact-page", "popup"];

type ViewMode = "board" | "list";

const statusConfig: Record<string, { bg: string; text: string; label: string; headerBg: string }> = {
  new: { bg: "bg-blue-500/15", text: "text-blue-400", label: "New", headerBg: "bg-blue-500/10 border-blue-500/20" },
  contacted: { bg: "bg-yellow-500/15", text: "text-yellow-400", label: "Contacted", headerBg: "bg-yellow-500/10 border-yellow-500/20" },
  quoted: { bg: "bg-purple-500/15", text: "text-purple-400", label: "Quoted", headerBg: "bg-purple-500/10 border-purple-500/20" },
  closed: { bg: "bg-green-500/15", text: "text-green-400", label: "Closed", headerBg: "bg-green-500/10 border-green-500/20" },
  lost: { bg: "bg-red-500/15", text: "text-red-400", label: "Lost", headerBg: "bg-red-500/10 border-red-500/20" },
};

const sourceLabels: Record<string, string> = {
  website: "Website",
  "contact-page": "Contact",
  popup: "Popup",
  b2b: "B2B",
  referral: "Referral",
};

export default function Leads() {
  const [leads, setLeads] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [viewMode, setViewMode] = useState<ViewMode>("board");
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [showNewLead, setShowNewLead] = useState(false);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    const { data } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
    setLeads(data || []);
  };

  const handleStatusChange = (id: string, status: string) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    if (selectedLead?.id === id) {
      setSelectedLead((prev: any) => prev ? { ...prev, status } : prev);
    }
  };

  const handleCardClick = (lead: any) => {
    setSelectedLead(lead);
    setIsModalOpen(true);
  };

  // Drag & Drop handlers
  const handleDragStart = useCallback((e: DragEvent, leadId: string) => {
    e.dataTransfer.setData("text/plain", leadId);
    e.dataTransfer.effectAllowed = "move";
    setDraggingId(leadId);
  }, []);

  const handleDragOver = useCallback((e: DragEvent, status: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverColumn(status);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOverColumn(null);
  }, []);

  const handleDrop = useCallback(async (e: DragEvent, newStatus: string) => {
    e.preventDefault();
    setDragOverColumn(null);
    setDraggingId(null);
    const leadId = e.dataTransfer.getData("text/plain");
    if (!leadId) return;

    const lead = leads.find((l) => l.id === leadId);
    if (!lead || lead.status === newStatus) return;

    // Optimistic update
    setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l)));

    const { error } = await supabase.from("leads").update({ status: newStatus }).eq("id", leadId);
    if (error) {
      toast.error("Failed to move lead");
      setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, status: lead.status } : l)));
    } else {
      toast.success(`Moved to ${statusConfig[newStatus]?.label || newStatus}`);
    }
  }, [leads]);

  const handleDragEnd = useCallback(() => {
    setDragOverColumn(null);
    setDraggingId(null);
  }, []);

  const filtered = useMemo(() => leads.filter((l) => {
    const matchSearch =
      !search ||
      l.name?.toLowerCase().includes(search.toLowerCase()) ||
      l.phone?.toLowerCase().includes(search.toLowerCase()) ||
      l.email?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || l.status === statusFilter;
    const matchSource = sourceFilter === "all" || l.source === sourceFilter;
    return matchSearch && matchStatus && matchSource;
  }), [leads, search, statusFilter, sourceFilter]);

  const leadsByStatus = useMemo(() => {
    const grouped: Record<string, any[]> = {};
    BOARD_STATUSES.forEach((s) => { grouped[s] = []; });
    filtered.forEach((lead) => {
      const s = lead.status || "new";
      if (grouped[s]) grouped[s].push(lead);
    });
    return grouped;
  }, [filtered]);

  const totalLeads = filtered.length;

  return (
    <div className="space-y-3">
      {/* Top Bar */}
      <div className="bg-card border rounded-xl px-3 sm:px-4 py-3 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 sm:gap-4">
            <div>
              <span className="text-[10px] sm:text-xs text-muted-foreground block">Total Leads</span>
              <span className="text-lg sm:text-xl font-bold text-foreground">{totalLeads}</span>
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex items-center border rounded-lg overflow-hidden flex-shrink-0">
            <button
              onClick={() => setViewMode("board")}
              className={cn(
                "flex items-center gap-1 px-2.5 sm:px-3 py-1.5 text-xs font-medium transition-colors",
                viewMode === "board"
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-muted-foreground hover:text-foreground"
              )}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Board</span>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "flex items-center gap-1 px-2.5 sm:px-3 py-1.5 text-xs font-medium transition-colors border-l",
                viewMode === "list"
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-muted-foreground hover:text-foreground"
              )}
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">List</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search name, phone, email..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-8 text-xs" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[130px] h-8 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              {STATUSES.map((s) => (<SelectItem key={s} value={s}>{s === "all" ? "All Status" : <span className="capitalize">{s}</span>}</SelectItem>))}
            </SelectContent>
          </Select>
          <Select value={sourceFilter} onValueChange={setSourceFilter}>
            <SelectTrigger className="w-full sm:w-[130px] h-8 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              {SOURCES.map((s) => (<SelectItem key={s} value={s}>{s === "all" ? "All Sources" : sourceLabels[s] || s}</SelectItem>))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Board View */}
      {viewMode === "board" && (
        <div className="overflow-x-auto pb-2 -mx-1 px-1">
          <div className="flex gap-3 min-w-max">
            {BOARD_STATUSES.map((status) => {
              const config = statusConfig[status];
              const stageLeads = leadsByStatus[status] || [];

              return (
                <div
                  key={status}
                  className={cn(
                    "w-[220px] sm:w-[250px] flex-shrink-0 flex flex-col transition-all duration-200",
                    dragOverColumn === status && "scale-[1.02]"
                  )}
                  onDragOver={(e) => handleDragOver(e, status)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, status)}
                >
                  {/* Column Header */}
                  <div className={cn("flex items-center justify-between px-3 py-2.5 rounded-t-xl border border-b-0", config.headerBg)}>
                    <span className={cn("font-semibold text-xs", config.text)}>{config.label}</span>
                  </div>
                  <div className={cn("flex items-center justify-between px-3 py-1.5 border-x text-xs border-b", config.headerBg)}>
                    <span className="text-muted-foreground font-medium">{stageLeads.length} leads</span>
                  </div>

                  {/* Column Body */}
                  <div className={cn(
                    "flex-1 border border-t-0 rounded-b-xl transition-colors duration-200",
                    dragOverColumn === status
                      ? "bg-primary/5 border-primary/30 ring-2 ring-primary/20"
                      : "bg-muted/20"
                  )}>
                    <div className="max-h-[60vh] overflow-y-auto">
                      <div className="p-1.5 space-y-1.5">
                        {stageLeads.length === 0 ? (
                          <div className={cn(
                            "text-center py-16 text-xs transition-colors",
                            dragOverColumn === status ? "text-primary/60" : "text-muted-foreground/60"
                          )}>
                            {dragOverColumn === status ? "Drop here" : "No leads"}
                          </div>
                        ) : (
                          stageLeads.map((lead) => (
                            <BoardCard
                              key={lead.id}
                              lead={lead}
                              isDragging={draggingId === lead.id}
                              onClick={() => handleCardClick(lead)}
                              onDragStart={(e) => handleDragStart(e, lead.id)}
                              onDragEnd={handleDragEnd}
                            />
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <div className="space-y-1.5">
          {/* Desktop Header */}
          <div className="hidden md:grid grid-cols-[2fr_100px_140px_140px_100px_90px] gap-3 px-5 py-3 text-[10px] font-bold text-muted-foreground/70 uppercase tracking-widest">
            <span>Lead</span>
            <span>Status</span>
            <span>Phone</span>
            <span>Service</span>
            <span>Source</span>
            <span className="text-right">Date</span>
          </div>
          <div className="max-h-[60vh] overflow-y-auto space-y-1.5 px-0.5">
            {filtered.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground/60 text-xs">No leads found</div>
            ) : (
              filtered.map((lead) => (
                <ListRow key={lead.id} lead={lead} onClick={() => handleCardClick(lead)} />
              ))
            )}
          </div>
        </div>
      )}

      {/* Lead Detail Modal */}
      <LeadDetailModal
        lead={selectedLead}
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setSelectedLead(null); }}
        onStatusChange={handleStatusChange}
        onDelete={(id) => setLeads((prev) => prev.filter((l) => l.id !== id))}
      />
    </div>
  );
}

/* ─── Board Card ─── */
function BoardCard({ lead, isDragging, onClick, onDragStart, onDragEnd }: {
  lead: any;
  isDragging?: boolean;
  onClick: () => void;
  onDragStart?: (e: DragEvent<HTMLDivElement>) => void;
  onDragEnd?: () => void;
}) {
  const status = lead.status || "new";
  const config = statusConfig[status] || statusConfig.new;

  return (
    <div
      draggable
      onClick={onClick}
      onDragStart={onDragStart as any}
      onDragEnd={onDragEnd}
      className={cn(
        "p-3 rounded-lg border bg-card cursor-grab transition-all hover:shadow-md hover:border-primary/40",
        isDragging && "opacity-40 scale-95 ring-2 ring-primary/30"
      )}
    >
      {/* Row 1: Avatar + Name */}
      <div className="flex items-center gap-2">
        <div className={cn("w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0", config.bg, config.text)}>
          {lead.name.charAt(0).toUpperCase()}
        </div>
        <span className="font-semibold text-xs text-foreground truncate flex-1">{lead.name}</span>
      </div>

      {/* Row 2: Contact */}
      <div className="flex items-center gap-2 mt-1.5 text-[10px] text-muted-foreground">
        {lead.phone && (
          <a href={`tel:${lead.phone}`} onClick={(e) => e.stopPropagation()} className="flex items-center gap-0.5 hover:text-primary transition-colors">
            <Phone className="w-2.5 h-2.5 flex-shrink-0" />
            <span className="truncate max-w-[90px]">{lead.phone}</span>
          </a>
        )}
        {lead.source && (
          <Badge variant="outline" className="text-[9px] px-1 py-0 h-3.5">
            {sourceLabels[lead.source] || lead.source}
          </Badge>
        )}
      </div>

      {/* Row 3: Service */}
      {lead.service && (
        <div className="mt-1.5">
          <Badge variant="secondary" className="text-[9px] px-1.5 py-0 h-4">
            {lead.service}
          </Badge>
        </div>
      )}

      {/* Row 4: Date */}
      <div className="flex items-center gap-1 mt-1.5 pt-1.5 border-t text-[10px] text-muted-foreground">
        <Calendar className="w-2.5 h-2.5" />
        {lead.created_at ? new Date(lead.created_at).toLocaleDateString() : "—"}
      </div>
    </div>
  );
}

/* ─── List Row ─── */
function ListRow({ lead, onClick }: { lead: any; onClick: () => void }) {
  const status = lead.status || "new";
  const config = statusConfig[status] || statusConfig.new;

  return (
    <>
      {/* Desktop */}
      <div
        onClick={onClick}
        className={cn(
          "hidden md:grid grid-cols-[2fr_100px_140px_140px_100px_90px] gap-3 px-5 py-3.5 rounded-xl border bg-card cursor-pointer transition-all duration-200",
          "hover:shadow-lg hover:shadow-primary/5 hover:border-primary/30 hover:-translate-y-[1px]"
        )}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0", config.bg, config.text)}>
            {lead.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-semibold text-sm text-foreground truncate leading-tight">{lead.name}</span>
            {lead.email && <span className="text-[10px] text-muted-foreground truncate">{lead.email}</span>}
          </div>
        </div>
        <div className="flex items-center">
          <Badge className={cn("text-[10px] px-2 py-0.5 h-5 font-semibold rounded-md border-0", config.bg, config.text)}>
            {config.label}
          </Badge>
        </div>
        <div className="flex items-center">
          {lead.phone ? (
            <a href={`tel:${lead.phone}`} onClick={(e) => e.stopPropagation()} className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-primary transition-colors group">
              <div className="w-6 h-6 rounded-md bg-muted/60 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <Phone className="w-3 h-3" />
              </div>
              <span className="truncate">{lead.phone}</span>
            </a>
          ) : <span className="text-[10px] text-muted-foreground/40">—</span>}
        </div>
        <div className="flex items-center">
          {lead.service ? (
            <Badge variant="secondary" className="text-[9px] px-2 py-0.5 h-5 bg-muted/80 text-muted-foreground font-medium">
              {lead.service}
            </Badge>
          ) : <span className="text-[10px] text-muted-foreground/40">—</span>}
        </div>
        <div className="flex items-center">
          {lead.source ? (
            <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4 border-muted-foreground/20">
              {sourceLabels[lead.source] || lead.source}
            </Badge>
          ) : <span className="text-[10px] text-muted-foreground/40">—</span>}
        </div>
        <div className="flex items-center justify-end">
          <span className="text-[10px] text-muted-foreground">
            {lead.created_at ? new Date(lead.created_at).toLocaleDateString() : "—"}
          </span>
        </div>
      </div>

      {/* Mobile */}
      <div
        onClick={onClick}
        className="md:hidden rounded-xl border bg-card p-3.5 cursor-pointer transition-all duration-200 hover:shadow-md active:scale-[0.99]"
      >
        <div className="flex items-center gap-3">
          <div className={cn("w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0", config.bg, config.text)}>
            {lead.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold text-sm text-foreground truncate">{lead.name}</span>
              <Badge className={cn("text-[9px] px-1.5 py-0 h-4 font-semibold rounded border-0 flex-shrink-0", config.bg, config.text)}>
                {config.label}
              </Badge>
            </div>
            <div className="flex items-center gap-2 mt-1">
              {lead.phone && (
                <a href={`tel:${lead.phone}`} onClick={(e) => e.stopPropagation()} className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-primary">
                  <Phone className="w-3 h-3" />
                  <span>{lead.phone}</span>
                </a>
              )}
              {lead.source && (
                <Badge variant="outline" className="text-[9px] px-1 py-0 h-3.5 border-muted-foreground/20">
                  {sourceLabels[lead.source] || lead.source}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
