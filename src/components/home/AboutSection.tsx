import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import founderImg from "@/assets/founder-thiago.png";
import { MovingBorderContainer } from "@/components/ui/moving-border";

const areas = [
"Shawnee", "Overland Park", "Olathe", "Leawood", "Lenexa", "Prairie Village"];


export default function AboutSection() {
  return (
    <section id="aboutus" className="section-padding bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left">
            
            <p className="text-gold text-sm tracking-[0.2em] uppercase font-semibold mb-4">
              About Us
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-6">
              Craftsmanship That Speaks{" "}
              <span className="gold-gradient-text">for Itself</span>
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed font-body">
              <p>
                Hardwood Kings is a family-owned business with more than 24 years
                of experience in hardwood flooring installation, refinishing, and
                staircase design. We bring old-world craftsmanship to modern homes
                across Johnson County.
              </p>
              <p>
                Every project is personally overseen by our founder, ensuring the
                same standard of excellence that built our reputation.
              </p>
            </div>

            {/* Founder photo — mobile/tablet only */}
            <div className="relative w-72 sm:w-96 lg:hidden mt-8 mx-auto">
              <img
                src={founderImg}
                alt="Thiago Reis — Founder of Hardwood Kings"
                className="w-full rounded-2xl object-cover"
              />
              <div className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{
                  background: `
                    linear-gradient(to top, hsl(var(--background)) 0%, transparent 35%),
                    linear-gradient(to bottom, hsl(var(--background)) 0%, transparent 35%),
                    linear-gradient(to left, hsl(var(--background)) 0%, transparent 30%),
                    linear-gradient(to right, hsl(var(--background)) 0%, transparent 30%)
                  `
                }}
              />
            </div>

            <div className="flex justify-center lg:justify-start">
              <MovingBorderContainer
                duration={3000}
                borderRadius="0.75rem"
                containerClassName="mt-4 lg:mt-8"
                className="p-4"
              >
                <div>
                  <p className="font-display font-bold text-foreground text-lg">
                    T. Reis
                  </p>
                  <p className="text-gold text-sm">Founder & Operator — Thiago Reis</p>
                </div>
              </MovingBorderContainer>
            </div>

            <div className="mt-8">
              <p className="text-sm text-muted-foreground mb-3 flex items-center justify-center lg:justify-start gap-2">
                <MapPin className="w-4 h-4 text-gold" />
                Proudly serving Johnson County, KS
              </p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-2">
                {areas.map((a) =>
                <span
                  key={a}
                  className="px-3 py-1 rounded-full bg-gold/10 text-gold text-xs font-semibold">
                  
                    {a}
                  </span>
                )}
              </div>
            </div>
          </motion.div>

          {/* Founder photo — desktop only */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="hidden lg:flex relative justify-end -mr-8">
            <div className="relative w-[120%]">
              <img
                src={founderImg}
                alt="Thiago Reis — Founder of Hardwood Kings"
                className="w-full rounded-2xl object-cover"
              />
              <div className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{
                  background: `
                    linear-gradient(to top, hsl(var(--background)) 0%, transparent 25%),
                    linear-gradient(to bottom, hsl(var(--background)) 0%, transparent 25%),
                    linear-gradient(to left, hsl(var(--background)) 0%, transparent 20%),
                    linear-gradient(to right, hsl(var(--background)) 0%, transparent 20%)
                  `
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>);

}