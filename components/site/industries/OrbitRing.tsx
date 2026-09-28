"use client";

import { motion, useReducedMotion } from "framer-motion";

export function OrbitRing() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.svg
      viewBox="0 0 1000 1000"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 -z-10 h-full w-full text-border"
      fill="none"
      animate={reduceMotion ? undefined : { rotate: [0, 2.5, 0, -2.5, 0] }}
      style={{ transformOrigin: "50% 50%" }}
      transition={reduceMotion ? undefined : { duration: 40, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* base ring — thin, dashed, passes near each node's connector dot */}
      <motion.circle
        cx="500"
        cy="500"
        r="380"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeDasharray="2 10"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 0.6 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 2, ease: "easeInOut" }}
      />
      {/* gold accent arc — over the top, roughly Startups to Retail & Trading */}
      <motion.path
        d="M 120 500 A 380 380 0 0 1 880 500"
        stroke="var(--gold-500)"
        strokeWidth="2.5"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 0.7 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1.8, ease: "easeInOut", delay: 0.3 }}
      />
      {/* navy accent arc — right side, roughly Retail & Trading to Real Estate */}
      <motion.path
        d="M 880 500 A 380 380 0 0 1 500 880"
        stroke="var(--navy-900)"
        strokeWidth="2.5"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 0.55 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1.8, ease: "easeInOut", delay: 0.45 }}
      />
    </motion.svg>
  );
}
