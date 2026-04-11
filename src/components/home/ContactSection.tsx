// ContactSection.tsx
// Kings OS — Hardwood Kings Inc. · Johnson County, KS
// Benchmark: Gorsegner Brothers (2-step form) + Empire Today (dual CTA)
// Fase 2 — src/components/home/ContactSection.tsx

import { useState } from "react";
import { ChevronRight, ChevronLeft, Phone, CheckCircle2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { HK_ORG_ID } from "@/lib/constants";
import { formatPhone } from "@/lib/formatPhone";
import { MovingBorderContainer } from "@/components/ui/moving-border";

// ─── Types ──────────────────────────────────────────────────────────────────

interface FormData {
  // Step 1 — Basics
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  // Step 2 — Project
  service: string;
  squareFootage: string;
  hasStairs: boolean | null;
  stairsCount: string;
  existingCustomer: boolean | null;
  hearAboutUs: string;
  message: string;
}

const SERVICES = [
  "Hardwood Floor Installation",
  "Sanding, Staining & Refinishing",
  "Staircase Design & Finishing",
  "Demolition & Replacement",
  "Vinyl & Engineered Wood Installation",
  "Deck & Handrail Refinishing",
  "Wash & Polish",
];

const HEAR_ABOUT_US = [
  "Google Search",
  "Google Maps / Reviews",
  "Instagram",
  "Facebook",
  "Referral / Friend",
  "Nextdoor",
  "Yard Sign",
  "Other",
];

// ─── Step Indicator ─────────────────────────────────────────────────────────

function StepIndicator({ current }: { current: 1 | 2 }) {
  return (
    <div className="flex items-center justify-center gap-4 mb-8">
      {/* Step 1 */}
      <div className="flex items-center gap-2">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
            current >= 1
              ? "bg-gold text-background"
              : "border-2 border-gold/40 text-gold/40"
          }`}
        >
          {current > 1 ? <CheckCircle2 size={16} /> : "1"}
        </div>
        <span
          className={`text-sm font-semibold tracking-wide ${
            current >= 1 ? "text-foreground" : "text-foreground/40"
          }`}
        >
          The Basics
        </span>
      </div>

      {/* Connector */}
      <div
        className={`h-px w-12 transition-all duration-500 ${
          current > 1 ? "bg-gold" : "bg-gold/20"
        }`}
      />

      {/* Step 2 */}
      <div className="flex items-center gap-2">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
            current >= 2
              ? "bg-gold text-background"
              : "border-2 border-gold/40 text-gold/40"
          }`}
        >
          2
        </div>
        <span
          className={`text-sm font-semibold tracking-wide ${
            current >= 2 ? "text-foreground" : "text-foreground/40"
          }`}
        >
          Project Details
        </span>
      </div>
    </div>
  );
}

