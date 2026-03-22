import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Phone, ChevronDown, Facebook, Instagram } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logoCrown from "@/assets/logo-crown.webp";
import { useSiteConfig } from "@/contexts/SiteConfigContext";
import { useScroll } from "@/components/ui/use-scroll";
import { MenuToggleIcon } from "@/components/ui/menu-toggle-icon";

const services = [
  { name: "Hardwood Floor Installation", path: "/services/hardwood" },
  { name: "Sanding, Staining & Refinishing", path: "/services/sanding" },
  { name: "Staircase Design & Finishing", path: "/services/staircase" },
  { name: "Demolition & Replacement", path: "/services/demolition" },
  { name: "Vinyl & Engineered Wood", path: "/services/vinyl" },
  { name: "Deck & Handrail Refinishing", path: "/services/deck" },
  { name: "Wash & Polish", path: "/services/wash" },
];

const navLinks = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Gallery", path: "/gallery" },
  { name: "Contact", path: "/contact" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const location = useLocation();
  const { config } = useSiteConfig();
  const scrolled = useScroll(10);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-gold-dark via-gold to-gold-light border-b border-gold/30">
        <div className="container mx-auto flex items-center justify-between px-4 py-2 text-sm">
          <div className="flex items-center gap-4">
            <a
              href="sms:+19139153193?body=Hi! I'm interested in a flooring estimate from your website."
              className="flex items-center gap-1.5 text-background/70 hover:text-background transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Call or Text:</span>
              <span className="font-semibold text-background">(913) 915-3193</span>
            </a>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden md:inline text-xs text-background/70">
              Serving <strong className="text-background">Johnson County, KS</strong>
            </span>
            <a
              href="https://www.instagram.com/hardwoodkingsinc/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-7 h-7 bg-background/15 text-background/70 flex items-center justify-center rounded hover:bg-background/25 hover:text-background transition-colors"
            >
              <Instagram className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://www.facebook.com/hardwoodkingsinc"
              target="_blank"
              rel="noopener noreferrer"
              className="w-7 h-7 bg-background/15 text-background/70 flex items-center justify-center rounded hover:bg-background/25 hover:text-background transition-colors"
            >
              <Facebook className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://nextdoor.com/pages/hardwood-kings-inc-long-branch-nj/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-7 h-7 bg-background/15 text-background/70 flex items-center justify-center rounded hover:bg-background/25 hover:text-background transition-colors"
              aria-label="Nextdoor"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.2 14.4c0 .33-.27.6-.6.6h-1.2c-.33 0-.6-.27-.6-.6v-4.8c0-.88-.72-1.6-1.6-1.6s-1.6.72-1.6 1.6v4.8c0 .33-.27.6-.6.6H7.8c-.33 0-.6-.27-.6-.6v-4.8c0-2.65 2.15-4.8 4.8-4.8s4.8 2.15 4.8 4.8v4.8z"/></svg>
            </a>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <header className={`border-b border-border/30 transition-all duration-300 ${scrolled ? "bg-background/95 backdrop-blur-md shadow-lg shadow-black/10 py-1" : "bg-background/80 backdrop-blur-sm py-3"}`}>
        <div className="container mx-auto flex items-center justify-between px-4 transition-all duration-300">
          <Link to="/" className="flex items-center">
            <img src={logoCrown} alt="Hardwood Kings" className={`transition-all duration-300 ${scrolled ? "w-8 h-8" : "w-10 h-10"}`} />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.slice(0, 1).map((l) => (
              <Link
                key={l.path}
                to={l.path}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === l.path
                    ? "text-gold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {l.name}
              </Link>
            ))}

            {/* Services Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Services <ChevronDown className="w-3.5 h-3.5" />
              </button>
              <div className="absolute top-full left-0 mt-1 w-64 bg-background/95 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl shadow-black/40 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2">
                {services.map((s) => (
                  <Link
                    key={s.path}
                    to={s.path}
                    className="block px-4 py-2.5 text-sm text-muted-foreground hover:text-gold hover:bg-secondary/50 transition-colors"
                  >
                    {s.name}
                  </Link>
                ))}
              </div>
            </div>

            {navLinks.slice(1).map((l) => (
              <Link
                key={l.path}
                to={l.path}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === l.path
                    ? "text-gold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {l.name}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <Button variant="gold" size="lg" asChild>
              <a href="tel:+19139153193">Get Free Estimate</a>
            </Button>
          </div>

          {/* Mobile Toggle */}
          <button
            className="lg:hidden text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <MenuToggleIcon open={mobileOpen} className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden bg-background/40 backdrop-blur-2xl backdrop-saturate-150 border-t border-white/10 px-4 py-4 space-y-1">
            {navLinks.map((l) => (
              <Link
                key={l.path}
                to={l.path}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                {l.name}
              </Link>
            ))}
            <div className="border-t border-border/30">
              <button
                onClick={() => setServicesOpen(!servicesOpen)}
                className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-semibold uppercase tracking-wider text-muted-foreground"
              >
                Services
                <ChevronDown className={`w-4 h-4 text-gold transition-transform duration-300 ${servicesOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence initial={false}>
                {servicesOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    {services.map((s) => (
                      <Link
                        key={s.path}
                        to={s.path}
                        onClick={() => setMobileOpen(false)}
                        className="block px-3 py-2 text-sm text-muted-foreground hover:text-gold"
                      >
                        {s.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="pt-3">
              <Button variant="gold" className="w-full" asChild>
                <a href="tel:+19139153193" onClick={() => setMobileOpen(false)}>
                  Get Free Estimate
                </a>
              </Button>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}
