import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Industry } from "@prisma/client";
import type { SectionIntroContent } from "@/lib/types/sections";
import { IndustriesOrbitDesktop } from "@/components/site/industries/IndustriesOrbitDesktop";
import { IndustriesTimelineMobile } from "@/components/site/industries/IndustriesTimelineMobile";

export function IndustriesGrid({
  content,
  industries,
}: {
  content: SectionIntroContent;
  industries: Industry[];
}) {
  if (industries.length === 0) return null;

  const heading = content.heading?.trim();
  const words = heading?.split(" ") ?? [];
  const lastWord = words.length > 0 ? words[words.length - 1] : undefined;
  const headingStart = words.slice(0, -1).join(" ");

  return (
    <section id="industries" className="relative overflow-hidden bg-secondary/40 py-24">
      <div className="mx-auto px-6 lg:px-16 xl:px-20">
        <div className="grid grid-cols-1 items-start gap-32 lg:grid-cols-[3fr_2fr] mx-auto max-w-[1200px]">
          <div>
            {content.label && (
              <p className="flex items-center gap-3 text-xs font-semibold tracking-[0.2em] text-gold-600 uppercase">
                <span className="h-px w-8 bg-gold-500" />
                {content.label}
              </p>
            )}
            {heading && (
              <h2 className="mt-4 font-heading text-5xl leading-[1.05] font-semibold text-foreground sm:text-2xl lg:text-[44px] ">
                {headingStart && `${headingStart} `}
                <span className="text-gold-500 italic">{lastWord}</span>
              </h2>
            )}
            {content.subtitle && (
              <p className="mt-5 max-w-md text-base text-[14px] leading-relaxed text-muted-foreground">
                {content.subtitle}
              </p>
            )}
          </div>

          <div className="border-gold-500 pl-6 lg:mt-3 lg:justify-self-end lg:border-l-[3px]">
            <p className="max-w-sm text-[15px] leading-relaxed text-muted-foreground ">
              From startups to established enterprises, we provide tailored financial, compliance
              and strategic support — helping you grow with confidence.
            </p>
            <Link
              href="/services"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-foreground underline decoration-gold-500 decoration-2 underline-offset-4 hover:gap-2"
            >
              Explore All Services
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        <div className="mx-auto max-w-[1200px] px-6 lg:px-16 xl:px-20 mt-[-50px]">
          <IndustriesOrbitDesktop industries={industries} />
          <IndustriesTimelineMobile industries={industries} />
        </div>

        <div className="mt-14 hidden items-center justify-between lg:flex">
          <p className="text-sm font-semibold tracking-[0.2em] text-muted-foreground uppercase">
            Trust <span className="mx-2 text-border">/</span> Expertise
            <span className="mx-2 text-border">/</span> Growth
          </p>
          <p className="font-heading text-2xl text-muted-foreground/70 italic">
            Your Growth, Our Priority
          </p>
        </div>
      </div>

      <div className="pointer-events-none absolute top-1/2 right-6 hidden -translate-y-1/2 flex-col items-center gap-3 lg:flex">
        <span className="h-16 w-px bg-border" />
        <span className="h-1.5 w-1.5 rounded-full bg-gold-500" />
        <span className="h-1.5 w-1.5 rounded-full bg-border" />
        <span className="h-1.5 w-1.5 rounded-full bg-border" />
      </div>
    </section>
  );
}
