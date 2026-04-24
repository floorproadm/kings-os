import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Phone, CheckCircle, ImageIcon } from "lucide-react";
import { blurIn } from "@/lib/animations";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { serviceFallbackImageMap } from "@/constants/serviceImages";
import {
  TreePine, Paintbrush, ArrowUpDown, Layers, Fence,
} from "lucide-react";

const cardVariants = {
  hidden: (i: number) => ({
    opacity: 0,
    x: i % 2 === 0 ? -60 : 60,
    y: 20,
  }),
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    y: 0,
    transition: { duration: 0.6 },
  }),
};

const bulletVariants = {
  hidden: { opacity: 0, x: -15 },
  visible: (j: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: 0.3 + j * 0.08, duration: 0.4 },
  }),
};

const services = [
  {
    icon: TreePine,
    title: "Hardwood Floor Installation",
    bullets: [
      "Solid & engineered hardwood options",
      "Precision subfloor preparation",
      "Custom patterns & borders available",
      "Dust-controlled installation process",
    ],
  },
  {
    icon: Paintbrush,
    title: "Sanding, Staining & Refinishing",
    bullets: [
      "Complete floor restoration",
      "Custom stain color matching",
      "Dust-free sanding equipment",
      "Durable polyurethane finish",
    ],
  },
  {
    icon: ArrowUpDown,
    title: "Staircase Design & Finishing",
    bullets: [
      "Custom hardwood treads & risers",
      "Handrail refinishing & replacement",
      "Modern & classic design options",
      "Safe, code-compliant construction",
    ],
  },
  {
    icon: Layers,
    title: "Vinyl & Engineered Wood Installation",
    bullets: [
      "100% waterproof options",
      "Click-lock & glue-down methods",
      "Ideal for basements & kitchens",
      "Scratch & dent resistant",
    ],
  },
  {
    icon: Fence,
    title: "Deck & Handrail Refinishing",
    bullets: [
      "Sand, stain & seal outdoor wood",
      "Weather-resistant finish application",
      "Handrail restoration & replacement",
      "Extends the life of your deck",
    ],
  },
];

export default function Services() {
  const { data: serviceRows } = useQuery({
    queryKey: ["public-services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("title, image_url")
        .eq("is_active", true);

      if (error) throw error;
      return data;
    },
  });

  const serviceImageMap = Object.fromEntries(
    (serviceRows ?? []).map((service) => [service.title, service.image_url]),
  ) as Record<string, string | null>;

  return (
    <Layout>
      {/* Hero */}
      <section className="section-padding bg-background text-center">
        <div className="container mx-auto px-4">
          <p className="text-gold text-sm tracking-[0.2em] uppercase font-semibold mb-4">
            What We Do
          </p>
          <motion.h1 variants={blurIn} initial="hidden" animate="visible" className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4">
            Expert Hardwood Services in{" "}
            <span className="gold-gradient-text">Johnson County</span>
          </motion.h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            5 specialized services delivered with 24+ years of craftsmanship.
          </p>
        </div>
      </section>

      {/* Services grid */}
      <section className="section-padding bg-secondary/30">
        <div className="container mx-auto px-4 space-y-8">
          {services.map((s, i) => (
            <motion.div
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={cardVariants}
              custom={i}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center elevated-card overflow-hidden ${
                i % 2 === 1 ? "lg:direction-rtl" : ""
              }`}
            >
              {/* Image */}
              <div className={`aspect-[4/3] bg-card overflow-hidden ${i % 2 === 1 ? "lg:order-2" : ""}`}>
                {serviceImageMap[s.title] || serviceFallbackImageMap[s.title] ? (
                  <img
                    src={serviceImageMap[s.title] ?? serviceFallbackImageMap[s.title]}
                    alt={s.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <ImageIcon className="w-12 h-12 text-gold/30 mx-auto mb-2" />
                      <span className="text-sm text-muted-foreground">Photo coming soon</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className={`p-6 sm:p-8 ${i % 2 === 1 ? "lg:order-1" : ""}`}>
                <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center text-gold mb-4">
                  <s.icon className="w-6 h-6" />
                </div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                  {s.title}
                </h2>
                <ul className="space-y-3 mb-6">
                  {s.bullets.map((b, j) => (
                    <motion.li
                      key={j}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      variants={bulletVariants}
                      custom={j}
                      className="flex items-start gap-3 text-muted-foreground"
                    >
                      <CheckCircle className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{b}</span>
                    </motion.li>
                  ))}
                </ul>
                <Button variant="gold" size="lg" asChild>
                  <a href="tel:+19139153193">
                    <Phone className="w-4 h-4 mr-2" />
                    Get a Quote
                  </a>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="section-padding gold-gradient-bg text-center">
        <div className="container mx-auto px-4">
          <motion.h2 variants={blurIn} initial="hidden" whileInView="visible" viewport={{ once: true }} className="font-display text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">
            Ready to Start? Get Your Free Estimate
          </motion.h2>
          <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            Call us today for a free in-home consultation.
          </p>
          <Button variant="default" size="xl" className="bg-background text-foreground hover:bg-background/90" asChild>
            <a href="tel:+19139153193">
              <Phone className="w-4 h-4 mr-2" />
              (913) 915-3193
            </a>
          </Button>
        </div>
      </section>
    </Layout>
  );
}
