import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { TrendingUp, Camera, Clock, DollarSign, Calendar, Shield, Star, Zap, Image } from "lucide-react";
import { blurIn } from "@/lib/animations";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const cards = [
  { icon: <TrendingUp className="w-6 h-6 text-gold" />, title: "Increase Listing Value", desc: "Refinished floors can increase perceived value by $5,000–$15,000 or more." },
  { icon: <Camera className="w-6 h-6 text-gold" />, title: "Picture-Perfect Listings", desc: "Beautiful floors dramatically improve listing photos and attract more buyers." },
  { icon: <Clock className="w-6 h-6 text-gold" />, title: "Fast Turnaround", desc: "Most projects completed within 2–5 days to list faster." },
  { icon: <DollarSign className="w-6 h-6 text-gold" />, title: "Realtor Pricing", desc: "Exclusive pricing for real estate professionals and their clients." },
  { icon: <Calendar className="w-6 h-6 text-gold" />, title: "Flexible Scheduling", desc: "We coordinate around showings, inspections, and closings." },
  { icon: <Shield className="w-6 h-6 text-gold" />, title: "Quality Guarantee", desc: "Professional craftsmanship that gives buyers confidence." },
];

const highlights = [
  { icon: <Camera className="w-5 h-5 text-gold" />, title: "Better Listing Photos", desc: "Refinished floors dramatically improve how homes appear on Zillow, Redfin, and MLS listings." },
  { icon: <TrendingUp className="w-5 h-5 text-gold" />, title: "Higher Perceived Value", desc: "Updated floors make homes feel newer, cleaner, and more move-in ready." },
  { icon: <Zap className="w-5 h-5 text-gold" />, title: "Faster Time on Market", desc: "Homes with attractive flooring often receive more showings and stronger offers." },
];

const testimonials = [
  { text: "The refinished floors completely transformed the listing. The photos looked incredible and the home attracted multiple showings immediately.", author: "Local Realtor" },
  { text: "The turnaround was fast and the results were amazing. The updated floors made the property feel like a completely different home.", author: "Real Estate Professional" },
];

export default function Realtors() {
  return (
    <Layout>
      <section className="section-padding bg-secondary/50">
        <div className="container mx-auto text-center">
          <p className="text-gold font-semibold text-sm uppercase tracking-wider mb-3">For Real Estate Professionals</p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Flooring Partner for <span className="gold-gradient-text">Johnson County Realtors</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">Transform outdated floors into a powerful selling feature. Fast refinishing, professional installation, and realtor-friendly pricing.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="gold" size="xl" asChild>
              <Link to="/contact">Get Realtor Pricing</Link>
            </Button>
            <Button variant="goldOutline" size="xl" asChild>
              <Link to="/gallery">See Transformations</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container mx-auto">
          <h2 className="font-display text-3xl font-bold text-foreground text-center mb-4">Turn Problem Properties into <span className="gold-gradient-text">Premium Listings</span></h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">Scratched or outdated floors can turn buyers away. Our services transform those floors into a major selling feature.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((c, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i} className="elevated-card p-6">
                <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center mb-4">{c.icon}</div>
                <h3 className="font-display font-bold text-foreground mb-2">{c.title}</h3>
                <p className="text-sm text-muted-foreground">{c.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="section-padding bg-secondary/50">
        <div className="container mx-auto max-w-4xl">
          <h2 className="font-display text-2xl font-bold text-foreground text-center mb-8">Turn Outdated Floors into <span className="gold-gradient-text">Listing Highlights</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {highlights.map((h, i) => (
              <div key={i} className="elevated-card p-6 text-center">
                <div className="mx-auto w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center mb-3">{h.icon}</div>
                <h3 className="font-display font-bold text-foreground mb-2">{h.title}</h3>
                <p className="text-sm text-muted-foreground">{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding">
        <div className="container mx-auto max-w-3xl">
          <h2 className="font-display text-2xl font-bold text-foreground text-center mb-8">What Realtors <span className="gold-gradient-text">Say</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="elevated-card p-6">
                <div className="flex gap-0.5 mb-3">{[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-gold text-gold" />)}</div>
                <p className="text-sm text-muted-foreground italic mb-4">"{t.text}"</p>
                <p className="font-display font-bold text-foreground text-sm">{t.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-gradient-to-r from-gold-light/80 via-gold/70 to-gold-dark/80">
        <div className="container mx-auto text-center">
          <h2 className="font-display text-3xl font-bold text-primary-foreground mb-4">Ready to Partner with Us?</h2>
          <p className="text-primary-foreground/80 mb-8">Get your custom realtor pricing sheet within 48 hours.</p>
          <Button variant="default" size="xl" className="bg-background text-foreground hover:bg-background/90" asChild>
            <Link to="/contact">Get Realtor Pricing</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}
