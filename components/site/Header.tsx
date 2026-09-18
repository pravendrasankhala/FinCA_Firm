import { getSiteSettings } from "@/lib/data/settings";
import { getNavigation } from "@/lib/data/navigation";
import { NavLocation } from "@prisma/client";
import { HeaderClient } from "@/components/site/HeaderClient";

export async function Header() {
  const [settings, navItems, ctaItems] = await Promise.all([
    getSiteSettings(),
    getNavigation(NavLocation.HEADER),
    getNavigation(NavLocation.HEADER_CTA),
  ]);

  return (
    <HeaderClient
      firmName={settings.firmName}
      logoUrl={settings.logoUrl}
      navItems={navItems}
      ctaItem={ctaItems[0] ?? null}
    />
  );
}
