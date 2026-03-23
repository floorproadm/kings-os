import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useState } from "react";

const reviews = [
{ name: "Cristian Perez", text: "I was extremely impressed with the professionalism and quality of work delivered. The hardwood flooring came out beautiful — precise installation, great attention to detail, and completed on schedule.", time: "2 months ago" },
{ name: "Jordan B", text: "Thiago is the best! He knows what he is talking about when it comes to hardwood flooring and always makes sure I am satisfied with the end product!", time: "3 months ago" },
{ name: "Mary Carol Williams", text: "What a positive experience! Thiago, owner of Hardwood Kings, is a perfectionist. He's conscientious, detailed oriented, and it's important to him and his workers to do the job right. I've used him in two of my homes.", time: "4 months ago" },
{ name: "Jessica Da Silva Penaforte", text: "I had an amazing experience with Hardwood Kings. The hardwood flooring looks absolutely stunning — elegant, warm, and finished to perfection. The staircase was also a highlight: solid, safe, and beautifully crafted.", time: "5 months ago" },
{ name: "Gabriela Tomazetti", text: "I had a great experience with Hardwood Kings. Their team was professional, punctual, and did an excellent job with my floors. Highly recommend!", time: "6 months ago" },
{ name: "Brianna Townsend", text: "Thiago did the highest quality job upgrading the floors in our family's house. He was so friendly and easy to communicate with too.", time: "7 months ago" },
{ name: "Jeanne Siemion", text: "Reliable, professional hardwood flooring contractor that does excellent work. I recommend Hardwood Kings to all my family and friends!", time: "8 months ago" },
{ name: "Aline Haro", text: "Excellent work. Very professional.", time: "9 months ago" }];

const avatarColors = [
"bg-red-600", "bg-blue-600", "bg-green-600", "bg-purple-600",
"bg-orange-500", "bg-teal-600", "bg-pink-600", "bg-indigo-600"];

function GoogleIcon({ className }: {className?: string;}) {
  return (
    <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>);
}

function ReviewCard({ review, index, expanded, onToggle }: {
  review: typeof reviews[0];
  index: number;
  expanded: boolean;
  onToggle: () => void;
}) {
  const initial = review.name.charAt(0).toUpperCase();
  const isLong = review.text.length > 120;
  const displayText = isLong && !expanded ? review.text.slice(0, 120) + "..." : review.text;

  return (
    <div className="bg-background rounded-xl p-5 border border-border/30 shadow-lg shadow-black/10 flex flex-col h-full w-[340px] shrink-0">
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-9 h-9 rounded-full ${avatarColors[index % avatarColors.length]} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
          {initial}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-display font-bold text-foreground text-sm truncate">{review.name}</p>
          <p className="text-xs text-muted-foreground">{review.time}</p>
        </div>
        <GoogleIcon className="w-5 h-5 shrink-0" />
      </div>

      {/* Stars */}
      <div className="flex items-center gap-1 mb-3">
        {[...Array(5)].map((_, j) =>
        <Star key={j} className="w-4 h-4 fill-[#FBBC05] text-[#FBBC05]" />
        )}
        <span className="text-[10px] text-muted-foreground ml-1 font-medium">Verified</span>
      </div>

      {/* Text */}
      <p className="text-sm text-muted-foreground leading-relaxed flex-1">
        "{displayText}"
      </p>
      {isLong &&
      <button onClick={onToggle} className="text-xs text-gold font-medium mt-2 text-left hover:underline">
          {expanded ? "Show less" : "Read more"}
        </button>
      }
    </div>
  );
}

export default function TestimonialsSection() {
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());

  const toggleCard = (i: number) => {
    setExpandedCards((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  return (
    <section id="testimonials" className="section-padding bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10">
          
          {/* Google badge */}
          <div className="inline-flex items-center gap-3 bg-background px-5 py-2.5 rounded-full border border-border/30 mb-6">
            <GoogleIcon className="w-5 h-5" />
            <span className="font-display font-bold text-foreground text-sm">EXCELLENT</span>
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, j) =>
              <Star key={j} className="w-4 h-4 fill-[#FBBC05] text-[#FBBC05]" />
              )}
            </div>
            <span className="text-xs text-muted-foreground hidden sm:inline">Based on 10 reviews</span>
          </div>

          <motion.h2 initial={{ opacity: 0, y: 20, filter: "blur(10px)" }} whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }} viewport={{ once: true }} transition={{ duration: 0.7, ease: "easeOut" }} className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-gold-dark">
            What Our Clients Are{" "}
            <span className="text-gold">Saying</span>
          </motion.h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto text-sm sm:text-base">
            Real reviews from real homeowners — verified on Google.
          </p>
        </motion.div>

        {/* Marquee */}
        <div className="relative overflow-hidden">
          {/* Fade edges */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-32 sm:w-40 z-10 bg-gradient-to-r from-white via-white/80 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-32 sm:w-40 z-10 bg-gradient-to-l from-white via-white/80 to-transparent" />

          <div
            className="flex gap-4 animate-marquee hover:[animation-play-state:paused]"
            style={{ "--duration": "20s", "--gap": "1rem" } as React.CSSProperties}
          >
            {/* Duplicate reviews for seamless loop */}
            {[...Array(4)].map((_, setIndex) =>
              reviews.map((r, i) => {
                const globalIndex = setIndex * reviews.length + i;
                return (
                  <ReviewCard
                    key={`${setIndex}-${i}`}
                    review={r}
                    index={i}
                    expanded={expandedCards.has(globalIndex)}
                    onToggle={() => toggleCard(globalIndex)}
                  />
                );
              })
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