// ─── Field Components ────────────────────────────────────────────────────────

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold tracking-widest uppercase text-gold">
        {label}
        {required && <span className="text-gold ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full bg-background border border-gold/25 rounded-md px-4 py-3 text-foreground text-sm placeholder:text-foreground/30 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/40 transition-all duration-200";

// ─── Radio Group ─────────────────────────────────────────────────────────────

function RadioGroup({
  value,
  onChange,
  options,
}: {
  value: boolean | null;
  onChange: (v: boolean) => void;
  options: [string, boolean][];
}) {
  return (
    <div className="flex gap-3">
      {options.map(([label, val]) => (
        <button
          key={label}
          type="button"
          onClick={() => onChange(val)}
          className={`flex-1 py-3 rounded-md border text-sm font-semibold transition-all duration-200 ${
            value === val
              ? "bg-gold border-gold text-background"
              : "bg-transparent border-gold/25 text-foreground/60 hover:border-gold/60 hover:text-foreground"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

// ─── Success State ────────────────────────────────────────────────────────────

function SuccessMessage({ name }: { name: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-6 text-center">
      <div className="w-20 h-20 rounded-full bg-gold/15 border-2 border-gold flex items-center justify-center">
        <CheckCircle2 size={36} className="text-gold" />
      </div>
      <div>
        <h3 className="text-2xl font-bold text-foreground mb-2">
          Got it, {name}!
        </h3>
        <p className="text-foreground/60 text-sm leading-relaxed max-w-xs">
          Thiago will reach out within{" "}
          <span className="text-gold font-semibold">2 hours</span> to
          schedule your free in-home estimate.
        </p>
      </div>
      <a
        href="tel:+19139153193"
        className="flex items-center gap-2 text-gold text-sm font-semibold hover:text-gold-light transition-colors"
      >
        <Phone size={14} />
        Need it faster? Call (913) 915-3193
      </a>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ContactSection() {
  const [step, setStep] = useState<1 | 2>(1);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const [form, setForm] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    service: "",
    squareFootage: "",
    hasStairs: null,
    stairsCount: "",
    existingCustomer: null,
    hearAboutUs: "",
    message: "",
  });

  const set = (field: keyof FormData, value: FormData[keyof FormData]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  // ── Validation ────────────────────────────────────────────────────────────

  const validateStep1 = () => {
    const e: typeof errors = {};
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.lastName.trim()) e.lastName = "Required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
      e.email = "Valid email required";
    if (!form.phone.trim()) e.phone = "Required";
    if (!form.city.trim()) e.city = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e: typeof errors = {};
    if (!form.service) e.service = "Please select a service";
    if (!form.squareFootage.trim()) e.squareFootage = "Required";
    if (form.hasStairs === null) e.hasStairs = "Required";
    if (form.hasStairs && !form.stairsCount.trim())
      e.stairsCount = "Required if stairs";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) return;

    setLoading(true);

    const { error } = await supabase.from("leads").insert({
      org_id: HK_ORG_ID,
      name: `${form.firstName} ${form.lastName}`,
      email: form.email,
      phone: form.phone,
      address: form.city,
      service: form.service,
      source: "website-contact",
      status: "new",
      message: [
        `SF: ${form.squareFootage}`,
        `Stairs: ${form.hasStairs ? `Yes (${form.stairsCount})` : "No"}`,
        `Existing: ${form.existingCustomer ? "Yes" : "No"}`,
        `Heard via: ${form.hearAboutUs}`,
        form.message,
      ].filter(Boolean).join(" | "),
    });

    if (error) {
      console.error("Lead insert error:", error);
      setLoading(false);
      return;
    }

    setLoading(false);
    setSubmitted(true);
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <section
      id="contact"
      className="bg-background py-14 sm:py-24 px-4"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">

          {/* Left — Copy */}
          <div className="lg:sticky lg:top-24">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-4 sm:mb-6">
              Let's Build Something{" "}
              <span className="text-gold">Beautiful,</span>{" "}
              Together.
            </h2>
            <ul className="space-y-3 mb-4 lg:mb-10">
              {[
                "Flexible scheduling — weekdays & weekends",
                "Clear communication from first call to final coat",
                "Work you can trust, backed by 24+ years",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-foreground/70 text-sm">
                  <span className="text-gold mt-0.5 text-base leading-none">✦</span>
                  {item}
                </li>
              ))}
            </ul>

          </div>

          {/* Right — Form */}
          <div className="w-full rounded-2xl border border-border/30 bg-background p-8 flex flex-col items-stretch">
            {submitted ? (
              <SuccessMessage name={form.firstName} />
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <StepIndicator current={step} />

                {/* ── STEP 1 ─────────────────────────────────────────── */}
                {step === 1 && (
                  <div className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="First Name" required>
                        <input
                          className={inputCls}
                          placeholder="Thiago"
                          maxLength={50}
                          value={form.firstName}
                          onChange={(e) => set("firstName", e.target.value)}
                        />
                        {errors.firstName && (
                          <span className="text-red-400 text-xs">{errors.firstName}</span>
                        )}
                      </Field>
                      <Field label="Last Name" required>
                        <input
                          className={inputCls}
                          placeholder="Reis"
                          maxLength={50}
                          value={form.lastName}
                          onChange={(e) => set("lastName", e.target.value)}
                        />
                        {errors.lastName && (
                          <span className="text-red-400 text-xs">{errors.lastName}</span>
                        )}
                      </Field>
                    </div>

                    <Field label="Email Address" required>
                      <input
                        type="email"
                        className={inputCls}
                        placeholder="you@example.com"
                        maxLength={100}
                        value={form.email}
                        onChange={(e) => set("email", e.target.value)}
                      />
                      {errors.email && (
                        <span className="text-red-400 text-xs">{errors.email}</span>
                      )}
                    </Field>

                    <Field label="Phone" required>
                      <input
                        type="tel"
                        className={inputCls}
                        placeholder="(913) 000-0000"
                        value={form.phone}
                        onChange={(e) => set("phone", formatPhone(e.target.value))}
                      />
                      {errors.phone && (
                        <span className="text-red-400 text-xs">{errors.phone}</span>
                      )}
                    </Field>

                    <Field label="City" required>
                      <input
                        className={inputCls}
                        placeholder="Overland Park, Shawnee, Olathe..."
                        maxLength={100}
                        value={form.city}
                        onChange={(e) => set("city", e.target.value)}
                      />
                      {errors.city && (
                        <span className="text-red-400 text-xs">{errors.city}</span>
                      )}
                    </Field>

                    <button
                      type="button"
                      onClick={handleNext}
                      className="w-full bg-gradient-to-r from-gold-dark via-gold to-gold-light hover:opacity-90 text-primary-foreground font-bold py-4 rounded-full flex items-center justify-center gap-2 transition-all duration-200 mt-2 shadow-lg shadow-gold/20"
                    >
                      Next: Project Details
                      <ChevronRight size={18} />
                    </button>
                  </div>
                )}

                {/* ── STEP 2 ─────────────────────────────────────────── */}
                {step === 2 && (
                  <div className="space-y-5">

                    {/* Service */}
                    <Field label="Service Needed" required>
                      <select
                        className={inputCls + " cursor-pointer"}
                        value={form.service}
                        onChange={(e) => set("service", e.target.value)}
                      >
                        <option value="">Select a service...</option>
                        {SERVICES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      {errors.service && (
                        <span className="text-red-400 text-xs">{errors.service}</span>
                      )}
                    </Field>

                    {/* Square Footage — Gorsegner model */}
                    <Field label="Approx. Square Footage" required>
                      <input
                        className={inputCls}
                        placeholder="e.g. 500 sq ft (Length × Width)"
                        maxLength={50}
                        value={form.squareFootage}
                        onChange={(e) => set("squareFootage", e.target.value)}
                      />
                      {errors.squareFootage && (
                        <span className="text-red-400 text-xs">{errors.squareFootage}</span>
                      )}
                    </Field>

                    {/* Stairs — conditional field (Gorsegner model) */}
                    <Field label="Do you have stairs?" required>
                      <RadioGroup
                        value={form.hasStairs}
                        onChange={(v) => set("hasStairs", v)}
                        options={[["Yes", true], ["No", false]]}
                      />
                      {errors.hasStairs && (
                        <span className="text-red-400 text-xs">{errors.hasStairs}</span>
                      )}
                    </Field>

                    {form.hasStairs === true && (
                      <Field label="How many steps?" required>
                        <input
                          type="number"
                          min="1"
                          max="100"
                          className={inputCls}
                          placeholder="e.g. 14"
                          value={form.stairsCount}
                          onChange={(e) => set("stairsCount", e.target.value)}
                        />
                        {errors.stairsCount && (
                          <span className="text-red-400 text-xs">{errors.stairsCount}</span>
                        )}
                      </Field>
                    )}

                    {/* Existing Customer — Gorsegner model */}
                    <Field label="Have you worked with us before?">
                      <RadioGroup
                        value={form.existingCustomer}
                        onChange={(v) => set("existingCustomer", v)}
                        options={[["Yes, returning customer", true], ["First time", false]]}
                      />
                    </Field>

                    {/* Hear About Us — Gorsegner model */}
                    <Field label="How did you hear about us?">
                      <select
                        className={inputCls + " cursor-pointer"}
                        value={form.hearAboutUs}
                        onChange={(e) => set("hearAboutUs", e.target.value)}
                      >
                        <option value="">Select...</option>
                        {HEAR_ABOUT_US.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </Field>

                    {/* Message */}
                    <Field label="Anything else we should know?">
                      <textarea
                        className={inputCls + " resize-none"}
                        rows={3}
                        placeholder="Timeline, specific concerns, access instructions..."
                        value={form.message}
                        onChange={(e) => set("message", e.target.value)}
                      />
                    </Field>

                    {/* Actions */}
                    <div className="flex gap-3 mt-2">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="flex items-center gap-1.5 px-4 py-3 border border-gold/30 text-foreground/60 hover:text-foreground hover:border-gold/60 rounded-full text-sm font-semibold transition-all duration-200"
                      >
                        <ChevronLeft size={16} />
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-gradient-to-r from-gold-dark via-gold to-gold-light hover:opacity-90 disabled:opacity-60 text-primary-foreground font-bold py-3 rounded-full flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-gold/20"
                      >
                        {loading ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            Get My Free Estimate
                            <ChevronRight size={16} />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
