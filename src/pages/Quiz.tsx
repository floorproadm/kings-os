import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { HK_ORG_ID } from "@/lib/constants";
import { formatPhone } from "@/lib/formatPhone";

// ─── Types & options ────────────────────────────────────────────────────────

type QuizFormData = {
  serviceType: string;
  finishScope: string;
  floorType: string;
  currentCondition: string;
  woodType: string;
  location: string;
  subfloor: string;
  belowGrade: string;
  livingDuringRefinish: string;
  stairsIncluded: string;
  squareFootage: string;
  timeline: string;
  budget: string;
  colorChange: string;
  name: string;
  email: string;
  phone: string;
  city: string;
};

const serviceTypes = [
  { value: "new-installation", label: "New Installation", description: "Installing new flooring" },
  { value: "floor-refinish", label: "Refinishing (Sand & Finish)", description: "Refinishing existing floors" },
  { value: "install-plus-refinish", label: "Installation + Refinishing", description: "Both — install new and refinish" },
  { value: "not-sure", label: "Not sure / Need guidance", description: "Talk to an expert first" },
];

const finishScopeOptions = [
  { value: "new-floor", label: "For the new floor being installed", description: "Finish only the floor we'll install" },
  { value: "existing", label: "For existing floors", description: "Refinish floors already in place" },
  { value: "both", label: "Both", description: "New install + refinish existing areas" },
  { value: "not-sure", label: "Not sure", description: "We'll inspect and recommend" },
];

const floorTypes = [
  { value: "hardwood", label: "Hardwood", description: "Classic and durable solid wood flooring" },
  { value: "engineered", label: "Engineered Wood", description: "Stable, versatile alternative to solid wood" },
  { value: "vinyl", label: "Vinyl", description: "Water-resistant and low maintenance" },
  { value: "custom", label: "Custom", description: "Unique patterns and materials" },
];

const currentConditions = [
  { value: "light-wear", label: "Light Wear", description: "Minor scratches and dullness" },
  { value: "moderate-wear", label: "Moderate Wear", description: "Visible scratches and some damage" },
  { value: "heavy-wear", label: "Heavy Wear", description: "Deep scratches and significant damage" },
  { value: "damaged", label: "Damaged", description: "Requires board replacement" },
];

const woodTypes = [
  { value: "oak", label: "Oak" },
  { value: "maple", label: "Maple" },
  { value: "pine", label: "Pine" },
  { value: "not-sure", label: "Not Sure" },
];

const locations = [
  { value: "residential", label: "Residential Home" },
  { value: "apartment", label: "Apartment" },
  { value: "commercial", label: "Commercial Space" },
];

const timelines = [
  { value: "asap", label: "As soon as possible" },
  { value: "1-month", label: "Within 1 month" },
  { value: "3-months", label: "Within 3 months" },
  { value: "planning", label: "Just planning" },
];

const budgetRanges = [
  { value: "under-2k", label: "Up to $2,000" },
  { value: "2k-5k", label: "$2,000 - $5,000" },
  { value: "5k-10k", label: "$5,000 - $10,000" },
  { value: "10k-plus", label: "$10,000+" },
];

const colorOptions = [
  { value: "keep-same", label: "Keep Same Color", description: "Maintain current appearance" },
  { value: "go-lighter", label: "Go Lighter", description: "Brighten the space" },
  { value: "go-darker", label: "Go Darker", description: "Add richness and depth" },
  { value: "need-consultation", label: "Need Consultation", description: "Professional recommendation" },
];

// ─── Validation helpers ─────────────────────────────────────────────────────

