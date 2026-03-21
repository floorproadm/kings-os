import { motion } from "framer-motion";
import { Phone, TrendingUp, Clock, Camera, CalendarCheck, BadgeDollarSign, Building2, Timer, DollarSign, Repeat } from "lucide-react";
import { Button } from "@/components/ui/button";

const segments = [
  {
    label: "For Real Estate Agents",
    headline: "Pre-Listing Floor Boost — Sell Faster, List Higher",
    copy: "Floors are the first thing buyers notice. We restore and refinish before your listing goes live — increasing perceived value and reducing time on market.",
    benefits: [
      { icon: TrendingUp, text: "Increase home value" },
      { icon: Clock, text: "Faster closing" },
      { icon: Camera, text: "Better listing photos" },
    ],
    cta: "Schedule a Pre-Listing Consultation",
  },
  {
    label: "For Builders",
    headline: "Volume Installation Package — On Time, Every Time",
    copy: "We understand construction deadlines. Our team delivers consistent quality across multiple units with bulk pricing and flexible scheduling.",
    benefits: [
      { icon: CalendarCheck, text: "Deadline guarantee" },
      { icon: BadgeDollarSign, text: "Volume discounts" },
      { icon: Building2, text: "Multi-unit experience" },
    ],
    cta: "Request a Builder Quote",
  },
  {
    label: "For Property Managers",
    headline: "Rental Turnover Program — Reduce Vacancy Fast",
    copy: "Between tenants? We resurface, sand, and refinish floors quickly so your units are market-ready with minimal downtime.",
    benefits: [
      { icon: Timer, text: "48-72h turnaround" },
      { icon: DollarSign, text: "Competitive pricing" },
      { icon: Repeat, text: "Repeat partner rates" },
    ],
    cta: "Start Turnover Program",
  },
];

export default function B2BSegments() {
  return (
    <section className="bg-secondary/30">
      {segments.map((seg, i) => (
        <div
          key={i}
          className={`section-padding ${i % 2 === 1 ? "bg-gold-light" : "bg-background"}`}
        >
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                i % 2 === 1 ? "lg:[direction:rtl]" : ""
              }`}
            >
              <div className={i % 2 === 1 ? "lg:[direction:ltr]" : ""}>
                <span className="text-gold text-sm tracking-[0.2em] uppercase font-semibold mb-3 block">
                  {seg.label}
                </span>
                <h2 className={`font-display text-2xl sm:text-3xl font-bold mb-4 ${
                  i % 2 === 1 ? "text-gold-dark" : "text-foreground"
                }`}>
                  {seg.headline}
                </h2>
                <p className={`leading-relaxed mb-6 ${
                  i % 2 === 1 ? "text-gold-dark/70" : "text-muted-foreground"
                }`}>
                  {seg.copy}
                </p>
                <div className="flex flex-wrap gap-4 mb-8">
                  {seg.benefits.map((b, j) => (
                    <div key={j} className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center">
                        <b.icon className="w-4 h-4 text-gold" />
                      </div>
                      <span className={`text-sm font-semibold ${
                        i % 2 === 1 ? "text-gold-dark" : "text-foreground"
                      }`}>
                        {b.text}
                      </span>
                    </div>
                  ))}
                </div>
                <Button variant="gold" size="lg" asChild>
                  <a href="tel:+19139153193">
                    <Phone className="w-4 h-4 mr-2" />
                    {seg.cta}
                  </a>
                </Button>
              </div>

              {/* Visual placeholder */}
              <div className={`aspect-[4/3] rounded-xl border-2 border-dashed ${
                i % 2 === 1 ? "border-gold-dark/20 bg-gold-dark/5" : "border-gold/20 bg-card/50"
              } flex items-center justify-center ${i % 2 === 1 ? "lg:[direction:ltr]" : ""}`}>
                <span className={`text-sm ${i % 2 === 1 ? "text-gold-dark/40" : "text-muted-foreground"}`}>
                  Visual coming soon
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      ))}
    </section>
  );
}
