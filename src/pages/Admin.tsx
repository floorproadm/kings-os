import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { useSiteConfig, HardwoodPageConfig, SandingPageConfig, VinylPageConfig, StaircasePageConfig } from "@/contexts/SiteConfigContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, Save, RotateCcw, Check, Upload, Palette, Type, Image, Settings, Eye, FileText, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useRef } from "react";

function ColorInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const hslToHex = (hsl: string) => {
    try {
      const [h, s, l] = hsl.split(" ").map((v) => parseFloat(v.replace("%", "")));
      const sN = s / 100;
      const lN = l / 100;
      const a = sN * Math.min(lN, 1 - lN);
      const f = (n: number) => {
        const k = (n + h / 30) % 12;
        const color = lN - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, "0");
      };
      return `#${f(0)}${f(8)}${f(4)}`;
    } catch {
      return "#c8a432";
    }
  };

  const hexToHsl = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) * 60; break;
        case g: h = ((b - r) / d + 2) * 60; break;
        case b: h = ((r - g) / d + 4) * 60; break;
      }
    }
    return `${Math.round(h)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
  };

  return (
    <div className="flex items-center gap-3">
      <input
        type="color"
        value={hslToHex(value)}
        onChange={(e) => onChange(hexToHsl(e.target.value))}
        className="w-10 h-10 rounded-lg border border-border cursor-pointer bg-transparent"
      />
      <div className="flex-1">
        <label className="text-xs text-muted-foreground">{label}</label>
        <Input value={value} onChange={(e) => onChange(e.target.value)} className="h-8 text-xs mt-0.5" />
      </div>
    </div>
  );
}

function ImageUpload({ label, currentSrc, onUpload }: { label: string; currentSrc: string; onUpload: (dataUrl: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") onUpload(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="elevated-card p-4">
      <label className="text-sm font-medium text-foreground mb-2 block">{label}</label>
      {currentSrc && (
        <img src={currentSrc} alt={label} className="w-full h-32 object-cover rounded-lg mb-3" />
      )}
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      <Button variant="outline" size="sm" className="w-full" onClick={() => inputRef.current?.click()}>
        <Upload className="w-4 h-4 mr-2" /> Upload Image
      </Button>
    </div>
  );
}

function FieldGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="elevated-card p-5 space-y-4">
      <h3 className="font-display text-base font-bold text-foreground border-b border-border/30 pb-2">{title}</h3>
      {children}
    </div>
  );
}

function TextField({ label, value, onChange, multiline }: { label: string; value: string; onChange: (v: string) => void; multiline?: boolean }) {
  return (
    <div>
      <label className="text-xs text-muted-foreground mb-1 block">{label}</label>
      {multiline ? (
        <Textarea value={value} onChange={(e) => onChange(e.target.value)} className="text-sm min-h-[60px]" />
      ) : (
        <Input value={value} onChange={(e) => onChange(e.target.value)} className="text-sm" />
      )}
    </div>
  );
}

function ArrayItemHeader({ index, onRemove, label }: { index: number; onRemove: () => void; label: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs font-semibold text-muted-foreground uppercase">{label} #{index + 1}</span>
      <Button variant="ghost" size="sm" onClick={onRemove} className="h-7 w-7 p-0 text-destructive hover:text-destructive">
        <Trash2 className="w-3.5 h-3.5" />
      </Button>
    </div>
  );
}

export default function Admin() {
  const { isAuthenticated, logout } = useAdminAuth();
  const { config, updateConfig, saveConfig, resetConfig, hasUnsavedChanges, autoSaveEnabled, setAutoSaveEnabled } = useSiteConfig();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!isAuthenticated) navigate("/admin/login");
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  const handleSave = () => {
    saveConfig();
    toast({ title: "Saved!", description: "All changes have been saved." });
  };

  const handleReset = () => {
    if (confirm("Reset all settings to default? This cannot be undone.")) {
      resetConfig();
      toast({ title: "Reset complete", description: "All settings restored to defaults." });
    }
  };

  // Helper to update nested page config
  const updateHardwood = (partial: Partial<HardwoodPageConfig>) => updateConfig({ hardwoodPage: { ...config.hardwoodPage, ...partial } });
  const updateSanding = (partial: Partial<SandingPageConfig>) => updateConfig({ sandingPage: { ...config.sandingPage, ...partial } });
  const updateVinyl = (partial: Partial<VinylPageConfig>) => updateConfig({ vinylPage: { ...config.vinylPage, ...partial } });
  const updateStaircase = (partial: Partial<StaircasePageConfig>) => updateConfig({ staircasePage: { ...config.staircasePage, ...partial } });

  const renderServicePageFields = (pageKey: "hardwoodPage" | "vinylPage" | "sandingPage" | "staircasePage") => {
    const page = config[pageKey];
    const update = (field: string, value: string) => {
      updateConfig({ [pageKey]: { ...page, [field]: value } });
    };
    return (
      <>
        <div className="grid grid-cols-2 gap-4">
          <TextField label="Hero Label" value={page.heroLabel} onChange={(v) => update("heroLabel", v)} />
          <TextField label="Hero CTA Button" value={page.heroCta} onChange={(v) => update("heroCta", v)} />
        </div>
        <TextField label="Hero Title" value={page.heroTitle} onChange={(v) => update("heroTitle", v)} />
        <TextField label="Hero Highlight" value={page.heroHighlight} onChange={(v) => update("heroHighlight", v)} />
        <TextField label="Hero Description" value={page.heroDescription} onChange={(v) => update("heroDescription", v)} multiline />
        <div className="grid grid-cols-2 gap-4">
          <TextField label="Section Title" value={page.sectionTitle} onChange={(v) => update("sectionTitle", v)} />
          <TextField label="Section Highlight" value={page.sectionHighlight} onChange={(v) => update("sectionHighlight", v)} />
        </div>
        <TextField label="Section Subtitle" value={page.sectionSubtitle} onChange={(v) => update("sectionSubtitle", v)} multiline />
        <TextField label="CTA Title" value={page.ctaTitle} onChange={(v) => update("ctaTitle", v)} />
        <TextField label="CTA Subtitle" value={page.ctaSubtitle} onChange={(v) => update("ctaSubtitle", v)} multiline />
        <div className="grid grid-cols-2 gap-4">
          <TextField label="CTA Button 1" value={page.ctaCta1} onChange={(v) => update("ctaCta1", v)} />
          <TextField label="CTA Button 2" value={page.ctaCta2} onChange={(v) => update("ctaCta2", v)} />
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <div className="sticky top-0 z-50 bg-card border-b border-border/50 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5 text-gold" />
            <h1 className="font-display text-lg font-bold text-foreground">Admin Panel</h1>
            {hasUnsavedChanges && !autoSaveEnabled && (
              <span className="text-xs bg-destructive/20 text-destructive px-2 py-0.5 rounded-full">Unsaved changes</span>
            )}
            {autoSaveEnabled && (
              <span className="text-xs bg-gold/10 text-gold px-2 py-0.5 rounded-full flex items-center gap-1">
                <Check className="w-3 h-3" /> Auto-save ON
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 mr-4">
              <span className="text-xs text-muted-foreground">Auto-save</span>
              <Switch checked={autoSaveEnabled} onCheckedChange={setAutoSaveEnabled} />
            </div>
            {!autoSaveEnabled && (
              <Button variant="gold" size="sm" onClick={handleSave} disabled={!hasUnsavedChanges}>
                <Save className="w-4 h-4 mr-1" /> Save
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="w-4 h-4 mr-1" /> Reset
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/"><Eye className="w-4 h-4 mr-1" /> View Site</Link>
            </Button>
            <Button variant="ghost" size="sm" onClick={() => { logout(); navigate("/"); }}>
              <LogOut className="w-4 h-4 mr-1" /> Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <Tabs defaultValue="texts" className="space-y-6">
          <TabsList className="bg-card border border-border/50">
            <TabsTrigger value="texts" className="gap-1.5"><Type className="w-4 h-4" /> Texts</TabsTrigger>
            <TabsTrigger value="services-pages" className="gap-1.5"><FileText className="w-4 h-4" /> Service Pages</TabsTrigger>
            <TabsTrigger value="colors" className="gap-1.5"><Palette className="w-4 h-4" /> Colors & Styles</TabsTrigger>
            <TabsTrigger value="images" className="gap-1.5"><Image className="w-4 h-4" /> Images</TabsTrigger>
            <TabsTrigger value="info" className="gap-1.5"><Settings className="w-4 h-4" /> Company Info</TabsTrigger>
          </TabsList>

          {/* TEXTS TAB */}
          <TabsContent value="texts" className="space-y-6">
            <FieldGroup title="Hero Section">
              <TextField label="Subtitle" value={config.heroSubtitle} onChange={(v) => updateConfig({ heroSubtitle: v })} />
              <TextField label="Title" value={config.heroTitle} onChange={(v) => updateConfig({ heroTitle: v })} />
              <TextField label="Title Highlight" value={config.heroTitleHighlight} onChange={(v) => updateConfig({ heroTitleHighlight: v })} />
              <TextField label="Description" value={config.heroDescription} onChange={(v) => updateConfig({ heroDescription: v })} multiline />
              <div className="grid grid-cols-2 gap-4">
                <TextField label="CTA Button 1" value={config.heroCta1} onChange={(v) => updateConfig({ heroCta1: v })} />
                <TextField label="CTA Button 2" value={config.heroCta2} onChange={(v) => updateConfig({ heroCta2: v })} />
              </div>
              <TextField label="Note text" value={config.heroNote} onChange={(v) => updateConfig({ heroNote: v })} />
            </FieldGroup>

            <FieldGroup title="Stats Bar">
              {config.stats.map((s, i) => (
                <div key={i} className="grid grid-cols-2 gap-4">
                  <TextField label={`Stat ${i + 1} Value`} value={s.value} onChange={(v) => {
                    const newStats = [...config.stats];
                    newStats[i] = { ...newStats[i], value: v };
                    updateConfig({ stats: newStats });
                  }} />
                  <TextField label={`Stat ${i + 1} Label`} value={s.label} onChange={(v) => {
                    const newStats = [...config.stats];
                    newStats[i] = { ...newStats[i], label: v };
                    updateConfig({ stats: newStats });
                  }} />
                </div>
              ))}
            </FieldGroup>

            <FieldGroup title="Services Section">
              <TextField label="Badge" value={config.servicesBadge} onChange={(v) => updateConfig({ servicesBadge: v })} />
              <TextField label="Title" value={config.servicesTitle} onChange={(v) => updateConfig({ servicesTitle: v })} />
              <TextField label="Title Highlight" value={config.servicesTitleHighlight} onChange={(v) => updateConfig({ servicesTitleHighlight: v })} />
              <TextField label="Subtitle" value={config.servicesSubtitle} onChange={(v) => updateConfig({ servicesSubtitle: v })} multiline />
            </FieldGroup>

            <FieldGroup title="Why Choose Us">
              <TextField label="Title" value={config.whyTitle} onChange={(v) => updateConfig({ whyTitle: v })} />
              <TextField label="Title Highlight" value={config.whyTitleHighlight} onChange={(v) => updateConfig({ whyTitleHighlight: v })} />
            </FieldGroup>

            <FieldGroup title="Craftsmanship Section">
              <TextField label="Title" value={config.craftTitle} onChange={(v) => updateConfig({ craftTitle: v })} />
              <TextField label="Title Highlight" value={config.craftTitleHighlight} onChange={(v) => updateConfig({ craftTitleHighlight: v })} />
              <TextField label="Paragraph 1" value={config.craftText1} onChange={(v) => updateConfig({ craftText1: v })} multiline />
              <TextField label="Paragraph 2" value={config.craftText2} onChange={(v) => updateConfig({ craftText2: v })} multiline />
              <TextField label="Badge text" value={config.craftBadge} onChange={(v) => updateConfig({ craftBadge: v })} />
            </FieldGroup>

            <FieldGroup title="Testimonials Section">
              <TextField label="Label" value={config.testimonialsLabel} onChange={(v) => updateConfig({ testimonialsLabel: v })} />
              <TextField label="Title" value={config.testimonialsTitle} onChange={(v) => updateConfig({ testimonialsTitle: v })} />
              <TextField label="Title Highlight" value={config.testimonialsTitleHighlight} onChange={(v) => updateConfig({ testimonialsTitleHighlight: v })} />
              <TextField label="Subtitle" value={config.testimonialsSubtitle} onChange={(v) => updateConfig({ testimonialsSubtitle: v })} multiline />
              <TextField label="Footer text" value={config.testimonialsFooter} onChange={(v) => updateConfig({ testimonialsFooter: v })} />
            </FieldGroup>

            <FieldGroup title="CTA Section">
              <TextField label="Title" value={config.ctaTitle} onChange={(v) => updateConfig({ ctaTitle: v })} />
              <TextField label="Subtitle" value={config.ctaSubtitle} onChange={(v) => updateConfig({ ctaSubtitle: v })} multiline />
              <div className="grid grid-cols-2 gap-4">
                <TextField label="CTA 1" value={config.ctaCta1} onChange={(v) => updateConfig({ ctaCta1: v })} />
                <TextField label="CTA 2" value={config.ctaCta2} onChange={(v) => updateConfig({ ctaCta2: v })} />
              </div>
            </FieldGroup>

            <FieldGroup title="Service Areas">
              <TextField label="Title" value={config.serviceAreasTitle} onChange={(v) => updateConfig({ serviceAreasTitle: v })} />
              <TextField label="Areas list" value={config.serviceAreasText} onChange={(v) => updateConfig({ serviceAreasText: v })} multiline />
            </FieldGroup>
          </TabsContent>

          {/* SERVICE PAGES TAB */}
          <TabsContent value="services-pages" className="space-y-6">
            {/* HARDWOOD */}
            <FieldGroup title="Hardwood Flooring — Texts">
              {renderServicePageFields("hardwoodPage")}
            </FieldGroup>
            <FieldGroup title="Hardwood — Benefits (checklist)">
              {config.hardwoodPage.benefits.map((b, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <div className="flex-1">
                    <ArrayItemHeader index={i} label="Benefit" onRemove={() => {
                      const arr = [...config.hardwoodPage.benefits];
                      arr.splice(i, 1);
                      updateHardwood({ benefits: arr });
                    }} />
                    <Input value={b} onChange={(e) => {
                      const arr = [...config.hardwoodPage.benefits];
                      arr[i] = e.target.value;
                      updateHardwood({ benefits: arr });
                    }} className="text-sm mt-1" />
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => updateHardwood({ benefits: [...config.hardwoodPage.benefits, "New benefit"] })}>
                <Plus className="w-4 h-4 mr-1" /> Add Benefit
              </Button>
            </FieldGroup>
            <FieldGroup title="Hardwood — Features (cards)">
              {config.hardwoodPage.features.map((f, i) => (
                <div key={i} className="border border-border/30 rounded-lg p-3 space-y-2">
                  <ArrayItemHeader index={i} label="Feature" onRemove={() => {
                    const arr = [...config.hardwoodPage.features];
                    arr.splice(i, 1);
                    updateHardwood({ features: arr });
                  }} />
                  <TextField label="Title" value={f.title} onChange={(v) => {
                    const arr = [...config.hardwoodPage.features];
                    arr[i] = { ...arr[i], title: v };
                    updateHardwood({ features: arr });
                  }} />
                  <TextField label="Description" value={f.desc} onChange={(v) => {
                    const arr = [...config.hardwoodPage.features];
                    arr[i] = { ...arr[i], desc: v };
                    updateHardwood({ features: arr });
                  }} multiline />
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => updateHardwood({ features: [...config.hardwoodPage.features, { title: "New Feature", desc: "Description" }] })}>
                <Plus className="w-4 h-4 mr-1" /> Add Feature
              </Button>
            </FieldGroup>
            <FieldGroup title="Hardwood — Installation Steps">
              {config.hardwoodPage.steps.map((s, i) => (
                <div key={i} className="border border-border/30 rounded-lg p-3 space-y-2">
                  <ArrayItemHeader index={i} label="Step" onRemove={() => {
                    const arr = [...config.hardwoodPage.steps];
                    arr.splice(i, 1);
                    updateHardwood({ steps: arr });
                  }} />
                  <div className="grid grid-cols-4 gap-2">
                    <TextField label="Number" value={s.num} onChange={(v) => {
                      const arr = [...config.hardwoodPage.steps];
                      arr[i] = { ...arr[i], num: v };
                      updateHardwood({ steps: arr });
                    }} />
                    <div className="col-span-3">
                      <TextField label="Title" value={s.title} onChange={(v) => {
                        const arr = [...config.hardwoodPage.steps];
                        arr[i] = { ...arr[i], title: v };
                        updateHardwood({ steps: arr });
                      }} />
                    </div>
                  </div>
                  <TextField label="Description" value={s.desc} onChange={(v) => {
                    const arr = [...config.hardwoodPage.steps];
                    arr[i] = { ...arr[i], desc: v };
                    updateHardwood({ steps: arr });
                  }} multiline />
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => updateHardwood({ steps: [...config.hardwoodPage.steps, { num: String(config.hardwoodPage.steps.length + 1).padStart(2, "0"), title: "New Step", desc: "Description" }] })}>
                <Plus className="w-4 h-4 mr-1" /> Add Step
              </Button>
            </FieldGroup>

            {/* SANDING */}
            <FieldGroup title="Sanding & Refinishing — Texts">
              {renderServicePageFields("sandingPage")}
            </FieldGroup>
            <FieldGroup title="Sanding — Benefits">
              {config.sandingPage.benefits.map((b, i) => (
                <div key={i} className="border border-border/30 rounded-lg p-3 space-y-2">
                  <ArrayItemHeader index={i} label="Benefit" onRemove={() => {
                    const arr = [...config.sandingPage.benefits];
                    arr.splice(i, 1);
                    updateSanding({ benefits: arr });
                  }} />
                  <TextField label="Title" value={b.title} onChange={(v) => {
                    const arr = [...config.sandingPage.benefits];
                    arr[i] = { ...arr[i], title: v };
                    updateSanding({ benefits: arr });
                  }} />
                  <TextField label="Description" value={b.desc} onChange={(v) => {
                    const arr = [...config.sandingPage.benefits];
                    arr[i] = { ...arr[i], desc: v };
                    updateSanding({ benefits: arr });
                  }} multiline />
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => updateSanding({ benefits: [...config.sandingPage.benefits, { title: "New Benefit", desc: "Description" }] })}>
                <Plus className="w-4 h-4 mr-1" /> Add Benefit
              </Button>
            </FieldGroup>
            <FieldGroup title="Sanding — Process Steps">
              {config.sandingPage.steps.map((s, i) => (
                <div key={i} className="border border-border/30 rounded-lg p-3 space-y-2">
                  <ArrayItemHeader index={i} label="Step" onRemove={() => {
                    const arr = [...config.sandingPage.steps];
                    arr.splice(i, 1);
                    updateSanding({ steps: arr });
                  }} />
                  <div className="grid grid-cols-4 gap-2">
                    <TextField label="Number" value={s.num} onChange={(v) => {
                      const arr = [...config.sandingPage.steps];
                      arr[i] = { ...arr[i], num: v };
                      updateSanding({ steps: arr });
                    }} />
                    <div className="col-span-3">
                      <TextField label="Title" value={s.title} onChange={(v) => {
                        const arr = [...config.sandingPage.steps];
                        arr[i] = { ...arr[i], title: v };
                        updateSanding({ steps: arr });
                      }} />
                    </div>
                  </div>
                  <TextField label="Description" value={s.desc} onChange={(v) => {
                    const arr = [...config.sandingPage.steps];
                    arr[i] = { ...arr[i], desc: v };
                    updateSanding({ steps: arr });
                  }} multiline />
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => updateSanding({ steps: [...config.sandingPage.steps, { num: String(config.sandingPage.steps.length + 1).padStart(2, "0"), title: "New Step", desc: "Description" }] })}>
                <Plus className="w-4 h-4 mr-1" /> Add Step
              </Button>
            </FieldGroup>
            <FieldGroup title="Sanding — Finish Options">
              {config.sandingPage.finishes.map((f, i) => (
                <div key={i} className="border border-border/30 rounded-lg p-3 space-y-2">
                  <ArrayItemHeader index={i} label="Finish" onRemove={() => {
                    const arr = [...config.sandingPage.finishes];
                    arr.splice(i, 1);
                    updateSanding({ finishes: arr });
                  }} />
                  <TextField label="Name" value={f.name} onChange={(v) => {
                    const arr = [...config.sandingPage.finishes];
                    arr[i] = { ...arr[i], name: v };
                    updateSanding({ finishes: arr });
                  }} />
                  <TextField label="Description" value={f.desc} onChange={(v) => {
                    const arr = [...config.sandingPage.finishes];
                    arr[i] = { ...arr[i], desc: v };
                    updateSanding({ finishes: arr });
                  }} multiline />
                  <TextField label="Best For" value={f.best} onChange={(v) => {
                    const arr = [...config.sandingPage.finishes];
                    arr[i] = { ...arr[i], best: v };
                    updateSanding({ finishes: arr });
                  }} />
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => updateSanding({ finishes: [...config.sandingPage.finishes, { name: "New Finish", desc: "Description", best: "Best for..." }] })}>
                <Plus className="w-4 h-4 mr-1" /> Add Finish
              </Button>
            </FieldGroup>

            {/* VINYL */}
            <FieldGroup title="Luxury Vinyl Plank — Texts">
              {renderServicePageFields("vinylPage")}
            </FieldGroup>
            <FieldGroup title="Vinyl — Features">
              {config.vinylPage.features.map((f, i) => (
                <div key={i} className="border border-border/30 rounded-lg p-3 space-y-2">
                  <ArrayItemHeader index={i} label="Feature" onRemove={() => {
                    const arr = [...config.vinylPage.features];
                    arr.splice(i, 1);
                    updateVinyl({ features: arr });
                  }} />
                  <TextField label="Title" value={f.title} onChange={(v) => {
                    const arr = [...config.vinylPage.features];
                    arr[i] = { ...arr[i], title: v };
                    updateVinyl({ features: arr });
                  }} />
                  <TextField label="Description" value={f.desc} onChange={(v) => {
                    const arr = [...config.vinylPage.features];
                    arr[i] = { ...arr[i], desc: v };
                    updateVinyl({ features: arr });
                  }} multiline />
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => updateVinyl({ features: [...config.vinylPage.features, { title: "New Feature", desc: "Description" }] })}>
                <Plus className="w-4 h-4 mr-1" /> Add Feature
              </Button>
            </FieldGroup>
            <FieldGroup title="Vinyl — Room Guide">
              {config.vinylPage.rooms.map((r, i) => (
                <div key={i} className="border border-border/30 rounded-lg p-3 space-y-2">
                  <ArrayItemHeader index={i} label="Room" onRemove={() => {
                    const arr = [...config.vinylPage.rooms];
                    arr.splice(i, 1);
                    updateVinyl({ rooms: arr });
                  }} />
                  <div className="grid grid-cols-2 gap-2">
                    <TextField label="Room Name" value={r.room} onChange={(v) => {
                      const arr = [...config.vinylPage.rooms];
                      arr[i] = { ...arr[i], room: v };
                      updateVinyl({ rooms: arr });
                    }} />
                    <TextField label="Tag" value={r.tag} onChange={(v) => {
                      const arr = [...config.vinylPage.rooms];
                      arr[i] = { ...arr[i], tag: v };
                      updateVinyl({ rooms: arr });
                    }} />
                  </div>
                  <TextField label="Benefits" value={r.benefits} onChange={(v) => {
                    const arr = [...config.vinylPage.rooms];
                    arr[i] = { ...arr[i], benefits: v };
                    updateVinyl({ rooms: arr });
                  }} />
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => updateVinyl({ rooms: [...config.vinylPage.rooms, { room: "New Room", benefits: "Benefits here", tag: "Tag" }] })}>
                <Plus className="w-4 h-4 mr-1" /> Add Room
              </Button>
            </FieldGroup>
            <FieldGroup title="Vinyl — Comparison Table">
              {config.vinylPage.comparison.map((c, i) => (
                <div key={i} className="border border-border/30 rounded-lg p-3 space-y-2">
                  <ArrayItemHeader index={i} label="Row" onRemove={() => {
                    const arr = [...config.vinylPage.comparison];
                    arr.splice(i, 1);
                    updateVinyl({ comparison: arr });
                  }} />
                  <TextField label="Feature" value={c.feature} onChange={(v) => {
                    const arr = [...config.vinylPage.comparison];
                    arr[i] = { ...arr[i], feature: v };
                    updateVinyl({ comparison: arr });
                  }} />
                  <div className="grid grid-cols-2 gap-2">
                    <TextField label="Vinyl" value={c.vinyl} onChange={(v) => {
                      const arr = [...config.vinylPage.comparison];
                      arr[i] = { ...arr[i], vinyl: v };
                      updateVinyl({ comparison: arr });
                    }} />
                    <TextField label="Hardwood" value={c.hardwood} onChange={(v) => {
                      const arr = [...config.vinylPage.comparison];
                      arr[i] = { ...arr[i], hardwood: v };
                      updateVinyl({ comparison: arr });
                    }} />
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => updateVinyl({ comparison: [...config.vinylPage.comparison, { feature: "Feature", vinyl: "Vinyl", hardwood: "Hardwood" }] })}>
                <Plus className="w-4 h-4 mr-1" /> Add Row
              </Button>
            </FieldGroup>

            {/* STAIRCASE */}
            <FieldGroup title="Staircase Services — Texts">
              {renderServicePageFields("staircasePage")}
            </FieldGroup>
            <FieldGroup title="Staircase — Services">
              {config.staircasePage.services.map((s, i) => (
                <div key={i} className="border border-border/30 rounded-lg p-3 space-y-2">
                  <ArrayItemHeader index={i} label="Service" onRemove={() => {
                    const arr = [...config.staircasePage.services];
                    arr.splice(i, 1);
                    updateStaircase({ services: arr });
                  }} />
                  <TextField label="Title" value={s.title} onChange={(v) => {
                    const arr = [...config.staircasePage.services];
                    arr[i] = { ...arr[i], title: v };
                    updateStaircase({ services: arr });
                  }} />
                  <TextField label="Description" value={s.desc} onChange={(v) => {
                    const arr = [...config.staircasePage.services];
                    arr[i] = { ...arr[i], desc: v };
                    updateStaircase({ services: arr });
                  }} multiline />
                  <TextField label="Tags (comma separated)" value={s.tags.join(", ")} onChange={(v) => {
                    const arr = [...config.staircasePage.services];
                    arr[i] = { ...arr[i], tags: v.split(",").map(t => t.trim()).filter(Boolean) };
                    updateStaircase({ services: arr });
                  }} />
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => updateStaircase({ services: [...config.staircasePage.services, { title: "New Service", desc: "Description", tags: ["Tag"] }] })}>
                <Plus className="w-4 h-4 mr-1" /> Add Service
              </Button>
            </FieldGroup>
            <FieldGroup title="Staircase — Benefits (checklist)">
              {config.staircasePage.benefits.map((b, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <div className="flex-1">
                    <ArrayItemHeader index={i} label="Benefit" onRemove={() => {
                      const arr = [...config.staircasePage.benefits];
                      arr.splice(i, 1);
                      updateStaircase({ benefits: arr });
                    }} />
                    <Input value={b} onChange={(e) => {
                      const arr = [...config.staircasePage.benefits];
                      arr[i] = e.target.value;
                      updateStaircase({ benefits: arr });
                    }} className="text-sm mt-1" />
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => updateStaircase({ benefits: [...config.staircasePage.benefits, "New benefit"] })}>
                <Plus className="w-4 h-4 mr-1" /> Add Benefit
              </Button>
            </FieldGroup>
            <FieldGroup title="Staircase — Styles">
              {config.staircasePage.styles.map((s, i) => (
                <div key={i} className="border border-border/30 rounded-lg p-3 space-y-2">
                  <ArrayItemHeader index={i} label="Style" onRemove={() => {
                    const arr = [...config.staircasePage.styles];
                    arr.splice(i, 1);
                    updateStaircase({ styles: arr });
                  }} />
                  <TextField label="Name" value={s.name} onChange={(v) => {
                    const arr = [...config.staircasePage.styles];
                    arr[i] = { ...arr[i], name: v };
                    updateStaircase({ styles: arr });
                  }} />
                  <TextField label="Description" value={s.desc} onChange={(v) => {
                    const arr = [...config.staircasePage.styles];
                    arr[i] = { ...arr[i], desc: v };
                    updateStaircase({ styles: arr });
                  }} multiline />
                  <TextField label="Tags (comma separated)" value={s.tags.join(", ")} onChange={(v) => {
                    const arr = [...config.staircasePage.styles];
                    arr[i] = { ...arr[i], tags: v.split(",").map(t => t.trim()).filter(Boolean) };
                    updateStaircase({ styles: arr });
                  }} />
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => updateStaircase({ styles: [...config.staircasePage.styles, { name: "New Style", desc: "Description", tags: ["Tag"] }] })}>
                <Plus className="w-4 h-4 mr-1" /> Add Style
              </Button>
            </FieldGroup>
            <FieldGroup title="Staircase — Safety Items">
              {config.staircasePage.safety.map((s, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <div className="flex-1">
                    <ArrayItemHeader index={i} label="Safety" onRemove={() => {
                      const arr = [...config.staircasePage.safety];
                      arr.splice(i, 1);
                      updateStaircase({ safety: arr });
                    }} />
                    <Input value={s} onChange={(e) => {
                      const arr = [...config.staircasePage.safety];
                      arr[i] = e.target.value;
                      updateStaircase({ safety: arr });
                    }} className="text-sm mt-1" />
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => updateStaircase({ safety: [...config.staircasePage.safety, "New safety item"] })}>
                <Plus className="w-4 h-4 mr-1" /> Add Safety Item
              </Button>
            </FieldGroup>
          </TabsContent>

          {/* COLORS TAB */}
          <TabsContent value="colors" className="space-y-6">
            <FieldGroup title="Main Colors">
              <div className="grid grid-cols-2 gap-4">
                <ColorInput label="Primary / Accent" value={config.colorPrimary} onChange={(v) => updateConfig({ colorPrimary: v })} />
                <ColorInput label="Gold" value={config.colorGold} onChange={(v) => updateConfig({ colorGold: v })} />
                <ColorInput label="Gold Light" value={config.colorGoldLight} onChange={(v) => updateConfig({ colorGoldLight: v })} />
                <ColorInput label="Gold Dark" value={config.colorGoldDark} onChange={(v) => updateConfig({ colorGoldDark: v })} />
              </div>
            </FieldGroup>
            <FieldGroup title="Background & Surface">
              <div className="grid grid-cols-2 gap-4">
                <ColorInput label="Background" value={config.colorBackground} onChange={(v) => updateConfig({ colorBackground: v })} />
                <ColorInput label="Foreground (Text)" value={config.colorForeground} onChange={(v) => updateConfig({ colorForeground: v })} />
                <ColorInput label="Card Background" value={config.colorCard} onChange={(v) => updateConfig({ colorCard: v })} />
                <ColorInput label="Border" value={config.colorBorder} onChange={(v) => updateConfig({ colorBorder: v })} />
              </div>
            </FieldGroup>
            <FieldGroup title="Button Styles">
              <div className="grid grid-cols-2 gap-4">
                <TextField label="Border Radius (e.g. 0.5rem)" value={config.buttonRadius} onChange={(v) => updateConfig({ buttonRadius: v })} />
                <TextField label="Outline Border Width (e.g. 2px)" value={config.buttonBorderWidth} onChange={(v) => updateConfig({ buttonBorderWidth: v })} />
              </div>
              <div className="mt-4 flex gap-3">
                <Button variant="gold">Preview Gold</Button>
                <Button variant="goldOutline">Preview Outline</Button>
                <Button variant="default">Preview Default</Button>
              </div>
            </FieldGroup>
          </TabsContent>

          {/* IMAGES TAB */}
          <TabsContent value="images" className="space-y-6">
            <FieldGroup title="Site Images">
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                <ImageUpload label="Logo" currentSrc={config.logoImage} onUpload={(v) => updateConfig({ logoImage: v })} />
                <ImageUpload label="Hero Background" currentSrc={config.heroImage} onUpload={(v) => updateConfig({ heroImage: v })} />
                <ImageUpload label="Craftsman Photo" currentSrc={config.craftImage} onUpload={(v) => updateConfig({ craftImage: v })} />
              </div>
            </FieldGroup>
            <FieldGroup title="Service Images">
              <div className="grid grid-cols-2 gap-4">
                <ImageUpload label="Sanding & Finish" currentSrc={config.serviceImages.sanding} onUpload={(v) => updateConfig({ serviceImages: { ...config.serviceImages, sanding: v } })} />
                <ImageUpload label="Hardwood Flooring" currentSrc={config.serviceImages.hardwood} onUpload={(v) => updateConfig({ serviceImages: { ...config.serviceImages, hardwood: v } })} />
                <ImageUpload label="Vinyl Plank" currentSrc={config.serviceImages.vinyl} onUpload={(v) => updateConfig({ serviceImages: { ...config.serviceImages, vinyl: v } })} />
                <ImageUpload label="Staircase" currentSrc={config.serviceImages.staircase} onUpload={(v) => updateConfig({ serviceImages: { ...config.serviceImages, staircase: v } })} />
              </div>
            </FieldGroup>
          </TabsContent>

          {/* COMPANY INFO TAB */}
          <TabsContent value="info" className="space-y-6">
            <FieldGroup title="Contact Information">
              <TextField label="Phone" value={config.phone} onChange={(v) => updateConfig({ phone: v })} />
              <TextField label="Email" value={config.email} onChange={(v) => updateConfig({ email: v })} />
              <TextField label="Serving Area" value={config.servingArea} onChange={(v) => updateConfig({ servingArea: v })} />
            </FieldGroup>
            <FieldGroup title="Footer">
              <TextField label="Tagline" value={config.footerTagline} onChange={(v) => updateConfig({ footerTagline: v })} multiline />
              <TextField label="Slogan" value={config.footerSlogan} onChange={(v) => updateConfig({ footerSlogan: v })} />
            </FieldGroup>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
