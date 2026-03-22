import { motion } from "framer-motion";
import { Phone, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

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
    supabase
      .from("hero_media")
      .select("device, media_type, media_url")
      .eq("is_active", true)
      .then(({ data }) => {
        const map: Record<string, HeroMedia | null> = { desktop: null, tablet: null, mobile: null };
        (data as any[])?.forEach((item) => {
          map[item.device] = item;
        });
        setMedia(map);
      });
  }, []);

  return media;
}

function HeroBackground({ media }: { media: Record<string, HeroMedia | null> }) {
  const fallbackSrc = "/videos/hero-bg.mp4";

  // Render all three sources, show/hide via CSS breakpoints
  return (
    <>
      {/* Mobile: visible < md */}
      {media.mobile ? (
        media.mobile.media_type === "video" ? (
          <video autoPlay loop muted playsInline
            className="absolute inset-0 w-full h-full object-cover md:hidden"
            src={media.mobile.media_url} />
        ) : (
          <img src={media.mobile.media_url} alt="Hero"
            className="absolute inset-0 w-full h-full object-cover md:hidden" />
        )
      ) : (
        <video autoPlay loop muted playsInline
          className="absolute inset-0 w-full h-full object-contain object-[center_30%] md:hidden"
          src={fallbackSrc} />
      )}

      {/* Tablet: visible md to lg */}
      {media.tablet ? (
        media.tablet.media_type === "video" ? (
          <video autoPlay loop muted playsInline
            className="absolute inset-0 w-full h-full object-cover object-[center_40%] hidden md:block lg:hidden"
            src={media.tablet.media_url} />
        ) : (
          <img src={media.tablet.media_url} alt="Hero"
            className="absolute inset-0 w-full h-full object-cover object-[center_40%] hidden md:block lg:hidden" />
        )
      ) : (
        <video autoPlay loop muted playsInline
          className="absolute inset-0 w-full h-full object-contain object-[center_80%] hidden md:block lg:hidden"
          src={fallbackSrc} />
      )}

      {/* Desktop: visible lg+ */}
      {media.desktop ? (
        media.desktop.media_type === "video" ? (
          <video autoPlay loop muted playsInline
            className="absolute inset-0 w-full h-full object-cover hidden lg:block"
            src={media.desktop.media_url} />
        ) : (
          <img src={media.desktop.media_url} alt="Hero"
            className="absolute inset-0 w-full h-full object-cover hidden lg:block" />
        )
      ) : (
        <video autoPlay loop muted playsInline
          className="absolute inset-0 w-full h-full object-contain object-[100%_80%] hidden lg:block"
          src={fallbackSrc} />
      )}
    </>
  );
}

export default function HeroSection() {
  const media = useHeroMedia();

  return (
    <section className="relative h-[115svh] md:h-[110vh] lg:h-[80vh] flex items-end bg-black overflow-hidden">
      <HeroBackground media={media} />
      
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent via-15% to-black to-90%" />
      <div className="absolute inset-0 md:hidden bg-gradient-to-r from-black/60 via-transparent to-black/60" />

      <div className="relative container mx-auto px-4 md:px-6 lg:px-8 pb-6 md:pb-16 lg:pb-32 pt-0 md:pt-0 lg:pt-60 md:mt-auto">
        <motion.div className="max-w-3xl" initial="hidden" animate="visible">
          <motion.p
            variants={fadeUp}
            custom={0}
            className="text-gold font-semibold text-sm lg:text-base tracking-[0.2em] uppercase mb-6 text-center">
            T. Reis — Hardwood Specialist in Johnson County
          </motion.p>

          <motion.h1
            variants={blurInHero}
            custom={1}
            className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.1] mb-6 text-center mx-0 px-0">
            Elevate Your Home with Expert{" "}
            <span className="gold-gradient-text">Hardwood Flooring</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            custom={2}
            className="text-lg md:text-xl lg:text-2xl text-muted-foreground mb-10 max-w-2xl text-center lg:mx-auto">
            Installation · Refinishing · Stairs · Decks Johnson County, KS
          </motion.p>

          <motion.div variants={fadeUp} custom={3} className="gap-4 text-center items-center justify-center flex flex-col lg:flex-row">
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

    </section>
  );
}
