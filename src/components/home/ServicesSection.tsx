import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  TreePine, Paintbrush, ArrowUpDown, Trash2, Layers, Fence, Sparkles,
  Hammer, Wrench, Home, Shield, Star, Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  TreePine, Paintbrush, ArrowUpDown, Trash2, Layers, Fence, Sparkles,
  Hammer, Wrench, Home, Shield, Star, Zap,
};

const serviceBgMap: Record<string, string> = {
  "Hardwood Floor Installation": "/images/services/hardwood-installation.jpg",
  "Sanding, Staining & Refinishing": "/images/services/sanding-refinishing.jpg",
  "Staircase Design & Finishing": "/images/services/staircase.jpg",
  "Demolition & Replacement": "/images/services/demolition.jpg",
  "Vinyl & Engineered Wood Installation": "/images/services/vinyl.jpg",
  "Deck & Handrail Refinishing": "/images/services/deck.jpg",
  "Wash & Polish": "/images/services/wash-polish.jpg",
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 },
  }),
};

interface ServiceRow {
  id: string;
  title: string;
  description: string;
  icon_name: string;
  image_url: string | null;
  display_order: number;
}

export default function ServicesSection() {
  const { data: services } = useQuery({
    queryKey: ["public-services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("id, title, description, icon_name, image_url, display_order")
        .eq("is_active", true)
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data as ServiceRow[];
    },
  });

  const items = services ?? [];

  return (
    <section id="services" className="section-padding bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-gold text-sm tracking-[0.2em] uppercase font-semibold mb-4">
            Our Services
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
            Your Vision, Our{" "}
            <span className="gold-gradient-text">Craftsmanship</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {items.map((s, i) => {
            const Icon = iconMap[s.icon_name] ?? Sparkles;
            return (
              <motion.div
                key={s.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="elevated-card group hover:border-gold/40 transition-colors duration-300 cursor-default overflow-hidden"
              >
                {/* Service image */}
                {s.image_url && (
                  <div className="w-full h-40 overflow-hidden">
                    <img
                      src={s.image_url}
                      alt={s.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                )}

                <div className="p-6">
                  {/* Icon fallback when no image */}
                  {!s.image_url && (
                    <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center text-gold mb-4 group-hover:bg-gold/20 transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                  )}
                  <h3 className="font-display text-lg font-bold text-foreground mb-2">
                    {s.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {s.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
