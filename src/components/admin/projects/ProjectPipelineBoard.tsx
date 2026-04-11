import { DragEvent, useCallback, useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Calendar, DollarSign } from "lucide-react";
import { Project, PROJECT_STATUSES } from "@/hooks/admin/useProjectsData";

const statusConfig: Record<string, { bg: string; text: string; label: string; headerBg: string }> = {
  planning: { bg: "bg-blue-500/15", text: "text-blue-400", label: "Planning", headerBg: "bg-blue-500/10 border-blue-500/20" },
  in_progress: { bg: "bg-yellow-500/15", text: "text-yellow-400", label: "In Progress", headerBg: "bg-yellow-500/10 border-yellow-500/20" },
  completed: { bg: "bg-green-500/15", text: "text-green-400", label: "Completed", headerBg: "bg-green-500/10 border-green-500/20" },
  awaiting_payment: { bg: "bg-purple-500/15", text: "text-purple-400", label: "Awaiting Payment", headerBg: "bg-purple-500/10 border-purple-500/20" },
  paid: { bg: "bg-emerald-500/15", text: "text-emerald-400", label: "Paid", headerBg: "bg-emerald-500/10 border-emerald-500/20" },
};

export { statusConfig };

const BOARD_STATUSES = PROJECT_STATUSES.filter((s) => s !== "archived");

interface Props {
  projects: Project[];
  onSelect: (p: Project) => void;
  onStatusChange: (id: string, status: string) => void;
}

export function ProjectPipelineBoard({ projects, onSelect, onStatusChange }: Props) {
  const [dragOverCol, setDragOverCol] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const grouped = useMemo(() => {
    const map: Record<string, Project[]> = {};
    BOARD_STATUSES.forEach((s) => (map[s] = []));
    projects.forEach((p) => {
      if (map[p.status]) map[p.status].push(p);
    });
    return map;
  }, [projects]);

  const handleDragStart = useCallback((e: DragEvent, id: string) => {
    e.dataTransfer.setData("text/plain", id);
    e.dataTransfer.effectAllowed = "move";
    setDraggingId(id);
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent, status: string) => {
      e.preventDefault();
      setDragOverCol(null);
      setDraggingId(null);
      const id = e.dataTransfer.getData("text/plain");
      if (id) onStatusChange(id, status);
    },
    [onStatusChange]
  );

  return (
    <div className="overflow-x-auto pb-2 -mx-1 px-1">
      <div className="flex gap-3 min-w-max">
        {BOARD_STATUSES.map((status) => {
          const config = statusConfig[status] || statusConfig.planning;
          const items = grouped[status] || [];
          return (
            <div
              key={status}
              className={cn("w-[220px] sm:w-[250px] flex-shrink-0 flex flex-col transition-all duration-200", dragOverCol === status && "scale-[1.02]")}
              onDragOver={(e) => { e.preventDefault(); setDragOverCol(status); }}
              onDragLeave={() => setDragOverCol(null)}
              onDrop={(e) => handleDrop(e, status)}
            >
              <div className={cn("flex items-center justify-between px-3 py-2.5 rounded-t-xl border border-b-0", config.headerBg)}>
                <span className={cn("font-semibold text-xs", config.text)}>{config.label}</span>
              </div>
              <div className={cn("flex items-center justify-between px-3 py-1.5 border-x text-xs border-b", config.headerBg)}>
                <span className="text-muted-foreground font-medium">{items.length} projects</span>
              </div>
              <div className={cn("flex-1 border border-t-0 rounded-b-xl transition-colors duration-200", dragOverCol === status ? "bg-primary/5 border-primary/30 ring-2 ring-primary/20" : "bg-muted/20")}>
                <div className="max-h-[60vh] overflow-y-auto">
                  <div className="p-1.5 space-y-1.5">
                    {items.length === 0 ? (
                      <div className={cn("text-center py-16 text-xs transition-colors", dragOverCol === status ? "text-primary/60" : "text-muted-foreground/60")}>
                        {dragOverCol === status ? "Drop here" : "No projects"}
                      </div>
                    ) : (
                      items.map((p) => (
                        <PipelineCard
                          key={p.id}
                          project={p}
                          isDragging={draggingId === p.id}
                          onClick={() => onSelect(p)}
                          onDragStart={(e) => handleDragStart(e, p.id)}
                          onDragEnd={() => { setDragOverCol(null); setDraggingId(null); }}
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
  );
}

function PipelineCard({ project, isDragging, onClick, onDragStart, onDragEnd }: {
  project: Project;
  isDragging?: boolean;
  onClick: () => void;
  onDragStart: (e: DragEvent<HTMLDivElement>) => void;
  onDragEnd: () => void;
}) {
  const config = statusConfig[project.status] || statusConfig.planning;
  return (
    <div
      draggable
      onClick={onClick}
      onDragStart={onDragStart as any}
      onDragEnd={onDragEnd}
      className={cn("p-3 rounded-lg border bg-card cursor-grab transition-all hover:shadow-md hover:border-primary/40", isDragging && "opacity-40 scale-95 ring-2 ring-primary/30")}
    >
      <div className="flex items-center gap-2">
        <div className={cn("w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0", config.bg, config.text)}>
          {project.title.charAt(0).toUpperCase()}
        </div>
        <span className="font-semibold text-xs text-foreground truncate flex-1">{project.title}</span>
      </div>
      {project.lead_name && (
        <p className="text-[10px] text-muted-foreground mt-1 truncate">{project.lead_name}</p>
      )}
      <div className="flex items-center justify-between mt-2 pt-1.5 border-t text-[10px] text-muted-foreground">
        <span className="flex items-center gap-0.5">
          <DollarSign className="w-2.5 h-2.5" />
          {Number(project.total_value).toLocaleString("en-US", { minimumFractionDigits: 0 })}
        </span>
        <span className="flex items-center gap-0.5">
          <Calendar className="w-2.5 h-2.5" />
          {project.scheduled_date ? new Date(project.scheduled_date).toLocaleDateString() : "—"}
        </span>
      </div>
    </div>
  );
}
