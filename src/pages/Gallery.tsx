import Layout from "@/components/Layout";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ImageIcon, Loader2, X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { blurIn } from "@/lib/animations";

const CATEGORIES = [
  { value: "all", label: "All" },
  { value: "hardwood", label: "Hardwood" },
  { value: "sanding", label: "Refinishing" },
  { value: "vinyl", label: "Vinyl & LVP" },
  { value: "staircase", label: "Staircases" },
  { value: "deck", label: "Decks" },
];

interface GalleryImage {
  id: string;
  category: string;
  title: string | null;
  image_url: string;
  display_order: number;
}

export default function Gallery() {
  const [filter, setFilter] = useState("all");
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

  const filtered = filter === "all" ? images : images.filter((p) => p.category === filter);

  function openLightbox(index: number) {
    setLightbox({ index, images: filtered });
  }

  function navigateLightbox(dir: 1 | -1) {
    if (!lightbox) return;
    const newIndex = (lightbox.index + dir + lightbox.images.length) % lightbox.images.length;
    setLightbox({ ...lightbox, index: newIndex });
  }

  return (
    <Layout>
      <section className="section-padding bg-secondary/50">
        <div className="container mx-auto text-center">
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Our <span className="gold-gradient-text">Gallery</span>
          </h1>
          <p className="text-muted-foreground">See our craftsmanship in action</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container mx-auto">
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {CATEGORIES.map((c) => (
              <button
                key={c.value}
                onClick={() => setFilter(c.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === c.value
                    ? "bg-gold text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-gold" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium">No photos in this category yet</p>
              <p className="text-sm mt-1">Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group elevated-card overflow-hidden cursor-pointer"
                  onClick={() => openLightbox(i)}
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={p.image_url}
                      alt={p.title || "Gallery photo"}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                  {p.title && (
                    <div className="p-4">
                      <h3 className="font-display font-bold text-foreground">{p.title}</h3>
                      <span className="text-xs text-gold capitalize">{p.category}</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

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
    </Layout>
  );
}
