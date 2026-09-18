import Image from "next/image";
import type { ClientLogo } from "@prisma/client";
import type { SectionIntroContent } from "@/lib/types/sections";
import { SectionIntro } from "@/components/site/SectionIntro";

export function LogoMarquee({
  content,
  logos,
}: {
  content: SectionIntroContent;
  logos: ClientLogo[];
}) {
  if (logos.length === 0) return null;

  const track = [...logos, ...logos];

  return (
    <section className="border-y border-border bg-secondary/30 py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionIntro {...content} />
      </div>

      <div className="mt-10 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="flex w-max animate-marquee gap-16">
          {track.map((logo, i) => {
            const item = (
              <div
                key={`${logo.id}-${i}`}
                className="flex h-12 w-32 shrink-0 items-center justify-center grayscale opacity-70 transition hover:grayscale-0 hover:opacity-100"
              >
                <Image
                  src={logo.logoUrl}
                  alt={logo.name}
                  width={128}
                  height={48}
                  className="max-h-12 w-auto object-contain"
                />
              </div>
            );
            return logo.website ? (
              <a key={`${logo.id}-${i}`} href={logo.website} target="_blank" rel="noopener noreferrer">
                {item}
              </a>
            ) : (
              item
            );
          })}
        </div>
      </div>
    </section>
  );
}
