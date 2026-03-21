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
    <section className="relative h-[100svh] sm:h-[80vh] flex items-end bg-background overflow-hidden">
      {/* Background video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-contain sm:object-cover object-top"
        src="/videos/hero-bg.mp4"
      />
      {/* Gradient: bottom to top — video fades from fully visible at bottom to hidden at top */}
      <div className="absolute inset-0 sm:hidden bg-gradient-to-t from-transparent to-background" />
      {/* Desktop gradient */}
      <div className="absolute inset-0 hidden sm:block bg-gradient-to-b from-background via-transparent via-15% to-background to-90%" />
      {/* Bottom fade for text area */}
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background to-transparent" />

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-32 pt-0 sm:pt-60">
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
