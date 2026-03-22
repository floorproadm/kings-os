import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { DollarSign, Clock, Shield, Users, Zap, TrendingUp, CheckCircle, Phone } from "lucide-react";
import { blurIn } from "@/lib/animations";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const cards = [
  { icon: <DollarSign className="w-6 h-6 text-gold" />, title: "Contractor Pricing", desc: "Exclusive pricing for builders with competitive bulk rates for ongoing partnerships." },
  { icon: <Clock className="w-6 h-6 text-gold" />, title: "Priority Scheduling", desc: "Your projects receive scheduling priority to keep construction timelines on track." },
  { icon: <Shield className="w-6 h-6 text-gold" />, title: "Quality Guarantee", desc: "Every installation backed by professional craftsmanship and long-term durability." },
  { icon: <Users className="w-6 h-6 text-gold" />, title: "Direct Communication", desc: "Work directly with our team for faster updates and efficient coordination." },
  { icon: <Zap className="w-6 h-6 text-gold" />, title: "Fast Turnaround", desc: "Most residential flooring installations completed within 2–5 days." },
  { icon: <TrendingUp className="w-6 h-6 text-gold" />, title: "Long-Term Partnerships", desc: "Improved pricing and streamlined coordination as volume increases." },
];

const steps = [
  { num: "01", title: "Partnership Setup", desc: "We discuss your typical project volume, timelines, and preferred flooring options." },
  { num: "02", title: "Project Planning", desc: "Send us your project plans. Clear estimates and scheduling within 48 hours." },
  { num: "03", title: "Professional Installation", desc: "Our installers coordinate with your build schedule and complete on time." },
];

export default function Builders() {
  return (
    <Layout>
      <section className="section-padding bg-secondary/50">
        <div className="container mx-auto text-center">
          <p className="text-gold font-semibold text-sm uppercase tracking-wider mb-3">For Builders & Contractors</p>
          <motion.h1 variants={blurIn} initial="hidden" animate="visible" className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Reliable Flooring Partner for <span className="gold-gradient-text">Builders & Contractors</span>
          </motion.h1>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">Hardwood, vinyl, and staircase installation for builders who need reliable timelines, professional craftsmanship, and competitive contractor pricing.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="gold" size="xl" asChild>
              <Link to="/contact">Get Contractor Pricing</Link>
            </Button>
            <Button variant="goldOutline" size="xl" asChild>
              <Link to="/gallery">View Our Work</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container mx-auto">
          <motion.h2 variants={blurIn} initial="hidden" whileInView="visible" viewport={{ once: true }} className="font-display text-3xl font-bold text-foreground text-center mb-12">Why Builders Choose <span className="gold-gradient-text">Hardwood Kings</span></motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((c, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i} className="elevated-card p-6">
                <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center mb-4">{c.icon}</div>
                <h3 className="font-display font-bold text-foreground mb-2">{c.title}</h3>
                <p className="text-sm text-muted-foreground">{c.desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-10 elevated-card p-6 flex flex-wrap gap-6 justify-center">
            {["Consistent Installation Quality", "Reliable Project Scheduling", "23+ Years Experience", "14 Years in Business"].map((t, i) => (
              <span key={i} className="flex items-center gap-2 text-sm text-foreground"><CheckCircle className="w-4 h-4 text-gold" />{t}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-secondary/50">
        <div className="container mx-auto max-w-4xl">
          <h2 className="font-display text-3xl font-bold text-foreground text-center mb-12">How Our Partnership <span className="gold-gradient-text">Works</span></h2>
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

      <section className="section-padding bg-gradient-to-r from-gold-light/80 via-gold/70 to-gold-dark/80">
        <div className="container mx-auto text-center">
          <h2 className="font-display text-3xl font-bold text-primary-foreground mb-4">Ready to Partner with Hardwood Kings?</h2>
          <p className="text-primary-foreground/80 mb-8">Work with a flooring team that understands construction timelines.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="default" size="xl" className="bg-background text-foreground hover:bg-background/90" asChild>
              <Link to="/contact">Start Partnership Today</Link>
            </Button>
            <Button variant="outline" size="xl" className="bg-background border-0 text-foreground hover:bg-muted" asChild>
              <a href="tel:9139153193">Call (913) 915-3193</a>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
