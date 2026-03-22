import { useState } from "react";
import { formatPhone } from "@/lib/formatPhone";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserPlus, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const leadSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  phone: z.string().trim().min(1, "Phone is required").max(30),
  email: z.string().trim().email("Invalid email").max(255).or(z.literal("")),
  address: z.string().trim().max(20).optional(),
  service: z.string().optional(),
  message: z.string().trim().max(1000).optional(),
});

const SERVICES = [
  "Hardwood Installation",
  "Sanding & Refinishing",
  "Vinyl / LVP",
  "Staircase",
  "Demolition",
  "Deck",
  "Wash & Polish",
];

interface NewLeadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const emptyForm = {
  name: "",
  phone: "",
  email: "",
  address: "",
  service: "",
  message: "",
};

export function NewLeadModal({ open, onOpenChange, onSuccess }: NewLeadModalProps) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const resetForm = () => {
    setForm(emptyForm);
    setErrors({});
  };

  const handleChange = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: "" }));
  };

  const handleSave = async () => {
    const result = leadSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const key = issue.path[0] as string;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setSaving(true);
    const { data: orgData } = await supabase.rpc("get_user_org_id");
    const orgId = orgData as string | null;

    if (!orgId) {
      toast.error("Organization not found");
      setSaving(false);
      return;
    }

    const { error } = await supabase.from("leads").insert({
      name: result.data.name,
      phone: result.data.phone,
      email: result.data.email || null,
      address: result.data.address || null,
      service: result.data.service || null,
      message: result.data.message || null,
      source: "manual",
      org_id: orgId,
    });

    setSaving(false);
    if (error) {
      toast.error("Failed to create lead");
    } else {
      toast.success("Lead created");
      resetForm();
      onOpenChange(false);
      onSuccess();
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) resetForm();
        onOpenChange(v);
      }}
    >
      <DialogContent className="sm:max-w-md p-0 overflow-hidden gap-0">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-border/50">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2.5 text-lg">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <UserPlus className="w-4.5 h-4.5 text-primary" />
              </div>
              New Lead
            </DialogTitle>
          </DialogHeader>
        </div>

        {/* Form */}
        <div className="px-6 py-5 space-y-4 max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="nl-name" className="text-xs font-semibold">
                Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="nl-name"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Full name"
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && (
                <span className="text-[10px] text-destructive">{errors.name}</span>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="nl-phone" className="text-xs font-semibold">
                Phone <span className="text-destructive">*</span>
              </Label>
              <Input
                id="nl-phone"
                type="tel"
                value={form.phone}
                onChange={(e) => handleChange("phone", formatPhone(e.target.value))}
                placeholder="(913) 000-0000"
                className={errors.phone ? "border-destructive" : ""}
              />
              {errors.phone && (
                <span className="text-[10px] text-destructive">{errors.phone}</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="nl-email" className="text-xs font-semibold">
                Email
              </Label>
              <Input
                id="nl-email"
                type="email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="email@example.com"
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && (
                <span className="text-[10px] text-destructive">{errors.email}</span>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="nl-zip" className="text-xs font-semibold">
                Zipcode
              </Label>
              <Input
                id="nl-zip"
                type="tel"
                inputMode="numeric"
                value={form.address}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, "").slice(0, 5);
                  handleChange("address", digits);
                }}
                placeholder="66062"
                maxLength={5}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Service</Label>
            <Select
              value={form.service}
              onValueChange={(v) => handleChange("service", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a service..." />
              </SelectTrigger>
              <SelectContent>
                {SERVICES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="nl-message" className="text-xs font-semibold">
              Notes
            </Label>
            <Textarea
              id="nl-message"
              value={form.message}
              onChange={(e) => handleChange("message", e.target.value)}
              rows={3}
              placeholder="Additional notes..."
              maxLength={1000}
            />
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="px-6 py-4 border-t border-border/50 bg-muted/10 sm:justify-between">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={saving}
            className="text-xs"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-primary text-primary-foreground text-xs gap-1.5"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <UserPlus className="w-4 h-4" />
            )}
            Create Lead
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
