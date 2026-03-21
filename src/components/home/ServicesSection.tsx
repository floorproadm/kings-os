import { motion } from "framer-motion";
import {
  TreePine, Paintbrush, ArrowUpDown, Trash2, Layers, Fence, Sparkles,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 },
  }),
};

const services = [
  { icon: TreePine, title: "Hardwood Floor Installation", desc: "Premium solid and engineered hardwood installed with precision." },
  { icon: Paintbrush, title: "Sanding, Staining & Refinishing", desc: "Restore your floors to their original beauty with expert refinishing." },
  { icon: ArrowUpDown, title: "Staircase Design & Finishing", desc: "Custom hardwood staircases that elevate your home's elegance." },
  { icon: Trash2, title: "Demolition & Replacement", desc: "Full removal of old flooring and preparation for new installation." },
  { icon: Layers, title: "Vinyl & Engineered Wood Installation", desc: "Durable, waterproof options with the look of natural wood." },
  { icon: Fence, title: "Deck & Handrail Refinishing", desc: "Extend your craftsmanship outdoors with deck and rail restoration." },
  { icon: Sparkles, title: "Wash & Polish", desc: "Professional deep clean and polish to maintain your floor's shine." },
];

export default function ServicesSection() {
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
          {services.map((s, i) => (
            <motion.div
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i}
              className="elevated-card p-6 group hover:border-gold/40 transition-colors duration-300 cursor-default"
            >
              <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center text-gold mb-4 group-hover:bg-gold/20 transition-colors">
                <s.icon className="w-6 h-6" />
              </div>
              <h3 className="font-display text-lg font-bold text-foreground mb-2">
                {s.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {s.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
