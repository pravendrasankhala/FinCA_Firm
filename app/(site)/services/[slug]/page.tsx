import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { prisma } from "@/lib/db";
import { getServiceBySlug } from "@/lib/data/services";
import { getSiteSettings } from "@/lib/data/settings";
import { getProcessSteps } from "@/lib/data/lists";
import { DynamicIcon } from "@/components/DynamicIcon";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

function renderRichText(text: string) {
  const parts = text.split("**");
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>
  );
}

export async function generateMetadata(
  props: PageProps<"/services/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const service = await getServiceBySlug(slug);
  if (!service) return {};

  const settings = await getSiteSettings();
  return {
    title: service.seoTitle || `${service.name} | ${settings.firmName}`,
    description: service.seoDescription || service.shortDescription,
  };
}

export default async function ServiceDetailPage(props: PageProps<"/services/[slug]">) {
  const { slug } = await props.params;
  const service = await getServiceBySlug(slug);
  if (!service) notFound();

  const [processSteps, relatedServices] = await Promise.all([
    getProcessSteps(),
    prisma.service.findMany({
      where: { published: true, NOT: { id: service.id } },
      orderBy: { sortOrder: "asc" },
      take: 3,
    }),
  ]);

  return (
    <div>
      <section className="bg-[url('/business_setupbred2.jpg')]  bg-cover bg-center mt-20">
       <div className="bg-navy-950/80 py-16">
         <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-navy-800 text-gold-400">
            <DynamicIcon iconName={service.icon} className="h-6 w-6" />
          </div>
          <h1 className="mt-6 text-3xl font-semibold text-white sm:text-4xl">{service.name}</h1>
          <p className="mt-4 text-base text-navy-200">{service.shortDescription}</p>
        </div>
       </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-16">
          {service.imageUrl && (
            <div className="relative mx-auto aspect-[4/3] w-full max-w-lg lg:sticky lg:top-24">
              <div className="absolute -top-8 -right-6 h-full w-full rounded-[24px_120px_120px_24px] bg-gold-500/15" />
              <Image
                src={service.imageUrl}
                alt={service.name}
                fill
                sizes="(min-width: 1024px) 40vw, 90vw"
                className="relative rounded-[24px_120px_120px_100px] object-cover shadow-lg"
              />
            </div>
          )}

          <div>
            <div className="space-y-4 text-base leading-relaxed text-foreground">
              {service.longDescription.split("\n").filter(Boolean).map((paragraph, i) => (
                <p key={i}>{renderRichText(paragraph)}</p>
              ))}
            </div>

            {service.highlights.length > 0 && (
              <div className="mt-10 rounded-xl border border-border bg-secondary/40 p-6 sm:p-8">
                <h2 className="text-lg font-semibold text-foreground">
                  Why Choose Our {service.name} Services?
                </h2>
                <ul className="mt-5 grid grid-cols-1 gap-3">
                  {service.highlights.map((point, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold-500" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>

      {processSteps.length > 0 && (
        <section className="bg-secondary/40 py-16">
          <div className="mx-auto max-w-5xl px-6 lg:px-8">
            <h2 className="text-center text-2xl font-semibold text-foreground">How We Work</h2>
            <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-5">
              {processSteps.map((step) => (
                <div key={step.id}>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary text-sm font-semibold text-primary">
                    {step.number}
                  </div>
                  <h3 className="mt-3 text-sm font-semibold text-foreground">{step.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {service.faqs.length > 0 && (
        <section className="mx-auto max-w-3xl px-6 py-16 lg:px-8">
          <h2 className="text-2xl font-semibold text-foreground">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="mt-6">
            {service.faqs.map((faq, i) => (
              <AccordionItem key={faq.id} value={faq.id}>
                <AccordionTrigger>
                  {i + 1}. {faq.question}
                </AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      )}

      <section className="bg-navy-950 py-16">
        <div className="mx-auto max-w-3xl px-6 text-center lg:px-8">
          <h2 className="text-2xl font-semibold text-white">
            Have a question about {service.name}?
          </h2>
          <p className="mt-3 text-navy-200">
            Let&apos;s discuss your requirement and identify the right way forward.
          </p>
          <Button asChild size="lg" className="mt-7 h-12 px-7 text-base">
            <Link href="/contact">Book a Consultation</Link>
          </Button>
        </div>
      </section>

      {relatedServices.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
          <h2 className="text-2xl font-semibold text-foreground">Related Services</h2>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {relatedServices.map((related) => (
              <Link
                key={related.id}
                href={`/services/${related.slug}`}
                className="group rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-md"
              >
                <h3 className="text-sm font-semibold text-foreground">{related.name}</h3>
                <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
                  {related.shortDescription}
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                  Learn more
                  <ArrowRight className="h-3 w-3" />
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
