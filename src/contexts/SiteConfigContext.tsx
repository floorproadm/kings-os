import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";

export interface ServicePageConfig {
  heroLabel: string;
  heroTitle: string;
  heroHighlight: string;
  heroDescription: string;
  heroCta: string;
  sectionTitle: string;
  sectionHighlight: string;
  sectionSubtitle: string;
  ctaTitle: string;
  ctaSubtitle: string;
  ctaCta1: string;
  ctaCta2: string;
}

export interface HardwoodPageConfig extends ServicePageConfig {
  benefits: string[];
  features: { title: string; desc: string }[];
  steps: { num: string; title: string; desc: string }[];
}

export interface SandingPageConfig extends ServicePageConfig {
  benefits: { title: string; desc: string }[];
  steps: { num: string; title: string; desc: string }[];
  finishes: { name: string; desc: string; best: string }[];
}

export interface VinylPageConfig extends ServicePageConfig {
  features: { title: string; desc: string }[];
  rooms: { room: string; benefits: string; tag: string }[];
  comparison: { feature: string; vinyl: string; hardwood: string }[];
}

export interface StaircasePageConfig extends ServicePageConfig {
  services: { title: string; desc: string; tags: string[] }[];
  benefits: string[];
  styles: { name: string; desc: string; tags: string[] }[];
  safety: string[];
}

export interface SiteConfig {
  // Hero
  heroSubtitle: string;
  heroTitle: string;
  heroTitleHighlight: string;
  heroDescription: string;
  heroCta1: string;
  heroCta2: string;
  heroPhone: string;
  heroNote: string;

  // Stats
  stats: { value: string; label: string }[];

  // Services section
  servicesBadge: string;
  servicesTitle: string;
  servicesTitleHighlight: string;
  servicesSubtitle: string;

  // Why choose us
  whyTitle: string;
  whyTitleHighlight: string;

  // Craftsmanship
  craftTitle: string;
  craftTitleHighlight: string;
  craftText1: string;
  craftText2: string;
  craftBadge: string;

  // Testimonials
  testimonialsLabel: string;
  testimonialsTitle: string;
  testimonialsTitleHighlight: string;
  testimonialsSubtitle: string;
  testimonialsFooter: string;

  // CTA section
  ctaTitle: string;
  ctaSubtitle: string;
  ctaCta1: string;
  ctaCta2: string;

  // Service areas
  serviceAreasTitle: string;
  serviceAreasText: string;

  // Company info
  phone: string;
  email: string;
  servingArea: string;
  footerTagline: string;
  footerSlogan: string;

  // Colors
  colorPrimary: string;
  colorGold: string;
  colorGoldLight: string;
  colorGoldDark: string;
  colorBackground: string;
  colorForeground: string;
  colorCard: string;
  colorBorder: string;

  // Button styles
  buttonRadius: string;
  buttonBorderWidth: string;

  // Images
  heroImage: string;
  craftImage: string;
  logoImage: string;
  serviceImages: { sanding: string; hardwood: string; vinyl: string; staircase: string };

  // Service pages
  hardwoodPage: HardwoodPageConfig;
  vinylPage: VinylPageConfig;
  sandingPage: SandingPageConfig;
  staircasePage: StaircasePageConfig;
}

