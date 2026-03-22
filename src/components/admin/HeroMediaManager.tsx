import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Monitor, Tablet, Smartphone, Upload, Trash2, Loader2, Film, Image } from "lucide-react";

interface HeroMedia {
  id: string;
  device: string;
  media_type: string;
  media_url: string;
}

const DEVICES = [
  { key: "desktop", label: "Desktop", icon: Monitor, hint: "Recomendado: 1920×1080" },
  { key: "tablet", label: "Tablet", icon: Tablet, hint: "Recomendado: 1024×768" },
  { key: "mobile", label: "Mobile", icon: Smartphone, hint: "Recomendado: 390×844" },
] as const;

export default function HeroMediaManager() {
  const [media, setMedia] = useState<Record<string, HeroMedia | null>>({
    desktop: null,
    tablet: null,
    mobile: null,
  });
  const [uploading, setUploading] = useState<string | null>(null);

  const fetchMedia = async () => {
    const { data } = await supabase
      .from("hero_media")
      .select("*")
      .eq("is_active", true);
    
    const map: Record<string, HeroMedia | null> = { desktop: null, tablet: null, mobile: null };
    data?.forEach((item: any) => {
      map[item.device] = item;
    });
    setMedia(map);
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleUpload = async (device: string, file: File) => {
    setUploading(device);
    try {
      const isVideo = file.type.startsWith("video/");
      const mediaType = isVideo ? "video" : "image";
      const ext = file.name.split(".").pop();
      const path = `hero-${device}-${Date.now()}.${ext}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from("hero-media")
        .upload(path, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("hero-media")
        .getPublicUrl(path);

      const mediaUrl = urlData.publicUrl;

      // Upsert in hero_media table
      const existing = media[device];
      if (existing) {
        // Delete old file from storage
        const oldPath = existing.media_url.split("/hero-media/").pop();
        if (oldPath) {
          await supabase.storage.from("hero-media").remove([oldPath]);
        }
        await supabase
          .from("hero_media")
          .update({ media_url: mediaUrl, media_type: mediaType, updated_at: new Date().toISOString() })
          .eq("id", existing.id);
      } else {
        await supabase.from("hero_media").insert({
          device,
          media_type: mediaType,
          media_url: mediaUrl,
        });
      }

      toast.success(`${device} hero media atualizado!`);
      fetchMedia();
    } catch (err: any) {
      toast.error(err.message || "Erro ao fazer upload");
    } finally {
      setUploading(null);
    }
  };

  const handleDelete = async (device: string) => {
    const item = media[device];
    if (!item) return;

    setUploading(device);
    try {
      const oldPath = item.media_url.split("/hero-media/").pop();
      if (oldPath) {
        await supabase.storage.from("hero-media").remove([oldPath]);
      }
      await supabase.from("hero_media").delete().eq("id", item.id);
      toast.success(`${device} media removido`);
      fetchMedia();
    } catch (err: any) {
      toast.error(err.message || "Erro ao remover");
    } finally {
      setUploading(null);
    }
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-display flex items-center gap-2">
          <Film className="w-4 h-4 text-gold" /> Hero Background Media
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Upload vídeo ou imagem de fundo do hero para cada dispositivo. Aceita MP4, WebM, JPG, PNG, WebP.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {DEVICES.map(({ key, label, icon: Icon, hint }) => {
          const item = media[key];
          const isLoading = uploading === key;

          return (
            <div key={key} className="border border-border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-gold" />
                  <span className="font-medium text-sm">{label}</span>
                  <span className="text-xs text-muted-foreground">({hint})</span>
                </div>
                {item && (
                  <div className="flex items-center gap-1.5">
                    {item.media_type === "video" ? (
                      <Film className="w-3.5 h-3.5 text-muted-foreground" />
                    ) : (
                      <Image className="w-3.5 h-3.5 text-muted-foreground" />
                    )}
                    <span className="text-xs text-muted-foreground capitalize">{item.media_type}</span>
                  </div>
                )}
              </div>

              {/* Preview */}
              {item && (
                <div className="rounded-md overflow-hidden bg-black/50 max-h-40 flex items-center justify-center">
                  {item.media_type === "video" ? (
                    <video
                      src={item.media_url}
                      className="max-h-40 w-full object-cover"
                      muted
                      autoPlay
                      loop
                      playsInline
                    />
                  ) : (
                    <img
                      src={item.media_url}
                      alt={`Hero ${label}`}
                      className="max-h-40 w-full object-cover"
                    />
                  )}
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  variant="goldOutline"
                  size="sm"
                  className="relative"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-1" />
                  ) : (
                    <Upload className="w-4 h-4 mr-1" />
                  )}
                  {item ? "Substituir" : "Upload"}
                  <input
                    type="file"
                    accept="video/mp4,video/webm,image/jpeg,image/png,image/webp"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    disabled={isLoading}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleUpload(key, file);
                      e.target.value = "";
                    }}
                  />
                </Button>
                {item && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(key)}
                    disabled={isLoading}
                  >
                    <Trash2 className="w-4 h-4 mr-1" /> Remover
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
