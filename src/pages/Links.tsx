import { motion } from "framer-motion";
import {
  Calendar,
  Phone,
  Images,
  Star,
  Wrench,
  ClipboardCheck,
  Instagram,
  Facebook,
  MapPin,
  Gift,
} from "lucide-react";

const links = [
  {
    label: "Get Your Free Estimate",
    href: "/contact",
    icon: Calendar,
    primary: true,
  },
  {
    label: "Call Us — (913) 915-3193",
    href: "tel:+19139153193",
    icon: Phone,
    primary: true,
  },
  {
    label: "Our Services",
    href: "/services",
    icon: Wrench,
  },
  {
    label: "See Our Work",
    href: "/gallery",
    icon: Images,
  },
  {
    label: "Floor Diagnostic Quiz",
    href: "/diagnostic",
    icon: ClipboardCheck,
  },
  {
    label: "Google Reviews",
    href: "https://g.page/r/YOUR_GOOGLE_REVIEW_LINK/review",
    icon: Star,
    external: true,
  },
];

const socials = [
  {
    label: "Instagram",
    href: "https://instagram.com/kingshardwoodfloors",
    icon: Instagram,
  },
  {
    label: "Facebook",
    href: "https://facebook.com/kingshardwoodfloors",
    icon: Facebook,
  },
  {
    label: "Nextdoor",
    href: "https://nextdoor.com/pages/kings-hardwood-floors",
    icon: MapPin,
  },
];
const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.3 } },
};

const item = {
  hidden: { opacity: 0, y: 16, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export default function Links() {
  return (
    <div className="min-h-[100dvh] bg-background flex flex-col items-center px-4 py-10 sm:py-14">
      {/* Logo & Branding */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col items-center mb-8"
      >
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-gold-light via-gold to-gold-dark flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(201,168,76,0.3)]">
          <span className="text-3xl sm:text-4xl font-display font-black text-background leading-none">
            K
          </span>
        </div>
        <h1 className="font-display text-xl sm:text-2xl font-bold text-foreground tracking-wide">
          Kings Hardwood Floors
        </h1>
        <p className="text-muted-foreground text-xs sm:text-sm mt-1 uppercase tracking-[0.25em]">
          Premium Flooring • Kansas City
        </p>
      </motion.div>

      {/* Links */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="w-full max-w-sm flex flex-col gap-3"
      >
        {links.map((link) => {
          const Icon = link.icon;
          const isPrimary = link.primary;

          return (
            <motion.a
              key={link.label}
              variants={item}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              className={`group relative flex items-center justify-center gap-3 w-full py-3.5 px-5 rounded-full font-display text-sm font-semibold transition-all duration-300 ${
                isPrimary
                  ? "bg-gradient-to-r from-gold-dark via-gold to-gold-light text-background shadow-[0_0_20px_rgba(201,168,76,0.25)] hover:shadow-[0_0_30px_rgba(201,168,76,0.45)] hover:scale-[1.02]"
                  : "border border-gold/30 text-foreground hover:border-gold/60 hover:bg-gold/5 hover:scale-[1.02]"
              }`}
            >
              <Icon
                size={16}
                strokeWidth={2}
                className={isPrimary ? "text-background" : "text-gold"}
              />
              {link.label}
            </motion.a>
          );
        })}
      </motion.div>

      {/* Social Icons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="flex items-center gap-4 mt-8"
      >
        {socials.map((s) => {
          const Icon = s.icon;
          return (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="w-11 h-11 rounded-full border border-gold/30 flex items-center justify-center text-gold hover:bg-gold/10 hover:border-gold/60 transition-all duration-300"
              aria-label={s.label}
            >
              <Icon size={18} strokeWidth={2} />
            </a>
          );
        })}
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="mt-10 text-muted-foreground text-[10px] uppercase tracking-[0.3em]"
      >
        © {new Date().getFullYear()} Kings Hardwood Floors
      </motion.p>
    </div>
  );
}
