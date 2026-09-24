import { getSiteSettings } from "@/lib/data/settings";
import { getNavigation } from "@/lib/data/navigation";
import { getPublishedServices } from "@/lib/data/services";
import { NavLocation } from "@prisma/client";
import { HeaderClient } from "@/components/site/HeaderClient";

export async function Header() {
  const [settings, navItems, ctaItems, services] = await Promise.all([
    getSiteSettings(),
    getNavigation(NavLocation.HEADER),
    getNavigation(NavLocation.HEADER_CTA),
    getPublishedServices(),
  ]);

  return (
    <HeaderClient
      firmName={settings.firmName}
      logoUrl={settings.logoUrl}
      navItems={navItems}
      ctaItem={ctaItems[0] ?? null}
      services={services.map((s) => ({ id: s.id, name: s.name, slug: s.slug }))}
    />
  );
}
