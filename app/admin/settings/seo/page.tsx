import { getSiteSettings } from "@/lib/data/settings";
import { SeoSettingsForm } from "@/components/admin/settings/SeoSettingsForm";

export const dynamic = "force-dynamic";

export default async function SeoSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">SEO</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Default metadata used when a page doesn&apos;t set its own SEO fields.
        </p>
      </div>
      <SeoSettingsForm
        defaultValues={{
          metaTitle: settings.metaTitle ?? "",
          metaDescription: settings.metaDescription ?? "",
          ogImageUrl: settings.ogImageUrl ?? "",
        }}
      />
    </div>
  );
}
