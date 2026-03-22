import { motion } from "framer-motion";

export default function B2BHero() {
  return (
    <section className="section-padding bg-background text-center">
      <div className="container mx-auto px-4">
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
          className="text-muted-foreground max-w-2xl mx-auto text-lg"
        >
          Serving Builders, Realtors & Property Managers since 2001
        </motion.p>
      </div>
    </section>
  );
}
