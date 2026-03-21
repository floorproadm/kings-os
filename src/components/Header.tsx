import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Phone, Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logoCrown from "@/assets/logo-crown.webp";
import { useSiteConfig } from "@/contexts/SiteConfigContext";

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
  const location = useLocation();
  const { config } = useSiteConfig();

  return (
    <>
      {/* Top Bar */}
      <div className="bg-secondary border-b border-border/50">
        <div className="container mx-auto flex items-center justify-between px-4 py-2 text-sm">
          <div className="flex items-center gap-4">
            <a
              href="tel:+19139153193"
              className="flex items-center gap-1.5 text-muted-foreground hover:text-gold transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Call or Text:</span>
              <span className="font-semibold text-foreground">(913) 915-3193</span>
            </a>
          </div>
          <div className="flex items-center gap-3 text-muted-foreground">
            <span className="hidden md:inline text-xs">
              Serving <strong className="text-foreground">Johnson County, KS</strong>
            </span>
            <a
              href="https://instagram.com/hardwoodkingsinc"
              target="_blank"
              rel="noopener"
              className="hover:text-gold transition-colors text-xs"
            >
              Instagram
            </a>
            <a
              href="https://facebook.com/hardwoodkingsinc"
              target="_blank"
              rel="noopener"
              className="hover:text-gold transition-colors text-xs"
            >
              Facebook
            </a>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/30">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <img src={logoCrown} alt="Hardwood Kings" className="w-8 h-8" />
            <div className="leading-tight">
              <span className="font-display text-lg font-bold text-foreground">HARDWOOD</span>
              <span className="font-display text-lg font-bold text-gold ml-1">KINGS</span>
            </div>
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
              <div className="absolute top-full left-0 mt-1 w-64 bg-card border border-border rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2">
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
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden bg-card border-t border-border/30 px-4 py-4 space-y-1">
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
            <div className="pt-2 border-t border-border/30">
              <p className="px-3 py-1 text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                Services
              </p>
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
    </>
  );
}
