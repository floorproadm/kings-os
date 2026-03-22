import { useState } from "react";
import { Plus, Pencil, Image, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useServicesData, Service } from "@/hooks/admin/useServicesData";
import ServiceFormDialog from "@/components/admin/ServiceFormDialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function AdminServices() {
  const { services, isLoading, updateService, uploadImage } = useServicesData();
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [showNew, setShowNew] = useState(false);

  const handleImageUpload = async (service: Service) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      try {
        const url = await uploadImage(file, service.id);
        await updateService({ id: service.id, image_url: url });
      } catch (err: any) {
        toast.error(err.message);
      }
    };
    input.click();
  };

  const handleToggleActive = async (service: Service) => {
    await updateService({ id: service.id, is_active: !service.is_active });
  };

  const handleDelete = async (id: string) => {
    if (deleteConfirm !== id) {
      setDeleteConfirm(id);
      return;
    }
    await deleteService(id);
    setDeleteConfirm(null);
  };

  if (isLoading) {
    return <div className="p-8 text-muted-foreground">Loading services...</div>;
  }

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Services</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage homepage services section</p>
        </div>
        <Button variant="gold" onClick={() => setShowNew(true)}>
          <Plus className="w-4 h-4 mr-2" /> Add Service
        </Button>
      </div>

      <div className="space-y-3">
        {services.map((s) => (
          <div
            key={s.id}
            className={`elevated-card p-4 flex items-center gap-4 transition-opacity ${
              !s.is_active ? "opacity-50" : ""
            }`}
          >
            {/* Image preview */}
            <div
              className="w-16 h-16 rounded-lg bg-card border border-border flex-shrink-0 overflow-hidden cursor-pointer hover:border-gold/40 transition-colors flex items-center justify-center"
              onClick={() => handleImageUpload(s)}
            >
              {s.image_url ? (
                <img src={s.image_url} alt={s.title} className="w-full h-full object-cover" />
              ) : (
                <Image className="w-5 h-5 text-muted-foreground" />
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="font-display font-semibold text-foreground truncate">{s.title}</p>
              <p className="text-xs text-muted-foreground truncate">{s.description}</p>
            </div>

            {/* Order */}
            <span className="text-xs text-muted-foreground font-mono w-6 text-center flex-shrink-0">
              #{s.display_order}
            </span>

            {/* Actions */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleToggleActive(s)}
                title={s.is_active ? "Hide" : "Show"}
              >
                {s.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setEditingService(s)}
              >
                <Pencil className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={`h-8 w-8 ${deleteConfirm === s.id ? "text-red-500" : ""}`}
                onClick={() => handleDelete(s.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* New dialog */}
      <ServiceFormDialog open={showNew} onOpenChange={setShowNew} />

      {/* Edit dialog */}
      {editingService && (
        <ServiceFormDialog
          open={!!editingService}
          onOpenChange={(open) => !open && setEditingService(null)}
          service={editingService}
        />
      )}
    </div>
  );
}
