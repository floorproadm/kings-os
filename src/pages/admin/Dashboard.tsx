import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Users, Share2, Clock } from "lucide-react";
import { HK_ORG_ID } from "@/lib/constants";

const statusColors: Record<string, string> = {
  new: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  contacted: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  quoted: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  closed: "bg-green-500/20 text-green-400 border-green-500/30",
  lost: "bg-red-500/20 text-red-400 border-red-500/30",
};

interface KPIs {
  newThisWeek: number;
  totalLeads: number;
  activeReferrals: number;
  pending: number;
}

export default function Dashboard() {
  const [kpis, setKpis] = useState<KPIs>({ newThisWeek: 0, totalLeads: 0, activeReferrals: 0, pending: 0 });
  const [recentLeads, setRecentLeads] = useState<any[]>([]);

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
    setRecentLeads(leads.slice(0, 10));
    setKpis({
      newThisWeek: leads.filter((l) => l.status === "new" && l.created_at && l.created_at > weekAgo).length,
      totalLeads: leads.length,
      activeReferrals: activeRef.count || 0,
      pending: leads.filter((l) => l.status === "new" || l.status === "contacted").length,
    });
  };

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
                    <TableCell className="hidden md:table-cell">{lead.source || "—"}</TableCell>
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