const defaultConfig: SiteConfig = {
  heroSubtitle: "Flooring Experts Serving Johnson County and Surrounding Areas",
  heroTitle: "Transform Your Home with Expert Flooring",
  heroTitleHighlight: "Installation & Refinishing",
  heroDescription: "Whether you need new flooring installation or professional refinishing, our team delivers beautiful, durable floors that transform the look and value of your home.",
  heroCta1: "Get Your Free Flooring Estimate",
  heroCta2: "Call (913) 915-3193",
  heroPhone: "9139153193",
  heroNote: "Free • No Obligation • Fast Response",

  stats: [
    { value: "23+", label: "Years Experience" },
    { value: "1,000+", label: "Projects Completed" },
    { value: "5.0", label: "Google Rating" },
  ],

  servicesBadge: "✨ Premium Flooring Services",
  servicesTitle: "Expert Flooring Installation &",
  servicesTitleHighlight: "Refinishing Services",
  servicesSubtitle: "Upgrade your home with professionally installed or beautifully refinished floors built to last.",

  whyTitle: "Why Choose",
  whyTitleHighlight: "Hardwood Kings?",

  craftTitle: "Craftsmanship That",
  craftTitleHighlight: "Speaks for Itself",
  craftText1: "With over 23 years of hands-on flooring experience, our owner Thiago Reis brings true artisan-level craftsmanship to every project. Every floor we install or restore reflects decades of dedication and expertise.",
  craftText2: 'The name Hardwood Kings comes from the family name Reis, meaning "Kings" — representing the pride, craftsmanship, and responsibility behind every project.',
  craftBadge: "23+ Years",

  testimonialsLabel: "Testimonials",
  testimonialsTitle: "See What Our",
  testimonialsTitleHighlight: "Customers",
  testimonialsSubtitle: "Homeowners trust Hardwood Kings for high-quality flooring installation and refinishing services.",
  testimonialsFooter: "Based on 35+ Reviews on Google",

  ctaTitle: "Let's Build Something Beautiful, Together.",
  ctaSubtitle: "Ready to transform your home? Get your free flooring estimate with fast response from our local experts.",
  ctaCta1: "Get Your Free Estimate",
  ctaCta2: "Call (913) 915-3193",

  serviceAreasTitle: "Service Areas in Johnson County",
  serviceAreasText: "Overland Park • Olathe • Lenexa • Shawnee • Leawood • Prairie Village • Mission • Roeland Park • Fairway • Merriam • Kansas City, KS • Kansas City, MO • Lee's Summit",

  phone: "(913) 915-3193",
  email: "hardwoodkingsinc@gmail.com",
  servingArea: "Johnson County & Surrounding Areas",
  footerTagline: "Premium Hardwood Flooring Installation & Refinishing in Johnson County and Surrounding Areas.",
  footerSlogan: "Floors Fit for Kings",

  colorPrimary: "40 70% 50%",
  colorGold: "40 70% 50%",
  colorGoldLight: "40 80% 65%",
  colorGoldDark: "35 60% 35%",
  colorBackground: "30 10% 6%",
  colorForeground: "40 20% 92%",
  colorCard: "30 8% 10%",
  colorBorder: "30 8% 20%",

  buttonRadius: "0.5rem",
  buttonBorderWidth: "2px",

  heroImage: "",
  craftImage: "",
  logoImage: "",
  serviceImages: { sanding: "", hardwood: "", vinyl: "", staircase: "" },

  hardwoodPage: {
    heroLabel: "Hardwood Flooring",
    heroTitle: "Beautiful Hardwood Floors",
    heroHighlight: "Professionally Installed",
    heroDescription: "Hardwood floors bring warmth, elegance, and long-term value to any home. Our professional installation ensures a flawless finish.",
    heroCta: "Get Your Free Estimate",
    sectionTitle: "Why Choose Our",
    sectionHighlight: "Hardwood Flooring?",
    sectionSubtitle: "Professionally installed hardwood floors that bring lasting beauty, durability, and value.",
    ctaTitle: "Ready to Upgrade Your Home?",
    ctaSubtitle: "Get a free in-home flooring estimate and discover how premium hardwood flooring can transform your space.",
    ctaCta1: "Get Your Free Estimate",
    ctaCta2: "Call (913) 915-3193",
    benefits: [
      "Expert Professional Installation",
      "Lifetime Structural Warranty",
      "Increases Home Value",
      "Custom Staining & Finishing Options",
      "Minimal disruption installation process",
    ],
    features: [
      { title: "Premium Quality Materials", desc: "Only the finest hardwood species from trusted suppliers" },
      { title: "Installation Guarantee", desc: "Every hardwood floor is backed by our commitment to quality and durability" },
      { title: "Craftsmanship Guarantee", desc: "Professional installation standards designed for long-lasting results" },
    ],
    steps: [
      { num: "01", title: "Free In-Home Consultation", desc: "We visit your home, evaluate the space, and help you choose the best hardwood flooring options." },
      { num: "02", title: "Professional Installation", desc: "Our experienced installers prepare the subfloor and install your hardwood with expert craftsmanship." },
      { num: "03", title: "Final Walkthrough & Inspection", desc: "We review the finished project with you to ensure every detail meets our quality standards." },
    ],
  },

  vinylPage: {
    heroLabel: "Luxury Vinyl Plank",
    heroTitle: "Beautiful Luxury Vinyl Plank",
    heroHighlight: "Flooring Installation",
    heroDescription: "Waterproof, durable, and designed to look like real hardwood.",
    heroCta: "Get Your Free Estimate",
    sectionTitle: "Why Homeowners Choose",
    sectionHighlight: "Luxury Vinyl",
    sectionSubtitle: "Natural look of hardwood with modern durability and waterproof protection.",
    ctaTitle: "Ready for Worry-Free Floors?",
    ctaSubtitle: "Experience the beauty of hardwood without the limitations.",
    ctaCta1: "Get Free Quote",
    ctaCta2: "Call (913) 915-3193",
    features: [
      { title: "100% Waterproof", desc: "Ideal for kitchens, bathrooms, basements, and moisture-prone areas." },
      { title: "Built for High Traffic", desc: "Designed to withstand heavy foot traffic in homes and commercial spaces." },
      { title: "Fast Installation", desc: "Most projects completed quickly with minimal disruption." },
      { title: "Comfortable Underfoot", desc: "Softer and warmer than tile or traditional hardwood." },
    ],
    rooms: [
      { room: "Kitchen", benefits: "Waterproof spill protection • Easy to clean", tag: "Perfect choice" },
      { room: "Bathroom", benefits: "100% moisture resistant • Anti-slip surface", tag: "Ideal solution" },
      { room: "Basement", benefits: "Moisture barrier • Temperature stable", tag: "Best option" },
      { room: "Living Areas", benefits: "Beautiful wood look • Pet friendly", tag: "Excellent choice" },
      { room: "Office & Retail", benefits: "High foot traffic • Professional look", tag: "Commercial Use" },
      { room: "Rental Properties", benefits: "Durable • Low maintenance • Cost effective", tag: "Property Owners" },
    ],
    comparison: [
      { feature: "Water Resistance", vinyl: "100% waterproof", hardwood: "Not recommended for moisture" },
      { feature: "Durability", vinyl: "Scratch & dent resistant", hardwood: "Can scratch but refinishable" },
      { feature: "Maintenance", vinyl: "Very easy to clean", hardwood: "Requires more care" },
      { feature: "Installation", vinyl: "Faster installation", hardwood: "More complex" },
      { feature: "Longevity", vinyl: "15–25 years", hardwood: "Decades with refinishing" },
      { feature: "Appearance", vinyl: "Realistic wood look", hardwood: "Natural real wood" },
    ],
  },

  sandingPage: {
    heroLabel: "Sanding & Refinishing",
    heroTitle: "Your Hardwood Floors Can Look",
    heroHighlight: "Beautiful Again",
    heroDescription: "Bring your worn, scratched, or faded hardwood floors back to life with our professional refinishing process.",
    heroCta: "Get Your Free Estimate",
    sectionTitle: "Why Choose Our",
    sectionHighlight: "Service?",
    sectionSubtitle: "Restore the beauty of your hardwood floors and save thousands compared to replacing them.",
    ctaTitle: "Ready to Restore Your Hardwood Floors?",
    ctaSubtitle: "Get a free flooring estimate and see how our professional refinishing can bring your floors back to life.",
    ctaCta1: "Get Your Free Estimate",
    ctaCta2: "View Our Projects",
    benefits: [
      { title: "Long-Lasting Protection", desc: "Our professional sanding and finishing process protects your hardwood floors with a durable coating built to last for years." },
      { title: "Increase Home Value", desc: "Beautiful hardwood floors are one of the most desirable features for homeowners and future buyers." },
      { title: "Save Thousands", desc: "Refinishing restores your existing hardwood floors at a fraction of the cost of installing brand-new flooring." },
      { title: "Fast & Efficient", desc: "Most refinishing projects are completed in just a few days, transforming your floors without major disruption." },
    ],
    steps: [
      { num: "01", title: "Professional Sanding", desc: "We carefully sand the entire floor surface to remove old finishes, scratches, stains, and imperfections." },
      { num: "02", title: "Custom Stain Selection", desc: "Choose to keep the natural wood color or select from a range of beautiful stain options to match your home's style." },
      { num: "03", title: "Premium Protective Finish", desc: "We apply three coats of premium Bona or Loba finish, creating a durable protective layer with your choice of sheen." },
    ],
    finishes: [
      { name: "Matte Finish", desc: "Natural look with minimal sheen, hides minor imperfections", best: "High-traffic areas" },
      { name: "Satin Finish", desc: "Perfect balance of durability and beauty with subtle luster", best: "Most popular choice" },
      { name: "Semi-Gloss Finish", desc: "Higher sheen with excellent durability and easy cleaning", best: "Kitchens & bathrooms" },
    ],
  },

  staircasePage: {
    heroLabel: "Staircase Services",
    heroTitle: "Custom Staircase Installation &",
    heroHighlight: "Refinishing",
    heroDescription: "Create a stunning focal point with our custom staircase design and installation services.",
    heroCta: "Get Design Consultation",
    sectionTitle: "Our Staircase",
    sectionHighlight: "Services",
    sectionSubtitle: "",
    ctaTitle: "Ready to Transform Your Staircase?",
    ctaSubtitle: "Let's create a stunning centerpiece for your home.",
    ctaCta1: "Get Design Consultation",
    ctaCta2: "Call (913) 915-3193",
    services: [
      { title: "Custom Staircase Installation", desc: "New staircase construction with custom design and premium materials.", tags: ["Custom Design", "Hardwood Treads & Risers", "Expert Installation"] },
      { title: "Staircase Renovation & Refinishing", desc: "Transform outdated stairs with new hardwood components and professional refinishing.", tags: ["Tread Replacement", "Stair Sanding & Refinishing", "Safety Improvements"] },
    ],
    benefits: [
      "Custom Design & Craftsmanship",
      "Premium Hardwood Materials",
      "Built for Safety & Code Compliance",
      "Complete Staircase Transformation",
      "Increase Your Home's Value",
      "Professional Installation & Refinishing",
    ],
    styles: [
      { name: "Traditional Oak", desc: "Classic styling with rich oak treads and elegant turned balusters", tags: ["Timeless Appeal", "Durable", "Warm Finish"] },
      { name: "Modern Minimalist", desc: "Clean lines with sleek glass or metal railings for contemporary homes", tags: ["Contemporary", "Open Feel", "Premium Materials"] },
      { name: "Rustic Farmhouse", desc: "Reclaimed wood styling with wrought iron accents for character", tags: ["Unique Character", "Mixed Materials", "Authentic Look"] },
    ],
    safety: ["Proper Tread Depth & Rise", "Non-Slip Surface Treatment", "Proper Lighting Integration", "Child Safety Considerations"],
  },
};

