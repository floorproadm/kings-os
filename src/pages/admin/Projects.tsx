import { useState, useMemo, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, LayoutGrid, List, FolderPlus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
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
    <div className="space-y-3">
      {/* Top Bar */}
      <div className="bg-card border rounded-xl px-3 sm:px-4 py-3 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 sm:gap-4">
            <div>
              <span className="text-[10px] sm:text-xs text-muted-foreground block">Projects</span>
              <span className="text-lg sm:text-xl font-bold text-foreground">{filtered.length}</span>
            </div>
            <Button size="sm" onClick={() => setShowNew(true)} className="bg-primary text-primary-foreground text-xs h-8 gap-1.5">
              <FolderPlus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Project</span>
            </Button>
          </div>
          <div className="flex items-center border rounded-lg overflow-hidden flex-shrink-0">
            <button onClick={() => setViewMode("board")} className={cn("flex items-center gap-1 px-2.5 sm:px-3 py-1.5 text-xs font-medium transition-colors", viewMode === "board" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground")}>
              <LayoutGrid className="w-3.5 h-3.5" /><span className="hidden sm:inline">Board</span>
            </button>
            <button onClick={() => setViewMode("list")} className={cn("flex items-center gap-1 px-2.5 sm:px-3 py-1.5 text-xs font-medium transition-colors border-l", viewMode === "list" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground")}>
              <List className="w-3.5 h-3.5" /><span className="hidden sm:inline">List</span>
            </button>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search projects..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-8 text-xs" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[150px] h-8 text-xs"><SelectValue /></SelectTrigger>
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
