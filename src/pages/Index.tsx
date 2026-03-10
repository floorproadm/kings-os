import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Star, Crown, Zap, Shield, Clock, CheckCircle, Phone, ChevronRight, Sparkles } from "lucide-react";
import Layout from "@/components/Layout";
import heroImg from "@/assets/hero-flooring.jpg";
import serviceHardwood from "@/assets/service-hardwood.jpg";
import serviceSanding from "@/assets/service-sanding.jpg";
import serviceVinyl from "@/assets/service-vinyl.jpg";
import serviceStaircase from "@/assets/service-staircase.jpg";
import craftsman from "@/assets/craftsman.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const stats = [
  { value: "23+", label: "Years Experience" },
  { value: "1,000+", label: "Projects Completed" },
  { value: "5.0", label: "Google Rating", icon: <Star className="w-4 h-4 fill-gold text-gold" /> },
];

const services = [
  { icon: <Sparkles className="w-6 h-6" />, title: "Sanding & Finish", desc: "Restore your floors to their original beauty with professional refinishing services.", features: ["Complete Floor Restoration", "Dust-Controlled Sanding", "Durable Protective Finish"], img: serviceSanding, path: "/services/sanding" },
  { icon: <Crown className="w-6 h-6" />, title: "Hardwood Flooring", desc: "Timeless hardwood floors installed with precision and expert craftsmanship.", features: ["Professional Installation", "Solid & Engineered Hardwood", "Long-Lasting Durability"], img: serviceHardwood, path: "/services/hardwood" },
  { icon: <Shield className="w-6 h-6" />, title: "Luxury Vinyl Plank", desc: "Modern waterproof flooring that combines durability with the natural look of wood.", features: ["100% Waterproof", "Scratch Resistance", "Perfect For Busy Homes"], img: serviceVinyl, path: "/services/vinyl" },
  { icon: <Zap className="w-6 h-6" />, title: "Staircase Renovation", desc: "Upgrade your staircase with elegant hardwood steps and custom finishing.", features: ["Custom Hardwood Steps", "Modern Design Options", "Strong & Safe Construction"], img: serviceStaircase, path: "/services/staircase" },
];

const whyCards = [
  { icon: <Crown className="w-8 h-8 text-gold" />, title: "Experienced Craftsmen", desc: "Our owner brings over two decades of hands-on flooring experience, ensuring every project is completed with true craftsmanship.", stat: "23+ Years" },
  { icon: <Zap className="w-8 h-8 text-gold" />, title: "Reliable & Efficient", desc: "Our team delivers professional flooring projects completed on time and with precision.", stat: "14 Years in Business" },
  { icon: <Shield className="w-8 h-8 text-gold" />, title: "Quality Guarantee", desc: "Every installation and refinishing project is backed by our commitment to quality and satisfaction.", stat: "100% Satisfaction" },
  { icon: <Star className="w-8 h-8 text-gold" />, title: "5-Star Reviews", desc: "Homeowners trust Hardwood Kings for high-quality flooring results and reliable service.", stat: "5.0 ⭐ Rating" },
];

const testimonials = [
  { name: "Kira Mason", text: "I am a real estate agent and I've sent Tiago with Hardwood Kings to more of my clients than I can even count at this point, and every single one of them has been thrilled with his professionalism and the quality of his work. Tiago is one of the only contractors I can recommend wholeheartedly." },
  { name: "Dean Scott", text: "My wife and I closed on our house on Monday. I called Tiago on our way to settlement. He was on site and completed our floor refinishing project that same week. An absolute expert at his craft — high quality work at a fair price." },
  { name: "Maureen Reath", text: "Thiago, owner of Hardwood Kings Inc., earns my 5 star rating. He is attentive to detail in his work from start to finish. He starts on time, takes pride in his work, and does a thorough job site cleanup. I strongly recommend Hardwood Kings." },
];

