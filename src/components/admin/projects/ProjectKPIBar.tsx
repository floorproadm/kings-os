import { cn } from "@/lib/utils";

interface Props {
  totalValue: number;
  totalCosts: number;
  netProfit: number;
  marginPct: number;
  balanceDue: number;
}

export function ProjectKPIBar({ totalValue, totalCosts, netProfit, marginPct, balanceDue }: Props) {
  const marginColor = marginPct >= 30 ? "text-green-400" : marginPct >= 15 ? "text-amber-400" : "text-red-400";
  const marginBg = marginPct >= 30 ? "bg-green-500/10" : marginPct >= 15 ? "bg-amber-500/10" : "bg-red-500/10";
  const marginDot = marginPct >= 30 ? "bg-green-400" : marginPct >= 15 ? "bg-amber-400" : "bg-red-400";

  return (
    <div className="grid grid-cols-5 gap-1.5">
      <KPICell label="Value" value={`$${totalValue.toLocaleString()}`} accent="text-gold" />
      <KPICell label="Costs" value={`$${totalCosts.toLocaleString()}`} accent="text-blue-400" />
      <KPICell label="Profit" value={`$${netProfit.toLocaleString()}`} accent={marginColor} />
      <div className={cn("rounded-lg p-2 text-center", marginBg)}>
        <div className="flex items-center justify-center gap-1 mb-0.5">
          <span className={cn("w-1.5 h-1.5 rounded-full", marginDot)} />
          <p className={cn("text-sm font-bold leading-none", marginColor)}>{marginPct.toFixed(0)}%</p>
        </div>
        <p className="text-[8px] text-muted-foreground uppercase tracking-wider">Margin</p>
      </div>
      <KPICell label="Balance" value={`$${balanceDue.toLocaleString()}`} accent={balanceDue > 0 ? "text-amber-400" : "text-green-400"} />
    </div>
  );
}

function KPICell({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className="rounded-lg bg-muted/20 p-2 text-center">
      <p className={cn("text-sm font-bold leading-none mb-0.5", accent)}>{value}</p>
      <p className="text-[8px] text-muted-foreground uppercase tracking-wider">{label}</p>
    </div>
  );
}
