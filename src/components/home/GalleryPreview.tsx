import { useState } from "react";
import { motion } from "framer-motion";
import { ImageIcon, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

const CATEGORIES = [
  { value: "hardwood", label: "Hardwood" },
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
            filtered.slice(0, 8).map((img) => (
              <div
                key={img.id}
                className="group relative aspect-[4/3] rounded-xl overflow-hidden elevated-card"
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

        {/* View All Link */}
        {images.length > 0 && (
          <div className="text-center mt-8">
            <Link
              to="/gallery"
              className="inline-flex items-center gap-2 text-gold font-semibold hover:underline"
            >
              View Full Gallery →
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
