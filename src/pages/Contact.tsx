import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle, Phone, Mail, Clock, Shield, MapPin, ChevronDown } from "lucide-react";
import Layout from "@/components/Layout";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { HK_ORG_ID } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";
import { blurIn } from "@/lib/animations";
import { formatPhone } from "@/lib/formatPhone";
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const faqs = [
  { q: "How soon can you come?", a: "Within 48 hours for estimates or sooner." },
  { q: "How long does refinishing take?", a: "2–5 days on average." },
  { q: "Is there dust?", a: "We use a dust-controlled sanding process for minimal mess." },
];

const whyPoints = [
  { title: "Free In-Home Flooring Estimate", desc: "Fast response from experienced flooring professionals" },
  { title: "23+ Years of Flooring Experience", desc: "Trusted craftsmanship and expert installation" },
  { title: "Licensed, Insured & Professional Team", desc: "Reliable service you can trust in your home" },
  { title: "Most Projects Completed in 3–5 Days", desc: "Efficient work with beautiful results" },
  { title: "Save Up to 40% with Refinishing", desc: "Restore your floors instead of replacing them" },
  { title: "Dust-Controlled Sanding Process", desc: "Clean, professional sanding technology" },
];

export default function Contact() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", city: "", service: "", timeline: "" });
  const [whyOpen, setWhyOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const { error } = await supabase.from("leads").insert({
      org_id: HK_ORG_ID,
      name: form.name,
      phone: form.phone,
      email: form.email || null,
      service: form.service || null,
      message: form.timeline ? `City: ${form.city || "N/A"} | Timeline: ${form.timeline}` : form.city ? `City: ${form.city}` : null,
      source: "contact-page",
      status: "new",
    });

    if (error) {
      console.error("Lead insert error:", error);
      toast({ title: "Error", description: "Could not submit your request. Please try again.", variant: "destructive" });
      setSubmitting(false);
      return;
    }

    window.location.href = "/thank-you";
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="section-padding bg-secondary/50">
        <div className="container mx-auto text-center">
          <motion.h1 variants={blurIn} initial="hidden" animate="visible" className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Get Your Free Flooring Estimate — <span className="gold-gradient-text">Fast Response</span>
          </motion.h1>
          <div className="flex flex-wrap justify-center gap-4 mt-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-gold" /> Free Estimates</span>
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-gold" /> Fast Response</span>
            <span className="flex items-center gap-1.5"><Shield className="w-4 h-4 text-gold" /> Licensed & Insured</span>
          </div>
        </div>
      </section>

      {/* Form + Sidebar */}
      <section className="section-padding">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            {/* Form */}
            <div className="lg:col-span-3">
              <div className="bg-background border border-gold/15 rounded-2xl p-8">
                <h2 className="font-display text-2xl font-bold text-foreground mb-1">Get Your Free Flooring Estimate</h2>
                <p className="text-sm text-muted-foreground mb-6">Takes less than 60 seconds</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold tracking-[0.15em] uppercase text-muted-foreground mb-1.5 block">Name *</label>
                      <input type="text" required maxLength={100} value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-background border border-gold/25 rounded-md px-4 py-3 text-foreground text-sm placeholder:text-foreground/30 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/40 transition-all duration-200" />
                    </div>
                    <div>
                      <label className="text-xs font-bold tracking-[0.15em] uppercase text-muted-foreground mb-1.5 block">Phone *</label>
                      <input type="tel" required value={form.phone} onChange={e => setForm({...form, phone: formatPhone(e.target.value)})} className="w-full bg-background border border-gold/25 rounded-md px-4 py-3 text-foreground text-sm placeholder:text-foreground/30 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/40 transition-all duration-200" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold tracking-[0.15em] uppercase text-muted-foreground mb-1.5 block">Email (Optional)</label>
                      <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full bg-background border border-gold/25 rounded-md px-4 py-3 text-foreground text-sm placeholder:text-foreground/30 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/40 transition-all duration-200" />
                    </div>
                    <div>
                      <label className="text-xs font-bold tracking-[0.15em] uppercase text-muted-foreground mb-1.5 block">City (Optional)</label>
                      <input type="text" value={form.city} onChange={e => setForm({...form, city: e.target.value})} className="w-full bg-background border border-gold/25 rounded-md px-4 py-3 text-foreground text-sm placeholder:text-foreground/30 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/40 transition-all duration-200" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold tracking-[0.15em] uppercase text-muted-foreground mb-1.5 block">Service Needed</label>
                    <select value={form.service} onChange={e => setForm({...form, service: e.target.value})} className="w-full bg-background border border-gold/25 rounded-md px-4 py-3 text-foreground text-sm placeholder:text-foreground/30 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/40 transition-all duration-200 cursor-pointer">
                      <option value="">Select a service</option>
                      <option>Hardwood Floor Installation</option>
                      <option>Sanding & Refinishing</option>
                      <option>Vinyl Plank Flooring</option>
                      <option>Staircase Installation</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold tracking-[0.15em] uppercase text-muted-foreground mb-1.5 block">Project Timeline</label>
                    <select value={form.timeline} onChange={e => setForm({...form, timeline: e.target.value})} className="w-full bg-background border border-gold/25 rounded-md px-4 py-3 text-foreground text-sm placeholder:text-foreground/30 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/40 transition-all duration-200 cursor-pointer">
                      <option value="">Select timeline</option>
                      <option>ASAP</option>
                      <option>This month</option>
                      <option>Next 3 months</option>
                      <option>Just Planning</option>
                    </select>
                  </div>
                  <Button variant="gold" size="xl" className="w-full" type="submit" disabled={submitting}>
                    {submitting ? "Submitting..." : "Get Your Free Estimate"}
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">100% Free Estimate • No Obligation • We Respect Your Privacy</p>
                </form>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-2 space-y-6">
              <div className="elevated-card p-6">
                <h3 className="font-display text-lg font-bold text-foreground mb-4">Contact Directly</h3>
                <div className="space-y-3">
                  <a href="tel:9139153193" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-gold transition-colors">
                    <Phone className="w-4 h-4 text-gold" /> (913) 915-3193
                  </a>
                  <a href="mailto:hardwoodkingsinc@gmail.com" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-gold transition-colors">
                    <Mail className="w-4 h-4 text-gold" /> hardwoodkingsinc@gmail.com
                  </a>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 text-gold" /> Johnson County, KS
                  </div>
                </div>
              </div>

              {/* Why Choose — Toggle */}
              <div className="elevated-card overflow-hidden">
                <button
                  onClick={() => setWhyOpen(!whyOpen)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <h3 className="font-display text-lg font-bold text-foreground">Why Choose Hardwood Kings?</h3>
                  <ChevronDown className={`w-5 h-5 text-gold transition-transform duration-300 ${whyOpen ? "rotate-180" : ""}`} />
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: whyOpen ? "auto" : 0, opacity: whyOpen ? 1 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <ul className="space-y-4 px-6 pb-6">
                    {whyPoints.map((p, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-sm text-foreground">{p.title}</p>
                          <p className="text-xs text-muted-foreground">{p.desc}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-secondary/50">
        <div className="container mx-auto max-w-3xl">
          <h2 className="font-display text-2xl font-bold text-foreground text-center mb-8">Have Questions Before Booking?</h2>
          <div className="space-y-4">
            {faqs.map((f, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                className="relative rounded-2xl border border-gold/20 bg-background p-5 flex gap-4 items-center overflow-hidden shadow-[0_0_15px_rgba(201,168,76,0.08)]"
              >
                <div className="w-10 h-10 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-5 h-5 text-gold" />
                </div>
                <div className="flex-1">
                  <h3 className="font-display font-bold text-foreground text-sm mb-1">{f.q}</h3>
                  <p className="text-xs text-foreground/60">{f.a}</p>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-gold-light via-gold to-gold-dark" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