const sanitize = (v: string) => v.replace(/[<>]/g, "").trim();
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const isPhone = (v: string) => v.replace(/\D/g, "").length === 10;
const isName = (v: string) => v.length >= 2 && /^[a-zA-ZÀ-ÿ\s'-]+$/.test(v);

// ─── Component ──────────────────────────────────────────────────────────────

const Quiz = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<QuizFormData>({
    serviceType: "",
    finishScope: "",
    floorType: "",
    currentCondition: "",
    woodType: "",
    location: "",
    subfloor: "",
    belowGrade: "",
    livingDuringRefinish: "",
    stairsIncluded: "",
    squareFootage: "",
    timeline: "",
    budget: "",
    colorChange: "",
    name: "",
    email: "",
    phone: "",
    city: "",
  });

  // Build the ordered list of step keys for the active path
  const getStepKeys = (): string[] => {
    const keys: string[] = ["service"];

    if (formData.serviceType === "not-sure") {
      return [...keys, "area", "timeline", "budget", "contact"];
    }

    if (formData.serviceType === "new-installation") {
      return [...keys, "floorType", "location", "subfloorGrade", "area", "timeline", "budget", "contact"];
    }

    if (formData.serviceType === "floor-refinish") {
      return [...keys, "condition", "wood", "livingDuringRefinish", "area", "colorChange", "timeline", "budget", "contact"];
    }

    if (formData.serviceType === "install-plus-refinish") {
      keys.push("finishScope");
      if (formData.finishScope === "new-floor") {
        return [...keys, "floorType", "location", "subfloorGrade", "area", "timeline", "budget", "contact"];
      }
      if (formData.finishScope === "existing") {
        return [...keys, "condition", "wood", "livingDuringRefinish", "area", "colorChange", "timeline", "budget", "contact"];
      }
      if (formData.finishScope === "both") {
        return [...keys, "floorType", "location", "subfloorGrade", "condition", "area", "timeline", "budget", "contact"];
      }
      if (formData.finishScope === "not-sure") {
        return [...keys, "area", "timeline", "budget", "contact"];
      }
      return keys;
    }

    return keys;
  };

  const getTotalSteps = () => getStepKeys().length;
  const getCurrentStepKey = () => getStepKeys()[currentStep - 1] ?? "service";

  const needsConsultation = () =>
    formData.serviceType === "not-sure" ||
    (formData.serviceType === "install-plus-refinish" && formData.finishScope === "not-sure");

  const validateContact = () => {
    const errors: Record<string, string> = {};
    if (!formData.name) errors.name = "Name is required";
    else if (!isName(formData.name)) errors.name = "Please enter a valid name";
    if (!formData.email) errors.email = "Email is required";
    else if (!isEmail(formData.email)) errors.email = "Please enter a valid email";
    if (!formData.phone) errors.phone = "Phone is required";
    else if (!isPhone(formData.phone)) errors.phone = "Please enter a valid 10-digit phone";
    if (!formData.city) errors.city = "City is required";
    return errors;
  };

  const handleSubmit = async () => {
    const errors = validateContact();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast({ title: "Please fix the errors below", variant: "destructive" });
      return;
    }

    setIsLoading(true);

    try {
      const notes = [
        `Service: ${formData.serviceType}`,
        formData.finishScope ? `Scope: ${formData.finishScope}` : null,
        `City: ${formData.city}`,
        formData.squareFootage ? `SqFt: ${formData.squareFootage}` : null,
        formData.timeline ? `Timeline: ${formData.timeline}` : null,
        formData.budget ? `Budget: ${formData.budget}` : null,
        formData.floorType ? `Floor: ${formData.floorType}` : null,
        formData.woodType ? `Wood: ${formData.woodType}` : null,
        formData.currentCondition ? `Condition: ${formData.currentCondition}` : null,
        formData.colorChange ? `Color: ${formData.colorChange}` : null,
        formData.subfloor ? `Subfloor: ${formData.subfloor}` : null,
        formData.belowGrade ? `BelowGrade: ${formData.belowGrade}` : null,
        formData.livingDuringRefinish ? `LivingDuringRefinish: ${formData.livingDuringRefinish}` : null,
        formData.stairsIncluded ? `Stairs: ${formData.stairsIncluded}` : null,
        formData.location ? `Location: ${formData.location}` : null,
        needsConsultation() ? "NEEDS_CONSULTATION" : null,
      ]
        .filter(Boolean)
        .join(" | ");

      const { error: saveError } = await supabase.from("leads").insert({
        org_id: HK_ORG_ID,
        name: sanitize(formData.name),
        email: sanitize(formData.email) || null,
        phone: sanitize(formData.phone),
        address: sanitize(formData.city) || null,
        service: formData.serviceType || null,
        message: notes,
        source: "quiz",
        status: "new",
      });

      if (saveError) {
        throw new Error(saveError.message);
      }

      toast({
        title: "Thank you!",
        description: "We'll contact you within 24 hours with your personalized recommendations.",
      });

      navigate("/thank-you", {
        state: {
          quizData: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            serviceType: formData.serviceType,
            squareFootage: formData.squareFootage,
            budget: formData.budget,
          },
        },
      });
    } catch (error) {
      console.error("Quiz submission error:", error);
      toast({
        title: "Something went wrong",
        description: "Please try again or call us directly at (913) 915-3193",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    const key = getCurrentStepKey();
    const fail = (title: string, description?: string) => {
      toast({ title, description, variant: "destructive" });
    };

    switch (key) {
      case "service":
        if (!formData.serviceType) return fail("Please select a service type");
        break;
      case "finishScope":
        if (!formData.finishScope) return fail("Please tell us what the finish is for");
        break;
      case "floorType":
        if (!formData.floorType) return fail("Please select a flooring type");
        break;
      case "condition":
        if (!formData.currentCondition) return fail("Please select the current condition");
        break;
      case "wood":
        if (!formData.woodType) return fail("Please select your wood type");
        break;
      case "location":
        if (!formData.location) return fail("Please select the location type");
        break;
      case "subfloorGrade":
        if (!formData.subfloor || !formData.belowGrade) {
          return fail(
            "Please answer both questions",
            "Subfloor type and basement (below grade) help us scope the job correctly.",
          );
        }
        break;
      case "livingDuringRefinish":
        if (!formData.livingDuringRefinish) {
          return fail(
            "Please answer the question",
            "Whether you'll be living in the home affects scheduling and prep.",
          );
        }
        break;
      case "area":
        if (!formData.squareFootage || formData.squareFootage === "0") {
          return fail("Please specify the area size", "Enter the square footage or select a preset size");
        }
        break;
      case "colorChange":
        if (!formData.colorChange) return fail("Please specify color preference");
        break;
      case "timeline":
        if (!formData.timeline) return fail("Please select a timeline");
        break;
      case "budget":
        if (!formData.budget) return fail("Please select a budget range");
        break;
      default:
        break;
    }

    setCurrentStep((s) => Math.min(s + 1, getTotalSteps()));
  };

  const prevStep = () => setCurrentStep((s) => Math.max(s - 1, 1));

  const stepKey = getCurrentStepKey();
  const totalSteps = getTotalSteps();

  // ─── Card option renderer ────────────────────────────────────────────────
  const optionCard = (
    selected: boolean,
    onClick: () => void,
    title: string,
    description?: string,
    compact = false,
  ) => (
    <Card
      className={`cursor-pointer transition-all hover:shadow-lg border-2 ${
        selected ? "border-gold bg-gold/10" : "border-border hover:border-gold/50"
      }`}
      onClick={onClick}
    >
      <CardContent className={`text-center ${compact ? "p-3" : "p-4"}`}>
        <h4 className={`font-semibold text-foreground ${description ? "mb-1" : ""}`}>{title}</h4>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </CardContent>
    </Card>
  );

  return (
    <Layout>
      <section className="section-padding">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8 sm:mb-12">
              <p className="text-gold text-sm tracking-[0.2em] uppercase font-semibold mb-4">
                Free Estimate
              </p>
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
                Get a Fast Flooring Estimate in <span className="gold-gradient-text">60 Seconds</span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground mb-6">
                Answer a few quick questions about your project — we'll send tailored options and a price range.
              </p>
              <div className="flex justify-center items-center gap-2 text-sm text-muted-foreground">
                {Array.from({ length: totalSteps }, (_, i) => (
                  <span
                    key={i}
                    className={`w-8 h-1 rounded ${currentStep >= i + 1 ? "bg-gold" : "bg-muted"}`}
                  />
                ))}
              </div>
            </div>

            <Card className="border-2 border-gold/20 elevated-card">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl font-display text-foreground">
                  Step {currentStep} of {totalSteps}
                </CardTitle>
              </CardHeader>

              <CardContent className="p-6 sm:p-8">
                {/* Service Type */}
                {stepKey === "service" && (
                  <div className="space-y-6">
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-display font-bold text-foreground mb-2">
                        What type of service do you need?
                      </h3>
                      <p className="text-muted-foreground">Choose the option that best describes your project</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {serviceTypes.map((s) =>
                        optionCard(
                          formData.serviceType === s.value,
                          () =>
                            setFormData((prev) => ({
                              ...prev,
                              serviceType: s.value,
                              finishScope: s.value === "install-plus-refinish" ? prev.finishScope : "",
                            })),
                          s.label,
                          s.description,
                        ),
                      )}
                    </div>
                  </div>
                )}

                {/* Finish Scope */}
                {stepKey === "finishScope" && (
                  <div className="space-y-6">
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-display font-bold text-foreground mb-2">
                        Is this finish for new wood we'll install, or for existing floors?
                      </h3>
                      <p className="text-muted-foreground">This decides which checks we need to run</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {finishScopeOptions.map((opt) =>
                        optionCard(
                          formData.finishScope === opt.value,
                          () => setFormData((prev) => ({ ...prev, finishScope: opt.value })),
                          opt.label,
                          opt.description,
                        ),
                      )}
                    </div>
                  </div>
                )}

                {/* Floor Type */}
                {stepKey === "floorType" && (
                  <div className="space-y-6">
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-display font-bold text-foreground mb-2">
                        What type of flooring are you interested in?
                      </h3>
                      <p className="text-muted-foreground">Select the flooring type that best fits your needs</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {floorTypes.map((f) =>
                        optionCard(
                          formData.floorType === f.value,
                          () => setFormData((prev) => ({ ...prev, floorType: f.value })),
                          f.label,
                          f.description,
                        ),
                      )}
                    </div>
                  </div>
                )}

                {/* Current Condition */}
                {stepKey === "condition" && (
                  <div className="space-y-6">
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-display font-bold text-foreground mb-2">
                        What's the current condition of your floors?
                      </h3>
                      <p className="text-muted-foreground">This helps us determine the best refinishing approach</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {currentConditions.map((c) =>
                        optionCard(
                          formData.currentCondition === c.value,
                          () => setFormData((prev) => ({ ...prev, currentCondition: c.value })),
                          c.label,
                          c.description,
                        ),
                      )}
                    </div>
                  </div>
                )}

                {/* Location */}
                {stepKey === "location" && (
                  <div className="space-y-6">
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-display font-bold text-foreground mb-2">
                        Where will this flooring be installed?
                      </h3>
                      <p className="text-muted-foreground">Different locations may require different approaches</p>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      {locations.map((l) =>
                        optionCard(
                          formData.location === l.value,
                          () => setFormData((prev) => ({ ...prev, location: l.value })),
                          l.label,
                        ),
                      )}
                    </div>
                  </div>
                )}

                {/* Wood Type */}
                {stepKey === "wood" && (
                  <div className="space-y-6">
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-display font-bold text-foreground mb-2">
                        What type of wood flooring do you currently have?
                      </h3>
                      <p className="text-muted-foreground">This helps us choose the right refinishing approach</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {woodTypes.map((w) =>
                        optionCard(
                          formData.woodType === w.value,
                          () => setFormData((prev) => ({ ...prev, woodType: w.value })),
                          w.label,
                        ),
                      )}
                    </div>
                  </div>
                )}

                {/* Subfloor + Below Grade */}
                {stepKey === "subfloorGrade" && (
                  <div className="space-y-8">
                    <div className="text-center mb-2">
                      <h3 className="text-2xl font-display font-bold text-foreground mb-2">
                        Quick technical check
                      </h3>
                      <p className="text-muted-foreground">
                        Two short questions that decide method, prep and warranty
                      </p>
                    </div>

                    <div>
                      <Label className="text-foreground font-semibold block mb-3 text-center">
                        What's under this floor?
                      </Label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {[
                          { value: "concrete", label: "Concrete slab" },
                          { value: "wood", label: "Plywood / wood" },
                          { value: "not-sure", label: "Not sure" },
                        ].map((opt) =>
                          optionCard(
                            formData.subfloor === opt.value,
                            () => setFormData((prev) => ({ ...prev, subfloor: opt.value })),
                            opt.label,
                            undefined,
                            true,
                          ),
                        )}
                      </div>
                    </div>

                    <div>
                      <Label className="text-foreground font-semibold block mb-3 text-center">
                        Is this space below grade (basement)?
                      </Label>
                      <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
                        {[
                          { value: "yes", label: "Yes" },
                          { value: "no", label: "No" },
                          { value: "not-sure", label: "Not sure" },
                        ].map((opt) =>
                          optionCard(
                            formData.belowGrade === opt.value,
                            () => setFormData((prev) => ({ ...prev, belowGrade: opt.value })),
                            opt.label,
                            undefined,
                            true,
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Living during refinish */}
                {stepKey === "livingDuringRefinish" && (
                  <div className="space-y-6">
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-display font-bold text-foreground mb-2">
                        Will you be living in the home during the refinishing?
                      </h3>
                      <p className="text-muted-foreground">
                        Affects scheduling, dust control, and finish curing time
                      </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
                      {[
                        { value: "yes", label: "Yes", description: "We'll plan low-VOC finishes & ventilation" },
                        { value: "no", label: "No", description: "Faster cure & full prep window" },
                        { value: "not-sure", label: "Not sure", description: "We'll discuss options" },
                      ].map((opt) =>
                        optionCard(
                          formData.livingDuringRefinish === opt.value,
                          () => setFormData((prev) => ({ ...prev, livingDuringRefinish: opt.value })),
                          opt.label,
                          opt.description,
                        ),
                      )}
                    </div>
                  </div>
                )}

                {/* Square Footage + Stairs */}
                {stepKey === "area" && (
                  <div className="space-y-6">
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-display font-bold text-foreground mb-2">
                        What's the approximate area for this project?
                      </h3>
                      <p className="text-muted-foreground">Choose from common sizes or enter a custom amount</p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                      {[
                        { label: "Small Room", value: "200", subtitle: "~200 sq ft" },
                        { label: "Medium Room", value: "400", subtitle: "~400 sq ft" },
                        { label: "Large Room", value: "600", subtitle: "~600 sq ft" },
                        { label: "Whole Floor", value: "1200", subtitle: "1200+ sq ft" },
                      ].map((size) => (
                        <Card
                          key={size.value}
                          className={`cursor-pointer transition-all hover:shadow-md border-2 p-3 text-center ${
                            formData.squareFootage === size.value
                              ? "border-gold bg-gold/10"
                              : "border-border hover:border-gold/50"
                          }`}
                          onClick={() => setFormData((prev) => ({ ...prev, squareFootage: size.value }))}
                        >
                          <div className="text-sm font-medium text-foreground">{size.label}</div>
                          <div className="text-xs text-muted-foreground mt-1">{size.subtitle}</div>
                        </Card>
                      ))}
                    </div>

                    <div className="max-w-md mx-auto">
                      <Label htmlFor="squareFootage" className="text-foreground font-medium">
                        Or enter custom square footage
                      </Label>
                      <div className="relative mt-2">
                        <Input
                          id="squareFootage"
                          type="number"
                          value={formData.squareFootage}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, squareFootage: e.target.value }))
                          }
                          placeholder="Enter custom sq ft"
                          className="text-center text-lg pr-16"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                          sq ft
                        </span>
                      </div>
                    </div>

                    <div className="max-w-md mx-auto pt-2">
                      <Label className="text-foreground font-medium block mb-2 text-center">
                        Any stairs included in this project?
                      </Label>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { value: "yes", label: "Yes" },
                          { value: "no", label: "No" },
                        ].map((opt) =>
                          optionCard(
                            formData.stairsIncluded === opt.value,
                            () => setFormData((prev) => ({ ...prev, stairsIncluded: opt.value })),
                            opt.label,
                            undefined,
                            true,
                          ),
                        )}
                      </div>
                    </div>

                    <div className="text-center">
                      <details className="inline-block text-left">
                        <summary className="cursor-pointer text-sm text-gold hover:text-gold/80 font-medium">
                          💡 Need help calculating your area?
                        </summary>
                        <div className="mt-2 p-3 bg-muted/30 rounded-lg text-sm text-muted-foreground max-w-sm">
                          <p className="mb-2">
                            <strong>Quick calculation:</strong>
                          </p>
                          <p>Length × Width = Square Footage</p>
                          <p className="mt-2 text-xs">Example: 20ft × 15ft = 300 sq ft</p>
                          <p className="text-xs">For multiple rooms, add them together</p>
                        </div>
                      </details>
                    </div>
                  </div>
                )}

                {/* Color Change */}
                {stepKey === "colorChange" && (
                  <div className="space-y-6">
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-display font-bold text-foreground mb-2">
                        Are you planning to change the color of your floors?
                      </h3>
                      <p className="text-muted-foreground">This affects the refinishing process and cost</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {colorOptions.map((c) =>
                        optionCard(
                          formData.colorChange === c.value,
                          () => setFormData((prev) => ({ ...prev, colorChange: c.value })),
                          c.label,
                          c.description,
                        ),
                      )}
                    </div>
                  </div>
                )}

                {/* Timeline */}
                {stepKey === "timeline" && (
                  <div className="space-y-6">
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-display font-bold text-foreground mb-2">
                        When would you like to start the project?
                      </h3>
                      <p className="text-muted-foreground">This helps us schedule and prepare</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {timelines.map((t) =>
                        optionCard(
                          formData.timeline === t.value,
                          () => setFormData((prev) => ({ ...prev, timeline: t.value })),
                          t.label,
                        ),
                      )}
                    </div>
                  </div>
                )}

                {/* Budget */}
                {stepKey === "budget" && (
                  <div className="space-y-6">
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-display font-bold text-foreground mb-2">
                        What's your budget range for this project?
                      </h3>
                      <p className="text-muted-foreground">This helps us provide accurate recommendations</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {budgetRanges.map((b) =>
                        optionCard(
                          formData.budget === b.value,
                          () => setFormData((prev) => ({ ...prev, budget: b.value })),
                          b.label,
                        ),
                      )}
                    </div>
                  </div>
                )}

                {/* Contact */}
                {stepKey === "contact" && (
                  <div className="space-y-6">
                    <div className="py-8">
                      <div className="w-24 h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-8" />
                    </div>

                    {needsConsultation() && (
                      <Alert className="border-gold/40 bg-gold/10">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-foreground">
                          <strong>Heads up:</strong> Based on your answers, we'll schedule a quick on-site
                          consultation to give you accurate options before quoting.
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-display font-bold text-foreground mb-2">
                        Get Your Personalized Recommendations
                      </h3>
                      <p className="text-muted-foreground">
                        We'll send ideas and samples that match your project
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => {
                            setFormData((p) => ({ ...p, name: e.target.value }));
                            if (formErrors.name) setFormErrors((p) => ({ ...p, name: "" }));
                          }}
                          placeholder="Your name"
                          className={`mt-1 ${formErrors.name ? "border-destructive" : ""}`}
                        />
                        {formErrors.name && (
                          <p className="text-destructive text-sm mt-1">{formErrors.name}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone *</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => {
                            const formatted = formatPhone(e.target.value);
                            setFormData((p) => ({ ...p, phone: formatted }));
                            if (formErrors.phone) setFormErrors((p) => ({ ...p, phone: "" }));
                          }}
                          placeholder="(913) 555-0123"
                          className={`mt-1 ${formErrors.phone ? "border-destructive" : ""}`}
                        />
                        {formErrors.phone && (
                          <p className="text-destructive text-sm mt-1">{formErrors.phone}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => {
                            setFormData((p) => ({ ...p, email: e.target.value }));
                            if (formErrors.email) setFormErrors((p) => ({ ...p, email: "" }));
                          }}
                          placeholder="your@email.com"
                          className={`mt-1 ${formErrors.email ? "border-destructive" : ""}`}
                        />
                        {formErrors.email && (
                          <p className="text-destructive text-sm mt-1">{formErrors.email}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) => {
                            setFormData((p) => ({ ...p, city: e.target.value }));
                            if (formErrors.city) setFormErrors((p) => ({ ...p, city: "" }));
                          }}
                          placeholder="Enter your city"
                          className={`mt-1 ${formErrors.city ? "border-destructive" : ""}`}
                        />
                        {formErrors.city && (
                          <p className="text-destructive text-sm mt-1">{formErrors.city}</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          We serve Johnson County & Kansas City Metro
                        </p>
                      </div>
                    </div>

                    <div className="bg-gold/10 p-4 rounded-lg border border-gold/20">
                      <p className="text-sm text-foreground text-center">
                        <strong>No pressure, no sales calls.</strong> We'll send personalized recommendations
                        and you can reach out when you're ready.
                      </p>
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <div
                  className={`flex mt-8 pt-6 border-t border-border ${
                    stepKey === "contact" ? "justify-center" : "justify-between"
                  }`}
                >
                  {currentStep > 1 && stepKey !== "contact" && (
                    <Button variant="outline" onClick={prevStep}>
                      Back
                    </Button>
                  )}

                  <div className={stepKey === "contact" ? "" : "ml-auto"}>
                    {stepKey !== "contact" ? (
                      <Button variant="gold" onClick={nextStep}>
                        Next Step
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    ) : (
                      <Button
                        variant="gold"
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="px-8 py-3 text-base min-h-[48px]"
                      >
                        <span className="flex items-center justify-center gap-2">
                          {isLoading ? "Submitting..." : "Get My Recommendations"}
                          <ArrowRight className="w-4 h-4 flex-shrink-0" />
                        </span>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Quiz;
