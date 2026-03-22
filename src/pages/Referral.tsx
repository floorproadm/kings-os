import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Gift, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const rewards = [
  { project: "$5K project", reward: "$250" },
  { project: "$10K project", reward: "$500" },
  { project: "$15K project", reward: "$750" },
  { project: "$25K project", reward: "$1,250" },
];

const steps = [
  { num: "01", title: "Refer Someone", desc: "Tell your friends, neighbors, or family members about Hardwood Kings." },
  { num: "02", title: "We Handle the Project", desc: "Our team schedules the estimate, completes the project, and delivers the same quality you experienced." },
  { num: "03", title: "Earn Your Reward", desc: "When the project is completed, you receive 5% of the total project value as a referral reward." },
];

export default function Referral() {
  return (
    <Layout>
      <section className="section-padding bg-secondary/50">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-6"
          >
            <Gift className="w-8 h-8 text-gold" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4"
          >
            Refer a Friend. <span className="gold-gradient-text">Earn 5%.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="text-muted-foreground max-w-xl mx-auto mb-4"
          >
            Love your new floors? Refer friends, neighbors, or family and earn 5% of every project you send our way.
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-sm text-gold"
          >
            ❤️ Your referrals will receive the same premium service you did.
          </motion.p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container mx-auto max-w-4xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-display text-3xl font-bold text-foreground text-center mb-12"
          >
            How It <span className="gold-gradient-text">Works</span>
          </motion.h2>
          <div className="space-y-6">
            {steps.map((s, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="elevated-card p-6 flex gap-6 items-start"
              >
                <div className="text-3xl font-display font-bold text-gold/30">{s.num}</div>
                <div>
                  <h3 className="font-display font-bold text-foreground mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-secondary/50">
        <div className="container mx-auto max-w-2xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-display text-2xl font-bold text-foreground text-center mb-8"
          >
            Example Referral <span className="gold-gradient-text">Rewards</span>
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="elevated-card overflow-hidden"
          >
            <div className="grid grid-cols-2 bg-gold/10 p-4 text-sm font-semibold text-foreground">
              <span>Project Value</span>
              <span className="text-gold text-right">Your Reward</span>
            </div>
            {rewards.map((r, i) => (
              <div key={i} className={`grid grid-cols-2 p-4 text-sm ${i % 2 === 0 ? 'bg-card' : 'bg-secondary/30'}`}>
                <span className="text-foreground">{r.project}</span>
                <span className="text-gold font-bold text-right">{r.reward}</span>
              </div>
            ))}
          </motion.div>
          <p className="text-xs text-muted-foreground text-center mt-4">Referral rewards are issued after the referred customer signs a contract and the project is completed.</p>
        </div>
      </section>

      <section className="section-padding bg-gradient-to-r from-gold-light/80 via-gold/70 to-gold-dark/80">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="container mx-auto text-center"
        >
          <h2 className="font-display text-3xl font-bold text-primary-foreground mb-4">Start Referring Today</h2>
          <p className="text-primary-foreground/80 mb-8">There's no limit to how much you can earn.</p>
          <Button variant="default" size="xl" className="bg-background text-foreground hover:bg-background/90" asChild>
            <Link to="/contact">Contact Us to Refer</Link>
          </Button>
        </motion.div>
      </section>
    </Layout>
  );
}
