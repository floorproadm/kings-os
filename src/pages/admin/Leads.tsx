import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Search } from "lucide-react";

const STATUSES = ["all", "new", "contacted", "quoted", "closed", "lost"];
const SOURCES = ["all", "website", "b2b", "referral"];

const statusColors: Record<string, string> = {
  new: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  contacted: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  quoted: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  closed: "bg-green-500/20 text-green-400 border-green-500/30",
  lost: "bg-red-500/20 text-red-400 border-red-500/30",
};

export default function Leads() {
  const [leads, setLeads] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    const { data } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
    setLeads(data || []);
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("leads").update({ status }).eq("id", id);
    if (error) {
      toast.error("Failed to update status");
    } else {
      toast.success("Status updated");
      setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    }
  };

  const filtered = leads.filter((l) => {
    const matchSearch =
      !search ||
      l.name?.toLowerCase().includes(search.toLowerCase()) ||
      l.phone?.toLowerCase().includes(search.toLowerCase()) ||
      l.email?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || l.status === statusFilter;
    const matchSource = sourceFilter === "all" || l.source === sourceFilter;
    return matchSearch && matchStatus && matchSource;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search name, phone, email..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[150px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            {STATUSES.map((s) => (<SelectItem key={s} value={s}>{s === "all" ? "All Status" : s}</SelectItem>))}
          </SelectContent>
        </Select>
        <Select value={sourceFilter} onValueChange={setSourceFilter}>
          <SelectTrigger className="w-full sm:w-[150px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            {SOURCES.map((s) => (<SelectItem key={s} value={s}>{s === "all" ? "All Sources" : s}</SelectItem>))}
          </SelectContent>
        </Select>
      </div>

      <Card className="bg-card border-border">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden sm:table-cell">Phone</TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead className="hidden md:table-cell">Service</TableHead>
                <TableHead className="hidden lg:table-cell">Source</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden sm:table-cell">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">No leads found</TableCell></TableRow>
              ) : (
                filtered.map((lead) => (
                  <>
                    <TableRow key={lead.id} className="cursor-pointer" onClick={() => setExpandedId(expandedId === lead.id ? null : lead.id)}>
                      <TableCell className="font-medium">{lead.name}</TableCell>
                      <TableCell className="hidden sm:table-cell">{lead.phone || "—"}</TableCell>
                      <TableCell className="hidden md:table-cell">{lead.email || "—"}</TableCell>
                      <TableCell className="hidden md:table-cell">{lead.service || "—"}</TableCell>
                      <TableCell className="hidden lg:table-cell">{lead.source || "—"}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={statusColors[lead.status || "new"]}>{lead.status || "new"}</Badge>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-muted-foreground text-xs">
                        {lead.created_at ? new Date(lead.created_at).toLocaleDateString() : "—"}
                      </TableCell>
                    </TableRow>
                    {expandedId === lead.id && (
                      <TableRow key={`${lead.id}-detail`}>
                        <TableCell colSpan={7} className="bg-secondary/30 p-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground text-xs mb-1">Address</p>
                              <p>{lead.address || "—"}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground text-xs mb-1">Referral Code</p>
                              <p>{lead.referral_code || "—"}</p>
                            </div>
                            <div className="sm:col-span-2">
                              <p className="text-muted-foreground text-xs mb-1">Message</p>
                              <p>{lead.message || "—"}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground text-xs mb-1">Update Status</p>
                              <Select value={lead.status || "new"} onValueChange={(val) => updateStatus(lead.id, val)}>
                                <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  {STATUSES.filter((s) => s !== "all").map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
