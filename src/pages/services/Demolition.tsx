import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle, Hammer, ShieldCheck, Trash2, Sparkles } from "lucide-react";
import Layout from "@/components/Layout";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const benefits = [
  "Safe removal of old or damaged flooring",
  "Complete subfloor preparation & leveling",
  "Minimal disruption to your daily routine",
  "Clean worksite — we leave it spotless",
];

const features = [
  { title: "Safe Removal", desc: "We carefully remove old flooring materials with proper tools and techniques to protect your home's structure.", icon: <ShieldCheck className="w-6 h-6 text-gold" /> },
  { title: "Subfloor Prep", desc: "Thorough subfloor inspection, repair, and leveling to ensure your new flooring has a perfect foundation.", icon: <Hammer className="w-6 h-6 text-gold" /> },
  { title: "Debris Hauling", desc: "All old materials are properly disposed of — we handle the heavy lifting so you don't have to.", icon: <Trash2 className="w-6 h-6 text-gold" /> },
  { title: "Ready for New", desc: "Your space is left perfectly prepared for whatever flooring you choose next.", icon: <Sparkles className="w-6 h-6 text-gold" /> },
];

const steps = [
  { step: "1", title: "Assessment", desc: "We inspect the existing flooring and subfloor condition." },
  { step: "2", title: "Protection", desc: "Surrounding areas are covered and protected from dust and debris." },
  { step: "3", title: "Removal", desc: "Old flooring is carefully removed with professional equipment." },
  { step: "4", title: "Prep & Clean", desc: "Subfloor is prepped, leveled, and the site is thoroughly cleaned." },
];

export default function DemolitionService() {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-20 bg-gradient-to-br from-secondary via-background to-secondary overflow-hidden">
        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Demolition & <span className="gold-gradient-text">Replacement</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-muted-foreground max-w-2xl mx-auto mb-8">
            We safely remove old or damaged flooring and prepare your space for a fresh start — with minimal mess and maximum respect for your home.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Link to="/contact"><Button variant="gold" size="xl">Get a Free Estimate</Button></Link>
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section-padding">
        <div className="container mx-auto">
          <h2 className="font-display text-2xl font-bold text-foreground text-center mb-10">Why Choose Our Demolition Service</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {benefits.map((b, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">{b}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section-padding bg-secondary/50">
        <div className="container mx-auto">
          <h2 className="font-display text-2xl font-bold text-foreground text-center mb-10">What's Included</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} className="bg-background border border-gold/15 rounded-xl p-6 text-center">
                <div className="w-12 h-12 mx-auto rounded-full bg-gold/10 flex items-center justify-center mb-4">{f.icon}</div>
                <h3 className="font-display text-lg font-bold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="section-padding">
        <div className="container mx-auto max-w-3xl">
          <h2 className="font-display text-2xl font-bold text-foreground text-center mb-10">Our Process</h2>
          <div className="space-y-6">
            {steps.map((s, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                  <span className="font-display font-bold text-gold">{s.step}</span>
                </div>
                <div>
                  <h3 className="font-display font-bold text-foreground">{s.title}</h3>
                  <p className="text-sm text-muted-foreground">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-secondary/50">
        <div className="container mx-auto text-center">
          <h2 className="font-display text-2xl font-bold text-foreground mb-4">Ready for a Fresh Start?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">Let us handle the heavy lifting. Get a free estimate for your demolition and replacement project.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact"><Button variant="gold" size="xl">Get Your Free Estimate</Button></Link>
            <a href="tel:9139153193"><Button variant="outline" size="xl" className="bg-background border-2 border-black gold-gradient-text hover:border-gold/50 hover:shadow-[0_0_15px_rgba(201,168,76,0.15)] transition-all">Call (913) 915-3193</Button></a>
          </div>
        </div>
      </section>
    </Layout>
  );
}
