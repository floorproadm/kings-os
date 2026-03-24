import { motion } from "framer-motion";
import { Phone, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

console.log('[Hero] Component loaded');

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

interface HeroMedia {
  device: string;
  media_type: string;
  media_url: string;
}

function useHeroMedia() {
  const [media, setMedia] = useState<Record<string, HeroMedia | null>>({
    desktop: null,
    tablet: null,
    mobile: null,
  });

  useEffect(() => {
    console.log('[Hero] Fetching hero media...');
    supabase
      .from("hero_media")
      .select("device, media_type, media_url")
      .eq("is_active", true)
      .then(({ data }) => {
        const map: Record<string, HeroMedia | null> = { desktop: null, tablet: null, mobile: null };
        (data as any[])?.forEach((item) => {
          map[item.device] = item;
        });
        console.log('[Hero] Media loaded:', map);
        setMedia(map);
      });
  }, []);

  return media;
}

function HeroBackground({ media }: { media: Record<string, HeroMedia | null> }) {
  const fallbackSrc = "/images/hero-bg.jpg";

  // If DB has image overrides, use them; otherwise use static fallback image
  const mobileSrc = media.mobile?.media_url || fallbackSrc;
  const tabletSrc = media.tablet?.media_url || fallbackSrc;
  const desktopSrc = media.desktop?.media_url || fallbackSrc;

  // Check if DB media is video type
  const mobileIsVideo = media.mobile?.media_type === "video";
  const tabletIsVideo = media.tablet?.media_type === "video";
  const desktopIsVideo = media.desktop?.media_type === "video";

  return (
    <>
      {/* Mobile */}
      {mobileIsVideo ? (
        <video autoPlay loop muted playsInline
          className="absolute inset-0 w-full h-full object-cover md:hidden"
          src={mobileSrc} />
      ) : (
        <img src={mobileSrc} alt="Hardwood flooring"
          className="absolute inset-0 w-full h-full object-cover md:hidden"
          width={1920} height={1280} />
      )}

      {/* Tablet */}
      {tabletIsVideo ? (
        <video autoPlay loop muted playsInline
          className="absolute inset-0 w-full h-full object-cover hidden md:block lg:hidden"
          src={tabletSrc} />
      ) : (
        <img src={tabletSrc} alt="Hardwood flooring"
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover hidden md:block lg:hidden"
          width={1920} height={1280} />
      )}

      {/* Desktop */}
      {desktopIsVideo ? (
        <video autoPlay loop muted playsInline
          className="absolute inset-0 w-full h-full object-cover hidden lg:block"
          src={desktopSrc} />
      ) : (
        <img src={desktopSrc} alt="Hardwood flooring"
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover hidden lg:block"
          width={1920} height={1280} />
      )}
    </>
  );
}

export default function HeroSection() {
  const media = useHeroMedia();

  return (
    <section className="relative h-svh md:h-[90vh] lg:h-[80vh] flex items-end md:items-center bg-background overflow-hidden">
      <HeroBackground media={media} />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/55" />
      {/* Bottom gradient for smooth transition */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

      <div className="relative z-10 container mx-auto px-6 md:px-8 lg:px-8 pb-20 md:pb-0">
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
            Installation · Refinishing · Stairs · Decks — Johnson County, KS
          </motion.p>

          <motion.div variants={fadeUp} custom={3} className="mt-6 sm:mt-8 flex justify-center">
            <Button variant="gold" size="lg" asChild className="w-full max-w-sm sm:w-auto hover:opacity-90 transition-all duration-200">
              <a href="tel:+19139153193">
                <Phone className="w-4 h-4 mr-2" />
                Get Free Estimate
              </a>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