export default function Index() {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImg} alt="Premium hardwood flooring" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/40" />
        </div>
        <div className="relative container mx-auto px-4 py-20">
          <motion.div className="max-w-2xl" initial="hidden" animate="visible">
            <motion.p variants={fadeUp} custom={0} className="text-gold font-semibold text-sm tracking-wider uppercase mb-4">
              Flooring Experts Serving Johnson County and Surrounding Areas
            </motion.p>
            <motion.h1 variants={fadeUp} custom={1} className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
              Transform Your Home with Expert Flooring{" "}
              <span className="gold-gradient-text">Installation & Refinishing</span>
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="text-lg text-muted-foreground mb-8 max-w-xl">
              Whether you need new flooring installation or professional refinishing, our team delivers beautiful, durable floors that transform the look and value of your home.
            </motion.p>
            <motion.div variants={fadeUp} custom={3} className="flex flex-col sm:flex-row gap-4">
              <Button variant="gold" size="xl" asChild>
                <Link to="/contact">Get Your Free Flooring Estimate</Link>
              </Button>
              <Button variant="goldOutline" size="xl" asChild>
                <a href="tel:9139153193">Call (913) 915-3193</a>
              </Button>
            </motion.div>
            <motion.p variants={fadeUp} custom={4} className="mt-4 text-xs text-muted-foreground">
              Free • No Obligation • Fast Response
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-secondary border-y border-border/50">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            {stats.map((s, i) => (
              <div key={i}>
                <div className="flex items-center justify-center gap-1">
                  <span className="text-2xl sm:text-3xl font-display font-bold text-gold">{s.value}</span>
                  {s.icon}
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section-padding">
        <div className="container mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 rounded-full bg-gold/10 text-gold text-xs font-semibold tracking-wider uppercase mb-4">
              ✨ Premium Flooring Services
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-3">
              Expert Flooring Installation & <span className="gold-gradient-text">Refinishing Services</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Upgrade your home with professionally installed or beautifully refinished floors built to last.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((s, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
                <Link to={s.path} className="group block elevated-card overflow-hidden hover:border-gold/40 transition-all duration-300">
                  <div className="h-48 overflow-hidden">
                    <img src={s.img} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-5">
                    <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center text-gold mb-3">
                      {s.icon}
                    </div>
                    <h3 className="font-display text-lg font-bold text-foreground mb-2">{s.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{s.desc}</p>
                    <ul className="space-y-1.5">
                      {s.features.map((f, j) => (
                        <li key={j} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <CheckCircle className="w-3.5 h-3.5 text-gold flex-shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 flex items-center gap-1 text-gold text-sm font-semibold group-hover:gap-2 transition-all">
                      Learn More <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding bg-secondary/50">
        <div className="container mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-3">
              Why Choose <span className="gold-gradient-text">Hardwood Kings?</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyCards.map((c, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i} className="elevated-card p-6 text-center">
                <div className="mx-auto w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center mb-4">{c.icon}</div>
                <h3 className="font-display text-base font-bold text-foreground mb-2">{c.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{c.desc}</p>
                <div className="text-gold font-bold text-lg font-display">{c.stat}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Craftsmanship */}
      <section className="section-padding">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-6">
                Craftsmanship That <span className="gold-gradient-text">Speaks for Itself</span>
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                With over 23 years of hands-on flooring experience, our owner Thiago Reis brings true artisan-level craftsmanship to every project. Every floor we install or restore reflects decades of dedication and expertise.
              </p>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                The name Hardwood Kings comes from the family name Reis, meaning "Kings" — representing the pride, craftsmanship, and responsibility behind every project.
              </p>
              <Button variant="goldOutline" size="lg" asChild>
                <Link to="/about">Learn Our Story</Link>
              </Button>
            </div>
            <div className="relative">
              <img src={craftsman} alt="Hardwood Kings craftsman at work" className="rounded-2xl shadow-2xl shadow-black/30" />
              <div className="absolute -bottom-4 -left-4 bg-gold text-primary-foreground px-6 py-3 rounded-xl font-display font-bold text-lg shadow-lg">
                23+ Years
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-secondary/50">
        <div className="container mx-auto">
          <div className="text-center mb-14">
            <span className="text-gold text-xs font-semibold tracking-wider uppercase mb-4 block">Testimonials</span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-3">
              See What Our <span className="gold-gradient-text">Customers</span> Are Saying
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Homeowners trust Hardwood Kings for high-quality flooring installation and refinishing services.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i} className="elevated-card p-6">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-gold text-gold" />)}
                </div>
                <p className="text-sm text-muted-foreground italic leading-relaxed mb-4">"{t.text}"</p>
                <p className="font-display font-bold text-foreground">{t.name}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 bg-card px-4 py-2 rounded-lg border border-border/50">
              <span className="text-sm font-bold text-foreground">EXCELLENT</span>
              <div className="flex gap-0.5">{[...Array(5)].map((_, j) => <Star key={j} className="w-3.5 h-3.5 fill-gold text-gold" />)}</div>
              <span className="text-xs text-muted-foreground">Based on 35+ Reviews on Google</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-gradient-to-br from-gold-dark via-gold to-gold-light">
        <div className="container mx-auto text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">
            Let's Build Something Beautiful, Together.
          </h2>
          <p className="text-primary-foreground/80 max-w-xl mx-auto mb-8">
            Ready to transform your home? Get your free flooring estimate with fast response from our local experts.
          </p>
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

      {/* Service Areas */}
      <section className="section-padding-sm">
        <div className="container mx-auto text-center">
          <h3 className="font-display text-lg font-bold text-foreground mb-3">Service Areas in Johnson County</h3>
          <p className="text-xs text-muted-foreground max-w-2xl mx-auto">
            Overland Park • Olathe • Lenexa • Shawnee • Leawood • Prairie Village • Mission • Roeland Park • Fairway • Merriam • Kansas City, KS • Kansas City, MO • Lee's Summit
          </p>
        </div>
      </section>
    </Layout>
  );
}
