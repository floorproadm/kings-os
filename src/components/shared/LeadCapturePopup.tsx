// LeadCapturePopup.tsx
// Kings OS — Hardwood Kings Inc. · Johnson County, KS
// Benchmark: Empire Today ($300 Off popup model — lead capture com oferta)
// Fase 2 — src/components/shared/LeadCapturePopup.tsx
//
// Comportamento:
//   • Abre 12 segundos após o load da página OU no exit intent (mouseout topo)
//   • Cookie "kings_popup_seen" — não volta por 7 dias após fechar/submeter
//   • Submete para Supabase leads com source='popup' (wired na Fase 4)

import { useState, useEffect, useRef } from "react";
import { X, Phone, CheckCircle2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { HK_ORG_ID } from "@/lib/constants";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PopupFormData {
  name: string;
  phone: string;
  zipcode: string;
}

// ─── Cookie helpers ───────────────────────────────────────────────────────────

const COOKIE_KEY = "kings_popup_seen";
const COOKIE_DAYS = 7;

function setCookie(days: number) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${COOKIE_KEY}=1; expires=${expires}; path=/`;
}

function hasCookie() {
  return document.cookie.split(";").some((c) => c.trim().startsWith(COOKIE_KEY));
}

// ─── Input style ──────────────────────────────────────────────────────────────

const inputCls =
  "w-full bg-[#F5F0E8] border border-[#C9A84C]/30 rounded-lg px-4 py-3 text-[#1A1A0F] text-sm placeholder:text-[#1A1A0F]/40 focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C]/40 transition-all duration-200";

// ─── Component ────────────────────────────────────────────────────────────────

export default function LeadCapturePopup() {
  const [visible, setVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<PopupFormData>>({});
  const [form, setForm] = useState<PopupFormData>({ name: "", phone: "", zipcode: "" });
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasShown = useRef(false);

  const show = () => {
    if (hasShown.current || hasCookie()) return;
    hasShown.current = true;
    setVisible(true);
  };

  const dismiss = () => {
    setVisible(false);
    setCookie(COOKIE_DAYS);
  };

  // ── Triggers ────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (hasCookie()) return;

    // 12-second delay trigger
    timerRef.current = setTimeout(show, 12000);

    // Exit intent trigger (mouse leaves top of viewport)
    const handleMouseOut = (e: MouseEvent) => {
      if (e.clientY <= 0) show();
    };
    document.addEventListener("mouseleave", handleMouseOut);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      document.removeEventListener("mouseleave", handleMouseOut);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Form logic ───────────────────────────────────────────────────────────────

  const set = (field: keyof PopupFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const e: typeof errors = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.phone.trim()) e.phone = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    // TODO Fase 4: replace with Supabase insert
    // await supabase.from("leads").insert({
    //   org_id: KINGS_ORG_ID,
    //   name: form.name,
    //   phone: form.phone,
    //   address: form.city,
    //   service: "Free Estimate Request",
    //   source: "popup",
    //   status: "new",
    // });

    console.log("KINGS OS — Popup lead:", { ...form, source: "popup" });

    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSubmitted(true);
    setCookie(COOKIE_DAYS);

    // Auto-close after 3s
    setTimeout(() => setVisible(false), 3000);
  };

  // ── Not visible ───────────────────────────────────────────────────────────

  if (!visible) return null;

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && dismiss()}
    >
      {/* Modal */}
      <div className="relative w-full max-w-md bg-[#1A1A0F] border border-[#C9A84C]/30 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">

        {/* Gold top bar */}
        <div className="h-1 w-full bg-gradient-to-r from-[#C9A84C] via-[#F5E6C0] to-[#C9A84C]" />

        {/* Close button */}
        <button
          onClick={dismiss}
          className="absolute top-4 right-4 text-[#F5F0E8]/40 hover:text-[#F5F0E8] transition-colors z-10"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className="p-8">
          {submitted ? (
            /* ── Success ──────────────────────────────────── */
            <div className="flex flex-col items-center text-center py-4 gap-4">
              <div className="w-16 h-16 rounded-full bg-[#C9A84C]/15 border-2 border-[#C9A84C] flex items-center justify-center">
                <CheckCircle2 size={28} className="text-[#C9A84C]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#F5F0E8] mb-1">
                  You're on the list!
                </h3>
                <p className="text-[#F5F0E8]/60 text-sm">
                  Thiago will call you within 2 hours to schedule.
                </p>
              </div>
            </div>
          ) : (
            /* ── Form ────────────────────────────────────── */
            <>
              {/* Header */}
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 bg-[#C9A84C]/15 border border-[#C9A84C]/30 rounded-full px-3 py-1 mb-4">
                  <span className="text-[#C9A84C] text-xs font-bold tracking-widest uppercase">
                    Free Offer
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-[#F5F0E8] leading-tight">
                  Get a <span className="text-[#C9A84C]">Free In-Home Estimate</span>
                </h2>
                <p className="text-[#F5F0E8]/50 text-sm mt-2">
                  No commitment. No pressure. Just expert advice from Thiago.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} noValidate className="space-y-3">
                <div>
                  <input
                    className={inputCls}
                    placeholder="Your name *"
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                  />
                  {errors.name && (
                    <p className="text-red-400 text-xs mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <input
                    type="tel"
                    className={inputCls}
                    placeholder="Phone number *"
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                  />
                  {errors.phone && (
                    <p className="text-red-400 text-xs mt-1">{errors.phone}</p>
                  )}
                </div>

                <input
                  className={inputCls}
                  placeholder="Your zipcode"
                  value={form.zipcode}
                  onChange={(e) => set("zipcode", e.target.value)}
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#C9A84C] hover:bg-[#F5E6C0] disabled:opacity-60 text-[#1A1A0F] font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 mt-2"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Yes, I Want My Free Estimate!"
                  )}
                </button>

                {/* Trust signal */}
                <div className="flex items-center justify-center gap-2 pt-1">
                  <Phone size={12} className="text-[#F5F0E8]/30" />
                  <p className="text-[#F5F0E8]/30 text-xs">
                    Or call directly:{" "}
                    <a
                      href="tel:+19139153193"
                      className="text-[#C9A84C]/70 hover:text-[#C9A84C] underline underline-offset-2"
                    >
                      (913) 915-3193
                    </a>
                  </p>
                </div>

                <p className="text-[#F5F0E8]/20 text-xs text-center">
                  We respect your privacy. No spam, ever.
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