interface SiteConfigContextType {
  config: SiteConfig;
  updateConfig: (partial: Partial<SiteConfig>) => void;
  saveConfig: () => void;
  resetConfig: () => void;
  hasUnsavedChanges: boolean;
  autoSaveEnabled: boolean;
  setAutoSaveEnabled: (v: boolean) => void;
}

const SiteConfigContext = createContext<SiteConfigContextType>({
  config: defaultConfig,
  updateConfig: () => {},
  saveConfig: () => {},
  resetConfig: () => {},
  hasUnsavedChanges: false,
  autoSaveEnabled: true,
  setAutoSaveEnabled: () => {},
});

const STORAGE_KEY = "hk_site_config";

export function SiteConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<SiteConfig>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Deep merge service pages to include new array fields
        return {
          ...defaultConfig,
          ...parsed,
          hardwoodPage: { ...defaultConfig.hardwoodPage, ...parsed.hardwoodPage },
          vinylPage: { ...defaultConfig.vinylPage, ...parsed.vinylPage },
          sandingPage: { ...defaultConfig.sandingPage, ...parsed.sandingPage },
          staircasePage: { ...defaultConfig.staircasePage, ...parsed.staircasePage },
        };
      }
    } catch {}
    return defaultConfig;
  });

  const [savedConfig, setSavedConfig] = useState<SiteConfig>(config);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout>>();

  const hasUnsavedChanges = JSON.stringify(config) !== JSON.stringify(savedConfig);

  const saveConfig = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    setSavedConfig(config);
  }, [config]);

  const updateConfig = useCallback((partial: Partial<SiteConfig>) => {
    setConfig(prev => ({ ...prev, ...partial }));
  }, []);

  const resetConfig = useCallback(() => {
    setConfig(defaultConfig);
    localStorage.removeItem(STORAGE_KEY);
    setSavedConfig(defaultConfig);
  }, []);

  useEffect(() => {
    if (!autoSaveEnabled || !hasUnsavedChanges) return;
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
      setSavedConfig(config);
    }, 2000);
    return () => { if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current); };
  }, [config, autoSaveEnabled, hasUnsavedChanges]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--primary", config.colorPrimary);
    root.style.setProperty("--gold", config.colorGold);
    root.style.setProperty("--gold-light", config.colorGoldLight);
    root.style.setProperty("--gold-dark", config.colorGoldDark);
    root.style.setProperty("--background", config.colorBackground);
    root.style.setProperty("--foreground", config.colorForeground);
    root.style.setProperty("--card", config.colorCard);
    root.style.setProperty("--border", config.colorBorder);
    root.style.setProperty("--accent", config.colorPrimary);
    root.style.setProperty("--ring", config.colorGold);
    root.style.setProperty("--radius", config.buttonRadius);
  }, [config]);

  return (
    <SiteConfigContext.Provider value={{ config, updateConfig, saveConfig, resetConfig, hasUnsavedChanges, autoSaveEnabled, setAutoSaveEnabled }}>
      {children}
    </SiteConfigContext.Provider>
  );
}

export const useSiteConfig = () => useContext(SiteConfigContext);
export { defaultConfig };
