"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { HeroContent, HeroMedia } from "@/lib/types/sections";

export function Hero({ content, media }: { content: HeroContent; media: HeroMedia }) {
  const overlayOpacity = content.overlayOpacity ?? 0.55;
  const isCenter = content.alignment === "center";

  return (
    <section className="relative flex min-h-[92vh] items-center overflow-hidden bg-navy-950">
      {media.videoUrl ? (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster={media.posterUrl ?? undefined}
        >
          <source src={media.videoUrl} type="video/mp4" />
        </video>
      ) : media.posterUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={media.posterUrl}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-950 to-navy-800" />
      )}

      <div
        className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/70 to-navy-950/40"
        style={{ opacity: overlayOpacity + 0.25 }}
      />

      <div
        className={`relative mx-auto flex w-full max-w-7xl flex-col px-6 pt-24 pb-16 lg:px-8 ${
          isCenter ? "items-center text-center" : "items-start text-left"
        }`}
      >
        {content.eyebrow && (
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-xs font-semibold tracking-[0.2em] text-gold-400 uppercase"
          >
            {content.eyebrow}
          </motion.p>
        )}

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-5 max-w-3xl text-4xl leading-[1.1] font-semibold text-white sm:text-5xl lg:text-6xl"
        >
          {content.titleLine1}
          <br />
          {content.titleLine2}
        </motion.h1>

        {content.subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 max-w-xl text-base leading-relaxed text-navy-100 sm:text-lg"
          >
            {content.subtitle}
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          {content.primaryCtaText && (
            <Button asChild size="lg" className="h-12 px-7 text-base">
              <Link href={content.primaryCtaLink || "/contact"}>{content.primaryCtaText}</Link>
            </Button>
          )}
          {content.secondaryCtaText && (
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 border-white/30 bg-transparent px-7 text-base text-white hover:bg-white/10 hover:text-white"
            >
              <Link href={content.secondaryCtaLink || "/services"}>
                {content.secondaryCtaText}
              </Link>
            </Button>
          )}
        </motion.div>
      </div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60"
      >
        <ChevronDown className="h-6 w-6" />
      </motion.div>
    </section>
  );
}
