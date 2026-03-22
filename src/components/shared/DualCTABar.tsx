// DualCTABar.tsx
// Kings OS — Hardwood Kings Inc. · Johnson County, KS
// Benchmark: Empire Today ("SCHEDULE IN-HOME APPOINTMENT | or CALL NOW")
// Fase 2 — src/components/shared/DualCTABar.tsx
//
// Uso na Homepage (Index.tsx):
//   Inserir após <StatsBar /> e após <Testimonials />
//   <DualCTABar />
//
// Props opcionais:
//   variant="dark"  → fundo #1A1A0F (default, entre seções dark)
//   variant="gold"  → fundo #C9A84C com texto escuro (destaque máximo)

import { Phone, Calendar } from "lucide-react";

interface DualCTABarProps {
  variant?: "dark" | "gold";
  label?: string; // texto acima dos botões
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
          ? "bg-[#111108] border-y border-[#C9A84C]/15"
          : "bg-gradient-to-r from-[#fccf93]/80 via-gold/70 to-[#51351e]/80"
      }`}
    >
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">

        {/* Optional label */}
        {label && (
          <p
            className={`text-sm font-semibold tracking-wide ${
              isDark ? "text-[#F5F0E8]/60" : "text-[#1A1A0F]/70"
            } sm:mr-4`}
          >
            {label}
          </p>
        )}

        {/* Primary CTA — Schedule / Estimate */}
        <button
          onClick={scrollToContact}
          className={`flex items-center gap-2.5 font-bold text-sm px-7 py-3.5 rounded-full transition-all duration-200 shadow-lg ${
            isDark
              ? "bg-gradient-to-r from-gold-dark via-gold to-gold-light hover:opacity-90 text-primary-foreground shadow-gold/20"
              : "bg-[#1A1A0F] hover:bg-[#2a2a1a] text-[#F5F0E8]"
          }`}
        >
          <Calendar size={15} />
          Schedule Free Estimate
        </button>

        {/* Divider */}
        <span
          className={`text-sm font-light ${
            isDark ? "text-[#F5F0E8]/30" : "text-[#1A1A0F]/40"
          } hidden sm:block`}
        >
          or
        </span>

        {/* Secondary CTA — Call Now */}
        <a
          href="tel:+19139153193"
          className={`flex items-center gap-2.5 font-bold text-sm px-6 py-3.5 rounded-full border-2 transition-all duration-200 ${
            isDark
              ? "border-[#C9A84C]/40 text-[#C9A84C] hover:border-[#C9A84C] hover:bg-[#C9A84C]/10"
              : "border-[#1A1A0F]/40 text-[#1A1A0F] hover:border-[#1A1A0F] hover:bg-[#1A1A0F]/10"
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

// ─── Sticky bottom variant ─────────────────────────────────────────────────
// Para usar como barra fixa no bottom em mobile:
//
// export function StickyCallBar() {
//   return (
//     <div className="fixed bottom-0 left-0 right-0 z-40 sm:hidden bg-[#C9A84C] py-3 px-4 shadow-2xl">
//       <a
//         href="tel:+19139153193"
//         className="flex items-center justify-center gap-2 text-[#1A1A0F] font-bold text-base"
//       >
//         <Phone size={18} />
//         Call Thiago: (913) 915-3193
//       </a>
//     </div>
//   );
// }
