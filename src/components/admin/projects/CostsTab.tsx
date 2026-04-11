import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Trash2, Plus, Pencil, Check, X } from "lucide-react";
import type { MaterialCost, LaborEntry } from "@/hooks/admin/useProjectDetails";

interface Props {
  materialCosts: MaterialCost[];
  laborEntries: LaborEntry[];
  onAddMaterial: (m: { description: string; vendor?: string; amount: number; purchased_at?: string }) => Promise<void>;
  onAddLabor: (l: { worker_name: string; days_worked: number; daily_rate: number; total_cost: number; work_date?: string; notes?: string }) => Promise<void>;
  onDelete: (table: "material_costs" | "labor_payroll", id: string) => Promise<void>;
  onUpdateMaterial?: (id: string, m: { description: string; vendor?: string; amount: number; purchased_at?: string }) => Promise<void>;
  onUpdateLabor?: (id: string, l: { worker_name: string; days_worked: number; daily_rate: number; total_cost: number; work_date?: string; notes?: string }) => Promise<void>;
}

export function CostsTab({ materialCosts, laborEntries, onAddMaterial, onAddLabor, onDelete, onUpdateMaterial, onUpdateLabor }: Props) {
  return (
    <Tabs defaultValue="materials" className="space-y-3">
      <TabsList className="h-8">
        <TabsTrigger value="materials" className="text-xs h-6">Materials (${materialCosts.reduce((s, c) => s + Number(c.amount), 0).toLocaleString()})</TabsTrigger>
        <TabsTrigger value="labor" className="text-xs h-6">Labor (${laborEntries.reduce((s, c) => s + Number(c.total_cost), 0).toLocaleString()})</TabsTrigger>
      </TabsList>
      <TabsContent value="materials"><MaterialsSection items={materialCosts} onAdd={onAddMaterial} onDelete={(id) => onDelete("material_costs", id)} onUpdate={onUpdateMaterial} /></TabsContent>
      <TabsContent value="labor"><LaborSection items={laborEntries} onAdd={onAddLabor} onDelete={(id) => onDelete("labor_payroll", id)} onUpdate={onUpdateLabor} /></TabsContent>
    </Tabs>
  );
}

