import { cn } from "@/lib/utils";
import { DollarSign, TrendingUp, Receipt, Wallet } from "lucide-react";

interface Props {
  totalValue: number;
  totalCosts: number;
  netProfit: number;
  marginPct: number;
  balanceDue: number;
}

export function ProjectKPIBar({ totalValue, totalCosts, netProfit, marginPct, balanceDue }: Props) {
  const marginColor = marginPct >= 30 ? "text-green-400" : marginPct >= 15 ? "text-yellow-400" : "text-red-400";
  const marginBg = marginPct >= 30 ? "bg-green-500/15" : marginPct >= 15 ? "bg-yellow-500/15" : "bg-red-500/15";

  const kpis = [
    { label: "Value", value: `$${totalValue.toLocaleString()}`, icon: DollarSign, color: "text-gold" },
    { label: "Costs", value: `$${totalCosts.toLocaleString()}`, icon: Wallet, color: "text-blue-400" },
    { label: "Profit", value: `$${netProfit.toLocaleString()}`, icon: TrendingUp, color: marginColor },
    { label: "Margin", value: `${marginPct.toFixed(0)}%`, icon: TrendingUp, color: marginColor, bg: marginBg },
    { label: "Balance", value: `$${balanceDue.toLocaleString()}`, icon: Receipt, color: balanceDue > 0 ? "text-yellow-400" : "text-green-400" },
  ];

  return (
    <div className="grid grid-cols-5 gap-2">
      {kpis.map((k) => (
        <div key={k.label} className={cn("rounded-lg border bg-card p-2 text-center", k.bg)}>
          <k.icon className={cn("w-3.5 h-3.5 mx-auto mb-0.5", k.color)} />
          <p className={cn("text-sm font-bold", k.color)}>{k.value}</p>
          <p className="text-[9px] text-muted-foreground">{k.label}</p>
        </div>
      ))}
    </div>
  );
}
