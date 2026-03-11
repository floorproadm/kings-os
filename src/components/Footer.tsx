import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";
import logoCrownDefault from "@/assets/logo-crown.png";
import { useSiteConfig } from "@/contexts/SiteConfigContext";

export default function Footer() {
  const { config } = useSiteConfig();
  const logoSrc = config.logoImage || logoCrownDefault;

  return (
    <footer className="bg-dark-surface border-t border-border/30">
      <div className="container mx-auto section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img src={logoSrc} alt="Hardwood Kings" className="h-10 w-10 object-contain" />
              <div>
                <span className="font-display text-lg font-bold text-foreground">Hardwood</span>
                <span className="font-display text-lg font-bold text-gold ml-1">Kings</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{config.footerTagline}</p>
            <p className="text-xs text-gold font-display italic">{config.footerSlogan}</p>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display text-sm font-bold text-foreground mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/services/hardwood" className="hover:text-gold transition-colors">Hardwood Installation</Link></li>
              <li><Link to="/services/sanding" className="hover:text-gold transition-colors">Sanding & Refinishing</Link></li>
              <li><Link to="/services/vinyl" className="hover:text-gold transition-colors">Vinyl Plank Flooring</Link></li>
              <li><Link to="/services/staircase" className="hover:text-gold transition-colors">Staircase Renovation</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-sm font-bold text-foreground mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-gold transition-colors">About Us</Link></li>
              <li><Link to="/gallery" className="hover:text-gold transition-colors">Gallery</Link></li>
              <li><Link to="/contact" className="hover:text-gold transition-colors">Contact</Link></li>
              <li><Link to="/referral" className="hover:text-gold transition-colors">Referral Program</Link></li>
              <li><Link to="/builders" className="hover:text-gold transition-colors">For Builders</Link></li>
              <li><Link to="/realtors" className="hover:text-gold transition-colors">For Realtors</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-sm font-bold text-foreground mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gold" />
                <a href={`tel:${config.heroPhone || "9139153193"}`} className="hover:text-gold transition-colors">{config.phone}</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gold" />
                <a href={`mailto:${config.email}`} className="hover:text-gold transition-colors">{config.email}</a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gold mt-0.5" />
                <span>{config.servingArea}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© 2025 Hardwood Kings Inc. All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <a href="https://instagram.com/hardwoodkingsinc" target="_blank" rel="noopener" className="hover:text-gold transition-colors">Instagram</a>
            <a href="#" className="hover:text-gold transition-colors">Facebook</a>
            <a href="#" className="hover:text-gold transition-colors">Google Reviews</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
