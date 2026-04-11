import { useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, FolderKanban, Plus, Users, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Home", icon: LayoutDashboard, path: "/admin" },
  { label: "Projects", icon: FolderKanban, path: "/admin/projects" },
  { label: "add", icon: Plus, path: "__action__" },
  { label: "Leads", icon: Users, path: "/admin/leads" },
  { label: "Settings", icon: Settings, path: "/admin/settings" },
];

export function AdminBottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    if (path === "/admin") return location.pathname === "/admin";
    return location.pathname.startsWith(path);
  };

  const handleTap = (item: typeof navItems[0]) => {
    if (item.path === "__action__") {
      // Navigate to projects with intent to create
      navigate("/admin/projects?new=1");
      return;
    }
    navigate(item.path);
  };

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 bg-card/95 backdrop-blur-xl border-t border-border/50 pb-[env(safe-area-inset-bottom)] lg:hidden">
      <div className="flex items-center justify-around h-16 px-2 max-w-lg mx-auto">
        {navItems.map((item) => {
          const active = item.path !== "__action__" && isActive(item.path);
          const isCenter = item.path === "__action__";

          if (isCenter) {
            return (
              <button
                key="add"
                onClick={() => handleTap(item)}
                className="relative -mt-5 w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/30 active:scale-95 transition-transform"
              >
                <Plus className="w-7 h-7" strokeWidth={2.5} />
              </button>
            );
          }

          return (
            <button
              key={item.path}
              onClick={() => handleTap(item)}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 w-16 h-full transition-colors",
                active ? "text-primary" : "text-muted-foreground"
              )}
            >
              <item.icon className={cn("w-5 h-5", active && "text-primary")} strokeWidth={active ? 2.5 : 2} />
              <span className={cn("text-[10px] tracking-wide", active ? "font-semibold" : "font-medium")}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
