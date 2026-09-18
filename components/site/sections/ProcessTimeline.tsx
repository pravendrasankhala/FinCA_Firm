"use client";

import { motion } from "framer-motion";
import type { ProcessStep } from "@prisma/client";
import type { SectionIntroContent } from "@/lib/types/sections";
import { SectionIntro } from "@/components/site/SectionIntro";

export function ProcessTimeline({
  content,
  steps,
}: {
  content: SectionIntroContent;
  steps: ProcessStep[];
}) {
  if (steps.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
      <SectionIntro {...content} />

      <div className="relative mt-16">
        <div className="absolute top-6 right-0 left-0 hidden h-px bg-border lg:block" />
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {steps.map((step, i) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="relative"
            >
              <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 border-primary bg-background text-sm font-semibold text-primary">
                {step.number}
              </div>
              <h3 className="mt-5 text-base font-semibold text-foreground">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
