import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap, Home, DollarSign, Clock, CheckCircle } from "lucide-react";
import { FeatureSteps } from "@/components/ui/feature-steps";
import serviceSanding from "@/assets/service-sanding.jpg";
import { useSiteConfig } from "@/contexts/SiteConfigContext";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const iconMap: Record<number, React.ReactNode> = {
  0: <Zap className="w-6 h-6 text-gold" />,
  1: <Home className="w-6 h-6 text-gold" />,
  2: <DollarSign className="w-6 h-6 text-gold" />,
  3: <Clock className="w-6 h-6 text-gold" />,
};

export default function SandingService() {
  const { config } = useSiteConfig();
  const p = config.sandingPage;

  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src={serviceSanding} alt="Sanding & Refinishing" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/50" />
        </div>
        <div className="relative container mx-auto px-4">
          <div className="max-w-2xl">
            <p className="text-gold font-semibold text-sm uppercase tracking-wider mb-3">{p.heroLabel}</p>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4">
              {p.heroTitle} <span className="gold-gradient-text">{p.heroHighlight}</span>
            </h1>
            <p className="text-muted-foreground mb-8">{p.heroDescription}</p>
            <Button variant="gold" size="xl" asChild>
              <Link to="/contact">{p.heroCta}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section-padding">
        <div className="container mx-auto">
          <h2 className="font-display text-3xl font-bold text-foreground text-center mb-4">{p.sectionTitle} <span className="gold-gradient-text">{p.sectionHighlight}</span></h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">{p.sectionSubtitle}</p>
          <FeatureSteps
            features={p.benefits.map((b, i) => ({
              step: `Step ${i + 1}`,
              title: b.title,
              content: b.desc,
            }))}
            autoPlayInterval={4000}
            className="max-w-2xl mx-auto"
          />
        </div>
      </section>

      {/* Process */}
      <section className="section-padding bg-secondary/50">
        <div className="container mx-auto max-w-4xl">
          <h2 className="font-display text-3xl font-bold text-foreground text-center mb-4">Our Refinishing <span className="gold-gradient-text">Process</span></h2>
          <p className="text-center text-muted-foreground mb-12">Professional refinishing that restores natural beauty and protects for years.</p>
          <div className="space-y-4">
            {p.steps.map((s, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                className="relative rounded-2xl border border-gold/20 bg-[#1A1A0F] p-5 flex gap-4 items-center overflow-hidden shadow-[0_0_15px_rgba(201,168,76,0.08)]"
              >
                <div className="w-10 h-10 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-5 h-5 text-gold" />
                </div>
                <div className="flex-1">
                  <h3 className="font-display font-bold text-[#F5F0E8] text-sm mb-1">{s.title}</h3>
                  <p className="text-xs text-[#F5F0E8]/60">{s.desc}</p>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#fccf93] via-gold to-[#51351e]" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Finishes */}
      <section className="section-padding">
        <div className="container mx-auto max-w-4xl">
          <h2 className="font-display text-3xl font-bold text-foreground text-center mb-4">Finish <span className="gold-gradient-text">Options</span></h2>
          <p className="text-center text-muted-foreground mb-12">Choose the perfect finish for your lifestyle and aesthetic preferences.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {p.finishes.map((f, i) => (
              <div key={i} className="elevated-card p-6 text-center">
                <h3 className="font-display font-bold text-foreground mb-2">{f.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{f.desc}</p>
                <span className="inline-block px-3 py-1 rounded-full bg-gold/10 text-gold text-xs font-semibold">{f.best}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-gradient-to-r from-[#fccf93]/80 via-gold/70 to-[#51351e]/80">
        <div className="container mx-auto text-center">
          <h2 className="font-display text-3xl font-bold text-primary-foreground mb-4">{p.ctaTitle}</h2>
          <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">{p.ctaSubtitle}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="default" size="xl" className="bg-background text-foreground hover:bg-background/90" asChild>
              <Link to="/contact">{p.ctaCta1}</Link>
            </Button>
            <Button variant="outline" size="xl" className="bg-[#1A1A0F] border-0 text-[#F5F0E8] hover:bg-[#2a2a1a]" asChild>
              <Link to="/gallery">{p.ctaCta2}</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
