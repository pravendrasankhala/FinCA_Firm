import { getSiteSettings } from "@/lib/data/settings";
import { GeneralSettingsForm } from "@/components/admin/settings/GeneralSettingsForm";

export const dynamic = "force-dynamic";

export default async function SiteSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Site Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Firm identity and contact details used throughout the website.
        </p>
      </div>
      <GeneralSettingsForm
        defaultValues={{
          firmName: settings.firmName,
          tagline: settings.tagline,
          logoUrl: settings.logoUrl ?? "",
          faviconUrl: settings.faviconUrl ?? "",
          phone: settings.phone ?? "",
          email: settings.email ?? "",
          address: settings.address ?? "",
          whatsapp: settings.whatsapp ?? "",
          businessHours: settings.businessHours ?? "",
          copyrightText: settings.copyrightText ?? "",
          googleMapsEmbed: settings.googleMapsEmbed ?? "",
        }}
      />
    </div>
  );
}
