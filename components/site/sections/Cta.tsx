import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CtaContent } from "@/lib/types/sections";

export function Cta({ content }: { content: CtaContent }) {
  const whatsappHref = content.whatsappNumber
    ? `https://wa.me/${content.whatsappNumber.replace(/[^0-9]/g, "")}`
    : null;

  const words = (content.heading ?? "").split(" ");
  const breakIndex = words.findIndex((w) => w.toLowerCase().startsWith("compliance"));
  const beforeBreak = breakIndex > 0 ? words.slice(0, breakIndex).join(" ") : null;
  const highlightWord = breakIndex >= 0 ? words[breakIndex] : null;
  const afterBreak = breakIndex >= 0 ? words.slice(breakIndex + 1).join(" ") : null;

  return (
    <section className="relative min-h-[420px] bg-navy-950 bg-[url('/cta-visual.png')] bg-contain bg-right bg-no-repeat py-20 lg:min-h-[540px] lg:py-28">
      <div className="absolute inset-0 bg-gradient-to-r from-navy-950 from-10% via-navy-950/75 via-45% to-transparent to-75%" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-xl">
          <p className="flex items-center gap-3 text-xs font-semibold tracking-[0.25em] text-gold-500 uppercase">
            Let&apos;s Talk
            <span className="h-px w-8 bg-gold-500" />
          </p>
          <h2 className="mt-4 font-heading text-3xl leading-tight font-semibold text-white sm:text-4xl lg:text-5xl">
            {highlightWord ? (
              <>
                {beforeBreak}
                <br />
                <span className="text-gold-500">{highlightWord}</span>
                {afterBreak && ` ${afterBreak}`}
              </>
            ) : (
              content.heading
            )}
          </h2>
          {content.description && (
            <p className="mt-4 max-w-md text-base leading-relaxed text-navy-200">
              {content.description}
            </p>
          )}
          <div className="mt-9 flex flex-wrap items-center gap-4">
            {content.primaryCtaText && (
              <Button asChild size="lg" className="h-12 px-7 text-base">
                <Link href={content.primaryCtaLink || "/contact"}>
                  {content.primaryCtaText}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            )}
            {content.secondaryCtaText && (
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 border-gold-500/50 bg-transparent px-7 text-base text-white hover:bg-white/10 hover:text-white"
              >
                <Link href={content.secondaryCtaLink || "/contact"}>
                  {content.secondaryCtaText}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            )}
            {whatsappHref && (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center gap-2 rounded-lg border border-white/30 px-7 text-base font-medium text-white hover:bg-white/10"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
