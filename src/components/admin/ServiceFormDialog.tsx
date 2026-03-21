import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useServicesData, Service } from "@/hooks/admin/useServicesData";
import { Loader2 } from "lucide-react";

const ICON_OPTIONS = [
  "TreePine", "Paintbrush", "ArrowUpDown", "Trash2", "Layers", "Fence", "Sparkles",
  "Hammer", "Wrench", "Home", "Shield", "Star", "Zap",
];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service?: Service;
}

export default function ServiceFormDialog({ open, onOpenChange, service }: Props) {
  const { createService, updateService, uploadImage, isCreating, isUpdating } = useServicesData();
  const isEdit = !!service;

  const [title, setTitle] = useState(service?.title ?? "");
  const [description, setDescription] = useState(service?.description ?? "");
  const [iconName, setIconName] = useState(service?.icon_name ?? "Sparkles");
  const [displayOrder, setDisplayOrder] = useState(service?.display_order ?? 0);
  const [isActive, setIsActive] = useState(service?.is_active ?? true);
  const [linkUrl, setLinkUrl] = useState(service?.link_url ?? "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(service?.image_url ?? "");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      if (isEdit && service) {
        let imageUrl = service.image_url;
        if (imageFile) {
          imageUrl = await uploadImage(imageFile, service.id);
        }
        await updateService({
          id: service.id,
          title,
          description,
          icon_name: iconName,
          display_order: displayOrder,
          is_active: isActive,
          link_url: linkUrl || null,
          image_url: imageUrl,
        });
      } else {
        const result = await createService({
          title,
          description,
          icon_name: iconName,
          display_order: displayOrder,
          is_active: isActive,
          link_url: linkUrl || null,
          image_url: null,
        });
        if (imageFile && result?.id) {
          const url = await uploadImage(imageFile, result.id);
          await updateService({ id: result.id, image_url: url });
        }
      }
      onOpenChange(false);
    } catch {}
  };

  const busy = isCreating || isUpdating;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-display">{isEdit ? "Edit Service" : "New Service"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Title *</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Hardwood Installation" />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Icon</Label>
              <select
                value={iconName}
                onChange={(e) => setIconName(e.target.value)}
                className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm text-foreground"
              >
                {ICON_OPTIONS.map((ic) => (
                  <option key={ic} value={ic}>{ic}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Display Order</Label>
              <Input type="number" value={displayOrder} onChange={(e) => setDisplayOrder(Number(e.target.value))} />
            </div>
          </div>
          <div>
            <Label>Photo</Label>
            <div className="flex items-center gap-4 mt-1">
              {imagePreview && (
                <img src={imagePreview} alt="" className="w-16 h-16 rounded-lg object-cover border border-border" />
              )}
              <Input type="file" accept="image/*" onChange={handleImageChange} className="flex-1" />
            </div>
          </div>
          <div>
            <Label>Link URL (optional)</Label>
            <Input value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="/services/hardwood" />
          </div>
          <div className="flex items-center justify-between">
            <Label>Active</Label>
            <Switch checked={isActive} onCheckedChange={setIsActive} />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" variant="gold" disabled={busy}>
              {busy && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isEdit ? "Save" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
