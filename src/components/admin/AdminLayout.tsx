import { useLocation } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";
import { AdminBottomNav } from "./AdminBottomNav";

const pageTitles: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/projects": "Projects",
  "/admin/leads": "Leads",
  "/admin/referrals": "Referrals",
  "/admin/partners": "Partners",
  "/admin/gallery": "Gallery",
  "/admin/settings": "Settings",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const title = pageTitles[location.pathname] || "Admin";

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <AdminHeader title={title} />
          <main className="flex-1 p-4 sm:p-6 pb-20 lg:pb-6 overflow-auto">
            {children}
          </main>
          <AdminBottomNav />
        </div>
      </div>
    </SidebarProvider>
  );
}
