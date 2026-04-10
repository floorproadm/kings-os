import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Crown, Heart, Eye, Users, ClipboardCheck, Hammer, Sparkles } from "lucide-react";
import Layout from "@/components/Layout";
import founderPhoto from "@/assets/thiago-reis.png";
import { blurIn } from "@/lib/animations";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } })
};

const values = [
  { icon: <Eye className="w-6 h-6 text-gold" />, title: "Hands-On Leadership", desc: "Our leadership is not behind a desk. We are directly involved in every project." },
  { icon: <Crown className="w-6 h-6 text-gold" />, title: "Craftsmanship You Can Trust", desc: "Every detail matters. If we wouldn't install it in our own home, we won't install it in yours." },
  { icon: <Heart className="w-6 h-6 text-gold" />, title: "Built on Legacy and Hard Work", desc: "Hardwood Kings was built through years of dedication, experience, and pride in honest craftsmanship." },
  { icon: <Users className="w-6 h-6 text-gold" />, title: "Client-First Service", desc: "We respect your home, your time, and your expectations." },
];

const steps = [
  { icon: <ClipboardCheck className="w-8 h-8 text-gold" />, title: "Preparation", desc: "We evaluate the space, identify the best approach, and make sure every detail is planned before we begin." },
  { icon: <Hammer className="w-8 h-8 text-gold" />, title: "Execution", desc: "Work is done step by step with precision, following the process that 24 years of experience have refined." },
  { icon: <Sparkles className="w-8 h-8 text-gold" />, title: "Finish", desc: "The final result speaks for itself — consistent quality and long-term durability you can see and feel." },
];

const stats = [
  { value: "1k+", label: "Projects Completed" },
  { value: "24+", label: "Years Experience" },
  { value: "100%", label: "Satisfaction Rate" },
];

export default function About() {
  return (
    <Layout>
      <section className="section-padding bg-secondary/50">
        <div className="container mx-auto text-center">
          <motion.h1 variants={blurIn} initial="hidden" animate="visible" className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4">
            About <span className="gold-gradient-text">Hardwood Kings</span>
          </motion.h1>
        </div>
      </section>

      {/* Founder Story */}
      <section className="section-padding">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <motion.h2 variants={fadeUp} custom={0} className="font-display text-3xl font-bold text-foreground mb-6">
                A Message from <span className="gold-gradient-text">the Owner</span>
              </motion.h2>
              <motion.div variants={fadeUp} custom={1} className="space-y-4 text-muted-foreground leading-relaxed">
                <p>Hi, my name is <strong className="text-foreground">T. Reis</strong>, owner of <strong className="text-gold">Hardwood Kings Inc</strong>.</p>
                <p>I bring over <strong className="text-gold">24 years</strong> of hands-on experience working with wood flooring.</p>
                <p>We specialize in <strong className="text-foreground">hardwood floor installation, refinishing, vinyl flooring, stairs, and handrails</strong>.</p>
                <p>Every project follows a clear standard. Preparation, execution, and finish are done step by step to ensure consistency and long-term durability.</p>
              </motion.div>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <img src={founderPhoto} alt="T. Reis - Founder of Hardwood Kings" className="rounded-2xl shadow-2xl shadow-black/30" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Approach */}
      <section className="section-padding bg-secondary/50">
        <div className="container mx-auto">
          <motion.h2 variants={blurIn} initial="hidden" whileInView="visible" viewport={{ once: true }} className="font-display text-3xl font-bold text-foreground text-center mb-12">
            Our <span className="gold-gradient-text">Approach</span>
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {steps.map((s, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i} className="elevated-card p-8 text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mb-5">{s.icon}</div>
                <h3 className="font-display font-bold text-foreground text-lg mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding">
        <div className="container mx-auto">
          <motion.h2 variants={blurIn} initial="hidden" whileInView="visible" viewport={{ once: true }} className="font-display text-3xl font-bold text-foreground text-center mb-12">Our <span className="gold-gradient-text">Values</span></motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i} className="elevated-card p-6 text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mb-4">{v.icon}</div>
                <h3 className="font-display font-bold text-foreground mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Promise */}
      <section className="section-padding bg-secondary/50">
        <div className="container mx-auto max-w-3xl text-center">
          <motion.h2 variants={blurIn} initial="hidden" whileInView="visible" viewport={{ once: true }} className="font-display text-3xl font-bold text-foreground mb-6">Our <span className="gold-gradient-text">Promise</span></motion.h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-4 italic">
            "Most floors don't need to be replaced. They need the right process and the right professional."
          </p>
          <p className="text-muted-foreground leading-relaxed">
            If you want your floors done right the first time, start with a professional evaluation.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="section-padding-sm">
        <div className="container mx-auto">
          <div className="flex flex-col sm:flex-row sm:justify-center gap-4 text-center">
            {stats.map((s, i) => (
              <div key={i} className="elevated-card p-5 sm:p-6 flex sm:flex-col items-center sm:items-center gap-3 sm:gap-1 sm:min-w-[160px]">
                <div className="text-3xl font-display font-bold text-gold">{s.value}</div>
                <p className="text-sm text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-gradient-to-r from-gold-light/80 via-gold/70 to-gold-dark/80">
        <div className="container mx-auto text-center">
          <motion.h2 variants={blurIn} initial="hidden" whileInView="visible" viewport={{ once: true }} className="font-display text-3xl font-bold text-primary-foreground mb-4">Ready to Transform Your Floors?</motion.h2>
          <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">Request your free professional evaluation today.</p>
          <Button variant="default" size="xl" className="bg-background text-foreground hover:bg-background/90" asChild>
            <Link to="/contact">Get Your Free Evaluation</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}
