"use client";

import { motion, type Variants } from "framer-motion";
import type { Industry } from "@prisma/client";
import { IndustryNode } from "./IndustryNode";
import { IndustriesCenter } from "./IndustriesCenter";

const listVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -16 },
  show: { opacity: 1, x: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

export function IndustriesTimelineMobile({ industries }: { industries: Industry[] }) {
  return (
    <div className="md:hidden">
      <div className="flex justify-center">
        <IndustriesCenter />
      </div>

      <motion.div
        variants={listVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        className="relative mt-10 space-y-6 pl-8"
      >
        <div aria-hidden className="absolute top-0 bottom-0 left-3 w-px bg-border" />

        {industries.map((industry, index) => (
          <div key={industry.id} className="relative">
            <span
              aria-hidden
              className="absolute top-6 -left-8 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-gold-500 ring-4 ring-background"
            />
            <IndustryNode
              industry={industry}
              index={index}
              featured={industry.slug === "startups"}
              variants={itemVariants}
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
