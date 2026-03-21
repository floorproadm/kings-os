import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Crown, Heart, Eye, Users, Star, CheckCircle } from "lucide-react";
import Layout from "@/components/Layout";
import craftsman from "@/assets/craftsman.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } })
};

const values = [
{ icon: <Eye className="w-6 h-6 text-gold" />, title: "Hands-On Leadership", desc: "Our leadership is not behind a desk. We are directly involved in every project." },
{ icon: <Crown className="w-6 h-6 text-gold" />, title: "Craftsmanship You Can Trust", desc: "Every detail matters. If we wouldn't install it in our own home, we won't install it in yours." },
{ icon: <Heart className="w-6 h-6 text-gold" />, title: "Built on Legacy and Hard Work", desc: "Hardwood Kings was built through years of dedication, experience, and pride in honest craftsmanship." },
{ icon: <Users className="w-6 h-6 text-gold" />, title: "Client-First Service", desc: "We respect your home, your time, and your expectations." }];


const stats = [
{ value: "1k+", label: "Projects Completed" },
{ value: "23+", label: "Years Experience" },
{ value: "100%", label: "Satisfaction Rate" }];


export default function About() {
  return (
    <Layout>
      <section className="section-padding bg-secondary/50">
        <div className="container mx-auto text-center">
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4">
            About <span className="gold-gradient-text">Hardwood Kings</span>
          </h1>
        </div>
      </section>

      {/* Founder Story */}
      <section className="section-padding">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <motion.h2 variants={fadeUp} custom={0} className="font-display text-3xl font-bold text-foreground mb-6">
                The Story Behind <span className="gold-gradient-text">the Name</span>
              </motion.h2>
              <motion.div variants={fadeUp} custom={1} className="space-y-4 text-muted-foreground leading-relaxed">
                <p>My name is <strong className="text-foreground">Thiago Reis</strong>, but most people know me simply as <strong className="text-foreground">T. Reis</strong>.</p>
                <p>I've been working with hardwood flooring for over <strong className="text-gold">23 years</strong>, and for the past 14 years I've proudly owned and operated Hardwood Kings Inc.</p>
                <p>I was born in Brazil, but the United States is where I built my life, my family, and my values. Becoming an American citizen is one of my greatest sources of pride.</p>
                <p>The name <strong className="text-gold">Hardwood Kings</strong> comes from my family name — <em>Reis</em>, which means "Kings." It represents the pride, craftsmanship, and responsibility I bring to every project.</p>
              </motion.div>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <img src={craftsman} alt="Thiago Reis - Founder" className="rounded-2xl shadow-2xl shadow-black/30" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Family Business */}
      





      

      {/* Values */}
      <section className="section-padding">
        <div className="container mx-auto">
          <h2 className="font-display text-3xl font-bold text-foreground text-center mb-12">Our <span className="gold-gradient-text">Values</span></h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) =>
            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i} className="elevated-card p-6 text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mb-4">{v.icon}</div>
                <h3 className="font-display font-bold text-foreground mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground">{v.desc}</p>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Promise */}
      <section className="section-padding bg-secondary/50">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="font-display text-3xl font-bold text-foreground mb-6">Our <span className="gold-gradient-text">Promise</span></h2>
          <p className="text-muted-foreground leading-relaxed mb-4">When you choose Hardwood Kings, you're not hiring just another contractor. You are trusting a family-owned flooring company with over two decades of experience that treats every project as if it were our own home.</p>
          <p className="text-muted-foreground leading-relaxed">Our mission is simple: Deliver results with <strong className="text-gold">pride, precision, and integrity</strong>.</p>
        </div>
      </section>

      {/* Stats */}
      <section className="section-padding-sm">
        <div className="container mx-auto">
          <div className="grid grid-cols-3 gap-4 text-center">
            {stats.map((s, i) =>
            <div key={i} className="elevated-card p-6">
                <div className="text-3xl font-display font-bold text-gold">{s.value}</div>
                <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-gradient-to-br from-gold-dark via-gold to-gold-light">
        <div className="container mx-auto text-center">
          <h2 className="font-display text-3xl font-bold text-primary-foreground mb-4">Ready to Transform Your Floors?</h2>
          <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">Request your free in-home consultation today.</p>
          <Button variant="default" size="xl" className="bg-background text-foreground hover:bg-background/90" asChild>
            <Link to="/contact">Get Your Free Consultation</Link>
          </Button>
        </div>
      </section>
    </Layout>);

}