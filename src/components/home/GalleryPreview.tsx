import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ImageIcon, Loader2, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

const CATEGORIES = [
  { value: "sanding", label: "Sanding & Refinishing" },
  { value: "vinyl", label: "Vinyl & LVP" },
  { value: "staircase", label: "Staircases" },
  { value: "deck", label: "Decks & Handrails" },
];

interface GalleryImage {
  id: string;
  category: string;
  title: string | null;
  image_url: string;
  display_order: number;
}

export default function GalleryPreview() {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState<{ index: number; images: GalleryImage[] } | null>(null);

  const { data: images = [], isLoading } = useQuery({
    queryKey: ["gallery-images-public"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gallery_images")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data as GalleryImage[];
    },
  });

  const filtered = images.filter((img) => img.category === CATEGORIES[active].value);

  function openLightbox(index: number) {
    setLightbox({ index, images: filtered });
  }

  function navigateLightbox(dir: 1 | -1) {
    if (!lightbox) return;
    const newIndex = (lightbox.index + dir + lightbox.images.length) % lightbox.images.length;
    setLightbox({ ...lightbox, index: newIndex });
  }

  return (
    <section id="gallery" className="section-padding bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-gold text-sm tracking-[0.2em] uppercase font-semibold mb-4">
            Portfolio
          </p>
          <motion.h2 initial={{ opacity: 0, y: 20, filter: "blur(10px)" }} whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }} viewport={{ once: true }} transition={{ duration: 0.7, ease: "easeOut" }} className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
            See Our Work{" "}
            <span className="gold-gradient-text">in Action</span>
          </motion.h2>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {CATEGORIES.map((t, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
                active === i
                  ? "bg-gold text-primary-foreground"
                  : "bg-card text-muted-foreground hover:text-foreground border border-border/30"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <motion.div
          key={active}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {isLoading ? (
            <div className="col-span-full flex justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-gold" />
            </div>
          ) : filtered.length === 0 ? (
            [...Array(4)].map((_, i) => (
              <div
                key={i}
                className="aspect-[4/3] rounded-xl border-2 border-dashed border-gold/20 flex flex-col items-center justify-center gap-2 bg-card/50"
              >
                <ImageIcon className="w-8 h-8 text-gold/30" />
                <span className="text-xs text-muted-foreground">Photo coming soon</span>
              </div>
            ))
          ) : (
            filtered.slice(0, 8).map((img, i) => (
              <div
                key={img.id}
                className="group relative aspect-[4/3] rounded-xl overflow-hidden elevated-card cursor-pointer"
                onClick={() => openLightbox(i)}
              >
                <img
                  src={img.image_url}
                  alt={img.title || ""}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                {img.title && (
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                    <p className="text-white text-sm font-medium truncate">{img.title}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </motion.div>

        {images.length > 0 && (
          <div className="text-center mt-10">
            <Button variant="gold" size="lg" className="px-14 py-[calc(0.75rem+9px)] text-base" asChild>
              <Link to="/gallery">View Full Gallery</Link>
            </Button>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button
              className="absolute top-4 right-4 text-white/80 hover:text-white z-10"
              onClick={() => setLightbox(null)}
            >
              <X className="w-8 h-8" />
            </button>
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white z-10"
              onClick={(e) => { e.stopPropagation(); navigateLightbox(-1); }}
            >
              <ChevronLeft className="w-10 h-10" />
            </button>
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white z-10"
              onClick={(e) => { e.stopPropagation(); navigateLightbox(1); }}
            >
              <ChevronRight className="w-10 h-10" />
            </button>
            <motion.img
              key={lightbox.index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              src={lightbox.images[lightbox.index].image_url}
              alt={lightbox.images[lightbox.index].title || ""}
              className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            {lightbox.images[lightbox.index].title && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white text-center">
                <p className="font-display font-bold text-lg">{lightbox.images[lightbox.index].title}</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
