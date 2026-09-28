"use client";

import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { Industry } from "@prisma/client";
import { DynamicIcon } from "@/components/DynamicIcon";
import { cn } from "@/lib/utils";

export const NODE_TINTS = [
  { bg: "bg-blue-100", text: "text-blue-600", dot: "bg-blue-400" },
  { bg: "bg-emerald-100", text: "text-emerald-600", dot: "bg-emerald-400" },
  { bg: "bg-orange-100", text: "text-orange-600", dot: "bg-orange-400" },
  { bg: "bg-violet-100", text: "text-violet-600", dot: "bg-violet-400" },
  { bg: "bg-rose-100", text: "text-rose-600", dot: "bg-rose-400" },
  { bg: "bg-teal-100", text: "text-teal-600", dot: "bg-teal-400" },
  { bg: "bg-amber-100", text: "text-amber-600", dot: "bg-amber-400" },
  { bg: "bg-indigo-100", text: "text-indigo-600", dot: "bg-indigo-400" },
  { bg: "bg-cyan-100", text: "text-cyan-600", dot: "bg-cyan-400" },
  { bg: "bg-pink-100", text: "text-pink-600", dot: "bg-pink-400" },
];

export function IndustryNode({
  industry,
  index,
  featured = false,
  active = false,
  floaty = false,
  style,
  onHoverStart,
  onHoverEnd,
  variants,
}: {
  industry: Industry;
  index: number;
  featured?: boolean;
  active?: boolean;
  floaty?: boolean;
  style?: React.CSSProperties;
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
  variants?: Variants;
}) {
  const tint = NODE_TINTS[index % NODE_TINTS.length];
  const reduceMotion = useReducedMotion();
  const shouldFloat = floaty && !reduceMotion;

  return (
    <motion.div
      variants={variants}
      style={style}
      animate={
        shouldFloat
          ? { y: [0, -6, 0], transition: { duration: 4 + (index % 4) * 0.4, repeat: Infinity, ease: "easeInOut" } }
          : undefined
      }
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
      // True stadium/pill shape: rounded-full on a wide-short box gives fully
      // rounded short ends (radius = height/2), not a rounded rectangle.
      className={cn(
        "group relative flex min-h-[128px] w-full items-center rounded-full border py-4 pr-6 pl-[4.5rem] transition-shadow duration-300",
        featured
          ? "border-gold-500/70 bg-navy-950 shadow-[0_25px_50px_-20px_rgba(196,154,74,0.35)]"
          : "border-black/[0.06] bg-[#fffdf9] shadow-[0_20px_45px_-22px_rgba(15,23,42,0.2)] hover:shadow-[0_24px_50px_-18px_rgba(15,23,42,0.28)]",
        // Only the Startups node ever shows gold — the "active" state on
        // every other node is a plain neutral lift, never a gold border.
        active && (featured ? "shadow-[0_0_0_3px_rgba(196,154,74,0.4)]" : "shadow-[0_10px_30px_-12px_rgba(15,23,42,0.35)]")
      )}
    >
      {/* Icon badge — half inside, half outside the capsule's left edge. */}
      <div
        className={cn(
          "absolute top-1/2 left-[-20px] flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border-[3px] shadow-md",
          featured
            ? "border-white bg-navy-900 text-gold-400 ring-2 ring-gold-500/50"
            : cn("border-white", tint.bg, tint.text)
        )}
      >
        <DynamicIcon iconName={industry.icon} className="h-6 w-6" />
      </div>

      <div className="min-w-0">
        <h3 className={cn("text-base font-semibold", featured ? "text-white" : "text-foreground")}>
          {industry.name}
        </h3>
        <p
          className={cn(
            "mt-1 text-[12.5px] leading-snug",
            featured ? "text-navy-200" : "text-muted-foreground"
          )}
        >
          {industry.description}
        </p>
        <Link
          href="/services"
          className={cn(
            "mt-1.5 inline-flex items-center gap-1 text-sm font-semibold transition-all",
            featured ? "text-gold-400 hover:gap-1.5 hover:text-gold-300" : "text-primary hover:gap-1.5"
          )}
        >
          Explore
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </motion.div>
  );
}
