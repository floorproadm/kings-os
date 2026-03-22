import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Droplets, Shield, Zap, Heart } from "lucide-react";
import { FeatureSteps } from "@/components/ui/feature-steps";
import serviceVinyl from "@/assets/service-vinyl.jpg";
import { useSiteConfig } from "@/contexts/SiteConfigContext";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const iconMap: Record<number, React.ReactNode> = {
  0: <Droplets className="w-6 h-6 text-gold" />,
  1: <Shield className="w-6 h-6 text-gold" />,
  2: <Zap className="w-6 h-6 text-gold" />,
  3: <Heart className="w-6 h-6 text-gold" />,
};

export default function VinylService() {
  const { config } = useSiteConfig();
  const p = config.vinylPage;

  return (
    <Layout>
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src={serviceVinyl} alt="Vinyl Plank Flooring" className="w-full h-full object-cover" />
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

      <section className="section-padding">
        <div className="container mx-auto">
          <h2 className="font-display text-3xl font-bold text-foreground text-center mb-4">{p.sectionTitle} <span className="gold-gradient-text">{p.sectionHighlight}</span></h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">{p.sectionSubtitle}</p>
          <FeatureSteps
            features={p.features.map((f, i) => ({
              step: `Step ${i + 1}`,
              title: f.title,
              content: f.desc,
            }))}
            autoPlayInterval={4000}
            className="max-w-2xl mx-auto"
          />
        </div>
      </section>

      {/* Room Guide */}
      <section className="section-padding bg-secondary/50">
        <div className="container mx-auto max-w-4xl">
          <h2 className="font-display text-3xl font-bold text-foreground text-center mb-12">Perfect for Every <span className="gold-gradient-text">Room</span></h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {p.rooms.map((r, i) => (
              <div key={i} className="elevated-card p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-display font-bold text-foreground">{r.room}</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gold/10 text-gold">{r.tag}</span>
                </div>
                <p className="text-sm text-muted-foreground">{r.benefits}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="section-padding">
        <div className="container mx-auto max-w-4xl">
          <h2 className="font-display text-2xl font-bold text-foreground text-center mb-8">Vinyl vs. Hardwood <span className="gold-gradient-text">Comparison</span></h2>
          <div className="elevated-card overflow-hidden">
            <div className="grid grid-cols-3 bg-gold/10 p-4 text-sm font-semibold text-foreground">
              <span>Feature</span>
              <span className="text-gold">Luxury Vinyl ✅</span>
              <span>Hardwood</span>
            </div>
            {p.comparison.map((c, i) => (
              <div key={i} className={`grid grid-cols-3 p-4 text-sm ${i % 2 === 0 ? 'bg-card' : 'bg-secondary/30'}`}>
                <span className="text-foreground font-medium">{c.feature}</span>
                <span className="text-gold">{c.vinyl}</span>
                <span className="text-muted-foreground">{c.hardwood}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-gradient-to-r from-[#fccf93]/80 via-gold/70 to-[#51351e]/80">
        <div className="container mx-auto text-center">
          <h2 className="font-display text-3xl font-bold text-primary-foreground mb-4">{p.ctaTitle}</h2>
          <p className="text-primary-foreground/80 mb-8">{p.ctaSubtitle}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="default" size="xl" className="bg-background text-foreground hover:bg-background/90" asChild>
              <Link to="/contact">{p.ctaCta1}</Link>
            </Button>
            <Button variant="outline" size="xl" className="bg-gradient-to-r from-[#fccf93] to-[#51351e] border-0 text-[#1A1A0F] hover:opacity-90" asChild>
              <a href="tel:9139153193">{p.ctaCta2}</a>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
