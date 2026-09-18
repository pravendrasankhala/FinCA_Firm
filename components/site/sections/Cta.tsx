import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CtaContent } from "@/lib/types/sections";

export function Cta({ content }: { content: CtaContent }) {
  const whatsappHref = content.whatsappNumber
    ? `https://wa.me/${content.whatsappNumber.replace(/[^0-9]/g, "")}`
    : null;

  return (
    <section className="bg-navy-950 py-20">
      <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
        <h2 className="text-3xl font-semibold text-white sm:text-4xl">{content.heading}</h2>
        {content.description && (
          <p className="mt-4 text-base leading-relaxed text-navy-200">{content.description}</p>
        )}
        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
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
              <Link href={content.secondaryCtaLink || "/contact"}>{content.secondaryCtaText}</Link>
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
    </section>
  );
}
