import { useState } from "react";
import { Partner, PIPELINE_STAGES, STAGE_CONFIG, PARTNER_TYPES, isAtRisk } from "@/hooks/admin/usePartnersData";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";

interface Props {
  partners: Partner[];
  onSelect: (p: Partner) => void;
  onStageChange: (id: string, stage: string) => void;
}

export function PartnerPipelineBoard({ partners, onSelect, onStageChange }: Props) {
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<string | null>(null);

  const byStage = PIPELINE_STAGES.reduce((acc, s) => {
    acc[s] = partners.filter(p => p.status === s);
    return acc;
  }, {} as Record<string, Partner[]>);

  return (
    <div className="flex gap-3 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
      {PIPELINE_STAGES.map(stage => {
        const cfg = STAGE_CONFIG[stage];
        const items = byStage[stage] || [];
        return (
          <div
            key={stage}
            className={`flex-shrink-0 w-56 rounded-xl border transition-colors ${dragOver === stage ? "border-primary bg-primary/5" : "border-border bg-card/50"}`}
            onDragOver={e => { e.preventDefault(); setDragOver(stage); }}
            onDragLeave={() => setDragOver(null)}
            onDrop={() => { if (dragId) { onStageChange(dragId, stage); } setDragId(null); setDragOver(null); }}
          >
            <div className="px-3 py-2.5 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${cfg.dotColor}`} />
                <span className="text-xs font-medium text-foreground">{cfg.label}</span>
              </div>
              <span className="text-[10px] text-muted-foreground">{items.length}</span>
            </div>
            <div className="p-2 space-y-2 min-h-[120px]">
              {items.map(p => (
                <PipelineCard key={p.id} partner={p} onClick={() => onSelect(p)} onDragStart={() => setDragId(p.id)} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function PipelineCard({ partner, onClick, onDragStart }: { partner: Partner; onClick: () => void; onDragStart: () => void }) {
  const initials = partner.company_name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  const type = PARTNER_TYPES.find(t => t.value === partner.partner_type)?.label || partner.partner_type;
  const atRisk = isAtRisk(partner);

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onClick={onClick}
      className={`p-2.5 rounded-lg bg-background border cursor-pointer hover:border-primary/40 transition-colors ${atRisk ? "border-amber-500/30" : "border-border"}`}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-[10px] font-semibold">{initials}</div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium truncate">{partner.company_name}</p>
        </div>
        {atRisk && <AlertTriangle className="w-3 h-3 text-amber-400" />}
      </div>
      <div className="flex items-center justify-between">
        <Badge variant="outline" className="text-[9px] px-1.5 py-0">{type}</Badge>
        <span className="text-[10px] text-muted-foreground">{partner.total_referrals} refs</span>
      </div>
    </div>
  );
}
