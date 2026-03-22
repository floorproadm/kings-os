import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { blurIn } from "@/lib/animations";
import { CheckCircle, Crown, Shield, Trophy } from "lucide-react";
import { FeatureSteps } from "@/components/ui/feature-steps";
import serviceHardwood from "@/assets/service-hardwood.jpg";
import { useSiteConfig } from "@/contexts/SiteConfigContext";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const iconMap: Record<number, React.ReactNode> = {
  0: <Trophy className="w-6 h-6 text-gold" />,
  1: <Shield className="w-6 h-6 text-gold" />,
  2: <Crown className="w-6 h-6 text-gold" />,
};

export default function HardwoodService() {
  const { config } = useSiteConfig();
  const p = config.hardwoodPage;

  return (
    <Layout>
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src={serviceHardwood} alt="Hardwood Flooring" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/50" />
        </div>
        <div className="relative container mx-auto px-4">
          <div className="max-w-2xl">
            <p className="text-gold font-semibold text-sm uppercase tracking-wider mb-3">{p.heroLabel}</p>
            <motion.h1 variants={blurIn} initial="hidden" animate="visible" className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4">
              {p.heroTitle} <span className="gold-gradient-text">{p.heroHighlight}</span>
            </motion.h1>
            <p className="text-muted-foreground mb-8">{p.heroDescription}</p>
            <Button variant="gold" size="xl" asChild>
              <Link to="/contact">{p.heroCta}</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container mx-auto">
          <h2 className="font-display text-3xl font-bold text-foreground text-center mb-4">{p.sectionTitle} <span className="gold-gradient-text">{p.sectionHighlight}</span></h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">{p.sectionSubtitle}</p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-3">
              {p.benefits.map((b, i) => (
                <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-gold flex-shrink-0" />
                  <span className="text-foreground font-medium">{b}</span>
                </motion.div>
              ))}
            </div>
            <FeatureSteps
              features={p.features.map((f, i) => ({
                step: `Step ${i + 1}`,
                title: f.title,
                content: f.desc,
              }))}
              autoPlayInterval={4000}
            />
          </div>
        </div>
      </section>

      <section className="section-padding bg-secondary/50">
        <div className="container mx-auto max-w-4xl">
          <h2 className="font-display text-3xl font-bold text-foreground text-center mb-12">Our Installation <span className="gold-gradient-text">Process</span></h2>
          <div className="space-y-4">
            {p.steps.map((s, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                className="relative rounded-2xl border border-gold/20 bg-background p-5 flex gap-4 items-center overflow-hidden shadow-[0_0_15px_rgba(201,168,76,0.08)]"
              >
                <div className="w-10 h-10 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-5 h-5 text-gold" />
                </div>
                <div className="flex-1">
                  <h3 className="font-display font-bold text-foreground text-sm mb-1">{s.title}</h3>
                  <p className="text-xs text-foreground/60">{s.desc}</p>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-gold-light via-gold to-gold-dark" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-gradient-to-r from-gold-light/80 via-gold/70 to-gold-dark/80">
        <div className="container mx-auto text-center">
          <h2 className="font-display text-3xl font-bold text-primary-foreground mb-4">{p.ctaTitle}</h2>
          <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">{p.ctaSubtitle}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="default" size="xl" className="bg-background text-foreground hover:bg-background/90" asChild>
              <Link to="/contact">{p.ctaCta1}</Link>
            </Button>
            <Button variant="outline" size="xl" className="bg-transparent border-2 border-black text-black hover:bg-background hover:border-gold/25 hover:text-gold gold-gradient-text transition-colors" asChild>
              <a href="tel:9139153193">{p.ctaCta2}</a>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
