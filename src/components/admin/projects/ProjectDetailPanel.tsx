import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Project, PROJECT_STATUSES } from "@/hooks/admin/useProjectsData";
import { useProjectDetails } from "@/hooks/admin/useProjectDetails";
import { ProjectKPIBar } from "./ProjectKPIBar";
import { MeasurementsTab } from "./MeasurementsTab";
import { CostsTab } from "./CostsTab";
import { InvoicesTab } from "./InvoicesTab";
import { statusConfig } from "./ProjectPipelineBoard";
import { MapPin, Calendar, FileText } from "lucide-react";

interface Props {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (id: string, status: string) => void;
}

export function ProjectDetailPanel({ project, isOpen, onClose, onStatusChange }: Props) {
  const { measurements, materialCosts, laborEntries, invoices, payments, kpis, addMeasurement, addMaterialCost, addLaborEntry, addInvoice, addPayment, deleteRecord } = useProjectDetails(project?.id || null);

  if (!project) return null;

  const totalValue = Number(project.total_value) || 0;
  const totalCosts = kpis?.totalCosts || 0;
  const netProfit = totalValue - totalCosts;
  const marginPct = totalValue > 0 ? (netProfit / totalValue) * 100 : 0;
  const balanceDue = kpis?.balanceDue || 0;

  const config = statusConfig[project.status] || statusConfig.planning;

  return (
    <Sheet open={isOpen} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="pb-2">
          <div className="flex items-center justify-between gap-2">
            <SheetTitle className="font-display text-base truncate">{project.title}</SheetTitle>
            <Select value={project.status} onValueChange={(v) => onStatusChange(project.id, v)}>
              <SelectTrigger className={cn("w-auto h-7 text-[10px] gap-1 border-0 px-2", config.bg, config.text)}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PROJECT_STATUSES.map((s) => (
                  <SelectItem key={s} value={s} className="text-xs capitalize">{s.replace(/_/g, " ")}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {project.lead_name && <p className="text-xs text-muted-foreground">Client: {project.lead_name}</p>}
        </SheetHeader>

        <div className="space-y-4 mt-2">
          {/* KPIs */}
          <ProjectKPIBar totalValue={totalValue} totalCosts={totalCosts} netProfit={netProfit} marginPct={marginPct} balanceDue={balanceDue} />

          {/* Meta info */}
          <div className="flex flex-wrap gap-3 text-[11px] text-muted-foreground">
            {project.address && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{project.address}</span>}
            {project.scheduled_date && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(project.scheduled_date).toLocaleDateString()}</span>}
            {project.notes && <span className="flex items-center gap-1"><FileText className="w-3 h-3" />{project.notes}</span>}
          </div>

          {/* Tabs */}
          <Tabs defaultValue="measurements" className="space-y-3">
            <TabsList className="h-8 w-full grid grid-cols-3">
              <TabsTrigger value="measurements" className="text-[10px] h-6">Measurements</TabsTrigger>
              <TabsTrigger value="costs" className="text-[10px] h-6">Costs</TabsTrigger>
              <TabsTrigger value="invoices" className="text-[10px] h-6">Invoices</TabsTrigger>
            </TabsList>

            <TabsContent value="measurements">
              <MeasurementsTab measurements={measurements} onAdd={addMeasurement} onDelete={(id) => deleteRecord("measurements", id)} />
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
