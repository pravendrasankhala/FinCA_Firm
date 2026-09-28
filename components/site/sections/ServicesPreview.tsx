"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { Service } from "@prisma/client";
import type { SectionIntroContent } from "@/lib/types/sections";
import { SectionIntro } from "@/components/site/SectionIntro";
import { ServiceSplitCard } from "@/components/site/ServiceSplitCard";

export function ServicesPreview({
  content,
  services,
}: {
  content: SectionIntroContent;
  services: Service[];
}) {
  if (services.length === 0) return null;

  return (
    <section id="services" className="bg-secondary/40 py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <SectionIntro {...content} />
        </motion.div>

        <div className="relative mx-auto mt-14 flex max-w-5xl flex-col gap-4 sm:mt-16 sm:gap-20 lg:mt-20 lg:gap-32">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="sticky top-24"
              style={{ zIndex: index + 1 }}
            >
              <ServiceSplitCard service={service} />
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-all hover:gap-3"
          >
            View All Services
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
