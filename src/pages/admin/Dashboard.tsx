import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Users, Share2, Clock, BarChart3 } from "lucide-react";
import { HK_ORG_ID } from "@/lib/constants";

const statusColors: Record<string, string> = {
  new: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  contacted: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  quoted: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  closed: "bg-green-500/20 text-green-400 border-green-500/30",
  lost: "bg-red-500/20 text-red-400 border-red-500/30",
};

const sourceLabels: Record<string, string> = {
  "website-hero": "Hero CTA",
  "website-contact": "Contact Section",
  "website": "Website (legacy)",
  "contact-page": "Contact Page",
  "popup": "Popup",
  "b2b": "B2B",
  "referral": "Referral",
  "manual": "Manual",
};

const sourceBarColors = [
  "bg-blue-500",
  "bg-gold",
  "bg-green-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-cyan-500",
  "bg-orange-500",
  "bg-red-500",
];

interface KPIs {
  newThisWeek: number;
  totalLeads: number;
  activeReferrals: number;
  pending: number;
}

interface SourceStat {
  source: string;
  total: number;
  converted: number;
  rate: number;
}

export default function Dashboard() {
  const [kpis, setKpis] = useState<KPIs>({ newThisWeek: 0, totalLeads: 0, activeReferrals: 0, pending: 0 });
  const [recentLeads, setRecentLeads] = useState<any[]>([]);
  const [allLeadsData, setAllLeadsData] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString();

    const [allLeads, activeRef] = await Promise.all([
      supabase.from("leads").select("*").order("created_at", { ascending: false }),
      supabase.from("referral_codes").select("id", { count: "exact" }).eq("active", true),
    ]);

    const leads = allLeads.data || [];
    setAllLeadsData(leads);
    setRecentLeads(leads.slice(0, 10));
    setKpis({
      newThisWeek: leads.filter((l) => l.status === "new" && l.created_at && l.created_at > weekAgo).length,
      totalLeads: leads.length,
      activeReferrals: activeRef.count || 0,
      pending: leads.filter((l) => l.status === "new" || l.status === "contacted").length,
    });
  };

  const sourceStats = useMemo<SourceStat[]>(() => {
    const map = new Map<string, { total: number; converted: number }>();
    for (const lead of allLeadsData) {
      const src = lead.source || "website";
      const entry = map.get(src) || { total: 0, converted: 0 };
      entry.total++;
      if (lead.status === "closed") entry.converted++;
      map.set(src, entry);
    }
    return Array.from(map.entries())
      .map(([source, { total, converted }]) => ({
        source,
        total,
        converted,
        rate: total > 0 ? Math.round((converted / total) * 100) : 0,
      }))
      .sort((a, b) => b.total - a.total);
  }, [allLeadsData]);

  const maxTotal = Math.max(...sourceStats.map((s) => s.total), 1);

  const kpiCards = [
    { label: "New This Week", value: kpis.newThisWeek, icon: UserPlus, color: "text-blue-400" },
    { label: "Total Leads", value: kpis.totalLeads, icon: Users, color: "text-gold" },
    { label: "Active Referrals", value: kpis.activeReferrals, icon: Share2, color: "text-green-400" },
    { label: "Pending Contact", value: kpis.pending, icon: Clock, color: "text-yellow-400" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi) => (
          <Card key={kpi.label} className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
              </div>
              <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{kpi.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Conversion by Source */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-gold" />
            <CardTitle className="text-base font-display">Leads by Source</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {sourceStats.length === 0 ? (
            <p className="text-center text-muted-foreground py-4 text-sm">No data yet</p>
          ) : (
            sourceStats.map((stat, i) => (
              <div key={stat.source} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">
                    {sourceLabels[stat.source] || stat.source}
                  </span>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{stat.total} leads</span>
                    <span>{stat.converted} closed</span>
                    <Badge
                      variant="outline"
                      className={
                        stat.rate >= 30
                          ? "bg-green-500/20 text-green-400 border-green-500/30"
                          : stat.rate >= 10
                          ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                          : "bg-muted text-muted-foreground border-border"
                      }
                    >
                      {stat.rate}%
                    </Badge>
                  </div>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${sourceBarColors[i % sourceBarColors.length]}`}
                    style={{ width: `${(stat.total / maxTotal) * 100}%` }}
                  />
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-display">Recent Leads</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden sm:table-cell">Phone</TableHead>
                <TableHead className="hidden md:table-cell">Service</TableHead>
                <TableHead className="hidden md:table-cell">Source</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden sm:table-cell">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentLeads.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    No leads yet
                  </TableCell>
                </TableRow>
              ) : (
                recentLeads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium">{lead.name}</TableCell>
                    <TableCell className="hidden sm:table-cell">{lead.phone || "—"}</TableCell>
                    <TableCell className="hidden md:table-cell">{lead.service || "—"}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {sourceLabels[lead.source] || lead.source || "—"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusColors[lead.status || "new"]}>
                        {lead.status || "new"}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground text-xs">
                      {lead.created_at ? new Date(lead.created_at).toLocaleDateString() : "—"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}