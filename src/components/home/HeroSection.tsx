import { motion } from "framer-motion";
import { Phone, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6 }
  })
};

const blurInHero = {
  hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { delay: i * 0.15, duration: 0.7, ease: "easeOut" as const }
  })
};

export default function HeroSection() {
  return (
    <section className="relative h-svh md:h-[90vh] lg:h-[80vh] flex items-end md:items-center bg-background overflow-hidden">
      {/* Static background image */}
      <img
        src={heroBg}
        alt="Hardwood flooring and staircase craftsmanship"
        className="absolute inset-0 w-full h-full object-cover"
        width={1920}
        height={1280}
      />

      {/* 60% dark overlay for readability */}
      <div className="absolute inset-0 bg-black/60" />
      {/* Bottom gradient for smooth transition */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

      <div className="relative z-10 container mx-auto px-6 md:px-8 lg:px-8 pb-32 md:pb-0">
        <motion.div className="max-w-3xl mx-auto text-center" initial="hidden" animate="visible">
          <motion.p
            variants={fadeUp}
            custom={0}
            className="text-gold font-semibold text-xs sm:text-sm lg:text-base tracking-[0.2em] uppercase mb-4 md:mb-6">
            T. Reis — Hardwood Specialist in Johnson County
          </motion.p>

          <motion.h1
            variants={blurInHero}
            custom={1}
            className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.1] mb-4 md:mb-6">
            Elevate Your Home with Expert{" "}
            <span className="gold-gradient-text">Hardwood Flooring</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            custom={2}
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground mb-6 md:mb-10 max-w-2xl mx-auto">
            Installation · Refinishing · Stairs · Decks
          </motion.p>

          <motion.div variants={fadeUp} custom={3} className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center">
            <Button variant="gold" size="xl" asChild className="w-full sm:w-auto">
              <a href="tel:+19139153193">
                <Phone className="w-4 h-4 mr-2" />
                Get Free Estimate
              </a>
            </Button>
            <Button variant="goldOutline" size="xl" asChild className="w-full sm:w-auto">
              <a href="#gallery">
                See Our Work
                <ArrowDown className="w-4 h-4 ml-2" />
              </a>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
