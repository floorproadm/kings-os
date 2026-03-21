import { motion } from "framer-motion";
import { Phone, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6 },
  }),
};

export default function HeroSection() {
  return (
    <section className="relative min-h-[75vh] sm:min-h-screen flex items-center bg-background overflow-hidden">
      {/* Subtle wood-grain texture overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `repeating-linear-gradient(90deg, hsl(var(--gold)) 0px, transparent 1px, transparent 40px),
          repeating-linear-gradient(0deg, hsl(var(--gold)) 0px, transparent 1px, transparent 80px)`,
      }} />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div className="max-w-3xl" initial="hidden" animate="visible">
          <motion.p
            variants={fadeUp}
            custom={0}
            className="text-gold font-semibold text-sm tracking-[0.2em] uppercase mb-6"
          >
            T. Reis — Hardwood Specialist in Johnson County
          </motion.p>

          <motion.h1
            variants={fadeUp}
            custom={1}
            className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-[1.1] mb-6"
          >
            Elevate Your Home with Expert{" "}
            <span className="gold-gradient-text">Hardwood Flooring</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            custom={2}
            className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl"
          >
            Installation · Refinishing · Stairs · Decks — Johnson County, KS
          </motion.p>

          <motion.div variants={fadeUp} custom={3} className="flex flex-col sm:flex-row gap-4">
            <Button variant="gold" size="xl" asChild>
              <a href="tel:+19139153193">
                <Phone className="w-4 h-4 mr-2" />
                Get Free Estimate
              </a>
            </Button>
            <Button variant="goldOutline" size="xl" asChild>
              <a href="#gallery">
                See Our Work
                <ArrowDown className="w-4 h-4 ml-2" />
              </a>
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ArrowDown className="w-5 h-5 text-gold/40" />
      </motion.div>
    </section>
  );
}
