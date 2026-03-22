import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle, Droplets, Sparkles, Clock, ThumbsUp } from "lucide-react";
import Layout from "@/components/Layout";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const benefits = [
  "Deep cleaning that removes built-up grime",
  "Professional polish application for lasting shine",
  "Restores the natural beauty of your floors",
  "No downtime — walk on floors the same day",
];

const features = [
  { title: "Deep Cleaning", desc: "Professional-grade cleaning solutions break down dirt, grease, and residue without damaging your floors.", icon: <Droplets className="w-6 h-6 text-gold" /> },
  { title: "Polish Application", desc: "A protective polish layer is applied to restore luster and provide a beautiful, even sheen.", icon: <Sparkles className="w-6 h-6 text-gold" /> },
  { title: "Same-Day Use", desc: "Unlike full refinishing, your floors are ready to walk on immediately after the polish dries.", icon: <Clock className="w-6 h-6 text-gold" /> },
  { title: "Lasting Results", desc: "Our professional-grade products keep your floors looking great for months between treatments.", icon: <ThumbsUp className="w-6 h-6 text-gold" /> },
];

const steps = [
  { step: "1", title: "Assessment", desc: "We evaluate your floor's condition and recommend the best cleaning approach." },
  { step: "2", title: "Deep Clean", desc: "Professional equipment removes all dirt, grime, and old product buildup." },
  { step: "3", title: "Polish", desc: "A premium polish is evenly applied for a beautiful, protective finish." },
  { step: "4", title: "Enjoy", desc: "Your floors are ready to use — no drying time or downtime required." },
];

export default function WashService() {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-20 bg-gradient-to-br from-secondary via-background to-secondary overflow-hidden">
        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.h1 initial={{ opacity: 0, y: 20, filter: "blur(10px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ duration: 0.7, ease: "easeOut" }} className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Wash & <span className="gold-gradient-text">Polish</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-muted-foreground max-w-2xl mx-auto mb-8">
            The perfect way to revitalize your hardwood floors without the need for a full refinishing. Fast, clean, and immediately beautiful.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Link to="/contact"><Button variant="gold" size="xl">Get a Free Estimate</Button></Link>
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section-padding">
        <div className="container mx-auto">
          <h2 className="font-display text-2xl font-bold text-foreground text-center mb-10">Why Choose Wash & Polish</h2>
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
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} className="rounded-2xl border border-gold/15 bg-background p-6 text-center shadow-[0_0_15px_rgba(201,168,76,0.06)]">
                <div className="w-12 h-12 mx-auto rounded-full bg-gold/10 border border-gold/25 flex items-center justify-center mb-4">{f.icon}</div>
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
      <section className="relative section-padding overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gold-dark via-gold to-gold-light opacity-85" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(252,207,147,0.3),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(81,53,30,0.4),transparent_60%)]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        <div className="relative container mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <p className="text-xs uppercase tracking-[0.3em] text-background/60 font-semibold mb-4">Wash & Polish</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-background mb-5">Floors Looking Dull?</h2>
            <div className="w-16 h-[2px] bg-background/30 mx-auto mb-5" />
            <p className="text-background/70 mb-10 max-w-lg mx-auto text-sm leading-relaxed">Skip the full refinishing. Our wash & polish service brings back the shine in just a few hours.</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2, duration: 0.5 }} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="xl" className="bg-background text-foreground hover:bg-background/90 shadow-lg shadow-black/20" asChild>
              <Link to="/contact">Get Your Free Estimate</Link>
            </Button>
            <Button variant="outline" size="xl" className="bg-transparent border-2 border-background/40 text-background hover:bg-background/10 hover:border-background/70 transition-all" asChild>
              <a href="tel:9139153193">Call (913) 915-3193</a>
            </Button>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </section>
    </Layout>
  );
}