function MaterialsSection({ items, onAdd, onDelete, onUpdate }: { items: MaterialCost[]; onAdd: Props["onAddMaterial"]; onDelete: (id: string) => void; onUpdate?: Props["onUpdateMaterial"] }) {
  const [show, setShow] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [desc, setDesc] = useState("");
  const [vendor, setVendor] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  const resetForm = () => { setDesc(""); setVendor(""); setAmount(""); setDate(""); };

  const handleAdd = async () => {
    if (!desc || !amount) return;
    await onAdd({ description: desc, vendor: vendor || undefined, amount: parseFloat(amount), purchased_at: date || undefined });
    resetForm(); setShow(false);
  };

  const startEdit = (c: MaterialCost) => {
    setEditingId(c.id);
    setDesc(c.description);
    setVendor(c.vendor || "");
    setAmount(String(Number(c.amount)));
    setDate(c.purchased_at || "");
  };

  const handleSaveEdit = async (id: string) => {
    if (!onUpdate || !desc || !amount) return;
    await onUpdate(id, { description: desc, vendor: vendor || undefined, amount: parseFloat(amount), purchased_at: date || undefined });
    setEditingId(null); resetForm();
  };

  const MaterialForm = ({ onSave, onCancel, isEdit }: { onSave: () => void; onCancel: () => void; isEdit?: boolean }) => (
    <div className="grid grid-cols-2 gap-2 p-3 rounded-lg border bg-muted/30">
      <div className="col-span-2"><Label className="text-[10px]">Description *</Label><Input value={desc} onChange={(e) => setDesc(e.target.value)} className="h-8 text-xs" /></div>
      <div><Label className="text-[10px]">Vendor</Label><Input value={vendor} onChange={(e) => setVendor(e.target.value)} className="h-8 text-xs" /></div>
      <div><Label className="text-[10px]">Amount ($) *</Label><Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="h-8 text-xs" /></div>
      <div className="col-span-2"><Label className="text-[10px]">Date</Label><Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="h-8 text-xs" /></div>
      <div className="col-span-2 flex gap-2">
        <Button size="sm" className="flex-1 h-7 text-xs gap-1" onClick={onSave}><Check className="w-3 h-3" />{isEdit ? "Update" : "Save"}</Button>
        <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={onCancel}><X className="w-3 h-3" />Cancel</Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold">Material Costs</h4>
        <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => { setShow(!show); setEditingId(null); }}><Plus className="w-3 h-3" /> Add</Button>
      </div>
      {show && <MaterialForm onSave={handleAdd} onCancel={() => { setShow(false); resetForm(); }} />}
      {items.length === 0 ? <p className="text-xs text-muted-foreground text-center py-4">No material costs</p> : (
        <div className="space-y-1.5">
          {items.map((c) => (
            editingId === c.id ? (
              <MaterialForm key={c.id} onSave={() => handleSaveEdit(c.id)} onCancel={() => { setEditingId(null); resetForm(); }} isEdit />
            ) : (
              <div key={c.id} className="flex items-center justify-between p-2.5 rounded-lg border bg-card text-xs group">
                <div>
                  <span className="font-medium">{c.description}</span>
                  {c.vendor && <span className="text-muted-foreground ml-2">· {c.vendor}</span>}
                  <span className="text-gold ml-2 font-semibold">${Number(c.amount).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-0.5">
                  {onUpdate && (
                    <Button size="icon" variant="ghost" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => startEdit(c)}>
                      <Pencil className="w-3 h-3 text-muted-foreground" />
                    </Button>
                  )}
                  <Button size="icon" variant="ghost" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => onDelete(c.id)}>
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

function LaborSection({ items, onAdd, onDelete, onUpdate }: { items: LaborEntry[]; onAdd: Props["onAddLabor"]; onDelete: (id: string) => void; onUpdate?: Props["onUpdateLabor"] }) {
  const [show, setShow] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [days, setDays] = useState("");
  const [rate, setRate] = useState("");
  const [date, setDate] = useState("");

  const resetForm = () => { setName(""); setDays(""); setRate(""); setDate(""); };

  const handleAdd = async () => {
    if (!name || !days || !rate) return;
    const d = parseFloat(days);
    const r = parseFloat(rate);
    await onAdd({ worker_name: name, days_worked: d, daily_rate: r, total_cost: d * r, work_date: date || undefined });
    resetForm(); setShow(false);
  };

  const startEdit = (l: LaborEntry) => {
    setEditingId(l.id);
    setName(l.worker_name);
    setDays(String(Number(l.days_worked)));
    setRate(String(Number(l.daily_rate)));
    setDate(l.work_date || "");
  };

  const handleSaveEdit = async (id: string) => {
    if (!onUpdate || !name || !days || !rate) return;
    const d = parseFloat(days);
    const r = parseFloat(rate);
    await onUpdate(id, { worker_name: name, days_worked: d, daily_rate: r, total_cost: d * r, work_date: date || undefined });
    setEditingId(null); resetForm();
  };

  const LaborForm = ({ onSave, onCancel, isEdit }: { onSave: () => void; onCancel: () => void; isEdit?: boolean }) => (
    <div className="grid grid-cols-2 gap-2 p-3 rounded-lg border bg-muted/30">
      <div className="col-span-2"><Label className="text-[10px]">Worker Name *</Label><Input value={name} onChange={(e) => setName(e.target.value)} className="h-8 text-xs" /></div>
      <div><Label className="text-[10px]">Days *</Label><Input type="number" value={days} onChange={(e) => setDays(e.target.value)} className="h-8 text-xs" /></div>
      <div><Label className="text-[10px]">Daily Rate ($) *</Label><Input type="number" value={rate} onChange={(e) => setRate(e.target.value)} className="h-8 text-xs" /></div>
      <div className="col-span-2"><Label className="text-[10px]">Date</Label><Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="h-8 text-xs" /></div>
      <div className="col-span-2 flex gap-2">
        <Button size="sm" className="flex-1 h-7 text-xs gap-1" onClick={onSave}><Check className="w-3 h-3" />{isEdit ? "Update" : "Save"}</Button>
        <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={onCancel}><X className="w-3 h-3" />Cancel</Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold">Labor Payroll</h4>
        <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => { setShow(!show); setEditingId(null); }}><Plus className="w-3 h-3" /> Add</Button>
      </div>
      {show && <LaborForm onSave={handleAdd} onCancel={() => { setShow(false); resetForm(); }} />}
      {items.length === 0 ? <p className="text-xs text-muted-foreground text-center py-4">No labor entries</p> : (
        <div className="space-y-1.5">
          {items.map((l) => (
            editingId === l.id ? (
              <LaborForm key={l.id} onSave={() => handleSaveEdit(l.id)} onCancel={() => { setEditingId(null); resetForm(); }} isEdit />
            ) : (
              <div key={l.id} className="flex items-center justify-between p-2.5 rounded-lg border bg-card text-xs group">
                <div>
                  <span className="font-medium">{l.worker_name}</span>
                  <span className="text-muted-foreground ml-2">{Number(l.days_worked)}d × ${Number(l.daily_rate)}</span>
                  <span className="text-gold ml-2 font-semibold">${Number(l.total_cost).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-0.5">
                  {onUpdate && (
                    <Button size="icon" variant="ghost" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => startEdit(l)}>
                      <Pencil className="w-3 h-3 text-muted-foreground" />
                    </Button>
                  )}
                  <Button size="icon" variant="ghost" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => onDelete(l.id)}>
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
