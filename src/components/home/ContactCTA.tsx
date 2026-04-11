import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, CheckCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { HK_ORG_ID } from "@/lib/constants";
import { formatPhone } from "@/lib/formatPhone";

const services = [
  "Hardwood Floor Installation",
  "Sanding, Staining & Refinishing",
  "Staircase Design & Finishing",
  "Demolition & Replacement",
  "Vinyl & Engineered Wood Installation",
  "Deck & Handrail Refinishing",
  "Wash & Polish",
];

const bullets = [
  "Flexible Scheduling",
  "Clear Communication",
  "Work You Can Trust",
];

export default function ContactCTA() {
  const [form, setForm] = useState({
    name: "", email: "", phone: "", service: "", message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from("leads").insert({
      org_id: HK_ORG_ID,
      name: form.name,
      email: form.email || null,
      phone: form.phone || null,
      service: form.service || null,
      message: form.message || null,
      source: "website-hero",
    });
    setLoading(false);
    if (error) {
      toast.error("Something went wrong. Please try again.");
    } else {
      toast.success("Message sent! We'll be in touch soon.");
      setForm({ name: "", email: "", phone: "", service: "", message: "" });
    }
  };

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const inputCls =
    "w-full bg-input border border-border/50 rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 font-body text-sm";

  return (
    <section id="contact" className="section-padding bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-6 leading-tight">
              Let's Build Something{" "}
              <span className="gold-gradient-text">Beautiful, Together.</span>
            </h2>
            <ul className="space-y-4 mb-10">
              {bullets.map((b) => (
                <li key={b} className="flex items-center gap-3 text-muted-foreground">
                  <CheckCircle className="w-5 h-5 text-gold flex-shrink-0" />
                  <span className="font-body">{b}</span>
                </li>
              ))}
            </ul>
            <Button variant="gold" size="xl" asChild>
              <a href="tel:+19139153193">
                <Phone className="w-4 h-4 mr-2" />
                Call Now: (913) 915-3193
              </a>
            </Button>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="elevated-card p-6 sm:p-8 space-y-4"
          >
            <input required placeholder="Your Name *" maxLength={100} value={form.name} onChange={(e) => update("name", e.target.value)} className={inputCls} />
            <input required type="email" placeholder="Email Address *" maxLength={100} value={form.email} onChange={(e) => update("email", e.target.value)} className={inputCls} />
            <input type="tel" placeholder="Phone Number" value={form.phone} onChange={(e) => update("phone", formatPhone(e.target.value))} className={inputCls} />
            <select value={form.service} onChange={(e) => update("service", e.target.value)} className={inputCls}>
              <option value="">Select a Service</option>
              {services.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <textarea rows={4} placeholder="Tell us about your project..." maxLength={1000} value={form.message} onChange={(e) => update("message", e.target.value)} className={`${inputCls} resize-none`} />
            <Button type="submit" variant="gold" size="xl" className="w-full" disabled={loading}>
              {loading ? "Sending..." : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </>
              )}
            </Button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
