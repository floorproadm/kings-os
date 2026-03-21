import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Copy, Plus } from "lucide-react";
import { HK_ORG_ID } from "@/lib/constants";

export default function Referrals() {
  const [codes, setCodes] = useState<any[]>([]);
  const [leadsCount, setLeadsCount] = useState<Record<string, number>>({});
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [commission, setCommission] = useState("5");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: codesData } = await supabase.from("referral_codes").select("*").order("created_at", { ascending: false });
    setCodes(codesData || []);

    const { data: leads } = await supabase.from("leads").select("referral_code");
    const counts: Record<string, number> = {};
    (leads || []).forEach((l) => {
      if (l.referral_code) counts[l.referral_code] = (counts[l.referral_code] || 0) + 1;
    });
    setLeadsCount(counts);
  };

  const generateCode = () => {
    const slug = name.trim().toUpperCase().replace(/\s+/g, "").slice(0, 6);
    const rand = Math.random().toString(36).substring(2, 5).toUpperCase();
    setCode(`${slug}${rand}`);
  };

  const handleCreate = async () => {
    if (!name.trim() || !code.trim()) {
      toast.error("Name and code are required");
      return;
    }
    setCreating(true);
    const { error } = await supabase.from("referral_codes").insert({
      referrer_name: name.trim(),
      code: code.trim().toUpperCase(),
      commission_pct: parseFloat(commission) || 5,
      org_id: HK_ORG_ID,
    });
    setCreating(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Referral code created");
      setName("");
      setCode("");
      setCommission("5");
      fetchData();
    }
  };

  const toggleActive = async (id: string, active: boolean) => {
    const { error } = await supabase.from("referral_codes").update({ active }).eq("id", id);
    if (error) {
      toast.error("Failed to update");
    } else {
      setCodes((prev) => prev.map((c) => (c.id === id ? { ...c, active } : c)));
    }
  };

  const copyLink = (refCode: string) => {
    navigator.clipboard.writeText(`https://hardwoodkingsinc.com/referral/${refCode}`);
    toast.success("Link copied!");
  };

  return (
    <div className="space-y-6">
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-display">Create Referral Code</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <Input placeholder="Referrer name" value={name} onChange={(e) => setName(e.target.value)} />
            <div className="flex gap-2">
              <Input placeholder="CODE" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} />
              <Button variant="outline" size="sm" onClick={generateCode} className="shrink-0 text-xs">Auto</Button>
            </div>
            <Input placeholder="Commission %" type="number" value={commission} onChange={(e) => setCommission(e.target.value)} />
            <Button variant="gold" onClick={handleCreate} disabled={creating} className="gap-2">
              <Plus className="w-4 h-4" /> Create
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead className="hidden sm:table-cell">Referrer</TableHead>
                <TableHead>Commission</TableHead>
                <TableHead>Leads</TableHead>
                <TableHead>Active</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {codes.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No referral codes yet</TableCell></TableRow>
              ) : (
                codes.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-mono font-medium text-gold">{c.code}</TableCell>
                    <TableCell className="hidden sm:table-cell">{c.referrer_name || "—"}</TableCell>
                    <TableCell>{c.commission_pct}%</TableCell>
                    <TableCell>{leadsCount[c.code] || 0}</TableCell>
                    <TableCell>
                      <Switch checked={c.active} onCheckedChange={(val) => toggleActive(c.id, val)} />
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => copyLink(c.code)} title="Copy link">
                        <Copy className="w-4 h-4" />
                      </Button>
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
