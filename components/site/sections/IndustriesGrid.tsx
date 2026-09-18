import type { Industry } from "@prisma/client";
import type { SectionIntroContent } from "@/lib/types/sections";
import { SectionIntro } from "@/components/site/SectionIntro";
import { DynamicIcon } from "@/components/DynamicIcon";

export function IndustriesGrid({
  content,
  industries,
}: {
  content: SectionIntroContent;
  industries: Industry[];
}) {
  if (industries.length === 0) return null;

  return (
    <section id="industries" className="bg-secondary/40 py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionIntro {...content} />

        <div className="mt-14 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
          {industries.map((industry) => {
            return (
              <div
                key={industry.id}
                className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-6 text-center transition-shadow hover:shadow-md"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-navy-950 text-gold-400">
                  <DynamicIcon iconName={industry.icon} className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium text-foreground">{industry.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
