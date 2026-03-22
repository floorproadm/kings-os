import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Mail, ArrowLeft, Crown } from "lucide-react";
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
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-[820px] rounded-2xl overflow-hidden border border-border/30 shadow-2xl flex flex-col md:flex-row"
      >
        {/* Left branding panel */}
        <div className="relative w-full md:w-[340px] gold-gradient-bg p-8 md:p-10 flex flex-col justify-center items-center text-center shrink-0 overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute -top-20 -left-20 w-60 h-60 rounded-full bg-primary-foreground/10 blur-xl" />
          <div className="absolute -bottom-16 -right-16 w-48 h-48 rounded-full bg-primary-foreground/10 blur-xl" />

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="relative z-10 w-16 h-16 rounded-full bg-primary-foreground/15 flex items-center justify-center mb-5"
          >
            <Crown className="w-8 h-8 text-primary-foreground" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="relative z-10 font-display text-2xl font-bold text-primary-foreground mb-3"
          >
            Hardwood Kings
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="relative z-10 text-primary-foreground/80 text-sm leading-relaxed max-w-[220px]"
          >
            Painel administrativo para gerenciamento de leads, serviços e parceiros.
          </motion.p>
        </div>

        {/* Right login panel */}
        <div className="flex-1 bg-background p-8 sm:p-10 flex flex-col justify-center">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-14 h-14 mx-auto rounded-full bg-gold/10 flex items-center justify-center mb-4"
            >
              <Lock className="w-7 h-7 text-gold" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="font-display text-2xl font-bold text-foreground"
            >
              Kings OS
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-sm text-muted-foreground mt-1"
            >
              Admin Login
            </motion.p>
          </div>

          <motion.form
            onSubmit={handleSubmit}
            className="space-y-4 max-w-sm mx-auto w-full"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="email"
                required
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="password"
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="gold" className="w-full" type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Login"}
            </Button>
          </motion.form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 text-center"
          >
            <a href="/" className="text-sm text-muted-foreground hover:text-gold transition-colors inline-flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" /> Back to site
            </a>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
