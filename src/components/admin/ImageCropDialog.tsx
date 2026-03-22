import { useState, useRef, useCallback } from "react";
import ReactCrop, { type Crop, type PixelCrop, centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Crop as CropIcon, ImageIcon } from "lucide-react";

interface ImageCropDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageSrc: string;
  aspectRatio?: number;
  onCropComplete: (croppedBlob: Blob) => void;
  onSkipCrop?: () => void;
}

function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number): Crop {
  return centerCrop(
    makeAspectCrop(
      { unit: "%", width: 90 },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  );
}

export default function ImageCropDialog({
  open,
  onOpenChange,
  imageSrc,
  aspectRatio,
  onCropComplete,
  onSkipCrop,
}: ImageCropDialogProps) {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [saving, setSaving] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const onImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const { naturalWidth: width, naturalHeight: height } = e.currentTarget;
      const ar = aspectRatio || 16 / 9;
      const newCrop = centerAspectCrop(width, height, ar);
      setCrop(newCrop);
      // Auto-set completedCrop so the button is enabled immediately
      const pixelCrop: PixelCrop = {
        unit: "px",
        x: (newCrop.x! / 100) * width,
        y: (newCrop.y! / 100) * height,
        width: (newCrop.width! / 100) * width,
        height: (newCrop.height! / 100) * height,
      };
      setCompletedCrop(pixelCrop);
    },
    [aspectRatio],
  );

  const handleConfirm = async () => {
    if (!completedCrop || !imgRef.current) return;
    setSaving(true);

    const image = imgRef.current;
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = completedCrop.width * scaleX;
    canvas.height = completedCrop.height * scaleY;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setSaving(false);
      return;
    }

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height,
    );

    canvas.toBlob(
      (blob) => {
        setSaving(false);
        if (blob) {
          onCropComplete(blob);
          onOpenChange(false);
        }
      },
      "image/webp",
      0.92,
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <CropIcon className="w-4 h-4 text-gold" />
            Recortar Imagem
          </DialogTitle>
        </DialogHeader>

        <div className="flex items-center justify-center max-h-[60vh] overflow-auto bg-black/30 rounded-md p-2">
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={aspectRatio}
          >
            <img
              ref={imgRef}
              src={imageSrc}
              alt="Crop preview"
              onLoad={onImageLoad}
              className="max-h-[55vh] w-auto"
              crossOrigin="anonymous"
            />
          </ReactCrop>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          {onSkipCrop && (
            <Button variant="ghost" onClick={onSkipCrop} className="mr-auto">
              <ImageIcon className="w-4 h-4 mr-1" />
              Enviar sem recortar
            </Button>
          )}
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button variant="gold" onClick={handleConfirm} disabled={saving || !completedCrop}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <CropIcon className="w-4 h-4 mr-1" />}
            Aplicar Recorte
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
