import { motion } from "framer-motion";
import { Handshake } from "lucide-react";

export default function B2BHero() {
  return (
    <section className="section-padding bg-background text-center relative overflow-hidden">
      {/* Subtle radial glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gold/5 rounded-full blur-[100px]" />
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mx-auto w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center mb-6"
        >
          <Handshake className="w-7 h-7 text-gold" />
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-gold text-sm tracking-[0.2em] uppercase font-semibold mb-4"
        >
          Trade Partnerships
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 0.15, duration: 0.7, ease: "easeOut" }}
          className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4"
        >
          Partner With Johnson County's Premier{" "}
          <span className="gold-gradient-text">Hardwood Specialist</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-muted-foreground max-w-2xl mx-auto text-lg mb-2"
        >
          Serving Builders, Realtors & Property Managers since 2001
        </motion.p>
      </div>
    </section>
  );
}
