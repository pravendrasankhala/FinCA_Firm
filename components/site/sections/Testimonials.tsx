"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import type { Testimonial } from "@prisma/client";
import type { SectionIntroContent } from "@/lib/types/sections";
import { SectionIntro } from "@/components/site/SectionIntro";
import { cn } from "@/lib/utils";

export function Testimonials({
  content,
  testimonials,
}: {
  content: SectionIntroContent;
  testimonials: Testimonial[];
}) {
  const [index, setIndex] = useState(0);

  if (testimonials.length === 0) return null;

  const current = testimonials[index];
  const next = () => setIndex((i) => (i + 1) % testimonials.length);
  const prev = () => setIndex((i) => (i - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
      <SectionIntro {...content} />

      <div className="relative mx-auto mt-14 max-w-3xl">
        <Quote className="mx-auto h-8 w-8 text-gold-500" />

        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
            className="mt-6 text-center"
          >
            <p className="text-lg leading-relaxed text-foreground sm:text-xl">
              &ldquo;{current.content}&rdquo;
            </p>
            <div className="mt-6 flex items-center justify-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-4 w-4",
                    i < current.rating ? "fill-gold-500 text-gold-500" : "text-border"
                  )}
                />
              ))}
            </div>
            <div className="mt-4 flex items-center justify-center gap-3">
              {current.photoUrl && (
                <div className="relative h-10 w-10 overflow-hidden rounded-full">
                  <Image src={current.photoUrl} alt={current.clientName} fill className="object-cover" />
                </div>
              )}
              <div className="text-left">
                <p className="text-sm font-semibold text-foreground">{current.clientName}</p>
                <p className="text-xs text-muted-foreground">
                  {[current.designation, current.company].filter(Boolean).join(", ")}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {testimonials.length > 1 && (
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              onClick={prev}
              aria-label="Previous testimonial"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-muted"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((t, i) => (
                <button
                  key={t.id}
                  onClick={() => setIndex(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                  className={cn(
                    "h-1.5 w-6 rounded-full transition-colors",
                    i === index ? "bg-primary" : "bg-border"
                  )}
                />
              ))}
            </div>
            <button
              onClick={next}
              aria-label="Next testimonial"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-muted"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
