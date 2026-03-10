import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, Crown, Shield, Trophy } from "lucide-react";
import serviceHardwood from "@/assets/service-hardwood.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const benefits = [
  "Expert Professional Installation",
  "Lifetime Structural Warranty",
  "Increases Home Value",
  "Custom Staining & Finishing Options",
  "Minimal disruption installation process",
];

const features = [
  { icon: <Trophy className="w-6 h-6 text-gold" />, title: "Premium Quality Materials", desc: "Only the finest hardwood species from trusted suppliers" },
  { icon: <Shield className="w-6 h-6 text-gold" />, title: "Installation Guarantee", desc: "Every hardwood floor is backed by our commitment to quality and durability" },
  { icon: <Crown className="w-6 h-6 text-gold" />, title: "Craftsmanship Guarantee", desc: "Professional installation standards designed for long-lasting results" },
];

const steps = [
  { num: "01", title: "Free In-Home Consultation", desc: "We visit your home, evaluate the space, and help you choose the best hardwood flooring options." },
  { num: "02", title: "Professional Installation", desc: "Our experienced installers prepare the subfloor and install your hardwood with expert craftsmanship." },
  { num: "03", title: "Final Walkthrough & Inspection", desc: "We review the finished project with you to ensure every detail meets our quality standards." },
];

export default function HardwoodService() {
  return (
    <Layout>
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src={serviceHardwood} alt="Hardwood Flooring" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/50" />
        </div>
        <div className="relative container mx-auto px-4">
          <div className="max-w-2xl">
            <p className="text-gold font-semibold text-sm uppercase tracking-wider mb-3">Hardwood Flooring</p>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4">
              Beautiful Hardwood Floors <span className="gold-gradient-text">Professionally Installed</span>
            </h1>
            <p className="text-muted-foreground mb-8">Hardwood floors bring warmth, elegance, and long-term value to any home. Our professional installation ensures a flawless finish.</p>
            <Button variant="gold" size="xl" asChild>
              <Link to="/contact">Get Your Free Estimate</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container mx-auto">
          <h2 className="font-display text-3xl font-bold text-foreground text-center mb-4">Why Choose Our <span className="gold-gradient-text">Hardwood Flooring?</span></h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">Professionally installed hardwood floors that bring lasting beauty, durability, and value.</p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-3">
              {benefits.map((b, i) => (
                <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-gold flex-shrink-0" />
                  <span className="text-foreground font-medium">{b}</span>
                </motion.div>
              ))}
            </div>
            <div className="grid gap-4">
              {features.map((f, i) => (
                <div key={i} className="elevated-card p-5 flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0">{f.icon}</div>
                  <div>
                    <h3 className="font-display font-bold text-foreground mb-1">{f.title}</h3>
                    <p className="text-sm text-muted-foreground">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-secondary/50">
        <div className="container mx-auto max-w-4xl">
          <h2 className="font-display text-3xl font-bold text-foreground text-center mb-12">Our Installation <span className="gold-gradient-text">Process</span></h2>
          <div className="space-y-6">
            {steps.map((s, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i} className="elevated-card p-6 flex gap-6 items-start">
                <div className="text-3xl font-display font-bold text-gold/30">{s.num}</div>
                <div>
                  <h3 className="font-display font-bold text-foreground mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-gradient-to-br from-gold-dark via-gold to-gold-light">
        <div className="container mx-auto text-center">
          <h2 className="font-display text-3xl font-bold text-primary-foreground mb-4">Ready to Upgrade Your Home?</h2>
          <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">Get a free in-home flooring estimate and discover how premium hardwood flooring can transform your space.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="default" size="xl" className="bg-background text-foreground hover:bg-background/90" asChild>
              <Link to="/contact">Get Your Free Estimate</Link>
            </Button>
            <Button variant="outline" size="xl" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" asChild>
              <a href="tel:9139153193">Call (913) 915-3193</a>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
