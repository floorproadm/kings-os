import { useState } from "react";
import { motion } from "framer-motion";
import { ImageIcon } from "lucide-react";

const tabs = [
  "Decks & Handrails",
  "Installation",
  "Sanding & Refinishing",
  "Staircases",
];

export default function GalleryPreview() {
  const [active, setActive] = useState(0);

  return (
    <section id="gallery" className="section-padding bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-gold text-sm tracking-[0.2em] uppercase font-semibold mb-4">
            Portfolio
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
            See Our Work{" "}
            <span className="gold-gradient-text">in Action</span>
          </h2>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {tabs.map((t, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
                active === i
                  ? "bg-gold text-primary-foreground"
                  : "bg-card text-muted-foreground hover:text-foreground border border-border/30"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Placeholder grid */}
        <motion.div
          key={active}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="aspect-[4/3] rounded-xl border-2 border-dashed border-gold/20 flex flex-col items-center justify-center gap-2 bg-card/50"
            >
              <ImageIcon className="w-8 h-8 text-gold/30" />
              <span className="text-xs text-muted-foreground">Photo coming soon</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
