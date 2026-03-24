import { useEffect, useRef, useState } from "react";
import { Shield, CheckCircle, Star } from "lucide-react";

const stats = [
  { end: 24, suffix: "+", label: "YEARS OF EXPERIENCE", icon: Shield },
  { end: 1000, suffix: "+", label: "PROJECTS COMPLETED", icon: CheckCircle },
  { end: 5, suffix: "★", label: "GOOGLE RATING", icon: Star },
];

function useCountUp(end: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const steps = 60;
    const increment = end / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if (current >= end) {
        setCount(end);
        clearInterval(interval);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(interval);
  }, [started, end, duration]);

  return { count, ref };
}

export default function StatsBar() {
  return (
    <section className="py-10 sm:py-12 bg-gradient-to-b from-white to-gold/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 text-center">
          {stats.map((s, i) => {
            const { count, ref } = useCountUp(s.end);
            const Icon = s.icon;
            return (
              <div
                key={i}
                ref={ref}
                className={`flex flex-col items-center gap-2 py-2 ${
                  i < stats.length - 1 ? "border-r border-gold/20" : ""
                }`}
              >
                <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-gold-dark/60" />
                <div className="flex items-center justify-center gap-1">
                  <span className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-gold-dark tracking-wide">
                    {s.end === 1000 ? count.toLocaleString() : count}
                    {s.suffix !== "★" && s.suffix}
                  </span>
                  {s.suffix === "★" && (
                    <Star className="w-6 h-6 sm:w-8 sm:h-8 fill-gold-dark text-gold-dark" />
                  )}
                </div>
                <p className="text-[10px] sm:text-xs text-gold-dark/60 font-body uppercase tracking-[0.15em]">
                  {s.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
