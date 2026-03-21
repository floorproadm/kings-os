import { Link } from "react-router-dom";
import { Phone, Mail } from "lucide-react";
import logoCrown from "@/assets/logo-crown.webp";

const serviceLinks = [
  { name: "Hardwood Installation", path: "/services/hardwood" },
  { name: "Sanding & Refinishing", path: "/services/sanding" },
  { name: "Staircase Finishing", path: "/services/staircase" },
  { name: "Vinyl & Engineered Wood", path: "/services/vinyl" },
  { name: "Deck & Handrail", path: "/services/deck" },
  { name: "Wash & Polish", path: "/services/wash" },
];

const quickLinks = [
  { name: "About Us", path: "/about" },
  { name: "Gallery", path: "/gallery" },
  { name: "Contact", path: "/contact" },
  { name: "For Builders", path: "/builders" },
  { name: "For Realtors", path: "/realtors" },
  { name: "Referral Program", path: "/referral" },
];

export default function Footer() {
  return (
    <footer className="bg-dark-surface border-t border-border/30">
      <div className="container mx-auto section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img src={logoCrown} alt="Hardwood Kings" className="h-8 w-auto" />
              <div>
                <span className="font-display text-lg font-bold text-foreground">HARDWOOD</span>
                <span className="font-display text-lg font-bold text-gold ml-1">KINGS</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              24+ Years of Craftsmanship · Johnson County, KS
            </p>
            <p className="text-xs text-gold font-display italic">
              Your Vision, Our Craftsmanship
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display text-sm font-bold text-foreground mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {serviceLinks.map((l) => (
                <li key={l.path}>
                  <Link to={l.path} className="hover:text-gold transition-colors">
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-sm font-bold text-foreground mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {quickLinks.map((l) => (
                <li key={l.path}>
                  <Link to={l.path} className="hover:text-gold transition-colors">
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-sm font-bold text-foreground mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gold" />
                <a href="tel:+19139153193" className="hover:text-gold transition-colors">
                  (913) 915-3193
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gold" />
                <a
                  href="mailto:hardwoodkingsinc@gmail.com"
                  className="hover:text-gold transition-colors"
                >
                  hardwoodkingsinc@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© 2026 Hardwood Kings Inc. All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <a
              href="https://instagram.com/hardwoodkingsinc"
              target="_blank"
              rel="noopener"
              className="hover:text-gold transition-colors"
            >
              Instagram
            </a>
            <a
              href="https://facebook.com/hardwoodkingsinc"
              target="_blank"
              rel="noopener"
              className="hover:text-gold transition-colors"
            >
              Facebook
            </a>
            <a
              href="https://g.co/kgs/a7HT8TK"
              target="_blank"
              rel="noopener"
              className="hover:text-gold transition-colors"
            >
              Google Reviews
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
