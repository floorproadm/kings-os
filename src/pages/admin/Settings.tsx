import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Building2, Lock, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import HeroMediaManager from "@/components/admin/HeroMediaManager";

export default function SettingsPage() {
  const navigate = useNavigate();
  const [org, setOrg] = useState<any>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from("organizations").select("*").single().then(({ data }) => {
      setOrg(data);
    });
  }, []);

  const handleChangePassword = async () => {
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setSaving(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password updated");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out");
    navigate("/login");
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-display flex items-center gap-2">
            <Building2 className="w-4 h-4 text-gold" /> Organization
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {org ? (
            <>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Business Name</p>
                <p className="text-foreground font-medium">{org.name}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Phone</p>
                <p className="text-foreground">{org.phone || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Email</p>
                <p className="text-foreground">{org.email || "—"}</p>
              </div>
            </>
          ) : (
            <p className="text-muted-foreground text-sm">Loading...</p>
          )}
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-display flex items-center gap-2">
            <Lock className="w-4 h-4 text-gold" /> Change Password
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input type="password" placeholder="New password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          <Input type="password" placeholder="Confirm password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          <Button variant="gold" onClick={handleChangePassword} disabled={saving}>
            {saving ? "Updating..." : "Update Password"}
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardContent className="pt-6">
          <Button variant="destructive" onClick={handleLogout} className="gap-2">
            <LogOut className="w-4 h-4" /> Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
