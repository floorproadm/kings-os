import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useRef } from "react";

const reviews = [
  { name: "Cristian Perez", text: "I was extremely impressed with the professionalism and quality of work delivered. The hardwood flooring came out beautiful — precise installation, great attention to detail, and completed on schedule." },
  { name: "Jordan B", text: "Thiago is the best! He knows what he is talking about when it comes to hardwood flooring and always makes sure I am satisfied with the end product!" },
  { name: "Mary Carol Williams", text: "What a positive experience! Thiago, owner of Hardwood Kings, is a perfectionist. He's conscientious, detailed oriented, and it's important to him and his workers to do the job right. I've used him in two of my homes." },
  { name: "Jessica Da Silva Penaforte", text: "I had an amazing experience with Hardwood Kings. The hardwood flooring looks absolutely stunning — elegant, warm, and finished to perfection. The staircase was also a highlight: solid, safe, and beautifully crafted." },
  { name: "Gabriela Tomazetti", text: "I had a great experience with Hardwood Kings. Their team was professional, punctual, and did an excellent job with my floors. Highly recommend!" },
  { name: "Brianna Townsend", text: "Thiago did the highest quality job upgrading the floors in our family's house. He was so friendly and easy to communicate with too." },
  { name: "Jeanne Siemion", text: "Reliable, professional hardwood flooring contractor that does excellent work. I recommend Hardwood Kings to all my family and friends!" },
  { name: "Aline Haro", text: "Excellent work. Very professional." },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 },
  }),
};

export default function TestimonialsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section id="testimonials" className="section-padding bg-gold-light">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          {/* Google badge */}
          <div className="inline-flex items-center gap-3 bg-background px-5 py-2.5 rounded-full border border-border/30 mb-8">
            <span className="font-display font-bold text-foreground text-sm">EXCELLENT</span>
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, j) => (
                <Star key={j} className="w-4 h-4 fill-gold text-gold" />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">Based on 10 reviews · Google</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-gold-dark">
            What Our Clients Are{" "}
            <span className="text-gold">Saying</span>
          </h2>
        </div>

        {/* Desktop grid, mobile horizontal scroll */}
        <div
          ref={scrollRef}
          className="flex lg:grid lg:grid-cols-4 gap-5 overflow-x-auto lg:overflow-visible snap-x snap-mandatory pb-4 lg:pb-0 -mx-4 px-4 lg:mx-0 lg:px-0"
        >
          {reviews.map((r, i) => (
            <motion.div
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i}
              className="min-w-[280px] lg:min-w-0 snap-start bg-background rounded-xl p-5 border border-border/30 shadow-lg shadow-black/10 flex flex-col"
            >
              <div className="flex gap-0.5 mb-3">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-3.5 h-3.5 fill-gold text-gold" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground italic leading-relaxed flex-1 mb-4">
                "{r.text}"
              </p>
              <div>
                <p className="font-display font-bold text-foreground text-sm">
                  {r.name}
                </p>
                <p className="text-xs text-gold">Google Review</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
