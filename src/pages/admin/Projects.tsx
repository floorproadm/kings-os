import { useState, useMemo, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, LayoutGrid, List, FolderPlus, Loader2, TrendingUp, DollarSign, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useProjectsData, PROJECT_STATUSES } from "@/hooks/admin/useProjectsData";
import { ProjectPipelineBoard } from "@/components/admin/projects/ProjectPipelineBoard";
import { ProjectListView } from "@/components/admin/projects/ProjectListView";
import { ProjectDetailPanel } from "@/components/admin/projects/ProjectDetailPanel";
import { NewProjectDialog } from "@/components/admin/projects/NewProjectDialog";
import type { Project } from "@/hooks/admin/useProjectsData";

type ViewMode = "board" | "list";

export default function Projects() {
  const { projects, isLoading, createProject, updateProject, isCreating } = useProjectsData();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState<ViewMode>("board");
  const [selected, setSelected] = useState<Project | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.lead_name?.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || p.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [projects, search, statusFilter]);

  const summaryKPIs = useMemo(() => {
    const active = projects.filter((p) => ["planning", "in_progress"].includes(p.status));
    const totalPipeline = active.reduce((s, p) => s + (Number(p.total_value) || 0), 0);
    const completed = projects.filter((p) => ["completed", "awaiting_payment", "paid"].includes(p.status));
    const totalCompleted = completed.reduce((s, p) => s + (Number(p.total_value) || 0), 0);
    return { activeCount: active.length, totalPipeline, completedCount: completed.length, totalCompleted };
  }, [projects]);

  const handleSelect = useCallback((p: Project) => {
    setSelected(p);
    setDetailOpen(true);
  }, []);

  const handleStatusChange = useCallback(async (id: string, status: string) => {
    const prev = projects.find((p) => p.id === id);
    if (!prev || prev.status === status) return;
    try {
      await updateProject({ id, status });
      if (selected?.id === id) setSelected((s) => s ? { ...s, status } : s);
      toast.success(`Moved to ${status.replace(/_/g, " ")}`);
    } catch {
      toast.error("Failed to update status");
    }
  }, [projects, updateProject, selected]);

  if (isLoading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-gold" /></div>;
  }

  return (
    <div className="space-y-4">
      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <KPISummaryCard icon={Briefcase} label="Active" value={summaryKPIs.activeCount.toString()} accent="text-blue-400" />
        <KPISummaryCard icon={DollarSign} label="Pipeline" value={`$${summaryKPIs.totalPipeline.toLocaleString()}`} accent="text-gold" />
        <KPISummaryCard icon={TrendingUp} label="Completed" value={summaryKPIs.completedCount.toString()} accent="text-green-400" />
        <KPISummaryCard icon={DollarSign} label="Revenue" value={`$${summaryKPIs.totalCompleted.toLocaleString()}`} accent="text-emerald-400" />
      </div>

      {/* Controls Bar */}
      <div className="bg-card/60 backdrop-blur border border-border/50 rounded-xl px-3 sm:px-4 py-3 space-y-2.5">
        <div className="flex items-center justify-between gap-3">
          <Button size="sm" onClick={() => setShowNew(true)} className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs h-8 gap-1.5 rounded-lg shadow-sm shadow-primary/20">
            <FolderPlus className="w-3.5 h-3.5" />
            <span>New Project</span>
          </Button>
          <div className="flex items-center bg-muted/40 rounded-lg p-0.5 flex-shrink-0">
            <button onClick={() => setViewMode("board")} className={cn("flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md transition-all", viewMode === "board" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}>
              <LayoutGrid className="w-3.5 h-3.5" /><span className="hidden sm:inline">Board</span>
            </button>
            <button onClick={() => setViewMode("list")} className={cn("flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md transition-all", viewMode === "list" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}>
              <List className="w-3.5 h-3.5" /><span className="hidden sm:inline">List</span>
            </button>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
            <Input placeholder="Search projects or clients..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9 text-xs bg-background/50 border-border/40 rounded-lg" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[160px] h-9 text-xs bg-background/50 border-border/40 rounded-lg"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {PROJECT_STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s.replace(/_/g, " ")}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {viewMode === "board" ? (
        <ProjectPipelineBoard projects={filtered} onSelect={handleSelect} onStatusChange={handleStatusChange} />
      ) : (
        <ProjectListView projects={filtered} onSelect={handleSelect} />
      )}

      <ProjectDetailPanel project={selected} isOpen={detailOpen} onClose={() => { setDetailOpen(false); setSelected(null); }} onStatusChange={handleStatusChange} />
      <NewProjectDialog open={showNew} onOpenChange={setShowNew} onSubmit={createProject} isSubmitting={isCreating} />
    </div>
  );
}

function KPISummaryCard({ icon: Icon, label, value, accent }: { icon: React.ElementType; label: string; value: string; accent: string }) {
  return (
    <div className="bg-card/60 backdrop-blur border border-border/40 rounded-xl p-3 flex items-center gap-3 hover:border-border/60 transition-colors">
      <div className={cn("w-9 h-9 rounded-lg bg-muted/50 flex items-center justify-center flex-shrink-0")}>
        <Icon className={cn("w-4 h-4", accent)} />
      </div>
      <div className="min-w-0">
        <p className={cn("text-base font-bold leading-tight", accent)}>{value}</p>
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</p>
      </div>
    </div>
  );
}
