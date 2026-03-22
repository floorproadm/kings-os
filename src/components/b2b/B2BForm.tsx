import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { HK_ORG_ID } from "@/lib/constants";
import { motion } from "framer-motion";
import { formatPhone } from "@/lib/formatPhone";

const roles = ["Realtor", "Builder", "Property Manager", "Other"];

export default function B2BForm() {
  const [form, setForm] = useState({
    name: "", company: "", role: "", email: "", phone: "", message: "",
  });
  const [loading, setLoading] = useState(false);

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const fullMessage = [
      form.company ? `Company: ${form.company}` : "",
      form.role ? `Role: ${form.role}` : "",
      form.message,
    ].filter(Boolean).join("\n");

    const { error } = await supabase.from("leads").insert({
      org_id: HK_ORG_ID,
      name: form.name,
      email: form.email || null,
      phone: form.phone || null,
      message: fullMessage || null,
      source: "b2b",
    });
    setLoading(false);
    if (error) {
      toast.error("Something went wrong. Please try again.");
    } else {
      toast.success("Thank you! We'll reach out shortly.");
      setForm({ name: "", company: "", role: "", email: "", phone: "", message: "" });
    }
  };

  const inputCls =
    "w-full bg-input border border-border/50 rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 font-body text-sm";

  return (
    <section className="section-padding gold-gradient-bg">
      <div className="container mx-auto px-4 max-w-2xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="font-display text-3xl font-bold text-primary-foreground text-center mb-8"
        >
          Become a Trade Partner
        </motion.h2>
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="bg-background rounded-2xl p-6 sm:p-8 space-y-4 border border-border/30 shadow-2xl"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input required placeholder="Your Name *" value={form.name} onChange={(e) => update("name", e.target.value)} className={inputCls} />
            <input placeholder="Company Name" value={form.company} onChange={(e) => update("company", e.target.value)} className={inputCls} />
          </div>
          <select value={form.role} onChange={(e) => update("role", e.target.value)} className={inputCls}>
            <option value="">Select Your Role</option>
            {roles.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input required type="email" placeholder="Email *" value={form.email} onChange={(e) => update("email", e.target.value)} className={inputCls} />
            <input placeholder="Phone" value={form.phone} onChange={(e) => update("phone", e.target.value)} className={inputCls} />
          </div>
          <textarea rows={4} placeholder="Tell us about your needs..." value={form.message} onChange={(e) => update("message", e.target.value)} className={`${inputCls} resize-none`} />
          <Button type="submit" variant="gold" size="xl" className="w-full" disabled={loading}>
            {loading ? "Sending..." : <><Send className="w-4 h-4 mr-2" /> Submit Partnership Request</>}
          </Button>
        </motion.form>
      </div>
    </section>
  );
}
