import { motion } from "framer-motion";
import { Clock, Heart, Home, ShieldCheck, Gem } from "lucide-react";
import { HoverSlider, TextStaggerHover } from "@/components/ui/animated-slideshow";
import { RevealCard } from "@/components/ui/reveal-card";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 }
  })
};

const differentials = [
{ icon: Clock, title: "We're Always On Time", desc: "Punctuality is non-negotiable. We respect your schedule and deliver when promised." },
{ icon: Heart, title: "We Go the Extra Mile", desc: "We don't cut corners. Every project gets our full dedication and attention to detail." },
{ icon: Home, title: "We Respect Your Space", desc: "Your home is treated with the same care we'd give our own. Clean jobsite, every time." },
{ icon: ShieldCheck, title: "You Can Trust Us in Your Home", desc: "Our team is professional, vetted, and committed to earning your confidence." },
{ icon: Gem, title: "We Use Premium Materials", desc: "Only the best products make the cut. Quality materials for lasting results." }];


export default function DifferentialsSection() {
  return (
    <section className="section-padding bg-destructive-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-gold-dark leading-tight text-center bg-[#29291e]/0">
            We Don't Just Meet Expectations.{" "}
            <span className="text-gold">We Exceed Them.</span>
          </h2>
        </div>

        <HoverSlider className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {differentials.map((d, i) =>
          <motion.div
            key={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={i}
          >
            <RevealCard
              className="rounded-xl"
              overlay={
                <div className="bg-gradient-to-br from-[#fccf93] to-[#51351e] h-full w-full rounded-xl p-6 text-center flex flex-col items-center justify-center">
                  <div className="mx-auto w-14 h-14 rounded-full bg-white/20 flex items-center justify-center mb-4">
                    <d.icon className="w-7 h-7 text-[#1A1A0F]" />
                  </div>
                  <h3 className="font-display text-base font-bold text-[#1A1A0F] mb-2">
                    {d.title}
                  </h3>
                  <p className="text-sm text-[#1A1A0F]/70 leading-relaxed">
                    {d.desc}
                  </p>
                </div>
              }
            >
              <div className="bg-background rounded-xl p-6 text-center border border-border/30 shadow-lg shadow-black/10">
                <div className="mx-auto w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center mb-4">
                  <d.icon className="w-7 h-7 text-gold" />
                </div>
                <TextStaggerHover
                  text={d.title}
                  index={i}
                  className="font-display text-base font-bold text-foreground mb-2 justify-center"
                />
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {d.desc}
                </p>
              </div>
            </RevealCard>
          </motion.div>
          )}
        </HoverSlider>
      </div>
    </section>);

}
