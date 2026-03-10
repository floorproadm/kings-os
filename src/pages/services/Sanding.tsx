import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, Zap, Home, DollarSign, Clock, Shield, Crown } from "lucide-react";
import serviceSanding from "@/assets/service-sanding.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const benefits = [
  { icon: <Zap className="w-6 h-6 text-gold" />, title: "Long-Lasting Protection", desc: "Our professional sanding and finishing process protects your hardwood floors with a durable coating built to last for years." },
  { icon: <Home className="w-6 h-6 text-gold" />, title: "Increase Home Value", desc: "Beautiful hardwood floors are one of the most desirable features for homeowners and future buyers." },
  { icon: <DollarSign className="w-6 h-6 text-gold" />, title: "Save Thousands", desc: "Refinishing restores your existing hardwood floors at a fraction of the cost of installing brand-new flooring." },
  { icon: <Clock className="w-6 h-6 text-gold" />, title: "Fast & Efficient", desc: "Most refinishing projects are completed in just a few days, transforming your floors without major disruption." },
];

const steps = [
  { num: "01", title: "Professional Sanding", desc: "We carefully sand the entire floor surface to remove old finishes, scratches, stains, and imperfections." },
  { num: "02", title: "Custom Stain Selection", desc: "Choose to keep the natural wood color or select from a range of beautiful stain options to match your home's style." },
  { num: "03", title: "Premium Protective Finish", desc: "We apply three coats of premium Bona or Loba finish, creating a durable protective layer with your choice of sheen." },
];

const finishes = [
  { name: "Matte Finish", desc: "Natural look with minimal sheen, hides minor imperfections", best: "High-traffic areas" },
  { name: "Satin Finish", desc: "Perfect balance of durability and beauty with subtle luster", best: "Most popular choice" },
  { name: "Semi-Gloss Finish", desc: "Higher sheen with excellent durability and easy cleaning", best: "Kitchens & bathrooms" },
];

export default function SandingService() {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src={serviceSanding} alt="Sanding & Refinishing" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/50" />
        </div>
        <div className="relative container mx-auto px-4">
          <div className="max-w-2xl">
            <p className="text-gold font-semibold text-sm uppercase tracking-wider mb-3">Sanding & Refinishing</p>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4">
              Your Hardwood Floors Can Look <span className="gold-gradient-text">Beautiful Again</span>
            </h1>
            <p className="text-muted-foreground mb-8">Bring your worn, scratched, or faded hardwood floors back to life with our professional refinishing process.</p>
            <Button variant="gold" size="xl" asChild>
              <Link to="/contact">Get Your Free Estimate</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section-padding">
        <div className="container mx-auto">
          <h2 className="font-display text-3xl font-bold text-foreground text-center mb-4">Why Choose Our <span className="gold-gradient-text">Service?</span></h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">Restore the beauty of your hardwood floors and save thousands compared to replacing them.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((b, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i} className="elevated-card p-6 text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mb-4">{b.icon}</div>
                <h3 className="font-display font-bold text-foreground mb-2">{b.title}</h3>
                <p className="text-sm text-muted-foreground">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section-padding bg-secondary/50">
        <div className="container mx-auto max-w-4xl">
          <h2 className="font-display text-3xl font-bold text-foreground text-center mb-4">Our Refinishing <span className="gold-gradient-text">Process</span></h2>
          <p className="text-center text-muted-foreground mb-12">Professional refinishing that restores natural beauty and protects for years.</p>
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

      {/* Finishes */}
      <section className="section-padding">
        <div className="container mx-auto max-w-4xl">
          <h2 className="font-display text-3xl font-bold text-foreground text-center mb-4">Finish <span className="gold-gradient-text">Options</span></h2>
          <p className="text-center text-muted-foreground mb-12">Choose the perfect finish for your lifestyle and aesthetic preferences.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {finishes.map((f, i) => (
              <div key={i} className="elevated-card p-6 text-center">
                <h3 className="font-display font-bold text-foreground mb-2">{f.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{f.desc}</p>
                <span className="inline-block px-3 py-1 rounded-full bg-gold/10 text-gold text-xs font-semibold">{f.best}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-gradient-to-br from-gold-dark via-gold to-gold-light">
        <div className="container mx-auto text-center">
          <h2 className="font-display text-3xl font-bold text-primary-foreground mb-4">Ready to Restore Your Hardwood Floors?</h2>
          <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">Get a free flooring estimate and see how our professional refinishing can bring your floors back to life.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="default" size="xl" className="bg-background text-foreground hover:bg-background/90" asChild>
              <Link to="/contact">Get Your Free Estimate</Link>
            </Button>
            <Button variant="outline" size="xl" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" asChild>
              <Link to="/gallery">View Our Projects</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
