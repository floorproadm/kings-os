import { motion } from "framer-motion";
import { Phone, ClipboardList, MapPin, Hammer, CheckSquare } from "lucide-react";

const steps = [
  { icon: Phone, title: "Contact Us", desc: "Reach out by phone, text, or form." },
  { icon: MapPin, title: "Site Visit & Quote", desc: "We visit your site and provide a detailed estimate." },
  { icon: Hammer, title: "Scheduled Work", desc: "Work begins on the agreed timeline." },
  { icon: CheckSquare, title: "Final Inspection", desc: "Walkthrough to ensure your complete satisfaction." },
];

export default function B2BProcess() {
  return (
    <section className="section-padding bg-background">
      <div className="container mx-auto px-4 text-center">
        <motion.h2 initial={{ opacity: 0, y: 20, filter: "blur(10px)" }} whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }} viewport={{ once: true }} transition={{ duration: 0.7, ease: "easeOut" }} className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-12">
          Our Simple <span className="gold-gradient-text">4-Step Process</span>
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="elevated-card p-6 text-center relative"
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-gold text-primary-foreground text-xs font-bold flex items-center justify-center">
                {i + 1}
              </div>
              <div className="mx-auto w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mb-4 mt-2">
                <s.icon className="w-6 h-6 text-gold" />
              </div>
              <h3 className="font-display font-bold text-foreground mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
