import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { blurIn } from "@/lib/animations";
import { CheckCircle, Shield, TrendingUp, Sparkles } from "lucide-react";
import { FeatureSteps } from "@/components/ui/feature-steps";
import serviceStaircase from "@/assets/service-staircase.jpg";
import { useSiteConfig } from "@/contexts/SiteConfigContext";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

export default function StaircaseService() {
  const { config } = useSiteConfig();
  const p = config.staircasePage;

  return (
    <Layout>
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src={serviceStaircase} alt="Staircase" className="w-full h-full object-cover" />
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

      {/* Services */}
      <section className="section-padding">
        <div className="container mx-auto max-w-4xl">
          <h2 className="font-display text-3xl font-bold text-foreground text-center mb-12">{p.sectionTitle} <span className="gold-gradient-text">{p.sectionHighlight}</span></h2>
          <FeatureSteps
            features={p.services.map((s, i) => ({
              step: `Step ${i + 1}`,
              title: s.title,
              content: s.desc,
            }))}
            autoPlayInterval={4000}
            className="max-w-2xl mx-auto"
          />
        </div>
      </section>

      {/* Benefits */}
      <section className="section-padding bg-secondary/50">
        <div className="container mx-auto">
          <h2 className="font-display text-3xl font-bold text-foreground text-center mb-12">Why Choose Our <span className="gold-gradient-text">Staircase Services?</span></h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-3">
              {p.benefits.map((b, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-gold flex-shrink-0" />
                  <span className="text-foreground font-medium">{b}</span>
                </div>
              ))}
            </div>
            <div className="grid gap-4">
              <div className="bg-background border border-gold/15 rounded-xl p-5 flex gap-4 items-start">
                <TrendingUp className="w-6 h-6 text-gold flex-shrink-0" />
                <div>
                  <h3 className="font-display font-bold text-foreground mb-1">Increase Home Value</h3>
                  <p className="text-sm text-muted-foreground">Custom staircases can add 10-15% to your home's value</p>
                </div>
              </div>
              <div className="bg-background border border-gold/15 rounded-xl p-5 flex gap-4 items-start">
                <Shield className="w-6 h-6 text-gold flex-shrink-0" />
                <div>
                  <h3 className="font-display font-bold text-foreground mb-1">Safety First</h3>
                  <p className="text-sm text-muted-foreground">All work meets or exceeds local building codes</p>
                </div>
              </div>
              <div className="bg-background border border-gold/15 rounded-xl p-5 flex gap-4 items-start">
                <Sparkles className="w-6 h-6 text-gold flex-shrink-0" />
                <div>
                  <h3 className="font-display font-bold text-foreground mb-1">Custom Design</h3>
                  <p className="text-sm text-muted-foreground">Tailored to match your home's unique style</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Styles */}
      <section className="section-padding">
        <div className="container mx-auto max-w-4xl">
          <h2 className="font-display text-3xl font-bold text-foreground text-center mb-12">Popular Staircase <span className="gold-gradient-text">Styles</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {p.styles.map((s, i) => (
              <div key={i} className="bg-background border border-gold/15 rounded-xl p-6 text-center">
                <h3 className="font-display font-bold text-foreground mb-2">{s.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{s.desc}</p>
                <div className="flex flex-wrap gap-1.5 justify-center">
                  {s.tags.map((t, j) => <span key={j} className="text-xs px-2 py-0.5 rounded-full bg-gold/10 text-gold">{t}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety */}
      <section className="section-padding bg-secondary/50">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="font-display text-2xl font-bold text-foreground mb-8">Safety & <span className="gold-gradient-text">Code Compliance</span></h2>
          <div className="grid grid-cols-2 gap-4">
            {p.safety.map((s, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-foreground">
                <CheckCircle className="w-4 h-4 text-gold" /> {s}
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-6">Every project includes a detailed safety inspection and compliance verification.</p>
        </div>
      </section>

      <section className="relative section-padding overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gold-dark via-gold to-gold-light opacity-85" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(252,207,147,0.3),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(81,53,30,0.4),transparent_60%)]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        <div className="relative container mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <p className="text-xs uppercase tracking-[0.3em] text-background/60 font-semibold mb-4">Custom Staircases</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-background mb-5">{p.ctaTitle}</h2>
            <div className="w-16 h-[2px] bg-background/30 mx-auto mb-5" />
            <p className="text-background/70 mb-10 max-w-lg mx-auto text-sm leading-relaxed">{p.ctaSubtitle}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2, duration: 0.5 }} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="xl" className="bg-background text-foreground hover:bg-background/90 shadow-lg shadow-black/20" asChild>
              <Link to="/contact">{p.ctaCta1}</Link>
            </Button>
            <Button variant="outline" size="xl" className="bg-transparent border-2 border-background/40 text-background hover:bg-background/10 hover:border-background/70 transition-all" asChild>
              <a href="tel:9139153193">{p.ctaCta2}</a>
            </Button>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </section>
    </Layout>
  );
}
