import { motion } from "framer-motion";
import { Phone, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6 }
  })
};

export default function HeroSection() {
  return (
    <section className="relative h-[100svh] md:h-[80vh] flex items-end bg-black overflow-hidden">
      {/* Background video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-contain object-top md:[object-position:center_top] lg:[object-position:100%_top]"
        src="/videos/hero-bg.mp4" />
      
      {/* Gradient overlays: smooth fade on all edges */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent via-15% to-black to-90%" />
      <div className="absolute inset-0 md:hidden bg-gradient-to-r from-black/60 via-transparent to-black/60" />

      <div className="relative container mx-auto px-4 md:px-6 lg:px-8 pb-12 md:pb-32 pt-0 md:pt-60">
        <motion.div className="max-w-3xl" initial="hidden" animate="visible">
          <motion.p
            variants={fadeUp}
            custom={0}
            className="text-gold font-semibold text-sm tracking-[0.2em] uppercase mb-6 text-center">
            
            T. Reis — Hardwood Specialist in Johnson County
          </motion.p>

          <motion.h1
            variants={fadeUp}
            custom={1}
            className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.1] mb-6 text-center xl:text-7xl mx-[40px]">
            
            Elevate Your Home with Expert{" "}
            <span className="gold-gradient-text">Hardwood Flooring</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            custom={2}
            className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl text-center">
            
                                 Installation · Refinishing · Stairs · Decks Johnson County, KS
          </motion.p>

          <motion.div variants={fadeUp} custom={3} className="gap-4 text-center items-center justify-center md:flex-row flex flex-col">
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
        transition={{ duration: 2, repeat: Infinity }}>
        
        <ArrowDown className="w-5 text-gold/40 my-0 py-0 h-[20px]" />
      </motion.div>
    </section>);

}