import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CheckCircle, Gift } from "lucide-react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const nextSteps = [
  { num: "1", title: "Personal Project Consultation", desc: "One of our flooring specialists will review your information and contact you." },
  { num: "2", title: "In-Home Flooring Evaluation", desc: "We'll schedule a convenient time to visit and provide a clear professional estimate." },
  { num: "3", title: "Professional Installation or Refinishing", desc: "Our experienced craftsmen will transform your floors with precision and care." },
];

const rewards = [
  { project: "$5K project", reward: "$250" },
  { project: "$10K project", reward: "$500" },
  { project: "$15K project", reward: "$750" },
  { project: "$25K project", reward: "$1,250" },
];

export default function ThankYou() {
  return (
    <Layout>
      <section className="section-padding">
        <div className="container mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-8 h-8 text-gold" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="font-display text-4xl font-bold text-foreground mb-4"
          >
            Thank You!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-muted-foreground mb-12"
          >
            Your request has been successfully received. A flooring specialist from Hardwood Kings will contact you within <strong className="text-gold">24 hours</strong> with personalized recommendations.
          </motion.p>

          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="font-display text-2xl font-bold text-foreground mb-8"
          >
            What Happens Next
          </motion.h2>
          <div className="space-y-4 text-left">
            {nextSteps.map((s, i) => (
              <motion.div
                key={i}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                custom={i + 4}
                className="elevated-card p-5 flex gap-4 items-start"
              >
                <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0 text-gold font-bold text-sm">{s.num}</div>
                <div>
                  <h3 className="font-display font-bold text-foreground mb-1">{s.title}</h3>
                  <p className="text-sm text-muted-foreground">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Referral */}
      <section className="section-padding bg-secondary/50">
        <div className="container mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Gift className="w-10 h-10 text-gold mx-auto mb-4" />
            <h2 className="font-display text-2xl font-bold text-foreground mb-4">Know Someone Who Needs New Floors?</h2>
            <p className="text-muted-foreground mb-8">Refer friends or family to Hardwood Kings and earn <strong className="text-gold">5%</strong> of every completed project.</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="elevated-card overflow-hidden max-w-sm mx-auto mb-8"
          >
            <div className="grid grid-cols-2 bg-gold/10 p-3 text-sm font-semibold text-foreground">
              <span>Project Value</span>
              <span className="text-gold text-right">Your Reward</span>
            </div>
            {rewards.map((r, i) => (
              <div key={i} className={`grid grid-cols-2 p-3 text-sm ${i % 2 === 0 ? 'bg-card' : 'bg-secondary/30'}`}>
                <span className="text-foreground">{r.project}</span>
                <span className="text-gold font-bold text-right">{r.reward}</span>
              </div>
            ))}
          </motion.div>
          <Button variant="gold" size="lg" asChild>
            <Link to="/referral">Learn More About Referrals</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}
