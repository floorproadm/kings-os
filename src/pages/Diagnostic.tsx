import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { AlertTriangle, CheckCircle, X } from "lucide-react";
import { motion } from "framer-motion";
import { blurIn } from "@/lib/animations";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const whatIs = [
  "Professional floor condition assessment",
  "Moisture and wear analysis",
  "Expert recommendation from a senior specialist",
  "Written diagnostic report within 48 hours",
];

const whatIsNot = [
  "Not a free estimate",
  "Not a sales visit",
  "Not a rushed 10-minute walkthrough",
  "Not a service every contractor offers",
];

const steps = [
  { num: "01", title: "On-Site Floor Assessment", desc: "We evaluate the current condition of your floors, including wear patterns, moisture levels, and structural integrity." },
  { num: "02", title: "Lifestyle & Home Analysis", desc: "We discuss how your home is used, traffic levels, pets, and long-term goals for your flooring." },
  { num: "03", title: "Diagnostic Report", desc: "Within 48 hours, you receive a clear recommendation outlining the best solution and investment range." },
];

export default function Diagnostic() {
  return (
    <Layout>
      <section className="section-padding bg-dark-surface">
        <div className="container mx-auto text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-gold/10 text-gold text-xs font-semibold tracking-wider uppercase mb-4">
            Premium Decision Service
          </span>
          <motion.h1 variants={blurIn} initial="hidden" animate="visible" className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Before We Touch Your Floors,<br />
            <span className="gold-gradient-text">We Study Them.</span>
          </motion.h1>
          <p className="text-muted-foreground max-w-xl mx-auto mb-6">
            Know exactly what your floors need — and what they don't — before a single board is touched.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-gold">
            <AlertTriangle className="w-4 h-4" />
            Limited appointments available. Not all projects accepted.
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="elevated-card p-6">
              <h3 className="font-display text-lg font-bold text-gold mb-4">✅ What it is</h3>
              <ul className="space-y-3">
                {whatIs.map((w, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-foreground">
                    <CheckCircle className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" /> {w}
                  </li>
                ))}
              </ul>
            </div>
            <div className="elevated-card p-6">
              <h3 className="font-display text-lg font-bold text-destructive mb-4">❌ What it is not</h3>
              <ul className="space-y-3">
                {whatIsNot.map((w, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <X className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" /> {w}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-secondary/50">
        <div className="container mx-auto max-w-4xl">
          <motion.h2 variants={blurIn} initial="hidden" whileInView="visible" viewport={{ once: true }} className="font-display text-3xl font-bold text-foreground text-center mb-12">The Diagnostic <span className="gold-gradient-text">Process</span></motion.h2>
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

      <section className="relative section-padding overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gold-dark via-gold to-gold-light opacity-85" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(252,207,147,0.3),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(81,53,30,0.4),transparent_60%)]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        <div className="relative container mx-auto max-w-2xl text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <p className="text-xs uppercase tracking-[0.3em] text-background/60 font-semibold mb-4">Premium Diagnostic</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-background mb-5">Ready for a Permanent Solution?</h2>
            <div className="w-16 h-[2px] bg-background/30 mx-auto mb-5" />
            <p className="text-background/70 mb-10 max-w-lg mx-auto text-sm leading-relaxed italic">"This service is for homeowners ready to invest in a permanent solution. If you're comparing prices from multiple contractors, this may not be the right fit."</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2, duration: 0.5 }}>
            <Button size="xl" className="bg-background text-foreground hover:bg-background/90 shadow-lg shadow-black/20" asChild>
              <Link to="/contact">Apply for Diagnostic</Link>
            </Button>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </section>
    </Layout>
  );
}
