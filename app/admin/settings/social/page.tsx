import { getSiteSettings } from "@/lib/data/settings";
import { SocialLinksForm } from "@/components/admin/settings/SocialLinksForm";

export const dynamic = "force-dynamic";

type SocialLinks = {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  twitter?: string;
  youtube?: string;
};

export default async function SocialLinksPage() {
  const settings = await getSiteSettings();
  const social = (settings.socialLinks ?? {}) as SocialLinks;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Social Links</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Shown in the footer. Leave a field blank to hide that icon.
        </p>
      </div>
      <SocialLinksForm
        defaultValues={{
          facebook: social.facebook ?? "",
          instagram: social.instagram ?? "",
          linkedin: social.linkedin ?? "",
          twitter: social.twitter ?? "",
          youtube: social.youtube ?? "",
        }}
      />
    </div>
  );
}
