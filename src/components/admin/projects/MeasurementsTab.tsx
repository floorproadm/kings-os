import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, Pencil, Check, X } from "lucide-react";
import type { Measurement } from "@/hooks/admin/useProjectDetails";

interface Props {
  measurements: Measurement[];
  onAdd: (m: Omit<Measurement, "id" | "created_at" | "project_id">) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onUpdate?: (id: string, m: Partial<Omit<Measurement, "id" | "created_at" | "project_id">>) => Promise<void>;
}

export function MeasurementsTab({ measurements, onAdd, onDelete, onUpdate }: Props) {
  const [show, setShow] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [sqft, setSqft] = useState("");
  const [stairs, setStairs] = useState("");
  const [handrail, setHandrail] = useState("");
  const [extras, setExtras] = useState("");
  const [notes, setNotes] = useState("");

  const resetForm = () => { setSqft(""); setStairs(""); setHandrail(""); setExtras(""); setNotes(""); };

  const handleAdd = async () => {
    const s = parseFloat(sqft) || 0;
    const st = parseInt(stairs) || 0;
    const h = parseFloat(handrail) || 0;
    const ex = parseFloat(extras) || 0;
    await onAdd({ sqft: s, stairs_count: st, handrail_ft: h, extras_value: ex, total_value: s + ex, notes: notes || null });
    resetForm();
    setShow(false);
  };

  const startEdit = (m: Measurement) => {
    setEditingId(m.id);
    setSqft(String(Number(m.sqft) || ""));
    setStairs(String(Number(m.stairs_count) || ""));
    setHandrail(String(Number(m.handrail_ft) || ""));
    setExtras(String(Number(m.extras_value) || ""));
    setNotes(m.notes || "");
  };

  const handleSaveEdit = async (id: string) => {
    if (!onUpdate) return;
    const s = parseFloat(sqft) || 0;
    const st = parseInt(stairs) || 0;
    const h = parseFloat(handrail) || 0;
    const ex = parseFloat(extras) || 0;
    await onUpdate(id, { sqft: s, stairs_count: st, handrail_ft: h, extras_value: ex, total_value: s + ex, notes: notes || null });
    setEditingId(null);
    resetForm();
  };

  const cancelEdit = () => { setEditingId(null); resetForm(); };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold text-foreground">Measurements</h4>
        <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => { setShow(!show); setEditingId(null); }}>
          <Plus className="w-3 h-3" /> Add
        </Button>
      </div>

      {show && (
        <MeasurementForm sqft={sqft} stairs={stairs} handrail={handrail} extras={extras} notes={notes}
          onSqftChange={setSqft} onStairsChange={setStairs} onHandrailChange={setHandrail} onExtrasChange={setExtras} onNotesChange={setNotes}
          onSave={handleAdd} onCancel={() => { setShow(false); resetForm(); }} />
      )}

      {measurements.length === 0 ? (
        <p className="text-xs text-muted-foreground text-center py-4">No measurements yet</p>
      ) : (
        <div className="space-y-2">
          {measurements.map((m) => (
            editingId === m.id ? (
              <MeasurementForm key={m.id} sqft={sqft} stairs={stairs} handrail={handrail} extras={extras} notes={notes}
                onSqftChange={setSqft} onStairsChange={setStairs} onHandrailChange={setHandrail} onExtrasChange={setExtras} onNotesChange={setNotes}
                onSave={() => handleSaveEdit(m.id)} onCancel={cancelEdit} isEdit />
            ) : (
              <div key={m.id} className="flex items-center justify-between p-2.5 rounded-lg border bg-card text-xs group">
                <div>
                  <span className="font-medium">{Number(m.sqft)} sqft</span>
                  {Number(m.stairs_count) > 0 && <span className="text-muted-foreground ml-2">· {m.stairs_count} stairs</span>}
                  {Number(m.handrail_ft) > 0 && <span className="text-muted-foreground ml-2">· {Number(m.handrail_ft)}ft rail</span>}
                  {Number(m.extras_value) > 0 && <span className="text-muted-foreground ml-2">· +${Number(m.extras_value)}</span>}
                  {m.notes && <span className="text-muted-foreground ml-2">· {m.notes}</span>}
                </div>
                <div className="flex items-center gap-0.5">
                  {onUpdate && (
                    <Button size="icon" variant="ghost" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => startEdit(m)}>
                      <Pencil className="w-3 h-3 text-muted-foreground" />
                    </Button>
                  )}
                  <Button size="icon" variant="ghost" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => onDelete(m.id)}>
                    <Trash2 className="w-3 h-3 text-destructive" />
                  </Button>
                </div>
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );
}

function MeasurementForm({ sqft, stairs, handrail, extras, notes, onSqftChange, onStairsChange, onHandrailChange, onExtrasChange, onNotesChange, onSave, onCancel, isEdit }: {
  sqft: string; stairs: string; handrail: string; extras: string; notes: string;
  onSqftChange: (v: string) => void; onStairsChange: (v: string) => void; onHandrailChange: (v: string) => void; onExtrasChange: (v: string) => void; onNotesChange: (v: string) => void;
  onSave: () => void; onCancel: () => void; isEdit?: boolean;
}) {
  return (
    <div className="grid grid-cols-2 gap-2 p-3 rounded-lg border bg-muted/30">
      <div><Label className="text-[10px]">Sqft</Label><Input type="number" value={sqft} onChange={(e) => onSqftChange(e.target.value)} className="h-8 text-xs" /></div>
      <div><Label className="text-[10px]">Stairs</Label><Input type="number" value={stairs} onChange={(e) => onStairsChange(e.target.value)} className="h-8 text-xs" /></div>
      <div><Label className="text-[10px]">Handrail ft</Label><Input type="number" value={handrail} onChange={(e) => onHandrailChange(e.target.value)} className="h-8 text-xs" /></div>
      <div><Label className="text-[10px]">Extras ($)</Label><Input type="number" value={extras} onChange={(e) => onExtrasChange(e.target.value)} className="h-8 text-xs" /></div>
      <div className="col-span-2"><Label className="text-[10px]">Notes</Label><Input value={notes} onChange={(e) => onNotesChange(e.target.value)} className="h-8 text-xs" /></div>
      <div className="col-span-2 flex gap-2">
        <Button size="sm" className="flex-1 h-7 text-xs gap-1" onClick={onSave}>
          <Check className="w-3 h-3" />{isEdit ? "Update" : "Save"}
        </Button>
        <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={onCancel}>
          <X className="w-3 h-3" />Cancel
        </Button>
      </div>
    </div>
  );
}
