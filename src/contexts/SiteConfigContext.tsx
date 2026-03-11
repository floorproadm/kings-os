import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";

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

  // Colors (CSS custom properties overrides)
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

  // Images (base64 or URL)
  heroImage: string;
  craftImage: string;
  logoImage: string;
  serviceImages: { sanding: string; hardwood: string; vinyl: string; staircase: string };
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
      if (stored) return { ...defaultConfig, ...JSON.parse(stored) };
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

  // Auto-save with debounce
  useEffect(() => {
    if (!autoSaveEnabled || !hasUnsavedChanges) return;
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
      setSavedConfig(config);
    }, 2000);
    return () => { if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current); };
  }, [config, autoSaveEnabled, hasUnsavedChanges]);

  // Apply color overrides to CSS custom properties
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
