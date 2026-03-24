import { Phone, Calendar } from "lucide-react";

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
      className={`w-full py-6 px-4 ${
        isDark
          ? "bg-background border-y border-gold/15"
          : "bg-gradient-to-r from-gold-light/80 via-gold/70 to-gold-dark/80"
      }`}
    >
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-8">

        {label && (
          <p
            className={`text-xs font-semibold uppercase tracking-[0.2em] ${
              isDark ? "text-foreground/50" : "text-background/60"
            } sm:mr-4`}
          >
            {label}
          </p>
        )}

        <button
          onClick={scrollToContact}
          className={`w-full sm:w-auto flex items-center justify-center gap-2.5 font-bold text-sm px-7 py-3.5 rounded-full transition-all duration-200 ${
            isDark
              ? "bg-gradient-to-r from-gold-dark via-gold to-gold-light hover:opacity-90 text-primary-foreground shadow-[0_0_20px_rgba(201,168,76,0.3)]"
              : "bg-background hover:bg-muted text-foreground shadow-lg"
          }`}
        >
          <Calendar size={15} />
          Schedule Free Estimate
        </button>

        <span
          className={`text-sm font-light ${
            isDark ? "text-foreground/30" : "text-background/40"
          } hidden sm:block`}
        >
          or
        </span>

        <a
          href="tel:+19139153193"
          className={`w-full sm:w-auto flex items-center justify-center gap-2.5 font-bold text-sm px-6 py-3.5 rounded-full border-2 transition-all duration-200 ${
            isDark
              ? "border-gold/40 text-gold hover:border-gold hover:bg-gold/10"
              : "border-background/40 text-background hover:border-background hover:bg-background/10"
          }`}
        >
          <Phone size={15} />
          <span>
            CALL NOW{" "}
            <span className="font-extrabold">(913) 915-3193</span>
          </span>
        </a>
      </div>
    </div>
  );
}
