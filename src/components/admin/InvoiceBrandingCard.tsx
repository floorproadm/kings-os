import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FileText, Upload, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useInvoiceSettings } from "@/hooks/admin/useInvoiceSettings";

export function InvoiceBrandingCard() {
  const { settings, loading, save, defaults } = useInvoiceSettings();
  const fileRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);

  const [companyName, setCompanyName] = useState("");
  const [tagline, setTagline] = useState("");
  const [website, setWebsite] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [companyPhone, setCompanyPhone] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [accentColor, setAccentColor] = useState("#c9a84c");
  const [defaultNotes, setDefaultNotes] = useState("");
  const [footerText, setFooterText] = useState("");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!settings && !loading) {
      setAccentColor(defaults.accent_color);
      setFooterText(defaults.footer_text);
      return;
    }
    if (!settings) return;
    setCompanyName(settings.company_name || "");
    setTagline(settings.tagline || "");
    setWebsite(settings.website || "");
    setCompanyAddress(settings.company_address || "");
    setCompanyPhone(settings.company_phone || "");
    setCompanyEmail(settings.company_email || "");
    setAccentColor(settings.accent_color || "#c9a84c");
    setDefaultNotes(settings.default_notes || "");
    setFooterText(settings.footer_text || "");
    setLogoUrl(settings.logo_url || null);
  }, [settings, loading]);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = file.name.split(".").pop();
    const path = `logos/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("invoice-logos").upload(path, file);
    if (error) { toast.error("Upload failed"); return; }
    const { data: urlData } = supabase.storage.from("invoice-logos").getPublicUrl(path);
    setLogoUrl(urlData.publicUrl);
    toast.success("Logo uploaded");
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await save({
        company_name: companyName || null,
        tagline: tagline || null,
        website: website || null,
        company_address: companyAddress || null,
        company_phone: companyPhone || null,
        company_email: companyEmail || null,
        accent_color: accentColor,
        default_notes: defaultNotes || null,
        footer_text: footerText || null,
        logo_url: logoUrl,
      });
      toast.success("Invoice settings saved");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error saving";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return null;

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-display flex items-center gap-2">
          <FileText className="w-4 h-4 text-gold" /> Invoice Branding
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Logo */}
        <div>
          <Label className="text-xs">Company Logo</Label>
          <div className="flex items-center gap-3 mt-1">
            {logoUrl ? (
              <div className="relative">
                <img src={logoUrl} alt="Logo" className="h-12 max-w-[160px] object-contain rounded border p-1" />
                <button onClick={() => setLogoUrl(null)} className="absolute -top-1.5 -right-1.5 bg-destructive text-white rounded-full p-0.5">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={() => fileRef.current?.click()}>
                <Upload className="w-3.5 h-3.5" /> Upload Logo
              </Button>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
          </div>
        </div>

        {/* Company info */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">Company Name</Label>
            <Input value={companyName} onChange={e => setCompanyName(e.target.value)} className="h-8 text-xs" placeholder="Hardwood Kings" />
          </div>
          <div>
            <Label className="text-xs">Tagline</Label>
            <Input value={tagline} onChange={e => setTagline(e.target.value)} className="h-8 text-xs" placeholder="Premium Hardwood Flooring" />
          </div>
          <div>
            <Label className="text-xs">Website</Label>
            <Input value={website} onChange={e => setWebsite(e.target.value)} className="h-8 text-xs" placeholder="hardwoodkings.com" />
          </div>
          <div>
            <Label className="text-xs">Phone</Label>
            <Input value={companyPhone} onChange={e => setCompanyPhone(e.target.value)} className="h-8 text-xs" placeholder="(555) 123-4567" />
          </div>
          <div>
            <Label className="text-xs">Email</Label>
            <Input value={companyEmail} onChange={e => setCompanyEmail(e.target.value)} className="h-8 text-xs" placeholder="info@hardwoodkings.com" />
          </div>
          <div>
            <Label className="text-xs">Accent Color</Label>
            <div className="flex items-center gap-2">
              <input type="color" value={accentColor} onChange={e => setAccentColor(e.target.value)} className="w-8 h-8 rounded border cursor-pointer" />
              <Input value={accentColor} onChange={e => setAccentColor(e.target.value)} className="h-8 text-xs flex-1" />
            </div>
          </div>
        </div>
        <div>
          <Label className="text-xs">Address</Label>
          <Input value={companyAddress} onChange={e => setCompanyAddress(e.target.value)} className="h-8 text-xs" placeholder="123 Main St, City, ST 12345" />
        </div>

        {/* Notes & Footer */}
        <div>
          <Label className="text-xs">Default Payment Terms / Notes</Label>
          <Textarea value={defaultNotes} onChange={e => setDefaultNotes(e.target.value)} className="text-xs min-h-[60px]" placeholder="Net 30. Late payments subject to 1.5% monthly interest." />
        </div>
        <div>
          <Label className="text-xs">Footer Message</Label>
          <Input value={footerText} onChange={e => setFooterText(e.target.value)} className="h-8 text-xs" placeholder="Thank you for choosing Hardwood Kings!" />
        </div>

        {/* Mini preview */}
        <div className="rounded-lg border p-3 bg-white text-black text-[10px]">
          <div className="flex justify-between items-start border-b pb-2 mb-2" style={{ borderColor: accentColor }}>
            <div className="flex items-center gap-2">
              {logoUrl && <img src={logoUrl} alt="" className="h-6 object-contain" />}
              <div>
                <div className="font-bold text-xs">{companyName || "Company Name"}</div>
                {tagline && <div className="text-[9px] text-gray-500">{tagline}</div>}
              </div>
            </div>
            <div className="font-bold text-sm" style={{ color: accentColor }}>INVOICE</div>
          </div>
          <div className="text-[9px] text-gray-400 text-center">{footerText || "Footer text"}</div>
        </div>

        <Button variant="gold" size="sm" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Invoice Settings"}
        </Button>
      </CardContent>
    </Card>
  );
}
