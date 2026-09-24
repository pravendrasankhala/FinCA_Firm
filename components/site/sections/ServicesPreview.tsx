import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Service } from "@prisma/client";
import type { SectionIntroContent } from "@/lib/types/sections";
import { SectionIntro } from "@/components/site/SectionIntro";
import { ServiceSplitCard } from "@/components/site/ServiceSplitCard";

export function ServicesPreview({
  content,
  services,
}: {
  content: SectionIntroContent;
  services: Service[];
}) {
  if (services.length === 0) return null;

  return (
    <section id="services" className="bg-secondary/40 py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionIntro {...content} />

        <div className="relative max-w-5xl mx-auto mt-14 flex flex-col gap-4 sm:mt-16 sm:gap-20 lg:mt-20 lg:gap-32">
          {services.map((service, index) => (
            <div
              key={service.id}
              className="sticky top-24"
              style={{ zIndex: index + 1 }}
            >
              <ServiceSplitCard service={service} />
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all"
          >
            View All Services
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
