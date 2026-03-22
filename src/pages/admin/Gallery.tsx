import { useState, useRef, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Plus,
  Trash2,
  Loader2,
  ImageIcon,
  Camera,
  X,
  Check,
  Eye,
  EyeOff,
  GripVertical,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { HK_ORG_ID } from "@/lib/constants";

const CATEGORIES = [
  { value: "hardwood", label: "Hardwood", emoji: "🪵" },
  { value: "sanding", label: "Sanding & Refinishing", emoji: "✨" },
  { value: "vinyl", label: "Vinyl & LVP", emoji: "🏠" },
  { value: "staircase", label: "Staircases", emoji: "🪜" },
  { value: "deck", label: "Decks & Handrails", emoji: "🌳" },
] as const;

type Category = (typeof CATEGORIES)[number]["value"];

interface GalleryImage {
  id: string;
  category: string;
  title: string | null;
  image_url: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export default function AdminGallery() {
  const [filterCategory, setFilterCategory] = useState<Category | "all">("all");
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadCategory, setUploadCategory] = useState<Category>("hardwood");
  const [showUploadArea, setShowUploadArea] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<GalleryImage | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: allImages = [], isLoading } = useQuery({
    queryKey: ["gallery-images"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gallery_images")
        .select("*")
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as GalleryImage[];
    },
  });

  const images = filterCategory === "all"
    ? allImages
    : allImages.filter((i) => i.category === filterCategory);

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("gallery_images").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery-images"] });
      toast({ title: "Photo removed ✓" });
      setSelectedImage(null);
      setDeleteTarget(null);
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from("gallery_images")
        .update({ is_active })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery-images"] });
      toast({ title: "Visibility updated ✓" });
    },
  });

  const updateTitleMutation = useMutation({
    mutationFn: async ({ id, title }: { id: string; title: string | null }) => {
      const { error } = await supabase
        .from("gallery_images")
        .update({ title })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery-images"] });
      toast({ title: "Caption saved ✓" });
      setSelectedImage(null);
    },
  });

  const reorderMutation = useMutation({
    mutationFn: async ({ id, newOrder }: { id: string; newOrder: number }) => {
      const { error } = await supabase
        .from("gallery_images")
        .update({ display_order: newOrder })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery-images"] });
    },
  });

  const handleMultiUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (!files.length) return;

      const validFiles = files.filter(
        (f) => f.type.startsWith("image/") && f.size <= 5 * 1024 * 1024
      );

      if (validFiles.length !== files.length) {
        toast({
          title: `${files.length - validFiles.length} file(s) skipped`,
          description: "Max 5MB, image format only.",
          variant: "destructive",
        });
      }

      if (!validFiles.length) return;

      setUploading(true);
      setUploadProgress(0);

      let uploaded = 0;

      for (const file of validFiles) {
        try {
          const ext = file.name.split(".").pop();
          const fileName = `${uploadCategory}/${Date.now()}-${Math.random()
            .toString(36)
            .substring(7)}.${ext}`;

          const { error: uploadError } = await supabase.storage
            .from("gallery")
            .upload(fileName, file, { cacheControl: "3600", upsert: false });

          if (uploadError) throw uploadError;

          const { data: urlData } = supabase.storage
            .from("gallery")
            .getPublicUrl(fileName);

          const currentImages = images.filter((i) => i.category === uploadCategory);
          const maxOrder = currentImages.length + uploaded;

          const { error: insertError } = await supabase
            .from("gallery_images")
            .insert({
              category: uploadCategory,
              title: null,
              image_url: urlData.publicUrl,
              display_order: maxOrder,
              org_id: HK_ORG_ID,
            });

          if (insertError) throw insertError;
          uploaded++;
          setUploadProgress(Math.round((uploaded / validFiles.length) * 100));
        } catch (err) {
          console.error("Upload error:", err);
        }
      }

      queryClient.invalidateQueries({ queryKey: ["gallery-images"] });
      toast({
        title: `${uploaded} photo${uploaded > 1 ? "s" : ""} added ✓`,
      });
      setUploading(false);
      setUploadProgress(0);
      setShowUploadArea(false);
      if (inputRef.current) inputRef.current.value = "";
    },
    [uploadCategory, images, queryClient, toast]
  );

  function handleMove(image: GalleryImage, direction: "up" | "down") {
    const categoryImages = images
      .filter((i) => i.category === image.category)
      .sort((a, b) => a.display_order - b.display_order);

    const idx = categoryImages.findIndex((i) => i.id === image.id);
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= categoryImages.length) return;

    const other = categoryImages[swapIdx];
    reorderMutation.mutate({ id: image.id, newOrder: other.display_order });
    reorderMutation.mutate({ id: other.id, newOrder: image.display_order });
  }

  const categoryLabel = (cat: string) =>
    CATEGORIES.find((c) => c.value === cat)?.label || cat;

  const categoryEmoji = (cat: string) =>
    CATEGORIES.find((c) => c.value === cat)?.emoji || "";

  const counts: Record<string, number> = { all: allImages.length };
  CATEGORIES.forEach((c) => {
    counts[c.value] = allImages.filter((i) => i.category === c.value).length;
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-display font-bold text-foreground">Gallery</h2>
          <p className="text-xs text-muted-foreground">
            {images.length} photo{images.length !== 1 ? "s" : ""} in portfolio
          </p>
        </div>
        <Button
          size="sm"
          variant="gold"
          className="gap-1.5 rounded-full px-4"
          onClick={() => setShowUploadArea(!showUploadArea)}
        >
          {showUploadArea ? <X className="w-4 h-4" /> : <Camera className="w-4 h-4" />}
          {showUploadArea ? "Close" : "Upload"}
        </Button>
      </div>

      {/* Upload Area */}
      {showUploadArea && (
        <div className="rounded-xl border-2 border-dashed border-gold/30 bg-gold/5 p-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((c) => (
              <button
                key={c.value}
                onClick={() => setUploadCategory(c.value)}
                className={cn(
                  "py-2 px-3 rounded-lg text-xs font-medium transition-all",
                  uploadCategory === c.value
                    ? "bg-gold text-primary-foreground shadow-sm"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                <span className="block text-base mb-0.5">{c.emoji}</span>
                {c.label}
              </button>
            ))}
          </div>

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleMultiUpload}
            className="hidden"
            id="gallery-multi-upload"
          />
          <label
            htmlFor="gallery-multi-upload"
            className={cn(
              "flex flex-col items-center justify-center gap-2 py-8 rounded-lg cursor-pointer transition-all",
              "bg-background border border-border hover:border-gold/50 hover:shadow-sm",
              uploading && "pointer-events-none opacity-70"
            )}
          >
            {uploading ? (
              <>
                <Loader2 className="h-7 w-7 text-gold animate-spin" />
                <span className="text-sm font-medium text-gold">
                  Uploading... {uploadProgress}%
                </span>
                <div className="w-32 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gold rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="h-12 w-12 rounded-full bg-gold/10 flex items-center justify-center">
                  <Plus className="h-6 w-6 text-gold" />
                </div>
                <span className="text-sm font-medium text-foreground">
                  Click to select photos
                </span>
                <span className="text-xs text-muted-foreground">
                  Multiple photos • Max 5MB each
                </span>
              </>
            )}
          </label>
        </div>
      )}

      {/* Category Filter Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
        {[{ value: "all" as const, label: "All", emoji: "📷" }, ...CATEGORIES].map((c) => (
          <button
            key={c.value}
            onClick={() => setFilterCategory(c.value as Category | "all")}
            className={cn(
              "flex items-center gap-1.5 whitespace-nowrap px-3.5 py-2 rounded-full text-xs font-medium transition-all shrink-0",
              filterCategory === c.value
                ? "bg-gold text-primary-foreground shadow-sm"
                : "bg-muted text-muted-foreground"
            )}
          >
            {c.emoji} {c.label}
            <span
              className={cn(
                "ml-0.5 text-[10px] px-1.5 py-0.5 rounded-full",
                filterCategory === c.value ? "bg-background/20" : "bg-foreground/5"
              )}
            >
              {counts[c.value] || 0}
            </span>
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : images.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="font-medium">No photos yet</p>
          <p className="text-xs mt-1">Click "Upload" to add your first photo!</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
          {images.map((image) => {
            const isSelected = selectedImage?.id === image.id;
            return (
              <div
                key={image.id}
                className={cn(
                  "relative rounded-lg overflow-hidden cursor-pointer transition-all duration-200",
                  isSelected
                    ? "ring-2 ring-gold ring-offset-2 ring-offset-background scale-[0.97]"
                    : "hover:opacity-90",
                  !image.is_active && "opacity-50"
                )}
                onClick={() => {
                  if (isSelected) {
                    setSelectedImage(null);
                  } else {
                    setSelectedImage(image);
                    setEditingTitle(image.title || "");
                  }
                }}
              >
                <div className="aspect-square">
                  <img
                    src={image.image_url}
                    alt={image.title || ""}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="absolute top-1 left-1">
                  <span className="text-[10px] font-medium bg-foreground/60 text-white px-1.5 py-0.5 rounded-full backdrop-blur-sm">
                    {categoryEmoji(image.category)}
                  </span>
                </div>
                {!image.is_active && (
                  <div className="absolute top-1 right-1">
                    <EyeOff className="w-3 h-3 text-white drop-shadow-md" />
                  </div>
                )}
                {isSelected && (
                  <div className="absolute inset-0 bg-gold/10 flex items-center justify-center">
                    <div className="h-6 w-6 rounded-full bg-gold flex items-center justify-center">
                      <Check className="h-3.5 w-3.5 text-primary-foreground" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Bottom Action Bar */}
      {selectedImage && (
        <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg z-50 animate-in slide-in-from-bottom-4 duration-200">
          <div className="max-w-3xl mx-auto p-3 space-y-3">
            <div className="flex gap-3 items-start">
              <img
                src={selectedImage.image_url}
                alt=""
                className="h-16 w-16 rounded-lg object-cover shrink-0"
              />
              <div className="flex-1 min-w-0 space-y-1.5">
                <Input
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  placeholder="Add caption..."
                  className="h-8 text-sm"
                />
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Badge variant="secondary" className="text-[10px] py-0 px-1.5">
                    {categoryLabel(selectedImage.category)}
                  </Badge>
                  <span>•</span>
                  <span>{selectedImage.is_active ? "Visible" : "Hidden"}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="flex-1 gap-1.5 text-xs"
                onClick={() =>
                  updateTitleMutation.mutate({
                    id: selectedImage.id,
                    title: editingTitle || null,
                  })
                }
                disabled={updateTitleMutation.isPending}
              >
                <Check className="w-3.5 h-3.5" />
                Save
              </Button>

              <Button
                size="sm"
                variant="outline"
                className="gap-1.5 text-xs"
                onClick={() =>
                  toggleActiveMutation.mutate({
                    id: selectedImage.id,
                    is_active: !selectedImage.is_active,
                  })
                }
                disabled={toggleActiveMutation.isPending}
              >
                {selectedImage.is_active ? (
                  <EyeOff className="w-3.5 h-3.5" />
                ) : (
                  <Eye className="w-3.5 h-3.5" />
                )}
                {selectedImage.is_active ? "Hide" : "Show"}
              </Button>

              <Button
                size="icon"
                variant="outline"
                className="h-8 w-8 shrink-0"
                onClick={() => handleMove(selectedImage, "up")}
              >
                <GripVertical className="w-3.5 h-3.5" />
              </Button>

              <Button
                size="icon"
                variant="destructive"
                className="h-8 w-8 shrink-0"
                onClick={() => setDeleteTarget(selectedImage)}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove photo?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The photo will be permanently removed from the gallery.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
