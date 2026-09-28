import { Mail, Phone, MapPin, Clock } from "lucide-react";
import type { ContactContent } from "@/lib/types/sections";
import { ContactForm } from "@/components/site/sections/ContactForm";
import { getSiteSettings } from "@/lib/data/settings";
import { getPublishedServices } from "@/lib/data/services";

function InfoBlock({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof MapPin;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-start gap-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-secondary text-gold-600">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs font-semibold tracking-[0.15em] text-muted-foreground uppercase">
          {label}
        </p>
        <p className="mt-1 text-sm leading-relaxed font-medium text-foreground">{children}</p>
      </div>
    </li>
  );
}

export async function ContactSection({ content }: { content: ContactContent }) {
  const [settings, services] = await Promise.all([
    getSiteSettings(),
    getPublishedServices(),
  ]);

  const heading = content.heading?.trim();
  const words = heading?.split(" ") ?? [];
  const lastWord = words.length > 0 ? words[words.length - 1] : undefined;
  const headingStart = words.slice(0, -1).join(" ");

  return (
    <section id="contact" className="relative overflow-hidden py-24">
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-secondary/60 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-secondary/60 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <p className="flex items-center gap-3 text-xs font-semibold tracking-[0.2em] text-gold-600 uppercase">
              Contact Us
              <span className="h-px w-8 bg-gold-500" />
            </p>
            {heading && (
              <h2 className="mt-4 text-3xl font-semibold text-foreground sm:text-4xl">
                {headingStart && `${headingStart} `}
                <span className="text-gold-500">{lastWord}</span>
              </h2>
            )}
            {content.description && (
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                {content.description}
              </p>
            )}

            <ul className="mt-9 space-y-6">
              {settings.address && (
                <InfoBlock icon={MapPin} label="Our Office">
                  {settings.address}
                </InfoBlock>
              )}
              {settings.phone && (
                <InfoBlock icon={Phone} label="Phone">
                  <a href={`tel:${settings.phone}`} className="hover:text-gold-600">
                    {settings.phone}
                  </a>
                </InfoBlock>
              )}
              {settings.email && (
                <InfoBlock icon={Mail} label="Email">
                  <a href={`mailto:${settings.email}`} className="hover:text-gold-600">
                    {settings.email}
                  </a>
                </InfoBlock>
              )}
              {settings.businessHours && (
                <InfoBlock icon={Clock} label="Business Hours">
                  {settings.businessHours}
                </InfoBlock>
              )}
            </ul>

            <p className="font-heading mt-10 -rotate-2 text-xl text-gold-600 italic">
              We&apos;re here to help
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-7 shadow-sm lg:col-span-3">
            <ContactForm services={services.map((s) => ({ id: s.id, name: s.name }))} />
          </div>
        </div>
      </div>
    </section>
  );
}
