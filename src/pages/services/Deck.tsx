import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle, Sun, Paintbrush, Shield, Fence } from "lucide-react";
import Layout from "@/components/Layout";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const benefits = [
  "Professional surface sanding & prep",
  "Premium stain & seal application",
  "Handrail restoration & refinishing",
  "Long-lasting weather protection",
];

const features = [
  { title: "Surface Sanding", desc: "We sand down weathered deck boards to reveal fresh wood and create a smooth surface for staining.", icon: <Paintbrush className="w-6 h-6 text-gold" /> },
  { title: "Stain & Seal", desc: "Premium stain and sealant application to protect your deck from UV, rain, and daily wear.", icon: <Sun className="w-6 h-6 text-gold" /> },
  { title: "Handrail Restoration", desc: "Complete refinishing of handrails and balusters to match your refreshed deck.", icon: <Fence className="w-6 h-6 text-gold" /> },
  { title: "Weather Protection", desc: "Industrial-grade sealant that extends the life of your deck for years to come.", icon: <Shield className="w-6 h-6 text-gold" /> },
];

const steps = [
  { step: "1", title: "Inspection", desc: "We assess the condition of your deck, railings, and underlying structure." },
  { step: "2", title: "Sanding & Prep", desc: "Old finish is removed and the wood is sanded to a smooth surface." },
  { step: "3", title: "Stain & Finish", desc: "Your chosen stain is applied followed by a protective sealant coat." },
  { step: "4", title: "Final Review", desc: "We inspect every detail and ensure you're completely satisfied." },
];

export default function DeckService() {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-20 bg-gradient-to-br from-secondary via-background to-secondary overflow-hidden">
        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.h1 initial={{ opacity: 0, y: 20, filter: "blur(10px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ duration: 0.7, ease: "easeOut" }} className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Deck & Handrail <span className="gold-gradient-text">Refinishing</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Restore the beauty and safety of your outdoor spaces with our professional deck and handrail refinishing services.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Link to="/contact"><Button variant="gold" size="xl">Get a Free Estimate</Button></Link>
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section-padding">
        <div className="container mx-auto">
          <h2 className="font-display text-2xl font-bold text-foreground text-center mb-10">Why Refinish Your Deck</h2>
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
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} className="elevated-card p-6 text-center">
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
          <h2 className="font-display text-2xl font-bold text-foreground mb-4">Ready to Restore Your Deck?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">Give your outdoor space the refresh it deserves. Get a free estimate today.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact"><Button variant="gold" size="xl">Get Your Free Estimate</Button></Link>
            <a href="tel:9139153193"><Button variant="outline" size="xl" className="bg-background border-2 border-gold/25 gold-gradient-text hover:bg-gold/10 transition-colors">Call (913) 915-3193</Button></a>
          </div>
        </div>
      </section>
    </Layout>
  );
}
