import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, Droplets, Shield, Zap, Heart } from "lucide-react";
import serviceVinyl from "@/assets/service-vinyl.jpg";
import { useSiteConfig } from "@/contexts/SiteConfigContext";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const features = [
  { icon: <Droplets className="w-6 h-6 text-gold" />, title: "100% Waterproof", desc: "Ideal for kitchens, bathrooms, basements, and moisture-prone areas." },
  { icon: <Shield className="w-6 h-6 text-gold" />, title: "Built for High Traffic", desc: "Designed to withstand heavy foot traffic in homes and commercial spaces." },
  { icon: <Zap className="w-6 h-6 text-gold" />, title: "Fast Installation", desc: "Most projects completed quickly with minimal disruption." },
  { icon: <Heart className="w-6 h-6 text-gold" />, title: "Comfortable Underfoot", desc: "Softer and warmer than tile or traditional hardwood." },
];

const rooms = [
  { room: "Kitchen", benefits: "Waterproof spill protection • Easy to clean", tag: "Perfect choice" },
  { room: "Bathroom", benefits: "100% moisture resistant • Anti-slip surface", tag: "Ideal solution" },
  { room: "Basement", benefits: "Moisture barrier • Temperature stable", tag: "Best option" },
  { room: "Living Areas", benefits: "Beautiful wood look • Pet friendly", tag: "Excellent choice" },
  { room: "Office & Retail", benefits: "High foot traffic • Professional look", tag: "Commercial Use" },
  { room: "Rental Properties", benefits: "Durable • Low maintenance • Cost effective", tag: "Property Owners" },
];

const comparison = [
  { feature: "Water Resistance", vinyl: "100% waterproof", hardwood: "Not recommended for moisture" },
  { feature: "Durability", vinyl: "Scratch & dent resistant", hardwood: "Can scratch but refinishable" },
  { feature: "Maintenance", vinyl: "Very easy to clean", hardwood: "Requires more care" },
  { feature: "Installation", vinyl: "Faster installation", hardwood: "More complex" },
  { feature: "Longevity", vinyl: "15–25 years", hardwood: "Decades with refinishing" },
  { feature: "Appearance", vinyl: "Realistic wood look", hardwood: "Natural real wood" },
];

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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i} className="elevated-card p-6 text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mb-4">{f.icon}</div>
                <h3 className="font-display font-bold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Room Guide */}
      <section className="section-padding bg-secondary/50">
        <div className="container mx-auto max-w-4xl">
          <h2 className="font-display text-3xl font-bold text-foreground text-center mb-12">Perfect for Every <span className="gold-gradient-text">Room</span></h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {rooms.map((r, i) => (
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
            {comparison.map((c, i) => (
              <div key={i} className={`grid grid-cols-3 p-4 text-sm ${i % 2 === 0 ? 'bg-card' : 'bg-secondary/30'}`}>
                <span className="text-foreground font-medium">{c.feature}</span>
                <span className="text-gold">{c.vinyl}</span>
                <span className="text-muted-foreground">{c.hardwood}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-gradient-to-br from-gold-dark via-gold to-gold-light">
        <div className="container mx-auto text-center">
          <h2 className="font-display text-3xl font-bold text-primary-foreground mb-4">{p.ctaTitle}</h2>
          <p className="text-primary-foreground/80 mb-8">{p.ctaSubtitle}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="default" size="xl" className="bg-background text-foreground hover:bg-background/90" asChild>
              <Link to="/contact">{p.ctaCta1}</Link>
            </Button>
            <Button variant="outline" size="xl" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" asChild>
              <a href="tel:9139153193">{p.ctaCta2}</a>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
