import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { AboutContent, AboutMedia } from "@/lib/types/sections";

export function About({ content, media }: { content: AboutContent; media: AboutMedia }) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
      <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
        <div>
          {content.label && (
            <p className="text-xs font-semibold tracking-[0.2em] text-gold-600 uppercase">
              {content.label}
            </p>
          )}
          <h2 className="mt-4 text-3xl font-semibold text-foreground sm:text-4xl">
            {content.headingLine1}
            <br />
            {content.headingLine2}
          </h2>
          {content.description && (
            <p className="mt-6 text-base leading-relaxed text-muted-foreground">
              {content.description}
            </p>
          )}
          {content.buttonText && (
            <Link
              href={content.buttonUrl || "/about"}
              className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all"
            >
              {content.buttonText}
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>

        <div className="relative aspect-4/5 overflow-hidden rounded-2xl bg-navy-100">
          {media.imageUrl ? (
            <Image
              src={media.imageUrl}
              alt={content.headingLine1 || "About"}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-navy-100 to-navy-200 text-navy-400">
              Image
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
