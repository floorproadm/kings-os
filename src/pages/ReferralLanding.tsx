import { useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, Phone, Send, Clock, Heart, Home, ShieldCheck, Gem, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { HK_ORG_ID } from "@/lib/constants";
import Layout from "@/components/Layout";

const services = [
  "Hardwood Floor Installation",
  "Sanding, Staining & Refinishing",
  "Staircase Design & Finishing",
  "Demolition & Replacement",
  "Vinyl & Engineered Wood Installation",
  "Deck & Handrail Refinishing",
  "Wash & Polish",
];

const differentials = [
  { icon: Clock, text: "We're Always On Time" },
  { icon: Heart, text: "We Go the Extra Mile" },
  { icon: Home, text: "We Respect Your Space" },
  { icon: ShieldCheck, text: "You Can Trust Us in Your Home" },
  { icon: Gem, text: "We Use Premium Materials" },
];

export default function ReferralLanding() {
  const { code } = useParams<{ code: string }>();
  const [form, setForm] = useState({
    name: "", phone: "", email: "", address: "", service: "", message: "",
  });
  const [loading, setLoading] = useState(false);

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validate referral code exists
    if (code) {
      const { data: codeData } = await supabase
        .from("referral_codes")
        .select("code")
        .eq("code", code)
        .eq("active", true)
        .maybeSingle();

      if (!codeData) {
        toast.error("Invalid referral code.");
        setLoading(false);
        return;
      }
    }

    const { error } = await supabase.from("leads").insert({
      org_id: HK_ORG_ID,
      name: form.name,
      phone: form.phone || null,
      email: form.email || null,
      address: form.address || null,
      service: form.service || null,
      message: form.message || null,
      source: "referral",
      referral_code: code || null,
    });
    setLoading(false);
    if (error) {
      toast.error("Something went wrong. Please try again.");
    } else {
      toast.success("Thank you! We'll contact you shortly.");
      setForm({ name: "", phone: "", email: "", address: "", service: "", message: "" });
    }
  };

  const inputCls =
    "w-full bg-input border border-border/50 rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 font-body text-sm";

  return (
    <Layout>
      <section className="section-padding bg-background text-center">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="text-gold text-sm tracking-[0.2em] uppercase font-semibold mb-4">You Were Referred</p>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              You Were Referred to Johnson County's Best{" "}
              <span className="gold-gradient-text">Hardwood Specialist</span>
            </h1>
            <p className="text-muted-foreground text-lg mb-6">Your neighbor trusts us. Now let us show you why.</p>
            <div className="inline-flex items-center gap-3 bg-card px-5 py-2.5 rounded-full border border-border/30">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-gold text-gold" />)}
              </div>
              <span className="text-sm text-foreground font-semibold">24+ years experience</span>
              <span className="text-muted-foreground text-sm flex items-center gap-1">
                <MapPin className="w-3 h-3" /> Johnson County, KS
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-secondary/30">
        <div className="container mx-auto px-4 max-w-xl">
          <form onSubmit={handleSubmit} className="elevated-card p-6 sm:p-8 space-y-4">
            <h2 className="font-display text-xl font-bold text-foreground mb-2 text-center">Get Your Free Estimate</h2>
            <input required placeholder="Your Name *" value={form.name} onChange={(e) => update("name", e.target.value)} className={inputCls} />
            <input required placeholder="Phone Number *" value={form.phone} onChange={(e) => update("phone", e.target.value)} className={inputCls} />
            <input type="email" placeholder="Email" value={form.email} onChange={(e) => update("email", e.target.value)} className={inputCls} />
            <input placeholder="Address" value={form.address} onChange={(e) => update("address", e.target.value)} className={inputCls} />
            <select value={form.service} onChange={(e) => update("service", e.target.value)} className={inputCls}>
              <option value="">Service Needed</option>
              {services.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <textarea rows={3} placeholder="Tell us about your project..." value={form.message} onChange={(e) => update("message", e.target.value)} className={`${inputCls} resize-none`} />
            <Button type="submit" variant="gold" size="xl" className="w-full" disabled={loading}>
              {loading ? "Sending..." : <><Send className="w-4 h-4 mr-2" /> Request Estimate</>}
            </Button>
          </form>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {differentials.map((d, i) => (
              <div key={i} className="elevated-card p-4 text-center">
                <d.icon className="w-6 h-6 text-gold mx-auto mb-2" />
                <p className="text-xs font-semibold text-foreground">{d.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding-sm bg-card text-center">
        <p className="text-muted-foreground">
          Questions? Call us:{" "}
          <a href="tel:+19139153193" className="text-gold font-bold hover:underline">(913) 915-3193</a>
        </p>
      </section>
    </Layout>
  );
}
