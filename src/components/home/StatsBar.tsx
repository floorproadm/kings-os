import { useEffect, useRef, useState } from "react";
import { Star } from "lucide-react";

const stats = [
{ end: 24, suffix: "+", label: "Years of Experience" },
{ end: 1000, suffix: "+", label: "Projects Completed" },
{ end: 5, suffix: "★", label: "Google Rating" }];


function useCountUp(end: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {if (entry.isIntersecting) setStarted(true);},
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
    <section className="py-8 sm:py-10 bg-secondary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 gap-4 text-center">
          {stats.map((s, i) => {
            const { count, ref } = useCountUp(s.end);
            return (
              <div key={i} ref={ref}>
                <div className="flex items-center justify-center gap-1">
                  <span className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-gold-dark">
                    {s.end === 1000 ? count.toLocaleString() : count}
                    {s.suffix !== "★" && s.suffix}
                  </span>
                  {s.suffix === "★" &&
                  <Star className="w-6 h-6 sm:w-8 sm:h-8 fill-gold-dark text-gold-dark" />
                  }
                </div>
                <p className="text-sm sm:text-base text-gold-dark/70 mt-1 font-body">
                  {s.label}
                </p>
              </div>);

          })}
        </div>
      </div>
    </section>);

}