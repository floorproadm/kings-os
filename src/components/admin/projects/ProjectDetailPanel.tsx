import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Project, PROJECT_STATUSES } from "@/hooks/admin/useProjectsData";
import { useProjectDetails } from "@/hooks/admin/useProjectDetails";
import { ProjectKPIBar } from "./ProjectKPIBar";
import { MeasurementsTab } from "./MeasurementsTab";
import { CostsTab } from "./CostsTab";
import { InvoicesTab } from "./InvoicesTab";
import { statusConfig } from "./ProjectPipelineBoard";
import { MapPin, Calendar, FileText, Ruler, Wallet, Receipt } from "lucide-react";

interface Props {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (id: string, status: string) => void;
}

export function ProjectDetailPanel({ project, isOpen, onClose, onStatusChange }: Props) {
  const { measurements, materialCosts, laborEntries, invoices, payments, kpis, addMeasurement, addMaterialCost, addLaborEntry, addInvoice, addPayment, deleteRecord, updateMeasurement } = useProjectDetails(project?.id || null);

  if (!project) return null;

  const totalValue = Number(project.total_value) || 0;
  const totalCosts = kpis?.totalCosts || 0;
  const netProfit = totalValue - totalCosts;
  const marginPct = totalValue > 0 ? (netProfit / totalValue) * 100 : 0;
  const balanceDue = kpis?.balanceDue || 0;

  const config = statusConfig[project.status] || statusConfig.planning;

  return (
    <Sheet open={isOpen} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto p-0">
        {/* Header with gradient accent */}
        <div className="sticky top-0 z-10 bg-card/95 backdrop-blur border-b border-border/40">
          <div className="px-5 pt-5 pb-3">
            <SheetHeader className="pb-0">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0", config.bg, config.text)}>
                    {project.title.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <SheetTitle className="font-display text-sm truncate">{project.title}</SheetTitle>
                    {project.lead_name && <p className="text-[11px] text-muted-foreground mt-0.5">Client: {project.lead_name}</p>}
                  </div>
                </div>
                <Select value={project.status} onValueChange={(v) => onStatusChange(project.id, v)}>
                  <SelectTrigger className={cn("w-auto h-7 text-[10px] gap-1 border-0 px-2.5 rounded-md font-semibold", config.bg, config.text)}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PROJECT_STATUSES.map((s) => (
                      <SelectItem key={s} value={s} className="text-xs capitalize">{s.replace(/_/g, " ")}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </SheetHeader>

            {/* Meta chips */}
            <div className="flex flex-wrap gap-2 mt-3">
              {project.address && (
                <span className="flex items-center gap-1 text-[10px] text-muted-foreground bg-muted/30 rounded-md px-2 py-1">
                  <MapPin className="w-3 h-3" />{project.address}
                </span>
              )}
              {project.scheduled_date && (
                <span className="flex items-center gap-1 text-[10px] text-muted-foreground bg-muted/30 rounded-md px-2 py-1">
                  <Calendar className="w-3 h-3" />{new Date(project.scheduled_date).toLocaleDateString()}
                </span>
              )}
              {project.notes && (
                <span className="flex items-center gap-1 text-[10px] text-muted-foreground bg-muted/30 rounded-md px-2 py-1">
                  <FileText className="w-3 h-3" />{project.notes}
                </span>
              )}
            </div>
          </div>

          {/* KPIs */}
          <div className="px-5 pb-3">
            <ProjectKPIBar totalValue={totalValue} totalCosts={totalCosts} netProfit={netProfit} marginPct={marginPct} balanceDue={balanceDue} />
          </div>
        </div>

        {/* Body */}
        <div className="px-5 py-4">
          <Tabs defaultValue="measurements" className="space-y-3">
            <TabsList className="h-9 w-full grid grid-cols-3 bg-muted/30 rounded-lg p-0.5">
              <TabsTrigger value="measurements" className="text-[11px] h-7 gap-1 rounded-md data-[state=active]:bg-card data-[state=active]:shadow-sm">
                <Ruler className="w-3 h-3" />Measures
              </TabsTrigger>
              <TabsTrigger value="costs" className="text-[11px] h-7 gap-1 rounded-md data-[state=active]:bg-card data-[state=active]:shadow-sm">
                <Wallet className="w-3 h-3" />Costs
              </TabsTrigger>
              <TabsTrigger value="invoices" className="text-[11px] h-7 gap-1 rounded-md data-[state=active]:bg-card data-[state=active]:shadow-sm">
                <Receipt className="w-3 h-3" />Invoices
              </TabsTrigger>
            </TabsList>

            <TabsContent value="measurements">
              <MeasurementsTab measurements={measurements} onAdd={addMeasurement} onDelete={(id) => deleteRecord("measurements", id)} onUpdate={updateMeasurement} />
            </TabsContent>

            <TabsContent value="costs">
              <CostsTab
                materialCosts={materialCosts}
                laborEntries={laborEntries}
                onAddMaterial={addMaterialCost}
                onAddLabor={addLaborEntry}
                onDelete={deleteRecord}
              />
            </TabsContent>

            <TabsContent value="invoices">
              <InvoicesTab
                invoices={invoices}
                payments={payments}
                onAddInvoice={addInvoice}
                onAddPayment={addPayment}
                onDelete={deleteRecord}
              />
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}
