import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Bell, LogOut } from "lucide-react";
import { toast } from "sonner";
import { format, getWeek } from "date-fns";

interface StaleAlert {
  id: string;
  name: string;
  created_at: string;
}

export function AdminHeader({ title }: { title: string }) {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState<StaleAlert[]>([]);
  const now = new Date();
  const weekNum = getWeek(now);
  const dateLabel = format(now, "MMM dd").toUpperCase();

  useEffect(() => {
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    supabase
      .from("leads")
      .select("id, name, created_at")
      .eq("status", "new")
      .lt("created_at", cutoff)
      .order("created_at", { ascending: true })
      .limit(10)
      .then(({ data }) => { if (data) setAlerts(data); });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out");
    navigate("/login");
  };

  return (
    <header className="h-14 flex items-center justify-between border-b border-border px-4">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
        <h1 className="font-display text-lg font-semibold text-foreground">{title}</h1>
      </div>

      <div className="hidden sm:flex items-center gap-1.5 text-xs font-medium tracking-widest text-muted-foreground">
        <span>WEEK {weekNum}</span>
        <span className="text-border">·</span>
        <span>{dateLabel}</span>
      </div>

      <div className="flex items-center gap-1">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
              <Bell className="w-4 h-4" />
              {alerts.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-destructive" />
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-72 p-0">
            <div className="px-4 py-3 border-b border-border">
              <p className="text-sm font-medium">Notifications</p>
            </div>
            {alerts.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-muted-foreground">All clear 🎉</p>
            ) : (
              <div className="max-h-60 overflow-y-auto">
                {alerts.map(a => (
                  <button
                    key={a.id}
                    onClick={() => navigate("/admin/leads")}
                    className="w-full text-left px-4 py-2.5 hover:bg-muted/50 border-b border-border last:border-b-0"
                  >
                    <p className="text-sm font-medium text-foreground">{a.name}</p>
                    <p className="text-[11px] text-muted-foreground">New lead waiting &gt;24h</p>
                  </button>
                ))}
              </div>
            )}
          </PopoverContent>
        </Popover>

        <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground hover:text-foreground gap-2">
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>
    </header>
  );
}
