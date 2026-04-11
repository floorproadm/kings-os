import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { DollarSign, Calendar } from "lucide-react";
import { Project } from "@/hooks/admin/useProjectsData";
import { statusConfig } from "./ProjectPipelineBoard";

interface Props {
  projects: Project[];
  onSelect: (p: Project) => void;
}

export function ProjectListView({ projects, onSelect }: Props) {
  return (
    <div className="space-y-1.5">
      <div className="hidden md:grid grid-cols-[2fr_120px_120px_100px_90px] gap-3 px-5 py-3 text-[10px] font-bold text-muted-foreground/70 uppercase tracking-widest">
        <span>Project</span>
        <span>Status</span>
        <span>Value</span>
        <span>Schedule</span>
        <span className="text-right">Created</span>
      </div>
      <div className="max-h-[60vh] overflow-y-auto space-y-1.5 px-0.5">
        {projects.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground/60 text-xs">No projects found</div>
        ) : (
          projects.map((p) => <ProjectRow key={p.id} project={p} onClick={() => onSelect(p)} />)
        )}
      </div>
    </div>
  );
}

function ProjectRow({ project, onClick }: { project: Project; onClick: () => void }) {
  const config = statusConfig[project.status] || statusConfig.planning;
  return (
    <>
      {/* Desktop */}
      <div
        onClick={onClick}
        className={cn(
          "hidden md:grid grid-cols-[2fr_120px_120px_100px_90px] gap-3 px-5 py-3.5 rounded-xl border bg-card cursor-pointer transition-all duration-200",
          "hover:shadow-lg hover:shadow-primary/5 hover:border-primary/30 hover:-translate-y-[1px]"
        )}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0", config.bg, config.text)}>
            {project.title.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-semibold text-sm text-foreground truncate leading-tight">{project.title}</span>
            {project.lead_name && <span className="text-[10px] text-muted-foreground truncate">{project.lead_name}</span>}
          </div>
        </div>
        <div className="flex items-center">
          <Badge className={cn("text-[10px] px-2 py-0.5 h-5 font-semibold rounded-md border-0", config.bg, config.text)}>
            {config.label}
          </Badge>
        </div>
        <div className="flex items-center text-xs text-foreground">
          <DollarSign className="w-3 h-3 mr-0.5 text-muted-foreground" />
          {Number(project.total_value).toLocaleString()}
        </div>
        <div className="flex items-center text-[11px] text-muted-foreground">
          {project.scheduled_date ? new Date(project.scheduled_date).toLocaleDateString() : "—"}
        </div>
        <div className="flex items-center justify-end text-[10px] text-muted-foreground">
          {new Date(project.created_at).toLocaleDateString()}
        </div>
      </div>
      {/* Mobile */}
      <div onClick={onClick} className="md:hidden p-3 rounded-xl border bg-card cursor-pointer hover:border-primary/30">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-sm text-foreground truncate">{project.title}</span>
          <Badge className={cn("text-[9px] px-1.5 py-0 h-4 border-0", config.bg, config.text)}>{config.label}</Badge>
        </div>
        {project.lead_name && <p className="text-[10px] text-muted-foreground mt-0.5">{project.lead_name}</p>}
        <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-0.5"><DollarSign className="w-2.5 h-2.5" />{Number(project.total_value).toLocaleString()}</span>
          <span className="flex items-center gap-0.5"><Calendar className="w-2.5 h-2.5" />{project.scheduled_date ? new Date(project.scheduled_date).toLocaleDateString() : "—"}</span>
        </div>
      </div>
    </>
  );
}
