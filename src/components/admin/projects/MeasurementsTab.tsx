import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Plus } from "lucide-react";
import type { Measurement } from "@/hooks/admin/useProjectDetails";

interface Props {
  measurements: Measurement[];
  onAdd: (m: Omit<Measurement, "id" | "created_at" | "project_id">) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function MeasurementsTab({ measurements, onAdd, onDelete }: Props) {
  const [show, setShow] = useState(false);
  const [sqft, setSqft] = useState("");
  const [stairs, setStairs] = useState("");
  const [handrail, setHandrail] = useState("");
  const [extras, setExtras] = useState("");
  const [notes, setNotes] = useState("");

  const handleAdd = async () => {
    const s = parseFloat(sqft) || 0;
    const st = parseInt(stairs) || 0;
    const h = parseFloat(handrail) || 0;
    const ex = parseFloat(extras) || 0;
    await onAdd({ sqft: s, stairs_count: st, handrail_ft: h, extras_value: ex, total_value: s + ex, notes: notes || null });
    setSqft(""); setStairs(""); setHandrail(""); setExtras(""); setNotes(""); setShow(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold text-foreground">Measurements</h4>
        <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => setShow(!show)}>
          <Plus className="w-3 h-3" /> Add
        </Button>
      </div>

      {show && (
        <div className="grid grid-cols-2 gap-2 p-3 rounded-lg border bg-muted/30">
          <div><Label className="text-[10px]">Sqft</Label><Input type="number" value={sqft} onChange={(e) => setSqft(e.target.value)} className="h-8 text-xs" /></div>
          <div><Label className="text-[10px]">Stairs</Label><Input type="number" value={stairs} onChange={(e) => setStairs(e.target.value)} className="h-8 text-xs" /></div>
          <div><Label className="text-[10px]">Handrail ft</Label><Input type="number" value={handrail} onChange={(e) => setHandrail(e.target.value)} className="h-8 text-xs" /></div>
          <div><Label className="text-[10px]">Extras ($)</Label><Input type="number" value={extras} onChange={(e) => setExtras(e.target.value)} className="h-8 text-xs" /></div>
          <div className="col-span-2"><Label className="text-[10px]">Notes</Label><Input value={notes} onChange={(e) => setNotes(e.target.value)} className="h-8 text-xs" /></div>
          <Button size="sm" className="col-span-2 h-7 text-xs" onClick={handleAdd}>Save</Button>
        </div>
      )}

      {measurements.length === 0 ? (
        <p className="text-xs text-muted-foreground text-center py-4">No measurements yet</p>
      ) : (
        <div className="space-y-2">
          {measurements.map((m) => (
            <div key={m.id} className="flex items-center justify-between p-2.5 rounded-lg border bg-card text-xs">
              <div>
                <span className="font-medium">{Number(m.sqft)} sqft</span>
                {Number(m.stairs_count) > 0 && <span className="text-muted-foreground ml-2">· {m.stairs_count} stairs</span>}
                {Number(m.handrail_ft) > 0 && <span className="text-muted-foreground ml-2">· {Number(m.handrail_ft)}ft rail</span>}
                {Number(m.extras_value) > 0 && <span className="text-muted-foreground ml-2">· +${Number(m.extras_value)}</span>}
              </div>
              <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => onDelete(m.id)}>
                <Trash2 className="w-3 h-3 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
