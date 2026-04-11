import { DragEvent, useCallback, useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Calendar, DollarSign, User } from "lucide-react";
import { Project, PROJECT_STATUSES } from "@/hooks/admin/useProjectsData";

export const statusConfig: Record<string, { bg: string; text: string; label: string; dot: string; headerBg: string }> = {
  planning: { bg: "bg-blue-500/15", text: "text-blue-400", label: "Planning", dot: "bg-blue-400", headerBg: "border-blue-500/30" },
  in_progress: { bg: "bg-amber-500/15", text: "text-amber-400", label: "In Progress", dot: "bg-amber-400", headerBg: "border-amber-500/30" },
  completed: { bg: "bg-green-500/15", text: "text-green-400", label: "Completed", dot: "bg-green-400", headerBg: "border-green-500/30" },
  awaiting_payment: { bg: "bg-purple-500/15", text: "text-purple-400", label: "Awaiting Payment", dot: "bg-purple-400", headerBg: "border-purple-500/30" },
  paid: { bg: "bg-emerald-500/15", text: "text-emerald-400", label: "Paid", dot: "bg-emerald-400", headerBg: "border-emerald-500/30" },
};

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
    projects.forEach((p) => { if (map[p.status]) map[p.status].push(p); });
    return map;
  }, [projects]);

  const handleDragStart = useCallback((e: DragEvent, id: string) => {
    e.dataTransfer.setData("text/plain", id);
    e.dataTransfer.effectAllowed = "move";
    setDraggingId(id);
  }, []);

  const handleDrop = useCallback((e: DragEvent, status: string) => {
    e.preventDefault();
    setDragOverCol(null);
    setDraggingId(null);
    const id = e.dataTransfer.getData("text/plain");
    if (id) onStatusChange(id, status);
  }, [onStatusChange]);

  return (
    <div className="overflow-x-auto pb-2 -mx-1 px-1 scrollbar-thin">
      <div className="flex gap-3 min-w-max">
        {BOARD_STATUSES.map((status) => {
          const config = statusConfig[status] || statusConfig.planning;
          const items = grouped[status] || [];
          const isOver = dragOverCol === status;
          return (
            <div
              key={status}
              className={cn("w-[230px] sm:w-[260px] flex-shrink-0 flex flex-col rounded-xl transition-all duration-200", isOver && "scale-[1.01]")}
              onDragOver={(e) => { e.preventDefault(); setDragOverCol(status); }}
              onDragLeave={() => setDragOverCol(null)}
              onDrop={(e) => handleDrop(e, status)}
            >
              {/* Column Header */}
              <div className={cn("flex items-center justify-between px-3.5 py-3 rounded-t-xl border-t-2 border-x border-b-0 bg-card/60 backdrop-blur", config.headerBg)}>
                <div className="flex items-center gap-2">
                  <span className={cn("w-2 h-2 rounded-full", config.dot)} />
                  <span className={cn("font-semibold text-xs", config.text)}>{config.label}</span>
                </div>
                <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded-md", config.bg, config.text)}>{items.length}</span>
              </div>

              {/* Column Body */}
              <div className={cn(
                "flex-1 border-x border-b rounded-b-xl transition-all duration-200 bg-muted/10",
                isOver ? "bg-primary/5 border-primary/30 shadow-inner shadow-primary/5" : "border-border/30"
              )}>
                <div className="max-h-[58vh] overflow-y-auto scrollbar-thin">
                  <div className="p-2 space-y-2">
                    {items.length === 0 ? (
                      <div className={cn("text-center py-14 text-xs", isOver ? "text-primary/60" : "text-muted-foreground/40")}>
                        {isOver ? "Drop here" : "No projects"}
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
      className={cn(
        "group p-3 rounded-lg border bg-card cursor-grab transition-all duration-200",
        "hover:shadow-lg hover:shadow-black/20 hover:border-primary/30 hover:-translate-y-[1px]",
        isDragging && "opacity-30 scale-95 ring-2 ring-primary/30"
      )}
    >
      <div className="flex items-start gap-2.5">
        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5", config.bg, config.text)}>
          {project.title.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-xs text-foreground truncate leading-snug">{project.title}</p>
          {project.lead_name && (
            <p className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1 truncate">
              <User className="w-2.5 h-2.5 flex-shrink-0" />
              {project.lead_name}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-border/30 text-[10px] text-muted-foreground">
        <span className="flex items-center gap-0.5 font-medium text-foreground/80">
          <DollarSign className="w-3 h-3 text-gold/70" />
          {Number(project.total_value).toLocaleString("en-US", { minimumFractionDigits: 0 })}
        </span>
        <span className="flex items-center gap-0.5">
          <Calendar className="w-3 h-3" />
          {project.scheduled_date ? new Date(project.scheduled_date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—"}
        </span>
      </div>
    </div>
  );
}
