"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import type { WhyChooseUsFeature } from "@prisma/client";
import type { SectionIntroContent } from "@/lib/types/sections";
import { SectionIntro } from "@/components/site/SectionIntro";

export function WhyChooseUs({
  content,
  features,
}: {
  content: SectionIntroContent;
  features: WhyChooseUsFeature[];
}) {
  if (features.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-navy-950 py-24 before:absolute before:inset-0 before:z-0 before:bg-[url('/problems.png')] before:bg-cover before:bg-center before:bg-no-repeat before:opacity-8 before:content-['']">
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <SectionIntro {...content} light />
        </motion.div>

        <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, ease: "easeOut", delay: (i % 3) * 0.1 }}
              className="flex gap-4 rounded-xl border border-navy-800 bg-navy-900/60 p-6"
            >
              <CheckCircle2 className="h-6 w-6 shrink-0 text-gold-500" />
              <div>
                <h3 className="text-base font-semibold text-white">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-navy-300">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
