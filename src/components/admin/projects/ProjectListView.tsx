import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { DollarSign, Calendar, ChevronRight } from "lucide-react";
import { Project } from "@/hooks/admin/useProjectsData";
import { statusConfig } from "./ProjectPipelineBoard";

interface Props {
  projects: Project[];
  onSelect: (p: Project) => void;
}

export function ProjectListView({ projects, onSelect }: Props) {
  return (
    <div className="space-y-1">
      <div className="hidden md:grid grid-cols-[2fr_110px_110px_100px_80px] gap-3 px-5 py-2.5 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
        <span>Project</span>
        <span>Status</span>
        <span>Value</span>
        <span>Schedule</span>
        <span className="text-right">Action</span>
      </div>
      <div className="max-h-[62vh] overflow-y-auto space-y-1 scrollbar-thin">
        {projects.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground/50 text-xs">No projects found</div>
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
          "hidden md:grid grid-cols-[2fr_110px_110px_100px_80px] gap-3 px-5 py-3 rounded-xl border border-border/30 bg-card/60 cursor-pointer transition-all duration-200",
          "hover:shadow-lg hover:shadow-black/10 hover:border-primary/20 hover:bg-card"
        )}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center text-[11px] font-bold flex-shrink-0", config.bg, config.text)}>
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
        <div className="flex items-center text-xs text-foreground font-medium">
          <DollarSign className="w-3 h-3 mr-0.5 text-gold/60" />
          {Number(project.total_value).toLocaleString()}
        </div>
        <div className="flex items-center text-[11px] text-muted-foreground">
          <Calendar className="w-3 h-3 mr-1" />
          {project.scheduled_date ? new Date(project.scheduled_date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—"}
        </div>
        <div className="flex items-center justify-end">
          <ChevronRight className="w-4 h-4 text-muted-foreground/40" />
        </div>
      </div>
      {/* Mobile */}
      <div onClick={onClick} className="md:hidden p-3 rounded-xl border border-border/30 bg-card/60 cursor-pointer hover:border-primary/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold flex-shrink-0", config.bg, config.text)}>
              {project.title.charAt(0).toUpperCase()}
            </div>
            <span className="font-semibold text-sm text-foreground truncate">{project.title}</span>
          </div>
          <Badge className={cn("text-[9px] px-1.5 py-0 h-4 border-0 flex-shrink-0", config.bg, config.text)}>{config.label}</Badge>
        </div>
        {project.lead_name && <p className="text-[10px] text-muted-foreground mt-1 ml-[42px]">{project.lead_name}</p>}
        <div className="flex items-center gap-4 mt-2 ml-[42px] text-[10px] text-muted-foreground">
          <span className="flex items-center gap-0.5 font-medium text-foreground/80"><DollarSign className="w-2.5 h-2.5 text-gold/60" />{Number(project.total_value).toLocaleString()}</span>
          <span className="flex items-center gap-0.5"><Calendar className="w-2.5 h-2.5" />{project.scheduled_date ? new Date(project.scheduled_date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—"}</span>
        </div>
      </div>
    </>
  );
}
