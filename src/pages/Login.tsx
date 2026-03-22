import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Mail, ArrowLeft, Crown, Shield } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      navigate("/admin");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a06] p-4 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full bg-gold/[0.04] blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-[880px] rounded-3xl overflow-hidden border border-gold/10 shadow-[0_0_80px_-20px_hsl(var(--gold)/0.15)] flex flex-col md:flex-row"
      >
        {/* Left branding panel */}
        <div className="relative w-full md:w-[380px] shrink-0 overflow-hidden">
          {/* Multi-layer gradient background */}
          <div className="absolute inset-0 gold-gradient-bg" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20" />

          {/* Decorative orbs */}
          <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-white/8 blur-2xl" />
          <div className="absolute -bottom-20 -right-20 w-56 h-56 rounded-full bg-white/6 blur-2xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-white/5 blur-3xl" />

          <div className="relative z-10 p-8 md:p-10 flex flex-col justify-center items-center text-center h-full min-h-[220px] md:min-h-[480px]">
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 180, damping: 14 }}
              className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mb-6 border border-white/10 shadow-lg"
            >
              <Crown className="w-10 h-10 text-primary-foreground drop-shadow-md" />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="font-display text-3xl font-bold text-primary-foreground mb-2 tracking-tight"
            >
              Hardwood Kings
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.55, duration: 0.5 }}
              className="w-12 h-[2px] bg-primary-foreground/30 rounded-full mb-4"
            />

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-primary-foreground/70 text-sm leading-relaxed max-w-[240px]"
            >
              Painel administrativo para gerenciamento de leads, serviços e parceiros.
            </motion.p>

            {/* Stats pills */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75 }}
              className="hidden md:flex gap-3 mt-8"
            >
              {[
                { label: "Since", value: "2001" },
                { label: "KC Area", value: "#1" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10"
                >
                  <span className="block text-xs text-primary-foreground/50 uppercase tracking-wider">
                    {s.label}
                  </span>
                  <span className="block text-lg font-bold text-primary-foreground font-display">
                    {s.value}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Right login panel */}
        <div className="flex-1 bg-background p-8 sm:p-10 md:p-12 flex flex-col justify-center">
          <div className="max-w-xs mx-auto w-full">
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.25, type: "spring", stiffness: 200 }}
                className="w-12 h-12 mx-auto rounded-xl bg-gold/10 flex items-center justify-center mb-4 border border-gold/10"
              >
                <Shield className="w-6 h-6 text-gold" />
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, filter: "blur(8px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                transition={{ delay: 0.35, duration: 0.6 }}
                className="font-display text-2xl font-bold text-foreground tracking-tight"
              >
                Kings OS
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
                className="text-xs text-muted-foreground mt-1.5 uppercase tracking-[0.15em]"
              >
                Admin Access
              </motion.p>
            </div>

            <motion.form
              onSubmit={handleSubmit}
              className="space-y-3"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground pl-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
                  <Input
                    type="email"
                    required
                    placeholder="admin@hardwoodkings.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-11 h-11 bg-secondary/30 border-border/40 focus:border-gold/40 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground pl-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
                  <Input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-11 h-11 bg-secondary/30 border-border/40 focus:border-gold/40 transition-colors"
                  />
                </div>
              </div>

              <div className="pt-2">
                <Button variant="gold" className="w-full h-11" type="submit" disabled={loading}>
                  {loading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                    />
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </div>
            </motion.form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-8 text-center"
            >
              <a
                href="/"
                className="text-xs text-muted-foreground/60 hover:text-gold transition-colors inline-flex items-center gap-1.5 group"
              >
                <ArrowLeft className="w-3 h-3 transition-transform group-hover:-translate-x-0.5" />
                Back to site
              </a>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
