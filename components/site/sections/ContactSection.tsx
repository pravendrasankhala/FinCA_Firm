import { Mail, Phone, MapPin, Clock } from "lucide-react";
import type { ContactContent } from "@/lib/types/sections";
import { ContactForm } from "@/components/site/sections/ContactForm";
import { getSiteSettings } from "@/lib/data/settings";
import { getPublishedServices } from "@/lib/data/services";

export async function ContactSection({ content }: { content: ContactContent }) {
  const [settings, services] = await Promise.all([
    getSiteSettings(),
    getPublishedServices(),
  ]);

  return (
    <section id="contact" className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
      <div className="grid grid-cols-1 gap-14 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <h2 className="text-3xl font-semibold text-foreground sm:text-4xl">
            {content.heading}
          </h2>
          {content.description && (
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              {content.description}
            </p>
          )}

          <ul className="mt-8 space-y-4">
            {settings.address && (
              <li className="flex items-start gap-3 text-sm text-foreground">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-gold-600" />
                {settings.address}
              </li>
            )}
            {settings.phone && (
              <li className="flex items-center gap-3 text-sm text-foreground">
                <Phone className="h-5 w-5 shrink-0 text-gold-600" />
                <a href={`tel:${settings.phone}`}>{settings.phone}</a>
              </li>
            )}
            {settings.email && (
              <li className="flex items-center gap-3 text-sm text-foreground">
                <Mail className="h-5 w-5 shrink-0 text-gold-600" />
                <a href={`mailto:${settings.email}`}>{settings.email}</a>
              </li>
            )}
            {settings.businessHours && (
              <li className="flex items-center gap-3 text-sm text-foreground">
                <Clock className="h-5 w-5 shrink-0 text-gold-600" />
                {settings.businessHours}
              </li>
            )}
          </ul>
        </div>

        <div className="rounded-2xl border border-border bg-card p-7 lg:col-span-3">
          <ContactForm services={services.map((s) => ({ id: s.id, name: s.name }))} />
        </div>
      </div>
    </section>
  );
}
