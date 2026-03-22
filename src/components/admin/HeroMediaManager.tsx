import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Monitor, Tablet, Smartphone, Upload, Trash2, Loader2, Film, Image, Crop } from "lucide-react";
import ImageCropDialog from "./ImageCropDialog";

interface HeroMedia {
  id: string;
  device: string;
  media_type: string;
  media_url: string;
}

const DEVICES = [
  { key: "desktop", label: "Desktop", icon: Monitor, hint: "Recomendado: 1920×1080", aspect: 16 / 9 },
  { key: "tablet", label: "Tablet", icon: Tablet, hint: "Recomendado: 1024×768", aspect: 4 / 3 },
  { key: "mobile", label: "Mobile", icon: Smartphone, hint: "Recomendado: 390×844", aspect: 9 / 19.5 },
] as const;

export default function HeroMediaManager() {
  const [media, setMedia] = useState<Record<string, HeroMedia | null>>({
    desktop: null, tablet: null, mobile: null,
  });
  const [uploading, setUploading] = useState<string | null>(null);
  const [cropState, setCropState] = useState<{
    device: string;
    imageSrc: string;
    originalFile: File;
    aspect: number;
  } | null>(null);

  const fetchMedia = async () => {
    const { data } = await supabase.from("hero_media").select("*").eq("is_active", true);
    const map: Record<string, HeroMedia | null> = { desktop: null, tablet: null, mobile: null };
    data?.forEach((item: any) => { map[item.device] = item; });
    setMedia(map);
  };

  useEffect(() => { fetchMedia(); }, []);

  const uploadFile = async (device: string, file: File | Blob, ext: string, mediaType: string) => {
    setUploading(device);
    try {
      const path = `hero-${device}-${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("hero-media")
        .upload(path, file, { upsert: true });
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from("hero-media").getPublicUrl(path);
      const mediaUrl = urlData.publicUrl;

      const existing = media[device];
      if (existing) {
        const oldPath = existing.media_url.split("/hero-media/").pop();
        if (oldPath) await supabase.storage.from("hero-media").remove([oldPath]);
        await supabase.from("hero_media")
          .update({ media_url: mediaUrl, media_type: mediaType, updated_at: new Date().toISOString() })
          .eq("id", existing.id);
      } else {
        await supabase.from("hero_media").insert({ device, media_type: mediaType, media_url: mediaUrl });
      }

      toast.success(`${device} hero media atualizado!`);
      fetchMedia();
    } catch (err: any) {
      toast.error(err.message || "Erro ao fazer upload");
    } finally {
      setUploading(null);
    }
  };

  const handleFileSelect = (device: string, file: File, aspect: number) => {
    const isVideo = file.type.startsWith("video/");
    if (isVideo) {
      const ext = file.name.split(".").pop() || "mp4";
      uploadFile(device, file, ext, "video");
    } else {
      // Open crop dialog for images
      const reader = new FileReader();
      reader.onload = () => {
        setCropState({
          device,
          imageSrc: reader.result as string,
          originalFile: file,
          aspect,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (croppedBlob: Blob) => {
    if (!cropState) return;
    uploadFile(cropState.device, croppedBlob, "webp", "image");
    setCropState(null);
  };

  const handleUploadOriginal = () => {
    if (!cropState) return;
    const ext = cropState.originalFile.name.split(".").pop() || "jpg";
    uploadFile(cropState.device, cropState.originalFile, ext, "image");
    setCropState(null);
  };

  const handleDelete = async (device: string) => {
    const item = media[device];
    if (!item) return;
    setUploading(device);
    try {
      const oldPath = item.media_url.split("/hero-media/").pop();
      if (oldPath) await supabase.storage.from("hero-media").remove([oldPath]);
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
    <>
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-display flex items-center gap-2">
            <Film className="w-4 h-4 text-gold" /> Hero Background Media
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Upload vídeo ou imagem de fundo do hero para cada dispositivo. Imagens podem ser recortadas antes do upload.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {DEVICES.map(({ key, label, icon: Icon, hint }) => {
            const item = media[key];
            const isLoading = uploading === key;
            const deviceConfig = DEVICES.find(d => d.key === key)!;

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

                {item && (
                  <div className="rounded-md overflow-hidden bg-black/50 max-h-40 flex items-center justify-center">
                    {item.media_type === "video" ? (
                      <video src={item.media_url} className="max-h-40 w-full object-cover" muted autoPlay loop playsInline />
                    ) : (
                      <img src={item.media_url} alt={`Hero ${label}`} className="max-h-40 w-full object-cover" />
                    )}
                  </div>
                )}

                <div className="flex gap-2">
                  <Button variant="goldOutline" size="sm" className="relative" disabled={isLoading}>
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
                        if (file) handleFileSelect(key, file, deviceConfig.aspect);
                        e.target.value = "";
                      }}
                    />
                  </Button>
                  {item && item.media_type === "image" && (
                    <Button
                      variant="goldOutline"
                      size="sm"
                      disabled={isLoading}
                      onClick={() => {
                        setCropState({
                          device: key,
                          imageSrc: item.media_url,
                          originalFile: new File([], "existing"),
                          aspect: deviceConfig.aspect,
                        });
                      }}
                    >
                      <Crop className="w-4 h-4 mr-1" /> Recortar
                    </Button>
                  )}
                  {item && (
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(key)} disabled={isLoading}>
                      <Trash2 className="w-4 h-4 mr-1" /> Remover
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {cropState && (
        <ImageCropDialog
          open={!!cropState}
          onOpenChange={(open) => { if (!open) setCropState(null); }}
          imageSrc={cropState.imageSrc}
          aspectRatio={cropState.aspect}
          onCropComplete={handleCropComplete}
        />
      )}
    </>
  );
}
