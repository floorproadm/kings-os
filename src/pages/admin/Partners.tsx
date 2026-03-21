import { useState, useMemo } from "react";
import { usePartnersData, Partner, PARTNER_TYPES, STAGE_CONFIG, isAtRisk } from "@/hooks/admin/usePartnersData";
import { PartnerListItem } from "@/components/admin/PartnerListItem";
import { PartnerPipelineBoard } from "@/components/admin/PartnerPipelineBoard";
import { PartnerDetailPanel } from "@/components/admin/PartnerDetailPanel";
import { NewPartnerDialog } from "@/components/admin/NewPartnerDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Handshake, Plus, Search, LayoutGrid, List, AlertTriangle, Users, ArrowRightLeft, Loader2 } from "lucide-react";

type View = "list" | "board";

export default function Partners() {
  const { partners, isLoading, createPartner, updatePartner, deletePartner } = usePartnersData();
  const [view, setView] = useState<View>("list");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [selected, setSelected] = useState<Partner | null>(null);
  const [showNew, setShowNew] = useState(false);

  const filtered = useMemo(() => {
    return partners.filter(p => {
      const q = search.toLowerCase();
      const matchSearch = !q || p.company_name.toLowerCase().includes(q) || (p.contact_name || "").toLowerCase().includes(q);
      const matchType = !typeFilter || p.partner_type === typeFilter;
      return matchSearch && matchType;
    });
  }, [partners, search, typeFilter]);

  const stats = useMemo(() => ({
    active: partners.filter(p => p.status === "active").length,
    atRisk: partners.filter(isAtRisk).length,
    totalRefs: partners.reduce((s, p) => s + p.total_referrals, 0),
  }), [partners]);

  if (isLoading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;

  // Detail view
  if (selected) {
    const current = partners.find(p => p.id === selected.id) || selected;
    return (
      <PartnerDetailPanel
        partner={current}
        onBack={() => setSelected(null)}
        onUpdate={(id, data) => updatePartner.mutate({ id, ...data })}
        onDelete={(id) => { deletePartner.mutate(id); setSelected(null); }}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-card rounded-lg p-3 border border-border flex items-center gap-3">
          <Users className="w-5 h-5 text-primary" />
          <div><p className="text-xl font-bold">{stats.active}</p><p className="text-[10px] text-muted-foreground">Active</p></div>
        </div>
        <div className="bg-card rounded-lg p-3 border border-border flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400" />
          <div><p className="text-xl font-bold">{stats.atRisk}</p><p className="text-[10px] text-muted-foreground">At Risk</p></div>
        </div>
        <div className="bg-card rounded-lg p-3 border border-border flex items-center gap-3">
          <ArrowRightLeft className="w-5 h-5 text-muted-foreground" />
          <div><p className="text-xl font-bold">{stats.totalRefs}</p><p className="text-[10px] text-muted-foreground">Referrals</p></div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[160px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search partners..." className="pl-9 h-9" />
        </div>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="h-9 rounded-md border border-input bg-background px-3 text-sm">
          <option value="">All Types</option>
          {PARTNER_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
        <div className="flex border border-border rounded-md">
          <button onClick={() => setView("list")} className={`p-2 ${view === "list" ? "bg-muted text-foreground" : "text-muted-foreground"}`}><List className="w-4 h-4" /></button>
          <button onClick={() => setView("board")} className={`p-2 ${view === "board" ? "bg-muted text-foreground" : "text-muted-foreground"}`}><LayoutGrid className="w-4 h-4" /></button>
        </div>
        <Button variant="gold" size="sm" onClick={() => setShowNew(true)}><Plus className="w-4 h-4" /><span className="hidden sm:inline">New Partner</span></Button>
      </div>

      {/* Content */}
      {view === "list" ? (
        <div className="space-y-1">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Handshake className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>No partners yet</p>
            </div>
          ) : filtered.map(p => (
            <PartnerListItem key={p.id} partner={p} onClick={() => setSelected(p)} />
          ))}
        </div>
      ) : (
        <PartnerPipelineBoard
          partners={filtered}
          onSelect={setSelected}
          onStageChange={(id, stage) => updatePartner.mutate({ id, status: stage })}
        />
      )}

      <NewPartnerDialog
        open={showNew}
        onOpenChange={setShowNew}
        onSubmit={async (data) => { await createPartner.mutateAsync(data as any); }}
      />
    </div>
  );
}
