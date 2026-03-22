import type { Variants } from "framer-motion";

/**
 * Blur-in entrance animation for main titles.
 * Usage: <motion.h1 variants={blurIn} initial="hidden" animate="visible" />
 * Or with whileInView: <motion.h2 variants={blurIn} initial="hidden" whileInView="visible" viewport={{ once: true }} />
 */
export const blurIn: Variants = {
  hidden: { opacity: 0, y: 20, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

/**
 * Blur-in with custom delay support.
 * Usage: <motion.h1 variants={blurInDelay} initial="hidden" animate="visible" custom={0.2} />
 */
export const blurInDelay: Variants = {
  hidden: { opacity: 0, y: 20, filter: "blur(10px)" },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: "easeOut", delay },
  }),
};
