import { CheckCircle2 } from "lucide-react";
import type { WhyChooseUsFeature } from "@prisma/client";
import type { SectionIntroContent } from "@/lib/types/sections";
import { SectionIntro } from "@/components/site/SectionIntro";

export function WhyChooseUs({
  content,
  features,
}: {
  content: SectionIntroContent;
  features: WhyChooseUsFeature[];
}) {
  if (features.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-navy-950 py-24 before:absolute before:inset-0 before:z-0 before:bg-[url('/problems.png')] before:bg-cover before:bg-center before:bg-no-repeat before:opacity-8 before:content-['']">
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <SectionIntro {...content} light />

        <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.id} className="flex gap-4 rounded-xl border border-navy-800 bg-navy-900/60 p-6">
              <CheckCircle2 className="h-6 w-6 shrink-0 text-gold-500" />
              <div>
                <h3 className="text-base font-semibold text-white">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-navy-300">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
