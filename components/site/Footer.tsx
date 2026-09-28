import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";
import { getSiteSettings } from "@/lib/data/settings";
import { getNavigation } from "@/lib/data/navigation";
import { getPublishedServices } from "@/lib/data/services";
import { NavLocation } from "@prisma/client";

type SocialLinks = {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  twitter?: string;
  youtube?: string;
};

export async function Footer() {
  const [settings, quickLinks, legalLinks, services] = await Promise.all([
    getSiteSettings(),
    getNavigation(NavLocation.FOOTER_QUICK_LINKS),
    getNavigation(NavLocation.FOOTER_LEGAL),
    getPublishedServices(6),
  ]);

  const social = (settings.socialLinks ?? {}) as SocialLinks;
  const hasValidLogo =
    !!settings.logoUrl && (settings.logoUrl.startsWith("/") || settings.logoUrl.startsWith("http"));
  const year = new Date().getFullYear();
  const copyright =
    settings.copyrightText || `© ${year} ${settings.firmName}. All rights reserved.`;

  return (
    <footer className="relative overflow-hidden border-t border-navy-800 bg-navy-950 text-navy-200 before:absolute before:inset-0 before:z-0 before:bg-[url('/footer_image.png')] before:bg-cover before:bg-no-repeat before:opacity-20 before:content-['']">
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            {hasValidLogo ? (
              <Image
                src={settings.logoUrl!}
                alt={settings.firmName}
                width={200}
                height={36}
                className="h-20 w-auto"
              />
            ) : (
              <h3 className="font-heading text-lg font-semibold text-white">
                {settings.firmName}
              </h3>
            )}
            <p className="mt-3 text-sm leading-relaxed text-navy-300">{settings.tagline}</p>
            <div className="mt-5 flex gap-3">
              {social.linkedin && <SocialIcon href={social.linkedin} label="in" />}
              {social.facebook && <SocialIcon href={social.facebook} label="f" />}
              {social.instagram && <SocialIcon href={social.instagram} label="ig" />}
              {social.twitter && <SocialIcon href={social.twitter} label="x" />}
              {social.youtube && <SocialIcon href={social.youtube} label="yt" />}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-navy-400">
              Quick Links
            </h4>
            <ul className="mt-4 space-y-2.5">
              {quickLinks.map((item) => (
                <li key={item.id}>
                  <Link href={item.url} className="text-sm text-navy-200 hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-navy-400">
              Services
            </h4>
            <ul className="mt-4 space-y-2.5">
              {services.map((service) => (
                <li key={service.id}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="text-sm text-navy-200 hover:text-white"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-navy-400">
              Contact
            </h4>
            <ul className="mt-4 space-y-3">
              {settings.address && (
                <li className="flex items-start gap-2 text-sm text-navy-200">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-500" />
                  {settings.address}
                </li>
              )}
              {settings.phone && (
                <li className="flex items-center gap-2 text-sm text-navy-200">
                  <Phone className="h-4 w-4 shrink-0 text-gold-500" />
                  <a href={`tel:${settings.phone}`} className="hover:text-white">
                    {settings.phone}
                  </a>
                </li>
              )}
              {settings.email && (
                <li className="flex items-center gap-2 text-sm text-navy-200">
                  <Mail className="h-4 w-4 shrink-0 text-gold-500" />
                  <a href={`mailto:${settings.email}`} className="hover:text-white">
                    {settings.email}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-navy-800 pt-8 sm:flex-row">
          <p className="text-xs text-navy-400">{copyright}</p>
          <ul className="flex gap-6">
            {legalLinks.map((item) => (
              <li key={item.id}>
                <Link href={item.url} className="text-xs text-navy-400 hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex h-9 w-9 items-center justify-center rounded-full border border-navy-800 text-xs font-semibold uppercase text-navy-300 transition-colors hover:border-gold-500 hover:text-gold-500"
    >
      {label}
    </a>
  );
}
