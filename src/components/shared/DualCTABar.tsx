import { Phone, Calendar, ArrowRight } from "lucide-react";

interface DualCTABarProps {
  variant?: "dark" | "gold";
  label?: string;
}

export default function DualCTABar({
  variant = "dark",
  label,
}: DualCTABarProps) {
  const isDark = variant === "dark";

  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className={`w-full py-5 px-4 ${
        isDark
          ? "bg-background border-y border-gold/10"
          : "bg-gradient-to-r from-gold-light/80 via-gold/70 to-gold-dark/80"
      }`}
    >
      <div className="max-w-3xl mx-auto flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">

        {label && (
          <p
            className={`text-[10px] font-semibold uppercase tracking-[0.25em] ${
              isDark ? "text-foreground/40" : "text-background/50"
            } sm:mr-2`}
          >
            {label}
          </p>
        )}

        <button
          onClick={scrollToContact}
          className={`group w-full sm:w-auto flex items-center justify-center gap-2 font-bold text-sm px-8 py-3 rounded-full transition-all duration-300 ${
            isDark
              ? "bg-gradient-to-r from-gold-dark via-gold to-gold-light hover:shadow-[0_0_28px_rgba(201,168,76,0.4)] text-primary-foreground shadow-[0_0_16px_rgba(201,168,76,0.2)]"
              : "bg-background hover:bg-muted text-foreground shadow-lg"
          }`}
        >
          <Calendar size={14} strokeWidth={2.5} />
          Free Estimate
          <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
        </button>

        <div className={`hidden sm:flex items-center gap-3 ${isDark ? "text-foreground/20" : "text-background/30"}`}>
          <div className="w-4 h-px bg-current" />
          <span className="text-[10px] uppercase tracking-[0.2em] font-medium">or</span>
          <div className="w-4 h-px bg-current" />
        </div>

        <a
          href="tel:+19139153193"
          className={`w-full sm:w-auto flex items-center justify-center gap-2 font-semibold text-sm px-6 py-3 rounded-full border transition-all duration-300 ${
            isDark
              ? "border-gold/25 text-gold hover:border-gold/60 hover:bg-gold/5"
              : "border-background/40 text-background hover:border-background hover:bg-background/10"
          }`}
        >
          <Phone size={14} strokeWidth={2.5} />
          <span className="tracking-wide">(913) 915-3193</span>
        </a>
      </div>
    </div>
  );
}