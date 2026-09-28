"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";

export function IndustriesCenter({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className={`relative hidden shrink-0 overflow-hidden rounded-full border-8 border-background shadow-xl sm:block sm:h-64 sm:w-64 md:h-72 md:w-72 lg:h-80 lg:w-80 ${className ?? ""}`}
    >
      <motion.div
        className="absolute inset-0"
        animate={reduceMotion ? undefined : { scale: [1, 1.08, 1] }}
        transition={
          reduceMotion ? undefined : { duration: 18, repeat: Infinity, ease: "easeInOut" }
        }
      >
        <Image src="/business_setupbred2.jpg" alt="" fill className="object-cover" />
        <div className="absolute inset-0 bg-navy-950/75" />
      </motion.div>

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-white">
        <motion.div
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/40"
          animate={
            reduceMotion ? undefined : { scale: [1, 1.08, 1], opacity: [0.9, 1, 0.9] }
          }
          transition={
            reduceMotion ? undefined : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
          }
        >
          <Play className="ml-0.5 h-4 w-4 fill-white text-white" />
        </motion.div>
        <p className="mt-4 text-base font-semibold sm:text-lg lg:text-xl">Industries We Serve</p>
        <p className="mt-2 text-[10px] font-semibold tracking-[0.25em] text-gold-400 uppercase">
          Your Success · Our Focus
        </p>
        <ArrowRight className="mt-3 h-4 w-4 text-gold-400" />
      </div>
    </motion.div>
  );
}
